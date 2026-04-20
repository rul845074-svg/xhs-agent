import { Heart, MessageCircle, Star, Share2, MoreHorizontal, ChevronLeft, Search } from 'lucide-react'
import type { Session } from '../data/sessions'
import { ACCOUNTS } from '../data/accounts'

type Props = { session: Session }

function Cover({ cover }: { cover: Session['cover'] }) {
  return (
    <div
      className="relative w-full aspect-[3/4] overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${cover.bgFrom} 0%, ${cover.bgTo} 100%)`,
      }}
    >
      {cover.pattern === 'dots' && (
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1.5px)',
            backgroundSize: '14px 14px',
          }}
        />
      )}
      {cover.pattern === 'grid' && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)',
            backgroundSize: '22px 22px',
          }}
        />
      )}

      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(0,0,0,0) 55%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      <div className="relative h-full flex flex-col justify-between p-5 text-white">
        <div
          className="inline-flex self-start text-[10px] px-2 py-1 rounded-full border border-white/50 backdrop-blur-sm"
          style={{ background: 'rgba(255,255,255,0.14)' }}
        >
          AI 辅助 · 小红书笔记
        </div>

        <div>
          {cover.accentText && (
            <div className="text-[13px] font-medium opacity-90 mb-1.5 tracking-wide">
              {cover.accentText}
            </div>
          )}
          <div
            className="font-bold leading-[1.1] mb-2"
            style={{ fontSize: 30, textShadow: '0 2px 12px rgba(0,0,0,0.25)' }}
          >
            {cover.bigText}
          </div>
          <div className="text-[14px] opacity-90 font-medium">
            {cover.subText}
          </div>
        </div>
      </div>
    </div>
  )
}

export function PhonePreview({ session }: Props) {
  const account = ACCOUNTS[session.accountId]
  const { copy, cover } = session

  return (
    <div className="flex items-start justify-center">
      <div
        className="relative"
        style={{
          width: 360,
          height: 740,
          background: '#0a0a0a',
          borderRadius: 48,
          padding: 10,
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.18), 0 6px 16px rgba(0,0,0,0.12), inset 0 0 0 1.5px rgba(255,255,255,0.06)',
        }}
      >
        <div
          className="relative overflow-hidden bg-white"
          style={{
            borderRadius: 38,
            width: '100%',
            height: '100%',
          }}
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 z-10 bg-black"
            style={{
              width: 130,
              height: 28,
              borderBottomLeftRadius: 16,
              borderBottomRightRadius: 16,
            }}
          />

          <div className="h-full overflow-y-auto">
            <div className="pt-9 px-4 pb-2 flex items-center justify-between bg-white/95 backdrop-blur-md">
              <button className="p-1 -ml-1 text-neutral-800">
                <ChevronLeft size={22} />
              </button>
              <div className="flex items-center gap-2 flex-1 ml-2">
                <div
                  className="w-8 h-8 rounded-full flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, ${account.avatarGradient[0]} 0%, ${account.avatarGradient[1]} 100%)`,
                  }}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold text-neutral-800 truncate leading-tight">
                    {account.displayName}
                  </div>
                  <div className="text-[10px] text-neutral-500 truncate leading-tight">
                    {account.handle} · 粉丝 {account.stats.followers}
                  </div>
                </div>
                <button
                  className="px-3 py-1 rounded-full text-[11px] font-medium text-white"
                  style={{ background: '#FF2442' }}
                >
                  + 关注
                </button>
              </div>
              <button className="p-1 text-neutral-600">
                <Search size={18} />
              </button>
            </div>

            <Cover cover={cover} />

            <div className="px-4 py-4 bg-white">
              <h1 className="text-[18px] font-bold text-neutral-900 leading-snug mb-3">
                {copy.title}
              </h1>

              <div className="space-y-2.5 text-[14px] text-neutral-800 leading-relaxed">
                {copy.body.map((seg) => (
                  <p key={seg.id}>{seg.text}</p>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-4">
                <span
                  className="text-[12px] px-2 py-0.5 rounded-full font-medium"
                  style={{
                    background: '#FFF1F3',
                    color: '#FF2442',
                    border: '0.5px solid #FFD7DD',
                  }}
                >
                  {copy.aiTag}
                </span>
                {copy.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[12px] text-blue-600 font-medium"
                    style={{ color: '#3A7FD8' }}
                  >
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-5 pb-2 text-[11px] text-neutral-400">
                编辑于 刚刚 · 显示 IP 属地 上海
              </div>
            </div>

            <div className="h-[72px]" />
          </div>

          <div
            className="absolute left-0 right-0 bottom-0 flex items-center justify-around px-3 py-2.5 bg-white border-t border-neutral-100"
            style={{ paddingBottom: 16 }}
          >
            <div className="flex items-center gap-1 text-neutral-700">
              <Heart size={22} strokeWidth={2} />
              <span className="text-[12px]">1.2k</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-700">
              <Star size={22} strokeWidth={2} />
              <span className="text-[12px]">834</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-700">
              <MessageCircle size={22} strokeWidth={2} />
              <span className="text-[12px]">207</span>
            </div>
            <div className="flex items-center gap-1 text-neutral-700">
              <Share2 size={22} strokeWidth={2} />
            </div>
            <div className="flex items-center gap-1 text-neutral-400">
              <MoreHorizontal size={22} strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
