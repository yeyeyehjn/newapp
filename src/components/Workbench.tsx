import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Bell, ChevronRight, CheckCircle2, AlertCircle, Award, BookOpen, 
  Shield, Clock, Send, MessageSquare, Briefcase, Search, Sparkles, 
  QrCode, Printer, HelpCircle, FileText, Download 
} from 'lucide-react';
import { ArbitratorProfile, Task, Case, CaseStatus } from '../types';

interface WorkbenchProps {
  profile: ArbitratorProfile;
  tasks: Task[];
  cases: Case[];
  onNavigateToTab: (index: number) => void;
  onFilterStatus: (status: CaseStatus | 'all') => void;
  onSelectCase: (caseItem: Case) => void;
  onSelectTaskDirect: (taskItem: Task) => void;
  selectedStatusFilter: CaseStatus | 'all';
}

// Dialog record type for case discussion
interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  avatarLetter: string;
  content: string;
  time: string;
  isMe?: boolean;
}

export default function Workbench({ 
  profile, 
  tasks, 
  cases, 
  onNavigateToTab, 
  onFilterStatus,
  onSelectCase,
  onSelectTaskDirect,
  selectedStatusFilter
}: WorkbenchProps) {
  // inner sub-pages in homepage workbench: 'myCases' | 'caseDiscussion' | 'appointment' | null
  const [activeOverlayPage, setActiveOverlayPage] = useState<'myCases' | 'caseDiscussion' | 'appointment' | null>(null);
  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [activeFuncTab, setActiveFuncTab] = useState<'common' | 'other'>('common');
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showOfficialWebModal, setShowOfficialWebModal] = useState<boolean>(false);
  const [showOpsModal, setShowOpsModal] = useState<boolean>(false);
  const [downloadedTempIdxs, setDownloadedTempIdxs] = useState<number[]>([]);
  const [searchMockQuery, setSearchMockQuery] = useState<string>('');
  
  // Discussion Case Selector
  const [selectedDiscussionCaseId, setSelectedDiscussionCaseId] = useState<string>('1');
  
  // Custom chat message input
  const [customChatMessage, setCustomChatMessage] = useState<string>('');
  
  // Success state for downloading credential certificate
  const [isExportingCert, setIsExportingCert] = useState<boolean>(false);
  const [showCertSuccessMsg, setShowCertSuccessMsg] = useState<boolean>(false);

  // Auto scrolling for chat room
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Interactive advice ticker index
  const [tickerIndex, setTickerIndex] = useState<number>(0);
  const tickers = [
    "「中立公正，速裁决纷」 • 独立专业迅速，保护当事人机密信息",
    "「办案指引」: 法院协助保全措施已与全国民商事中控执行局实时联网对接",
    "「数字法庭」: 2026版多维数字法庭系统本月起全面支持离线远程签名审核机制",
    "「学术研究」: 裁决争议分析精解白皮书最新出版，可从‘我的-法规库’中获取电子书"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Prepopulated mock dialogue histories for case discussions
  const [discussionHistories, setDiscussionHistories] = useState<{ [caseId: string]: ChatMessage[] }>({
    '1': [
      { id: '1_1', sender: '李秘书', role: '办案秘书', avatarLetter: '李', content: '张首席好，赵老师、王老师好：关于华夏科技与蓝海创投股权受让一案，双方第2轮对于质辩补证材料的答复已经审核无误发给双方。', time: '09:42' },
      { id: '1_2', sender: '赵东', role: '合议庭成员', avatarLetter: '赵', content: '收到。被申请人主张大雾延迟导致交易不满足15日时限，但我发现他们转让声明在去年底就发出了。这一事实有关键证据印证。', time: '10:15' },
      { id: '1_3', sender: '王琦', role: '合议庭成员', avatarLetter: '王', content: '赞同赵老师的切入。首席，我建议这周我们对‘华夏科技解除合同要求是否由于对方迟延给付导致’的过错比例进行闭门会议，您怎么看？', time: '11:03' },
    ],
    '3': [
      { id: '3_1', sender: '李秘书', role: '办案秘书', avatarLetter: '李', content: '各位老师，润物高科智能产业园二期建设工程案标的额较大，当事人双方在选择开庭时间上具有极强的摩擦抗辩，目前已提出排除部分开庭时段的诉请。', time: '昨日 15:30' },
      { id: '3_2', sender: '赵东', role: '合议庭成员', avatarLetter: '赵', content: '建设工程纠纷专业鉴定耗时很长，咱们庭期一旦拖延两个月以上，会产生巨额利息累积，因此一定要强硬按排庭规则确认推进开庭时间。', time: '昨日 17:12' },
    ],
    '5': [
      { id: '5_1', sender: '李秘书', role: '办案秘书', avatarLetter: '李', content: '众盛信托与乾坤置业金融借款保全核定已通过。目前法院已查封被申请人名下三块商业用地，资产保护稳固。', time: '前天 11:20' }
    ]
  });

  // Handle sending message in case discussion
  const handleSendMessage = (textToSend?: string) => {
    const messageContent = textToSend || customChatMessage;
    if (!messageContent.trim()) return;

    const newMsg: ChatMessage = {
      id: `custom_${Date.now()}`,
      sender: profile.name,
      role: '首席仲裁员 (我)',
      avatarLetter: '我',
      content: messageContent,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setDiscussionHistories(prev => ({
      ...prev,
      [selectedDiscussionCaseId]: [...(prev[selectedDiscussionCaseId] || []), newMsg]
    }));

    if (!textToSend) {
      setCustomChatMessage('');
    }

    // Scroll to bottom
    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  // Quick reply options for premium feel
  const quickReplies = [
    "同意，我已拟定本案主要合议焦点大纲，请安排下周多点线上预备合议。",
    "收到。请秘书通知当事人对第二轮反驳证物原件进行快递线下比照核对。",
    "对答辩时效的认定需要遵循2022版规则，请起草正式的实体管辖阻碍裁定回复。"
  ];

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  // Trigger quick category filter (from home metric block) and navigate to Case Tab
  const handleStatBlockClick = (status: CaseStatus | 'all') => {
    onFilterStatus(status);
    onNavigateToTab(1);
  };

  // Safe digital print handle for certificates
  const handleCredentialExport = () => {
    setIsExportingCert(true);
    setTimeout(() => {
      setIsExportingCert(false);
      setShowCertSuccessMsg(true);
      setTimeout(() => setShowCertSuccessMsg(false), 3500);
    }, 2000);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-20 overflow-hidden relative">
      
      {/* PREMIUM DEEP MESH BANNER - 顶部Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-5 space-y-5 relative overflow-hidden flex flex-col justify-between shadow-lg">
        {/* Decorative geometric gold grid line designs */}
        <div className="absolute right-[-24px] top-[-24px] w-48 h-48 rounded-full border border-yellow-500/10 pointer-events-none"></div>
        <div className="absolute right-[-48px] top-[-48px] w-64 h-64 rounded-full border border-yellow-500/5 pointer-events-none"></div>
        
        <div className="absolute left-[-48px] bottom-[-24px] opacity-[0.03] pointer-events-none transform rotate-45 scale-125 text-[192px] leading-none text-white">
          <i className="fa-solid fa-shield"></i>
        </div>

        {/* GZAC Watermark Title */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex flex-col text-left">
            <span className="text-[11px] font-black tracking-widest text-slate-100 uppercase">广州仲裁委员会</span>
            <span className="text-[7.5px] text-white font-extrabold mt-0.5 tracking-wider w-max scale-90 origin-left">
              GUANGZHOU ARBITRATION COMMISSION
            </span>
          </div>
          
          <div className="flex items-center bg-white/10 hover:bg-white/15 border border-white/10 rounded-full h-7 px-3 py-1 space-x-1.5 shadow-sm transition-all cursor-pointer">
            <i className="fa-solid fa-bell text-amber-400 text-[10.5px]"></i>
            <span className="text-[10px] font-black text-slate-200">消息通知</span>
            <span className="h-1.5 w-1.5 bg-rose-500 rounded-full"></span>
          </div>
        </div>

        {/* User Welcome Block */}
        <div className="relative z-10 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-[#F8FAFC] tracking-tight leading-none">
                {profile.name}
              </h1>
              <span className="text-[9px] font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-1.5 py-0.5 rounded-lg shadow-sm">
                {profile.ranking}
              </span>
            </div>
            <p className="text-indigo-200/90 text-[10.5px] font-semibold tracking-wide uppercase">
              广州仲裁委员会特聘 · 在聘特级主审及独任仲裁员
            </p>
            <div className="flex items-center space-x-1 text-[9.5px] text-slate-400 font-mono mt-0.5">
              <span>数字CA盾联存证ID:</span>
              <span className="text-indigo-300 font-extrabold">{profile.idNo}</span>
            </div>
          </div>
        </div>

        {/* Simulated Premium Search Bar */}
        <div className="relative z-10 w-full mb-0.5">
          <div className="flex items-center bg-white/10 hover:bg-white/15 border border-white/10 rounded-2xl px-3 py-2 w-full transition-all text-slate-300 text-xs gap-2 shadow-inner">
            <i className="fa-solid fa-magnifying-glass text-slate-400 flex-shrink-0"></i>
            <input
              type="text"
              placeholder="统一检索本庭委案、决议案号、争议焦点及承办当事人..."
              className="bg-transparent border-none outline-none text-white text-[10.5px] placeholder:text-slate-500 w-full"
              value={searchMockQuery}
              onChange={(e) => {
                setSearchMockQuery(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onFilterStatus('all');
                  onNavigateToTab(1);
                }
              }}
            />
            <span className="text-[8.5px] bg-white/20 border border-white/10 text-white/80 px-1 py-0.5 rounded font-mono">GZAC码</span>
          </div>
        </div>

      </div>

      {/* Home View Container */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">

        {/* METRICS CORE QUICK SUM PANEL */}
        <div className="grid grid-cols-3 bg-white border-b border-indigo-50/50 p-4 shadow-inner text-center gap-2 flex-shrink-0">
          <div 
            onClick={() => handleStatBlockClick('审理中')}
            className="hover:bg-slate-50/80 p-2.5 rounded-2xl cursor-pointer transition-all border border-slate-100 flex flex-col justify-center space-y-1"
          >
            <span className="text-[10px] text-slate-400 block font-medium">在办案件数</span>
            <span className="text-base font-extrabold text-[#1E293B] tracking-tight block">
              {cases.filter(c => c.status === '审理中').length} <span className="text-[10px] font-normal text-slate-400">件</span>
            </span>
          </div>
          <div 
            onClick={() => onNavigateToTab(2)}
            className="hover:bg-slate-50/80 p-2.5 rounded-2xl cursor-pointer transition-all border border-slate-100 flex flex-col justify-center space-y-1"
          >
            <span className="text-[10px] text-slate-400 block font-medium">积期/待分流</span>
            <span className="text-base font-extrabold text-amber-500 tracking-tight block">
              {pendingTasks.length} <span className="text-[10px] font-normal text-slate-400">件</span>
            </span>
          </div>
          <div 
            onClick={() => handleStatBlockClick('已结案')}
            className="hover:bg-slate-50/80 p-2.5 rounded-2xl cursor-pointer transition-all border border-slate-100 flex flex-col justify-center space-y-1"
          >
            <span className="text-[10px] text-slate-400 block font-medium">结案总数</span>
            <span className="text-base font-extrabold text-emerald-600 tracking-tight block">
              {profile.resolvedCount + cases.filter(c => c.status === '已结案').length - 1} <span className="text-[10px] font-normal text-slate-400">件</span>
            </span>
          </div>
        </div>

        {/* URGENT TODAY TO-DOS - 当天待办通知 (首页待办优化样式) */}
        {pendingTasks.length > 0 && (
          <div className="p-4 py-3 bg-slate-50 border-b border-indigo-50/40 text-left">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[10.5px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <i className="fa-solid fa-clock text-indigo-500 animate-pulse"></i>
                <span>今日待处要务 • 快速决策</span>
              </span>
              <span className="text-[9.5px] text-rose-600 bg-rose-50 font-extrabold px-1.5 py-0.5 rounded-md flex items-center gap-1">
                <span className="h-1 w-1 bg-rose-500 rounded-full animate-ping"></span>
                <span>{pendingTasks.length} 项要务待办</span>
              </span>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.slice(0, 2).map((task) => {
                // Determine icon based on task type
                let taskFaIcon = "fa-file-signature";
                if (task.type === 'schedule') {
                  taskFaIcon = "fa-calendar-days";
                } else if (task.type === 'sign') {
                  taskFaIcon = "fa-file-signature";
                } else {
                  taskFaIcon = "fa-file-shield";
                }

                return (
                  <div
                    key={task.id}
                    onClick={() => onSelectTaskDirect(task)}
                    className="bg-white rounded-2xl border border-red-200 p-3.5 shadow-sm hover:border-red-300 hover:shadow-md transition-all cursor-pointer flex items-center justify-between gap-3 group relative overflow-hidden"
                  >
                    
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="p-2.5 rounded-xl bg-slate-50 text-slate-600 group-hover:bg-slate-100 group-hover:text-indigo-600 transition-colors flex items-center justify-center flex-shrink-0 mt-0.5">
                        <i className={`fa-solid ${taskFaIcon} text-xs`}></i>
                      </div>
                      
                      <div className="space-y-1 text-left min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-[8px] bg-red-50 text-red-600 border border-red-100 font-extrabold rounded px-1.5 py-0.2 tracking-wider uppercase leading-none">
                            今日限期
                          </span>
                          <span className="text-[9.5px] font-mono text-slate-500 font-bold block truncate">
                            {task.caseNo}
                          </span>
                        </div>
                        <strong className="text-[11px] font-extrabold text-slate-800 truncate block group-hover:text-red-600 transition-colors">
                          {task.title}
                        </strong>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed truncate">
                          {task.description}
                        </p>
                      </div>
                    </div>
                    
                    <button className="flex-shrink-0 bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white text-[10px] font-black py-2 px-3 rounded-xl transition-all cursor-pointer shadow-md shadow-red-600/10 flex items-center gap-1 group-hover:scale-105">
                      <span>去办理</span>
                      <i className="fa-solid fa-chevron-right text-[8px]"></i>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* UNIQUE GRID SELECTED FUNCTIONS - 常用功能与其他功能 TAB 切换 (Grid 网格模式) */}
        <div className="p-4 space-y-3 bg-slate-50 text-left">
          {/* Tab Headers */}
          <div className="flex items-center justify-between border-b border-indigo-100/50 pb-1.5 pl-1 mb-1">
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveFuncTab('common')}
                className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all cursor-pointer ${
                  activeFuncTab === 'common'
                    ? 'border-indigo-600 text-indigo-700 font-extrabold text-[12px]'
                    : 'border-transparent text-slate-400 font-medium text-[12px]'
                }`}
              >
                <div className={`w-1 h-3.5 bg-indigo-600 rounded-full transition-opacity ${activeFuncTab === 'common' ? 'opacity-100' : 'opacity-0'}`}></div>
                <span>常用功能</span>
              </button>
              <button
                onClick={() => setActiveFuncTab('other')}
                className={`flex items-center space-x-1.5 pb-2 border-b-2 transition-all cursor-pointer ${
                  activeFuncTab === 'other'
                    ? 'border-indigo-600 text-indigo-700 font-extrabold text-[12px]'
                    : 'border-transparent text-slate-400 font-medium text-[12px]'
                }`}
              >
                <div className={`w-1 h-3.5 bg-indigo-600 rounded-full transition-opacity ${activeFuncTab === 'other' ? 'opacity-100' : 'opacity-0'}`}></div>
                <span>其他功能</span>
              </button>
            </div>
            
            <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded font-bold uppercase">
              {activeFuncTab === 'common' ? 'GZAC Core' : 'GZAC Extra'}
            </span>
          </div>

          {activeFuncTab === 'common' ? (
            /* Common Functions Grid (我的案件、案件讨论、我的聘书) */
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'myCases', label: '我的案件', desc: '在审委案大盘及盘点', icon: "fa-briefcase", color: 'text-indigo-600 bg-indigo-50 border-indigo-100/80 hover:border-indigo-300', navigate: true },
                { id: 'caseDiscussion', label: '案件讨论', desc: '非公开加密合议主庭', icon: "fa-comments", color: 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-100/80 hover:border-fuchsia-300' },
                { id: 'appointment', label: '我的聘书', desc: '经CA签署认证聘定书', icon: "fa-award", color: 'text-amber-600 bg-amber-50 border-amber-100/80 hover:border-amber-300' }
              ].map((section, idx) => {
                return (
                  <button
                    key={section.id}
                    onClick={() => section.navigate ? onNavigateToTab(1) : setActiveOverlayPage(section.id as any)}
                    className={`${idx === 2 ? 'col-span-2' : ''} p-3.5 bg-white border border-slate-100 hover:border-indigo-200 rounded-2xl flex flex-col justify-between items-start cursor-pointer transition-all hover:shadow-sm group text-left min-h-[92px]`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl border flex items-center justify-center flex-shrink-0 ${section.color}`}>
                        <i className={`fa-solid ${section.icon} text-[13px] transition-transform group-hover:scale-115`}></i>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-300 text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                    </div>
                    <div className="mt-3.5 space-y-0.5">
                      <span className="text-[11.5px] font-extrabold block text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">{section.label}</span>
                      <span className="text-[9px] block text-slate-400 font-bold leading-normal truncate max-w-[150px]">{section.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Other Functions Grid (文书模板、仲裁指引、广仲官网、操作指引) */
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'template', label: '文书模板', desc: '提供草拟及范例包下载', icon: "fa-file-lines", color: 'text-emerald-600 bg-emerald-50 border-emerald-100/80 hover:border-emerald-300', action: () => setShowTemplateModal(true) },
                { id: 'guide', label: '仲裁指引', desc: '审理流程规则快捷指南', icon: "fa-compass", color: 'text-rose-600 bg-rose-50 border-rose-100/80 hover:border-rose-300', action: () => setShowGuideModal(true) },
                { id: 'officialWeb', label: '广仲官网', desc: '访问广仲智慧业务大厅', icon: "fa-globe", color: 'text-sky-600 bg-sky-50 border-sky-100/80 hover:border-sky-300', action: () => setShowOfficialWebModal(true) },
                { id: 'ops', label: '操作指引', desc: 'CA盾指纹签名安全说明', icon: "fa-sliders", color: 'text-violet-600 bg-violet-50 border-violet-100/80 hover:border-violet-300', action: () => setShowOpsModal(true) }
              ].map((section) => {
                return (
                  <button
                    key={section.id}
                    onClick={section.action}
                    className="p-3.5 bg-white border border-slate-100 hover:border-indigo-200 rounded-2xl flex flex-col justify-between items-start cursor-pointer transition-all hover:shadow-sm group text-left min-h-[92px]"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`p-2 rounded-xl border flex items-center justify-center flex-shrink-0 ${section.color}`}>
                        <i className={`fa-solid ${section.icon} text-[13px] transition-transform group-hover:scale-115`}></i>
                      </div>
                      <i className="fa-solid fa-chevron-right text-slate-300 text-[9px] transition-transform group-hover:translate-x-0.5"></i>
                    </div>
                    <div className="mt-3.5 space-y-0.5">
                      <span className="text-[11.5px] font-extrabold block text-slate-800 group-hover:text-indigo-600 transition-colors leading-none">{section.label}</span>
                      <span className="text-[9px] block text-slate-400 font-bold leading-normal truncate max-w-[150px]">{section.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* THE 3 FULL-SCREEN MODULAR SLIDING SUB-PAGES */}
      {activeOverlayPage && (
        <div className="absolute inset-0 bg-slate-50 z-[75] flex flex-col animate-slide-up text-left">
          {/* Custom navigation back block with GZAC design */}
          <div className="h-13 bg-slate-900 border-b border-slate-800 flex items-center px-4 relative flex-shrink-0">
            <button
              onClick={() => setActiveOverlayPage(null)}
              className="flex items-center space-x-1 text-xs text-indigo-200 hover:text-white font-bold transition-colors cursor-pointer"
            >
              <span>❮ 返回首页</span>
            </button>
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-white tracking-widest whitespace-nowrap">
              {activeOverlayPage === 'caseDiscussion' && '广州仲裁委 • 非公开合议室'}
              {activeOverlayPage === 'appointment' && '广州仲裁委 • 资深特聘证书'}
            </div>
          </div>

          {/* scrollable page body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10">
            {activeOverlayPage === 'caseDiscussion' && (
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden animate-fade-in text-left">
                {/* Header Selector inside Discussion Room */}
                <div className="bg-slate-50 p-3.5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                    <span className="text-[10.5px] font-black text-slate-700">在案合议交流室</span>
                  </div>
                  <select 
                    value={selectedDiscussionCaseId} 
                    onChange={(e) => setSelectedDiscussionCaseId(e.target.value)}
                    className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-[10px] font-extrabold text-slate-600 outline-none cursor-pointer focus:border-indigo-400"
                  >
                    {cases.map(c => (
                      <option key={c.id} value={c.id}>{c.caseNo.split('号')[0]}号庭</option>
                    ))}
                  </select>
                </div>

                {/* Chat Log History list */}
                <div 
                  ref={chatScrollRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 no-scrollbar min-h-[220px]"
                >
                  {(discussionHistories[selectedDiscussionCaseId] || []).map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex items-start gap-2.5 max-w-[90%] text-left ${msg.isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-[10px] select-none text-white flex-shrink-0 ${msg.isMe ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                        {msg.avatarLetter}
                      </div>
                      <div className="space-y-1">
                        <div className={`flex items-center gap-1.5 text-[9px] text-slate-400 ${msg.isMe ? 'justify-end' : ''}`}>
                          <strong className="text-slate-600 font-extrabold">{msg.sender}</strong>
                          <span className="bg-slate-100 text-slate-500 px-1 py-0.2 rounded text-[7.5px] scale-90">{msg.role}</span>
                          <span className="font-mono text-[8.5px]">{msg.time}</span>
                        </div>
                        <div className={`p-3 rounded-2xl text-[11px] leading-relaxed relative ${
                          msg.isMe 
                            ? 'bg-indigo-600 text-white rounded-tr-none' 
                            : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-xs'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Action input bar */}
                <div className="p-3 border-t border-slate-100 bg-white flex flex-col gap-2 flex-shrink-0">
                  {/* Quick reply tags */}
                  <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
                    {quickReplies.map((qr, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSendMessage(qr)}
                        className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-1.5 px-3 text-[9.5px] font-bold text-slate-500 truncate max-w-[140px] flex-shrink-0 transition-colors cursor-pointer"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200/25 rounded-2xl px-3 py-1.5 shadow-inner">
                    <input
                      type="text"
                      placeholder="畅所欲言，草拟合议质辩见地意见..."
                      className="bg-transparent border-none outline-none text-[11px] placeholder:text-slate-400 w-full text-slate-800"
                      value={customChatMessage}
                      onChange={(e) => setCustomChatMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                    />
                    <button
                      onClick={() => handleSendMessage()}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
                    >
                      <Send size={11} />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeOverlayPage === 'appointment' && (
              <div className="animate-fade-in space-y-4 text-left">
                {/* Official letter frame */}
                <div className="bg-[#FFFDF6] border-[5px] border-double border-amber-600/30 rounded-3xl p-5 relative overflow-hidden shadow-md">
                  
                  {/* Backdrop watermark Seal of GZAC */}
                  <div className="absolute right-3 bottom-3 opacity-20 pointer-events-none w-25 h-25 border-[4px] border-[#702424] rounded-full flex items-center justify-center font-extrabold text-[10px] text-[#702424] uppercase tracking-wider transform -rotate-12 border-dashed">
                    广州仲裁委员会
                  </div>

                  <div className="space-y-4 relative z-10 font-sans">
                    <div className="flex justify-center mb-1">
                      <div className="bg-amber-100/60 border border-amber-500/30 p-2 rounded-2xl text-amber-600">
                        <Award size={20} className="animate-scale-up" />
                      </div>
                    </div>

                    <h3 className="text-center text-sm font-extrabold text-amber-900 tracking-widest font-sans px-1">
                      广州仲裁委员会 · 仲裁员聘书
                    </h3>
                    
                    {/* Divider line */}
                    <div className="flex justify-center items-center space-x-2">
                      <div className="h-px bg-amber-600/45 flex-1"></div>
                      <span className="text-[8px] text-amber-700 font-mono tracking-widest uppercase">OFFICIAL COMMISSION</span>
                      <div className="h-px bg-amber-600/45 flex-1"></div>
                    </div>

                    {/* Body text content */}
                    <div className="space-y-2.5 text-slate-700 text-[10.5px] leading-relaxed text-left py-1 text-justify indent-4">
                      <p>
                        兹聘请 <strong>张明</strong> 先生为广州仲裁委员会之 
                        <strong className="text-amber-800">「特级独任及合议庭首席仲裁员」</strong>。
                      </p>
                      <p>
                        任职期间，其有权依法组成专属仲裁庭，对各类涉及股权投资基金纠纷、高端商事买卖违约、涉外涉海运输冲突及知识产权纠纷等民事与经济案，进行独立、公开、公正之法律裁判。
                      </p>
                    </div>

                    {/* Key metadata grid layout */}
                    <div className="bg-amber-50/40 border border-amber-100 p-2.5 rounded-xl grid grid-cols-2 gap-2 text-[9.5px] text-amber-900/70 text-left font-sans">
                      <div className="space-y-1">
                        <p>• 聘书编号: <span className="font-mono text-slate-800 font-extrabold">{profile.idNo}</span></p>
                        <p>• 聘用期限: <span className="text-slate-800 font-semibold">2023年09月 - 2028年09月</span></p>
                      </div>
                      <div className="space-y-1">
                        <p>• 特殊特长: <span className="text-[#6366F1] font-bold">{profile.specialties.join(' ')}</span></p>
                        <p>• 授权等级: <span className="text-emerald-600 font-bold">委员会资深一级</span></p>
                      </div>
                    </div>

                    {/* Official red ink seal simulation */}
                    <div className="flex justify-between items-end pt-2">
                      <div className="text-left text-[9px] text-slate-400 font-sans">
                        <QrCode size={30} className="text-slate-500 opacity-60 mb-0.5" />
                        <span>国中区块链防伪广州盾</span>
                      </div>

                      <div className="relative pr-1 flex flex-col items-center select-none pb-1">
                        {/* Red seal stamp circle */}
                        <div className="absolute right-[-10px] bottom-[-2px] w-14 h-14 border-[3px] border-red-500/80 rounded-full flex items-center justify-center font-bold text-[7px] text-red-500/80 rotate-12 pointer-events-none opacity-80 border-double">
                          <div className="text-[6px] text-center font-extrabold tracking-wide scale-90">
                            广州仲裁委员会<br/>
                            专用印章
                          </div>
                        </div>
                        <span className="text-[9.5px] font-sans font-extrabold text-[#702424] mr-8">广州仲裁委员会</span>
                        <span className="text-[8.5px] font-mono text-slate-400 mr-8">2023年09月01日发布</span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Action secure button */}
                <div className="space-y-2">
                  <button
                    onClick={handleCredentialExport}
                    disabled={isExportingCert}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 text-white font-extrabold p-3 text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download size={13} className={isExportingCert ? 'animate-spin' : ''} />
                    <span>{isExportingCert ? '正进行多路安全存证级防伪导出...' : '导出防伪加密PDF聘书副件'}</span>
                  </button>

                  {showCertSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-[10px] text-emerald-700 leading-normal flex items-start gap-1.5 animate-fade-in font-semibold text-center justify-center font-sans">
                      <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>✓ CA聘书证书副件成功保存至沙盒数据库！并附带国办高标准防伪电子水印（哈希：GZAC-SHA256-4024）</span>
                    </div>
                  )}
                </div>

                {/* Secure statement */}
                <div className="bg-slate-100 p-3 rounded-xl text-[9.5px] text-slate-400 leading-relaxed text-center font-sans">
                  该聘任书具有国家政务法律资质追溯标准，已通过全国信用共享交换中台。防伪CA锁联追踪，未授权拷贝作为第三方使用将承担法律责任。
                </div>

              </div>
            )}
          </div>
        </div>
      )}

      {/* RULES STUDY MODAL DIALOG */}
      {showLearningModal && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <BookOpen size={14} className="text-emerald-400" />
                <span>广州仲裁委员会仲裁规则（2024年版）</span>
              </span>
              <button 
                onClick={() => setShowLearningModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-[11px] text-slate-500 text-justify leading-relaxed">
              <h5 className="font-extrabold text-indigo-900 text-xs border-b border-indigo-50 pb-1">第一条：宗旨和依据</h5>
              <p>为了保证民商事纠纷得到公平、迅速地解决，保护当事人的合法权益，制定本规则。中国广州仲裁委员会依据此法处理国内国际及涉外合同关系中产生之经济和财产等契商抗执辩难...</p>
              
              <h5 className="font-extrabold text-indigo-900 text-xs border-b border-indigo-50 pb-1">第十四条：合议仲裁庭与首席</h5>
              <p>仲裁案件仲裁合议庭由三名仲裁员组成，一般由双方各指定或委托主任指定一人作为内申。第三名即首席仲裁员，由双方共同商选确定。若约定选用本规则并以首席为主持，则首席应对裁制事实的质询、程序等事承担决定主责，并在完成全额质辩合议后做出正式初稿编纂。</p>
              
              <h5 className="font-extrabold text-indigo-900 text-xs border-b border-indigo-50 pb-1">第五二条：终极裁判其效力</h5>
              <p>裁决书自做出之日起生效。仲裁裁决为正规终局法律文书，对双方当事人均具有同等绝对民事执行强制效能。若裁定有一方违抗不能足额落实，可依据本裁决书呈报至当地人民法院执行局，实施强制财产划拨查查封保全...</p>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowLearningModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-[10px] rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                学习完毕已阅并签署归档
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTHER FUNCTION MODALS */}
      {/* 1. 文书模板 */}
      {showTemplateModal && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <i className="fa-solid fa-file-lines text-emerald-400"></i>
                <span>广州仲裁委常用文书样本库</span>
              </span>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-[11px] text-slate-500 leading-relaxed no-scrollbar flex-1">
              <p className="text-slate-400 text-[10px]">您可以随时在此调阅本委标准样本。点击下载可无感离线提取至审判工作台。</p>
              
              <div className="space-y-2.5">
                {[
                  { id: 1, name: '《涉外民商事仲裁案裁决模板》', size: '124 KB', hash: 'GZAC-TEMP-01' },
                  { id: 2, name: '《合议庭开庭评议纪要样式》', size: '85 KB', hash: 'GZAC-TEMP-02' },
                  { id: 3, name: '《简易程序结案决定书模板》', size: '98 KB', hash: 'GZAC-TEMP-03' },
                  { id: 4, name: '《回避决定通知及送达回证》', size: '72 KB', hash: 'GZAC-TEMP-04' }
                ].map((doc) => {
                  const isDownloaded = downloadedTempIdxs.includes(doc.id);
                  return (
                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-all">
                      <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                        <h6 className="font-extrabold text-slate-800 text-[11px] truncate">{doc.name}</h6>
                        <p className="text-[9px] text-slate-400 font-mono">大小: {doc.size} • 校验哈希: {doc.hash}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (!isDownloaded) {
                            setDownloadedTempIdxs(prev => [...prev, doc.id]);
                          }
                        }}
                        className={`p-1.5 px-3 rounded-lg text-[9.5px] font-black cursor-pointer transition-all ${
                          isDownloaded 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-indigo-50 border border-indigo-100 text-indigo-600 hover:bg-indigo-100'
                        }`}
                      >
                        {isDownloaded ? '已下载 ⎘' : '下载'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowTemplateModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-[10px] rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 仲裁指引 */}
      {showGuideModal && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <i className="fa-solid fa-compass text-rose-400"></i>
                <span>广州仲裁委员会高效办案指引一览</span>
              </span>
              <button 
                onClick={() => setShowGuideModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-[11px] text-slate-500 leading-relaxed no-scrollbar flex-1">
              <p className="text-slate-400 text-[10px]">请各位仲裁员严格恪守《广仲办案守则和工作流细则》，确保案件高效结案。</p>
              
              <div className="relative border-l border-indigo-100 pl-4 ml-2 space-y-4">
                {[
                  { step: '01', title: '案件受理与组庭分派', desc: '办案秘书核验申请材料及管辖约定并成立合议庭' },
                  { step: '02', title: '送达答辩与反诉审查', desc: '被申请人在15工作日内提交答辩，并审核是否存在反诉' },
                  { step: '03', title: '组庭评议及预备会议', desc: '首席/独任仲裁员召集沟通关键事实重点与争议争端焦点' },
                  { step: '04', title: '庭审辩论与最终合议', desc: '举行庭期并确保当事人享有充足辩论权，庭后合议评议落实' },
                  { step: '05', title: '裁决草拟并签定 CACA', desc: '首席草拟裁决报告并交由全体庭员进行数字证书盾级合议签署' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[25px] top-0 h-4.5 w-4.5 rounded-full bg-indigo-50 border border-indigo-400 text-indigo-700 font-extrabold text-[9px] flex items-center justify-center font-mono">
                      {item.step}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-800 text-[11.5px]">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowGuideModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-[10px] rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                确认掌握
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 广仲官网 */}
      {showOfficialWebModal && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <i className="fa-solid fa-globe text-sky-400"></i>
                <span>“智慧广仲”云联数字工作台入口</span>
              </span>
              <button 
                onClick={() => setShowOfficialWebModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 text-[11px] text-slate-500 leading-relaxed no-scrollbar bg-slate-50 flex-1">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 rounded-2xl text-white text-center space-y-1 shadow-sm">
                <h4 className="text-[12px] font-black tracking-widest font-sans">广州仲裁委员会智慧云平台</h4>
                <p className="text-[8px] opacity-80 font-mono">ONLINE SMART PLATFORM FOR GZAC • EST. 1995</p>
                <div className="w-12 h-0.5 bg-yellow-500 mx-auto my-1"></div>
                <div className="text-[9.5px] bg-white/15 px-2 py-1 rounded-lg inline-block text-amber-300 font-extrabold mt-1">
                  服务大厅内网互联中台
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5 pl-1">
                  <span className="w-1 h-3 bg-indigo-600 rounded-full"></span>
                  <span>常用数字网络服务节点</span>
                </h5>
                
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { title: '一键网上立案', desc: 'OCR自动解析识别申诉材料', icon: 'fa-cloud-arrow-up', link: 'https://www.gzac.org/' },
                    { title: '智慧裁决辅助', desc: '审判要素抽取及自动生成', icon: 'fa-microchip', link: 'https://www.gzac.org/' },
                    { title: '云庭开庭入口', desc: '多路异地声纹视频质证', icon: 'fa-video', link: 'https://www.gzac.org/' },
                    { title: '全国存证查询', desc: '基于信盾CA密钥及公链', icon: 'fa-database', link: 'https://www.gzac.org/' }
                  ].map((srv, idx) => (
                    <a
                      key={idx}
                      href={srv.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white border border-slate-100 hover:border-indigo-300 rounded-xl flex flex-col justify-between items-start transition-all cursor-pointer group shadow-xs"
                    >
                      <i className={`fa-solid ${srv.icon} text-indigo-600 text-xs group-hover:scale-110 transition-transform mb-2`}></i>
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-extrabold text-slate-800 block group-hover:text-indigo-600 leading-none">{srv.title}</span>
                        <span className="text-[8px] text-slate-400 block font-medium leading-tight">{srv.desc}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-[9px] text-blue-700 flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info text-blue-500 mt-0.5 flex-shrink-0"></i>
                <p className="leading-normal font-semibold">
                  温馨提示：由于平台处于保密测试域环境下运作，以上功能采用专线信道与广州仲裁委核心数据库加密握手。点击将跳转至官方政务系统。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowOfficialWebModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-[10px] rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. 操作指引 */}
      {showOpsModal && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <i className="fa-solid fa-sliders text-violet-400"></i>
                <span>仲裁系统数字化操作指引</span>
              </span>
              <button 
                onClick={() => setShowOpsModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-[11px] text-slate-550 leading-relaxed no-scrollbar flex-1 font-sans">
              <div className="space-y-3.5">
                <h5 className="font-extrabold text-slate-700 text-[11.5px] border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-fingerprint text-indigo-600"></i>
                  <span>一、CA数字印记与安全证书盾</span>
                </h5>
                <p className="text-[10px] leading-relaxed text-justify">
                  仲裁员做出并批准最终裁决书草案时，推荐在办案秘书配合下，通过“我的聘书”页面的 <strong>CA防伪数字存证</strong> 盾加密进行防伪哈希对齐，该哈希是向全国政务信用中台登记的权威标识。
                </p>

                <h5 className="font-extrabold text-slate-700 text-[11.5px] border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-users-line text-indigo-600"></i>
                  <span>二、非公开多路安全合议讨论</span>
                </h5>
                <p className="text-[10px] leading-relaxed text-justify">
                  点击“案件讨论”，即可进入合议庭闭门合议室。您可以与其他特邀评议专家及办案秘书，在线分析证据效力与争议要素。在此发送学术倾向不会对第三方公开。
                </p>

                <h5 className="font-extrabold text-slate-700 text-[11.5px] border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-bolt text-indigo-600"></i>
                  <span>三、今日限时超期黄色警示</span>
                </h5>
                <p className="text-[10px] leading-relaxed text-justify">
                  每逢涉案审等存在限时要求，系统会在首页最核心板块进行 <strong>黄色限时预警催办</strong>。仲裁员只需要点击主卡片上的“去办理”即可直接极速处理，省去多重检索跳转成本。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowOpsModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-[10px] rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                已全部知悉并掌握
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
