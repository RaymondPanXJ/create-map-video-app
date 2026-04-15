import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useCurrentFrame, delayRender, continueRender } from 'remotion';
import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';
import mg4Image from '../assets/mg4.png';

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN as string;

// 路线站点坐标和时间信息
const ROUTE_WAYPOINTS = [
  { name: 'London', lat: 51.5074, lng: -0.1278, time: '06:30', segment: 'Start' },
  { name: 'Folkestone', lat: 51.0799, lng: 1.1745, time: '08:00', segment: 'M25 & M20' },
  { name: 'Eurotunnel', lat: 50.9188, lng: 1.5271, time: '08:35', segment: 'Tunnel' },
  { name: 'Calais', lat: 50.9579, lng: 1.8699, time: '10:35', segment: 'A16 & E40' },
  { name: 'Brussels', lat: 50.8503, lng: 4.3517, time: '12:45', segment: 'A16 & E40' },
  { name: 'Liège', lat: 50.6324, lng: 5.5700, time: '14:30', segment: 'A3 & E40' },
  { name: 'Aachen', lat: 50.7753, lng: 6.0837, time: '15:15', segment: 'A44 & E40' },
  { name: 'Cologne', lat: 50.9375, lng: 6.9603, time: '16:15', segment: 'A4 & E40' },
];

// 根据进度获取当前位置
const getPositionAtProgress = (progress: number) => {
  const totalPoints = ROUTE_WAYPOINTS.length;
  const currentIndex = Math.min(Math.floor(progress * totalPoints), totalPoints - 1);
  const nextIndex = Math.min(currentIndex + 1, totalPoints - 1);

  if (currentIndex === nextIndex) {
    return {
      lng: ROUTE_WAYPOINTS[currentIndex].lng,
      lat: ROUTE_WAYPOINTS[currentIndex].lat,
      currentPoint: ROUTE_WAYPOINTS[currentIndex],
      nextPoint: ROUTE_WAYPOINTS[currentIndex],
      segmentProgress: 1,
    };
  }

  const currentPoint = ROUTE_WAYPOINTS[currentIndex];
  const nextPoint = ROUTE_WAYPOINTS[nextIndex];

  const segmentStart = currentIndex / totalPoints;
  const segmentEnd = (currentIndex + 1) / totalPoints;
  const segmentProgress = (progress - segmentStart) / (segmentEnd - segmentStart);

  return {
    lng: currentPoint.lng + (nextPoint.lng - currentPoint.lng) * segmentProgress,
    lat: currentPoint.lat + (nextPoint.lat - currentPoint.lat) * segmentProgress,
    currentPoint,
    nextPoint,
    segmentProgress,
  };
};

// 生成路线线段
const generateRoute = () => {
  const coordinates: [number, number][] = ROUTE_WAYPOINTS.map((p) => [p.lng, p.lat]);
  return coordinates;
};

// 计算当前时间显示
const getDisplayTime = (progress: number): string => {
  const startMinutes = 6 * 60 + 30;
  const totalMinutes = Math.round(progress * (9 * 60 + 45));
  const currentMinutes = startMinutes + totalMinutes;

  const hours = Math.floor(currentMinutes / 60) % 24;
  const minutes = currentMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// 赛博朋克风格的MG4汽车
const CyberMG4Car: React.FC<{ opacity: number; frame: number }> = ({ opacity, frame }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '50px',
        filter: `drop-shadow(0 0 8px #00ff88) drop-shadow(0 0 16px #00ff88) drop-shadow(0 0 24px #00ffff)`,
        transform: 'translate(-50%, -50%)',
        opacity,
      }}
    >
      <img
        src={mg4Image}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          objectPosition: 'center',
          filter: 'brightness(1.1) saturate(1.3)',
        }}
        alt="MG4"
      />
    </div>
  );
};

