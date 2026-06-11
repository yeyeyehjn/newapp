import React, { useState } from 'react';
import { X, Calendar, FileText, Award, Download, CheckCircle, Clock, ShieldAlert } from 'lucide-react';
import { Case } from '../types';

interface CaseDetailProps {
  caseItem: Case;
  onClose: () => void;
  onNavigateToTask?: (taskId: string) => void;
}

export default function CaseDetail({ caseItem, onClose }: CaseDetailProps) {
  const [activeSegment, setActiveSegment] = useState<'info' | 'timeline' | 'evidence'>('info');
  const [viewingEvidence, setViewingEvidence] = useState<{ name: string; url?: string } | null>(null);
  const [isDownloaded, setIsDownloaded] = useState<boolean>(false);

  // Helper to format currency in CNY
  const formatCNY = (amount: number) => {
    if (amount >= 10000000) {
      return `¥${(amount / 10000000).toFixed(2)} 千万元`;
    }
    if (amount >= 10000) {
      return `¥${(amount / 10000).toFixed(0)} 万元`;
    }
    return `¥${amount.toLocaleString()}`;
  };

  return (
    <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col animate-slide-in">
      {/* Top Header */}
      <div className="h-12 bg-white border-b border-slate-100 px-4 flex items-center justify-between shadow-sm flex-shrink-0">
        <button 
          onClick={onClose} 
          className="text-slate-500 hover:text-slate-800 flex items-center gap-1 text-xs cursor-pointer"
        >
          <X size={16} />
          <span>返回</span>
        </button>
        <span className="font-bold text-slate-800 text-xs truncate max-w-[200px]">{caseItem.caseNo}</span>
        <div className="w-10"></div> {/* Spacer */}
      </div>

      {/* Case Header Details Widget */}
      <div className="bg-indigo-950 text-white p-5 flex-shrink-0 relative overflow-hidden">
        {/* Decorative corner background */}
        <div className="absolute right-[-10px] bottom-[-10px] opacity-10 pointer-events-none transform scale-150">
          <Award size={80} className="text-white" />
        </div>

        <div className="flex items-center justify-between mb-2 relative z-10">
          <span className="text-[10px] font-extrabold bg-indigo-600 px-2 py-0.5 rounded-lg tracking-wide">
            {caseItem.category}
          </span>
          <span className={`text-[10px] p-0.5 px-2 rounded-lg font-bold border ${
            caseItem.status === '已结案' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/25' :
            caseItem.status === '审理中' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/25 animate-pulse' :
            caseItem.status === '待开庭' ? 'bg-amber-500/20 text-amber-300 border-amber-500/25' :
            'bg-rose-500/20 text-rose-300 border-rose-500/25'
          }`}>
            ● {caseItem.status}
          </span>
        </div>
        <h4 className="text-sm font-extrabold text-slate-100 tracking-tight leading-relaxed mb-3 relative z-10 text-left">
          {caseItem.title}
        </h4>
        <div className="flex items-center justify-between text-[11px] text-indigo-200/90 relative z-10">
          <span>首席席位: <strong className="font-bold text-indigo-300">{caseItem.role}</strong></span>
          <span>标的额: <strong className="font-extrabold text-amber-400">{formatCNY(caseItem.disputeAmount)}</strong></span>
        </div>
      </div>

      {/* Segment Controllers */}
      <div className="bg-white border-b border-indigo-50 flex p-1 shadow-sm text-xs text-slate-500 flex-shrink-0">
        {(['info', 'timeline', 'evidence'] as const).map((seg) => (
          <button
            key={seg}
            onClick={() => setActiveSegment(seg)}
            className={`flex-1 py-2.5 text-center font-bold tracking-wide transition-all rounded-lg ${
              activeSegment === seg 
                ? 'text-indigo-600 bg-indigo-50/40' 
                : 'hover:text-slate-800'
            }`}
          >
            {seg === 'info' ? '案情基本情况' : seg === 'timeline' ? '办案大事记' : '全案证据材料'}
          </button>
        ))}
      </div>

      {/* Scrollable details view */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 relative">
        {activeSegment === 'info' && (
          <div className="space-y-4 animate-fade-in">
            {/* Parties Info Block */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm space-y-3">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
                本案当事人结构
              </h5>
              
              <div className="space-y-3 text-xs">
                {/* Claimant */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-emerald-500 text-white font-bold px-1 rounded text-[9px] leading-relaxed">申请</span>
                    <span className="font-bold text-slate-800">{caseItem.claimant}</span>
                  </div>
                  {caseItem.claimantAgent && (
                    <div className="pl-7 text-[10px] text-slate-400">
                      代理律师: {caseItem.claimantAgent}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="h-px bg-dashed border-t border-slate-100 my-1"></div>

                {/* Respondent */}
                <div className="flex flex-col space-y-1">
                  <div className="flex items-center space-x-1.5">
                    <span className="bg-red-500 text-white font-bold px-1 rounded text-[9px] leading-relaxed">被申</span>
                    <span className="font-bold text-slate-800">{caseItem.respondent}</span>
                  </div>
                  {caseItem.respondentAgent && (
                    <div className="pl-7 text-[10px] text-slate-400">
                      代理律师: {caseItem.respondentAgent}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Case description summary */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm space-y-2">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
                仲裁案情摘要
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed text-justify">
                {caseItem.description}
              </p>
            </div>

            {/* Trial Info Grid */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm space-y-2.5 text-xs text-slate-600">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
                仲裁规则与机构
              </h5>
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-1 text-[11px]">
                <div>
                  <span className="text-slate-400 block mb-0.5">立案日期</span>
                  <span className="font-semibold text-slate-800">{caseItem.startDate}</span>
                </div>
                {caseItem.closeDate && (
                  <div>
                    <span className="text-slate-400 block mb-0.5">结案归档日</span>
                    <span className="font-semibold text-emerald-600">{caseItem.closeDate}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block mb-0.5">组庭机构</span>
                  <span className="font-semibold text-slate-800">{caseItem.commission}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">执行仲裁规则</span>
                  <span className="font-semibold text-slate-800 truncate block max-w-[150px]">{caseItem.rules}</span>
                </div>
              </div>
            </div>

            {/* Hearing scheduling block */}
            {caseItem.hearings.length > 0 && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm space-y-2.5">
                <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100 flex items-center justify-between">
                  <span>开庭日程纪要</span>
                  <Calendar size={13} className="text-slate-400" />
                </h5>
                <div className="space-y-2">
                  {caseItem.hearings.map((h, idx) => (
                    <div key={idx} className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{h.location}</span>
                        <span className="text-emerald-500 text-[10px] font-semibold">{h.status}</span>
                      </div>
                      <div className="text-slate-500 font-mono">时间: {h.hearingTime}</div>
                      {h.notes && <div className="text-[10px] text-slate-400 italic">备注: {h.notes}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Vertical timeline node display */}
        {activeSegment === 'timeline' && (
          <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm space-y-4 animate-fade-in">
            <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pb-1.5 border-b border-slate-100">
              案件推进全寿光轴 (委案系统记录)
            </h5>
            
            <div className="relative pl-6 space-y-5">
              {/* Vertical line connector */}
              <div className="absolute left-2.5 top-1.5 bottom-1.5 w-0.5 bg-slate-100"></div>

              {caseItem.timeline.map((node, index) => (
                <div key={index} className="relative group">
                  {/* Circle Indicator */}
                  <div className={`absolute -left-6 top-1 h-3.5 w-3.5 rounded-full border-2 bg-white flex items-center justify-center z-10 ${
                    node.status === 'completed' ? 'border-emerald-500' :
                    node.status === 'processing' ? 'border-indigo-500 animate-pulse' :
                    'border-slate-200'
                  }`}>
                    {node.status === 'completed' && <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full"></div>}
                    {node.status === 'processing' && <div className="h-1.5 w-1.5 bg-indigo-500 rounded-full"></div>}
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-800">
                      <span>{node.title}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{node.time}</span>
                    </div>
                    {node.operator && (
                      <div className="text-[10px] text-slate-500">
                        处理主体: {node.operator}
                      </div>
                    )}
                    {node.remark && (
                      <div className="text-[10px] bg-slate-50 p-1.5 px-2.5 text-slate-400 rounded-xl border border-slate-100 leading-relaxed">
                        描述: {node.remark}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence documents checklist */}
        {activeSegment === 'evidence' && (
          <div className="space-y-3 animate-fade-in pb-4">
            <div className="bg-amber-50 rounded-2xl p-3.5 border border-amber-100 flex items-start gap-2 text-[10px] text-amber-700 leading-relaxed font-medium">
              <ShieldAlert size={15} className="flex-shrink-0 text-amber-500" />
              <span>根据《中华人民共和国仲裁法》及涉密安全条例，此处证据文件仅作为仲裁合议、裁決拟稿之审阅用途。切勿向庭外第三方散播、留底，系统已实施电子追踪防伪水印封存。</span>
            </div>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider p-3 pb-2 border-b border-slate-100">
                全案提交证据清单 ({caseItem.evidence.length}个卷宗)
              </h5>

              <div className="divide-y divide-slate-100">
                {caseItem.evidence.map((file) => (
                  <div key={file.id} className="p-3 hover:bg-slate-50/50 transition-colors flex items-center justify-between">
                    <div className="flex items-start space-x-2.5 max-w-[240px]">
                      <FileText size={16} className="text-slate-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <div className="text-[11px] font-bold text-slate-800 line-clamp-1">{file.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          提交方: {file.submitter}
                        </div>
                        <div className="text-[9px] text-slate-300 font-mono mt-0.5">
                          时间: {file.time} • 大小: {file.size}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewingEvidence({ name: file.name })}
                        className="p-1 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-extrabold cursor-pointer transition-colors"
                      >
                        预览
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mock Evidence Document Preview Watermarked Modal */}
      {viewingEvidence && (
        <div className="absolute inset-0 bg-slate-900/95 z-[60] flex flex-col animate-fade-in text-white p-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-800 mb-4 flex-shrink-0">
            <span className="text-xs font-bold truncate max-w-[250px]">{viewingEvidence.name}</span>
            <button 
              onClick={() => setViewingEvidence(null)}
              className="text-slate-400 hover:text-white p-1 bg-slate-800 rounded cursor-pointer"
            >
              <X size={15} />
            </button>
          </div>

          {/* Document Content Simulation */}
          <div className="flex-1 bg-white text-slate-950 p-6 rounded-xl overflow-y-auto relative whitespace-pre-wrap font-serif text-xs select-none selection:bg-transparent shadow-inner">
            {/* Real legal watermark */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.06] transform -rotate-45 pointer-events-none select-none">
              <div className="text-center">
                <div className="text-2xl font-bold tracking-widest text-[#9400D3] uppercase m-4">广州仲裁委员会审案材料</div>
                <div className="text-sm font-semibold tracking-wider text-[#9400D3]">专供仲裁员: 张明 • 机密阅览</div>
                <div className="text-xs text-[#9400D3] font-mono mt-2">2026-06-10 广州市机密追踪系统</div>
              </div>
            </div>

            <h3 className="text-center text-sm font-extrabold tracking-wide mb-6">
              证据卷宗详情说明及审阅本
            </h3>
            
            <p className="indent-6 leading-relaxed mb-4">
              根据广州仲裁委员会第 {caseItem.caseNo} 号案排定之合议庭质辩安排，本卷宗为当事人依《仲裁证据规则》提报之书证、物证原件副本汇编。
            </p>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-lg font-sans text-[10px] space-y-2 mb-4 leading-relaxed text-slate-500">
              <p className="font-bold text-slate-700">【技术检验及签名信息】</p>
              <p>数字存证链编号: TX-CHAINS-908B1F2D0198E2</p>
              <p>CA签发人认证: 工业和信息化部统一CA电子签名认证存证</p>
              <p>可追溯完整性: SHA-256验证一致。该原件于立案合规审查时完成归档。</p>
            </div>

            <p className="indent-6 leading-relaxed mb-4 font-serif">
              “...特此申报，双方在合作第二阶段对于协议修正案的第四条执行机制，已进行了充分的可行性技术论证。其双方签字盖章原件如下文附表所示，旨在明确被申请人在未获得申请人独立董事决议批复前，不享有擅自重组控股合伙企业资产负债表之决定特许权...”
            </p>

            <div className="h-20 border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-[10px] italic mb-4">
              [ 附件此处省略双签合伙企业公章、法人签字印谱扫描件 ]
            </div>

            <p className="indent-6 leading-relaxed mb-4 text-slate-500 text-[11px] italic">
              （本处内容为智能虚拟文书系统提供的仿真涉密证据展示片断）
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2 justify-between items-center text-[10px] text-slate-500 flex-shrink-0">
            <span>机密证据级保护 • IP追踪中</span>
            <div className="flex items-center space-x-2">
              {isDownloaded && (
                <span className="text-[10px] text-emerald-400 font-extrabold animate-fade-in">
                  ✓ 安全加密并生成追踪日志成功！
                </span>
              )}
              <button
                onClick={() => {
                  setIsDownloaded(true);
                  setTimeout(() => setIsDownloaded(false), 3000);
                }}
                className={`flex items-center gap-1.5 p-2 px-4 rounded-xl text-white font-extrabold cursor-pointer transition-all ${
                  isDownloaded ? 'bg-emerald-600' : 'bg-slate-800 hover:bg-slate-700'
                }`}
              >
                <Download size={12} />
                <span>{isDownloaded ? '已离线备审' : '下载审阅离线副件'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
