import type { AccountId } from './accounts'

export type HookSample = {
  title: string
  winRate: string
  publishedAt: string
}

export type KBSnapshot = {
  identity: {
    role: string
    voice: string
    forbidden: string[]
  }
  hooks: HookSample[]
  language: {
    sentence: string
    punctuation: string
    emoji: string
  }
  audience: {
    age: string
    scene: string
    painPoint: string
  }
  visual: {
    palette: string[]
    layout: string
    typography: string
    coverExample: {
      bgFrom: string
      bgTo: string
      bigText: string
      subText: string
    }
  }
  longMem: {
    topDirections: Array<{ label: string; winRate: string }>
    topStrategies: Array<{ code: string; label: string; hitRate: string }>
  }
}

export const KB_SNAPSHOTS: Record<AccountId, KBSnapshot> = {
  '1': {
    identity: {
      role: '20 代女生 · INFP · 情感自我探索写作者',
      voice: '共情前置 · 反转结论 · "准得头皮发麻"型收束',
      forbidden: [
        '不用专家口吻（"研究表明" / "通常而言"）',
        '不贴 MBTI 硬标签给读者打分',
        '不写情绪剥削式 / 比惨式开头',
      ],
    },
    hooks: [
      {
        title: 'ENFP 为什么容易在感情里情绪过山车｜亲测 3 招稳住',
        winRate: '赞藏比 12.4%',
        publishedAt: '昨天 22:14',
      },
      {
        title: 'INFP 最讨厌被问的 5 句话｜第 3 句直接破防',
        winRate: '赞藏比 14.8%',
        publishedAt: '上周二',
      },
      {
        title: '内耗型人格的自救清单｜不是"想开点"这种废话',
        winRate: '赞藏比 10.2%',
        publishedAt: '上周五',
      },
    ],
    language: {
      sentence: '短句为主 · 1 段 2-3 句 · 结尾常留悬念',
      punctuation: '多破折号、问号、感叹少；不用书面"："',
      emoji: '每篇 ≤ 2 个 · 偏 👇 💭 🥲',
    },
    audience: {
      age: '20-26 岁',
      scene: '深夜 / 通勤 / 朋友圈发不出来的时候',
      painPoint: '关系里自我怀疑 · 情绪反刍 · 表达不出痛',
    },
    visual: {
      palette: ['#c084fc', '#7c3aed', '#1f1b3a', '#fef3ff'],
      layout: '大字标题置底 · 顶部留白 · 中央无主体',
      typography: '细黑粗标 · 副文华文细',
      coverExample: {
        bgFrom: '#c084fc',
        bgTo: '#7c3aed',
        bigText: 'INFP 舔狗图鉴',
        subText: '依恋维度 3 问自测',
      },
    },
    longMem: {
      topDirections: [
        { label: 'MBTI × 情感自测', winRate: '12.8%' },
        { label: '依恋模式拆解', winRate: '11.2%' },
        { label: '内耗自救动作', winRate: '9.5%' },
      ],
      topStrategies: [
        { code: 'L003', label: '具象数字替换模糊量词', hitRate: '87%' },
        { code: 'L011', label: '首段场景化 · 去书面口气', hitRate: '82%' },
        { code: 'L042', label: '末段给动作 · 不给道理', hitRate: '78%' },
      ],
    },
  },

  '2': {
    identity: {
      role: '25+ 轻熟女 · 极简风发饰种草 · "克制"美学',
      voice: '克制少形容词 · 材质驱动 · 场景前置',
      forbidden: [
        '不用"绝绝子""神仙""无敌"这类夸张词',
        '不卖课 / 不硬广 · 只聊穿上身的体验',
        '不写"闺蜜推荐""老公夸"这类人情剧情',
      ],
    },
    hooks: [
      {
        title: '秋冬极简发夹｜我只留了这 3 款哑光金属',
        winRate: '收藏比 18.1%',
        publishedAt: '2 天前',
      },
      {
        title: '"耳后别一小撮"适合什么发量｜3 个真实场景',
        winRate: '收藏比 16.4%',
        publishedAt: '上周',
      },
      {
        title: '哑光 vs 亮面｜发饰选哪种不抢戏',
        winRate: '收藏比 13.9%',
        publishedAt: '上上周',
      },
    ],
    language: {
      sentence: '中长句 · 一段 3-4 句 · 材质/重量/尺寸直报',
      punctuation: '多顿号、冒号；极少感叹',
      emoji: '基本不用 · 偶尔一个 ·',
    },
    audience: {
      age: '22-32 岁',
      scene: '通勤 / OOTD / 周末轻社交',
      painPoint: '想精致但怕用力过猛 · 对"学生气"发饰排斥',
    },
    visual: {
      palette: ['#fbcfe8', '#be185d', '#2a1318', '#fff0f5'],
      layout: '封面大量留白 · 产品居中小图 · 文字极少',
      typography: '衬线粗标 · 副文只标材质/克重',
      coverExample: {
        bgFrom: '#fbcfe8',
        bgTo: '#be185d',
        bigText: '哑光金属 · 通勤日常',
        subText: '3 款实测 · 一周不取',
      },
    },
    longMem: {
      topDirections: [
        { label: '哑光金属材质实测', winRate: '14.6%' },
        { label: '场景 × 发量适配', winRate: '11.8%' },
        { label: '极简饰品收纳', winRate: '8.9%' },
      ],
      topStrategies: [
        { code: 'L021', label: '场景前置 · 后讲材质', hitRate: '84%' },
        { code: 'L007', label: '用尺寸/克重替代形容词', hitRate: '80%' },
        { code: 'L042', label: '末段给具体动作（评论区）', hitRate: '75%' },
      ],
    },
  },

  '3': {
    identity: {
      role: '30 代 · 小众兴趣自学者 · 方法论写作',
      voice: '先下结论 · 列 3-4 点 · 每点一句反直觉',
      forbidden: [
        '不用"大家好""希望对你有帮助"这类客套',
        '不贴"干货""硬核"标签 · 用内容证明',
        '不堆书单 / 不引经据典',
      ],
    },
    hooks: [
      {
        title: '独立复盘 10 年｜我只保留了 3 个反常识动作',
        winRate: '收藏比 22.3%',
        publishedAt: '3 天前',
      },
      {
        title: '自学冷门技能｜跳过教程先做烂作品',
        winRate: '收藏比 18.7%',
        publishedAt: '上上周',
      },
      {
        title: '一周只盯 1 个参数｜变量法比全能练有效',
        winRate: '收藏比 16.2%',
        publishedAt: '3 周前',
      },
    ],
    language: {
      sentence: '短句 + 列表 · 1 段 1-2 句 · 每点独立标号',
      punctuation: '冒号、破折号、箭头；基本不用感叹',
      emoji: '不用',
    },
    audience: {
      age: '25-35 岁',
      scene: '通勤思考 / 周末学习规划 / 心流复盘',
      painPoint: '听过太多道理 · 要能落地的具体动作',
    },
    visual: {
      palette: ['#99f6e4', '#0f766e', '#0c1f1b', '#f0fdfa'],
      layout: '封面清单式 · 左上标号 1/2/3/4 · 右侧大字',
      typography: '等线粗标 · 副文黑细带序号',
      coverExample: {
        bgFrom: '#99f6e4',
        bgTo: '#0f766e',
        bigText: '独立自学 · 4 步',
        subText: '3 年摄影心法',
      },
    },
    longMem: {
      topDirections: [
        { label: '反常识自学方法', winRate: '17.4%' },
        { label: '复盘工具化', winRate: '13.2%' },
        { label: '小众技能路径', winRate: '10.6%' },
      ],
      topStrategies: [
        { code: 'L003', label: '首段直接给结论', hitRate: '89%' },
        { code: 'L029', label: '用变量法 / 动作描述代替抽象', hitRate: '82%' },
        { code: 'L011', label: '每点配"反面案例"', hitRate: '74%' },
      ],
    },
  },
}
