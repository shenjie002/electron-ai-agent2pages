import React, { useMemo } from 'react'
// 确保从你的项目中正确导入
// import { RagDoc } from './interface'; // 假设你的 RagDoc 类型定义
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  SandpackFileExplorer,
} from '@codesandbox/sandpack-react'

import { isEmpty } from 'lodash'

// 假设 parseAiOutputToCodeTemplateCorrected 定义在当前文件或已导入
// function parseAiOutputToCodeTemplateCorrected(rawAiOutput: string): Record<string, string> { ... }

interface AssistantMessageProps {
  message: string
}

// 从您的 Storybook 示例中获取的 Mock 数据
const mockTasksForSandpack = [
  { id: '1', content: '任务一 (来自Sandpack)', completed: false },
  { id: '2', content: '任务二 (来自Sandpack)', completed: false },
]

// 用于注入到 Sandpack 的 App.tsx 的内容模板
const appTsxContentTemplate = (
  tasksJson?: string,
) => `import React, { useState, useCallback } from 'react';
import {TaskBoard} from './common';
import type { Task } from './interface';

const initialTasks: Task[] = [
  { "id": "1", "content": "任务一 (来自Sandpack)", "completed": true },
  { "id": "2", "content": "任务二 (来自Sandpack)", "completed": false }
];

const App: React.FC = () => {
  const [currentTasks, setCurrentTasks] = useState<Task[]>(initialTasks);

  const handleSearch = useCallback((keyword: string) => {
    console.log('Sandpack Search:', keyword);
  }, []);

  const handleAdd = useCallback((content: string) => {
    console.log('Sandpack Add:', content);
    const newTask: Task = { id: String(Date.now()), content, completed: false };
    setCurrentTasks(prevTasks => [...prevTasks, newTask]);
  }, []);

  const handleDelete = useCallback((id: string) => {
    console.log('Sandpack Delete:', id);
    setCurrentTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  }, []);

  const handleStatusChange = useCallback((id: string) => {
    console.log('Sandpack Status Change:', id);
    setCurrentTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  return (
    <div style={{ padding: '10px', fontFamily: 'sans-serif' }}>
      <TaskBoard
        tasks={currentTasks}
        onSearch={handleSearch}
        onAdd={handleAdd}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default App;
`

// 用于注入到 Sandpack 的 index.tsx (入口文件) 的内容
const indexTsxSandpackEntryContent = `import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// 如果你的组件有全局样式，可以在这里引入，确保该CSS文件也包含在 Sandpack files 中
// import './styles.css'; 

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element for Sandpack');

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`

