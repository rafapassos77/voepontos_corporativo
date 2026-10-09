import React from 'react';
import {
  AbsoluteFill,
  Easing,
  OffthreadVideo,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {colors, fonts, glow} from './theme';

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
  camera: CameraKey[];
  blur?: BlurBox[];
};

const CARD = {x: 120, y: 236, w: 1680, h: 790};
const FADE = 12;

const cameraAt = (keys: CameraKey[], t: number) => {
  const times = keys.map((k) => k.t);
  if (keys.length === 1) return keys[0];
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
  camera,
  blur = [],
}) => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const t = frame / fps;

  const fade = interpolate(
    frame,
    [0, FADE, durationInFrames - FADE, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  const rise = interpolate(frame, [0, 18], [24, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  const subtitleIn = interpolate(frame, [8, 26], [0, 1], {extrapolateRight: 'clamp'});

  const cam = cameraAt(camera, t);
  const scale = CARD.w / cam.w;
  const tx = CARD.w / 2 - cam.cx * scale;
  const ty = CARD.h / 2 - cam.cy * scale;

  return (
    <AbsoluteFill style={{background: glow, fontFamily: fonts.text, opacity: fade}}>
      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: 64,
          width: CARD.w,
          display: 'flex',
          alignItems: 'baseline',
          gap: 28,
          transform: `translateY(${rise}px)`,
        }}
      >
        <span
          style={{
            fontSize: 26,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: 'uppercase',
            color: colors.amber,
            whiteSpace: 'nowrap',
          }}
        >
          {step}
        </span>
        <span style={{fontFamily: fonts.display, fontSize: 60, fontWeight: 400, color: colors.cream}}>
          {title}
        </span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: CARD.x,
          top: 158,
          fontSize: 30,
          color: colors.mist,
          opacity: subtitleIn,
        }}
      >
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
          borderRadius: 28,
          background: '#ffffff',
          boxShadow: '0 40px 100px rgba(0,0,0,0.45)',
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
                  background: 'rgba(247,243,236,0.35)',
                  borderRadius: 16,
                }}
              />
            ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
