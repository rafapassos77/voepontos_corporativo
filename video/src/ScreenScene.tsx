import React from 'react';
import {Easing, OffthreadVideo, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from './theme';
import {Frame, Pill, useReveal} from './ui';

// Ponto da câmera em coordenadas da gravação original (px do vídeo).
// t = segundo da cena; cx/cy = centro do enquadramento; w = largura visível.
export type CameraKey = {t: number; cx: number; cy: number; w: number};

// Área a desfocar, em coordenadas da gravação original, ativa entre from/to (segundos da cena).
export type BlurBox = {x: number; y: number; w: number; h: number; from: number; to: number};

export type ScreenSceneProps = {
  src: string;
  trimBeforeSec: number;
  playbackRate: number;
  step: string;
  title: string;
  subtitle: string;
  footnote?: string;
  camera: CameraKey[];
  blur?: BlurBox[];
};

const CARD = {x: 120, y: 268, w: 1680, h: 716};

const cameraAt = (keys: CameraKey[], t: number) => {
  if (keys.length === 1) return keys[0];
  const times = keys.map((k) => k.t);
  const opts = {
    easing: Easing.inOut(Easing.cubic),
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
  };
  return {
    cx: interpolate(t, times, keys.map((k) => k.cx), opts),
    cy: interpolate(t, times, keys.map((k) => k.cy), opts),
    w: interpolate(t, times, keys.map((k) => k.w), opts),
  };
};

export const ScreenScene: React.FC<ScreenSceneProps> = ({
  src,
  trimBeforeSec,
  playbackRate,
  step,
  title,
  subtitle,
  footnote = 'Captura do novo sistema. Preços e disponibilidade são demonstrativos e não constituem oferta.',
  camera,
  blur = [],
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;
  const titleIn = useReveal(0, 20);
  const subIn = useReveal(8, 16);
  const cardIn = interpolate(frame, [0, 20], [0.97, 1], {extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic)});

  const cam = cameraAt(camera, t);
  const scale = CARD.w / cam.w;
  const tx = CARD.w / 2 - cam.cx * scale;
  const ty = CARD.h / 2 - cam.cy * scale;

  return (
    <Frame tone="light" eyebrow="A nova plataforma" footnote={footnote}>
      <div style={{position: 'absolute', left: CARD.x, top: 136, ...titleIn}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 24}}>
          <Pill>{step}</Pill>
          <span style={{fontSize: 56, fontWeight: 800, letterSpacing: -1, color: colors.ink}}>{title}</span>
        </div>
      </div>
      <div style={{position: 'absolute', left: CARD.x, top: 214, fontSize: 30, color: colors.slate, ...subIn}}>
        {subtitle}
      </div>
      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: CARD.y,
          width: CARD.w,
          height: CARD.h,
          overflow: 'hidden',
          background: colors.white,
          border: `1px solid ${colors.line}`,
          boxShadow: '0 30px 80px rgba(23,38,61,0.18)',
          transform: `scale(${cardIn})`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transformOrigin: '0 0',
            transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
          }}
        >
          <OffthreadVideo
            src={staticFile(src)}
            trimBefore={Math.round(trimBeforeSec * fps)}
            playbackRate={playbackRate}
            muted
            style={{display: 'block'}}
          />
          {blur
            .filter((b) => t >= b.from && t <= b.to)
            .map((b, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: b.x,
                  top: b.y,
                  width: b.w,
                  height: b.h,
                  backdropFilter: 'blur(18px)',
                  background: 'rgba(245,247,250,0.35)',
                  borderRadius: 16,
                }}
              />
            ))}
        </div>
      </div>
    </Frame>
  );
};
