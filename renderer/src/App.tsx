import React, { useEffect, useState } from 'react'
import { sendMessageToMain } from './utils/ipcUtils'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import { componentsConfig, RouteConfig } from './common/componentsConfig'

function App() {
  const isLoggedIn = true /* 從你的狀態管理或本地儲存中獲取登入狀態 */

  const handleSendMessage = () => {
    try {
      sendMessageToMain('Hello from React!')
    } catch (error) {
      console.log('Error sending message:', error)
    }
  }

  React.useEffect(() => {
    // if (window.electronAPI && window.electronAPI.onReceiveMessage) {
    //   const unsubscribe = window.electronAPI.onReceiveMessage((message) => {
    //     console.log('Received message from main process:', message)
    //   })
    //   return () => unsubscribe()
    // } else {
    //   console.warn('electronAPI.onReceiveMessage not found in preload.')
    // }
    // if (window.electronAPI && window.electronAPI.invokeFunction) {
    //   window.electronAPI.invokeFunction('arg1', 'arg2').then((result) => {
    //     console.log('Result from main process:', result)
    //   })
    // } else {
    //   console.warn('electronAPI.invokeFunction not found in preload.')
    // }
  }, [])

  return (
    <Routes>
      {componentsConfig.map((route: RouteConfig) => (
        <Route
          key={route.key}
          path={route.path}
          element={
            route.hasAuth && !isLoggedIn ? (
              <Navigate to="/login" replace /> // 如果需要授權但未登入，導航到登入頁面
            ) : (
              <route.component /> // 渲染配置中的组件
            )
          }
        />
      ))}
      {/* 可以添加預設路由或 404 路由 */}
      <Route path="/" element={<Navigate to="/chatInputMessage" replace />} />{' '}
      {/* 預設導航到儀表板 (如果已登入) */}
    </Routes>
  )
}

export default App
