// src/pages/SettingsPage.tsx
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Input, Typography, message, Form, Avatar } from 'antd'
import { UserOutlined, MailOutlined, SaveOutlined, PictureOutlined } from '@ant-design/icons'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

interface UserSettings {
  fullName: string
  email: string
  profilePicUrl: string
  bio: string
}

function SettingsPage() {
  const navigate = useNavigate()
  const [form] = Form.useForm<UserSettings>()
  const [loading, setLoading] = useState(false)
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState('')

  // 模拟从API获取现有用户数据并填充表单
  useEffect(() => {
    const fetchUserData = () => {
      // 假设这是从后端获取的数据
      const currentUserData: UserSettings = {
        fullName: '演示用户',
        email: 'user@example.com',
        profilePicUrl: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
        bio: '这是一段关于我的简介示例，用于展示在设置页面。',
      }
      form.setFieldsValue(currentUserData)
      setAvatarPreviewUrl(currentUserData.profilePicUrl || '')
    }
    fetchUserData()
  }, [form])

  const handleSaveSettings = async (values: UserSettings) => {
    setLoading(true)
    console.log('正在保存设置:', values)
    // 模拟API调用
    await new Promise((resolve) => setTimeout(resolve, 1500))
    message.success('个人信息已成功更新！即将跳转到仪表板...')
    setLoading(false)
    navigate('/dashboard')
  }

  const handleAvatarUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAvatarPreviewUrl(e.target.value)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-200 via-sky-100 to-indigo-200 p-4 sm:p-6 font-sans">
      <div className="bg-white p-6 sm:p-10 rounded-xl shadow-2xl w-full max-w-lg text-center animate-fade-in">
        <Title level={2} className="text-gray-800 mb-3 !text-3xl sm:!text-4xl tracking-tight">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
            个人设置
          </span>{' '}
          ⚙️
        </Title>
        <Paragraph className="text-gray-600 text-base sm:text-lg mb-8 animate-fade-up">
          管理您的账户信息和偏好设置。
        </Paragraph>

        <Form form={form} layout="vertical" onFinish={handleSaveSettings} className="text-left">
          <Form.Item className="text-center mb-6">
            <Avatar
              size={100}
              src={avatarPreviewUrl || undefined} // 如果 avatarPreviewUrl 为空，则显示 icon
              icon={!avatarPreviewUrl && <UserOutlined />}
              className="shadow-lg border-4 border-white"
            />
          </Form.Item>

          <Form.Item
            name="profilePicUrl"
            label={
              <Text strong className="text-gray-700">
                头像链接
              </Text>
            }
          >
            <Input
              prefix={<PictureOutlined className="site-form-item-icon text-gray-400" />}
              placeholder="输入图片 URL (例如: https://example.com/avatar.png)"
              onChange={handleAvatarUrlChange}
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="fullName"
            label={
              <Text strong className="text-gray-700">
                姓名
              </Text>
            }
            rules={[{ required: true, message: '请输入您的姓名!' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon text-gray-400" />}
              placeholder="例如：张三"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
            label={
              <Text strong className="text-gray-700">
                电子邮箱
              </Text>
            }
            rules={[
              { required: true, message: '请输入您的电子邮箱!' },
              { type: 'email', message: '请输入有效的邮箱地址!' },
            ]}
          >
            <Input
              prefix={<MailOutlined className="site-form-item-icon text-gray-400" />}
              placeholder="例如：user@example.com"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="bio"
            label={
              <Text strong className="text-gray-700">
                个人简介
              </Text>
            }
          >
            <TextArea
              rows={4}
              placeholder="简单介绍一下自己..."
              className="resize-none rounded-md"
              size="large"
            />
          </Form.Item>

          <Form.Item className="mt-8">
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              icon={<SaveOutlined />}
              size="large"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold tracking-wide rounded-md shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 py-3 h-auto"
            >
              {loading ? '保存中...' : '保存更改'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}

export default SettingsPage
