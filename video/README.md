# Vídeo de demonstração (Remotion)

Vídeo de ~46 s (1920×1080, 30 fps) que conta a história do VoePontos e mostra o fluxo real de emissão:
busca → resultado em R$ → Milhas/Tarifado/Todos → confirmação (milhas × valor) → passageiro (dados
desfocados) → pagamento faturado.

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
- `src/TitleScenes.tsx` — cenas de texto (abertura, marca, frase final, encerramento).
- `src/theme.ts` — cores e fontes (as mesmas da apresentação).
