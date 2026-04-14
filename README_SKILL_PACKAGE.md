# 🗺️ Remotion + Mapbox 地图视频技能包

> **将一个成熟的地图视频项目转化为可复用的技能包，让任何人都能一键创建专业级地图视频**

---

## ⚡ 快速开始（3 条命令）

```bash
npx create-map-video-app my-map-project
cd my-map-project
npm install && npm run dev
```

**完成！** 你现在有一个可运行的地图视频项目 🎬

---

## 📦 技能包内容

| 文件 | 说明 | 用时 |
|------|------|------|
| **QUICK_START.md** | 30秒快速参考卡 | 5 min |
| **HOW_TO_USE_THIS_SKILL.md** | 详细使用指南（3种场景） | 10 min |
| **docs-core-concepts.md** | 深度概念文档 | 30 min |
| **SKILL_PACKAGE.md** | 完整功能说明 | 20 min |
| **DISTRIBUTION_GUIDE.md** | npm/GitHub发布指南 | 30 min |
| **create-map-video-app.js** | CLI脚手架工具 | - |
| **示例代码** | src/compositions 示例 | - |

---

## 🎯 三种使用方式

### 方式 1：npm 包（最简单）⭐
```bash
# 全球任何人都能用
npx create-map-video-app my-project
```

### 方式 2：GitHub 模板（最灵活）
```bash
# 1. 创建 GitHub 模板仓库
# 2. 用户点击 "Use this template"
# 3. Clone 到本地
```

### 方式 3：CLI 工具（本地）
```bash
# 直接运行脚手架
node create-map-video-app.js my-project
```

---

## 📚 文档导航

### 🚀 想快速开始？
→ **QUICK_START.md** (5分钟)

### 👨‍💻 我是开发者，想学习
→ **HOW_TO_USE_THIS_SKILL.md** → **docs-core-concepts.md**

### 👨‍💼 我是团队主管，想标准化
→ **DISTRIBUTION_GUIDE.md**

### 📖 我想看完整说明
→ **SKILL_PACKAGE.md**

### 🎓 我想看学习路径
→ **HOW_TO_USE_THIS_SKILL.md** (包含初级/中级/高级路径)

---

## 🎬 最小化示例

### 5 分钟创建地图动画

**1. 创建项目**
```bash
npx create-map-video-app demo
cd demo && npm install
```

**2. 编辑 `src/compositions/MapVideo.tsx`**
```typescript
// 修改坐标
const startLng = 116.4074; // 北京
const endLng = 121.4737;   // 上海
```

**3. 预览**
```bash
npm run dev
# 打开 http://localhost:3000
```

**4. 渲染**
```bash
npm run render -- MapVideo out/video.mp4
```

✅ 完成！你创建了第一个地图视频 🎉

---

## 💡 核心特性

✅ **一键启动** - 3 条命令快速开始
✅ **自动生成** - CLI 自动生成完整项目骨架
✅ **预配置** - 所有依赖和配置预装
✅ **完整示例** - 3 个可运行的示例
✅ **工具库** - 动画工具函数库
✅ **深度文档** - 6 份完整文档
✅ **最佳实践** - 总结的核心经验
✅ **社区友好** - 可发布到 npm

---

## 🚀 立即可做

### 现在（5 分钟）
```bash
npx create-map-video-app test
cd test && npm install && npm run dev
```

### 今天（1 小时）
```bash
# 发布到 npm
npm login
npm publish

# 或创建 GitHub 模板
git push && settings → Template repository
```

### 本周
- 建立文档网站
- 创建更多示例
- 收集反馈

---

## 📊 技能包对比

| 之前 | 现在 |
|------|------|
| 1个项目，只有我能用 | 可复用技能，任何人都能用 |
| 每次新项目都要复制代码 | 一键自动生成完整项目 |
| 文档零散 | 6份组织化文档 |
| 没有标准 | 统一的最佳实践 |
| 难以分享 | 可发布到 npm 生态 |

