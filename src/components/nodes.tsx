import { Handle, Position, type NodeProps } from '@xyflow/react'
import {
  Bot,
  UserRound,
  GitBranch,
  Wand2,
  FileText,
  Package as PackageIcon,
  Waypoints,
  ShieldAlert,
  type LucideIcon,
} from 'lucide-react'
import type { WorkflowNodeData, NodeKind } from '../data/workflow'

type Palette = {
  accent: string
  border: string
  bg: string
  iconBg: string
  iconColor: string
  tag: string
  tagColor: string
}

const PALETTES: Record<NodeKind, Palette> = {
  agent: {
    accent: '#10b981',
    border: 'rgba(16, 185, 129, 0.45)',
    bg: 'linear-gradient(135deg, rgba(16,185,129,0.14) 0%, rgba(16,185,129,0.03) 100%)',
    iconBg: 'rgba(16, 185, 129, 0.22)',
    iconColor: '#34d399',
    tag: 'LLM AGENT',
    tagColor: '#34d399',
  },
  human: {
    accent: '#f59e0b',
    border: 'rgba(245, 158, 11, 0.5)',
    bg: 'linear-gradient(135deg, rgba(245,158,11,0.14) 0%, rgba(245,158,11,0.03) 100%)',
    iconBg: 'rgba(245, 158, 11, 0.22)',
    iconColor: '#fbbf24',
    tag: 'HUMAN GATE',
    tagColor: '#fbbf24',
  },
  decision: {
    accent: '#8b5cf6',
    border: 'rgba(139, 92, 246, 0.5)',
    bg: 'linear-gradient(135deg, rgba(139,92,246,0.14) 0%, rgba(139,92,246,0.03) 100%)',
    iconBg: 'rgba(139, 92, 246, 0.22)',
    iconColor: '#a78bfa',
    tag: 'DECISION',
    tagColor: '#a78bfa',
  },
  action: {
    accent: '#64748b',
    border: 'rgba(100, 116, 139, 0.5)',
    bg: 'linear-gradient(135deg, rgba(100,116,139,0.14) 0%, rgba(100,116,139,0.03) 100%)',
    iconBg: 'rgba(100, 116, 139, 0.22)',
    iconColor: '#94a3b8',
    tag: 'RULE ACTION',
    tagColor: '#94a3b8',
  },
  product: {
    accent: '#71717a',
    border: 'rgba(113, 113, 122, 0.35)',
    bg: 'rgba(39, 39, 42, 0.55)',
    iconBg: 'rgba(113, 113, 122, 0.18)',
    iconColor: '#a1a1aa',
    tag: 'ARTIFACT',
    tagColor: '#a1a1aa',
  },
  io: {
    accent: '#0ea5e9',
    border: 'rgba(14, 165, 233, 0.5)',
    bg: 'linear-gradient(135deg, rgba(14,165,233,0.14) 0%, rgba(14,165,233,0.03) 100%)',
    iconBg: 'rgba(14, 165, 233, 0.22)',
    iconColor: '#38bdf8',
    tag: 'PIPELINE I/O',
    tagColor: '#38bdf8',
  },
  terminal: {
    accent: '#14b8a6',
    border: 'rgba(20, 184, 166, 0.5)',
    bg: 'linear-gradient(135deg, rgba(20,184,166,0.14) 0%, rgba(20,184,166,0.03) 100%)',
    iconBg: 'rgba(20, 184, 166, 0.22)',
    iconColor: '#5eead4',
    tag: 'PACKAGE',
    tagColor: '#5eead4',
  },
  error: {
    accent: '#f43f5e',
    border: 'rgba(244, 63, 94, 0.55)',
    bg: 'linear-gradient(135deg, rgba(244,63,94,0.14) 0%, rgba(244,63,94,0.03) 100%)',
    iconBg: 'rgba(244, 63, 94, 0.22)',
    iconColor: '#fb7185',
    tag: 'REJECT SINK',
    tagColor: '#fb7185',
  },
}

const ICONS: Record<NodeKind, LucideIcon> = {
  agent: Bot,
  human: UserRound,
  decision: GitBranch,
  action: Wand2,
  product: FileText,
  io: Waypoints,
  terminal: PackageIcon,
  error: ShieldAlert,
}

