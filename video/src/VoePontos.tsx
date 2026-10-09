import React from 'react';
import {AbsoluteFill, Audio, Sequence, Series, staticFile} from 'remotion';
import narration from './narration.generated.json';
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
  | {id: string; kind: keyof typeof storyScenes; seconds: number}
  | ({id: string; kind: 'screen'; seconds: number} & ScreenSceneProps);

// Roteiro baseado na apresentação "Voe Pontos — Parceria Estratégica" (out/2026).
// Coordenadas de câmera e desfoque em px das gravações originais (2558 px de largura).
export const scenes: Scene[] = [
  {id: '01-gancho', kind: 'hook', seconds: 6},
  {id: '02-marca', kind: 'brand', seconds: 5},
  {id: '03-base', kind: 'base', seconds: 6.5},
  {id: '04-credenciais', kind: 'credentials', seconds: 5.5},
  {
    id: '05-busca', kind: 'screen',
    seconds: 5.6,
    src: '01-busca.mp4',
    trimBeforeSec: 0,
    playbackRate: 1.5,
    step: '01 / 05 Busca',
    title: 'Encontre alternativas para cada viagem.',
    subtitle: 'Trecho, data, passageiros, classe e companhias em uma única tela.',
    cameraV: [{t: 0, cx: 1050, cy: 490, w: 880}, {t: 2.8, cx: 1450, cy: 490, w: 880}, {t: 5.6, cx: 1580, cy: 490, w: 880}],
    camera: [
      {t: 0, cx: 1320, cy: 430, w: 1500},
      {t: 5.6, cx: 1360, cy: 470, w: 1400},
    ],
  },
  {
    id: '06-resultado', kind: 'screen',
    seconds: 3.4,
    src: '01-busca.mp4',
    trimBeforeSec: 19,
    playbackRate: 1,
    step: '02 / 05 Comparação',
    title: 'O valor total, já em reais.',
    subtitle: 'Cada opção de voo mostra o preço final e como será emitida.',
    cameraV: [{t: 0, cx: 1450, cy: 560, w: 880}, {t: 3.4, cx: 1640, cy: 500, w: 640}],
    camera: [
      {t: 0, cx: 1480, cy: 560, w: 1350},
      {t: 3.4, cx: 1560, cy: 520, w: 1000},
    ],
  },
  {
    id: '07-comparacao', kind: 'screen',
    seconds: 7,
    src: '02-resultados.mp4',
    trimBeforeSec: 0.5,
    playbackRate: 1.6,
    step: '02 / 05 Comparação',
    title: 'Milhas e tarifado, no mesmo ambiente.',
    subtitle: 'Veja por categoria — milhas, tarifado ou todos — e use os filtros.',
    cameraV: [{t: 0, cx: 1640, cy: 500, w: 640}, {t: 2.5, cx: 1500, cy: 560, w: 880}, {t: 7, cx: 1500, cy: 560, w: 880}],
    camera: [
      {t: 0, cx: 1560, cy: 520, w: 1000},
      {t: 2.5, cx: 1450, cy: 560, w: 1350},
      {t: 7, cx: 1450, cy: 560, w: 1350},
    ],
  },
  {
    id: '08-conferencia', kind: 'screen',
    seconds: 4,
    src: '02-resultados.mp4',
    trimBeforeSec: 13.6,
    playbackRate: 1,
    step: '03 / 05 Conferência',
    title: 'Voo, bagagem e taxas à vista.',
    subtitle: 'Itinerário, franquia e composição do valor antes de avançar.',
    footnote: 'Captura do novo sistema. Tarifas e disponibilidade podem mudar até a conclusão da emissão.',
    cameraV: [{t: 0, cx: 1080, cy: 500, w: 880}, {t: 1.6, cx: 1080, cy: 500, w: 880}, {t: 3.6, cx: 1720, cy: 500, w: 600}],
    camera: [
      {t: 0, cx: 1290, cy: 520, w: 1450},
      {t: 1.6, cx: 1290, cy: 520, w: 1450},
      {t: 3.6, cx: 1700, cy: 500, w: 820},
    ],
  },
  {
    id: '09-passageiros', kind: 'screen',
    seconds: 2.8,
    src: '03-pagamento.mp4',
    trimBeforeSec: 0,
    playbackRate: 2,
    step: '04 / 05 Passageiros',
    title: 'Dados organizados.',
    subtitle: 'Conferência antes da emissão. Dados pessoais desfocados neste vídeo.',
    cameraV: [{t: 0, cx: 1450, cy: 490, w: 880}],
    camera: [{t: 0, cx: 1290, cy: 470, w: 1450}],
    // Formulário com nome, nascimento e CPF: sempre desfocado
    blur: [{x: 620, y: 140, w: 880, h: 560, from: 0, to: 99}],
  },
  {
    id: '10-pagamento', kind: 'screen',
    seconds: 7.4,
    src: '03-pagamento.mp4',
    trimBeforeSec: 7.6,
    playbackRate: 1.6,
    step: '05 / 05 Pagamento',
    title: 'Pagamento e regras, na mesma jornada.',
    subtitle: 'Pix, boleto e faturado. Remarcação, cancelamento e aceite antes de finalizar.',
    footnote: 'Captura do novo sistema. Faturamento, prazo e limite dependem de análise e condições comerciais aprovadas.',
    cameraV: [{t: 0, cx: 1080, cy: 520, w: 880}, {t: 5.5, cx: 1080, cy: 560, w: 880}, {t: 7.4, cx: 1060, cy: 700, w: 700}],
    camera: [
      {t: 0, cx: 1200, cy: 520, w: 1450},
      {t: 5.5, cx: 1200, cy: 560, w: 1450},
      {t: 7.4, cx: 1060, cy: 700, w: 1100},
    ],
  },
  {id: '11-equipe', kind: 'team', seconds: 6},
  {id: '12-simulacao', kind: 'simulation', seconds: 8},
  {id: '13-escala', kind: 'scale', seconds: 6.5},
  {id: '14-condicoes', kind: 'conditions', seconds: 6},
  {id: '15-ativacao', kind: 'activation', seconds: 5},
  {id: '16-frase', kind: 'statement', seconds: 4.5},
  {id: '17-contato', kind: 'cta', seconds: 6.5},
];

