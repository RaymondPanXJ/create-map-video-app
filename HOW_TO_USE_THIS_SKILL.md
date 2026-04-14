# 🎓 如何使用这个技能包

## 🎯 三种使用场景

### 📌 场景 A：我想立即创建一个地图视频项目

**所需时间：** 5 分钟

```bash
# 1️⃣ 一键创建项目
npx create-map-video-app my-awesome-map

# 2️⃣ 进入项目
cd my-awesome-map

# 3️⃣ 安装依赖
npm install

# 4️⃣ 配置 Mapbox Token
cp .env.example .env
# 编辑 .env，填入你的 Token（从 https://account.mapbox.com/tokens/ 获取）

# 5️⃣ 启动开发预览
npm run dev
# 浏览器打开 http://localhost:3000
```

✅ 完成！你已经有一个可运行的地图动画项目

---

### 📌 场景 B：我是开发者，想学习如何构建地图视频

**所需时间：** 30 分钟

**第1部分：理解基础概念（10 分钟）**
```bash
# 读这个文件
open docs-core-concepts.md

# 或者看快速参考卡
open QUICK_START.md
```

**第2部分：创建你的第一个动画（20 分钟）**
```bash
# 复制示例
npx create-map-video-app learning-project
cd learning-project
npm install

# 编辑示例 composition
code src/compositions/MapVideo.tsx

# 调整坐标、缓动参数等
# 保存后，浏览器自动刷新预览
```

**关键文件：**
- `docs-core-concepts.md` - Remotion 和 Mapbox 核心概念
- `src/lib/animations.ts` - 动画工具函数库
- `src/lib/constants.ts` - 预定义坐标和风格

---

### 📌 场景 C：我是技术主管，想为团队标准化这个技能

**所需时间：** 1 小时

**第1步：发布 npm 包（可选，5 分钟）**
```bash
cd /path/to/skill-package
npm login
npm publish

# 之后你的团队可以用
npm install create-map-video-app
```

**第2步：创建 GitHub 模板仓库（10 分钟）**
1. 在 GitHub 创建新仓库 `map-video-template`
2. Push 项目代码
3. Settings → 勾选 "Template repository"
4. 团队成员点击 "Use this template"

**第3步：建立团队工作流（30 分钟）**
```bash
# 在项目 README 中添加团队指南
# 配置 CI/CD 自动渲染和验证
# 设置代码审查规则
```

**参考文件：**
- `DISTRIBUTION_GUIDE.md` - 详细发布指南
- `.github/workflows/` - CI/CD 配置示例

---

## 📚 文档导航地图

```
🗺️ 你在这里
│
├─ 想快速开始？
│  └─ QUICK_START.md ⭐ 30 秒掌握
│
├─ 想了解能做什么？
│  └─ SKILL_PACKAGE.md ⭐ 完整功能说明
│
├─ 想学习原理？
│  ├─ docs-core-concepts.md (Remotion + Mapbox 概念)
│  ├─ src/lib/animations.ts (动画工具库)
│  └─ src/lib/constants.ts (常用常量)
│
├─ 想看示例？
│  ├─ src/compositions/MapVideo.tsx (基础地图)
│  ├─ 历史版本中的 TrainRoute.tsx (高铁路线)
│  └─ 历史版本中的 NanjingTour.tsx (旅游路线)
│
├─ 想发布给他人？
│  ├─ DISTRIBUTION_GUIDE.md (npm + GitHub)
│  ├─ create-package-json.json (npm 包配置)
│  └─ create-map-video-app.js (CLI 实现)
│
└─ 想看完整总结？
   └─ SKILL_SUMMARY.md
```

---

## 🎬 最小化示例（复制即用）

### 示例 1：简单的地图平移

**文件：** `src/compositions/SimplePan.tsx`

```typescript
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Map, Marker } from 'react-map-gl/mapbox';
import { delayRender, continueRender } from 'remotion';
import 'mapbox-gl/dist/mapbox-gl.css';

export const SimplePan = () => {
  const handle = React.useRef(delayRender());
  const frame = useCurrentFrame();

  // 从北京到上海 300 帧（10 秒 @30fps）
  const progress = Math.min(frame / 300, 1);
  const lng = 116.4074 + (121.4737 - 116.4074) * progress;
  const lat = 39.9042 + (31.2304 - 39.9042) * progress;

  return (
    <Map
      mapboxAccessToken={process.env.REMOTION_MAPBOX_TOKEN}
      initialViewState={{ longitude: lng, latitude: lat, zoom: 8 }}
      onLoad={() => continueRender(handle.current)}
      mapStyle="mapbox://styles/mapbox/light-v11"
      style={{ width: '100%', height: '100%' }}
    >
      <Marker longitude={116.4074} latitude={39.9042}>
        <div>🏙️ 北京</div>
      </Marker>
      <Marker longitude={121.4737} latitude={31.2304}>
        <div>🌆 上海</div>
      </Marker>
    </Map>
  );
};
```

**注册到 `root.tsx`：**
```typescript
<Composition
  id="SimplePan"
  component={SimplePan}
  durationInFrames={300}
  fps={30}
  width={1920}
  height={1080}
/>
```

