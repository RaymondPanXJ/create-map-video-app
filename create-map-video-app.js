#!/usr/bin/env node

/**
 * Create Map Video App - CLI 脚手架工具
 *
 * 使用方式：
 *   npx create-map-video-app my-project
 *   npm create map-video-app -- my-project
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectName = process.argv[2];

if (!projectName) {
  console.error('❌ 项目名称不能为空');
  console.error('用法: npx create-map-video-app <project-name>');
  process.exit(1);
}

const projectPath = path.resolve(projectName);

if (fs.existsSync(projectPath)) {
  console.error(`❌ 目录 "${projectName}" 已存在`);
  process.exit(1);
}

console.log(`\n🗺️  正在创建地图视频项目: ${projectName}`);
console.log('━'.repeat(50));

// 创建项目目录结构
const dirs = [
  'src/compositions',
  'src/lib',
  'src/styles',
  'public',
  'out',
];

// 创建目录
fs.mkdirSync(projectPath, { recursive: true });
dirs.forEach(dir => {
  fs.mkdirSync(path.join(projectPath, dir), { recursive: true });
});

console.log('✅ 目录结构已创建');

// 创建 package.json
const packageJson = {
  name: projectName,
  version: '0.1.0',
  private: true,
  scripts: {
    dev: 'remotion preview',
    'dev:force': 'remotion preview --force-new',
    render: 'remotion render',
    'render:all': 'remotion render src/root.tsx out/',
    build: 'remotion bundle',
  },
  dependencies: {
    'mapbox-gl': '^3.21.0',
    'react': '^18.3.1',
    'react-dom': '^18.3.1',
    'react-map-gl': '^8.1.1',
    'remotion': '^4.0.448',
  },
  devDependencies: {
    '@remotion/cli': '^4.0.448',
    '@types/mapbox-gl': '^3.4.1',
    '@types/react': '^18.3.3',
    '@types/react-dom': '^18.3.0',
    'typescript': '^5.4.5',
  },
};

fs.writeFileSync(
  path.join(projectPath, 'package.json'),
  JSON.stringify(packageJson, null, 2)
);

console.log('✅ package.json 已创建');

// 创建 tsconfig.json
const tsconfig = {
  compilerOptions: {
    target: 'ES2022',
    lib: ['ES2022', 'DOM', 'DOM.Iterable'],
    jsx: 'react-jsx',
    module: 'ESNext',
    moduleResolution: 'bundler',
    esModuleInterop: true,
    skipLibCheck: true,
    forceConsistentCasingInFileNames: true,
    resolveJsonModule: true,
    strict: true,
    isolatedModules: true,
  },
  include: ['src/**/*'],
  exclude: ['node_modules', 'out'],
};

fs.writeFileSync(
  path.join(projectPath, 'tsconfig.json'),
  JSON.stringify(tsconfig, null, 2)
);

console.log('✅ tsconfig.json 已创建');

// 创建 .env.example
const envExample = `# Mapbox Token
# 获取地址: https://account.mapbox.com/tokens/
REMOTION_MAPBOX_TOKEN=pk.your_token_here

# 可选：其他配置
# NODE_ENV=development
`;

fs.writeFileSync(
  path.join(projectPath, '.env.example'),
  envExample
);

console.log('✅ .env.example 已创建');

// 创建 .gitignore
const gitignore = `# Dependencies
node_modules/
package-lock.json
yarn.lock

# Environment
.env
.env.local
.env.*.local

# Build output
dist/
out/
build/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Remotion
.remotion-tmp/
`;

fs.writeFileSync(
  path.join(projectPath, '.gitignore'),
  gitignore
);

console.log('✅ .gitignore 已创建');

// 创建 remotion.config.ts
const remotionConfig = `import { Config } from "remotion";

Config.setFrameRate(30);
Config.setWidth(1920);
Config.setHeight(1080);
Config.setDurationInFrames(300);
`;

fs.writeFileSync(
  path.join(projectPath, 'remotion.config.ts'),
  remotionConfig
);

console.log('✅ remotion.config.ts 已创建');

// 创建 src/root.tsx
const rootTsx = `import { Composition } from "remotion";
import { MapVideo } from "./compositions/MapVideo";

export const Root = () => {
  return (
    <>
      <Composition
        id="MapVideo"
        component={MapVideo}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
`;

fs.writeFileSync(
  path.join(projectPath, 'src/root.tsx'),
  rootTsx
);

console.log('✅ src/root.tsx 已创建');

// 创建 src/index.tsx
const indexTsx = `import { registerRoot } from "remotion";
import { Root } from "./root";

registerRoot(Root);
`;

fs.writeFileSync(
  path.join(projectPath, 'src/index.tsx'),
  indexTsx
);

