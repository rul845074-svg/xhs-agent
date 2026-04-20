import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  ReactFlow,
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
  type Edge,
  type Node,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { ArrowLeft, Play, Pause, RotateCcw, Layers, Waypoints } from 'lucide-react'

import { WORKFLOW_NODES, WORKFLOW_EDGES, type WorkflowNodeData } from '../data/workflow'
import { WORKFLOW_TOP_NODES, WORKFLOW_TOP_EDGES } from '../data/workflow-top'
import { ACCOUNTS, DEFAULT_ACCOUNT, type AccountId } from '../data/accounts'
import { SESSIONS, type AgentPhase, type AgentPhaseId } from '../data/sessions'
import { nodeTypes } from '../components/nodes'
import { NodeDetailPanel } from '../components/NodeDetailPanel'
import { TopBar } from '../components/TopBar'

type Props = { onBack: () => void }

type Layer = 'top' | 'pipe'

const PLAYBACK_SEQUENCE: Array<{ nodeId: string; phaseId?: AgentPhaseId }> = [
  { nodeId: 'entry' },
  { nodeId: 'mode', phaseId: 'topic' },
  { nodeId: 'topic-gen', phaseId: 'topic' },
  { nodeId: 'candidates', phaseId: 'topic' },
  { nodeId: 'human-pick', phaseId: 'topic' },
  { nodeId: 'copy', phaseId: 'copy' },
  { nodeId: 'copy-draft', phaseId: 'copy' },
  { nodeId: 'tag', phaseId: 'tag' },
  { nodeId: 'antiai', phaseId: 'antiai' },
  { nodeId: 'antiai-draft', phaseId: 'antiai' },
  { nodeId: 'antiai-check', phaseId: 'antiai' },
  { nodeId: 'cover', phaseId: 'cover' },
  { nodeId: 'cover-img', phaseId: 'cover' },
  { nodeId: 'cover-check', phaseId: 'cover' },
  { nodeId: 'package', phaseId: 'package' },
  { nodeId: 'exit' },
]

const STEP_MS = 750

