import type { Edge, Node } from '@xyflow/react'
import type { WorkflowNodeData } from './workflow'

type WNode = Node<WorkflowNodeData>

export const WORKFLOW_TOP_NODES: WNode[] = [
  {
    id: 'top-entry',
    type: 'io',
    position: { x: 420, y: 0 },
    data: {
      label: 'PM 入口',
      kind: 'io',
      subtitle: '触发方式：人工 / 定时 / 外部 API',
      detailKey: 'top-entry',
    },
  },
  {
    id: 'top-router',
    type: 'decision',
    position: { x: 420, y: 140 },
    data: {
      label: 'Router · 账号路由',
      kind: 'decision',
      subtitle: '按 account_id ∈ {1,2,3} 分三路',
      detailKey: 'top-router',
    },
  },
  {
    id: 'top-load-1',
    type: 'action',
    position: { x: 60, y: 300 },
    data: {
      label: 'Load 号 1 · INFP',
      kind: 'action',
      subtitle: '载 StyleKB[1] + LongMem[1]',
      detailKey: 'top-load-1',
    },
  },
  {
    id: 'top-load-2',
    type: 'action',
    position: { x: 420, y: 300 },
    data: {
      label: 'Load 号 2 · 极简发饰',
      kind: 'action',
      subtitle: '载 StyleKB[2] + LongMem[2]',
      detailKey: 'top-load-2',
    },
  },
  {
    id: 'top-load-3',
    type: 'action',
    position: { x: 780, y: 300 },
    data: {
      label: 'Load 号 3 · 方法论',
      kind: 'action',
      subtitle: '载 StyleKB[3] + LongMem[3]',
      detailKey: 'top-load-3',
    },
  },
  {
    id: 'top-pipe-entry',
    type: 'io',
    position: { x: 420, y: 460 },
    data: {
      label: '→ 图 ② Pipeline 入口',
      kind: 'io',
      subtitle: '移交 Agent 编排',
      detailKey: 'top-pipe-entry',
    },
  },
  {
    id: 'top-pipe-black',
    type: 'product',
    position: { x: 420, y: 600 },
    data: {
      label: '图 ② Agent 编排黑盒',
      kind: 'product',
      subtitle: '切"图 ②"标签看详细（21 节点）',
      detailKey: 'top-pipe-black',
    },
  },
  {
    id: 'top-pipe-exit',
    type: 'io',
    position: { x: 420, y: 740 },
    data: {
      label: '← 图 ② Pipeline 出口',
      kind: 'io',
      subtitle: '收到发布就绪包',
      detailKey: 'top-pipe-exit',
    },
  },
  {
    id: 'top-compliance',
    type: 'decision',
    position: { x: 420, y: 880 },
    data: {
      label: 'Compliance · 合规终审',
      kind: 'decision',
      subtitle: '广告 / 政策 / 版权 / 敏感词',
      detailKey: 'top-compliance',
    },
  },
  {
    id: 'top-human-review',
    type: 'human',
    position: { x: 160, y: 1040 },
    data: {
      label: 'HumanReview · 人工终审',
      kind: 'human',
      subtitle: '通读文案 + 对比封面',
      detailKey: 'top-human-review',
    },
  },
  {
    id: 'top-rework',
    type: 'error',
    position: { x: 820, y: 1040 },
    data: {
      label: '驳回出口 · ReworkOut',
      kind: 'error',
      subtitle: '→ § 驳回规则表（8 问题）',
      detailKey: 'top-rework',
    },
  },
  {
    id: 'top-output',
    type: 'terminal',
    position: { x: 420, y: 1200 },
    data: {
      label: 'Output · 发布就绪',
      kind: 'terminal',
      subtitle: '含 #AI 辅助生成 · 移交平台',
      detailKey: 'top-output',
    },
  },
]

const baseEdge = { stroke: 'rgba(148, 163, 184, 0.7)', strokeWidth: 1.5 }
const rejectEdge = {
  stroke: 'rgba(244, 63, 94, 0.75)',
  strokeWidth: 1.5,
  strokeDasharray: '6 4',
}
const warnEdge = { stroke: 'rgba(251, 191, 36, 0.8)', strokeWidth: 1.5 }

export const WORKFLOW_TOP_EDGES: Edge[] = [
  { id: 'te-router', source: 'top-entry', target: 'top-router', animated: true, style: baseEdge },
  {
    id: 'tr-l1',
    source: 'top-router',
    target: 'top-load-1',
    label: 'id=1',
    animated: true,
    style: baseEdge,
  },
  {
    id: 'tr-l2',
    source: 'top-router',
    target: 'top-load-2',
    label: 'id=2',
    animated: true,
    style: baseEdge,
  },
  {
    id: 'tr-l3',
    source: 'top-router',
    target: 'top-load-3',
    label: 'id=3',
    animated: true,
    style: baseEdge,
  },
  { id: 'tl1-pe', source: 'top-load-1', target: 'top-pipe-entry', animated: true, style: baseEdge },
  { id: 'tl2-pe', source: 'top-load-2', target: 'top-pipe-entry', animated: true, style: baseEdge },
  { id: 'tl3-pe', source: 'top-load-3', target: 'top-pipe-entry', animated: true, style: baseEdge },
  { id: 'tpe-pb', source: 'top-pipe-entry', target: 'top-pipe-black', animated: true, style: baseEdge },
  { id: 'tpb-px', source: 'top-pipe-black', target: 'top-pipe-exit', animated: true, style: baseEdge },
  { id: 'tpx-cc', source: 'top-pipe-exit', target: 'top-compliance', animated: true, style: baseEdge },
  {
    id: 'tcc-hr',
    source: 'top-compliance',
    target: 'top-human-review',
    label: '通过',
    animated: true,
    style: baseEdge,
  },
  {
    id: 'tcc-rw',
    source: 'top-compliance',
    target: 'top-rework',
    label: '硬红线',
    style: rejectEdge,
  },
  {
    id: 'thr-out',
    source: 'top-human-review',
    target: 'top-output',
    label: '放行',
    animated: true,
    style: baseEdge,
  },
  {
    id: 'thr-rw',
    source: 'top-human-review',
    target: 'top-rework',
    label: '驳回',
    style: warnEdge,
  },
]
