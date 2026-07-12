import React, { useState, useMemo } from 'react';
import { Search, AlertCircle, Building2, FileText, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import { TranscriptSignature } from '../types';

interface TranscriptSignaturePageProps {
  transcripts: TranscriptSignature[];
  onSelectTranscript: (transcript: TranscriptSignature) => void;
  onBack: () => void;
}

export default function TranscriptSignaturePage({
  transcripts,
  onSelectTranscript,
  onBack
}: TranscriptSignaturePageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'signed'>('pending');

  // Status Tabs Definition
  const statusTabs: { label: string; value: 'pending' | 'signed' }[] = [
    { label: '待办', value: 'pending' },
    { label: '已办', value: 'signed' },
  ];

  // Filtered transcripts list based on status and search query
  const filteredTranscripts = useMemo(() => {
    return transcripts.filter((t) => {
      // 1. Status Filter
      if (t.status !== statusFilter) {
        return false;
      }
      // 2. Search Query (matches caseNo, claimant, respondent, secretary)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          t.caseNo.toLowerCase().includes(query) ||
          t.claimant.toLowerCase().includes(query) ||
          t.respondent.toLowerCase().includes(query) ||
          t.secretary.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [transcripts, statusFilter, searchQuery]);

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
          笔录签名
        </div>
      </div>

      {/* Search Stick Area */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
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

      {/* Transcripts List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTranscripts.length > 0 ? (
          filteredTranscripts.map((t) => {
            const statusColorClass = t.status === 'signed'
              ? 'text-emerald-500 bg-emerald-50 border-emerald-100'
              : 'text-amber-500 bg-amber-50 border-amber-100';

            return (
              <div
                key={t.id}
                onClick={() => onSelectTranscript(t)}
                className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
                    <FileText size={14} className="text-indigo-400" />
                    {t.caseNo}
                  </span>
                  <span className={`text-sm p-0.5 px-1.5 rounded border ${statusColorClass}`}>
                    {t.status === 'signed' ? '已签名' : '待签名'}
                  </span>
                </div>

                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{t.claimant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">被申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{t.respondent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">办案秘书</span>
                    <span className="text-slate-700 flex-1 text-left">{t.secretary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">仲裁员</span>
                    <span className="text-slate-700 flex-1 text-left">{t.arbitrator}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-amber-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">开庭时间</span>
                    <span className="text-slate-700 flex-1 text-left">{t.hearingTime}</span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-500">未检索到匹配的笔录签名</span>
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
                onClick={() => setStatusFilter(tab.value)}
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
    </div>
  );
}
