import type { Edge, Node } from '@xyflow/react'

export type NodeKind =
  | 'io'
  | 'decision'
  | 'agent'
  | 'human'
  | 'action'
  | 'product'
  | 'terminal'
  | 'error'
  | 'kb-private'
  | 'kb-shared'
  | 'memory'
  | 'repo'
  | 'bus'

export type WorkflowNodeData = {
  label: string
  kind: NodeKind
  subtitle?: string
  detailKey: string
}

type WNode = Node<WorkflowNodeData>

export const WORKFLOW_NODES: WNode[] = [
  {
    id: 'entry',
    type: 'io',
    position: { x: 480, y: 0 },
    data: {
      label: 'Pipeline 入口',
      kind: 'io',
      subtitle: '接图 ① 加载完的账号配置',
      detailKey: 'entry',
    },
  },
  {
    id: 'mode',
    type: 'decision',
    position: { x: 480, y: 140 },
    data: {
      label: 'PM 选题方式',
      kind: 'decision',
      subtitle: '编排控制按入口载荷判定',
      detailKey: 'mode',
    },
  },
  {
    id: 'topic-gen',
    type: 'agent',
    position: { x: 130, y: 300 },
    data: {
      label: '选题 Agent · 生成',
      kind: 'agent',
      subtitle: '读 KB 产出 N 候选',
      detailKey: 'topic-gen',
    },
  },
  {
    id: 'candidates',
    type: 'product',
    position: { x: 130, y: 460 },
    data: {
      label: '候选选题 × N',
      kind: 'product',
      subtitle: 'VersionRepo · 结构化',
      detailKey: 'candidates',
    },
  },
  {
    id: 'human-pick',
    type: 'human',
    position: { x: 130, y: 600 },
    data: {
      label: '人工 · N 选 1',
      kind: 'human',
      subtitle: '30 秒决策值得',
      detailKey: 'human-pick',
    },
  },
  {
    id: 'topic-wrap',
    type: 'agent',
    position: { x: 840, y: 300 },
    data: {
      label: '选题 Agent · 包装',
      kind: 'agent',
      subtitle: 'PM 自带毛选题 · KB 对齐',
      detailKey: 'topic-wrap',
    },
  },
  {
    id: 'wrap-check',
    type: 'decision',
    position: { x: 840, y: 460 },
    data: {
      label: '人设一致性校验',
      kind: 'decision',
      subtitle: 'KB 绕过风险兜底',
      detailKey: 'wrap-check',
    },
  },
  {
    id: 'pm-confirm',
    type: 'human',
    position: { x: 1100, y: 600 },
    data: {
      label: '人工 · PM 确认',
      kind: 'human',
      subtitle: '严重不符才弹 · 不骚扰每次',
      detailKey: 'pm-confirm',
    },
  },
  {
    id: 'copy',
    type: 'agent',
    position: { x: 480, y: 760 },
    data: {
      label: '文案生成 Agent',
      kind: 'agent',
      subtitle: '选题 + 风格 → 笔记草稿',
      detailKey: 'copy',
    },
  },
  {
    id: 'copy-draft',
    type: 'product',
    position: { x: 480, y: 900 },
    data: {
      label: '文案草稿',
      kind: 'product',
      subtitle: '带段号 · 标题 segment_id=0',
      detailKey: 'copy-draft',
    },
  },
  {
    id: 'tag',
    type: 'action',
    position: { x: 480, y: 1040 },
    data: {
      label: '自动打标动作',
      kind: 'action',
      subtitle: '纯规则 · 不调 LLM',
      detailKey: 'tag',
    },
  },
  {
    id: 'antiai',
    type: 'agent',
    position: { x: 480, y: 1180 },
    data: {
      label: '反 AI 化润色 Agent',
      kind: 'agent',
      subtitle: '核心价值点 · 读上次拒绝理由',
      detailKey: 'antiai',
    },
  },
  {
    id: 'antiai-draft',
    type: 'product',
    position: { x: 480, y: 1320 },
    data: {
      label: '润色稿',
      kind: 'product',
      subtitle: '含 unmapped_rules 观测字段',
      detailKey: 'antiai-draft',
    },
  },
  {
    id: 'antiai-check',
    type: 'decision',
    position: { x: 480, y: 1460 },
    data: {
      label: '反 AI 化机审',
      kind: 'decision',
      subtitle: 'LLM 语义自评 + 第三方 API',
      detailKey: 'antiai-check',
    },
  },
  {
    id: 'cover',
    type: 'agent',
    position: { x: 480, y: 1620 },
    data: {
      label: '封面生图 Agent',
      kind: 'agent',
      subtitle: '依赖文案标题 · 含备选',
      detailKey: 'cover',
    },
  },
  {
    id: 'cover-img',
    type: 'product',
    position: { x: 480, y: 1760 },
    data: {
      label: '封面图',
      kind: 'product',
      subtitle: '主图 + 备选 2-3',
      detailKey: 'cover-img',
    },
  },
  {
    id: 'cover-check',
    type: 'decision',
    position: { x: 480, y: 1900 },
    data: {
      label: '封面机审',
      kind: 'decision',
      subtitle: '版权 + 敏感词 API',
      detailKey: 'cover-check',
    },
  },
  {
    id: 'human-cover',
    type: 'human',
    position: { x: 770, y: 2060 },
    data: {
      label: '人工 · 封面审',
      kind: 'human',
      subtitle: '仅风险触发',
      detailKey: 'human-cover',
    },
  },
  {
    id: 'package',
    type: 'terminal',
    position: { x: 200, y: 2060 },
    data: {
      label: '打包',
      kind: 'terminal',
      subtitle: '合成发布就绪包',
      detailKey: 'package',
    },
  },
  {
    id: 'exit',
    type: 'io',
    position: { x: 480, y: 2200 },
    data: {
      label: 'Pipeline 出口',
      kind: 'io',
      subtitle: '移交图 ① Compliance',
      detailKey: 'exit',
    },
  },
  {
    id: 'rework-out',
    type: 'error',
    position: { x: 1300, y: 1460 },
    data: {
      label: '驳回出口 · ReworkOut',
      kind: 'error',
      subtitle: '→ § 驳回规则表（8 问题）',
      detailKey: 'rework-out',
    },
  },
]