// Narração: segundos de cada áudio em public/narracao/<id>.mp3 (gerado por scripts/narrar.mjs).
const narrationSeconds = narration as Record<string, number>;
const VOICE_LEAD = 0.3; // respiro antes da fala
const VOICE_TAIL = 0.5; // respiro depois da fala

// Duração final da cena: a do roteiro ou, se a fala for maior, o necessário para caber nela.
const sceneSeconds = (s: Scene) => {
  const voice = narrationSeconds[s.id];
  return voice ? Math.max(s.seconds, VOICE_LEAD + voice + VOICE_TAIL) : s.seconds;
};

// Ao esticar uma cena de tela, desacelera a gravação e a câmera para cobrir o mesmo trecho.
const stretchScreen = (s: Extract<Scene, {kind: 'screen'}>, seconds: number): ScreenSceneProps => {
  const k = seconds / s.seconds;
  return {
    ...s,
    playbackRate: s.playbackRate / k,
    camera: s.camera.map((c) => ({...c, t: c.t * k})),
    cameraV: s.cameraV?.map((c) => ({...c, t: c.t * k})),
    blur: s.blur?.map((b) => ({...b, from: b.from * k, to: b.to * k})),
  };
};

export const totalFrames = scenes.reduce((acc, s) => acc + Math.round(sceneSeconds(s) * FPS), 0);

export const VoePontos: React.FC = () => (
  <AbsoluteFill style={{background: colors.navy}}>
    <Series>
      {scenes.map((s) => {
        const seconds = sceneSeconds(s);
        let body: React.ReactNode;
        if (s.kind === 'screen') {
          body = <ScreenScene {...stretchScreen(s, seconds)} />;
        } else {
          const Story = storyScenes[s.kind];
          body = <Story />;
        }
        return (
          <Series.Sequence key={s.id} durationInFrames={Math.round(seconds * FPS)}>
            {body}
            {narrationSeconds[s.id] ? (
              <Sequence from={Math.round(VOICE_LEAD * FPS)}>
                <Audio src={staticFile(`narracao/${s.id}.mp3`)} />
              </Sequence>
            ) : null}
          </Series.Sequence>
        );
      })}
    </Series>
  </AbsoluteFill>
);
