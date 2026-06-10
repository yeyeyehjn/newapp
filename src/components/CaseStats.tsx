import React, { useState } from 'react';
import { 
  TrendingUp, AlertCircle, FileText, CheckCircle2, User, ChevronRight,
  Shield, Key, Lock, Fingerprint, ShieldCheck, RefreshCw, QrCode, 
  Settings, ArrowRightLeft, HelpCircle, Archive, Eye, Trash2
} from 'lucide-react';
import { Case, CaseCategory, CaseStatus } from '../types';

interface CaseStatsProps {
  cases: Case[];
  onNavigateToTab: (index: number) => void;
  onFilterStatus: (status: CaseStatus | 'all') => void;
}

export default function CaseStats({ cases, onNavigateToTab, onFilterStatus }: CaseStatsProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [activeTrendMonth, setActiveTrendMonth] = useState<number | null>(null);

  // States for interactive security buttons
  const [caStatus, setCaStatus] = useState<'pending' | 'syncing' | 'active'>('active');
  const [faceStatus, setFaceStatus] = useState<'unbound' | 'binding' | 'bound'>('bound');
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Statistics aggregates
  const totalCases = cases.length + 138; // Add real historic count: total 143 cases
  const inTrialCount = cases.filter(c => c.status === '审理中').length;
  const pendingHearingCount = cases.filter(c => c.status === '待排庭').length;
  const pendingAwardCount = cases.filter(c => c.status === '待签发').length;
  const closedCount = cases.filter(c => c.status === '已结案').length + 138; // Include legacy records

  // Status breakdown array for circle chart with indigo accent
  const statusData = [
    { label: '已结案', value: closedCount, color: '#10B981', statusType: '已结案' as CaseStatus },
    { label: '审理中', value: inTrialCount, color: '#6366F1', statusType: '审理中' as CaseStatus },
    { label: '待排庭', value: pendingHearingCount, color: '#F59E0B', statusType: '待排庭' as CaseStatus },
    { label: '待签发', value: pendingAwardCount, color: '#EF4444', statusType: '待签发' as CaseStatus },
  ];

  // Category statistics from cases (realistic historical aggregates)
  const categories: { [key in CaseCategory]?: number } = {
    '股权投资纠纷': 45,
    '国际贸易纠纷': 38,
    '建设工程纠纷': 29,
    '知识产权纠纷': 18,
    '金融借款合同': 12,
  };

  // Convert categories object to list sorted
  const categoryData = Object.entries(categories).map(([k, val]) => ({
    label: k as CaseCategory,
    value: val,
  })).sort((a, b) => b.value - a.value);

  // Monthly stats trend data (Jan to Jun 2026)
  const monthlyData = [
    { name: '1月', input: 8, resolved: 6 },
    { name: '2月', input: 12, resolved: 9 },
    { name: '3月', input: 10, resolved: 14 },
    { name: '4月', input: 15, resolved: 11 },
    { name: '5月', input: 9, resolved: 13 },
    { name: '6月', input: 11, resolved: 8 },
  ];

  // Quick stats trigger - navigates to Home workbench and filters cases
  const handleStatusCardClick = (status: CaseStatus) => {
    onFilterStatus(status);
    onNavigateToTab(0); // Go to Home (since CaseList belongs to Workbench now!)
  };

  // Simulate active security toggles
  const handleSyncCa = () => {
    setCaStatus('syncing');
    setTimeout(() => {
      setCaStatus('active');
    }, 1500);
  };

  const handleBindFace = () => {
    setFaceStatus('binding');
    setTimeout(() => {
      setFaceStatus('bound');
    }, 1500);
  };

  const handleClearCache = () => {
    setIsClearing(true);
    setTimeout(() => {
      setIsClearing(false);
      alert('✓ 离线案卷元数据及安全缓存数据已成功重置清理！');
    }, 1000);
  };

  // Calculate SVG donut slice parameters
  let totalStatusValue = statusData.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-20 overflow-hidden relative">
      
      {/* Scrollable Profile View */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto no-scrollbar w-full text-left">
        
        {/* PREMIUM PROFILE PORTFOLIO BOX - 个人卡片(高级感) */}
        <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-5 rounded-[28px] shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute right-[-20px] bottom-[-20px] opacity-[0.03] select-none pointer-events-none transform scale-150 rotate-12">
            <Shield size={180} />
          </div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <span className="text-[10px] font-extrabold tracking-widest text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-lg uppercase">
                广州仲裁委 · 在聘名册
              </span>
              <h3 className="text-lg font-extrabold tracking-tight text-[#F8FAFC] mt-2 flex items-center gap-2">
                <span>张明</span>
                <span className="text-[9px] bg-white/10 text-slate-300 font-bold px-1.5 py-0.5 rounded leading-none border border-slate-700">
                  首席及独任资质
                </span>
              </h3>
              <p className="text-[10.5px] text-[#94A3B8] font-mono mt-0.5">登记号: GZAC-ARB-G605</p>
            </div>

            {/* Profile Barcode Mock up */}
            <div 
              onClick={() => setShowQrModal(true)}
              className="bg-white/5 hover:bg-white/10 p-2 rounded-2xl border border-white/10 cursor-pointer transition-all flex flex-col items-center gap-1.5 shadow-sm"
            >
              <QrCode size={22} className="text-indigo-400" />
              <span className="text-[7.5px] text-slate-400 font-mono tracking-wider">电子安全证</span>
            </div>
          </div>

          {/* Quick tags and credentials lines */}
          <div className="border-t border-slate-800 pt-3 mt-1 flex space-x-2 items-center text-[9px] relative z-10">
            <span className="text-[#64748B] font-extrabold tracking-wider">在研重点范围:</span>
            <span className="bg-indigo-500/15 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/20 font-bold">股权纠纷</span>
            <span className="bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/20 font-bold">涉外知识产权</span>
            <span className="bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded border border-amber-500/20 font-bold">工程高限索赔</span>
          </div>
          
          <div className="mt-3 text-slate-400 text-[10px] flex items-center justify-between font-medium">
            <span>CA云盾认证系统</span>
            <span className="text-emerald-400 font-extrabold flex items-center gap-1">
              <ShieldCheck size={11} /> 已在线加锁
            </span>
          </div>
        </div>

        {/* SECURITY & CONTROL GRID - 安全与控制面板 */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-baseline pl-1">
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">高级安全锁及证书设置</h4>
            <span className="text-[8px] font-mono text-slate-400">HARDWARE SHIELD KEYS</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            
            {/* CA Sync key */}
            <div 
              onClick={handleSyncCa}
              className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/5 transition-all text-center flex flex-col items-center justify-center space-y-1 min-h-[72px]"
            >
              {caStatus === 'active' ? (
                <>
                  <Key size={14} className="text-indigo-600 animate-pulse" />
                  <span className="text-[10px] font-extrabold text-slate-700 block">CA数字签名</span>
                  <span className="text-[8px] text-indigo-600 font-extrabold bg-indigo-50 px-1 rounded">盾已就绪</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} className="text-slate-405 animate-spin" />
                  <span className="text-[10px] font-extrabold text-slate-500 block">校核中...</span>
                  <span className="text-[8px] text-slate-400 font-medium">请稍后</span>
                </>
              )}
            </div>

            {/* Facial Biometric key */}
            <div 
              onClick={handleBindFace}
              className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-indigo-300 hover:bg-slate-50 transition-all text-center flex flex-col items-center justify-center space-y-1 min-h-[72px]"
            >
              {faceStatus === 'bound' ? (
                <>
                  <Fingerprint size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-extrabold text-slate-700 block">人脸面容体核</span>
                  <span className="text-[8px] text-emerald-600 font-extrabold bg-emerald-50 px-1 rounded">双向锁定</span>
                </>
              ) : (
                <>
                  <RefreshCw size={14} className="text-slate-405 animate-spin" />
                  <span className="text-[10px] font-extrabold text-slate-500 block">生物链比照...</span>
                  <span className="text-[8px] text-slate-400 font-medium">请对准面部</span>
                </>
              )}
            </div>

            {/* Clear cache */}
            <div 
              onClick={handleClearCache}
              className="bg-white p-2.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:border-red-300 hover:bg-red-50/5 transition-all text-center flex flex-col items-center justify-center space-y-1 min-h-[72px]"
            >
              {isClearing ? (
                <RefreshCw size={14} className="text-red-500 animate-spin" />
              ) : (
                <Trash2 size={14} className="text-red-400" />
              )}
              <span className="text-[10px] font-extrabold text-slate-700 block">敏感存证重置</span>
              <span className="text-[8px] text-red-500 font-extrabold bg-red-50 px-1 rounded">清除密存</span>
            </div>

          </div>
        </div>

        {/* CORE STATS TITLE SPLITTER */}
        <div className="flex items-center justify-between pt-1.5 pb-1 border-b border-indigo-100/60 flex-shrink-0">
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">委案季度履历数据分析</h3>
            <p className="text-[9.5px] text-slate-400 font-medium">广州仲裁委员会中控统计数据组实时结算</p>
          </div>
          <div className="flex items-center space-x-1 py-1 px-2.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9.5px] font-extrabold shadow-sm">
            <TrendingUp size={11} />
            <span>结案率优秀 95.8%</span>
          </div>
        </div>

        {/* Aggregate KPI Grid - Bento Style elements */}
        <div className="grid grid-cols-2 gap-3">
          <div 
            onClick={() => handleStatusCardClick('已结案')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm hover:shadow hover:border-slate-200 transition-all group cursor-pointer"
          >
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="text-xs font-bold text-slate-500">累计结案量</span>
              <CheckCircle2 size={16} className="text-emerald-500" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{closedCount}</span>
              <span className="text-[9px] text-emerald-500 font-extrabold group-hover:translate-x-0.5 transition-transform">查看 ➜</span>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-50 text-[10px] text-slate-400 flex items-center justify-between">
              <span>平均裁案周期</span>
              <span className="font-semibold text-slate-600">85 天</span>
            </div>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center text-slate-400 mb-1">
                <span className="text-xs font-bold text-slate-500">主审中案件</span>
                <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></div>
              </div>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-2xl font-extrabold text-slate-800 tracking-tight">{inTrialCount}</span>
                <span className="text-[10px] text-slate-400 font-bold">委签席位</span>
              </div>
            </div>
            <div className="mt-1.5 pt-1.5 border-t border-slate-50 text-[10px] text-slate-400 flex justify-between items-center">
              <span>本月待结立案</span>
              <span className="font-extrabold text-indigo-600">+2 件</span>
            </div>
          </div>

          <div
            onClick={() => handleStatusCardClick('待排庭')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-indigo-50/10 hover:border-indigo-100 transition-all"
          >
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="text-xs font-bold text-slate-500">待排庭期</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            </div>
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight">{pendingHearingCount}</div>
            <p className="text-[9px] text-amber-500 font-extrabold mt-1">急需确认可行庭期 ➜</p>
          </div>

          <div
            onClick={() => handleStatusCardClick('待签发')}
            className="bg-white p-3.5 rounded-2xl border border-slate-100 shadow-sm cursor-pointer hover:bg-rose-50/10 hover:border-rose-100 transition-all"
          >
            <div className="flex justify-between items-center text-slate-400 mb-1">
              <span className="text-xs font-bold text-slate-500">待办电子印盖</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
            </div>
            <div className="text-2xl font-extrabold text-slate-800 tracking-tight">{pendingAwardCount}</div>
            <p className="text-[9px] text-rose-500 font-extrabold mt-1">需电子签章核发 ➜</p>
          </div>
        </div>

        {/* Chart Section 1: Donut Status Chart */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-xs font-extrabold text-slate-700 mb-3.5 flex items-center justify-between">
            <span>案件办理状态比例分布图</span>
            <span className="text-[11px] font-normal text-slate-400">委案基数总计: {totalStatusValue} 件</span>
          </h4>

          <div className="grid grid-cols-12 gap-4 items-center">
            {/* SVG Donut */}
            <div className="col-span-5 relative flex items-center justify-center">
              <svg viewBox="0 0 120 120" className="w-[110px] h-[110px] transform -rotate-90">
                <circle cx="60" cy="60" r="45" fill="none" stroke="#F1F5F9" strokeWidth="11" />
                {statusData.map((item, index) => {
                  const percentage = (item.value / totalStatusValue) * 100;
                  const strokeDasharray = `${(percentage * 2 * Math.PI * 45) / 100} 283`;
                  const strokeDashoffset = -((cumulativeAngle * 2 * Math.PI * 45) / 100);
                  
                  // Accumulate angle
                  cumulativeAngle += percentage;
                  
                  const isHovered = hoveredSlice === item.label;

                  return (
                    <circle
                      key={index}
                      cx="60"
                      cy="60"
                      r="45"
                      fill="none"
                      stroke={item.color}
                      strokeWidth={isHovered ? 14 : 11}
                      strokeDasharray={strokeDasharray}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredSlice(item.label)}
                      onMouseLeave={() => setHoveredSlice(null)}
                      onClick={() => handleStatusCardClick(item.statusType)}
                      className="cursor-pointer transition-all duration-300 hover:opacity-95"
                    />
                  );
                })}
              </svg>
              {/* Inner details text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <span className="text-[9px] text-slate-400 font-extrabold">主审率</span>
                <span className="text-xs font-extrabold text-slate-800 leading-none mt-0.5">
                  {(( (inTrialCount + pendingHearingCount + pendingAwardCount) / totalStatusValue) * 100).toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Legends */}
            <div className="col-span-7 space-y-2">
              {statusData.map((item, index) => {
                const percentage = ((item.value / totalStatusValue) * 100).toFixed(1);
                const isHovered = hoveredSlice === item.label;
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setHoveredSlice(item.label)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    onClick={() => handleStatusCardClick(item.statusType)}
                    className={`flex items-center justify-between p-1.5 rounded-xl cursor-pointer transition-colors ${
                      isHovered ? 'bg-indigo-50/50' : 'hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                      <span className="text-[11px] font-bold text-slate-600">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-right">
                      <span className="text-xs font-extrabold text-slate-800">{item.value}件</span>
                      <span className="text-[10px] text-slate-400 font-bold">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart Section 2: Horizontal Bar Chart of Case Categories */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-xs font-extrabold text-slate-700 mb-4">
            争议法律纠纷性质类别分布一览
          </h4>

          <div className="space-y-4">
            {categoryData.map((item, index) => {
              const maxValue = Math.max(...categoryData.map(c => c.value));
              const percentageOfMax = (item.value / maxValue) * 100;
              const isHovered = hoveredBar === item.label;

              return (
                <div 
                  key={index}
                  onMouseEnter={() => setHoveredBar(item.label)}
                  onMouseLeave={() => setHoveredBar(null)}
                  className="space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[11px]">
                    <span className="font-extrabold text-slate-700 flex items-center space-x-1.5">
                      <span className="text-[9px] text-indigo-600 font-extrabold bg-indigo-50 px-1.5 py-0.5 rounded-lg">Rank {index+1}</span>
                      <span>{item.label}</span>
                    </span>
                    <span className="font-extrabold text-slate-800">{item.value} 件案</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden relative">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 relative ${
                        isHovered 
                        ? 'bg-gradient-to-r from-indigo-500 to-indigo-700 shadow-sm shadow-indigo-500/50' 
                        : 'bg-gradient-to-r from-indigo-400 to-indigo-500'
                      }`}
                      style={{ width: `${percentageOfMax}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart Section 3: Line Area Interactive Monthly Resolution trend */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-3">
            <div>
              <h4 className="text-xs font-extrabold text-slate-700">2026年年度月度案件吞吐趋势</h4>
              <p className="text-[10px] text-slate-400 font-medium">新增受理与生效结案比照图</p>
            </div>
            <div className="flex items-center space-x-2.5 text-[10px] font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-indigo-500 inline-block"></span> 收案
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-500 inline-block"></span> 结案
              </span>
            </div>
          </div>

          <div className="relative pt-1">
            {/* Custom SVG Line Chart */}
            <svg viewBox="0 0 300 130" className="w-full h-[120px] overflow-visible">
              {/* Grid Lines */}
              <line x1="20" y1="10" x2="280" y2="10" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="50" x2="280" y2="50" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="90" x2="280" y2="90" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="20" y1="110" x2="280" y2="110" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Chart Paths */}
              <path
                d="M 25 110 L 25 70 L 75 50 L 125 60 L 175 35 L 225 65 L 275 55 L 275 110 Z"
                fill="url(#indigoGradient)"
                opacity="0.1"
              />
              <path
                d="M 25 110 L 25 80 L 75 65 L 125 40 L 175 55 L 225 45 L 275 70 L 275 110 Z"
                fill="url(#emeraldGradient)"
                opacity="0.10"
              />

              {/* Definition for Gradients */}
              <defs>
                <linearGradient id="indigoGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6366F1" />
                  <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Draw Lines */}
              <path
                d="M 25 70 L 75 50 L 125 60 L 175 35 L 225 65 L 275 55"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M 25 80 L 75 65 L 125 40 L 175 55 L 225 45 L 275 70"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interaction Bars / Columns */}
              {monthlyData.map((item, index) => {
                const xPos = 25 + index * 50;
                return (
                  <rect
                    key={index}
                    x={xPos - 20}
                    y="10"
                    width="40"
                    height="100"
                    fill="transparent"
                    onMouseEnter={() => setActiveTrendMonth(index)}
                    onMouseLeave={() => setActiveTrendMonth(null)}
                    className="cursor-pointer"
                  />
                );
              })}

              {/* Hover highlight indicators */}
              {activeTrendMonth !== null && (
                <g className="pointer-events-none">
                  {/* Vertical rule */}
                  <line 
                    x1={25 + activeTrendMonth * 50} 
                    y1="10" 
                    x2={25 + activeTrendMonth * 50} 
                    y2="110" 
                    stroke="#D1D5DB" 
                    strokeWidth="1.2" 
                    strokeDasharray="3,3" 
                  />
                  {/* Circle 1 Input */}
                  <circle 
                    cx={25 + activeTrendMonth * 50} 
                    cy={110 - (monthlyData[activeTrendMonth].input / 20) * 100} 
                    r="5.5" 
                    fill="#6366F1" 
                    stroke="#FFFFFF" 
                    strokeWidth="2" 
                  />
                  {/* Circle 2 Resolved */}
                  <circle 
                    cx={25 + activeTrendMonth * 50} 
                    cy={110 - (monthlyData[activeTrendMonth].resolved / 20) * 100} 
                    r="5.5" 
                    fill="#10B981" 
                    stroke="#FFFFFF" 
                    strokeWidth="2" 
                  />
                </g>
              )}

              {/* Month Text Labels */}
              {monthlyData.map((item, index) => (
                <text
                  key={index}
                  x={25 + index * 50}
                  y="125"
                  fill="#94A3B8"
                  fontSize="8.5"
                  textAnchor="middle"
                  className="font-bold select-none"
                >
                  {item.name}
                </text>
              ))}
            </svg>

            {/* Hover Tooltip Box */}
            <div className="h-11 flex justify-center items-center mt-1">
              {activeTrendMonth !== null ? (
                <div className="bg-slate-800 text-white rounded-xl p-1.5 px-3.5 flex items-center space-x-3.5 text-xs shadow-md animate-fade-in">
                  <span className="font-extrabold border-r border-slate-600 pr-2 text-indigo-300">
                    {monthlyData[activeTrendMonth].name}
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded bg-indigo-500 inline-block"></span>
                    <span>收案: <strong className="font-bold">{monthlyData[activeTrendMonth].input}</strong> 件</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span>
                    <span>结案: <strong className="font-bold">{monthlyData[activeTrendMonth].resolved}</strong> 件</span>
                  </span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-400 italic">在走势图上放置鼠标或触摸以查看每月细节统计</span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* ELECTRONIC IDENTITY CARD QR CODE MODAL */}
      {showQrModal && (
        <div className="absolute inset-0 bg-slate-900/80 z-[70] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[32px] w-full max-w-xs p-6 shadow-2xl border border-slate-100 text-center space-y-4">
            <h4 className="text-xs font-extrabold text-slate-800 tracking-wider">广州市仲裁网云端数字身份通行盾</h4>
            
            {/* Simulated premium QR display */}
            <div className="bg-slate-50 border-2 border-dashed border-indigo-400 p-4 rounded-2xl flex items-center justify-center relative">
              <QrCode size={180} className="text-slate-800" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-2 rounded-xl border-2 border-indigo-500">
                <span className="text-[10px] font-extrabold text-indigo-700 font-mono scale-95 block">GZAC安全</span>
              </div>
            </div>

            <div className="space-y-1 text-slate-500 text-[10px] text-justify leading-relaxed">
              <p className="text-center font-bold text-slate-800">首席仲裁员：张明</p>
              <p className="text-center text-[9px] font-mono select-all">数字认证哈希：CA-925-B605-AES256</p>
              <p className="border-t border-slate-100 pt-2 mt-1">此二维码作为线下庭审签到、多维数字档案解密及委员会内部系统登陆的双重特权身份验证证明。每隔60秒自动滚算加密印防伪。</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-900 text-white font-extrabold py-2 px-4 text-[10.5px] rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              已阅确认并关闭
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