const baseEdgeStyle = {
  stroke: 'rgba(148, 163, 184, 0.7)',
  strokeWidth: 1.5,
}

const rejectStyle = {
  stroke: 'rgba(244, 63, 94, 0.75)',
  strokeWidth: 1.5,
  strokeDasharray: '6 4',
}

const loopStyle = {
  stroke: 'rgba(251, 191, 36, 0.85)',
  strokeWidth: 1.8,
  strokeDasharray: '4 3',
}

export const WORKFLOW_EDGES: Edge[] = [
  { id: 'entry-mode', source: 'entry', target: 'mode', animated: true, style: baseEdgeStyle },
  {
    id: 'mode-gen',
    source: 'mode',
    target: 'topic-gen',
    label: '系统生成',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'mode-wrap',
    source: 'mode',
    target: 'topic-wrap',
    label: 'PM 手动输入毛选题',
    animated: true,
    style: baseEdgeStyle,
  },
  { id: 'gen-cand', source: 'topic-gen', target: 'candidates', animated: true, style: baseEdgeStyle },
  { id: 'cand-pick', source: 'candidates', target: 'human-pick', animated: true, style: baseEdgeStyle },
  {
    id: 'pick-copy',
    source: 'human-pick',
    target: 'copy',
    label: '选定',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'pick-rework',
    source: 'human-pick',
    target: 'rework-out',
    label: '全部不行',
    style: rejectStyle,
  },
  { id: 'wrap-check', source: 'topic-wrap', target: 'wrap-check', animated: true, style: baseEdgeStyle },
  {
    id: 'wrap-copy',
    source: 'wrap-check',
    target: 'copy',
    label: '通过',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'wrap-pm',
    source: 'wrap-check',
    target: 'pm-confirm',
    label: '严重不符',
    style: { ...baseEdgeStyle, stroke: 'rgba(251, 191, 36, 0.8)' },
  },
  {
    id: 'pm-copy',
    source: 'pm-confirm',
    target: 'copy',
    label: '强推',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'pm-back',
    source: 'pm-confirm',
    target: 'topic-wrap',
    label: '修改毛选题',
    type: 'smoothstep',
    style: loopStyle,
  },
  { id: 'copy-draft', source: 'copy', target: 'copy-draft', animated: true, style: baseEdgeStyle },
  { id: 'draft-tag', source: 'copy-draft', target: 'tag', animated: true, style: baseEdgeStyle },
  { id: 'tag-antiai', source: 'tag', target: 'antiai', animated: true, style: baseEdgeStyle },
  { id: 'antiai-out', source: 'antiai', target: 'antiai-draft', animated: true, style: baseEdgeStyle },
  {
    id: 'antiaid-check',
    source: 'antiai-draft',
    target: 'antiai-check',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'check-loop',
    source: 'antiai-check',
    target: 'antiai',
    label: '不达标 ≤ 3 次',
    type: 'smoothstep',
    style: loopStyle,
  },
  {
    id: 'check-rework',
    source: 'antiai-check',
    target: 'rework-out',
    label: '超限',
    style: rejectStyle,
  },
  {
    id: 'check-cover',
    source: 'antiai-check',
    target: 'cover',
    label: '达标',
    animated: true,
    style: baseEdgeStyle,
  },
  { id: 'cover-img', source: 'cover', target: 'cover-img', animated: true, style: baseEdgeStyle },
  { id: 'img-check', source: 'cover-img', target: 'cover-check', animated: true, style: baseEdgeStyle },
  {
    id: 'check-human',
    source: 'cover-check',
    target: 'human-cover',
    label: '风险',
    style: { ...baseEdgeStyle, stroke: 'rgba(251, 191, 36, 0.8)' },
  },
  {
    id: 'check-package',
    source: 'cover-check',
    target: 'package',
    label: '通过',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'human-package',
    source: 'human-cover',
    target: 'package',
    label: '通过',
    animated: true,
    style: baseEdgeStyle,
  },
  {
    id: 'human-rework',
    source: 'human-cover',
    target: 'rework-out',
    label: '驳回',
    style: rejectStyle,
  },
  { id: 'package-exit', source: 'package', target: 'exit', animated: true, style: baseEdgeStyle },
]