console.log('✅ src/index.tsx 已创建');

// 创建示例 Composition: MapVideo.tsx
const mapVideoTsx = `import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import { Map, Marker } from 'react-map-gl/mapbox';
import { delayRender, continueRender } from 'remotion';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapVideo = () => {
  const [mapReady, setMapReady] = React.useState(false);
  const handle = React.useRef(delayRender());
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 摄像头动画：北京 → 上海 → 杭州
  const keyframes = [
    { lng: 116.4074, lat: 39.9042, zoom: 8, frame: 0 },     // 北京
    { lng: 121.4737, lat: 31.2304, zoom: 10, frame: 150 },  // 上海
    { lng: 120.1551, lat: 30.2741, zoom: 12, frame: 300 },  // 杭州
  ];

  let currentLng = keyframes[0].lng;
  let currentLat = keyframes[0].lat;
  let currentZoom = keyframes[0].zoom;

  for (let i = 0; i < keyframes.length - 1; i++) {
    const kf1 = keyframes[i];
    const kf2 = keyframes[i + 1];

    if (frame >= kf1.frame && frame <= kf2.frame) {
      const duration = kf2.frame - kf1.frame;
      const progress = (frame - kf1.frame) / duration;

      currentLng = kf1.lng + (kf2.lng - kf1.lng) * progress;
      currentLat = kf1.lat + (kf2.lat - kf1.lat) * progress;
      currentZoom = kf1.zoom + (kf2.zoom - kf1.zoom) * progress;
      break;
    }
  }

  return (
    <Map
      mapboxAccessToken={process.env.REMOTION_MAPBOX_TOKEN}
      initialViewState={{
        longitude: currentLng,
        latitude: currentLat,
        zoom: currentZoom,
      }}
      onLoad={() => {
        setMapReady(true);
        continueRender(handle.current);
      }}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: '100%', height: '100%' }}
    >
      {/* 添加标记示例 */}
      <Marker longitude={116.4074} latitude={39.9042}>
        <div style={{ fontSize: '24px' }}>🏙️</div>
      </Marker>
      <Marker longitude={121.4737} latitude={31.2304}>
        <div style={{ fontSize: '24px' }}>🌆</div>
      </Marker>
      <Marker longitude={120.1551} latitude={30.2741}>
        <div style={{ fontSize: '24px' }}>🏞️</div>
      </Marker>
    </Map>
  );
};
`;

fs.writeFileSync(
  path.join(projectPath, 'src/compositions/MapVideo.tsx'),
  mapVideoTsx
);

console.log('✅ src/compositions/MapVideo.tsx 已创建');

// 创建 README.md
const readme = `# 🗺️ ${projectName}

基于 Remotion 和 Mapbox GL 的地图视频渲染项目

## 📦 快速开始

### 1. 安装依赖
\`\`\`bash
npm install
\`\`\`

### 2. 配置 Mapbox Token
\`\`\`bash
cp .env.example .env
# 编辑 .env，填入你的 Mapbox Token
# 获取地址: https://account.mapbox.com/tokens/
\`\`\`

### 3. 开发预览
\`\`\`bash
npm run dev
# 或使用强制新实例
npm run dev:force
\`\`\`

### 4. 渲染视频
\`\`\`bash
# 渲染单个 Composition
npm run render -- MapVideo out/video.mp4

# 渲染所有 Compositions
npm run render:all
\`\`\`

## 📁 项目结构

\`\`\`
${projectName}/
├── src/
│   ├── compositions/     # 视频 Compositions
│   ├── lib/              # 工具函数和常量
│   ├── styles/           # 样式文件
│   ├── root.tsx          # Remotion 入口
│   └── index.tsx         # 注册表
├── out/                  # 渲染输出目录
├── .env.example          # 环境变量模板
├── package.json
├── tsconfig.json
└── remotion.config.ts    # Remotion 配置
\`\`\`

## 🎨 创建第一个地图视频

编辑 \`src/compositions/MapVideo.tsx\`：

\`\`\`typescript
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Map, Marker } from 'react-map-gl/mapbox';

export const MyMap = () => {
  const frame = useCurrentFrame();

  // 动画逻辑...

  return (
    <Map
      mapboxAccessToken={process.env.REMOTION_MAPBOX_TOKEN}
      // 你的地图配置
    >
      {/* 添加标记、图层等 */}
    </Map>
  );
};
\`\`\`

## 📚 文档链接

- [Remotion 官方文档](https://www.remotion.dev/)
- [Mapbox GL JS 文档](https://docs.mapbox.com/mapbox-gl-js/)
- [React 18 文档](https://react.dev/)

## 🛠️ 技术栈

- **Remotion** v4 - 视频渲染框架
- **React** 18 - UI 库
- **Mapbox GL** - 地图引擎
- **TypeScript** - 类型安全
- **Vite** - 构建工具

## ⚙️ 常用命令

\`\`\`bash
# 开发模式
npm run dev

# 构建 bundle
npm run build

# 渲染视频
npm run render
\`\`\`

## 🔗 相关资源

- [地图视频技能包文档](../SKILL_PACKAGE.md)
- [示例 Compositions](./src/compositions)

## 📝 许可证

MIT

---

创建于 $(date) 使用 create-map-video-app 🎬
`;

