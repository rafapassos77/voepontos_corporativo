import React from 'react';
import {Composition} from 'remotion';
import {FPS} from './theme';
import {VoePontos, totalFrames} from './VoePontos';

export const Root: React.FC = () => (
  <Composition
    id="VoePontos"
    component={VoePontos}
    durationInFrames={totalFrames}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
