// src/pages/DashboardPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography } from 'antd'

const { Title, Paragraph } = Typography

function DashboardPage() {
  const navigate = useNavigate()

  const handleLogout = () => {
    // 你的登出邏輯 (例如清除登入狀態)
    console.log('登出...')
    // 使用 navigate(-1) 返回上一個頁面 (通常是登入頁面)
    navigate(-1)
  }

  const handleGoToLoginPage = () => {
    console.log('跳轉到登入頁面')
    navigate('/login') // 直接導航到 /login 路由
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center animate-fade-in">
        <Title level={2} className="text-gray-800 mb-4 animate-slide-down">
          儀表板
        </Title>
        <Paragraph className="text-gray-600 mb-6 animate-fade-up">
          歡迎來到您的儀表板！在這裡您可以查看重要的資訊和執行相關操作。
        </Paragraph>
        <div className="space-y-4">
          <Button
            onClick={handleLogout}
            //
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-sm w-full animate-slide-left"
          >
            登出
          </Button>
          <Button
            onClick={handleGoToLoginPage}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-sm w-full animate-slide-right"
          >
            返回登入頁面
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
