import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, ArrowLeft, FileText, AlertCircle, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Download, ShieldCheck, Loader2, X } from 'lucide-react';

// ===================== 类型定义 =====================
type CategoryId = 'notice' | 'guide' | 'case';

interface ArticleItem {
  id: string;
  category: CategoryId;
  title: string;
  publishDate: string;
  source: string;
  pages: number;
  fileSize: string;
  confidential?: boolean;
  excerpt: string; // 摘要
  content: string[]; // 模拟 PDF 正文分页内容
}

interface ArbitrationKnowledgeProps {
  onBack: () => void;
  userName?: string;
}

// ===================== 分类配置 =====================
const CATEGORIES: { id: CategoryId; label: string; icon: string; color: string; bg: string; gradient: string; desc: string }[] = [
  { id: 'notice', label: '仲裁员须知', icon: 'fa-user-shield', color: 'text-[#1E62EC]', bg: 'bg-blue-50', gradient: 'from-blue-600 to-indigo-700', desc: '资格管理、廉政守则、行为规范等仲裁员执业必读资料' },
  { id: 'guide', label: '审理指引', icon: 'fa-gavel', color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'from-amber-500 to-orange-600', desc: '虚假仲裁防范、在线庭审规范、专业纠纷审理要点' },
  { id: 'case', label: '裁决书及案例', icon: 'fa-scale-balanced', color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500 to-teal-600', desc: '典型裁决书全文、案例评析及裁判要旨参考' },
];

// ===================== 模拟文章数据 =====================
const ARTICLES: ArticleItem[] = [
  // ---- 仲裁员须知 ----
  {
    id: 'n-1',
    category: 'notice',
    title: '关于加强规范仲裁员视频庭审行为的通知',
    publishDate: '2026-06-15',
    source: '广州仲裁委员会秘书处',
    pages: 3,
    fileSize: '286 KB',
    excerpt: '为进一步规范仲裁员在线视频庭审行为，保障程序公正与庭审秩序，现就着装仪态、网络环境、保密义务等事项通知如下……',
    content: [
      '广州仲裁委员会文件\n穗仲秘〔2026〕24号\n\n关于加强规范仲裁员视频庭审行为的通知\n\n各仲裁员、各办案秘书：\n为深入贯彻智慧仲裁建设要求，进一步规范在线视频庭审行为，保障仲裁程序公正、高效、有序进行，现就有关事项通知如下：\n\n一、严格庭审着装与仪态\n（一）仲裁员出席视频庭审应着正装，佩戴仲裁徽章，保持仪表端庄、举止文明。\n（二）庭审期间应端坐于独立、安静、光线充足的场所，背景简洁，避免出现与庭审无关的物品或人员。',
      '二、保障网络与设备环境\n（一）仲裁员应提前30分钟接入庭审系统，测试网络、音频、视频及证据展示功能，确保全程稳定在线。\n（二）庭审期间应使用专网或可信网络，严禁使用公共Wi-Fi，杜绝因网络中断影响庭审效力。\n\n三、强化保密义务\n（一）视频庭审全程不得录音、录像、截图或以任何方式传播庭审内容。\n（二）未经许可，不得允许无关人员进入庭审画面或旁听。',
      '四、违纪处理\n违反本通知规定的，依据《广州仲裁委员会仲裁员管理办法》给予警告、暂停指定直至解聘等处理；情节严重的，依法移送有关机关。\n\n广州仲裁委员会\n2026年6月15日',
    ],
  },
  {
    id: 'n-2',
    category: 'notice',
    title: '广州仲裁委员会仲裁员资格管理规定（2025年修订）',
    publishDate: '2025-12-20',
    source: '广州仲裁委员会',
    pages: 5,
    fileSize: '512 KB',
    excerpt: '为规范仲裁员资格准入、考核与退出机制，建设高素质专业化仲裁员队伍，根据《中华人民共和国仲裁法》制定本规定……',
    content: [
      '广州仲裁委员会仲裁员资格管理规定（2025年修订）\n\n第一章 总则\n\n第一条 为规范仲裁员资格准入、考核与退出机制，建设高素质专业化仲裁员队伍，根据《中华人民共和国仲裁法》及有关法律法规，结合本会实际，制定本规定。\n\n第二条 本规定适用于本会仲裁员的选聘、考核、培训、监督及解聘等管理工作。',
      '第二章 资格条件\n\n第三条 担任本会仲裁员，应当符合《仲裁法》第十三条规定的条件，并具备下列专业能力：\n（一）从事审判、检察、法律教学、法学研究工作满八年；\n（二）从事律师、企业法务、商事调解工作满八年；\n（三）具有法律、经贸、金融、建设工程等领域高级职称或同等专业水平。',
      '第三章 考核与培训\n\n第四条 本会对仲裁员实行年度考核与案件质量评查相结合的制度。考核结果作为续聘、晋级、酬金核定的重要依据。\n\n第五条 仲裁员每年应完成不少于16学时的继续教育培训，内容包括仲裁实务、职业道德、廉政纪律等。',
      '第四章 权利与义务\n\n第六条 仲裁员依法独立仲裁案件，享有获得报酬、查阅案卷、申请回避等权利。\n\n第七条 仲裁员应遵守独立、公正、勤勉、保密义务，不得私下接触当事人，不得接受当事人馈赠。',
      '第五章 附则\n\n第八条 本规定自2026年1月1日起施行，由本会秘书处负责解释。\n\n广州仲裁委员会\n2025年12月20日',
    ],
  },
  {
    id: 'n-3',
    category: 'notice',
    title: '仲裁员办案廉政守则与利益冲突回避指引',
    publishDate: '2026-03-08',
    source: '广州仲裁委员会纪律委员会',
    pages: 4,
    fileSize: '348 KB',
    excerpt: '仲裁员应当恪守廉洁底线，主动申报利益冲突，确保仲裁程序中立公正。本指引明确回避情形、申报流程及违纪责任……',
    content: [
      '仲裁员办案廉政守则与利益冲突回避指引\n\n一、廉政守则\n仲裁员在办案全过程中应当做到：\n1. 不得以任何理由收受当事人及其代理人、利害关系人的财物、宴请或旅游、娱乐安排；\n2. 不得利用仲裁员身份谋取不正当利益；\n3. 不得在案件审理期间买卖当事人或代理人的股票、债券。',
      '二、利益冲突回避情形\n仲裁员有下列情形之一的，应当主动申请回避：\n（一）是本案当事人或当事人、代理人的近亲属；\n（二）与本案有利害关系；\n（三）担任过本案证人、鉴定人、代理人的；\n（四）私自会见当事人、代理人，或者接受当事人、代理人请客送礼的。',
      '三、申报流程\n仲裁员接受指定后，应在3个工作日内签署《仲裁员利益冲突声明书》。审理过程中发现回避情形的，应立即书面通知首席仲裁员及办案秘书。',
      '四、违纪责任\n违反本指引的，依据《仲裁员管理办法》给予警告、暂停指定、解聘处理；涉嫌违法犯罪的，依法移送司法机关追究责任。\n\n广州仲裁委员会纪律委员会\n2026年3月8日',
    ],
  },
  // ---- 审理指引 ----
  {
    id: 'g-1',
    category: 'guide',
    title: '防范虚假仲裁审理指引',
    publishDate: '2026-05-10',
    source: '广州仲裁委员会审判监督庭',
    pages: 4,
    fileSize: '402 KB',
    excerpt: '针对虚假仲裁识别难、防范难的问题，本指引从证据审查、庭审询问、关联案件检索等维度提供操作规范……',
    content: [
      '防范虚假仲裁审理指引\n\n一、虚假仲裁的常见类型\n1. 当事人恶意串通，通过仲裁确认虚构债权债务，损害案外人利益；\n2. 利用仲裁程序转移财产、规避执行；\n3. 伪造证据、虚构法律关系，骗取裁决。',
      '二、审查要点\n（一）重点审查当事人之间是否存在关联关系、是否存在明显的利益输送；\n（二）对调解协议、和解协议达成异常迅速的案件，应加强实质审查；\n（三）关注证据的真实性、关联性，必要时依职权调查取证。',
      '三、庭审询问技巧\n1. 分别询问当事人关键事实，比对陈述一致性；\n2. 围绕债权形成时间、款项流转、履约细节进行追问；\n3. 对当事人代理律师的授权范围、代理意见进行核实。',
      '四、处置措施\n发现虚假仲裁嫌疑的，应当中止审理、调取关联案件，必要时通知利害关系人参加仲裁。查证属实的，依法驳回请求并追究法律责任。\n\n广州仲裁委员会审判监督庭\n2026年5月10日',
    ],
  },
  {
    id: 'g-2',
    category: 'guide',
    title: '建设工程施工合同纠纷仲裁审理要点',
    publishDate: '2026-04-22',
    source: '广州仲裁委员会专业仲裁庭',
    pages: 6,
    fileSize: '628 KB',
    excerpt: '建设工程纠纷专业性强、争议焦点多。本指引梳理合同效力、工程价款、工期、质量、鉴定等核心审理要点……',
    content: [
      '建设工程施工合同纠纷仲裁审理要点\n\n一、合同效力审查\n1. 审查施工企业资质、招投标程序、规划许可等影响合同效力的因素；\n2. 区分合同无效、可撤销与效力待定，正确认定工程价款结算依据。',
      '二、工程价款争议\n（一）合同有约定的，按约定结算；约定不明的，参照示范文本；\n（二）工程变更、索赔、签证的认定标准与举证责任分配；\n（三）黑白合同、让利承诺、垫资施工的处理规则。',
      '三、工期争议\n1. 开工日期、竣工日期的认定；\n2. 顺延工期的签证与索赔；\n3. 工期延误损失的举证与计算。',
      '四、工程质量争议\n（一）质量缺陷的责任划分与保修义务；\n（二）质量鉴定的启动条件与鉴定意见采信；\n（三）质量不合格工程的价款扣减与修复费用。',
      '五、工程造价鉴定\n1. 鉴定申请的审查与鉴定范围的确定；\n2. 鉴定材料的质证与补充鉴定；\n3. 鉴定意见的异议处理与采信规则。',
      '六、其他注意事项\n涉及实际施工人、分包、转包、挂靠等情形的，应追加相关当事人，查明法律关系，依法裁判。\n\n广州仲裁委员会专业仲裁庭\n2026年4月22日',
    ],
  },
  {
    id: 'g-3',
    category: 'guide',
    title: '在线庭审程序规范与证据电子化指引',
    publishDate: '2026-06-01',
    source: '广州仲裁委员会信息化办公室',
    pages: 3,
    fileSize: '276 KB',
    excerpt: '规范在线庭审的程序流程、证据提交、质证方式及电子签名，确保在线仲裁程序效力与线下等同……',
    content: [
      '在线庭审程序规范与证据电子化指引\n\n一、在线庭审适用范围\n本会受理的民商事仲裁案件，经当事人同意，均可采用在线方式开庭。涉及国家秘密、个人隐私或案情特别复杂的，可线下开庭。',
      '二、庭审前准备\n1. 当事人应提前3个工作日通过办案系统提交电子化证据；\n2. 仲裁庭应当组织庭前证据交换，固定无争议事实；\n3. 测试庭审系统，确认网络、音视频、证据展示功能正常。',
      '三、庭审程序与证据质证\n（一）在线庭审程序与线下一致，包括身份核实、权利义务告知、调查、辩论、最后陈述；\n（二）电子证据通过系统共享屏幕展示，质证意见实时记录；\n（三）庭审笔录采用电子签名，经当事人确认后生效。\n\n广州仲裁委员会信息化办公室\n2026年6月1日',
    ],
  },
  // ---- 裁决书及案例 ----
  {
    id: 'c-1',
    category: 'case',
    title: '（2026）穗仲案字第0325号 买卖合同争议裁决书',
    publishDate: '2026-06-18',
    source: '首席仲裁员 张明',
    pages: 8,
    fileSize: '892 KB',
    confidential: true,
    excerpt: '申请人主张被申请人逾期交货并要求支付违约金。本庭结合合同约定、履约记录认定违约事实，部分支持申请人请求……',
    content: [
      '广州仲裁委员会\n裁 决 书\n\n（2026）穗仲案字第0325号\n\n申请人：广州智慧零售科技有限公司\n被申请人：深圳前海股权投资基金合伙企业\n\n申请人广州智慧零售科技有限公司与被申请人深圳前海股权投资基金合伙企业因买卖合同纠纷一案，向本会申请仲裁。本会受理后，依法组成仲裁庭，公开开庭进行了审理。',
      '一、申请人的仲裁请求\n1. 裁决被申请人支付逾期交货违约金人民币1,200,000元；\n2. 裁决被申请人承担本案仲裁费用。\n\n事实与理由：申请人与被申请人于2025年8月签订《智能终端设备采购合同》，约定被申请人应于2025年11月30日前交付设备5000台。被申请人实际交付日期为2026年1月15日，逾期46天。',
      '二、被申请人的答辩意见\n被申请人辩称：逾期交货系因全球芯片短缺导致原材料供应不足，属于不可抗力，请求驳回申请人违约金请求。',
      '三、仲裁庭意见\n（一）关于不可抗力抗辩。芯片短缺属于市场风险，不构成《合同法》第一百一十七条规定的不可抗力，被申请人抗辩不成立。\n（二）关于违约金数额。合同约定逾期交货每日违约金为合同总价万分之五，经核算为人民币1,150,000元，予以支持。',
      '四、裁决结果\n1. 被申请人于本裁决送达之日起15日内向申请人支付逾期交货违约金人民币1,150,000元；\n2. 本案仲裁费用人民币38,000元，由被申请人承担。\n\n本裁决为终局裁决，自作出之日起发生法律效力。',
      '首席仲裁员：张明\n仲裁员：李华\n仲裁员：王芳\n\n2026年6月18日\n广州仲裁委员会（印章）',
      '附：本裁决书相关法律依据\n《中华人民共和国民法典》第五百七十七条、第五百八十五条；\n《中华人民共和国仲裁法》第五十一条、第五十七条；\n《广州仲裁委员会仲裁规则》第六十五条。',
      '本案索引关键词：买卖合同、逾期交货、违约金、不可抗力抗辩、商事仲裁。\n\n案例评析：本案核心争议在于市场风险与不可抗力的界限。仲裁庭明确指出，原材料价格波动、市场供需变化属于正常商业风险，不能作为免责事由。违约金的调整应兼顾合同约定与实际损失，体现公平原则。',
    ],
  },
  {
    id: 'c-2',
    category: 'case',
    title: '（2026）穗仲案字第0521号 建设工程价款结算纠纷裁决书',
    publishDate: '2026-06-05',
    source: '首席仲裁员 张明',
    pages: 10,
    fileSize: '1.1 MB',
    confidential: true,
    excerpt: '建设工程竣工验收后，双方就工程增量、设计变更价款产生争议。本庭依据鉴定意见及签证记录，依法裁决……',
    content: [
      '广州仲裁委员会\n裁 决 书\n\n（2026）穗仲案字第0521号\n\n申请人：宏图建筑工程总承包有限公司\n被申请人：润物高科智能产业园发展公司\n\n申请人就与被申请人之间的建设工程施工合同价款结算争议，向本会申请仲裁。',
      '一、仲裁请求\n申请人请求裁决被申请人支付工程欠款人民币8,650,000元及逾期付款利息。\n\n二、争议焦点\n1. 工程增量部分是否构成合同外变更；\n2. 设计变更的签证效力如何认定；\n3. 工程造价鉴定意见的采信。',
      '三、仲裁庭意见\n（一）关于工程增量。经造价鉴定，合同外增量工程价款为人民币5,200,000元，有现场签证及监理工程师签字确认，应予支持。\n（二）关于设计变更。被申请人主张部分变更未经其书面同意。经查，相关变更已通过监理单位审核并实际施工，且被申请人已实际使用工程，视为追认。',
      '四、裁决结果\n1. 被申请人向申请人支付工程款人民币7,980,000元；\n2. 被申请人支付逾期付款利息，以全国银行间同业拆借中心公布的贷款市场报价利率计算；\n3. 仲裁费用由双方按比例分担。\n\n首席仲裁员：张明\n2026年6月5日',
      '附：本案经造价鉴定机构出具鉴定意见书，鉴定造价总额为人民币32,650,000元，已付24,670,000元，欠付7,980,000元。\n\n案例评析：建设工程案件应重视签证、设计变更等关键证据的审查，工程造价鉴定是解决价款争议的有效途径。',
    ],
  },
  {
    id: 'c-3',
    category: 'case',
    title: '股权转让对赌纠纷典型案例评析',
    publishDate: '2026-05-20',
    source: '广州仲裁委员会案例编辑委员会',
    pages: 5,
    fileSize: '456 KB',
    excerpt: '投资方与创始股东签订对赌协议，因目标公司未达业绩承诺引发回购争议。本案厘清对赌效力与履行边界……',
    content: [
      '股权转让对赌纠纷典型案例评析\n\n【案情简介】\n2024年，投资方A与创始股东B签订《股权转让及增资协议》，约定B承诺目标公司2024-2026年净利润不低于5000万元，否则B应按约定公式回购A持有的股权。后目标公司业绩未达标，A申请仲裁请求回购。',
      '【争议焦点】\n1. 对赌协议的效力如何认定；\n2. 业绩承诺未达标时回购义务的触发条件；\n3. 回购价格的计算方式。',
      '【仲裁庭观点】\n（一）对赌协议系当事人真实意思表示，不违反法律强制性规定，合法有效。\n（二）业绩承诺未达标事实清楚，回购条件已成就。\n（三）回购价格应按"投资本金+年化收益-已分配利润"计算，兼顾双方利益平衡。',
      '【案例启示】\n1. 对赌协议应明确业绩指标、回购触发条件、价格计算方式；\n2. 投资方应关注目标公司治理结构，防范经营风险；\n3. 创始股东应审慎评估业绩承诺可行性，避免过度承诺。\n\n广州仲裁委员会案例编辑委员会\n2026年5月20日',
      '相关法条：《民法典》第五百零九条、第五百七十七条；《公司法》关于股东权利义务的规定。\n\n本案收录于《广州仲裁委员会2026年度典型案例汇编》，供仲裁员办案参考。',
    ],
  },
];

export default function ArbitrationKnowledge({ onBack, userName = '张明' }: ArbitrationKnowledgeProps) {
  const [view, setView] = useState<'modules' | 'list'>('modules');
  const [activeCategory, setActiveCategory] = useState<CategoryId>('notice');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // 按分类 + 关键词筛选
  const filteredArticles = useMemo(() => {
    return ARTICLES.filter((a) => {
      if (a.category !== activeCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.source.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const activeCat = CATEGORIES.find((c) => c.id === activeCategory)!;

  // 进入某个分类的文章列表
  const enterCategory = (catId: CategoryId) => {
    setActiveCategory(catId);
    setSearchQuery('');
    setView('list');
  };

  // 返回：列表页返回到模块页，模块页返回到首页
  const handleBack = () => {
    if (view === 'list') {
      setView('modules');
    } else {
      onBack();
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col animate-slide-in text-left">
      {/* ===== 顶部导航栏 ===== */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={handleBack}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap flex items-center gap-1.5">
          <i className="fa-solid fa-book-open text-[#1E62EC] text-sm"></i>
          {view === 'list' ? activeCat.label : '仲裁知识'}
        </div>
      </div>

      {/* ===== 模块选择页（默认首页） ===== */}
      {view === 'modules' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-8">
          {/* 简介提示 */}
          <div className="bg-gradient-to-r from-[#1E62EC]/5 to-indigo-50/60 rounded-xl px-4 py-3 border border-[#1E62EC]/10">
            <p className="text-xs text-slate-500 leading-relaxed">
              <i className="fa-solid fa-circle-info text-[#1E62EC] mr-1"></i>
              选择下方模块分类，浏览对应知识库文档。点击文章标题可预览 PDF 全文。
            </p>
          </div>

          {/* 模块卡片列表 */}
          {CATEGORIES.map((cat) => {
            const count = ARTICLES.filter((a) => a.category === cat.id).length;
            const latestArticle = ARTICLES.filter((a) => a.category === cat.id)[0];
            return (
              <div
                key={cat.id}
                onClick={() => enterCategory(cat.id)}
                className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg hover:shadow-slate-200/50 transition-all cursor-pointer group"
              >
                {/* 卡片顶部渐变横幅 */}
                <div className={`bg-gradient-to-r ${cat.gradient} px-4 py-3.5 flex items-center justify-between`}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <i className={`fa-solid ${cat.icon} text-white text-base`}></i>
                    </div>
                    <div>
                      <h3 className="text-base  text-white leading-tight">{cat.label}</h3>
                      <span className="text-[11px] text-white/70 font-medium">{count} 篇文档</span>
                    </div>
                  </div>
                  <i className="fa-solid fa-chevron-right text-white/60 text-xs group-hover:translate-x-0.5 group-hover:text-white transition-all"></i>
                </div>
                {/* 卡片内容 */}
                <div className="px-4 py-3">
                  <p className="text-xs text-slate-500 leading-relaxed mb-2.5">{cat.desc}</p>
                  {latestArticle && (
                    <div className="flex items-center gap-2 text-sm text-slate-400 bg-slate-50/80 rounded-lg px-2.5 py-1.5 border border-slate-100/60">
                      <i className="fa-solid fa-newspaper text-slate-300 flex-shrink-0"></i>
                      <span className="truncate flex-1 font-medium text-slate-600">最新: {latestArticle.title}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ===== 文章列表页（进入分类后显示） ===== */}
      {view === 'list' && (
        <>
          {/* 标题搜索筛选 */}
          <div className="bg-white border-b border-indigo-50 px-4 py-3 flex-shrink-0 z-10">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={`搜索${activeCat.label}标题、来源、摘要…`}
                className="w-full pl-9 pr-9 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-[#1E62EC] focus:border-transparent outline-none transition-all placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            
          </div>

          {/* 文章列表 */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 no-scrollbar pb-6">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((article) => (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className="bg-white rounded-lg border border-slate-100 p-3.5 hover:border-[#1E62EC]/30 hover:shadow-md hover:shadow-blue-500/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="text-base font-bold text-slate-800 group-hover:text-[#1E62EC] transition-colors leading-snug flex-1 flex items-start gap-1.5">
                      <FileText size={14} className="text-[#1E62EC] mt-0.5 flex-shrink-0" />
                      <span>{article.title}</span>
                    </h4>
                    <i className="fa-solid fa-file-pdf text-red-400 text-lg flex-shrink-0"></i>
                  </div>
                  
                  <div className="flex items-center justify-between pl-[1.375rem]">
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-calendar"></i>
                        {article.publishDate}
                      </span>
                      <span className="text-slate-200">|</span>
                      <span className="flex items-center gap-1">
                        <i className="fa-regular fa-file-lines"></i>
                        {article.pages} 页
                      </span>
                      
                    </div>
                    
                  </div>
                </div>
              ))
            ) : (
              <div className="h-52 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/60 rounded-xl border border-dashed border-slate-200 mt-4">
                <AlertCircle size={32} className="text-slate-300" />
                <span className="text-sm font-semibold text-slate-500">未检索到匹配的文章</span>
                <span className="text-xs text-slate-400">尝试更换关键词</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-1 px-3 py-1.5 bg-[#1E62EC] text-white text-xs rounded-lg cursor-pointer hover:bg-[#174FCE] transition-colors font-semibold"
                >
                  清空搜索
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ===== PDF 预览查看器 ===== */}
      {selectedArticle && (
        <PdfViewer
          article={selectedArticle}
          userName={userName}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}

// ===================== PDF 预览组件 =====================
interface PdfViewerProps {
  article: ArticleItem;
  userName: string;
  onClose: () => void;
}

function PdfViewer({ article, userName, onClose }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100); // 百分比
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [accessGranted, setAccessGranted] = useState(false);

  // 模拟权限校验（授权用户方可查看）
  useEffect(() => {
    const granted = Boolean(userName && userName.trim().length > 0);
    setAccessGranted(granted);
  }, [userName]);

  // 模拟 PDF 分块流式加载（高效加载机制）
  useEffect(() => {
    setLoading(true);
    setLoadProgress(0);
    setCurrentPage(1);
    let p = 0;
    const timer = setInterval(() => {
      p += Math.random() * 22 + 8;
      if (p >= 100) {
        p = 100;
        setLoadProgress(100);
        clearInterval(timer);
        setTimeout(() => setLoading(false), 200);
      } else {
        setLoadProgress(Math.floor(p));
      }
    }, 120);
    return () => clearInterval(timer);
  }, [article.id]);

  const handleZoomIn = useCallback(() => setZoom((z) => Math.min(z + 25, 200)), []);
  const handleZoomOut = useCallback(() => setZoom((z) => Math.max(z - 25, 50)), []);
  const handlePrevPage = useCallback(() => setCurrentPage((p) => Math.max(1, p - 1)), []);
  const handleNextPage = useCallback(() => setCurrentPage((p) => Math.min(article.pages, p + 1)), [article.pages]);

  return (
    <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[80] flex flex-col animate-fade-in">
      {/* 顶部标题栏 */}
      <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <i className="fa-solid fa-file-pdf text-red-400 text-lg flex-shrink-0"></i>
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate">{article.title}</h3>
            <p className="text-[11px] text-slate-400 flex items-center gap-2">
              <span>{article.source}</span>
              <span>·</span>
              <span>{article.publishDate}</span>
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="text-slate-300 hover:text-white hover:bg-slate-700 p-2 rounded-lg cursor-pointer transition-colors flex-shrink-0"
        >
          <X size={18} />
        </button>
      </div>

      {/* 权限校验提示 */}
      {!accessGranted ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white">
          <ShieldCheck size={48} className="text-red-400 mb-3" />
          <h4 className="text-base font-bold mb-1">无访问权限</h4>
          <p className="text-sm text-slate-400">该文档仅授权用户可查看，请先完成身份认证。</p>
        </div>
      ) : loading ? (
        /* 加载中状态 - 高效加载机制展示 */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-white">
          <Loader2 size={40} className="text-[#1E62EC] animate-spin mb-4" />
          <h4 className="text-sm font-bold mb-1">正在加载文档…</h4>
          <p className="text-xs text-slate-400 mb-4">采用分块流式加载，避免大文件卡顿</p>
          <div className="w-56 h-1.5 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#1E62EC] to-sky-400 rounded-full transition-all duration-150"
              style={{ width: `${loadProgress}%` }}
            ></div>
          </div>
          <span className="text-xs text-slate-300 mt-2 font-mono">{loadProgress}%</span>
        </div>
      ) : (
        <>
          {/* 文档预览区域 */}
          <div className="flex-1 overflow-auto bg-slate-700/50 flex justify-center p-4 no-scrollbar">
            <div
              className="bg-white shadow-2xl transition-transform duration-200 origin-top"
              style={{
                width: `${zoom * 3}px`,
                maxWidth: '92%',
                minHeight: '420px',
                transform: `scale(${zoom / 100})`,
              }}
            >
              {/* PDF 页面内容 */}
              <div className="p-6 border-b-8 border-slate-100 relative">
                {/* 页眉水印 - 权限标识 */}
                <div className="absolute top-2 right-3 text-[9px] text-slate-300 font-mono select-none">
                  授权用户：{userName} · {article.id.toUpperCase()}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-slate-800 break-words" style={{ fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif' }}>
                  {article.content[currentPage - 1] || article.content[0]}
                </pre>
                {/* 页脚 */}
                <div className="flex items-center justify-between mt-6 pt-3 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>{article.source}</span>
                  <span>第 {currentPage} 页 / 共 {article.pages} 页</span>
                </div>
              </div>
            </div>
          </div>

          {/* 底部 PDF 操作工具栏 */}
          <div className="bg-slate-800 border-t border-slate-700 px-4 py-2.5 flex items-center justify-between flex-shrink-0">
            {/* 翻页控制 */}
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
                className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="上一页"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="text-xs text-slate-300 font-mono px-2 min-w-[68px] text-center">
                {currentPage} / {article.pages}
              </span>
              <button
                onClick={handleNextPage}
                disabled={currentPage >= article.pages}
                className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="下一页"
              >
                <ChevronRight size={16} />
              </button>
            </div>

            {/* 缩放控制 */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleZoomOut}
                disabled={zoom <= 50}
                className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="缩小"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs text-slate-300 font-mono px-2 min-w-[44px] text-center">{zoom}%</span>
              <button
                onClick={handleZoomIn}
                disabled={zoom >= 200}
                className="p-2 rounded-lg bg-slate-700 text-white hover:bg-slate-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                title="放大"
              >
                <ZoomIn size={16} />
              </button>
              <button
                onClick={() => setZoom(100)}
                className="ml-1 px-2 py-1 rounded-lg bg-slate-700 text-white text-xs hover:bg-slate-600 cursor-pointer transition-colors font-semibold"
                title="恢复默认"
              >
                100%
              </button>
            </div>

            {/* 下载 */}
            <button
              onClick={() => alert(`已发起《${article.title}》的加密下载请求，下载链接将发送至您的注册邮箱。`)}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#1E62EC] text-white text-xs hover:bg-[#174FCE] cursor-pointer transition-colors font-semibold"
              title="加密下载"
            >
              <Download size={13} />
              <span className="hidden sm:inline">下载</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
