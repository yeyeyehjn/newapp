import React, { useState, useEffect, useRef } from 'react';
import {
  ScanFace, KeyRound, Smartphone, ShieldCheck, ChevronRight, ChevronLeft,
  Eye, EyeOff, RefreshCw, CheckCircle2, Lock, User, ArrowRight, Sparkles
} from 'lucide-react';

type LoginMethod = 'face' | 'password';

interface LoginPageProps {
  onLogin: () => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  // 0 = method selection; otherwise the chosen method
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod | null>(null);

  // Common fields
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [agreed, setAgreed] = useState<boolean>(true);

  // Password-specific fields
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [boundPhone, setBoundPhone] = useState<string>(''); // simulated fetched phone

  // Step indicator (1 or 2)
  const [step, setStep] = useState<1 | 2>(1);

  // Face recognition mock state
  const [faceScanning, setFaceScanning] = useState<boolean>(false);
  const [faceScanned, setFaceScanned] = useState<boolean>(false);
  const scanTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (scanTimerRef.current) {
        window.clearTimeout(scanTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (countdown <= 0) return;
    const t = window.setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => window.clearTimeout(t);
  }, [countdown]);

  const isValidPhone = /^1[3-9]\d{9}$/.test(phone);
  const isValidCode = code.length === 6;
  const isValidAccount = account.trim().length >= 2;
  const isValidPassword = password.length >= 6;

  const canSendCode = isValidPhone && countdown === 0;

  const handleSendCode = () => {
    if (!canSendCode) return;
    setCountdown(60);
  };

  const startFaceScan = () => {
    if (!isValidPhone || !isValidCode) return;
    setFaceScanning(true);
    setFaceScanned(false);
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    scanTimerRef.current = window.setTimeout(() => {
      setFaceScanning(false);
      setFaceScanned(true);
    }, 2200);
  };

  const resetForm = () => {
    setPhone('');
    setCode('');
    setAccount('');
    setPassword('');
    setShowPwd(false);
    setBoundPhone('');
    setStep(1);
    setFaceScanned(false);
    setFaceScanning(false);
  };

  const handleSelectMethod = (m: LoginMethod) => {
    resetForm();
    setSelectedMethod(m);
  };

  const handleBackToMethods = () => {
    resetForm();
    setSelectedMethod(null);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setCode('');
    setFaceScanned(false);
    setFaceScanning(false);
  };

  // Step 1 -> Step 2 transitions
  const goNextFromFaceStep1 = () => {
    if (!isValidPhone || !isValidCode) return;
    setStep(2);
  };
  const goNextFromPwdStep1 = () => {
    if (!isValidAccount || !isValidPassword) return;
    // simulate fetching the bound phone from the account
    const seed = account.trim();
    // generate a deterministic-looking 11-digit number
    const last4 = (seed.charCodeAt(0) * 31 + seed.charCodeAt(seed.length - 1) * 17).toString().slice(-4).padStart(4, '0');
    setBoundPhone(`139****${last4}`);
    setStep(2);
  };

  // Final login
  const handleFinalLogin = () => {
    if (selectedMethod === 'face') {
      if (!isValidPhone || !isValidCode || !faceScanned) return;
    } else {
      if (!isValidCode) return;
    }
    onLogin();
  };

  // ---------- Render Method Selection ----------
  if (!selectedMethod) {
    return (
      <div className="flex-1 bg-gradient-to-br from-[#F4F7FE] via-[#EEF3FF] to-[#E6EEFF] text-slate-800 flex flex-col overflow-y-auto no-scrollbar font-sans">
        {/* Top Brand Header */}
        <div className="px-6 pt-10 pb-5 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <img
              src={import.meta.env.BASE_URL + "tu/logo1.png"}
              alt="广州仲裁委"
              className="w-18 h-18"
            />
            
          </div>
          
        </div>

        {/* Method Cards */}
        <div className="px-5 mt-3 pb-6 space-y-3">
          <MethodCard
            icon={<ScanFace size={22} />}
            title="人脸识别登录"
            desc="手机验证码 + 人脸识别核验"
            steps={['校验手机号', '人脸识别']}
            accent="indigo"
            onClick={() => handleSelectMethod('face')}
          />
          <MethodCard
            icon={<KeyRound size={22} />}
            title="账号密码登录"
            desc="账号密码 + 绑定手机短信/邮箱验证"
            steps={['校验账号密码', '短信/邮箱验证码验证']}
            accent="emerald"
            onClick={() => handleSelectMethod('password')}
          />

          
        </div>
      </div>
    );
  }

