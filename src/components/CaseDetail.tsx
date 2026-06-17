import React, { useState } from 'react';
import { Calendar, FileText, Download, Search, User, Building2, FileCheck, Sparkles, Shield, MessageSquare, Mail } from 'lucide-react';
import { Case } from '../types';

interface CaseDetailProps {
  caseItem: Case;
  onBack: () => void;
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

export default function CaseDetail({ caseItem, onBack }: CaseDetailProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'parties' | 'requests' | 'materials' | 'signature' | 'review'>('basic');
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);
  const [materialSearch, setMaterialSearch] = useState('');
  const [signatureMethod, setSignatureMethod] = useState<'sms' | 'email'>('sms');
  const [signatureCode, setSignatureCode] = useState('');
  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [viewingPdf, setViewingPdf] = useState<{ name: string; size: string; pages: number } | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploadRemindTarget, setUploadRemindTarget] = useState('');
  const [uploadRemark, setUploadRemark] = useState('');
  const [uploadAwardFiles, setUploadAwardFiles] = useState<string[]>([]);
  const [uploadOtherFiles, setUploadOtherFiles] = useState<string[]>([]);

  // Drag scroll for tab navigation
  const tabRef = React.useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!tabRef.current) return;
    setIsDragging(true);
    setDragStartX(e.pageX - tabRef.current.offsetLeft);
    setScrollLeft(tabRef.current.scrollLeft);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !tabRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabRef.current.offsetLeft;
    const walk = (x - dragStartX) * 1.5;
    tabRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Mock data for parties
  const parties: PartyInfo[] = [
    {
      type: 'applicant',
      attribute: '企业',
      name: '广州天河科技投资有限公司',
      idType: '统一社会信用代码',
      idNo: '91440106MA5XXXXX',
      phone: '020-8888-8888',
      email: 'legal@tianhe-tech.com',
      address: '广州市天河区珠江新城华夏路30号'
    },
    {
      type: 'applicant',
      attribute: '自然人',
      name: '张伟',
      idType: '身份证',
      idNo: '440106198501011234',
      phone: '138-0000-0001',
      email: 'zhangwei@email.com',
      address: '广州市越秀区东风中路100号'
    },
    {
      type: 'respondent',
      attribute: '企业',
      name: '深圳南山创新发展有限公司',
      idType: '统一社会信用代码',
      idNo: '91440300MA5YYYYY',
      phone: '0755-8888-8888',
      email: 'contact@nanshan-dev.com',
      address: '深圳市南山区科技园南区'
    },
    {
      type: 'respondent',
      attribute: '自然人',
      name: '李明',
      idType: '身份证',
      idNo: '440303199001011234',
      phone: '139-0000-0002',
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
    { id: '2', category: '申请人证据', name: '合作协议原件', submitter: '申请人', time: '2024-01-15', size: '1.2MB', content: '双方签订的合作协议原件，约定项目开发期限为6个月' },
    { id: '3', category: '申请人证据', name: '银行转账凭证', submitter: '申请人', time: '2024-01-15', size: '0.8MB', content: '申请人支付5000万元投资款项的银行转账凭证' },
    { id: '4', category: '申请人证据', name: '催告函及送达证明', submitter: '申请人', time: '2024-02-20', size: '1.5MB', content: '申请人向被申请人发出的催告函及送达证明' },
    { id: '5', category: '被申请人证据', name: '项目进度报告', submitter: '被申请人', time: '2024-03-01', size: '3.0MB', content: '被申请人提交的项目进度报告，说明项目延期原因' },
    { id: '6', category: '被申请人证据', name: '技术困难说明', submitter: '被申请人', time: '2024-03-01', size: '2.0MB', content: '被申请人说明项目开发过程中遇到的技术困难' },
    { id: '7', category: '申请人答辩状', name: '申请人答辩状', submitter: '申请人', time: '2024-03-15', size: '1.8MB' },
    { id: '8', category: '被申请人答辩状', name: '被申请人答辩状', submitter: '被申请人', time: '2024-03-20', size: '2.2MB' },
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
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden animate-slide-in">
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
          案件详情
        </div>
      </div>

      {/* Simplified Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
              {caseItem.category}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded font-bold ${
              caseItem.status === '已结案' ? 'bg-emerald-500/30 text-emerald-100' :
              caseItem.status === '审理中' ? 'bg-amber-500/30 text-amber-100' :
              'bg-slate-500/30 text-slate-100'
            }`}>
              {caseItem.status}
            </span>
          </div>
        </div>
        <h4 className="text-sm font-bold text-white mt-1 truncate">
          {caseItem.caseNo} - {caseItem.title}
        </h4>
      </div>

      {/* Tab Navigation */}
      <div 
        ref={tabRef}
        className="bg-white border-b border-slate-100 flex px-1 py-1 flex-shrink-0 overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {(['basic', 'parties', 'requests', 'materials', 'signature', 'review'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 min-w-[56px] py-2 text-center text-xs font-bold transition-all rounded-lg whitespace-nowrap ${
              activeTab === tab 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-slate-500 hover:text-slate-800'
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
          <div className="space-y-3 animate-fade-in">
            {/* Key Info Grid */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Calendar size={12} />
                    <span>立案日期</span>
                  </div>
                  <span className="font-bold text-slate-800">{caseItem.startDate}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <Calendar size={12} />
                    <span>组庭日期</span>
                  </div>
                  <span className="font-bold text-slate-800">2024-02-01</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <div className="text-slate-500 mb-1">争议金额</div>
                  <span className="font-bold text-amber-600">{formatCNY(caseItem.disputeAmount)}</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5">
                  <div className="text-slate-500 mb-1">仲裁费</div>
                  <span className="font-bold text-slate-800">¥{Math.round(caseItem.disputeAmount * 0.01 / 10000)}万元</span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 col-span-2">
                  <div className="flex items-center gap-1 text-slate-500 mb-1">
                    <User size={12} />
                    <span>办案秘书</span>
                  </div>
                  <span className="font-bold text-slate-800">王秘书</span>
                </div>
              </div>
            </div>

            {/* Case Summary with AI watermark */}
            <div className="bg-white rounded-lg border border-slate-100 p-3 relative overflow-hidden">
              <div className="flex items-center gap-1 text-slate-600 font-bold text-xs mb-2">
                <FileText size={14} />
                <span>案情摘要</span>
              </div>
              <div className="text-xs text-slate-600 leading-relaxed relative">
                {/* AI watermark */}
                <div className="absolute top-0 right-0 flex items-center gap-1 text-[10px] text-indigo-400 bg-indigo-50 px-1.5 py-0.5 rounded">
                  <Sparkles size={10} />
                  <span>AI生成，仅供参考</span>
                </div>
                <p className="mt-4">
                  {caseItem.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Parties Tab */}
        {activeTab === 'parties' && (
          <div className="space-y-3 animate-fade-in">
            {/* Applicants */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <span className="bg-emerald-500 text-white text-xs font-bold px-2 py-0.5 rounded">申请人</span>
                <span className="text-xs text-slate-500">共{applicants.length}位</span>
              </div>
              <div className="space-y-3">
                {applicants.map((party, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center gap-2">
                      {party.attribute === '企业' ? (
                        <Building2 size={14} className="text-indigo-500" />
                      ) : (
                        <User size={14} className="text-indigo-500" />
                      )}
                      <span className="font-bold text-slate-800 text-xs">{party.name}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{party.attribute}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">{party.idType}：</span>
                        <span className="text-slate-700">{party.idNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">手机：</span>
                        <span className="text-slate-700">{party.phone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">邮箱：</span>
                        <span className="text-slate-700">{party.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">法定地址：</span>
                        <span className="text-slate-700">{party.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Respondents */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">被申请人</span>
                <span className="text-xs text-slate-500">共{respondents.length}位</span>
              </div>
              <div className="space-y-3">
                {respondents.map((party, idx) => (
                  <div key={idx} className="bg-slate-50 rounded-lg p-2.5 space-y-2">
                    <div className="flex items-center gap-2">
                      {party.attribute === '企业' ? (
                        <Building2 size={14} className="text-red-500" />
                      ) : (
                        <User size={14} className="text-red-500" />
                      )}
                      <span className="font-bold text-slate-800 text-xs">{party.name}</span>
                      <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded">{party.attribute}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">{party.idType}：</span>
                        <span className="text-slate-700">{party.idNo}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">手机：</span>
                        <span className="text-slate-700">{party.phone}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">邮箱：</span>
                        <span className="text-slate-700">{party.email}</span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-slate-500">法定地址：</span>
                        <span className="text-slate-700">{party.address}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Arbitration Requests Tab */}
        {activeTab === 'requests' && (
          <div className="space-y-3 animate-fade-in">
            {/* Facts and Reasons */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-slate-600 font-bold text-xs mb-2">
                <FileText size={14} />
                <span>事实和理由</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {arbitrationRequest.facts}
              </p>
            </div>

            {/* Request Items */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center gap-1 text-slate-600 font-bold text-xs mb-2">
                <FileCheck size={14} />
                <span>请求项</span>
              </div>
              <div className="space-y-2">
                {arbitrationRequest.items.map((item, idx) => (
                  <div key={idx} className="bg-indigo-50 rounded-lg p-2.5 text-xs text-slate-700 flex items-start gap-2">
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
          <div className="space-y-3 animate-fade-in">
            {/* Search Bar */}
            <div className="bg-white rounded-lg border border-slate-100 p-2.5 flex items-center gap-2">
              <Search size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="搜索材料名称、类别..."
                value={materialSearch}
                onChange={(e) => setMaterialSearch(e.target.value)}
                className="flex-1 text-xs text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>

            {/* Materials grouped by category */}
            {Object.entries(groupedMaterials).map(([category, items]) => (
              items.length > 0 && (
                <div key={category} className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                  <div className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700">{category}</span>
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
                            <div className="text-xs font-bold text-slate-800">{item.name}</div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              {item.time} • {item.size}
                            </div>
                          </div>
                        </div>
                        <button className="text-xs text-indigo-600 font-medium hover:text-indigo-700">
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
          <div className="space-y-3 animate-fade-in">
            {/* Document Preview */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  <span className="text-xs font-bold text-slate-700">仲裁裁决书</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded font-bold ${
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
                    <div className="w-10 h-12 bg-red-500 rounded flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-white text-[10px] font-black leading-none">PDF</span>
                      <span className="text-red-200 text-[8px] mt-0.5">{pdf.pages}页</span>
                    </div>
                    {/* File Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-800 truncate group-hover:text-indigo-600 transition-colors">{pdf.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{pdf.size} • {pdf.pages}页</div>
                    </div>
                    {/* Preview Button */}
                    <div className="flex items-center gap-1 text-indigo-500 text-xs font-bold flex-shrink-0">
                      <span>预览</span>
                      <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-0.5 transition-transform"></i>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature Confirmation */}
            {!isSigned ? (
              <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-4">
                <div className="flex items-center gap-2 text-slate-700 font-bold text-xs">
                  <Shield size={14} className="text-indigo-500" />
                  <span>确认签名</span>
                </div>

                {/* Signature Method Selection */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-500">选择验证方式</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSignatureMethod('sms')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        signatureMethod === 'sms'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <MessageSquare size={14} />
                      <span>短信验证码</span>
                    </button>
                    <button
                      onClick={() => setSignatureMethod('email')}
                      className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                        signatureMethod === 'email'
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-600'
                          : 'bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Mail size={14} />
                      <span>邮箱验证码</span>
                    </button>
                  </div>
                </div>

                {/* Verification Code Input */}
                <div className="space-y-2">
                  <span className="text-xs text-slate-500">
                    {signatureMethod === 'sms' ? '短信验证码' : '邮箱验证码'}
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={signatureCode}
                      onChange={(e) => setSignatureCode(e.target.value)}
                      placeholder={signatureMethod === 'sms' ? '请输入短信验证码' : '请输入邮箱验证码'}
                      className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    />
                    <button className="px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-lg hover:bg-indigo-700 active:scale-95 transition-all whitespace-nowrap">
                      发送验证码
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    {signatureMethod === 'sms' 
                      ? '验证码将发送至 138****0000' 
                      : '验证码将发送至 zha****@gzac.org.cn'}
                  </p>
                </div>

                {/* Sign Button */}
                <button
                  onClick={() => {
                    if (!signatureCode) {
                      alert('请输入验证码');
                      return;
                    }
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
                <div className="text-xs text-slate-500">
                  签署时间：{new Date().toISOString().replace('T', ' ').substring(0, 16)}
                </div>
                <div className="text-xs text-slate-400 bg-white/50 rounded p-2 mt-2">
                  CA数字签名编号：0x{Math.random().toString(16).substring(2, 16).toUpperCase()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Award Review Tab */}
        {activeTab === 'review' && (
          <div className="space-y-3 animate-fade-in">
            {/* Case Header */}
            <div className="bg-white rounded-lg border border-slate-100 p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-900">{caseItem.caseNo}</h4>
                <span className="text-xs bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded font-bold">核阅中</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">申请人：</span>
                  <span className="text-slate-800">{caseItem.claimant}</span>
                </div>
                <div>
                  <span className="text-slate-500">被申请人：</span>
                  <span className="text-slate-800">{caseItem.respondent}</span>
                </div>
                <div>
                  <span className="text-slate-500">仲裁费：</span>
                  <span className="text-slate-800">¥{Math.round(caseItem.disputeAmount * 0.01 / 10000)}万元</span>
                </div>
                <div>
                  <span className="text-slate-500">立案时间：</span>
                  <span className="text-slate-800">{caseItem.startDate}</span>
                </div>
              </div>
            </div>

            {/* Document Overview */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-700">文书概览</span>
              </div>
              <div className="p-3 space-y-2">
                <div>
                  <span className="text-xs font-bold text-slate-700">仲裁请求</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    1. 支付货款人民币1,000,000元<br/>
                    2. 支付逾期付款利息（以1,000,000元为基数，自2025年1月1日起至实际清偿之日止，按照LPR计算）<br/>
                    3. 本案仲裁费用由被申请人承担
                  </p>
                </div>
                <div className="border-t border-dashed border-slate-100 pt-2">
                  <span className="text-xs font-bold text-slate-700">被申请人答辩意见</span>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    被申请人辩称：双方签订的合同中部分条款约定不明，且申请人交付的部分产品存在质量问题，有权拒绝支付相应货款。
                  </p>
                </div>
                <div className="border-t border-dashed border-slate-100 pt-2">
                  <span className="text-xs font-bold text-slate-700">举证和质证</span>
                  <div className="mt-1 space-y-1 text-xs text-slate-600">
                    <p>• 申请人举证：《采购合同》、送货签收单、增值税发票</p>
                    <p>• 被申请人质证：对真实性无异议，主张签收单不能证明产品无质量问题</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Review Flow Records */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">核阅流转记录</span>
                <span className="text-[10px] text-slate-400">共 3 条流转记录</span>
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
                      <span className="text-xs font-bold text-slate-800">测试秘书 发起核阅</span>
                      <span className="text-[10px] text-slate-400">03-16 10:30</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">裁决书已初审完毕，庭审笔录已同步上传，请专家核阅。</p>
                    <div className="flex gap-2 mt-2">
                      <div className="flex items-center gap-1 text-[10px] text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80">
                        <FileText size={10} />
                        <span>庭审笔录_2026102.pdf</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-indigo-500 bg-indigo-50 px-2 py-1 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80">
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
                      <span className="text-xs font-bold text-slate-800">一级核阅 - 李专家</span>
                      <span className="text-[10px] text-slate-400">03-16 11:20</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">建议修改第三部分论述，逻辑需要更清晰。</p>
                    <span className="inline-block mt-1 text-[10px] text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100 font-bold">退回修改</span>
                  </div>
                </div>

                {/* Record 3: Secretary modifying */}
                <div className="flex gap-3 pb-2">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-[10px] font-bold text-indigo-600 flex-shrink-0">秘</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">测试秘书 修改中</span>
                      <span className="text-[10px] text-slate-400">03-16 14:30</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">正在根据一级核阅意见进行修改...</p>
                    <span className="inline-block mt-1 text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100 font-bold">修改中</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Document */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={14} className="text-indigo-500" />
                  <span className="text-xs font-bold text-slate-700">裁决书草稿_v2.docx</span>
                </div>
                <span className="text-[10px] text-slate-400">更新人：测试秘书</span>
              </div>
              <div className="p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">历史版本：</span>
                  <div className="flex gap-1">
                    <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100 cursor-pointer hover:bg-indigo-100/80">v1</span>
                    <span className="text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-bold">v2（当前）</span>
                  </div>
                </div>
                <button className="w-full py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                  <FileText size={12} />
                  <span>查看裁决书全文</span>
                </button>
              </div>
            </div>

            {/* Upload Document */}
            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">上传文书</span>
                <button 
                  onClick={() => setShowUploadForm(!showUploadForm)}
                  className="text-[10px] text-indigo-500 cursor-pointer hover:underline flex items-center gap-1"
                >
                  <i className={`fa-solid ${showUploadForm ? 'fa-chevron-up' : 'fa-plus'} text-[8px]`}></i>
                  <span>{showUploadForm ? '收起' : '上传'}</span>
                </button>
              </div>
              {showUploadForm && (
                <div className="p-3 space-y-3">
                  {/* Remind Target */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">提醒对象</label>
                    <div className="flex flex-wrap gap-1.5">
                      {['办案秘书', '首席仲裁员', '边裁-赵东', '边裁-王琦'].map((target) => (
                        <button
                          key={target}
                          onClick={() => setUploadRemindTarget(target)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
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
                    <label className="text-xs font-bold text-slate-700">备注</label>
                    <textarea
                      value={uploadRemark}
                      onChange={(e) => setUploadRemark(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none"
                      rows={2}
                      placeholder="请输入备注信息..."
                    />
                  </div>

                  {/* Award Attachment */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">裁决书附件</label>
                    <div className="space-y-1.5">
                      {uploadAwardFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <FileText size={12} className="text-indigo-500" />
                            <span className="text-[11px] text-slate-700">{file}</span>
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
                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                        <span>添加裁决书附件</span>
                      </button>
                    </div>
                  </div>

                  {/* Other Attachments */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">其他附件</label>
                    <div className="space-y-1.5">
                      {uploadOtherFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                          <div className="flex items-center gap-1.5">
                            <FileText size={12} className="text-slate-400" />
                            <span className="text-[11px] text-slate-700">{file}</span>
                          </div>
                          <button 
                            onClick={() => setUploadOtherFiles(uploadOtherFiles.filter((_, i) => i !== idx))}
                            className="text-slate-400 hover:text-red-500 cursor-pointer"
                          >
                            <i className="fa-solid fa-xmark text-[10px]"></i>
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => setUploadOtherFiles([...uploadOtherFiles, `补充材料_${uploadOtherFiles.length + 1}.pdf`])}
                        className="w-full py-2 border-2 border-dashed border-slate-200 rounded-lg text-xs text-slate-400 hover:text-indigo-500 hover:border-indigo-300 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <i className="fa-solid fa-plus text-[10px]"></i>
                        <span>添加其他附件</span>
                      </button>
                    </div>
                  </div>

                  {/* Submit */}
                  <button className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5">
                    <i className="fa-solid fa-paper-plane text-[10px]"></i>
                    <span>提交上传</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* PDF Preview Modal */}
      {viewingPdf && (
        <div className="fixed inset-0 bg-slate-900/95 z-[110] flex flex-col animate-fade-in text-white p-4">
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
              <div className="text-center text-[10px] text-slate-400 py-2">
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
                    <div className="text-center text-[10px] text-slate-400 py-2">
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
        <div className="fixed inset-0 bg-slate-900/95 z-[110] flex flex-col animate-fade-in text-white p-4">
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