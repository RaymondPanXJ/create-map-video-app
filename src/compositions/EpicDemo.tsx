import React from 'react';
import { useCurrentFrame, interpolate, spring } from 'remotion';

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

// Generate deterministic particles with seed
const generateParticles = (seed: number, count: number): Particle[] => {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const hash = Math.sin(seed + i * 12.9898) * 43758.5453;
    const random = (offset: number) => Math.sin(hash + offset) * 0.5 + 0.5;

    particles.push({
      id: i,
      x: random(1) * 1920,
      y: random(2) * 1080,
      vx: (random(3) - 0.5) * 4,
      vy: (random(4) - 0.5) * 4,
      size: random(5) * 3 + 1,
      color: `hsl(${random(6) * 360}, 100%, 60%)`,
    });
  }
  return particles;
};

const Particle: React.FC<{ particle: Particle; frame: number }> = ({
  particle,
  frame,
}) => {
  const x = particle.x + particle.vx * frame;
  const y = particle.y + particle.vy * frame;

  return (
    <div
      style={{
        position: 'absolute',
        left: `${x % 1920}px`,
        top: `${y % 1080}px`,
        width: `${particle.size * 2}px`,
        height: `${particle.size * 2}px`,
        borderRadius: '50%',
        background: particle.color,
        boxShadow: `0 0 ${particle.size * 4}px ${particle.color}`,
        filter: 'blur(0.5px)',
      }}
    />
  );
};

const DataVisualization: React.FC<{ frame: number }> = ({ frame }) => {
  const fps = 30;
  const totalFrames = 600;

  // 数据点动画
  const dataPoints = Array.from({ length: 12 }, (_, i) => {
    const angle = (i / 12) * Math.PI * 2;
    const value = Math.sin(frame / fps * 0.02 + angle) * 0.5 + 0.5;
    const radius = 150 + value * 100;

    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      color: `hsl(${(i / 12) * 360 + frame / 2}, 100%, 60%)`,
      scale: value * 0.5 + 0.5,
    };
  });

  return (
    <svg
      width="400"
      height="400"
      viewBox="-200 -200 400 400"
      style={{
        position: 'absolute',
        left: '760px',
        top: '340px',
        filter: 'drop-shadow(0 0 30px rgba(100, 200, 255, 0.5))',
      }}
    >
      {/* 背景圆环 */}
      {[100, 150, 200].map((r) => (
        <circle
          key={`ring-${r}`}
          cx="0"
          cy="0"
          r={r}
          fill="none"
          stroke={`rgba(100, 200, 255, ${0.2 - r / 1000})`}
          strokeWidth="1"
        />
      ))}

      {/* 数据点 */}
      {dataPoints.map((point, i) => (
        <g key={`point-${i}`}>
          <circle
            cx={point.x}
            cy={point.y}
            r={8 * point.scale}
            fill={point.color}
            opacity={point.scale}
          />
          <circle
            cx={point.x}
            cy={point.y}
            r={20 * point.scale}
            fill="none"
            stroke={point.color}
            strokeWidth="2"
            opacity={point.scale * 0.5}
          />
        </g>
      ))}

      {/* 中心旋转元素 */}
      <g
        style={{
          transform: `rotate(${frame * 1.5}deg)`,
          transformOrigin: '0 0',
        }}
      >
        <polygon
          points="0,-80 70,40 -70,40"
          fill="none"
          stroke="rgba(255, 100, 200, 0.8)"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};

const TextAnimation: React.FC<{ frame: number; totalFrames: number }> = ({
  frame,
  totalFrames,
}) => {
  const fps = 30;

  // 标题滑入
  const titleSlide = interpolate(frame, [0, 60], [-500, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 副标题淡入
  const subtitleOpacity = interpolate(frame, [80, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 结尾缩放
  const outlineScale = spring({
    frame: Math.max(0, frame - 520),
    fps,
    config: {
      damping: 20,
      stiffness: 100,
      mass: 1,
    },
  });

  const outlineOpacity = interpolate(frame, [520, 560], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <>
      {/* 标题 */}
      <h1
        style={{
          position: 'absolute',
          left: `${titleSlide}px`,
          top: '100px',
          fontSize: '72px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          textShadow: '0 0 30px rgba(100, 200, 255, 0.8)',
          letterSpacing: '3px',
        }}
      >
        EPIC VIDEO
      </h1>

      {/* 副标题 */}
      <p
        style={{
          position: 'absolute',
          left: '60px',
          top: '200px',
          fontSize: '28px',
          color: 'rgba(255, 255, 255, 0.8)',
          margin: 0,
          fontFamily: 'system-ui, -apple-system, sans-serif',
          opacity: subtitleOpacity,
          textShadow: '0 0 20px rgba(255, 100, 200, 0.6)',
        }}
      >
        Powered by Remotion
      </p>

      {/* 结尾强调 */}
      {frame > 520 && (
        <div
          style={{
            position: 'absolute',
            left: '960px',
            top: '540px',
            transform: `scale(${outlineScale})`,
            opacity: outlineOpacity,
          }}
        >
          <div
            style={{
              width: '200px',
              height: '200px',
              border: '3px solid rgba(255, 200, 100, 0.8)',
              borderRadius: '50%',
              boxShadow: '0 0 50px rgba(255, 200, 100, 0.6)',
            }}
          />
        </div>
      )}
    </>
  );
};

export const EpicDemo: React.FC = () => {
  const frame = useCurrentFrame();
  const fps = 30;
  const totalFrames = 600; // 20 seconds

  // 粒子系统
  const particles = React.useMemo(() => generateParticles(42, 80), []);

  // 背景渐变动画
  const bgHue = (frame * 0.5) % 360;

  return (
    <div
      style={{
        width: '1920px',
        height: '1080px',
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, hsl(${bgHue}, 70%, 15%), hsl(${(bgHue + 60) % 360}, 70%, 25%))`,
      }}
    >
      {/* 粒子背景 */}
      {particles.map((particle) => (
        <Particle key={particle.id} particle={particle} frame={frame} />
      ))}

      {/* 中心数据可视化 */}
      <DataVisualization frame={frame} />

      {/* 文字动画 */}
      <TextAnimation frame={frame} totalFrames={totalFrames} />

      {/* 底部统计 */}
      {frame > 300 && (
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '80px',
            opacity: interpolate(frame, [300, 360], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            }),
          }}
        >
          {[
            { label: 'Performance', value: '60fps' },
            { label: 'Quality', value: '4K Ready' },
            { label: 'Speed', value: 'Ultra' },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                textAlign: 'center',
                color: 'white',
                fontFamily: 'monospace',
              }}
            >
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '14px', color: 'rgba(255, 200, 100, 0.8)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
