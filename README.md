# VoePontos Corporativo

Plataforma **SaaS B2B multi-empresa de gestão de viagens corporativas** (estilo OnFly/Voll),
cujo diferencial é que as passagens aéreas são **emitidas com milhas** (via API Busca Milhas / IN8),
enquanto o usuário final sempre enxerga os **preços em Reais (R$)**. As milhas aparecem apenas no
detalhamento do voo.

> **Fonte de verdade do código:** este produto é construído inteiramente no **Lovable**
> (full-stack TypeScript + Supabase). Este repositório contém a documentação de arquitetura,
> o contrato da API de milhas e o modelo de dados. O código de aplicação vive no projeto Lovable
> e pode ser sincronizado para este repositório via a integração GitHub do Lovable.

- **Editor Lovable:** https://lovable.dev/projects/11781654-3c8b-45a9-8c62-4f8ec8d354d7
- **Preview:** https://id-preview--11781654-3c8b-45a9-8c62-4f8ec8d354d7.lovable.app

## Visão geral

Empresas comuns compram passagens para seus funcionários com **1 nível de aprovação**, informando
**motivo da viagem** e **centro de custo**. Diferentemente de Voll/OnFly (que emitem passagens
convencionais), o foco aqui é a **emissão com milhas** — o que é transparente para o usuário: ele vê
o valor em Reais, e só ao expandir o voo enxerga com quantas milhas aquela passagem foi/será emitida.

### Papéis (multi-tenant)

| Papel | Responsabilidade |
|-------|------------------|
| `admin_plataforma` (equipe VoePontos) | Gerencia empresas clientes, valores do milheiro e a fila de emissão |
| `admin_empresa` | Gerencia usuários e centros de custo da própria empresa |
| `aprovador` | Aprova/rejeita solicitações de viagem da própria empresa |
| `solicitante` (funcionário) | Busca voos e cria solicitações de viagem |

### Fluxo de uma solicitação

```
pendente_aprovacao ──(aprovar)──► aguardando_emissao ──(registrar localizador)──► emitida
        │
        └──(rejeitar, com justificativa)──► rejeitada
        └──(cancelar pelo solicitante)────► cancelada
```

A **emissão do bilhete é manual** pela equipe VoePontos (a API da IN8 faz apenas a **busca**, não a
emissão). A página `/operacoes` é a fila onde a equipe registra o código localizador (PNR) e marca
a solicitação como emitida.

## Precificação (regra central do negócio)

Para emissão **com milhas**, o preço em Reais é calculado **no backend** (edge function), nunca no
cliente:

```
preço_R$ = (total_de_milhas / 1000) × valor_do_milheiro_do_programa + taxa_de_embarque
```

Não há markup adicional — a margem já está embutida no valor do milheiro configurável pelo
`admin_plataforma`. Valores iniciais por 1.000 milhas:

| Programa | Companhia | Valor do milheiro (padrão) |
|----------|-----------|----------------------------|
| `azul`   | Azul      | R$ 18,50 |
| `smiles` | Gol       | R$ 19,00 |
| `latam`  | Latam     | R$ 29,00 |

O milheiro é configurável **por sub-tipo de milha** (família de tarifa), não só por programa —
porque famílias como *clube smiles* e *diamante* (Smiles) valem menos no mercado que a milha avulsa.
O valor por programa é o **padrão** (fallback); o `admin_plataforma` pode cadastrar overrides por
sub-tipo (ex.: `clube smiles` R$ 16,50, `diamante` R$ 14,00). A busca casa o `TipoMilhas` retornado
pela IN8 com o override (match exato, depois por palavra-chave, escolhendo o menor valor que casar) e,
na falta, usa o padrão do programa. As famílias realmente retornadas pela API são registradas em
`observed_mileage_types` para o admin precificá-las.

Para emissão **tarifada** (dinheiro), o preço vem pronto da API (já inclui tarifa + taxas).

## Comparação Milhas × Tarifado × Todos

