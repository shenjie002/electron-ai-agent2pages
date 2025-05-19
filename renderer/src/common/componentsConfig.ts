// src/common/componentsConfig.ts
import LoginPage from '../pages/LoginPage/LoginPage'
import DashboardPage from '../pages/DashboardPage/DashboardPage'
import SettingsPage from '../pages/SettingsPage/SettingsPage'
import ChatInputMessage from '../pages/ChatInputMessage/index'
// 导入你所有的组件

export interface RouteConfig {
  key: string // 组件的唯一标识符
  title: string // 组件的名称 (用於菜單、標題等)
  component: React.ComponentType<any> // React 组件类型
  path: string // 组件的路由地址
  hasAuth?: boolean // 是否需要授權訪問 (可選)
  // 可以添加其他你需要的配置，例如子路由、圖示等
}

export const componentsConfig: RouteConfig[] = [
  {
    key: 'login',
    title: '登入',
    component: LoginPage,
    path: '/login',
  },
  {
    key: 'dashboard',
    title: '看板',
    component: DashboardPage,
    path: '/dashboard',
    hasAuth: true, // 假設儀表板需要登入
  },
  {
    key: 'settings',
    title: '设置',
    component: SettingsPage,
    path: '/settings',
    hasAuth: true, // 假設設定頁面需要登入
  },
  {
    key: 'chatInputMessage',
    title: '设置',
    component: ChatInputMessage,
    path: '/chatInputMessage',
    hasAuth: true, // 假設設定頁面需要登入
  },
  // ... 其他组件的配置
]
