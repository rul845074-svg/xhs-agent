export type AccountId = '1' | '2' | '3'

export type Account = {
  id: AccountId
  shortName: string
  positioning: string
  hook: string
  audience: string
  tone: string
  accent: string
  accentSoft: string
}

export const ACCOUNTS: Record<AccountId, Account> = {
  '1': {
    id: '1',
    shortName: '1 号 · MBTI',
    positioning: 'MBTI / 依恋测试人设',
    hook: '测试类内容 + 关系分析 + 自我觉察钩子',
    audience: '20-28 岁 · 女性为主 · 情感/自我探索诉求',
    tone: '共情 / 测试结论反转 / "准得头皮发麻"',
    accent: '#a855f7',
    accentSoft: 'rgba(168, 85, 247, 0.18)',
  },
  '2': {
    id: '2',
    shortName: '2 号 · 极简发饰',
    positioning: '极简风发饰种草',
    hook: '上身图 · 搭配场景 · 材质细节',
    audience: '22-32 岁 · 极简穿搭 / 通勤 / 轻熟',
    tone: '克制 / 质感驱动 / 少形容词多场景',
    accent: '#ec4899',
    accentSoft: 'rgba(236, 72, 153, 0.18)',
  },
  '3': {
    id: '3',
    shortName: '3 号 · 小众方法论',
    positioning: '小众兴趣方法论笔记',
    hook: '冷门技能 + 结构化步骤 + 反直觉心法',
    audience: '25-35 岁 · 自学 / 深度兴趣 / 效率党',
    tone: '条理 / 反套话 / 首段定性问题 → 末段给动作',
    accent: '#14b8a6',
    accentSoft: 'rgba(20, 184, 166, 0.18)',
  },
}

export const DEFAULT_ACCOUNT: AccountId = '1'
