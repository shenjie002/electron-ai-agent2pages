const { contextBridge, ipcRenderer } = require('electron') // 使用 require 导入

contextBridge.exposeInMainWorld('electronAPI', {
  sendMessage: (message) => ipcRenderer.send('send-message', message),
  onReceiveMessage: (callback) => {
    const handler = (_event, message) => callback(message)
    ipcRenderer.on('receive-message', handler)
    return () => {
      // 返回一個清理函數
      ipcRenderer.removeListener('receive-message', handler)
    }
  },
  invokeFunction: (...args) => ipcRenderer.invoke('some-event', ...args),
  requestUpdate: () => ipcRenderer.send('request-update'),
  downloadUpdate: () => ipcRenderer.send('download-update'),
  applyUpdate: () => ipcRenderer.send('apply-update'),
  onUpdateAvailable: (callback) => ipcRenderer.on('update-available', callback),
  onUpdateNotAvailable: (callback) => ipcRenderer.on('update-not-available', callback),
  onDownloadProgress: (callback) =>
    ipcRenderer.on('download-progress', (_event, progress) => callback(progress)),
  onUpdateDownloaded: (callback) => ipcRenderer.on('update-downloaded', callback),
  onUpdateError: (callback) =>
    ipcRenderer.on('update-error', (_event, message) => callback(message)),
})