---

## 🎓 学习路径

**初级（1 小时）**
1. 看 QUICK_START.md
2. 运行 `npx create-map-video-app test`
3. 修改坐标看效果

**中级（3 小时）**
1. 看 docs-core-concepts.md
2. 理解 frame-based 动画
3. 创建自己的 Composition

**高级（1 天）**
1. 看 Remotion 官方文档
2. 看 Mapbox GL 官方文档
3. 创建复杂动画

---

## 🔧 常用命令

```bash
# 开发
npm run dev              # 启动预览
npm run dev:force       # 强制新实例

# 渲染
npm run render -- MapVideo out/video.mp4   # 单个
npm run render:all                         # 全部

# 构建
npm run build           # 生成静态文件
```

---

## 📖 技能包文件说明

### 📌 入门文档
- **README_SKILL_PACKAGE.md** ← 你现在在这里
- **QUICK_START.md** - 30秒快速参考
- **HOW_TO_USE_THIS_SKILL.md** - 详细使用指南

### 📌 学习文档
- **docs-core-concepts.md** - Remotion + Mapbox 核心概念
- **SKILL_PACKAGE.md** - 完整功能和 API 参考

### 📌 发布文档
- **DISTRIBUTION_GUIDE.md** - npm/GitHub 发布指南
- **SKILL_SUMMARY.md** - 项目交付物总结

### 📌 工具代码
- **create-map-video-app.js** - CLI 脚手架工具
- **create-package-json.json** - npm 包配置

### 📌 示例代码
- **src/compositions/MapVideo.tsx** - 基础地图示例
- **src/lib/animations.ts** - 动画工具库
- **src/lib/constants.ts** - 常用常量

---

## ❓ 常见问题

**Q: 这个技能包可以用来做什么？**
A: 任何需要地图动画的项目：
- 地理信息可视化
- 路线演示（物流、旅游）
- 企业扩张地图
- 地区覆盖演示
- 任何基于 Mapbox 的视频

**Q: 需要什么前置知识？**
A:
- 基本的 JavaScript/React 知识
- 理解什么是 API Token

**Q: 渲染需要多长时间？**
A: 取决于分辨率和复杂度
- 1080p 30 秒视频：约 15 分钟
- 可以后台运行

**Q: 可以发布到哪些平台？**
A: MP4 视频可以上传到任何平台
- YouTube
- TikTok
- Instagram
- 企业演示文稿
- 网站

---

## 🔗 相关链接

- [Remotion 官方文档](https://www.remotion.dev/)
- [Mapbox GL 文档](https://docs.mapbox.com/mapbox-gl-js/)
- [React 18 文档](https://react.dev/)
- [获取 Mapbox Token](https://account.mapbox.com/tokens/)

---

## 🎬 准备好开始了吗？

### 立即运行
```bash
npx create-map-video-app my-first-map-video
cd my-first-map-video
npm install
npm run dev
```

### 然后
1. 打开浏览器 http://localhost:3000
2. 看到地图动画
3. 编辑坐标
4. 预览效果
5. 渲染视频

**享受创建精彩地图视频的过程！** 🗺️✨

---

## 📞 获取帮助

1. **快速问题** → QUICK_START.md
2. **学习原理** → docs-core-concepts.md
3. **使用问题** → HOW_TO_USE_THIS_SKILL.md
4. **发布问题** → DISTRIBUTION_GUIDE.md
5. **API 问题** → SKILL_PACKAGE.md

---

## ✨ 下一步

- [ ] 运行 `npx create-map-video-app test`
- [ ] 预览示例项目
- [ ] 修改坐标
- [ ] 渲染视频
- [ ] 分享给团队/社区

**祝你创意满满！** 🚀

---

**技能包版本：** 1.0.0
**创建日期：** 2026-04-14
**状态：** ✅ 完成并可发布