fs.writeFileSync(
  path.join(projectPath, 'README.md'),
  readme
);

console.log('✅ README.md 已创建');

// 创建 lib/animations.ts
const animationsLib = `/**
 * 动画工具库
 * 提供常用的动画函数和缓动效果
 */

import { interpolate, spring } from 'remotion';

export const easeInOutCubic = (t: number): number => {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
};

export const easeOutQuad = (t: number): number => {
  return 1 - (1 - t) * (1 - t);
};

export const lerp = (start: number, end: number, t: number): number => {
  return start + (end - start) * t;
};

/**
 * 创建弹簧动画
 */
export const createSpringAnimation = (
  frame: number,
  from: number,
  to: number,
  fps: number = 30,
  config = { damping: 10, mass: 1, stiffness: 100 }
) => {
  return spring({
    fps,
    frame,
    from,
    to,
    config,
  });
};

/**
 * 创建淡入淡出效果
 */
export const fadeInOut = (
  frame: number,
  totalFrames: number,
  fadeInFrames: number = 30,
  fadeOutFrames: number = 30
): number => {
  const fadeOutStart = totalFrames - fadeOutFrames;

  if (frame < fadeInFrames) {
    return interpolate(frame, [0, fadeInFrames], [0, 1], { extrapolateLeft: 'clamp' });
  }
  if (frame > fadeOutStart) {
    return interpolate(frame, [fadeOutStart, totalFrames], [1, 0], { extrapolateRight: 'clamp' });
  }
  return 1;
};

/**
 * 创建匀速移动
 */
export const linearMove = (
  frame: number,
  duration: number,
  from: number,
  to: number
): number => {
  return interpolate(frame, [0, duration], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
};
`;

fs.writeFileSync(
  path.join(projectPath, 'src/lib/animations.ts'),
  animationsLib
);

console.log('✅ src/lib/animations.ts 已创建');

// 创建 lib/constants.ts
const constantsLib = `/**
 * 常量定义
 */

export const MAPBOX_STYLES = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  outdoors: 'mapbox://styles/mapbox/outdoors-v12',
  satellite: 'mapbox://styles/mapbox/satellite-v9',
  streets: 'mapbox://styles/mapbox/streets-v12',
} as const;

export const DEFAULT_CONFIG = {
  fps: 30,
  width: 1920,
  height: 1080,
  durationFrames: 300,
} as const;

// 主要城市坐标
export const CITIES = {
  beijing: { lng: 116.4074, lat: 39.9042 },
  shanghai: { lng: 121.4737, lat: 31.2304 },
  hangzhou: { lng: 120.1551, lat: 30.2741 },
  nanjing: { lng: 118.7969, lat: 32.0603 },
  shenzhen: { lng: 114.0579, lat: 22.5431 },
  chengdu: { lng: 104.0658, lat: 30.5728 },
} as const;

export const COLORS = {
  primary: '#00ff88',      // 青绿
  secondary: '#00ffff',    // 青蓝
  accent: '#ff00ff',       // 品红
  warning: '#ffff00',      // 黄
  success: '#00ff00',      // 绿
  error: '#ff0000',        // 红
} as const;
`;

fs.writeFileSync(
  path.join(projectPath, 'src/lib/constants.ts'),
  constantsLib
);

console.log('✅ src/lib/constants.ts 已创建');

// 打印成功信息
console.log('\n' + '━'.repeat(50));
console.log('✨ 项目创建成功！\n');
console.log(\`📁 项目路径: \${projectPath}\`);
console.log('\n📋 接下来的步骤:\n');
console.log(\`1. 进入项目目录:\`);
console.log(\`   cd \${projectName}\`);
console.log(\`\n2. 安装依赖:\`);
console.log(\`   npm install\`);
console.log(\`\n3. 配置 Mapbox Token:\`);
console.log(\`   cp .env.example .env\`);
console.log(\`   # 编辑 .env，填入你的 Mapbox Token\`);
console.log(\`\n4. 启动开发预览:\`);
console.log(\`   npm run dev\`);
console.log(\`\n5. 渲染视频:\`);
console.log(\`   npm run render -- MapVideo out/video.mp4\`);
console.log(\`\n📚 更多信息请查看: README.md\`);
console.log('━'.repeat(50) + '\n');
