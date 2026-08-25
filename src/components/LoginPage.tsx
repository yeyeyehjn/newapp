import React, { useState, useEffect, useRef } from 'react';
import {
  ScanFace, KeyRound, Smartphone, Mail, ChevronRight, ChevronLeft,
  Eye, EyeOff, RefreshCw, CheckCircle2, ArrowRight, User, Lock, ShieldCheck
} from 'lucide-react';
import ForgotPasswordPage from './ForgotPasswordPage';
import { Stepper, FormField, CodeButton } from './LoginShared';

type LoginMethod = 'face' | 'password';
// 密码流第二步的双因素验证通道
type VerifyChannel = 'sms' | 'email';

interface LoginPageProps {
  onLogin: () => void;
}

// 人脸采集过程中的活体动作提示序列（模拟）
const LIVENESS_HINTS = ['请将正脸置于取景框内', '请眨眼', '请轻微左右转头'] as const;

export default function LoginPage({ onLogin }: LoginPageProps) {
  // null = 登录方式选择页；否则为已选方式
  const [selectedMethod, setSelectedMethod] = useState<LoginMethod | null>(null);

  // 人脸流 · 第一步
  const [phone, setPhone] = useState<string>('');
  const [code, setCode] = useState<string>('');

  // 密码流 · 第一步
  const [account, setAccount] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPwd, setShowPwd] = useState<boolean>(false);

  // 密码流 · 第二步（双因素）
  const [boundPhone, setBoundPhone] = useState<string>('');
  const [boundEmail, setBoundEmail] = useState<string>('');
  const [channel, setChannel] = useState<VerifyChannel>('sms');

  // 各通道独立倒计时（秒）：face = 人脸流手机号；sms / email = 密码流双因素
  const [countdowns, setCountdowns] = useState<{ face: number; sms: number; email: number }>({ face: 0, sms: 0, email: 0 });

  const [agreed, setAgreed] = useState<boolean>(true);
  const [step, setStep] = useState<1 | 2>(1);

  // 页面视图：'login' 登录流程；'forgot' 忘记密码独立页面
  const [view, setView] = useState<'login' | 'forgot'>('login');

  // 人脸识别模拟状态
  const [faceScanning, setFaceScanning] = useState<boolean>(false);
  const [faceScanned, setFaceScanned] = useState<boolean>(false);
  const [livenessIdx, setLivenessIdx] = useState<number>(0);
  const scanTimerRef = useRef<number | null>(null);
  const hintTimerRef = useRef<number | null>(null);

  const clearScanTimers = () => {
    if (scanTimerRef.current) window.clearTimeout(scanTimerRef.current);
    if (hintTimerRef.current) window.clearInterval(hintTimerRef.current);
    scanTimerRef.current = null;
    hintTimerRef.current = null;
  };

  useEffect(() => clearScanTimers, []);

  // 统一倒计时：每秒递减所有进行中的通道
  useEffect(() => {
    if (countdowns.face <= 0 && countdowns.sms <= 0 && countdowns.email <= 0) return;
    const t = window.setTimeout(() => {
      setCountdowns((c) => ({
        face: Math.max(0, c.face - 1),
        sms: Math.max(0, c.sms - 1),
        email: Math.max(0, c.email - 1),
      }));
    }, 1000);
    return () => window.clearTimeout(t);
  }, [countdowns]);

  const isValidPhone = /^1[3-9]\d{9}$/.test(phone);
  const isValidCode = code.length === 6;
  const isValidAccount = account.trim().length >= 2;
  const isValidPassword = password.length >= 6;

  const isFace = selectedMethod === 'face';

  const startCountdown = (key: 'face' | 'sms' | 'email') => {
    setCountdowns((c) => ({ ...c, [key]: 60 }));
  };

  // 人脸流 · 第一步手动发送短信验证码
  const faceCountdown = countdowns.face;
  const canSendFaceCode = isValidPhone && faceCountdown === 0;

  // 密码流 · 双因素手动发送（目标为系统绑定的手机 / 邮箱）
  const channelCountdown = channel === 'sms' ? countdowns.sms : countdowns.email;
  const canSendChannelCode = channelCountdown === 0;

  const handleSendCode = () => {
    if (isFace) {
      if (!canSendFaceCode) return;
      startCountdown('face');
    } else {
      if (!canSendChannelCode) return;
      startCountdown(channel);
    }
  };

  // 模拟人脸采集：活体提示每 0.8s 切换一次，2.4s 后核验通过
  const startFaceScan = () => {
    if (!isValidPhone || !isValidCode) return;
    clearScanTimers();
    setFaceScanned(false);
    setFaceScanning(true);
    setLivenessIdx(0);
    hintTimerRef.current = window.setInterval(() => {
      setLivenessIdx((i) => Math.min(i + 1, LIVENESS_HINTS.length - 1));
    }, 800);
    scanTimerRef.current = window.setTimeout(() => {
      clearScanTimers();
      setFaceScanning(false);
      setFaceScanned(true);
    }, 2400);
  };

  const resetForm = () => {
    setPhone('');
    setCode('');
    setAccount('');
    setPassword('');
    setShowPwd(false);
    setBoundPhone('');
    setBoundEmail('');
    setChannel('sms');
    setCountdowns({ face: 0, sms: 0, email: 0 });
    setStep(1);
    setFaceScanned(false);
    setFaceScanning(false);
    setLivenessIdx(0);
    clearScanTimers();
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
    clearScanTimers();
  };

  // 第一步 → 第二步
  const goNextFromFaceStep1 = () => {
    if (!isValidPhone || !isValidCode) return;
    setStep(2);
  };
  const goNextFromPwdStep1 = () => {
    if (!isValidAccount || !isValidPassword) return;
    // 模拟后端下发该账号绑定的手机号与邮箱（脱敏展示）
    const seed = account.trim();
    const last4 = (seed.charCodeAt(0) * 31 + seed.charCodeAt(seed.length - 1) * 17).toString().slice(-4).padStart(4, '0');
    setBoundPhone(`139****${last4}`);
    setBoundEmail(`${seed.charAt(0).toLowerCase() || 'u'}***@gzac.org.cn`);
    setStep(2);
  };

  // 切换双因素通道：验证码与通道绑定，切换后须重新获取
  const handleSwitchChannel = (c: VerifyChannel) => {
    if (c === channel) return;
    setChannel(c);
    setCode('');
  };

  // 最终登录
  const handleFinalLogin = () => {
    if (isFace) {
      if (!isValidPhone || !isValidCode || !faceScanned) return;
    } else {
      if (!isValidCode) return;
    }
    onLogin();
  };

  // ---------- 忘记密码：以独立页面渲染，返回 / 完成时回到登录流程 ----------
  const openForgot = () => setView('forgot');
  const handleBackFromForgot = () => setView('login');
  const handleForgotComplete = () => {
    setView('login');
    resetForm();
  };

  // ---------- 登录方式选择 ----------
  if (!selectedMethod) {
    return (
      <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col overflow-y-auto no-scrollbar font-sans">
        {/* 品牌区 */}
      <div className="px-6 pt-18 pb-8">
        <div className="flex flex-col items-center">
          <img
            src={import.meta.env.BASE_URL + "tu/new-logo2.png"}
            alt="广州仲裁委员会"
            className="w-40 h-auto object-contain "
          />
          
        </div>
      </div>

        {/* 登录方式卡片 */}
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
            desc="账号密码 + 绑定手机/邮箱验证"
            steps={['校验账号密码', '短信/邮箱验证码']}
            accent="emerald"
            onClick={() => handleSelectMethod('password')}
          />
        </div>
      </div>
    );
  }

  // ---------- 两步流程 ----------
  const totalSteps = 2;

  // 忘记密码独立页面
  if (view === 'forgot') {
    return (
      <ForgotPasswordPage
        onBack={handleBackFromForgot}
        onComplete={handleForgotComplete}
      />
    );
  }

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
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col overflow-y-auto no-scrollbar font-sans relative">
      {/* 顶部导航栏（微信小程序子页样式） */}
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

      {/* 步进指示 */}
      <div className="px-5 mt-4">
        <Stepper
          current={step}
          total={totalSteps}
          labels={isFace ? ['手机验证', '人脸识别'] : ['账号密码', '双因素校验']}
        />
      </div>

      {/* 表单卡（白色背景仅承载输入框） */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-lg border border-slate-100 px-5 py-1 text-left">
          {/* === 人脸流 · 第一步：手机号 + 短信验证码 === */}
          {isFace && step === 1 && (
            <>
              <FormField
                icon={<Smartphone size={16} />}
                label="手机号码"
                placeholder="请输入 11 位手机号"
                value={phone}
                onChange={(v) => setPhone(v.replace(/\D/g, '').slice(0, 11))}
                type="tel"
                maxLength={11}
              />
              <FormField
                icon={<ShieldCheck size={16} />}
                label="短信验证码"
                placeholder="请输入 6 位验证码"
                value={code}
                onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                type="tel"
                maxLength={6}
                rightSlot={
                  <CodeButton
                    countdown={faceCountdown}
                    canSend={canSendFaceCode}
                    onClick={handleSendCode}
                  />
                }
                noLine
              />
            </>
          )}

          {/* === 人脸流 · 第二步：人脸识别取景 === */}
          {isFace && step === 2 && (
            <>
              <div className="flex items-center h-11 text-sm text-slate-500">
                已验证手机
                <span className="font-bold text-slate-700 font-mono mx-1">{phone}</span>
                <CheckCircle2 size={12} className="ml-0.5 text-emerald-500" />
              </div>

              <div>
                {/* 取景框：四角定位 + 椭圆面部引导 + 扫描线 + 活体动作提示 */}
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
                  aria-label="开始人脸识别"
                  className={`relative h-48 rounded-xl border-2 border-dashed overflow-hidden cursor-pointer transition-all flex flex-col items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                    faceScanning
                      ? 'border-indigo-500 bg-indigo-50/40'
                      : faceScanned
                        ? 'border-emerald-200 bg-emerald-50/40'
                        : 'border-indigo-200 bg-slate-50/50 hover:border-indigo-400 hover:bg-indigo-50/30'
                  }`}
                >
                  {/* 四角定位框 */}
                  <div className={`absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 transition-colors ${faceScanning ? 'border-indigo-500' : faceScanned ? 'border-emerald-400' : 'border-indigo-300'}`} />
                  <div className={`absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 transition-colors ${faceScanning ? 'border-indigo-500' : faceScanned ? 'border-emerald-400' : 'border-indigo-300'}`} />
                  <div className={`absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 transition-colors ${faceScanning ? 'border-indigo-500' : faceScanned ? 'border-emerald-400' : 'border-indigo-300'}`} />
                  <div className={`absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 transition-colors ${faceScanning ? 'border-indigo-500' : faceScanned ? 'border-emerald-400' : 'border-indigo-300'}`} />

                  {faceScanning && (
                    <>
                      {/* 面部椭圆引导 */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-24 h-32 rounded-[50%] border-2 border-indigo-400/70" />
                      </div>
                      {/* 扫描线 */}
                      <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-scan-line" />
                      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-indigo-600/15 to-transparent" />
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
                  {/* 活体动作提示 / 待机提示 */}
                  <p className="text-sm text-slate-500 mt-0.5 font-medium animate-fade-in">
                    {faceScanning
                      ? LIVENESS_HINTS[livenessIdx]
                      : faceScanned
                        ? '核验通过，请点击下方按钮登录'
                        : '请确保光线充足、面部无遮挡'}
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

          {/* === 密码流 · 第一步：账号 + 密码 === */}
          {!isFace && step === 1 && (
            <>
              <FormField
                icon={<User size={16} />}
                label="仲裁员账号"
                placeholder="请输入用户名 / 账号"
                value={account}
                onChange={setAccount}
              />
              <FormField
                icon={<Lock size={16} />}
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
                noLine
              />
            </>
          )}

          {/* === 密码流 · 第二步：双因素校验（短信 / 邮箱） === */}
          {!isFace && step === 2 && (
            <>
              <div className="flex items-center h-11 text-sm text-slate-500">
                账号
                <span className="font-bold text-slate-700 font-mono mx-1">{account}</span>
                已验证
                <CheckCircle2 size={12} className="ml-0.5 text-emerald-500" />
              </div>

              {/* 通道分段选项卡 + 目的地 */}
              <div className="space-y-2">
                <div className="flex bg-slate-100/80 rounded-lg p-1 gap-1" role="tablist" aria-label="双因素验证通道">
                  <button
                    role="tab"
                    aria-selected={channel === 'sms'}
                    onClick={() => handleSwitchChannel('sms')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-bold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                      channel === 'sms'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Smartphone size={12} />
                    短信验证
                  </button>
                  <button
                    role="tab"
                    aria-selected={channel === 'email'}
                    onClick={() => handleSwitchChannel('email')}
                    className={`flex-1 flex items-center justify-center gap-1 py-2 text-sm font-bold rounded-md transition-all cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
                      channel === 'email'
                        ? 'bg-white text-indigo-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    <Mail size={12} />
                    邮箱验证
                  </button>
                </div>
                <div className="flex items-center h-6 text-sm text-slate-500">
                  验证码将发送至
                  <span className="font-bold text-slate-700 font-mono mx-1">
                    {channel === 'sms' ? boundPhone : boundEmail}
                  </span>
                </div>
              </div>

              <FormField
                icon={<ShieldCheck size={16} />}
                label={channel === 'sms' ? '短信验证码' : '邮箱验证码'}
                placeholder="请输入 6 位验证码"
                value={code}
                onChange={(v) => setCode(v.replace(/\D/g, '').slice(0, 6))}
                type="tel"
                maxLength={6}
                rightSlot={
                  <CodeButton
                    countdown={channelCountdown}
                    canSend={canSendChannelCode}
                    onClick={handleSendCode}
                  />
                }
                noLine
              />
            </>
          )}
        </div>

        {/* 协议 + 主操作（外层，白色卡片之外） */}
        <div className="mt-6 pb-8 space-y-3">
          {step === 2 && (
            <label className="flex items-start gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-3.5 h-3.5 accent-indigo-600 cursor-pointer"
              />
              <span className="text-sm text-slate-500 leading-relaxed font-medium">
                我已阅读并同意
                <span className="text-indigo-600 font-bold mx-0.5">《仲裁员端服务协议》</span>
                与
                <span className="text-indigo-600 font-bold mx-0.5">《隐私及CA盾数据政策》</span>
              </span>
            </label>
          )}

          {/* 忘记密码：位于主按钮上方（仅密码流第一步） */}
          {!isFace && step === 1 && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={openForgot}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 rounded"
              >
                忘记密码
              </button>
            </div>
          )}

          <button
            onClick={handlePrimary}
            disabled={!canNext || (step === 2 && !agreed)}
            className={`w-full font-black py-3.5 text-base rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1 ${
              (!canNext || (step === 2 && !agreed))
                ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white border-indigo-600 shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40'
            }`}
          >
            <span>{step === 1 ? (isFace ? '下一步 · 人脸识别' : '下一步 · 双因素校验') : '登录'}</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

    </div>
  );
}

// =================================================================
// 子组件
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
                <span className={`inline-flex items-center gap-1 text-xs  border rounded px-1.5 py-1 ${a.chip}`}>
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
