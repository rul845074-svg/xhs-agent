export type AccountId = '1' | '2' | '3'

export type Account = {
  id: AccountId
  displayName: string
  handle: string
  shortName: string
  positioning: string
  tone: string
  audience: string
  avatarGradient: [string, string]
  accent: string
  accentSoft: string
  accentLine: string
  stats: {
    followers: string
    todayPending: number
    publishedLast7Days: number
  }
  recentTitle: string
  recentPublishedAt: string
}

export const ACCOUNTS: Record<AccountId, Account> = {
  '1': {
    id: '1',
    displayName: '林小雨 · INFP 日常',
    handle: '@infp_xiaoyu',
    shortName: '1 号 · MBTI',
    positioning: 'MBTI / 依恋测试人设',
    tone: '共情 / 反转结论 / "准得头皮发麻"',
    audience: '20-28 岁 · 女性为主 · 情感自我探索诉求',
    avatarGradient: ['#c084fc', '#7c3aed'],
    accent: '#a855f7',
    accentSoft: 'rgba(168, 85, 247, 0.12)',
    accentLine: 'rgba(168, 85, 247, 0.28)',
    stats: {
      followers: '1.2w',
      todayPending: 2,
      publishedLast7Days: 5,
    },
    recentTitle: 'ENFP 为什么容易在感情里情绪过山车｜亲测 3 招稳住',
    recentPublishedAt: '昨天 22:14 · 点赞 847 · 收藏 312',
  },
  '2': {
    id: '2',
    displayName: 'Mia · 极简发饰日记',
    handle: '@mia_minimal',
    shortName: '2 号 · 极简发饰',
    positioning: '极简风发饰种草',
    tone: '克制 / 质感驱动 / 少形容词多场景',
    audience: '22-32 岁 · 极简穿搭 / 通勤 / 轻熟',
    avatarGradient: ['#f9a8d4', '#db2777'],
    accent: '#ec4899',
    accentSoft: 'rgba(236, 72, 153, 0.12)',
    accentLine: 'rgba(236, 72, 153, 0.28)',
    stats: {
      followers: '8.6k',
      todayPending: 1,
      publishedLast7Days: 4,
    },
    recentTitle: '秋冬极简发夹｜我只留了这 3 款哑光金属',
    recentPublishedAt: '2 天前 · 点赞 623 · 收藏 489',
  },
  '3': {
    id: '3',
    displayName: 'Ken · 小众方法论笔记',
    handle: '@ken_method',
    shortName: '3 号 · 方法论',
    positioning: '小众兴趣方法论笔记',
    tone: '条理 / 反套话 / 首段定性问题 → 末段给动作',
    audience: '25-35 岁 · 自学 / 深度兴趣 / 效率党',
    avatarGradient: ['#5eead4', '#0d9488'],
    accent: '#14b8a6',
    accentSoft: 'rgba(20, 184, 166, 0.12)',
    accentLine: 'rgba(20, 184, 166, 0.28)',
    stats: {
      followers: '2.1w',
      todayPending: 1,
      publishedLast7Days: 3,
    },
    recentTitle: '独立复盘 10 年｜我只保留了 3 个反常识动作',
    recentPublishedAt: '3 天前 · 点赞 1.4k · 收藏 987',
  },
}

export const ACCOUNT_ORDER: AccountId[] = ['1', '2', '3']
export const DEFAULT_ACCOUNT: AccountId = '1'
