// 定义 electronAPI 的完整接口
export interface IElectronAPI {
  sendMessage: (message: string) => void
  onReceiveMessage: (callback: (message: string) => void) => () => void // 注意：preload中返回了清理函数
  invokeFunction: (...args: any[]) => Promise<any> // ipcRenderer.invoke 返回 Promise

  // 以下是你已有的更新相关API (确保它们的签名也正确)
  requestUpdate: () => void
  downloadUpdate: () => void
  applyUpdate: () => void
  onUpdateAvailable: (callback: (event: any, ...args: any[]) => void) => void // ipcRenderer.on 的回调通常有 event 参数
  onUpdateNotAvailable: (callback: (event: any, ...args: any[]) => void) => void
  onDownloadProgress: (callback: (progress: any) => void) => void // progress 的具体类型取决于你的主进程发送什么
  onUpdateDownloaded: (callback: (event: any, ...args: any[]) => void) => void
  onUpdateError: (callback: (message: string) => void) => void
}

// 扩展全局 Window 接口
declare global {
  interface Window {
    electronAPI: IElectronAPI
  }
}
