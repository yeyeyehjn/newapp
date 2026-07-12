import React, { useState } from 'react';
import { PostponementApproval } from '../types';
import { Check, X } from 'lucide-react';

interface PostponementApprovalDetailProps {
  approval: PostponementApproval;
  onBack: () => void;
  onApprove: (approvalId: string, comment: string) => void;
  onReject: (approvalId: string, comment: string) => void;
}

export default function PostponementApprovalDetail({
  approval,
  onBack,
  onApprove,
  onReject
}: PostponementApprovalDetailProps) {
  const [approvalComment, setApprovalComment] = useState<string>('');
  const [confirmAction, setConfirmAction] = useState<'approve' | 'reject' | null>(null);

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
      case 'rejected':
        return '已驳回';
      default:
        return status;
    }
  };

  // Get flow record status style
  const getFlowStatusStyle = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return 'bg-emerald-500 ring-4 ring-emerald-100';
      case 'rejected':
        return 'bg-rose-500 ring-4 ring-rose-100';
      case 'pending':
        return 'bg-amber-500 ring-4 ring-amber-100';
      default:
        return 'bg-slate-400 ring-4 ring-slate-100';
    }
  };

  // 执行审批操作
  const handleConfirmAction = () => {
    if (!confirmAction) return;
    if (confirmAction === 'approve') {
      onApprove(approval.id, approvalComment);
    } else {
      onReject(approval.id, approvalComment);
    }
    setConfirmAction(null);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden relative">
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
          延期审批详情
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Case Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-slate-800">{approval.caseNo}</span>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusStyle(approval.status)}`}>
              {getStatusLabel(approval.status)}
            </span>
          </div>

          <div className="space-y-2 text-base text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">申请人：</span>
              <span className="truncate">{approval.claimant}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">被申请人：</span>
              <span className="truncate">{approval.respondent}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">办案秘书：</span>
              <span className="truncate">{approval.secretary}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">仲裁员：</span>
              <span className="truncate">{approval.arbitrator}</span>
            </div>
          </div>
        </div>

        {/* Extension Request Info */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fa-solid fa-clock-rotate-left text-indigo-500"></i>
            <span className="text-base font-bold text-slate-800">延期申请信息</span>
          </div>

          <div className="space-y-3 text-base text-left">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">延期原因</div>
              <div className="text-slate-700">{approval.reason}</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">申请延期至</div>
              <div className="text-slate-700">{approval.requestedTime}</div>
            </div>

            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">申请时间</div>
              <div className="text-slate-700">{approval.requestTime}</div>
            </div>
          </div>
        </div>

        {/* Approval Flow Records */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-4">
            <i className="fa-solid fa-route text-indigo-500"></i>
            <span className="text-base font-bold text-slate-800">审批流转记录</span>
          </div>

          {/* Timeline */}
          <div className="relative border-l-2 border-slate-100 ml-3 pl-6 space-y-4">
            {approval.flowRecords.map((record, index) => (
              <div key={index} className="relative">
                {/* Timeline Node */}
                <div className="absolute -left-[26px] top-1">
                  <span className={`h-3 w-3 rounded-full ${getFlowStatusStyle(record.status)} transition-all`}></span>
                </div>

                {/* Record Content */}
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-base font-medium text-slate-800">{record.operator}</span>
                    <span className="text-sm text-slate-400">{record.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-sm font-medium ${getStatusStyle(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                    {record.comment && (
                      <span className="text-sm text-slate-500 truncate">{record.comment}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 审批备注 - 仅待审批时显示 */}
        {approval.status === 'pending' && (
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <i className="fa-solid fa-pen-to-square text-indigo-500"></i>
              <span className="text-base font-bold text-slate-800">审批备注</span>
            </div>
            <textarea
              value={approvalComment}
              onChange={(e) => setApprovalComment(e.target.value)}
              placeholder="请输入审批意见（可选）"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              rows={3}
            />
          </div>
        )}

        {/* Action Buttons (Only for pending status) */}
        {approval.status === 'pending' && (
          <div className="flex gap-3">
            {/* Reject Button */}
            <button
              onClick={() => setConfirmAction('reject')}
              className="flex-1 bg-rose-600 hover:bg-rose-700 rounded-xl py-3 text-base font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-times"></i>
              <span>驳回申请</span>
            </button>

            {/* Approve Button */}
            <button
              onClick={() => setConfirmAction('approve')}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl py-3 text-base font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-check"></i>
              <span>同意延期</span>
            </button>
          </div>
        )}

        {/* Completed Status Info */}
        {approval.status !== 'pending' && (
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <i className={`fa-solid ${approval.status === 'approved' ? 'fa-check-circle text-emerald-500' : 'fa-times-circle text-rose-500'}`}></i>
              <span className="text-base font-bold text-slate-800">
                {approval.status === 'approved' ? '审批已通过' : '审批已驳回'}
              </span>
            </div>
            {approval.approvedTime && (
              <div className="text-base text-slate-500">
                审批时间：{approval.approvedTime}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 确认弹框 */}
      {confirmAction && (
        <div className="absolute inset-0 z-[150] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-[280px] overflow-hidden shadow-2xl animate-scale-up">
            {/* 图标 + 标题 */}
            <div className="pt-6 pb-4 px-4 text-center">
              <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${
                confirmAction === 'approve' ? 'bg-emerald-100' : 'bg-rose-100'
              }`}>
                {confirmAction === 'approve' ? (
                  <Check size={24} className="text-emerald-600" />
                ) : (
                  <X size={24} className="text-rose-600" />
                )}
              </div>
              <div className="text-base font-bold text-slate-800 mb-1">
                {confirmAction === 'approve' ? '确认同意延期？' : '确认驳回申请？'}
              </div>
              <div className="text-sm text-slate-500">
                {confirmAction === 'approve'
                  ? '同意后将通知办案秘书安排延期'
                  : '驳回后将通知办案秘书重新处理'}
              </div>
            </div>

            {/* 确认按钮 */}
            <div className="border-t border-slate-100 flex">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 py-3 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
              >
                取消
              </button>
              <div className="w-px bg-slate-100" />
              <button
                onClick={handleConfirmAction}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  confirmAction === 'approve'
                    ? 'text-emerald-600 hover:bg-emerald-50'
                    : 'text-rose-600 hover:bg-rose-50'
                }`}
              >
                确认
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
