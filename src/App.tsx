import { useCallback, useMemo, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { WORKFLOW_NODES, WORKFLOW_EDGES, type WorkflowNodeData } from './data/workflow'
import { ACCOUNTS, DEFAULT_ACCOUNT, type AccountId } from './data/accounts'
import { nodeTypes } from './components/nodes'
import { NodeDetailPanel } from './components/NodeDetailPanel'
import { TopBar } from './components/TopBar'

function App() {
  const [activeAccount, setActiveAccount] = useState<AccountId>(DEFAULT_ACCOUNT)
  const [selectedDetailKey, setSelectedDetailKey] = useState<string | null>(null)

  const [nodes, , onNodesChange] = useNodesState(WORKFLOW_NODES)
  const [edges, , onEdgesChange] = useEdgesState(WORKFLOW_EDGES)

  const accent = ACCOUNTS[activeAccount].accent

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const data = node.data as WorkflowNodeData
    setSelectedDetailKey(data.detailKey)
  }, [])

  const onPaneClick = useCallback(() => {
    setSelectedDetailKey(null)
  }, [])

  const miniMapNodeColor = useCallback((node: { data?: unknown }) => {
    const data = node.data as WorkflowNodeData | undefined
    if (!data) return '#52525b'
    switch (data.kind) {
      case 'agent': return '#10b981'
      case 'human': return '#f59e0b'
      case 'decision': return '#8b5cf6'
      case 'action': return '#64748b'
      case 'product': return '#71717a'
      case 'io': return '#0ea5e9'
      case 'terminal': return '#14b8a6'
      case 'error': return '#f43f5e'
      default: return '#52525b'
    }
  }, [])

  const defaultEdgeOptions = useMemo(
    () => ({
      style: { strokeWidth: 1.5 },
    }),
    [],
  )

  return (
    <div className="w-screen h-screen bg-neutral-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30 transition-colors duration-500"
        style={{
          background: `radial-gradient(ellipse at 20% 10%, ${ACCOUNTS[activeAccount].accentSoft} 0%, transparent 55%)`,
        }}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.18, maxZoom: 0.85 }}
        minZoom={0.25}
        maxZoom={1.6}
        colorMode="dark"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={18}
          size={1}
          color="rgba(82,82,91,0.35)"
        />
        <Controls
          position="bottom-left"
          showInteractive={false}
          style={{
            background: 'rgba(24, 24, 27, 0.85)',
            border: '1px solid rgba(63, 63, 70, 0.6)',
            borderRadius: 8,
            backdropFilter: 'blur(8px)',
          }}
        />
        <MiniMap
          position="bottom-right"
          pannable
          zoomable
          nodeColor={miniMapNodeColor}
          nodeStrokeWidth={2}
          maskColor="rgba(10, 10, 10, 0.75)"
          style={{
            background: 'rgba(24, 24, 27, 0.9)',
            border: '1px solid rgba(63, 63, 70, 0.6)',
            borderRadius: 8,
          }}
        />
      </ReactFlow>

      <TopBar activeAccount={activeAccount} onAccountChange={setActiveAccount} />

      <NodeDetailPanel
        detailKey={selectedDetailKey}
        onClose={() => setSelectedDetailKey(null)}
        accent={accent}
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-[11px] text-neutral-400">
          点节点查看六字段卡 · 拖动画布 · 滚轮缩放
        </div>
      </div>
    </div>
  )
}

export default App
