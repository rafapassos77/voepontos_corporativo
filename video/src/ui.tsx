import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors, font} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Entrada com fade + subida, a partir de `delay` frames.
export const useReveal = (delay: number, distance = 28): React.CSSProperties => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [delay, delay + 16], [0, 1], clamp);
  const y = interpolate(frame, [delay, delay + 22], [distance, 0], {...clamp, easing: Easing.out(Easing.cubic)});
  return {opacity, transform: `translateY(${y}px)`};
};

// Contador numérico animado entre `delay` e `delay + duration` frames.
export const useCount = (to: number, delay: number, duration = 36) => {
  const frame = useCurrentFrame();
  return interpolate(frame, [delay, delay + duration], [0, to], {...clamp, easing: Easing.out(Easing.cubic)});
};

// Layout atual: vertical (9:16) ou horizontal (16:9), e a margem lateral correspondente.
export const useLayout = () => {
  const {width, height} = useVideoConfig();
  const v = height > width;
  return {v, m: v ? 72 : 120};
};

export const formatInt = (n: number) => Math.round(n).toLocaleString('pt-BR');

type FrameProps = {
  tone: 'navy' | 'light';
  eyebrow?: string;
  footnote?: string;
  accentBar?: boolean;
  children: React.ReactNode;
};

// Moldura de cena no estilo da apresentação: logo, rótulo no topo, nota de rodapé e fade.
export const Frame: React.FC<FrameProps> = ({tone, eyebrow, footnote, accentBar, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const fade = interpolate(frame, [0, 12, durationInFrames - 12, durationInFrames], [0, 1, 1, 0], clamp);
  const dark = tone === 'navy';
  const {v, m} = useLayout();
  return (
    <AbsoluteFill style={{background: dark ? colors.navy : colors.light, fontFamily: font}}>
      <AbsoluteFill style={{opacity: fade}}>
        {accentBar ? <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 16, background: colors.cyan}} /> : null}
        <Img
          src={staticFile(dark ? 'logo-white.png' : 'logo-dark.png')}
          style={{position: 'absolute', left: m, top: v ? 96 : 64, height: v ? 52 : 46}}
        />
        {eyebrow ? (
          <div
            style={{
              position: 'absolute',
              ...(v ? {left: m, top: 176} : {right: m, top: 74}),
              fontSize: 24,
              fontWeight: 700,
              letterSpacing: 5,
              textTransform: 'uppercase',
              color: dark ? colors.mist : colors.slate,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        {children}
        {footnote ? (
          <div
            style={{
              position: 'absolute',
              left: m,
              right: m,
              bottom: v ? 72 : 40,
              paddingTop: 16,
              borderTop: `1px solid ${dark ? colors.navyLine : colors.line}`,
              fontSize: 22,
              color: dark ? colors.mist : colors.slate,
            }}
          >
            {footnote}
          </div>
        ) : null}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Pill: React.FC<{children: React.ReactNode; dark?: boolean}> = ({children, dark}) => (
  <span
    style={{
      display: 'inline-block',
      padding: '10px 20px',
      fontSize: 24,
      fontWeight: 700,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: dark ? colors.cyan : colors.teal,
      background: dark ? colors.navyCard : colors.tealSoft,
    }}
  >
    {children}
  </span>
);
