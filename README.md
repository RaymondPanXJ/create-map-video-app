# 🗺️ Create Map Video App

> 一键创建 Remotion + Mapbox 地图视频项目的 CLI 工具

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D16-brightgreen)](package.json)

## ⚡ 快速开始

```bash
# 一键创建项目
npx create-map-video-app my-map-project

# 进入项目
cd my-map-project

# 安装依赖
npm install

# 配置 Mapbox Token
cp .env.example .env
# 编辑 .env，填入你的 Mapbox Token

# 启动预览
npm run dev
```

打开浏览器访问 http://localhost:3000 👀

## 📦 功能特性

✅ **一键启动** - 3 条命令快速开始
✅ **自动生成** - CLI 自动生成完整项目骨架
✅ **预配置** - 所有依赖和配置预装
✅ **完整示例** - 即插即用的示例代码
✅ **工具库** - 动画工具函数库 + 常用常量
✅ **深度文档** - 7 份组织化文档
✅ **最佳实践** - Remotion + Mapbox 经验总结
✅ **社区友好** - 可发布到 npm 生态

## 📚 文档指南

| 文档 | 说明 | 用时 |
|------|------|------|
| [**README_SKILL_PACKAGE.md**](./README_SKILL_PACKAGE.md) | 技能包主入口 | 5 min |
| [**QUICK_START.md**](./QUICK_START.md) | 30秒快速参考卡 | 5 min |
| [**HOW_TO_USE_THIS_SKILL.md**](./HOW_TO_USE_THIS_SKILL.md) | 详细使用指南（3 种场景） | 10 min |
| [**docs-core-concepts.md**](./docs-core-concepts.md) | 核心概念深度文档 | 30 min |
| [**SKILL_PACKAGE.md**](./SKILL_PACKAGE.md) | 完整功能说明 | 20 min |
| [**DISTRIBUTION_GUIDE.md**](./DISTRIBUTION_GUIDE.md) | npm/GitHub 发布指南 | 30 min |
| [**SKILL_SUMMARY.md**](./SKILL_SUMMARY.md) | 项目交付物总结 | 10 min |

## 🎯 3 分钟创建地图视频

### 第 1 步：创建项目
```bash
npx create-map-video-app demo
cd demo
npm install
```

### 第 2 步：编辑地图
编辑 `src/compositions/MapVideo.tsx`，修改坐标：
```typescript
// 从北京到上海
const startLng = 116.4074;  // 北京
const endLng = 121.4737;    // 上海
```

### 第 3 步：预览
```bash
npm run dev
```

### 第 4 步：渲染
```bash
npm run render -- MapVideo out/video.mp4
```

✅ 完成！你创建了第一个地图视频 🎉

## 🚀 使用方式

### 方式 1：npm 包（推荐）
```bash
npx create-map-video-app my-project
```