export function WorkflowView({ onBack }: Props) {
  const [layer, setLayer] = useState<Layer>('pipe')
  const [activeAccount, setActiveAccount] = useState<AccountId>(DEFAULT_ACCOUNT)
  const [selectedDetailKey, setSelectedDetailKey] = useState<string | null>(null)

  const [nodes, setNodes, onNodesChange] = useNodesState(WORKFLOW_NODES)
  const [edges, setEdges, onEdgesChange] = useEdgesState(WORKFLOW_EDGES)

  // Playback state (only meaningful for pipe layer)
  const [playIdx, setPlayIdx] = useState<number>(-1)
  const [playing, setPlaying] = useState(false)
  const tickRef = useRef<number | null>(null)

  const account = ACCOUNTS[activeAccount]
  const accent = account.accent
  const session = SESSIONS[activeAccount]

  // Swap dataset on layer change
  useEffect(() => {
    if (layer === 'top') {
      setNodes(cloneNodes(WORKFLOW_TOP_NODES))
      setEdges(cloneEdges(WORKFLOW_TOP_EDGES))
      // kill any running playback
      setPlaying(false)
      setPlayIdx(-1)
    } else {
      setNodes(cloneNodes(WORKFLOW_NODES))
      setEdges(cloneEdges(WORKFLOW_EDGES))
    }
    setSelectedDetailKey(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layer])

  // Paint playback state onto pipe layer
  useEffect(() => {
    if (layer !== 'pipe') return
    paintPipeLayer(setNodes, setEdges, playIdx, accent)
  }, [layer, playIdx, accent, setNodes, setEdges])

  // Advance playback tick
  useEffect(() => {
    if (!playing) {
      if (tickRef.current) {
        window.clearTimeout(tickRef.current)
        tickRef.current = null
      }
      return
    }
    if (playIdx >= PLAYBACK_SEQUENCE.length - 1) {
      setPlaying(false)
      return
    }
    tickRef.current = window.setTimeout(() => {
      setPlayIdx((i) => i + 1)
    }, STEP_MS)
    return () => {
      if (tickRef.current) window.clearTimeout(tickRef.current)
    }
  }, [playing, playIdx])

  // Auto-open detail for the active node during playback
  useEffect(() => {
    if (layer !== 'pipe' || playIdx < 0) return
    const step = PLAYBACK_SEQUENCE[playIdx]
    if (step) setSelectedDetailKey(step.nodeId)
  }, [playIdx, layer])

  const startPlayback = () => {
    setPlayIdx(-1)
    setPlaying(true)
    setTimeout(() => setPlayIdx(0), 40)
  }
  const togglePlayback = () => {
    if (playIdx >= PLAYBACK_SEQUENCE.length - 1) {
      startPlayback()
      return
    }
    setPlaying((p) => !p)
    if (playIdx < 0) setPlayIdx(0)
  }
  const resetPlayback = () => {
    setPlaying(false)
    setPlayIdx(-1)
  }

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    const data = node.data as WorkflowNodeData
    setSelectedDetailKey(data.detailKey)
  }, [])

  const onPaneClick = useCallback(() => setSelectedDetailKey(null), [])

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

  const defaultEdgeOptions = useMemo(() => ({ style: { strokeWidth: 1.5 } }), [])

  // Playback overlay for the detail panel
  const playbackOverlay = useMemo(() => {
    if (layer !== 'pipe' || playIdx < 0 || !selectedDetailKey) return null
    const step = PLAYBACK_SEQUENCE.find((s) => s.nodeId === selectedDetailKey)
    if (!step?.phaseId) return null
    const phase = session.phases.find((p): p is AgentPhase => p.id === step.phaseId)
    if (!phase) return null
    return {
      phaseLabel: phase.label,
      note: phase.note,
      doneSummary: phase.doneSummary,
      durationMs: phase.durationMs,
    }
  }, [layer, playIdx, selectedDetailKey, session])

  const progress =
    playIdx < 0
      ? 0
      : Math.min(100, ((playIdx + 1) / PLAYBACK_SEQUENCE.length) * 100)

  return (
    <div className="w-screen h-screen bg-neutral-950 relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-30 transition-colors duration-500"
        style={{
          background: `radial-gradient(ellipse at 20% 10%, ${account.accentSoft} 0%, transparent 55%)`,
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

      <button
        onClick={onBack}
        className="absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-lg bg-neutral-900/85 backdrop-blur-md border border-neutral-800 text-[12px] text-neutral-300 hover:text-neutral-50 hover:bg-neutral-800 transition"
      >
        <ArrowLeft size={14} />
        返回工作台
      </button>

      <TopBar activeAccount={activeAccount} onAccountChange={setActiveAccount} />

      <LayerTabs layer={layer} onChange={setLayer} accent={accent} />

      {layer === 'pipe' && (
        <PlaybackDock
          accent={accent}
          playing={playing}
          playIdx={playIdx}
          total={PLAYBACK_SEQUENCE.length}
          progress={progress}
          accountLabel={account.shortName}
          sessionLabel={session.meta.sessionLabel}
          onToggle={togglePlayback}
          onRestart={startPlayback}
          onReset={resetPlayback}
        />
      )}

      <NodeDetailPanel
        detailKey={selectedDetailKey}
        onClose={() => setSelectedDetailKey(null)}
        accent={accent}
        playbackOverlay={playbackOverlay}
      />

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
        <div className="px-4 py-2 rounded-full bg-neutral-900/80 backdrop-blur-md border border-neutral-800 text-[11px] text-neutral-400">
          {layer === 'top'
            ? '设计视角 · 图 ① 顶层路由 · 点节点看详情'
            : '设计视角 · 图 ② Agent 编排 · 点节点看六字段卡 · 可回放本号 Session'}
        </div>
      </div>
    </div>
  )
}

function LayerTabs({
  layer,
  onChange,
  accent,
}: {
  layer: Layer
  onChange: (l: Layer) => void
  accent: string
}) {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 p-1 rounded-xl bg-neutral-900/85 backdrop-blur-md border border-neutral-800">
      <TabBtn
        active={layer === 'top'}
        accent={accent}
        onClick={() => onChange('top')}
        icon={<Layers size={13} />}
      >
        图 ① 顶层路由
      </TabBtn>
      <TabBtn
        active={layer === 'pipe'}
        accent={accent}
        onClick={() => onChange('pipe')}
        icon={<Waypoints size={13} />}
      >
        图 ② Agent 编排
      </TabBtn>
    </div>
  )
}

function TabBtn({
  active,
  accent,
  onClick,
  icon,
  children,
}: {
  active: boolean
  accent: string
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all"
      style={{
        color: active ? '#fff' : '#a1a1aa',
        background: active ? `${accent}33` : 'transparent',
        border: active ? `1px solid ${accent}66` : '1px solid transparent',
      }}
    >
      {icon}
      {children}
    </button>
  )
}

