import { IpcRenderer } from 'electron'

declare global {
  interface Window {
    electronAPI?: {
      sendMessage: (message: string) => void
      onReceiveMessage: (callback: (message: string) => void) => () => void
      invokeFunction: (...args: any[]) => Promise<any>
      onUpdateAvailable: (callback: () => void) => () => void
      onUpdateNotAvailable: (callback: () => void) => () => void
      onDownloadProgress: (callback: (progress: number) => void) => () => void
      onUpdateDownloaded: (callback: (progress: number) => void) => () => void
      onUpdateError: (callback: (error: string) => void) => () => void
      requestUpdate: () => void
      downloadUpdate: () => void
      applyUpdate: () => void
      installUpdate: () => void

      // 添加你在 preload.ts 中暴露的其他 API
    }
  }
}
