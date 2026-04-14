import React, { useRef } from 'react';
import { useCurrentFrame, interpolate, delayRender, continueRender } from 'remotion';
import { Map } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN as string;

export const MapVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const handleRef = useRef(delayRender());

  // Interpolate camera position from Beijing to Tokyo over 300 frames
  const longitude = interpolate(frame, [0, 300], [116.4, 139.7]);
  const latitude = interpolate(frame, [0, 300], [39.9, 35.7]);
  const zoom = interpolate(frame, [0, 150, 300], [4, 6, 10]);

  const handleLoad = () => {
    continueRender(handleRef.current);
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/light-v11"
        initialViewState={{
          longitude: 116.4,
          latitude: 39.9,
          zoom: 4,
        }}
        viewState={{
          longitude,
          latitude,
          zoom,
          bearing: 0,
          pitch: 0,
        }}
        onLoad={handleLoad}
        preventStyleDiffing
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
