import React from 'react';
import { Case, CaseStatus } from '../types';
import CaseStats from './CaseStats';

interface StatsCenterPageProps {
  cases: Case[];
  onBack: () => void;
  onNavigateToTab: (index: number) => void;
  onFilterStatus: (status: CaseStatus | 'all') => void;
}

export default function StatsCenterPage({
  cases,
  onBack,
  onNavigateToTab,
  onFilterStatus
}: StatsCenterPageProps) {
  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-13 bg-slate-900 border-b border-slate-800 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs text-indigo-200 hover:text-white font-bold transition-colors cursor-pointer"
        >
          <span>❮ 返回首页</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-white tracking-widest whitespace-nowrap">
          广州仲裁委 • 统计中心
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10 bg-slate-50">
        <CaseStats
          cases={cases}
          onNavigateToTab={onNavigateToTab}
          onFilterStatus={onFilterStatus}
        />
      </div>
    </div>
  );
}
