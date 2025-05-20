import React, { useEffect, useMemo, useState } from 'react'
import { Suspense } from 'react'
import { Skeleton } from 'antd'
import { ChatMainLayout } from '../../components/ChatMainLayout'
import LlamaindexSdk from '../../sdk/llamaindex'
import LangchainSdk from '../../sdk/langchain'
import OpenaiSdk from '../../sdk/openai-sdk'
import VercelAi from '../../sdk/vercel-ai'

const Loading = () => {
  return (
    <div className="flex flex-col gap-4 px-52 py-4">
      <Skeleton active />
      <Skeleton active />
      <Skeleton active />
    </div>
  )
}
const modelItems = [
  { label: 'OpenAI SDK', key: 'openai-sdk', component: <OpenaiSdk /> },
  { label: 'LLamaIndex', key: 'llamaindex', component: <LlamaindexSdk /> },
  { label: 'LangChain', key: 'langchain', component: <LangchainSdk /> },
  { label: 'Vercel AI SDK', key: 'vercel-ai-sdk', component: <VercelAi /> },
]

function ChatInputMessage() {
  const [selectedModel, setSelectedModel] = useState<string>()
  // modelItems.some((item) => item.key === typeFromUrl) ? typeFromUrl! : modelItems[0].key,
  React.useEffect(() => {}, [])
  const MainContent = useMemo(
    () => modelItems.find((item) => item.key === selectedModel)?.component,
    [selectedModel],
  )
  const handleModelChange = (model: string) => {
    console.log('model:', model)
    // const params = new URLSearchParams(searchParams)
    // params.set('type', model)
    // router.push(`${pathname}?${params.toString()}`)
    setSelectedModel(model)
  }
  return (
    <Suspense fallback={<Loading />}>
      <ChatMainLayout
        modelItems={modelItems}
        mainContent={MainContent}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
      />
    </Suspense>
  )
}

export default ChatInputMessage
