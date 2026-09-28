import React from 'react';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  showClose?: boolean;
  /** 按钮区，固定在底部 */
  footer?: React.ReactNode;
  /** 面板最大高度，默认 75vh（超出滚动） */
  maxHeight?: string;
  children?: React.ReactNode;
}

/**
 * 通用底部弹出面板（移动端筛选项标准交互）
 *
 * 使用示例：
 * ```tsx
 * <BottomSheet open={show} onClose={() => setShow(false)} title="综合筛选" footer={...}>
 *   <FilterForm />
 * </BottomSheet>
 * ```
 */
const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  title,
  showClose = true,
  footer,
  maxHeight = '75vh',
  children,
}) => {
  if (!open) return null;

  return (
    <>
      {/* 遮罩 */}
      <div
        className="absolute inset-0 bg-slate-900/30 z-20 animate-fade-in"
        onClick={onClose}
        role="presentation"
      />
      {/* 面板 */}
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl shadow-slate-900/20 z-30 animate-slide-up flex flex-col overflow-hidden"
        style={{ maxHeight }}
      >
        {/* 把手 + 标题 */}
        <div className="flex-shrink-0 px-4 pt-2 pb-2">
          <div className="w-10 h-1 bg-slate-200 rounded-full mx-auto" />
          {title && (
            <div className="relative flex items-center justify-center mt-3 mb-1">
              <span className="text-lg font-bold text-slate-800">{title}</span>
              {showClose && (
                <button
                  onClick={onClose}
                  aria-label="关闭"
                  className="absolute right-0 p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              )}
            </div>
          )}
        </div>

        {/* 内容区（滚动） */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 pb-3">
          {children}
        </div>

        {/* 底部按钮 */}
        {footer && (
          <div className="flex-shrink-0 px-4 pb-5 pt-2 border-t border-slate-50">
            {footer}
          </div>
        )}
      </div>
    </>
  );
};

export default BottomSheet;
