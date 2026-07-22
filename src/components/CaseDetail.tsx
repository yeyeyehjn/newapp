import React, { useState, useRef, useEffect } from 'react';
import { Calendar, FileText, Download, Search, User, Building2, FileCheck, Sparkles, Shield, Mail, Phone, Copy, X, PenTool, ChevronRight, ChevronDown, Bell, Paperclip, Clock, AlertTriangle, CircleDollarSign, Receipt } from 'lucide-react';
import { Case } from '../types';

type CaseDetailTab = 'basic' | 'parties' | 'requests' | 'materials' | 'signature' | 'review';

interface CaseDetailProps {
  caseItem: Case;
  onBack: () => void;
  onNavigateToSubPage?: (page: string) => void;
  initialTab?: CaseDetailTab;
  onSignTranscript?: (transcript: { id: string; name: string; pages: number; size: string }) => void;
}

interface PartyInfo {
  type: 'applicant' | 'respondent';
  attribute: '自然人' | '企业';
  name: string;
  idType: string;
  idNo: string;
  phone: string;
  email: string;
  address: string;
}

interface ArbitrationRequest {
  facts: string;
  items: string[];
}

interface MaterialItem {
  id: string;
  category: '申请书' | '申请人证据' | '被申请人证据' | '申请人答辩状' | '被申请人答辩状' | '其他材料';
  name: string;
  submitter: string;
  time: string;
  size: string;
  content?: string;
}