**运行：**
```bash
npm run dev
# 访问 http://localhost:3000
npm run render -- SimplePan out/simple-pan.mp4
```

---

### 示例 2：带缓动的地图缩放

**文件：** `src/compositions/ZoomAnimation.tsx`

```typescript
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { interpolate } from 'remotion';
import { Map } from 'react-map-gl/mapbox';
import { delayRender, continueRender } from 'remotion';
import 'mapbox-gl/dist/mapbox-gl.css';

export const ZoomAnimation = () => {
  const handle = React.useRef(delayRender());
  const frame = useCurrentFrame();

  // 从 zoom 5 缩放到 zoom 15
  const zoom = interpolate(frame, [0, 300], [5, 15], {
    easing: (t) => t * t, // 加速缓动
  });

  return (
    <Map
      mapboxAccessToken={process.env.REMOTION_MAPBOX_TOKEN}
      initialViewState={{
        longitude: 120,
        latitude: 30,
        zoom: zoom,
      }}
      onLoad={() => continueRender(handle.current)}
      mapStyle="mapbox://styles/mapbox/outdoors-v12"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
```

---

## 🔧 常见任务速查

| 我想... | 怎么做 |
|---------|--------|
| **改变地图风格** | 改 `mapStyle` 属性值（见 QUICK_START.md） |
| **添加标记** | 使用 `<Marker>` 组件（见示例） |
| **绘制路线** | 使用 `<Source>` + `<Layer>`（见 docs） |
| **添加文字标题** | 在 Map 外层用 `<div>` 覆盖（绝对定位） |
| **调整动画速度** | 改 `durationInFrames`（越小越快） |
| **改变分辨率** | 改 `width` 和 `height` |
| **修改帧率** | 改 `fps`（24/30/60） |

---

## 🎯 学习路径

### 初级（1 小时）
- [ ] 阅读 QUICK_START.md
- [ ] 运行 `npx create-map-video-app test`
- [ ] 修改示例中的坐标
- [ ] 渲染第一个视频

### 中级（3 小时）
- [ ] 阅读 docs-core-concepts.md
- [ ] 理解 frame-based 动画
- [ ] 创建自己的 Composition
- [ ] 使用工具函数库

### 高级（1 天）
- [ ] 阅读 Remotion 官方文档
- [ ] 阅读 Mapbox GL 官方文档
- [ ] 创建复杂的多图层动画
- [ ] 优化性能

---

## 💻 命令速查

```bash
# 项目设置
npm install                    # 安装依赖
cp .env.example .env          # 复制环境文件

# 开发
npm run dev                    # 启动预览（浏览器）
npm run dev:force             # 强制新实例
npm run build                 # 构建静态文件

# 渲染
npm run render -- MapVideo out/video.mp4    # 渲染单个
npm run render:all                          # 渲染所有
```

---

## 🆘 遇到问题？

| 问题 | 解决 | 文档 |
|------|------|------|
| Token 报错 | 检查 .env 前缀是 `REMOTION_` | QUICK_START.md |
| 地图不显示 | 检查 Token 有效性，网络连接 | docs-core-concepts.md |
| 端口被占用 | 用 `npm run dev:force` | MEMORY.md |
| 不知道怎么写 | 看 `src/compositions/` 示例 | src/compositions/ |
| 性能太慢 | 降低分辨率测试，然后优化 | SKILL_PACKAGE.md |

---

## 📖 推荐阅读顺序

```
Day 1: 快速上手
  1. QUICK_START.md (5 分钟)
  2. 创建第一个项目 (3 分钟)
  3. 修改坐标看效果 (5 分钟)

Day 2: 理解原理
  1. docs-core-concepts.md (30 分钟)
  2. 看示例代码 (20 分钟)
  3. 自己写一个 Composition (30 分钟)

Week 2: 掌握技能
  1. SKILL_PACKAGE.md (20 分钟)
  2. 学习 Remotion 官方文档 (1 小时)
  3. 学习 Mapbox GL 官方文档 (1 小时)
  4. 创建实战项目 (随意)

Month 1: 成为专家
  1. 贡献示例
  2. 分享心得
  3. 优化工具库
```

---

## 🤝 获取帮助

1. **官方文档**
   - Remotion: https://www.remotion.dev/
   - Mapbox: https://docs.mapbox.com/mapbox-gl-js/

2. **本地文档**
   - docs-core-concepts.md
   - QUICK_START.md

3. **社区**
   - GitHub Issues
   - Stack Overflow 标签 `remotion-mapbox`

---

## ✅ 现在你已经可以

1. ✅ 快速创建地图视频项目
2. ✅ 理解 Remotion + Mapbox 原理
3. ✅ 自定义动画和路线
4. ✅ 渲染高质量视频
5. ✅ 复用工具函数库
6. ✅ 与团队分享标准化项目

---

## 🚀 下一步

- [ ] 创建你的第一个项目
- [ ] 修改坐标测试
- [ ] 渲染视频
- [ ] 分享给团队
- [ ] 反馈改进意见

**准备好开始了吗？**

```bash
npx create-map-video-app my-first-map-video
cd my-first-map-video
npm install
npm run dev
```

🎬 创建精彩的地图视频吧！
