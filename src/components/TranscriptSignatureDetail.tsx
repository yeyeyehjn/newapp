import React, { useState, useRef } from 'react';
import { TranscriptSignature } from '../types';
import { PenTool, RotateCcw, Check } from 'lucide-react';
import { IOSModal, IOSModalButton } from './ui/IOSDialog';

interface TranscriptSignatureDetailProps {
  transcript: TranscriptSignature;
  onBack: () => void;
  onSubmitSignature: (transcriptId: string) => void;
}

export default function TranscriptSignatureDetail({
  transcript,
  onBack,
  onSubmitSignature
}: TranscriptSignatureDetailProps) {
  // 手写签名相关状态
  const canvasRef = useRef<HTMLCanvasElement>(null);       // 内联预览
  const fullCanvasRef = useRef<HTMLCanvasElement>(null);   // 全屏签名画布
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSignModal, setShowSignModal] = useState(false);
  const [signatureError, setSignatureError] = useState('');

  // ========== 手写签名逻辑（全屏模式） ==========
  const initCanvas = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  };

  const openSignModal = () => {
    setShowSignModal(true);
    setSignatureError('');
    setTimeout(() => {
      if (fullCanvasRef.current) {
        if (hasSignature && canvasRef.current) {
          const fctx = fullCanvasRef.current.getContext('2d');
          if (fctx) fctx.drawImage(canvasRef.current, 0, 0, fullCanvasRef.current.width, fullCanvasRef.current.height);
        }
        initCanvas(fullCanvasRef.current);
      }
    }, 50);
  };

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = fullCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const startDraw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const ctx = fullCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    e.preventDefault();
    const ctx = fullCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getPos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = fullCanvasRef.current;
    if (!canvas) return;
    canvas.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height);
  };

  const confirmSignature = () => {
    const full = fullCanvasRef.current;
    const preview = canvasRef.current;
    if (!full || !preview) return;
    const fctx = full.getContext('2d');
    if (!fctx) return;
    const data = fctx.getImageData(0, 0, full.width, full.height).data;
    const isEmpty = !data.some((_, i) => i % 4 === 3 && data[i] > 0);
    if (isEmpty) {
      setSignatureError('请先完成手写签名后再确认');
      return;
    }
    const pctx = preview.getContext('2d');
    if (pctx) {
      pctx.clearRect(0, 0, preview.width, preview.height);
      pctx.drawImage(full, 0, 0, preview.width, preview.height);
    }
    setHasSignature(true);
    setSignatureError('');
    setShowSignModal(false);
  };

  const handleSubmit = () => {
    if (!hasSignature) {
      setSignatureError('请先完成手写签名后再提交');
      return;
    }
    onSubmitSignature(transcript.id);
  };
  // ========== 手写签名逻辑结束 ==========

  return (
    <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col overflow-hidden animate-slide-in">
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
          笔录签名详情
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Case Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-base font-bold text-slate-800">{transcript.caseNo}</span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                transcript.status === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {transcript.status === 'pending' ? '待签名' : '已签名'}
            </span>
          </div>

          <div className="space-y-2 text-base text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">申请人：</span>
              <span className="truncate">{transcript.claimant}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">被申请人：</span>
              <span className="truncate">{transcript.respondent}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">办案秘书：</span>
              <span className="truncate">{transcript.secretary}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-18 shrink-0 text-left">开庭时间：</span>
              <span className="truncate">{transcript.hearingTime}</span>
            </div>
          </div>
        </div>

        {/* Signature Panel */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-base font-bold text-slate-800">
              <PenTool size={14} className="text-indigo-500" />
              手写签名
            </span>
            {hasSignature && (
              <span className="flex items-center gap-1 text-xs text-emerald-600">
                <Check size={12} />
                已签名
              </span>
            )}
          </div>

          {/* 点击打开全屏签名 */}
          <div
            onClick={openSignModal}
            className={`relative bg-slate-50 border rounded-lg overflow-hidden cursor-pointer hover:border-indigo-300 transition-colors ${signatureError ? 'border-red-400' : 'border-slate-200'}`}
            style={{ aspectRatio: '320/140' }}
          >
            <canvas ref={canvasRef} width={320} height={140} className="w-full h-full touch-none pointer-events-none" />
            {!hasSignature && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none gap-1">
                <PenTool size={20} className="text-slate-300" />
                <span className="text-sm text-slate-400">点击此处进行手写签名</span>
              </div>
            )}
          </div>

          {signatureError && (
            <p className="text-xs text-red-500 mt-2 flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-red-500" />
              {signatureError}
            </p>
          )}

          {hasSignature && (
            <button
              onClick={openSignModal}
              className="mt-2 flex items-center gap-1 text-base text-slate-500 hover:text-indigo-500 transition-colors"
            >
              <RotateCcw size={12} />
              重新签名
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Preview Button */}
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex-1 bg-white border border-slate-200 rounded-xl py-3 text-base font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-pdf"></i>
            <span>预览文件</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={transcript.status === 'signed' || !hasSignature}
            className={`flex-1 rounded-xl py-3 text-base font-medium flex items-center justify-center gap-2 transition-colors ${
              transcript.status === 'signed'
                ? 'bg-emerald-100 text-emerald-700 cursor-not-allowed'
                : hasSignature
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
          >
            {transcript.status === 'signed' ? (
              <>
                <i className="fa-solid fa-check-circle"></i>
                <span>已签名</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane"></i>
                <span>提交签名</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 全屏手写签名 Modal - absolute 相对于手机框架 */}
      {showSignModal && (
        <div className="absolute inset-0 z-[200] bg-white flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <button
              onClick={() => setShowSignModal(false)}
              className="flex items-center gap-1 text-slate-600 font-medium text-sm"
            >
              <i className="fa-solid fa-chevron-left text-xs"></i>
              返回
            </button>
            <span className="text-base font-bold text-slate-800">手写签名</span>
            <button
              onClick={clearSignature}
              className="flex items-center gap-1 text-slate-500 hover:text-red-500 text-sm transition-colors"
            >
              <RotateCcw size={14} />
              清除
            </button>
          </div>

          {/* 签名区域 */}
          <div className="flex-1 relative bg-slate-50">
            <canvas
              ref={fullCanvasRef}
              width={400}
              height={600}
              onPointerDown={startDraw}
              onPointerMove={draw}
              onPointerUp={stopDraw}
              onPointerLeave={stopDraw}
              onPointerCancel={stopDraw}
              className="w-full h-full touch-none"
            />
            {/* 引导线 */}
            <div className="absolute left-8 right-8 bottom-24 border-b-2 border-dashed border-slate-300 pointer-events-none" />
            <div className="absolute left-8 bottom-16 text-xs text-slate-400 pointer-events-none">
              请在上方横线处签名
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="flex-shrink-0 p-4 pb-6 border-t border-slate-100 bg-white">
            <button
              onClick={confirmSignature}
              className="w-full py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-all active:scale-95 shadow-lg"
            >
              确认签名
            </button>
          </div>
        </div>
      )}

      {/* Preview Modal · iPhone 风格内容弹窗 - absolute 相对于手机框架 */}
      {showPreviewModal && (
        <IOSModal
          title="笔录预览"
          onClose={() => setShowPreviewModal(false)}
          overlayClassName="absolute inset-0 z-[150]"
          footer={<IOSModalButton variant="default" onClick={() => setShowPreviewModal(false)}>关闭预览</IOSModalButton>}
        >
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
            <div className="text-center text-slate-400 py-12">
              <i className="fa-solid fa-file-lines text-4xl mb-3"></i>
              <p className="text-sm">庭审笔录文件</p>
              <p className="text-xs mt-1">{transcript.caseNo}</p>
            </div>
          </div>

          {/* Mock Document Content */}
          <div className="mt-4 text-sm text-slate-600 leading-relaxed space-y-3">
            <p className="font-bold text-center text-slate-800">广州仲裁委员会庭审笔录</p>
            <p>案号：{transcript.caseNo}</p>
            <p>申请人：{transcript.claimant}</p>
            <p>被申请人：{transcript.respondent}</p>
            <p>开庭时间：{transcript.hearingTime}</p>
            <p>办案秘书：{transcript.secretary}</p>
            <p className="text-xs text-slate-400 mt-4">
              （此为笔录预览，实际内容以正式文件为准）
            </p>
          </div>
        </IOSModal>
      )}
    </div>
  );
}