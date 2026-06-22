import React from 'react';
import { Calendar } from 'lucide-react';

export type TimeFilterType = 'year' | 'quarter' | 'month';

export interface TimeFilterState {
  type: TimeFilterType;
  year: number;
  quarter?: number;
  month?: number;
}

interface TimeFilterSelectorProps {
  filter: TimeFilterState;
  onFilterChange: (newFilter: TimeFilterState) => void;
  showMonth?: boolean;
}

export default function TimeFilterSelector({ filter, onFilterChange, showMonth = true }: TimeFilterSelectorProps) {
  const years = [2024, 2025, 2026];
  const quarters = [1, 2, 3, 4];
  const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  return (
    <div className="flex items-center gap-2 mb-3">
      <Calendar size={14} className="text-slate-400" />
      <div className="flex gap-1.5">
        {/* 年份选择 */}
        <select
          value={filter.year}
          onChange={(e) => onFilterChange({ ...filter, year: parseInt(e.target.value) })}
          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
        >
          {years.map(y => (
            <option key={y} value={y}>{y}年</option>
          ))}
        </select>

        {/* 周期类型选择 */}
        <select
          value={filter.type}
          onChange={(e) => {
            const newType = e.target.value as TimeFilterType;
            const newFilter: TimeFilterState = { ...filter, type: newType };
            if (newType === 'quarter') {
              newFilter.quarter = 1;
              newFilter.month = undefined;
            } else if (newType === 'month') {
              newFilter.month = 1;
              newFilter.quarter = undefined;
            } else {
              newFilter.quarter = undefined;
              newFilter.month = undefined;
            }
            onFilterChange(newFilter);
          }}
          className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
        >
          <option value="year">年度</option>
          <option value="quarter">季度</option>
          {showMonth && <option value="month">月度</option>}
        </select>

        {/* 季度选择 */}
        {filter.type === 'quarter' && (
          <select
            value={filter.quarter}
            onChange={(e) => onFilterChange({ ...filter, quarter: parseInt(e.target.value) })}
            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
          >
            {quarters.map(q => (
              <option key={q} value={q}>Q{q}</option>
            ))}
          </select>
        )}

        {/* 月份选择 */}
        {filter.type === 'month' && (
          <select
            value={filter.month}
            onChange={(e) => onFilterChange({ ...filter, month: parseInt(e.target.value) })}
            className="px-2 py-1 rounded-lg border border-slate-200 text-xs font-medium text-slate-700 bg-white hover:border-indigo-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none cursor-pointer"
          >
            {months.map(m => (
              <option key={m} value={m}>{m}月</option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
}

// 工具函数：获取时间筛选标签
export function getTimeFilterLabel(filter: TimeFilterState): string {
  if (filter.type === 'year') {
    return `${filter.year}年度`;
  } else if (filter.type === 'quarter') {
    return `${filter.year}年Q${filter.quarter}季度`;
  } else {
    const monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    return `${filter.year}年${monthNames[filter.month! - 1]}`;
  }
}

// 工具函数：根据时间周期调整数据
export function getAdjustedData(baseData: number, filter: TimeFilterState): number {
  let multiplier = 1;
  if (filter.type === 'quarter') {
    multiplier = 0.25;
  } else if (filter.type === 'month') {
    multiplier = 0.083;
  }
  return baseData * multiplier;
}
