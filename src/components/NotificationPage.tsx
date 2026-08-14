import React, { useState } from 'react';
import { Bell, Check, Calendar, Clock } from 'lucide-react';
import { PostponementApproval, TranscriptSignature, Case } from '../types';

interface NotificationItem {
  id: string;
  type: 'hearing' | 'system' | 'deadline';
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
      type: 'hearing',
      title: '开庭提醒 • 华夏科技 vs 蓝海创投',
      content: '案号(2026)穗仲案字第1024号将于明天（2026-06-12）09:30 在第二仲裁庭开庭，请提前15分钟到场，携带有效证件及仲裁员证。',
      time: '2026-06-11 16:30',
      isRead: false,
    },
    {
      id: 'nt_2',
      type: 'deadline',
      title: '裁决期限提醒 • 宏图中建 vs 润物高新',
      content: '案号(2026)穗仲案字第0521号的裁决书提交期限还剩 3 天（截止 2026-06-15），请合理安排起草时间，避免超期。',
      time: '2026-06-11 09:00',
      isRead: false,
    },
    {
      id: 'nt_3',
      type: 'system',
      title: '系统通知 • 小程序版本更新',
      content: '穗仲云仲裁员小程序已更新至 V2.1 版本，新增「远程庭审」入口及笔录在线批注功能，建议体验使用。',
      time: '2026-06-10 18:00',
      isRead: false,
    },
    {
      id: 'nt_4',
      type: 'hearing',
      title: '开庭提醒 • 众盛信托 vs 乾坤置业',
      content: '案号(2026)穗仲案字第0308号将于后天（2026-06-13）15:30 在第十九仲裁庭进行鉴定开庭，请准时出席。',
      time: '2026-06-11 10:15',
      isRead: true,
    },
    {
      id: 'nt_5',
      type: 'deadline',
      title: '阅卷期限提醒 • 东方贸易 vs 西方物流',
      content: '案号(2026)穗仲案字第0888号的庭前材料阅卷截止日期为 2026-06-14，请尽快完成阅卷确认。',
      time: '2026-06-10 14:00',
      isRead: true,
    },
    {
      id: 'nt_6',
      type: 'system',
      title: '系统通知 • 端午假期安排',
      content: '广州仲裁委2026年端午假期为6月19日至6月21日，假期期间不安排庭审，相关开庭日程已自动顺延，请留意日程变动。',
      time: '2026-06-09 11:00',
      isRead: true,
    },
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'hearing' | 'deadline' | 'system'>('all');

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Click notification: mark as read
  const handleNotificationClick = (noti: NotificationItem) => {
    setNotifications(prev =>
      prev.map(n => n.id === noti.id ? { ...n, isRead: true } : n)
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.isRead;
    return n.type === activeTab;
  });

  const getTypeDetails = (type: string) => {
    switch (type) {
      case 'hearing':
        return {
          icon: <Calendar className="h-3.5 w-3.5 text-blue-500" />,
          label: '开庭提醒',
          badgeStyle: 'bg-blue-50 text-blue-600 border-blue-100'
        };
      case 'deadline':
        return {
          icon: <Clock className="h-3.5 w-3.5 text-amber-500" />,
          label: '期限提醒',
          badgeStyle: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      case 'system':
        return {
          icon: <Bell className="h-3.5 w-3.5 text-indigo-500" />,
          label: '系统通知',
          badgeStyle: 'bg-indigo-50 text-indigo-600 border-indigo-100'
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
    { id: 'hearing', label: '开庭提醒', count: notifications.filter(n => n.type === 'hearing').length },
    { id: 'deadline', label: '期限提醒', count: notifications.filter(n => n.type === 'deadline').length },
    { id: 'system', label: '系统通知', count: notifications.filter(n => n.type === 'system').length },
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

                {/* Type Badge */}
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded border ${details.badgeStyle}`}>
                    {details.icon}
                    <span>{details.label}</span>
                  </span>
                </div>

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
                    <span>{noti.isRead ? '已读' : '未读'}</span>
                  </span>

                  <span className="shrink-0 text-sm text-slate-400 font-medium">
                    {noti.time}
                  </span>
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
              此处无相关类别的提醒通知，您已全部查阅完毕。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
