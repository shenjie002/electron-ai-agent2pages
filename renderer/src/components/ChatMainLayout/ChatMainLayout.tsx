// src/ChatMainLayout.tsx (或其他您的文件路径)
import React from 'react'
import { Divider, Dropdown, Button } from 'antd'
import { DownOutlined, AppstoreOutlined } from '@ant-design/icons' // 导入 AppstoreOutlined
import { useNavigate } from 'react-router-dom' // 导入 useNavigate
import type { ChatMainLayoutProps } from './interface'
// import { useStyles } from './styles'

const ChatMainLayout: React.FC<ChatMainLayoutProps> = ({
  mainContent,
  selectedModel,
  onModelChange,
  modelItems,
}) => {
  // const styles = useStyles()
  const navigate = useNavigate() // 初始化 useNavigate

  console.log('mainContent', mainContent)

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-[#87CEEB] via-[#4169E1] to-[#191970] overflow-hidden relative">
      {/* 云朵装饰元素 */}
      <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-70 blur-md animate-float-slow"></div>
      <div className="absolute top-20 left-40 w-32 h-16 bg-white rounded-full opacity-60 blur-md animate-float-medium"></div>
      <div className="absolute top-5 right-20 w-24 h-12 bg-white rounded-full opacity-80 blur-md animate-float-fast"></div>

      {/* 霓虹网格背景 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGY3ZmYiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      {/* 修改后的顶部导航栏布局 */}
      <div className="flex justify-between items-center w-full px-4 sm:px-6 py-3 border-b border-[#00f7ff]/30 bg-[#0a1a3a]/80 backdrop-blur-md z-10 shadow-[0_0_15px_rgba(0,247,255,0.3)]">
        {/* 左侧占位，可以放Logo等，或者保持为空以帮助中间内容居中 */}
        <div className="w-10 sm:w-12"> {/* 根据右侧按钮大小调整，或留空 */} </div>

        {/* 中间核心内容 */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 italic text-l font-bold text-transparent">
            <div className="text-2xl bg-gradient-to-r from-[#00f7ff] to-[#ff00ff] bg-clip-text animate-pulse-slow">
              页面
            </div>
            <div className="hidden sm:block bg-gradient-to-r from-[#00f7ff] via-white to-[#ff00ff] bg-clip-text">
              演示场
            </div>
          </div>
          <Divider type="vertical" className="h-5 border-[#00f7ff]/50" />
          <Dropdown
            menu={{
              items: modelItems,
              onClick: ({ key }) => {
                const selectedItem = modelItems.find((item) => item.key === key)
                onModelChange(selectedItem?.key || 'openai-sdk')
              },
            }}
            dropdownRender={(menu) => (
              <div
                className={`bg-[#0a1a3a]/90 backdrop-blur-md shadow-[0_0_10px_rgba(0,247,255,0.4)] rounded-md !text-[#00f7ff] border border-[#00f7ff]/30`}
              >
                {menu}
              </div>
            )}
          >
            <Button className="!bg-[#0a1a3a]/70 hover:!bg-[#0a1a3a] !text-[#00f7ff] !border-[#00f7ff]/50 shadow-[0_0_5px_rgba(0,247,255,0.3)] transition-all duration-300 hover:shadow-[0_0_10px_rgba(0,247,255,0.5)]">
              {modelItems.find((item) => item.key === selectedModel)?.label} <DownOutlined />
            </Button>
          </Dropdown>
        </div>

        {/* 右侧新增的返回仪表盘按钮 */}
        <div className="w-10 sm:w-12 flex justify-end">
          {' '}
          {/* 确保这个容器有足够宽度并且内容靠右 */}
          <Button
            icon={<AppstoreOutlined className="text-lg" />} // 设置图标大小
            onClick={handleGoToDashboard}
            type="text" // 使用 text 类型按钮，使其更像一个图标按钮
            className="!text-[#00f7ff] hover:!bg-[#00f7ff]/10 focus:!bg-[#00f7ff]/20 !p-2 rounded-md transition-all duration-300" // 调整内边距和样式
            title="返回仪表盘" // HTML title属性，鼠标悬停时显示
          />
        </div>
      </div>

      <div className="h-[calc(100%-57px)] z-10 relative">
        {/* 全息投影效果 */}
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#00f7ff]/10 to-transparent blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#ff00ff]/10 to-transparent blur-xl animate-pulse-medium"></div>

        {mainContent}
      </div>
    </div>
  )
}

export default ChatMainLayout
