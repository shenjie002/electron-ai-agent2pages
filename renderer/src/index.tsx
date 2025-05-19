import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './tailwind.css'
import 'antd/dist/reset.css'
const rootElement = document.getElementById('root')
const root = createRoot(rootElement!) // 使用 createRoot 创建根

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
