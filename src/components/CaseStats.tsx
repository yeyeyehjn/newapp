import React, { useState } from 'react';
import { 
  TrendingUp, AlertCircle, FileText, CheckCircle2, User, ChevronRight,
  Shield, Key, Lock, Fingerprint, ShieldCheck, RefreshCw, QrCode, 
  Settings, ArrowRightLeft, HelpCircle, Archive, Eye, Trash2, Calendar
} from 'lucide-react';
import { Case, CaseCategory, CaseStatus } from '../types';

type TimeFilterType = 'year' | 'quarter' | 'month';

interface TimeFilterState {
  type: TimeFilterType;
  year: number;
  quarter?: number;
  month?: number;
}

interface CaseStatsProps {
  cases: Case[];
  onNavigateToTab: (index: number) => void;
  onFilterStatus: (status: CaseStatus | 'all') => void;
}

export default function CaseStats({ cases, onNavigateToTab, onFilterStatus }: CaseStatsProps) {
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [activeTrendMonth, setActiveTrendMonth] = useState<number | null>(null);

  // Time filter states for each chart module
  const [statusChartFilter, setStatusChartFilter] = useState<TimeFilterState>({ type: 'year', year: 2026 });
  const [categoryChartFilter, setCategoryChartFilter] = useState<TimeFilterState>({ type: 'year', year: 2026 });
  const [trendChartFilter, setTrendChartFilter] = useState<TimeFilterState>({ type: 'year', year: 2026 });
  const [resolutionChartFilter, setResolutionChartFilter] = useState<TimeFilterState>({ type: 'year', year: 2026 });

  // States for interactive security buttons
  const [caStatus, setCaStatus] = useState<'pending' | 'syncing' | 'active'>('active');
  const [faceStatus, setFaceStatus] = useState<'unbound' | 'binding' | 'bound'>('bound');
  const [isClearing, setIsClearing] = useState<boolean>(false);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Helper function to get time filter label
  const getTimeFilterLabel = (filter: TimeFilterState): string => {
    if (filter.type === 'year') {
      return `${filter.year}年度`;
    } else if (filter.type === 'quarter') {
      return `${filter.year}年Q${filter.quarter}季度`;
    } else {
      const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      return `${filter.year}年${monthNames[filter.month! - 1]}`;
    }
  };

  // Helper function to adjust data based on time filter
  const getAdjustedData = (baseData: any, filter: TimeFilterState) => {
    // For demo purposes, we'll adjust the counts based on time period
    // In real app, this would query actual data based on the filter
    let multiplier = 1;
    if (filter.type === 'quarter') {
      multiplier = 0.25; // Quarter is ~25% of year
    } else if (filter.type === 'month') {
      multiplier = 0.083; // Month is ~8.3% of year
    }
    return baseData * multiplier;
  };

  // Time filter component
  const TimeFilterSelector = ({ 
    filter, 
    onFilterChange,
    showMonth = true 
  }: { 
    filter: TimeFilterState; 
    onFilterChange: (newFilter: TimeFilterState) => void;
    showMonth?: boolean;
  }) => {
    const years = [2024, 2025, 2026];
    const quarters = [1, 2, 3, 4];
    const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

    return (
      <div className="flex items-center gap-2 mb-3">
        <Calendar size={14} className="text-slate-400" />
        <div className="flex gap-1.5">
          {/* Year selector */}
          <select
            value={filter.year}
            onChange={(e) => onFilterChange({ ...filter, year: parseInt(e.target.value) })}
            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
          >
            {years.map(y => (
              <option key={y} value={y}>{y}年</option>
            ))}
          </select>

          {/* Type selector */}
          <select
            value={filter.type}
            onChange={(e) => {
              const newType = e.target.value as TimeFilterType;
              const newFilter: TimeFilterState = { ...filter, type: newType };
              if (newType === 'quarter') {
                newFilter.quarter = 1;
                newFilter.month = undefined;
              } else if (newType === 'month') {
                newFilter.month = 1;
                newFilter.quarter = undefined;
              } else {
                newFilter.quarter = undefined;
                newFilter.month = undefined;
              }
              onFilterChange(newFilter);
            }}
            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
          >
            <option value="year">年度</option>
            <option value="quarter">季度</option>
            {showMonth && <option value="month">月度</option>}
          </select>

          {/* Quarter selector */}
          {filter.type === 'quarter' && (
            <select
              value={filter.quarter}
              onChange={(e) => onFilterChange({ ...filter, quarter: parseInt(e.target.value) })}
              className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
            >
              {quarters.map(q => (
                <option key={q} value={q}>Q{q}</option>
              ))}
            </select>
          )}

          {/* Month selector */}
          {filter.type === 'month' && (
            <select
              value={filter.month}
              onChange={(e) => onFilterChange({ ...filter, month: parseInt(e.target.value) })}
              className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
            >
              {months.map(m => (
                <option key={m} value={m}>{m}月</option>
              ))}
            </select>
          )}
        </div>
      </div>
    );
  };

  // Statistics aggregates with time filter adjustment
  const totalCases = Math.round(getAdjustedData(cases.length + 138, statusChartFilter)); // Add real historic count: total 143 cases
  const inTrialCount = Math.round(getAdjustedData(cases.filter(c => c.status === '审理中').length, statusChartFilter));
  const pendingHearingCount = Math.round(getAdjustedData(cases.filter(c => c.status === '待开庭').length, statusChartFilter));
  const pendingAwardCount = Math.round(getAdjustedData(cases.filter(c => c.status === '待签名').length, statusChartFilter));
  const closedCount = Math.round(getAdjustedData(cases.filter(c => c.status === '已结案').length + 138, statusChartFilter)); // Include legacy records

  // Status breakdown array for circle chart with indigo accent
  const statusData = [
    { label: '已结案', value: closedCount, color: '#10B981', statusType: '已结案' as CaseStatus },
    { label: '审理中', value: inTrialCount, color: '#4780FF', statusType: '审理中' as CaseStatus },
    { label: '待开庭', value: pendingHearingCount, color: '#F59E0B', statusType: '待开庭' as CaseStatus },
    { label: '待签名', value: pendingAwardCount, color: '#EF4444', statusType: '待签名' as CaseStatus },
  ];

  // Category statistics from cases (realistic historical aggregates) with time filter
  const categories: { [key in CaseCategory]?: number } = {
    '股权投资纠纷': Math.round(getAdjustedData(45, categoryChartFilter)),
    '国际贸易纠纷': Math.round(getAdjustedData(38, categoryChartFilter)),
    '建设工程纠纷': Math.round(getAdjustedData(29, categoryChartFilter)),
    '知识产权纠纷': Math.round(getAdjustedData(18, categoryChartFilter)),
    '金融借款合同': Math.round(getAdjustedData(12, categoryChartFilter)),
  };

  // Convert categories object to list sorted
  const categoryData = Object.entries(categories).map(([k, val]) => ({
    label: k as CaseCategory,
    value: val,
  })).sort((a, b) => b.value - a.value);

  // Monthly stats trend data (Jan to Jun 2026) with time filter adjustment
  const monthlyData = [
    { name: '1月', input: Math.round(getAdjustedData(8, trendChartFilter)), resolved: Math.round(getAdjustedData(6, trendChartFilter)) },
    { name: '2月', input: Math.round(getAdjustedData(12, trendChartFilter)), resolved: Math.round(getAdjustedData(9, trendChartFilter)) },
    { name: '3月', input: Math.round(getAdjustedData(10, trendChartFilter)), resolved: Math.round(getAdjustedData(14, trendChartFilter)) },
    { name: '4月', input: Math.round(getAdjustedData(15, trendChartFilter)), resolved: Math.round(getAdjustedData(11, trendChartFilter)) },
    { name: '5月', input: Math.round(getAdjustedData(9, trendChartFilter)), resolved: Math.round(getAdjustedData(13, trendChartFilter)) },
    { name: '6月', input: Math.round(getAdjustedData(11, trendChartFilter)), resolved: Math.round(getAdjustedData(8, trendChartFilter)) },
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
      <div className="flex-1  space-y-4 overflow-y-auto no-scrollbar w-full text-left">
        

        {/* Chart Section 1: Donut Status Chart */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-extrabold text-slate-700">案件办理状态比例分布图</h4>
            <span className="text-sm font-normal text-slate-400">委案基数总计: {totalStatusValue} 件</span>
          </div>
          <TimeFilterSelector filter={statusChartFilter} onFilterChange={setStatusChartFilter} />

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
                <span className="text-xs text-slate-400 font-extrabold">主审率</span>
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
                      <span className="text-sm font-bold text-slate-600">{item.label}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-right">
                      <span className="text-xs font-extrabold text-slate-800">{item.value}件</span>
                      <span className="text-xs text-slate-400 font-bold">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chart Section 2: Horizontal Bar Chart of Case Categories */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <h4 className="text-xs font-extrabold text-slate-700 mb-2">
            争议法律纠纷性质类别分布一览
          </h4>
          <TimeFilterSelector filter={categoryChartFilter} onFilterChange={setCategoryChartFilter} />

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
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-extrabold text-slate-700 flex items-center space-x-1.5">
                      <span className="text-xs text-indigo-600 font-extrabold bg-indigo-50 px-2 py-0.5 rounded-lg">Rank {index+1}</span>
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
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-extrabold text-slate-700">{getTimeFilterLabel(trendChartFilter)}案件吞吐趋势</h4>
              <p className="text-xs text-slate-400 font-medium">新增受理与生效结案比照图</p>
            </div>
            <div className="flex items-center space-x-2.5 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-indigo-500 inline-block"></span> 收案
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-0.5 bg-emerald-500 inline-block"></span> 结案
              </span>
            </div>
          </div>
          <TimeFilterSelector filter={trendChartFilter} onFilterChange={setTrendChartFilter} showMonth={false} />

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
                  <span className="flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded bg-indigo-500 inline-block"></span>
                    <span>收案: <strong className="font-bold">{monthlyData[activeTrendMonth].input}</strong> 件</span>
                  </span>
                  <span className="flex items-center gap-1.5 text-sm">
                    <span className="w-2 h-2 rounded bg-emerald-500 inline-block"></span>
                    <span>结案: <strong className="font-bold">{monthlyData[activeTrendMonth].resolved}</strong> 件</span>
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">在走势图上放置鼠标或触摸以查看每月细节统计</span>
              )}
            </div>
          </div>
        </div>

        {/* Chart Section 4: Resolution Statistics Bar Chart */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-xs font-extrabold text-slate-700">年度/季度结案统计</h4>
              <p className="text-xs text-slate-400 font-medium">各时间段结案数量对比</p>
            </div>
          </div>
          <TimeFilterSelector filter={resolutionChartFilter} onFilterChange={setResolutionChartFilter} showMonth={false} />

          {/* Bar Chart for Resolution Statistics */}
          <div className="relative pt-2">
            {/* Resolution data based on time periods */}
            {(() => {
              // Generate data based on filter type
              let resolutionData: { period: string; resolved: number; color: string }[] = [];

              if (resolutionChartFilter.type === 'year') {
                // Show yearly data
                resolutionData = [
                  { period: '2024年', resolved: 128, color: '#6366F1' },
                  { period: '2025年', resolved: 145, color: '#8B5CF6' },
                  { period: '2026年', resolved: Math.round(getAdjustedData(138, resolutionChartFilter)), color: '#A78BFA' },
                ];
              } else if (resolutionChartFilter.type === 'quarter') {
                // Show quarterly data for selected year
                resolutionData = [
                  { period: `${resolutionChartFilter.year}年Q1`, resolved: Math.round(getAdjustedData(35, resolutionChartFilter)), color: '#6366F1' },
                  { period: `${resolutionChartFilter.year}年Q2`, resolved: Math.round(getAdjustedData(42, resolutionChartFilter)), color: '#8B5CF6' },
                  { period: `${resolutionChartFilter.year}年Q3`, resolved: Math.round(getAdjustedData(38, resolutionChartFilter)), color: '#A78BFA' },
                  { period: `${resolutionChartFilter.year}年Q4`, resolved: Math.round(getAdjustedData(33, resolutionChartFilter)), color: '#C4B5FD' },
                ];
              }

              const maxResolved = Math.max(...resolutionData.map(d => d.resolved));
              const totalResolved = resolutionData.reduce((sum, d) => sum + d.resolved, 0);

              return (
                <div className="space-y-3">
                  {resolutionData.map((item, index) => {
                    const percentage = (item.resolved / maxResolved) * 100;
                    const proportion = ((item.resolved / totalResolved) * 100).toFixed(1);
                    return (
                      <div key={index} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-bold text-slate-700">{item.period}</span>
                          <span className="font-extrabold text-slate-800">{item.resolved} 件</span>
                        </div>
                        <div className="w-full bg-slate-100 h-8 rounded-lg overflow-hidden relative">
                          <div
                            className="h-full rounded-lg transition-all duration-500 relative flex items-center justify-end pr-2"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          >
                            {/* Show percentage inside the bar if it's wide enough */}
                            {percentage > 30 && (
                              <span className="text-xs font-bold text-white">
                                {proportion}%
                              </span>
                            )}
                          </div>
                          {/* Show percentage outside the bar if it's narrow */}
                          {percentage <= 30 && (
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                              {proportion}%
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Summary */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-600">
                        {resolutionChartFilter.type === 'year' ? '三年总计' : `${resolutionChartFilter.year}年总计`}
                      </span>
                      <span className="text-sm font-extrabold text-indigo-600">{totalResolved} 件</span>
                    </div>
                  </div>
                </div>
              );
            })()}
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
                <span className="text-xs font-extrabold text-indigo-700 font-mono scale-95 block">GZAC安全</span>
              </div>
            </div>

            <div className="space-y-1 text-slate-500 text-xs text-justify leading-relaxed">
              <p className="text-center font-bold text-slate-800">首席仲裁员：张明</p>
              <p className="text-center text-xs font-mono select-all">数字认证哈希：CA-925-B605-AES256</p>
              <p className="border-t border-slate-100 pt-2 mt-1">此二维码作为线下庭审签到、多维数字档案解密及委员会内部系统登陆的双重特权身份验证证明。每隔60秒自动滚算加密印防伪。</p>
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="w-full bg-slate-900 text-white font-extrabold py-2 px-4 text-xs rounded-xl hover:bg-slate-800 cursor-pointer"
            >
              已阅确认并关闭
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
