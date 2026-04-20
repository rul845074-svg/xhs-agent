import { useEffect, useRef, useState } from 'react'
import {
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  Loader2,
  Wand2,
  FileText,
  Tag,
  ShieldCheck,
  ImageIcon,
  PackageCheck,
} from 'lucide-react'
import { ACCOUNTS, type AccountId } from '../data/accounts'
import { SESSIONS, type AgentPhase, type AgentPhaseId } from '../data/sessions'

type Props = {
  accountId: AccountId
  onCancel: () => void
  onDone: (chosenTopicId: string) => void
}

type Step = 'topic-pick' | 'running' | 'done'

const PHASE_ICON: Record<AgentPhaseId, React.ComponentType<{ size?: number; className?: string }>> = {
  topic: Wand2,
  copy: FileText,
  tag: Tag,
  antiai: ShieldCheck,
  cover: ImageIcon,
  package: PackageCheck,
}

// Shrink durations so demo runs in ~10s not 60s, keep ratios
function playbackMs(ms: number) {
  return Math.max(600, Math.round(ms * 0.18))
}

export function Compose({ accountId, onCancel, onDone }: Props) {
  const account = ACCOUNTS[accountId]
  const session = SESSIONS[accountId]

  const [step, setStep] = useState<Step>('topic-pick')
  const [chosenTopicId, setChosenTopicId] = useState<string | null>(null)
  const [currentPhase, setCurrentPhase] = useState(0)
  const [phaseProgress, setPhaseProgress] = useState<'running' | 'done'>('running')
  const timeouts = useRef<number[]>([])

  useEffect(() => {
    return () => {
      timeouts.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  function schedule(fn: () => void, ms: number) {
    const id = window.setTimeout(fn, ms)
    timeouts.current.push(id)
  }

  function startRun(topicId: string) {
    setChosenTopicId(topicId)
    setStep('running')
    setCurrentPhase(0)
    setPhaseProgress('running')

    let acc = 0
    session.phases.forEach((p, i) => {
      const dur = playbackMs(p.durationMs)
      schedule(() => {
        setCurrentPhase(i)
        setPhaseProgress('running')
      }, acc)
      schedule(() => {
        setPhaseProgress('done')
      }, acc + dur - 200)
      acc += dur
    })
    schedule(() => {
      setStep('done')
    }, acc + 300)
    schedule(() => {
      onDone(topicId)
    }, acc + 1200)
  }

  const recommended = session.topicCandidates.find((t) => t.recommended)

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onCancel}
            className="flex items-center gap-1.5 text-[12px] text-neutral-600 hover:text-neutral-900 transition"
          >
            <ArrowLeft size={14} />
            返回工作台
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full"
              style={{
                background: `linear-gradient(135deg, ${account.avatarGradient[0]} 0%, ${account.avatarGradient[1]} 100%)`,
              }}
            />
            <div className="text-[12px] text-neutral-700">
              为 <span className="font-semibold">{account.displayName}</span> 起一单
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {step === 'topic-pick' && (
          <TopicPick
            accent={account.accent}
            accentSoft={account.accentSoft}
            candidates={session.topicCandidates}
            recommendedId={recommended?.id ?? null}
            onStart={startRun}
          />
        )}

        {step !== 'topic-pick' && (
          <AgentRunner
            session={session}
            currentPhase={currentPhase}
            phaseProgress={phaseProgress}
            done={step === 'done'}
            accent={account.accent}
            accentSoft={account.accentSoft}
            chosenTitle={
              session.topicCandidates.find((t) => t.id === chosenTopicId)?.title ?? ''
            }
          />
        )}
      </main>
    </div>
  )
}

function TopicPick({
  candidates,
  recommendedId,
  accent,
  accentSoft,
  onStart,
}: {
  candidates: ReturnType<() => typeof SESSIONS['1']['topicCandidates']>
  recommendedId: string | null
  accent: string
  accentSoft: string
  onStart: (id: string) => void
}) {
  const [hoverId, setHoverId] = useState<string | null>(null)
  return (
    <section>
      <div className="mb-6">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full mb-3"
          style={{ background: accentSoft, color: accent }}
        >
          <Sparkles size={12} />
          选题 Agent · 已产出 {candidates.length} 候选
        </div>
        <h1 className="text-[26px] font-bold text-neutral-900 leading-tight mb-1">
          挑一个选题，Agent 会接着跑完整单
        </h1>
        <p className="text-[13px] text-neutral-500">
          选题→文案→反 AI 化→封面→打包，全流程约 60 秒。
        </p>
      </div>

      <div className="space-y-3">
        {candidates.map((t) => {
          const isRec = t.id === recommendedId
          const isHover = hoverId === t.id
          return (
            <button
              key={t.id}
              onMouseEnter={() => setHoverId(t.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => onStart(t.id)}
              className="w-full text-left rounded-2xl bg-white p-5 border transition-all hover:-translate-y-0.5"
              style={{
                borderColor: isRec ? accent : isHover ? accent : '#e5e5e5',
                boxShadow: isHover
                  ? '0 8px 24px rgba(0,0,0,0.08)'
                  : '0 1px 2px rgba(0,0,0,0.03)',
              }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    {isRec && (
                      <span
                        className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded"
                        style={{ background: accent, color: '#fff' }}
                      >
                        AI 推荐
                      </span>
                    )}
                    <span className="text-[15px] font-semibold text-neutral-900 leading-snug">
                      {t.title}
                    </span>
                  </div>
                  <div className="text-[12px] text-neutral-500">
                    {t.angle} · 受众 {t.audience}
                  </div>
                </div>
                <div
                  className="flex-shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    background: isHover ? accent : '#f5f5f5',
                    color: isHover ? '#fff' : '#525252',
                  }}
                >
                  选它 →
                </div>
              </div>
            </button>
          )
        })}
      </div>
    </section>
  )
}

function AgentRunner({
  session,
  currentPhase,
  phaseProgress,
  done,
  accent,
  accentSoft,
  chosenTitle,
}: {
  session: typeof SESSIONS['1']
  currentPhase: number
  phaseProgress: 'running' | 'done'
  done: boolean
  accent: string
  accentSoft: string
  chosenTitle: string
}) {
  return (
    <section>
      <div className="mb-6">
        <div
          className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold px-2 py-1 rounded-full mb-3"
          style={{ background: accentSoft, color: accent }}
        >
          {done ? <CheckCircle2 size={12} /> : <Loader2 size={12} className="animate-spin" />}
          {done ? 'Session 完成' : 'Agent 运行中'}
        </div>
        <h1 className="text-[22px] font-bold text-neutral-900 leading-snug mb-1">
          {chosenTitle}
        </h1>
        <p className="text-[13px] text-neutral-500">
          每一步都在读账号 KB / 长期记忆 · 产出可追溯。
        </p>
      </div>

      <div className="rounded-2xl bg-white border border-neutral-200 p-5">
        <div className="space-y-4">
          {session.phases.map((phase, i) => {
            const state: 'pending' | 'running' | 'done' =
              i < currentPhase
                ? 'done'
                : i === currentPhase
                  ? phaseProgress === 'done'
                    ? 'done'
                    : 'running'
                  : 'pending'
            return <PhaseRow key={phase.id} phase={phase} state={state} accent={accent} />
          })}
        </div>
      </div>

      {done && (
        <div className="mt-6 flex items-center justify-center text-[13px] text-neutral-500">
          正在跳转到预览…
        </div>
      )}
    </section>
  )
}

function PhaseRow({
  phase,
  state,
  accent,
}: {
  phase: AgentPhase
  state: 'pending' | 'running' | 'done'
  accent: string
}) {
  const Icon = PHASE_ICON[phase.id]
  return (
    <div
      className="flex items-start gap-3 py-1 transition-opacity"
      style={{ opacity: state === 'pending' ? 0.4 : 1 }}
    >
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center transition-colors"
        style={{
          background: state === 'done' ? '#ecfdf5' : state === 'running' ? `${accent}1a` : '#f5f5f5',
          color: state === 'done' ? '#059669' : state === 'running' ? accent : '#a3a3a3',
        }}
      >
        {state === 'running' ? (
          <Loader2 size={17} className="animate-spin" />
        ) : state === 'done' ? (
          <CheckCircle2 size={17} />
        ) : (
          <Icon size={16} />
        )}
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[13.5px] font-semibold text-neutral-900">{phase.label}</span>
          {phase.note && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100">
              {phase.note}
            </span>
          )}
        </div>
        <div className="text-[12px] text-neutral-500 mt-0.5 leading-snug">
          {state === 'done' ? phase.doneSummary : phase.activeVerb}
        </div>
      </div>
    </div>
  )
}
