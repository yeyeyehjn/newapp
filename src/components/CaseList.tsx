import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Building2, FileText, Calendar, User, Coins, SlidersHorizontal, Star, Clock, AlertTriangle } from 'lucide-react';
import { Case, CaseStatus, ArbitratorRole } from '../types';

interface CaseListProps {
  cases: Case[];
  onSelectCase: (caseItem: Case) => void;
  selectedStatusFilter?: CaseStatus | 'all';
  onFilterStatusChange?: (status: CaseStatus | 'all') => void;
  quickFilter?: 'none' | 'major' | 'nearDelayed' | 'delayed';
  onQuickFilterChange?: (filter: 'none' | 'major' | 'nearDelayed' | 'delayed') => void;
}

// Helper: check if a case has a hearing that is past due with status '待开庭'
const isDelayed = (c: Case): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return c.hearings.some(h => h.status === '待开庭' && h.hearingTime < today);
};

// Helper: check if a case has a hearing within 7 days with status '待开庭'
const isNearDelayed = (c: Case): boolean => {
  const now = new Date();
  const sevenDaysLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const todayStr = now.toISOString().split('T')[0];
  const futureStr = sevenDaysLater.toISOString().split('T')[0];
  return c.hearings.some(h => h.status === '待开庭' && h.hearingTime >= todayStr && h.hearingTime <= futureStr);
};

// Helper: check if a case is a major case (disputeAmount >= 1亿)
const isMajor = (c: Case): boolean => {
  return c.disputeAmount >= 100000000;
};

