import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Building2, FileText, Clock, Check, CheckCircle2 } from 'lucide-react';
import { IOSAlert } from './ui/IOSDialog';
import { PostponementApproval } from '../types';

interface PostponementApprovalPageProps {
  approvals: PostponementApproval[];
  onSelectApproval: (approval: PostponementApproval) => void;
  onBack: () => void;
  onQuickApprove: (approvalId: string) => void;
  onQuickReject: (approvalId: string) => void;
  onBatchApprove: (ids: string[]) => void;
}

export default function PostponementApprovalPage({
  approvals,
  onSelectApproval,
  onBack,
  onQuickApprove,
  onQuickReject,
  onBatchApprove
}: PostponementApprovalPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'done'>('pending');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState<{ approval: PostponementApproval; type: 'approve' | 'reject' } | null>(null);

  // Status Tabs Definition
  const statusTabs: { label: string; value: 'pending' | 'done' }[] = [
    { label: '待审批', value: 'pending' },
    { label: '已审批', value: 'done' },
  ];

  // Filtered approvals list based on status and search query
  const filteredApprovals = useMemo(() => {
    return approvals.filter((a) => {
      // 1. Status Filter
      if (statusFilter === 'pending' && a.status !== 'pending') {
        return false;
      }
      if (statusFilter === 'done' && a.status === 'pending') {
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

  // 勾选/取消勾选某条待审批记录
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 切换状态 Tab 时清空已选
  const handleSelectTab = (value: 'pending' | 'done') => {
    setStatusFilter(value);
    setSelectedIds(new Set());
  };

  // 一键审批：批量通过所选延期审批
  const handleBatchApprove = () => {
    onBatchApprove(Array.from(selectedIds));
    setSelectedIds(new Set());
    setShowApproveConfirm(false);
  };

  // 快捷操作确认（同意 / 退回上一级）
  const handleConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction.type === 'approve') onQuickApprove(confirmAction.approval.id);
    else onQuickReject(confirmAction.approval.id);
    setConfirmAction(null);
  };

  // Get status badge style
  const getStatusStyle = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'approved':
        return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'rejected':
        return 'text-rose-500 bg-rose-50 border-rose-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-100';
    }
  };

  // Get status label
  const getStatusLabel = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return '待审批';
      case 'approved':
        return '已通过';
      case 'rejected':
        return '已驳回';
      default:
        return status;
    }
  };

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
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          延期审批
        </div>
      </div>

      {/* Search Stick Area */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索案号、当事人、办案秘书..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            />
          </div>
          {/* 一键审批 */}
          <button
            onClick={() => setShowApproveConfirm(true)}
            disabled={selectedIds.size === 0}
            className={`rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 cursor-pointer transition-all select-none ${
              selectedIds.size > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-900/30'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            一键审批
            {selectedIds.size > 0 && (
              <span className="bg-white/25 rounded-full px-1.5 text-2xs">{selectedIds.size}</span>
            )}
          </button>
        </div>
      </div>

      {/* Approvals List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredApprovals.length > 0 ? (
          filteredApprovals.map((a) => {
            return (
              <div
                key={a.id}
                onClick={() => onSelectApproval(a)}
                className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-2 min-w-0">
                    {a.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleSelect(a.id); }}
                        aria-label="选择延期审批"
                        aria-pressed={selectedIds.has(a.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer select-none ${
                          selectedIds.has(a.id)
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {selectedIds.has(a.id) && <Check size={12} strokeWidth={3.5} />}
                      </button>
                    ) : null}
                    <span className="truncate">{a.caseNo}</span>
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{a.claimant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">被申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{a.respondent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">办案秘书</span>
                    <span className="text-slate-700 flex-1 text-left">{a.secretary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">仲裁员</span>
                    <span className="text-slate-700 flex-1 text-left">{a.arbitrator}</span>
                  </div>

                  {/* 快捷操作：左右两栏，按钮居中 */}
                  {a.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-dashed border-slate-100 mt-1">
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setConfirmAction({ approval: a, type: 'reject' }); }}
                          className="text-base text-rose-500 hover:text-rose-500 transition-colors cursor-pointer select-none py-2 px-1"
                        >
                          退回上一级
                        </button>
                      </div>
                      <div className="flex justify-center">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setConfirmAction({ approval: a, type: 'approve' }); }}
                          className="text-base font-medium text-indigo-600 hover:text-indigo-700 transition-colors cursor-pointer select-none py-2 px-1 flex items-center gap-1"
                        >
                          <Check size={14} strokeWidth={3} />
                          同意
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-500">未检索到匹配的延期审批记录</span>
            <button
              onClick={() => { setSearchQuery(''); setStatusFilter('pending'); }}
              className="px-3 py-1.5 bg-indigo-50 text-indigo-500 text-sm rounded-lg cursor-pointer hover:bg-indigo-100/80 transition-colors"
            >
              清空搜索与过滤
            </button>
          </div>
        )}
      </div>

      {/* Bottom Status Tabs */}
      <div className="bg-white/95 backdrop-blur-sm border-t border-slate-100 flex-shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.05)] z-10">
        <div className="flex">
          {statusTabs.map((tab) => {
            const isActive = statusFilter === tab.value;
            const Icon = tab.value === 'pending' ? Clock : CheckCircle2;

            return (
              <button
                key={tab.value}
                onClick={() => handleSelectTab(tab.value)}
                className={`flex-1 py-4 text-sm font-medium whitespace-nowrap cursor-pointer transition-all flex items-center justify-center gap-2 relative ${
                  isActive
                    ? 'text-indigo-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} />
                <span>{tab.label}</span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-600 rounded-full"></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 一键审批确认弹窗 */}
      {showApproveConfirm && (
        <IOSAlert
          title="一键审批"
          message={`确认审批通过所选 ${selectedIds.size} 条延期审批？`}
          overlayClassName="absolute inset-0 z-[70]"
          actions={[
            { label: '取消', style: 'cancel', onPress: () => setShowApproveConfirm(false) },
            { label: '确认审批', style: 'default', onPress: handleBatchApprove },
          ]}
        />
      )}

      {/* 快捷操作确认弹窗（同意 / 退回上一级） */}
      {confirmAction && (
        <IOSAlert
          title={confirmAction.type === 'approve' ? '同意延期' : '退回上一级'}
          message={
            confirmAction.type === 'approve'
              ? `确认同意 ${confirmAction.approval.caseNo} 的延期申请？`
              : `确认将 ${confirmAction.approval.caseNo} 的延期申请退回上一级？`
          }
          overlayClassName="absolute inset-0 z-[70]"
          actions={[
            { label: '取消', style: 'cancel', onPress: () => setConfirmAction(null) },
            {
              label: confirmAction.type === 'approve' ? '同意' : '确认退回',
              style: confirmAction.type === 'approve' ? 'default' : 'destructive',
              onPress: handleConfirmAction,
            },
          ]}
        />
      )}
    </div>
  );
}