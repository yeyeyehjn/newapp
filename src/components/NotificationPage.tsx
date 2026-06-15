import React, { useState } from 'react';
import { Bell, ArrowLeft, Check, Trash2, MailOpen, AlertCircle, Calendar, ShieldCheck, FileText } from 'lucide-react';

interface NotificationItem {
  id: string;
  category: 'system' | 'business' | 'signing'; // system: 系统通知, business: 排庭/文书业务, signing: CA签章/合议
  title: string;
  content: string;
  time: string;
  isRead: boolean;
  docCode?: string;
}

interface NotificationPageProps {
  onBack: () => void;
}

export default function NotificationPage({ onBack }: NotificationPageProps) {
  // Mock notifications mirroring actual high-level, realistic legal issues
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'nt_1',
      category: 'system',
      title: '合同履约争议案 • 审理期限届满预警',
      content: '您承办的名创优品合同争议案（案号: GD20260412）距审理截止日期还有15天。请合议庭尽快梳理案件争议焦点，并安排后续裁决起草或二次庭审工作，防范超期结案。',
      time: '2026-06-12 09:00',
      isRead: false,
      docCode: 'GD20260412'
    },
    {
      id: 'nt_2',
      category: 'business',
      title: '建设工程纠纷案 • 庭审时段变更调档',
      content: '经双方当事人书面申请、合议庭复核，定于 2026-06-15 下午的庭审（案号: GD20260582）已调整为 2026-06-18 09:30。请各位仲裁长及专职书记员注意在工作台及物理日程中实时刷新备档。',
      time: '2026-06-11 15:30',
      isRead: false,
      docCode: 'GD20260582'
    },
    {
      id: 'nt_3',
      category: 'signing',
      title: '股权交割争议案 • 裁决主书合签通知',
      content: '首席仲裁员已上传最终裁决书。现需要您进入该案待办（案号: GD20260114）进行双因子 CA 数字安全校验核签。请插入专有证书盾后确认签名。',
      time: '2026-06-10 10:20',
      isRead: true,
      docCode: 'GD20260114'
    },
    {
      id: 'nt_4',
      category: 'business',
      title: '当事人新提交补充质证、反驳意见书',
      content: '被申请人-蓝海创投已于 2026-06-09 16:45 提交了《项目尽职调查报告及其反驳意见书.docx》（卷宗ID: EX-2026-003），已载入当案智慧卷宗树，请您随时登入仲裁终端开展离线主理审查。',
      time: '2026-06-09 17:00',
      isRead: true,
      docCode: 'GD20260305'
    }
  ]);

  const [activeTab, setActiveTab] = useState<'all' | 'unread' | 'system' | 'business' | 'signing'>('all');

  // Mark all as read
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Toggle read/unread state for a single item
  const handleToggleRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, isRead: !n.isRead } : n)
    );
  };

  // Delete notification
  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Unread count
  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Filter messages
  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return !n.isRead;
    return n.category === activeTab;
  });

  // Get category icon and style helpers
  const getCategoryDetails = (category: string) => {
    switch (category) {
      case 'system':
        return {
          icon: <AlertCircle className="h-4 w-4 text-rose-500" />,
          label: '系统通知',
          badgeStyle: 'bg-rose-50 text-rose-600 border-rose-100'
        };
      case 'business':
        return {
          icon: <Calendar className="h-4 w-4 text-blue-500" />,
          label: '业务提醒',
          badgeStyle: 'bg-blue-50 text-blue-600 border-blue-100'
        };
      case 'signing':
        return {
          icon: <ShieldCheck className="h-4 w-4 text-amber-500" />,
          label: '签章合议',
          badgeStyle: 'bg-amber-50 text-amber-600 border-amber-100'
        };
      default:
        return {
          icon: <Bell className="h-4 w-4 text-slate-500" />,
          label: '通知',
          badgeStyle: 'bg-slate-50 text-slate-600 border-slate-100'
        };
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col min-h-0 relative select-none font-sans animate-fade-in">
      {/* Subpage Header Dashboard Style */}
      <div className="bg-white border-b border-slate-100 h-13 px-4 flex items-center justify-between flex-shrink-0 z-20">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="h-8 w-8 hover:bg-slate-50 active:scale-95 rounded-full flex items-center justify-center transition-all cursor-pointer border border-transparent hover:border-slate-100 text-slate-600"
            aria-label="返回上一页"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-sm font-extrabold text-slate-800">消息通知</h1>
            <p className="text-[10px] text-slate-400 font-medium">查看专网办案系统及合议通知</p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-[11px] font-bold text-indigo-600 hover:text-indigo-700 active:scale-95 transition-all flex items-center gap-1 bg-indigo-50/50 hover:bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-150/50 cursor-pointer"
          >
            <MailOpen className="h-3 w-3" />
            <span>全部已读</span>
          </button>
        )}
      </div>

      {/* FILTER TABS */}
      <div className="bg-white border-b border-slate-100 shadow-3xs flex-shrink-0">
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none py-2 px-3 max-w-full">
          {[
            { id: 'all', label: '全部', count: notifications.length },
            { id: 'unread', label: '未读', count: unreadCount, highlight: true },
            { id: 'system', label: '系统通知', count: notifications.filter(n => n.category === 'system').length },
            { id: 'business', label: '业务提醒', count: notifications.filter(n => n.category === 'business').length },
            { id: 'signing', label: '签章合议', count: notifications.filter(n => n.category === 'signing').length }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            const showBadge = tab.count > 0;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-1.5 px-3 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center space-x-1 ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40' 
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {showBadge && (
                  <span 
                    className={`text-xs px-1.5 rounded-full ${
                      tab.highlight && tab.count > 0
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
            const details = getCategoryDetails(noti.category);
            return (
              <div
                key={noti.id}
                onClick={() => handleToggleRead(noti.id)}
                className={`relative rounded-2xl border p-3.5 transition-all text-left cursor-pointer select-none flex flex-col gap-2.5 hover:shadow-2xs
                  ${noti.isRead 
                    ? 'bg-white border-slate-100 text-slate-600' 
                    : 'bg-indigo-50/15 border-indigo-100 shadow-2xs shadow-indigo-100/10'
                  }`}
              >
                {/* Visual Accent Bar for Unread */}
                {!noti.isRead && (
                  <span className="absolute left-0 top-3.5 bottom-3.5 w-1 bg-indigo-500 rounded-r-full" />
                )}

                {/* Card Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`flex items-center gap-1 text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border leading-none shrink-0 ${details.badgeStyle}`}>
                      {details.icon}
                      <span>{details.label}</span>
                    </span>
                    {noti.docCode && (
                      <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider bg-slate-100 h-[18px] flex items-center justify-center px-1 rounded">
                        {noti.docCode}
                      </span>
                    )}
                  </div>

                  <span className="shrink-0 text-[10px] text-slate-400 font-medium">
                    {noti.time}
                  </span>
                </div>

                {/* Title */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className={`text-xs select-none block leading-normal ${noti.isRead ? 'font-bold text-slate-700' : 'font-extrabold text-slate-900 font-sans'}`}>
                    {noti.title}
                  </h3>
                  {!noti.isRead && (
                    <span className="h-1.5 w-1.5 bg-indigo-600 rounded-full shrink-0 mt-1" />
                  )}
                </div>

                {/* Content */}
                <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                  {noti.content}
                </p>

                {/* Quick actions inside card */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-100/80 mt-0.5">
                  <span className="text-[9px] text-slate-400 font-bold flex items-center gap-1">
                    <Check className={`h-3 w-3 ${noti.isRead ? 'text-emerald-500' : 'text-slate-300'}`} />
                    <span>{noti.isRead ? '已读消息' : '暂未阅读 • 点击标记'}</span>
                  </span>

                  <button
                    onClick={(e) => handleDelete(noti.id, e)}
                    className="text-[10px] text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 p-1 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-rose-100/40 select-none flex items-center gap-1"
                    title="删除此通知"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <Bell className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="text-xs font-bold text-slate-700 mb-1">空空如也</h3>
            <p className="text-[10px] text-slate-400 max-w-[200px] leading-normal">
              此处无相关类目的系统或业务通知。请继续维持好当下高效率。
            </p>
          </div>
        )}
      </div>

      {/* Ambient tips */}
      <div className="p-3 bg-slate-100/50 border-t border-slate-150 text-center flex-shrink-0">
        <span className="text-[10px] text-slate-400 font-medium">
          所有通知同步接入广州仲裁委核心速裁加密节点网络
        </span>
      </div>
    </div>
  );
}
