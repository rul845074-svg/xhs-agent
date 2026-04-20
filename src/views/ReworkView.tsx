import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  AlertTriangle,
  XCircle,
  RotateCw,
  UserCog,
  Send,
  Archive,
  CircleDot,
} from 'lucide-react'
import { ACCOUNTS } from '../data/accounts'

type Props = {
  onBack: () => void
}

const ACCOUNT_ID = '1' as const

type RoundStatus = 'pass' | 'fail'

type Round = {
  n: number
  strategy: string
  detectorScore: number
  status: RoundStatus
  note: string
  highlights: Array<{ kind: 'add' | 'remove' | 'warn'; text: string }>
}

const ROUNDS: Round[] = [
  {
    n: 1,
    strategy: 'L003 具象数字替换模糊量词 + L042 末段动作化',
    detectorScore: 0.72,
    status: 'fail',
    note: '分数 0.72 超阈值 0.35 · 句式单调 + 高频连接词未拆',
    highlights: [
      { kind: 'add', text: '首段加入 "凌晨 2 点 · 47 分钟" 具象化' },
      { kind: 'warn', text: '7 次 "其实" 未替换 · 句式 83% 主谓宾' },
    ],
  },
  {
    n: 2,
    strategy: 'L011 场景化开头 + L029 变量法 + 同义改写高频词',
    detectorScore: 0.51,
    status: 'fail',
    note: '分数 0.51 仍超阈值 · 去 "其实" 后出现 "说实话" × 6',
    highlights: [
      { kind: 'remove', text: '删除 "其实" · 替换为更自然的停顿' },
      { kind: 'warn', text: '新短语 "说实话" 出现 6 次 · 形成新模式' },
      { kind: 'add', text: '加入 3 处书面化表达 · 反向扣分' },
    ],
  },
  {
    n: 3,
    strategy: '全文重写 · 只保留原选题骨架 · 禁用同义替换模板',
    detectorScore: 0.44,
    status: 'fail',
    note: '分数 0.44 仍不达标 · 3 轮合计 88s · 触发升级策略',
    highlights: [
      { kind: 'add', text: '重写 72% · 骨架保留 · 个人经历细节翻倍' },
      { kind: 'warn', text: '风格偏移 · 已不像 INFP 人设 · StyleKB 偏差 0.28' },
    ],
  },
]

type ProblemKind = '检测' | '人设' | '合规' | '事实'

type Problem = {
  id: string
  kind: ProblemKind
  severity: '高' | '中' | '低'
  location: string
  issue: string
  suggest: string
  proposedAgent: string
}

const PROBLEMS: Problem[] = [
  {
    id: 'P1',
    kind: '检测',
    severity: '高',
    location: '全文 · 句式',
    issue: 'AI 检测 0.44 > 阈值 0.35 · 3 轮不达标',
    suggest: '升级到 L057 · 人工打散段落节奏后再进反 AI',
    proposedAgent: '反 AI Agent + 人工润色',
  },
  {
    id: 'P2',
    kind: '人设',
    severity: '高',
    location: '第 2 段 / 第 5 段',
    issue: '第 3 轮重写导致风格从 INFP 共情转向方法论说教',
    suggest: '回滚到第 2 轮版本 · 仅修局部 · 不做全量重写',
    proposedAgent: '文案 Agent（按 StyleKB 重走）',
  },
  {
    id: 'P3',
    kind: '人设',
    severity: '中',
    location: '开头第 1 行',
    issue: '"凌晨 2 点 47 分钟" 数字堆砌 · 不符合 INFP 禁区 L003 使用边界',
    suggest: '保留时间点 · 去掉精确分钟 · 改为 "凌晨 2 点多"',
    proposedAgent: '文案 Agent',
  },
  {
    id: 'P4',
    kind: '合规',
    severity: '高',
    location: '文末',
    issue: '未附 AI 合规标 · 违反平台新规',
    suggest: '打包 Agent 漏加 · 追加 #AI辅助创作',
    proposedAgent: '打包 Agent',
  },
  {
    id: 'P5',
    kind: '事实',
    severity: '中',
    location: '第 4 段',
    issue: '"依恋测试 87% 复现" 数据无来源 · 易被举报编造',
    suggest: '删除百分比 · 改为 "多数反馈" 或附来源链接',
    proposedAgent: '选题 Agent（补来源） → 文案 Agent',
  },
  {
    id: 'P6',
    kind: '人设',
    severity: '中',
    location: '中段',
    issue: '出现 "说实话" × 6 · 形成新的 AI 痕迹',
    suggest: '限制同义词出现次数 ≤ 2 · 反 AI 库加入黑名单',
    proposedAgent: '反 AI Agent',
  },
  {
    id: 'P7',
    kind: '检测',
    severity: '低',
    location: '标点',
    issue: '破折号 "——" 使用 11 次 · INFP 号上限是 6',
    suggest: '替换一半为短停顿 / 句号',
    proposedAgent: '反 AI Agent',
  },
  {
    id: 'P8',
    kind: '合规',
    severity: '低',
    location: '封面',
    issue: '封面副标 "依恋测试" 与 KB 禁区 "不贴 MBTI 硬标签" 擦边',
    suggest: '副标改为 "3 个自我觉察动作"',
    proposedAgent: '封面 Agent',
  },
]

