// renderer/src/utils/ipcUtils.ts
export const sendMessageToMain = (message: string) => {
  if (window.electronAPI) {
    window.electronAPI.sendMessage(message)
  } else {
    console.warn('electronAPI not available')
  }
}

export const onReceiveMessageFromMain = (callback: (message: string) => void) => {
  if (window.electronAPI) {
    return window.electronAPI.onReceiveMessage(callback)
  } else {
    console.warn('electronAPI not available')
    return () => {} // 返回一個空函式作為清理函式
  }
}

export const invokeMainFunction = (...args: any[]) => {
  if (window.electronAPI) {
    return window.electronAPI.invokeFunction(...args)
  } else {
    console.warn('electronAPI not available')
    return Promise.reject('electronAPI not available')
  }
}

// ... 其他 IPC 相關的工具函式
