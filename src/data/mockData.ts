import { Case, Task, ArbitratorProfile } from '../types';

export const mockArbitrator: ArbitratorProfile = {
  name: "张明",
  avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256", // professional avatar mockup
  idNo: "ARB-2018-0925",
  specialties: ["股权投资", "知识产权", "国际贸易"],
  resolvedCount: 142,
  activeCount: 6,
  avgResolveDays: 85,
  ranking: "第六届仲裁员"
};

export const mockCases: Case[] = [
  {
    id: "1",
    caseNo: "(2026)穗仲案字第1024号",
    title: "关于华夏科技公司与蓝海创投股权转让协议纠纷案",
    claimant: "华夏科技股份有限公司",
    claimantAgent: "广州众信律师事务所 - 李大双律师",
    respondent: "蓝海创业投资合伙企业（有限合伙）",
    respondentAgent: "君合律师事务所 - 王利律师",
    disputeAmount: 18500000,
    status: "审理中",
    category: "股权投资纠纷",
    role: "首席",
    startDate: "2026-01-15",
    formationDate: "2026-02-10",
    secretary: "李文浩",
    rules: "《广州仲裁委员会仲裁规则（2022年版）》",
    commission: "广州仲裁委员会",
    description: "申请人华夏科技与被申请人蓝海创于2024年4月签署《股权投资及转让协议》，约定被申请人投资1500万元认购申请人10%股权。后因被申请人未足额支付投资款，且私自对外转让股权，申请人遂提请仲裁，要求被申请人支付违约金并解除投资合同关系。",
    timeline: [
      { title: "仲裁申请受理", time: "2026-01-15 10:00", status: "completed", operator: "办事处秘书", remark: "符合受理条件，已立案" },
      { title: "送达仲裁通知及答辩通知", time: "2026-01-20 14:30", status: "completed", operator: "系统自动送达", remark: "双方均已签收" },
      { title: "选定仲裁员/组建仲裁庭", time: "2026-02-10 11:00", status: "completed", operator: "仲裁委员会", remark: "成立三名仲裁员组成的仲裁庭，张明任首席仲裁员" },
      { title: "举行庭审", time: "2026-03-05 09:30", status: "completed", operator: "仲裁庭", remark: "第一审理室在穗举行线上+线下合并庭审，完成法庭调查与质证" },
      { title: "提交补充代理意见", time: "2026-04-10 17:00", status: "completed", operator: "双方代理律师", remark: "双方就第二轮补充意见提交完毕，已送达对方" },
      { title: "仲裁庭起草裁决", time: "2026-06-01 10:00", status: "processing", operator: "张明", remark: "首席仲裁员起草中，合议定于本月中旬完成" },
      { title: "送达裁决书及结案", time: "2026-06-25 (预计)", status: "pending", remark: "待签发裁决后送达" }
    ],
    evidence: [
      { id: "e1_1", name: "股权转让协议（双签带公章版本）.pdf", submitter: "申请人-华夏科技", time: "2026-01-15 10:05", size: "4.2 MB", ext: "pdf" },
      { id: "e1_2", name: "银行转账回单及催款通知函.pdf", submitter: "申请人-华夏科技", time: "2026-01-15 10:10", size: "1.8 MB", ext: "pdf" },
      { id: "e1_3", name: "项目尽职调查报告及其反驳意见书.docx", submitter: "被申请人-蓝海创投", time: "2026-02-22 16:45", size: "6.5 MB", ext: "docx" }
    ],
    hearings: [
      { id: "h1_1", hearingTime: "2026-03-05 09:30 至 12:00", location: "广州仲裁委员会第一数字法庭", status: "已结束", notes: "开庭顺利，对双方主要事实争议进行了深度辩论。" },
      { id: "h1_2", hearingTime: "2026-06-11 09:30 至 11:30", location: "广州仲裁委员会第一数字法庭", status: "待开庭", notes: "开庭" }
    ]
  },
  {
    id: "2",
    caseNo: "(2026)穗仲案字第0882号",
    title: "关于吉隆航运与金桥钢铁钢材进口国际买卖合同纠纷案",
    claimant: "吉隆航运有限公司（新加坡）",
    claimantAgent: "大成律师事务所 - 陈凯律师",
    respondent: "沧州金桥钢铁商贸有限公司",
    respondentAgent: "中伦律师事务所 - 赵雪律师",
    disputeAmount: 4200000,
    status: "待签名",
    category: "国际贸易纠纷",
    role: "独任",
    startDate: "2026-02-05",
    formationDate: "2026-02-28",
    secretary: "李文浩",
    rules: "《广州仲裁委员会仲裁规则（2022年版）》",
    commission: "广州仲裁委员会",
    description: "申请人新加坡吉隆航运要求被申请人金桥钢铁支付滞期费以及货款尾款。被申请人抗辩称船只未按约定时间到达锚地，属违约滞港。独任仲裁判案，双方经两次网络开庭已查清基本事实，裁决书初稿已起草，现需要独任仲裁员完成电子签章。",
    timeline: [
      { title: "立案受理", time: "2026-02-05 09:00", status: "completed" },
      { title: "送达送审", time: "2026-02-12 11:30", status: "completed" },
      { title: "选定独任仲裁员(张明)", time: "2026-02-28 15:00", status: "completed" },
      { title: "开庭审理与补充质证", time: "2026-03-20 14:00", status: "completed" },
      { title: "裁决书核阅完毕", time: "2026-06-03 09:00", status: "completed", remark: "秘书核阅无异议，提交仲裁员签署" },
      { title: "仲裁员签发裁决", time: "2026-06-10 12:00", status: "processing", operator: "张明", remark: "等待仲裁员在系统端电子签名" }
    ],
    evidence: [
      { id: "e2_1", name: "提单及租船确认书复印件.pdf", submitter: "申请人-吉隆航运", time: "2026-02-05 09:30", size: "3.1 MB", ext: "pdf" },
      { id: "e2_2", name: "靠泊时间核算单(Time Sheet).xlsx", submitter: "申请人-吉隆航运", time: "2026-02-05 09:32", size: "542 KB", ext: "xlsx" },
      { id: "e2_3", name: "遭遇极寒大雾天气港口封航通知.pdf", submitter: "被申请人-金桥钢铁", time: "2026-03-10 10:20", size: "1.2 MB", ext: "pdf" }
    ],
    hearings: [
      { id: "h2_1", hearingTime: "2026-03-20 14:00 至 16:30", location: "广州仲裁委线上开庭系统B室", status: "已结束", notes: "本次为线上开庭。双方就恶劣天气免责等进行了质辩。" },
      { id: "h2_2", hearingTime: "2026-06-13 16:30 至 18:00", location: "广州仲裁委线上开庭系统B室", status: "待开庭", notes: "调解" }
    ]
  },
  {
    id: "3",
    caseNo: "(2026)穗仲案字第0521号",
    title: "关于宏图建筑与润物高科智能产业园二期主体建设工程纠纷案",
    claimant: "宏图中建工程局有限公司",
    claimantAgent: "德恒律师事务所 - 张锋律师",
    respondent: "润物高新科技产业园有限公司",
    respondentAgent: "天同律师事务所 - 周晓杰律师",
    disputeAmount: 64100000,
    status: "待开庭",
    category: "建设工程纠纷",
    role: "首席",
    startDate: "2026-03-10",
    formationDate: "2026-04-20",
    secretary: "李文浩",
    rules: "《广州仲裁委员会仲裁规则（2022年版）》",
    commission: "广州仲裁委员会",
    description: "本案涉及某高科产业园工程造价计算模式、工程进度延误责任索赔等复杂纠纷。纠纷标的额巨大，技术材料众多。双方对开庭时间有争议，秘书已经草拟了3个推荐开庭时段，需要首席仲裁员协调另外两名仲裁员后，最终勾选并确认排庭期。",
    timeline: [
      { title: "申请仲裁", time: "2026-03-10 14:20", status: "completed" },
      { title: "合议庭成立(张民/赵东/王琦)", time: "2026-04-20 10:00", status: "completed" },
      { title: "证据交换与释明", time: "2026-05-15 17:00", status: "completed", operator: "秘书", remark: "双方已完成第一轮证据材料的交互及确认" },
      { title: "排定开庭日程", time: "2026-06-10 09:00", status: "processing", operator: "张明", remark: "待首席仲裁员确认最终的排庭日期" }
    ],
    evidence: [
      { id: "e3_1", name: "施工蓝图及变更签证单汇编.pdf", submitter: "申请人-宏图中建", time: "2026-03-10 15:00", size: "24.5 MB", ext: "pdf" },
      { id: "e3_2", name: "第三方工程进度及质量司法鉴定报告.pdf", submitter: "仲裁庭指定鉴定机构", time: "2026-05-08 14:15", size: "12.8 MB", ext: "pdf" }
    ],
    hearings: [
      { id: "h3_1", hearingTime: "2026-06-12 14:00 至 16:30", location: "广州仲裁委员会第三数字开庭室", status: "待开庭", notes: "开庭" }
    ]
  },
  {
    id: "4",
    caseNo: "(2025)穗仲案字第1921号",
    title: "关于多维科技与其前研发总监王教授软件研发专利纠纷案",
    claimant: "多维科技（广州）有限公司",
    claimantAgent: "环球律师事务所 - 江涛律师",
    respondent: "王某某 (自然人，前研发总监)",
    respondentAgent: "家理律师事务所 - 罗大伟律师",
    disputeAmount: 2500000,
    status: "已结案",
    category: "知识产权纠纷",
    role: "独任",
    startDate: "2025-10-18",
    formationDate: "2025-11-05",
    secretary: "刘秘书",
    closeDate: "2026-03-22",
    rules: "《广州仲裁委员会仲裁规则（2022年版）》",
    commission: "广州仲裁委员会",
    description: "涉及某计算机视觉软件核心库的专利权属与技术秘密、核心秘密侵权争议。申请人诉请王某某退还秘密并赔偿。经深入开庭，张明在查明案件属在职职务发明事实后，做出驳回申请人诉请、王某某合法拥有一切权属的裁决。已结案并全额履行。",
    timeline: [
      { title: "立案", time: "2025-10-18 10:00", status: "completed" },
      { title: "独任组庭", time: "2025-11-05 16:30", status: "completed" },
      { title: "两次技术鉴定质证会", time: "2025-12-15 14:00", status: "completed" },
      { title: "做出终结裁决并送达", time: "2026-03-20 10:00", status: "completed" },
      { title: "全额履行并履行归档", time: "2026-03-22 15:00", status: "completed", remark: "双方签字确认全额结案无异议" }
    ],
    evidence: [
      { id: "e4_1", name: "王某某在职劳动合同及知识产权保密协议.pdf", submitter: "申请人-多维科技", time: "2025-10-18 11:00", size: "3.2 MB", ext: "pdf" },
      { id: "e4_2", name: "申请专利技术与离职研发成果对比论证.pdf", submitter: "被申请人-王教授", time: "2025-11-20 15:10", size: "5.4 MB", ext: "pdf" }
    ],
    hearings: [
      { id: "h4_1", hearingTime: "2025-12-15 09:30", location: "广州仲裁委员会第六会议室", status: "已结束", notes: "技术细节展示充分，焦点定于发明是职务发明还是王某某之前已有的自研原型上。" }
    ]
  },
  {
    id: "5",
    caseNo: "(2026)穗仲案字第0308号",
    title: "关于众盛信托与乾坤置业金融借款及保证合同违约纠纷案",
    claimant: "众盛信托股份有限公司",
    claimantAgent: "君泽君律师事务所 - 许华律师",
    respondent: "乾坤置业控股有限公司",
    respondentAgent: "金杜律师事务所 - 张敏律师",
    disputeAmount: 125000000,
    status: "审理中",
    category: "金融借款合同",
    role: "边裁",
    startDate: "2026-02-18",
    formationDate: "2026-03-12",
    secretary: "李文浩",
    rules: "《广州仲裁委员会仲裁规则（2022年版）》",
    commission: "广州仲裁委员会",
    description: "本案件系乾坤置业1.25亿借本付息纠纷案件。标的额较大，张明先生作为边仲席位参与并参与仲裁合议。目前本案处于第二次证据反驳交换中。",
    timeline: [
      { title: "信托违约立案", time: "2026-02-18 09:12", status: "completed" },
      { title: "三名仲裁员入选", time: "2026-03-12 15:45", status: "completed" },
      { title: "资产保全与查封", time: "2026-04-05 10:00", status: "completed", operator: "法院协助执行", remark: "已冻结被申请人银行存款或查封同等价值土地" },
      { title: "质证及开庭期确定中", time: "2026-06-01 09:00", status: "processing", operator: "仲裁一处", remark: "双方由于在疫情 and 外地取证理由，暂未确定统一开庭日期" }
    ],
    evidence: [
      { id: "e5_1", name: "授信合同及担保抵押质押文件汇编.pdf", submitter: "申请人-众盛信托", time: "2026-02-18 10:00", size: "32.4 MB", ext: "pdf" }
    ],
    hearings: [
      { id: "h5_1", hearingTime: "2026-06-12 15:30 至 17:30", location: "广州仲裁委员会第四数字法庭", status: "待开庭", notes: "鉴定" }
    ]
  }
];

