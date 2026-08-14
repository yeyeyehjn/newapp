import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, FileText, AlertCircle, Building2, MapPin, Clock, Calendar, SlidersHorizontal, Users } from 'lucide-react';

export interface PendingHearingItem {
  id: string;
  caseNo: string;
  claimant: string;
  respondent: string;
  hearingTime: string;
  hearingLocation: string;
  secretary: string;
  hearingPurpose: string;
  disputeAmount: number;
  status: 'pending' | 'held';
}

interface PendingHearingListProps {
  onBack: () => void;
  onSelectItem: (item: PendingHearingItem) => void;
}

export default function PendingHearingList({ onBack, onSelectItem }: PendingHearingListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [selectedSecretary, setSelectedSecretary] = useState<string>('');
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 100000]);
  const [hearingDateRange, setHearingDateRange] = useState<[string, string]>(['', '']);

  const hearings: PendingHearingItem[] = [
    {
      id: 'ph-1',
      caseNo: '(2026)穗仲案字第0325号',
      claimant: '广州智慧零售科技有限公司',
      respondent: '深圳前海股权投资基金合伙企业',
      hearingTime: '2026-06-20 09:30-10:00',
      hearingLocation: '第三仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '开庭审理',
      disputeAmount: 8500000,
      status: 'pending'
    },
    {
      id: 'ph-2',
      caseNo: '(2026)穗仲案字第0521号',
      claimant: '宏图建筑工程总承包有限公司',
      respondent: '润物高科智能产业园发展公司',
      hearingTime: '2026-06-22 14:00-15:00',
      hearingLocation: '第一仲裁庭',
      secretary: '王小红',
      hearingPurpose: '质证开庭',
      disputeAmount: 32000000,
      status: 'pending'
    },
    {
      id: 'ph-3',
      caseNo: '(2026)穗仲案字第0418号',
      claimant: '广州市天河科技投资有限公司',
      respondent: '上海某某贸易有限公司',
      hearingTime: '2026-05-28 10:00',
      hearingLocation: '第二仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '开庭审理',
      disputeAmount: 5600000,
      status: 'held'
    },
    {
      id: 'ph-4',
      caseNo: '(2026)穗仲案字第0302号',
      claimant: '杭州某某科技有限公司',
      respondent: '浙江某某网络有限公司',
      hearingTime: '2026-06-25 15:30-16:00',
      hearingLocation: '第五仲裁庭',
      secretary: '陈小红',
      hearingPurpose: '辩论开庭',
      disputeAmount: 125000000,
      status: 'pending'
    },
    {
      id: 'ph-5',
      caseNo: '(2026)穗仲案字第0536号',
      claimant: '北京盛世文化传媒股份有限公司',
      respondent: '广州创意设计工作室',
      hearingTime: '2026-05-15 09:00-10:00',
      hearingLocation: '第四仲裁庭',
      secretary: '王小红',
      hearingPurpose: '开庭审理',
      disputeAmount: 4300000,
      status: 'held'
    },
    {
      id: 'ph-6',
      caseNo: '(2026)穗仲案字第0289号',
      claimant: '深圳市前海融资租赁有限公司',
      respondent: '东莞市民营企业投资集团',
      hearingTime: '2026-06-28 10:30-11:00',
      hearingLocation: '第三仲裁庭',
      secretary: '陈小红',
      hearingPurpose: '质证开庭',
      disputeAmount: 7800000,
      status: 'pending'
    }
  ];

  const filteredHearings = useMemo(() => {
    return hearings
      .filter((h) => h.status === 'pending')
      .filter((h) => {
        // Secretary filter (includes match)
        if (selectedSecretary && !h.secretary.includes(selectedSecretary)) {
          return false;
        }
        // Amount range filter (万元 → CNY)
        if (amountRange[0] > 0 && h.disputeAmount < amountRange[0] * 10000) {
          return false;
        }
        if (amountRange[1] < 100000 && h.disputeAmount > amountRange[1] * 10000) {
          return false;
        }
        // Hearing date range filter (extract YYYY-MM-DD before space)
        const hearingDate = h.hearingTime.split(' ')[0];
        if (hearingDateRange[0] && hearingDate < hearingDateRange[0]) {
          return false;
        }
        if (hearingDateRange[1] && hearingDate > hearingDateRange[1]) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          return (
            h.caseNo.toLowerCase().includes(query) ||
            h.claimant.toLowerCase().includes(query) ||
            h.respondent.toLowerCase().includes(query) ||
            h.secretary.toLowerCase().includes(query) ||
            h.hearingPurpose.toLowerCase().includes(query) ||
            h.hearingLocation.toLowerCase().includes(query)
          );
        }
        return true;
      })
      .sort((a, b) => new Date(a.hearingTime).getTime() - new Date(b.hearingTime).getTime());
  }, [hearings, searchQuery, selectedSecretary, amountRange, hearingDateRange]);

  return (
    <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col animate-slide-in text-left">
      {/* Header - 微信小程序子页面返回样式 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">待开庭提醒</div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 space-y-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索案号、当事人、办案秘书..."
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
            <div className="flex items-start gap-3 mt-1">
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
                <span className="text-slate-400 text-sm">~</span>
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
            <div className="flex items-start gap-3 mt-1">
              <span className="text-base text-slate-500 w-16 flex-shrink-0 pt-1.5 text-left">
                开庭时间
              </span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="date"
                  value={hearingDateRange[0]}
                  onChange={(e) => setHearingDateRange([e.target.value, hearingDateRange[1]])}
                  className="flex-1 px-2 py-1 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                <span className="text-slate-400 text-sm">~</span>
                <input
                  type="date"
                  value={hearingDateRange[1]}
                  onChange={(e) => setHearingDateRange([hearingDateRange[0], e.target.value])}
                  className="flex-1 px-2 py-1 rounded border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Reset & Confirm Buttons */}
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => { setSelectedSecretary(''); setAmountRange([0, 100000]); setHearingDateRange(['', '']); }}
                className="px-4 py-1.5 rounded text-base text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
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

      {/* List Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredHearings.length > 0 ? (
          filteredHearings.map((h) => {
            return (
              <div
                key={h.id}
                onClick={() => onSelectItem(h)}
                className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
                    <Calendar size={14} className="text-indigo-400" />
                    {h.caseNo}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{h.claimant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">被申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{h.respondent}</span>
                  </div>

                  {/* Hearing Time */}
                  <div className="flex items-center gap-2 pt-1">
                    <Clock size={12} className="text-amber-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">开庭时间</span>
                    <span className="text-indigo-600 font-bold flex-1 text-left">{h.hearingTime}</span>
                  </div>

                  {/* Hearing Location */}
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left mt-0.5">开庭地点</span>
                    <span className="text-slate-800 flex-1 text-left">{h.hearingLocation}</span>
                  </div>

                  <div className="flex items-center gap-2 ">
                    <FileText size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">办案秘书</span>
                    <span className="text-slate-700 flex-1 text-left">{h.secretary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={12} className="text-violet-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">仲裁庭</span>
                    <span className="text-slate-700 flex-1 text-left">张三、李四、王五</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">开庭用途</span>
                    <span className="text-slate-800 flex-1 text-left">{h.hearingPurpose}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-500">未检索到匹配的开庭记录</span>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedSecretary(''); setAmountRange([0, 100000]); setHearingDateRange(['', '']); }}
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
