import type { Edge, Node } from '@xyflow/react'
import type { WorkflowNodeData } from './workflow'

type WNode = Node<WorkflowNodeData>

// Upper row: Agents & actions (consumers / producers)
// Lower row: Data substrate (KB / Memory / Repo / Bus)

export const WORKFLOW_DATA_NODES: WNode[] = [
  // --- Upper: Agents & actions ---
  {
    id: 'da-topic',
    type: 'agent',
    position: { x: 0, y: 0 },
    data: {
      label: '选题 Agent',
      kind: 'agent',
      subtitle: '生成 / 包装 双模式',
      detailKey: 'topic-gen',
    },
  },
  {
    id: 'da-copy',
    type: 'agent',
    position: { x: 260, y: 0 },
    data: {
      label: '文案生成 Agent',
      kind: 'agent',
      subtitle: '按选题 + 人设 → 笔记草稿',
      detailKey: 'copy',
    },
  },
  {
    id: 'da-tag',
    type: 'action',
    position: { x: 520, y: 0 },
    data: {
      label: '自动打标',
      kind: 'action',
      subtitle: '纯规则 · AI 合规标',
      detailKey: 'tag',
    },
  },
  {
    id: 'da-antiai',
    type: 'agent',
    position: { x: 780, y: 0 },
    data: {
      label: '反 AI 化 Agent',
      kind: 'agent',
      subtitle: '读痕迹库 + 上次拒绝理由',
      detailKey: 'antiai',
    },
  },
  {
    id: 'da-cover',
    type: 'agent',
    position: { x: 1040, y: 0 },
    data: {
      label: '封面生图 Agent',
      kind: 'agent',
      subtitle: '读视觉档案 · 过机审',
      detailKey: 'cover',
    },
  },
  {
    id: 'da-compliance',
    type: 'decision',
    position: { x: 1300, y: 0 },
    data: {
      label: 'Compliance',
      kind: 'decision',
      subtitle: '图 ① 合规终审',
      detailKey: 'top-compliance',
    },
  },

  // --- Middle bus: Session + VersionRepo
  {
    id: 'db-session',
    type: 'bus',
    position: { x: 380, y: 240 },
    data: {
      label: 'Session · 跨 Agent 上下文',
      kind: 'bus',
      subtitle: '单次请求内 · 反 AI Feedback 写这里',
      detailKey: 'data-session',
    },
  },
  {
    id: 'db-repo',
    type: 'repo',
    position: { x: 860, y: 240 },
    data: {
      label: 'VersionRepo · 版本仓',
      kind: 'repo',
      subtitle: '按 Session 隔离 · 可 diff',
      detailKey: 'data-repo',
    },
  },

  // --- Lower: KBs & Memory ---
  {
    id: 'db-stylekb',
    type: 'kb-private',
    position: { x: 0, y: 460 },
    data: {
      label: 'StyleKB · 人设库',
      kind: 'kb-private',
      subtitle: '× 3 号隔离 · 人设/爆款/视觉档案',
      detailKey: 'data-stylekb',
    },
  },
  {
    id: 'db-longmem',
    type: 'memory',
    position: { x: 340, y: 460 },
    data: {
      label: 'LongMem · 长期记忆',
      kind: 'memory',
      subtitle: '× 3 号隔离 · 8 枚举策略',
      detailKey: 'data-longmem',
    },
  },
  {
    id: 'db-antiaikb',
    type: 'kb-shared',
    position: { x: 680, y: 460 },
    data: {
      label: 'AntiAIKB · 反 AI 化痕迹库',
      kind: 'kb-shared',
      subtitle: '全局共享 · R\\d{3} 规则表',
      detailKey: 'data-antiaikb',
    },
  },
  {
    id: 'db-policykb',
    type: 'kb-shared',
    position: { x: 1020, y: 460 },
    data: {
      label: 'PolicyKB · 合规规则库',
      kind: 'kb-shared',
      subtitle: '全局共享 · 敏感词 / 广告法 / 版权',
      detailKey: 'data-policykb',
    },
  },
]

// Edge style helpers
const readStyle = {
  stroke: 'rgba(148, 163, 184, 0.55)',
  strokeWidth: 1.4,
  strokeDasharray: '5 4',
}
const writeStyle = {
  stroke: 'rgba(52, 211, 153, 0.85)',
  strokeWidth: 1.6,
}
const rwStyle = {
  stroke: 'rgba(236, 72, 153, 0.8)',
  strokeWidth: 1.6,
}

type DataEdge = Edge & { data?: { access: 'R' | 'W' | 'RW' } }

function rw(
  id: string,
  source: string,
  target: string,
  access: 'R' | 'W' | 'RW',
): DataEdge {
  const style = access === 'R' ? readStyle : access === 'W' ? writeStyle : rwStyle
  return {
    id,
    source,
    target,
    label: access,
    labelStyle: {
      fontSize: 10,
      fontWeight: 700,
      fill:
        access === 'R'
          ? '#94a3b8'
          : access === 'W'
            ? '#34d399'
            : '#f9a8d4',
    },
    labelBgStyle: { fill: 'rgba(24,24,27,0.85)' },
    labelBgPadding: [4, 2] as [number, number],
    labelBgBorderRadius: 4,
    data: { access },
    style,
  }
}

export const WORKFLOW_DATA_EDGES: DataEdge[] = [
  // Topic Agent
  rw('dt-sk', 'da-topic', 'db-stylekb', 'R'),
  rw('dt-lm', 'da-topic', 'db-longmem', 'R'),
  rw('dt-ss', 'da-topic', 'db-session', 'RW'),
  rw('dt-vr', 'da-topic', 'db-repo', 'W'),

  // Copy Agent
  rw('dc-sk', 'da-copy', 'db-stylekb', 'R'),
  rw('dc-ss', 'da-copy', 'db-session', 'RW'),
  rw('dc-vr', 'da-copy', 'db-repo', 'W'),

  // Tag action
  rw('dg-pk', 'da-tag', 'db-policykb', 'R'),
  rw('dg-vr', 'da-tag', 'db-repo', 'W'),

  // Anti-AI Agent
  rw('dn-ak', 'da-antiai', 'db-antiaikb', 'R'),
  rw('dn-lm', 'da-antiai', 'db-longmem', 'R'),
  rw('dn-ss', 'da-antiai', 'db-session', 'RW'),
  rw('dn-vr', 'da-antiai', 'db-repo', 'W'),

  // Cover Agent
  rw('dv-sk', 'da-cover', 'db-stylekb', 'R'),
  rw('dv-vr', 'da-cover', 'db-repo', 'W'),

  // Compliance
  rw('dp-pk', 'da-compliance', 'db-policykb', 'R'),
  rw('dp-ss', 'da-compliance', 'db-session', 'W'),
]
