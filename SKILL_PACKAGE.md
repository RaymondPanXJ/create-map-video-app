# 🗺️ Map Video - Remotion + Mapbox 技能包

## 📦 项目模板分发方案

### 快速开始（三种方式）

#### 方式1：一键克隆模板（推荐）
```bash
git clone https://github.com/YOUR_ORG/map-video-template.git my-map-project
cd my-map-project
npm install
npm run dev
```

#### 方式2：CLI 脚手架工具（推荐）
```bash
npx create-map-video-app my-map-project
cd my-map-project
npm run dev
```

#### 方式3：从现有项目导入
```bash
npm install map-video-kit
```

---

## 🎯 技能包包含内容

### 1. 项目骨架 (Project Template)
```
map-video-template/
├── src/
│   ├── compositions/          # 核心 Compositions
│   │   ├── MapVideo.tsx       # 基础地图示例
│   │   ├── TrainRoute.tsx     # 高铁路线示例
│   │   ├── NanjingTour.tsx    # 旅游线路示例
│   │   └── README.md          # Composition 开发指南
│   ├── lib/                   # 工具函数库
│   │   ├── animations.ts      # 动画工具
│   │   ├── map-utils.ts       # Mapbox 工具
│   │   └── constants.ts       # 常量定义
│   ├── styles/                # 样式
│   ├── index.tsx              # Composition 注册表
│   └── root.tsx               # Remotion 入口
├── .env.example               # 环境变量模板
├── package.json               # 依赖清单
├── tsconfig.json              # TypeScript 配置
├── remotion.config.ts         # Remotion 配置
└── README.md                  # 项目文档
```

### 2. 核心组件库 (Component Library)
- **MapVideo** - 基础地图相机动画
- **TrainRoute** - 高铁路线 + 站点标记
- **NanjingTour** - 完整旅游路线示例
- **MapMarker** - 可复用的标记组件
- **RouteAnimation** - 路线动画引擎

### 3. 工具函数库 (Utilities)

#### 动画工具
```typescript
// lib/animations.ts
export const createEasing = (duration: number) => {...}
export const bounceAnimation = (frame, durationFrames) => {...}
export const springAnimation = (frame, config) => {...}
```

#### Mapbox 工具
```typescript
// lib/map-utils.ts
export const createMapboxStyle = (style: 'light' | 'dark' | 'outdoors') => {...}
export const calculateRoute = (startCoord, endCoord) => {...}
export const createGeoJSONLayer = (coordinates) => {...}
```

#### 数据工具
```typescript
// lib/route-builder.ts
export class RouteBuilder {
  addWaypoint(coord: [number, number], label: string) {...}
  build() {...}
}
```

### 4. 最佳实践文档
- ✅ **确定性约束处理**
- ✅ **异步 Mapbox 加载**
- ✅ **Frame-based 动画模式**
- ✅ **性能优化**
- ✅ **常见错误排查**

### 5. 配置模板
- `remotion.config.ts` - Remotion 默认配置
- `.env.example` - Mapbox Token 配置
- `tsconfig.json` - TypeScript 严格模式

---

## 🚀 快速开始指南

### 步骤1：初始化项目
```bash
# 方式A：克隆模板
git clone https://github.com/YOUR_ORG/map-video-template.git
cd map-video-template

# 方式B：使用 CLI
npx create-map-video-app my-project
cd my-project
```

### 步骤2：配置 Mapbox Token
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env，填入你的 Mapbox Token
REMOTION_MAPBOX_TOKEN=pk.your_token_here
```

### 步骤3：安装依赖
```bash
npm install
```

### 步骤4：启动开发预览
```bash
npm run dev
```

### 步骤5：创建第一个地图视频

**新建文件：** `src/compositions/MyFirstMap.tsx`

```typescript
import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Map, Marker } from 'react-map-gl/mapbox';
import { delayRender, continueRender } from 'remotion';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MyFirstMap = () => {
  const [mapReady, setMapReady] = React.useState(false);
  const handle = React.useRef(delayRender());
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 摄像头缓动：从北京到上海
  const startLng = 116.4074; // 北京
  const startLat = 39.9042;
  const endLng = 121.4737;   // 上海
  const endLat = 31.2304;

  const progress = Math.min(frame / 300, 1); // 300 帧完成过渡
  const lng = startLng + (endLng - startLng) * progress;
  const lat = startLat + (endLat - startLat) * progress;

  return (
    <Map
      mapboxAccessToken={process.env.REMOTION_MAPBOX_TOKEN}
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 8,
      }}
      onLoad={() => {
        setMapReady(true);
        continueRender(handle.current);
      }}
      style={{ width: '100%', height: '100%' }}
    />
  );
};
```

**注册到** `src/index.tsx`：
```typescript
import { registerRoot } from 'remotion';
import { Root } from './root';

registerRoot(Root);

// 在 compositions 中添加
export { MyFirstMap } from './compositions/MyFirstMap';
```

**渲染视频：**
```bash
npx remotion render src/root.tsx MyFirstMap out/my-first-map.mp4
```

---

## 📚 完整文档链接

- [核心概念](./docs/01-core-concepts.md)
- [Mapbox 集成指南](./docs/02-mapbox-integration.md)
- [动画系统](./docs/03-animation-system.md)
- [常见问题](./docs/04-faq.md)
- [API 参考](./docs/05-api-reference.md)
- [性能优化](./docs/06-performance.md)

---

## 🔧 常用命令

```bash
# 开发预览
npm run dev

# 渲染单个 Composition
npm run render -- MyFirstMap out/video.mp4

# 渲染所有 Compositions
npm run render

# 生成缩略图
npm run render -- MyFirstMap out/thumb.png --still --frame 0
```

---

## 🎨 示例 Compositions

本模板包含 3 个完整示例：

### 1. MapVideo (10 秒)
北京 → 东京的相机动画，演示基础地图功能

### 2. TrainRoute (20 秒)
赛博朋克风格高铁，包含：
- 霓虹发光路线
- 实时速度表
- 站点闪光特效
- 高铁图标

### 3. NanjingTour (30 秒)
南京五日游完整案例，包含：
- 5 天行程标记
- 10 个景点线路
- 汽车跳跃动画
- 进度条显示

---

## 🛠️ 技能特性

### ✅ 已支持
- Frame-based 确定性动画
- Mapbox GL 地图集成
- 异步加载处理
- TypeScript 完全支持
- 自定义路线和标记
- 多种地图风格（Light, Dark, Outdoors）
- 高性能渲染（600+ 帧）

### 📋 规划中的功能
- 3D 地形支持
- 实时数据可视化
- 多语言标签
- 自定义主题系统

---

## 📦 依赖版本

```json
{
  "dependencies": {
    "remotion": "^4.0.0",
    "react": "^18.3.0",
    "react-map-gl": "^8.1.0",
    "mapbox-gl": "^3.21.0"
  },
  "devDependencies": {
    "@remotion/cli": "^4.0.0",
    "typescript": "^5.4.0"
  }
}
```

---

## 🤝 贡献和反馈

- 📝 [Issue 模板](./ISSUE_TEMPLATE.md)
- 🔄 [PR 流程](./CONTRIBUTING.md)
- 💬 [讨论区](./discussions)

---

## 📄 许可证

MIT

---

## 🎓 学习资源

- [Remotion 官方文档](https://www.remotion.dev/)
- [Mapbox GL 文档](https://docs.mapbox.com/mapbox-gl-js/)
- [React 18 文档](https://react.dev/)

