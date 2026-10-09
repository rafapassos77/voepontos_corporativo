import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, fonts, glow} from './theme';

const useFade = (fadeFrames = 14) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return interpolate(
    frame,
    [0, fadeFrames, durationInFrames - fadeFrames, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
};

const useReveal = (delay: number) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const y = interpolate(frame, [delay, delay + 24], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return {opacity, transform: `translateY(${y}px)`};
};

const Eyebrow: React.FC<{children: React.ReactNode; color?: string}> = ({children, color = colors.amber}) => (
  <div style={{fontSize: 26, fontWeight: 700, letterSpacing: 8, textTransform: 'uppercase', color}}>
    {children}
  </div>
);

// Abertura: a dor, contada como história.
export const Intro: React.FC = () => {
  const fade = useFade();
  const a = useReveal(6);
  const b = useReveal(40);
  const c = useReveal(80);
  return (
    <AbsoluteFill
      style={{
        background: colors.navy,
        fontFamily: fonts.text,
        opacity: fade,
        padding: 160,
        justifyContent: 'center',
        gap: 40,
      }}
    >
      <div style={a}>
        <Eyebrow>Uma terça-feira qualquer</Eyebrow>
      </div>
      <div style={{...b, fontFamily: fonts.display, fontSize: 104, fontWeight: 300, lineHeight: 1.1, color: colors.cream}}>
        São 23h.
        <br />
        A reunião é amanhã, às 9h.
      </div>
      <div style={{...c, fontFamily: fonts.display, fontStyle: 'italic', fontSize: 64, color: colors.amber}}>
        Quanto tempo leva para emitir essa passagem?
      </div>
    </AbsoluteFill>
  );
};

export const Brand: React.FC = () => {
  const fade = useFade();
  const a = useReveal(4);
  const b = useReveal(22);
  return (
    <AbsoluteFill
      style={{background: glow, fontFamily: fonts.text, opacity: fade, padding: 160, justifyContent: 'center', gap: 36}}
    >
      <div style={a}>
        <Eyebrow>VoePontos Corporativo</Eyebrow>
      </div>
      <div style={{...b, fontFamily: fonts.display, fontSize: 120, fontWeight: 400, lineHeight: 1.05, color: colors.cream}}>
        Toda viagem começa
        <br />
        com um <i>sim</i>.
      </div>
    </AbsoluteFill>
  );
};

export const Statement: React.FC = () => {
  const fade = useFade();
  const a = useReveal(4);
  const b = useReveal(30);
  return (
    <AbsoluteFill
      style={{background: colors.amber, fontFamily: fonts.display, opacity: fade, padding: 160, justifyContent: 'center', gap: 12}}
    >
      <div style={{...a, fontSize: 120, fontWeight: 400, lineHeight: 1.08, color: colors.ink}}>Menos tempo cotando.</div>
      <div style={{...b, fontSize: 120, fontWeight: 400, fontStyle: 'italic', lineHeight: 1.08, color: colors.ink}}>
        Mais tempo vivendo a viagem.
      </div>
    </AbsoluteFill>
  );
};

export const Outro: React.FC = () => {
  const fade = useFade();
  const a = useReveal(4);
  const b = useReveal(20);
  const c = useReveal(40);
  return (
    <AbsoluteFill
      style={{background: glow, fontFamily: fonts.text, opacity: fade, padding: 160, justifyContent: 'center', gap: 36}}
    >
      <div style={a}>
        <Eyebrow>VoePontos Corporativo</Eyebrow>
      </div>
      <div style={{...b, fontFamily: fonts.display, fontSize: 132, fontWeight: 400, color: colors.cream}}>Vamos embarcar?</div>
      <div style={{...c, fontSize: 34, color: colors.mist}}>Passagens com milhas. Preço em reais. Nenhuma complicação.</div>
    </AbsoluteFill>
  );
};
