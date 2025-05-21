// src/pages/DashboardPage.tsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Typography, Card, Tag, Avatar, Statistic, Row, Col } from 'antd'
import {
  RocketOutlined,
  CodeSandboxOutlined,
  ExperimentOutlined,
  ArrowRightOutlined,
  ProjectOutlined, // 用于总项目数统计
  CheckCircleOutlined, // 用于已完成项目统计
  SyncOutlined, // 用于进行中项目统计 (替换 RiseOutlined 以更贴切)
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import * as echarts from 'echarts/core' // 导入 echarts 核心模块
import { BarChart } from 'echarts/charts' // 导入柱状图
import { CanvasRenderer } from 'echarts/renderers' // 导入 Canvas 渲染器
import { TooltipComponent, GridComponent, LegendComponent } from 'echarts/components' // 导入需要的组件

// 注册必须的 ECharts 组件
echarts.use([BarChart, TooltipComponent, GridComponent, LegendComponent, CanvasRenderer])

const { Title, Paragraph, Text } = Typography

// 模拟项目数据 (与您之前的版本一致)
const mockProjects = [
  {
    id: 'proj1',
    title: 'AI 智能助手平台',
    description: '集成多种大语言模型，提供智能问答与内容生成服务。',
    icon: <RocketOutlined style={{ fontSize: '24px', color: '#1890ff' }} />,
    tags: ['AI', 'LLM', 'React'],
    status: '进行中',
    statusColor: 'blue',
  },
  {
    id: 'proj2',
    title: '企业级数据可视化系统',
    description: '实时处理和展示海量业务数据，助力决策分析。',
    icon: <CodeSandboxOutlined style={{ fontSize: '24px', color: '#52c41a' }} />,
    tags: ['数据可视化', 'BI', 'Vue'],
    status: '已完成',
    statusColor: 'green',
  },
  {
    id: 'proj3',
    title: '下一代元宇宙社交应用',
    description: '构建沉浸式虚拟社交体验，探索未来交互方式。',
    icon: <ExperimentOutlined style={{ fontSize: '24px', color: '#eb2f96' }} />,
    tags: ['元宇宙', '社交', 'Unity'],
    status: '规划中',
    statusColor: 'gold',
  },
  {
    id: 'proj4',
    title: '智能物联网家居中枢',
    description: '连接和管理所有智能家居设备，提供自动化场景。',
    icon: <RocketOutlined style={{ fontSize: '24px', color: '#722ed1' }} />,
    tags: ['IoT', '智能家居', 'Node.js'],
    status: '进行中',
    statusColor: 'purple',
  },
]

function DashboardPage() {
  const navigate = useNavigate()

  const handleLogoutAndRedirectToLogin = () => {
    console.log('执行登出操作并跳转到登录页面...')
    navigate('/login')
  }

  const handleGoToChatInputMessage = () => {
    console.log('跳转到 ChatInputMessage 页面...')
    navigate('/chatInputMessage')
  }

  const handleGoToSettingPage = () => {
    console.log('跳转到登录页面...')
    navigate('/settings')
  }

  // 计算项目统计数据
  const projectStats = {
    total: mockProjects.length,
    inProgress: mockProjects.filter((p) => p.status === '进行中').length,
    completed: mockProjects.filter((p) => p.status === '已完成').length,
    planned: mockProjects.filter((p) => p.status === '规划中').length,
  }

  // ECharts 图表配置
  const chartOption = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
    },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      data: ['进行中', '已完成', '规划中'],
      axisTick: { alignWithLabel: true },
      axisLabel: { color: '#4A5568', fontSize: 12, fontFamily: 'inherit' },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: '#4A5568', fontSize: 12, fontFamily: 'inherit' },
      splitLine: { lineStyle: { type: 'dashed', color: '#E2E8F0' } },
    },
    series: [
      {
        name: '项目数量',
        type: 'bar',
        barWidth: '50%',
        data: [projectStats.inProgress, projectStats.completed, projectStats.planned],
        itemStyle: {
          borderRadius: [5, 5, 0, 0], // 顶部圆角
          color: (params: any) => {
            // 自定义每个柱子的颜色，可以更炫酷
            const colors = [
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#5A8DFF' },
                { offset: 1, color: '#5A8DFF50' },
              ]), // 进行中
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#38D9A9' },
                { offset: 1, color: '#38D9A950' },
              ]), // 已完成
              new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#FFB74D' },
                { offset: 1, color: '#FFB74D50' },
              ]), // 规划中
            ]
            return colors[params.dataIndex % colors.length]
          },
        },
        emphasis: {
          focus: 'series',
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' },
        },
      },
    ],
    textStyle: { fontFamily: 'inherit' },
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-gray-100 to-sky-100 p-4 sm:p-6 font-sans">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-2xl text-center animate-fade-in transition-all duration-500">
        <div className="mb-8">
          <Title
            level={2}
            className="text-gray-800 mb-3 animate-slide-down !text-3xl sm:!text-4xl tracking-tight"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
              仪表板
            </span>{' '}
            📊
          </Title>
          <Paragraph className="text-gray-600 text-base sm:text-lg animate-fade-up animation-delay-[100ms]">
            欢迎回来！在这里管理您的项目、查看最新动态或开始新的对话。
          </Paragraph>
        </div>

        {/* 概览与统计区域 */}
        <div className="my-10 animate-fade-up animation-delay-[200ms]">
          <Title level={4} className="text-gray-700 mb-6 text-left !font-semibold">
            概览与统计
          </Title>
          <Row gutter={[16, 24]} className="mb-8">
            <Col xs={24} sm={8}>
              <Card
                bordered={false}
                className="!rounded-lg !shadow-lg hover:!shadow-xl transition-all !bg-gradient-to-tr !from-sky-400 !to-blue-500 !text-white"
              >
                <Statistic
                  title={
                    <Text strong className="!text-sky-100">
                      总项目数
                    </Text>
                  }
                  value={projectStats.total}
                  prefix={<ProjectOutlined />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '2em' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card
                bordered={false}
                className="!rounded-lg !shadow-lg hover:!shadow-xl transition-all !bg-gradient-to-tr !from-green-400 !to-emerald-500 !text-white"
              >
                <Statistic
                  title={
                    <Text strong className="!text-green-100">
                      已完成
                    </Text>
                  }
                  value={projectStats.completed}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '2em' }}
                />
              </Card>
            </Col>
            <Col xs={12} sm={8}>
              <Card
                bordered={false}
                className="!rounded-lg !shadow-lg hover:!shadow-xl transition-all !bg-gradient-to-tr !from-amber-400 !to-orange-500 !text-white"
              >
                <Statistic
                  title={
                    <Text strong className="!text-amber-100">
                      进行中
                    </Text>
                  }
                  value={projectStats.inProgress}
                  prefix={<SyncOutlined spin />}
                  valueStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '2em' }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            title={
              <Title level={5} className="!m-0 !text-gray-700">
                项目状态分布
              </Title>
            }
            bordered={false}
            className="!shadow-xl !rounded-lg !bg-white overflow-hidden"
          >
            <ReactECharts
              echarts={echarts}
              option={chartOption}
              style={{ height: '350px', width: '100%' }}
              notMerge={true}
              lazyUpdate={true}
            />
          </Card>
        </div>

        {/* 项目动态列表 */}
        <div className="my-10 animate-fade-up animation-delay-[300ms]">
          <Title level={4} className="text-gray-700 mb-6 text-left !font-semibold">
            项目动态
          </Title>
          <div className="space-y-6">
            {mockProjects.map((project) => (
              <Card
                key={project.id}
                hoverable
                className="!rounded-lg !shadow-lg hover:!shadow-xl transition-all duration-300 group !bg-slate-50 hover:!bg-white"
                onClick={() => console.log(`Clicked project: ${project.title}`)}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <Avatar
                    size={48}
                    icon={project.icon}
                    className="bg-opacity-10 flex-shrink-0 border border-slate-200"
                  />
                  <div className="flex-grow text-left">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-1">
                      <Text
                        strong
                        className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors"
                      >
                        {project.title}
                      </Text>
                      <Tag color={project.statusColor} className="mt-1 sm:mt-0">
                        {project.status}
                      </Tag>
                    </div>
                    <Paragraph type="secondary" className="text-sm mb-2 text-slate-600">
                      {project.description}
                    </Paragraph>
                    <div className="flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <Tag key={tag} className="text-xs !m-0">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <Button
                    type="text"
                    icon={<ArrowRightOutlined />}
                    className="mt-2 sm:mt-0 sm:ml-auto !text-blue-500 hover:!bg-blue-50 self-center sm:self-end"
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 底部操作按钮 */}
        <div className="mt-10 pt-8 border-t border-gray-200 space-y-4 animate-fade-up animation-delay-[400ms]">
          <Button
            onClick={handleGoToChatInputMessage}
            type="default"
            size="large"
            className="w-full font-semibold tracking-wide rounded-md border-2 border-blue-500 text-blue-500 hover:!border-blue-600 hover:!text-blue-600 hover:!bg-blue-50 shadow-md hover:shadow-blue-500/40 transition-all py-3 h-auto"
          >
            前往聊天输入 💬
          </Button>
          <Button
            onClick={handleLogoutAndRedirectToLogin}
            danger
            type="primary"
            size="large"
            className="w-full font-semibold tracking-wide rounded-md shadow-lg hover:shadow-red-500/50 transition-shadow py-3 h-auto"
          >
            安全登出🔙
          </Button>

          <Button
            onClick={handleGoToSettingPage}
            type="link"
            size="large"
            className="w-full text-gray-500 hover:text-blue-600 transition-colors"
          >
            (设置个人👤信息)
          </Button>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