const KIND_COLOR: Record<ProblemKind, string> = {
  检测: '#a855f7',
  人设: '#ec4899',
  合规: '#ef4444',
  事实: '#f59e0b',
}

const SEVERITY_COLOR: Record<Problem['severity'], string> = {
  高: '#dc2626',
  中: '#d97706',
  低: '#65a30d',
}

export function ReworkView({ onBack }: Props) {
  const account = ACCOUNTS[ACCOUNT_ID]
  const [selected, setSelected] = useState<Set<string>>(
    () => new Set(PROBLEMS.filter((p) => p.severity === '高').map((p) => p.id)),
  )
  const [action, setAction] = useState<
    'reworkAgent' | 'takeover' | 'cancel' | null
  >(null)

  const cascade = useMemo(() => {
    const agents = new Set<string>()
    for (const id of selected) {
      const p = PROBLEMS.find((x) => x.id === id)
      if (p) agents.add(p.proposedAgent)
    }
    return Array.from(agents)
  }, [selected])

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-[1360px] mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
            >
              <ArrowLeft size={14} />
              返回工作台
            </button>
            <div className="h-5 w-px bg-neutral-200" />
            <div className="flex items-center gap-2">
              <AlertTriangle size={14} style={{ color: '#dc2626' }} />
              <div className="text-[13px] font-semibold text-neutral-900">
                失败样例 · PM 驳回面板
              </div>
              <span
                className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                style={{ background: '#fef2f2', color: '#dc2626' }}
              >
                Session · Failed
              </span>
            </div>
          </div>
          <div className="text-[11.5px] text-neutral-500 font-mono">
            session_id = s_infp_241120_f03
          </div>
        </div>
      </header>

      <main className="max-w-[1360px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[420px_1fr] gap-6">
        <section className="space-y-5">
          <div className="rounded-2xl bg-white border border-neutral-200 p-5">
            <div className="flex items-center gap-2.5 mb-3">
              <div
                className="w-9 h-9 rounded-full"
                style={{
                  background: `linear-gradient(135deg, ${account.avatarGradient[0]} 0%, ${account.avatarGradient[1]} 100%)`,
                }}
              />
              <div>
                <div className="text-[13px] font-semibold text-neutral-900">
                  {account.displayName}
                </div>
                <div className="text-[11px] text-neutral-500">
                  选题 · "INFP 在关系里为什么总觉得被误解"
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Meta label="总耗时" value="2 分 41 秒" />
              <Meta label="反 AI 轮" value="3 / 3" bad />
              <Meta label="最终分" value="0.44" bad />
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center gap-2">
              <RotateCw size={14} className="text-neutral-400" />
              <div className="text-[12.5px] font-semibold text-neutral-900">
                反 AI · 3 轮复盘
              </div>
            </div>
            <div className="p-5 space-y-4">
              {ROUNDS.map((r) => (
                <RoundCard key={r.n} round={r} />
              ))}
            </div>
            <div className="px-5 py-3 bg-rose-50/80 border-t border-rose-100 flex items-center gap-2">
              <XCircle size={14} style={{ color: '#dc2626' }} />
              <div className="text-[11.5px] text-rose-800">
                3 轮仍不达标 · 自动触发 <span className="font-semibold">PM 驳回流程</span>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="rounded-2xl bg-white border border-neutral-200 overflow-hidden">
            <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <UserCog size={14} className="text-neutral-500" />
                <div className="text-[12.5px] font-semibold text-neutral-900">
                  PM 驳回面板 · 8 个问题
                </div>
              </div>
              <div className="text-[11px] text-neutral-500">
                已选 <span className="font-semibold text-neutral-900">{selected.size}</span> / {PROBLEMS.length}
              </div>
            </div>
            <div className="divide-y divide-neutral-100">
              {PROBLEMS.map((p) => {
                const checked = selected.has(p.id)
                return (
                  <button
                    key={p.id}
                    onClick={() => toggle(p.id)}
                    className="w-full text-left px-5 py-3.5 flex gap-3 hover:bg-neutral-50 transition"
                  >
                    <div className="pt-0.5">
                      <div
                        className="w-4 h-4 rounded border-2 flex items-center justify-center transition"
                        style={{
                          borderColor: checked ? account.accent : '#d4d4d8',
                          background: checked ? account.accent : 'white',
                        }}
                      >
                        {checked && (
                          <svg
                            viewBox="0 0 16 16"
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                          >
                            <polyline points="3 8.5 7 12 13 4" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold font-mono"
                          style={{ color: KIND_COLOR[p.kind] }}
                        >
                          {p.id}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            background: `${KIND_COLOR[p.kind]}22`,
                            color: KIND_COLOR[p.kind],
                          }}
                        >
                          {p.kind}
                        </span>
                        <span
                          className="px-1.5 py-0.5 rounded text-[10px] font-semibold"
                          style={{
                            background: `${SEVERITY_COLOR[p.severity]}22`,
                            color: SEVERITY_COLOR[p.severity],
                          }}
                        >
                          {p.severity}
                        </span>
                        <span className="text-[10.5px] text-neutral-400">
                          · {p.location}
                        </span>
                      </div>
                      <div className="text-[12.5px] text-neutral-900 leading-snug mb-1">
                        {p.issue}
                      </div>
                      <div className="text-[11.5px] text-neutral-500 leading-relaxed">
                        <span className="text-neutral-400">建议 · </span>
                        {p.suggest}
                      </div>
                      <div className="text-[10.5px] mt-1 font-mono text-neutral-400">
                        → {p.proposedAgent}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200 p-5">
            <div className="flex items-center gap-2 mb-3">
              <CircleDot size={13} className="text-neutral-400" />
              <div className="text-[12.5px] font-semibold text-neutral-900">
                级联建议 · 勾选问题 → 触发以下 Agent 重跑
              </div>
            </div>
            {cascade.length === 0 ? (
              <div className="text-[12px] text-neutral-400">
                未勾选任何问题 · 选择后会自动匹配要重跑的 Agent。
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {cascade.map((a) => (
                  <span
                    key={a}
                    className="px-2.5 py-1 rounded-full text-[11.5px] font-medium border"
                    style={{
                      color: account.accent,
                      borderColor: account.accentLine,
                      background: account.accentSoft,
                    }}
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-white border border-neutral-200 p-5">
            <div className="text-[12.5px] font-semibold text-neutral-900 mb-3">
              选择处理方式
            </div>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn
                active={action === 'reworkAgent'}
                onClick={() => setAction('reworkAgent')}
                icon={<RotateCw size={14} />}
                title="按勾选项触发 Agent 重跑"
                desc="保留本 session · 只对勾选问题走对应 Agent"
                accent={account.accent}
              />
              <ActionBtn
                active={action === 'takeover'}
                onClick={() => setAction('takeover')}
                icon={<UserCog size={14} />}
                title="我接手人工改"
                desc="导出当前版本到编辑器 · 跳过 Agent"
                accent={account.accent}
              />
              <ActionBtn
                active={action === 'cancel'}
                onClick={() => setAction('cancel')}
                icon={<Archive size={14} />}
                title="本单作废 · 换选题"
                desc="回 Dashboard 重开 · 记入 LongMem 教训"
                accent={account.accent}
              />
              <ActionBtn
                active={false}
                onClick={() => onBack()}
                icon={<Send size={14} />}
                title="强制放行（不推荐）"
                desc="绕过反 AI 阈值直接发布 · 有被限流风险"
                danger
                accent={account.accent}
              />
            </div>
            {action && (
              <div
                className="mt-4 rounded-xl border px-4 py-3 text-[12px]"
                style={{
                  borderColor: account.accentLine,
                  background: account.accentSoft,
                  color: account.accent,
                }}
              >
                已选 · {action === 'reworkAgent' && `重跑 ${cascade.length} 个 Agent`}
                {action === 'takeover' && '导出到人工编辑器'}
                {action === 'cancel' && '本单作废 · LongMem 会记录"此选题不适合 INFP 号"'}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

function Meta({ label, value, bad }: { label: string; value: string; bad?: boolean }) {
  return (
    <div className="rounded-lg bg-neutral-50 border border-neutral-100 py-2">
      <div className={`text-[14px] font-bold ${bad ? 'text-rose-600' : 'text-neutral-900'}`}>
        {value}
      </div>
      <div className="text-[10.5px] text-neutral-500 mt-0.5">{label}</div>
    </div>
  )
}

function RoundCard({ round }: { round: Round }) {
  const failed = round.status === 'fail'
  return (
    <div
      className="rounded-xl border p-3.5"
      style={{
        borderColor: failed ? '#fecaca' : '#bbf7d0',
        background: failed ? 'rgba(254, 242, 242, 0.5)' : 'rgba(240, 253, 244, 0.5)',
      }}
    >
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-[11px] font-bold"
            style={{ background: failed ? '#dc2626' : '#16a34a' }}
          >
            {round.n}
          </span>
          <span className="text-[12px] font-semibold text-neutral-900">
            第 {round.n} 轮 · {round.strategy}
          </span>
        </div>
        <span
          className="font-mono text-[12px] font-bold"
          style={{ color: failed ? '#dc2626' : '#16a34a' }}
        >
          {round.detectorScore.toFixed(2)}
        </span>
      </div>
      <div className="text-[11.5px] text-neutral-600 mb-2 leading-relaxed">
        {round.note}
      </div>
      <ul className="space-y-1">
        {round.highlights.map((h, i) => (
          <li
            key={i}
            className="text-[11px] leading-snug flex gap-1.5"
            style={{
              color:
                h.kind === 'warn'
                  ? '#b45309'
                  : h.kind === 'remove'
                    ? '#be123c'
                    : '#0f766e',
            }}
          >
            <span className="font-mono font-semibold flex-shrink-0">
              {h.kind === 'add' ? '+' : h.kind === 'remove' ? '-' : '!'}
            </span>
            <span>{h.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function ActionBtn({
  icon,
  title,
  desc,
  active,
  onClick,
  danger,
  accent,
}: {
  icon: React.ReactNode
  title: string
  desc: string
  active: boolean
  onClick: () => void
  danger?: boolean
  accent: string
}) {
  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border p-3 transition hover:bg-neutral-50"
      style={{
        borderColor: active ? accent : danger ? '#fecaca' : '#e5e7eb',
        background: active ? `${accent}10` : 'white',
      }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span style={{ color: danger ? '#dc2626' : active ? accent : '#525252' }}>
          {icon}
        </span>
        <span
          className="text-[12.5px] font-semibold"
          style={{ color: danger ? '#dc2626' : active ? accent : '#171717' }}
        >
          {title}
        </span>
      </div>
      <div className="text-[11px] text-neutral-500 leading-relaxed">{desc}</div>
    </button>
  )
}
