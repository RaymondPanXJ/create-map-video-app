# 📦 技能分发指南

## 🎯 分发方案总览

| 方式 | 用户体验 | 维护成本 | 推荐度 |
|------|---------|---------|--------|
| **npm 包** | ⭐⭐⭐⭐⭐ | 中 | ⭐⭐⭐⭐⭐ |
| **Git 模板** | ⭐⭐⭐⭐ | 低 | ⭐⭐⭐⭐ |
| **CLI 工具** | ⭐⭐⭐⭐⭐ | 高 | ⭐⭐⭐⭐ |

---

## 方案 1️⃣：npm 包分发

### 1.1 发布到 npm

#### 步骤 1：注册 npm 账户
```bash
npm adduser
# 或登录
npm login
```

#### 步骤 2：创建包结构

在项目根目录创建：

```
map-video-template/
├── package.json          # 包配置
├── README.md
├── LICENSE (MIT)
├── src/
│   ├── compositions/
│   ├── lib/
│   └── root.tsx
├── template/             # 新增：用户安装后的模板
│   ├── _gitignore       # (note: 重命名为 .gitignore)
│   ├── .env.example
│   ├── remotion.config.ts
│   └── README.md
└── bin/
    └── create.js         # CLI 入口
```

#### 步骤 3：更新 package.json

```json
{
  "name": "create-map-video-app",
  "version": "1.0.0",
  "description": "快速创建 Remotion + Mapbox 地图视频项目",
  "license": "MIT",
  "publishConfig": {
    "access": "public"
  },
  "bin": {
    "create-map-video-app": "./bin/create.js"
  },
  "keywords": [
    "remotion",
    "mapbox",
    "video",
    "map",
    "animation"
  ],
  "files": [
    "bin",
    "template",
    "package.json",
    "README.md"
  ]
}
```

#### 步骤 4：发布

```bash
# 检查
npm whoami
npm publish --dry-run

# 发布
npm publish

# 验证
npm search create-map-video-app
```

### 1.2 用户使用

```bash
# 最简单的方式
npx create-map-video-app my-project

# 或
npm init map-video-app -- my-project

# 或全局安装
npm install -g create-map-video-app
create-map-video-app my-project
```

---

## 方案 2️⃣：GitHub 模板仓库

### 2.1 创建模板仓库

#### 步骤 1：创建新仓库
- 访问 https://github.com/new
- 仓库名：`map-video-template`
- 勾选 "Template repository"

#### 步骤 2：推送代码
```bash
git init
git add .
git commit -m "init: map-video-template"
git remote add origin https://github.com/YOUR_ORG/map-video-template.git
git branch -M main
git push -u origin main
```

#### 步骤 3：创建 .github/ISSUE_TEMPLATE/

```markdown
# 🐛 Bug Report

## 描述
...

## 复现步骤
...

## 预期行为
...

## 实际行为
...
```

### 2.2 用户使用

**方式 A：使用 GitHub 模板按钮**
1. 访问 https://github.com/YOUR_ORG/map-video-template
2. 点击 "Use this template" 按钮
3. 输入项目名称
4. 克隆到本地

**方式 B：手动克隆**
```bash
git clone https://github.com/YOUR_ORG/map-video-template.git my-project
cd my-project
npm install
```

---

## 方案 3️⃣：GitHub + npm 联动

### 3.1 组织结构

```
GitHub Organization
├── create-map-video-app (CLI 包)
│   ├── bin/create.js
│   ├── template/  (→ 指向模板)
│   └── package.json
│
├── map-video-template (模板仓库)
│   ├── src/
│   ├── package.json
│   └── README.md
│
└── map-video-docs (文档网站)
    ├── docs/
    └── README.md
```

### 3.2 CI/CD 流程

**文件：** `.github/workflows/publish.yml`

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - run: npm install

      - run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

**使用方式：**
```bash
# 发布新版本
git tag v1.0.1
git push origin v1.0.1
# GitHub Actions 自动发布到 npm
```

---

## 📋 完整发布清单

