import React, { useState } from 'react';
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

export default function CaseStats({ cases, onNavigateToTab, onFilterStatus }: CaseStatsProps) {
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedQuarter, setSelectedQuarter] = useState<string>('all');
  const [hoveredQuarterIndex, setHoveredQuarterIndex] = useState<number | null>(null);

  // Retrieve filtered data safely
  const yearConfig = DATA_MATRIX[selectedYear] || DATA_MATRIX['2026'];
  const activeData = yearConfig[selectedQuarter] || yearConfig['all'];

  const { courtCases, topCases, indicators, quarterChart } = activeData;
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
      <div className="flex-1 space-y-4 overflow-y-auto no-scrollbar w-full text-left">
        
        {/* TOP INTERACTIVE FILTER CARD */}
        <div id="stats_filter_card" className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5 select-none animate-fade-in">
          

          <div className="flex items-center gap-2">
            <div className="h-4 w-1 bg-[#1E62EC] rounded-full"></div>
            <h4 className="text-sm font-extrabold text-slate-800">筛选配置</h4>
          </div>

          <div className="border-t border-dashed border-slate-200/80 my-2"></div>

          {/* Year Filter Group */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">选择年度</span>
            <div className="grid grid-cols-3 gap-2">
              {['2026', '2025', '2024'].map((year) => {
                const isActive = selectedYear === year;
                return (
                  <button
                    key={year}
                    onClick={() => setSelectedYear(year)}
                    className={`py-2 px-3 text-xs font-black rounded-xl transition-all border outline-none cursor-pointer ${
                      isActive 
                        ? 'bg-[#1E62EC] text-white border-[#1E62EC] shadow-sm shadow-[#1E62EC]/10' 
                        : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {year}年
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quarter Filter Group */}
          <div className="space-y-1.5">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide block">选择季度</span>
            <div className="grid grid-cols-5 gap-1.5">
              {[
                { label: '全年', value: 'all' },
                { label: '一季度', value: 'Q1' },
                { label: '二季度', value: 'Q2' },
                { label: '三季度', value: 'Q3' },
                { label: '四季度', value: 'Q4' }
              ].map((q) => {
                const isActive = selectedQuarter === q.value;
                return (
                  <button
                    key={q.value}
                    onClick={() => setSelectedQuarter(q.value)}
                    className={`py-1.5 px-1 text-[11px] font-bold rounded-lg text-center transition-all border outline-none cursor-pointer truncate ${
                      isActive 
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm shadow-amber-500/10' 
                        : 'bg-slate-50/80 text-slate-600 border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    {q.label}
                  </button>
                );
              })}
            </div>
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
                
                // Opacity modifier based on selection
                const isSelectedQ = selectedQuarter === 'all' || selectedQuarter === `Q${idx + 1}`;
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
                      onClick={() => setSelectedQuarter(`Q${idx + 1}`)}
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
                      fill={selectedQuarter === `Q${idx + 1}` ? '#1E62EC' : '#64748B'}
                      fontSize="9"
                      textAnchor="middle"
                      className={`font-black tracking-wide ${selectedQuarter === `Q${idx + 1}` ? 'font-extrabold underline decoration-2 underline-offset-4' : ''}`}
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
              ) : selectedQuarter !== 'all' ? (
                <button 
                  onClick={() => setSelectedQuarter('all')}
                  className="text-xs text-[#1E62EC] bg-blue-50/50 py-1 px-3 rounded-full border border-blue-100 font-extrabold hover:bg-blue-100/40 transition-colors uppercase cursor-pointer"
                >
                  清除单度筛选 ↺ 查看全局对比
                </button>
              ) : (
                <span className="text-slate-400 italic">轻触或悬浮季度柱状图进行联动对齐分析</span>
              )}
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