### 方式 2：GitHub 模板
1. 访问 [create-map-video-app](https://github.com/RaymondPanXJ/create-map-video-app)
2. 点击 "Use this template"
3. Clone 到本地

### 方式 3：本地 CLI
```bash
node create-map-video-app.js my-project
```

## 📂 项目结构

自动生成的项目包含：
```
my-map-project/
├── src/
│   ├── compositions/      # Composition 组件
│   │   └── MapVideo.tsx   # 示例：北京→上海→杭州
│   ├── lib/
│   │   ├── animations.ts  # 动画工具库
│   │   └── constants.ts   # 常用常量（城市坐标、风格等）
│   ├── root.tsx           # Remotion 入口
│   └── index.tsx          # 注册表
├── .env.example           # 环境变量模板
├── remotion.config.ts     # Remotion 配置
├── tsconfig.json          # TypeScript 配置
└── package.json           # 依赖清单
```

## 🛠️ CLI 工具说明

### 生成的项目包含

| 文件 | 说明 |
|------|------|
| `create-map-video-app.js` | CLI 脚手架工具 |
| `package.json` | 预配置的 npm 依赖 |
| `src/` | 项目源码 |
| `.env.example` | 环境变量模板 |
| 完整文档 | 7 份深度文档 |

## 📖 学习资源

### 推荐学习路径

**初级（1 小时）**
- [QUICK_START.md](./QUICK_START.md)
- 创建第一个项目
- 修改坐标预览

**中级（3 小时）**
- [docs-core-concepts.md](./docs-core-concepts.md)
- 创建自己的 Composition
- 使用工具函数库

**高级（1 天）**
- [Remotion 官方文档](https://www.remotion.dev/)
- [Mapbox GL 文档](https://docs.mapbox.com/mapbox-gl-js/)
- 创建复杂动画

## 🔧 常用命令

```bash
# 开发预览
npm run dev

# 强制新实例
npm run dev:force

# 渲染单个视频
npm run render -- MapVideo out/video.mp4

# 渲染所有视频
npm run render:all

# 构建静态文件
npm run build
```

## ❓ 常见问题

**Q: 需要什么前置知识？**
A: 基本的 JavaScript/React 知识，理解 API Token 概念

**Q: 渲染需要多长时间？**
A: 取决于分辨率和复杂度。1080p 30 秒视频约 15 分钟

**Q: 如何获取 Mapbox Token？**
A: 访问 https://account.mapbox.com/tokens/ 创建新 Token

**Q: 可以用哪些地图风格？**
A: Light, Dark, Outdoors, Satellite（见文档中的预设）

**Q: 支持多个 Composition 吗？**
A: 是的！在 `src/compositions/` 添加文件，在 `root.tsx` 注册

## 🎓 核心概念

### Frame-Based 动画
Remotion 中所有动画都基于帧号驱动：
```typescript
const frame = useCurrentFrame();
const progress = frame / totalFrames;
```

### Mapbox 地图
使用 `react-map-gl/mapbox` 集成地图：
```typescript
<Map
  mapboxAccessToken={token}
  initialViewState={{ longitude, latitude, zoom }}
/>
```

### 确定性约束
所有代码必须是确定性的（不能用 `Math.random()`）：
```typescript
// ✅ 确定性随机
import { random } from 'remotion';
const value = random('unique-seed');

// ❌ 非确定性（不允许）
const value = Math.random();
```

## 🔗 相关链接

- [Remotion 官方文档](https://www.remotion.dev/)
- [Mapbox GL JS 文档](https://docs.mapbox.com/mapbox-gl-js/)
- [React 18 文档](https://react.dev/)
- [获取 Mapbox Token](https://account.mapbox.com/tokens/)
- [Mapbox 风格编辑器](https://studio.mapbox.com/)

## 💡 应用场景

🚗 **物流追踪** - 显示配送路线
🌍 **地区覆盖** - 展示业务扩张
✈️ **旅游路线** - 景点分布图
📊 **数据可视化** - 地理信息分析
🎬 **营销视频** - 品牌推广动画

## 📦 技术栈

- **Remotion** v4 - 视频渲染框架
- **React** 18 - UI 库
- **Mapbox GL** - 地图引擎
- **TypeScript** - 类型安全
- **Vite** - 构建工具

## 📊 性能数据

| 指标 | 数值 |
|------|------|
| 项目启动 | < 5 秒 |
| 首次渲染 | < 1 分钟（1080p） |
| 完整视频 | 15-30 分钟（取决于复杂度） |

## 🤝 贡献指南

欢迎提交 Issue 和 PR！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

## 📝 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🎬 现在就开始吧

```bash
$ npx create-map-video-app my-first-map-video
$ cd my-first-map-video
$ npm install
$ npm run dev
```

然后访问 http://localhost:3000 👀

---

**创建于** 2026-04-14
**版本** 1.0.0
**作者** [RaymondPanXJ](https://github.com/RaymondPanXJ)

🚀 准备好创建精彩的地图视频了吗？
