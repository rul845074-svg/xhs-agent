import type { AccountId } from './accounts'

export type TopicCandidate = {
  id: string
  title: string
  angle: string
  audience: string
  recommended?: boolean
}

export type CopySegment = {
  id: number
  text: string
}

export type AntiAIChange = {
  segmentId: number
  before: string
  after: string
  reason: string
  matchedRule: string
}

export type CoverStyle = {
  bgFrom: string
  bgTo: string
  bigText: string
  subText: string
  accentText?: string
  pattern?: 'dots' | 'grid' | 'none'
}

export type AgentPhaseId = 'topic' | 'copy' | 'tag' | 'antiai' | 'cover' | 'package'

export type AgentPhase = {
  id: AgentPhaseId
  label: string
  durationMs: number
  note?: string
  activeVerb: string
  doneSummary: string
}

export type Session = {
  id: string
  accountId: AccountId
  mode: 'generate' | 'wrap'
  topicCandidates: TopicCandidate[]
  copy: {
    title: string
    body: CopySegment[]
    tags: string[]
    aiTag: string
  }
  antiAIChanges: AntiAIChange[]
  cover: CoverStyle
  phases: AgentPhase[]
  meta: {
    totalSec: number
    suggestedPublishAt: string
    sessionLabel: string
  }
}

const commonTopic = (
  label: string,
  note?: string,
): AgentPhase => ({
  id: 'topic',
  label,
  durationMs: 11000,
  note,
  activeVerb: '路由账号 KB · 拉长期记忆 · LLM 产出 N 候选',
  doneSummary: '读 StyleKB + LongMem · 产出 4 候选 · 1 条 AI 推荐',
})

const commonCopy: AgentPhase = {
  id: 'copy',
  label: '文案生成 Agent',
  durationMs: 18500,
  activeVerb: '按选定选题 · 人设口吻 · 分段写作',
  doneSummary: '标题 ≤ 20 字 · 正文 7 段 · 段号 0-N 可定位',
}

const commonTag: AgentPhase = {
  id: 'tag',
  label: '自动打标动作',
  durationMs: 900,
  activeVerb: '按 PolicyKB · 追加 AI 合规标签',
  doneSummary: '追加 #AI 辅助生成',
}

const commonAntiAI = (rounds: number, ms: number): AgentPhase => ({
  id: 'antiai',
  label: '反 AI 化润色 Agent',
  durationMs: ms,
  note: `重跑 ${rounds} 轮达标`,
  activeVerb: '读 AntiAIKB + 上轮拒绝理由 · 段级改写',
  doneSummary: `${rounds} 轮达标 · 命中 R003/R017/R042 三条规则`,
})

const commonCover: AgentPhase = {
  id: 'cover',
  label: '封面生图 Agent',
  durationMs: 15800,
  activeVerb: '读视觉档案 · 生主图 + 2 备选 · 过机审',
  doneSummary: '主图 1 · 备选 2 · 机审版权 ✓ 敏感词 ✓',
}

const commonPackage: AgentPhase = {
  id: 'package',
  label: '打包',
  durationMs: 1500,
  activeVerb: '合成发布包',
  doneSummary: '移交图 ① Compliance 终审',
}

