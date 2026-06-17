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
          统计中心
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
