import { useEffect } from 'react'
import { X, BookLock, Sparkles, Brain } from 'lucide-react'
import { ACCOUNTS, type AccountId } from '../data/accounts'
import { KB_SNAPSHOTS } from '../data/kb-snapshots'

type Props = {
  accountId: AccountId | null
  onClose: () => void
  onGoCompare: () => void
}

export function KBDrawer({ accountId, onClose, onGoCompare }: Props) {
  const open = accountId != null
  const account = accountId ? ACCOUNTS[accountId] : null
  const kb = accountId ? KB_SNAPSHOTS[accountId] : null

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <>
      <div
        className="fixed inset-0 z-30 transition-opacity bg-black/20 backdrop-blur-sm"
        style={{
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
        }}
        onClick={onClose}
      />
      <aside
        className="fixed top-0 right-0 h-screen z-40 bg-white border-l border-neutral-200 shadow-2xl transition-transform duration-300 ease-out overflow-hidden flex flex-col"
        style={{
          width: 460,
          transform: open ? 'translateX(0)' : 'translateX(105%)',
        }}
      >
        {account && kb && (
          <>
            <div
              className="h-1"
              style={{
                background: `linear-gradient(90deg, ${account.avatarGradient[0]} 0%, ${account.avatarGradient[1]} 100%)`,
              }}
            />
            <header className="px-6 pt-5 pb-4 border-b border-neutral-100 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${account.avatarGradient[0]} 0%, ${account.avatarGradient[1]} 100%)`,
                  }}
                >
                  <BookLock size={18} className="text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <div
                    className="text-[10px] uppercase tracking-widest font-semibold mb-0.5"
                    style={{ color: account.accent }}
                  >
                    StyleKB · 号隔离
                  </div>
                  <h2 className="text-[16px] font-semibold text-neutral-900 leading-tight">
                    {account.displayName}
                  </h2>
                  <p className="text-[11.5px] text-neutral-500 mt-0.5">
                    {account.handle} · 路由 account_id = {account.id}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-100 text-neutral-500 hover:text-neutral-900 transition"
                aria-label="关闭"
              >
                <X size={16} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              <Section title="① 人设" accent={account.accent}>
                <Row label="身份" value={kb.identity.role} />
                <Row label="口吻" value={kb.identity.voice} />
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1 font-medium">
                    禁区
                  </div>
                  <ul className="space-y-1">
                    {kb.identity.forbidden.map((f, i) => (
                      <li key={i} className="text-[12.5px] text-neutral-700 flex gap-2">
                        <span className="text-rose-400 font-semibold flex-shrink-0">✗</span>
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Section>

              <Section title="② 爆款样本" accent={account.accent}>
                <div className="space-y-2">
                  {kb.hooks.map((h, i) => (
                    <div
                      key={i}
                      className="rounded-lg border border-neutral-200 bg-neutral-50/60 px-3 py-2"
                    >
                      <div className="text-[12.5px] font-medium text-neutral-900 leading-snug mb-1">
                        {h.title}
                      </div>
                      <div className="flex items-center justify-between text-[10.5px] text-neutral-500">
                        <span
                          className="px-1.5 py-0.5 rounded font-semibold"
                          style={{
                            background: account.accentSoft,
                            color: account.accent,
                          }}
                        >
                          {h.winRate}
                        </span>
                        <span>{h.publishedAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              <Section title="③ 语言风格" accent={account.accent}>
                <Row label="句式" value={kb.language.sentence} />
                <Row label="标点" value={kb.language.punctuation} />
                <Row label="表情" value={kb.language.emoji} />
              </Section>

              <Section title="④ 目标人群" accent={account.accent}>
                <Row label="年龄" value={kb.audience.age} />
                <Row label="场景" value={kb.audience.scene} />
                <Row label="痛点" value={kb.audience.painPoint} />
              </Section>

              <Section title="⑤ 视觉档案" accent={account.accent}>
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1.5 font-medium">
                    配色（HEX Array）
                  </div>
                  <div className="flex gap-2 mb-2">
                    {kb.visual.palette.map((c) => (
                      <div key={c} className="flex flex-col items-center">
                        <div
                          className="w-10 h-10 rounded-lg border border-neutral-200"
                          style={{ background: c }}
                        />
                        <div className="text-[9px] text-neutral-500 font-mono mt-1">
                          {c}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Row label="版式" value={kb.visual.layout} />
                <Row label="字体" value={kb.visual.typography} />
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1.5 font-medium">
                    封面样例
                  </div>
                  <div
                    className="rounded-lg overflow-hidden p-4 flex flex-col justify-end"
                    style={{
                      aspectRatio: '3/2',
                      background: `linear-gradient(135deg, ${kb.visual.coverExample.bgFrom} 0%, ${kb.visual.coverExample.bgTo} 100%)`,
                    }}
                  >
                    <div className="text-white font-bold leading-tight" style={{ fontSize: 22 }}>
                      {kb.visual.coverExample.bigText}
                    </div>
                    <div className="text-white/90 text-[12px] mt-0.5">
                      {kb.visual.coverExample.subText}
                    </div>
                  </div>
                </div>
              </Section>

              <Section
                title="⑥ LongMem · 长期记忆（读到这里的都是长线学到的）"
                accent={account.accent}
                icon={<Brain size={12} />}
              >
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1.5 font-medium">
                    TOP 方向胜率
                  </div>
                  <div className="space-y-1">
                    {kb.longMem.topDirections.map((d, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between text-[12.5px] text-neutral-800"
                      >
                        <span className="flex items-center gap-1.5">
                          <span
                            className="inline-block w-4 text-center text-[10px] font-bold rounded"
                            style={{
                              background: account.accentSoft,
                              color: account.accent,
                            }}
                          >
                            {i + 1}
                          </span>
                          {d.label}
                        </span>
                        <span className="font-mono text-[11px] text-neutral-500">
                          {d.winRate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] text-neutral-500 mb-1.5 font-medium">
                    TOP 反 AI 策略有效性（供反 AI Agent 读）
                  </div>
                  <div className="space-y-1">
                    {kb.longMem.topStrategies.map((s) => (
                      <div
                        key={s.code}
                        className="flex items-center justify-between gap-2 text-[12px] text-neutral-700"
                      >
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-[10px] font-mono text-neutral-400 font-semibold">
                            {s.code}
                          </span>
                          <span className="truncate">{s.label}</span>
                        </div>
                        <span className="font-mono text-[11px] text-emerald-600 flex-shrink-0">
                          {s.hitRate}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </Section>
            </div>

            <footer className="px-6 py-3 border-t border-neutral-100 flex items-center justify-between gap-3 bg-neutral-50/70">
              <div className="text-[11px] text-neutral-500">
                写权限 · 仅 PM 线下维护 · Agent 不回写
              </div>
              <button
                onClick={onGoCompare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white transition hover:brightness-110"
                style={{ background: account.accent }}
              >
                <Sparkles size={12} />
                对比另 2 号
              </button>
            </footer>
          </>
        )}
      </aside>
    </>
  )
}

function Section({
  title,
  accent,
  icon,
  children,
}: {
  title: string
  accent: string
  icon?: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <section>
      <h3
        className="text-[11px] uppercase tracking-widest font-bold mb-2.5 flex items-center gap-1.5"
        style={{ color: accent }}
      >
        {icon}
        {title}
      </h3>
      <div className="space-y-2.5">{children}</div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] text-neutral-500 mb-0.5 font-medium">{label}</div>
      <div className="text-[12.5px] text-neutral-800 leading-relaxed">{value}</div>
    </div>
  )
}
