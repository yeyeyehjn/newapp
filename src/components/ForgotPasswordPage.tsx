import React, { useState } from 'react';
import {
  ChevronLeft, User, Smartphone, ShieldCheck, Lock, CheckCircle2, ArrowRight, Eye, EyeOff
} from 'lucide-react';
import { Stepper, FormField, CodeButton } from './LoginShared';

interface ForgotPasswordPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export default function ForgotPasswordPage({ onBack, onComplete }: ForgotPasswordPageProps) {
  // 两步流程：1 = 账号验证，2 = 重置密码
  const [step, setStep] = useState<1 | 2>(1);

  // 第一步：登录账号 + 手机号 + 短信验证码
  const [forgotAccount, setForgotAccount] = useState<string>('');
  const [forgotPhone, setForgotPhone] = useState<string>('');
  const [forgotCode, setForgotCode] = useState<string>('');
  const [forgotCd, setForgotCd] = useState<number>(0);

  // 第二步：新密码 + 确认密码
  const [forgotPassword, setForgotPassword] = useState<string>('');
  const [forgotConfirm, setForgotConfirm] = useState<string>('');
  const [forgotShowPwd, setForgotShowPwd] = useState<boolean>(false);
  const [forgotShowConfirm, setForgotShowConfirm] = useState<boolean>(false);

  // 验证码倒计时
  React.useEffect(() => {
    if (forgotCd <= 0) return;
    const t = window.setTimeout(() => setForgotCd((c) => Math.max(0, c - 1)), 1000);
    return () => window.clearTimeout(t);
  }, [forgotCd]);

  const isValidForgotAccount = forgotAccount.trim().length >= 2;
  const isValidForgotPhone = /^1[3-9]\d{9}$/.test(forgotPhone);
  const canSendForgotCode = isValidForgotAccount && isValidForgotPhone && forgotCd === 0;
  const isValidForgotCode = forgotCode.length === 6;
  const isValidForgotPwd = forgotPassword.length >= 6;
  const isValidForgotConfirm = forgotPassword.length >= 6 && forgotPassword === forgotConfirm;

  const handleSendForgotCode = () => {
    if (!canSendForgotCode) return;
    setForgotCd(60);
  };

  const canNext = step === 1 ? (isValidForgotAccount && isValidForgotPhone && isValidForgotCode) : isValidForgotConfirm;

  const handlePrimary = () => {
    if (step === 1) {
      if (!canNext) return;
      setStep(2);
    } else {
      if (!canNext) return;
      onComplete();
    }
  };

  const handleBack = () => {
    if (step === 2) setStep(1);
    else onBack();
  };

  return (
    <div className="flex-1 bg-slate-50 text-slate-800 flex flex-col overflow-y-auto no-scrollbar font-sans relative">
      {/* 顶部导航栏（微信小程序子页样式） */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={handleBack}
          aria-label="返回上一页"
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">
          忘记密码
        </div>
      </div>

      {/* 步进指示 */}
      <div className="px-5 mt-4">
        <Stepper current={step} total={2} labels={['账号验证', '重置密码']} />
      </div>

      {/* 表单卡（白色背景仅承载输入框） */}
      <div className="px-5 mt-4">
        <div className="bg-white rounded-lg border border-slate-100 px-5 py-1 text-left">
          {step === 1 ? (
            <>
              <FormField
                icon={<User size={16} />}
                label="登录账号"
                placeholder="请输入登录账号"
                value={forgotAccount}
                onChange={(v) => setForgotAccount(v)}
              />
              <FormField
                icon={<Smartphone size={16} />}
                label="手机号"
                placeholder="请输入 11 位手机号"
                value={forgotPhone}
                onChange={(v) => setForgotPhone(v.replace(/\D/g, '').slice(0, 11))}
                type="tel"
                maxLength={11}
              />
              <FormField
                icon={<ShieldCheck size={16} />}
                label="短信验证码"
                placeholder="请输入 6 位验证码"
                value={forgotCode}
                onChange={(v) => setForgotCode(v.replace(/\D/g, '').slice(0, 6))}
                type="tel"
                maxLength={6}
                rightSlot={
                  <CodeButton
                    countdown={forgotCd}
                    canSend={canSendForgotCode}
                    onClick={handleSendForgotCode}
                  />
                }
                noLine
              />
            </>
          ) : (
            <>
              <FormField
                icon={<Lock size={16} />}
                label="新密码"
                placeholder="请输入新密码（至少 6 位）"
                value={forgotPassword}
                onChange={(v) => setForgotPassword(v)}
                type={forgotShowPwd ? 'text' : 'password'}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setForgotShowPwd((s) => !s)}
                    className="text-slate-500 hover:text-indigo-600 p-1.5 -mr-1 cursor-pointer transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                    aria-label={forgotShowPwd ? '隐藏密码' : '显示密码'}
                  >
                    {forgotShowPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
              />
              <FormField
                icon={<CheckCircle2 size={16} />}
                label="确认密码"
                placeholder="请再次输入新密码"
                value={forgotConfirm}
                onChange={(v) => setForgotConfirm(v)}
                type={forgotShowConfirm ? 'text' : 'password'}
                rightSlot={
                  <button
                    type="button"
                    onClick={() => setForgotShowConfirm((s) => !s)}
                    className="text-slate-500 hover:text-indigo-600 p-1.5 -mr-1 cursor-pointer transition-colors rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
                    aria-label={forgotShowConfirm ? '隐藏密码' : '显示密码'}
                  >
                    {forgotShowConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                }
                noLine
              />
            </>
          )}
        </div>

        {/* 主操作（外层，白色卡片之外） */}
        <div className="mt-6 pb-8 flex flex-col gap-3">
          <button
            onClick={handlePrimary}
            disabled={!canNext}
            className={`w-full font-black py-3.5 text-base rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2 border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 focus-visible:ring-offset-1 ${
              !canNext
                ? 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white border-indigo-600 shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-600/40'
            }`}
          >
            <span>{step === 1 ? '下一步 · 重置密码' : '完成'}</span>
            <ArrowRight size={14} />
          </button>

          {/* 返回登录：位于主按钮下方 */}
          <button
            type="button"
            onClick={onBack}
            className="w-full py-3.5 text-base  text-slate-500 hover:text-slate-700 rounded-lg cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40"
          >
            返回登录
          </button>
        </div>
      </div>
    </div>
  );
}