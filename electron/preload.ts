// electron/preload.ts
const { contextBridge } = require('electron')

// 在window对象上暴露API给渲染进程使用
contextBridge.exposeInMainWorld('electronAPI', {
  // 这里可以添加你需要在渲染进程中使用的方法
  getAppVersion: () => process.env.npm_package_version
})