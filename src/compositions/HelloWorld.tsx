import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';

export const HelloWorld: React.FC = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30, 270, 300], [0, 1, 1, 0]);

  const scale = spring({
    frame,
    fps: 30,
    config: {
      damping: 200,
      mass: 1,
      stiffness: 200,
    },
  });

  return (
    <div
      style={{
        flex: 1,
        backgroundColor: '#1a1a1a',
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
        opacity,
      }}
    >
      <h1
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          fontSize: 96,
          color: 'white',
          margin: 0,
          transform: `scale(${scale})`,
        }}
      >
        Map Video
      </h1>
    </div>
  );
};
