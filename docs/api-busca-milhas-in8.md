# API Busca Milhas (IN8) — contrato de busca de voos

Fonte de busca de voos com milhas. **Somente busca** — não há endpoint de emissão (a emissão é
manual pela equipe VoePontos).

- **Endpoint:** `POST http://apiv2.buscamilhas.com`
- **Autenticação:** campos `Chave` e `Senha` no corpo da requisição.
  Armazenados como **secrets de backend** (`BUSCAMILHAS_CHAVE`, `BUSCAMILHAS_SENHA`) —
  **nunca** expostos no frontend.
- **Restrição importante:** a API aceita **apenas uma companhia por requisição**. O backend faz
  **fan-out em paralelo** (uma requisição por programa: AZUL, GOL, LATAM) e agrega os resultados.

## Requisição (POST)

```json
{
  "Companhias": ["GOL"],
  "TipoViagem": 0,
  "Trechos": [
    { "Origem": "LIS", "Destino": "MAD", "DataIda": "09/05/2023", "DataVolta": "10/06/2023" }
  ],
  "Classe": "economica",
  "Adultos": 1,
  "Criancas": 0,
  "Bebes": 0,
  "Chave": "<secret>",
  "Senha": "<secret>",
  "SomenteMilhas": true,
  "SomentePagante": false
}
```

### Parâmetros

- **Companhias**: lista com **apenas uma** companhia por requisição. Mapeamento programa → companhia:
  `azul → "AZUL"`, `smiles → "GOL"`, `latam → "LATAM"`.
- **TipoViagem**: `0` = somente ida, `1` = ida e volta.
- **Trechos**: array com **apenas 1 posição**.
  - `Origem` / `Destino`: código IATA.
  - `DataIda` / `DataVolta`: formato `DD/MM/AAAA`. `DataVolta` obrigatório só quando `TipoViagem = 1`.
- **Classe**: `economica` ou `executiva`.
- **Adultos / Criancas / Bebes**: quantidades.
- **SomenteMilhas**: `true` para busca apenas em milhas (usado por esta plataforma).
- **SomentePagante**: `true` para busca apenas em valores pagos. Para receber ambos, deixe os dois
  `false`.

## Resposta

Contém três chaves principais além do `Token`:

```json
{
  "Token": "BUSCA_248_...:SAO:LIS_19/09/2025:...",
  "Busca":  { "...": "eco do payload enviado" },
  "Status": { "Erro": false, "Sucesso": true, "Alerta": [] },
  "Trechos": { "...": "resultados por trecho" }
}
```

### Status

- **Erro**: `true` em caso de falha.
- **Sucesso**: `true` quando a busca é concluída.
- **Alerta**: array de mensagens de erro/alerta, quando houver.

### Trechos

O nome de cada trecho é a junção dos códigos IATA de origem + destino (ex.: `CNFGRU`, `SAOLIS`).

```json
"Trechos": {
  "SAOLIS": {
    "Origem": "SAO",
    "Destino": "LIS",
    "Data": "19/09/2025",
    "Internacional": 1,
    "Voos": [ /* ver abaixo */ ],
    "Semana": {}
  }
}
```

- **Internacional**: `0` = nacional, `1` = internacional.
- **Semana**: uso interno da API.

### Estrutura dos Voos

Cada objeto em `Voos` possui:

- **Companhia**, **NumeroVoo**, **Sentido** (`ida`/`volta`), **Origem**, **Destino**
- **Embarque** / **Desembarque** (data/hora `DD/MM/AAAA HH:mm`)
- **Duracao** (`HH:mm`), **NumeroConexoes**, **Conexoes** (array, quando houver)
- **Milhas** / **Valor** (dependendo do tipo de pesquisa) — arrays de opções de tarifa, cada opção com:
  - **Adulto / Crianca / Bebe**: valores unitários por passageiro (em milhas, na busca por milhas)
  - **TotalAdulto / TotalCrianca / TotalBebe**: valor final incluindo tarifa + taxa
  - **TipoMilhas / TipoValor**: nome da cabine conforme denominação da companhia
  - **TaxaEmbarque**: valor unitário da taxa (em R$)
  - **TaxaEmbarqueFaixaEtaria**: taxas separadas por Adulto/Criança/Bebê
  - **TaxaResgate**: retornado conforme a taxa de resgate (companhia Azul)
  - **LimiteBagagem**: quantidade de bagagem permitida, quando disponível

Exemplo de um voo (busca por milhas):

```json
{
  "Companhia": "AZUL",
  "Sentido": "ida",
  "Origem": "CNF",
  "Destino": "GRU",
  "Embarque": "14/09/2023 06:00",
  "Desembarque": "14/09/2023 07:15",
  "Duracao": "01:15",
  "NumeroVoo": "AD5062",
  "NumeroConexoes": 0,
  "Conexoes": [],
  "Milhas": [ { "TipoMilhas": "AZUL", "Adulto": 8000, "TaxaEmbarque": 40.0, "LimiteBagagem": "..." } ]
}
```

## Tipos possíveis (mudam sem aviso)

> As companhias costumam alterar esses nomes e nem sempre é possível mapear quando a mudança ocorre.
> **Trate `TipoMilhas`/`TipoValor` dinamicamente — nunca dependa de uma lista fechada.**

**TipoMilhas**

- **GOL (Smiles):** `smiles`, `clube smiles`, `diamante`
- **AZUL:** `AZUL`, `Economy`
- **LATAM:** `LIGHT ECONOMY`, `PLUS ECONOMY`, `TOP ECONOMY`, `TOP BUSINESS`, `PLUS BUSINESS`,
  `TOP PREMIUMECONOMY`, `PLUS PREMIUMECONOMY`
- **TAP:** `AWBASIC`, `AWEXECU`
- **IBERIA:** `ECONOMY CLASS`, `BLUE CLASS`, `PREMIUM ECONOMY`, `BUSINESS`
- **AMERICAN AIRLINES:** `PREMIUM_ECONOMY`, `COACH`, `BUSINESS`, `FIRST`
- **INTERLINE:** `ECONOMY`

**TipoValor**

- **GOL:** `PO`, `LT`, `PL`, `MX`
- **AZUL:** `Azul`, `Mais Azul`
- **LATAM:** mesmo conjunto de `TipoMilhas`

## Como esta plataforma usa a API

1. O frontend chama a edge function `busca-voos` (autenticada) com origem, destino, datas, tipo de
   viagem, classe, passageiros e programas.
2. A edge function converte datas para `DD/MM/AAAA`, faz fan-out por programa e agrega os voos.
3. Para cada opção de tarifa calcula o preço em R$:
   `(total_milhas / 1000) × valor_do_milheiro + taxa_de_embarque`, lendo o milheiro da tabela
   `mileage_rates`.
4. Retorna os voos **normalizados** (preço em R$ em destaque; milhas e taxa apenas no detalhe),
   agrupados em `ida` e `volta`.

Uma flag de secret `BUSCAMILHAS_MOCK` permite alternar entre a API real (`"false"`) e dados de
demonstração consistentes com a mesma fórmula de precificação (`"true"`), para manter o produto
sempre demonstrável enquanto o acesso à API é liberado.
