import React, { useState, useEffect } from 'react';
import { Phone, Maximize2, Minimize2, Battery, Wifi, Signal, MoreHorizontal } from 'lucide-react';

interface MiniProgramContainerProps {
  children: React.ReactNode;
}

export default function MiniProgramContainer({ children }: MiniProgramContainerProps) {
  const [isMobileMode, setIsMobileMode] = useState<boolean>(true);
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    // Set simulated current time on mount, update every minute
    const updateSimulatedTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateSimulatedTime();
    const interval = setInterval(updateSimulatedTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-start p-2 sm:p-6 font-sans">
      
      {/* Top Header Controls */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4 px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="h-4 p-1 px-1.5 bg-rose-600 text-white rounded text-xs font-bold tracking-wider leading-none uppercase">
            仲裁员端
          </div>
          <h1 className="text-base sm:text-lg font-semibold tracking-tight text-white flex items-center gap-1.5">
            <span>广州仲裁委智能管理平台</span>
            <span className="text-slate-500 font-normal text-xs">• 微信小程序版模拟</span>
          </h1>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMobileMode(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
              isMobileMode
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Phone size={13} />
            <span>小程序预览 (手机)</span>
          </button>
          <button
            onClick={() => setIsMobileMode(false)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 ${
              !isMobileMode
                ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <Maximize2 size={13} />
            <span>全屏自适应 (宽屏)</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full flex justify-center items-center flex-1" style={{ textAlign: 'center', lineHeight: '24px' }}>
        {isMobileMode ? (
          /* Phone Frame Emulator with beautiful Bento Slate styling */
          <div className="relative mx-auto my-2 w-[400px] h-[840px] bg-slate-950 rounded-[48px] border-[12px] border-slate-900 shadow-2xl flex flex-col overflow-hidden ring-4 ring-slate-900/20">
            {/* Speaker & Notch / Dynamic Island */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center space-x-1">
              <div className="w-12 h-1 bg-slate-800 rounded-full"></div>
              <div className="w-2.5 h-2.5 bg-slate-900 rounded-full border border-slate-800"></div>
            </div>

            {/* Simulated Signal & Time Top Bar - merged with title */}
            <div className="h-9 bg-[#ddecff] text-slate-700 px-6 flex justify-between items-end pb-1.5 text-[11px] font-bold select-none z-40 transition-colors font-mono">
              <span className="text-slate-600 font-sans tracking-tight">{currentTime}</span>
              <div className="flex items-center space-x-1.5 text-slate-600">
                <Signal size={10} className="stroke-[2.5]" />
                <span className="text-[10px] font-bold font-sans">5G</span>
                <Wifi size={10} className="stroke-[2.5]" />
                <Battery size={12} className="stroke-[2.5]" />
              </div>
            </div>

            {/* Inside Scrollable Screen */}
            <div className="flex-1 w-full bg-slate-50 text-slate-900 overflow-hidden relative flex flex-col justify-between">
              {children}
            </div>

            {/* Bottom Virtual Home Indicator bar */}
            <div className="h-4 bg-white flex items-center justify-center select-none pb-1 z-40">
              <div className="w-32 h-1 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        ) : (
          /* Full Screen Container fitting desktop widths but mimicking a mobile app styled nicely */
          <div className="w-full max-w-6xl h-[800px] bg-slate-50 text-slate-900 rounded-2xl border border-slate-200 shadow-xl overflow-hidden flex flex-col">
            
            {/* Unified Web Header Style */}
            <div className="h-14 bg-white border-b border-indigo-50 px-6 flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                  穗
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-800">广州仲裁委员会委案系统</h2>
                  <p className="text-xs text-slate-500">桌面模拟视图 (仲裁独立面板)</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-xs text-slate-500 font-medium">当前登录: 首席仲裁员 张明</div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
              </div>
            </div>

            {/* Main scrollable body */}
            <div className="flex-1 overflow-y-auto bg-slate-100 flex justify-center p-6">
              <div className="w-full max-w-4xl bg-white rounded-xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col h-full">
                <div className="flex-1 overflow-hidden flex flex-col justify-between">
                  {children}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