export const AssistantMessageSandpack: React.FC<AssistantMessageProps> = ({ message }) => {
  const sandpackData = useMemo(() => {
    if (typeof message !== 'string' || isEmpty(message)) {
      return null
    }

    // 尝试解析消息内容
    // 注意：你可能需要更强的的判断逻辑来确定消息是否真的包含要给Sandpack的代码
    // 例如，检查是否存在多个 ```typescript 块或特定的关键词
    const parsedFiles = parseAiOutputToCodeTemplateCorrected(message)
    console.log('Parsed files for Sandpack:', parsedFiles)
    // 如果没有解析到文件，或者核心文件TaskBoard.tsx不存在，则不使用Sandpack
    if (Object.keys(parsedFiles).length === 0) {
      // 如果没有解析到文件，或者核心文件TaskBoard.tsx不存在，则不使用Sandpack
      return null
    }

    const sandpackFiles = { ...parsedFiles }

    // 1. 将 /index.ts 重命名为 /common.ts
    if (sandpackFiles['/index.ts']) {
      sandpackFiles['/common.ts'] = sandpackFiles['/index.ts']
      delete sandpackFiles['/index.ts']
    } else {
      // 如果AI没有生成index.ts，但我们App.tsx依赖它(作为common.ts), 需要处理这个情况
      // 可能是AI直接导出了TaskBoard.tsx，那么App.tsx的导入也需要调整
      // 这里假设AI总是提供类似结构的index.ts
      console.warn("AI output did not contain '/index.ts' to be renamed to '/common.ts'")
    }

    // 2. 注入 App.tsx
    // 尝试从解析出的 TaskBoard.stories.tsx 获取 mockTasks，如果失败则用硬编码的
    const tasksForApp = mockTasksForSandpack
    try {
      if (sandpackFiles['/TaskBoard.stories.tsx']) {
        // 这是一个简化的提取，实际中从字符串提取JS对象可能需要更复杂的解析
        // 或者让AI直接在某个地方提供JSON格式的mock数据
        const storyFileContent = sandpackFiles['/TaskBoard.stories.tsx']
        const mockTasksRegex = /const mockTasks\s*=\s*(\[[\s\S]*?\]);/
        const regexMatch = storyFileContent.match(mockTasksRegex)
        if (regexMatch && regexMatch[1]) {
          // 注意: eval有安全风险，实际应用中应避免或使用安全的解析库
          // tasksForApp = eval(regexMatch[1]);
          // 由于eval的风险，且直接从字符串转对象复杂，这里我们先用预设的
          console.log('Extracted mockTasks string (needs safe parsing):', regexMatch[1])
        }
      }
    } catch (e) {
      console.error('Error parsing mockTasks from story for Sandpack, using default.', e)
    }
    sandpackFiles['/App.tsx'] = appTsxContentTemplate(JSON.stringify(tasksForApp, null, 2))

    // 3. 注入 index.tsx (Sandpack 入口)
    sandpackFiles['/index.tsx'] = indexTsxSandpackEntryContent

    // 确保入口文件是可见的且被Sandpack使用
    // Sandpack的react-ts模板默认入口是 /index.tsx

    // 确定活动文件
    let activeFile = '/TaskBoard.tsx' // 默认显示 TaskBoard.tsx
    if (!sandpackFiles[activeFile]) {
      // 如果TaskBoard.tsx不存在，尝试App.tsx
      activeFile = '/App.tsx'
    }
    if (!sandpackFiles[activeFile]) {
      // 如果App.tsx也不存在，尝试common.ts
      activeFile = '/common.ts'
    }
    if (!sandpackFiles[activeFile]) {
      // 最后尝试interface.ts
      activeFile = '/interface.ts'
    }

    return {
      files: sandpackFiles,
      activeFile: activeFile,
    }
  }, [message])
  console.log('Sandpack data:', sandpackData)
  // 如果 sandpackData 存在，则渲染 Sandpack，否则渲染原来的消息
  if (sandpackData) {
    return (
      <div className="assistant-message my-4 p-4 bg-gray-800 rounded-lg text-white sandpack-container">
        {/* 你可能想在这里加一个标题或简短描述 */}
        <p className="text-sm text-gray-400 mb-2">交互式代码示例 (Sandpack):</p>
        {/* 重要依赖提示: 
          下面的Sandpack实例中的TaskBoard.tsx代码，如果原始代码包含无法在浏览器标准环境或
          Sandpack默认环境中解析的导入（例如'antd'），将会执行失败或显示错误。
          您需要确保传递给Sandpack的代码是兼容的。
        */}
        <SandpackProvider
          template="react-ts"
          files={sandpackData.files}
          theme="dark" // 或者其他主题如 "light", "auto"
          //   editorHeight="400px"
          options={{
            activeFile: sandpackData.activeFile,
            visibleFiles: Object.keys(sandpackData.files).filter(
              (f) => !f.endsWith('.stories.tsx'),
            ), // 隐藏stories文件
            // editorHeight: '400px' // 可选：调整编辑器高度
            // entry: "/index.tsx", // react-ts 模板通常会自动找到 /index.tsx
          }}
          customSetup={{
            dependencies: {
              antd: '5.17.0', // 指定一个具体的 antd 版本 (v5.17.0 是一个较新稳定版)
              react: '^18.3.0',
              'react-dom': '^18.3.0',
              '@types/react': '^18.3.0',
              '@types/react-dom': '^18.3.0',
              // 其他依赖...
              // 如果 TaskBoard.tsx 或其他组件也用到了 antd 图标，可能需要添加：
              // "@ant-design/icons": "latest"
            },
            // entry: "/index.tsx", // react-ts 模板通常会自动设置，但也可以显式指定
          }}
        >
          <SandpackLayout>
            <SandpackFileExplorer />
            <SandpackCodeEditor closableTabs showLineNumbers wrapContent />
            <SandpackPreview />
          </SandpackLayout>
        </SandpackProvider>
      </div>
    )
  }

  // 原来的消息展示逻辑
  return (
    <div className="assistant-message my-4 p-4 bg-gray-800 rounded-lg text-white">
      {/* 这里可以渲染Markdown或者纯文本 */}
      <div dangerouslySetInnerHTML={{ __html: message /* 如果message是HTML的话，注意XSS风险 */ }} />
    </div>
  )
}

// 提取逻辑

function parseAiOutputToCodeTemplateCorrected(rawAiOutput: string): Record<string, string> {
  const template: Record<string, string> = {}
  // 正则表达式用于匹配每个文件块：
  // - 匹配 "数字. 文件名" (捕获文件名 - match[1], 扩展名是内部的 match[2])
  // - 匹配紧随其后的 ```typescript 代码块 (捕获代码内容 - match[3])
  const fileBlockRegex = /\d+\.\s*([\w.-]+\.(ts|tsx))\s*\n\`\`\`typescript\s*\n([\s\S]*?)\n\`\`\`/g

  let match
  while ((match = fileBlockRegex.exec(rawAiOutput)) !== null) {
    // match[1] 是捕获到的文件名 (例如 "index.ts")
    // match[3] 是捕获到的代码内容
    const fileName = `/${match[1].trim()}` // 添加 "/" 前缀并去除可能的多余空格
    const codeContent = match[3].trim() // 使用 match[3] 并去除代码内容前后可能的多余空格或换行

    template[fileName] = codeContent
  }

  return template
}
// export default AssistantMessage; // 如果这是独立文件