  // ---------- Render Multi-step Form ----------
  const isFace = selectedMethod === 'face';
  const totalSteps = 2;
  const stepTitle = isFace
    ? step === 1 ? '手机号验证' : '人脸识别'
    : step === 1 ? '账号密码验证' : '短信验证';

  // Determine if Next/Login button should be enabled
  const canNext = isFace
    ? (step === 1 ? (isValidPhone && isValidCode) : faceScanned)
    : (step === 1 ? (isValidAccount && isValidPassword) : isValidCode);

  const handlePrimary = () => {
    if (step === 1) {
      if (isFace) goNextFromFaceStep1();
      else goNextFromPwdStep1();
    } else {
      handleFinalLogin();
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-[#F4F7FE] via-[#EEF3FF] to-[#E6EEFF] text-slate-800 flex flex-col overflow-y-auto no-scrollbar font-sans">
      {/* Header - 微信小程序子页面返回样式 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={step === 1 ? handleBackToMethods : handleBackToStep1}
          aria-label="返回上一页"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          {isFace ? '人脸识别登录' : '账号密码登录'}
        </div>
      </div>

      {/* Stepper */}
      <div className="px-6 mt-4">
        <Stepper current={step} total={totalSteps} labels={isFace ? ['手机验证', '人脸识别'] : ['账号密码', '短信/邮箱验证码验证']} />
      </div>

      {/* Form Card */}
      <div className="px-5 mt-3 pb-6">
        <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-3.5">
          {/* Card Header */}
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-blue-50 flex items-center justify-center text-indigo-600">
                <Sparkles size={12} />
              </div>
              <span className="text-base font-black text-slate-800">
                第 {step} 步 · {stepTitle}
              </span>
            </div>
            <span className="text-xs font-mono font-black tracking-widest text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded">
              STEP {step}/{totalSteps}
            </span>
          </div>

          {/* === FACE: Step 1: Phone + Code === */}
          {isFace && step === 1 && (
            <>
              <FormField
                icon={<Smartphone size={14} className="text-slate-400" />}
                label="手机号码"
                placeholder="请输入 11 位手机号"
                value={phone}
                onChange={setPhone}
                type="tel"
                maxLength={11}
                rightSlot={
                  <button
                    onClick={handleSendCode}
                    disabled={!canSendCode}
                    className={`text-base  px-2.5 py-1.5 rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                      canSendCode
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 active:scale-95 cursor-pointer'
                        : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                }
              />
              <FormField
                icon={<ShieldCheck size={14} className="text-slate-400" />}
                label="短信验证码"
                placeholder="请输入 6 位验证码"
                value={code}
                onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                type="tel"
                maxLength={6}
              />
            </>
          )}

          {/* === FACE: Step 2: Face Scan === */}
          {isFace && step === 2 && (
            <>
              <div className="bg-indigo-50/40 border border-indigo-100 rounded-lg p-2.5 flex items-center gap-2">
                <Smartphone size={12} className="text-indigo-600 shrink-0" />
                <span className="text-base text-slate-600">已验证手机：</span>
                <span className="text-base font-black text-slate-800 font-mono">{phone}</span>
                <CheckCircle2 size={12} className="text-emerald-500 ml-auto" />
              </div>

              <div className="pt-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-base text-slate-600 flex items-center gap-1">
                    <ScanFace size={12} className="text-indigo-600" />
                    人脸识别核验
                  </span>
                  {faceScanned && (
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded inline-flex items-center gap-1">
                      <CheckCircle2 size={9} />
                      已采集
                    </span>
                  )}
                </div>

                <div
                  role="button"
                  tabIndex={0}
                  onClick={startFaceScan}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      startFaceScan();
                    }
                  }}
                  className={`relative h-40 rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                    faceScanning
                      ? 'border-indigo-500 bg-indigo-50/40'
                      : faceScanned
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-indigo-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30'
                  }`}
                >
                  {faceScanning && (
                    <>
                      <div className="absolute inset-3 rounded-full border-2 border-indigo-400/40 animate-ping" />
                      <div className="absolute inset-6 rounded-full border-2 border-indigo-500/60 animate-pulse" />
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan-line" />
                    </>
                  )}

                  <div
                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      faceScanned
                        ? 'bg-emerald-100 text-emerald-600'
                        : faceScanning
                          ? 'bg-indigo-100 text-indigo-600'
                          : 'bg-white border border-slate-200 text-slate-500'
                    }`}
                  >
                    {faceScanned ? (
                      <CheckCircle2 size={32} />
                    ) : (
                      <ScanFace size={32} className={faceScanning ? 'animate-pulse' : ''} />
                    )}
                  </div>

                  <p className={`text-sm font-bold mt-2 ${
                    faceScanned ? 'text-emerald-600' : faceScanning ? 'text-indigo-600' : 'text-slate-500'
                  }`}>
                    {faceScanning
                      ? '正在采集人脸特征…'
                      : faceScanned
                        ? '人脸采集成功'
                        : '点击开始人脸识别'}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">
                    {faceScanned ? '请保持正脸居中，光线充足' : '请将面部置于取景框内'}
                  </p>

                  {faceScanned && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startFaceScan();
                      }}
                      className="absolute top-2 right-2 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white/80 border border-slate-200 rounded-md px-1.5 py-0.5 inline-flex items-center gap-0.5 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                    >
                      <RefreshCw size={9} />
                      重新采集
                    </button>
                  )}
                </div>
              </div>
            </>
          )}