function NodeBase({
  data,
  selected,
  kind,
}: NodeProps & { kind: NodeKind; data: WorkflowNodeData }) {
  const p = PALETTES[kind]
  const Icon = ICONS[kind]
  const isSmall = kind === 'product'

  return (
    <div
      className="group relative rounded-xl backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5"
      style={{
        minWidth: isSmall ? 180 : 220,
        maxWidth: isSmall ? 210 : 250,
        padding: isSmall ? '8px 12px' : '10px 14px',
        border: `1px solid ${p.border}`,
        background: p.bg,
        boxShadow: selected
          ? `0 0 0 1.5px ${p.accent}, 0 0 24px 2px ${p.accent}55, 0 8px 24px rgba(0,0,0,0.35)`
          : '0 4px 18px rgba(0,0,0,0.35)',
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: p.accent,
          width: 8,
          height: 8,
          border: '2px solid rgba(10,10,10,0.9)',
        }}
      />
      <div className="flex items-start gap-2.5">
        <div
          className="flex-shrink-0 flex items-center justify-center rounded-md"
          style={{
            width: isSmall ? 24 : 28,
            height: isSmall ? 24 : 28,
            background: p.iconBg,
            color: p.iconColor,
            marginTop: 1,
          }}
        >
          <Icon size={isSmall ? 14 : 16} strokeWidth={2} />
        </div>
        <div className="flex-1 min-w-0">
          <div
            className="font-medium leading-[0.9] tracking-wider"
            style={{ fontSize: 9, color: p.tagColor, opacity: 0.85 }}
          >
            {p.tag}
          </div>
          <div
            className="font-semibold text-neutral-100 leading-tight mt-1"
            style={{ fontSize: isSmall ? 13 : 14 }}
          >
            {data.label}
          </div>
          {data.subtitle && (
            <div className="text-neutral-400 leading-snug mt-1" style={{ fontSize: 11 }}>
              {data.subtitle}
            </div>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: p.accent,
          width: 8,
          height: 8,
          border: '2px solid rgba(10,10,10,0.9)',
        }}
      />
    </div>
  )
}

export const nodeTypes = {
  agent: (props: NodeProps) => (
    <NodeBase {...props} kind="agent" data={props.data as WorkflowNodeData} />
  ),
  human: (props: NodeProps) => (
    <NodeBase {...props} kind="human" data={props.data as WorkflowNodeData} />
  ),
  decision: (props: NodeProps) => (
    <NodeBase {...props} kind="decision" data={props.data as WorkflowNodeData} />
  ),
  action: (props: NodeProps) => (
    <NodeBase {...props} kind="action" data={props.data as WorkflowNodeData} />
  ),
  product: (props: NodeProps) => (
    <NodeBase {...props} kind="product" data={props.data as WorkflowNodeData} />
  ),
  io: (props: NodeProps) => <NodeBase {...props} kind="io" data={props.data as WorkflowNodeData} />,
  terminal: (props: NodeProps) => (
    <NodeBase {...props} kind="terminal" data={props.data as WorkflowNodeData} />
  ),
  error: (props: NodeProps) => (
    <NodeBase {...props} kind="error" data={props.data as WorkflowNodeData} />
  ),
}

export const NODE_LEGEND: Array<{ kind: NodeKind; label: string; desc: string }> = [
  { kind: 'agent', label: 'LLM Agent', desc: '4 核心 · 六字段卡' },
  { kind: 'human', label: 'Human Gate', desc: '3 处人工卡点' },
  { kind: 'decision', label: 'Decision', desc: '判断分流 / 机审' },
  { kind: 'action', label: 'Rule Action', desc: '纯规则 · 不调 LLM' },
  { kind: 'product', label: 'Artifact', desc: '中间产物（VersionRepo）' },
  { kind: 'io', label: 'Pipeline I/O', desc: '与图 ① 衔接' },
  { kind: 'terminal', label: 'Package', desc: '发布就绪包' },
  { kind: 'error', label: 'Reject Sink', desc: '→ 驳回规则表' },
]
