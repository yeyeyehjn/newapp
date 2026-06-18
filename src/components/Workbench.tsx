import React, { useState, useEffect } from 'react';
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
  onNavigateToSubPage: (page: 'statsCenter' | 'caseDiscussion' | 'appointment' | 'notifications' | 'remuneration' | 'declarationList' | 'transcriptSignature' | 'transcriptSignatureDetail') => void;
  onToggleVersion?: () => void;
}

export default function Workbench({ 
  profile, 
  tasks, 
  cases, 
  onNavigateToTab, 
  onFilterStatus,
  onSelectCase,
  onSelectTaskDirect,
  selectedStatusFilter,
  onNavigateToSubPage,
  onToggleVersion
}: WorkbenchProps) {
  const [showLearningModal, setShowLearningModal] = useState<boolean>(false);
  const [activeFuncTab, setActiveFuncTab] = useState<'common' | 'other'>('common');
  const [activeVirtualCourtId, setActiveVirtualCourtId] = useState<string | null>(null);
  const [courtTranscriptStep, setCourtTranscriptStep] = useState<number>(0);
  const [isSigningMode, setIsSigningMode] = useState<boolean>(false);
  const [isSigningFinish, setIsSigningFinish] = useState<boolean>(false);
  const [courtTimer, setCourtTimer] = useState<number>(104);
  
  const [showTemplateModal, setShowTemplateModal] = useState<boolean>(false);
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);
  const [showOfficialWebModal, setShowOfficialWebModal] = useState<boolean>(false);
  const [showOpsModal, setShowOpsModal] = useState<boolean>(false);
  const [downloadedTempIdxs, setDownloadedTempIdxs] = useState<number[]>([]);
  const [searchMockQuery, setSearchMockQuery] = useState<string>('');

  const [activeTodoModal, setActiveTodoModal] = useState<'declaration' | 'transcript' | 'postponement' | 'docSign' | 'draft' | null>(null);
  const [showRemunerationModal, setShowRemunerationModal] = useState<boolean>(false);
  const [showAllRecentHearings, setShowAllRecentHearings] = useState<boolean>(false);
  const [signedDeclaration, setSignedDeclaration] = useState<boolean>(false);
  const [signedTranscript, setSignedTranscript] = useState<boolean>(false);
  const [approvedPostponement, setApprovedPostponement] = useState<boolean>(false);
  const [signedDoc, setSignedDoc] = useState<boolean>(false);
  const [draftedAward, setDraftedAward] = useState<boolean>(false);

  // Latest News / Latest Updates (最新动态) list data
  const newsList = [
    {
      title: "慎终如始守信仰初心，遵规守纪谱仲裁华章——广州仲裁委员会开展纪法专题党课暨警示教育大会",
      date: "2026-06-12",
      content: "为进一步推动党纪学习教育走深走实，引导广大党员干部、仲裁秘书筑牢拒腐防变思想防线，广州仲裁委员会举办纪法专题党课暨廉政警示教育大会。大会强调，全体仲裁人员要慎终如始守信仰初心，全面筑牢政治底线，严明工作纪律、审判廉洁纪律，时刻保持仲裁案件公正独立和阳光透明。同时，对数字平台办案系统、离线物理签名链盾加签规则等网络空间安全及勤勉履职进行了全方位强调部署。"
    },
    {
      title: "广州仲裁委员会（GZAC）获评2026年度‘亚太地区最具智慧化数字化先锋仲裁机构’大奖",
      date: "2026-06-08",
      content: "亚太商事法律峰会昨日宣布，广州仲裁委员会（GZAC）凭借其独创的‘APEC-ODR商事纠纷多元化解决数字工作站’、3D多维智能虚拟数字法庭、AI证据链解析及CACA强信存证系统，被授予‘年度智慧数字化先锋仲裁机构’。该奖项彰显了广仲在民商事互联网仲裁、跨国多元纠纷离线化解与数字治理等方面的全球领先水平与行业示范作用。"
    },
    {
      title: "首创多维离线加密签名链运行满月，广仲民商事电子仲裁文书实现秒级公链可信交互存证",
      date: "2026-06-01",
      content: "广州仲裁委推出的全国首个‘离线多维电子印章与手写签名防篡改双重校验加密链’上线运行满一个月。据统计，截至本月，已累计通过该技术完成500余份裁决书及调解文书的异地数字签署。该签名链与最高人民法院民商事诉讼保全系统以及多地中执系统实现可信数据同步，大幅削减了邮寄在途流转和人工复核周期，使得仲裁实体及程序结案效力提升超过70%。"
    }
  ];

  const [activeNewsIndex, setActiveNewsIndex] = useState<number>(0);
  const [showNewsDetailModal, setShowNewsDetailModal] = useState<boolean>(false);
  const [selectedNews, setSelectedNews] = useState<typeof newsList[0] | null>(null);

  // Auto vertical roll timer for newsList (every 4 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveNewsIndex(prev => (prev + 1) % newsList.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [newsList.length]);

  // Interactive advice ticker index
  const [tickerIndex, setTickerIndex] = useState<number>(0);
  const tickers = [
    "「中立公正，速裁决纷」 • 独立专业迅速，保护当事人机密信息",
    "「办案指引」: 法院协助保全措施已与全国民商事中控执行局实时联网对接",
    "「数字法庭」: 2026版多维数字法庭系统本月起全面支持离线远程签名审核机制",
    "「学术研究」: 裁决争议分析精解白皮书最新出版，可从'我的-法规库'中获取电子书"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTickerIndex(prev => (prev + 1) % tickers.length);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // Courthouse stopwatch ticker
  useEffect(() => {
    if (!activeVirtualCourtId) {
      setCourtTimer(104);
      return;
    }
    const interval = setInterval(() => {
      setCourtTimer(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeVirtualCourtId]);

  const formatSecs = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  // Filter recent hearings (nearest 3 days: 2026-06-11, 2026-06-12, 2026-06-13)
  const recentHearings = cases.flatMap(c => 
    (c.hearings || []).map(h => ({ 
      ...h, 
      caseId: c.id, 
      caseNo: c.caseNo, 
      caseTitle: c.title, 
      role: c.role,
      category: c.category,
      secretary: c.secretary || '李文浩',
      purpose: h.notes || '开庭'
    }))
  ).filter(h => (h.hearingTime.includes('2026-06-11') || h.hearingTime.includes('2026-06-12') || h.hearingTime.includes('2026-06-13')) && h.status === '待开庭')
   .sort((a, b) => a.hearingTime.localeCompare(b.hearingTime));

  const [selectedArticleIndex, setSelectedArticleIndex] = useState<number>(0);

  const featuredArticles = [
    {
      tag: "仲裁员须知",
      title: "关于加强规范仲裁员视频庭审行为的通知"
    },
    {
      tag: "仲裁员须知",
      title: "广州仲裁委员会仲裁员资格管理规定（2025年修订）"
    },
    {
      tag: "审理指引",
      title: "防范虚假仲裁审理指引"
    }
  ];

  const handleStatBlockClick = (status: CaseStatus | 'all') => {
    onFilterStatus(status);
    onNavigateToTab(1);
  };

  return (
    <div className="flex-1 bg-slate-50/75 flex flex-col relative overflow-y-auto no-scrollbar pb-5">
      
      {/* 1. TOP BRANDING DESIGN WITH COMPASSIONATE BLUE GRADIENT (Extended behind Logo and Premium Cards) */}
      <div className="bg-gradient-to-b from-[#DCEBFF] via-[#EEF5FF] to-slate-50/10 px-4 pt-3 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          {/* Top-left Banner Image */}
          <div className="flex items-center">
            <img
              src={import.meta.env.BASE_URL + "tu/bt-st.png"}
              
              className="h-7.5 object-contain"
              alt="banner"
              onError={(e) => {
                const img = e.currentTarget;
                if (img.src.endsWith('/tu/banner.png')) {
                  img.src = import.meta.env.BASE_URL + "tu/new-banner.png";
                } else if (img.src.endsWith('/tu/new-banner.png')) {
                  img.src = import.meta.env.BASE_URL + "tu/index-banner.png";
                } else if (img.src.endsWith('/tu/index-banner.png')) {
                  img.src = import.meta.env.BASE_URL + "tu/logo.png";
                }
              }}
            />
          </div>

          {/* Action dot menus */}
          <div className="flex items-center gap-2">
            {/* Message Action Icon with Red Indicator Dot */}
            <button
              id="header_message_btn"
              onClick={() => onNavigateToSubPage('notifications')}
              className="flex items-center gap-1 bg-white/95 hover:bg-slate-50 hover:border-slate-300 active:scale-95 border border-slate-200/50 rounded-full py-1 px-2.5 shadow-xs transition-all cursor-pointer relative group"
            >
              <div className="relative flex items-center justify-center">
                <i className="fa-solid fa-bell text-[#1E62EC] text-[11px] group-hover:scale-110 transition-transform"></i>
                <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 bg-rose-500 rounded-full ring-1 ring-white"></span>
              </div>
              <span className="text-[10px] font-black text-slate-700 tracking-tight leading-none">
                消息
              </span>
            </button>

            {/* WeChat mini program control widgets - click to toggle version */}
            <div 
              className="flex items-center gap-2 bg-white/90 rounded-full px-2.5 py-1 border border-slate-200/50 shadow-xs cursor-pointer hover:bg-white hover:border-slate-300 hover:shadow-sm transition-all duration-200 group"
              onClick={onToggleVersion}
              title="切换首页版本"
            >
              <span className="h-1.5 w-1.5 bg-slate-800 rounded-full group-hover:scale-110 transition-transform"></span>
              <span className="h-1.5 w-1.5 bg-slate-800 rounded-full group-hover:scale-110 transition-transform"></span>
              <span className="h-1.5 w-1.5 bg-slate-800 rounded-full group-hover:scale-110 transition-transform"></span>
              <div className="w-px h-3 bg-slate-300 mx-1"></div>
              <span className="h-2 w-2 rounded-full border-1.5 border-slate-800 group-hover:border-slate-600 transition-colors"></span>
            </div>
          </div>
        </div>

        {/* 3. HIGHD-FIDELITY THEMATIC BANNER (Styled like Reference Image's "阳光生态合作平台") */}
        <div className=" mt-5 bg-gradient-to-br from-[#E1EEFF] via-[#F4F9FF] to-[#FFFFFF] rounded-2xl border border-[#D0E2FF] p-4 flex items-center justify-between shadow-[0_8px_24px_rgba(30,98,236,0.06)] h-32 relative overflow-visible group select-none">
          <div className="flex flex-col justify-center text-left z-10 w-3/5">
           
            {/* Large Bold Title */}
            <span className="text-xl font-black text-slate-800 tracking-wider leading-none mb-1">
              立信铸就广仲
            </span>
            {/* Subtitle */}
            <span className="text-xl font-black text-slate-500 tracking-wider">
              创新赢得未来
            </span>
           
          </div>
          
          {/* Towering 3D Illustration on the Right */}
          <div className="absolute right-[-2px] bottom-[-2px] top-[-8px] w-2/5 flex items-end justify-end z-10 pr-1 select-none overflow-visible">
            <img
              src={import.meta.env.BASE_URL + "tu/xmy.png"}
              className="h-[105%] max-h-[7.25rem] w-auto object-contain pointer-events-none group-hover:-translate-y-1 transition-transform duration-300"
              alt="3D Building Infrastructure"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          {/* Glowing Halo */}
          <div className="absolute right-8 top-4 w-14 h-14 bg-blue-300/20 rounded-full blur-xl pointer-events-none"></div>
        </div>

        {/* 4. PREMIUM BENTO GRID LAYOUT (待办, 在办, 已结案 - Styled like Reference Image) */}
        <div className="grid grid-cols-2 gap-3  mt-5 select-none">
          {/* Left Column: 我的待办 (Tall card) */}
          <div 
            onClick={() => onNavigateToTab(2)}
            className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_6px_20px_rgba(30,98,236,0.03)] p-4 flex flex-col justify-between h-[11.25rem] relative overflow-hidden group hover:shadow-[0_10px_28px_rgba(30,98,236,0.08)] transition-all duration-300 cursor-pointer text-left"
          >
            {/* Top bar with Title & Red Pill */}
            <div>
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-lg font-black text-slate-800 tracking-tight">我的待办</span>
                <span className="px-2  bg-[#FF3B30] text-white text-[10px] font-black rounded-md shadow-[0_2px_8px_rgba(255,59,48,0.25)] flex items-center justify-center min-w-4 text-center">
                  {tasks.filter(t => t.status === 'pending').length}
                </span>
              </div>
              <span className="text-sm text-slate-400 font-medium tracking-wide">
                汇总各类流程待办
              </span>
            </div>

            {/* Bottom-left Arrow Indicator */}
            <div className="w-7 h-7 bg-slate-50 group-hover:bg-[#1E62EC] border border-slate-100 rounded-full flex items-center justify-center shadow-xs transition-all duration-300 z-10">
              <i className="fa-solid fa-chevron-right text-[9px] text-slate-400 group-hover:text-white transition-all duration-300"></i>
            </div>

            {/* Bottom-right checklist illustration */}
            <div className="absolute right-[-6px] bottom-[-6px] w-28 h-28 pointer-events-none select-none">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 to-red-100/40 rounded-full blur-sm opacity-80 group-hover:scale-105 transition-transform duration-300"></div>
              
              {/* Layered Document Sheets */}
              <div className="absolute right-8 bottom-7 bg-white border border-slate-100 shadow-[0_4px_12px_rgba(15,23,42,0.03)] w-13 h-15 rounded-xl rotate-[-12deg] p-1.5 flex flex-col justify-between group-hover:rotate-[-8deg] transition-all duration-300">
                <div className="space-y-1">
                  <div className="h-1 bg-rose-100 rounded-full w-full"></div>
                  <div className="h-1 bg-slate-100 rounded-full w-4/5"></div>
                  <div className="h-1 bg-slate-100 rounded-full w-2/3"></div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                  <span className="text-[5px] font-mono text-rose-500 font-bold">11:12</span>
                </div>
              </div>
              
              <div className="absolute right-5 bottom-4 bg-gradient-to-br from-[#FF8585] to-[#FF3B30] shadow-[0_4px_16px_rgba(255,59,48,0.15)] w-11 h-13 rounded-xl rotate-[6deg] p-1.5 flex flex-col justify-between group-hover:rotate-[2deg] transition-all duration-300">
                <div className="space-y-1">
                  <div className="h-1 bg-white/40 rounded-full w-full"></div>
                  <div className="h-1 bg-white/20 rounded-full w-3/4"></div>
                  <div className="h-1 bg-white/20 rounded-full w-1/2"></div>
                </div>
                <div className="flex justify-between items-center">
                  <i className="fa-solid fa-circle-check text-[8px] text-white"></i>
                  <div className="w-3.5 h-3.5 bg-white/20 rounded-full flex items-center justify-center">
                    <span className="text-[5px] text-white font-bold font-sans">99+</span>
                  </div>
                </div>
              </div>

              
            </div>
          </div>

          {/* Right Column: Stacked 在办案件 & 已结案 */}
          <div className="flex flex-col gap-3 min-w-0">
            {/* Card 1: 在办案件 */}
            <div 
              onClick={() => handleStatBlockClick('审理中')}
              className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_6px_20px_rgba(30,98,236,0.02)] p-3.5 flex items-center justify-between h-[5.35rem] relative overflow-hidden group hover:shadow-[0_8px_20px_rgba(30,98,236,0.05)] transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base font-black text-slate-800 tracking-tight shrink-0">在办</span>
                  <span className="text-[10px] font-extrabold text-[#1E62EC] bg-[#E1EEFF] px-2  rounded-md shrink-0 scale-90 origin-left">
                    {profile.activeCount}
                  </span>
                </div>
                <span className="text-sm text-slate-400 font-medium block truncate">
                  在办案件
                </span>
              </div>
              
              {/* Right side check icon illustration - High-fidelity style referencing left side, scaled down */}
              <div className="w-12 h-12 relative shrink-0 overflow-visible select-none pointer-events-none mr-0.5">
                {/* Background glow circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 to-indigo-100/40 rounded-full blur-xs group-hover:scale-110 transition-transform duration-300"></div>
                
                {/* Document/Case Folder Illustration */}
                <div className="absolute right-3.5 bottom-2.5 bg-white border border-slate-100 shadow-[0_2px_6px_rgba(15,23,42,0.04)] w-5.5 h-7 rounded-md rotate-[-10deg] p-0.5 flex flex-col justify-between group-hover:rotate-[-6deg] transition-all duration-300">
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-blue-100 rounded-full w-full"></div>
                    <div className="h-0.5 bg-slate-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-0.5 rounded-full bg-blue-400"></span>
                    <span className="text-[3px] font-mono text-slate-400 font-bold">CASE</span>
                  </div>
                </div>

                <div className="absolute right-1 bottom-1 bg-gradient-to-br from-[#4D94FF] to-[#1E62EC] shadow-[0_2px_8px_rgba(30,98,236,0.18)] w-5 h-6.5 rounded-md rotate-[8deg] p-0.5 flex flex-col justify-between group-hover:rotate-[4deg] transition-all duration-300">
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-white/40 rounded-full w-full"></div>
                    <div className="h-0.5 bg-white/20 rounded-full w-2/3"></div>
                  </div>
                  <i className="fa-solid fa-gavel text-[6px] text-white self-end"></i>
                </div>

                
              </div>
            </div>

            {/* Card 2: 已结案 */}
            <div 
              onClick={() => handleStatBlockClick('已结案')}
              className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_6px_20px_rgba(30,98,236,0.02)] p-3.5 flex items-center justify-between h-[5.35rem] relative overflow-hidden group hover:shadow-[0_8px_20px_rgba(30,98,236,0.05)] transition-all duration-300 cursor-pointer text-left"
            >
              <div className="flex-1 min-w-0 pr-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="text-base font-black text-slate-800 tracking-tight shrink-0">结案</span>
                  <span className="text-[10px] font-extrabold text-[#FF8E53] bg-[#FFEFE5] px-2  rounded-md shrink-0 scale-90 origin-left">
                    {profile.resolvedCount}
                  </span>
                </div>
                <span className="text-sm text-slate-400 font-medium block truncate">
                  累计结案
                </span>
              </div>

              {/* Right side checked archive illustration - High-fidelity style referencing left side, scaled down */}
              <div className="w-12 h-12 relative shrink-0 overflow-visible select-none pointer-events-none mr-0.5">
                {/* Background glow circle */}
                <div className="absolute inset-0 bg-gradient-to-br from-orange-50/70 to-amber-100/40 rounded-full blur-xs group-hover:scale-110 transition-transform duration-300"></div>
                
                {/* Archive File Illustration */}
                <div className="absolute right-3.5 bottom-2.5 bg-white border border-slate-100 shadow-[0_2px_6px_rgba(15,23,42,0.04)] w-5.5 h-7 rounded-md rotate-[-10deg] p-0.5 flex flex-col justify-between group-hover:rotate-[-6deg] transition-all duration-300">
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-orange-100 rounded-full w-full"></div>
                    <div className="h-0.5 bg-slate-100 rounded-full w-4/5"></div>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <span className="w-0.5 h-0.5 rounded-full bg-orange-400"></span>
                    <span className="text-[3px] font-mono text-slate-400 font-bold">DONE</span>
                  </div>
                </div>

                <div className="absolute right-1 bottom-1 bg-gradient-to-br from-[#FFAB73] to-[#FF8E53] shadow-[0_2px_8px_rgba(255,142,83,0.18)] w-5 h-6.5 rounded-md rotate-[8deg] p-0.5 flex flex-col justify-between group-hover:rotate-[4deg] transition-all duration-300">
                  <div className="space-y-0.5">
                    <div className="h-0.5 bg-white/40 rounded-full w-full"></div>
                    <div className="h-0.5 bg-white/20 rounded-full w-2/3"></div>
                  </div>
                  <i className="fa-solid fa-check-double text-[6px] text-white self-end"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main flow wrapper */}
      <div className="flex-1 flex flex-col ">

        {/* 7. PROMOTIONAL SLIDER BANNER (最新动态 - 垂直滚屏跑马灯效果，显示 newsList) */}
        <div className="mx-4 my-2.5 bg-gradient-to-r from-blue-50/40 via-indigo-50/20 to-white rounded-2xl border border-slate-100 shadow-[0_4px_18px_rgba(15,23,42,0.03)] pr-10 pl-22 shrink-0 flex items-center relative overflow-hidden text-left h-13 group select-none">
          {/* Left trapezoid tab showing "动态" */}
          <div 
            className="absolute left-0 top-0 bottom-0 w-18 bg-gradient-to-b from-[#1E62EC] via-[#2F73F6] to-[#1048B5] flex flex-col justify-center items-center text-white select-none z-10"
            style={{ clipPath: 'polygon(0 0, 100% 0, 75% 100%, 0 100%)' }}
          >
            <div className="flex flex-col items-center justify-center pr-2 font-sans">
              <span className="text-lg font-black tracking-widest leading-none drop-shadow-[0_1px_1.5px_rgba(0,0,0,0.18)] text-center w-full">动态</span>
            </div>
          </div>

          {/* Marquee viewport rolling context of newsList */}
          <div className="flex-1 relative h-9 overflow-hidden z-10">
            {newsList.map((item, index) => {
              const isActive = index === activeNewsIndex;
              return (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedNews(item);
                    setShowNewsDetailModal(true);
                  }}
                  className={`absolute inset-0 flex flex-col justify-center cursor-pointer transition-all duration-500 ease-in-out transform ${
                    isActive 
                      ? "opacity-100 translate-y-0 scale-100 pointer-events-auto" 
                      : index < activeNewsIndex
                        ? "opacity-0 -translate-y-6 scale-95 pointer-events-none"
                        : "opacity-0 translate-y-6 scale-95 pointer-events-none"
                  }`}
                >
                  {/* Title of newsList - Support exactly 2 lines */}
                  <h4 className="text-base font-medium text-slate-800 hover:text-[#1E62EC] active:text-[#1048B5] transition-colors pr-1 line-clamp-2 break-all overflow-hidden leading-tight whitespace-normal w-full">
                    {item.title}
                  </h4>
                </div>
              );
            })}
          </div>

          {/* Vertical scroll pager dots on the right */}
          <div className="absolute right-3.5 flex flex-col gap-1 z-20 justify-center h-full">
            {newsList.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveNewsIndex(idx);
                }}
                className={`w-1 rounded-full transition-all duration-300 ${
                  activeNewsIndex === idx ? 'h-3 bg-[#1E62EC]' : 'h-1.5 bg-slate-200 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* 9. RECENT HEARINGS TIMELINE BLOCK (Keep it elegant as secondary scroll list) */}
        <div className="mx-4 my-2.5 bg-white rounded-2xl border border-slate-100 shadow-[0_6px_24px_rgba(15,23,42,0.02)] p-4 text-left">
          <div className="flex justify-between items-center mb-3.5 px-0.5">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-indigo-500 rounded-full inline-block"></span>
              <span>近3天待开庭日程</span>
            </span>
            <span className="text-[10px] text-amber-600 bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded ">
              {recentHearings.length} 场待开庭
            </span>
          </div>

          {/* Render hearings in timeline format */}
          {recentHearings.length > 0 ? (
            <div className="space-y-3">
              <div className="relative border-l-2 border-indigo-50/60 ml-2.5 pr-0.5 pl-4 space-y-4 pb-1.5">
                {(showAllRecentHearings ? recentHearings : recentHearings.slice(0, 3)).map((hearing, idx) => {
                  const matchedCase = cases.find(c => c.id === hearing.caseId);
                  const claimant = matchedCase?.claimant || '华夏科技';
                  const respondent = matchedCase?.respondent || '蓝海创投';
                  
                  let badgeText = "即将开庭";
                  let badgeStyle = "bg-amber-50 text-amber-600 border-amber-100";
                  let dotCircleStyle = "bg-amber-500 ring-4 ring-amber-100/50";
                  
                  if (hearing.hearingTime.includes('2026-06-11')) {
                    if (idx === 0) {
                      badgeText = "今天开庭";
                      badgeStyle = "bg-rose-50/60 text-rose-500 border-rose-150/45";
                      dotCircleStyle = "bg-rose-300 ring-4 ring-rose-100/30";
                    } else {
                      badgeText = "本日后续";
                      badgeStyle = "bg-amber-50 text-amber-600 border-amber-100";
                      dotCircleStyle = "bg-amber-500 ring-4 ring-amber-100/50";
                    }
                  } else if (hearing.hearingTime.includes('2026-06-12')) {
                    badgeText = "明天开庭";
                    badgeStyle = "bg-indigo-50 text-indigo-600 border-indigo-100";
                    dotCircleStyle = "bg-indigo-500 ring-4 ring-indigo-50";
                  } else {
                    badgeText = "后天开庭";
                    badgeStyle = "bg-slate-50 text-slate-600 border-slate-200";
                    dotCircleStyle = "bg-slate-400 ring-4 ring-slate-100";
                  }

                  return (
                    <div
                      key={hearing.id}
                      onClick={() => {
                        if (matchedCase) onSelectCase(matchedCase);
                      }}
                      className="relative bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-[0_4px_16px_rgba(30,98,236,0.05)] p-3 shadow-xs transition-all flex flex-col gap-2.5 cursor-pointer"
                    >
                      {/* Timeline Node Ring & Dot */}
                      <div className="absolute -left-[22.5px] top-5.5 flex items-center justify-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${dotCircleStyle} transition-all`}></span>
                      </div>

                      {/* Timeline Card Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-[10px]  px-1.5 py-0.5 rounded border leading-none shrink-0 ${badgeStyle}`} >
                            {badgeText}
                          </span>
                          <span className="text-base  text-slate-800 truncate" >
                            {hearing.caseNo}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Details */}
                      <div className="text-sm text-slate-500 gap-y-1">
                        <div className="flex items-start gap-0.5 min-w-0 pb-1">
                          <span className="text-slate-400 shrink-0 w-[60px]">申请人：</span>
                          <span className="truncate text-slate-700 font-medium">{claimant}</span>
                        </div>
                        <div className="flex items-start gap-0.5 min-w-0 pb-1">
                          <span className="text-slate-400 shrink-0 w-[60px]">被申请人：</span>
                          <span className="truncate text-slate-700 font-medium">{respondent}</span>
                        </div>
                        <div className="flex items-start gap-0.5 min-w-0 pb-1">
                          <span className="text-slate-400 shrink-0 w-[60px]">时间：</span>
                          <span className="truncate text-[#1E62EC] font-semibold">{hearing.hearingTime}</span>
                        </div>
                        <div className="flex items-start  gap-0.5 min-w-0 pb-1">
                          <span className="text-slate-400 shrink-0 w-[60px]">开庭地点：</span>
                          <span className="truncate text-slate-700 font-medium">{hearing.location}</span>
                        </div>
                        <div className="flex items-start gap-0.5 min-w-0 pb-1">
                          <span className="text-slate-400 shrink-0 w-[60px]">办案秘书：</span>
                          <span className="truncate text-slate-700 font-medium">{hearing.secretary}</span>
                        </div>
                        <div className="flex items-start gap-0.5 min-w-0 leading-normal">
                          <span className="text-slate-400 shrink-0 w-[60px]">开庭用途：</span>
                          <span className="truncate text-slate-700 font-medium">{hearing.purpose}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View More Button */}
              {recentHearings.length > 3 && (
                <div className="pt-1">
                  {!showAllRecentHearings ? (
                    <button
                      onClick={() => setShowAllRecentHearings(true)}
                      className="w-full bg-[#F4F8FE] hover:bg-[#EBF3FF] text-[#1E62EC] font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer border border-indigo-100 flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>展开更多 ({recentHearings.length - 3}场)</span>
                      <i className="fa-solid fa-chevron-down text-[10px]"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAllRecentHearings(false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer border border-slate-200 flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>收起开庭</span>
                      <i className="fa-solid fa-chevron-up text-[10px]"></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200/60 p-5 text-center">
              <p className="text-sm text-slate-400 font-medium font-sans">近期暂无待开庭日程</p>
            </div>
          )}
        </div>

      </div>

        {/* 5. GZAC 8-MODULE SERVICES MICRO-GRID (近期待办 5个模块 & 常用功能 3个模块) */}
        <div className="mx-4 my-2.5 bg-white rounded-2xl border border-slate-100 shadow-[0_6px_24px_rgba(15,23,42,0.02)] p-4 text-left">
          <div className="flex justify-between items-center mb-4.5 px-0.5">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-[#1E62EC] rounded-full inline-block"></span>
              <span>近期待办</span>
            </span>
            <span className="text-[10px] text-rose-500 bg-rose-50/70 border border-rose-100 px-2 py-0.5 rounded ">
              { (signedDeclaration ? 0 : 1) + (signedTranscript ? 0 : 2) + (approvedPostponement ? 0 : 1) + (signedDoc ? 0 : 1) + (draftedAward ? 0 : 3) } 项待办
            </span>
          </div>

          <div className="grid grid-cols-3 gap-y-4 gap-x-1">
            {[
              {
                id: 'declaration',
                label: '声明承诺书',
                icon: 'fa-file-shield text-[#009688]',
                badgeCount: !signedDeclaration ? 1 : 0,
                colorBg: 'bg-teal-50/60',
                action: () => onNavigateToSubPage('declarationList')
              },
              {
                id: 'transcript',
                label: '笔录签名',
                icon: 'fa-signature text-[#FF5722]',
                badgeCount: !signedTranscript ? 2 : 0,
                colorBg: 'bg-orange-50/60',
                action: () => onNavigateToSubPage('transcriptSignature')
              },
              {
                id: 'postponement',
                label: '延期审批',
                icon: 'fa-clock-rotate-left text-[#FF9800]',
                badgeCount: !approvedPostponement ? 1 : 0,
                colorBg: 'bg-amber-50/60',
                action: () => onNavigateToSubPage('postponementApproval')
              },
              {
                id: 'docSign',
                label: '文书签名',
                icon: 'fa-file-signature text-[#3F51B5]',
                badgeCount: !signedDoc ? 1 : 0,
                colorBg: 'bg-indigo-50/60',
                action: () => onNavigateToSubPage('docSignatureList' as any)
              },
              {
                id: 'draft',
                label: '草拟裁决书',
                icon: 'fa-file-pen text-[#E91E63]',
                badgeCount: !draftedAward ? 3 : 0,
                colorBg: 'bg-rose-50/60',
                action: () => onNavigateToSubPage('draftAwardList' as any)
              }
            ].map((srv) => (
              <button
                key={srv.id}
                onClick={srv.action}
                className="flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100 py-1.5 rounded-xl active:scale-95 group relative"
              >
                {/* Micro round background wrapper with soft gradient color */}
                <div className={`relative w-11 h-11 ${srv.colorBg} rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105`}>
                  <i className={`fa-solid ${srv.icon} text-lg`}></i>
                  
                  {/* Digital notifications */}
                  {srv.badgeCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-rose-500 rounded-full border border-white text-[9px] font-bold text-white shadow-xs">
                      {srv.badgeCount}
                    </span>
                  )}
                </div>

                <span className="text-sm font-bold text-slate-700 leading-none tracking-tight group-hover:text-[#1E62EC] transition-colors truncate w-full text-center">
                  {srv.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 6. COMMON CHANNELS MICRO-GRID (常用功能 - 样式参考“近期待办”，功能为：统计中心、酬金单、我的聘书) */}
        <div className="mx-4 my-2.5 bg-white rounded-2xl border border-slate-100 shadow-[0_6px_24px_rgba(15,23,42,0.02)] p-4 text-left">
          <div className="flex justify-between items-center mb-4.5 px-0.5">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-1.5">
              <span className="w-1 h-3.5 bg-[#1E62EC] rounded-full inline-block"></span>
              <span>常用功能</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-y-4 gap-x-3">
            {[
              {
                id: 'stats',
                label: '统计中心',
                icon: 'fa-chart-pie text-[#9C27B0]',
                colorBg: 'bg-purple-50/70',
                action: () => onNavigateToSubPage('statsCenter')
              },
              {
                id: 'remuneration',
                label: '酬金单',
                icon: 'fa-money-check-dollar text-[#4CAF50]',
                colorBg: 'bg-emerald-50/60',
                action: () => onNavigateToSubPage('remuneration')
              },
              {
                id: 'mycert',
                label: '我的聘书',
                icon: 'fa-id-card text-[#E91E63]',
                colorBg: 'bg-rose-50/50',
                action: () => onNavigateToSubPage('appointment')
              }
            ].map((srv) => (
              <button
                key={srv.id}
                onClick={srv.action}
                className="flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100 py-1.5 rounded-xl active:scale-95 group relative"
              >
                {/* Micro round background wrapper with soft gradient color */}
                <div className={`relative w-11 h-11 ${srv.colorBg} rounded-2xl flex items-center justify-center mb-1.5 transition-transform group-hover:scale-105`}>
                  <i className={`fa-solid ${srv.icon} text-lg`}></i>
                </div>

                <span className="text-sm font-bold text-slate-700 leading-none tracking-tight group-hover:text-[#1E62EC] transition-colors truncate w-full text-center">
                  {srv.label}
                </span>
              </button>
            ))}
          </div>
        </div>


        

        {/* 8. "为你精选" RECOMMENDATION LIST (With functional "旋转换一换" Refresh action) */}
        <div className="mx-4 my-2.5 bg-white rounded-2xl border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.02)] p-4 text-left">
          <div className="flex justify-between items-center mb-4.5 px-0.5">
            <span className="text-lg font-extrabold text-slate-800 flex items-center gap-1.5">
              <i className="fa-solid fa-compass text-sky-500"></i>
              <span>为你精选 • 仲裁知识</span>
            </span>

            {/* Refresh / Rotation action matching mockup */}
            <button
              onClick={() => {
                setSelectedArticleIndex((prev) => (prev + 1) % featuredArticles.length);
              }}
              className="flex items-center gap-1 text-sm font-bold text-[#1E62EC] hover:text-[#174FCE] cursor-pointer"
            >
              <i className="fa-solid fa-arrows-rotate text-[10px] animate-spin-slow"></i>
              <span>换一换</span>
            </button>
          </div>

          {/* Render selected article inside list */}
          <div 
            onClick={() => {
              alert(`正在为您加载「${featuredArticles[selectedArticleIndex].title}」全文内容。您可以随时在《案审指引》中查阅更多详细资料。`);
            }}
            className="bg-gradient-to-br from-slate-50/70 via-slate-50/40 to-white/90 hover:from-blue-50/30 hover:to-indigo-50/10 border border-slate-100 hover:border-blue-100/50 rounded-2xl p-4 transition-all text-left group cursor-pointer shadow-[0_2px_8px_rgba(15,23,42,0.01)] hover:shadow-[0_4px_16px_rgba(30,98,236,0.04)]"
          >
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black px-2 py-0.5 bg-blue-50 text-[#1E62EC] rounded-md scale-95 origin-left">
                  {featuredArticles[selectedArticleIndex].tag}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGuideModal(true);
                }}
                className="text-sm text-[#1E62EC] hover:text-[#1148B5] font-black flex items-center gap-0.5 hover:underline transition-colors cursor-pointer"
              >
                <span>更多内容</span>
                <i className="fa-solid fa-angle-right text-[9px] transition-transform group-hover:translate-x-0.5"></i>
              </button>
            </div>
            <h5 className="text-base font-black text-slate-800 leading-relaxed group-hover:text-[#1E62EC] transition-colors mb-2.5">
              {featuredArticles[selectedArticleIndex].title}
            </h5>
            
           
          </div>
        </div>

        

      {/* 最新动态详情弹框 */}
      {showNewsDetailModal && selectedNews && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-sm font-bold flex items-center gap-2 font-sans">
                <i className="fa-solid fa-bullhorn text-amber-400"></i>
                <span>动态详情</span>
              </span>
              <button 
                onClick={() => {
                  setShowNewsDetailModal(false);
                  setSelectedNews(null);
                }}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed no-scrollbar flex-1">
              <h4 className="font-extrabold text-slate-900 text-base leading-snug">
                {selectedNews.title}
              </h4>
              <div className="flex items-center gap-2 text-sm text-slate-400 font-mono">
                <span>发布日期: {selectedNews.date}</span>
                <span>•</span>
                <span>信源: 广州仲裁委员会</span>
              </div>
              <div className="w-full h-px bg-slate-100"></div>
              <p className="text-sm text-slate-500 font-sans leading-relaxed text-justify whitespace-pre-wrap">
                {selectedNews.content}
              </p>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => {
                  setShowNewsDetailModal(false);
                  setSelectedNews(null);
                }}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 1. 裁决书及案例 */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <i className="fa-solid fa-file-lines text-emerald-400"></i>
                <span>广州仲裁委裁决书模版与示范案例库</span>
              </span>
              <button 
                onClick={() => setShowTemplateModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-500 leading-relaxed no-scrollbar flex-1">
              <p className="text-slate-500 text-xs">您可以随时在此调阅裁决书官方标准样本及过往示范性经典仲裁判决案例。</p>
              
              <div className="space-y-2.5">
                {[
                  { id: 1, name: '《民商事仲裁案件裁决书标准模版》', size: '124 KB', hash: 'GZAC-TEMP-01' },
                  { id: 2, name: '《大额建设工程合同纠纷示范案例》', size: '158 KB', hash: 'GZAC-CASE-01' },
                  { id: 3, name: '《合议庭开庭评议纪要规范格式》', size: '85 KB', hash: 'GZAC-TEMP-02' },
                  { id: 4, name: '《国际多式联运货代纠纷示范案例》', size: '142 KB', hash: 'GZAC-CASE-02' }
                ].map((doc) => {
                  const isDownloaded = downloadedTempIdxs.includes(doc.id);
                  return (
                    <div key={doc.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between hover:border-indigo-200 transition-all">
                      <div className="space-y-0.5 flex-1 min-w-0 pr-2">
                        <h6 className="font-extrabold text-slate-800 text-base truncate">{doc.name}</h6>
                        <p className="text-sm text-slate-500 font-mono">大小: {doc.size} • 校验哈希: {doc.hash}</p>
                      </div>
                      <button 
                        onClick={() => {
                          if (!isDownloaded) {
                            setDownloadedTempIdxs(prev => [...prev, doc.id]);
                          }
                        }}
                        className={`p-1.5 px-3 rounded-lg text-xs font-black cursor-pointer transition-all ${
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
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                关闭窗口
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. 仲裁指引 */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
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
            
            <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-500 leading-relaxed no-scrollbar flex-1">
              <p className="text-slate-500 text-xs">请各位仲裁员严格恪守《广仲办案守则和工作流细则》，确保案件高效结案。</p>
              
              <div className="relative border-l border-indigo-100 pl-4 ml-2 space-y-4">
                {[
                  { step: '01', title: '案件受理与组庭分派', desc: '办案秘书核验申请材料及管辖约定并成立合议庭' },
                  { step: '02', title: '送达答辩与反诉审查', desc: '被申请人在15工作日内提交答辩，并审核是否存在反诉' },
                  { step: '03', title: '组庭评议及预备会议', desc: '首席/独任仲裁员召集沟通关键事实重点与争议争端焦点' },
                  { step: '04', title: '庭审辩论与最终合议', desc: '举行庭期并确保当事人享有充足辩论权，庭后合议评议落实' },
                  { step: '05', title: '裁决草拟并签定 CACA', desc: '首席草拟裁决报告并交由全体庭员进行数字证书盾级合议签署' }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[25px] top-0 h-4.5 w-4.5 rounded-full bg-indigo-50 border border-indigo-400 text-indigo-700 font-extrabold text-xs flex items-center justify-center font-mono">
                      {item.step}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-extrabold text-slate-800 text-base">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-normal">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowGuideModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
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
                <span>"智慧广仲"云联数字工作台入口</span>
              </span>
              <button 
                onClick={() => setShowOfficialWebModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 text-sm text-slate-500 leading-relaxed no-scrollbar bg-slate-50 flex-1">
              <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-4 rounded-2xl text-white text-center space-y-1 shadow-sm">
                <h4 className="text-sm font-black tracking-widest font-sans">广州仲裁委员会智慧云平台</h4>
                <p className="text-2xs opacity-80 font-mono">ONLINE SMART PLATFORM FOR GZAC • EST. 1995</p>
                <div className="w-12 h-0.5 bg-yellow-500 mx-auto my-1"></div>
                <div className="text-xs bg-white/15 px-2.5 py-1 rounded-lg inline-block text-amber-300 font-extrabold mt-1">
                  服务大厅内网互联中台
                </div>
              </div>

              <div className="space-y-3">
                <h5 className="font-extrabold text-slate-700 text-xs flex items-center gap-1.5 pl-1">
                  <span className="w-1 h-3 bg-indigo-600 rounded-full"></span>
                  <span>常用数字网络服务节点</span>
                </h5>
                
                <div className="grid grid-cols-2 gap-3">
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
                        <span className="text-xs font-extrabold text-slate-800 block group-hover:text-indigo-600 leading-none">{srv.title}</span>
                        <span className="text-2xs text-slate-500 block font-medium leading-tight">{srv.desc}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-2.5 rounded-xl text-xs text-blue-700 flex items-start gap-1.5">
                <i className="fa-solid fa-circle-info text-blue-500 mt-0.5 flex-shrink-0"></i>
                <p className="leading-normal font-semibold">
                  温馨提示：由于平台处于保密测试域环境下运作，以上功能采用专线信道与广州仲裁委核心数据库加密握手。点击将跳转至官方政务系统。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowOfficialWebModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                我知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. 仲裁员须知 */}
      {showOpsModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-xs font-bold flex items-center gap-1.5 font-sans">
                <i className="fa-solid fa-sliders text-violet-400"></i>
                <span>广州仲裁委员会仲裁员须知</span>
              </span>
              <button 
                onClick={() => setShowOpsModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                ✕
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-550 leading-relaxed no-scrollbar flex-1 font-sans">
              <div className="space-y-3.5">
                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-tie text-indigo-600"></i>
                  <span>一、职业操守与勤勉审理</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  仲裁员应当独立、公正、廉洁审判。在案件分配及审理各个阶段，需维护仲裁程序的保密性，高效推动言词辩论、质证等程序。
                </p>

                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-indigo-600"></i>
                  <span>二、回避义务与合议规范</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  仲裁员如遇可能影响案件独立、公正审裁的情况，须第一时间内履行披露甚至主动回避义务。合议庭讨论必须于保密线上非公开渠道闭门进行。
                </p>

                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-square-poll-vertical text-indigo-600"></i>
                  <span>三、智能审评辅助使用建议</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  仲裁员可通过穗仲数字化审判工作台进行智能格式校验、证据要素一键归类提取与电子签名，以达到缩短案审流程，最优化推进快速结案。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowOpsModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                已全部知悉并掌握
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. VIRTUAL DIGITAL COURTROOM SYSTEM */}
      {activeVirtualCourtId && (
        <div className="fixed inset-0 bg-[#0B0F19] z-[95] flex flex-col animate-fade-in text-left text-slate-100 overflow-hidden font-sans">
          
          {/* Top Status Header */}
          <div className="h-14 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between px-4 relative flex-shrink-0">
            <div className="flex items-center space-x-2.5">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <div className="text-sm font-black tracking-wider text-[#F59E0B] uppercase">
                智云数字法庭入口
              </div>
            </div>
            
            <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-slate-400 tracking-widest hidden xs:block">
              广州仲裁委员会 • 在线加密开庭
            </div>

            <button 
              onClick={() => {
                setActiveVirtualCourtId(null);
                setIsSigningMode(false);
                setIsSigningFinish(false);
              }}
              className="text-xs bg-slate-800 border border-slate-700/60 hover:bg-slate-700 text-slate-300 font-extrabold py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
            >
              ✕ 退出审理室
            </button>
          </div>

          {/* Sub-Header Widget: Selected Case Info & Realtime Countdown */}
          <div className="bg-[#111827] border-b border-indigo-950/40 p-3 px-4 flex items-center justify-between text-xs flex-shrink-0">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-[#F3F4F6] text-sm font-mono">
                  (2026)穗仲案字第0521号
                </span>
                <span className="text-2xs bg-indigo-500/10 text-indigo-300 border border-indigo-400/20 px-1 py-0.2 rounded font-black font-sans uppercase">
                  深核质辩段
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate max-w-[240px]">
                关于宏图建筑与润物高科智能产业园主体建设工程纠纷案
              </p>
            </div>
            
            <div className="flex items-center space-x-2 bg-slate-800/60 border border-slate-700/50 px-2.5.5 py-1 rounded-xl">
              <i className="fa-regular fa-clock text-[#10B981] text-xs"></i>
              <span className="text-sm font-mono font-black text-emerald-400">{formatSecs(courtTimer)}</span>
            </div>
          </div>

          {/* Core Interactive Layout (Vertical flow for mobile, beautifully stacked) */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5 flex flex-col">
            
            {/* 2X2 MULTI-TILED VIDEO FEEDS OF TRIAL */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              
              {/* Tile 1: Arbitrator (Me) */}
              <div className="bg-[#111827] border border-indigo-500/30 rounded-2xl p-3 aspect-video relative overflow-hidden flex flex-col justify-between shadow-lg">
                {/* Simulated digital scanning effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/2 to-transparent pointer-events-none" />
                <div className="absolute right-2 top-2 bg-indigo-600 text-2xs text-white px-2.5 py-1 rounded font-black font-mono">
                  首席仲裁员 (我)
                </div>
                
                {/* Dummy Video Center placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  <div className="relative mb-1">
                    <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-indigo-400 flex items-center justify-center font-black text-xs text-indigo-200">
                      张
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-[#111827] rounded-full"></span>
                  </div>
                  <span className="text-xs font-black text-slate-300 font-sans">张明 资深委员</span>
                </div>

                <div className="flex justify-between items-center text-2xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-microphone text-emerald-400"></i> 音频联通中
                  </span>
                  <span className="font-mono text-indigo-400">CA-0925</span>
                </div>
              </div>

              {/* Tile 2: Secretary */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-3 aspect-video relative overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="absolute right-2 top-2 bg-slate-800 text-2xs text-slate-300 px-2.5 py-1 rounded font-black font-mono">
                  书记员 (李秘书)
                </div>
                
                {/* Dummy Video Center placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  <div className="relative mb-1">
                    <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-xs text-slate-300">
                      李
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-[#111827] rounded-full"></span>
                  </div>
                  <span className="text-xs font-black text-slate-300 font-sans">李文浩 办案秘书</span>
                </div>

                <div className="flex justify-between items-center text-2xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-file-invoice text-indigo-400 animate-pulse"></i> 笔录智能速录中
                  </span>
                  <span className="font-mono text-slate-500">GZ-9541</span>
                </div>
              </div>

              {/* Tile 3: Claimant Agent */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-3 aspect-video relative overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="absolute right-2 top-2 bg-slate-800 text-2xs text-slate-300 px-2.5 py-1 rounded font-black font-mono">
                  申请人代理人
                </div>
                
                {/* Dummy Video Center placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  <div className="relative mb-1">
                    <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-xs text-slate-300">
                      律
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-[#111827] rounded-full animate-pulse"></span>
                  </div>
                  <span className="text-xs font-black text-slate-400 font-sans">李大双 资深律师</span>
                </div>

                <div className="flex justify-between items-center text-2xs text-slate-500">
                  <span className="flex items-center gap-1 text-amber-300">
                    <i className="fa-solid fa-volume-high"></i> 陈述举证质证中
                  </span>
                  <span className="font-mono text-slate-500">众信律所</span>
                </div>
              </div>

              {/* Tile 4: Respondent Agent */}
              <div className="bg-[#111827] border border-slate-800 rounded-2xl p-3 aspect-video relative overflow-hidden flex flex-col justify-between shadow-lg">
                <div className="absolute right-2 top-2 bg-slate-800 text-2xs text-slate-300 px-2.5 py-1 rounded font-black font-mono">
                  被申请人代理人
                </div>
                
                {/* Dummy Video Center placeholder */}
                <div className="flex-1 flex flex-col items-center justify-center pt-2">
                  <div className="relative mb-1">
                    <div className="w-11 h-11 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-black text-xs text-slate-300">
                      辩
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 border border-[#111827] rounded-full"></span>
                  </div>
                  <span className="text-xs font-black text-slate-400 font-sans">王利 专职律师</span>
                </div>

                <div className="flex justify-between items-center text-2xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <i className="fa-solid fa-microphone"></i> 闭音等待质证
                  </span>
                  <span className="font-mono text-slate-500">君合律所</span>
                </div>
              </div>

            </div>

            {/* LIVE VOICE-TO-TEXT DIALOGUE ACCORDION */}
            <div className="flex-1 bg-[#111827]/80 border border-slate-800 rounded-3xl p-3.5 flex flex-col overflow-hidden shadow-2xl min-h-[160px]">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-2 flex-shrink-0">
                <div className="flex items-center gap-1.5">
                  <span className="inline-block p-1 bg-indigo-500/10 text-indigo-400 rounded-lg">
                    <i className="fa-solid fa-microphone-lines text-xs"></i>
                  </span>
                  <span className="text-xs font-black text-slate-100">声纹动态自动转写笔录</span>
                </div>
                <span className="text-2xs font-mono text-slate-500 uppercase font-black">
                  REAL-TIME V2T FEED
                </span>
              </div>

              {/* Dialogue Container */}
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar text-left text-xs">
                
                {/* Transcript Dialogues */}
                <div className="space-y-3">
                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80">
                    <span className="font-extrabold text-[#3B82F6] block text-xs">李秘 (办案秘书)</span>
                    <p className="text-slate-300 leading-relaxed mt-0.5">
                      广州仲裁委员会第三数字开庭室，已根据合议庭指令完成多路视频加密建连。两端当事人及诉讼代理人均已成功实名登录，且通过广州CA存证密钥对齐双向授权。本庭开庭！
                    </p>
                  </div>

                  <div className="bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800/80">
                    <span className="font-extrabold text-emerald-400 block text-xs">张首席 (首席仲裁员)</span>
                    <p className="text-slate-300 leading-relaxed mt-0.5">
                      申请人、被申请人：今天对宏图建筑与润物高科智能产业园二期主体建设工程纠纷案开庭审判。双方对合议庭成员是否有回避申请？
                    </p>
                  </div>

                  <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/40">
                    <span className="font-extrabold text-[#3B82F6] block text-xs">李律师 (申请人口头代表)</span>
                    <p className="text-slate-300 leading-relaxed mt-0.5">
                      不申请回避。我们在纠纷反驳书中主张：由于对方润物高科由于地质环境评估失误且设计图纸迟延送达超过85天，工期顺延属合同免责原因。
                    </p>
                  </div>

                  <div className="bg-slate-900/40 p-2.5 rounded-2xl border border-slate-800/40">
                    <span className="font-extrabold text-red-400 block text-xs">王律师 (被申请人口头代表)</span>
                    <p className="text-slate-300 leading-relaxed mt-0.5">
                      我方重申抗辩理由：地质图纸迟延确由市规自局排污二次环评规划延宕，属政府性宏观调整，申请人宏图建筑亦存在自身资金链断裂及劳务方分包索饷停工35天的违约叠加因素。
                    </p>
                  </div>

                  <div className="bg-indigo-950/20 p-2.5 rounded-2xl border border-indigo-900/30">
                    <span className="font-extrabold text-emerald-400 block text-xs">张首席 (首席仲裁员)</span>
                    <p className="text-indigo-200 leading-relaxed mt-0.5">
                      合议庭已全部记录双方诉辨意见重点，并已在线审查第三方进度核对鉴定。根据大额建设纠纷速裁程序，今天出示法庭调查结论后，本合议庭将直接休庭评议。当事人稍后在云端确认书记员整理好的庭审笔录并进行CA防伪数字签名！
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* BUTTON BAR OPERATIONS CONTROL */}
            <div className="bg-slate-900/90 border border-slate-800 p-3.5 rounded-3xl flex-shrink-0 flex flex-col gap-3">
              <div className="flex gap-2">
                <button 
                  onClick={() => {
                    // Navigate to discussion tab mockup or show quick advice
                    alert("您好，已通过在岸专网线呼叫另外两名合议员：赵东老师与王琦老师，成功开启保密三方音频评议节点。");
                  }}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-black py-2.5 rounded-xl cursor-pointer border border-slate-700/60 transition-colors text-center"
                >
                  发起合议交流
                </button>
                <button 
                  onClick={() => {
                    setIsSigningMode(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer shadow-md shadow-amber-900/10 transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-file-signature"></i>
                  <span>休庭并签署笔录</span>
                </button>
              </div>
            </div>

          </div>

          {/* SIGNATURE PAD OVERLAY POPUP MODAL */}
          {isSigningMode && (
            <div className="fixed inset-0 bg-[#0B0F19]/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-fade-in">
              <div className="bg-[#111827] border border-slate-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl relative space-y-4">
                
                {/* Header info */}
                <div className="space-y-0.5">
                  <span className="text-2xs bg-amber-500/10 text-[#F59E0B] border border-amber-500/30 px-2.5 py-1 rounded font-black font-mono">
                    CA CERTIFICATE SHIELD
                  </span>
                  <h3 className="text-sm font-black text-white pt-1">CA数字防伪笔录签署</h3>
                  <p className="text-xs text-slate-500 leading-normal">
                    您正在对刚才结束的 <strong>《(2026)穗仲案字第0521号》</strong> 合议及开庭笔录进行最终防伪签注确认。
                  </p>
                </div>

                {isSigningFinish ? (
                  /* Success checkmark panel on finising signed */
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-3 animate-scale-up">
                    <div className="w-10 h-10 bg-emerald-500 text-[#0B0F19] rounded-full mx-auto flex items-center justify-center">
                      <i className="fa-solid fa-check text-base"></i>
                    </div>
                    <div className="space-y-1">
                      <strong className="text-xs font-black text-emerald-400 block">CA数字签署成功！</strong>
                      <p className="text-xs text-slate-500 leading-normal">
                        已经联存至广州仲裁委员会信托数据池，防伪签注编号及事务哈希：<span className="font-mono text-indigo-300 block font-black">0xBF92AA82DD1C09</span>
                      </p>
                    </div>
                    
                    <button 
                      onClick={() => {
                        setActiveVirtualCourtId(null);
                        setIsSigningMode(false);
                        setIsSigningFinish(false);
                      }}
                      className="w-full bg-[#111827] border border-slate-800 hover:bg-slate-900 text-slate-300 py-2 text-xs rounded-xl transition-all font-black cursor-pointer"
                    >
                      安全并关闭法庭
                    </button>
                  </div>
                ) : (
                  /* Live Signature drawing pad simulator */
                  <div className="space-y-3.5">
                    <div className="bg-[#0B0F19] rounded-2xl border border-slate-800 h-28 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                      {/* background mockup signature display */}
                      <span className="text-xs text-slate-600 italic select-none">请在手写区签字或点击下方指纹秒签</span>
                      
                      {/* Signature graphic simulation lines */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-40 h-20 text-indigo-400 opacity-60 font-sans pointer-events-none" viewBox="0 0 100 50">
                          <path d="M 10 30 Q 30 10 50 25 T 90 20" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-pulse" />
                        </svg>
                      </div>

                      <div className="absolute bottom-2 right-2 flex items-center gap-1.5 text-2xs text-[#D97706] font-extrabold bg-[#D97706]/10 px-1.5 py-0.2 rounded">
                        <i className="fa-solid fa-fingerprint"></i>
                        <span>双因子核签锁定</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setIsSigningMode(false)}
                        className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-500 font-bold py-2 text-xs rounded-xl transition-colors cursor-pointer"
                      >
                        返回法庭
                      </button>
                      <button 
                        onClick={() => {
                          setIsSigningFinish(true);
                        }}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2 text-xs rounded-xl transition-colors cursor-pointer shadow-md shadow-indigo-600/20 text-center flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-shield-halved"></i>
                        <span>数字盾一键签章</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      )}


      {/* Task: 声明承诺书 (declaration) Modal */}
      {activeTodoModal === 'declaration' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 bg-gradient-to-b from-[#1E62EC] to-[#1448B5] text-white relative">
              <h3 className="text-sm font-black tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-file-shield text-base"></i>
                <span>签署《声明承诺书》</span>
              </h3>
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="absolute right-4 top-4 hover:scale-110 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed font-sans">
              <div className="bg-blue-50/70 border border-blue-100 p-3 rounded-xl space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">对应案号:</span>
                  <span className="font-extrabold text-blue-800 font-mono">(2026)穗仲案字第0325号</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">案件类别:</span>
                  <span className="font-bold text-slate-700">智慧零售股权转让纠纷案</span>
                </div>
              </div>

              <div className="border border-slate-100 p-3 rounded-xl bg-slate-50/50 space-y-2">
                <strong className="text-slate-800 block text-[11px] font-black border-b border-slate-150 pb-1">仲裁员特别声明与承诺：</strong>
                <p className="text-justify text-[10.5px]">
                  本人接受本案当事人之选定或广州仲裁委员会（GZAC）之指定，担任本案合议庭仲裁员。特此庄严声明与承诺：
                </p>
                <p className="text-justify text-[10.5px]">
                  1. 本人与本案双方当事人、第三人及其授权代理律师无任何亲属、合伙、劳务或其他实质性身分/经济利益挂钩。
                  <br />
                  2. 本人承诺在审理过程中，做到中立公正、诚实信用、严格严谨。
                  <br />
                  3. 绝对遵守中国仲裁法的保密法则规定，不私下接触当事人，依法独立裁决。
                </p>
              </div>

              <div className="bg-emerald-50/45 p-2 rounded-lg border border-emerald-100/50 flex items-center gap-2 text-emerald-800 text-[10.5px]">
                <i className="fa-solid fa-fingerprint text-sm shrink-0"></i>
                <span>CA安全校验系统侦探：已连接本委防伪数字签名盾 U-Shield</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                取消
              </button>
              {signedDeclaration ? (
                <div className="flex-1 py-2 text-center text-emerald-600 font-extrabold text-xs">
                  ✓ 已完成安全签署
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setSignedDeclaration(true);
                    setActiveTodoModal(null);
                    alert("签署承诺：已通过广州仲裁委双因子CA签名，该《声明承诺书》已自动归入本案数字一案一档中。");
                  }}
                  className="flex-1 bg-[#1E62EC] hover:bg-[#154FCB] text-white py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-blue-600/15 text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-signature"></i>
                  <span>CA数字证书签名</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Task: 笔录签名 (transcript) Modal */}
      {activeTodoModal === 'transcript' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 bg-gradient-to-b from-[#FF5722] to-[#D83F0E] text-white relative">
              <h3 className="text-sm font-black tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-signature text-base"></i>
                <span>庭审及合议笔录签名</span>
              </h3>
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="absolute right-4 top-4 hover:scale-110 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-600 font-sans">
              <div className="space-y-2">
                <span className="text-slate-400 font-bold block">待签署笔录项目 (2项)</span>
                
                <div className="bg-orange-50/55 border border-orange-100 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-orange-950 font-mono text-[11px]">(2026)穗仲案字第0521号</span>
                    <span className="text-[9px] bg-rose-50 text-rose-500 px-1.5 py-0.2 rounded-md font-bold">待本审签字</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600">新能源汽车零部件采购履约及延迟交付纠纷 - 第一次开庭笔录 (共13页)</p>
                </div>

                <div className="bg-orange-50/25 border border-orange-100/50 rounded-xl p-3 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-slate-800 font-mono text-[11px]">(2026)穗仲案字第0325号</span>
                    <span className="text-[9px] bg-amber-50 text-amber-600 px-1.5 py-0.2 rounded-md font-bold">待合议庭审签</span>
                  </div>
                  <p className="text-[10.5px] text-slate-600">合伙退股及溢价核算争议 - 第一次评议及休庭合议笔录 (共4页)</p>
                </div>
              </div>

              <div className="text-[10.5px] text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100/70">
                温馨指南：签注后笔录信息将加密在广州CA中心中转备份，不可篡改、泄漏。笔录可在线核对。
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                关闭核对
              </button>
              {signedTranscript ? (
                <div className="flex-1 py-2 text-center text-emerald-600 font-extrabold text-xs">
                  ✓ 两份笔录已签署完毕
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setSignedTranscript(true);
                    setActiveTodoModal(null);
                    alert("核签成功！已完成该两份案审与合议正式笔录的数字CA印鉴盖章签署。");
                  }}
                  className="flex-1 bg-[#FF5722] hover:bg-[#E04712] text-white py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-orange-600/15 text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-file-signature"></i>
                  <span>一键批量核签</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Task: 延期审批 (postponement) Modal */}
      {activeTodoModal === 'postponement' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 bg-gradient-to-b from-[#FF9800] to-[#E68200] text-white relative">
              <h3 className="text-sm font-black tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-clock-rotate-left text-base"></i>
                <span>延期审理行政审批</span>
              </h3>
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="absolute right-4 top-4 hover:scale-110 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-600 font-sans">
              <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-xl space-y-1.5 text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-400">报送案号:</span>
                  <span className="font-extrabold text-amber-900 font-mono">(2026)穗仲案字第0398号</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">当事人一方:</span>
                  <span className="font-bold text-slate-700">深圳建工设备控股集团</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">定于原审期:</span>
                  <span className="text-slate-600">2026年06月20日 14:00</span>
                </div>
              </div>

              <div className="border border-slate-100 p-3 rounded-xl space-y-2">
                <strong className="text-slate-800 block text-[11px] font-black border-b border-indigo-50/80 pb-1">延期事由及申请概述：</strong>
                <p className="text-[10.5px] leading-relaxed text-justify text-slate-600">
                  因本案涉案高精度数控切割机、压力传感系统质量需要广州计量检测科学研究院进行权威技术性能鉴定。鉴定报告受节假日及特殊工段拆检程序制约，需延期15日前后。为保证事实认定客观无误，申请人申请延期开庭至 <strong>2026年07月10日</strong>。
                </p>
                <div className="bg-slate-50 text-[10px] text-slate-500 p-2 rounded-lg leading-relaxed">
                  <span className="font-bold text-slate-700 block">✓ 仲裁秘书（李文浩）初审：</span>
                  已核实，申请人提供了鉴定机构延期出账证明书公函，事由正当，程序自愿。建议合议庭审批同意。
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => {
                  alert("驳回原延期申请意见已推送给本案秘书跟进。");
                  setActiveTodoModal(null);
                }}
                className="flex-1 bg-white hover:bg-slate-100 text-rose-500 border border-slate-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                驳回
              </button>
              {approvedPostponement ? (
                <div className="flex-1 py-2 text-center text-emerald-600 font-extrabold text-xs">
                  ✓ 已通过延期并签发决定
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setApprovedPostponement(true);
                    setActiveTodoModal(null);
                    alert("延期签发成功！已签署同意该案延期审理决定，最新排庭表将重新分发至各方当事人及秘书系统。");
                  }}
                  className="flex-1 bg-[#FF9800] hover:bg-[#E08600] text-white py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-amber-600/15 text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>同意并签发决定书</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Task: 文书签名 (docSign) Modal */}
      {activeTodoModal === 'docSign' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 bg-gradient-to-b from-[#3F51B5] to-[#2E3C8B] text-white relative">
              <h3 className="text-sm font-black tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-file-signature text-base"></i>
                <span>仲裁决定/裁决书正式签发</span>
              </h3>
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="absolute right-4 top-4 hover:scale-110 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-600 font-sans">
              <span className="text-slate-400 font-bold block">等待您的CA防伪签章文书 (1份)</span>
              
              <div className="bg-indigo-50/45 border border-indigo-150 rounded-xl p-3 space-y-2">
                <div className="flex justify-between items-center bg-indigo-50 px-2 py-1 rounded">
                  <span className="font-extrabold text-indigo-900 font-mono text-[10.5px]">(2026)穗仲案字第0325号</span>
                  <span className="text-[9px] text-[#3F51B5] font-extrabold">终局裁决书评定稿</span>
                </div>
                <div className="text-[10px] space-y-1 text-slate-500 leading-normal">
                  <p>• 争议领域: 新零售电商及物流股权受让追偿违约金争议</p>
                  <p>• 主理合议庭成员: <strong>张明 (首席)</strong>、叶培建、沈飞</p>
                  <p>• 盖章流程: 其他两个合议庭成员已在线签署。本首席印签为最终放行校验</p>
                </div>
              </div>

              <div className="bg-emerald-50/50 p-2 text-[10.5px] text-emerald-800 rounded-lg flex items-center gap-2">
                <i className="fa-solid fa-circle-check"></i>
                <span>签名设备就绪，一键盖章将同步生成带有区块链国中信盾防伪数字摘要印记。</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                取消
              </button>
              {signedDoc ? (
                <div className="flex-1 py-2 text-center text-emerald-600 font-extrabold text-xs">
                  ✓ 该终审文书已正式加签
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setSignedDoc(true);
                    setActiveTodoModal(null);
                    alert("文书签名成功！该终审裁决书已完成合议庭首席仲裁员的CA证书私钥双重签名盖章，并安全回传送达秘书发文中心。");
                  }}
                  className="flex-1 bg-[#3F51B5] hover:bg-[#2F3C8A] text-white py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/15 text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-stamp cursor-pointer"></i>
                  <span>盖章并加密发送</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Task: 草拟裁决书 (draft) Modal */}
      {activeTodoModal === 'draft' && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 bg-gradient-to-b from-[#E91E63] to-[#C2185B] text-white relative">
              <h3 className="text-sm font-black tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-file-pen text-base"></i>
                <span>起草并提交裁决书草稿</span>
              </h3>
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="absolute right-4 top-4 hover:scale-110 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-3.5 text-xs text-slate-600 font-sans">
              <span className="text-slate-400 font-bold block">待主审起草的裁决书 (3页)</span>
              
              <div className="space-y-2">
                {[
                  { case: '(2026)穗仲案字第0398号', label: '精密设备加工及技术折价返还原物中初稿' },
                  { case: '(2026)穗仲案字第0521号', label: '采购合同质量违约及可得利益核算初稿' },
                  { case: '(2026)穗仲案字第0325号', label: '某智慧生鲜创始合伙退伙退股溢价初稿' }
                ].map((item, id) => (
                  <div key={id} className="bg-rose-50/20 border border-rose-100 p-2.5 rounded-xl space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-extrabold text-rose-900 font-mono">{item.case}</span>
                      <span className="text-[8px] bg-amber-50 text-amber-600 px-1.5 py-0.1 rounded font-black">正在起草</span>
                    </div>
                    <p className="text-[10px] text-slate-600 truncate">{item.label}</p>
                  </div>
                ))}
              </div>

              <p className="text-[10px] text-slate-400 bg-slate-50 p-2 rounded-lg leading-relaxed border border-slate-100">
                仲裁员职责提示：仲裁庭应于审理终结后，依照评议核查后的基本事实及法律条文起草裁决。点击确认起草后，3份草稿将一键提交通送本委秘书处审查。
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => setActiveTodoModal(null)}
                className="flex-1 bg-white hover:bg-slate-100 text-slate-500 border border-slate-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                取消
              </button>
              {draftedAward ? (
                <div className="flex-1 py-2 text-center text-emerald-600 font-extrabold text-xs">
                  ✓ 已完成草拟并提交
                </div>
              ) : (
                <button 
                  onClick={() => {
                    setDraftedAward(true);
                    setActiveTodoModal(null);
                    alert("起草提交成功！3 份案件裁决书草案主裁意见文稿已一键通传至办案秘书系统，进行首轮技术核校与程序复查。");
                  }}
                  className="flex-1 bg-[#E91E63] hover:bg-[#C2185B] text-white py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-pink-600/15 text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-file-circle-check"></i>
                  <span>确认草拟完成并提交</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Feature: 酬金单 (showRemunerationModal) Modal */}
      {showRemunerationModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] animate-scale-up">
            <div className="p-4 bg-gradient-to-b from-[#10B981] to-[#047857] text-white relative">
              <h3 className="text-sm font-black tracking-wider flex items-center gap-1.5">
                <i className="fa-solid fa-wallet text-base"></i>
                <span>专家仲裁员酬金计算单</span>
              </h3>
              <button 
                onClick={() => setShowRemunerationModal(false)}
                className="absolute right-4 top-4 hover:scale-110 active:scale-95 text-white/80 hover:text-white transition-transform cursor-pointer"
              >
                <i className="fa-solid fa-xmark text-sm"></i>
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-600 font-sans">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-700 text-[11px]">领受专家: 张明 老师</span>
                <span className="text-[10px] text-slate-400">核算统计度: 2026年Q2季度(当期)</span>
              </div>

              <div className="space-y-2">
                <span className="text-slate-400 font-bold block">当前季度名下案件分配清单：</span>
                
                <div className="bg-[#F8FAFC] border border-slate-100 rounded-xl max-h-32 overflow-y-auto divide-y divide-slate-150/45 p-1 pb-0 no-scrollbar">
                  {[
                    { case: '(2026)穗仲案字第0325号', title: '零售股权纠纷案', type: '裁决结案酬劳', amount: '￥12,500', status: '已打款', statusColor: 'text-[#10B981] bg-[#10B981]/10' },
                    { case: '(2026)穗仲案字第0398号', title: '智能工厂承揽案', type: '调解结案酬劳', amount: '￥9,800', status: '已打款', statusColor: 'text-[#10B981] bg-[#10B981]/10' },
                    { case: '(2026)穗仲案字第0521号', title: '汽车零部件采购案', type: '开庭审判酬劳估值', amount: '￥18,200', status: '待开庭结算', statusColor: 'text-[#1E62EC] bg-[#1E62EC]/10' }
                  ].map((entry, idx) => (
                    <div key={idx} className="p-2 space-y-1 text-[10.5px]">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold text-slate-700 font-mono">{entry.case}</span>
                        <span className="font-black text-slate-800">{entry.amount}</span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500">
                        <span>{entry.type} • {entry.title}</span>
                        <span className={`px-1.5 py-0.1 rounded font-bold ${entry.statusColor}`}>{entry.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100 text-[11px] space-y-1 px-3.5 text-emerald-950 font-bold">
                <div className="flex justify-between">
                  <span>累计已发放酬劳额：</span>
                  <span className="font-mono font-extrabold text-emerald-600">￥22,300</span>
                </div>
                <div className="flex justify-between">
                  <span>累计预分配待打款：</span>
                  <span className="font-mono text-slate-500">￥18,200</span>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 border-t border-emerald-100/40 pt-1 mt-1 font-medium">
                  <span>当期代扣代缴个税款估：</span>
                  <span>-￥3,150</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
              <button 
                onClick={() => {
                  alert("提现申请表已在线创建！稍后由广仲财务结算中心与绑定CA名下数字盾对公仲裁专用折进行银企直连转账划款。");
                }}
                className="flex-1 bg-[#10B981] hover:bg-[#059669] text-white py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-emerald-600/15 text-center flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-credit-card"></i>
                <span>提现申请结算</span>
              </button>
              <button 
                onClick={() => {
                  alert("酬金明细凭证 PDF 已经成功生成并导入您的微信电子发票与薪水对账中，请至邮箱接收。");
                }}
                className="flex-1 bg-white hover:bg-slate-100 text-[#10B981] border border-slate-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center"
              >
                导出凭证对账
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
