import { useState } from 'react'
import { nanoid } from 'nanoid'
import { Message } from '../../components/ChatMessages/interface' // 确保这个路径在您的新项目中有效
import ChatMessages from '../../components/ChatMessages/ChatMessages' // 确保这个路径在您的新项目中有效

const OpenaiSdk = () => {
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [messageImgUrl, setMessageImgUrl] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleSendMessage = async (newMessages: Message[]) => {
    const assistantMessageId = nanoid()
    try {
      setMessages(newMessages) // 直接使用传入的 newMessages 作为当前对话的起始
      setIsLoading(true)

      const response = await fetch('http://localhost:4000/api/openai', {
        // <--- 修改点
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages, // 发送完整的消息历史（或根据您的后端API设计进行调整）
        }),
      })

      if (!response.ok) {
        // 检查HTTP响应状态
        const errorData = await response.text() // 或者 response.json() 如果后端返回JSON错误
        throw new Error(`HTTP error ${response.status}: ${errorData}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Failed to get readable stream.')
      }

      const textDecoder = new TextDecoder()
      let received_stream = ''
      // 为助手消息生成一个ID
      let buffer = ''

      // 先添加一个空的助手消息用于后续更新
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: assistantMessageId,
          role: 'assistant',
          content: '', // 初始为空
          ragDocs: [],
        },
      ])

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          break
        }

        buffer += textDecoder.decode(value, { stream: true })
        const eventMessages = buffer.split('\n\n') // SSE 事件通常以 \n\n 分隔
        buffer = eventMessages.pop() || '' // 保留最后一个不完整的消息块

        for (const eventMessage of eventMessages) {
          if (!eventMessage.trim()) continue

          const lines = eventMessage.split('\n')
          const dataLine = lines.find((line) => line.startsWith('data:'))

          if (dataLine) {
            const jsonDataString = dataLine.substring(5).trim() // 移除 "data: " 前缀
            try {
              const { relevantContent, aiResponse } = JSON.parse(jsonDataString) as {
                relevantContent: Array<{ content: string; similarity: number }>
                aiResponse: string
              }
              received_stream += aiResponse

              setMessages((prevMessages) =>
                prevMessages.map((msg) => {
                  if (msg.id === assistantMessageId) {
                    return {
                      ...msg,
                      content: received_stream,
                      ragDocs: relevantContent.map(({ content, similarity }) => ({
                        id: nanoid(),
                        content: content,
                        score: similarity,
                      })),
                    }
                  }
                  return msg
                }),
              )
            } catch (e) {
              console.error('解析 SSE 数据错误:', e, '原始JSON字符串:', jsonDataString)
            }
          }
        }
      }

      setInput('')
      setMessageImgUrl('')
      setIsLoading(false)
    } catch (error) {
      console.error('发送消息或处理响应时出错:', error)
      setIsLoading(false)
      // 如果出错，可以考虑移除最后一条用户消息或添加错误提示消息
      setMessages((prevMessages) => {
        // 移除刚才添加的空(或部分填充的)助手消息
        const filteredMessages = prevMessages.filter((msg) => msg.id !== assistantMessageId)
        // 如果最后一条消息是用户发送的，并且这条用户消息是导致错误的，可以选择移除
        // 这个逻辑取决于您希望如何处理错误，当前代码是如果最后一条是用户消息则移除
        if (
          filteredMessages.length > 0 &&
          filteredMessages[filteredMessages.length - 1].role === 'user'
        ) {
          // 检查 newMessages 是否与 filteredMessages 的用户部分匹配
          const lastUserMessageInNew = newMessages.find((m) => m.role === 'user')
          const lastUserMessageInFiltered = filteredMessages[filteredMessages.length - 1]
          if (
            lastUserMessageInNew &&
            lastUserMessageInFiltered &&
            lastUserMessageInNew.id === lastUserMessageInFiltered.id
          ) {
            return filteredMessages.slice(0, -1)
          }
        }
        return filteredMessages
      })
    }
  }

  const handleSubmit = async () => {
    if (!input.trim() && !messageImgUrl) return // 防止发送空消息

    const userMessage: Message = {
      id: nanoid(),
      role: 'user',
      content: messageImgUrl
        ? [
            { type: 'image_url', image_url: { url: messageImgUrl } },
            { type: 'text', text: input },
          ]
        : input,
    }
    // 将新用户消息添加到当前消息列表，然后传递给 handleSendMessage
    await handleSendMessage([...messages, userMessage])
  }

  const handleRetry = (id: string) => {
    // 找到需要重试的消息（通常是用户消息）
    const messageToRetryIndex = messages.findIndex(
      (message) => message.id === id && message.role === 'user',
    )

    if (messageToRetryIndex !== -1) {
      // 获取到该用户消息之前的所有消息记录
      const messagesForRetry = messages.slice(0, messageToRetryIndex + 1)
      // 从当前UI中移除该用户消息之后的所有消息（通常是出错的助手消息）
      setMessages(messagesForRetry)
      // 使用这些消息重新发送
      handleSendMessage(messagesForRetry)
    } else {
      // 如果找不到指定ID的用户消息，或者想重试助手消息（逻辑会不同）
      // 一个简化的重试：找到该ID的助手消息，然后取其之前的用户消息进行重试
      const assistantMessageIndex = messages.findIndex(
        (msg) => msg.id === id && msg.role === 'assistant',
      )
      if (assistantMessageIndex > 0) {
        const userMessagesBeforeAssistant = messages
          .slice(0, assistantMessageIndex)
          .filter((m) => m.role === 'user')
        if (userMessagesBeforeAssistant.length > 0) {
          const contextForRetry = messages.slice(0, assistantMessageIndex)
          setMessages(contextForRetry) // 更新UI到重试点
          handleSendMessage(contextForRetry)
        }
      }
    }
  }

  return (
    <ChatMessages
      messages={messages}
      input={input}
      handleInputChange={handleInputChange}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      messageImgUrl={messageImgUrl}
      setMessagesImgUrl={setMessageImgUrl} // 修正笔误，应该是 setMessageImgUrl
      onRetry={handleRetry}
    />
  )
}

export default OpenaiSdk
