import React, { useMemo, useState, useCallback, useRef } from 'react';
import { useCurrentFrame, interpolate, delayRender, continueRender } from 'remotion';
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
  // 从 06:30 开始，总耗时约 9 小时 45 分钟
  const startMinutes = 6 * 60 + 30; // 390 分钟
  const totalMinutes = Math.round(progress * (9 * 60 + 45)); // 585 分钟总耗时
  const currentMinutes = startMinutes + totalMinutes;

  const hours = Math.floor(currentMinutes / 60) % 24;
  const minutes = currentMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

// MG4汽车组件 - 使用图片
const MG4Car: React.FC<{ opacity: number }> = ({ opacity }) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '50px',
        filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.4))',
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
        }}
        alt="MG4"
      />
    </div>
  );
};

export const LondonCologneTrip: React.FC = () => {
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
      // 等待 idle 事件：所有 tiles 渲染完毕
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
        backgroundColor: '#f0f4f8',
      }}
    >
      {/* 地图 */}
        <Map
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
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
          }}
        >
        {/* 路线 */}
        <Source id="route" type="geojson" data={geojson}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              'line-color': '#4a90e2',
              'line-width': 5,
              'line-opacity': 0.7,
            }}
          />
        </Source>

        {/* 所有站点标记 */}
        {ROUTE_WAYPOINTS.map((point, idx) => (
          <Marker key={idx} longitude={point.lng} latitude={point.lat}>
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: idx === 0 ? '#2ecc71' : idx === ROUTE_WAYPOINTS.length - 1 ? '#e74c3c' : '#f39c12',
                border: '3px solid white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                color: 'white',
                fontWeight: 'bold',
              }}
            >
              {idx + 1}
            </div>
          </Marker>
        ))}

        {/* 当前位置MG4汽车图标 */}
        <Marker longitude={position.lng} latitude={position.lat}>
          <MG4Car opacity={1} />
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
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            padding: '14px 32px',
            borderRadius: '12px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            opacity: locationNameOpacity,
            zIndex: 10,
            backdropFilter: 'blur(8px)',
          }}
        >
          <div
            style={{
              fontSize: '26px',
              fontWeight: 'bold',
              color: '#2c3e50',
              fontFamily: '"Courier New", monospace',
              textAlign: 'center',
              letterSpacing: '1px',
            }}
          >
            {position.currentPoint.name}
          </div>
          {position.currentPoint.segment && (
            <div
              style={{
                fontSize: '14px',
                color: '#7f8c8d',
                marginTop: '4px',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#4a90e2',
            fontFamily: '"Courier New", monospace',
            letterSpacing: '2px',
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
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '12px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          zIndex: 10,
          backdropFilter: 'blur(8px)',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#2c3e50',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          London → Cologne
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#7f8c8d',
            marginTop: '4px',
          }}
        >
          MG4 Road Trip
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
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '3px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          zIndex: 10,
        }}
      >
        {/* 进度条填充 */}
        <div
          style={{
            height: '100%',
            width: `${progressPercent}%`,
            backgroundColor: '#4a90e2',
            borderRadius: '3px',
            transition: 'width 0.1s linear',
            boxShadow: '0 0 8px rgba(74, 144, 226, 0.6)',
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
          color: '#4a90e2',
          fontFamily: '"Courier New", monospace',
        }}
      >
        {progressPercent}%
      </div>

      {/* 距离信息 - 左下角 */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          display: 'none',
        }}
      >
        <div
          style={{
            fontSize: '12px',
            color: '#7f8c8d',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Distance: ~900 km
        </div>
      </div>

      {/* 样式注入 */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(74, 144, 226, 0.6); }
          50% { box-shadow: 0 0 16px rgba(74, 144, 226, 0.9); }
        }

        @keyframes pixelFlicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.9; }
        }
      `}</style>
    </div>
  );
};