export const LondonCologneTripCyber: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 900; // 30秒 @ 30fps
  const progress = frame / totalFrames;

  // delayRender: 阻止 Remotion 在地图加载完成前截图
  const [handle] = useState(() =>
    delayRender('Waiting for Mapbox tiles to load', {
      timeoutInMilliseconds: 60000,
    })
  );
  const mapReady = useRef(false);

  const onMapLoad = useCallback(
    (evt: any) => {
      const map = evt.target;
      map.once('idle', () => {
        if (!mapReady.current) {
          mapReady.current = true;
          continueRender(handle);
        }
      });
    },
    [handle]
  );

  const position = getPositionAtProgress(progress);
  const currentTime = getDisplayTime(progress);

  // 位置名称显示效果
  const isLastPoint = position.currentPoint === ROUTE_WAYPOINTS[ROUTE_WAYPOINTS.length - 1];
  const showLocationName =
    (position.segmentProgress > 0.2 && position.segmentProgress < 0.95) ||
    (isLastPoint && progress > 0.85);

  let locationNameOpacity = Math.max(
    0,
    Math.min(
      (position.segmentProgress - 0.15) * 5,
      1 - (position.segmentProgress - 0.75) * 5
    )
  );

  // 对于终点，使用不同的淡出逻辑
  if (isLastPoint && progress > 0.85) {
    locationNameOpacity = Math.min(1, (progress - 0.85) * 10);
  }

  // 地图中心（跟随汽车）
  const mapLng = position.lng;
  const mapLat = position.lat;

  // 进度百分比
  const progressPercent = Math.round(progress * 100);

  const routeCoordinates = useMemo(() => generateRoute(), []);

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
            longitude: 3.5,
            latitude: 50.9,
            zoom: 6.5,
          }}
          viewState={{
            longitude: mapLng,
            latitude: mapLat,
            zoom: 7,
            bearing: 0,
            pitch: 0,
          }}
          onLoad={onMapLoad}
          preventStyleDiffing
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            filter: 'saturate(1.2) contrast(1.1)',
          }}
        >
        {/* 霓虹激光路线 */}
        <Source id="cyber-route" type="geojson" data={geojson}>
          <Layer
            id="cyber-route-glow"
            type="line"
            paint={{
              'line-color': '#00ff88',
              'line-width': 8,
              'line-opacity': 0.3,
              'line-blur': 4,
            }}
          />
          <Layer
            id="cyber-route-core"
            type="line"
            paint={{
              'line-color': '#00ffff',
              'line-width': 3,
              'line-opacity': 0.9,
            }}
          />
          <Layer
            id="cyber-route-accent"
            type="line"
            paint={{
              'line-color': '#00ff88',
              'line-width': 1.5,
              'line-opacity': 0.6,
            }}
          />
        </Source>

        {/* 所有站点标记 - 赛博朋克风格 */}
        {ROUTE_WAYPOINTS.map((point, idx) => (
          <Marker key={idx} longitude={point.lng} latitude={point.lat}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '2px',
                backgroundColor: idx === 0 ? '#00ff88' : idx === ROUTE_WAYPOINTS.length - 1 ? '#ff0055' : '#00ffff',
                border: '2px solid #ffffff',
                boxShadow: `0 0 12px ${idx === 0 ? '#00ff88' : idx === ROUTE_WAYPOINTS.length - 1 ? '#ff0055' : '#00ffff'},
                           0 0 24px ${idx === 0 ? '#00ff88' : idx === ROUTE_WAYPOINTS.length - 1 ? '#ff0055' : '#00ffff'}`,
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: '#0a0e27',
                fontWeight: 'bold',
                fontFamily: '"Courier New", monospace',
              }}
            >
              {idx + 1}
            </div>
          </Marker>
        ))}

        {/* 当前位置MG4汽车图标 - 赛博朋克 */}
        <Marker longitude={position.lng} latitude={position.lat}>
          <CyberMG4Car opacity={1} frame={frame} />
        </Marker>
        </Map>

      {/* 位置名称显示 - 中上方 */}
      {showLocationName && (
        <div
          style={{
            position: 'absolute',
            top: '100px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(10, 14, 39, 0.8)',
            border: '2px solid #00ff88',
            padding: '14px 32px',
            borderRadius: '0px',
            boxShadow: '0 0 20px rgba(0, 255, 136, 0.5)',
            opacity: locationNameOpacity,
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#00ffff',
              fontFamily: '"Courier New", monospace',
              textAlign: 'center',
              letterSpacing: '2px',
              textShadow: '0 0 10px #00ff88, 0 0 20px #00ffff',
            }}
          >
            {position.currentPoint.name}
          </div>
          {position.currentPoint.segment && (
            <div
              style={{
                fontSize: '12px',
                color: '#00ff88',
                marginTop: '6px',
                textAlign: 'center',
                fontFamily: '"Courier New", monospace',
                letterSpacing: '1px',
              }}
            >
              {position.currentPoint.segment}
            </div>
          )}
        </div>
      )}

      {/* 时间显示 - 左上角 */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          backgroundColor: 'rgba(10, 14, 39, 0.85)',
          border: '2px solid #00ffff',
          padding: '12px 24px',
          borderRadius: '0px',
          boxShadow: '0 0 20px rgba(0, 255, 255, 0.5)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#00ff88',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '2px',
            textShadow: '0 0 10px #00ff88, 0 0 20px #00ffff',
          }}
        >
          {currentTime}
        </div>
      </div>

      {/* 路线信息 - 右上角 */}
      <div
        style={{
          position: 'absolute',
          top: '30px',
          right: '30px',
          backgroundColor: 'rgba(10, 14, 39, 0.85)',
          border: '2px solid #ff0055',
          padding: '12px 20px',
          borderRadius: '0px',
          boxShadow: '0 0 20px rgba(255, 0, 85, 0.5)',
          zIndex: 10,
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#00ffff',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '1px',
            textShadow: '0 0 8px #00ffff',
          }}
        >
          LONDON → COLOGNE
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#00ff88',
            marginTop: '4px',
            fontFamily: '"Courier New", monospace',
            textShadow: '0 0 8px #00ff88',
          }}
        >
          MG4 CYBER DRIVE
        </div>
      </div>

      {/* 进度条 - 底部 */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          height: '6px',
          backgroundColor: 'rgba(10, 14, 39, 0.9)',
          border: '1px solid #00ffff',
          borderRadius: '0px',
          overflow: 'hidden',
          boxShadow: '0 0 12px rgba(0, 255, 255, 0.3)',
          zIndex: 10,
        }}
      >
        {/* 进度条填充 */}
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: '#00ff88',
            borderRadius: '0px',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 12px rgba(0, 255, 136, 0.8)',
          }}
        />
      </div>

      {/* 进度百分比 - 进度条右侧 */}
      <div
        style={{
          position: 'absolute',
          bottom: '52px',
          right: '40px',
          fontSize: '13px',
          fontWeight: 'bold',
          color: '#00ff88',
          fontFamily: '"Courier New", monospace',
          letterSpacing: '1px',
          textShadow: '0 0 8px #00ff88',
        }}
      >
        {progressPercent}%
      </div>

      {/* 样式注入 */}
      <style>{`
        @keyframes cyberPulse {
          0%, 100% {
            text-shadow: 0 0 10px #00ff88, 0 0 20px #00ffff;
          }
          50% {
            text-shadow: 0 0 20px #00ff88, 0 0 40px #00ffff, 0 0 60px #0099ff;
          }
        }

        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
      `}</style>
    </div>
  );
};