export const mockTasks: Task[] = [
  {
    id: "t_1",
    caseId: "2",
    caseNo: "(2026)穗仲案字第0882号",
    caseTitle: "关于吉隆航运与金桥钢铁钢材进口买卖合同纠纷案",
    type: "sign",
    title: "裁决书电子签署",
    description: "由您（独任仲裁员）起草及委员会秘书核阅通过的《吉隆航运与金桥钢铁裁决书》已准备就绪，请在2026-06-15 18:00之前完成签发。",
    deadline: "2026-06-15",
    status: "pending",
    severity: "urgent",
    details: {
      awardText: `广州仲裁委员会裁决书\n\n(2026)穗仲案字第0882号\n\n申请人：吉隆航运有限公司（注册于新加坡）\n被申请人：沧州金桥钢铁商贸有限公司\n\n本会根据申请人于2026年2月5日提出的仲裁申请，以及双方在买卖合同中订立的仲裁条款，依法组成了由张明独任仲裁员在案的独任仲裁庭进行审理。本案争议在于被申请人购买由申请人运输之原煤进厂因恶劣大雾，导致未能按约锚位卸港，产生滞港费争议。本案于2026年3月20日举行开庭审理，双方均由授权代表出席。\n\n【仲裁庭意见】\n本庭经审理查明，货物未能及时靠泊卸货确系由不可抗力之港务局调度限航及雷暴浓雾所导致，该部分期间不应记入被申请人的可卸货时间(Laytime)计算。然而，在免责阻碍原因消失后十小时，被申请人未立即组织转栈，存在不合理的拖延。依据《海商法》第98条及买卖合同第12条约定，被申请人仍应对消除限航后的拖延靠港费承担部分责任。\n\n【裁决如下】\n一、被申请人沧州金桥钢铁商贸有限公司应于本判决书生效十日内，向申请人吉隆航运有限公司支付滞期延宕费共计136,150美元（折合人民币985,000元）。\n二、驳回申请人关于巨额利息及全额连带保全诉讼代理费的其他仲裁请求。\n三、本期仲裁审理费50,000元由申请人负担20,000元，被申请人负担30,000元。\n\n本裁决为终局裁决。自做出之日起生效。\n\n独任仲裁员：张明（尚未签署）\n2026年6月10日`
    }
  },
  {
    id: "t_2",
    caseId: "3",
    caseNo: "(2026)穗仲案字第0521号",
    caseTitle: "关于宏图建筑与润物高科园区主体建设纠纷案",
    type: "schedule",
    title: "声明承诺书签署",
    description: "被申请人与申请人就开庭意愿冲突。请您从推荐的3个开庭时段中做出勾选推荐（须协同另外两位仲裁员的选择）。",
    deadline: "2026-06-12",
    status: "pending",
    severity: "normal",
    details: {
      hearingChoices: [
        "推荐时段一：2026年07月02日（周四） 09:30-12:00 (线上+线下)",
        "推荐时段二：2026年07月08日（周三） 14:00-17:00 (线上)",
        "推荐时段三：2026年07月15日（周三） 09:30-12:00 (线下第一审理室)"
      ]
    }
  },
  {
    id: "t_3",
    caseId: "1",
    caseNo: "(2026)穗仲案字第1024号",
    caseTitle: "关于华夏科技公司与蓝海创投股权转让协议纠纷案",
    type: "review",
    title: "审理材料及当事人最新质证代理意见审查",
    description: "申请人于2026-06-08提交了关于第二轮对等证据的反驳辩论书。请首席仲裁员完成实质审查与阅毕确认。",
    deadline: "2026-06-18",
    status: "pending",
    severity: "low",
    details: {
      reviewDocs: [
        { id: "rd_1", name: "申请人对第二轮质证材料的反抗词.pdf", type: "PDF" },
        { id: "rd_2", name: "补充印证：前任法务总监谈话记录清单.docx", type: "Word" }
      ]
    }
  }
];
