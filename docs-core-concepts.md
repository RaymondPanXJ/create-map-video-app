# 📚 核心概念

## 🎬 Remotion 基础

### 什么是 Remotion?
Remotion 是一个使用 React 创建视频的 JavaScript 库。它允许你用声明式的代码定义视频内容，而不是使用传统的视频编辑软件。

### 核心概念

#### 1. Composition（组件）
```typescript
<Composition
  id="MapVideo"
  component={MapVideo}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

- **id**: 唯一标识符
- **component**: React 组件
- **durationInFrames**: 总帧数
- **fps**: 帧率（通常 24, 30, 60）
- **width/height**: 分辨率

#### 2. Sequence（序列）
```typescript
<Sequence from={0} durationInFrames={150}>
  <Scene1 />
</Sequence>
<Sequence from={150} durationInFrames={150}>
  <Scene2 />
</Sequence>
```

把视频分成多个时间段，每个段独立渲染。

#### 3. Frame（帧）
```typescript
const frame = useCurrentFrame();
// frame 从 0 到 durationInFrames-1
```

获取当前帧号，用于驱动动画。

### 时间计算

```typescript
const { fps } = useVideoConfig();
const frame = useCurrentFrame();

// 从帧号转换为秒
const seconds = frame / fps;

// 从秒转换为帧号
const frames = seconds * fps;

// 例子：2 秒延迟（@30fps = 60 帧）
if (frame < 60) {
  return <div>等待...</div>;
}
```

---

## 🗺️ Mapbox GL 基础

### 什么是 Mapbox?
Mapbox 是一个地图平台，提供高度可定制的地图和地理分析功能。

### 主要组件

#### 1. Map 组件
```typescript
import { Map } from 'react-map-gl/mapbox';

<Map
  mapboxAccessToken={YOUR_TOKEN}
  initialViewState={{
    longitude: 120.1551,
    latitude: 30.2741,
    zoom: 10,
  }}
  mapStyle="mapbox://styles/mapbox/light-v11"
  style={{ width: '100%', height: '100%' }}
/>
```

**主要属性：**
- `longitude`, `latitude`: 中心点
- `zoom`: 缩放级别（0-24）
- `bearing`: 旋转角度（0-360）
- `pitch`: 倾斜角度（0-85）

#### 2. Marker 标记
```typescript
<Marker
  longitude={121.4737}
  latitude={31.2304}
  anchor="bottom"
>
  <div style={{ fontSize: '32px' }}>📍</div>
</Marker>
```

#### 3. Source 和 Layer 数据源
```typescript
<Source
  id="route"
  type="geojson"
  data={{
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [[120, 30], [121, 31]],
    },
  }}
>
  <Layer
    id="route-line"
    type="line"
    paint={{
      'line-color': '#00ff88',
      'line-width': 3,
    }}
  />
</Source>
```

### 地图风格

```typescript
// 预设风格
const styles = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  streets: 'mapbox://styles/mapbox/streets-v12',
};

<Map mapStyle={styles.light} />
```

### 地理坐标

**经度（Longitude）**: 东西方向
- 范围: -180 到 180
- 正值: 东 (E)
- 负值: 西 (W)

**纬度（Latitude）**: 南北方向
- 范围: -85.051129 到 85.051129
- 正值: 北 (N)
- 负值: 南 (S)

**例子：**
```typescript
// 北京
{ lng: 116.4074, lat: 39.9042 }

// 上海
{ lng: 121.4737, lat: 31.2304 }

// 赤道
{ lng: 0, lat: 0 }
```

---

## ⚡ Frame-Based 动画

在 Remotion 中，所有动画都是基于帧号驱动的。

### 线性动画（Linear）

```typescript
import { interpolate } from 'remotion';

const frame = useCurrentFrame();

// 在 0-300 帧内，从 116 → 121
const lng = interpolate(frame, [0, 300], [116, 121]);
```

### 缓动曲线

```typescript
// 使用缓动函数
const value = interpolate(
  frame,
  [0, 300],
  [start, end],
  {
    easing: Easing.inOut(Easing.cubic),
    // 或其他: quad, cubic, expo, circle, back, elastic, bounce
  }
);
```

### 弹簧动画（Spring）

```typescript
import { spring } from 'remotion';

