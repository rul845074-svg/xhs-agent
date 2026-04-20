import { Sparkles, Clock, Target, Sparkle } from 'lucide-react'
import type { Session, AgentPhase } from '../data/sessions'
import { ACCOUNTS } from '../data/accounts'

type Props = {
  session: Session
  chosenTopicId: string
}

function formatDuration(ms: number) {
  if (ms < 1000) return `${ms}ms`
  const s = ms / 1000
  if (s < 10) return `${s.toFixed(1)}s`
  return `${Math.round(s)}s`
}

function PhaseRow({ phase }: { phase: AgentPhase }) {
  return (
    <div className="relative pl-7 pb-4 last:pb-0">
      <div className="absolute left-[7px] top-1.5 bottom-0 w-px bg-neutral-200" />
      <div className="absolute left-0 top-0 w-4 h-4 rounded-full bg-white border-2 border-emerald-500 flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      </div>

      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-neutral-800">
              {phase.label}
            </span>
            {phase.note && (
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
                {phase.note}
              </span>
            )}
          </div>
          <div className="text-[12px] text-neutral-500 mt-1 leading-snug">
            {phase.doneSummary}
          </div>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-neutral-500 flex-shrink-0 mt-0.5">
          <Clock size={11} />
          {formatDuration(phase.durationMs)}
        </div>
      </div>
    </div>
  )
}

export function SessionLog({ session, chosenTopicId }: Props) {
  const account = ACCOUNTS[session.accountId]

  return (
    <div className="space-y-6">
      <div
        className="rounded-2xl p-5"
        style={{
          background: account.accentSoft,
          border: `1px solid ${account.accentLine}`,
        }}
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div
              className="text-[10px] uppercase tracking-widest font-semibold mb-1"
              style={{ color: account.accent }}
            >
              Session 完成 · {session.id}
            </div>
            <div className="text-[15px] font-semibold text-neutral-900">
              {session.meta.sessionLabel}
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-[22px] font-bold text-neutral-900 leading-none">
              {session.meta.totalSec}s
            </div>
            <div className="text-[10px] text-neutral-500 mt-1">总耗时</div>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-neutral-700">
          <Sparkles size={14} style={{ color: account.accent }} />
          <span>建议发布：{session.meta.suggestedPublishAt}</span>
        </div>
      </div>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-neutral-500" />
          <h3 className="text-[13px] font-semibold text-neutral-800">
            选题 N 选 1 · {session.topicCandidates.length} 候选
          </h3>
        </div>
        <div className="space-y-2">
          {session.topicCandidates.map((t) => {
            const isChosen = t.id === chosenTopicId
            return (
              <div
                key={t.id}
                className="relative rounded-lg px-3 py-2.5 transition-all"
                style={{
                  background: isChosen ? account.accentSoft : '#fafafa',
                  border: isChosen
                    ? `1.5px solid ${account.accent}`
                    : '1px solid #e5e5e5',
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isChosen && (
                    <span
                      className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: account.accent,
                        color: '#fff',
                      }}
                    >
                      已选
                    </span>
                  )}
                  {t.recommended && !isChosen && (
                    <span className="text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-neutral-200 text-neutral-600">
                      AI 推荐
                    </span>
                  )}
                  <span
                    className={`text-[13px] leading-tight ${isChosen ? 'font-semibold text-neutral-900' : 'text-neutral-500'}`}
                  >
                    {t.title}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 ml-0.5">
                  {t.angle} · {t.audience}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkle size={14} className="text-neutral-500" />
          <h3 className="text-[13px] font-semibold text-neutral-800">
            Agent 时间线 · 6 节点
          </h3>
        </div>
        <div>
          {session.phases.map((p) => (
            <PhaseRow key={p.id} phase={p} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} style={{ color: account.accent }} />
          <h3 className="text-[13px] font-semibold text-neutral-800">
            反 AI 化改写 · {session.antiAIChanges.length} 处
          </h3>
        </div>
        <div className="space-y-3">
          {session.antiAIChanges.map((c, i) => (
            <div
              key={i}
              className="rounded-xl overflow-hidden border border-neutral-200"
            >
              <div className="px-3 py-1.5 bg-neutral-50 flex items-center justify-between border-b border-neutral-200">
                <span className="text-[11px] text-neutral-600 font-medium">
                  段 {c.segmentId} · {c.reason}
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">
                  {c.matchedRule}
                </span>
              </div>
              <div className="p-3 space-y-2">
                <div className="text-[12px] text-rose-500 line-through leading-snug">
                  {c.before}
                </div>
                <div className="text-[12px] text-emerald-700 leading-snug font-medium">
                  → {c.after}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
