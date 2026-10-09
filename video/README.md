# Vídeo de demonstração (Remotion)

Vídeo de ~1min36 (1920×1080, 30 fps) baseado na apresentação "Voe Pontos — Parceria Estratégica"
(out/2026), voltado a agências de viagens: gancho → promessa → base operacional e credenciais → as
5 etapas da nova plataforma (gravações reais, dados pessoais desfocados) → divisão de papéis →
simulação ilustrativa e escala → condições comerciais → ativação → chamada com contato comercial.

Identidade visual (cores, fonte Inter e logo em `public/logo-*.png`) extraída da apresentação.

## Como usar

1. Coloque as gravações em `public/` com estes nomes (não são versionadas):
   `01-busca.mp4`, `02-resultados.mp4`, `03-pagamento.mp4`
2. `npm install`
3. `npm run studio` — abre o editor visual no navegador para ajustar.
4. `npm run render` — gera `out/voepontos.mp4`.

Em ambientes sem acesso ao download do Chrome do Remotion, aponte para um Chromium local:
`REMOTION_BROWSER=/caminho/para/headless_shell npm run render`.

## Onde editar

- `src/VoePontos.tsx` — roteiro: ordem das cenas, duração, trechos das gravações, textos, câmera
  (zoom/pan em px da gravação original) e áreas desfocadas.
- `src/TitleScenes.tsx` — cenas de narrativa (gancho, marca, números, simulação, condições, contato).
- `src/ui.tsx` — moldura das cenas (logo, rótulo, rodapé) e animações reutilizáveis.
- `src/theme.ts` — paleta e fonte da marca.
