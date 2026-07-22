import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, CheckCircle2, ChevronRight, Award, FileText, Clock, HelpCircle, XCircle
} from 'lucide-react';
import { Case, CaseStatus } from '../types';

interface CaseStatsProps {
  cases: Case[];
  onNavigateToTab: (index: number) => void;
  onFilterStatus: (status: CaseStatus | 'all') => void;
}

type QuarterData = {
  courtCases: { sole: number; chief: number; side: number };
  topCases: { name: string; count: number; ratio: number }[];
  indicators: {
    settle: { value: string; change: string; isUp: boolean; rank: string };
    cancel: { value: string; change: string; isUp: boolean; rank: string };
    delay: { value: string; change: string; isUp: boolean; rank: string };
  };
  quarterChart: { name: string; settle: number; cancel: number; delay: number }[];
};

const DATA_MATRIX: Record<string, Record<string, QuarterData>> = {
  '2026': {
    all: {
      courtCases: { sole: 40, chief: 20, side: 30 },
      topCases: [
        { name: '金融借款合同纠纷', count: 36, ratio: 66 },
        { name: '合同纠纷', count: 28, ratio: 46 },
        { name: '房地产合同纠纷', count: 10, ratio: 16 },
        { name: '买卖合同纠纷', count: 8, ratio: 12 },
        { name: '劳动争议纠纷', count: 5, ratio: 8 }
      ],
      indicators: {
        settle: { value: '89.00%', change: '20%', isUp: true, rank: '30%' },
        cancel: { value: '89.00%', change: '20%', isUp: true, rank: '35%' },
        delay: { value: '89.00%', change: '20%', isUp: false, rank: '10%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 92, cancel: 85, delay: 70 },
        { name: '第二季度', settle: 48, cancel: 90, delay: 60 },
        { name: '第三季度', settle: 35, cancel: 55, delay: 90 },
        { name: '第四季度', settle: 75, cancel: 70, delay: 58 }
      ]
    },
    Q1: {
      courtCases: { sole: 14, chief: 8, side: 11 },
      topCases: [
        { name: '金融借款合同纠纷', count: 15, ratio: 68 },
        { name: '合同纠纷', count: 10, ratio: 45 },
        { name: '房地产合同纠纷', count: 4, ratio: 18 },
        { name: '买卖合同纠纷', count: 3, ratio: 13 },
        { name: '劳动争议纠纷', count: 2, ratio: 9 }
      ],
      indicators: {
        settle: { value: '92.00%', change: '25%', isUp: true, rank: '25%' },
        cancel: { value: '85.00%', change: '18%', isUp: true, rank: '40%' },
        delay: { value: '70.00%', change: '15%', isUp: false, rank: '15%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 92, cancel: 85, delay: 70 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q2: {
      courtCases: { sole: 10, chief: 5, side: 7 },
      topCases: [
        { name: '金融借款合同纠纷', count: 9, ratio: 60 },
        { name: '合同纠纷', count: 8, ratio: 53 },
        { name: '房地产合同纠纷', count: 2, ratio: 13 },
        { name: '买卖合同纠纷', count: 2, ratio: 13 },
        { name: '劳动争议纠纷', count: 1, ratio: 6 }
      ],
      indicators: {
        settle: { value: '48.00%', change: '5%', isUp: false, rank: '55%' },
        cancel: { value: '90.00%', change: '25%', isUp: true, rank: '20%' },
        delay: { value: '60.00%', change: '8%', isUp: false, rank: '28%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 48, cancel: 90, delay: 60 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q3: {
      courtCases: { sole: 8, chief: 4, side: 6 },
      topCases: [
        { name: '金融借款合同纠纷', count: 6, ratio: 50 },
        { name: '合同纠纷', count: 5, ratio: 41 },
        { name: '房地产合同纠纷', count: 2, ratio: 16 },
        { name: '买卖合同纠纷', count: 1, ratio: 8 },
        { name: '劳动争议纠纷', count: 1, ratio: 8 }
      ],
      indicators: {
        settle: { value: '35.00%', change: '10%', isUp: false, rank: '65%' },
        cancel: { value: '55.00%', change: '5%', isUp: true, rank: '48%' },
        delay: { value: '90.00%', change: '18%', isUp: true, rank: '5%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 35, cancel: 55, delay: 90 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q4: {
      courtCases: { sole: 10, chief: 5, side: 9 },
      topCases: [
        { name: '金融借款合同纠纷', count: 9, ratio: 60 },
        { name: '合同纠纷', count: 7, ratio: 46 },
        { name: '房地产合同纠纷', count: 3, ratio: 20 },
        { name: '买卖合同纠纷', count: 2, ratio: 13 },
        { name: '劳动争议纠纷', count: 1, ratio: 6 }
      ],
      indicators: {
        settle: { value: '75.00%', change: '12%', isUp: true, rank: '32%' },
        cancel: { value: '70.00%', change: '15%', isUp: true, rank: '38%' },
        delay: { value: '58.00%', change: '14%', isUp: false, rank: '22%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 75, cancel: 70, delay: 58 }
      ]
    }
  },
  '2025': {
    all: {
      courtCases: { sole: 35, chief: 20, side: 28 },
      topCases: [
        { name: '金融借款合同纠纷', count: 32, ratio: 60 },
        { name: '合同纠纷', count: 24, ratio: 40 },
        { name: '房地产合同纠纷', count: 9, ratio: 15 },
        { name: '买卖合同纠纷', count: 7, ratio: 11 },
        { name: '劳动争议纠纷', count: 4, ratio: 6 }
      ],
      indicators: {
        settle: { value: '86.00%', change: '18%', isUp: true, rank: '33%' },
        cancel: { value: '84.00%', change: '15%', isUp: true, rank: '38%' },
        delay: { value: '85.00%', change: '12%', isUp: false, rank: '12%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 88, cancel: 80, delay: 65 },
        { name: '第二季度', settle: 50, cancel: 85, delay: 58 },
        { name: '第三季度', settle: 40, cancel: 60, delay: 85 },
        { name: '第四季度', settle: 80, cancel: 75, delay: 55 }
      ]
    },
    Q1: {
      courtCases: { sole: 10, chief: 5, side: 7 },
      topCases: [
        { name: '金融借款合同纠纷', count: 10, ratio: 66 },
        { name: '合同纠纷', count: 6, ratio: 40 },
        { name: '房地产合同纠纷', count: 2, ratio: 13 },
        { name: '买卖合同纠纷', count: 1, ratio: 6 },
        { name: '劳动争议纠纷', count: 1, ratio: 6 }
      ],
      indicators: {
        settle: { value: '88.00%', change: '12%', isUp: true, rank: '28%' },
        cancel: { value: '80.00%', change: '8%', isUp: true, rank: '42%' },
        delay: { value: '65.00%', change: '10%', isUp: false, rank: '18%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 88, cancel: 80, delay: 65 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q2: {
      courtCases: { sole: 9, chief: 5, side: 8 },
      topCases: [
        { name: '金融借款合同纠纷', count: 8, ratio: 57 },
        { name: '合同纠纷', count: 6, ratio: 42 },
        { name: '房地产合同纠纷', count: 2, ratio: 14 },
        { name: '买卖合同纠纷', count: 2, ratio: 14 },
        { name: '劳动争议纠纷', count: 1, ratio: 7 }
      ],
      indicators: {
        settle: { value: '50.00%', change: '4%', isUp: false, rank: '52%' },
        cancel: { value: '85.00%', change: '20%', isUp: true, rank: '24%' },
        delay: { value: '58.00%', change: '7%', isUp: false, rank: '30%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 50, cancel: 85, delay: 58 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q3: {
      courtCases: { sole: 7, chief: 4, side: 5 },
      topCases: [
        { name: '金融借款合同纠纷', count: 6, ratio: 54 },
        { name: '合同纠纷', count: 5, ratio: 45 },
        { name: '房地产合同纠纷', count: 2, ratio: 18 },
        { name: '买卖合同纠纷', count: 1, ratio: 9 },
        { name: '劳动争议纠纷', count: 1, ratio: 9 }
      ],
      indicators: {
        settle: { value: '40.00%', change: '8%', isUp: false, rank: '60%' },
        cancel: { value: '60.00%', change: '4%', isUp: true, rank: '44%' },
        delay: { value: '85.00%', change: '15%', isUp: true, rank: '8%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 40, cancel: 60, delay: 85 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q4: {
      courtCases: { sole: 10, chief: 5, side: 8 },
      topCases: [
        { name: '金融借款合同纠纷', count: 8, ratio: 53 },
        { name: '合同纠纷', count: 7, ratio: 46 },
        { name: '房地产合同纠纷', count: 3, ratio: 20 },
        { name: '买卖合同纠纷', count: 2, ratio: 13 },
        { name: '劳动争议纠纷', count: 1, ratio: 6 }
      ],
      indicators: {
        settle: { value: '80.00%', change: '10%', isUp: true, rank: '35%' },
        cancel: { value: '75.00%', change: '12%', isUp: true, rank: '40%' },
        delay: { value: '55.00%', change: '12%', isUp: false, rank: '24%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 80, cancel: 75, delay: 55 }
      ]
    }
  },
  '2024': {
    all: {
      courtCases: { sole: 32, chief: 18, side: 25 },
      topCases: [
        { name: '金融借款合同纠纷', count: 28, ratio: 56 },
        { name: '合同纠纷', count: 22, ratio: 44 },
        { name: '房地产合同纠纷', count: 8, ratio: 16 },
        { name: '买卖合同纠纷', count: 6, ratio: 12 },
        { name: '劳动争议纠纷', count: 3, ratio: 6 }
      ],
      indicators: {
        settle: { value: '85.00%', change: '15%', isUp: true, rank: '35%' },
        cancel: { value: '82.00%', change: '12%', isUp: true, rank: '41%' },
        delay: { value: '82.00%', change: '10%', isUp: false, rank: '14%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 85, cancel: 78, delay: 60 },
        { name: '第二季度', settle: 48, cancel: 82, delay: 55 },
        { name: '第三季度', settle: 38, cancel: 58, delay: 82 },
        { name: '第四季度', settle: 78, cancel: 72, delay: 50 }
      ]
    },
    Q1: {
      courtCases: { sole: 8, chief: 4, side: 6 },
      topCases: [
        { name: '金融借款合同纠纷', count: 7, ratio: 58 },
        { name: '合同纠纷', count: 5, ratio: 41 },
        { name: '房地产合同纠纷', count: 2, ratio: 16 },
        { name: '买卖合同纠纷', count: 1, ratio: 8 },
        { name: '劳动争议纠纷', count: 1, ratio: 8 }
      ],
      indicators: {
        settle: { value: '85.00%', change: '10%', isUp: true, rank: '32%' },
        cancel: { value: '78.00%', change: '6%', isUp: true, rank: '45%' },
        delay: { value: '60.00%', change: '8%', isUp: false, rank: '20%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 85, cancel: 78, delay: 60 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q2: {
      courtCases: { sole: 8, chief: 4, side: 6 },
      topCases: [
        { name: '金融借款合同纠纷', count: 7, ratio: 58 },
        { name: '合同纠纷', count: 5, ratio: 41 },
        { name: '房地产合同纠纷', count: 2, ratio: 16 },
        { name: '买卖合同纠纷', count: 1, ratio: 8 },
        { name: '劳动争议纠纷', count: 1, ratio: 8 }
      ],
      indicators: {
        settle: { value: '48.00%', change: '3%', isUp: false, rank: '54%' },
        cancel: { value: '82.00%', change: '18%', isUp: true, rank: '26%' },
        delay: { value: '55.00%', change: '6%', isUp: false, rank: '32%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 48, cancel: 82, delay: 55 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q3: {
      courtCases: { sole: 7, chief: 4, side: 5 },
      topCases: [
        { name: '金融借款合同纠纷', count: 6, ratio: 54 },
        { name: '合同纠纷', count: 5, ratio: 45 },
        { name: '房地产合同纠纷', count: 2, ratio: 18 },
        { name: '买卖合同纠纷', count: 1, ratio: 9 },
        { name: '劳动争议纠纷', count: 1, ratio: 9 }
      ],
      indicators: {
        settle: { value: '38.00%', change: '6%', isUp: false, rank: '62%' },
        cancel: { value: '58.00%', change: '3%', isUp: true, rank: '46%' },
        delay: { value: '82.00%', change: '12%', isUp: true, rank: '10%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 38, cancel: 58, delay: 82 },
        { name: '第四季度', settle: 0, cancel: 0, delay: 0 }
      ]
    },
    Q4: {
      courtCases: { sole: 10, chief: 5, side: 8 },
      topCases: [
        { name: '金融借款合同纠纷', count: 8, ratio: 53 },
        { name: '合同纠纷', count: 7, ratio: 46 },
        { name: '房地产合同纠纷', count: 3, ratio: 20 },
        { name: '买卖合同纠纷', count: 2, ratio: 13 },
        { name: '劳动争议纠纷', count: 1, ratio: 6 }
      ],
      indicators: {
        settle: { value: '78.00%', change: '8%', isUp: true, rank: '38%' },
        cancel: { value: '72.00%', change: '10%', isUp: true, rank: '44%' },
        delay: { value: '50.00%', change: '10%', isUp: false, rank: '26%' }
      },
      quarterChart: [
        { name: '第一季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第二季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第三季度', settle: 0, cancel: 0, delay: 0 },
        { name: '第四季度', settle: 78, cancel: 72, delay: 50 }
      ]
    }
  }
};

// ===== Aggregation helpers (date range 统计合并) =====
const ALL_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const CHART_QUARTER_NAMES = ['第一季度', '第二季度', '第三季度', '第四季度'];
// 季度对应月份区间（用于将日期范围映射到 DATA_MATRIX 的季度键）
const QUARTER_DATES: Record<string, { start: string; end: string }> = {
  Q1: { start: '01-01', end: '03-31' },
  Q2: { start: '04-01', end: '06-30' },
  Q3: { start: '07-01', end: '09-30' },
  Q4: { start: '10-01', end: '12-31' },
};

const parsePct = (v: string): number => parseFloat(v.replace('%', '')) || 0;
const avg = (vals: number[]) => (vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0);

function aggregateCourtCases(datas: QuarterData[]) {
  return datas.reduce(
    (acc, d) => ({
      sole: acc.sole + d.courtCases.sole,
      chief: acc.chief + d.courtCases.chief,
      side: acc.side + d.courtCases.side,
    }),
    { sole: 0, chief: 0, side: 0 }
  );
}

function aggregateTopCases(datas: QuarterData[]) {
  const map = new Map<string, number>();
  for (const d of datas) {
    for (const t of d.topCases) {
      map.set(t.name, (map.get(t.name) || 0) + t.count);
    }
  }
  const total = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count, ratio: Math.round((count / total) * 100) }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

function aggregateIndicators(datas: QuarterData[]): QuarterData['indicators'] {
  const fallback = DATA_MATRIX['2026'].all.indicators;
  if (!datas.length) return fallback;
  const settleVals = datas.map((d) => parsePct(d.indicators.settle.value));
  const cancelVals = datas.map((d) => parsePct(d.indicators.cancel.value));
  const delayVals = datas.map((d) => parsePct(d.indicators.delay.value));
  // 涨跌/排名取所选区间最近一期的口径，百分比取算数平均
  const ref = datas[datas.length - 1].indicators;
  return {
    settle: { value: avg(settleVals).toFixed(2) + '%', change: ref.settle.change, isUp: ref.settle.isUp, rank: ref.settle.rank },
    cancel: { value: avg(cancelVals).toFixed(2) + '%', change: ref.cancel.change, isUp: ref.cancel.isUp, rank: ref.cancel.rank },
    delay: { value: avg(delayVals).toFixed(2) + '%', change: ref.delay.change, isUp: ref.delay.isUp, rank: ref.delay.rank },
  };
}

// 季度图表：年度范围模式下，对各年同季度比率取平均；季度模式下由调用方直接取该年全年数据
function aggregateQuarterChart(datas: QuarterData[]) {
  return CHART_QUARTER_NAMES.map((name, i) => ({
    name,
    settle: Math.round(avg(datas.map((d) => d.quarterChart[i]?.settle || 0))),
    cancel: Math.round(avg(datas.map((d) => d.quarterChart[i]?.cancel || 0))),
    delay: Math.round(avg(datas.map((d) => d.quarterChart[i]?.delay || 0))),
  }));
}

export default function CaseStats({ cases, onNavigateToTab, onFilterStatus }: CaseStatsProps) {
  const today = useMemo(() => new Date(), []);
  const todayStr = useMemo(() => {
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  }, [today]);

  // 日期范围筛选模型：起始日期 ~ 结束日期 + 快捷筛选
  type QuickFilter = 'year' | 'halfYear' | 'quarter';
  const [startDate, setStartDate] = useState<string>(`${today.getFullYear()}-01-01`);
  const [endDate, setEndDate] = useState<string>(todayStr);
  const [activeQuickFilter, setActiveQuickFilter] = useState<QuickFilter | null>('year');

  const [hoveredQuarterIndex, setHoveredQuarterIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 筛选条件变更 -> 短暂加载态（实时刷新反馈）
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(t);
  }, [startDate, endDate]);

  // 应用快捷筛选：今年 / 近半年 / 近三个月
  const applyQuickFilter = (filter: QuickFilter) => {
    const now = new Date();
    const fmt = (dt: Date) => {
      const yy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, '0');
      const dd = String(dt.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    };
    const end = fmt(now);
    let start: string;
    if (filter === 'year') {
      start = `${now.getFullYear()}-01-01`;
    } else if (filter === 'halfYear') {
      const past = new Date(now);
      past.setMonth(past.getMonth() - 6);
      start = fmt(past);
    } else {
      const past = new Date(now);
      past.setMonth(past.getMonth() - 3);
      start = fmt(past);
    }
    setStartDate(start);
    setEndDate(end);
    setActiveQuickFilter(filter);
  };

  // 手动修改日期时清除快捷筛选高亮
  const handleStartDateChange = (v: string) => {
    if (!v) return;
    setStartDate(v);
    setActiveQuickFilter(null);
  };
  const handleEndDateChange = (v: string) => {
    if (!v) return;
    setEndDate(v);
    setActiveQuickFilter(null);
  };

  // 清除筛选 -> 回到默认"今年"
  const handleClear = () => {
    setStartDate(`${today.getFullYear()}-01-01`);
    setEndDate(todayStr);
    setActiveQuickFilter('year');
  };

  // 校验日期：起 <= 结；若用户反向输入，自动纠正
  const safeStart = startDate <= endDate ? startDate : endDate;
  const safeEnd = startDate <= endDate ? endDate : startDate;

  // 依据日期范围筛选：遍历 DATA_MATRIX，季度日期区间与筛选区间有交集即纳入
  const slicedDatas = useMemo(() => {
    const datas: QuarterData[] = [];
    for (const year of Object.keys(DATA_MATRIX).sort()) {
      for (const q of ALL_QUARTERS) {
        const qStart = `${year}-${QUARTER_DATES[q].start}`;
        const qEnd = `${year}-${QUARTER_DATES[q].end}`;
        if (qStart <= safeEnd && qEnd >= safeStart) {
          const d = DATA_MATRIX[year]?.[q];
          if (d) datas.push(d);
        }
      }
    }
    return datas;
  }, [safeStart, safeEnd]);

  const courtCases = useMemo(() => aggregateCourtCases(slicedDatas), [slicedDatas]);
  const topCases = useMemo(() => aggregateTopCases(slicedDatas), [slicedDatas]);
  const indicators = useMemo(() => aggregateIndicators(slicedDatas), [slicedDatas]);

  // 办结数（含同比）：办结数 = 范围内 courtCases 总和；同比基于范围内最近两期同口径对比
  const closedCount = useMemo(() => {
    const total = courtCases.sole + courtCases.chief + courtCases.side;
    const last = slicedDatas[slicedDatas.length - 1];
    const prev = slicedDatas[slicedDatas.length - 2];
    if (last && prev) {
      const lastTotal = last.courtCases.sole + last.courtCases.chief + last.courtCases.side;
      const prevTotal = prev.courtCases.sole + prev.courtCases.chief + prev.courtCases.side;
      if (prevTotal > 0) {
        const diff = ((lastTotal - prevTotal) / prevTotal) * 100;
        return {
          value: total,
          change: Math.abs(Math.round(diff * 10) / 10) + '%',
          isUp: diff >= 0,
        };
      }
    }
    // 退化：取区间最近一期 settle 的同比口径
    const ref = indicators.settle;
    return { value: total, change: ref.change, isUp: ref.isUp };
  }, [courtCases, slicedDatas, indicators]);

  // 季度图表：对范围内各年同季度比率取平均（跨季度/跨年）
  const quarterChart = useMemo(() => aggregateQuarterChart(slicedDatas), [slicedDatas]);

  // 图表高亮用的"激活季度"集合：日期范围覆盖到的季度
  const activeQuarters = useMemo(() => {
    const set = new Set<string>();
    for (const year of Object.keys(DATA_MATRIX)) {
      for (const q of ALL_QUARTERS) {
        const qStart = `${year}-${QUARTER_DATES[q].start}`;
        const qEnd = `${year}-${QUARTER_DATES[q].end}`;
        if (qStart <= safeEnd && qEnd >= safeStart) set.add(q);
      }
    }
    return Array.from(set);
  }, [safeStart, safeEnd]);

  // 点击柱状图某季度 -> 将日期范围聚焦到该季度（基于当前结束日期所在年）
  const handleBarClick = (qKey: string) => {
    const year = safeEnd.slice(0, 4);
    if (!DATA_MATRIX[year]) return;
    setStartDate(`${year}-${QUARTER_DATES[qKey].start}`);
    setEndDate(`${year}-${QUARTER_DATES[qKey].end}`);
    setActiveQuickFilter(null);
  };

  // 筛选范围摘要文案
  const scopeSummary = useMemo(() => {
    const ms = new Date(safeEnd).getTime() - new Date(safeStart).getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    return `${safeStart} ~ ${safeEnd} · 共 ${days} 天`;
  }, [safeStart, safeEnd]);
  const totalCourtCases = courtCases.sole + courtCases.chief + courtCases.side;
  const safeTotal = totalCourtCases || 1;
  const solePct = (courtCases.sole / safeTotal) * 100;
  const chiefPct = (courtCases.chief / safeTotal) * 100;
  const sidePct = (courtCases.side / safeTotal) * 100;

  // 在办案件情况：基于真实 cases 数据统计
  const pendingCount = useMemo(() => cases.filter((c) => c.status !== '已结案').length, [cases]);
  const delayedCount = useMemo(() => {
    const todayStr = today.toISOString().split('T')[0];
    return cases.filter((c) => c.hearings.some((h) => h.status === '待开庭' && h.hearingTime < todayStr)).length;
  }, [cases, today]);

  // Circle/Ring formula variables for customizable dimensions
  const radius = 38;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  
  const soleLen = (solePct / 100) * circumference;
  const chiefLen = (chiefPct / 100) * circumference;
  const sideLen = (sidePct / 100) * circumference;
  
  const soleOffset = 0;
  const chiefOffset = -soleLen;
  const sideOffset = -(soleLen + chiefLen);

  // Custom colors matching the user interface blueprint diagrams
  const colorBlue = '#1E62EC';
  const colorOrange = '#F59E0B';
  const colorGreen = '#74C080';

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-6 overflow-hidden relative">
      
      {/* Scrollable View Container */}
      <div className={`flex-1 space-y-4 overflow-y-auto no-scrollbar w-full text-left transition-opacity duration-200 ${isLoading ? 'opacity-50' : 'opacity-100'}`}>
        
        {/* TOP INTERACTIVE FILTER CARD */}
        <div id="stats_filter_card" className="bg-white rounded-2xl p-4 border border-slate-100 space-y-3.5 select-none animate-fade-in">
          

          {/* Header + 清除筛选 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
              <h4 className="text-lg font-extrabold text-slate-800">筛选配置</h4>
              {isLoading && (
                <span className="flex items-center gap-1 text-sm font-bold text-[#1E62EC] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E62EC] animate-ping"></span>
                  统计中
                </span>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-sm text-slate-400 hover:text-[#1E62EC] bg-slate-50/80 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-100 rounded-lg py-1 px-2.5 transition-colors cursor-pointer uppercase tracking-wide"
            >
              清除筛选 ↺
            </button>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* 快捷筛选：今年 / 近半年 / 近三个月 */}
          <div className="space-y-1.5">
            <span className="text-sm text-slate-400  uppercase tracking-wide block">快捷筛选</span>
            <div className="grid grid-cols-3 gap-2">
              {([
                { key: 'year' as const, label: '今年' },
                { key: 'halfYear' as const, label: '近半年' },
                { key: 'quarter' as const, label: '近三个月' },
              ]).map(({ key, label }) => {
                const isActive = activeQuickFilter === key;
                return (
                  <button
                    key={key}
                    onClick={() => applyQuickFilter(key)}
                    className={`py-1.5 px-3 text-base   rounded-xl transition-all border outline-none cursor-pointer ${
                      isActive
                        ? 'bg-[#1E62EC] text-white border-[#1E62EC] shadow-sm shadow-[#1E62EC]/10'
                        : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 自定义日期范围 */}
          <div className="space-y-1.5">
            <span className="text-sm text-slate-400  uppercase tracking-wide block">自定义日期范围</span>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-sm text-slate-400   block">起始日期</label>
                <input
                  type="date"
                  value={startDate}
                  max={endDate}
                  onChange={(e) => handleStartDateChange(e.target.value)}
                  className="w-full py-2 px-3 text-base  rounded-xl border border-slate-100 bg-slate-50/80 text-slate-700 outline-none focus:border-[#1E62EC] focus:bg-white focus:text-[#1E62EC] transition-all cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm text-slate-400  block">结束日期</label>
                <input
                  type="date"
                  value={endDate}
                  min={startDate}
                  onChange={(e) => handleEndDateChange(e.target.value)}
                  className="w-full py-2 px-3 text-base rounded-xl border border-slate-100 bg-slate-50/80 text-slate-700 outline-none focus:border-[#1E62EC] focus:bg-white focus:text-[#1E62EC] transition-all cursor-pointer"
                />
              </div>
            </div>
          </div>

          
        </div>

        {/* 1. 组庭情况 CARD (Ring/Donut Chart with bottom statistics) */}
        <div id="arbitration_court_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-lg font-extrabold text-slate-800">新收案件情况</h4>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* Stacked Ring Chart Layout */}
          <div className="flex flex-col items-center space-y-5">
            
            {/* Custom SVG Donut/Ring Display */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90 overflow-visible">
                {/* Background Ring Track */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="none"
                  stroke="#F8FAFC"
                  strokeWidth={strokeWidth}
                />
                {/* Segment 1: 独任 */}
                {courtCases.sole > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colorBlue}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${soleLen} ${circumference - soleLen}`}
                    strokeDashoffset={soleOffset}
                    strokeLinecap={solePct < 100 ? "round" : "butt"}
                    className="transition-all duration-300"
                  />
                )}
                {/* Segment 2: 首席 */}
                {courtCases.chief > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke="#9CCAFF"
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${chiefLen} ${circumference - chiefLen}`}
                    strokeDashoffset={chiefOffset}
                    strokeLinecap={chiefPct < 100 ? "round" : "butt"}
                    className="transition-all duration-300"
                  />
                )}
                {/* Segment 3: 边裁 */}
                {courtCases.side > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="none"
                    stroke={colorGreen}
                    strokeWidth={strokeWidth}
                    strokeDasharray={`${sideLen} ${circumference - sideLen}`}
                    strokeDashoffset={sideOffset}
                    strokeLinecap={sidePct < 100 ? "round" : "butt"}
                    className="transition-all duration-300"
                  />
                )}
              </svg>
              {/* Inner absolute label block inside the donut/ring hole */}
              <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none">
                <span className="text-lg font-black text-slate-800 leading-none">{totalCourtCases}</span>
                <span className="text-sm text-slate-400 font-extrabold tracking-wider mt-1">总案件数</span>
              </div>
            </div>

            {/* Legend Details below the ring */}
            <div className="grid grid-cols-3 gap-2 w-full pt-3.5 border-t border-dashed border-slate-100">
              {/* Row 1: 独任 */}
              <div id="stat_sole" onClick={() => onNavigateToTab(1)} className="flex flex-col items-center p-2 rounded-xl bg-slate-50/40 hover:bg-slate-50/80 transition-all text-center border border-transparent hover:border-slate-100 cursor-pointer">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colorBlue }}></span>
                  <span className="text-sm  text-slate-500">独任</span>
                </div>
                <span className="text-base font-black text-slate-800">{courtCases.sole}件</span>
                <span className="text-sm text-slate-400  mt-0.5">({solePct.toFixed(1)}%)</span>
              </div>

              {/* Row 2: 首席 */}
              <div id="stat_chief" onClick={() => onNavigateToTab(1)} className="flex flex-col items-center p-2 rounded-xl bg-slate-50/40 hover:bg-slate-50/80 transition-all text-center border border-transparent hover:border-slate-100 cursor-pointer">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#9CCAFF' }}></span>
                  <span className="text-sm  text-slate-500">首席</span>
                </div>
                <span className="text-base font-black text-slate-800">{courtCases.chief}件</span>
                <span className="text-sm text-slate-400  mt-0.5">({chiefPct.toFixed(1)}%)</span>
              </div>

              {/* Row 3: 边裁 */}
              <div id="stat_side" onClick={() => onNavigateToTab(1)} className="flex flex-col items-center p-2 rounded-xl bg-slate-50/40 hover:bg-slate-50/80 transition-all text-center border border-transparent hover:border-slate-100 cursor-pointer">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colorGreen }}></span>
                  <span className="text-sm  text-slate-500">边裁</span>
                </div>
                <span className="text-base font-black text-slate-800">{courtCases.side}件</span>
                <span className="text-sm text-slate-400  mt-0.5">({sidePct.toFixed(1)}%)</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2.5 在办案件情况 CARD */}
        <div id="pending_cases_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-lg font-extrabold text-slate-800">在办案件情况</h4>
          </div>

          <div className="border-t border-dashed border-slate-200/80"></div>

          <div className="grid grid-cols-2 gap-2">
            {/* 在办数 */}
            <div
              onClick={() => onNavigateToTab(1)}
              className="flex flex-col gap-1 py-2.5 px-3 rounded-lg bg-slate-50/60 hover:bg-blue-50/50  transition-all cursor-pointer"
            >
              <span className="text-sm text-slate-500">在办数</span>
              <span className="text-lg font-black text-[#1E62EC] leading-none font-mono tabular-nums">{pendingCount}件</span>
            </div>

            {/* 已延期数 */}
            <div
              onClick={() => onNavigateToTab(1)}
              className={`flex flex-col gap-1 py-2.5 px-3 rounded-lg  transition-all cursor-pointer ${delayedCount > 0 ? 'bg-rose-50/60 hover:bg-rose-50 ' : 'bg-slate-50/60 hover:bg-slate-50'}`}
            >
              <span className="text-sm text-slate-500">已延期数</span>
              <span className={`text-lg font-black leading-none font-mono tabular-nums ${delayedCount > 0 ? 'text-rose-500' : 'text-slate-700'}`}>{delayedCount}件</span>
            </div>
          </div>
        </div>

        {/* 3. 办结案件情况 CARD — Data Ledger typeset */}
        <div id="metrics_summary_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 space-y-3">
          {/* 标题 + 同比提示 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
              <h4 className="text-lg font-extrabold text-slate-800">办结案件情况</h4>
            </div>
            <div className="flex items-center gap-1 text-xs  text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
              同比
            </div>
          </div>

          <div className="border-t border-dashed border-slate-200/80"></div>

          {/* 办结数 — 父级总数 (dominant typographic weight) */}
          <div
            onClick={() => onNavigateToTab(1)}
            className="flex items-end justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#1E62EC] flex items-center justify-center text-white flex-shrink-0">
                <CheckCircle2 size={16} />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-400 leading-none mb-1">办结数</div>
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-black text-slate-900 font-mono tabular-nums leading-none tracking-tight">
                    {closedCount.value}
                  </span>
                  <span className="text-sm  text-slate-400">件</span>
                </div>
              </div>
            </div>
            <span className={`text-sm font-black font-mono tabular-nums flex items-center gap-0.5 ${closedCount.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
              {closedCount.isUp ? '▲' : '▼'} {closedCount.change}
            </span>
          </div>

          {/* 树形连接器：父→子 */}
          <div className="flex items-center gap-2 pl-4 -mt-1">
            <div className="w-px h-3 bg-slate-200"></div>
            <div className="flex-1 h-px bg-slate-100"></div>
            <span className="text-xs  text-slate-300 tracking-wide">分析结果</span>
            <div className="flex-1 h-px bg-slate-100"></div>
          </div>

          {/* 子项：三率 (inset, lighter weight) */}
          <div className="grid grid-cols-3 gap-2 pl-4">
            {/* 裁决率 */}
            <div
              onClick={() => onNavigateToTab(1)}
              className="flex flex-col gap-1 py-2 px-2.5 rounded-lg bg-slate-50/60 hover:bg-blue-50/50 border border-transparent hover:border-[#1E62EC]/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <Award size={11} className="text-[#1E62EC]" />
                <span className="text-sm  text-slate-500">裁决率</span>
              </div>
              <span className="text-base font-black font-mono tabular-nums text-[#1E62EC] leading-none">
                {indicators.settle.value}
              </span>
              <span className={`text-sm font-black font-mono tabular-nums ${indicators.settle.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
                {indicators.settle.isUp ? '▲' : '▼'} {indicators.settle.change}
              </span>
            </div>

            {/* 调解率 */}
            <div
              onClick={() => onNavigateToTab(1)}
              className="flex flex-col gap-1 py-2 px-2.5 rounded-lg bg-slate-50/60 hover:bg-amber-50/50 border border-transparent hover:border-amber-400/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <FileText size={11} className="text-amber-500" />
                <span className="text-sm  text-slate-500">调解率</span>
              </div>
              <span className="text-base font-black font-mono tabular-nums text-[#1E62EC] leading-none">
                {indicators.cancel.value}
              </span>
              <span className={`text-sm font-black font-mono tabular-nums ${indicators.cancel.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
                {indicators.cancel.isUp ? '▲' : '▼'} {indicators.cancel.change}
              </span>
            </div>

            {/* 撤案率 */}
            <div
              onClick={() => onNavigateToTab(1)}
              className="flex flex-col gap-1 py-2 px-2.5 rounded-lg bg-slate-50/60 hover:bg-rose-50/50 border border-transparent hover:border-rose-400/20 transition-all cursor-pointer"
            >
              <div className="flex items-center gap-1">
                <XCircle size={11} className="text-rose-500" />
                <span className="text-sm  text-slate-500">撤案率</span>
              </div>
              <span className="text-base font-black font-mono tabular-nums text-[#1E62EC] leading-none">
                {indicators.delay.value}
              </span>
              <span className={`text-sm font-black font-mono tabular-nums ${indicators.delay.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
                {indicators.delay.isUp ? '▲' : '▼'} {indicators.delay.change}
              </span>
            </div>
          </div>
        </div>

        {/* 2. 办理案件的Top5案由 CARD */}
        <div id="top_disputes_card" className="bg-white rounded-2xl p-4.5 border border-slate-100  space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-lg font-extrabold text-slate-800">办理案件的Top5案由</h4>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* Progress list matching prototype */}
          <div className="space-y-4.5">
            {topCases.map((item, idx) => {
              // Custom colors matching prototype layout for up to 5 items
              const barColorClass = idx === 0 
                ? 'bg-[#1E62EC]' 
                : idx === 1 
                ? 'bg-amber-500' 
                : idx === 2 
                ? 'bg-[#74C080]' 
                : idx === 3 
                ? 'bg-indigo-500' 
                : 'bg-rose-400';
              return (
                <div key={item.name} onClick={() => onNavigateToTab(1)} className="space-y-1 cursor-pointer">
                  <div className="flex justify-between items-baseline">
                    <span className="text-base  text-slate-700 hover:text-[#1E62EC] transition-colors">{item.name}</span>
                    <span className="text-sm text-slate-400">
                      {item.count}件案件 占比{item.ratio}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${barColorClass}`}
                      style={{ width: `${item.ratio}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>


      </div>

    </div>
  );
}
