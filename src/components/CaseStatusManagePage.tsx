import React, { useState } from 'react';
import { PauseCircle, CalendarClock, FileText, RotateCcw, AlertCircle, Tag } from 'lucide-react';
import { IOSAlert } from './ui/IOSDialog';
import { CaseSuspensionStatus } from '../types';

// 暂停状态：必填单选项
const SUSPEND_TYPES: string[] = [
  '暂停指定',
  '暂停当事人选定',
  '同步暂停指定和当事人选定',
];

// 快捷暂停理由：点选后自动填入输入框，仍可手动修改或输入其他理由
const QUICK_REASONS: string[] = [
  '本人工作原因',
  '身体原因',
];

interface CaseStatusManagePageProps {
  caseStatus: CaseSuspensionStatus;
  onBack: () => void;
  onSuspend: (payload: { startTime: string; endTime: string; suspendType: string; reason: string }) => void;
  onResume: () => void;
}

type FormError = { field: 'suspendType' | 'time' | 'reason'; msg: string } | null;

export default function CaseStatusManagePage({ caseStatus, onBack, onSuspend, onResume }: CaseStatusManagePageProps) {
  const today = new Date().toISOString().split('T')[0];
  const [suspendType, setSuspendType] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [error, setError] = useState<FormError>(null);
  const [showSuspendConfirm, setShowSuspendConfirm] = useState<boolean>(false);
  const [showResumeConfirm, setShowResumeConfirm] = useState<boolean>(false);

  const handleSuspendTypeSelect = (type: string) => {
    setSuspendType(type);
    if (error?.field === 'suspendType') setError(null);
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStartTime(e.target.value);
    if (error?.field === 'time') setError(null);
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEndTime(e.target.value);
    if (error?.field === 'time') setError(null);
  };

  const handleQuickReason = (text: string) => {
    setReason(text);
    if (error?.field === 'reason') setError(null);
  };

  const handleReasonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setReason(e.target.value);
    if (error?.field === 'reason') setError(null);
  };

  // 提交前校验：暂停状态必选、时间区间完整且先后合法、理由非空
  const handleSubmit = () => {
    if (!suspendType) {
      setError({ field: 'suspendType', msg: '请选择暂停状态' });
      return;
    }
    if (!startTime || !endTime) {
      setError({ field: 'time', msg: '请选择暂停的开始与结束时间' });
      return;
    }
    if (endTime < startTime) {
      setError({ field: 'time', msg: '结束时间不能早于开始时间' });
      return;
    }
    if (!reason.trim()) {
      setError({ field: 'reason', msg: '请选择或输入暂停理由' });
      return;
    }
    setError(null);
    setShowSuspendConfirm(true);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col relative overflow-hidden">
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
          办案状态管理
        </div>
      </div>

      {/* 滚动内容区 */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-3 text-left">
        {caseStatus.suspended ? (
          <>
            {/* 暂停中状态卡 */}
            <div className="bg-gradient-to-br from-amber-50 to-white rounded-lg border border-amber-200 p-4 space-y-3">
              <div className="flex items-center gap-2.5">
                <PauseCircle size={16} className="text-amber-600 flex-shrink-0" />
                <span className="text-base font-bold text-slate-800">当前状态：暂不接案</span>
              </div>

              <div className="space-y-1.5 pt-0.5">
                <div className="flex items-center gap-2">
                  <CalendarClock size={13} className="text-amber-600 flex-shrink-0" />
                  <span className="text-base text-slate-500 flex-shrink-0">暂停时间</span>
                  <span className="text-base text-slate-700 font-mono truncate">
                    {caseStatus.startTime} 至 {caseStatus.endTime}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-amber-600 flex-shrink-0" />
                  <span className="text-base text-slate-500 flex-shrink-0">暂停状态</span>
                  <span className="text-base text-slate-700 leading-normal">{caseStatus.suspendType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FileText size={13} className="text-amber-600 flex-shrink-0" />
                  <span className="text-base text-slate-500 flex-shrink-0">暂停理由</span>
                  <span className="text-base text-slate-700 leading-normal">{caseStatus.reason}</span>
                </div>
              </div>

              <button
                onClick={() => setShowResumeConfirm(true)}
                className="w-full py-3 rounded-lg bg-white border border-amber-300 text-amber-700 font-medium text-base hover:bg-amber-50 transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <RotateCcw size={15} />
                恢复接案
              </button>
            </div>

            {/* 暂停期间说明 */}
            <div className="bg-white rounded-lg border border-slate-100 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-slate-500 leading-relaxed">
                  暂停期间将不再接收新案件的指派
                </p>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* 正常接案状态卡 */}
            <div className="bg-white rounded-lg border border-slate-100 p-4">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <span className="text-base font-bold text-slate-800">当前状态：正常接案</span>
              </div>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                当前处于正常接案状态，系统将按规则为您分配新案件。如需暂时停止接收新案件，请在下方提交暂停申请。
              </p>
            </div>

            {/* 暂停接案申请表单 */}
            <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <PauseCircle size={14} className="text-indigo-500" />
                暂停接案申请
              </h3>

              {/* 暂停时间 */}
              <div className="space-y-1.5">
                <label className="text-base font-medium text-slate-600">暂停时间</label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={startTime}
                    min={today}
                    onChange={handleStartTimeChange}
                    aria-label="暂停开始时间"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                  <span className="text-slate-400 text-sm flex-shrink-0">至</span>
                  <input
                    type="date"
                    value={endTime}
                    min={startTime || today}
                    onChange={handleEndTimeChange}
                    aria-label="暂停结束时间"
                    className="flex-1 min-w-0 px-3 py-2.5 rounded-lg border border-slate-200 text-base text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  />
                </div>
                {error?.field === 'time' && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle size={10} />
                    {error.msg}
                  </p>
                )}
              </div>

              {/* 暂停状态（必填单选） */}
              <div className="space-y-1.5">
                <label className="text-base font-medium text-slate-600">暂停状态</label>
                <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="暂停状态">
                  {SUSPEND_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      role="radio"
                      aria-checked={suspendType === t}
                      onClick={() => handleSuspendTypeSelect(t)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                        suspendType === t
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                {error?.field === 'suspendType' && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle size={10} />
                    {error.msg}
                  </p>
                )}
              </div>

              {/* 暂停理由 */}
              <div className="space-y-1.5">
                <label className="text-base font-medium text-slate-600">暂停理由</label>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REASONS.map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleQuickReason(r)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                        reason === r
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={reason}
                  onChange={handleReasonChange}
                  placeholder="选择快捷理由，或直接输入其他理由"
                  aria-label="暂停理由输入"
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-base text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
                {error?.field === 'reason' && (
                  <p className="text-xs text-error flex items-center gap-1">
                    <AlertCircle size={10} />
                    {error.msg}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* 吸底提交按钮（仅正常接案时显示） */}
      {!caseStatus.suspended && (
        <div className="bg-white border-t border-slate-100 p-4 flex-shrink-0">
          <button
            onClick={handleSubmit}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium text-base hover:bg-indigo-700 transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <PauseCircle size={15} />
            确认暂不接案
          </button>
        </div>
      )}

      {/* 提交暂停二次确认 */}
      {showSuspendConfirm && (
        <IOSAlert
          title="确认暂不接案？"
          message={`暂停状态：${suspendType}。暂停期间（${startTime} 至 ${endTime}），系统将不再为您分配新案件，已在办理中的案件不受影响。`}
          overlayClassName="absolute inset-0 z-[70]"
          actions={[
            { label: '取消', style: 'cancel', onPress: () => setShowSuspendConfirm(false) },
            {
              label: '确认暂停',
              onPress: () => {
                setShowSuspendConfirm(false);
                onSuspend({ startTime, endTime, suspendType, reason: reason.trim() });
              },
            },
          ]}
        />
      )}

      {/* 恢复接案二次确认 */}
      {showResumeConfirm && (
        <IOSAlert
          title="恢复接案？"
          message="确认恢复接案？恢复后将重新接收新案件的指派。"
          overlayClassName="absolute inset-0 z-[70]"
          actions={[
            { label: '取消', style: 'cancel', onPress: () => setShowResumeConfirm(false) },
            {
              label: '确认恢复',
              onPress: () => {
                setShowResumeConfirm(false);
                onResume();
              },
            },
          ]}
        />
      )}
    </div>
  );
}
