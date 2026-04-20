import { ACCOUNTS, type AccountId } from '../data/accounts'
import { NODE_LEGEND } from './nodes'
import type { NodeKind } from '../data/workflow'

const LEGEND_COLORS: Record<NodeKind, string> = {
  agent: '#34d399',
  human: '#fbbf24',
  decision: '#a78bfa',
  action: '#94a3b8',
  product: '#a1a1aa',
  io: '#38bdf8',
  terminal: '#5eead4',
  error: '#fb7185',
}

type Props = {
  activeAccount: AccountId
  onAccountChange: (id: AccountId) => void
}

export function TopBar({ activeAccount, onAccountChange }: Props) {
  const active = ACCOUNTS[activeAccount]

  return (
    <header className="absolute top-0 left-0 right-0 z-10 pointer-events-none">
      <div className="pointer-events-auto px-6 pt-5 pb-4 flex items-start justify-between gap-6">
        <div className="flex-shrink-0">
          <div
            className="text-[10px] uppercase tracking-[0.25em] font-semibold mb-1.5"
            style={{ color: active.accent }}
          >
            H5 · VIBE CODING 实跑 · 图 ② AGENT 编排
          </div>
          <h1 className="text-[22px] font-semibold text-neutral-50 leading-tight">
            小红书 AI 工作流
            <span className="text-neutral-500 font-normal mx-2">·</span>
            <span style={{ color: active.accent }}>{active.shortName}</span>
          </h1>
          <p className="text-[12px] text-neutral-400 mt-1">
            {active.positioning} &nbsp;·&nbsp; {active.tone}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {(Object.keys(ACCOUNTS) as AccountId[]).map((id) => {
            const acc = ACCOUNTS[id]
            const isActive = id === activeAccount
            return (
              <button
                key={id}
                onClick={() => onAccountChange(id)}
                className="group px-3.5 py-2 rounded-lg text-left transition-all duration-200 border backdrop-blur-md"
                style={{
                  borderColor: isActive
                    ? acc.accent
                    : 'rgba(82, 82, 91, 0.45)',
                  background: isActive ? acc.accentSoft : 'rgba(24, 24, 27, 0.65)',
                  boxShadow: isActive
                    ? `0 0 0 1px ${acc.accent}55, 0 8px 20px rgba(0,0,0,0.35)`
                    : 'none',
                }}
              >
                <div
                  className="text-[10px] uppercase tracking-wider font-semibold leading-none mb-1"
                  style={{ color: isActive ? acc.accent : '#a1a1aa' }}
                >
                  {acc.shortName}
                </div>
                <div className="text-[11px] text-neutral-400 leading-tight max-w-[180px]">
                  {acc.positioning}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="pointer-events-auto px-6 pb-3 flex flex-wrap gap-x-4 gap-y-1.5">
        {NODE_LEGEND.map((l) => (
          <div key={l.kind} className="flex items-center gap-1.5">
            <span
              className="inline-block w-2 h-2 rounded-full"
              style={{ background: LEGEND_COLORS[l.kind] }}
            />
            <span className="text-[11px] text-neutral-300 font-medium">{l.label}</span>
            <span className="text-[10px] text-neutral-500">· {l.desc}</span>
          </div>
        ))}
      </div>
    </header>
  )
}
