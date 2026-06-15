import React, { useState, useEffect } from 'react';
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
  onNavigateToSubPage: (page: 'statsCenter' | 'caseDiscussion' | 'appointment' | 'notifications' | 'remuneration') => void;
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
  onNavigateToSubPage
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

  // Trigger quick category filter (from home metric block) and navigate to Case Tab
  const handleStatBlockClick = (status: CaseStatus | 'all') => {
    onFilterStatus(status);
    onNavigateToTab(1);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col relative">
      
      {/* PREMIUM BANNER - 包含背景图和浮动用户信息卡片 */}
      <div className="relative h-48 overflow-visible">
        {/* Background image - 干净展示，不加遮罩 */}
        <img
          src={import.meta.env.BASE_URL + "tu/new-banner.png"}
          alt="Banner Background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Notification button in top right corner */}
        <div className="absolute right-4 top-4 z-20">
          <button
            onClick={() => onNavigateToSubPage('notifications')}
            className="flex items-center bg-white/15 hover:bg-white/25 border border-white/20 rounded-full h-6 px-2 py-1 gap-2 transition-all cursor-pointer group backdrop-blur-sm"
          >
            <i className="fa-solid fa-bell text-amber-400 text-xs group-hover:animate-pulse"></i>
            <span className="text-xs font-bold text-white">通知</span>
            <span className="h-1.5 w-1.5 bg-rose-500 rounded-full animate-pulse"></span>
          </button>
        </div>

        {/* USER INFO + STATS - 浮动在 Banner 下方 3/4 区域 */}
        <div className="absolute left-4 right-4 top-[70%] px-4 pt-4 pb-3 bg-white/95 backdrop-blur-sm text-left rounded-lg shadow-md shadow-slate-900/5 z-10 border border-white/50">
          {/* User Welcome Block */}
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar - visual anchor */}
            <div className="relative flex-shrink-0">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-11 h-11 rounded-xl object-cover "
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center border-2 border-white shadow-lg">
                  <span className="text-lg font-black text-white">{profile.name.charAt(0)}</span>
                </div>
              )}
            </div>

            {/* User info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-lg font-bold text-slate-900 tracking-tight leading-none">
                  {profile.name}
                </h1>
                <span className="text-xs  text-amber-600 bg-amber-100 px-1.5 py-1 rounded">
                  第六届仲裁员
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate text-left">
                广州市社会科学院政治法律研究所
              </p>
            </div>
          </div>

          {/* Stats row - 在用户信息下方 */}
          <div className="flex gap-2">
            <div 
              className="text-center px-3 py-2 rounded-xl bg-gradient-to-br from-indigo-50 to-indigo-100/50 border border-indigo-200/50 flex-1 cursor-pointer hover:from-indigo-100 hover:to-indigo-150/50 hover:shadow-sm transition-all active:scale-[0.98]" 
              onClick={() => handleStatBlockClick('审理中')}
            >
              <span className="text-xl font-black text-indigo-600 block leading-none">{profile.activeCount}</span>
              <span className="text-xs text-slate-600 block font-medium mt-1">在办</span>
            </div>
            <div 
              className="text-center px-3 py-2 rounded-xl bg-gradient-to-br from-rose-50 to-rose-100/50 border border-rose-200/50 flex-1 cursor-pointer hover:from-rose-100 hover:to-rose-150/50 hover:shadow-sm transition-all active:scale-[0.98]" 
              onClick={() => onNavigateToTab(2)}
            >
              <span className="text-xl font-black text-rose-600 block leading-none">{pendingTasks.length}</span>
              <span className="text-xs text-slate-600 block font-medium mt-1">待办</span>
            </div>
            <div 
              className="text-center px-3 py-2 rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/50 flex-1 cursor-pointer hover:from-emerald-100 hover:to-emerald-150/50 hover:shadow-sm transition-all active:scale-[0.98]" 
              onClick={() => handleStatBlockClick('已结案')}
            >
              <span className="text-xl font-black text-emerald-600 block leading-none">{profile.resolvedCount}</span>
              <span className="text-xs text-slate-600 block font-medium mt-1">累积结案</span>
            </div>
          </div>
        </div>
      </div>

      {/* Home View Container - 增加顶部间距避免被用户信息卡片遮挡 */}
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col mt-[22%]">

        {/* 最新动态模块 (Latest News/Updates Widget with vertical sliding carousel) */}
        <div className="mx-4 my-2.5 mt-5 bg-white rounded-lg border border-slate-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.012)] flex items-center pr-4 overflow-hidden animate-fade-in">
          {/* "动态" tag — brand-indigo gradient with an elegant diagonal cut trapezoid shape */}
          <div
            className="bg-gradient-to-br from-indigo-600 to-indigo-500 font-sans tracking-wide text-white font-extrabold text-base pl-4 pr-10 py-3 flex-shrink-0 flex items-center justify-center select-none"
            style={{ clipPath: 'polygon(0% 0%, 100% 0%, 75% 100%, 0% 100%)' }}
          >
            <span>动态</span>
          </div>

          {/* Scrolling ticker area with vertical slide translation */}
          <div className="h-12 overflow-hidden flex-1 px-3 relative">
            <div
              className="absolute left-3 right-2 transition-all duration-700 ease-in-out"
              style={{ transform: `translateY(-${activeNewsIndex * 48}px)` }}
            >
              {newsList.map((news, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setSelectedNews(news);
                    setShowNewsDetailModal(true);
                  }}
                  className="h-12 flex flex-col justify-center cursor-pointer group text-left"
                >
                  <span className="text-sm font-medium text-slate-900 leading-[18px] line-clamp-2 group-hover:text-indigo-500 transition-colors">
                    {news.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Double chevrons right pointer icon */}
          <div className="flex-shrink-0 pl-1">
            <i
              className="fa-solid fa-angles-right text-slate-500 hover:text-indigo-500 transition-colors text-xs cursor-pointer"
              onClick={() => {
                const currentNews = newsList[activeNewsIndex];
                setSelectedNews(currentNews);
                setShowNewsDetailModal(true);
              }}
            ></i>
          </div>
        </div>

        {/* 1. RECENT HEARINGS NOTIFICATION BLOCK - 近期开庭提醒 (位置放在近期待办上方，升级为精美白底浮动卡片) */}
        <div className="mx-4 my-2.5 bg-white rounded-lg border border-slate-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.012)] p-4 text-left animate-fade-in">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 font-sans">
              <i className="fa-solid fa-gavel text-indigo-500"></i>
              <span>近3天待开庭</span>
            </span>
            <div className="flex items-center gap-2">
             
              <span className="text-xs text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-1 flex items-center rounded">
                
                <span>{recentHearings.length} 场待开庭</span>
              </span>
            </div>
          </div>

          {/* Render hearings in timeline format */}
          {recentHearings.length > 0 ? (
            <div className="space-y-3.5 my-2">
              <div className="relative border-l-2 border-indigo-50/80 ml-2.5 pr-0.5 pl-4.5 space-y-4 pb-1.5">
                {(showAllRecentHearings ? recentHearings : recentHearings.slice(0, 3)).map((hearing, idx) => {
                  const matchedCase = cases.find(c => c.id === hearing.caseId);
                  const claimant = matchedCase?.claimant || '华夏科技';
                  const respondent = matchedCase?.respondent || '蓝海创投';
                  
                  // Format the design classes according to chronological indices or days
                  let badgeText = "即将开庭";
                  let badgeStyle = "bg-amber-50 text-amber-600 border-amber-100";
                  let dotCircleStyle = "bg-amber-500 ring-4 ring-amber-100";
                  
                  if (hearing.hearingTime.includes('2026-06-11')) {
                    if (idx === 0) {
                      badgeText = "今天开庭";
                      badgeStyle = "bg-rose-50 text-rose-600 border-rose-105";
                      dotCircleStyle = "bg-rose-500 ring-4 ring-rose-100";
                    } else {
                      badgeText = "本日后续";
                      badgeStyle = "bg-amber-50 text-amber-600 border-amber-100";
                      dotCircleStyle = "bg-amber-500 ring-4 ring-amber-100";
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
                      className="relative bg-white rounded-2xl border border-slate-100/80 hover:border-indigo-200 hover:shadow-md hover:-translate-y-0.5 p-5 shadow-xs transition-all flex flex-col gap-3 cursor-pointer"
                    >
                      {/* Timeline Node Ring & Dot */}
                      <div className="absolute -left-[24.5px] top-6 flex items-center justify-center">
                        <span className={`h-2.5 w-2.5 rounded-full ${dotCircleStyle} transition-all`}></span>
                      </div>

                      {/* Timeline Card Header */}
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className={`text-xs px-2 py-1 rounded border leading-none shrink-0 ${badgeStyle}`} >
                            {badgeText}
                          </span>
                          <span className="text-base text-slate-800 truncate" >
                            {hearing.caseNo}
                          </span>
                        </div>
                        {/* <span className="shrink-0 text-xs bg-slate-50 text-slate-600 border border-slate-100 px-2 py-1 rounded tracking-wider" >
                          {hearing.role}
                        </span> */}
                      </div>

                      {/* Timeline Details Box - Label 标签统一宽度 */}
                      <div className="text-sm text-slate-500 space-y-3">
                        <div className="flex items-start gap-2 min-w-0">
                          <i className="fa-solid fa-user-shield text-slate-400 text-sm w-3 rounded text-center shrink-0 mt-0.5"></i>
                          <span className="flex min-w-0">
                            <span className="text-sm text-slate-400 shrink-0 w-[60px]">当事人：</span>
                            <span className="truncate text-sm">{claimant} VS {respondent}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <i className="fa-solid fa-clock text-slate-400 text-sm w-3 rounded text-center shrink-0 mt-0.5"></i>
                          <span className="flex min-w-0">
                            <span className="text-sm text-slate-400 shrink-0 w-[60px]">时间：</span>
                            <span className="truncate text-sm">{hearing.hearingTime}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <i className="fa-solid fa-location-dot text-slate-400 text-sm w-3 rounded text-center shrink-0 mt-0.5"></i>
                          <span className="flex min-w-0">
                            <span className="text-sm text-slate-400 shrink-0 w-[60px]">开庭地点：</span>
                            <span className="truncate text-sm">{hearing.location}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <i className="fa-solid fa-user-tie text-slate-400 text-sm w-3 rounded text-center shrink-0 mt-0.5"></i>
                          <span className="flex min-w-0">
                            <span className="text-sm text-slate-400 shrink-0 w-[60px]">办案秘书：</span>
                            <span className="truncate text-sm font-sans">{hearing.secretary}</span>
                          </span>
                        </div>
                        <div className="flex items-start gap-2 min-w-0">
                          <i className="fa-solid fa-clipboard text-slate-400 text-sm w-3 rounded text-center shrink-0 mt-0.5"></i>
                          <span className="flex min-w-0">
                            <span className="text-sm text-slate-400 shrink-0 w-[60px]">开庭用途：</span>
                            <span className="truncate text-sm font-sans">{hearing.purpose}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View More Button */}
              {recentHearings.length > 3 && (
                <div className="pt-1.5">
                  {!showAllRecentHearings ? (
                    <button
                      onClick={() => setShowAllRecentHearings(true)}
                      className="w-full bg-indigo-50/50 hover:bg-indigo-100/80 active:scale-98 text-indigo-600 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer border border-indigo-200 flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>展开更多近期开庭 ({recentHearings.length - 3}场)</span>
                      <i className="fa-solid fa-chevron-down text-xs"></i>
                    </button>
                  ) : (
                    <button
                      onClick={() => setShowAllRecentHearings(false)}
                      className="w-full bg-slate-100 hover:bg-slate-200 active:scale-98 text-slate-600 font-bold py-2 px-4 rounded-xl text-xs transition-all cursor-pointer border border-slate-200 flex items-center justify-center gap-2 shadow-xs"
                    >
                      <span>收起开庭</span>
                      <i className="fa-solid fa-chevron-up text-xs"></i>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50/55 rounded-2xl border border-dashed border-slate-200/80 p-5 text-center">
              <p className="text-xs text-slate-500 font-medium font-sans">近期(3天内)暂无待开庭日程</p>
            </div>
          )}
        </div>

        {/* 2. 近期待办 (网格卡片) - 升级为精美白底浮动卡片，极简扁平化图标设计 */}
        <div id="todoSection" className="mx-4 my-2.5 bg-white rounded-lg border border-slate-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.012)] p-4 text-left animate-fade-in">
          <div className="flex justify-between items-center mb-4 px-1">
            <span className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2 font-sans">
              <i className="fa-solid fa-rectangle-list text-indigo-500"></i>
              <span>近期待办</span>
            </span>
            <span className="text-xs  text-rose-600 bg-rose-50 border border-rose-100/60 px-1.5 py-1 rounded flex items-center gap-1.5 font-sans">
              
              <span>{ (signedDeclaration ? 0 : 1) + (signedTranscript ? 0 : 2) + (approvedPostponement ? 0 : 1) + (signedDoc ? 0 : 1) + (draftedAward ? 0 : 3) } 项待办</span>
            </span>
          </div>

          <div className="grid grid-cols-3 gap-y-4 gap-x-1">
            {[
              {
                id: 'declaration',
                label: '声明承诺书',
                icon: 'fa-file-shield',
                isCompleted: signedDeclaration,
                colorClass: 'text-teal-500 group-hover:text-teal-600',
                action: () => setActiveTodoModal('declaration')
              },
              {
                id: 'transcript',
                label: '笔录签名',
                icon: 'fa-signature',
                isCompleted: signedTranscript,
                colorClass: 'text-rose-500 group-hover:text-rose-600',
                action: () => setActiveTodoModal('transcript')
              },
              {
                id: 'postponement',
                label: '延期审批',
                icon: 'fa-clock-rotate-left',
                isCompleted: approvedPostponement,
                colorClass: 'text-amber-500 group-hover:text-amber-600',
                action: () => setActiveTodoModal('postponement')
              },
              {
                id: 'docSign',
                label: '文书签名',
                icon: 'fa-file-signature',
                isCompleted: signedDoc,
                colorClass: 'text-indigo-400 group-hover:text-indigo-500',
                action: () => setActiveTodoModal('docSign')
              },
              {
                id: 'draft',
                label: '草拟裁决书',
                icon: 'fa-pen-to-square',
                isCompleted: draftedAward,
                colorClass: 'text-violet-400 group-hover:text-violet-500',
                action: () => setActiveTodoModal('draft')
              }
            ].map((item) => (
              <button
                key={item.id}
                onClick={item.action}
                className="relative py-2 px-0.5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50/50 rounded-2xl active:scale-[0.95] text-center group bg-transparent"
              >
                {/* Icon Wrapper coordinates notification badges perfectly */}
                <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                  <i className={`fa-solid ${item.isCompleted ? 'fa-check-double text-emerald-500' : item.icon} text-[30px] ${item.isCompleted ? '' : item.colorClass} transition-transform group-hover:scale-110`}></i>
                  
                  {/* Top-Right Red Dot for pending inline with the icon */}
                  {!item.isCompleted && (
                    <span className="absolute top-1 right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  )}
                </div>

                {/* Function Name */}
                <span className="text-base font-medium block text-[#333333] mt-1 leading-[18px] truncate w-full group-hover:text-indigo-500 transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* UNIQUE GRID SELECTED FUNCTIONS - 常用功能与 辅助功能 TAB 切换 (升级为精美白底浮动卡片) */}
        <div id="functionSection" className="mx-4 my-2.5 bg-white rounded-lg border border-slate-100/90 shadow-[0_8px_30px_rgb(0,0,0,0.012)] p-4 text-left animate-fade-in">
          {/* Tab Headers */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 pl-1 mb-4">
            <div className="flex space-x-5">
              <button
                onClick={() => setActiveFuncTab('common')}
                className={`flex items-center space-x-2 pb-2 transition-all cursor-pointer relative ${
                  activeFuncTab === 'common'
                    ? 'text-indigo-600 font-extrabold text-lg'
                    : 'text-slate-400 font-bold text-base'
                }`}
              >
                <span>常用功能</span>
                {activeFuncTab === 'common' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
              <button
                onClick={() => setActiveFuncTab('other')}
                className={`flex items-center space-x-2 pb-2 transition-all cursor-pointer relative ${
                  activeFuncTab === 'other'
                    ? 'text-indigo-600 font-extrabold text-lg'
                    : 'text-slate-400 font-bold text-base'
                }`}
              >
                <span>辅助功能</span>
                {activeFuncTab === 'other' && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full" />
                )}
              </button>
            </div>
            
            
          </div>

          {activeFuncTab === 'common' ? (
            /* Common Functions Grid (统计中心、案件讨论、我的聘书、酬金单) */
            <div className="grid grid-cols-3 gap-y-4 gap-x-1 animate-fade-in">
              {[
                { id: 'statsCenter', label: '统计中心', icon: "fa-chart-pie", colorClass: 'text-indigo-400 group-hover:text-indigo-500' },
                { id: 'caseDiscussion', label: '案件讨论', icon: "fa-comments", colorClass: 'text-fuchsia-400 group-hover:text-fuchsia-500' },
                { id: 'appointment', label: '我的聘书', icon: "fa-award", colorClass: 'text-amber-500 group-hover:text-amber-600' },
                { id: 'remuneration', label: '酬金单', icon: "fa-money-check-dollar", colorClass: 'text-emerald-500 group-hover:text-emerald-600' }
              ].map((section) => {
                return (
                  <button
                    key={section.id}
                    onClick={() => onNavigateToSubPage(section.id as 'statsCenter' | 'caseDiscussion' | 'appointment' | 'remuneration')}
                    className="py-2.5 px-0.5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50/50 rounded-2xl active:scale-[0.95] text-center group bg-transparent"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                      <i className={`fa-solid ${section.icon} text-[30px] ${section.colorClass} transition-transform group-hover:scale-110`}></i>
                    </div>
                    <span className="text-base font-medium block text-[#333333] mt-1 leading-[18px] truncate w-full group-hover:text-indigo-500 transition-colors">{section.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* 辅助功能 Grid (审理指引、裁决书及案例、仲裁员须知) */
            <div className="grid grid-cols-3 gap-y-4 gap-x-1 animate-fade-in">
              {[
                { id: 'guide', label: '审理指引', icon: "fa-compass", colorClass: 'text-rose-400 group-hover:text-rose-500', action: () => setShowGuideModal(true) },
                { id: 'template', label: '裁决书及案例', icon: "fa-file-lines", colorClass: 'text-emerald-400 group-hover:text-emerald-500', action: () => setShowTemplateModal(true) },
                { id: 'ops', label: '仲裁员须知', icon: "fa-sliders", colorClass: 'text-violet-400 group-hover:text-violet-500', action: () => setShowOpsModal(true) }
              ].map((section) => {
                return (
                  <button
                    key={section.id}
                    onClick={section.action}
                    className="py-2.5 px-0.5 flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-slate-50/50 rounded-2xl active:scale-[0.95] text-center group bg-transparent"
                  >
                    <div className="relative w-12 h-12 flex items-center justify-center mb-1">
                      <i className={`fa-solid ${section.icon} text-[30px] ${section.colorClass} transition-transform group-hover:scale-110`}></i>
                    </div>
                    <span className="text-base font-medium block text-[#333333] mt-1 leading-[18px] truncate w-full group-hover:text-indigo-500 transition-colors">{section.label}</span>
                  </button>
                );
              })}
            </div>
          )}
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
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
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
                        <h6 className="font-extrabold text-slate-800 text-sm truncate">{doc.name}</h6>
                        <p className="text-xs text-slate-500 font-mono">大小: {doc.size} • 校验哈希: {doc.hash}</p>
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
                      <h4 className="font-extrabold text-slate-800 text-sm">{item.title}</h4>
                      <p className="text-xs text-slate-500 leading-normal">{item.desc}</p>
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

    </div>
  );
}
