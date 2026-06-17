import React, { useState } from 'react';
import { PostponementApproval } from '../types';

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
  const [showApprovalModal, setShowApprovalModal] = useState<boolean>(false);
  const [approvalComment, setApprovalComment] = useState<string>('');
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

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

  // Handle approval action
  const handleAction = () => {
    if (!approvalAction) return;
    
    if (approvalAction === 'approve') {
      onApprove(approval.id, approvalComment);
    } else {
      onReject(approval.id, approvalComment);
    }
    
    setShowApprovalModal(false);
    setApprovalComment('');
    setApprovalAction(null);
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
          延期审批详情
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Case Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800">{approval.caseNo}</span>
            <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusStyle(approval.status)}`}>
              {getStatusLabel(approval.status)}
            </span>
          </div>

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
        </div>

        {/* Extension Request Info */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <i className="fa-solid fa-clock-rotate-left text-indigo-500"></i>
            <span className="text-sm font-bold text-slate-800">延期申请信息</span>
          </div>

          <div className="space-y-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3">
              <div className="text-slate-400 mb-1">延期原因</div>
              <div className="text-slate-700">{approval.reason}</div>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">原定开庭时间</div>
                <div className="text-slate-700">{approval.originalHearingTime}</div>
              </div>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="text-slate-400 mb-1">申请延期至</div>
                <div className="text-slate-700">{approval.requestedTime}</div>
              </div>
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
            <span className="text-sm font-bold text-slate-800">审批流转记录</span>
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
                    <span className="text-sm font-medium text-slate-800">{record.operator}</span>
                    <span className="text-xs text-slate-400">{record.time}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusStyle(record.status)}`}>
                      {getStatusLabel(record.status)}
                    </span>
                    {record.comment && (
                      <span className="text-xs text-slate-500 truncate">{record.comment}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons (Only for pending status) */}
        {approval.status === 'pending' && (
          <div className="flex gap-3">
            {/* Approve Button */}
            <button
              onClick={() => {
                setApprovalAction('approve');
                setShowApprovalModal(true);
              }}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 rounded-xl py-3 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-check"></i>
              <span>同意延期</span>
            </button>

            {/* Reject Button */}
            <button
              onClick={() => {
                setApprovalAction('reject');
                setShowApprovalModal(true);
              }}
              className="flex-1 bg-rose-600 hover:bg-rose-700 rounded-xl py-3 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-times"></i>
              <span>驳回申请</span>
            </button>
          </div>
        )}

        {/* Completed Status Info */}
        {approval.status !== 'pending' && (
          <div className="bg-white rounded-xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <i className={`fa-solid ${approval.status === 'approved' ? 'fa-check-circle text-emerald-500' : 'fa-times-circle text-rose-500'}`}></i>
              <span className="text-sm font-bold text-slate-800">
                {approval.status === 'approved' ? '审批已通过' : '审批已驳回'}
              </span>
            </div>
            {approval.approvedTime && (
              <div className="text-sm text-slate-500">
                审批时间：{approval.approvedTime}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Approval Modal */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className={`px-4 py-3 flex items-center justify-between border-b border-slate-100 ${
              approvalAction === 'approve' ? 'bg-emerald-50' : 'bg-rose-50'
            }`}>
              <span className="text-sm font-bold text-slate-800">
                {approvalAction === 'approve' ? '同意延期申请' : '驳回延期申请'}
              </span>
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComment('');
                  setApprovalAction(null);
                }}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4">
              <div className="mb-4">
                <label className="text-sm text-slate-600 mb-2 block">审批意见（可选）</label>
                <textarea
                  value={approvalComment}
                  onChange={(e) => setApprovalComment(e.target.value)}
                  placeholder="请输入审批意见..."
                  className="w-full p-3 rounded-lg border border-slate-200 text-sm resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  rows={3}
                />
              </div>

              <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-500">
                <div className="mb-1">案号：{approval.caseNo}</div>
                <div>申请延期至：{approval.requestedTime}</div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setApprovalComment('');
                  setApprovalAction(null);
                }}
                className="flex-1 bg-slate-100 hover:bg-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-700 transition-colors"
              >
                取消
              </button>
              <button
                onClick={handleAction}
                className={`flex-1 rounded-lg py-2.5 text-sm font-medium text-white transition-colors ${
                  approvalAction === 'approve' 
                    ? 'bg-emerald-600 hover:bg-emerald-700' 
                    : 'bg-rose-600 hover:bg-rose-700'
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