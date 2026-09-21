import React, { useState, useRef, useEffect } from 'react';
import { Calendar, FileText, Download, User, Building2, FileCheck, Sparkles, Shield, Mail, Phone, PenTool, ChevronRight, ChevronDown, Paperclip, Receipt, MessageSquare, Bell } from 'lucide-react';
import { Case } from '../types';
import { IOSAlert } from './ui/IOSDialog';
import BottomSheet from './BottomSheet';

export type CaseDetailTab = 'basic' | 'casefile' | 'evidence' | 'award' | 'archive';

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

// 请求和答辩 / 反请求和答辩 模块数据结构
interface ClaimReply {
  party: string;       // 答辩主体（含角色说明）
  content: string;     // 答辩内容
  attachment?: string; // 关联 PDF 文件名
}
interface ClaimsModule {
  sections: { title: string; content: string; attachment?: string }[]; // 前置结构化段落（条款/主体/事实等）
  requestItems: string[]; // 请求项列表（编号）
  replies: ClaimReply[];  // 答辩意见列表
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

// 证据和质证 模块数据结构
// 质证信息：质证人 + 质证理由 + 答辩文件（每项证据最多一个质证）
interface CrossExamination {
  examiner: string;    // 质证人
  reason: string;      // 质证理由
  replyFiles: string[]; // 答辩文件列表
  opinions?: string[]; // 质证意见标签：如 ['真实性：确认', '合法性：确认', '关联性：异议']
}
interface CrossEvidenceItem {
  id: number;
  name: string;          // 证据名称
  content: string;       // 证据内容
  attachments: string[]; // 证据附件（每项证据存在多个附件）
  crossExamined?: CrossExamination; // 质证信息（为 null / 缺省表示无质证）
}
interface EvidenceCatalogItem {
  seq: number;
  name: string;
  form: string;   // 证据形式：合同 / 单据 / 财务 ...
  pages: number;
  submitDate: string;
}
interface EvidenceCategory {
  key: 'applicant' | 'respondent' | 'tribunal';
  title: string;         // 分类名：申请人证据 / 被申请人证据 / 仲裁庭依职权调取证据
  noticeFile: string;    // 质证通知文件名
  noticeTime: string;
  noticeUploader: string;
  catalog: EvidenceCatalogItem[]; // 证据目录
  crossList: CrossEvidenceItem[]; // 质证清单
}
interface EvidenceAttachment {
  name: string;
  type: string;   // 附件类型：程序文书 ...
  time: string;
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
        <span className={`${accentBg} text-white text-base px-2 py-0.5 rounded`}>{title}</span>
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
                  <span className="text-sm bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded flex-shrink-0">{party.attribute}</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`} />
              </button>
              {expanded && (
                <div className="px-2.5 pb-2.5 space-y-2 animate-fade-in">
                  <div className="grid grid-cols-1 gap-1.5 pt-1 border-t border-slate-200/70">
                    <div className="text-base"><span className="text-slate-500">{party.idType}：</span><span className="text-slate-700 font-medium">{party.idNo}</span></div>
                    <div className="text-base"><span className="text-slate-500">手机：</span><span className="text-slate-700 font-medium">{party.phone}</span></div>
                    <div className="text-base"><span className="text-slate-500">邮箱：</span><span className="text-slate-700 font-medium">{party.email}</span></div>
                    <div className="text-base"><span className="text-slate-500">法定地址：</span><span className="text-slate-700 font-medium">{party.address}</span></div>
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

// PDF 附件标签 — 关联文件的轻量入口
function AttachmentChip({ name }: { name: string }) {
  return (
    <button className="mt-2 flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80 transition-colors flex-shrink-0">
      <Paperclip size={12} />
      <span>{name}</span>
    </button>
  );
}

// 当事人渐进呈现卡片：主当事人默认展开核心身份，代理人默认收起
// 语义色单一映射：申请人=emerald / 被申请人=red；indigo 仅供附件/交互元素
function PartyAccordion({ label, accent, main, agent, expanded, onToggle, openExtra }: {
  label: string;
  accent: 'emerald' | 'red';
  main?: PartyInfo;
  agent?: PartyInfo;
  expanded: { main: boolean; agent: boolean };
  onToggle: (k: 'main' | 'agent') => void;
  openExtra: (key: 'applicant' | 'respondent') => void;
}) {
  const accentText = accent === 'emerald' ? 'text-emerald-500' : 'text-red-500';
  const accentBg = accent === 'emerald' ? 'bg-emerald-500' : 'bg-red-500';

  const renderRow = (party: PartyInfo, isAgent: boolean, open: boolean, toggle: () => void) => (
    <div key={party.name} className="bg-slate-50 rounded-lg overflow-hidden">
      <button
        onClick={toggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between p-2.5 cursor-pointer hover:bg-slate-100/60 transition-colors"
      >
        <div className="flex items-center gap-2 min-w-0">
          {party.attribute === '企业' ? (
            <Building2 size={14} className={`${accentText} flex-shrink-0`} />
          ) : (
            <User size={14} className={`${accentText} flex-shrink-0`} />
          )}
          <span className="font-bold text-slate-800 text-base truncate">{party.name}</span>
          <span className="text-sm bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded flex-shrink-0">{party.attribute}</span>
          {isAgent && <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded flex-shrink-0">代理人</span>}
        </div>
        <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-2.5 pb-2.5 space-y-2 animate-fade-in">
          <div className="grid grid-cols-1 gap-1.5 pt-1 border-t border-slate-200/70">
            <div className="text-base"><span className="text-slate-500">{party.idType}：</span><span className="text-slate-700 font-medium">{party.idNo}</span></div>
            <div className="text-base"><span className="text-slate-500">手机：</span><span className="text-slate-700 font-medium">{party.phone}</span></div>
            <div className="text-base"><span className="text-slate-500">邮箱：</span><span className="text-slate-700 font-medium">{party.email}</span></div>
            <div className="text-base"><span className="text-slate-500">法定地址：</span><span className="text-slate-700 font-medium">{party.address}</span></div>
          </div>
          {/* 证件附件 */}
          <div className="border-t border-slate-200/70 pt-2">
            <div className="flex items-center gap-1 text-slate-500 text-sm mb-1.5">
              <Paperclip size={12} />
              <span>证件附件</span>
            </div>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              <button
                onClick={() => openExtra('applicant')}
                className="flex-shrink-0 w-16 h-20 bg-white rounded border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <FileText size={16} className="text-slate-400" />
                <span className="text-xs text-slate-500 mt-0.5">{party.attribute === '企业' ? '营业执照' : '身份证'}</span>
              </button>
              <button
                onClick={() => openExtra('respondent')}
                className="flex-shrink-0 w-16 h-20 bg-white rounded border border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all"
              >
                <FileText size={16} className="text-slate-400" />
                <span className="text-xs text-slate-500 mt-0.5">授权委托书</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-white rounded-lg border border-slate-100 p-3">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
        <span className={`${accentBg} text-white text-base px-2 py-0.5 rounded`}>{label}</span>
      </div>
      <div className="space-y-2">
        {main && renderRow(main, false, expanded.main, () => onToggle('main'))}
        {agent && renderRow(agent, true, expanded.agent, () => onToggle('agent'))}
      </div>
    </div>
  );
}

// 请求 / 反请求 模块卡片组 — 复用「请求和答辩」「反请求和答辩」结构（可折叠，重模块默认折叠）
// 语义色单一映射：请求段沿用 被申请人=red，反请求段沿用 申请人=emerald；indigo 仅供 附件/列表序号/交互
function ClaimsModuleGroup({ title, accent, countLabel, open, onToggle, module }: {
  title: string;
  accent: 'emerald' | 'red';
  countLabel: string;
  open: boolean;
  onToggle: () => void;
  module: ClaimsModule;
}) {
  const tagClass = accent === 'red' ? 'bg-red-500' : 'bg-emerald-500';

  return (
    <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-center justify-between px-3 py-2.5 cursor-pointer"
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className={`${tagClass} text-white text-base px-2 py-0.5 rounded flex-shrink-0`}>{title}</span>
          <span className="text-sm text-slate-500 truncate">{countLabel}</span>
        </div>
        <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="border-t border-slate-100 p-3 space-y-3 animate-fade-in">
          {/* 前置结构化段落（条款/主体/事实等）+ 附件 */}
          {module.sections.map((section, idx) => (
            <div key={idx} className="bg-slate-50 rounded-lg border border-slate-100/70 p-3">
              <div className="flex items-center gap-1 text-slate-700 font-bold text-base mb-2">
                <FileText size={14} className="text-indigo-500" />
                <span>{section.title}</span>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">{section.content}</p>
              {section.attachment && <AttachmentChip name={section.attachment} />}
            </div>
          ))}

          {/* 请求列表 */}
          <div className="bg-slate-50 rounded-lg border border-slate-100/70 p-3">
            <div className="flex items-center gap-1 text-slate-700 font-bold text-base mb-2">
              <FileCheck size={14} className="text-indigo-500" />
              <span>请求列表</span>
            </div>
            <div className="divide-y divide-dashed divide-slate-200">
              {module.requestItems.map((item, idx) => (
                <div key={idx} className="text-base text-slate-700 flex items-start gap-2 py-2 first:pt-0">
                  <span className="bg-indigo-500 text-white text-xs font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 答辩意见 */}
          {module.replies.length > 0 && (
            <div className="bg-slate-50 rounded-lg border border-slate-100/70 p-3">
              <div className="flex items-center gap-1 text-slate-700 font-bold text-base mb-2">
                <MessageSquare size={14} className="text-indigo-500" />
                <span>答辩意见</span>
                <span className="text-sm text-slate-400 font-normal">{module.replies.length}条</span>
              </div>
              <div className="divide-y divide-dashed divide-slate-200">
                {module.replies.map((reply, idx) => (
                  <div key={idx} className="py-2 first:pt-0">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className={`${tagClass} text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex-shrink-0`}>答辩{idx + 1}</span>
                      <span className="text-sm font-medium text-slate-600 leading-relaxed">{reply.party}</span>
                    </div>
                    <p className="text-base text-slate-600 leading-relaxed">{reply.content}</p>
                    {reply.attachment && <AttachmentChip name={reply.attachment} />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CaseDetail({ caseItem, onBack, onNavigateToSubPage, initialTab, onSignTranscript }: CaseDetailProps) {
  const [activeTab, setActiveTab] = useState<CaseDetailTab>(initialTab || 'basic');
  const [viewingPdf, setViewingPdf] = useState<{ name: string; size: string; pages: number; signed?: boolean } | null>(null);
  const [isSigning, setIsSigning] = useState(false);
  const [showSignConfirm, setShowSignConfirm] = useState(false);
  const [showTodoPanel, setShowTodoPanel] = useState(false);

  // 待办数据（Banner 右上角角标 + 待办面板）
  const caseTodos = [
    { id: 'award', title: '裁决书待核阅', desc: '仲裁庭已作出裁决，待核阅', target: 'award', count: 1 },
    { id: 'postpone', title: '延期开庭审批', desc: '有延期开庭申请待处理', target: 'postponementApproval', count: 1 },
    { id: 'transcript', title: '庭审笔录待签名', desc: '有 2 份笔录等待签名', target: 'transcriptSignature', count: 2 },
  ] as const;
  const caseTodoCount = caseTodos.reduce((sum, t) => sum + (t.count ?? 1), 0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadRemindTarget, setUploadRemindTarget] = useState('');
  const [uploadRemark, setUploadRemark] = useState('');
  const [uploadAwardFiles, setUploadAwardFiles] = useState<string[]>([]);
  const [uploadOtherFiles, setUploadOtherFiles] = useState<string[]>([]);
  // 当事人渐进呈现：主当事人默认展开核心身份，代理人默认收起（key: 'applicant'/'respondent'）
  const [expandedMain, setExpandedMain] = useState<Record<string, boolean>>({ applicant: true, respondent: true });
  const [expandedAgent, setExpandedAgent] = useState<Record<string, boolean>>({});
  // 案情模块折叠状态：请求/反请求/其他附件默认折叠
  const [casefileOpen, setCasefileOpen] = useState<Record<string, boolean>>({ requests: false, counter: false, other: false });
  // 证据和质证：当前选中的证据分类（申请人 / 被申请人 / 仲裁庭依职权）
  const [activeEvidenceKey, setActiveEvidenceKey] = useState<'applicant' | 'respondent' | 'tribunal'>('applicant');
  // 次级参考区默认折叠，让证据清单成为页面唯一焦点
  const [showEvidenceCatalog, setShowEvidenceCatalog] = useState(false);
  const [showEvidenceNotice, setShowEvidenceNotice] = useState(false);
  const [evidenceFilter, setEvidenceFilter] = useState<'all' | 'cross' | 'none'>('all');
  const tabListRef = useRef<HTMLDivElement>(null);

  // Tab 顺序数组（用于键盘导航）
  const tabOrder = ['basic', 'casefile', 'evidence', 'award', 'archive'] as const;
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

  // 仲裁裁决书列表（多条，带签名状态）
  const [awardList, setAwardList] = useState([
    { id: 'a1', name: '仲裁裁决书.pdf', size: '2.8 MB', pages: 12, signed: false, signTime: '' },
    { id: 'a2', name: '仲裁裁决书_补充意见.pdf', size: '1.6 MB', pages: 8, signed: true, signTime: '2026-02-10 14:30' },
    { id: 'a3', name: '仲裁裁决书_更正版.pdf', size: '2.5 MB', pages: 11, signed: true, signTime: '2026-02-15 09:12' },
  ]);

  // 待签名的裁决书（仅 1 份）
  const pendingAward = awardList.find(a => !a.signed);
  const signedAwards = awardList.filter(a => a.signed);

  // 确认签名裁决书
  const handleSignAward = () => {
    if (!pendingAward || isSigning) return;
    setIsSigning(true);
    setTimeout(() => {
      setAwardList(prev => prev.map(a => !a.signed ? {
        ...a,
        signed: true,
        signTime: new Date().toISOString().replace('T', ' ').substring(0, 16),
      } : a));
      setIsSigning(false);
    }, 1500);
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

  // Mock 请求和答辩 数据（仲裁条款 / 主体签章 / 事实理由 / 请求列表 / 答辩意见）
  const claimsModule: ClaimsModule = {
    sections: [
      {
        title: '仲裁条款约定情况',
        content: '双方于 2023 年 5 月签订的《合作协议》第十二条约定："凡因本合同引起的或与本合同有关的任何争议，均提交广州仲裁委员会按其现行仲裁规则进行仲裁。仲裁裁决是终局的，对双方均有约束力。"',
        attachment: '合作协议（含仲裁条款）.pdf',
      },
      {
        title: '合同签订主体及签章情况',
        content: '合同由申请人广州天河科技投资有限公司（甲方）与被申请人深圳南山创新发展有限公司（乙方）签订，双方均加盖公司公章，法定代表人或授权代表签字齐全。',
        attachment: '合同签章页扫描件.pdf',
      },
      {
        title: '事实和理由',
        content: '2023 年 5 月，申请人与被申请人签订《合作协议》，约定双方共同开发某科技项目，被申请人应在收到投资款后 6 个月内完成开发并交付。申请人已按约支付投资款 5000 万元，但被申请人未能按期完成项目开发，经申请人多次催告后仍拒不履行合同义务。被申请人的行为已构成违约，应承担违约金及返还投资款等违约责任。',
        attachment: '仲裁申请书.pdf',
      },
    ],
    requestItems: [
      '请求裁决被申请人向申请人支付违约金人民币1000万元',
      '请求裁决被申请人返还申请人已支付的投资款项人民币5000万元',
      '请求裁决被申请人赔偿申请人因违约造成的经济损失人民币2000万元',
      '请求裁决本案仲裁费用由被申请人承担',
    ],
    replies: [
      {
        party: '深圳南山创新发展有限公司（被申请人）',
        content: '被申请人确认收到投资款项，但主张项目开发延期系因申请人未按时提供必要的技术支持与配合所致，故不应承担违约责任。',
        attachment: '答辩状.pdf',
      },
      {
        party: '深圳南山创新发展有限公司（被申请人）',
        content: '违约金计算标准过高，且与申请人的实际损失不符，请求依法予以调整。',
      },
    ],
  };

  // Mock 反请求和答辩 数据（反请求事实 / 反请求列表 / 反请求答辩意见）
  const counterClaimsModule: ClaimsModule = {
    sections: [
      {
        title: '反请求事实和理由',
        content: '被申请人于 2024 年提出反请求：因申请人派驻人员的部分技术方案存在缺陷，导致项目关键模块开发受阻，产生额外调试与整改成本。申请人应承担相应违约责任并赔偿损失。',
        attachment: '反请求申请书.pdf',
      },
    ],
    requestItems: [
      '请求裁决申请人赔偿被申请人额外开发成本人民币300万元',
      '请求裁决申请人赔偿被申请人整改损失人民币80万元',
      '请求裁决反请求仲裁费用由申请人承担',
    ],
    replies: [
      {
        party: '广州天河科技投资有限公司（申请人）',
        content: '相关技术方案均已按约定评审并经被申请人确认，且被申请人未在约定期限内提出异议，应视为认可。',
        attachment: '反请求答辩状.pdf',
      },
      {
        party: '广州天河科技投资有限公司（申请人）',
        content: '整改损失与所涉技术方案之间的因果关系缺乏证据支持，损失金额计算依据不足。',
      },
    ],
  };

  // Mock 证据和质证 数据（三大证据分类：申请人 / 被申请人 / 仲裁庭依职权调取）
  const evidenceCats: EvidenceCategory[] = [
    {
      key: 'applicant',
      title: '申请人证据',
      noticeFile: '质证通知（申请人）.pdf',
      noticeTime: '2026-06-10 15:00',
      noticeUploader: '刘秘书',
      catalog: [
        { seq: 1, name: '买卖合同', form: '合同', pages: 6, submitDate: '2026-03-15' },
        { seq: 2, name: '送货单（8 份）', form: '单据', pages: 16, submitDate: '2026-03-15' },
        { seq: 3, name: '对账单', form: '财务', pages: 4, submitDate: '2026-03-15' },
      ],
      crossList: [
        {
          id: 1,
          name: '买卖合同',
          content: '双方于 2025 年 3 月 10 日签订的《买卖合同》全本，含仲裁条款，约定申请人向被申请人供应货物，合同总金额 350 万元。',
          attachments: ['合同.pdf', '签章页.jpg', '补充协议.pdf'],
          crossExamined: { examiner: '被申请人 上海远东物流有限公司', reason: '对合同真实性无异议，但主张货款结算应以 2025 年 4 月签署的补充协议为准。', replyFiles: ['质证答辩书.pdf', '补充协议.pdf'], opinions: ['真实性：确认', '合法性：确认', '关联性：异议'] },
        },
        {
          id: 2,
          name: '送货单（8 份）',
          content: '申请人分 8 批供货的送货单，均有被申请人相关人员的签收记录。',
          attachments: ['送货单01.pdf', '送货单02.pdf', '送货单03.pdf', '送货单04.pdf', '送货单05.pdf', '送货单06.pdf', '送货单07.pdf', '送货单08.pdf'],
        },
        {
          id: 3,
          name: '对账单',
          content: '申请人与被申请人核对确认的往来对账单，载明应收货款合计。',
          attachments: ['对账单.pdf', '往来明细.xlsx'],
          crossExamined: { examiner: '被申请人 上海远东物流有限公司', reason: '对账金额无异议，但主张其中部分款项系双方其他合作项目所产生，不应并入本案货款。', replyFiles: ['质证答辩书.pdf'] },
        },
      ],
    },
    {
      key: 'respondent',
      title: '被申请人证据',
      noticeFile: '质证通知（被申请人）.pdf',
      noticeTime: '2026-06-12 10:30',
      noticeUploader: '刘秘书',
      catalog: [
        { seq: 1, name: '产品质量异议函', form: '函件', pages: 3, submitDate: '2026-04-05' },
        { seq: 2, name: '货物检测报告', form: '报告', pages: 12, submitDate: '2026-04-20' },
      ],
      crossList: [
        {
          id: 1,
          name: '产品质量异议函',
          content: '被申请人在收货后向申请人发出的书面质量异议函，主张部分批次货物存在性能指标偏差。',
          attachments: ['异议函.pdf'],
          crossExamined: { examiner: '申请人 上海宏图贸易有限公司', reason: '申请人收货时未在合同约定的检验期限内提出书面异议，应视为货物质量合格，不再支持质量主张。', replyFiles: ['质证答辩书.pdf', '签收记录.pdf'], opinions: ['真实性：异议', '合法性：确认', '关联性：确认'] },
        },
        {
          id: 2,
          name: '货物检测报告',
          content: '被申请人单方委托检测机构出具的货物检测报告及所依据的检验标准。',
          attachments: ['检测报告.pdf', '检验标准.pdf'],
        },
      ],
    },
    {
      key: 'tribunal',
      title: '仲裁庭依职权调取证据',
      noticeFile: '质证通知（仲裁庭）.pdf',
      noticeTime: '2026-06-15 09:00',
      noticeUploader: '刘秘书',
      catalog: [
        { seq: 1, name: '银行流水调取记录', form: '记录', pages: 8, submitDate: '2026-05-10' },
      ],
      crossList: [
        {
          id: 1,
          name: '银行流水调取记录',
          content: '仲裁庭依职权向银行调取的双方款项往来流水记录。',
          attachments: ['银行流水.pdf'],
          crossExamined: { examiner: '双方共同确认', reason: '双方对款项收支记录的真实性与完整性均无异议。', replyFiles: [], opinions: ['真实性：确认', '合法性：确认', '关联性：确认'] },
        },
      ],
    },
  ];

  // 案件材料 PDF 拆分归属：
  // 仲裁申请书 → 事实和理由段（见 claimsModule.sections[2].attachment）
  // 申请人/被申请人答辩状 → 答辩附件（见 claimsModule.replies / counterClaimsModule.replies）
  // 合作协议 / 签章页 → 合同签订主体及签章段（见 claimsModule.sections[0]/[1].attachment）
  // 以下无法归入上述段落的材料进入「其他附件」兜底模块
  const otherAttachments = [
    '银行转账凭证.pdf',
    '催告函及送达证明.pdf',
    '项目进度报告.pdf',
    '技术困难说明.pdf',
    '仲裁庭组成通知书.pdf',
    '开庭通知书.pdf',
  ];

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

      {/* Case Banner - 专业克制风格 */}
      <div className="bg-indigo-600 text-white px-4 py-3.5 flex-shrink-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            {/* 第一行：案号 */}
            <h4 className="text-lg font-bold text-white text-left">
              {caseItem.caseNo}
            </h4>
            {/* 第二行：案由标签 + 状态 */}
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-sm font-medium bg-white/15 px-2 py-0.5 rounded">
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
          {/* 右上角待办入口 */}
          <button
            onClick={() => setShowTodoPanel(v => !v)}
            aria-expanded={showTodoPanel}
            aria-label="查看待办信息"
            className={`relative flex flex-col items-center gap-0.5 text-white border border-white/20 rounded-lg px-2 py-1.5 flex-shrink-0 self-start cursor-pointer transition-colors ${showTodoPanel ? 'bg-white/20' : 'hover:bg-white/15'}`}
          >
            <span className="relative leading-none">
              <Bell size={18} />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[16px] px-1 text-center leading-[16px]">
                {caseTodoCount}
              </span>
            </span>
            <span className="text-2xs leading-tight mt-0.5">待办</span>
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
            className={`snap-start  p-2.5 text-center text-base transition-all rounded whitespace-nowrap ${
              activeTab === tab
                ? 'text-indigo-600 bg-indigo-50 '
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab === 'basic' ? '基本信息' :
             tab === 'casefile' ? '案情及当事人材料' :
             tab === 'evidence' ? '证据和质证' :
             tab === 'award' ? '仲裁文书' : '电子卷宗'}
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
                    <a
                      href="tel:13800000000"
                      className="flex items-center gap-1.5 cursor-pointer group/phone"
                    >
                      <Phone size={13} className="text-slate-400 group-hover/phone:text-indigo-500 transition-colors" />
                      <span className="text-slate-600 group-hover/phone:text-indigo-600 transition-colors text-base">138-0000-0000</span>
                    </a>
                    <a
                      href="mailto:wangmishu@gzac.org.cn"
                      className="flex items-center gap-1.5 cursor-pointer group/mail"
                    >
                      <Mail size={13} className="text-slate-400 group-hover/mail:text-indigo-500 transition-colors" />
                      <span className="text-slate-600 group-hover/mail:text-indigo-600 transition-colors text-base">wangmishu@gzac.org.cn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Summary with AI watermark */}
            <div className="bg-white rounded-lg border border-slate-100 p-3 relative overflow-hidden">
              {/* AI watermark - 卡片右上角 */}
              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-sm text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded z-10">
                <Sparkles size={10} />
                <span>AI生成，仅供参考</span>
              </div>
              <div className="flex items-center gap-1 text-slate-700 font-bold text-base mb-2">
                <FileText size={14} />
                <span>案情摘要</span>
              </div>
              <p className="text-base text-slate-600 leading-relaxed">
                {caseItem.description}
              </p>
            </div>
          </div>
        )}

        {/* 案情及当事人材料（长滚 + 模块可折叠） */}
        {activeTab === 'casefile' && (
          <div
            key="casefile"
            id="tabpanel-casefile"
            role="tabpanel"
            aria-labelledby="tab-casefile"
            className="space-y-3 animate-fade-in"
          >
            {/* 当事人：主当事人默认展开，代理人默认收起 */}
            <PartyAccordion
              label="申请人"
              accent="emerald"
              main={applicants[0]}
              agent={applicants[1]}
              expanded={{ main: !!expandedMain.applicant, agent: !!expandedAgent.applicant }}
              onToggle={(k) => {
                if (k === 'main') setExpandedMain(s => ({ ...s, applicant: !s.applicant }));
                else setExpandedAgent(s => ({ ...s, applicant: !s.applicant }));
              }}
              openExtra={() => {}}
            />
            <PartyAccordion
              label="被申请人"
              accent="red"
              main={respondents[0]}
              agent={respondents[1]}
              expanded={{ main: !!expandedMain.respondent, agent: !!expandedAgent.respondent }}
              onToggle={(k) => {
                if (k === 'main') setExpandedMain(s => ({ ...s, respondent: !s.respondent }));
                else setExpandedAgent(s => ({ ...s, respondent: !s.respondent }));
              }}
              openExtra={() => {}}
            />

            {/* 请求和答辩（默认折叠，带计数） */}
            <ClaimsModuleGroup
              title="请求和答辩"
              accent="red"
              countLabel={`${claimsModule.requestItems.length} 项请求 · ${claimsModule.replies.length} 份答辩`}
              open={!!casefileOpen.requests}
              onToggle={() => setCasefileOpen(s => ({ ...s, requests: !s.requests }))}
              module={claimsModule}
            />

            {/* 反请求和答辩（默认折叠，带计数） */}
            <ClaimsModuleGroup
              title="反请求和答辩"
              accent="emerald"
              countLabel={`${counterClaimsModule.requestItems.length} 项请求 · ${counterClaimsModule.replies.length} 份答辩`}
              open={!!casefileOpen.counter}
              onToggle={() => setCasefileOpen(s => ({ ...s, counter: !s.counter }))}
              module={counterClaimsModule}
            />

            {/* 其他附件（兜底，默认折叠） */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <button
                onClick={() => setCasefileOpen(s => ({ ...s, other: !s.other }))}
                aria-expanded={!!casefileOpen.other}
                className="w-full flex items-center justify-between px-3 py-2.5 cursor-pointer"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="bg-slate-700 text-white text-base px-2 py-0.5 rounded flex-shrink-0">其他附件</span>
                  <span className="text-sm text-slate-500 truncate">{otherAttachments.length} 份</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 flex-shrink-0 transition-transform ${casefileOpen.other ? 'rotate-180' : ''}`} />
              </button>
              {casefileOpen.other && (
                <div className="border-t border-slate-100 p-3 flex flex-wrap gap-2 animate-fade-in">
                  {otherAttachments.map(name => (
                    <span key={name} className="contents">
                      <AttachmentChip name={name} />
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Evidence & Cross-Examination Tab */}
        {activeTab === 'evidence' && (
          <div
            key="evidence"
            id="tabpanel-evidence"
            role="tabpanel"
            aria-labelledby="tab-evidence"
            className="space-y-4 animate-fade-in"
          >
            {/* 证据分类切换（申请人 / 被申请人 / 仲裁庭依职权）：tag 形式，数量随文字右侧 */}
            <div
              role="tablist"
              aria-label="证据分类"
              className="flex flex-wrap gap-2"
            >
              {evidenceCats.map((cat) => {
                const active = activeEvidenceKey === cat.key;
                return (
                  <button
                    key={cat.key}
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveEvidenceKey(cat.key)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 transition-colors cursor-pointer ${
                      active
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base font-medium">{cat.title}</span>
                    <span className={`text-sm ${active ? 'text-indigo-400' : 'text-slate-400'}`}>
                      {cat.catalog.length}项
                    </span>
                  </button>
                );
              })}
            </div>

            {evidenceCats.filter(c => c.key === activeEvidenceKey).map((cat) => {
              const crossCount = cat.crossList.filter(c => c.crossExamined).length;
              const noneCount = cat.crossList.length - crossCount;
              const filtered = cat.crossList.filter(ev =>
                evidenceFilter === 'all' ? true : evidenceFilter === 'cross' ? ev.crossExamined : !ev.crossExamined
              );
              const filters = [
                { key: 'all' as const, label: '全部', count: cat.crossList.length },
                { key: 'cross' as const, label: '有质证', count: crossCount },
                { key: 'none' as const, label: '无质证', count: noneCount },
              ];
              return (
              <div key={cat.key} className="space-y-3">
                {/* 质证通知（可折叠，样式同证据目录） */}
                <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => setShowEvidenceNotice(v => !v)}
                    aria-expanded={showEvidenceNotice}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-slate-600 font-medium text-base">
                      <span>质证通知</span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition-transform duration-200 ${showEvidenceNotice ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showEvidenceNotice && (
                    <div className="border-t border-slate-100 animate-fade-in">
                      <button
                        onClick={() => setViewingPdf({ name: cat.noticeFile, size: '1.2 MB', pages: 1 })}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                        aria-label={`预览 ${cat.noticeFile}`}
                      >
                        <FileText size={15} className="text-red-400 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-base font-medium text-slate-800 truncate">{cat.noticeFile}</div>
                          <div className="text-sm text-slate-400 mt-0.5">{cat.noticeTime}</div>
                        </div>
                        <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 证据目录（默认折叠，附件行形式） */}
                <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                  <button
                    onClick={() => setShowEvidenceCatalog(v => !v)}
                    aria-expanded={showEvidenceCatalog}
                    className="w-full flex items-center justify-between px-4 py-3 cursor-pointer"
                  >
                    <div className="flex items-center gap-1 text-slate-600 font-medium text-base">
                      <span>证据目录</span>
                      <span className="text-sm text-slate-400 font-normal">共{cat.catalog.length}项</span>
                    </div>
                    <ChevronDown
                      size={15}
                      className={`text-slate-400 transition-transform duration-200 ${showEvidenceCatalog ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {showEvidenceCatalog && (
                    <div className="border-t border-slate-100 divide-y divide-slate-100 animate-fade-in">
                      {cat.catalog.map((row) => (
                        <button
                          key={row.seq}
                          onClick={() => setViewingPdf({ name: `${row.name}.pdf`, size: '1.2 MB', pages: row.pages })}
                          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors cursor-pointer"
                          aria-label={`预览 ${row.name}`}
                        >
                          <FileText size={15} className="text-red-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <div className="text-base font-medium text-slate-800 flex items-center gap-2">
                              <span className="truncate">{row.name}</span>
                            </div>
                            <div className="text-sm text-slate-400 mt-0.5">
                              {row.submitDate}
                            </div>
                          </div>
                          <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 证据清单（本 Tab 唯一主内容卡） */}
                <div className="bg-white rounded-lg border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-slate-700 font-bold text-base">
                      <span>证据清单</span>
                      <span className="text-sm text-slate-400 font-normal">共{filtered.length}项</span>
                    </div>
                  </div>
                  {/* 快捷筛选：全部 / 有质证 / 无质证 */}
                  <div role="tablist" aria-label="质证状态筛选" className="flex flex-wrap gap-1.5 mb-3">
                    {filters.map((f) => {
                      const active = evidenceFilter === f.key;
                      return (
                        <button
                          key={f.key}
                          role="tab"
                          aria-selected={active}
                          onClick={() => setEvidenceFilter(f.key)}
                          className={`inline-flex items-center gap-1 rounded border px-2.5 py-1 text-base transition-colors cursor-pointer ${
                            active
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-600'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{f.label}</span>
                          <span className={`${active ? 'text-indigo-400' : 'text-slate-400'}`}>{f.count}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="space-y-3">
                    {filtered.map((ev) => (
                      <div key={ev.id} className="bg-slate-50/50 rounded-lg p-3"> 
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="bg-indigo-500 text-white text-xs font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0">
                              {ev.id}
                            </span>
                            <span className="text-base font-medium text-slate-800">{ev.name}</span>
                          </div>
                          <span className={`flex-shrink-0 text-sm px-2 py-0.5 rounded ${ev.crossExamined ? 'text-amber-600 bg-amber-50 border-amber-100/50' : 'bg-slate-100 text-slate-400'}`}>
                            {ev.crossExamined ? '有质证' : '无'}
                          </span>
                        </div>
                        {/* 证据内容 */}
                        <p className="text-base text-slate-600 leading-relaxed mt-2">{ev.content}</p>
                        {/* 证据附件列表 */}
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                          {ev.attachments.map((att) => (
                            <button
                              key={att}
                              onClick={() => setViewingPdf({ name: att, size: '1.2 MB', pages: 1 })}
                              className="flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80 transition-colors"
                            >
                              <Paperclip size={12} />
                              <span>{att}</span>
                            </button>
                          ))}
                        </div>
                        {/* 质证详情：质证意见 + 质证人 + 质证理由 + 答辩文件 */}
                        {ev.crossExamined && (
                          <div className="mt-2.5 border-t border-slate-200 pt-2.5 space-y-1.5  ">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">质证</span>
                              {(ev.crossExamined.opinions?.length ?? 0) > 0 && ev.crossExamined.opinions!.map((op) => {
                                const affirm = op.includes('确认');
                                return (
                                  <span
                                    key={op}
                                    className={`text-sm px-1.5 py-0.5 rounded ${affirm ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                                  >
                                    {op}
                                  </span>
                                );
                              })}
                            </div>
                            <div className="flex text-sm leading-relaxed">
                              {/* <span className="text-slate-400 w-14 flex-shrink-0">质证人</span> */}
                              <span className="text-slate-700">{ev.crossExamined.examiner}</span>
                            </div>
                            <div className="flex text-sm leading-relaxed">
                              {/* <span className="text-slate-400 w-14 flex-shrink-0">质证理由</span> */}
                              <p className="text-slate-600 flex-1">{ev.crossExamined.reason}</p>
                            </div>
                            {ev.crossExamined.replyFiles.length > 0 && (
                              <div className="flex text-sm">
                                {/* <span className="text-slate-400 w-14 flex-shrink-0">答辩文件</span> */}
                                <div className="flex flex-wrap gap-x-3 gap-y-1 flex-1">
                                  {ev.crossExamined.replyFiles.map((file) => (
                                    <button
                                      key={file}
                                      onClick={() => setViewingPdf({ name: file, size: '1.2 MB', pages: 1 })}
                                      className="flex items-center gap-1 text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80 transition-colors"
                                    >
                                      <Paperclip size={12} />
                                      <span>{file}</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        )}

        {/* 电子卷宗（占位空态） */}
        {activeTab === 'archive' && (
          <div
            key="archive"
            id="tabpanel-archive"
            role="tabpanel"
            aria-labelledby="tab-archive"
            className="space-y-3 animate-fade-in"
          >
            <div className="bg-white rounded-lg border border-slate-100 py-14 px-6 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 flex items-center justify-center mb-3">
                <FileText size={26} className="text-indigo-400" />
              </div>
              <div className="text-base font-bold text-slate-800">电子卷宗</div>
              <p className="text-sm text-slate-400 mt-1.5">后续实现</p>
            </div>
          </div>
        )}

        {/* 仲裁文书（上部核阅 + 下部签名） */}
        {activeTab === 'award' && (
          <div
            key="award"
            id="tabpanel-award"
            role="tabpanel"
            aria-labelledby="tab-award"
            className="space-y-3 animate-fade-in"
          >
            {/* 待办提示徽章：未签裁决书/待核阅（承接被移除的待办入口） */}
            {(pendingAward || transcriptList.some(t => !t.signed)) && (
              <div className="flex flex-wrap gap-2">
                {pendingAward && (
                  <button
                    onClick={() => setViewingPdf({ name: pendingAward.name, size: pendingAward.size, pages: pendingAward.pages, signed: pendingAward.signed })}
                    className="flex items-center gap-1.5 text-sm text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100 cursor-pointer"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>裁决书待签名</span>
                  </button>
                )}
                {transcriptList.some(t => !t.signed) && (
                  <span className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>庭审笔录待签名</span>
                  </span>
                )}
              </div>
            )}

            {/* ── 上部：裁决书核阅区（原 review）── */}
            <div className="space-y-3">
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
                    <p className="text-base text-slate-500 mt-1">裁决书已初审完毕，庭审笔录已同步上传，请专家核阅。</p>
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
                    <p className="text-base text-slate-500 mt-1">建议修改第三部分论述，逻辑需要更清晰。</p>
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
                    <p className="text-base text-slate-500 mt-1">正在根据一级核阅意见进行修改...</p>
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
                  className="text-base text-indigo-500 cursor-pointer hover:underline flex items-center gap-1"
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
                    <label className="text-sm text-slate-700">裁决书附件</label>
                    <div className="space-y-1.5 pt-1">
                      {uploadAwardFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <FileText size={12} className="text-slate-400" />
                            <span className="text-sm text-slate-700">{file}</span>
                          </div>
                          <button
                            onClick={() => setUploadAwardFiles(uploadAwardFiles.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 cursor-pointer p-2"
                            aria-label={`删除 ${file}`}
                          >
                            <i className="fa-solid fa-xmark text-xs"></i>
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
                            className="text-slate-400 hover:text-red-500 cursor-pointer p-2"
                            aria-label={`删除 ${file}`}
                          >
                            <i className="fa-solid fa-xmark text-xs"></i>
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
                  <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-base font-bold hover:bg-indigo-500 transition-colors flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-paper-plane text-base"></i>
                    <span>提交上传</span>
                  </button>
                </div>
              )}
            </div>
            </div>

            {/* ── 下部：文书签名区（原 signature，含 P0 二次确认与 P1 跳转/降级，完整保留）── */}
            <div className="space-y-3">
            {/* 庭审笔录附件 */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  <span className="text-base font-bold text-slate-700">庭审笔录</span>
                </div>
                <span className="text-sm text-slate-500">
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
                        setViewingPdf({ name: pdf.name, size: pdf.size, pages: pdf.pages, signed: pdf.signed });
                      } else if (onSignTranscript) {
                        // 未签名 -> 跳转笔录签名详情页
                        onSignTranscript({ id: pdf.id, name: pdf.name, pages: pdf.pages, size: pdf.size });
                      } else {
                        // 未接通跳转回调时回退到预览，避免点击无响应
                        setViewingPdf({ name: pdf.name, size: pdf.size, pages: pdf.pages, signed: false });
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
                      <div className="text-base font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{pdf.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {pdf.signed ? (
                          <>
                            <span className="text-sm text-emerald-600 font-medium">已签名 · {pdf.signTime}</span>
                          </>
                        ) : (
                          <>
                            <span className="text-sm text-amber-600 ">未签名</span>
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

            {/* 仲裁裁决书 - 已签名模块（可能多份，在上） */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-emerald-500" />
                  <span className="text-base font-bold text-slate-700">裁决书 · 已签名</span>
                </div>
                <span className="text-sm px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">
                  已签 {signedAwards.length} 份
                </span>
              </div>

              <div className="p-3 space-y-2">
                {signedAwards.length > 0 ? (
                  signedAwards.map((pdf) => (
                    <div
                      key={pdf.id}
                      onClick={() => setViewingPdf({ name: pdf.name, size: pdf.size, pages: pdf.pages, signed: pdf.signed })}
                      className="flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group bg-emerald-50/40 border-slate-100 hover:border-indigo-200"
                    >
                      <PdfFileIcon pages={pdf.pages} />
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{pdf.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm text-emerald-600 font-medium">已签名 · {pdf.signTime}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm flex-shrink-0 text-slate-400">
                        <span>预览</span>
                        <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-slate-400">
                    <i className="fa-regular fa-folder-open text-slate-300 text-2xl mb-2"></i>
                    <div>暂无已签名裁决书</div>
                  </div>
                )}
              </div>
            </div>

            {/* 仲裁裁决书 - 待签名模块（仅 1 份，在下） */}
            {pendingAward && (
              <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                <div className="flex items-center justify-between px-3 py-2.5 bg-white border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText size={14} className="text-amber-500" />
                    <span className="text-base font-bold text-slate-700">裁决书 · 待签名</span>
                  </div>
                  <span className="text-sm px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-100">
                    待签 1 份
                  </span>
                </div>

                <div className="p-3 space-y-2">
                  <div
                    onClick={() => setViewingPdf({ name: pendingAward.name, size: pendingAward.size, pages: pendingAward.pages, signed: pendingAward.signed })}
                    className="flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer group bg-amber-50/40 border-amber-100 hover:border-amber-300"
                  >
                    <PdfFileIcon pages={pendingAward.pages} />
                    <div className="flex-1 min-w-0">
                      <div className="text-base font-medium text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{pendingAward.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-sm text-amber-600">未签名</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm flex-shrink-0 text-slate-400">
                      <span>预览</span>
                      <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                    </div>
                  </div>
                </div>

                {/* 确认签名按钮（P0 二次确认 -> IOSAlert） */}
                <button
                  onClick={() => setShowSignConfirm(true)}
                  disabled={isSigning}
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-base hover:bg-indigo-700 transition-all active:scale-95 shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 m-3 mt-0"
                  style={{ width: 'calc(100% - 1.5rem)' }}
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
            )}
            </div>
          </div>
        )}
      </div>

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

              {viewingPdf.signed && (
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

      {/* 确认签署裁决书（不可逆，二次确认） */}
      {showSignConfirm && pendingAward && (
        <IOSAlert
          title="确认签署裁决书？"
          message={`确认签署《${pendingAward.name}》？签署后不可撤销，请确认已核阅文书内容。`}
          overlayClassName="absolute inset-0 z-[70]"
          actions={[
            { label: '取消', style: 'cancel', onPress: () => setShowSignConfirm(false) },
            {
              label: '确认签署',
              style: 'destructive',
              onPress: () => {
                setShowSignConfirm(false);
                handleSignAward();
              },
            },
          ]}
        />
      )}

      {/* 待办面板（底部弹出样式 BottomSheet） */}
      <BottomSheet open={showTodoPanel} onClose={() => setShowTodoPanel(false)} title="待办事项">
        <div className="space-y-1 divide-y divide-slate-100" role="menu">
          {caseTodos.map((todo) => {
            // P1 降级：非「裁决书核阅」且跳转子页回调缺失时禁用，避免点击无响应
            const disabled = todo.target !== 'award' && !onNavigateToSubPage;
            return (
              <button
                key={todo.id}
                disabled={disabled}
                onClick={() => {
                  setShowTodoPanel(false);
                  if (todo.target === 'award') {
                    setActiveTab('award');
                  } else {
                    onNavigateToSubPage?.(todo.target);
                  }
                }}
                className={`w-full flex items-center gap-3 py-3 text-left transition-colors ${
                  disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:bg-slate-50'
                }`}
              >
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${disabled ? 'bg-slate-300' : 'bg-red-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-base font-medium text-slate-800 flex items-center gap-2">
                    <span className="truncate">{todo.title}</span>
                    {todo.count > 1 && (
                      <span className="text-xs px-1.5 py-0.5 rounded-full bg-status-signing-bg text-status-signing">{todo.count}</span>
                    )}
                  </div>
                  <div className="text-sm text-slate-400 mt-0.5">{todo.desc}</div>
                </div>
                {!disabled && <ChevronRight size={14} className="text-slate-300 flex-shrink-0" />}
              </button>
            );
          })}
        </div>
        {caseTodoCount > 0 && (
          <div className="pt-2 text-sm text-right text-slate-500">
            {caseTodoCount} 项待处理
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
