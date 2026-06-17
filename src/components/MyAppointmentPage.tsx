import React, { useState } from 'react';
import { Award, QrCode, Download, CheckCircle2 } from 'lucide-react';
import { ArbitratorProfile } from '../types';

interface MyAppointmentPageProps {
  profile: ArbitratorProfile;
  onBack: () => void;
}

export default function MyAppointmentPage({
  profile,
  onBack
}: MyAppointmentPageProps) {
  const [isExportingCert, setIsExportingCert] = useState<boolean>(false);
  const [showCertSuccessMsg, setShowCertSuccessMsg] = useState<boolean>(false);

  const handleCredentialExport = () => {
    setIsExportingCert(true);
    setTimeout(() => {
      setIsExportingCert(false);
      setShowCertSuccessMsg(true);
      setTimeout(() => setShowCertSuccessMsg(false), 3500);
    }, 2000);
  };

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
          我的聘书
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10 bg-slate-50">
        <div className="animate-fade-in space-y-4 text-left">
          {/* Official letter frame */}
          <div className="bg-[#FFFDF6] border-[5px] border-double border-amber-600/30 rounded-3xl p-5 relative overflow-hidden shadow-md">
            
            {/* Backdrop watermark Seal of GZAC */}
            <div className="absolute right-3 bottom-3 opacity-20 pointer-events-none w-25 h-25 border-[4px] border-[#702424] rounded-full flex items-center justify-center font-extrabold text-xs text-[#702424] uppercase tracking-wider transform -rotate-12 border-dashed">
              广州仲裁委员会
            </div>

            <div className="space-y-4 relative z-10 font-sans">
              <div className="flex justify-center mb-1">
                <div className="bg-amber-100/60 border border-amber-500/30 p-2 rounded-2xl text-amber-600">
                  <Award size={20} className="animate-scale-up" />
                </div>
              </div>

              <h3 className="text-center text-sm font-extrabold text-amber-900 tracking-widest font-sans px-1">
                广州仲裁委员会 · 仲裁员聘书
              </h3>
              
              {/* Divider line */}
              <div className="flex justify-center items-center space-x-2">
                <div className="h-px bg-amber-600/45 flex-1"></div>
                <span className="text-2xs text-amber-700 font-mono tracking-widest uppercase">OFFICIAL COMMISSION</span>
                <div className="h-px bg-amber-600/45 flex-1"></div>
              </div>

              {/* Body text content */}
              <div className="space-y-2.5 text-slate-700 text-xs leading-relaxed text-left py-1 text-justify indent-4">
                <p>
                  兹聘请 <strong>张明</strong> 先生为广州仲裁委员会之 
                  <strong className="text-amber-800">「特级独任及合议庭首席仲裁员」</strong>。
                </p>
                <p>
                  任职期间，其有权依法组成专属仲裁庭，对各类涉及股权投资基金纠纷、高端商事买卖违约、涉外涉海运输冲突及知识产权纠纷等民事与经济案，进行独立、公开、公正之法律裁判。
                </p>
              </div>

              {/* Key metadata grid layout */}
              <div className="bg-amber-50/40 border border-amber-100 p-2.5 rounded-xl grid grid-cols-2 gap-2 text-xs text-amber-900/70 text-left font-sans">
                <div className="space-y-1">
                  <p>• 聘书编号: <span className="font-mono text-slate-800 font-extrabold">{profile.idNo}</span></p>
                  <p>• 聘用期限: <span className="text-slate-800 font-semibold">2023年09月 - 2028年09月</span></p>
                </div>
                <div className="space-y-1">
                  <p>• 特殊特长: <span className="text-[#4780FF] font-bold">{profile.specialties.join(' ')}</span></p>
                  <p>• 授权等级: <span className="text-emerald-600 font-bold">委员会资深一级</span></p>
                </div>
              </div>

              {/* Official red ink seal simulation */}
              <div className="flex justify-between items-end pt-2">
                <div className="text-left text-xs text-slate-500 font-sans">
                  <QrCode size={30} className="text-slate-500 opacity-60 mb-0.5" />
                  <span>国中区块链防伪广州盾</span>
                </div>

                <div className="relative pr-1 flex flex-col items-center select-none pb-1">
                  {/* Red seal stamp circle */}
                  <div className="absolute right-[-10px] bottom-[-2px] w-14 h-14 border-[3px] border-red-500/80 rounded-full flex items-center justify-center font-bold text-2xs text-red-500/80 rotate-12 pointer-events-none opacity-80 border-double">
                    <div className="text-2xs text-center font-extrabold tracking-wide scale-90">
                      广州仲裁委员会<br/>
                      专用印章
                    </div>
                  </div>
                  <span className="text-xs font-sans font-extrabold text-[#702424] mr-8">广州仲裁委员会</span>
                  <span className="text-2xs font-mono text-slate-500 mr-8">2023年09月01日发布</span>
                </div>
              </div>

            </div>
          </div>

          {/* Action secure button */}
          <div className="space-y-2">
            <button
              onClick={handleCredentialExport}
              disabled={isExportingCert}
              className="w-full bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 text-white font-extrabold p-3 text-xs rounded-xl shadow-md cursor-pointer transition-all flex items-center justify-center gap-2"
            >
              <Download size={13} className={isExportingCert ? 'animate-spin' : ''} />
              <span>{isExportingCert ? '正进行多路安全存证级防伪导出...' : '导出防伪加密PDF聘书副件'}</span>
            </button>

            {showCertSuccessMsg && (
              <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-xs text-emerald-700 leading-normal flex items-start gap-2 animate-fade-in font-semibold text-center justify-center font-sans">
                <CheckCircle2 size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>✓ CA聘书证书副件成功保存至沙盒数据库！并附带国办高标准防伪电子水印（哈希：GZAC-SHA256-4024）</span>
              </div>
            )}
          </div>

          {/* Secure statement */}
          <div className="bg-slate-100 p-3 rounded-xl text-xs text-slate-500 leading-relaxed text-center font-sans">
            该聘任书具有国家政务法律资质追溯标准，已通过全国信用共享交换中台。防伪CA锁联追踪，未授权拷贝作为第三方使用将承担法律责任。
          </div>
        </div>
      </div>
    </div>
  );
}
