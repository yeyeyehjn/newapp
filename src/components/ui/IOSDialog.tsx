import type { ReactNode } from 'react';
import { X } from 'lucide-react';

/**
 * 全局统一弹框组件 · iPhone（iOS UIAlertController）风格
 * - IOSAlert：确认类弹框（居中标题/正文 + 44px 分隔线按钮组）
 * - IOSModal：内容类弹窗容器（居中标题栏 + 滚动内容区 + 底部操作栏）
 * - IOSModalButton：内容弹窗底部按钮（44px 热区）
 * 规范详见 DESIGN.md「1.5.9 弹框（iPhone 风格）」
 */

/* ==================== Alert：确认弹框 ==================== */

export interface IOSAlertAction {
  label: string;
  onPress?: () => void;
  /** default=品牌主色 destructive=危险红 cancel=弱化灰 */
  style?: 'default' | 'destructive' | 'cancel';
}

interface IOSAlertProps {
  title: string;
  /** 居中正文，建议一句话说明后果 */
  message?: string;
  /** 1-3 个操作；2 个时左右横排（取消在左），其余上下排列（iOS 规范） */
  actions: IOSAlertAction[];
  /** 覆盖遮罩定位/层级；默认 fixed inset-0 z-[100]，手机壳内嵌套时可传 absolute inset-0 z-[70] */
  overlayClassName?: string;
}

const ALERT_ACTION_COLOR: Record<NonNullable<IOSAlertAction['style']>, string> = {
  default: 'text-indigo-600',
  destructive: 'text-error',
  cancel: 'text-text-secondary',
};

export function IOSAlert({ title, message, actions, overlayClassName = 'fixed inset-0 z-[100]' }: IOSAlertProps) {
  const isRow = actions.length === 2;
  return (
    <div
      className={`${overlayClassName} bg-black/40 flex items-center justify-center p-6 animate-fade-in`}
      role="alertdialog"
      aria-modal="true"
      aria-label={title}
    >
      <div className="w-[270px] bg-white rounded-2xl shadow-2xl overflow-hidden text-center animate-ios-alert-in">
        <div className="px-4 pt-4 pb-3 space-y-1">
          <h3 className="text-lg font-semibold text-text-primary leading-snug">{title}</h3>
          {message && <p className="text-sm text-text-secondary leading-normal">{message}</p>}
        </div>
        <div className={`border-t border-slate-200 ${isRow ? 'flex' : 'flex flex-col'}`}>
          {actions.map((action, index) => (
            <button
              key={action.label}
              type="button"
              onClick={action.onPress}
              className={`h-11 text-lg active:bg-slate-100 transition-colors cursor-pointer select-none ${ALERT_ACTION_COLOR[action.style ?? 'default']} ${
                isRow ? 'flex-1' : 'w-full'
              } ${isRow && index === 1 ? 'border-l border-slate-200' : ''} ${!isRow && index > 0 ? 'border-t border-slate-200' : ''}`}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================== Modal：内容弹窗容器 ==================== */

interface IOSModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
  /** 底部操作区，使用 IOSModalButton；不传则不渲染底栏 */
  footer?: ReactNode;
  /** 深色场景（如虚拟法庭内）使用 iOS 深色模式弹窗 */
  tone?: 'light' | 'dark';
  /** 覆盖遮罩定位/层级；默认 fixed inset-0 z-[100]，手机壳内嵌套时可传 absolute inset-0 z-[70] */
  overlayClassName?: string;
}

export function IOSModal({ title, onClose, children, footer, tone = 'light', overlayClassName = 'fixed inset-0 z-[100]' }: IOSModalProps) {
  const dark = tone === 'dark';
  return (
    <div
      className={`${overlayClassName} bg-black/40 flex items-center justify-center p-4 animate-fade-in`}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className={`w-[320px] max-w-full max-h-[70vh] flex flex-col rounded-2xl overflow-hidden shadow-2xl animate-ios-alert-in ${
          dark ? 'bg-slate-800' : 'bg-white'
        }`}
      >
        {/* 顶部标题栏：iOS 居中标题 + 右侧关闭（44px 热区） */}
        <div className={`relative h-14 flex items-center justify-center flex-shrink-0 border-b ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
          <h3 className={`text-lg font-semibold ${dark ? 'text-slate-100' : 'text-text-primary'}`}>{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="关闭弹窗"
            className={`absolute right-1 w-11 h-11 flex items-center justify-center rounded-full cursor-pointer transition-colors active:scale-95 ${
              dark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-text-muted hover:text-text-primary hover:bg-slate-100'
            }`}
          >
            <X size={18} />
          </button>
        </div>

        {/* 内容区 */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5">{children}</div>

        {/* 底部操作栏 */}
        {footer && (
          <div className={`h-14 px-4 flex items-center justify-end gap-2 flex-shrink-0 border-t ${dark ? 'border-slate-700' : 'border-slate-100'}`}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

/* ==================== Modal 底部按钮 ==================== */

interface IOSModalButtonProps {
  children: ReactNode;
  onClick?: () => void;
  /** primary=品牌填充 plain=品牌文字 default=中性填充 */
  variant?: 'primary' | 'plain' | 'default';
}

export function IOSModalButton({ children, onClick, variant = 'primary' }: IOSModalButtonProps) {
  const VARIANT_CLASS: Record<NonNullable<IOSModalButtonProps['variant']>, string> = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:opacity-80',
    plain: 'text-indigo-600 hover:bg-indigo-50 active:opacity-80',
    default: 'bg-slate-100 text-text-primary hover:bg-slate-200 active:opacity-80',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-11 px-5 rounded-lg text-base font-medium transition-all cursor-pointer select-none ${VARIANT_CLASS[variant]}`}
    >
      {children}
    </button>
  );
}
