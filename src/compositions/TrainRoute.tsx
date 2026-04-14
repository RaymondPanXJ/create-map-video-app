import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN as string;

// 高铁沿线主要城市
const STATIONS = [
  { name: '南京', lat: 32.0603, lng: 118.7969, km: 0 },
  { name: '蚌埠', lat: 32.8387, lng: 117.3586, km: 104 },
  { name: '阜阳', lat: 32.8973, lng: 115.8581, km: 202 },
  { name: '亳州', lat: 33.8343, lng: 115.7833, km: 272 },
  { name: '许昌', lat: 34.0406, lng: 113.8043, km: 360 },
  { name: '郑州', lat: 34.7466, lng: 113.6253, km: 433 },
  { name: '开封', lat: 34.7794, lng: 114.3055, km: 505 },
  { name: '徐州', lat: 34.2658, lng: 117.1205, km: 587 },
  { name: '北京', lat: 39.9042, lng: 116.4074, km: 1060 },
];

// 生成平滑的高铁路线
const generateTrainRoute = () => {
  const coordinates: [number, number][] = [];
  for (let i = 0; i < STATIONS.length; i++) {
    coordinates.push([STATIONS[i].lng, STATIONS[i].lat]);
  }
  return coordinates;
};

// 根据进度获取当前位置
const getPositionAtProgress = (progress: number) => {
  const totalDistance = STATIONS[STATIONS.length - 1].km;
  const currentDistance = progress * totalDistance;

  // 找到当前位置在哪两个站点之间
  for (let i = 0; i < STATIONS.length - 1; i++) {
    if (
      currentDistance >= STATIONS[i].km &&
      currentDistance <= STATIONS[i + 1].km
    ) {
      const start = STATIONS[i];
      const end = STATIONS[i + 1];
      const segmentProgress =
        (currentDistance - start.km) / (end.km - start.km);

      return {
        lng: start.lng + (end.lng - start.lng) * segmentProgress,
        lat: start.lat + (end.lat - start.lat) * segmentProgress,
        currentStation: start.name,
        nextStation: end.name,
      };
    }
  }

  return {
    lng: STATIONS[STATIONS.length - 1].lng,
    lat: STATIONS[STATIONS.length - 1].lat,
    currentStation: STATIONS[STATIONS.length - 1].name,
    nextStation: STATIONS[STATIONS.length - 1].name,
  };
};

export const TrainRoute: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 600; // 20秒 @ 30fps
  const progress = frame / totalFrames;

  const currentPosition = getPositionAtProgress(progress);

  // 高铁速度：模拟从0加速到300km/h
  const speedProgress = Math.min(progress * 1.5, 1);
  const speed = Math.round(interpolate(speedProgress, [0, 1], [0, 300]));

  // 经过时间（分钟）
  const elapsedMinutes = Math.round(progress * 20 * 60); // 20分钟总程
  const minutes = Math.floor(elapsedMinutes / 60);
  const seconds = elapsedMinutes % 60;

  // 生成路线
  const routeCoordinates = useMemo(() => generateTrainRoute(), []);

  // 地图中心点（在当前位置周围）
  const centerLng = interpolate(progress, [0, 1], [STATIONS[0].lng, STATIONS[STATIONS.length - 1].lng]);
  const centerLat = interpolate(progress, [0, 1], [STATIONS[0].lat, STATIONS[STATIONS.length - 1].lat]);

  // 到站闪光效果
  const isArrivingStation =
    progress > 0 && progress < 0.99 &&
    (Math.abs(currentPosition.lat - Math.round(currentPosition.lat * 1000) / 1000) < 0.001 ||
     frame % 60 < 15); // 简化的到站检测

  const flashOpacity = isArrivingStation ? spring({ frame: frame % 30, fps: 30 }) : 0;

  const geojson = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'LineString' as const,
          coordinates: routeCoordinates,
        },
        properties: {},
      },
    ],
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#0a0e27',
      }}
    >
      {/* 地图 */}
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/dark-v11"
        initialViewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: 6,
        }}
        viewState={{
          longitude: centerLng,
          latitude: centerLat,
          zoom: 6,
          bearing: 0,
          pitch: 0,
        }}
        preventStyleDiffing
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* 高铁线路 - 霓虹发光效果 */}
        <Source id="route" type="geojson" data={geojson}>
          <Layer
            id="route-glow"
            type="line"
            paint={{
              'line-color': '#00ff88',
              'line-width': 8,
              'line-blur': 16,
              'line-opacity': 0.8,
            }}
          />
          <Layer
            id="route-line"
            type="line"
            paint={{
              'line-color': '#00ff88',
              'line-width': 3,
              'line-opacity': 1,
            }}
          />
        </Source>

        {/* 高铁图标 */}
        <Marker longitude={currentPosition.lng} latitude={currentPosition.lat}>
          <div
            style={{
              transform: 'translate(-50%, -50%)',
              fontSize: '32px',
              filter: 'drop-shadow(0 0 8px #00ff88)',
              animation: 'pulse 0.5s ease-in-out infinite',
            }}
          >
            🚄
          </div>
        </Marker>

        {/* 到达站点标记 */}
        {STATIONS.map((station) => (
          <Marker
            key={station.name}
            longitude={station.lng}
            latitude={station.lat}
          >
            <div
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: '#00ff88',
                border: '2px solid #00ffff',
                boxShadow: '0 0 12px #00ff88',
                transform: 'translate(-50%, -50%)',
              }}
            />
          </Marker>
        ))}
      </Map>

      {/* 赛博朋克UI - 左上角时间 */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          left: '40px',
          fontFamily: 'monospace',
          fontSize: '28px',
          color: '#00ff88',
          textShadow: '0 0 10px #00ff88, 0 0 20px #00ff8844',
          fontWeight: 'bold',
          zIndex: 10,
          backgroundColor: 'rgba(10, 14, 39, 0.7)',
          padding: '12px 24px',
          border: '2px solid #00ff88',
          borderRadius: '4px',
        }}
      >
        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
      </div>

      {/* 右上角速度 */}
      <div
        style={{
          position: 'absolute',
          top: '40px',
          right: '40px',
          fontFamily: 'monospace',
          fontSize: '28px',
          color: '#00ffff',
          textShadow: '0 0 10px #00ffff, 0 0 20px #00ffff44',
          fontWeight: 'bold',
          zIndex: 10,
          backgroundColor: 'rgba(10, 14, 39, 0.7)',
          padding: '12px 24px',
          border: '2px solid #00ffff',
          borderRadius: '4px',
        }}
      >
        {String(speed).padStart(3, '0')} km/h
      </div>

      {/* 底部地名显示 */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: 'monospace',
          fontSize: '24px',
          color: '#ff00ff',
          textShadow: '0 0 10px #ff00ff, 0 0 20px #ff00ff44',
          fontWeight: 'bold',
          zIndex: 10,
          backgroundColor: 'rgba(10, 14, 39, 0.8)',
          padding: '16px 32px',
          border: '2px solid #ff00ff',
          borderRadius: '4px',
          minWidth: '200px',
          textAlign: 'center',
        }}
      >
        {currentPosition.currentStation} → {currentPosition.nextStation}
      </div>

      {/* 到站闪光特效 */}
      {isArrivingStation && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#00ffff',
            opacity: flashOpacity * 0.3,
            pointerEvents: 'none',
            zIndex: 5,
          }}
        />
      )}

      {/* 样式注入 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
      `}</style>
    </div>
  );
};
