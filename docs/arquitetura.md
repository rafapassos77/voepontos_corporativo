# Arquitetura — VoePontos Corporativo

Backend em **Supabase** (PostgreSQL + Auth + Edge Functions), provisionado via Lovable Cloud.
Todo acesso a dados é protegido por **Row Level Security (RLS)**.

## Modelo de dados

### Enums

- `app_role`: `admin_plataforma`, `admin_empresa`, `aprovador`, `solicitante`
- `request_status`: `pendente_aprovacao`, `aprovada`, `aguardando_emissao`, `emitida`, `rejeitada`, `cancelada`
- `mileage_program`: `azul`, `smiles`, `latam`

### Tabelas

- **companies** — empresas clientes: `id`, `nome`, `cnpj`, `ativa`, `created_at`.
- **profiles** — `id` (→ `auth.users`), `company_id`, `nome_completo`, `email`, `telefone`, `ativo`,
  `created_at`. **Sem coluna de papel** (papel fica em `user_roles`).
- **user_roles** — `id`, `user_id` (→ `auth.users`), `role` (`app_role`), `company_id`
  (nulo para `admin_plataforma`), `unique(user_id, role)`. Tabela **separada** de papéis.
- **cost_centers** — centros de custo: `id`, `company_id`, `nome`, `codigo`, `ativo`, `created_at`.
- **mileage_rates** — valor do milheiro (global): `id`, `programa` (`mileage_program`, único),
  `valor_milheiro` (numeric — valor de 1.000 milhas em R$), `updated_at`, `updated_by`.
- **travel_policies** — políticas de viagem (por empresa): `id`, `company_id`, `nome`, `descricao`,
  `limite_valor_viagem` (numeric, null = sem teto), `classes_permitidas` (text[]),
  `antecedencia_minima_dias`, `exige_aprovacao` (`'sempre'` | `'somente_fora_politica'`),
  `permite_emissao_tarifado` (bool), `prestacao_contas`, `canal_suporte`, `ativa`, `created_at`.
- **profiles.policy_id** — vincula o funcionário a uma `travel_policies` (null = sem política).
- **travel_requests** — solicitações de viagem:
  `id`, `company_id`, `solicitante_id`, `status`, `cost_center_id`, `motivo_viagem`, `observacoes`,
  `passageiro` (jsonb), `voo_snapshot` (jsonb), `total_milhas`, `total_brl`,
  `valor_milheiro_aplicado`, `aprovador_id`, `aprovado_em`, `motivo_rejeicao`, `codigo_localizador`,
  `emitido_em`, `emitido_por`, `created_at`, `updated_at`,
  `tipo_emissao` (`'milhas'` | `'tarifado'`), `economia_estimada` (numeric),
  `dentro_politica` (bool), `violacoes_politica` (jsonb), `justificativa_fora_politica`,
  `politica_snapshot` (jsonb).

> **Snapshot:** ao selecionar um voo, grava-se um `voo_snapshot` (jsonb) completo + `passageiro` +
> `total_milhas` + `total_brl` + `valor_milheiro_aplicado`. Como os resultados de busca expiram, o
> preço fica **auditável** (milhas usadas, milheiro aplicado, taxa de embarque) independentemente da
> API.

## Funções `security definer`

Evitam recursão em políticas RLS. Todas com `search_path = public`.

- `has_role(_user_id uuid, _role app_role) → boolean` — consulta `user_roles`.
- `get_user_company(_user_id uuid) → uuid` — retorna o `company_id` do perfil (isolamento por empresa).
- `handle_new_user()` — trigger em `auth.users`: cria o `profiles` a partir do metadata
  (`nome_completo`, `company_id`).
- `apply_travel_policy()` — trigger `BEFORE INSERT` em `travel_requests`: recomputa server-side o
  enquadramento na política do solicitante (`profiles.policy_id`), monta `violacoes_politica`, grava
  `politica_snapshot`, define `dentro_politica`, exige `justificativa_fora_politica` quando fora da
  política (senão `RAISE EXCEPTION`) e aplica **auto-aprovação** (`status = 'aguardando_emissao'`)
  quando dentro da política e `exige_aprovacao = 'somente_fora_politica'`.

