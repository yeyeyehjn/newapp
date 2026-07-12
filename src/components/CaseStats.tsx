import React, { useState, useMemo, useEffect } from 'react';
import { 
  TrendingUp, CheckCircle2, ChevronRight, Award, FileText, Clock, HelpCircle
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

// ===== Aggregation helpers (year range / multi-quarter 统计合并) =====
const ALL_QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const CHART_QUARTER_NAMES = ['第一季度', '第二季度', '第三季度', '第四季度'];

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
  const builtInYears = useMemo(() => Object.keys(DATA_MATRIX).sort(), []); // 升序: ['2024','2025','2026']
  // 自定义年份（用户可手动添加数据矩阵之外的年份）
  const [customYears, setCustomYears] = useState<string[]>([]);
  const availableYears = useMemo(
    () => Array.from(new Set([...builtInYears, ...customYears])).sort(),
    [builtInYears, customYears]
  );
  const displayYears = useMemo(() => [...availableYears].reverse(), [availableYears]);

  // 自定义年份输入态
  const [customYearInput, setCustomYearInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState<null | 'yearStart' | 'yearEnd' | 'quarterYear'>(null);

  const addCustomYear = (raw: string): string | null => {
    const y = raw.trim();
    if (!/^\d{4}$/.test(y)) return null; // 必须为 4 位数字
    if (!availableYears.includes(y)) {
      setCustomYears((prev) => Array.from(new Set([...prev, y])).sort());
    }
    return y;
  };

  // 双维度筛选模型
  type FilterMode = 'year' | 'quarter';
  const [filterMode, setFilterMode] = useState<FilterMode>('year');
  // 年度范围
  const [yearStart, setYearStart] = useState<string>(builtInYears[0]);
  const [yearEnd, setYearEnd] = useState<string>(builtInYears[builtInYears.length - 1]);
  // 季度筛选
  const [quarterYear, setQuarterYear] = useState<string>(builtInYears[builtInYears.length - 1]);
  const [selectedQuarters, setSelectedQuarters] = useState<string[]>([...ALL_QUARTERS]);

  const [hoveredQuarterIndex, setHoveredQuarterIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 筛选条件变更 -> 短暂加载态（实时刷新反馈）
  useEffect(() => {
    setIsLoading(true);
    const t = setTimeout(() => setIsLoading(false), 320);
    return () => clearTimeout(t);
  }, [filterMode, yearStart, yearEnd, quarterYear, selectedQuarters]);

  // 切换季度（多选，至少保留 1 个）
  const toggleQuarter = (q: string) => {
    setSelectedQuarters((prev) => {
      if (prev.includes(q)) {
        const next = prev.filter((x) => x !== q);
        return next.length ? next : prev; // 不允许清空至 0
      }
      return [...prev, q].sort((a, b) => Number(a.slice(1)) - Number(b.slice(1)));
    });
  };

  // 清除筛选 -> 回到全量视角
  const handleClear = () => {
    setFilterMode('year');
    setYearStart(availableYears[0]);
    setYearEnd(availableYears[availableYears.length - 1]);
    setQuarterYear(availableYears[availableYears.length - 1]);
    setSelectedQuarters([...ALL_QUARTERS]);
  };

  // 依据模式计算参与汇总的数据切片
  const slicedDatas = useMemo(() => {
    if (filterMode === 'year') {
      return availableYears
        .filter((y) => y >= yearStart && y <= yearEnd)
        .map((y) => DATA_MATRIX[y]?.all)
        .filter(Boolean) as QuarterData[];
    }
    return selectedQuarters
      .map((q) => DATA_MATRIX[quarterYear]?.[q])
      .filter(Boolean) as QuarterData[];
  }, [filterMode, yearStart, yearEnd, quarterYear, selectedQuarters, availableYears]);

  const courtCases = useMemo(() => aggregateCourtCases(slicedDatas), [slicedDatas]);
  const topCases = useMemo(() => aggregateTopCases(slicedDatas), [slicedDatas]);
  const indicators = useMemo(() => aggregateIndicators(slicedDatas), [slicedDatas]);

  // 季度图表数据：年度范围 -> 跨年同季度平均；季度模式 -> 选中年的全年四个季度（用 activeQuarters 控制高亮）
  const quarterChart = useMemo(() => {
    if (filterMode === 'year') {
      return aggregateQuarterChart(slicedDatas);
    }
    return DATA_MATRIX[quarterYear]?.all.quarterChart ?? DATA_MATRIX['2026'].all.quarterChart;
  }, [filterMode, slicedDatas, quarterYear]);

  // 图表高亮用的"激活季度"集合
  const activeQuarters = filterMode === 'year' ? ALL_QUARTERS : selectedQuarters;

  // 点击柱状图某季度：年度模式 -> 跳转季度模式并细筛该季度；季度模式 -> 切换该季度
  const handleBarClick = (qKey: string) => {
    if (filterMode === 'year') {
      setFilterMode('quarter');
      setQuarterYear(yearEnd);
      setSelectedQuarters([qKey]);
    } else {
      toggleQuarter(qKey);
    }
  };

  // 筛选范围摘要文案
  const scopeSummary = useMemo(() => {
    if (filterMode === 'year') {
      const span = availableYears.filter((y) => y >= yearStart && y <= yearEnd).length;
      return `${yearStart}年 — ${yearEnd}年 · 共 ${span} 个年度`;
    }
    return `${quarterYear}年 · 已选 ${selectedQuarters.length}/4 季度`;
  }, [filterMode, yearStart, yearEnd, quarterYear, selectedQuarters, availableYears]);
  const totalCourtCases = courtCases.sole + courtCases.chief + courtCases.side;
  const safeTotal = totalCourtCases || 1;
  const solePct = (courtCases.sole / safeTotal) * 100;
  const chiefPct = (courtCases.chief / safeTotal) * 100;
  const sidePct = (courtCases.side / safeTotal) * 100;

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
        <div id="stats_filter_card" className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5 select-none animate-fade-in">
          

          {/* Header + 清除筛选 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
              <h4 className="text-sm font-extrabold text-slate-800">筛选配置</h4>
              {isLoading && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-[#1E62EC] animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1E62EC] animate-ping"></span>
                  统计中
                </span>
              )}
            </div>
            <button
              onClick={handleClear}
              className="text-[10px] font-extrabold text-slate-400 hover:text-[#1E62EC] bg-slate-50/80 hover:bg-blue-50/60 border border-slate-100 hover:border-blue-100 rounded-lg py-1 px-2.5 transition-colors cursor-pointer uppercase tracking-wide"
            >
              清除筛选 ↺
            </button>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* 维度切换 Tab：年度筛选 / 季度筛选 */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100/70 rounded-xl">
            {([['year', '年度筛选'], ['quarter', '季度筛选']] as const).map(([mode, label]) => {
              const isActive = filterMode === mode;
              return (
                <button
                  key={mode}
                  onClick={() => setFilterMode(mode)}
                  className={`py-1.5 text-xs font-black rounded-lg transition-all border outline-none cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#1E62EC] border-white shadow-sm'
                      : 'bg-transparent text-slate-500 border-transparent hover:text-slate-700'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* ===== 年度筛选：起始年份 ~ 结束年份（含端点的闭区间） ===== */}
          {filterMode === 'year' && (
            <>
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">起始年度</span>
                <div className="grid grid-cols-3 gap-2">
                  {displayYears.map((year) => {
                    const isDisabled = year > yearEnd; // 起始不得晚于结束
                    const isActive = yearStart === year;
                    const isCustom = customYears.includes(year);
                    return (
                      <button
                        key={year}
                        disabled={isDisabled}
                        onClick={() => setYearStart(year)}
                        className={`py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none ${
                          isActive
                            ? 'bg-[#1E62EC] text-white border-[#1E62EC] shadow-sm shadow-[#1E62EC]/10 cursor-pointer'
                            : isDisabled
                            ? 'bg-slate-50/40 text-slate-300 border-slate-100 cursor-not-allowed'
                            : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-800 cursor-pointer'
                        }`}
                      >
                        {year}年{isCustom && <span className="ml-0.5 text-[8px] opacity-60">★</span>}
                      </button>
                    );
                  })}
                  {/* 自定义年份输入 */}
                  {showCustomInput === 'yearStart' ? (
                    <input
                      autoFocus
                      value={customYearInput}
                      onChange={(e) => setCustomYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const y = addCustomYear(customYearInput);
                          if (y) { setYearStart(y); setCustomYearInput(''); setShowCustomInput(null); }
                        } else if (e.key === 'Escape') {
                          setCustomYearInput(''); setShowCustomInput(null);
                        }
                      }}
                      onBlur={() => {
                        const y = addCustomYear(customYearInput);
                        if (y) setYearStart(y);
                        setCustomYearInput(''); setShowCustomInput(null);
                      }}
                      placeholder="如 2023"
                      className="py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none bg-white text-[#1E62EC] border-[#1E62EC] text-center w-full"
                    />
                  ) : (
                    <button
                      onClick={() => { setShowCustomInput('yearStart'); setCustomYearInput(''); }}
                      className="py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none cursor-pointer bg-slate-50/80 text-slate-400 border-dashed border-slate-200 hover:text-[#1E62EC] hover:border-[#1E62EC]"
                    >
                      + 自定义
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">结束年度</span>
                <div className="grid grid-cols-3 gap-2">
                  {displayYears.map((year) => {
                    const isDisabled = year < yearStart; // 结束不得早于起始
                    const isActive = yearEnd === year;
                    const isCustom = customYears.includes(year);
                    return (
                      <button
                        key={year}
                        disabled={isDisabled}
                        onClick={() => setYearEnd(year)}
                        className={`py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none ${
                          isActive
                            ? 'bg-[#1E62EC] text-white border-[#1E62EC] shadow-sm shadow-[#1E62EC]/10 cursor-pointer'
                            : isDisabled
                            ? 'bg-slate-50/40 text-slate-300 border-slate-100 cursor-not-allowed'
                            : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-800 cursor-pointer'
                        }`}
                      >
                        {year}年{isCustom && <span className="ml-0.5 text-[8px] opacity-60">★</span>}
                      </button>
                    );
                  })}
                  {/* 自定义年份输入 */}
                  {showCustomInput === 'yearEnd' ? (
                    <input
                      autoFocus
                      value={customYearInput}
                      onChange={(e) => setCustomYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const y = addCustomYear(customYearInput);
                          if (y) { setYearEnd(y); setCustomYearInput(''); setShowCustomInput(null); }
                        } else if (e.key === 'Escape') {
                          setCustomYearInput(''); setShowCustomInput(null);
                        }
                      }}
                      onBlur={() => {
                        const y = addCustomYear(customYearInput);
                        if (y) setYearEnd(y);
                        setCustomYearInput(''); setShowCustomInput(null);
                      }}
                      placeholder="如 2027"
                      className="py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none bg-white text-[#1E62EC] border-[#1E62EC] text-center w-full"
                    />
                  ) : (
                    <button
                      onClick={() => { setShowCustomInput('yearEnd'); setCustomYearInput(''); }}
                      className="py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none cursor-pointer bg-slate-50/80 text-slate-400 border-dashed border-slate-200 hover:text-[#1E62EC] hover:border-[#1E62EC]"
                    >
                      + 自定义
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ===== 季度筛选：先选年份，再多选季度 ===== */}
          {filterMode === 'quarter' && (
            <>
              <div className="space-y-1.5">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">选择年度</span>
                <div className="grid grid-cols-3 gap-2">
                  {displayYears.map((year) => {
                    const isActive = quarterYear === year;
                    const isCustom = customYears.includes(year);
                    return (
                      <button
                        key={year}
                        onClick={() => setQuarterYear(year)}
                        className={`py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none cursor-pointer ${
                          isActive
                            ? 'bg-[#1E62EC] text-white border-[#1E62EC] shadow-sm shadow-[#1E62EC]/10'
                            : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-800'
                        }`}
                      >
                        {year}年{isCustom && <span className="ml-0.5 text-[8px] opacity-60">★</span>}
                      </button>
                    );
                  })}
                  {/* 自定义年份输入 */}
                  {showCustomInput === 'quarterYear' ? (
                    <input
                      autoFocus
                      value={customYearInput}
                      onChange={(e) => setCustomYearInput(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const y = addCustomYear(customYearInput);
                          if (y) { setQuarterYear(y); setCustomYearInput(''); setShowCustomInput(null); }
                        } else if (e.key === 'Escape') {
                          setCustomYearInput(''); setShowCustomInput(null);
                        }
                      }}
                      onBlur={() => {
                        const y = addCustomYear(customYearInput);
                        if (y) setQuarterYear(y);
                        setCustomYearInput(''); setShowCustomInput(null);
                      }}
                      placeholder="如 2023"
                      className="py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none bg-white text-[#1E62EC] border-[#1E62EC] text-center w-full"
                    />
                  ) : (
                    <button
                      onClick={() => { setShowCustomInput('quarterYear'); setCustomYearInput(''); }}
                      className="py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none cursor-pointer bg-slate-50/80 text-slate-400 border-dashed border-slate-200 hover:text-[#1E62EC] hover:border-[#1E62EC]"
                    >
                      + 自定义
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">选择季度（可多选）</span>
                  <button
                    onClick={() =>
                      setSelectedQuarters(selectedQuarters.length === 4 ? ['Q1'] : [...ALL_QUARTERS])
                    }
                    className="text-[10px] font-extrabold text-[#1E62EC] hover:underline cursor-pointer"
                  >
                    {selectedQuarters.length === 4 ? '取消全选' : '全选'}
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {ALL_QUARTERS.map((q) => {
                    const isActive = selectedQuarters.includes(q);
                    const labels: Record<string, string> = { Q1: '一季度', Q2: '二季度', Q3: '三季度', Q4: '四季度' };
                    return (
                      <button
                        key={q}
                        onClick={() => toggleQuarter(q)}
                        className={`py-1.5 px-1 text-[11px] font-bold rounded-lg text-center transition-all border outline-none cursor-pointer truncate ${
                          isActive
                            ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/10'
                            : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50'
                        }`}
                      >
                        {labels[q]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* 当前筛选范围 / 结果反馈 */}
          <div className="flex items-center justify-between text-[10px] font-bold rounded-xl bg-slate-50/70 border border-slate-100 px-3 py-2">
            <span className="text-slate-500">{scopeSummary}</span>
            <span className="text-[#1E62EC]">命中 {totalCourtCases} 件</span>
          </div>
        </div>

        {/* 1. 组庭情况 CARD (Ring/Donut Chart with bottom statistics) */}
        <div id="arbitration_court_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-sm font-extrabold text-slate-800">组庭情况</h4>
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
                <span className="text-xl font-black text-slate-800 leading-none">{totalCourtCases}</span>
                <span className="text-[10px] text-slate-400 font-extrabold tracking-wider mt-1">总案件数</span>
              </div>
            </div>

            {/* Legend Details below the ring */}
            <div className="grid grid-cols-3 gap-2 w-full pt-3.5 border-t border-dashed border-slate-100">
              {/* Row 1: 独任 */}
              <div id="stat_sole" className="flex flex-col items-center p-2 rounded-xl bg-slate-50/40 hover:bg-slate-50/80 transition-all text-center border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colorBlue }}></span>
                  <span className="text-[11px] font-bold text-slate-500">独任</span>
                </div>
                <span className="text-xs font-black text-slate-800">{courtCases.sole}件</span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">({solePct.toFixed(1)}%)</span>
              </div>

              {/* Row 2: 首席 */}
              <div id="stat_chief" className="flex flex-col items-center p-2 rounded-xl bg-slate-50/40 hover:bg-slate-50/80 transition-all text-center border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#9CCAFF' }}></span>
                  <span className="text-[11px] font-bold text-slate-500">首席</span>
                </div>
                <span className="text-xs font-black text-slate-800">{courtCases.chief}件</span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">({chiefPct.toFixed(1)}%)</span>
              </div>

              {/* Row 3: 边裁 */}
              <div id="stat_side" className="flex flex-col items-center p-2 rounded-xl bg-slate-50/40 hover:bg-slate-50/80 transition-all text-center border border-transparent hover:border-slate-100">
                <div className="flex items-center gap-1 mb-1">
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: colorGreen }}></span>
                  <span className="text-[11px] font-bold text-slate-500">边裁</span>
                </div>
                <span className="text-xs font-black text-slate-800">{courtCases.side}件</span>
                <span className="text-[9px] text-slate-400 font-bold mt-0.5">({sidePct.toFixed(1)}%)</span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. 办理案件的Top5案由 CARD */}
        <div id="top_disputes_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-sm font-extrabold text-slate-800">办理案件的Top5案由</h4>
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
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-extrabold text-slate-700">{item.name}</span>
                    <span className="text-2xs text-slate-400 font-bold">
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

        {/* 3. 办结案件情况如下 CARD */}
        <div id="metrics_summary_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-sm font-extrabold text-slate-800">办理案件情况</h4>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* List layout matching precisely */}
          <div className="space-y-4 pt-1">
            {/* Row 1: Settle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E62EC]">
                  <Award size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-700 flex items-baseline gap-1">
                    <span>结案率</span>
                    <span className="text-sm font-extrabold text-[#1E62EC]">{indicators.settle.value}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className={`text-xs font-black flex items-center gap-0.5 ${indicators.settle.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
                  {indicators.settle.isUp ? '▲' : '▼'} {indicators.settle.change}
                </span>
                
              </div>
            </div>

            {/* Row 2: Cancel */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E62EC]">
                  <FileText size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-700 flex items-baseline gap-1">
                    <span>调撤率</span>
                    <span className="text-sm font-extrabold text-[#1E62EC]">{indicators.cancel.value}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className={`text-xs font-black flex items-center gap-0.5 ${indicators.cancel.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
                  {indicators.cancel.isUp ? '▲' : '▼'} {indicators.cancel.change}
                </span>
                
              </div>
            </div>

            {/* Row 3: Delay */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center text-[#1E62EC]">
                  <Clock size={18} />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-700 flex items-baseline gap-1">
                    <span>延期率</span>
                    <span className="text-sm font-extrabold text-[#1E62EC]">{indicators.delay.value}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-right">
                <span className={`text-xs font-black flex items-center gap-0.5 ${indicators.delay.isUp ? 'text-[#74C080]' : 'text-rose-500'}`}>
                  {indicators.delay.isUp ? '▲' : '▼'} {indicators.delay.change}
                </span>
                
              </div>
            </div>
          </div>
        </div>

        {/* 4. 结案情况 (Column Chart with Quarters) CARD */}
        <div id="chart_quarters_card" className="bg-white rounded-2xl p-4.5 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-sm font-extrabold text-slate-800">裁调撤情况</h4>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* Interactive Custom SVG Column Chart styled with rounded caps */}
          <div className="relative pt-2">
            {/* Custom dotted legend */}
            <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-500 select-none mb-3">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorBlue }}></span> 裁决率
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorOrange }}></span> 调解率
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colorGreen }}></span> 撤案率
              </span>
            </div>
            <svg viewBox="0 0 300 160" className="w-full h-auto overflow-visible select-none">
              {/* Dashed Horizontal Grid Lines */}
              {[20, 50, 80, 110, 140].map((y, idx) => (
                <line 
                  key={idx} 
                  x1="30" 
                  y1={y} 
                  x2="290" 
                  y2={y} 
                  stroke="#F1F5F9" 
                  strokeWidth="1.2" 
                  strokeDasharray="4,4" 
                />
              ))}
              
              {/* Solid Base Axis */}
              <line x1="30" y1="140" x2="290" y2="140" stroke="#E2E8F0" strokeWidth="1.5" />

              {/* Y Axis percentage markers */}
              {['100%', '80%', '60%', '40%', '20%', '0%'].map((txt, idx) => (
                <text
                  key={idx}
                  x="22"
                  y={20 + idx * 24}
                  fill="#94A3B8"
                  fontSize="8.5"
                  textAnchor="end"
                  className="font-extrabold"
                >
                  {txt}
                </text>
              ))}

              {/* Draw Vertical Columns dynamically */}
              {quarterChart.map((q, idx) => {
                const xBase = 52 + idx * 62;
                const qKey = `Q${idx + 1}`;
                
                // Opacity modifier based on selection
                const isSelectedQ = activeQuarters.includes(qKey);
                const opacity = isSelectedQ ? 1.0 : 0.15;

                // Percentages to pixels calculation:
                // height is max 120 pixels (from y=20 to y=140)
                const hSettle = (q.settle / 100) * 120;
                const hCancel = (q.cancel / 100) * 120;
                const hDelay = (q.delay / 100) * 120;

                return (
                  <g key={q.name} style={{ transition: 'opacity 0.4s' }}>
                    {/* Background trigger container for interactivity */}
                    <rect 
                      x={xBase - 15}
                      y="15"
                      width="50"
                      height="125"
                      fill="transparent"
                      className="cursor-pointer font-bold"
                      onMouseEnter={() => setHoveredQuarterIndex(idx)}
                      onMouseLeave={() => setHoveredQuarterIndex(null)}
                      onClick={() => handleBarClick(qKey)}
                    />

                    {/* Blue bar: c决率 */}
                    {q.settle > 0 && (
                      <rect
                        x={xBase - 10}
                        y={140 - hSettle}
                        width="6"
                        height={hSettle}
                        fill={colorBlue}
                        rx="2"
                        ry="2"
                        opacity={opacity}
                      />
                    )}

                    {/* Orange bar: 调解率 */}
                    {q.cancel > 0 && (
                      <rect
                        x={xBase - 2}
                        y={140 - hCancel}
                        width="6"
                        height={hCancel}
                        fill={colorOrange}
                        rx="2"
                        ry="2"
                        opacity={opacity}
                      />
                    )}

                    {/* Green bar: 撤案率 */}
                    {q.delay > 0 && (
                      <rect
                        x={xBase + 6}
                        y={140 - hDelay}
                        width="6"
                        height={hDelay}
                        fill={colorGreen}
                        rx="2"
                        ry="2"
                        opacity={opacity}
                      />
                    )}

                    {/* Text Label at standard base */}
                    <text
                      x={xBase + 1}
                      y="153"
                      fill={isSelectedQ ? '#1E62EC' : '#64748B'}
                      fontSize="9"
                      textAnchor="middle"
                      className={`font-black tracking-wide ${isSelectedQ ? 'font-extrabold underline decoration-2 underline-offset-4' : ''}`}
                    >
                      {q.name}
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip display box */}
            <div className="h-10 flex justify-center items-center mt-2.5 select-none text-2xs z-30">
              {hoveredQuarterIndex !== null ? (
                <div className="bg-slate-900 text-white rounded-xl py-1.5 px-3 flex items-center space-x-3.5 shadow-md border border-slate-800 animate-fade-in font-bold text-center">
                  <span className="text-[#9CCAFF]">
                    {quarterChart[hoveredQuarterIndex].name}
                  </span>
                  <span>裁决: <strong className="text-white font-heavy">{quarterChart[hoveredQuarterIndex].settle}%</strong></span>
                  <span>调解: <strong className="text-white font-heavy">{quarterChart[hoveredQuarterIndex].cancel}%</strong></span>
                  <span>撤案: <strong className="text-white font-heavy">{quarterChart[hoveredQuarterIndex].delay}%</strong></span>
                </div>
              ) : filterMode === 'quarter' && selectedQuarters.length < 4 ? (
                <button 
                  onClick={() => setSelectedQuarters([...ALL_QUARTERS])}
                  className="text-xs text-[#1E62EC] bg-blue-50/50 py-1 px-3 rounded-full border border-blue-100 font-extrabold hover:bg-blue-100/40 transition-colors uppercase cursor-pointer"
                >
                  清除季度筛选 ↺ 查看全年对比
                </button>
              ) : (
                <span className="text-slate-400 italic">
                  {filterMode === 'year' ? '年度范围统计中 · 点击柱状图可进入季度细筛' : '轻触或悬浮季度柱状图进行联动对齐分析'}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
