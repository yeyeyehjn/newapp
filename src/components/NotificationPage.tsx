import React, { useState } from 'react';
import { Bell, Check, Calendar, ShieldCheck, FileText, ChevronRight } from 'lucide-react';
import { PostponementApproval, TranscriptSignature, Case } from '../types';

interface NotificationItem {
  id: string;
  type: 'postponement' | 'transcript' | 'documentSignature';
  refId: string;
  title: string;
  content: string;
  time: string;
  isRead: boolean;
}

interface NotificationPageProps {
  onBack: () => void;
  postponementApprovals: PostponementApproval[];
  transcriptSignatures: TranscriptSignature[];
  cases: Case[];
  onNavigateToApprovalDetail: (approval: PostponementApproval) => void;
  onNavigateToTranscriptDetail: (transcript: TranscriptSignature) => void;
  onNavigateToCaseDetail: (caseItem: Case) => void;
}

export default function NotificationPage({
  onBack,
  postponementApprovals,
  transcriptSignatures,
  cases,
  onNavigateToApprovalDetail,
  onNavigateToTranscriptDetail,
  onNavigateToCaseDetail
}: NotificationPageProps) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'nt_1',
      type: 'postponement',
      refId: 'pa_1',
      title: '延期审批待办 • 华夏科技 vs 蓝海创投',
      content: '案号(2026)穗仲案字第1024号的延期申请待您审批。申请人代理人因出差无法按时参加庭审，申请将庭审从 2026-06-11 09:30 延期至 2026-06-18 09:30，请尽快查阅并作出审批决定。',
      time: '2026-06-10 15:00',
      isRead: false,
    },
    {
      id: 'nt_2',
      type: 'transcript',
      refId: 'ts_1',
      title: '笔录签名待办 • 华夏科技 vs 蓝海创投',
      content: '案号(2026)穗仲案字第1024号的庭审笔录已由书记员整理完毕，待您签名确认。庭审时间：2026-06-11 09:30-12:00，地点：第一仲裁庭。请核查笔录内容后完成电子签名。',
      time: '2026-06-11 12:05',
      isRead: false,
    },
    {
      id: 'nt_3',
      type: 'documentSignature',
      refId: '2',
      title: '文书签名待办 • 裁决书签署',
      content: '案号(2026)穗仲案字第0882号的裁决书待您签署。由您（独任仲裁员）起草的裁决书已由委员会秘书核阅通过，请在 2026-06-15 18:00 前完成电子签发。',
      time: '2026-06-10 12:00',
      isRead: false,
    },
    {
      id: 'nt_4',
      type: 'postponement',
      refId: 'pa_2',
      title: '延期审批待办 • 恒运能源 vs 深圳新能源',
      content: '案号(2026)穗仲案字第0521号的延期申请待您审批。被申请人需要补充提交证据材料，申请将庭审从 2026-06-12 14:00 延期至 2026-06-20 14:00。',
      time: '2026-06-11 11:00',
      isRead: false,
    },
    {
      id: 'nt_5',
      type: 'transcript',
      refId: 'ts_2',
      title: '笔录签名待办 • 恒运能源 vs 深圳新能源',
      content: '案号(2026)穗仲案字第0521号的庭审笔录待您签名确认。庭审时间：2026-06-12 14:00-17:00。请尽快完成签名。',
      time: '2026-06-12 17:10',
      isRead: true,
    },
    {
      id: 'nt_6',
      type: 'transcript',
      refId: 'ts_4',
      title: '笔录签名待办 • 东方贸易 vs 西方物流',
      content: '案号(2026)穗仲案字第0888号的庭审笔录待您签名确认。庭审时间：2026-06-13 09:30-11:30。请尽快完成签名。',
      time: '2026-06-13 11:35',
      isRead: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'postponement' | 'transcript' | 'documentSignature'>('all');

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Click notification: mark as read + navigate to corresponding detail page
  const handleNotificationClick = (noti: NotificationItem) => {
    setNotifications(prev =>
      prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n)
    );
    if (noti.type === 'postponement') {
      const approval = postponementApprovals.find(a => a.id === noti.refId);
      if (approval) onNavigateToApprovalDetail(approval);
    } else if (noti.type === 'transcript') {
      const transcript = transcriptSignatures.find(t => t.id === noti.refId);
      if (transcript) onNavigateToTranscriptDetail(transcript);
    } else if (noti.type === 'documentSignature') {
      const caseItem = cases.find(c => c.id === noti.refId);
      if (caseItem) onNavigateToCaseDetail(caseItem);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.isRead;
    return n.type === activeTab;
  });

  const getTypeDetails = (type: string) => {
    switch (type) {
      case 'postponement':
        return {
          icon: <Calendar className="h-3.5 w-3.5 text-blue-500" />,
          label: '延期审批',
          badgeStyle: 'bg-blue-50 text-blue-600 border-blue-100'
        };
      case 'transcript':
        return {
          icon: <FileText className="h-3.5 w-3.5 text-emerald-500" />,
          label: '笔录签名',
          badgeStyle: 'bg-emerald-50 text-emerald-600 border-emerald-100'
        };
      case 'documentSignature':
        return {
          icon: <ShieldCheck className="h-3.5 w-3.5 text-amber-500" />,
          label: '文书签名',
          badgeStyle: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      default:
        return {
          icon: <Bell className="h-3.5 w-3.5 text-slate-500" />,
          label: '通知',
          badgeStyle: 'bg-slate-50 text-slate-600 border-slate-100'
        };
    }
  };

  const tabs = [
    { id: 'all', label: '全部', count: notifications.length },
    { id: 'unread', label: '未读', count: unreadCount, highlight: true },
   
  ] as const;

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-0 relative select-none font-sans animate-fade-in">
      {/* Header */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0 z-20">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          消息通知
        </div>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="absolute right-4 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-envelope-open text-xs"></i>
            <span>全部已读</span>
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      <div className="bg-white border-b border-slate-100 shadow-3xs flex-shrink-0">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-2 px-3 max-w-full">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            const showBadge = tab.count > 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-lg text-sm whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {showBadge && (
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded-full ${
                      'highlight' in tab && tab.highlight && tab.count > 0
                        ? 'bg-rose-500 text-white'
                        : (isActive ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200/80 text-slate-500')
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* NOTIFICATIONS CONTAINER */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((noti) => {
            const details = getTypeDetails(noti.type);
            return (
              <div
                key={noti.id}
                onClick={() => handleNotificationClick(noti)}
                className={`relative rounded-lg border p-3.5 transition-all text-left cursor-pointer select-none flex flex-col gap-2 hover:shadow-md
                  ${noti.isRead
                    ? 'bg-white border-slate-100 text-slate-600'
                    : 'bg-indigo-50/15 border-indigo-100 shadow-2xs shadow-indigo-100/10'
                  }`}
              >
                {/* Visual Accent Bar for Unread */}
                {!noti.isRead && (
                  <span className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-indigo-500 rounded-r-full" />
                )}

                

                {/* Title */}
                <h3 className={`text-base select-none block leading-normal ${noti.isRead ? 'font-bold text-slate-700' : 'font-extrabold text-slate-900'}`}>
                  {noti.title}
                </h3>

                {/* Content */}
                <p className="text-sm text-slate-500 leading-relaxed font-medium">
                  {noti.content}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80 mt-0.5">
                  <span className="text-sm text-slate-400 flex items-center gap-1">
                    <Check className={`h-3 w-3 ${noti.isRead ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>{noti.isRead ? '已处理' : '待处理'}</span>
                  </span>

                  <div className="flex items-center gap-2">
                    <span className="shrink-0 text-sm text-slate-400 font-medium">
                      {noti.time}
                    </span>
                    <span className="shrink-0 text-sm text-indigo-500  flex items-center gap-0.5">
                      查看详情
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="text-[12px] font-bold text-slate-700 mb-1">空空如也</h3>
            <p className="text-[12px] text-slate-400 max-w-[200px] leading-normal">
              此处无相关类别的待办通知，您已全部处理完毕。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
