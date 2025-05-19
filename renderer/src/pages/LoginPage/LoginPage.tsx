// src/pages/LoginPage.tsx
import React, { useState, useEffect, useRef } from 'react'
import { Button, Input, Typography, Spin, Progress, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import {
  DownloadOutlined,
  CloudSyncOutlined,
  PoweroffOutlined,
  LoginOutlined,
  UserOutlined,
  LockOutlined,
  InfoCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'

const { Title, Text } = Typography

const UPDATE_CHECK_INTERVAL = 15000 // Check update interval (ms)
const UPDATE_CHECK_TIMEOUT = 30000 // Timeout for a single update check attempt (ms) - reduced for better UX
const OVERALL_UPDATE_PROCESS_TIMEOUT = 60000 // If no definitive update status in this time, stop periodic checks (ms)

// Define window.electronAPI if it's not already defined for type safety
declare global {
  interface Window {
    electronAPI?: {
      requestUpdate: () => void
      downloadUpdate: () => void
      applyUpdate: () => void
      onUpdateAvailable: (callback: () => void) => void
      onUpdateNotAvailable: (callback: () => void) => void
      onDownloadProgress: (callback: (progress: number) => void) => void
      onUpdateDownloaded: (callback: () => void) => void
      onUpdateError: (callback: (message: string) => void) => void
    }
  }
}

function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Update related state
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [updateDownloaded, setUpdateDownloaded] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [updateErrorMessage, setUpdateErrorMessage] = useState('') // Renamed for clarity
  const [checkingUpdate, setCheckingUpdate] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const periodicUpdateCheckTimerRef = useRef<NodeJS.Timeout | null>(null)
  const overallUpdateProcessTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const manualCheckTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleLogin = () => {
    setIsLoggingIn(true)
    // Simulate login delay
    setTimeout(() => {
      console.log('正在登入:', username, password)
      // Basic validation example (replace with actual auth logic)
      if (username && password) {
        message.success({
          content: '登入成功，正在導向...',
          icon: <CheckCircleOutlined className="mr-2" />,
        })
        setIsLoggingIn(false)
        navigate('/dashboard')
      } else {
        message.error({
          content: '用戶名或密碼不能為空！',
          icon: <WarningOutlined className="mr-2" />,
        })
        setIsLoggingIn(false)
      }
    }, 1500)
  }

  // Cleanup function for all timeouts
  const clearAllTimeouts = () => {
    if (periodicUpdateCheckTimerRef.current) clearTimeout(periodicUpdateCheckTimerRef.current)
    if (overallUpdateProcessTimeoutRef.current) clearTimeout(overallUpdateProcessTimeoutRef.current)
    if (manualCheckTimeoutRef.current) clearTimeout(manualCheckTimeoutRef.current)
  }

  useEffect(() => {
    if (window.electronAPI) {
      const {
        onUpdateAvailable,
        onUpdateNotAvailable,
        onDownloadProgress,
        onUpdateDownloaded,
        onUpdateError,
      } = window.electronAPI

      onUpdateAvailable(() => {
        message.success({ content: '發現新版本！', icon: <InfoCircleOutlined className="mr-2" /> })
        setUpdateAvailable(true)
        setCheckingUpdate(false)
        setIsDownloading(false)
        clearAllTimeouts() // Stop further checks once update is found
      })

      onUpdateNotAvailable(() => {
        // Only show message if it was a manual check or initial check
        if (checkingUpdate) {
          message.info({
            content: '目前已是最新版本。',
            icon: <CheckCircleOutlined className="mr-2" />,
          })
        }
        setCheckingUpdate(false)
        setIsDownloading(false)
        if (manualCheckTimeoutRef.current) clearTimeout(manualCheckTimeoutRef.current)
        // Keep periodic check running unless overall timeout is hit
      })

      onDownloadProgress((progress) => {
        setDownloadProgress(progress)
        setIsDownloading(true) // Explicitly set downloading state
      })

      onUpdateDownloaded(() => {
        message.success({
          content: '更新下載完成，準備安裝！',
          icon: <CheckCircleOutlined className="mr-2" />,
        })
        setUpdateDownloaded(true)
        setUpdateAvailable(true) // Keep available true to show restart button
        setIsDownloading(false)
        setCheckingUpdate(false)
        clearAllTimeouts()
      })

      onUpdateError((errorMsg) => {
        message.error({
          content: `更新錯誤: ${errorMsg}`,
          icon: <WarningOutlined className="mr-2" />,
        })
        setUpdateErrorMessage(errorMsg)
        setCheckingUpdate(false)
        setIsDownloading(false)
        clearAllTimeouts()
      })

      // Start periodic update check on mount
      startPeriodicUpdateCheck()
    }

    return () => {
      clearAllTimeouts()
      // Clean up Electron IPC listeners if necessary (though antd message might handle this)
      // This depends on how window.electronAPI manages its listeners.
      // If they are persistent, you might need a way to remove them.
    }
  }, []) // Empty dependency array means this runs once on mount and cleans up on unmount

  const startPeriodicUpdateCheck = () => {
    clearAllTimeouts() // Clear any existing timers before starting new ones
    setCheckingUpdate(true) // Indicate that the system is now in update-checking mode
    setUpdateErrorMessage('')

    const performCheck = () => {
      if (window.electronAPI && !updateAvailable && !updateDownloaded) {
        // Don't check if update found or downloaded
        console.log('正在執行定期更新檢查...')
        window.electronAPI.requestUpdate()
      }
    }

    performCheck() // Initial check
    periodicUpdateCheckTimerRef.current = setInterval(performCheck, UPDATE_CHECK_INTERVAL)

    // Overall timeout for the entire periodic checking process
    overallUpdateProcessTimeoutRef.current = setTimeout(() => {
      if (!updateAvailable && !updateDownloaded) {
        // If no conclusion reached
        console.log('定期更新檢查過程超時，已停止。')
        message.error({
          content: '更新服務暫時無回應，請稍後再試。',
          icon: <WarningOutlined className="mr-2" />,
        })
        setCheckingUpdate(false)
        if (periodicUpdateCheckTimerRef.current) clearInterval(periodicUpdateCheckTimerRef.current)
      }
    }, OVERALL_UPDATE_PROCESS_TIMEOUT)
  }

  const handleCheckUpdateManually = () => {
    if (checkingUpdate || isDownloading) return // Prevent multiple checks or check during download

    clearAllTimeouts() // Stop periodic checks if a manual check is initiated
    setCheckingUpdate(true)
    setUpdateErrorMessage('')
    setUpdateAvailable(false)
    setUpdateDownloaded(false)
    setDownloadProgress(0)
    message.loading({
      content: '正在手動掃描更新...',
      key: 'manualCheck',
      duration: 0,
      icon: <CloudSyncOutlined className="mr-2" />,
    })

    manualCheckTimeoutRef.current = setTimeout(() => {
      message.destroy('manualCheck') // Ensure loading message is cleared
      // Check if an update event has already cleared the checking state
      if (checkingUpdate && !updateAvailable && !updateDownloaded) {
        message.error({ content: '手動更新檢查超時。', icon: <WarningOutlined className="mr-2" /> })
        setCheckingUpdate(false)
        setUpdateErrorMessage('手動更新檢查超時。')
      }
    }, UPDATE_CHECK_TIMEOUT)

    if (window.electronAPI) {
      window.electronAPI.requestUpdate()
    }
  }

  const handleDownloadUpdate = () => {
    if (window.electronAPI) {
      setIsDownloading(true)
      setDownloadProgress(0) // Reset progress before starting
      message.loading({
        content: '開始下載更新...',
        key: 'download',
        duration: 0,
        icon: <DownloadOutlined className="mr-2" />,
      })
      window.electronAPI.downloadUpdate()
    }
  }

  const handleApplyUpdate = () => {
    if (window.electronAPI) {
      message.info({
        content: '正在重新啟動以安裝更新...',
        icon: <PoweroffOutlined className="mr-2" />,
      })
      window.electronAPI.applyUpdate()
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-indigo-900 p-4 selection:bg-purple-500 selection:text-white">
      <div className="bg-black bg-opacity-75 p-8 sm:p-12 rounded-xl shadow-2xl w-full max-w-md text-center animate-fade-in border border-purple-700 hover:shadow-purple-500/50 transition-shadow duration-300">
        <Title
          level={2}
          className="!text-white !mb-10 animate-slide-down font-bold tracking-wider" // Antd Typography might need ! for overrides
        >
          <span className="text-purple-400">系统</span>
          <span className="text-teal-400">登入</span>
        </Title>
        <Input
          prefix={<UserOutlined className="text-gray-500" />}
          placeholder="<代碼名稱>"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          size="large"
          className="mb-6 rounded-lg bg-gray-800  placeholder:text-gray-400 caret-purple-400 border border-gray-700 shadow-sm transition-all duration-150 ease-in-out hover:border-gray-600 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-800"
        />
        <Input.Password
          prefix={<LockOutlined className="text-gray-500" />}
          placeholder="<接入密鑰>"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="large"
          className="mb-8 rounded-lg bg-gray-800  placeholder:text-gray-400 caret-purple-400 border border-gray-700 shadow-sm transition-all duration-150 ease-in-out hover:border-gray-600 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-800"
        />
        <Button
          type="primary"
          icon={<LoginOutlined />}
          size="large"
          onClick={handleLogin}
          className="w-full bg-purple-600 hover:bg-purple-700 border-purple-600 hover:border-purple-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-purple-500/40 transform hover:scale-105 transition-all duration-300 animate-fade-up tracking-wide"
          loading={isLoggingIn}
        >
          {isLoggingIn ? '連線中...' : '接入系統'}
        </Button>

        {/* Update Section */}
        <div className="mt-10 text-left space-y-4">
          <Button
            icon={<CloudSyncOutlined />}
            onClick={handleCheckUpdateManually}
            loading={checkingUpdate && !isDownloading} // Show loading only if checking, not if already downloading
            disabled={checkingUpdate || isDownloading}
            className="w-full bg-sky-600 hover:bg-sky-700 border-sky-600 hover:border-sky-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-md hover:shadow-sky-500/30 transition-all animate-slide-left text-sm"
          >
            {checkingUpdate && !isDownloading ? (
              <span className="text-yellow-300">掃描更新中...</span>
            ) : (
              '掃描可用更新'
            )}
          </Button>

          {updateAvailable && !updateDownloaded && (
            <div className="p-4 bg-gray-800 rounded-lg shadow-inner animate-fade-in">
              <Text className="text-green-400 block mb-2 text-sm">
                <InfoCircleOutlined className="mr-2" />
                發現新版本！{' '}
                {isDownloading ? `下載進度: ${Math.round(downloadProgress)}%` : '準備下載...'}
              </Text>
              {isDownloading && (
                <Progress
                  percent={Math.round(downloadProgress)}
                  strokeColor={{ '0%': '#60efff', '100%': '#50C878' }}
                  trailColor="rgba(255,255,255,0.1)"
                  className="mb-3"
                />
              )}
              {!isDownloading && (
                <Button
                  icon={<DownloadOutlined />}
                  type="primary"
                  onClick={handleDownloadUpdate}
                  className="w-full bg-green-600 hover:bg-green-700 border-green-600 hover:border-green-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md mt-2 text-sm transition-all"
                >
                  下載更新
                </Button>
              )}
            </div>
          )}

          {updateDownloaded && (
            <div className="p-4 bg-gray-800 rounded-lg shadow-inner animate-fade-in">
              <Text className="text-yellow-400 block mb-2 text-sm">
                <CheckCircleOutlined className="mr-2" />
                更新已下載，準備重新啟動以完成安裝。
              </Text>
              <Button
                icon={<PoweroffOutlined />}
                type="primary"
                onClick={handleApplyUpdate}
                className="w-full bg-yellow-500 hover:bg-yellow-600 border-yellow-500 hover:border-yellow-600 text-black font-semibold py-2 px-4 rounded-lg shadow-md mt-2 animate-pulse text-sm transition-all"
              >
                重新啟動並安裝
              </Button>
            </div>
          )}

          {updateErrorMessage && (
            <Text className="text-red-500 mt-4 animate-shake text-xs block p-3 bg-red-900 bg-opacity-30 rounded-md border border-red-700">
              <WarningOutlined className="mr-2" />
              {`錯誤: ${updateErrorMessage}`}
            </Text>
          )}
        </div>
      </div>
    </div>
  )
}

export default LoginPage
