import React, { useMemo } from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';
import { Map, Marker, Source, Layer } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = process.env.REMOTION_MAPBOX_TOKEN as string;

// 南京旅游景点坐标
const TOUR_POINTS = [
  // Day 1
  { name: '南京博物院', lat: 32.0820, lng: 118.7833, day: 1 },
  { name: '中山陵', lat: 32.0759, lng: 118.8603, day: 1 },
  // Day 2
  { name: '明孝陵', lat: 32.0629, lng: 118.8683, day: 2 },
  { name: '夫子庙秦淮河', lat: 32.0236, lng: 118.7983, day: 2 },
  // Day 3
  { name: '总统府', lat: 32.0505, lng: 118.7970, day: 3 },
  { name: '老门东', lat: 32.0267, lng: 118.7983, day: 3 },
  // Day 4
  { name: '牛首山', lat: 31.9653, lng: 118.8167, day: 4 },
  { name: '大报恩寺', lat: 31.9898, lng: 118.7733, day: 4 },
  // Day 5
  { name: '鸡鸣寺', lat: 32.0702, lng: 118.7927, day: 5 },
  { name: '玄武湖', lat: 32.0800, lng: 118.8069, day: 5 },
];

// 根据进度获取当前位置
const getPositionAtProgress = (progress: number) => {
  const totalPoints = TOUR_POINTS.length;
  const currentIndex = Math.min(Math.floor(progress * totalPoints), totalPoints - 1);
  const nextIndex = Math.min(currentIndex + 1, totalPoints - 1);

  if (currentIndex === nextIndex) {
    return {
      lng: TOUR_POINTS[currentIndex].lng,
      lat: TOUR_POINTS[currentIndex].lat,
      currentPoint: TOUR_POINTS[currentIndex],
      nextPoint: TOUR_POINTS[currentIndex],
      segmentProgress: 1,
    };
  }

  const currentPoint = TOUR_POINTS[currentIndex];
  const nextPoint = TOUR_POINTS[nextIndex];

  // 当前段的进度（0-1）
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
  const coordinates: [number, number][] = TOUR_POINTS.map((p) => [p.lng, p.lat]);
  return coordinates;
};

export const NanjingTour: React.FC = () => {
  const frame = useCurrentFrame();
  const totalFrames = 900; // 30秒 @ 30fps
  const progress = frame / totalFrames;

  const position = getPositionAtProgress(progress);
  const currentDay = position.currentPoint.day;

  // 景点显示效果：靠近景点时显示，离开后隐藏
  const showPointName =
    position.segmentProgress > 0.3 && position.segmentProgress < 0.9;
  const pointNameOpacity = Math.max(
    0,
    Math.min(
      (position.segmentProgress - 0.2) * 5,
      1 - (position.segmentProgress - 0.7) * 5
    )
  );

  // 地图中心（跟随游客）
  const mapLng = position.lng;
  const mapLat = position.lat;

  // 进度条
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
        backgroundColor: '#f5f5f5',
      }}
    >
      {/* 地图 */}
      <Map
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/outdoors-v12"
        initialViewState={{
          longitude: 118.7969,
          latitude: 32.0603,
          zoom: 11,
        }}
        viewState={{
          longitude: mapLng,
          latitude: mapLat,
          zoom: 12,
          bearing: 0,
          pitch: 0,
        }}
        preventStyleDiffing
        style={{
          width: '100%',
          height: '100%',
        }}
      >
        {/* 路线 */}
        <Source id="tour-route" type="geojson" data={geojson}>
          <Layer
            id="route-line"
            type="line"
            paint={{
              'line-color': '#e74c3c',
              'line-width': 4,
              'line-opacity': 0.7,
            }}
          />
        </Source>

        {/* 所有景点标记 */}
        {TOUR_POINTS.map((point, idx) => (
          <Marker key={idx} longitude={point.lng} latitude={point.lat}>
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#3498db',
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

        {/* 当前位置汽车图标 */}
        <Marker longitude={position.lng} latitude={position.lat}>
          <div
            style={{
              fontSize: '36px',
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              animation: 'bounce 0.6s ease-in-out infinite',
              transform: 'translate(-50%, -50%)',
            }}
          >
            🚗
          </div>
        </Marker>
      </Map>

      {/* 景点名称显示 - 中上方 */}
      {showPointName && (
        <div
          style={{
            position: 'absolute',
            top: '80px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'white',
            padding: '16px 32px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            opacity: pointNameOpacity,
            transition: 'opacity 0.3s ease',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#2c3e50',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              textAlign: 'center',
            }}
          >
            {position.currentPoint.name}
          </div>
        </div>
      )}

      {/* 天数显示 - 左下方 */}
      <div
        style={{
          position: 'absolute',
          bottom: '120px',
          left: '40px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          padding: '16px 24px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#e74c3c',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          Day {currentDay}
        </div>
      </div>

      {/* 进度条 - 底部 */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '40px',
          right: '40px',
          height: '8px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '4px',
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
            backgroundColor: '#e74c3c',
            borderRadius: '4px',
            transition: 'width 0.1s linear',
          }}
        />
      </div>

      {/* 进度百分比 - 进度条右侧 */}
      <div
        style={{
          position: 'absolute',
          bottom: '50px',
          right: '40px',
          fontSize: '14px',
          fontWeight: 'bold',
          color: '#2c3e50',
          fontFamily: 'monospace',
        }}
      >
        {progressPercent}%
      </div>

      {/* 起点和终点标签 */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          fontSize: '14px',
          color: '#7f8c8d',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '8px 16px',
          borderRadius: '4px',
        }}
      >
        南京五日游
      </div>

      {/* 样式注入 */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -65%) scale(1.1); }
        }
      `}</style>
    </div>
  );
};
