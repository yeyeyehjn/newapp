import React, { useState, useMemo } from 'react';
import { Search, FileText, AlertCircle, Building2, Check, Clock, CheckCircle2 } from 'lucide-react';
import { IOSAlert } from './ui/IOSDialog';

interface DeclarationItem {
  id: string;
  caseNo: string;
  claimant: string;
  respondent: string;
  secretary: string;
  arbitrator: string;
  status: 'pending' | 'signed';
  signedDate?: string;
}

interface DeclarationListProps {
  onBack: () => void;
  onSelectItem: (item: DeclarationItem) => void;
}

export default function DeclarationList({ onBack, onSelectItem }: DeclarationListProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'pending' | 'signed'>('pending');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  // Mock data for declarations
  const [declarations, setDeclarations] = useState<DeclarationItem[]>([
    {
      id: 'dec-1',
      caseNo: '(2026)穗仲案字第0325号',
      claimant: '广州智慧零售科技有限公司',
      respondent: '深圳前海股权投资基金合伙企业',
      secretary: '李文浩',
      arbitrator: '张明（首席）',
      status: 'pending'
    },
    {
      id: 'dec-2',
      caseNo: '(2026)穗仲案字第0521号',
      claimant: '宏图建筑工程总承包有限公司',
      respondent: '润物高科智能产业园发展公司',
      secretary: '王小红',
      arbitrator: '张明（首席）',
      status: 'pending'
    },
    {
      id: 'dec-3',
      caseNo: '(2026)穗仲案字第0418号',
      claimant: '广州市天河科技投资有限公司',
      respondent: '上海某某贸易有限公司',
      secretary: '李文浩',
      arbitrator: '张明（独任）',
      status: 'signed',
      signedDate: '2026-05-28'
    },
    {
      id: 'dec-4',
      caseNo: '(2026)穗仲案字第0302号',
      claimant: '杭州某某科技有限公司',
      respondent: '浙江某某网络有限公司',
      secretary: '陈小红',
      arbitrator: '张明（边裁）',
      status: 'signed',
      signedDate: '2026-05-15'
    },
    {
      id: 'dec-5',
      caseNo: '(2026)穗仲案字第0536号',
      claimant: '北京盛世文化传媒股份有限公司',
      respondent: '广州创意设计工作室',
      secretary: '王小红',
      arbitrator: '张明（首席）',
      status: 'pending'
    },
    {
      id: 'dec-6',
      caseNo: '(2026)穗仲案字第0289号',
      claimant: '深圳市前海融资租赁有限公司',
      respondent: '东莞市民营企业投资集团',
      secretary: '陈小红',
      arbitrator: '张明（独任）',
      status: 'signed',
      signedDate: '2026-05-10'
    }
  ]);

  const statusTabs: { label: string; value: 'pending' | 'signed' }[] = [
    { label: '待签署', value: 'pending' },
    { label: '已签署', value: 'signed' },
  ];

  // Filter declarations
  const filteredDeclarations = useMemo(() => {
    return declarations.filter((d) => {
      // Status filter
      if (d.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          d.caseNo.toLowerCase().includes(query) ||
          d.claimant.toLowerCase().includes(query) ||
          d.respondent.toLowerCase().includes(query) ||
          d.secretary.toLowerCase().includes(query) ||
          d.arbitrator.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [declarations, statusFilter, searchQuery]);

  // 勾选/取消勾选某条待审批记录
  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // 切换状态 Tab 时清空已选
  const handleSelectTab = (value: 'pending' | 'signed') => {
    setStatusFilter(value);
    setSelectedIds(new Set());
  };

  // 一键审批：将所选待签承诺书置为已签署
  const handleBatchApprove = () => {
    const today = new Date().toISOString().slice(0, 10);
    setDeclarations(prev => prev.map(d =>
      selectedIds.has(d.id) ? { ...d, status: 'signed', signedDate: today } : d
    ));
    setSelectedIds(new Set());
    setShowApproveConfirm(false);
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
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">声明承诺书</div>
      </div>

      {/* Search Stick Area */}
      <div className="bg-white border-b border-indigo-50 px-4 py-3 flex-shrink-0 shadow-sm shadow-slate-900/5 z-10 w-full">
        <div className="flex gap-2 items-center">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索案号、当事人、办案秘书..."
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder:text-slate-500"
            />
          </div>
          {/* 一键审批 */}
          <button
            onClick={() => setShowApproveConfirm(true)}
            disabled={selectedIds.size === 0}
            className={`rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-1.5 px-3.5 py-2 cursor-pointer transition-all select-none ${
              selectedIds.size > 0
                ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-900/30'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            一键审批
            {selectedIds.size > 0 && (
              <span className="bg-white/25 rounded-full px-1.5 text-2xs">{selectedIds.size}</span>
            )}
          </button>
        </div>
      </div>

      {/* List Items */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredDeclarations.length > 0 ? (
          filteredDeclarations.map((d) => {
            const statusColorClass = d.status === 'signed' 
              ? 'text-emerald-500 bg-emerald-50 border-emerald-100' 
              : 'text-amber-500 bg-amber-50 border-amber-100';

            return (
              <div
                key={d.id}
                onClick={() => onSelectItem(d)}
                className="bg-white rounded-lg border border-slate-100 p-4 hover:border-slate-200 transition-all cursor-pointer flex flex-col justify-between space-y-3 group"
              >
                {/* Card Title Bar */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-base text-slate-900 group-hover:text-indigo-500 transition-colors flex items-center gap-2 min-w-0">
                    {d.status === 'pending' ? (
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); toggleSelect(d.id); }}
                        aria-label="选择声明承诺书"
                        aria-pressed={selectedIds.has(d.id)}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer select-none ${
                          selectedIds.has(d.id)
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300 hover:border-indigo-500'
                        }`}
                      >
                        {selectedIds.has(d.id) && <Check size={12} strokeWidth={3.5} />}
                      </button>
                    ) : null}
                    <span className="truncate">{d.caseNo}</span>
                  </span>
                  <span className={`text-sm p-0.5 px-1.5 rounded border flex-shrink-0 ${statusColorClass}`}>
                    {d.status === 'signed' ? '已签署' : '待签署'}
                  </span>
                </div>

                {/* Info rows */}
                <div className="border-t border-dashed border-slate-100 pt-3 space-y-2 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{d.claimant}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 size={12} className="text-red-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">被申请人</span>
                    <span className="text-slate-800 truncate flex-1 text-left">{d.respondent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-slate-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">办案秘书</span>
                    <span className="text-slate-700 flex-1 text-left">{d.secretary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText size={12} className="text-indigo-400 flex-shrink-0" />
                    <span className="text-slate-500 w-14 flex-shrink-0 text-left">仲裁员</span>
                    <span className="text-slate-700 flex-1 text-left">{d.arbitrator}</span>
                  </div>

                  {d.signedDate && (
                    <div className="flex items-center gap-2 pt-1">
                      <FileText size={12} className="text-amber-400 flex-shrink-0" />
                      <span className="text-slate-500 w-14 flex-shrink-0 text-left">签署日期</span>
                      <span className="text-slate-700 flex-1 text-left">{d.signedDate}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="h-44 flex flex-col items-center justify-center text-center space-y-2 p-6 bg-white/50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle size={28} className="text-slate-300" />
            <span className="text-sm font-semibold text-slate-500">未检索到匹配的声明承诺书</span>
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
                onClick={() => handleSelectTab(tab.value)}
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

      {/* 一键审批确认弹窗 */}
      {showApproveConfirm && (
        <IOSAlert
          title="一键审批"
          message={`确认审批通过所选 ${selectedIds.size} 份待签署声明承诺书？`}
          overlayClassName="absolute inset-0 z-[70]"
          actions={[
            { label: '取消', style: 'cancel', onPress: () => setShowApproveConfirm(false) },
            { label: '确认审批', style: 'default', onPress: handleBatchApprove },
          ]}
        />
      )}
    </div>
  );
}
