import React, { useState } from 'react';
import { Calendar, FileText, Download, Search, User, Building2, FileCheck, Sparkles } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'basic' | 'parties' | 'requests' | 'materials'>('basic');
  const [viewingMaterial, setViewingMaterial] = useState<MaterialItem | null>(null);
  const [materialSearch, setMaterialSearch] = useState('');

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
      {/* Header - 参考 StatsCenterPage 的样式 */}
      <div className="h-13 bg-slate-900 border-b border-slate-800 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs text-indigo-200 hover:text-white font-bold transition-colors cursor-pointer"
        >
          <span>❮ 返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-white tracking-widest whitespace-nowrap">
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
      <div className="bg-white border-b border-slate-100 flex px-2 py-1 flex-shrink-0">
        {(['basic', 'parties', 'requests', 'materials'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 text-center text-xs font-bold transition-all rounded-lg ${
              activeTab === tab 
                ? 'text-indigo-600 bg-indigo-50' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab === 'basic' ? '基本信息' : 
             tab === 'parties' ? '当事人' : 
             tab === 'requests' ? '仲裁请求' : '主要材料'}
          </button>
        ))}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-10 bg-slate-50">
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
      </div>

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