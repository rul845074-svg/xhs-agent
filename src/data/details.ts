export type SixFieldCard = {
  kind: 'agent'
  title: string
  tagline: string
  input: string[]
  output: string[]
  tools: string[]
  boundary: string[]
  gate: string[]
  fallback: string[]
}

export type ComponentCard = {
  kind: 'component' | 'action' | 'decision' | 'human' | 'product' | 'io' | 'error' | 'terminal'
  title: string
  tagline: string
  fields: Array<{ label: string; value: string | string[] }>
}

export type NodeDetail = SixFieldCard | ComponentCard

export const NODE_DETAILS: Record<string, NodeDetail> = {
  entry: {
    kind: 'io',
    title: 'Pipeline 入口',
    tagline: '接到图 ① 加载完的账号配置，进入图 ② Agent 编排',
    fields: [
      { label: '上游', value: '图 ① Router → Load1/2/3 → 入本 Pipeline' },
      { label: '携带', value: ['账号 ID', 'StyleKB 路由句柄', 'Session 初始化上下文'] },
    ],
  },

  mode: {
    kind: 'decision',
    title: 'PM 选题方式判定',
    tagline: '由编排控制按入口载荷判分流，不由 Agent 判',
    fields: [
      { label: '判据', value: 'PM 入口是否带"一句话毛选题"' },
      {
        label: '分流',
        value: [
          '未带毛选题 → 生成模式（Topic-Gen）',
          '带毛选题 → 包装模式（Topic-Wrap）',
        ],
      },
      { label: '来自', value: '图 ② v1.1 新增 · 决策 13（选题双模式）' },
    ],
  },

  'topic-gen': {
    kind: 'agent',
    title: '选题 Agent · 生成模式',
    tagline: '内容生死线 · 读 KB 产出 N 个候选选题',
    input: [
      '账号 ID（1/2/3）',
      '模式标识：生成',
      '触发指令',
      'Session 上下文（历次胜率 / 近期驳回分布）',
    ],
    output: [
      'N 个标准选题卡（方向 / 角度 / 关键词 / 目标人群 / 格式）',
      '推荐优先级',
    ],
    tools: [
      '读：StyleKB[account_id]（私有，按账号路由）',
      '读：LongMem[account_id].方向胜率 + .爆款归因（L\\d{3}）',
      '写：VersionRepo（选题卡）+ Session',
      '调用：LLM（策略建模 + 禁区命中 LLM 语义自评）',
    ],
    boundary: [
      '✗ 不做文案 → § 2.2 文案 Agent 承接',
      '✗ 不做封面 → § 2.4 封面 Agent 承接',
      '✗ 不做敏感词审核 → § 3.2 机审节点（P\\d{3}）承接',
    ],
    gate: [
      '输出 ≥ 3 候选 · 每个 5 字段完整',
      '禁区命中 = LLM 语义自评（hit_forbidden_zone:true/false）',
      'H5 验证：盲测能否一句话区分号别',
    ],
    fallback: [
      'LLM 失败 → 重试 ≤ 2 次',
      'KB 路由失败（ID ∉ {1,2,3}）→ E001',
      'KB IO 失败 → E003（服务可用性）',
      'KB 数据格式非法 → E007（字段缺失 / R·L·P 空间违约）',
    ],
  },

  'topic-wrap': {
    kind: 'agent',
    title: '选题 Agent · 包装模式',
    tagline: 'PM 自带毛选题 · KB 路由 + 结构化 + 人设校验',
    input: [
      '账号 ID',
      '模式标识：包装',
      'PM 毛选题（一句话）',
      'Session 上下文',
    ],
    output: [
      '1 张标准选题卡',
      '人设一致性校验结论（通过 / 严重不符）',
    ],
    tools: [
      '读：StyleKB[account_id]',
      '写：VersionRepo + Session',
      '调用：LLM',
    ],
    boundary: [
      '✗ 不额外生成候选 → 候选由 PM 在入口给出',
      '✗ 人设严重不符不硬拦 → PMConfirm 弹窗人工决定',
    ],
    gate: [
      '选题卡字段齐全 + 校验结论明确',
      '"严重不符"定义见 07 v0.9 P7',
    ],
    fallback: [
      'LLM 失败 → 重试 ≤ 2 次',
      '严重不符 → PMConfirm 弹窗',
    ],
  },

  candidates: {
    kind: 'product',
    title: '候选选题 × N',
    tagline: '中间产物 · 写入 VersionRepo',
    fields: [
      { label: '内容', value: 'N 张结构化选题卡 + 推荐优先级' },
      { label: '默认 N', value: '07 v0.9 topic_count 可配置（默认 3-5）' },
      { label: '落盘', value: 'VersionRepo · 按 account_id 隔离' },
    ],
  },

  'human-pick': {
    kind: 'human',
    title: '人工卡点 · N 选 1',
    tagline: '仅生成模式触发 · 30 秒人工决策值得',
    fields: [
      { label: '职责', value: 'PM 从 N 候选中挑 1' },
      {
        label: '出口',
        value: ['选定 → 文案 Agent', '全部不行 → 驳回出口（ReworkOut）'],
      },
      { label: '为何不合成一键', value: '选题错 → 下游 Agent 全废 · 值得人工把关' },
    ],
  },

  'wrap-check': {
    kind: 'decision',
    title: '人设一致性校验',
    tagline: '包装模式专用 · 兜底 KB 绕过的风险',
    fields: [
      {
        label: '背景',
        value: 'PM 手输会绕过"选题 Agent 用 KB 约束选题方向"这一闸；八竿子打不着的毛选题会让下游产出割裂内容',
      },
      {
        label: '分流',
        value: ['通过 → 直通文案（跳过 HumanPick）', '严重不符 → PMConfirm'],
      },
    ],
  },

  'pm-confirm': {
    kind: 'human',
    title: '人工卡点 · PM 确认',
    tagline: '仅在人设严重不符时弹窗 · 不骚扰每次',
    fields: [
      {
        label: '选项',
        value: ['强推（承担风险） → 进文案', '修改毛选题 → 回 Topic-Wrap'],
      },
    ],
  },

  copy: {
    kind: 'agent',
    title: '文案生成 Agent',
    tagline: '按选定选题 + 账号风格产出笔记草稿',
    input: [
      '选定选题卡（1 张结构化）',
      '账号 ID',
      'Session 上下文（含历次版本）',
    ],
    output: ['文案草稿（标题 + 分段正文 · 带段号便于驳回定位）'],
    tools: [
      '读：StyleKB[account_id]（人设 / 爆款文案 / 语言风格 / 目标人群）',
      '读：Session（含 overrides[] 软偏好覆盖）',
      '写：VersionRepo（文案稿）+ Session',
      '调用：LLM',
    ],
    boundary: [
      '✗ 不自动打标 → § 3.1 自动打标动作承接',
      '✗ 不做反 AI 化 → § 2.3 反 AI 化润色 Agent 承接',
      '✗ 不判敏感词 / 不做版权 → § 3.2 机审节点承接',
      '✓ 正文 500-1000 字 · 段落有明确段号（1-N）',
    ],
    gate: [
      '标题 ≤ 20 字且含钩子',
      '风格与 StyleKB 对齐（含 overrides 生效视图）',
      'StyleKB Integrity Check 通过（07 v0.9 P1）',
      'H5 验证：盲测能否一句话区分号别',
    ],
    fallback: [
      'LLM 失败 → 重试 ≤ 2 次',
      'StyleKB IO 失败 → E003 · 数据格式非法 → E007',
      '偏离选题 → 驳回机制处理（方向 / 执行归因）',
    ],
  },

  'copy-draft': {
    kind: 'product',
    title: '文案草稿',
    tagline: '标题 + 分段正文 · 带段号（segment_id）',
    fields: [
      { label: '段号约定', value: 'segment_id=0 专指标题 · segment_id≥1 指正文段' },
      { label: '字数', value: '正文 500-1000 字' },
    ],
  },

  tag: {
    kind: 'action',
    title: '自动打标动作',
    tagline: '纯规则 · 不调 LLM · 术语诚实（非"机审"）',
    fields: [
      { label: '类型', value: '规则动作（纯逻辑）' },
      { label: '输入', value: '文案稿 + PolicyKB.AI 标签规则（P\\d{3}）' },
      { label: '输出', value: '追加 "#AI 辅助生成" 等合规标签的文案稿' },
      { label: '兜底', value: '规则未覆盖 → 默认保底标签；PolicyKB IO 失败 → E003 / 格式非法 → E007' },
    ],
  },

  antiai: {
    kind: 'agent',
    title: '反 AI 化润色 Agent',
    tagline: '核心价值点 · 去模型痕迹 · 读上次拒绝理由防重复踩坑',
    input: [
      '文案稿（已打 AI 标签）',
      'Session.antiAIFeedback[]（由机审节点写入 · 关键！）',
      'AntiAIKB（共享 · 痕迹特征库 + 改写规则表 · R\\d{3}）',
    ],
    output: [
      '润色稿（标题 + 分段正文 · 段号保留）',
      'meta.unmapped_rules[]（观测字段 · 07 v0.9 P10）',
      'meta.strategies_avoided_from_history[]',
    ],
    tools: [
      '读：AntiAIKB（共享 · 痕迹特征库 R\\d{3} + 改写规则表 mappings）',
      '读：LongMem[account_id].策略有效性（8 枚举 · L\\d{3}）',
      '读：VersionRepo（版本对比）+ Session',
      '写：VersionRepo（润色稿）+ Session',
      '调用：LLM（痕迹识别 = LLM 语义自评 · 非字面子串匹配）',
    ],
    boundary: [
      '✗ 不改选题方向（仅改句式 / 词汇 / 结构）→ direction 归因回 § 2.1',
      '✗ 不碰封面 → § 2.4 承接',
      '✗ 不做合规打标 → § 3.1 承接',
      '✗ 不判机审 → § 3.2 下游独立节点承接',
      '✗ 不修复事实性错误 → PM 通过段级重写 / 人工改',
    ],
    gate: [
      '反 AI 化机审得分达标（阈值 H5 实跑确定）',
      '保留选题方向与核心信息（与上一版 diff 验证）',
      '段号与文案稿一致',
      '策略排序：hit_rate↓ → used_count↓ · 业务推荐 > LongMem 决策优先级',
      '上浮机制：业务推荐集连 3 次失败 → 分阶段上浮',
    ],
    fallback: [
      '机审不达标 → 自动重跑（读上次问题句子列表） · ≤ 3 次',
      '超限 → 上抛 ReworkOut',
      'AntiAIKB IO 失败 → E003 / 格式非法 → E007',
      'LongMem IO 失败 → 降级不使用（meta.longmem_degraded=true）',
    ],
  },

  'antiai-draft': {
    kind: 'product',
    title: '润色稿',
    tagline: '含 meta.unmapped_rules 观测字段',
    fields: [
      { label: '关键差异', value: '段号与文案稿对齐 · 仅句式/词汇/结构被改' },
      { label: '观测', value: 'unmapped_rules 累计 ≥ 3 触发人工补 mapping（T6）' },
    ],
  },

  'antiai-check': {
    kind: 'decision',
    title: '反 AI 化机审',
    tagline: '规则 + 第三方 API 得分 · 不达标自动回润色',
    fields: [
      {
        label: '判定',
        value: [
          '读 AntiAIKB.痕迹特征库（R\\d{3}）',
          'LLM 语义自评（非字面子串匹配）',
          '可选第三方 AIGC 检测 API',
        ],
      },
      {
        label: '写入',
        value: 'Session.antiAIFeedback[] · 结构 {round, total_score, problem_sentences:[{segment_id, original_text, matched_rule}]}',
      },
      {
        label: '分流',
        value: ['达标 → 封面 Agent', '不达标 ≤ 3 次 → 回润色 Agent', '超限 → ReworkOut'],
      },
    ],
  },

  cover: {
    kind: 'agent',
    title: '封面生图 Agent',
    tagline: '视觉终端产物 · 依赖文案标题',
    input: [
      '文案标题（决定封面文字）',
      '选题卡（关键词 / 目标人群）',
      '账号 ID（关联 StyleKB.视觉档案）',
      'Session 上下文',
    ],
    output: ['主封面 1 张 + 备选 2-3 张'],
    tools: [
      '读：StyleKB[account_id].视觉档案（配色 HEX array / 版式 / 字体倾向）',
      '读：VersionRepo（版本对比）+ Session',
      '写：VersionRepo（封面图）+ Session',
      '调用：生图 API（H5 实跑前选型）',
    ],
    boundary: [
      '✗ 不改文案 → 标题改动由文案 Agent 承接（封面 Agent 仅 meta.title_adjustment_needed 报警）',
      '✗ 不做反 AI 化 → § 2.3 承接',
      '✗ 不做版权/敏感词 → § 3.2 封面机审承接',
      '✗ 硬红线：真人肖像 / 受版权 IP / Logo · 违反直接 E005 终止',
      '✗ 不做最终选定 → HumanCover 运营承接',
    ],
    gate: [
      '字符清晰（小红书首屏规格）',
      '视觉风格对齐 StyleKB.视觉档案（含 Integrity Check）',
      '通过封面机审（版权 + 敏感词）',
    ],
    fallback: [
      '机审风险 → 上抛 HumanCover',
      '生图 API 失败 → 重试 ≤ 2 次',
      'StyleKB.视觉档案 IO 失败 → E003 / 格式非法 → E007（决策 19 首例）',
      '主图不达标 → 备选补位',
    ],
  },

  'cover-img': {
    kind: 'product',
    title: '封面图',
    tagline: '主图 + 备选 2-3',
    fields: [
      { label: '落盘', value: 'VersionRepo · 含版本对比元数据' },
    ],
  },

  'cover-check': {
    kind: 'decision',
    title: '封面机审',
    tagline: '版权 + 政策敏感词 API · 风险才上抛人工',
    fields: [
      { label: '读', value: 'PolicyKB（敏感词 P\\d{3} + 版权黑名单）+ 版权/敏感词 API' },
      { label: '写', value: 'Session.coverAuditFeedback' },
      { label: '分流', value: ['通过 → Package', '风险 → HumanCover（运营）'] },
    ],
  },

  'human-cover': {
    kind: 'human',
    title: '人工卡点 · 封面审',
    tagline: '机审标风险时才触发',
    fields: [
      { label: '出口', value: ['通过 → Package', '驳回 → ReworkOut'] },
    ],
  },

  package: {
    kind: 'terminal',
    title: '打包',
    tagline: '合成发布就绪包 · 移交图 ① Compliance',
    fields: [
      { label: '载荷', value: '文案（已打标 + 反 AI 化）+ 封面主图 + 备选 + session 摘要' },
      { label: '下游', value: '图 ① Compliance → HumanReview → Output' },
    ],
  },

  exit: {
    kind: 'io',
    title: 'Pipeline 出口',
    tagline: '回到图 ① 主轴 · 交给机审 + 人工终审',
    fields: [
      { label: '归档', value: '本 Session 全部中间产物写入 VersionRepo' },
      { label: '沉淀', value: '驳回分布 → LongMem（Session 级即时）' },
    ],
  },

  'rework-out': {
    kind: 'error',
    title: '驳回出口 · ReworkOut',
    tagline: '指向 § 驳回规则表（不画流程 · 文字 + 决策表）',
    fields: [
      {
        label: 'PM 驳回面板',
        value: [
          '要重做的 Agent（多选）',
          '段级别选择（仅文案）',
          '问题原因（自由文本 + AI 归因）',
          '操作：重做 / 手动改 / 接受现状 / 升级主管',
          '级联建议（按依赖图）',
        ],
      },
      {
        label: '8 个驳回问题',
        value: [
          '1 多重问题 → 多选',
          '2 部分驳回 → 段级',
          '3 说不清 → AI 归因',
          '4 跨 Agent 依赖 → 级联',
          '5 重做连锁 → 同上',
          '6 PM 不走 Agent → 手动改',
          '7 版本管理 → VersionRepo + diff',
          '8 重做耗尽 → 接受/升级主管',
        ],
      },
    ],
  },

  'top-entry': {
    kind: 'io',
    title: 'PM 入口',
    tagline: '图 ① 起点 · 触发方式三选',
    fields: [
      {
        label: '触发方式',
        value: [
          '人工 · PM 在工作台点"新建一单"',
          '定时 · Cron 按号排期（H5 可配）',
          '外部 API · 运营系统推账号 ID + 毛选题',
        ],
      },
      { label: '载荷', value: 'account_id ∈ {1,2,3} · topic_brief?（可选毛选题）· trace_id' },
      { label: '下游', value: 'Router' },
    ],
  },

  'top-router': {
    kind: 'decision',
    title: 'Router · 账号路由',
    tagline: '按 account_id 分三路 · 不调 LLM · 纯逻辑',
    fields: [
      { label: '判据', value: 'account_id 精确匹配 {1,2,3}' },
      {
        label: '分流',
        value: [
          'id=1 → Load 号 1（INFP 日常）',
          'id=2 → Load 号 2（极简发饰）',
          'id=3 → Load 号 3（方法论）',
        ],
      },
      {
        label: '兜底',
        value: 'id ∉ {1,2,3} → E001（未知账号 · 直接终止）',
      },
    ],
  },

  'top-load-1': {
    kind: 'action',
    title: 'Load 号 1 · INFP 日常',
    tagline: '加载 1 号私有 KB + 长期记忆 · 初始化 Session',
    fields: [
      {
        label: '读',
        value: [
          'StyleKB[1]（人设 / 爆款 / 视觉档案）',
          'LongMem[1].方向胜率 + 爆款归因 + 策略有效性',
        ],
      },
      { label: '写', value: 'Session 初始化（account_ctx · 不含业务产出）' },
      { label: '下游', value: '移交图 ② Pipeline' },
      { label: '兜底', value: 'KB IO 失败 → E003 · 格式非法 → E007' },
    ],
  },

  'top-load-2': {
    kind: 'action',
    title: 'Load 号 2 · 极简发饰',
    tagline: '加载 2 号私有 KB + 长期记忆',
    fields: [
      { label: '读', value: ['StyleKB[2]', 'LongMem[2]'] },
      { label: '写', value: 'Session 初始化' },
      { label: '下游', value: '移交图 ② Pipeline' },
    ],
  },

  'top-load-3': {
    kind: 'action',
    title: 'Load 号 3 · 方法论',
    tagline: '加载 3 号私有 KB + 长期记忆',
    fields: [
      { label: '读', value: ['StyleKB[3]', 'LongMem[3]'] },
      { label: '写', value: 'Session 初始化' },
      { label: '下游', value: '移交图 ② Pipeline' },
    ],
  },

  'top-pipe-entry': {
    kind: 'io',
    title: '→ 图 ② Pipeline 入口',
    tagline: '移交到 Agent 编排层',
    fields: [
      {
        label: '移交载荷',
        value: [
          'account_ctx（由 Load 写入 Session）',
          'topic_brief?（包装模式才有）',
          'trace_id（跨图透传）',
        ],
      },
      { label: '下游', value: '图 ② PM 选题方式判定' },
    ],
  },

  'top-pipe-black': {
    kind: 'product',
    title: '图 ② Agent 编排黑盒',
    tagline: '21 节点 · 4 核心 Agent · 切"图 ②"标签看详细',
    fields: [
      {
        label: '内部大纲',
        value: [
          '选题 Agent（生成 / 包装 双模式）',
          '人工 N 选 1（生成模式）· PM 确认（包装模式）',
          '文案生成 Agent',
          '自动打标动作',
          '反 AI 化润色 Agent（≤ 3 轮）',
          '封面生图 Agent + 封面机审',
          '打包',
        ],
      },
      {
        label: '为何画成黑盒',
        value: '顶层关心"谁路由 / 谁终审 / 谁发布"；节点细节在图 ②',
      },
    ],
  },

  'top-pipe-exit': {
    kind: 'io',
    title: '← 图 ② Pipeline 出口',
    tagline: '收到发布就绪包 · 进入终审',
    fields: [
      {
        label: '回传载荷',
        value: [
          '标题 + 分段正文 + 标签（含 #AI 辅助生成）',
          '封面主图 + 备选 2-3',
          'session 摘要（耗时 / 轮数 / unmapped_rules）',
        ],
      },
      { label: '下游', value: 'Compliance' },
    ],
  },

  'top-compliance': {
    kind: 'decision',
    title: 'Compliance · 合规终审',
    tagline: '机审 · 广告 / 政策 / 版权 / 敏感词四检',
    fields: [
      {
        label: '读',
        value: [
          'PolicyKB（敏感词 P\\d{3} + 广告法黑名单 + 版权黑名单）',
          '版权 / 敏感词 第三方 API（H5 前选型）',
        ],
      },
      { label: '写', value: 'Session.complianceFeedback · {blocked:[], warn:[]}' },
      {
        label: '分流',
        value: [
          '通过 → HumanReview',
          '硬红线（真人肖像 / 政策禁区 / 版权）→ ReworkOut',
        ],
      },
      {
        label: '为何前置机审',
        value: '机审 0.x 秒 · 人工 30 秒 · 先机审砍掉 80% 明显违规',
      },
    ],
  },

  'top-human-review': {
    kind: 'human',
    title: 'HumanReview · 人工终审',
    tagline: '每单必过 · 30 秒通读 + 对比封面',
    fields: [
      {
        label: '职责',
        value: [
          '通读文案是否自然（非机械）',
          '封面 × 标题是否一致',
          '确认 #AI 辅助生成 标签已加',
        ],
      },
      {
        label: '出口',
        value: ['放行 → Output', '驳回 → ReworkOut（级联重做建议）'],
      },
      {
        label: '为何不能合并机审',
        value: '机审查"红线"· 人看"调性"· 两种能力不可替代',
      },
    ],
  },

  'top-rework': {
    kind: 'error',
    title: '驳回出口 · ReworkOut（图 ①）',
    tagline: '与图 ② 共用一张驳回规则表',
    fields: [
      {
        label: '两路入口',
        value: [
          'Compliance 硬红线（机审拦截）',
          'HumanReview 驳回（人工不满意）',
        ],
      },
      {
        label: '级联建议',
        value: '按"问题定位 → 依赖图 Agent"自动勾选要重做的节点',
      },
      {
        label: '8 个驳回问题',
        value: '详见图 ② 的 ReworkOut 卡（共用规则表）',
      },
    ],
  },

  'top-output': {
    kind: 'terminal',
    title: 'Output · 发布就绪',
    tagline: '含 #AI 辅助生成 · 移交小红书平台',
    fields: [
      {
        label: '产物',
        value: [
          '可复制发布文案（标题 + 正文 + 标签）',
          '封面主图（+ 备选可切）',
          'session 摘要归档',
        ],
      },
      {
        label: '落盘',
        value: 'VersionRepo 永久版本 · LongMem 按 Session 级即时沉淀',
      },
      { label: '链路尾', value: '本号本单结束 · Router 可接下一单' },
    ],
  },

  'data-stylekb': {
    kind: 'product',
    title: 'StyleKB · 人设库（号隔离）',
    tagline: '每账号 1 份 · Router 按 account_id 路由 · 绝不混号',
    fields: [
      {
        label: '结构',
        value: [
          '人设（身份 / 口吻 / 禁区）',
          '爆款文案样本（标题 / 正文模板 / 胜率）',
          '语言风格（句式长短 / 标点偏好 / 表情使用）',
          '目标人群（年龄 / 场景 / 痛点）',
          '视觉档案（配色 HEX[] / 版式 / 字体倾向）',
        ],
      },
      {
        label: '谁读',
        value: [
          '选题 Agent · 人设 / 目标人群',
          '文案 Agent · 人设 / 爆款 / 语言风格',
          '封面 Agent · 视觉档案',
        ],
      },
      {
        label: '谁写',
        value: '仅 PM 维护（线下编辑 · 不由 Agent 回写）',
      },
      {
        label: '健壮性',
        value: 'Integrity Check · IO 失败 → E003 · 格式非法 → E007',
      },
    ],
  },

  'data-longmem': {
    kind: 'product',
    title: 'LongMem · 长期记忆（号隔离）',
    tagline: '跨 Session 累积 · 8 枚举策略 · L\\d{3} 编号',
    fields: [
      {
        label: '结构',
        value: [
          '方向胜率（近 30 天维度）',
          '爆款归因（哪些角度 / 结构转化高）',
          '策略有效性（8 枚举 · 反 AI 化手法）',
          '失败阈值（连 3 次失败 → 上浮）',
        ],
      },
      {
        label: '谁读',
        value: [
          '选题 Agent · 方向胜率 + 爆款归因',
          '反 AI Agent · 策略有效性 + 失败阈值',
        ],
      },
      {
        label: '谁写',
        value: 'Output 后台任务按 Session 级即时沉淀（胜率、unmapped_rules 累积）',
      },
      {
        label: '降级',
        value: 'IO 失败 → meta.longmem_degraded=true 不降级主链路',
      },
    ],
  },

  'data-antiaikb': {
    kind: 'product',
    title: 'AntiAIKB · 反 AI 化痕迹库（共享）',
    tagline: '全局共享 · 反 AI 化 Agent 唯一专用 · R\\d{3} 规则表',
    fields: [
      {
        label: '结构',
        value: [
          '痕迹特征库（R003/R017/R042 · LLM 语义自评）',
          '改写规则表（mappings · 每条规则对应改写策略）',
          'unmapped_rules 观测槽（累计 ≥ 3 触发 T6 人工补）',
        ],
      },
      {
        label: '谁读',
        value: '反 AI 化 Agent（唯一）',
      },
      {
        label: '谁写',
        value: '人工 · T6 任务按 unmapped_rules 补 mapping',
      },
      {
        label: '为何共享',
        value: '痕迹是模型层面特征 · 不随账号人设变 · 3 号复用',
      },
    ],
  },

  'data-policykb': {
    kind: 'product',
    title: 'PolicyKB · 合规规则库（共享）',
    tagline: '全局共享 · 敏感词 / 广告法 / 版权黑名单 · P\\d{3}',
    fields: [
      {
        label: '结构',
        value: [
          '敏感词 P\\d{3}（政策 / 擦边 / 歧义）',
          '广告法黑名单（最 / 唯一 / 根治 等）',
          '版权黑名单（知名 IP / 真人肖像库）',
          'AI 标签规则（#AI 辅助生成 触发条件）',
        ],
      },
      {
        label: '谁读',
        value: [
          '自动打标动作 · AI 标签规则',
          'Compliance 合规终审 · 敏感词 + 广告法 + 版权',
          '封面机审 · 敏感词 + 版权',
        ],
      },
      {
        label: '谁写',
        value: '合规 / 法务团队人工维护',
      },
    ],
  },

  'data-repo': {
    kind: 'product',
    title: 'VersionRepo · 版本仓（按 Session 隔离）',
    tagline: '每次改写都留版本 · 支持 diff · 驳回时按段重做',
    fields: [
      {
        label: '结构',
        value: [
          '选题版本 v1…vN（Topic Agent 产出）',
          '文案版本 v1…vN（Copy + AntiAI 每轮）',
          '封面版本 v1…vN（主图 + 备选）',
          '版本对比 diff（meta）',
        ],
      },
      {
        label: '谁读',
        value: '反 AI Agent · 版本对比 / 封面 Agent · 版本对比',
      },
      {
        label: '谁写',
        value: '选题 / 文案 / 反 AI / 封面 4 个 Agent 都写',
      },
      {
        label: '为何 Session 隔离',
        value: '版本只对当次请求有意义 · Output 后只留最终版进 LongMem',
      },
    ],
  },

  'data-session': {
    kind: 'product',
    title: 'Session · 跨 Agent 上下文总线',
    tagline: '单次请求内活动 · 所有 Agent 的"公用黑板"',
    fields: [
      {
        label: '结构',
        value: [
          'account_ctx（Load 时写入）',
          'overrides[]（软偏好覆盖 · H5 外暴）',
          'antiAIFeedback[]（机审轮次 + 问题句子列表）',
          'coverAuditFeedback（封面机审结果）',
          'complianceFeedback（终审结果）',
        ],
      },
      {
        label: '读写权',
        value: '所有 Agent 可读 · 同一字段只由产出 Agent 写（避免竞态）',
      },
      {
        label: '关键字段',
        value: 'antiAIFeedback 是反 AI Agent 多轮自学的核心（读上次拒绝理由）',
      },
      {
        label: '生命周期',
        value: '从 Load 初始化 · 到 Output 归档后释放',
      },
    ],
  },
}
