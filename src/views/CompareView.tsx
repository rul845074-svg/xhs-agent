import { ArrowLeft, SplitSquareVertical, Sparkles } from 'lucide-react'
import { ACCOUNTS, ACCOUNT_ORDER } from '../data/accounts'
import { KB_SNAPSHOTS } from '../data/kb-snapshots'

type Props = {
  onBack: () => void
}

const SHARED_SEED = {
  topic: '秋天"独处不孤独"这件事',
  brief:
    '同一个选题种子 · 同一份 SharedKB 热度信号 · 进到 3 个号的 StyleKB 后，产物完全不同。',
}

type Variant = {
  title: string
  opening: string
  tags: string[]
  coverBig: string
  coverSub: string
}

const VARIANTS: Record<string, Variant> = {
  '1': {
    title: '秋天一个人待着不等于孤独｜INFP 亲测 3 个小动作',
    opening:
      '"你是不是又在朋友圈发不出来了？"\n 我最近把一个人待着的秋天，活成了很上头的状态。\n 不是硬拗强者，是真正没在内耗——',
    tags: ['#INFP', '#情绪自救', '#内耗终结者', '#依恋测试'],
    coverBig: '独处 · 不等于孤独',
    coverSub: 'INFP 秋日自救 3 步',
  },
  '2': {
    title: '秋天一个人 · 3 件随身饰品｜材质够稳 就不怕场合空',
    opening:
      '一个人去咖啡馆 · 一个人走长街 · 饰品选错了就显得"用力过猛"。\n 我这周只戴了这 3 件 · 哑光金属 · 不反光不抢戏 ——',
    tags: ['#极简穿搭', '#通勤饰品', '#秋日OOTD', '#哑光金属'],
    coverBig: '一个人 · 3 件饰',
    coverSub: '哑光 · 不抢戏',
  },
  '3': {
    title: '独处不是躲人｜4 个反常识的"一个人周末"方法',
    opening:
      '先说结论：独处的质量 ≠ 时间长度。\n 过去 3 年我试了 20+ 种排法 · 只有 4 个动作复现稳定。\n 下面直接给动作，不给鸡汤：',
    tags: ['#方法论', '#独处工具', '#复盘', '#反常识'],
    coverBig: '独处 · 4 步法',
    coverSub: '3 年实测 · 可复用',
  },
}

export function CompareView({ onBack }: Props) {
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
              <SplitSquareVertical size={14} className="text-neutral-400" />
              <div className="text-[13px] font-semibold text-neutral-900">
                同选题 · 3 号差异化对比
              </div>
            </div>
          </div>
          <div className="text-[11.5px] text-neutral-500 font-mono">
            seed = {SHARED_SEED.topic}
          </div>
        </div>
      </header>

      <main className="max-w-[1360px] mx-auto px-6 py-8">
        <section className="mb-6">
          <h1 className="text-[22px] font-bold text-neutral-900 leading-tight mb-1">
            一样的种子 · 3 个截然不同的产物
          </h1>
          <p className="text-[13px] text-neutral-500 max-w-3xl">
            {SHARED_SEED.brief}
          </p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {ACCOUNT_ORDER.map((id) => {
            const a = ACCOUNTS[id]
            const kb = KB_SNAPSHOTS[id]
            const v = VARIANTS[id]
            return (
              <article
                key={id}
                className="rounded-2xl bg-white border border-neutral-200 overflow-hidden flex flex-col"
                style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div
                  className="h-1.5"
                  style={{
                    background: `linear-gradient(90deg, ${a.avatarGradient[0]} 0%, ${a.avatarGradient[1]} 100%)`,
                  }}
                />
                <div className="p-5 flex-1 flex flex-col gap-4">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-full flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${a.avatarGradient[0]} 0%, ${a.avatarGradient[1]} 100%)`,
                      }}
                    />
                    <div className="min-w-0">
                      <div className="text-[13px] font-semibold text-neutral-900 truncate">
                        {a.shortName}
                      </div>
                      <div className="text-[11px] text-neutral-500 truncate">
                        {a.positioning}
                      </div>
                    </div>
                  </div>

                  <Block label="封面">
                    <div
                      className="rounded-lg overflow-hidden p-4 flex flex-col justify-end"
                      style={{
                        aspectRatio: '3/2',
                        background: `linear-gradient(135deg, ${kb.visual.coverExample.bgFrom} 0%, ${kb.visual.coverExample.bgTo} 100%)`,
                      }}
                    >
                      <div
                        className="text-white font-bold leading-tight"
                        style={{ fontSize: 22 }}
                      >
                        {v.coverBig}
                      </div>
                      <div className="text-white/90 text-[12px] mt-0.5">
                        {v.coverSub}
                      </div>
                    </div>
                  </Block>

                  <Block label="标题">
                    <div className="text-[13px] font-medium text-neutral-900 leading-snug">
                      {v.title}
                    </div>
                  </Block>

                  <Block label="开头 3 行">
                    <div className="text-[12px] text-neutral-700 leading-relaxed whitespace-pre-line bg-neutral-50/80 rounded-lg p-3 border border-neutral-100">
                      {v.opening}
                    </div>
                  </Block>

                  <Block label="标签">
                    <div className="flex flex-wrap gap-1.5">
                      {v.tags.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: a.accentSoft,
                            color: a.accent,
                          }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </Block>

                  <Block label="StyleKB 关键要素">
                    <ul className="space-y-1 text-[11.5px] text-neutral-600">
                      <li>
                        <span className="text-neutral-400">人设 · </span>
                        {kb.identity.role}
                      </li>
                      <li>
                        <span className="text-neutral-400">口吻 · </span>
                        {kb.identity.voice}
                      </li>
                      <li>
                        <span className="text-neutral-400">句式 · </span>
                        {kb.language.sentence}
                      </li>
                    </ul>
                  </Block>
                </div>
              </article>
            )
          })}
        </section>

        <section className="mt-10 rounded-2xl border border-neutral-200 bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles size={14} className="text-neutral-400" />
            <div className="text-[13px] font-semibold text-neutral-900">
              差异是怎么产生的
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px] text-neutral-600 leading-relaxed">
            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-1">
                同一层
              </div>
              SharedKB（平台热度信号 / 合规库）全 3 号共用 · 热度分是一样的。
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-1">
                分叉点
              </div>
              进到 StyleKB 后按 account_id 路由 · 人设 / 口吻 / 视觉档案 3 处同步换。
            </div>
            <div className="rounded-lg bg-neutral-50 border border-neutral-100 p-3">
              <div className="text-[11px] uppercase tracking-widest font-semibold text-neutral-500 mb-1">
                长期沉淀
              </div>
              LongMem 回写 TOP 方向 × 胜率 · 下一轮选题会继续拉开差距。
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400 mb-1.5">
        {label}
      </div>
      {children}
    </div>
  )
}
