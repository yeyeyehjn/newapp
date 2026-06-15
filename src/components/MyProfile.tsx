import React, { useState, useRef } from 'react';
import { 
  User, Building2, FileText, CreditCard, LogOut, ShieldCheck, 
  ChevronRight, Award, MapPin, KeyRound, CheckCircle2, Camera, 
  Phone, Mail, Home, Edit3, Star
} from 'lucide-react';
import { ArbitratorProfile } from '../types';

interface PersonalInfo {
  name: string;
  ranking: string;
  phone: string;
  email: string;
  homeAddress: string;
  contactAddress: string;
  otherAddress: string;
  preferredAddress: 'home' | 'contact' | 'other';
  specialties: string[];
  idNo: string;
}

interface WorkInfo {
  company: string;
  position: string;
  qualification: string;
}

interface BankInfo {
  bank: string;
  branch: string;
  accountNo: string;
  accountName: string;
}

interface MyProfileProps {
  profile: ArbitratorProfile;
  onLogout: () => void;
  onNavigateToEdit: (page: 'personalInfoEdit' | 'workInfoEdit' | 'bankInfoEdit') => void;
  personalInfo: PersonalInfo;
  workInfo: WorkInfo;
  bankInfo: BankInfo;
  onSetPreferredAddress: (type: 'home' | 'contact' | 'other') => void;
}