export const SESSIONS: Record<AccountId, Session> = {
  '1': {
    id: 'S-2026-04-21-01',
    accountId: '1',
    mode: 'generate',
    topicCandidates: [
      {
        id: 't1',
        title: '为什么 INFP 谈恋爱总在当舔狗｜依恋模式 3 维度自测',
        angle: '共情痛点 + 自测钩子',
        audience: '20-26 岁 INFP / 情感困扰',
        recommended: true,
      },
      {
        id: 't2',
        title: '回避型依恋的 3 个信号｜你中了几条',
        angle: '标签化 + 对号入座',
        audience: '依恋关系探索者',
      },
      {
        id: 't3',
        title: '焦虑型 × 回避型｜为什么互相吸引又互相折磨',
        angle: '关系动力学 / 反套话',
        audience: '情侣矛盾期',
      },
      {
        id: 't4',
        title: 'MBTI 不准？其实是你没看依恋维度｜附 4 问自测',
        angle: 'MBTI 话题借势',
        audience: 'MBTI 入门受众',
      },
    ],
    copy: {
      title: '为什么 INFP 谈恋爱总在当舔狗｜依恋模式 3 维度自测',
      body: [
        {
          id: 1,
          text: '深夜 12 点你秒回消息，对方 3 小时才回你一句"在"，你下一秒还在想"是不是我哪里做错了"——INFP 们，这一幕眼熟吗？',
        },
        {
          id: 2,
          text: '我研究了 200+ 份依恋测试样本，发现 INFP 不是天生舔狗，是被 3 个维度同时拿捏。',
        },
        {
          id: 3,
          text: '① 情感渗透度高 —— 一条消息能脑补对方 24 小时的状态。',
        },
        {
          id: 4,
          text: '② 冲突耐受度低 —— 宁愿自己消化也不开口问"你是不是不爱我"。',
        },
        {
          id: 5,
          text: '③ 反馈依赖型 —— 对方给一点糖，你会还回去一整罐。',
        },
        {
          id: 6,
          text: '接下来是重点：不是改掉这 3 条，而是识别对方是不是"吃"你这套。下面 4 问测一下你现在的状态 👇',
        },
        {
          id: 7,
          text: '（测完评论区告诉我你的结果，抽 3 位解读，看到都会回）',
        },
      ],
      tags: ['#INFP', '#依恋测试', '#MBTI', '#情感成长', '#自我觉察'],
      aiTag: '#AI 辅助生成',
    },
    antiAIChanges: [
      {
        segmentId: 1,
        before: '当您在深夜时分收到伴侣的延迟回复时，您是否会陷入自我怀疑？',
        after: '深夜 12 点你秒回消息，对方 3 小时才回你一句"在"，你下一秒还在想"是不是我哪里做错了"——INFP 们，这一幕眼熟吗？',
        reason: '场景化 · 去书面"您"',
        matchedRule: 'R003 · 书面口气置换',
      },
      {
        segmentId: 2,
        before: '大量研究数据表明，INFP 人格类型在亲密关系中存在特定的行为模式。',
        after: '我研究了 200+ 份依恋测试样本，发现 INFP 不是天生舔狗，是被 3 个维度同时拿捏。',
        reason: '个人化 · 去模板 · 具象数字',
        matchedRule: 'R017 · 去"大量研究显示"模板',
      },
      {
        segmentId: 6,
        before: '综上所述，建议您识别对方是否匹配您的需求，以下问题可供参考。',
        after: '接下来是重点：不是改掉这 3 条，而是识别对方是不是"吃"你这套。下面 4 问测一下你现在的状态 👇',
        reason: '去"综上所述" · 加转折钩子',
        matchedRule: 'R042 · 去总结模板 + emoji 引导',
      },
    ],
    cover: {
      bgFrom: '#c084fc',
      bgTo: '#7c3aed',
      bigText: 'INFP 舔狗图鉴',
      subText: '依恋维度 3 问自测',
      accentText: '测完偷偷心疼自己',
      pattern: 'dots',
    },
    phases: [
      commonTopic('选题 Agent · 生成模式', '4 候选 · 1 条 AI 推荐'),
      commonCopy,
      commonTag,
      commonAntiAI(2, 14200),
      commonCover,
      commonPackage,
    ],
    meta: {
      totalSec: 62,
      suggestedPublishAt: '今晚 21:30（1 号高峰）',
      sessionLabel: '依恋模式 3 维度自测',
    },
  },

  '2': {
    id: 'S-2026-04-21-02',
    accountId: '2',
    mode: 'generate',
    topicCandidates: [
      {
        id: 't1',
        title: '通勤显贵气的极简发夹｜3 款哑光金属 · 实测一周',
        angle: '场景 + 材质 + 实测',
        audience: '通勤轻熟 / 极简穿搭',
        recommended: true,
      },
      {
        id: 't2',
        title: '小众极简发饰｜5 款不踩雷清单',
        angle: '清单 + 防踩雷',
        audience: '极简入门',
      },
      {
        id: 't3',
        title: '极简穿搭｜发饰提亮整体氛围的 3 个细节',
        angle: '搭配逻辑',
        audience: '进阶穿搭',
      },
      {
        id: 't4',
        title: '发量少星人｜极简发夹显发量的 2 个技巧',
        angle: '细分人群痛点',
        audience: '细软发质',
      },
    ],
    copy: {
      title: '通勤显贵气的极简发夹｜3 款哑光金属 · 实测一周',
      body: [
        {
          id: 1,
          text: '我最近把首饰盒清了一半，只留了 3 只哑光金属的极简发夹，通勤一周的真实体验。',
        },
        {
          id: 2,
          text: '① Kate 哑光方扣 · 银色 · 45g',
        },
        {
          id: 3,
          text: '挑的是宽 1.2cm、长 6cm 的尺寸，别头顶蓬松层、小露额头最合适，不压发。',
        },
        {
          id: 4,
          text: '② Noa 哑光椭圆 · 香槟金 · 38g',
        },
        {
          id: 5,
          text: '适合半扎半披，正面看侧边线条干净。材质是哑光黄铜，不像亮面那么容易抢戏。',
        },
        {
          id: 6,
          text: '③ Mika 哑光细横条 · 玫瑰金 · 22g',
        },
        {
          id: 7,
          text: '最轻的一只，别耳后一小撮发很灵。适合偏素的衬衫日。',
        },
        {
          id: 8,
          text: '上身对比图 4 张在图 2-5，拍的是早上出门前自然光。',
        },
        {
          id: 9,
          text: '评论区告诉我你的发量级别和通勤风格，我下期做搭配指南。',
        },
      ],
      tags: ['#极简穿搭', '#发饰分享', '#哑光金属', '#通勤OOTD', '#小众好物'],
      aiTag: '#AI 辅助生成',
    },
    antiAIChanges: [
      {
        segmentId: 1,
        before: '近期本人对首饰收纳进行了精简调整，最终保留了 3 款哑光金属材质的极简发夹。',
        after: '我最近把首饰盒清了一半，只留了 3 只哑光金属的极简发夹，通勤一周的真实体验。',
        reason: '口语化 · 去书面第三人称',
        matchedRule: 'R003 · 书面口气置换',
      },
      {
        segmentId: 5,
        before: '该款采用哑光黄铜材质，具备不易抢镜的视觉优势。',
        after: '适合半扎半披，正面看侧边线条干净。材质是哑光黄铜，不像亮面那么容易抢戏。',
        reason: '先场景再材质 · 去"该款""具备"',
        matchedRule: 'R021 · 场景前置改写',
      },
      {
        segmentId: 9,
        before: '欢迎在评论区分享您的反馈，期待您的互动。',
        after: '评论区告诉我你的发量级别和通勤风格，我下期做搭配指南。',
        reason: '去"期待您的反馈" · 给具体动作',
        matchedRule: 'R042 · 去总结模板 + emoji 引导',
      },
    ],
    cover: {
      bgFrom: '#fbcfe8',
      bgTo: '#be185d',
      bigText: '哑光金属 · 通勤日常',
      subText: '3 款实测 · 一周不取',
      accentText: '香槟金 / 银 / 玫瑰金',
      pattern: 'grid',
    },
    phases: [
      commonTopic('选题 Agent · 生成模式', '4 候选 · 1 条 AI 推荐'),
      commonCopy,
      commonTag,
      commonAntiAI(1, 10800),
      commonCover,
      commonPackage,
    ],
    meta: {
      totalSec: 58,
      suggestedPublishAt: '今天 19:00（2 号下班高峰）',
      sessionLabel: '哑光金属发饰实测',
    },
  },

  '3': {
    id: 'S-2026-04-21-03',
    accountId: '3',
    mode: 'generate',
    topicCandidates: [
      {
        id: 't1',
        title: '独立学摄影 3 年｜我只走通了这 4 个反常识步骤',
        angle: '反常识 + 亲历 + 清单',
        audience: '自学 / 深度兴趣',
        recommended: true,
      },
      {
        id: 't2',
        title: '自学软件｜跳过教程直接上手的 3 个心法',
        angle: '心法抽象',
        audience: '自学工具链',
      },
      {
        id: 't3',
        title: '冷门技能自学｜比步骤更重要的 2 条底层逻辑',
        angle: '底层逻辑',
        audience: '元学习者',
      },
      {
        id: 't4',
        title: '一个人自学｜我靠这 5 个问法节省了 80% 时间',
        angle: '工具化 · 问法',
        audience: '提效党',
      },
    ],
    copy: {
      title: '独立学摄影 3 年｜我只走通了这 4 个反常识步骤',
      body: [
        {
          id: 1,
          text: '先说结论：不买课、不进群、不做作业，独立自学 3 年，我只靠这 4 件事。',
        },
        {
          id: 2,
          text: '① 先拍 1000 张烂片，再看一本书。',
        },
        {
          id: 3,
          text: '大多数人顺序反了——先看书，拍的时候只剩别人的眼睛，没自己的问题。烂片是你自己的问题源。',
        },
        {
          id: 4,
          text: '② 把 3 个摄影师的作品各临摹 30 张。',
        },
        {
          id: 5,
          text: '不是模仿成功，是拆解他们在解决什么问题。选 3 个风格差异大的，30 张后你会开始问"为什么这么处理"——那就是你开始有眼睛了。',
        },
        {
          id: 6,
          text: '③ 一周只盯 1 个参数。',
        },
        {
          id: 7,
          text: '光圈周、快门周、ISO 周。不是全能训练，是把 1 个变量打穿，其他自然懂。',
        },
        {
          id: 8,
          text: '④ 自述题 · 每次后问自己 3 句：a) 这张想说什么 b) 哪里说得含糊 c) 下次换什么说法。',
        },
        {
          id: 9,
          text: '这 3 句比任何教程管用。方法论之所以是方法论，不在复杂，在反直觉。',
        },
      ],
      tags: ['#自学', '#摄影', '#方法论', '#反常识', '#独立学习'],
      aiTag: '#AI 辅助生成',
    },
    antiAIChanges: [
      {
        segmentId: 1,
        before: '在学习摄影的过程中，笔者发现了一些行之有效的独立学习方法，现总结如下。',
        after: '先说结论：不买课、不进群、不做作业，独立自学 3 年，我只靠这 4 件事。',
        reason: '去"笔者 / 总结如下" · 前置结论',
        matchedRule: 'R003 · 书面口气置换',
      },
      {
        segmentId: 3,
        before: '通常而言，大多数人倾向于先阅读理论书籍，然而这样做可能会限制自主思考能力。',
        after: '大多数人顺序反了——先看书，拍的时候只剩别人的眼睛，没自己的问题。烂片是你自己的问题源。',
        reason: '去"通常而言" · 给反面陈述',
        matchedRule: 'R017 · 去"大量研究显示"模板',
      },
      {
        segmentId: 9,
        before: '希望各位读者能够从中获得启发，在摄影之路上有所收获。',
        after: '这 3 句比任何教程管用。方法论之所以是方法论，不在复杂，在反直觉。',
        reason: '去"希望读者 / 获得启发" · 给意味感收束',
        matchedRule: 'R042 · 去总结模板 + emoji 引导',
      },
    ],
    cover: {
      bgFrom: '#99f6e4',
      bgTo: '#0f766e',
      bigText: '独立自学 · 4 步',
      subText: '3 年摄影心法',
      accentText: '反常识的才是方法论',
      pattern: 'grid',
    },
    phases: [
      commonTopic('选题 Agent · 生成模式', '4 候选 · 1 条 AI 推荐'),
      commonCopy,
      commonTag,
      commonAntiAI(2, 13100),
      commonCover,
      commonPackage,
    ],
    meta: {
      totalSec: 60,
      suggestedPublishAt: '明天 07:30（3 号通勤时段）',
      sessionLabel: '独立自学 4 步',
    },
  },
}
