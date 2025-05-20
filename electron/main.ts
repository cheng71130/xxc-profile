import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'

// 替代 __dirname 和 __filename
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 禁用Electron Security Warning
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  })

  // 根据环境加载不同的内容
  if (process.env.NODE_ENV === 'development') {
    // 开发环境 - 加载本地服务
    mainWindow.loadURL('http://localhost:5173/')
    // 打开开发工具
    mainWindow.webContents.openDevTools()
  } else {
    // 生产环境 - 加载打包后的文件
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

// Electron 初始化完成后创建窗口
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // 在macOS上，当点击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// 当所有窗口都被关闭时退出应用，除了在macOS上
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})