// 当事人分组卡片 — 消除申请人/被申请人重复代码
function PartyGroup({
  title,
  accent,
  parties,
  expandedParty,
  onToggle,
}: {
  title: string;
  accent: 'emerald' | 'red';
  parties: PartyInfo[];
  expandedParty: string | null;
  onToggle: (key: string) => void;
}) {
  const accentText = accent === 'emerald' ? 'text-emerald-500' : 'text-red-500';
  const accentBg = accent === 'emerald' ? 'bg-emerald-500' : 'bg-red-500';

  return (
    <div className="bg-white rounded-lg border border-slate-100 p-3">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <span className={`${accentBg} text-white text-sm font-bold px-2 py-0.5 rounded`}>{title}</span>
        <span className="text-sm text-slate-500">共{parties.length}位</span>
      </div>
      <div className="space-y-2">
        {parties.map((party, idx) => {
          const key = `${title}-${idx}`;
          const expanded = expandedParty === key;
          return (
            <div key={idx} className="bg-slate-50 rounded-lg overflow-hidden">
              <button
                onClick={() => onToggle(expanded ? null : key)}
                className="w-full flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-100/60 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {party.attribute === '企业' ? (
                    <Building2 size={14} className={`${accentText} flex-shrink-0`} />
                  ) : (
                    <User size={14} className={`${accentText} flex-shrink-0`} />
                  )}
                  <span className="font-bold text-slate-800 text-base truncate">{party.name}</span>
                  <span className="text-sm bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded flex-shrink-0">{party.attribute}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <div className="px-2.5 pb-2.5 space-y-2 animate-fade-in">
                  <div className="grid grid-cols-1 gap-1.5 pt-1 border-t border-slate-200/70">
                    <div className="text-sm"><span className="text-slate-500">{party.idType}：</span><span className="text-slate-700 font-medium">{party.idNo}</span></div>
                    <div className="text-sm"><span className="text-slate-500">手机：</span><span className="text-slate-700 font-medium">{party.phone}</span></div>
                    <div className="text-sm"><span className="text-slate-500">邮箱：</span><span className="text-slate-700 font-medium">{party.email}</span></div>
                    <div className="text-sm"><span className="text-slate-500">法定地址：</span><span className="text-slate-700 font-medium">{party.address}</span></div>
                  </div>
                  {/* 证件附件 */}
                  <div className="border-t border-slate-200/70 pt-2">
                    <div className="flex items-center gap-1 text-slate-500 text-sm mb-1.5">
                      <Paperclip size={12} />
                      <span>证件附件</span>
                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                      <div className="flex-shrink-0 w-16 h-20 bg-white rounded border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500 mt-0.5">{party.attribute === '企业' ? '营业执照' : '身份证'}</span>
                      </div>
                      <div className="flex-shrink-0 w-16 h-20 bg-white rounded border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                        <FileText size={16} className="text-slate-400" />
                        <span className="text-xs text-slate-500 mt-0.5">授权委托书</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// PDF 文件图标 — 消除重复的 PDF 图标代码
function PdfFileIcon({ pages }: { pages: number }) {
  return (
    <div className="w-10 h-12 bg-red-500 rounded flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
      <span className="text-white text-xs font-black leading-none">PDF</span>
      <span className="text-red-200 text-2xs mt-0.5">{pages}页</span>
    </div>
  );
}

export default function CaseDetail({ caseItem, onBack, onNavigateToSubPage, initialTab, onSignTranscript }: CaseDetailProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'parties' | 'requests' | 'materials' | 'signature' | 'review'>(initialTab || 'basic');
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);
  const [materialSearch, setMaterialSearch] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{ name: string; size: string; pages: number } | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadRemindTarget, setUploadRemindTarget] = useState('');
  const [uploadRemark, setUploadRemark] = useState('');
  const [uploadAwardFiles, setUploadAwardFiles] = useState<string[]>([]);
  const [uploadOtherFiles, setUploadOtherFiles] = useState<string[]>([]);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [expandedParty, setExpandedParty] = useState<string | null>(null);
  const [showTodoPanel, setShowTodoPanel] = useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);

  // Tab 顺序数组（用于键盘导航）
  const tabOrder = ['basic', 'parties', 'requests', 'materials', 'signature', 'review'] as const;
  type TabType = typeof tabOrder[number];

  // 键盘导航：左右箭头切换标签
  const handleTabKeyDown = (e: React.KeyboardEvent) => {
    const tabs = tabOrder as readonly TabType[];
    const currentIndex = tabs.indexOf(activeTab);
    let newIndex = currentIndex;

    if (e.key === 'ArrowLeft') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
    } else if (e.key === 'ArrowRight') {
      newIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
    } else {
      return;
    }

    e.preventDefault();
    const newTab = tabs[newIndex];
    setActiveTab(newTab);
    // 聚焦到新标签
    const btn = tabListRef.current?.querySelector(`[id="tab-${newTab}"]`) as HTMLElement | null;
    btn?.focus();
  };

  // 切换标签时自动滚动到当前标签（仅滚动 tablist 自身，不影响外层容器）
  useEffect(() => {
    const container = tabListRef.current;
    if (!container) return;
    const activeBtn = container.querySelector('[aria-selected="true"]') as HTMLElement | null;
    if (activeBtn) {
      // 只在 tablist 内部滚动，不用 scrollIntoView 以免触发外层容器滚动
      const target = activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.clientWidth / 2;
      container.scrollTo({ left: target, behavior: 'smooth' });
    }
  }, [activeTab]);

  // 庭审笔录列表（多条，带签名状态）
  const [transcriptList, setTranscriptList] = useState([
    { id: 't1', name: '庭审笔录_20260115.pdf', size: '3.2 MB', pages: 15, signed: true, signTime: '2026-01-16 10:25' },
    { id: 't2', name: '庭审笔录_20260120.pdf', size: '2.8 MB', pages: 12, signed: false, signTime: '' },
    { id: 't3', name: '庭审笔录_20260205.pdf', size: '4.1 MB', pages: 18, signed: false, signTime: '' },
  ]);

  // 本案件待办列表
  const caseTodos = [
    { id: 'todo1', type: '延期审批', title: '您有 1 件延期审批待处理', desc: '李明申请将2月20日开庭延期至3月5日', severity: 'urgent' as const, target: 'postponementApproval' },
    { id: 'todo2', type: '笔录签名', title: '您有 2 件笔录签名待处理', desc: '2份庭审笔录等待您签名确认', severity: 'normal' as const, target: 'transcriptSignature' },
    { id: 'todo3', type: '裁决书核阅', title: '您有 1 件裁决书核阅待处理', desc: '测试秘书已提交裁决书草稿v2', severity: 'normal' as const, target: 'draftAwardList' },
  ];

  const handleCopy = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch {
      // 静默失败，不阻塞用户体验
    }
  };

  // Mock data for parties
  const parties: PartyInfo[] = [
    {
      type: 'applicant',
      attribute: '企业',
      name: '广州天河科技投资有限公司',
      idType: '统一社会信用代码',
      idNo: '914401133XXXXX',
      phone: '020-1133-8888',
      email: 'legal@tianhe-tech.com',
      address: '广州市天河区珠江新城华夏路30号'
    },
    {
      type: 'applicant',
      attribute: '自然人',
      name: '张伟',
      idType: '身份证',
      idNo: '44010611331011234',
      phone: '138-1133-0001',
      email: 'zhangwei@email.com',
      address: '广州市越秀区东风中路100号'
    },
    {
      type: 'respondent',
      attribute: '企业',
      name: '深圳南山创新发展有限公司',
      idType: '统一社会信用代码',
      idNo: '914401133YYYYY',
      phone: '0755-1133-8888',
      email: 'contact@nanshan-dev.com',
      address: '深圳市南山区科技园南区'
    },
    {
      type: 'respondent',
      attribute: '自然人',
      name: '李明',
      idType: '身份证',
      idNo: '44030311331011234',
      phone: '139-1133-0002',
      email: 'liming@email.com',
      address: '深圳市福田区深南大道200号'
    }
  ];

  // Mock data for arbitration requests
  const arbitrationRequest: ArbitrationRequest = {
    facts: '申请人广州天河科技投资有限公司与被申请人深圳南山创新发展有限公司于2023年签订《合作协议》，约定双方共同投资开发某科技项目。协议约定被申请人应在收到申请人投资款项后6个月内完成项目开发并交付。申请人已按约定支付投资款项人民币5000万元，但被申请人未能按期完成项目开发，且在申请人多次催促后仍未能履行合同义务。被申请人的违约行为给申请人造成了重大经济损失。',
    items: [
      '请求裁决被申请人向申请人支付违约金人民币1000万元',
      '请求裁决被申请人返还申请人已支付的投资款项人民币5000万元',
      '请求裁决被申请人赔偿申请人因违约造成的经济损失人民币2000万元',
      '请求裁决本案仲裁费用由被申请人承担'
    ]
  };

  // Mock data for materials
  const materials: MaterialItem[] = [
    { id: '1', category: '申请书', name: '仲裁申请书', submitter: '申请人', time: '2024-01-15', size: '2.5MB' },
    { id: '2', category: '申请人证据', name: '合作协议原件', submitter: '申请人 张三三', time: '2024-01-15', size: '1.2MB', content: '双方签订的合作协议原件，约定项目开发期限为6个月' },
    { id: '3', category: '申请人证据', name: '银行转账凭证', submitter: '申请人 张三三', time: '2024-01-15', size: '0.8MB', content: '申请人支付5000万元投资款项的银行转账凭证' },
    { id: '4', category: '申请人证据', name: '催告函及送达证明', submitter: '申请人 张三三', time: '2024-02-20', size: '1.5MB', content: '申请人向被申请人发出的催告函及送达证明' },
    { id: '5', category: '被申请人证据', name: '项目进度报告', submitter: '被申请人 李明', time: '2024-03-01', size: '3.0MB', content: '被申请人提交的项目进度报告，说明项目延期原因' },
    { id: '6', category: '被申请人证据', name: '技术困难说明', submitter: '被申请人 李明', time: '2024-03-01', size: '2.0MB', content: '被申请人说明项目开发过程中遇到的技术困难' },
    { id: '7', category: '申请人答辩状', name: '申请人答辩状', submitter: '申请人 张三三', time: '2024-03-15', size: '1.8MB' },
    { id: '8', category: '被申请人答辩状', name: '被申请人答辩状', submitter: '被申请人 李明', time: '2024-03-20', size: '2.2MB' },
    { id: '9', category: '其他材料', name: '仲裁庭组成通知书', submitter: '仲裁委', time: '2024-02-01', size: '0.5MB' },
    { id: '10', category: '其他材料', name: '开庭通知书', submitter: '仲裁委', time: '2024-03-25', size: '0.3MB' }
  ];

  // Filter materials by search
  const filteredMaterials = materials.filter(m => 
    materialSearch === '' || 
    m.name.includes(materialSearch) || 
    m.category.includes(materialSearch) ||
    m.submitter.includes(materialSearch)
  );

  // Group materials by category
  const groupedMaterials = {
    '申请书': filteredMaterials.filter(m => m.category === '申请书'),
    '申请人证据': filteredMaterials.filter(m => m.category === '申请人证据'),
    '被申请人证据': filteredMaterials.filter(m => m.category === '被申请人证据'),
    '申请人答辩状': filteredMaterials.filter(m => m.category === '申请人答辩状'),
    '被申请人答辩状': filteredMaterials.filter(m => m.category === '被申请人答辩状'),
    '其他材料': filteredMaterials.filter(m => m.category === '其他材料')
  };

  // Helper to format currency
  const formatCNY = (amount: number) => {
    if (amount >= 10000000) {
      return `¥${(amount / 10000000).toFixed(2)} 千万元`;
    }
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(0)} 万元`;
    }
    return `¥${amount.toLocaleString()}`;
  };

  const applicants = parties.filter(p => p.type === 'applicant');
  const respondents = parties.filter(p => p.type === 'respondent');

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden animate-slide-in relative">
      {/* Header - 微信小程序子页面返回样式 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          aria-label="返回上一页"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          案件详情
        </div>
      </div>

      {/* Simplified Banner - 右侧待办入口 */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3.5 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            {/* 第一行：案号 */}
            <h4 className="text-lg font-bold text-white text-left">
              {caseItem.caseNo}
            </h4>
            {/* 第二行：案由标签 + 状态 */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-medium bg-white/20 px-2 py-0.5 rounded">
                {caseItem.title}
              </span>
              <span className={`text-sm px-2 py-0.5 rounded font-medium flex-shrink-0 ${
                caseItem.status === '已结案' ? 'bg-status-resolved-bg text-status-resolved' :
                caseItem.status === '审理中' ? 'bg-status-active-bg text-status-active' :
                'bg-bg-muted text-text-secondary'
              }`}>
                {caseItem.status}
              </span>
            </div>
          </div>
          {/* 右侧：待办数 */}
          <button
            onClick={() => setShowTodoPanel(true)}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 rounded-full px-2.5 py-1 transition-colors cursor-pointer flex-shrink-0"
          >
            <Bell size={13} className="text-white" />
            <span className="text-sm font-bold text-white">{caseTodos.length}</span>
            <span className="text-xs text-white/80">待办</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation - 支持横向滚动交互 */}
      <div
        ref={tabListRef}
        role="tablist"
        aria-label="案件详情标签页"
        className="bg-white border-b border-slate-100 flex px-2 py-1.5 flex-shrink-0 overflow-x-auto no-scrollbar gap-1 snap-x snap-mandatory"
        style={{ WebkitOverflowScrolling: 'touch' }}
        onKeyDown={handleTabKeyDown}
      >
        {tabOrder.map((tab) => (
          <button
            key={tab}
            id={`tab-${tab}`}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`tabpanel-${tab}`}
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => setActiveTab(tab)}
            className={`snap-start min-w-[5rem] p-2.5 text-center text-sm transition-all rounded whitespace-nowrap ${
              activeTab === tab
                ? 'text-indigo-600 bg-indigo-50 font-bold'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab === 'basic' ? '基本信息' :
             tab === 'parties' ? '当事人' :
             tab === 'requests' ? '仲裁请求' :
             tab === 'materials' ? '主要材料' :
             tab === 'signature' ? '文书签名' : '裁决书核阅'}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-10 bg-slate-50 text-left">
        {/* Basic Info Tab */}
        {activeTab === 'basic' && (
          <div
            key="basic"
            id="tabpanel-basic"
            role="tabpanel"
            aria-labelledby="tab-basic"
            className="space-y-3 animate-fade-in"
          >
            {/* Key Info Grid */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="grid grid-cols-2 gap-px bg-slate-100 rounded-lg overflow-hidden">
                <div className="bg-white p-2.5">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Calendar size={14} />
                    <span className="text-base">立案日期</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base">{caseItem.startDate}</span>
                </div>
                <div className="bg-white p-2.5">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Calendar size={14} />
                    <span className="text-base">组庭日期</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base">2026-01-01</span>
                </div>
                <div className="bg-white p-2.5">
                  <div className="text-slate-500 mb-1 text-base">争议金额</div>
                  <span className="font-bold text-amber-600 text-base">{formatCNY(caseItem.disputeAmount)}</span> 
                </div>
                <div className="bg-white p-2.5">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Receipt size={14} />
                    <span className="text-base">仲裁费</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base">￥{Math.round(caseItem.disputeAmount * 0.01 / 10000)}万元</span>
                </div>
                <div className="bg-white p-2.5 col-span-2">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <User size={14} />
                    <span className="text-base">办案秘书</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base">王秘书</span>
                  <div className="mt-2 space-y-1.5">
                    <div
                      className="flex items-center gap-1.5 cursor-pointer group/copy"
                      onClick={() => handleCopy('138-0000-0000', 'phone')}
                      title="点击复制"
                      role="button"
                      tabIndex={0}
                    >
                      <Phone size={13} className="text-slate-400 group-hover/copy:text-indigo-500 transition-colors" />
                      <span className="text-slate-600 group-hover/copy:text-indigo-600 transition-colors text-base">138-0000-0000</span>
                      {copiedField === 'phone' ? (
                        <span className="text-xs text-emerald-500 font-bold">已复制</span>
                      ) : (
                        <Copy size={10} className="text-slate-300 group-hover/copy:text-indigo-500 transition-colors" />
                      )}
                    </div>
                    <div
                      className="flex items-center gap-1.5 cursor-pointer group/copy"
                      onClick={() => handleCopy('wangmishu@gzac.org.cn', 'email')}
                      title="点击复制"
                      role="button"
                      tabIndex={0}
                    >
                      <Mail size={13} className="text-slate-400 group-hover/copy:text-indigo-500 transition-colors" />
                      <span className="text-slate-600 group-hover/copy:text-indigo-600 transition-colors text-base">wangmishu@gzac.org.cn</span>  
                      {copiedField === 'email' ? (
                        <span className="text-xs text-emerald-500 font-bold">已复制</span>
                      ) : (
                        <Copy size={10} className="text-slate-300 group-hover/copy:text-indigo-500 transition-colors" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Summary with AI watermark */}
            <div className="bg-white rounded-lg border border-slate-100 p-3 relative overflow-hidden">
              {/* AI watermark - 卡片右上角 */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded z-10">
                <Sparkles size={10} />
                <span>AI生成，仅供参考</span>
              </div>
              <div className="flex items-center gap-1 text-slate-600 font-bold text-base mb-2">
                <FileText size={14} />
                <span>案情摘要</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {caseItem.description}
              </p>
            </div>
          </div>
        )}

        {/* Parties Tab */}
        {activeTab === 'parties' && (
          <div
            key="parties"
            id="tabpanel-parties"
            role="tabpanel"
            aria-labelledby="tab-parties"
            className="space-y-3 animate-fade-in"
          >
            <PartyGroup title="申请人" accent="emerald" parties={applicants} expandedParty={expandedParty} onToggle={setExpandedParty} />
            <PartyGroup title="被申请人" accent="red" parties={respondents} expandedParty={expandedParty} onToggle={setExpandedParty} />
          </div>
        )}

        {/* Arbitration Requests Tab */}
        {activeTab === 'requests' && (
          <div
            key="requests"
            id="tabpanel-requests"
            role="tabpanel"
            aria-labelledby="tab-requests"
            className="space-y-3 animate-fade-in"
          >
            {/* Facts and Reasons */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-slate-600 font-bold text-base mb-2">
                <FileText size={14} />
                <span>事实和理由</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {arbitrationRequest.facts}
              </p>
            </div>

            {/* Request Items */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-slate-600 font-bold text-base mb-2">
                <FileCheck size={14} />
                <span>请求项</span>
              </div>
              <div className="space-y-2">
                {arbitrationRequest.items.map((item, idx) => (
                  <div key={idx} className="bg-indigo-50 rounded-lg p-2.5 text-sm text-slate-700 flex items-start gap-2">
                    <span className="bg-indigo-500 text-white text-[10px] font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Materials Tab */}
        {activeTab === 'materials' && (
          <div
            key="materials"
            id="tabpanel-materials"
            role="tabpanel"
            aria-labelledby="tab-materials"
            className="space-y-3 animate-fade-in"
          >
            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-slate-100 p-2.5 flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="搜索材料名称、类别..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="flex-1 text-sm text-slate-700 outline-none placeholder:text-slate-500"
              />
            </div>

            {/* Materials grouped by category */}
            {Object.entries(groupedMaterials).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
                    <span className="text-base font-bold text-slate-700">{category}</span>
                    <span className="text-xs text-slate-500">{items.length}项</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {items.map((item) => (
                      <div 
                        key={item.id} 
                        className="px-3 py-2.5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => setViewingMaterial(item)}
                      >
                        <div className="flex items-center gap-2">
                          <FileText size={14} className="text-slate-400" />
                          <div>
                            <div className="text-sm font-medium text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-500 mt-0.5">
                              {item.time} • {item.submitter}
                            </div>
                          </div>
                        </div>
                        <button className="text-sm text-indigo-600 font-medium hover:text-indigo-700">
                          查看
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        )}

        {/* Document Signature Tab */}
        {activeTab === 'signature' && (
          <div
            key="signature"
            id="tabpanel-signature"
            role="tabpanel"
            aria-labelledby="tab-signature"
            className="space-y-3 animate-fade-in"
          >
            {/* 庭审笔录附件 */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  <span className="text-base font-bold text-slate-700">庭审笔录</span>
                </div>
                <span className="text-xs text-slate-500">
                  已签 {transcriptList.filter(t => t.signed).length} / 待签 {transcriptList.filter(t => !t.signed).length}
                </span>
              </div>

              {/* 庭审笔录 PDF 列表（多条，带签名状态） */}
              <div className="p-3 space-y-2">
                {transcriptList.map((pdf) => (
                  <div
                    key={pdf.id}
                    onClick={() => {
                      if (pdf.signed) {
                        setViewingPdf({ name: pdf.name, size: pdf.size, pages: pdf.pages });
                      } else {
                        // 未签名 -> 跳转笔录签名详情页
                        onSignTranscript?.({ id: pdf.id, name: pdf.name, pages: pdf.pages, size: pdf.size });
                      }
                    }}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group ${
                      pdf.signed
                        ? 'bg-emerald-50/40 border-slate-100 hover:border-indigo-200'
                        : 'bg-amber-50/40 border-amber-100 hover:border-amber-300'
                    }`}
                  >
                    {/* PDF Icon */}
                    <PdfFileIcon pages={pdf.pages} />
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{pdf.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        
                        {pdf.signed ? (
                          <>
                            
                            <span className="text-xs text-emerald-600 font-medium">已签名 · {pdf.signTime}</span>
                          </>
                        ) : (
                          <>
                            
                            <span className="text-xs text-amber-600 ">未签名</span>
                          </>
                        )}
                      </div>
                    </div>
                    {/* 状态/操作 */}
                    <div className={`flex items-center gap-1 text-sm flex-shrink-0 ${
                      pdf.signed ? 'text-slate-400' : 'text-amber-600 font-bold'
                    }`}>
                      {pdf.signed ? (
                        <>
                          <span>预览</span>
                          <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                        </>
                      ) : (
                        <>
                          <PenTool size={12} />
                          <span>去签名</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Preview */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  <span className="text-base font-bold text-slate-700">仲裁裁决书</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded  ${
                  isSigned
                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                    : 'bg-amber-50 text-amber-600 border border-amber-100'
                }`}>
                  {isSigned ? '已签名' : '待签名'}
                </span>
              </div>

              {/* PDF Attachment List */}
              <div className="p-3 space-y-2">
                {[
                  { name: '仲裁裁决书.pdf', size: '2.8 MB', pages: 12 }
                ].map((pdf, idx) => (
                  <div
                    key={idx}
                    onClick={() => setViewingPdf(pdf)}
                    className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer group"
                  >
                    {/* PDF Icon */}
                    <PdfFileIcon pages={pdf.pages} />
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{pdf.name}</div>
                      <div className="text-sm text-slate-500 mt-0.5">{pdf.pages}页</div>
                    </div>
                    {/* Preview Button */}
                    <div className="flex items-center gap-1 text-indigo-500 text-sm flex-shrink-0">
                      <span>预览</span>
                      <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Confirmation - 直接确认，无需短信/邮箱验证 */}
            {!isSigned ? (
              <div>
                
                {/* Sign Button */}
                <button
                  onClick={() => {
                    setIsSigning(true);
                    setTimeout(() => {
                      setIsSigning(false);
                      setIsSigned(true);
                    }, 1500);
                  }}
                  disabled={isSigning}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSigning ? (
                    <>
                      <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                      <span>签名确认中...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-signature"></i>
                      <span>确认签名</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-500 rounded-full mx-auto flex items-center justify-center">
                  <i className="fa-solid fa-check text-white text-lg"></i>
                </div>
                <div className="text-sm font-bold text-emerald-600">签名完成</div>
                <div className="text-sm text-slate-500">
                  签署时间：{new Date().toISOString().replace('T', ' ').substring(0, 16)}
                </div>
                <div className="text-sm text-slate-500 bg-white/50 rounded p-2 mt-2">
                  CA数字签名编号：0x{Math.random().toString(16).substring(2, 16).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 裁决书核阅 */}
        {activeTab === 'review' && (
          <div
            key="review"
            id="tabpanel-review"
            role="tabpanel"
            aria-labelledby="tab-review"
            className="space-y-3 animate-fade-in"
          >

            {/* Document Overview */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-white border-b border-slate-100">
                <span className="text-base font-bold text-slate-700">文书概览</span>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <span className="text-base font-bold text-slate-700">仲裁请求</span>
                  <p className="text-base text-slate-600 mt-1 leading-relaxed">
                    1. 支付货款人民币1,000,000元<br/>
                    2. 支付逾期付款利息（以1,000,000元为基数，自2025年1月1日起至实际清偿之日止，按照LPR计算）<br/>
                    3. 本案仲裁费用由被申请人承担
                  </p>
                </div>
                <div className="border-t border-dashed border-slate-100 pt-2">
                  <span className="text-base font-bold text-slate-700">被申请人答辩意见</span>
                  <p className="text-base text-slate-600 mt-1 leading-relaxed">
                    被申请人辩称：双方签订的合同中部分条款约定不明，且申请人交付的部分产品存在质量问题，有权拒绝支付相应货款。
                  </p>
                </div>
                <div className="border-t border-dashed border-slate-100 pt-2">
                  <span className="text-base font-bold text-slate-700">举证和质证</span>
                  <div className="mt-1 space-y-1 text-base text-slate-600">
                    <p>• 申请人举证：《采购合同》、送货签收单、增值税发票</p>
                    <p>• 被申请人质证：对真实性无异议，主张签收单不能证明产品无质量问题</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 裁决书核阅流转记录 */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
                <span className="text-base font-bold text-slate-700">核阅流转记录</span>
                
              </div>
              <div className="p-3 space-y-0">
                {/* Record 1: Secretary initiated */}
                <div className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">秘</div>
                    <div className="w-px flex-1 bg-slate-200 mt-1"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-800">测试秘书 发起核阅</span>
                      <span className="text-xs text-slate-400">03-16 10:30</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">裁决书已初审完毕，庭审笔录已同步上传，请专家核阅。</p>
                    <div className="flex gap-2 mt-2">
                      <div className="flex items-center gap-1 text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80">
                        <FileText size={10} />
                        <span>庭审笔录_2026102.pdf</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80">
                        <FileText size={10} />
                        <span>裁决书草稿_v1.docx</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Record 2: Level 1 review */}
                <div className="flex gap-3 pb-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold text-amber-600 flex-shrink-0">一</div>
                    <div className="w-px flex-1 bg-slate-200 mt-1"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-base text-slate-800">一级核阅 - 李专家</span>
                      <span className="text-xs text-slate-400">03-16 11:20</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">建议修改第三部分论述，逻辑需要更清晰。</p>
                    <span className="inline-block mt-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 ">退回修改</span>
                  </div>
                </div>

                {/* Record 3: Secretary modifying */}
                <div className="flex gap-3 pb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">秘</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-base  text-slate-800">测试秘书 修改中</span>
                      <span className="text-xs text-slate-400">03-16 14:30</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">正在根据一级核阅意见进行修改...</p>
                    <span className="inline-block mt-1 text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 ">修改中</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Document */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  <span className="text-base font-bold text-slate-700">裁决书草稿_v2.docx</span>
                </div>
                <span className="text-sm text-slate-400">更新人：测试秘书</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-base text-slate-500">历史版本：</span>
                  <div className="flex gap-1">
                    <span className="text-base text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80">v1</span>
                    <span className="text-base text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 ">v2（当前）</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-base hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                  <FileText size={12} />
                  <span>查看裁决书全文</span>
                </button>
              </div>
            </div>

            {/* Upload Document */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-white border-b border-slate-100 flex items-center justify-between">
                <span className="text-base font-bold text-slate-700">上传文书</span>
                <button
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="text-xs text-indigo-500 cursor-pointer hover:underline flex items-center gap-1"
                >
                  <i className={`fa-solid ${showUploadForm ? 'fa-chevron-up' : 'fa-plus'} text-sm`}></i>
                  <span>{showUploadForm ? '收起' : '上传'}</span>
                </button>
              </div>
              {showUploadForm && (
                <div className="p-3 space-y-3">
                  {/* Remind Target */}
                  <div className="space-y-1.5">
                    <label className="text-base  text-slate-700">提醒对象</label>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['办案秘书', '首席仲裁员', '边裁-赵东', '边裁-王琦'].map((target) => (
                        <button
                          key={target}
                          onClick={() => setUploadRemindTarget(target)}
                          className={`px-2.5 py-1 rounded-lg text-base font-medium transition-all cursor-pointer border ${
                            uploadRemindTarget === target
                              ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                              : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                        >
                          {target}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Remarks */}
                  <div className="space-y-1.5">
                    <label className="text-base  text-slate-700">备注</label>
                    <textarea
                      value={uploadRemark}
                      onChange={(e) => setUploadRemark(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none mt-1"
                      rows={2}
                      placeholder="请输入备注信息..."
                    />
                  </div>

                  {/* Award Attachment */}
                  <div className="space-y-1.5">
                    <label className="text-base  text-slate-700">裁决书附件</label>
                    <div className="space-y-1.5 pt-1">
                      {uploadAwardFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <FileText size={12} className="text-indigo-500" />
                            <span className="text-sm text-slate-700">{file}</span>
                          </div>
                          <button 
                            onClick={() => setUploadAwardFiles(uploadAwardFiles.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <i className="fa-solid fa-xmark text-[10px]"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setUploadAwardFiles([...uploadAwardFiles, `裁决书草稿_v${uploadAwardFiles.length + 1}.docx`])}
                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-plus text-sm"></i>
                        <span>添加裁决书附件</span>
                      </button>
                    </div>
                  </div>

                  {/* Other Attachments */}
                  <div className="space-y-1.5">
                    <label className="text-sm  text-slate-700">其他附件</label>
                    <div className="space-y-1.5 pt-1">
                      {uploadOtherFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <FileText size={12} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{file}</span>
                          </div>
                          <button 
                            onClick={() => setUploadOtherFiles(uploadOtherFiles.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <i className="fa-solid fa-xmark text-sm"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setUploadOtherFiles([...uploadOtherFiles, `补充材料_${uploadOtherFiles.length + 1}.pdf`])}
                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-sm text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-plus text-sm"></i>
                        <span>添加其他附件</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-paper-plane text-base"></i>
                    <span>提交上传</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 待办面板 */}
      {showTodoPanel && (
        <div className="absolute inset-0 bg-black/30 z-[100] animate-fade-in" onClick={() => setShowTodoPanel(false)}>
          <div
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[75%] flex flex-col animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-amber-500" />
                <span className="text-base font-bold text-slate-800">本案待办</span>
                <span className="text-sm bg-amber-50 text-amber-600 px-1.5 py-0.5 rounded">{caseTodos.length}</span>
              </div>
              <button onClick={() => setShowTodoPanel(false)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                <X size={18} />
              </button>
            </div>
            {/* 待办列表 */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
              {caseTodos.map((todo) => (
                <button
                  key={todo.id}
                  onClick={() => {
                    setShowTodoPanel(false);
                    if (todo.target === 'draftAwardList') {
                      // 裁决书核阅 → 切换到核阅 tab
                      setActiveTab('review');
                    } else {
                      // 延期审批/笔录签名 → 跳转子页面
                      onNavigateToSubPage?.(todo.target);
                    }
                  }}
                  className="w-full flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all cursor-pointer text-left group"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    todo.severity === 'urgent' ? 'bg-red-100' : 'bg-amber-100'
                  }`}>
                    {todo.severity === 'urgent' ? (
                      <AlertTriangle size={15} className="text-red-500" />
                    ) : (
                      <Clock size={15} className="text-amber-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${
                        todo.severity === 'urgent' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'
                      }`}>{todo.type}</span>
                      {todo.severity === 'urgent' && <span className="text-2xs text-red-500 font-bold">紧急</span>}
                    </div>
                    <div className="text-sm  text-slate-800 mt-1 group-hover:text-indigo-600 transition-colors">{todo.title}</div>
                  </div>
                  <ChevronRight size={14} className="text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
            {/* 底部 */}
            <div className="px-4 py-2.5 border-t border-slate-100 text-center flex-shrink-0">
              <span className="text-xs text-slate-400">点击待办可前往处理</span>
            </div>
          </div>
        </div>
      )}

      {/* PDF Preview Modal */}
      {viewingPdf && (
        <div className="absolute inset-0 bg-slate-900/95 z-[100] flex flex-col animate-fade-in text-white p-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-9 bg-red-500 rounded flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-white text-[7px] font-black leading-none">PDF</span>
              </div>
              <span className="text-xs font-bold truncate max-w-[220px]">{viewingPdf.name}</span>
            </div>
            <button 
              onClick={() => setViewingPdf(null)}
              className="text-slate-500 hover:text-white p-1 bg-slate-800 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* PDF Content Preview */}
          <div className="flex-1 bg-white text-slate-950 rounded-xl overflow-y-auto relative text-xs">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] transform -rotate-45 pointer-events-none z-10">
              <div className="text-center">
                <div className="text-lg font-bold tracking-widest text-indigo-600">广州仲裁委员会</div>
                <div className="text-xs text-indigo-600">机密文书 • 仅供审阅</div>
              </div>
            </div>

            <div className="p-6 relative z-0 space-y-4">
              {/* Page 1 */}
              <div className="border-b border-slate-100 pb-6">
                <div className="text-center space-y-3 mb-6">
                  <h3 className="text-base font-bold text-slate-900">广州仲裁委员会</h3>
                  <h4 className="text-sm font-bold text-slate-900">仲裁裁决书</h4>
                  <div className="text-xs text-slate-500">{caseItem.caseNo}</div>
                </div>

                <div className="space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p><span className="font-bold text-slate-700">申请人：</span>{caseItem.claimant}</p>
                  <p><span className="font-bold text-slate-700">被申请人：</span>{caseItem.respondent}</p>
                  <p><span className="font-bold text-slate-700">争议金额：</span>{formatCNY(caseItem.disputeAmount)}</p>
                  <p><span className="font-bold text-slate-700">仲裁庭组成：</span>首席仲裁员 张明、边裁 赵东、边裁 王琦</p>
                </div>

                <div className="mt-4 space-y-2 text-xs text-slate-600 leading-relaxed">
                  <p className="font-bold text-slate-700">裁决主文：</p>
                  <p>一、被申请人应于本裁决书送达之日起十五日内向申请人支付违约金人民币壹仟万元整（¥10,000,000.00）。</p>
                  <p>二、被申请人应于本裁决书送达之日起十五日内向申请人返还投资款项人民币伍仟万元整（¥50,000,000.00）。</p>
                  <p>三、本案仲裁费人民币伍拾万元整（¥500,000.00），由被申请人承担。</p>
                  <p>四、驳回申请人的其他仲裁请求。</p>
                </div>

                <div className="mt-6 text-right space-y-1 text-xs">
                  <p className="font-bold text-slate-700">广州仲裁委员会</p>
                  <p className="text-slate-500">{new Date().toISOString().split('T')[0]}</p>
                </div>
              </div>

              {/* Page indicator */}
              <div className="text-center text-xs text-slate-500 py-2">
                — 第 1 页 / 共 {viewingPdf.pages} 页 —
              </div>

              {/* Simulated remaining pages */}
              {viewingPdf.pages > 1 && (
                <div className="space-y-4">
                  {Array.from({ length: Math.min(viewingPdf.pages - 1, 3) }).map((_, i) => (
                    <div key={i} className="border-t border-slate-100 pt-4">
                      <div className="h-32 bg-slate-50 rounded border border-slate-100 flex items-center justify-center text-slate-300">
                        <div className="text-center">
                          <FileText size={24} className="mx-auto mb-1" />
                          <span className="text-[10px]">第 {i + 2} 页内容</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {viewingPdf.pages > 4 && (
                    <div className="text-center text-xs text-slate-500 py-2">
                      — 共 {viewingPdf.pages} 页，已显示前 4 页 —
                    </div>
                  )}
                </div>
              )}

              {isSigned && (
                <div className="border-t border-emerald-200 pt-3 flex items-center justify-end gap-2">
                  <Shield size={14} className="text-emerald-500" />
                  <span className="text-emerald-600 font-bold text-xs">CA数字签名已确认</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-between items-center flex-shrink-0">
            <div className="text-[10px] text-slate-500">
              {viewingPdf.size} • {viewingPdf.pages}页
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewingPdf(null)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => setViewingPdf(null)}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-colors"
              >
                <Download size={12} />
                <span>下载PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Material Preview Modal */}
      {viewingMaterial && (
        <div className="absolute inset-0 bg-slate-900/95 z-[100] flex flex-col animate-fade-in text-white p-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-4 flex-shrink-0">
            <div className="flex items-center gap-2">
              <FileText size={14} className="text-indigo-400" />
              <span className="text-xs font-bold truncate max-w-[250px]">{viewingMaterial.name}</span>
            </div>
            <button 
              onClick={() => setViewingMaterial(null)}
              className="text-slate-500 hover:text-white p-1 bg-slate-800 rounded cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Document Content */}
          <div className="flex-1 bg-white text-slate-950 p-4 rounded-xl overflow-y-auto relative text-xs">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.05] transform -rotate-45 pointer-events-none">
              <div className="text-center">
                <div className="text-xl font-bold tracking-widest text-indigo-600">广州仲裁委员会</div>
                <div className="text-sm text-indigo-600">机密材料 • 仅供审阅</div>
              </div>
            </div>

            <div className="relative z-10">
              <h3 className="text-sm font-bold mb-4">{viewingMaterial.name}</h3>
              
              <div className="bg-slate-50 rounded-lg p-3 mb-3 text-xs text-slate-500">
                <p>提交方：{viewingMaterial.submitter}</p>
                <p>提交时间：{viewingMaterial.time}</p>
                <p>文件大小：{viewingMaterial.size}</p>
              </div>

              {viewingMaterial.content && (
                <p className="leading-relaxed text-slate-600">
                  {viewingMaterial.content}
                </p>
              )}

              {!viewingMaterial.content && (
                <div className="h-32 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400">
                  [ 材料内容预览 ]
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 flex justify-end flex-shrink-0">
            <button
              onClick={() => setViewingMaterial(null)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-xs font-bold transition-colors"
            >
              <Download size={12} />
              <span>下载材料</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
