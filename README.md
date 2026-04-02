# xxc-profile

个人门户/技术作品集项目，支持 Web 与 Electron 双端。

## 功能模块
- 主页（Home）
- 数据可视化大屏（visualizationScreen）
- LogicFlow 流程图演示（flowDemo）
- 画廊与交互 Demo（gallery）
- 3D 模型与 URDF 展示（3d_model / 3d_urdf）

## 技术栈
- Vue 3 + TypeScript + Vite
- Vue Router + Element Plus + UnoCSS
- ECharts / DataV / GSAP
- Three.js + urdf-loader
- Electron + electron-builder

## 开发与构建
```bash
pnpm install
pnpm dev
pnpm build
pnpm electron:dev
pnpm electron:build
```

## 环境变量
复制 `.env.example` 为 `.env.local` 后按需修改：
- `VITE_DEV_SERVER_PORT`：本地开发端口
- `VITE_API_PROXY_PREFIX`：代理前缀
- `VITE_API_PROXY_TARGET`：代理目标地址

## 编码说明
项目文件统一使用 UTF-8。若 PowerShell 显示中文乱码，可先执行：
```powershell
chcp 65001
```