export default function MyProfile({ profile, onLogout, onNavigateToEdit, personalInfo, workInfo, bankInfo, onSetPreferredAddress }: MyProfileProps) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string | undefined>(profile.avatar);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderAddressBadge = (type: 'home' | 'contact' | 'other', preferred: 'home' | 'contact' | 'other') => {
    if (type === preferred) {
      return (
        <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5">
          <Star size={8} fill="currentColor" />
          首选
        </span>
      );
    }
    return null;
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto no-scrollbar pb-10">
      {/* Top Professional Header with Premium Styled Banner Image */}
      <div className="relative w-full">
        {/* Banner Background Image with Light Blue Gradient Wash */}
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-br from-sky-400 via-sky-500 to-blue-600 overflow-hidden shadow-inner">
          <img
            src="/tu/Image.png"
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Decorative thin circles for abstract aesthetics */}
        <div className="absolute right-[15%] top-[-10px] w-36 h-36 rounded-full border border-white/20 pointer-events-none" />
        <div className="absolute right-[5%] top-[-20px] w-48 h-48 rounded-full border border-sky-100/20 pointer-events-none" />

        {/* User Info Card - Floating elegantly in flow */}
        <div className="absolute top-14 left-4 z-10">
          <div className="text-left">
            {/* User Welcome Block */}
            <div className="flex items-start gap-3">
              {/* Profile Avatar with uploaded or dynamic placeholder */}
              <div className="relative flex-shrink-0 group cursor-pointer" onClick={handleAvatarClick}>
                {avatar ? (
                  <img
                    src={avatar}
                    alt={profile.name}
                    className="w-14 h-14 rounded-md object-cover  transform group-hover:scale-105 transition-all duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-md bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600 flex items-center justify-center  ">
                    <span className="text-xl font-black text-white">{profile.name.charAt(0)}</span>
                  </div>
                )}
                {/* Micro Camera overlay indicator on hover */}
                <div className="absolute inset-0 bg-slate-950/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera size={16} className="text-white animate-pulse" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>

              {/* User Identity Details */}
              <div className="flex-1 min-w-0 px-1">
                <div className="flex items-center flex-wrap gap-2 mb-1">
                  <h1 className="text-lg font-black text-white tracking-tight leading-none">
                    {profile.name}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-sm font-medium tracking-wide bg-sky-50 text-sky-600 border border-sky-100">
                    <Award size={10} className="text-sky-500" />
                    {profile.ranking}
                  </span>
                </div>
                <p className="text-sm text-white font-medium truncate">
                  广州市社会科学院政治法律研究所
                </p>
                
                {/* Minor specialties badges */}
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {profile.specialties.map((spec, idx) => (
                    <span key={idx} className="bg-sky-50/80 border border-sky-100 text-sm text-sky-700 px-1.5 py-0.5 rounded font-medium">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Functional Body */}
      <div className="p-4 pt-42 space-y-3 z-[1]">
        
        {/* SECTION 1: 个人信息 (Personal Info) */}
        <div className="bg-white rounded-lg border border-slate-100  overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('personal')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <User size={15} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800 leading-none">个人信息</h3>
                <p className="text-sm text-slate-500 font-medium">姓名、联系方式、地址信息</p>  
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToEdit('personalInfoEdit');
                }}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Edit3 size={14} />
              </button>
              <ChevronRight 
                size={14} 
                className={`text-slate-500 transition-transform duration-300 ${activeSection === 'personal' ? 'rotate-90' : ''}`} 
              />
            </div>
          </button>

          {activeSection === 'personal' && (
            <div className="border-t border-slate-100 p-3.5 pt-2 bg-slate-50/30 text-left space-y-2.5 animate-slide-up">
                <div className="grid grid-cols-2 gap-2.5 pt-2 text-sm">
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-sm text-slate-500 block font-medium">中文姓名</span>
                  <span className="font-bold text-slate-800">{personalInfo.name}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <span className="text-sm text-slate-500 block font-medium">聘用职称</span>
                  <span className="font-bold text-rose-500">{personalInfo.ranking}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Phone size={10} className="text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">手机号</span>
                  </div>
                  <span className="font-bold text-slate-800 truncate">{personalInfo.phone}</span>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-0.5">
                  <div className="flex items-center gap-1">
                    <Mail size={10} className="text-slate-400" />
                    <span className="text-sm text-slate-500 font-medium">联系邮箱</span>
                  </div>
                  <span className="font-bold text-slate-800 truncate">{personalInfo.email}</span>
                </div>
              </div>
              
              {/* Address Section */}
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-slate-600 font-medium text-sm">
                  <MapPin size={12} />
                  <span>地址信息</span>
                </div>
                
                <div 
                  className={`bg-white p-2.5 rounded-lg border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-50 transition-colors ${personalInfo.preferredAddress === 'home' ? 'border-amber-200 bg-amber-50/30' : ''}`}
                  onClick={() => onSetPreferredAddress('home')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Home size={10} className="text-slate-400" />
                      <span className="text-sm text-slate-500">居住地址</span>
                    </div>
                    {renderAddressBadge('home', personalInfo.preferredAddress)}
                  </div>
                  <span className="text-sm text-slate-700 truncate block">{personalInfo.homeAddress}</span>
                </div>
                
                <div 
                  className={`bg-white p-2.5 rounded-lg border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-50 transition-colors ${personalInfo.preferredAddress === 'contact' ? 'border-amber-200 bg-amber-50/30' : ''}`}
                  onClick={() => onSetPreferredAddress('contact')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Mail size={10} className="text-slate-400" />
                      <span className="text-sm text-slate-500">联系地址</span>
                    </div>
                    {renderAddressBadge('contact', personalInfo.preferredAddress)}
                  </div>
                  <span className="text-sm text-slate-700 truncate block">{personalInfo.contactAddress}</span>
                </div>
                
                <div 
                  className={`bg-white p-2.5 rounded-lg border border-slate-100 space-y-2 cursor-pointer hover:bg-slate-50 transition-colors ${personalInfo.preferredAddress === 'other' ? 'border-amber-200 bg-amber-50/30' : ''}`}
                  onClick={() => onSetPreferredAddress('other')}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin size={10} className="text-slate-400" />
                      <span className="text-sm text-slate-500">其他地址</span>
                    </div>
                    {renderAddressBadge('other', personalInfo.preferredAddress)}
                  </div>
                  <span className="text-sm text-slate-700 truncate block">{personalInfo.otherAddress}</span>
                </div>
              </div>
              
              {/* Specialties */}
              <div className="bg-white p-2.5 rounded-lg border border-slate-100 space-y-1">
                <span className="text-sm text-slate-500 block font-medium">主要专业特长</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {personalInfo.specialties.map((spec, idx) => (
                    <span key={idx} className="bg-indigo-50 text-indigo-600 border border-indigo-100/60  text-sm px-2 py-0.5 rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
              
              
            </div>
          )}
        </div>

        {/* SECTION 2: 工作单位 (Workplace) */}
        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('work')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <Building2 size={15} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800 leading-none">工作单位</h3>
                <p className="text-sm text-slate-500 font-medium">执业/研究单位及当前岗位</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToEdit('workInfoEdit');
                }}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Edit3 size={14} />
              </button>
              <ChevronRight 
                size={14} 
                className={`text-slate-500 transition-transform duration-300 ${activeSection === 'work' ? 'rotate-90' : ''}`} 
              />
            </div>
          </button>

          {activeSection === 'work' && (
            <div className="border-t border-slate-100 p-3.5 pt-2 bg-slate-50/30 text-left space-y-2 animate-slide-up">
              <div className="pt-2 space-y-2 text-sm">
                <div className="bg-white p-3 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm">
                    <Building2 size={14} />
                    <span className="truncate">{workInfo.company}</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-slate-500 font-medium block">现任职务</span>
                      <strong className="text-slate-700 font-bold block truncate">{workInfo.position}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 font-medium block">行业资质</span>
                      <strong className="text-slate-700 font-bold block truncate">{workInfo.qualification}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 3: 个人履历 (Resume / Experience / Publications) */}
        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('resume')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <FileText size={15} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800 leading-none">个人履历</h3>
                <p className="text-sm text-slate-500 font-medium">学术背景、执业年限及学术专著</p>
              </div>
            </div>
            <ChevronRight 
              size={14} 
              className={`text-slate-500 transition-transform duration-300 ${activeSection === 'resume' ? 'rotate-90' : ''}`} 
            />
          </button>

          {activeSection === 'resume' && (
            <div className="border-t border-slate-100 p-3.5 pt-2 bg-slate-50/30 text-left space-y-2 animate-slide-up">
              <div className="pt-2 space-y-3 text-sm">
                <div className="relative border-l-2 border-indigo-100 pl-4 space-y-4">
                  {/* Item 1 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-600 border border-white" />
                    <span className="text-sm font-bold text-indigo-600 bg-indigo-50 border border-indigo-100/50 px-2 py-0.2 rounded font-mono">
                      2002年 - 2005年
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">西南政法大学 • 法学硕士学位</h4>
                    <p className="text-sm text-slate-500 mt-0.5">主修商法及民事诉讼，发表多篇法学核心期刊论文。</p>
                  </div>
                  
                  {/* Item 2 */}
                  <div className="relative">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-400 border border-white" />
                    <span className="text-sm font-bold text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.2 rounded font-mono">
                      2006年 - 至今
                    </span>
                    <h4 className="font-bold text-slate-800 text-sm mt-1">深耕巨额重大商事仲裁及民商事司法事务</h4>
                    <p className="text-sm text-slate-500 mt-0.5">代理各类型涉外股权、重大建设工程和金融合规仲裁及诉讼，总争议金额超数十亿元人民币，并出任多家世界五百强及知名国企特约法律顾问。</p>
                  </div>
                </div>

                <div className="bg-amber-50/40 border border-amber-100 p-2.5 rounded-lg space-y-1">
                  <div className="flex items-center gap-2 text-amber-800 text-sm font-bold">
                    <Award size={12} className="text-amber-600" />
                    <span>核心代表著作</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    撰写出版《中国商事仲裁裁决效力及撤销规则研究》及《股权投资退出纠纷要案裁量实务》，受仲裁同仁广泛引用。
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION 4: 银行账号信息 (Bank Account Info) */}
        <div className="bg-white rounded-lg border border-slate-100 overflow-hidden transition-all duration-300">
          <button 
            onClick={() => toggleSection('bank')}
            className="w-full p-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors text-left"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-indigo-50 border border-indigo-100/50 text-indigo-600">
                <CreditCard size={15} />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-sm font-bold text-slate-800 leading-none">银行账号信息</h3>
                <p className="text-sm text-slate-500 font-medium">本庭办案报酬与津贴发放指定账户</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onNavigateToEdit('bankInfoEdit');
                }}
                className="p-1.5 rounded-lg bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors"
              >
                <Edit3 size={14} />
              </button>
              <ChevronRight 
                size={14} 
                className={`text-slate-500 transition-transform duration-300 ${activeSection === 'bank' ? 'rotate-90' : ''}`} 
              />
            </div>
          </button>

          {activeSection === 'bank' && (
            <div className="border-t border-slate-100 p-3.5 pt-2 bg-slate-50/30 text-left space-y-2 animate-slide-up">
              <div className="pt-2 space-y-2.5 text-sm">
                {/* Premium Credit Card Display */}
                <div className="bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 text-white rounded-xl p-3.5 shadow-md space-y-4 relative overflow-hidden">
                  {/* Subtle vector circles */}
                  <div className="absolute right-[-10px] top-[-10px] w-20 h-20 rounded-full bg-white/5 pointer-events-none" />
                  
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-sm tracking-widest text-indigo-200 uppercase font-bold">仲裁员专款汇账卡</span>
                      <h4 className="font-bold text-sm text-white truncate">{bankInfo.bank}</h4>
                    </div>
                    <span className="text-sm bg-white/20 border border-white/10 text-white px-1.5 py-0.5 rounded font-bold font-mono">
                      {bankInfo.branch}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-sm text-indigo-200 block">卡号</span>
                    <span className="text-sm font-bold font-mono tracking-widest block">
                      {bankInfo.accountNo}
                    </span>
                  </div>

                  <div className="flex justify-between items-end border-t border-white/10 pt-2 text-sm text-indigo-100 font-medium">
                    <span className="truncate">账户户名：<strong className="text-white font-bold">{bankInfo.accountName}</strong></span>
                    <div className="flex items-center gap-1 text-emerald-300">
                      <ShieldCheck size={11} />
                      <span className="font-bold">已通过CA盾实名绑定</span>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-slate-500 font-medium leading-relaxed text-center px-2">
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
            className="w-full bg-white border border-red-100 hover:bg-rose-50 text-red-600 font-bold p-3 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 hover:shadow-sm"
          >
            <LogOut size={14} className="text-red-500" />
            <span className="text-sm">退出登录</span>
          </button>
          
         
        </div>

      </div>

      {/* Logout Confirmation Dialog Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-5">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 border border-slate-100 shadow-xl space-y-4 animate-scale-up text-left">
            <div className="space-y-1">
              <span className="text-sm bg-red-50 text-red-600 border border-red-100/60 px-2 py-0.5 rounded font-bold font-mono">
                SECURITY EXIT
              </span>
              <h3 className="text-sm font-bold text-slate-800">确认安全退出账号吗？</h3>
              <p className="text-sm text-slate-500 leading-relaxed font-medium">
                退出后，系统将清除本地CA联存证明核验口令，再次进入需要重新进行双因子指纹及数字CA盾签注校验。
              </p>
            </div>
            
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setShowExitConfirm(false)}
                className="flex-1 bg-slate-50 hover:bg-slate-100 text-slate-600 font-medium py-2.5 text-sm rounded-md transition-all cursor-pointer border border-slate-200"
              >
                取消
              </button>
              <button 
                onClick={() => {
                  setShowExitConfirm(false);
                  onLogout();
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 text-sm rounded-xl transition-all cursor-pointer border border-red-500 shadow-md shadow-red-200"
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