import React, { useState, useMemo } from 'react';
import { PostponementApproval } from '../types';

interface PostponementApprovalPageProps {
  approvals: PostponementApproval[];
  onSelectApproval: (approval: PostponementApproval) => void;
  onBack: () => void;
}

export default function PostponementApprovalPage({
  approvals,
  onSelectApproval,
  onBack
}: PostponementApprovalPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Status Tabs Definition
  const statusTabs: { label: string; value: 'all' | 'pending' | 'approved' | 'rejected' }[] = [
    { label: '全部', value: 'all' },
    { label: '待审批', value: 'pending' },
    { label: '已审批', value: 'approved' },
  ];

  // Filtered approvals list based on status and search query
  const filteredApprovals = useMemo(() => {
    return approvals.filter((a) => {
      // 1. Status Filter
      if (statusFilter !== 'all' && a.status !== statusFilter) {
        return false;
      }
      // 2. Search Query (matches caseNo, claimant, respondent, secretary)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          a.caseNo.toLowerCase().includes(query) ||
          a.claimant.toLowerCase().includes(query) ||
          a.respondent.toLowerCase().includes(query) ||
          a.secretary.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [approvals, statusFilter, searchQuery]);

  // Get status badge style
  const getStatusStyle = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-700';
      case 'approved':
        return 'bg-emerald-100 text-emerald-700';
      case 'rejected':
        return 'bg-rose-100 text-rose-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  // Get status label
  const getStatusLabel = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已审批';
      default:
        return status;
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header - 微信小程序子页面返回样式 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          延期审批
        </div>
      </div>

      {/* Search & Tabs Area */}
      <div className="bg-white border-b border-slate-100 px-4 py-3 flex-shrink-0 space-y-3 shadow-sm shadow-slate-900/5">
        {/* Search Box */}
        <div className="relative">
          <i className="fa-solid fa-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
          <input
            type="text"
            placeholder="搜索案号、申请人、被申请人..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-slate-50"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === tab.value
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Approvals List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {filteredApprovals.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <i className="fa-solid fa-clock-rotate-left text-4xl mb-3 text-slate-300"></i>
            <p className="text-sm">暂无延期审批记录</p>
          </div>
        ) : (
          filteredApprovals.map((approval) => (
            <div
              key={approval.id}
              onClick={() => onSelectApproval(approval)}
              className="bg-white rounded-xl border border-slate-100 p-4 cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all group"
            >
              {/* Header Row: Case No + Status Badge */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-slate-800 truncate">
                  {approval.caseNo}
                </span>
                <span
                  className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusStyle(approval.status)}`}
                >
                  {getStatusLabel(approval.status)}
                </span>
              </div>

              {/* Info Rows */}
              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16 shrink-0">申请人：</span>
                  <span className="truncate">{approval.claimant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16 shrink-0">被申请人：</span>
                  <span className="truncate">{approval.respondent}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16 shrink-0">办案秘书：</span>
                  <span className="truncate">{approval.secretary}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 w-16 shrink-0">仲裁员：</span>
                  <span className="truncate">{approval.arbitrator}</span>
                </div>
              </div>

              {/* Footer: Request Info */}
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>延期原因：{approval.reason}</span>
                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-indigo-500 transition-colors"></i>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}