          {/* === PWD: Step 1: Account + Password === */}
          {!isFace && step === 1 && (
            <>
              <FormField
                icon={<User size={14} className="text-slate-400" />}
                label="仲裁员账号"
                placeholder="请输入用户名 / 账号"
                value={account}
                onChange={setAccount}
              />
              <FormField
                icon={<Lock size={14} className="text-slate-400" />}
                label="登录密码"
                placeholder="请输入密码（至少 6 位）"
                value={password}
                onChange={setPassword}
                type={showPwd ? 'text' : 'password'}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="text-slate-500 hover:text-indigo-600 p-1.5 -mr-1 cursor-pointer transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                    aria-label={showPwd ? '隐藏密码' : '显示密码'}
                  >
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
              <div className="flex items-center justify-end">
                <button className="text-sm text-slate-500 hover:text-indigo-600 cursor-pointer rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40">
                  忘记密码？
                </button>
              </div>
            </>
          )}

          {/* === PWD: Step 2: Bound Phone + Code === */}
          {!isFace && step === 2 && (
            <>
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-lg p-2.5 flex items-center gap-2">
                <User size={12} className="text-emerald-600 shrink-0" />
                <span className="text-2xs font-bold text-slate-600">已登录账号：</span>
                <span className="text-xs font-black text-slate-800 font-mono truncate">{account}</span>
                <CheckCircle2 size={12} className="text-emerald-500 ml-auto shrink-0" />
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-bold text-slate-500">
                  <Smartphone size={12} className="text-slate-400" />
                  <span>账号绑定手机号</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-50/60 border border-slate-100 rounded-lg px-2.5 py-2">
                  <span className="flex-1 text-xs font-black text-slate-800 font-mono">{boundPhone}</span>
                  <span className="text-2xs font-bold text-slate-500 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded inline-flex items-center gap-0.5">
                    <Lock size={9} />
                    系统已绑定
                  </span>
                </div>
              </div>

              <FormField
                icon={<ShieldCheck size={14} className="text-slate-400" />}
                label="短信验证码"
                placeholder="请输入 6 位验证码"
                value={code}
                onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                type="tel"
                maxLength={6}
                rightSlot={
                  <button
                    onClick={handleSendCode}
                    disabled={!canSendCode}
                    className={`text-sm font-bold px-2.5 py-1.5 rounded-md border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                      canSendCode
                        ? 'bg-indigo-50 text-indigo-600 border-indigo-100 hover:bg-indigo-100 active:scale-95 cursor-pointer'
                        : 'bg-slate-50 text-slate-400 border-slate-100 cursor-not-allowed'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                }
              />
            </>
          )}

          {/* Agreement + Primary Action */}
          <div className="pt-2 space-y-2.5">
            {step === 2 && (
              <label className="flex items-start gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-0.5 w-3.5 h-3.5 accent-indigo-600 cursor-pointer"
                />
                <span className="text-2xs text-slate-500 leading-relaxed font-medium">
                  我已阅读并同意
                  <span className="text-indigo-600 font-bold mx-0.5">《仲裁员端服务协议》</span>
                  与
                  <span className="text-indigo-600 font-bold mx-0.5">《隐私及CA盾数据政策》</span>
                </span>
              </label>
            )}

            <button
              onClick={handlePrimary}
              disabled={!canNext || (step === 2 && !agreed)}
              className={`w-full font-bold py-3 text-base rounded-xl cursor-pointer transition-all flex items-center justify-center gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1 ${
                (!canNext || (step === 2 && !agreed))
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white border-indigo-600 shadow-md shadow-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/40'
              }`}
            >
              <span>{step === 1 ? (isFace ? '下一步 · 人脸识别' : '下一步 · 短信验证') : '登录'}</span>
              <ArrowRight size={14} />
            </button>

            {step === 1 && !isFace && (
              <div className="text-center text-sm text-slate-400 font-medium pt-0.5">
                收不到验证码？请联系本委管理员
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// Sub Components
// =================================================================

interface MethodCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  steps: string[];
  accent: 'indigo' | 'emerald';
  onClick: () => void;
}

function MethodCard({ icon, title, desc, steps, accent, onClick }: MethodCardProps) {
  const accentMap = {
    indigo: {
      ring: 'hover:border-indigo-300',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-100/60',
      chip: 'text-indigo-600 bg-indigo-50 border-indigo-100',
      stepDot: 'bg-indigo-600',
    },
    emerald: {
      ring: 'hover:border-emerald-300',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100/60',
      chip: 'text-emerald-600 bg-emerald-50 border-emerald-100',
      stepDot: 'bg-emerald-600',
    },
  } as const;
  const a = accentMap[accent];

  return (
    <button
      onClick={onClick}
      className={`w-full text-left bg-white rounded-2xl border border-slate-100 p-4 cursor-pointer transition-all hover:shadow-md hover:-translate-y-0.5 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-2 ${a.ring} group`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border ${a.iconBg}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-800">{title}</h3>
            <ChevronRight size={14} className="text-slate-500 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
          </div>
          <p className="text-sm text-slate-500 font-medium mt-0.5 leading-relaxed">{desc}</p>

          <div className="flex items-center gap-1.5 mt-2.5">
            {steps.map((s, idx) => (
              <React.Fragment key={idx}>
                <span className={`inline-flex items-center gap-1 text-xs font-bold border rounded px-1.5 py-1 ${a.chip}`}>
                  <span className={`w-1 h-1 rounded-full ${a.stepDot}`} />
                  {s}
                </span>
                {idx < steps.length - 1 && (
                  <ChevronRight size={10} className="text-slate-500" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

interface StepperProps {
  current: number;
  total: number;
  labels: string[];
}

function Stepper({ current, total, labels }: StepperProps) {
  return (
    <div className="flex items-start">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const isActive = idx === current;
        const isDone = idx < current;
        return (
          <React.Fragment key={idx}>
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="relative">
                {/* Glow ring for active step */}
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-indigo-500/20 animate-ping" />
                )}
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center text-sm font-black border-2 transition-all duration-300 ${
                    isActive
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/40'
                      : isDone
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {isDone ? <CheckCircle2 size={14} /> : idx}
                </div>
              </div>
              <span className={`text-sm font-bold transition-colors duration-300 ${isActive ? 'text-indigo-600' : isDone ? 'text-indigo-600' : 'text-slate-400'}`}>
                {labels[i]}
              </span>
            </div>
            {/* Connector line */}
            {idx < total && (
              <div className="flex-1 mx-1.5 mt-4">
                <div className={`h-1 rounded-full transition-all duration-500 ${isDone ? 'bg-gradient-to-r from-indigo-600 to-indigo-400' : 'bg-slate-100'}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface FormFieldProps {
  icon: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'tel' | 'password';
  maxLength?: number;
  rightSlot?: React.ReactNode;
}

function FormField({ icon, label, placeholder, value, onChange, type = 'text', maxLength, rightSlot }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1 text-base  text-slate-500">
        {icon}
        <span>{label}</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-50/60 border border-slate-100 rounded-lg px-2.5 py-2 focus-within:border-indigo-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-500/15 transition-all">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          aria-label={label}
          className="flex-1 bg-transparent outline-none text-base font-bold text-slate-800 placeholder:text-slate-400 placeholder:font-medium min-w-0"
        />
        {rightSlot}
      </div>
    </div>
  );
}
