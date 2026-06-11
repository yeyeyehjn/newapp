import React, { useState } from 'react';
import { 
  User, Building2, FileText, CreditCard, LogOut, ShieldCheck, 
  ChevronRight, Award, MapPin, KeyRound, Terminal, CheckCircle2 
} from 'lucide-react';
import { ArbitratorProfile } from '../types';

interface MyProfileProps {
  profile: ArbitratorProfile;
  onLogout: () => void;
}

export default function MyProfile({ profile, onLogout }: MyProfileProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto no-scrollbar pb-10">
      {/* Top Professional Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white p-6 pb-8 relative overflow-hidden rounded-b-[28px] shadow-md flex-shrink-0">
        <div className="absolute right-[-20px] top-[-20px] w-40 h-40 rounded-full border border-yellow-500/10 pointer-events-none" />
        <div className="absolute right-[-40px] top-[-40px] w-56 h-56 rounded-full border border-yellow-500/5 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center text-center mt-3">
          {/* Avatar Frame with CA Online Badge */}
          <div className="relative mb-3.5">
            <div className="w-20 h-20 rounded-full bg-slate-800 border-4 border-indigo-400/60 shadow-lg overflow-hidden flex items-center justify-center">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-2xl font-black">{profile.name[0]}</span>
              )}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-slate-900 flex items-center justify-center shadow-md">
              <ShieldCheck size={12} className="text-white" />
            </div>
          </div>

          <h2 className="text-xl font-black text-white tracking-tight flex items-center justify-center gap-1.5">
            <span>{profile.name}</span>
            <span className="text-[9px] bg-amber-500/20 text-[#F59E0B] border border-amber-500/40 px-1.5 py-0.5 rounded font-black tracking-wider align-middle">
              {profile.ranking}
            </span>
          </h2>
          
          <p className="text-indigo-200/90 text-xs font-semibold mt-1 max-w-[280px] line-clamp-1">
            广州仲裁委员会特聘专家
          </p>
          
          <div className="mt-3.5 flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full py-1 px-3 text-[10px] text-slate-300 font-mono shadow-inner">
            <KeyRound size={10} className="text-indigo-400" />
            <span>CA存证盾:</span>
            <span className="text-indigo-300 font-extrabold">{profile.idNo}</span>
          </div>
        </div>
      </div>

      {/* Main Profile Functional Body */}
      <div className="p-4 space-y-4">
        
        {/* SECTION 1: 个人信息 (Personal Info) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('personal')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <User size={16} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-slate-800 leading-none">个人信息</h3>
                <p className="text-[10px] text-slate-400 font-medium font-sans">姓名、专业特长及入选资质</p>
              </div>
            </div>
            <ChevronRight 
              size={14} 
              className={`text-slate-400 transition-transform duration-300 ${activeSection === 'personal' ? 'rotate-90' : ''}`} 
            />
          </button>

          {activeSection === 'personal' && (
            <div className="border-t border-slate-50 p-4 pt-1 bg-slate-50/30 text-left space-y-3 animate-slide-up">
              <div className="grid grid-cols-2 gap-3.5 pt-3 text-xs">
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9.5px] text-slate-400 block font-medium">中文姓名</span>
                  <span className="font-extrabold text-slate-800">{profile.name}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9.5px] text-slate-400 block font-medium">聘用职称</span>
                  <span className="font-extrabold text-[#EF4444]">{profile.ranking}</span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 col-span-2 space-y-1">
                  <span className="text-[9.5px] text-slate-400 block font-medium">主要专业特长</span>
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {profile.specialties.map((spec, idx) => (
                      <span key={idx} className="bg-indigo-50 text-indigo-600 border border-indigo-100/60 font-black text-[9.5px] px-2 py-0.5 rounded-lg">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-100 col-span-2 space-y-0.5">
                  <span className="text-[9.5px] text-slate-400 block font-medium">系统CA安全盾标识唯一ID</span>
                  <span className="font-mono text-[10px] text-slate-600 block">{profile.idNo}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 2: 工作单位 (Workplace) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('work')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <Building2 size={16} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-slate-800 leading-none">工作单位</h3>
                <p className="text-[10px] text-slate-400 font-medium font-sans">执业/研究单位及当前岗位</p>
              </div>
            </div>
            <ChevronRight 
              size={14} 
              className={`text-slate-400 transition-transform duration-300 ${activeSection === 'work' ? 'rotate-90' : ''}`} 
            />
          </button>

          {activeSection === 'work' && (
            <div className="border-t border-slate-50 p-4 pt-1 bg-slate-50/30 text-left space-y-3 animate-slide-up">
              <div className="pt-3 space-y-2.5 text-xs">
                <div className="bg-white p-3.5 rounded-xl border border-slate-100 space-y-1.5 shadow-xs">
                  <div className="flex items-center gap-1.5 text-indigo-600 font-extrabold text-[12.5px]">
                    <Building2 size={14} />
                    <span>广州市社会科学院政治法律研究所</span>
                  </div>
                  <div className="h-[1px] bg-slate-100" />
                  <div className="grid grid-cols-2 gap-2 text-[10.5px]">
                    <div>
                      <span className="text-slate-400 font-semibold block">现任职务</span>
                      <strong className="text-slate-700 font-extrabold block">资深执业律师 / 研究所客座专家</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block">行业资质</span>
                      <strong className="text-slate-700 font-extrabold block">商事及涉外民法律照专职律师</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: 个人履历 (Resume / Experience / Publications) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('resume')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <FileText size={16} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-slate-800 leading-none">个人履历</h3>
                <p className="text-[10px] text-slate-400 font-medium font-sans">学术背景、执业年限及学术专著</p>
              </div>
            </div>
            <ChevronRight 
              size={14} 
              className={`text-slate-400 transition-transform duration-300 ${activeSection === 'resume' ? 'rotate-90' : ''}`} 
            />
          </button>

          {activeSection === 'resume' && (
            <div className="border-t border-slate-50 p-4 pt-1 bg-slate-50/30 text-left space-y-3 animate-slide-up">
              <div className="pt-3 space-y-3.5 text-xs">
                <div className="relative border-l-2 border-indigo-100 pl-4 space-y-4">
                  {/* Item 1 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
                    <span className="text-[9px] font-black text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-1.5 py-0.2 rounded font-mono">
                      2002年 - 2005年
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-[11px] mt-1">西南政法大学 • 法学硕士学位</h4>
                    <p className="text-[10px] text-slate-450 font-sans mt-0.5">主修商法及民事诉讼，发表多篇法学核心期刊论文。</p>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border border-white" />
                    <span className="text-[9px] font-black text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.2 rounded font-mono">
                      2006年 - 至今
                    </span>
                    <h4 className="font-extrabold text-slate-800 text-[11px] mt-1">深耕巨额重大商事仲裁及民商事司法事务</h4>
                    <p className="text-[10px] text-slate-450 font-sans mt-0.5">代理各类型涉外股权、重大建设工程和金融合规仲裁及诉讼，总争议金额超数十亿元人民币，并出任多家世界五百强及知名国企特约法律顾问。</p>
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-100 p-3 rounded-xl space-y-1">
                  <div className="flex items-center gap-1.5 text-amber-800 text-[10.5px] font-extrabold pb-0.5">
                    <Award size={12} className="text-amber-600" />
                    <span>核心代表著作</span>
                  </div>
                  <p className="text-slate-650 text-[10px] leading-relaxed">
                    撰写出版《中国商事仲裁裁决效力及撤销规则研究》及《股权投资退出纠纷要案裁量实务》，受仲裁同仁广泛引用。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: 银行账号信息 (Bank Account Info) */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('bank')}
            className="w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3.5">
              <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <CreditCard size={16} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-black text-slate-800 leading-none">银行账号信息</h3>
                <p className="text-[10px] text-slate-400 font-medium font-sans">本庭办案报酬与津贴发放指定账户</p>
              </div>
            </div>
            <ChevronRight 
              size={14} 
              className={`text-slate-400 transition-transform duration-300 ${activeSection === 'bank' ? 'rotate-90' : ''}`} 
            />
          </button>

          {activeSection === 'bank' && (
            <div className="border-t border-slate-50 p-4 pt-1 bg-slate-50/30 text-left space-y-3 animate-slide-up">
              <div className="pt-3 space-y-3 text-xs">
                {/* Premium Credit Card Display */}
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white rounded-2xl p-4 shadow-md space-y-5 relative overflow-hidden">
                  {/* Subtle vector circles */}
                  <div className="absolute right-[-10px] top-[-10px] w-24 h-24 rounded-full bg-white/5 pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-[8px] tracking-widest text-indigo-200 uppercase font-black">仲裁员专款汇账卡</span>
                      <h4 className="font-extrabold text-[12px] text-white">东莞银行股份有限公司</h4>
                    </div>
                    <span className="text-[9px] bg-white/20 border border-white/10 text-white px-2 py-0.5 rounded font-black font-mono">
                      广州分行
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] text-indigo-200 block font-sans">卡号</span>
                    <span className="text-base font-extrabold font-mono tracking-widest block">
                      6223 8812 **** 0918
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-2.5 text-[9px] text-indigo-100 font-semibold font-sans">
                    <span>账户户名：<strong className="text-white font-extrabold">{profile.name}</strong></span>
                    <div className="flex items-center gap-1 text-emerald-300">
                      <ShieldCheck size={11} />
                      <span className="font-bold">已通过CA盾实名绑定</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-[9.5px] text-slate-400 font-medium font-sans leading-relaxed text-center px-2">
                  提示：如需变更账报银行卡，请携带本人有效身份证、特级聘书及广州CA盾硬件赴广州仲裁委本委现场柜台核准办理变动手续。
                </p>
              </div>
            </div>
          )}
        </div>

        {/* LOGOUT BUTTON - 退出登录 */}
        <div className="pt-4 flex flex-col items-center">
          <button 
            onClick={() => setShowExitConfirm(true)}
            className="w-full bg-white border border-red-100 hover:bg-rose-50 text-red-650 font-extrabold p-3.5 rounded-2xl cursor-pointer transition-all flex items-center justify-center gap-2 hover:shadow-sm"
          >
            <LogOut size={14} className="text-red-500" />
            <span className="text-xs">安全退出账号</span>
          </button>
          
          <span className="text-[9.5px] font-mono text-slate-400 font-bold mt-5 font-sans">
            广州仲裁委员会智慧微平台 • 当前版本 v3.5.2
          </span>
        </div>

      </div>

      {/* Logout Confirmation Dialog Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-5">
          <div className="bg-white rounded-3xl max-w-sm w-full p-5 border border-slate-100 shadow-xl space-y-4 animate-scale-up text-left">
            <div className="space-y-1">
              <span className="text-[9px] bg-red-50 text-red-600 border border-red-100/60 px-1.5 py-0.5 rounded font-black font-mono">
                SECURITY EXIT
              </span>
              <h3 className="text-sm font-black text-slate-800">确认安全退出账号吗？</h3>
              <p className="text-[10.5px] text-slate-450 leading-relaxed font-semibold">
                退出后，系统将清除本地CA联存证明核验口令，再次进入需要重新进行双因子指纹及数字CA盾签注校验。
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-650 font-bold py-2.5 text-[11px] rounded-xl transition-all cursor-pointer border border-slate-200"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setShowExitConfirm(false);
                  onLogout();
                }}
                className="flex-1 bg-red-650 hover:bg-red-700 text-white font-heavy py-2.5 text-[11px] rounded-xl transition-all cursor-pointer border border-red-600 shadow-md shadow-red-200"
              >
                安全退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
