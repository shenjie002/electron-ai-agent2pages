// renderer/src/index.tsx
import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter, HashRouter } from 'react-router-dom' // 导入 BrowserRouter 和 HashRouter
import './tailwind.css'
import 'antd/dist/reset.css'

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error("未能找到ID为'root'的根元素") // 增加一个错误处理
}
const root = createRoot(rootElement)

// 通过检查暴露的 API 来判断是否在 Electron 环境中运行
const isElectron = !!window.electronAPI

// 选择合适的路由组件
const RouterComponent = isElectron ? HashRouter : BrowserRouter

root.render(
  <React.StrictMode>
    <RouterComponent>
      {' '}
      {/* 使用条件选择的路由组件 */}
      <App />
    </RouterComponent>
  </React.StrictMode>,
)
