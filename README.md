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

O preço em Reais é calculado **no backend** (edge function), nunca no cliente:

```
preço_R$ = (total_de_milhas / 1000) × valor_do_milheiro_do_programa + taxa_de_embarque
```

Não há markup adicional — a margem já está embutida no valor do milheiro configurável pelo
`admin_plataforma`. Valores iniciais por 1.000 milhas:

| Programa | Companhia | Valor do milheiro |
|----------|-----------|-------------------|
| `azul`   | Azul      | R$ 18,50 |
| `smiles` | Gol       | R$ 19,00 |
| `latam`  | Latam     | R$ 29,00 |

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
| `/buscar` | Busca de voos + resultados (preço em R$; milhas no detalhe) | solicitante+ |
| `/minhas-viagens` | Acompanhamento das próprias solicitações | solicitante+ |
| `/aprovacoes` | Aprovar/rejeitar solicitações da empresa | aprovador, admin_empresa |
| `/operacoes` | Fila de emissão manual (registrar localizador) | admin_plataforma |
| `/admin` | Empresas, Usuários, Centros de Custo, Valor do Milheiro | admin_empresa, admin_plataforma |

## Contas demo

Senha padrão: `VoePontos@2026`

| E-mail | Papel |
|--------|-------|
| `ops@voepontos.com` | admin_plataforma |
| `admin@acme.com` | admin_empresa (ACME Viagens Ltda) |
| `aprovador@acme.com` | aprovador |
| `solicitante@acme.com` | solicitante |