A busca consulta a IN8 pelas duas modalidades na mesma requisição (`SomenteMilhas:false`,
`SomentePagante:false`). Cada voo carrega `emissao_milhas` e/ou `emissao_tarifado`, e o backend
calcula a **economia** de emitir com milhas (`economia = preço_tarifado − preço_milhas`). Na página
de busca o usuário alterna entre **Milhas | Tarifado | Todos** (no modo Todos as duas formas aparecem
lado a lado, com destaque verde na mais vantajosa) — a mesma experiência do White Label Buscador 2.0.
A modalidade escolhida (`tipo_emissao`) e a economia estimada ficam gravadas na solicitação para
auditoria e para o painel de gestão.

## Políticas de Viagem

Cada empresa define **políticas de viagem** (limite de orçamento por bilhete, classes permitidas,
antecedência mínima, se permite emissão tarifada, prestação de contas, canal de suporte) e as vincula
aos funcionários. O enquadramento é avaliado **no banco** por um trigger `security definer` no momento
da solicitação: monta a lista de violações, marca `dentro_politica`, exige justificativa quando fora
da política e pode **auto-aprovar** solicitações dentro da política (quando a política usa
`exige_aprovacao = 'somente_fora_politica'`). O cliente é apenas informativo — a regra é aplicada no
servidor.

## Gestão de Viagens Corporativas

A rota `/gestao` (gestor da empresa / plataforma) reúne KPIs (gasto total, economia gerada com milhas,
nº de viagens, ticket médio, pendentes, % emitidas com milhas), gráficos (gasto por mês, por centro de
custo, por companhia, por status, milhas × tarifado), próximas viagens, últimas solicitações e
exportação CSV — com filtros por período, centro de custo e (na plataforma) empresa.

## Mobile / PWA

O app é responsivo mobile-first e **instalável como PWA** ("Adicionar à tela inicial", modo
`standalone`, tema azul-marinho). No celular a navegação usa um header com menu (drawer) e uma barra
de abas inferior contextual ao papel; a busca traz filtros em bottom sheet e o comparativo
Milhas/Tarifado/Todos empilhado; as telas de back-office (viagens, aprovações, operações, gestão)
renderizam listas de cards no lugar de tabelas largas. O desktop mantém a sidebar e as tabelas.

## Arquitetura

- **Frontend:** TypeScript + Tailwind + shadcn/ui (Lovable). Todo em pt-BR, moeda em formato `R$ 1.304,55`.
- **Backend:** Supabase (PostgreSQL + Auth + Edge Functions).
- **Autenticação:** Supabase Auth (e-mail/senha). Sistema **fechado** — sem cadastro público;
  usuários são criados por administradores.
- **Segurança:** RLS em todas as tabelas; papéis em tabela separada (`user_roles`) com função
  `security definer` `has_role()`; isolamento por empresa via `get_user_company()`.

Documentação detalhada:

- [`docs/arquitetura.md`](docs/arquitetura.md) — modelo de dados, RLS e edge functions
- [`docs/api-busca-milhas-in8.md`](docs/api-busca-milhas-in8.md) — contrato da API de busca de voos

## Páginas

| Rota | Descrição | Papéis |
|------|-----------|--------|
| `/login` | Acesso (sistema fechado) | todos |
| `/buscar` | Busca de voos + comparação Milhas/Tarifado/Todos (preço em R$; milhas no detalhe) | solicitante+ |
| `/minhas-viagens` | Acompanhamento das próprias solicitações | solicitante+ |
| `/aprovacoes` | Aprovar/rejeitar solicitações da empresa (destaque para fora da política) | aprovador, admin_empresa |
| `/operacoes` | Fila de emissão manual (registrar localizador) | admin_plataforma |
| `/gestao` | Painel de gestão: KPIs, gráficos, próximas viagens, export CSV | admin_empresa, admin_plataforma |
| `/admin` | Empresas, Usuários, Centros de Custo, Políticas de Viagem, Valor do Milheiro | admin_empresa, admin_plataforma |

## Contas demo

Senha padrão: `VoePontos@2026`

| E-mail | Papel |
|--------|-------|
| `ops@voepontos.com` | admin_plataforma |
| `admin@acme.com` | admin_empresa (ACME Viagens Ltda) |
| `aprovador@acme.com` | aprovador |
| `solicitante@acme.com` | solicitante |
