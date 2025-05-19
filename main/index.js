const { app, BrowserWindow, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater')
const path = require('path')

let mainWindow = null

const createWindow = async () => {
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // 禁用 Node.js 集成，提高安全性
      contextIsolation: true, // 啟用上下文隔離，提高安全性
      contentSecurityPolicy: `
      default-src 'self';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data:;
      font-src 'self';
      connect-src 'self' https://your-api-domain.com; // 允許連接到你的 API 伺服器
      base-uri 'self';
      form-action 'self';
    `,
    },
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000') // Vite 開發伺服器
    mainWindow.webContents.openDevTools()
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/renderer/index.html'))
  }

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  // 在應用程式啟動後檢查更新
  app.on('ready', () => {
    checkForUpdates()
  })
}
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
// 檢查更新的函式
function checkForUpdates() {
  autoUpdater.autoDownload = false // 設置為 false，讓使用者決定是否下載
  autoUpdater.checkForUpdatesAndNotify()
}
// 監聽更新事件
autoUpdater.on('update-available', (info) => {
  console.log('Update available:', info)
  mainWindow.webContents.send('update-available') // 通知渲染進程
})

autoUpdater.on('update-not-available', (info) => {
  console.log('Update not available:', info)
  mainWindow.webContents.send('update-not-available') // 通知渲染進程
})

autoUpdater.on('error', (err) => {
  console.error('Update error:', err)
  mainWindow.webContents.send('update-error', err.message) // 通知渲染進程
})

autoUpdater.on('download-progress', (progressObj) => {
  mainWindow.webContents.send('download-progress', progressObj.percent) // 通知渲染進程下載進度
})

autoUpdater.on('update-downloaded', (info) => {
  console.log('Update downloaded:', info)
  mainWindow.webContents.send('update-downloaded') // 通知渲染進程
})
// 接收來自渲染進程的更新請求
ipcMain.on('request-update', () => {
  checkForUpdates()
})

// 接收來自渲染進程的下載請求
ipcMain.on('download-update', () => {
  autoUpdater.downloadUpdate()
})

// 接收來自渲染進程的應用更新請求
ipcMain.on('apply-update', () => {
  autoUpdater.quitAndInstall()
})
// 可選：處理主進程的 IPC 通訊
// ipcMain.handle('some-event', async (event, ...args) => {
//   // ... 處理邏輯
//   return 'result';
// });