export default function CaseList({ cases, onSelectCase, selectedStatusFilter: externalStatusFilter, onFilterStatusChange, quickFilter: externalQuickFilter, onQuickFilterChange }: CaseListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalStatusFilter, setInternalStatusFilter] = useState<CaseStatus | 'all'>('审理中');
  const selectedStatusFilter = externalStatusFilter ?? internalStatusFilter;
  const setSelectedStatusFilter = (status: CaseStatus | 'all') => {
    setInternalStatusFilter(status);
    onFilterStatusChange?.(status);
  };
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);

  // New filter states
  const [selectedRole, setSelectedRole] = useState<ArbitratorRole | 'all'>('all');
  const [selectedSecretary, setSelectedSecretary] = useState<string>('');
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 100000]);
  const [hearingDateRange, setHearingDateRange] = useState<[string, string]>(['', '']);
  const [selectedCloseMethod, setSelectedCloseMethod] = useState<'裁决' | '调解' | '撤案' | 'all'>('all');
  const [internalQuickFilter, setInternalQuickFilter] = useState<'none' | 'major' | 'nearDelayed' | 'delayed'>('none');
  const quickFilter = externalQuickFilter ?? internalQuickFilter;
  const setQuickFilter = (filter: 'none' | 'major' | 'nearDelayed' | 'delayed') => {
    setInternalQuickFilter(filter);
    onQuickFilterChange?.(filter);
  };

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
    
    { label: '在办案件', value: '审理中' },
    { label: '已结案件', value: '已结案' },
    { label: '全部', value: 'all' },
  ];

  // Role options
  const roleOptions: { label: string; value: ArbitratorRole | 'all' }[] = [
    { label: '全部', value: 'all' },
    { label: '独任', value: '独任' },
    { label: '首席', value: '首席' },
    { label: '边裁', value: '边裁' },
  ];

  // Close method options
  const closeMethodOptions: { label: string; value: '裁决' | '调解' | '撤案' | 'all' }[] = [
    { label: '全部', value: 'all' },
    { label: '裁决', value: '裁决' },
    { label: '调解', value: '调解' },
    { label: '撤案', value: '撤案' },
  ];

  // Quick filter options
  const quickFilterOptions: { label: string; value: 'major' | 'nearDelayed' | 'delayed'; icon: React.ReactNode }[] = [
    { label: '重大案件', value: 'major', icon: <Star size={12} className="text-yellow-400 fill-yellow-400" /> },
    { label: '即将延期', value: 'nearDelayed', icon: <Clock size={12} className="text-amber-500" /> },
    { label: '已延期', value: 'delayed', icon: <AlertTriangle size={12} className="text-red-500" /> },
  ];

  // Filtered cases list based on all filters
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      // 1. Status Filter
      if (selectedStatusFilter !== 'all' && c.status !== selectedStatusFilter) {
        return false;
      }
      // 2. Role Filter
      if (selectedRole !== 'all' && c.role !== selectedRole) {
        return false;
      }
      // 3. Secretary Filter
      if (selectedSecretary && !c.secretary.includes(selectedSecretary)) {
        return false;
      }
      // 4. Amount Range Filter (万元 → CNY)
      if (amountRange[0] > 0 && c.disputeAmount < amountRange[0] * 10000) {
        return false;
      }
      if (amountRange[1] < 100000 && c.disputeAmount > amountRange[1] * 10000) {
        return false;
      }
      // 5. Hearing Date Range Filter
      if (hearingDateRange[0]) {
        const hasHearingAfterStart = c.hearings.some(h => h.hearingTime >= hearingDateRange[0]);
        if (!hasHearingAfterStart) return false;
      }
      if (hearingDateRange[1]) {
        const hasHearingBeforeEnd = c.hearings.some(h => h.hearingTime <= hearingDateRange[1] + 'z');
        if (!hasHearingBeforeEnd) return false;
      }
      // 6. Close Method Filter
      if (selectedCloseMethod !== 'all' && c.closeMethod !== selectedCloseMethod) {
        return false;
      }
      // 7. Quick Filters
      if (quickFilter === 'major' && !isMajor(c)) {
        return false;
      }
      if (quickFilter === 'nearDelayed' && !isNearDelayed(c)) {
        return false;
      }
      if (quickFilter === 'delayed' && !isDelayed(c)) {
        return false;
      }
      // 8. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        if (
          !c.caseNo.toLowerCase().includes(query) &&
          !c.title.toLowerCase().includes(query) &&
          !c.claimant.toLowerCase().includes(query) &&
          !c.respondent.toLowerCase().includes(query)
        ) {
          return false;
        }
      }
      return true;
    });
  }, [cases, selectedStatusFilter, selectedRole, selectedSecretary, amountRange, hearingDateRange, selectedCloseMethod, quickFilter, searchQuery]);

  // Reset all filters
  const resetFilters = () => {
    setSelectedRole('all');
    setSelectedSecretary('');
    setAmountRange([0, 100000]);
    setHearingDateRange(['', '']);
    setSelectedCloseMethod('all');
    setQuickFilter('none');
  };

  // Get case number color style based on delay status
  const getCaseNoStyle = (c: Case): React.CSSProperties => {
    if (isDelayed(c)) return { color: '#f56c6c' };
    if (isNearDelayed(c)) return { color: '#e6a23c' };
    return {};
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">

      {/* Search & Tabs Stick Area */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 space-y-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
        {/* Search Input with Filter Toggle */}
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索案号、当事人、案件关键词..."
            className="w-full pl-9 pr-10 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
          />
          <button
            onClick={() => setShowFilterDrawer(!showFilterDrawer)}
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer transition-colors ${
              showFilterDrawer ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
            }`}
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Tab Controllers */}
        <div className="flex gap-2">
          {statusTabs.map((tab) => {
            const isActive = selectedStatusFilter === tab.value;
            const count = tab.value === 'all'
              ? cases.length
              : cases.filter(c => c.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => setSelectedStatusFilter(tab.value)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex items-center gap-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                  isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200/80 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Comprehensive Filter Panel */}
      {showFilterDrawer && (
        <>
          {/* Backdrop overlay */}
          <div
            className="absolute inset-0 bg-slate-900/30 z-20"
            onClick={() => setShowFilterDrawer(false)}
          />
          {/* Filter Panel */}
          <div className="bg-white border-b border-indigo-50 px-4 py-3 flex-shrink-0 animate-slide-down shadow-lg z-30 relative space-y-2.5 order-first">
           
            {/* Secretary Filter */}
            <div className="flex items-start gap-3">
              <span className="text-base text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                经办秘书
              </span>
              <div className="flex-1">
                <input
                  type="text"
                  value={selectedSecretary}
                  onChange={(e) => setSelectedSecretary(e.target.value)}
                  placeholder="搜索经办秘书姓名"
                  className="w-full px-2 py-1 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Amount Range Filter */}
            <div className="flex items-start gap-3 mt-2">
              <span className="text-base text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                标的区间
              </span>
              <div className="flex items-center gap-2 flex-1">
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    value={amountRange[0] === 0 ? '' : amountRange[0]}
                    onChange={(e) => setAmountRange([Number(e.target.value) || 0, amountRange[1]])}
                    placeholder="标的下限"
                    className="w-full px-2 py-1 pr-7 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base">万</span>
                </div>
                <span className="text-slate-400 text-sm">-</span>
                <div className="relative flex-1">
                  <input
                    type="number"
                    min={0}
                    value={amountRange[1] === 100000 ? '' : amountRange[1]}
                    onChange={(e) => setAmountRange([amountRange[0], Number(e.target.value) || 100000])}
                    placeholder="标的上限"
                    className="w-full px-2 py-1 pr-7 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 text-base">万</span>
                </div>
              </div>
            </div>

            {/* Hearing Date Range Filter */}
            <div className="flex items-start gap-3 mt-2">
              <span className="text-base text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                开庭日期
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="date"
                  value={hearingDateRange[0]}
                  onChange={(e) => setHearingDateRange([e.target.value, hearingDateRange[1]])}
                  className="flex-1 px-2 py-1 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <span className="text-slate-400 text-sm">-</span>
                <input
                  type="date"
                  value={hearingDateRange[1]}
                  onChange={(e) => setHearingDateRange([hearingDateRange[0], e.target.value])}
                  className="flex-1 px-2 py-1 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex items-start gap-3 mt-2">
              <span className="text-base  text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                类型
              </span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {roleOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedRole(opt.value)}
                    className={`py-1 px-2.5 rounded text-base  transition-all cursor-pointer ${
                      selectedRole === opt.value
                        ? 'bg-indigo-600 text-white border border-indigo-600'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Close Method Filter */}
            <div className="flex items-start gap-3 mt-2">
              <span className="text-base text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                结案方式
              </span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {closeMethodOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedCloseMethod(opt.value)}
                    className={`py-1 px-2.5 rounded text-base  transition-all cursor-pointer ${
                      selectedCloseMethod === opt.value
                        ? 'bg-indigo-600 text-white border border-indigo-600'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Filter */}
            <div className="flex items-start gap-3 mt-2">
              <span className="text-base text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                快捷筛选
              </span>
              <div className="flex flex-wrap gap-1.5 flex-1">
                {quickFilterOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setQuickFilter(quickFilter === opt.value ? 'none' : opt.value)}
                    className={`py-1 px-2.5 rounded text-base transition-all cursor-pointer flex items-center gap-1 ${
                      quickFilter === opt.value
                        ? 'bg-indigo-600 text-white border border-indigo-600'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Reset & Confirm Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={resetFilters}
                className="px-4 py-1.5 rounded text-base  text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
              >
                重置
              </button>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="px-4 py-1.5 rounded text-base text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer transition-colors"
              >
                确认
              </button>
            </div>
          </div>
        </>
      )}

      {/* Case list items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredCases.length > 0 ? (
          filteredCases.map((c) => {
            const delayed = isDelayed(c);
            const nearDelayed = isNearDelayed(c);
            const major = isMajor(c);

            const caseNoStyle = getCaseNoStyle(c);

            const roleColorClass = c.role === '首席' ? 'text-indigo-500 bg-indigo-50 border border-indigo-100/80' :
                                   c.role === '独任' ? 'text-purple-500 bg-purple-50 border border-purple-100/80' :
                                   'text-slate-500 bg-slate-50 border border-slate-100';

            const statusColorClass = selectedStatusFilter === '审理中'
              ? (delayed ? 'text-red-500 bg-red-50 border-red-100'
                : nearDelayed ? 'text-amber-500 bg-amber-50 border-amber-100'
                : 'text-indigo-500 bg-indigo-50/60 border-indigo-100')
              : c.status === '已结案' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' :
                 c.status === '待开庭' ? 'text-amber-500 bg-amber-50 border-amber-100' :
                 c.status === '审理中' ? 'text-indigo-500 bg-indigo-50/60 border-indigo-100' :
                 'text-rose-500 bg-rose-50 border-rose-100';

            return (
              <div
                key={c.id}
                onClick={() => onSelectCase(c)}
                className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                {/* Card Title Bar */}
                <div className="flex items-center justify-between">
                  <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-400" />
                    <span style={caseNoStyle}>{c.caseNo}</span>
                    {major && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
                  </span>
                  <span className={`text-sm p-0.5 px-1.5 rounded border ${statusColorClass}`}>
                    {selectedStatusFilter === '审理中'
                      ? (delayed ? '已延期' : nearDelayed ? '即将延期' : '审理中')
                      : c.status}
                  </span>
                </div>

                {/* Info rows */}
                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{c.claimant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">被申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{c.respondent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coins size={12} className="text-amber-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">争议金额</span>
                    <span className="text-slate-700 flex-1 text-left">{formatCNY(c.disputeAmount)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">办案秘书</span>
                    <span className="text-slate-700 flex-1 text-left">{c.secretary || '—'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">立案时间</span>
                    <span className="text-slate-700 flex-1 text-left">{c.startDate}</span>
                  </div>
                </div>

                {/* Footer seat label & categories */}
                <div className="flex items-center justify-between pt-1 text-sm">
                  <div className="flex gap-1.5">
                    <span className={`p-0.5 px-1.5 rounded ${roleColorClass}`}>
                      {c.role}
                    </span>
                    <span className="p-0.5 px-1.5 bg-slate-50 text-slate-500 rounded border border-slate-100">
                      {c.category}
                    </span>
                  </div>
                </div>

              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-500">未检索到与该过滤匹配的仲裁案</span>
            <button
              onClick={() => { setSearchQuery(''); setSelectedStatusFilter('all'); resetFilters(); }}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-500 text-sm rounded-lg cursor-pointer hover:bg-indigo-100/80 transition-colors"
            >
              清空搜索与过滤
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
