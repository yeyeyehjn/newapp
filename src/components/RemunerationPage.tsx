import React, { useState } from 'react';
import { Search, Filter, FileText, DollarSign, User, CheckCircle2, Clock, X } from 'lucide-react';

interface RemunerationItem {
  id: string;
  caseNo: string;
  secretary: string;
  status: '已发酬金' | '待发酬金';
  amount: number;
}

interface RemunerationPageProps {
  onBack: () => void;
}

export default function RemunerationPage({ onBack }: RemunerationPageProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | '已发酬金' | '待发酬金'>('all');
  const [showRulesModal, setShowRulesModal] = useState<boolean>(false);

  // Mock data for remuneration items
  const mockRemunerationData: RemunerationItem[] = [
    { id: '1', caseNo: '(2026)穗仲案字第0521号', secretary: '李文浩', status: '已发酬金', amount: 8500 },
    { id: '2', caseNo: '(2026)穗仲案字第0522号', secretary: '张晓燕', status: '待发酬金', amount: 12000 },
    { id: '3', caseNo: '(2026)穗仲案字第0523号', secretary: '王建国', status: '已发酬金', amount: 6800 },
    { id: '4', caseNo: '(2026)穗仲案字第0524号', secretary: '陈思思', status: '待发酬金', amount: 9500 },
    { id: '5', caseNo: '(2026)穗仲案字第0525号', secretary: '李文浩', status: '已发酬金', amount: 15000 },
    { id: '6', caseNo: '(2026)穗仲案字第0526号', secretary: '张晓燕', status: '待发酬金', amount: 7200 },
  ];

  // Filter remuneration items based on search and status
  const filteredItems = mockRemunerationData.filter(item => {
    const matchesSearch = item.caseNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.secretary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          酬金单
        </div>
        {/* 右侧报酬规则按钮 */}
        <button
          onClick={() => setShowRulesModal(true)}
          className="absolute right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <i className="fa-solid fa-book-open text-xs"></i>
          <span>报酬规则</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white px-4 py-3 border-b border-slate-100 shadow-sm shadow-slate-900/5">
        {/* Search Box */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="搜索案号或经办秘书..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/40' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setStatusFilter('已发酬金')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
              statusFilter === '已发酬金'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckCircle2 size={12} />
            <span>已发酬金</span>
          </button>
          <button
            onClick={() => setStatusFilter('待发酬金')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-1 ${
              statusFilter === '待发酬金'
                ? 'bg-amber-600 text-white shadow-sm shadow-amber-900/40' 
                : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Clock size={12} />
            <span>待发酬金</span>
          </button>
        </div>
      </div>

      {/* List Section */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-100 p-4 hover:border-indigo-200  transition-all cursor-pointer"
            >
              {/* Case Number */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  
                  <span className=" text-slate-900 text-base">{item.caseNo}</span>
                </div>
                <span className={`text-sm px-1.5 py-1 rounded ${
                  item.status === '已发酬金'
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2">
                  <User size={12} className="text-slate-400" />
                  <div>
                    <span className="text-slate-500 ">经办秘书：</span>
                    <span className="text-slate-700 ">{item.secretary}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign size={12} className="text-slate-400" />
                  <div>
                    <span className="text-slate-500 ">税前酬金：</span>
                    <span className="text-indigo-600 ">¥{item.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-slate-50/55 rounded-2xl border border-dashed border-slate-200/80 p-8 text-center">
            <p className="text-sm text-slate-500 font-medium">暂无符合条件的酬金单记录</p>
          </div>
        )}
      </div>

      {/* Remuneration Rules Modal */}
      {showRulesModal && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xs z-[70] flex items-center justify-center p-4 animate-fade-in text-left">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[460px] flex flex-col overflow-hidden shadow-2xl border border-slate-100">
            <div className="bg-indigo-900 text-white p-4 flex justify-between items-center">
              <span className="text-sm font-bold flex items-center gap-2 font-sans">
                <FileText size={16} className="text-amber-400" />
                <span>仲裁员报酬管理规则</span>
              </span>
              <button
                onClick={() => setShowRulesModal(false)}
                className="text-indigo-200 hover:text-white cursor-pointer hover:bg-indigo-800 p-1.5 rounded-lg text-sm"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-4 text-sm text-slate-600 leading-relaxed no-scrollbar flex-1 font-sans">
              <div className="space-y-3.5">
                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-coins text-indigo-600"></i>
                  <span>一、报酬计算标准</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  仲裁员报酬按照案件争议金额、案件复杂程度、审理时长等因素综合计算。具体标准如下：
                </p>
                <ul className="text-xs leading-relaxed space-y-1.5 pl-4">
                  <li>• 争议金额在100万元以下：基础报酬3000-5000元</li>
                  <li>• 争议金额100-500万元：基础报酬5000-8000元</li>
                  <li>• 争议金额500万元以上：基础报酬8000-15000元</li>
                  <li>• 涉外案件或特殊复杂案件：可适当上浮20%-50%</li>
                </ul>

                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-clock text-indigo-600"></i>
                  <span>二、发放时间规定</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  仲裁员报酬在案件结案并签署裁决书后15个工作日内发放。特殊情况需要延期的，须经仲裁委员会批准。
                </p>

                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-shield-halved text-indigo-600"></i>
                  <span>三、税务处理</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  仲裁员报酬需按照国家税法规定缴纳个人所得税。税前酬金为应发金额，税后酬金为实发金额。仲裁委员会将依法代扣代缴个人所得税。
                </p>

                <h5 className="font-extrabold text-slate-700 text-sm border-b border-slate-100 pb-1 flex items-center gap-1.5">
                  <i className="fa-solid fa-file-invoice text-indigo-600"></i>
                  <span>四、特殊情况处理</span>
                </h5>
                <p className="text-xs leading-relaxed text-justify">
                  如遇案件中止、撤回、和解等特殊情况，报酬按照实际工作量比例发放。仲裁员主动回避或因违纪被解除聘任的，不予发放报酬。
                </p>
              </div>
            </div>

            <div className="bg-slate-50 p-3 h-14 flex items-center justify-end border-t border-slate-100 flex-shrink-0">
              <button
                onClick={() => setShowRulesModal(false)}
                className="bg-indigo-600 text-white font-extrabold p-2 px-5 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/30"
              >
                已知悉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}