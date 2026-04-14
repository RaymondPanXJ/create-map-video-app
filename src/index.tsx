import React from 'react';
import { Composition } from 'remotion';
import { HelloWorld } from './compositions/HelloWorld';
import { EpicDemo } from './compositions/EpicDemo';
import { MapVideo } from './compositions/MapVideo';
import { TrainRoute } from './compositions/TrainRoute';
import { NanjingTour } from './compositions/NanjingTour';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="EpicDemo"
        component={EpicDemo}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="MapVideo"
        component={MapVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="TrainRoute"
        component={TrainRoute}
        durationInFrames={600}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="NanjingTour"
        component={NanjingTour}
        durationInFrames={900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
