import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {FPS, colors} from './theme';
import {ScreenScene, ScreenSceneProps} from './ScreenScene';
import {Brand, Intro, Outro, Statement} from './TitleScenes';

type Scene =
  | {kind: 'intro' | 'brand' | 'statement' | 'outro'; seconds: number}
  | ({kind: 'screen'; seconds: number} & ScreenSceneProps);

// Coordenadas de câmera e desfoque em px das gravações originais (2558 px de largura).
export const scenes: Scene[] = [
  {kind: 'intro', seconds: 5},
  {kind: 'brand', seconds: 3.5},
  {
    kind: 'screen',
    seconds: 5.6,
    src: '01-busca.mp4',
    trimBeforeSec: 0,
    playbackRate: 1.5,
    step: '01 · Busca',
    title: 'Origem, destino e data. Só isso.',
    subtitle: 'Azul, Gol e Latam consultadas de uma vez.',
    camera: [
      {t: 0, cx: 1320, cy: 430, w: 1500},
      {t: 5.6, cx: 1360, cy: 470, w: 1400},
    ],
  },
  {
    kind: 'screen',
    seconds: 3.4,
    src: '01-busca.mp4',
    trimBeforeSec: 19,
    playbackRate: 1,
    step: '02 · Resultado',
    title: 'O preço aparece em reais.',
    subtitle: 'E cada voo mostra: emitido com milhas.',
    camera: [
      {t: 0, cx: 1480, cy: 560, w: 1350},
      {t: 3.4, cx: 1560, cy: 520, w: 1000},
    ],
  },
  {
    kind: 'screen',
    seconds: 7,
    src: '02-resultados.mp4',
    trimBeforeSec: 0.5,
    playbackRate: 1.6,
    step: '03 · Compare',
    title: 'Milhas, Tarifado ou Todos.',
    subtitle: 'As duas formas de emissão, lado a lado. Você escolhe a mais vantajosa.',
    camera: [
      {t: 0, cx: 1560, cy: 520, w: 1000},
      {t: 2.5, cx: 1450, cy: 560, w: 1350},
      {t: 7, cx: 1450, cy: 560, w: 1350},
    ],
  },
  {
    kind: 'screen',
    seconds: 4,
    src: '02-resultados.mp4',
    trimBeforeSec: 13.6,
    playbackRate: 1,
    step: '04 · Transparência',
    title: '8.000 milhas. R$ 238,65.',
    subtitle: 'Cada taxa detalhada antes de confirmar.',
    camera: [
      {t: 0, cx: 1290, cy: 520, w: 1450},
      {t: 1.6, cx: 1290, cy: 520, w: 1450},
      {t: 3.6, cx: 1700, cy: 500, w: 820},
    ],
  },
  {
    kind: 'screen',
    seconds: 2.6,
    src: '03-pagamento.mp4',
    trimBeforeSec: 0,
    playbackRate: 2,
    step: '05 · Passageiro',
    title: 'Poucos campos, uma vez só.',
    subtitle: 'Dados pessoais desfocados neste vídeo.',
    camera: [{t: 0, cx: 1290, cy: 470, w: 1450}],
    // Formulário com nome, nascimento e CPF: sempre desfocado
    blur: [{x: 620, y: 140, w: 880, h: 560, from: 0, to: 99}],
  },
  {
    kind: 'screen',
    seconds: 7.4,
    src: '03-pagamento.mp4',
    trimBeforeSec: 7.6,
    playbackRate: 1.6,
    step: '06 · Pagamento',
    title: 'Faturado para a empresa.',
    subtitle: 'Sem cartão corporativo: tudo consolidado em fatura.',
    camera: [
      {t: 0, cx: 1200, cy: 520, w: 1450},
      {t: 5.5, cx: 1200, cy: 560, w: 1450},
      {t: 7.4, cx: 1060, cy: 700, w: 1100},
    ],
  },
  {kind: 'statement', seconds: 4},
  {kind: 'outro', seconds: 4},
];

export const totalFrames = scenes.reduce((acc, s) => acc + Math.round(s.seconds * FPS), 0);

export const VoePontos: React.FC = () => (
  <AbsoluteFill style={{background: colors.navy}}>
    <Series>
      {scenes.map((s, i) => {
        const frames = Math.round(s.seconds * FPS);
        const body =
          s.kind === 'screen' ? <ScreenScene {...s} /> :
          s.kind === 'intro' ? <Intro /> :
          s.kind === 'brand' ? <Brand /> :
          s.kind === 'statement' ? <Statement /> :
          <Outro />;
        return (
          <Series.Sequence key={i} durationInFrames={frames}>
            {body}
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);
