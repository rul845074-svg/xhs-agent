import { useCallback } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type OnConnect,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'input',
    position: { x: 80, y: 160 },
    data: { label: '① 选题策划' },
  },
  {
    id: '2',
    position: { x: 340, y: 160 },
    data: { label: '② AI 出稿' },
  },
  {
    id: '3',
    type: 'output',
    position: { x: 620, y: 160 },
    data: { label: '③ 反 AI 化 + 发布' },
  },
]

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e2-3', source: '2', target: '3', animated: true },
]

function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect: OnConnect = useCallback(
    (conn) => setEdges((eds) => addEdge({ ...conn, animated: true }, eds)),
    [setEdges],
  )

  return (
    <div className="w-screen h-screen bg-neutral-950">
      <header className="absolute top-0 left-0 right-0 z-10 px-6 py-4 flex items-center justify-between pointer-events-none">
        <div>
          <h1 className="text-xl font-semibold text-neutral-100">
            小红书 AI 工作流 · H5
          </h1>
          <p className="text-xs text-neutral-400 mt-0.5">
            脚手架已跑通 · 可拖拽节点 / 可连线 / 滚轮缩放
          </p>
        </div>
      </header>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
        colorMode="dark"
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
        <Controls />
        <MiniMap pannable zoomable />
      </ReactFlow>
    </div>
  )
}

export default App
