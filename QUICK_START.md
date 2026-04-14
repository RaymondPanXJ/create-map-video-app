# 🚀 快速参考卡

## 3 种一键启动方式

### 方式 1：npm 全局工具（最简单）⭐
```bash
npx create-map-video-app my-map-project
cd my-map-project
npm install
npm run dev
```

### 方式 2：GitHub 模板（最灵活）
1. 访问 https://github.com/YOUR_ORG/map-video-template
2. 点击 **Use this template**
3. Clone 到本地
```bash
git clone https://github.com/YOUR_ORG/map-video-template.git
cd map-video-template
npm install
npm run dev
```

### 方式 3：手动克隆（最稳定）
```bash
git clone https://github.com/YOUR_ORG/map-video-template.git my-project
cd my-project
npm install
cp .env.example .env
# 编辑 .env，填入 Mapbox Token
npm run dev
```

---

## 30 秒配置

```bash
# 1. 复制环境文件
cp .env.example .env

# 2. 获取 Mapbox Token
# 访问：https://account.mapbox.com/tokens/
# 创建新 Token

# 3. 编辑 .env
REMOTION_MAPBOX_TOKEN=pk.your_token_here

# 4. 启动
npm run dev
```

---

## 常用命令速查

```bash
# 开发预览
npm run dev

# 强制新实例
npm run dev:force

# 渲染单个视频
npm run render -- MapVideo out/video.mp4

# 渲染所有视频
npm run render:all

# 生成缩略图
npm run render -- MapVideo out/thumb.png --still

# 生成 static 文件
npm run build
```

---

## 5 分钟第一个地图视频

### 文件：`src/compositions/MyMap.tsx`

```typescript
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Map, Marker } from 'react-map-gl/mapbox';
import { delayRender, continueRender } from 'remotion';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MyMap = () => {
  const [ready, setReady] = React.useState(false);
  const handle = React.useRef(delayRender());
  const frame = useCurrentFrame();

  // 线性动画：北京 → 上海
  const progress = Math.min(frame / 300, 1);
  const lng = 116.4074 + (121.4737 - 116.4074) * progress;
  const lat = 39.9042 + (31.2304 - 39.9042) * progress;

  return (
    <Map
      mapboxAccessToken={process.env.REMOTION_MAPBOX_TOKEN}
      initialViewState={{
        longitude: lng,
        latitude: lat,
        zoom: 8,
      }}
      onLoad={() => {
        setReady(true);
        continueRender(handle.current);
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: '100%', height: '100%' }}
    >
      <Marker longitude={116.4074} latitude={39.9042}>
        <div style={{ fontSize: '32px' }}>🏙️</div>
      </Marker>
      <Marker longitude={121.4737} latitude={31.2304}>
        <div style={{ fontSize: '32px' }}>🌆</div>
      </Marker>
    </Map>
  );
};
```

### 注册：`src/root.tsx`

```typescript
import { Composition } from "remotion";
import { MyMap } from "./compositions/MyMap";

export const Root = () => {
  return (
    <Composition
      id="MyMap"
      component={MyMap}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

### 运行

```bash
npm run dev
# 访问 http://localhost:3000
# 点击 MyMap，预览动画

# 渲染视频
npm run render -- MyMap out/my-map.mp4
```

✅ 完成！30 秒的地图视频 🎬

---

## 常见问题极速解决

| 问题 | 解决 |
|------|------|
| `REMOTION_MAPBOX_TOKEN is undefined` | 检查 .env 文件，确保前缀是 `REMOTION_` |
| `Map doesn't load` | 确认 Token 有效，网络连接正常 |
| `Port 3000 already in use` | 使用 `npm run dev:force` |
| `Blank page in dev` | 检查浏览器控制台错误，查看导入路径 |
| 渲染很慢 | 正常，Mapbox 渲染需要时间。等待或降低分辨率测试 |

---

## 关键概念

### Frame（帧）
```typescript
const frame = useCurrentFrame(); // 0, 1, 2, ..., 299
const { fps } = useVideoConfig();  // 30
const seconds = frame / fps;       // 0, 0.033, 0.066, ..., 10
```

### 动画
```typescript
// 线性：从 A 到 B
const value = startValue + (endValue - startValue) * (frame / totalFrames);

// 或用 interpolate
const value = interpolate(frame, [0, 300], [startValue, endValue]);
```

### Mapbox 坐标
```typescript
// [经度, 纬度]
const beijing = { lng: 116.4074, lat: 39.9042 };
const shanghai = { lng: 121.4737, lat: 31.2304 };
```

### 地图风格
```typescript
// 预设风格 URL
'mapbox://styles/mapbox/light-v11'      // 亮色
'mapbox://styles/mapbox/dark-v11'       // 深色
'mapbox://styles/mapbox/outdoors-v12'   // 户外
'mapbox://styles/mapbox/satellite-v9'   // 卫星
'mapbox://styles/mapbox/streets-v12'    // 街道
```

---

## 项目结构

```
my-map-project/
├── src/
│   ├── compositions/        # 你的视频组件
│   │   └── MyMap.tsx
│   ├── lib/                 # 工具函数
│   │   ├── animations.ts
│   │   └── constants.ts
│   ├── root.tsx             # 注册表
│   └── index.tsx
├── out/                     # 输出视频
├── .env                     # 配置（不提交）
├── .env.example             # 配置模板
├── package.json
├── tsconfig.json
├── remotion.config.ts       # Remotion 配置
└── README.md
```

---

## 下一步学习

1. **概念** → [核心概念](./docs-core-concepts.md)
2. **地图** → [Mapbox 集成](./docs-mapbox-integration.md)
3. **动画** → [动画系统](./docs-animation-system.md)
4. **参考** → [API 参考](./docs-api-reference.md)

---

## 有用的链接

- 📖 [Remotion 官方文档](https://www.remotion.dev/)
- 🗺️ [Mapbox GL 文档](https://docs.mapbox.com/mapbox-gl-js/)
- ⚛️ [React 18 文档](https://react.dev/)
- 🎨 [Mapbox 风格编辑器](https://studio.mapbox.com/)
- 🌍 [地理坐标查询](https://tools.geofabrik.de/)

---

## 获取帮助

- 📝 提交 [Issue](https://github.com/YOUR_ORG/map-video-template/issues)
- 💬 加入 [Discussions](https://github.com/YOUR_ORG/map-video-template/discussions)
- 🔗 查看 [示例项目](https://github.com/YOUR_ORG?type=source)

---

**让我们创建更多精彩的地图视频！** 🗺️✨