## RLS (resumo por tabela)

- **companies**: `admin_plataforma` → tudo; demais → SELECT apenas da própria empresa.
- **profiles**: usuário vê/edita o próprio; `admin_empresa` gerencia os da empresa; `admin_plataforma` → tudo.
- **user_roles**: usuário SELECT o próprio; `admin_empresa` gerencia papéis (exceto `admin_plataforma`)
  da empresa; `admin_plataforma` → tudo.
- **cost_centers**: membros da empresa → SELECT; `admin_empresa`/`admin_plataforma` → escrita na própria empresa.
- **mileage_rates**: qualquer autenticado → SELECT; **somente** `admin_plataforma` → escrita.
- **travel_policies**: membros da empresa → SELECT; `admin_empresa`/`admin_plataforma` → escrita na
  própria empresa.
- **travel_requests**: `solicitante` → suas próprias (SELECT/INSERT/UPDATE enquanto pendente);
  `aprovador`/`admin_empresa` → SELECT + UPDATE das da empresa; `admin_plataforma` → SELECT de todas +
  UPDATE (emissão). Não há DELETE (usa-se status `cancelada`).

### Verificações realizadas

- Solicitante enxerga apenas as próprias solicitações; aprovador enxerga as da empresa; usuário sem
  vínculo e o papel `anon` não enxergam nada.
- Solicitante **não** consegue alterar `mileage_rates` (bloqueado por RLS).
- Precificação gravada bate exatamente com `(milhas/1000 × milheiro) + taxa` nos três programas.
- Enforcement de política testado ponta a ponta: dentro da política (sem violações), acima do
  orçamento **bloqueado** sem justificativa (`RAISE EXCEPTION`), acima do orçamento **sinalizado**
  (`dentro_politica=false` + violação) com justificativa, e **auto-aprovação** para política
  `somente_fora_politica`.
- API IN8 (produção) validada retornando **milhas e tarifado** com as credenciais: rota GRU→GIG,
  LATAM 32 voos e Gol/Smiles 5 voos com as duas modalidades e economia calculada (ex.: LATAM
  economia ~13%).

## Edge Functions

- **`busca-voos`** — autenticada (valida JWT). Faz fan-out por programa para a API IN8
  (`http://apiv2.buscamilhas.com`) buscando **milhas e tarifado** (`SomenteMilhas:false`,
  `SomentePagante:false`), calcula o preço das milhas em R$ lendo `mileage_rates`, deriva a economia
  milhas × tarifado e normaliza o retorno (cada voo com `emissao_milhas`/`emissao_tarifado`,
  `economia_brl`, `economia_pct`, `melhor_tipo`; `{ sucesso, origem_dados, alertas, resultados: { ida,
  volta } }`). Fallback de demonstração via secret `BUSCAMILHAS_MOCK`. Ver
  [`api-busca-milhas-in8.md`](api-busca-milhas-in8.md).
- **`admin-criar-usuario`** — cria usuários no Supabase Auth com `service_role`, após validar que o
  chamador é `admin_empresa` (restrito à própria empresa, sem criar `admin_plataforma`) ou
  `admin_plataforma`. Insere `profiles` + `user_roles`.
- **`seed-demo`** — popula dados de demonstração (empresa ACME, centros de custo, usuários demo e os
  três milheiros) de forma idempotente.

## Secrets de backend

| Secret | Uso |
|--------|-----|
| `BUSCAMILHAS_CHAVE` | Credencial da API IN8 |
| `BUSCAMILHAS_SENHA` | Credencial da API IN8 |
| `BUSCAMILHAS_MOCK` | `"true"` = dados de demonstração; `"false"` = API real |

Nenhum desses valores é exposto ao frontend.
