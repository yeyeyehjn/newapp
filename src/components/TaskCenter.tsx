import React, { useState, useRef, useEffect } from 'react';
import { PenSquare, Calendar, FileText, CheckCircle2, Lock, ShieldAlert, Check, RefreshCw, Hash, AlertTriangle } from 'lucide-react';
import { Task, Case } from '../types';

interface TaskCenterProps {
  tasks: Task[];
  cases: Case[];
  onCompleteTask: (taskId: string, extraUpdates?: { caseId: string; nextStatus: any }) => void;
  onNavigateToTab: (index: number) => void;
  onSelectCase: (caseItem: Case) => void;
}

export default function TaskCenter({ 
  tasks, 
  cases, 
  onCompleteTask, 
  onNavigateToTab,
  onSelectCase 
}: TaskCenterProps) {
  const [activeSegment, setActiveSegment] = useState<'pending' | 'completed'>('pending');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Sign module states
  const [pinCode, setPinCode] = useState<string>('');
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'auto'>('auto');
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isStampAdded, setIsStampAdded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Hearing Schedule module states
  const [selectedScheduleChoice, setSelectedScheduleChoice] = useState<number | null>(null);

  // Review opinions
  const [reviewDocsRead, setReviewDocsRead] = useState<{ [key: string]: boolean }>({});
  const [arbitratorOpinionText, setArbitratorOpinionText] = useState<string>('');

  // Count summaries
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Trigger PIN verification
  const handleVerifyPIN = () => {
    if (pinCode === '123456') {
      setIsPinVerified(true);
      setPinError('');
    } else {
      setPinError('CA存证交易密码错误！提示：演示默认密码为 123456');
    }
  };

  // Canvas Drawing Handlers
  useEffect(() => {
    if (selectedTask?.type === 'sign' && signatureMode === 'draw' && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [selectedTask, signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get correct coordinates supporting both mouse and touch
    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Prevent default scrolling on touch
    if (e.cancelable) e.preventDefault();

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setIsSigned(true);
  };

  const endDrawing = () => {
    isDrawingRef.current = false;
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    setIsSigned(false);
  };

  // Process and Submit Sign Task
  const handleSubmitSignature = () => {
    if (signatureMode === 'auto') {
      setIsSigned(true);
    }
    setIsStampAdded(true);

    // After animation, trigger parent update
    setTimeout(() => {
      if (selectedTask) {
        onCompleteTask(selectedTask.id, {
          caseId: selectedTask.caseId,
          nextStatus: '已结案' // Signing the draft closes Case 2
        });
        setSelectedTask(null);
        // Clear variables
        setPinCode('');
        setIsPinVerified(false);
        setIsSigned(false);
        setIsStampAdded(false);
      }
    }, 2500);
  };

  // Process and Submit Calendar/Hearing Task
  const handleSubmitSchedule = () => {
    if (selectedScheduleChoice === null) return;
    
    if (selectedTask) {
      onCompleteTask(selectedTask.id, {
        caseId: selectedTask.caseId,
        nextStatus: '审理中' // Transition from Pending Hearing to In Trial
      });
      setSelectedTask(null);
      setSelectedScheduleChoice(null);
    }
  };

  // Document review checks
  const toggleDocRead = (docId: string) => {
    setReviewDocsRead(prev => ({
      ...prev,
      [docId]: !prev[docId]
    }));
  };

  const allReviewDocsRead = selectedTask?.details?.reviewDocs
    ? selectedTask.details.reviewDocs.every(d => reviewDocsRead[d.id])
    : false;

  const handleSubmitReview = () => {
    if (selectedTask) {
      onCompleteTask(selectedTask.id); // Mark Review complete
      setSelectedTask(null);
      setReviewDocsRead({});
      setArbitratorOpinionText('');
    }
  };

  const handleCaseOverviewClick = (caseId: string) => {
    const parentCase = cases.find(c => c.id === caseId);
    if (parentCase) {
      onSelectCase(parentCase);
    }
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col pb-20 overflow-hidden relative">
      
      {/* Top sticky tabs */}
      <div className="bg-white border-b border-indigo-50 flex p-1 flex-shrink-0 shadow-sm text-xs text-slate-500">
        <button
          onClick={() => { setActiveSegment('pending'); setSelectedTask(null); }}
          className={`flex-1 py-2.5 text-center font-bold tracking-wide transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'pending' 
              ? 'text-indigo-600 bg-indigo-50/70' 
              : 'hover:text-slate-800'
          }`}
        >
          <span>待您处理的事项</span>
          <span className={`text-[10px] py-0.5 px-2 rounded-full ${activeSegment === 'pending' ? 'bg-indigo-600 text-white font-extrabold' : 'bg-slate-200 text-slate-500'}`}>
            {pendingTasks.length}
          </span>
        </button>
        <button
          onClick={() => { setActiveSegment('completed'); setSelectedTask(null); }}
          className={`flex-1 py-2.5 text-center font-bold tracking-wide transition-all rounded-lg flex items-center justify-center gap-1.5 cursor-pointer ${
            activeSegment === 'completed' 
              ? 'text-emerald-600 bg-emerald-50/70' 
              : 'hover:text-slate-800'
          }`}
        >
          <span>历史处理记录</span>
          <span className={`text-[10px] py-0.5 px-2 rounded-full ${activeSegment === 'completed' ? 'bg-emerald-600 text-white font-extrabold' : 'bg-slate-200 text-slate-500'}`}>
            {completedTasks.length}
          </span>
        </button>
      </div>

      {/* Primary Scrollable Frame */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3">
        {!selectedTask ? (
          /* List View */
          (activeSegment === 'pending' ? pendingTasks : completedTasks).length > 0 ? (
            (activeSegment === 'pending' ? pendingTasks : completedTasks).map((t) => {
              // Icons matching task type
              const BadgeIcon = t.type === 'sign' ? PenSquare : t.type === 'schedule' ? Calendar : FileText;
              const severityColor = t.severity === 'urgent' ? 'bg-red-50 text-red-600 border-red-100' :
                                    t.severity === 'normal' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                    'bg-slate-50 text-slate-500 border-slate-100';

              return (
                <div
                  key={t.id}
                  onClick={() => setSelectedTask(t)}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:border-slate-200 hover:shadow-md transition-all cursor-pointer flex flex-col space-y-3 group"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${
                        t.type === 'sign' ? 'bg-red-50 text-red-500' :
                        t.type === 'schedule' ? 'bg-amber-50 text-amber-500' :
                        'bg-indigo-50 text-indigo-500'
                      }`}>
                        <BadgeIcon size={16} />
                      </div>
                      <div>
                        <span className="text-[10px] font-mono text-slate-450 font-medium block">{t.caseNo}</span>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                          {t.title}
                        </h4>
                      </div>
                    </div>

                    {activeSegment === 'pending' ? (
                      <span className={`text-[9px] px-2 py-0.5 rounded-lg font-extrabold border ${severityColor}`}>
                        {t.severity === 'urgent' ? '今日紧急' : t.severity === 'normal' ? '次要期限' : '常规阅办'}
                      </span>
                    ) : (
                      <span className="text-[9px] px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg font-bold flex items-center gap-0.5">
                        <Check size={10} />
                        <span>已归档</span>
                      </span>
                    )}
                  </div>

                  <p className="text-[11px] text-slate-450 leading-relaxed pl-1 text-justify">
                    {t.description}
                  </p>

                  <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-dashed border-slate-50">
                    <span onClick={(e) => { e.stopPropagation(); handleCaseOverviewClick(t.caseId); }} className="hover:text-indigo-500 hover:underline font-bold">
                      查看关联案情 ➔
                    </span>
                    <span className="font-mono text-slate-500">截止日期: {t.deadline}</span>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="h-56 flex flex-col items-center justify-center text-center space-y-2.5 p-6 bg-white/40 rounded-2xl border border-dashed border-slate-200">
              <CheckCircle2 size={32} className="text-slate-300" />
              <span className="text-[11px] font-semibold text-slate-400">目前暂无此分类下的委案任务</span>
              <button 
                onClick={() => onNavigateToTab(1)}
                className="px-3.5 py-1.5 bg-indigo-50 text-indigo-600 text-[10px] font-extrabold rounded-xl cursor-pointer hover:bg-indigo-100"
              >
                前往案卷中心阅览详情
              </button>
            </div>
          )
        ) : (
          /* Task Processing Page */
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 space-y-4 animate-fade-in relative overflow-hidden">
            
            {/* Header with Close */}
            <div className="flex justify-between items-center pb-2 border-b border-indigo-50/60">
              <div className="flex items-center space-x-1">
                <span className="p-1 px-1.5 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-extrabold">详情流</span>
                <span className="text-[11px] font-bold text-slate-800">{selectedTask.caseNo}</span>
              </div>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-xs text-indigo-600 hover:text-indigo-800 font-extrabold cursor-pointer"
              >
                返回工作流
              </button>
            </div>

            {/* Warning Stamp if unsigned */}
            {selectedTask.type === 'sign' && !isStampAdded && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2 text-[10px] text-amber-700 leading-relaxed">
                <ShieldAlert size={14} className="flex-shrink-0 text-amber-500 mt-0.5" />
                <span>裁决书签署需要进行安全认证。请输入CA私匙授权（演示可用 123456 可调取专属签章图样）。</span>
              </div>
            )}

            {/* Task Body Routing by type */}

            {/* TYPE A: 1. SIGN DOCUMENT */}
            {selectedTask.type === 'sign' && (
              <div className="space-y-4">
                {/* Scrollable Court Decision File Mock */}
                <div className="border border-slate-200 rounded-lg p-4 bg-slate-50/50 max-h-[280px] overflow-y-auto text-[11px] leading-relaxed relative text-justify pr-2">
                  
                  {isStampAdded && (
                    <div className="absolute right-12 bottom-6 pointer-events-none select-none animate-scale-up z-20">
                      {/* Red concentric notary stamp mock */}
                      <div className="w-24 h-24 rounded-full border-[3px] border-red-600 bg-red-50/10 flex flex-col items-center justify-center text-center relative select-none">
                        <div className="text-[7.5px] text-red-600 font-extrabold tracking-[0.2em] transform -rotate-12 select-none">
                          广州仲裁委员会
                        </div>
                        <div className="text-[11px] text-red-600 font-bold m-0.5">★</div>
                        <div className="text-[10px] text-red-600 font-extrabold tracking-widest select-none">
                          裁决专章
                        </div>
                        {/* Interactive hand signature stamp on bottom */}
                        <div className="absolute inset-0 flex items-center justify-center font-serif text-[28px] font-bold text-red-600/70 select-none transform rotate-12">
                          张明
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-line font-serif pl-1.5">
                    {selectedTask.details?.awardText}
                  </div>
                </div>

                {isStampAdded ? (
                  /* Success Loading state */
                  <div className="pt-2 flex flex-col items-center justify-center space-y-2 text-center animate-fade-in bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <RefreshCw size={24} className="text-emerald-500 animate-spin" />
                    <h5 className="text-[11px] font-bold text-emerald-600">正在生成区块链电子存证戳印...</h5>
                    <div className="space-y-1 font-mono text-[9px] text-slate-400">
                      <p>区块HASH: SHA-56: 0882e3...fbb901</p>
                      <p>同步进度: 广州仲裁司法链、国家司法链三方验证同步中</p>
                    </div>
                  </div>
                ) : (
                  /* Form setup */
                  <div className="space-y-3 pt-1">
                    {!isPinVerified ? (
                      /* Step 1: Verification of Pin code */
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                        <label className="text-[10px] font-bold text-slate-500 block">请输入CA存证交易密码</label>
                        <div className="flex gap-2">
                          <input
                            type="password"
                            value={pinCode}
                            onChange={(e) => setPinCode(e.target.value)}
                            placeholder="请键入交易安全密钥 (演示：123456)"
                            className="flex-1 bg-white text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 font-mono"
                          />
                          <button
                            onClick={handleVerifyPIN}
                            className="bg-indigo-600 text-white font-extrabold p-1 px-4 text-xs rounded-xl hover:bg-indigo-700 cursor-pointer shadow-sm shadow-indigo-600/20"
                          >
                            验证授权
                          </button>
                        </div>
                        {pinError && <p className="text-[10px] text-red-500 font-semibold">{pinError}</p>}
                      </div>
                    ) : (
                      /* Step 2: Signature option drawing or auto template */
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                          <span className="text-[10px] font-extrabold text-slate-600">✓ 已授权：特级仲裁员张明安全印签库</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setSignatureMode('auto')}
                              className={`p-1 px-2.5 text-[10px] font-extrabold rounded-lg ${signatureMode === 'auto' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-500'}`}
                            >
                              系统预存印签
                            </button>
                            <button
                              onClick={() => setSignatureMode('draw')}
                              className={`p-1 px-2.5 text-[10px] font-extrabold rounded-lg ${signatureMode === 'draw' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-500'}`}
                            >
                              手绘签章图样
                            </button>
                          </div>
                        </div>

                        {signatureMode === 'draw' ? (
                          /* Draw Board HTML5 Canvas Signature block */
                          <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
                            <p className="text-[9px] text-slate-400 italic">在下框内长按/手势书写您的中文规范姓名：</p>
                            <canvas
                              ref={canvasRef}
                              width={320}
                              height={110}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={endDrawing}
                              onMouseLeave={endDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={endDrawing}
                              className="bg-white border border-slate-200 rounded w-full h-[110px] cursor-crosshair touch-none"
                            />
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={clearCanvas}
                                className="p-1 px-3 bg-slate-200 text-slate-600 text-[10px] font-bold rounded hover:bg-slate-300 cursor-pointer"
                              >
                                橡皮清屏
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Auto Font Block overlay */
                          <div className="h-20 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-center font-serif text-3xl font-extrabold text-slate-700 tracking-wider">
                            <span>张明</span>
                            <span className="text-[10px] font-sans text-slate-400 ml-4 border p-0.5 px-1.5 rounded bg-white">系统智能存证库盖印格式</span>
                          </div>
                        )}

                        <button
                          onClick={handleSubmitSignature}
                          disabled={signatureMode === 'draw' && !isSigned}
                          className={`w-full text-white font-bold p-3 text-xs rounded-xl shadow-md cursor-pointer transition-colors ${
                            signatureMode === 'draw' && !isSigned
                            ? 'bg-slate-300 pointer-events-none'
                            : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          确认盖印并电子签署裁决书
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TYPE B: 2. SCHEDULE HEARINGS */}
            {selectedTask.type === 'schedule' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  为确保本期纠纷能够妥善结课，请您审慎协调另外两位仲裁合议庭专家（赵专家、王专家）的时间并决定。目前有3个可选项供选择：
                </p>

                <div className="space-y-2.5">
                  {selectedTask.details?.hearingChoices?.map((choice, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedScheduleChoice(idx)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedScheduleChoice === idx
                        ? 'border-indigo-500 bg-indigo-50/55 shadow-sm shadow-indigo-100/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center ${
                          selectedScheduleChoice === idx ? 'border-indigo-600 text-indigo-600' : 'border-slate-300'
                        }`}>
                          {selectedScheduleChoice === idx && <div className="h-2 w-2 bg-indigo-600 rounded-full animate-scale-up"></div>}
                        </div>
                        <span className="font-semibold text-slate-800 leading-tight">{choice}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1 font-sans text-[10px] text-slate-400">
                  <p className="font-semibold text-slate-500">【庭室预约状况与排期建议】</p>
                  <p>• 选项一：自研在线仲裁系统 占用空闲度75%（推荐专家异地签到）</p>
                  <p>• 选项三：广州第一合议庭（线下） 场地无技术集成冲突</p>
                </div>

                <button
                  onClick={handleSubmitSchedule}
                  disabled={selectedScheduleChoice === null}
                  className={`w-full font-bold p-3 text-xs rounded-xl shadow-md cursor-pointer transition-colors ${
                    selectedScheduleChoice === null
                    ? 'bg-slate-200 text-slate-400 pointer-events-none'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  确定选用该排期并呈报书记员
                </button>
              </div>
            )}

            {/* TYPE C: 3. DOCUMENT REVIEW */}
            {selectedTask.type === 'review' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed text-justify">
                  需审阅材料：当事人双方在第二次代理交互意见中提报的多项辅助说明。主审仲裁员需仔细阅毕确认，或在线提署特别建议：
                </p>

                {/* Checklist file review */}
                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 block mb-1.5 uppercase">涉案补充卷宗下载及阅办清单</span>
                  
                  {selectedTask.details?.reviewDocs?.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => toggleDocRead(doc.id)}
                      className={`flex items-center justify-between p-2 rounded-lg bg-white border cursor-pointer transition-all ${
                        reviewDocsRead[doc.id] ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                        <FileText size={12} className={reviewDocsRead[doc.id] ? 'text-emerald-500' : 'text-slate-400'} />
                        <span className={reviewDocsRead[doc.id] ? 'text-emerald-800' : ''}>{doc.name}</span>
                      </span>
                      
                      <div className={`h-4.5 w-4.5 rounded-lg flex items-center justify-center border font-bold text-white transition-all ${
                        reviewDocsRead[doc.id] ? 'bg-emerald-500 border-emerald-500' : 'border-slate-300 bg-white'
                      }`}>
                        {reviewDocsRead[doc.id] && <Check size={10} />}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Textbox Opinions */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-500 block">仲裁实质意见与合议修改备忘（选填）</label>
                  <textarea
                    rows={3}
                    value={arbitratorOpinionText}
                    onChange={(e) => setArbitratorOpinionText(e.target.value)}
                    placeholder="若阅毕发现关键代理意见有存疑事项，可在此写下意见，该备忘在庭审会议中对合议庭内部共享..."
                    className="w-full bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 focus:bg-white transition-all text-slate-800"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={!allReviewDocsRead}
                  className={`w-full font-bold p-3 text-xs rounded-xl shadow-md cursor-pointer transition-colors ${
                    !allReviewDocsRead
                    ? 'bg-slate-200 text-slate-400 pointer-events-none'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {!allReviewDocsRead ? '您仍有部分卷宗未打开勾选阅毕' : '合规质证材料审查完毕（存档并分发意见）'}
                </button>
              </div>
            )}

          </div>
        )}
      </div>

    </div>
  );
}
