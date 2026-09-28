import React, { useState, useMemo } from 'react';
import { Search, ArrowLeft, FileText, AlertCircle, Building2, MapPin, Clock, Calendar, CalendarDays, List, ChevronLeft, ChevronRight, SlidersHorizontal, Users } from 'lucide-react';
import BottomSheet from './BottomSheet';

export interface PendingHearingItem {
  id: string;
  caseNo: string;
  claimant: string;
  respondent: string;
  hearingTime: string;
  hearingLocation: string;
  secretary: string;
  hearingPurpose: string;
  disputeAmount: number;
  status: 'pending' | 'held';
}

interface PendingHearingListProps {
  onBack: () => void;
  onSelectItem: (item: PendingHearingItem) => void;
  /** 从首页“查看更多”进入时预置的开庭日期筛选区间 */
  initialDateRange?: [string, string];
}

interface HearingCardProps {
  hearing: PendingHearingItem;
  onSelect: (item: PendingHearingItem) => void;
}

// 日历模式轻量卡片：仅案号、开庭时间、开庭地点、开庭用途
const CompactHearingCard: React.FC<HearingCardProps> = ({ hearing, onSelect }) => {
  const time = hearing.hearingTime.split(' ')[1] || hearing.hearingTime;
  return (
    <div
      onClick={() => onSelect(hearing)}
      className="bg-white rounded-lg border border-slate-100 px-3.5 py-3 hover:border-indigo-200 cursor-pointer transition-all group"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
          {hearing.caseNo}
        </span>
        <span className="flex-shrink-0 flex items-center gap-1 text-sm font-bold text-indigo-600">
          <Clock size={12} className="text-amber-500" />
          {time}
        </span>
      </div>
      <div className="flex items-center gap-3 mt-1.5 text-base text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={11} className="text-rose-400" />
          {hearing.hearingLocation}
        </span>
        <span className="flex items-center gap-1">
          <Calendar size={11} className="text-indigo-400" />
          {hearing.hearingPurpose}
        </span>
      </div>
    </div>
  );
};

const HearingCard: React.FC<HearingCardProps> = ({ hearing, onSelect }) => {
  const h = hearing;
  return (
    <div
      onClick={() => onSelect(h)}
      className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
    >
      <div className="flex items-center justify-between">
        <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-1.5">
          <Calendar size={14} className="text-indigo-400" />
          {h.caseNo}
        </span>
      </div>

      <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-base text-slate-500">
        <div className="flex items-center gap-2">
          <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left">申请人</span>
          <span className="text-slate-800 truncate flex-1 text-left text-base">{h.claimant}</span>
        </div>
        <div className="flex items-center gap-2">
          <Building2 size={12} className="text-red-400 flex-shrink-0" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left">被申请人</span>
          <span className="text-slate-800 truncate flex-1 text-left text-base">{h.respondent}</span>
        </div>

        {/* Hearing Time */}
        <div className="flex items-center gap-2 pt-1">
          <Clock size={12} className="text-amber-500 flex-shrink-0" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left">开庭时间</span>
          <span className="text-base text-indigo-600 font-bold flex-1 text-left">{h.hearingTime}</span>
        </div>

        {/* Hearing Location */}
        <div className="flex items-start gap-2">
          <MapPin size={12} className="text-rose-500 flex-shrink-0 mt-0.5" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left mt-0.5">开庭地点</span>
          <span className="text-slate-800 flex-1 text-left text-base">{h.hearingLocation}</span>
        </div>

        <div className="flex items-center gap-2 ">
          <FileText size={12} className="text-slate-400 flex-shrink-0" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left">办案秘书</span>
          <span className="text-slate-700 flex-1 text-left text-base">{h.secretary}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users size={12} className="text-violet-500 flex-shrink-0" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left">仲裁庭</span>
          <span className="text-slate-700 flex-1 text-left text-base">张三、李四、王五</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar size={12} className="text-indigo-400 flex-shrink-0" />
          <span className="text-slate-500 w-14 flex-shrink-0 text-left">庭室用途</span>
          <span className="text-slate-800 flex-1 text-left text-base">{h.hearingPurpose}</span>
        </div>
      </div>
    </div>
  );
}

