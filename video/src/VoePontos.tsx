import React from 'react';
import {AbsoluteFill, Series} from 'remotion';
import {FPS, colors} from './theme';
import {ScreenScene, ScreenSceneProps} from './ScreenScene';
import {
  Activation,
  Base,
  Brand,
  Conditions,
  Credentials,
  Cta,
  Hook,
  Scale,
  Simulation,
  Statement,
  Team,
} from './TitleScenes';

const storyScenes = {
  hook: Hook,
  brand: Brand,
  base: Base,
  credentials: Credentials,
  team: Team,
  simulation: Simulation,
  scale: Scale,
  conditions: Conditions,
  activation: Activation,
  statement: Statement,
  cta: Cta,
};

type Scene =
  | {kind: keyof typeof storyScenes; seconds: number}
  | ({kind: 'screen'; seconds: number} & ScreenSceneProps);

// Roteiro baseado na apresentação "Voe Pontos — Parceria Estratégica" (out/2026).
// Coordenadas de câmera e desfoque em px das gravações originais (2558 px de largura).
export const scenes: Scene[] = [
  {kind: 'hook', seconds: 6},
  {kind: 'brand', seconds: 5},
  {kind: 'base', seconds: 6.5},
  {kind: 'credentials', seconds: 5.5},
  {
    kind: 'screen',
    seconds: 5.6,
    src: '01-busca.mp4',
    trimBeforeSec: 0,
    playbackRate: 1.5,
    step: '01 / 05 Busca',
    title: 'Encontre alternativas para cada viagem.',
    subtitle: 'Trecho, data, passageiros, classe e companhias em uma única tela.',
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
    step: '02 / 05 Comparação',
    title: 'O valor total, já em reais.',
    subtitle: 'Cada opção de voo mostra o preço final e como será emitida.',
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
    step: '02 / 05 Comparação',
    title: 'Milhas e tarifado, no mesmo ambiente.',
    subtitle: 'Veja por categoria — milhas, tarifado ou todos — e use os filtros.',
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
    step: '03 / 05 Conferência',
    title: 'Voo, bagagem e taxas à vista.',
    subtitle: 'Itinerário, franquia e composição do valor antes de avançar.',
    footnote: 'Captura do novo sistema. Tarifas e disponibilidade podem mudar até a conclusão da emissão.',
    camera: [
      {t: 0, cx: 1290, cy: 520, w: 1450},
      {t: 1.6, cx: 1290, cy: 520, w: 1450},
      {t: 3.6, cx: 1700, cy: 500, w: 820},
    ],
  },
  {
    kind: 'screen',
    seconds: 2.8,
    src: '03-pagamento.mp4',
    trimBeforeSec: 0,
    playbackRate: 2,
    step: '04 / 05 Passageiros',
    title: 'Dados organizados.',
    subtitle: 'Conferência antes da emissão. Dados pessoais desfocados neste vídeo.',
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
    step: '05 / 05 Pagamento',
    title: 'Pagamento e regras, na mesma jornada.',
    subtitle: 'Pix, boleto e faturado. Remarcação, cancelamento e aceite antes de finalizar.',
    footnote: 'Captura do novo sistema. Faturamento, prazo e limite dependem de análise e condições comerciais aprovadas.',
    camera: [
      {t: 0, cx: 1200, cy: 520, w: 1450},
      {t: 5.5, cx: 1200, cy: 560, w: 1450},
      {t: 7.4, cx: 1060, cy: 700, w: 1100},
    ],
  },
  {kind: 'team', seconds: 6},
  {kind: 'simulation', seconds: 8},
  {kind: 'scale', seconds: 6.5},
  {kind: 'conditions', seconds: 6},
  {kind: 'activation', seconds: 5},
  {kind: 'statement', seconds: 4.5},
  {kind: 'cta', seconds: 6.5},
];

export const totalFrames = scenes.reduce((acc, s) => acc + Math.round(s.seconds * FPS), 0);

export const VoePontos: React.FC = () => (
  <AbsoluteFill style={{background: colors.navy}}>
    <Series>
      {scenes.map((s, i) => {
        const frames = Math.round(s.seconds * FPS);
        let body: React.ReactNode;
        if (s.kind === 'screen') {
          body = <ScreenScene {...s} />;
        } else {
          const Story = storyScenes[s.kind];
          body = <Story />;
        }
        return (
          <Series.Sequence key={i} durationInFrames={frames}>
            {body}
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);
