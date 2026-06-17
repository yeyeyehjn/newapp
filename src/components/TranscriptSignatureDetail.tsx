import React, { useState, useRef, useEffect } from 'react';
import { TranscriptSignature } from '../types';

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
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [hasSignature, setHasSignature] = useState<boolean>(false);
  const [showPreviewModal, setShowPreviewModal] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Set drawing style
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  // Clear canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
  };

  // Get coordinates from event
  const getCoordinates = (e: React.MouseEvent | React.TouchEvent): { x: number; y: number } | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      const touch = e.touches[0];
      return {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  // Start drawing
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const coords = getCoordinates(e);
    if (coords) {
      lastPointRef.current = coords;
    }
  };

  // Draw
  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    e.preventDefault();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCoordinates(e);
    if (!coords || !lastPointRef.current) return;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
    setHasSignature(true);
  };

  // Stop drawing
  const stopDrawing = () => {
    setIsDrawing(false);
    lastPointRef.current = null;
  };

  // Submit signature
  const handleSubmit = () => {
    if (!hasSignature) {
      alert('请先完成签名');
      return;
    }
    onSubmitSignature(transcript.id);
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
          笔录签名详情
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        {/* Case Info Card */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800">{transcript.caseNo}</span>
            <span
              className={`px-2 py-1 rounded-lg text-xs font-medium ${
                transcript.status === 'pending'
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {transcript.status === 'pending' ? '待签名' : '已签名'}
            </span>
          </div>

          <div className="space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16 shrink-0">申请人：</span>
              <span className="truncate">{transcript.claimant}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16 shrink-0">被申请人：</span>
              <span className="truncate">{transcript.respondent}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16 shrink-0">办案秘书：</span>
              <span className="truncate">{transcript.secretary}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400 w-16 shrink-0">开庭时间：</span>
              <span className="truncate">{transcript.hearingTime}</span>
            </div>
          </div>
        </div>

        {/* Signature Panel */}
        <div className="bg-white rounded-xl border border-slate-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-800">手写签名</span>
            <button
              onClick={clearCanvas}
              className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
            >
              <i className="fa-solid fa-eraser"></i>
              <span>清除</span>
            </button>
          </div>

          {/* Canvas */}
          <div className="border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 relative">
            <canvas
              ref={canvasRef}
              className="w-full h-32 touch-none cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
            />
            {!hasSignature && (
              <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm pointer-events-none">
                请在此处签名
              </div>
            )}
          </div>

          {/* Signature Tips */}
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
            <i className="fa-solid fa-info-circle"></i>
            <span>请在上方区域手写签名，签名将用于笔录确认</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {/* Preview Button */}
          <button
            onClick={() => setShowPreviewModal(true)}
            className="flex-1 bg-white border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
          >
            <i className="fa-solid fa-file-pdf"></i>
            <span>预览文件</span>
          </button>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={transcript.status === 'signed' || !hasSignature}
            className={`flex-1 rounded-xl py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
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

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col overflow-hidden shadow-2xl">
            {/* Modal Header */}
            <div className="bg-[#ddecff] px-4 py-3 flex items-center justify-between border-b border-slate-100">
              <span className="text-sm font-bold text-slate-800">笔录预览</span>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-slate-500 hover:text-slate-700 transition-colors"
              >
                <i className="fa-solid fa-times"></i>
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-4">
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
            </div>

            {/* Modal Footer */}
            <div className="px-4 py-3 border-t border-slate-100">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 rounded-lg py-2.5 text-sm font-medium text-slate-700 transition-colors"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}