function PlaybackDock({
  accent,
  playing,
  playIdx,
  total,
  progress,
  accountLabel,
  sessionLabel,
  onToggle,
  onRestart,
  onReset,
}: {
  accent: string
  playing: boolean
  playIdx: number
  total: number
  progress: number
  accountLabel: string
  sessionLabel: string
  onToggle: () => void
  onRestart: () => void
  onReset: () => void
}) {
  const atStart = playIdx < 0
  const atEnd = playIdx >= total - 1

  return (
    <div className="absolute top-20 right-4 z-20 w-[300px] rounded-xl bg-neutral-900/90 backdrop-blur-md border border-neutral-800 p-3.5">
      <div
        className="text-[10px] uppercase tracking-widest font-semibold mb-1 flex items-center gap-1.5"
        style={{ color: accent }}
      >
        <span
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: accent }}
        />
        Session 回放 · {accountLabel}
      </div>
      <div className="text-[12.5px] text-neutral-100 font-medium leading-snug mb-2.5">
        {sessionLabel}
      </div>

      <div className="h-1.5 rounded-full bg-neutral-800 overflow-hidden mb-2.5">
        <div
          className="h-full transition-all duration-300"
          style={{ width: `${progress}%`, background: accent }}
        />
      </div>

      <div className="flex items-center justify-between gap-2">
        <div className="text-[10.5px] text-neutral-500">
          {atStart ? '未开始' : `第 ${Math.min(playIdx + 1, total)} / ${total} 步`}
        </div>
        <div className="flex items-center gap-1.5">
          <IconBtn
            onClick={onReset}
            disabled={atStart && !playing}
            title="清空回放"
          >
            <RotateCcw size={13} />
          </IconBtn>
          <button
            onClick={atEnd ? onRestart : onToggle}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition-all hover:brightness-110 active:scale-95"
            style={{ background: accent }}
          >
            {atEnd ? (
              <>
                <RotateCcw size={13} /> 再来一次
              </>
            ) : playing ? (
              <>
                <Pause size={13} /> 暂停
              </>
            ) : (
              <>
                <Play size={13} /> {atStart ? '开始回放' : '继续'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function IconBtn({
  onClick,
  disabled,
  title,
  children,
}: {
  onClick: () => void
  disabled?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="flex items-center justify-center w-7 h-7 rounded-md bg-neutral-800/70 text-neutral-300 hover:bg-neutral-700 hover:text-neutral-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  )
}

// --- helpers ---

function cloneNodes(nodes: Node<WorkflowNodeData>[]): Node<WorkflowNodeData>[] {
  return nodes.map((n) => ({ ...n, data: { ...n.data } }))
}

function cloneEdges(edges: Edge[]): Edge[] {
  return edges.map((e) => ({ ...e, style: { ...(e.style ?? {}) } }))
}

function paintPipeLayer(
  setNodes: (updater: (nds: Node<WorkflowNodeData>[]) => Node<WorkflowNodeData>[]) => void,
  setEdges: (updater: (eds: Edge[]) => Edge[]) => void,
  playIdx: number,
  accent: string,
) {
  const activeId = playIdx >= 0 ? PLAYBACK_SEQUENCE[playIdx]?.nodeId : undefined
  const visited = new Set(
    playIdx >= 0 ? PLAYBACK_SEQUENCE.slice(0, playIdx).map((s) => s.nodeId) : [],
  )
  const playbackOff = playIdx < 0

  setNodes((nds) =>
    nds.map((n) => {
      const data = n.data as WorkflowNodeData & {
        playback?: 'visited' | 'active' | 'pending'
        accent?: string
      }
      let state: 'visited' | 'active' | 'pending' | undefined
      if (playbackOff) {
        state = undefined
      } else if (n.id === activeId) {
        state = 'active'
      } else if (visited.has(n.id)) {
        state = 'visited'
      } else {
        state = 'pending'
      }
      return {
        ...n,
        data: { ...data, playback: state, accent },
      }
    }),
  )

  setEdges((eds) =>
    eds.map((e) => {
      if (playbackOff) {
        return restoreEdge(e)
      }
      const isTraversed = visited.has(e.source) && (visited.has(e.target) || e.target === activeId)
      const isEntering = e.target === activeId && visited.has(e.source)
      if (isEntering || isTraversed) {
        return {
          ...e,
          animated: true,
          style: {
            ...(e.style ?? {}),
            stroke: accent,
            strokeWidth: 2.2,
            strokeOpacity: 1,
          },
          labelStyle: { fill: accent, fontWeight: 700 },
        }
      }
      return {
        ...e,
        style: { ...(e.style ?? {}), strokeOpacity: 0.25 },
      }
    }),
  )
}

// Restore edge to original styling (matches workflow.ts definitions)
function restoreEdge(e: Edge): Edge {
  const orig = WORKFLOW_EDGES.find((o) => o.id === e.id)
  if (!orig) return e
  return {
    ...e,
    animated: orig.animated,
    style: { ...(orig.style ?? {}) },
    labelStyle: undefined,
  }
}