### 代码准备
- [ ] 更新 `package.json` 版本号
- [ ] 编写 CHANGELOG.md
- [ ] 更新 README.md
- [ ] 检查 LICENSE
- [ ] 删除测试文件和临时文件
- [ ] 检查 .npmignore 或 package.json files 字段

### 质量检查
- [ ] 运行 `npm test` (如果有)
- [ ] 本地测试 `npm run dev`
- [ ] 验证依赖版本
- [ ] 检查 TypeScript 类型
- [ ] 运行 ESLint（如果配置）

### 文档
- [ ] 更新 README.md
- [ ] 添加使用示例
- [ ] 更新 CHANGELOG
- [ ] 检查快速开始指南
- [ ] 验证所有代码示例可运行

### 发布
- [ ] 创建 git tag
- [ ] 运行 `npm publish --dry-run`
- [ ] 验证 npm 中的文件列表
- [ ] 执行 `npm publish`
- [ ] 验证 npm 包页面
- [ ] 在 GitHub Releases 中发布

### 发布后
- [ ] 通知团队/社区
- [ ] 收集反馈
- [ ] 监控 issues
- [ ] 准备下一版本计划

---

## 🔒 安全最佳实践

### npm 发布安全

```bash
# 1. 使用 2FA
npm profile enable-2fa auth-and-writes

# 2. 使用访问令牌
npm token create --read-only

# 3. 定期审计依赖
npm audit
npm audit fix

# 4. 检查包内容
npm pack
tar -tzf create-map-video-app-1.0.0.tgz
```

### GitHub Secrets

在 GitHub 仓库设置中添加：
- `NPM_TOKEN`: npm 个人访问令牌

```bash
# 生成令牌
npm token create --read-only

# 或者在 https://www.npmjs.com/settings/~/tokens
```

---

## 📈 版本管理

### 遵循语义版本 (Semantic Versioning)

```
MAJOR.MINOR.PATCH
  1.2.3

- MAJOR: 破坏性更改
- MINOR: 新功能（向后兼容）
- PATCH: 错误修复（向后兼容）
```

### 发布流程

```bash
# 查看当前版本
npm version

# 发布补丁版本
npm version patch
npm publish

# 发布小版本
npm version minor
npm publish

# 发布大版本
npm version major
npm publish
```

---

## 🎯 快速发布脚本

**文件：** `scripts/publish.sh`

```bash
#!/bin/bash
set -e

echo "🔍 检查质量..."
npm run lint
npm run test

echo "📦 准备发布..."
npm version patch

echo "🚀 发布到 npm..."
npm publish

echo "✅ 发布完成！"
git push --follow-tags
```

使用：
```bash
chmod +x scripts/publish.sh
./scripts/publish.sh
```

---

## 📊 分发渠道对比

| 功能 | npm | GitHub 模板 | CLI |
|------|-----|-----------|-----|
| 一键安装 | ✅ | ⚠️ | ✅ |
| 版本管理 | ✅ | 手动 | ✅ |
| 自动更新 | ✅ | ❌ | ⚠️ |
| 发现度 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| 学习曲线 | 低 | 低 | 低 |
| SEO | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 🚀 推荐方案

**最佳实践：组合方案**

1. **初期**（v0.x）
   - 使用 GitHub 模板仓库
   - 文档在项目 README
   - 小范围内部使用

2. **成熟**（v1.0+）
   - 发布 npm 包
   - 创建 CLI 工具
   - 建立官方文档网站

3. **成长**（v2.0+）
   - 维护多个版本
   - 社区贡献者
   - 插件生态系统

---

## 📞 获取支持

- GitHub Issues: 问题报告
- Discussions: 讨论功能
- Stack Overflow: 标签 `remotion-mapbox`
- Discord 社区: 实时讨论

---

## ✅ 现在你已经可以：

1. ✅ 通过 npm 安装使用包
2. ✅ 使用 GitHub 模板一键克隆
3. ✅ 通过 CLI 工具快速生成项目
4. ✅ 自动化发布和版本管理
5. ✅ 建立社区反馈机制

**下一步：推广和社区建设！** 🎉
