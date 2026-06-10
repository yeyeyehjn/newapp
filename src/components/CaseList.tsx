import React, { useState, useMemo } from 'react';
import { Search, Filter, SlidersHorizontal, ChevronRight, BookOpen, AlertCircle } from 'lucide-react';
import { Case, CaseStatus, CaseCategory } from '../types';

interface CaseListProps {
  cases: Case[];
  onSelectCase: (caseItem: Case) => void;
  selectedStatusFilter: CaseStatus | 'all';
  onFilterStatusChange: (status: CaseStatus | 'all') => void;
}

export default function CaseList({ 
  cases, 
  onSelectCase, 
  selectedStatusFilter, 
  onFilterStatusChange 
}: CaseListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory | 'all'>('all');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // Helper formatting money in CNY
  const formatCNY = (amount: number) => {
    if (amount >= 10000000) {
      return `¥${(amount / 10000000).toFixed(1)} 千万元`;
    }
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(0)} 万元`;
    }
    return `¥${amount.toLocaleString()}`;
  };

  // Status Tabs Definition
  const statusTabs: { label: string; value: CaseStatus | 'all' }[] = [
    { label: '全部', value: 'all' },
    { label: '审理中', value: '审理中' },
    { label: '待开庭', value: '待开庭' },
    { label: '待签名', value: '待签名' },
    { label: '已结案', value: '已结案' },
  ];

  // All categories present
  const categoryOptions: (CaseCategory | 'all')[] = [
    'all',
    '股权投资纠纷',
    '国际贸易纠纷',
    '建设工程纠纷',
    '知识产权纠纷',
    '金融借款合同',
  ];

  // Filtered cases list based on status and search query
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // 1. Status Filter
      if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) {
        return false;
      }
      // 2. Category Filter
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }
      // 3. Search Query (matches caseNo, title, claimant, respondent)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          c.caseNo.toLowerCase().includes(query) ||
          c.title.toLowerCase().includes(query) ||
          c.claimant.toLowerCase().includes(query) ||
          c.respondent.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [cases, selectedStatusFilter, selectedCategory, searchQuery]);

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-20 overflow-hidden relative">
      
      {/* Search & Tabs Stick Area */}
      <div className="bg-white border-b border-indigo-50 p-3 space-y-3 flex-shrink-0 shadow-sm z-10 w-full">
        {/* Search Input and Filter Toggle */}
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索案号、当事人、案件关键词..."
              className="w-full bg-slate-50 text-xs text-slate-800 p-2.5 pl-9 rounded-xl border-none ring-1 ring-slate-200/60 focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-400"
            />
          </div>
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`p-2.5 rounded-xl border border-slate-200 text-slate-500 cursor-pointer flex items-center gap-1 hover:bg-slate-50 transition-colors ${
              selectedCategory !== 'all' ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : ''
            }`}
          >
            <SlidersHorizontal size={15} />
            <span className="text-[11px] font-bold hidden sm:inline">筛选</span>
          </button>
        </div>

        {/* Tab Controllers */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-0.5 max-w-full">
          {statusTabs.map((tab) => {
            const isActive = selectedStatusFilter === tab.value;
            // Get count of cases under this tab
            const count = tab.value === 'all' 
              ? cases.length 
              : cases.filter(c => c.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => onFilterStatusChange(tab.value)}
                className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 rounded-full ${isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200/80 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Conditional category filter list drawer */}
      {showFilterDrawer && (
        <div className="bg-white border-b border-indigo-50 px-4 py-3 flex-shrink-0 animate-slide-down flex items-center justify-between shadow-inner">
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">
              按纠纷类别筛选
            </span>
            <div className="flex flex-wrap gap-1.5 max-w-full">
              {categoryOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setSelectedCategory(opt)}
                  className={`py-1 px-2.5 rounded-lg text-[10px] font-extrabold transition-all cursor-pointer ${
                    selectedCategory === opt 
                      ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
                      : 'bg-slate-50 text-slate-500 hover:bg-slate-100 border border-transparent'
                  }`}
                >
                  {opt === 'all' ? '全部纠纷类别' : opt}
                </button>
              ))}
            </div>
          </div>
          <button 
            onClick={() => { setSelectedCategory('all'); setShowFilterDrawer(false); }}
            className="text-xs font-bold text-indigo-600 cursor-pointer self-end pb-1.5 hover:underline border-l border-slate-100 pl-3 ml-3"
          >
            重置
          </button>
        </div>
      )}

      {/* Case list items */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => {
            // Define active colored tags
            const roleColorClass = c.role === '首席仲裁员' ? 'text-indigo-600 bg-indigo-50 border border-indigo-100/80' : 
                                   c.role === '独任仲裁员' ? 'text-purple-600 bg-purple-50 border border-purple-100/80' :
                                   'text-slate-500 bg-slate-50 border border-slate-100';

            const statusColorClass = c.status === '审理中' ? 'text-indigo-600 bg-indigo-50/60 border-indigo-100' :
                                     c.status === '已结案' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' :
                                     c.status === '待开庭' ? 'text-amber-500 bg-amber-50 border-amber-100' :
                                     'text-rose-500 bg-rose-50 border-rose-100';

            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                {/* Card Title Bar */}
                <div className="flex items-center justify-between">
                  {/* Case No */}
                  <span className="text-xs font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {c.caseNo}
                  </span>
                  
                  {/* Status Badge */}
                  <span className={`text-[10px] p-0.5 px-1.5 rounded-lg font-bold border ${statusColorClass}`}>
                    ● {c.status}
                  </span>
                </div>

                {/* Case Title */}
                <h4 className="text-xs font-bold text-slate-700 line-clamp-2 leading-snug tracking-tight">
                  {c.title}
                </h4>

                {/* Dispute amounts & properties */}
                <div className="flex items-center justify-between text-[11px] border-t border-dashed border-slate-100 pt-3 text-slate-500">
                  <div className="flex flex-col space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-medium">诉求争议标的额</span>
                    <strong className="text-slate-700 font-extrabold">{formatCNY(c.disputeAmount)}</strong>
                  </div>
                  <div className="flex flex-col items-end space-y-0.5">
                    <span className="text-[9px] text-slate-400 font-medium font-sans">立案时间</span>
                    <span className="font-mono text-slate-500 font-semibold">{c.startDate}</span>
                  </div>
                </div>

                {/* Footer seat label & categories */}
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <div className="flex gap-1.5">
                    <span className={`p-0.5 px-1.5 rounded-lg font-extrabold ${roleColorClass}`}>
                      {c.role}
                    </span>
                    <span className="p-0.5 px-1.5 bg-slate-50 text-slate-400 rounded-lg font-semibold border border-slate-100">
                      {c.category}
                    </span>
                  </div>
                  
                  <div className="text-xs font-bold text-indigo-600 flex items-center group-hover:translate-x-0.5 transition-transform">
                    <span>处理 </span>
                    <ChevronRight size={14} />
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-xs font-semibold text-slate-400">未检索到与该过滤匹配的仲裁案</span>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); onFilterStatusChange('all'); }}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-lg cursor-pointer hover:bg-indigo-100/80 transition-colors"
            >
              清空搜索与过滤
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
