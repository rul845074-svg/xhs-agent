import { useState } from 'react'
import { ArrowLeft, Copy, FileDown, RotateCcw, Check } from 'lucide-react'
import { ACCOUNTS, type AccountId } from '../data/accounts'
import { SESSIONS } from '../data/sessions'
import { PhonePreview } from '../components/PhonePreview'
import { SessionLog } from '../components/SessionLog'

type Props = {
  accountId: AccountId
  chosenTopicId: string
  onBackToDashboard: () => void
  onRedo: () => void
}

type Toast = { id: number; text: string }

export function SessionView({ accountId, chosenTopicId, onBackToDashboard, onRedo }: Props) {
  const account = ACCOUNTS[accountId]
  const session = SESSIONS[accountId]
  const [toasts, setToasts] = useState<Toast[]>([])
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  function pushToast(text: string) {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, text }])
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 2200)
  }

  async function copy(text: string, key: string, label: string) {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600)
      pushToast(`${label} 已复制`)
    } catch {
      pushToast('复制失败，请手动选中')
    }
  }

  function buildFullCopy() {
    const { copy: c } = session
    const body = c.body.map((s) => s.text).join('\n\n')
    const tagLine = [c.aiTag, ...c.tags].join(' ')
    return `${c.title}\n\n${body}\n\n${tagLine}`
  }

  function buildSessionLogText() {
    const chosen = session.topicCandidates.find((t) => t.id === chosenTopicId)
    const lines: string[] = []
    lines.push(`# Session ${session.id}`)
    lines.push(`账号：${account.displayName} (${account.handle})`)
    lines.push(`总耗时：${session.meta.totalSec}s · 建议发布：${session.meta.suggestedPublishAt}`)
    lines.push('')
    lines.push(`## 选题（已选）`)
    lines.push(`- ${chosen?.title ?? ''}`)
    lines.push(`  角度：${chosen?.angle} · 受众：${chosen?.audience}`)
    lines.push('')
    lines.push(`## Agent 时间线`)
    session.phases.forEach((p, i) => {
      lines.push(`${i + 1}. ${p.label} · ${Math.round(p.durationMs / 100) / 10}s`)
      lines.push(`   ${p.doneSummary}${p.note ? ` · ${p.note}` : ''}`)
    })
    lines.push('')
    lines.push(`## 反 AI 化改写（${session.antiAIChanges.length} 处）`)
    session.antiAIChanges.forEach((c, i) => {
      lines.push(`${i + 1}. 段 ${c.segmentId} · ${c.reason} [${c.matchedRule}]`)
      lines.push(`   - 原：${c.before}`)
      lines.push(`   - 改：${c.after}`)
    })
    lines.push('')
    lines.push(`## 发布包`)
    lines.push(`标题：${session.copy.title}`)
    lines.push('正文：')
    session.copy.body.forEach((s) => lines.push(`  ${s.text}`))
    lines.push(`标签：${[session.copy.aiTag, ...session.copy.tags].join(' ')}`)
    lines.push(`封面：${session.cover.bigText} · ${session.cover.subText}`)
    return lines.join('\n')
  }

  function exportJson() {
    const chosen = session.topicCandidates.find((t) => t.id === chosenTopicId)
    const payload = {
      sessionId: session.id,
      account: {
        id: account.id,
        displayName: account.displayName,
        handle: account.handle,
      },
      chosenTopic: chosen,
      copy: session.copy,
      cover: session.cover,
      antiAIChanges: session.antiAIChanges,
      phases: session.phases,
      meta: session.meta,
    }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${session.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    pushToast('发布包已导出')
  }

  return (
    <div className="min-h-screen bg-[#fafafa] pb-28">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={onBackToDashboard}
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
              <span className="font-semibold">{account.displayName}</span> · {session.id}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_auto] gap-8 lg:gap-10">
          <div className="min-w-0 order-2 lg:order-1">
            <SessionLog session={session} chosenTopicId={chosenTopicId} />
          </div>
          <div className="order-1 lg:order-2 lg:sticky lg:top-20 self-start">
            <PhonePreview session={session} />
          </div>
        </div>
      </main>

      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-lg border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="text-[12px] text-neutral-500">
            完成 · 总耗时 {session.meta.totalSec}s · 建议 {session.meta.suggestedPublishAt}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <ActionButton
              onClick={() => copy(buildFullCopy(), 'copy', '文案 + 标签')}
              primary
              accent={account.accent}
              gradient={account.avatarGradient}
            >
              {copiedKey === 'copy' ? <Check size={14} /> : <Copy size={14} />}
              复制文案（含标签）
            </ActionButton>
            <ActionButton
              onClick={() => copy(buildSessionLogText(), 'log', '完整 Session 日志')}
            >
              {copiedKey === 'log' ? <Check size={14} /> : <Copy size={14} />}
              复制完整日志
            </ActionButton>
            <ActionButton onClick={exportJson}>
              <FileDown size={14} />
              导出发布包
            </ActionButton>
            <ActionButton onClick={onRedo}>
              <RotateCcw size={14} />
              重做一单
            </ActionButton>
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="px-4 py-2 rounded-full bg-neutral-900 text-white text-[12px] shadow-lg"
            style={{ animation: 'slide-up 200ms ease-out' }}
          >
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function ActionButton({
  onClick,
  children,
  primary,
  accent,
  gradient,
}: {
  onClick: () => void
  children: React.ReactNode
  primary?: boolean
  accent?: string
  gradient?: [string, string]
}) {
  if (primary && gradient) {
    return (
      <button
        onClick={onClick}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-semibold text-[12.5px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
        style={{
          background: `linear-gradient(135deg, ${gradient[0]} 0%, ${gradient[1]} 100%)`,
          boxShadow: `0 6px 16px ${accent}40`,
        }}
      >
        {children}
      </button>
    )
  }
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-medium text-[12.5px] text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition active:scale-[0.98]"
    >
      {children}
    </button>
  )
}