export default function PendingHearingList({ onBack, onSelectItem, initialDateRange }: PendingHearingListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showFilterDrawer, setShowFilterDrawer] = useState<boolean>(false);
  const [selectedSecretary, setSelectedSecretary] = useState<string>('');
  const [amountRange, setAmountRange] = useState<[number, number]>([0, 100000]);
  const [hearingDateRange, setHearingDateRange] = useState<[string, string]>(initialDateRange ?? ['', '']);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [calendarYear, setCalendarYear] = useState<number>(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState<number>(new Date().getMonth());
  const [selectedDate, setSelectedDate] = useState<string>('');

  const hearings: PendingHearingItem[] = [
    {
      id: 'ph-1',
      caseNo: '(2026)穗仲案字第0325号',
      claimant: '广州智慧零售科技有限公司',
      respondent: '深圳前海股权投资基金合伙企业',
      hearingTime: '2026-09-20 09:30-10:00',
      hearingLocation: '第三仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '开庭审理',
      disputeAmount: 8500000,
      status: 'pending'
    },
    {
      id: 'ph-2',
      caseNo: '(2026)穗仲案字第0521号',
      claimant: '宏图建筑工程总承包有限公司',
      respondent: '润物高科智能产业园发展公司',
      hearingTime: '2026-09-22 14:00-15:00',
      hearingLocation: '第一仲裁庭',
      secretary: '王小红',
      hearingPurpose: '质证开庭',
      disputeAmount: 32000000,
      status: 'pending'
    },
    {
      id: 'ph-alone-1',
      caseNo: '(2026)穗仲案字第1024号',
      claimant: '华夏科技股份有限公司',
      respondent: '蓝海创业投资合伙企业（有限合伙）',
      hearingTime: '2026-10-11 09:30 至 11:30',
      hearingLocation: '第二仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '开庭审理',
      disputeAmount: 18500000,
      status: 'pending'
    },
    {
      id: 'ph-alone-2',
      caseNo: '(2026)穗仲案字第0521号',
      claimant: '宏图中建工程局有限公司',
      respondent: '润物高新科技产业园有限公司',
      hearingTime: '2026-10-12 14:00 至 16:30',
      hearingLocation: '东莞分会五庭',
      secretary: '李文浩',
      hearingPurpose: '开庭审理',
      disputeAmount: 64100000,
      status: 'pending'
    },
    {
      id: 'ph-alone-3',
      caseNo: '(2026)穗仲案字第0882号',
      claimant: '吉隆航运有限公司（新加坡）',
      respondent: '沧州金桥钢铁商贸有限公司',
      hearingTime: '2026-09-13 16:30 至 18:00',
      hearingLocation: '广州仲裁委线上开庭系统B室',
      secretary: '李文浩',
      hearingPurpose: '调解',
      disputeAmount: 4200000,
      status: 'pending'
    },
    {
      id: 'ph-3',
      caseNo: '(2026)穗仲案字第0418号',
      claimant: '广州市天河科技投资有限公司',
      respondent: '上海某某贸易有限公司',
      hearingTime: '2026-09-28 10:00',
      hearingLocation: '第二仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '开庭审理',
      disputeAmount: 5600000,
      status: 'held'
    },
    {
      id: 'ph-4',
      caseNo: '(2026)穗仲案字第0302号',
      claimant: '杭州某某科技有限公司',
      respondent: '浙江某某网络有限公司',
      hearingTime: '2026-10-25 15:30-16:00',
      hearingLocation: '第五仲裁庭',
      secretary: '陈小红',
      hearingPurpose: '辩论开庭',
      disputeAmount: 125000000,
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
      disputeAmount: 4300000,
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
      disputeAmount: 7800000,
      status: 'pending'
    },
    // —— 2026 年 9–10 月补充数据（当前月份 & 下月，用于日历展示）——
    {
      id: 'ph-7',
      caseNo: '(2026)穗仲案字第0701号',
      claimant: '广州华发地产发展股份有限公司',
      respondent: '广东建工总承包有限公司',
      hearingTime: '2026-09-10 09:00-10:30',
      hearingLocation: '第一仲裁庭',
      secretary: '李芳',
      hearingPurpose: '开庭审理',
      disputeAmount: 56800000,
      status: 'pending'
    },
    {
      id: 'ph-8',
      caseNo: '(2026)穗仲案字第0705号',
      claimant: '深圳腾远物流科技有限公司',
      respondent: '广州顺安运输服务有限公司',
      hearingTime: '2026-09-10 14:00-15:00',
      hearingLocation: '第二仲裁庭',
      secretary: '张伟',
      hearingPurpose: '质证开庭',
      disputeAmount: 3200000,
      status: 'pending'
    },
    {
      id: 'ph-9',
      caseNo: '(2026)穗仲案字第0712号',
      claimant: '广州星海文化传媒集团',
      respondent: '北京字节跳动网络技术有限公司',
      hearingTime: '2026-09-12 10:00-11:00',
      hearingLocation: '第四仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '二次开庭',
      disputeAmount: 12000000,
      status: 'pending'
    },
    {
      id: 'ph-10',
      caseNo: '(2026)穗仲案字第0718号',
      claimant: '东莞比亚迪新能源汽车有限公司',
      respondent: '上海博格华纳汽车零部件公司',
      hearingTime: '2026-09-15 09:30-11:00',
      hearingLocation: '第一仲裁庭',
      secretary: '陈小红',
      hearingPurpose: '开庭审理',
      disputeAmount: 450000000,
      status: 'pending'
    },
    {
      id: 'ph-11',
      caseNo: '(2026)穗仲案字第0720号',
      claimant: '佛山顺德家具制造有限公司',
      respondent: '广州居然之家家居卖场',
      hearingTime: '2026-09-15 15:00-16:00',
      hearingLocation: '第五仲裁庭',
      secretary: '王小红',
      hearingPurpose: '辩论开庭',
      disputeAmount: 8900000,
      status: 'pending'
    },
    {
      id: 'ph-12',
      caseNo: '(2026)穗仲案字第0726号',
      claimant: '广州网易计算机系统有限公司',
      respondent: '深圳腾讯计算机系统有限公司',
      hearingTime: '2026-09-18 14:30-15:30',
      hearingLocation: '第三仲裁庭',
      secretary: '李芳',
      hearingPurpose: '调解开庭',
      disputeAmount: 28000000,
      status: 'pending'
    },
    {
      id: 'ph-13',
      caseNo: '(2026)穗仲案字第0733号',
      claimant: '珠海格力电器股份有限公司',
      respondent: '中山奥马冰箱有限公司',
      hearingTime: '2026-09-22 10:30-12:00',
      hearingLocation: '第一仲裁庭',
      secretary: '张伟',
      hearingPurpose: '开庭审理',
      disputeAmount: 67500000,
      status: 'pending'
    },
    {
      id: 'ph-14',
      caseNo: '(2026)穗仲案字第0740号',
      claimant: '广州白云机场股份有限公司',
      respondent: '深圳中航油料供应有限公司',
      hearingTime: '2026-09-25 09:00-10:00',
      hearingLocation: '第二仲裁庭',
      secretary: '李文浩',
      hearingPurpose: '质证开庭',
      disputeAmount: 158000000,
      status: 'pending'
    },
    {
      id: 'ph-15',
      caseNo: '(2026)穗仲案字第0748号',
      claimant: '中国南方航空股份有限公司',
      respondent: '中国航空油料有限责任公司',
      hearingTime: '2026-09-29 14:00-15:30',
      hearingLocation: '第四仲裁庭',
      secretary: '赵婷',
      hearingPurpose: '开庭审理',
      disputeAmount: 320000000,
      status: 'pending'
    },
    {
      id: 'ph-16',
      caseNo: '(2026)穗仲案字第0805号',
      claimant: '广州恒大足球俱乐部有限公司',
      respondent: '广州富力足球俱乐部有限公司',
      hearingTime: '2026-10-08 10:00-11:00',
      hearingLocation: '第三仲裁庭',
      secretary: '陈小红',
      hearingPurpose: '宣判开庭',
      disputeAmount: 25000000,
      status: 'pending'
    },
    {
      id: 'ph-17',
      caseNo: '(2026)穗仲案字第0812号',
      claimant: '广州唯品会电子商务有限公司',
      respondent: '上海聚美优品电子商务有限公司',
      hearingTime: '2026-10-15 09:30-10:30',
      hearingLocation: '第一仲裁庭',
      secretary: '李芳',
      hearingPurpose: '开庭审理',
      disputeAmount: 8500000,
      status: 'pending'
    },
    {
      id: 'ph-18',
      caseNo: '(2026)穗仲案字第0820号',
      claimant: '广州广百百货股份有限公司',
      respondent: '北京王府井百货集团',
      hearingTime: '2026-10-22 14:30-15:30',
      hearingLocation: '第二仲裁庭',
      secretary: '张伟',
      hearingPurpose: '辩论开庭',
      disputeAmount: 42000000,
      status: 'pending'
    }
  ];

  const filteredHearings = useMemo(() => {
    return hearings
      .filter((h) => h.status === 'pending')
      .filter((h) => {
        // Secretary filter (includes match)
        if (selectedSecretary && !h.secretary.includes(selectedSecretary)) {
          return false;
        }
        // Amount range filter (万元 → CNY)
        if (amountRange[0] > 0 && h.disputeAmount < amountRange[0] * 10000) {
          return false;
        }
        if (amountRange[1] < 100000 && h.disputeAmount > amountRange[1] * 10000) {
          return false;
        }
        // Hearing date range filter (extract YYYY-MM-DD before space)
        const hearingDate = h.hearingTime.split(' ')[0];
        if (hearingDateRange[0] && hearingDate < hearingDateRange[0]) {
          return false;
        }
        if (hearingDateRange[1] && hearingDate > hearingDateRange[1]) {
          return false;
        }
        // Search query
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
  }, [hearings, searchQuery, selectedSecretary, amountRange, hearingDateRange]);

  const todayStr = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // 开庭日期 → 当日案件映射（跟随搜索/筛选结果）
  const hearingsByDate = useMemo(() => {
    const map = new Map<string, PendingHearingItem[]>();
    filteredHearings.forEach((h) => {
      const d = h.hearingTime.split(' ')[0];
      const arr = map.get(d) || [];
      arr.push(h);
      map.set(d, arr);
    });
    return map;
  }, [filteredHearings]);

  // 日历网格（周日开头，前置空白补齐）
  const calendarCells = useMemo(() => {
    const firstDayOffset = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: (string | null)[] = Array.from({ length: firstDayOffset }, () => null);
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push(`${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`);
    }
    return cells;
  }, [calendarYear, calendarMonth]);

  const selectedDateCases = selectedDate ? hearingsByDate.get(selectedDate) || [] : [];

  const selectedDateLabel = useMemo(() => {
    if (!selectedDate) return '';
    const d = new Date(selectedDate + 'T00:00:00');
    const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    return `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`;
  }, [selectedDate]);

  const goToPrevMonth = () => {
    if (calendarMonth === 0) { setCalendarYear(calendarYear - 1); setCalendarMonth(11); }
    else setCalendarMonth(calendarMonth - 1);
    setSelectedDate('');
  };

  const goToNextMonth = () => {
    if (calendarMonth === 11) { setCalendarYear(calendarYear + 1); setCalendarMonth(0); }
    else setCalendarMonth(calendarMonth + 1);
    setSelectedDate('');
  };

  const goToday = () => {
    const now = new Date();
    setCalendarYear(now.getFullYear());
    setCalendarMonth(now.getMonth());
    setSelectedDate(todayStr);
  };

  // 切换视图：进入日历模式时定位到当前月份并选中今天
  const switchViewMode = () => {
    if (viewMode === 'list') {
      const now = new Date();
      setCalendarYear(now.getFullYear());
      setCalendarMonth(now.getMonth());
      setSelectedDate(todayStr);
      setViewMode('calendar');
    } else {
      setViewMode('list');
    }
  };

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
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">待开庭提醒</div>
      </div>

      {/* Search */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 space-y-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索案号、当事人、办案秘书..."
              className="w-full pl-9 pr-10 h-9 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            />
            <button
              onClick={() => setShowFilterDrawer(!showFilterDrawer)}
              className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded cursor-pointer transition-colors ${
                showFilterDrawer ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
              }`}
            >
              <SlidersHorizontal size={16} />
            </button>
          </div>
          <button
            onClick={switchViewMode}
            title={viewMode === 'list' ? '切换日历模式' : '切换列表模式'}
            className="flex-shrink-0 inline-flex items-center justify-center gap-1 h-9 px-2.5 rounded-lg border border-indigo-200 bg-indigo-50 text-indigo-600 text-sm font-medium cursor-pointer hover:bg-indigo-100 transition-colors"
          >
            {viewMode === 'list' ? (
              <>
                <CalendarDays size={14} />
                <span>日历模式</span>
              </>
            ) : (
              <>
                <List size={14} />
                <span>列表模式</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Comprehensive Filter Bottom Sheet */}
      <BottomSheet
        open={showFilterDrawer}
        onClose={() => setShowFilterDrawer(false)}
        title="综合筛选"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setSelectedSecretary(''); setAmountRange([0, 100000]); setHearingDateRange(['', '']); }}
              className="flex-1 py-2.5 rounded-lg text-base text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-colors"
            >
              重置
            </button>
            <button
              onClick={() => setShowFilterDrawer(false)}
              className="flex-1 py-2.5 rounded-lg text-base text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer transition-colors"
            >
              确认
            </button>
          </div>
        }
      >
        {/* Secretary Filter */}
        <div className="flex items-center gap-3 text-base">
          <span className="text-slate-500 w-16 flex-shrink-0 text-left">
            经办秘书
          </span>
          <div className="flex-1 min-w-0">
            <input
              type="text"
              value={selectedSecretary}
              onChange={(e) => setSelectedSecretary(e.target.value)}
              placeholder="搜索经办秘书姓名"
              className="w-full px-2 py-1 rounded border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>
        </div>

        {/* Amount Range Filter */}
        <div className="flex items-center gap-3 mt-3 text-base">
          <span className="text-slate-500 w-16 flex-shrink-0 text-left">
            标的区间
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="relative flex-1 min-w-0">
              <input
                type="number"
                min={0}
                value={amountRange[0] === 0 ? '' : amountRange[0]}
                onChange={(e) => setAmountRange([Number(e.target.value) || 0, amountRange[1]])}
                placeholder="标的下限"
                className="w-full min-w-0 px-2 py-1 pr-7 rounded border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">万</span>
            </div>
            <span className="text-slate-400 text-sm flex-shrink-0">~</span>
            <div className="relative flex-1 min-w-0">
              <input
                type="number"
                min={0}
                value={amountRange[1] === 100000 ? '' : amountRange[1]}
                onChange={(e) => setAmountRange([amountRange[0], Number(e.target.value) || 100000])}
                placeholder="标的上限"
                className="w-full min-w-0 px-2 py-1 pr-7 rounded border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400">万</span>
            </div>
          </div>
        </div>

        {/* Hearing Date Range Filter */}
        <div className="flex items-center gap-3 mt-3 text-base">
          <span className="text-slate-500 w-16 flex-shrink-0 text-left">
            开庭时间
          </span>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <div className="flex-1 min-w-0">
              <input
                type="date"
                value={hearingDateRange[0]}
                onChange={(e) => setHearingDateRange([e.target.value, hearingDateRange[1]])}
                className="w-full min-w-0 px-2 py-1 rounded border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <span className="text-slate-400 text-sm flex-shrink-0">~</span>
            <div className="flex-1 min-w-0">
              <input
                type="date"
                value={hearingDateRange[1]}
                onChange={(e) => setHearingDateRange([hearingDateRange[0], e.target.value])}
                className="w-full min-w-0 px-2 py-1 rounded border border-slate-200 text-slate-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>
      </BottomSheet>

      {/* List Mode */}
      {viewMode === 'list' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredHearings.length > 0 ? (
            filteredHearings.map((h) => (
              <HearingCard key={h.id} hearing={h} onSelect={onSelectItem} />
            ))
          ) : (
            <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
              <AlertCircle size={28} className="text-slate-300" />
              <span className="text-sm font-semibold text-slate-500">未检索到匹配的开庭记录</span>
              <button
                onClick={() => { setSearchQuery(''); setSelectedSecretary(''); setAmountRange([0, 100000]); setHearingDateRange(['', '']); }}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-500 text-sm rounded-lg cursor-pointer hover:bg-indigo-100/80 transition-colors"
              >
                清空搜索与过滤
              </button>
            </div>
          )}
        </div>
      )}

      {/* Calendar Mode */}
      {viewMode === 'calendar' && (
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 日历卡片 */}
          <div className="bg-white rounded-lg border border-slate-100 p-4 shadow-sm shadow-slate-900/5">
            {/* 月份切换 */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={goToPrevMonth}
                aria-label="上个月"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="text-base font-bold text-slate-800">{calendarYear}年{calendarMonth + 1}月</div>
              <div className="flex items-center gap-0.5">
                <button
                  onClick={goToday}
                  className="px-2 py-1 rounded-md text-base text-indigo-500 hover:bg-indigo-50 cursor-pointer transition-colors font-medium"
                >
                  今天
                </button>
                <button
                  onClick={goToNextMonth}
                  aria-label="下个月"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>

            {/* 星期表头 */}
            <div className="grid grid-cols-7">
              {['日', '一', '二', '三', '四', '五', '六'].map((w) => (
                <div key={w} className="text-center text-xs text-slate-400 py-1 font-medium">{w}</div>
              ))}
            </div>

            {/* 日期网格 */}
            <div className="grid grid-cols-7 gap-y-0.5">
              {calendarCells.map((date, idx) => {
                if (!date) return <div key={`blank-${idx}`} />;
                const day = parseInt(date.slice(8), 10);
                const hasHearing = hearingsByDate.has(date);
                const isToday = date === todayStr;
                const isSelected = date === selectedDate;
                return (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className="flex flex-col items-center justify-center py-1 gap-0.5 rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <span
                      className={`flex items-center justify-center w-7 h-7 rounded-full text-sm ${
                        isSelected
                          ? 'bg-indigo-500 text-white font-bold'
                          : isToday
                            ? 'border-2 border-indigo-400 text-indigo-600 font-bold'
                            : hasHearing
                              ? 'text-indigo-600 font-semibold'
                              : 'text-slate-600'
                      }`}
                    >
                      {day}
                    </span>
                    {hasHearing ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    ) : (
                      <span className="h-1.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-end gap-1.5 mt-2 pt-2 border-t border-slate-50">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-sm text-slate-400">当日有开庭安排</span>
            </div>
          </div>

          {/* 选中日期的开庭案件 */}
          {selectedDate ? (
            <>
              <div className="flex items-center justify-between px-1 pt-1">
                <span className="text-base font-bold text-slate-700 flex items-center gap-1.5">
                  <CalendarDays size={14} className="text-indigo-400" />
                  {selectedDateLabel} 开庭安排
                </span>
                <span className="text-xs px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-500 font-medium">
                  {selectedDateCases.length} 场
                </span>
              </div>
              {selectedDateCases.length > 0 ? (
                selectedDateCases.map((h) => (
                  <CompactHearingCard key={h.id} hearing={h} onSelect={onSelectItem} />
                ))
              ) : (
                <div className="bg-white/50 rounded-xl border border-dashed border-slate-200 py-8 flex flex-col items-center justify-center text-center space-y-1.5">
                  <Calendar size={24} className="text-slate-300" />
                  <span className="text-xs text-slate-400">当日暂无开庭安排</span>
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-sm text-slate-400 py-1">点击日历中的日期，查看当日开庭案件</div>
          )}
        </div>
      )}
    </div>
  );
}
