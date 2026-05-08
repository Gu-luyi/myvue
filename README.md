# Vue 3 + Vite

## 公开访问（GitHub Pages）

本项目已配置 GitHub Actions 自动部署到 GitHub Pages。

### 1) 初始化并推送到 GitHub（公开仓库）

- 在 GitHub 新建一个 **Public** 仓库（不要勾选添加 README/License，避免冲突）。
- 在本地项目目录执行（PowerShell）：
	- `git init`
	- `git add .`
	- `git commit -m "init"`
	- `git branch -M main`
	- `git remote add origin <你的仓库地址>`
	- `git push -u origin main`

### 2) 开启 Pages

在 GitHub 仓库里：`Settings` → `Pages` → `Build and deployment` 选择 **GitHub Actions**。

之后每次推送到 `main`，都会自动构建并发布。

### 3) 访问地址

一般为：`https://<你的GitHub用户名>.github.io/<仓库名>/`

## UI 框架说明（Vant）

本项目使用 Vant 作为移动端 UI 框架，用于实现页面的搜索框、标签页、轮播图、卡片列表、按钮等组件。

- 引用方式：在 [src/main.js](src/main.js) 中引入 `vant` 与 `vant/lib/index.css`，并通过 `app.use(vant)` 全局注册。
- 使用方式：在各页面直接使用组件标签（例如首页使用了 `van-search`、`van-tabs`、`van-swipe`、`van-card`、`van-button`、`van-dropdown-menu` 等）进行布局与美化。


This template should help get you started developing with Vue 3 in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

Learn more about IDE Support for Vue in the [Vue Docs Scaling up Guide](https://vuejs.org/guide/scaling-up/tooling.html#ide-support).
