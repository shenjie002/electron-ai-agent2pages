import React from 'react'
import { Divider, Dropdown, Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import type { ChatMainLayoutProps } from './interface'
// import { useStyles } from './styles'

const ChatMainLayout: React.FC<ChatMainLayoutProps> = ({
  mainContent,
  selectedModel,
  onModelChange,
  modelItems,
}) => {
  // const styles = useStyles()
  console.log('mainContent', mainContent)
  return (
    <div className="flex flex-col w-full h-screen bg-gradient-to-b from-[#87CEEB] via-[#4169E1] to-[#191970] overflow-hidden relative">
      {/* 云朵装饰元素 */}
      <div className="absolute top-10 left-10 w-20 h-10 bg-white rounded-full opacity-70 blur-md animate-float-slow"></div>
      <div className="absolute top-20 left-40 w-32 h-16 bg-white rounded-full opacity-60 blur-md animate-float-medium"></div>
      <div className="absolute top-5 right-20 w-24 h-12 bg-white rounded-full opacity-80 blur-md animate-float-fast"></div>

      {/* 霓虹网格背景 */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJncmlkIiB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiPjxwYXRoIGQ9Ik0gNTAgMCBMIDAgMCAwIDUwIiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGY3ZmYiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>

      <div className="flex justify-center items-center gap-2 w-full py-3 border-b border-[#00f7ff]/30 bg-[#0a1a3a]/80 backdrop-blur-md z-10 shadow-[0_0_15px_rgba(0,247,255,0.3)]">
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

      <div className="h-[calc(100%-57px)] z-10 relative">
        {/* 全息投影效果 */}
        <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-[#00f7ff]/10 to-transparent blur-xl animate-pulse-slow"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 rounded-full bg-gradient-to-r from-[#ff00ff]/10 to-transparent blur-xl animate-pulse-medium"></div>

        {mainContent}
      </div>
    </div>
  )
}

// 需要在tailwind.config.js中添加以下配置
// extend: {
//   animation: {
//     'float-slow': 'float 8s ease-in-out infinite',
//     'float-medium': 'float 6s ease-in-out infinite',
//     'float-fast': 'float 4s ease-in-out infinite',
//     'pulse-slow': 'pulse 4s ease-in-out infinite',
//     'pulse-medium': 'pulse 3s ease-in-out infinite',
//   },
//   keyframes: {
//     float: {
//       '0%, 100%': { transform: 'translateY(0)' },
//       '50%': { transform: 'translateY(-10px)' },
//     },
//   },
// }

export default ChatMainLayout