const springValue = spring({
  fps: 30,
  frame,
  from: 0,
  to: 100,
  config: {
    damping: 10,    // 阻尼 (越高越阻尼)
    mass: 1,        // 质量
    stiffness: 100, // 硬度 (越高越弹)
  }
});
```

### 实际例子

```typescript
export const AnimatedMap = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 分三个阶段：0-150, 150-300, 300-450
  const phases = {
    phase1: interpolate(frame, [0, 150], [0, 1], { extrapolateLeft: 'clamp' }),
    phase2: interpolate(frame, [150, 300], [0, 1], { extrapolateLeft: 'clamp' }),
    phase3: interpolate(frame, [300, 450], [0, 1], { extrapolateLeft: 'clamp' }),
  };

  // 根据阶段切换地图
  let lng, lat, zoom;

  if (frame < 150) {
    // 第一阶段：北京 → 上海
    lng = 116.4074 + (121.4737 - 116.4074) * phases.phase1;
    lat = 39.9042 + (31.2304 - 39.9042) * phases.phase1;
    zoom = 8 + (10 - 8) * phases.phase1;
  } else if (frame < 300) {
    // 第二阶段：上海 → 杭州
    lng = 121.4737 + (120.1551 - 121.4737) * phases.phase2;
    lat = 31.2304 + (30.2741 - 31.2304) * phases.phase2;
    zoom = 10 + (12 - 10) * phases.phase2;
  } else {
    // 第三阶段：杭州停留
    lng = 120.1551;
    lat = 30.2741;
    zoom = 12;
  }

  return (
    <Map
      initialViewState={{ longitude: lng, latitude: lat, zoom }}
      // ...
    />
  );
};
```

---

## 🔄 确定性约束

Remotion 要求所有视频代码都是 **确定性的**（Deterministic）。这意味着：

**✅ 允许的：**
```typescript
const frame = useCurrentFrame();
const value = frame * 0.5;  // ✅ 确定性

import { random } from 'remotion';
const seed = random('unique-key');  // ✅ 确定性随机
```

**❌ 不允许的：**
```typescript
const value = Math.random();  // ❌ 非确定性
const date = new Date();      // ❌ 非确定性
const timer = setInterval();  // ❌ 非确定性
```

为什么？因为同一个视频需要能被渲染多次，每次结果都必须完全相同。

---

## 🎨 React 在 Remotion 中的角色

Remotion 使用 React，但有一些特殊之处：

```typescript
export const MyVideo = () => {
  const frame = useCurrentFrame();

  // ✅ 可以使用 React hooks
  const [state, setState] = React.useState(0);

  // ❌ 但不能用事件处理
  // onClick, onHover 等都不会被触发

  // ✅ 可以使用条件渲染
  if (frame < 150) {
    return <Scene1 />;
  }
  return <Scene2 />;
};
```

**本质上，Remotion 使用 React 作为声明式语言来描述每一帧的内容。**

---

## 📏 分辨率和纵横比

```typescript
// 常见分辨率
const resolutions = {
  '720p': { width: 1280, height: 720 },    // 16:9
  '1080p': { width: 1920, height: 1080 },  // 16:9
  '4K': { width: 3840, height: 2160 },     // 16:9
  'Instagram': { width: 1080, height: 1350 }, // 9:16 (竖屏)
  'TikTok': { width: 1080, height: 1920 },    // 9:16
  'YouTube': { width: 1920, height: 1080 },   // 16:9
};
```

---

## 🎬 帧率（FPS）

帧率决定了运动的流畅度。

```typescript
// 常见帧率
const fps = {
  24: '电影标准',
  30: '电视标准 / Remotion 默认',
  60: '高流畅度',
};

// 时间转换
// 30fps 下，1 秒 = 30 帧
// 60fps 下，1 秒 = 60 帧
```

---

## 📝 常用工具函数

```typescript
// 线性插值
const value = interpolate(
  frame,
  [keyframe1, keyframe2],
  [value1, value2]
);

// 弹簧动画
const springVal = spring({ fps, frame, from, to, config });

// 获取当前帧
const frame = useCurrentFrame();

// 获取视频配置
const { fps, width, height, durationInFrames } = useVideoConfig();

// 暂停渲染（异步操作）
const handle = useRef(delayRender());
setTimeout(() => continueRender(handle.current), 1000);
```

---

## 下一步

- [Mapbox 集成指南](./02-mapbox-integration.md)
- [动画系统](./03-animation-system.md)
- [API 参考](./05-api-reference.md)
