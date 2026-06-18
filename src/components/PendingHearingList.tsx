import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, FileText, AlertCircle, Building2, MapPin, Clock, Calendar } from 'lucide-react';

export interface PendingHearingItem {
  id: string;
  caseNo: string;
  claimant: string;
  respondent: string;
  hearingTime: string;
  hearingLocation: string;
  secretary: string;
  hearingPurpose: string;
  status: 'pending' | 'held';
}

interface PendingHearingListProps {
  onBack: () => void;
  onSelectItem: (item: PendingHearingItem) => void;
}

export default function PendingHearingList({ onBack, onSelectItem }: PendingHearingListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      status: 'pending'
    }
  ];

  const filteredHearings = useMemo(() => {
    return hearings
      .filter((h) => h.status === 'pending')
      .filter((h) => {
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
  }, [hearings, searchQuery]);

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
        <span className="font-bold text-slate-800 text-xs">待开庭提醒</span>
        <div className="w-10"></div>
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
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

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
                    <span className="text-slate-500 w-16 flex-shrink-0">申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{h.claimant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-slate-500 w-16 flex-shrink-0">被申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{h.respondent}</span>
                  </div>

                  {/* Hearing Time */}
                  <div className="flex items-center gap-2 pt-1">
                    <Clock size={12} className="text-amber-500 flex-shrink-0" />
                    <span className="text-slate-500 w-16 flex-shrink-0">时间</span>
                    <span className="text-slate-800 font-bold flex-1 text-left">{h.hearingTime}</span>
                  </div>

                  {/* Hearing Location */}
                  <div className="flex items-start gap-2">
                    <MapPin size={12} className="text-rose-500 flex-shrink-0 mt-0.5" />
                    <span className="text-slate-500 w-16 flex-shrink-0 mt-0.5">地点</span>
                    <span className="text-slate-800 flex-1 text-left">{h.hearingLocation}</span>
                  </div>

                  <div className="flex items-center gap-2 pt-1 border-t border-dashed border-slate-100 mt-2">
                    <FileText size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-16 flex-shrink-0">办案秘书</span>
                    <span className="text-slate-700 flex-1 text-left">{h.secretary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-500 w-16 flex-shrink-0">开庭用途</span>
                    <span className="text-indigo-600 font-bold flex-1 text-left">{h.hearingPurpose}</span>
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
              onClick={() => setSearchQuery('')}
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
