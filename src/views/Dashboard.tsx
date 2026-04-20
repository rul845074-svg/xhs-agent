import { ArrowUpRight, Plus, Sparkles, Users, Calendar, Play, Network } from 'lucide-react'
import { ACCOUNTS, ACCOUNT_ORDER, type AccountId } from '../data/accounts'
import { SESSIONS } from '../data/sessions'

type Props = {
  onStartCompose: (accountId: AccountId) => void
  onReplaySession: (accountId: AccountId) => void
  onGoWorkflow: () => void
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[18px] font-bold text-neutral-900 leading-none">{value}</span>
      <span className="text-[11px] text-neutral-500 mt-1">{label}</span>
    </div>
  )
}

export function Dashboard({ onStartCompose, onReplaySession, onGoWorkflow }: Props) {
  const totalPending = ACCOUNT_ORDER.reduce(
    (sum, id) => sum + ACCOUNTS[id].stats.todayPending,
    0,
  )
  const totalPublished = ACCOUNT_ORDER.reduce(
    (sum, id) => sum + ACCOUNTS[id].stats.publishedLast7Days,
    0,
  )

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-lg border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-[13px]"
              style={{ background: '#FF2442' }}
            >
              小
            </div>
            <div>
              <div className="text-[14px] font-semibold text-neutral-900 leading-tight">
                小红书代运营工作台
              </div>
              <div className="text-[10px] text-neutral-500 leading-tight">
                AI 工作流 · 1 人运营 3 账号
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onGoWorkflow}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition"
            >
              <Network size={14} />
              设计视角 · 图 ②
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <section className="mb-8">
          <div className="flex items-end justify-between mb-1">
            <h1 className="text-[28px] font-bold text-neutral-900 leading-tight">
              今日 · 3 个号共待发{' '}
              <span style={{ color: '#FF2442' }}>{totalPending}</span> 条
            </h1>
            <div className="text-[13px] text-neutral-500">
              近 7 日已发 {totalPublished} 条 · 全平均耗时 60s/条
            </div>
          </div>
          <p className="text-[13px] text-neutral-500">
            挑一个号开单。Agent 会按该号的人设 / KB / 长期记忆产出可复制笔记 + 封面。
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {ACCOUNT_ORDER.map((id) => {
            const a = ACCOUNTS[id]
            const hasDemo = SESSIONS[id] != null
            return (
              <article
                key={id}
                className="group rounded-2xl bg-white overflow-hidden border border-neutral-200 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-neutral-200/80"
                style={{
                  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                }}
              >
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${a.avatarGradient[0]} 0%, ${a.avatarGradient[1]} 100%)`,
                  }}
                />

                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-full flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${a.avatarGradient[0]} 0%, ${a.avatarGradient[1]} 100%)`,
                      }}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[15px] font-semibold text-neutral-900 truncate">
                        {a.displayName}
                      </div>
                      <div className="text-[11px] text-neutral-500">
                        {a.handle} · {a.shortName}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div
                      className="text-[12px] font-medium mb-1"
                      style={{ color: a.accent }}
                    >
                      {a.positioning}
                    </div>
                    <div className="text-[12px] text-neutral-500 leading-relaxed">
                      {a.tone}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                    <Stat label="粉丝" value={a.stats.followers} />
                    <Stat label="今日待发" value={`${a.stats.todayPending}`} />
                    <Stat label="近 7 日" value={`${a.stats.publishedLast7Days}`} />
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-neutral-400 font-semibold mb-1.5">
                      <Calendar size={11} />
                      最近发布
                    </div>
                    <div className="text-[12.5px] font-medium text-neutral-800 leading-snug mb-1 line-clamp-2">
                      {a.recentTitle}
                    </div>
                    <div className="text-[10.5px] text-neutral-400">
                      {a.recentPublishedAt}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => onStartCompose(id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl font-semibold text-[13px] text-white transition-all hover:brightness-110 active:scale-[0.98]"
                      style={{
                        background: `linear-gradient(135deg, ${a.avatarGradient[0]} 0%, ${a.avatarGradient[1]} 100%)`,
                      }}
                    >
                      <Plus size={15} />
                      新建一单
                    </button>
                    {hasDemo && (
                      <button
                        onClick={() => onReplaySession(id)}
                        className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl font-medium text-[12px] text-neutral-700 bg-neutral-100 hover:bg-neutral-200 transition"
                        title="跳过流程 · 直接看预置 Session"
                      >
                        <Play size={13} />
                        看样例
                      </button>
                    )}
                  </div>
                </div>
              </article>
            )
          })}
        </section>

        <section className="mt-10">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={16} className="text-neutral-400" />
            <h2 className="text-[14px] font-semibold text-neutral-900">
              这个 Demo 里你能做什么
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              {
                icon: Users,
                title: '3 号差异化',
                desc: '切号后人设 / 语气 / KB 三处同步换；生成的内容一眼能区分。',
              },
              {
                icon: Play,
                title: '端到端跑一单',
                desc: '60 秒看完选题 → 文案 → 反 AI 化 → 封面 → 打包全过程。',
              },
              {
                icon: ArrowUpRight,
                title: '可复制发布',
                desc: '完成后点一下复制，直接粘到小红书发布框；含 AI 合规标。',
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div
                  key={i}
                  className="rounded-xl bg-white border border-neutral-200 p-4"
                >
                  <Icon size={16} className="text-neutral-400 mb-2" />
                  <div className="text-[13px] font-semibold text-neutral-900 mb-1">
                    {item.title}
                  </div>
                  <div className="text-[11.5px] text-neutral-500 leading-relaxed">
                    {item.desc}
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </main>
    </div>
  )
}
