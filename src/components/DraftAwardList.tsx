import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, FileText, AlertCircle, Building2 } from 'lucide-react';

interface DraftAwardItem {
  id: string;
  caseNo: string;
  claimant: string;
  respondent: string;
  secretary: string;
  reason: string;
  status: 'pending' | 'drafted';
  draftedDate?: string;
}

interface DraftAwardListProps {
  onBack: () => void;
  onSelectItem: (item: DraftAwardItem) => void;
}

export default function DraftAwardList({ onBack, onSelectItem }: DraftAwardListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'drafted'>('all');

  const drafts: DraftAwardItem[] = [
    {
      id: 'da-1',
      caseNo: '(2026)穗仲案字第0325号',
      claimant: '广州智慧零售科技有限公司',
      respondent: '深圳前海股权投资基金合伙企业',
      secretary: '李文浩',
      reason: '股权转让纠纷',
      status: 'pending'
    },
    {
      id: 'da-2',
      caseNo: '(2026)穗仲案字第0521号',
      claimant: '宏图建筑工程总承包有限公司',
      respondent: '润物高科智能产业园发展公司',
      secretary: '王小红',
      reason: '建设工程纠纷',
      status: 'pending'
    },
    {
      id: 'da-3',
      caseNo: '(2026)穗仲案字第0418号',
      claimant: '广州市天河科技投资有限公司',
      respondent: '上海某某贸易有限公司',
      secretary: '李文浩',
      reason: '国际贸易纠纷',
      status: 'drafted',
      draftedDate: '2026-06-01'
    },
    {
      id: 'da-4',
      caseNo: '(2026)穗仲案字第0302号',
      claimant: '杭州某某科技有限公司',
      respondent: '浙江某某网络有限公司',
      secretary: '陈小红',
      reason: '知识产权纠纷',
      status: 'drafted',
      draftedDate: '2026-05-20'
    },
    {
      id: 'da-5',
      caseNo: '(2026)穗仲案字第0536号',
      claimant: '北京盛世文化传媒股份有限公司',
      respondent: '广州创意设计工作室',
      secretary: '王小红',
      reason: '知识产权纠纷',
      status: 'pending'
    },
    {
      id: 'da-6',
      caseNo: '(2026)穗仲案字第0289号',
      claimant: '深圳市前海融资租赁有限公司',
      respondent: '东莞市民营企业投资集团',
      secretary: '陈小红',
      reason: '金融借款合同',
      status: 'drafted',
      draftedDate: '2026-05-12'
    }
  ];

  const statusTabs: { label: string; value: 'all' | 'pending' | 'drafted' }[] = [
    { label: '全部', value: 'all' },
    { label: '待草拟', value: 'pending' },
    { label: '已草拟', value: 'drafted' },
  ];

  const filteredDrafts = useMemo(() => {
    return drafts.filter((d) => {
      if (statusFilter !== 'all' && d.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          d.caseNo.toLowerCase().includes(query) ||
          d.claimant.toLowerCase().includes(query) ||
          d.respondent.toLowerCase().includes(query) ||
          d.secretary.toLowerCase().includes(query) ||
          d.reason.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [drafts, statusFilter, searchQuery]);

  return (
    <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col animate-slide-in text-left">
      {/* Top Header */}
      <div className="h-12 bg-white border-b border-slate-100 px-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <button 
          onClick={onBack} 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>返回</span>
        </button>
        <span className="font-bold text-slate-800 text-xs">草拟裁决书</span>
        <div className="w-10"></div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 space-y-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索案号、当事人、办案秘书..."
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
          />
        </div>

        <div className="flex gap-2">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            const count = tab.value === 'all' 
              ? drafts.length 
              : drafts.filter(d => d.status === tab.value).length;

            return (
              <button
                key={tab.value}
                onClick={() => setStatusFilter(tab.value)}
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

      {/* List Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDrafts.length > 0 ? (
          filteredDrafts.map((d) => {
            const statusColorClass = d.status === 'drafted' 
              ? 'text-emerald-500 bg-emerald-50 border-emerald-100' 
              : 'text-amber-500 bg-amber-50 border-amber-100';

            return (
              <div
                key={d.id}
                onClick={() => onSelectItem(d)}
                className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-400" />
                    {d.caseNo}
                  </span>
                  <span className={`text-sm p-0.5 px-1.5 rounded border ${statusColorClass}`}>
                    {d.status === 'drafted' ? '已草拟' : '待草拟'}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-500">申请人：</span>
                      <span className="text-slate-800 truncate">{d.claimant}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-slate-500">被申请人：</span>
                      <span className="text-slate-800 truncate">{d.respondent}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-sm pt-1 text-left">
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm text-slate-500">办案秘书</span>
                      <span className="text-sm text-slate-700">{d.secretary}</span>
                    </div>
                    <div className="flex flex-col space-y-0.5">
                      <span className="text-sm text-slate-500">案由</span>
                      <span className="text-sm text-slate-700">{d.reason}</span>
                    </div>
                  </div>

                  {d.draftedDate && (
                    <div className="text-xs text-slate-400 pt-1">
                      草拟日期：{d.draftedDate}
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-500">未检索到匹配的草拟裁决书</span>
            <button 
              onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
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
