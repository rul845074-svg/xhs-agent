import { X } from 'lucide-react'
import { NODE_DETAILS, type NodeDetail, type SixFieldCard, type ComponentCard } from '../data/details'

type Props = {
  detailKey: string | null
  onClose: () => void
  accent: string
}

const KIND_LABEL: Record<string, { tag: string; color: string }> = {
  agent: { tag: 'LLM AGENT · 六字段卡', color: '#34d399' },
  component: { tag: 'COMPONENT', color: '#94a3b8' },
  action: { tag: 'RULE ACTION', color: '#94a3b8' },
  decision: { tag: 'DECISION', color: '#a78bfa' },
  human: { tag: 'HUMAN GATE', color: '#fbbf24' },
  product: { tag: 'ARTIFACT', color: '#a1a1aa' },
  io: { tag: 'PIPELINE I/O', color: '#38bdf8' },
  error: { tag: 'REJECT SINK', color: '#fb7185' },
  terminal: { tag: 'PACKAGE', color: '#5eead4' },
}

function Section({
  label,
  items,
  accent,
}: {
  label: string
  items: string[]
  accent: string
}) {
  return (
    <div className="mb-4">
      <div
        className="text-[10px] uppercase tracking-widest mb-2 font-semibold"
        style={{ color: accent }}
      >
        {label}
      </div>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="text-[13px] text-neutral-200 leading-relaxed flex gap-2">
            <span className="text-neutral-500 mt-0.5 flex-shrink-0">·</span>
            <span className="flex-1">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function Field({
  label,
  value,
  accent,
}: {
  label: string
  value: string | string[]
  accent: string
}) {
  const items = Array.isArray(value) ? value : [value]
  return <Section label={label} items={items} accent={accent} />
}

function SixFieldBody({ d, accent }: { d: SixFieldCard; accent: string }) {
  return (
    <>
      <Section label="输入" items={d.input} accent={accent} />
      <Section label="输出" items={d.output} accent={accent} />
      <Section label="工具" items={d.tools} accent={accent} />
      <Section label="边界（✗ 不做 · 承接方）" items={d.boundary} accent={accent} />
      <Section label="合格判据" items={d.gate} accent={accent} />
      <Section label="兜底" items={d.fallback} accent={accent} />
    </>
  )
}

function ComponentBody({ d, accent }: { d: ComponentCard; accent: string }) {
  return (
    <>
      {d.fields.map((f, i) => (
        <Field key={i} label={f.label} value={f.value} accent={accent} />
      ))}
    </>
  )
}

export function NodeDetailPanel({ detailKey, onClose, accent }: Props) {
  const detail: NodeDetail | undefined = detailKey ? NODE_DETAILS[detailKey] : undefined
  const open = detail != null

  const kindMeta = detail ? KIND_LABEL[detail.kind] ?? KIND_LABEL.component : undefined

  return (
    <aside
      className="fixed top-0 right-0 h-screen bg-neutral-950/95 backdrop-blur-xl border-l border-neutral-800 transition-transform duration-300 ease-out z-20 overflow-hidden flex flex-col"
      style={{
        width: 420,
        transform: open ? 'translateX(0)' : 'translateX(105%)',
      }}
    >
      {detail && kindMeta && (
        <>
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ background: accent }}
          />
          <div className="px-6 pt-6 pb-4 border-b border-neutral-800/80">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div
                  className="text-[10px] uppercase tracking-widest font-semibold mb-2"
                  style={{ color: kindMeta.color }}
                >
                  {kindMeta.tag}
                </div>
                <h2 className="text-xl font-semibold text-neutral-50 leading-tight">
                  {detail.title}
                </h2>
                <p className="text-[13px] text-neutral-400 mt-2 leading-relaxed">
                  {detail.tagline}
                </p>
              </div>
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md hover:bg-neutral-800/80 text-neutral-400 hover:text-neutral-100 transition"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {detail.kind === 'agent' ? (
              <SixFieldBody d={detail as SixFieldCard} accent={kindMeta.color} />
            ) : (
              <ComponentBody d={detail as ComponentCard} accent={kindMeta.color} />
            )}
          </div>
        </>
      )}
    </aside>
  )
}
