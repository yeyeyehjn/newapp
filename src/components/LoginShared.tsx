import React from 'react';
import { CheckCircle2 } from 'lucide-react';

// =================================================================
// 登录 / 忘记密码 共享子组件
// 说明：登录两步流程与忘记密码页面共用，避免代码重复
// =================================================================

interface StepperProps {
  current: number;
  total: number;
  labels: string[];
}

export function Stepper({ current, total, labels }: StepperProps) {
  return (
    <div className="flex items-start">
      {Array.from({ length: total }).map((_, i) => {
        const idx = i + 1;
        const isActive = idx === current;
        const isDone = idx < current;
        return (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <div className="relative">
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isActive
                      ? 'text-base font-black bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-500/40'
                      : isDone
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-400 border-slate-200'
                  }`}
                >
                  {isDone ? <CheckCircle2 size={18} /> : idx}
                </div>
              </div>
              <span className={`text-sm transition-colors duration-300 ${isActive ? 'font-black text-indigo-600' : isDone ? 'font-bold text-indigo-600' : 'font-bold text-slate-400'}`}>
                {labels[i]}
              </span>
            </div>
            {idx < total && (
              <div className="flex-1 mx-1.5 mt-5">
                <div className={`h-1.5 rounded-full transition-all duration-500 ${isDone ? 'bg-indigo-500' : 'bg-slate-100'}`} />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

interface FormFieldProps {
  icon?: React.ReactNode;
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: 'text' | 'tel' | 'password';
  maxLength?: number;
  rightSlot?: React.ReactNode;
  noLine?: boolean;
}

export function FormField({ icon, label, placeholder, value, onChange, type = 'text', maxLength, rightSlot, noLine }: FormFieldProps) {
  return (
    <div className={`flex items-center gap-3 h-14 transition-colors duration-200 focus-within:text-indigo-500 ${noLine ? '' : 'border-b border-slate-200 focus-within:border-indigo-500'}`}>
      {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
      <input
        id={label}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        aria-label={label}
        className="flex-1 bg-transparent min-w-0 py-0 outline-none text-base text-slate-800 placeholder:text-slate-400"
      />
      {rightSlot}
    </div>
  );
}

interface CodeButtonProps {
  countdown: number;
  canSend: boolean;
  onClick: () => void;
}

export function CodeButton({ countdown, canSend, onClick }: CodeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={!canSend}
      className={`shrink-0 h-7 px-3 rounded-lg text-sm  transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/40 ${
        canSend
          ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 active:scale-95 cursor-pointer'
          : 'text-slate-400 cursor-not-allowed'
      }`}
    >
      {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
    </button>
  );
}