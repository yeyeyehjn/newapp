import React, { useState, useRef, useEffect } from 'react';
import { 
  PenSquare, Calendar, FileText, CheckCircle2, Lock, 
  ShieldAlert, Check, RefreshCw, Hash, AlertTriangle, 
  ChevronRight, Fingerprint, ShieldCheck, Sparkles, X, ChevronLeft
} from 'lucide-react';
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
  // Current active drilldown category
  // null shows the top-level Overview list of stats card (from arbitrator-todo.html)
  // Options: 'hearing' | 'signature' | 'transcript' | 'extension' | 'promise'
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter for detailed items list (all / pending / completed)
  const [detailFilter, setDetailFilter] = useState<'pending' | 'completed'>('pending');

  // Interactive local states for statistics tracking
  const [hearingsStats, setHearingsStats] = useState({
    today: 1,
    near: 1,
    scheduled: 1
  });

  const [signaturesStats, setSignaturesStats] = useState({
    pending: 2,
    signed: 1,
    completedTotal: 100
  });

  // Transcript Signatures List & States
  const [transcripts, setTranscripts] = useState([
    { id: 'tr_1', title: '《(2026)穗仲案字第1024号 华夏科技与蓝海创投一期庭审笔录》', date: '2026-06-11 14:00', signed: false },
    { id: 'tr_2', title: '《(2026)穗仲案字第0308号 众盛信托与乾坤置业庭审笔录》', date: '2026-06-11 10:30', signed: false }
  ]);

  // Extension Approvals List & States
  const [extensions, setExtensions] = useState([
    { 
      id: 'ex_1', 
      caseNo: '(2026)穗仲案字第1024号', 
      title: '关于华夏科技公司与蓝海创投延期扣期申请',
      applicant: '华夏科技股份代理律师', 
      reason: '因境外证人取证及财务司法审计报告出表延滞，特向仲裁庭申请案卷审理周期按合同第十四章抗辩顺延30个服务工作日。', 
      applyDate: '2026-06-10 16:30', 
      status: 'pending' as 'pending' | 'approved' | 'rejected'
    },
    { 
      id: 'ex_2', 
      caseNo: '(2026)穗仲案字第0882号', 
      title: '航运合同当事人答辩延期审批',
      applicant: '金桥钢铁商贸公司代理律师', 
      reason: '我司由于注册主体地迁，正进行主体核实，特向本会申请延迟十日提交最终涉案合同履行事实辩驳书。', 
      applyDate: '2025-11-12', 
      status: 'approved' as 'pending' | 'approved' | 'rejected'
    },
    { 
      id: 'ex_3', 
      caseNo: '(2026)穗仲案字第0308号', 
      title: '信托保证合议庭延期合议申请',
      applicant: '合议庭秘书长', 
      reason: '因独任陪裁案件调解协议仍在反复拟定磋商，为维护双方诉讼合意，申请延期举期开审5天。', 
      applyDate: '2026-05-18', 
      status: 'approved' as 'pending' | 'approved' | 'rejected'
    }
  ]);

  // Promises documents (廉洁/无回避)
  const [promises, setPromises] = useState([
    { id: 'pr_1', name: '《廉洁仲裁承诺书》', desc: '根据广州仲裁委员会仲裁员守则，确认客观中立，严守廉洁，无私利及隐秘勾连。', signed: false, date: '2026-06-11' },
    { id: 'pr_2', name: '《无回避声明书》', desc: '确认与本案申请人华夏科技、被申请人蓝海创投的委托代理人及高级管理人员无亲属、顾问或其他利害关系。', signed: false, date: '2026-06-11' }
  ]);

  // Selected single task from original Task List state (to preserve drilldown action functionality!)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Signature validation/authorizing states
  const [pinCode, setPinCode] = useState<string>('');
  const [isPinVerified, setIsPinVerified] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [signatureMode, setSignatureMode] = useState<'draw' | 'auto'>('auto');
  const [isSigned, setIsSigned] = useState<boolean>(false);
  const [isStampAdded, setIsStampAdded] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawingRef = useRef<boolean>(false);

  // Hearing schedule state
  const [selectedScheduleChoice, setSelectedScheduleChoice] = useState<number | null>(null);

  // Document review states (Original)
  const [reviewDocsRead, setReviewDocsRead] = useState<{ [key: string]: boolean }>({});
  const [arbitratorOpinionText, setArbitratorOpinionText] = useState<string>('');

  // Active transcript ID for signing
  const [signingTranscriptId, setSigningTranscriptId] = useState<string | null>(null);
  const [isTranscriptSignedState, setIsTranscriptSignedState] = useState<boolean>(false);
  const [isTranscriptStampAdded, setIsTranscriptStampAdded] = useState<boolean>(false);

  // Dynamic system formatted date string (2026年6月11日 etc)
  const formatTodayDate = () => {
    return '2026年6月11日';
  };

  // Helper to verify PIN
  const handleVerifyPIN = () => {
    if (pinCode === '123456') {
      setIsPinVerified(true);
      setPinError('');
    } else {
      setPinError('CA存证交易密码错误！提示：演示默认密码为 123456');
    }
  };

  // HTML5 Canvas Drawing for signature pad (used dynamically matching both Award & Transcript drawing)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && signatureMode === 'draw') {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0B0F19';
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
      }
    }
  }, [selectedTask, signingTranscriptId, signatureMode]);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    isDrawingRef.current = true;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

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

  // Submit award/document signature (Original)
  const handleSubmitSignature = () => {
    if (signatureMode === 'auto') {
      setIsSigned(true);
    }
    setIsStampAdded(true);

    setTimeout(() => {
      if (selectedTask) {
        onCompleteTask(selectedTask.id, {
          caseId: selectedTask.caseId,
          nextStatus: '已结案'
        });
        
        // update our stats dynamically!
        setSignaturesStats(prev => ({
          ...prev,
          pending: Math.max(0, prev.pending - 1),
          signed: prev.signed + 1,
          completedTotal: prev.completedTotal + 1
        }));

        setSelectedTask(null);
        setSelectedCategory(null);
        // Clear forms
        setPinCode('');
        setIsPinVerified(false);
        setIsSigned(false);
        setIsStampAdded(false);
      }
    }, 2500);
  };

  // Submit Hearing Scheduled choice (Original)
  const handleSubmitSchedule = () => {
    if (selectedScheduleChoice === null) return;
    
    if (selectedTask) {
      onCompleteTask(selectedTask.id, {
        caseId: selectedTask.caseId,
        nextStatus: '审理中'
      });

      // Update local statistics metric: decrement near increase scheduled
      setHearingsStats(prev => ({
        ...prev,
        near: Math.max(0, prev.near - 1),
        scheduled: prev.scheduled + 1
      }));

      setSelectedTask(null);
      setSelectedCategory(null);
      setSelectedScheduleChoice(null);
    }
  };

  // Document review complete
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
      onCompleteTask(selectedTask.id);
      setSelectedTask(null);
      setSelectedCategory(null);
      setReviewDocsRead({});
      setArbitratorOpinionText('');
    }
  };

  // Click handler for related case overview navigation
  const handleCaseOverviewClick = (caseId: string) => {
    const parentCase = cases.find(c => c.id === caseId);
    if (parentCase) {
      onSelectCase(parentCase);
    }
  };

  // Transcripts Sign Callback
  const handleSignTranscriptSubmit = (id: string) => {
    if (signatureMode === 'auto') {
      setIsSigned(true);
    }
    setIsTranscriptStampAdded(true);

    setTimeout(() => {
      setTranscripts(prev => 
        prev.map(tr => tr.id === id ? { ...tr, signed: true } : tr)
      );

      // Reset
      setSigningTranscriptId(null);
      setIsSigned(false);
      setIsTranscriptStampAdded(false);
      setPinCode('');
      setIsPinVerified(false);
    }, 2000);
  };

  // Extension action Approve/Reject
  const handleExtensionDecision = (id: string, decision: 'approved' | 'rejected') => {
    setExtensions(prev => 
      prev.map(ext => ext.id === id ? { ...ext, status: decision } : ext)
    );
  };

  // Promises interactive signature callback
  const handleSignPromise = (id: string) => {
    setPromises(prev => 
      prev.map(p => p.id === id ? { ...p, signed: true } : p)
    );
  };

  // Dynamic statistics calculations
  const pendingHearingsCount = 3 - (hearingsStats.near === 0 ? 1 : 0);
  const pendingAwardSignaturesCount = signaturesStats.pending;
  const pendingTranscriptsSignaturesCount = transcripts.filter(t => !t.signed).length;
  const pendingExtensionsRequestsCount = extensions.filter(e => e.status === 'pending').length;
  const pendingPromisesSignaturesCount = promises.filter(p => !p.signed).length;

  // Render Category Drilldown Subpages
  const renderDetailSubpage = () => {
    if (!selectedCategory) return null;

    return (
      <div className="flex-1 bg-slate-50 flex flex-col min-h-0 overflow-y-auto w-full text-left">
        
        {/* Navigation Breadcrumb Sub-Header */}
        <div className="bg-white border-b border-slate-100 p-3.5 flex items-center justify-between shadow-xs sticky top-0 z-10">
          <button 
            onClick={() => {
              setSelectedCategory(null);
              setSelectedTask(null);
            }}
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-extrabold text-xs cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
            <span>返回待办大卡</span>
          </button>
          
          <span className="text-sm bg-slate-100 text-slate-700 font-black px-2.5 py-1 rounded-xl font-mono tracking-wider">
            {selectedCategory === 'hearing' && '待开庭审理进程'}
            {selectedCategory === 'signature' && '案卷结案文书签章'}
            {selectedCategory === 'transcript' && '庭审声纹笔录盾签'}
            {selectedCategory === 'extension' && '延期扣期合规审批'}
            {selectedCategory === 'promise' && '仲裁员信用廉洁声明'}
          </span>
        </div>

        <div className="p-4 space-y-4">

          {/* SECTION 1: HEARINGS DETAILS */}
          {selectedCategory === 'hearing' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-red-50/50 border border-red-100 rounded-2xl p-4 text-xs text-red-800 space-y-1.5 shadow-sm">
                <h4 className="font-extrabold flex items-center gap-1 text-red-700">
                  <i className="fas fa-gavel"></i>
                  <span>待开庭重要告知说明</span>
                </h4>
                <p className="leading-relaxed">
                  检测到您今日有 <strong>1场</strong> 直接庭审，临近有 <strong>1场</strong> 待首席仲裁员勾选日程。请根据排定时间提前5分钟载入智云数字法庭，并打开您的CA双因子盾签。
                </p>
              </div>

              {/* Find and render schedule tasks */}
              {tasks.filter(t => t.type === 'schedule' || t.type === 'review').map(task => {
                const isTaskPending = task.status === 'pending';
                return (
                  <div key={task.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 relative overflow-hidden flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono font-bold text-slate-500 block">{task.caseNo}</span>
                        <h4 className="text-xs font-black text-slate-705">{task.title}</h4>
                      </div>
                      <span className={`text-2xs font-black px-2 py-1 rounded-lg border ${
                        isTaskPending ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {isTaskPending ? '待办处理' : '已归档完成'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-455 leading-relaxed">
                      {task.description}
                    </p>

                    {isTaskPending ? (
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setSignatureMode('auto');
                        }}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-heavy text-xs py-2.5 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-calendar-check text-xs"></i>
                        <span>立即进入勾选排期 ➔</span>
                      </button>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-2.5 text-center text-xs text-slate-500 font-bold border border-slate-100 flex items-center justify-center gap-1">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>此排期任务已于刚才递交完成</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium pt-2 border-t border-dashed border-slate-100">
                      <span onClick={() => handleCaseOverviewClick(task.caseId)} className="hover:text-indigo-600 cursor-pointer hover:underline font-bold">
                        🔍 查案卷详情轴
                      </span>
                      <span className="font-mono text-slate-450">限期至: {task.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 2: SIGNATURES DETAILS */}
          {selectedCategory === 'signature' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 text-xs text-blue-800 space-y-1.5 shadow-sm">
                <h4 className="font-extrabold flex items-center gap-1 text-blue-700">
                  <i className="fas fa-file-signature"></i>
                  <span>结案文书签盖制度说明</span>
                </h4>
                <p className="leading-relaxed">
                  结案决定书及裁决正本均需要独任/合议首席仲裁员使用密码与指纹进行双因子盾级签署。一经盖章，签章结果自动联存并由防伪私钥打戳。
                </p>
              </div>

              {/* Renders type === 'sign' tasks */}
              {tasks.filter(t => t.type === 'sign').map(task => {
                const isTaskPending = task.status === 'pending';
                return (
                  <div key={task.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 relative overflow-hidden flex flex-col space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <span className="text-xs font-mono font-bold text-slate-500 block">{task.caseNo}</span>
                        <h4 className="text-xs font-black text-slate-705">{task.title}</h4>
                      </div>
                      <span className={`text-2xs font-black px-2 py-1 rounded-lg border ${
                        isTaskPending ? 'bg-red-50 text-red-500 border-red-100 animate-pulse' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>
                        {isTaskPending ? '亟待签章' : '签盖安全完结'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-455 leading-relaxed text-justify">
                      {task.description}
                    </p>

                    {isTaskPending ? (
                      <button
                        onClick={() => {
                          setSelectedTask(task);
                          setSignatureMode('auto');
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-heavy text-xs py-2.5 rounded-xl transition-all shadow-md shadow-red-500/10 flex items-center justify-center gap-1"
                      >
                        <i className="fa-solid fa-file-signature"></i>
                        <span>载入证书CA一键印发 ➔</span>
                      </button>
                    ) : (
                      <div className="bg-slate-50 rounded-xl p-2.5 text-center text-xs text-slate-500 font-bold border border-slate-100 flex items-center justify-center gap-1">
                        <i className="fa-solid fa-circle-check text-emerald-500"></i>
                        <span>裁决文书CA证书已正式印签发布</span>
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-slate-500 font-medium pt-2 border-t border-dashed border-slate-100">
                      <span onClick={() => handleCaseOverviewClick(task.caseId)} className="hover:text-indigo-600 cursor-pointer hover:underline font-bold">
                        🔍 查案卷详情轴
                      </span>
                      <span className="font-mono text-slate-455 text-red-500">限期签署至: {task.deadline}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* SECTION 3: TRANSCRIPTS SIGNING */}
          {selectedCategory === 'transcript' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-4 text-xs text-purple-850 space-y-1 shadow-sm">
                <h4 className="font-extrabold flex items-center gap-1 text-purple-700">
                  <i className="fas fa-pen-nib"></i>
                  <span>笔录云签字授权服务</span>
                </h4>
                <p className="leading-relaxed">
                  此区域承载刚才已经休庭的庭审录音自动转写笔录，仲裁员需阅过无异议后，进行一键防伪签署。
                </p>
              </div>

              {transcripts.map(tr => (
                <div key={tr.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-3.5 relative overflow-hidden text-left shadow-inner">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5 max-w-[80%]">
                      <span className="text-2xs text-slate-450 block font-mono">创建时间: {tr.date}</span>
                      <h4 className="text-sm font-black text-slate-800 leading-snug">{tr.title}</h4>
                    </div>
                    <span className={`text-2xs px-1.5 py-1 rounded font-black border ${
                      tr.signed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {tr.signed ? '已锁盾签署' : '待核签'}
                    </span>
                  </div>

                  {!tr.signed ? (
                    <button
                      onClick={() => {
                        setSigningTranscriptId(tr.id);
                        setIsPinVerified(false);
                        setPinCode('');
                        setIsSigned(false);
                      }}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white font-heavy text-xs py-2 rounded-xl transition-all font-sans flex items-center justify-center gap-1 shadow-sm"
                    >
                      <i className="fa-solid fa-signature"></i>
                      <span>线上查看并防伪锁签 ➔</span>
                    </button>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-300/30 rounded-xl p-2.5 flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-slate-900 flex items-center justify-center text-xs font-black">
                        ✓
                      </div>
                      <div className="text-xs text-emerald-800">
                        <strong>已于系统通过! </strong> 
                        防伪核注哈希：<span className="font-mono text-2xs bg-white border px-1">0xBF0812_{tr.id}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SECTION 4: EXTENSIONS AUDITS */}
          {selectedCategory === 'extension' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4 text-xs text-amber-800 space-y-1 shadow-sm">
                <h4 className="font-extrabold flex items-center gap-1 text-amber-700">
                  <i className="fas fa-clock"></i>
                  <span>延期极速绿色审批通道</span>
                </h4>
                <p className="leading-relaxed">
                  仲裁庭应当保持审判效率。点击下方卡片对当事人及代理人提交的合理延期延宕申请进行准许或不予支持审批。
                </p>
              </div>

              {extensions.map(ext => (
                <div key={ext.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <span className="text-2xs font-mono text-amber-700 font-bold bg-amber-50 px-1 py-0.2 rounded border border-amber-100">{ext.caseNo}</span>
                      <h4 className="text-xs font-black text-slate-800 pt-0.5">{ext.title}</h4>
                    </div>
                    <span className={`text-2xs px-1.5 py-1 rounded font-black border ${
                      ext.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                      ext.status === 'rejected' ? 'bg-red-50 text-red-500 border-red-100' :
                      'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {ext.status === 'approved' ? '同意延期' :
                       ext.status === 'rejected' ? '驳回申请' :
                       '待审批'}
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500 leading-normal space-y-1.5 border border-slate-100">
                    <p><strong>申请代理人:</strong> <span className="text-slate-700 font-bold">{ext.applicant}</span></p>
                    <p className="text-justify text-xs"><strong>延期原因:</strong> {ext.reason}</p>
                    <p className="text-2xs font-mono text-slate-500">递送时间: {ext.applyDate}</p>
                  </div>

                  {ext.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleExtensionDecision(ext.id, 'rejected')}
                        className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-500 font-bold py-2 text-xs rounded-xl transition-colors cursor-pointer text-center"
                      >
                        驳回申请
                      </button>
                      <button
                        onClick={() => handleExtensionDecision(ext.id, 'approved')}
                        className="flex-1 bg-[#1E40AF] hover:bg-[#1E40AF]/95 text-white font-heavy py-2 text-xs rounded-xl transition-colors cursor-pointer text-center shadow-sm"
                      >
                        审批通过并按期扣除
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* SECTION 5: PROMISES / SIGNING DOCUMENTS */}
          {selectedCategory === 'promise' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4 text-xs text-emerald-800 space-y-1 shadow-sm">
                <h4 className="font-extrabold flex items-center gap-1 text-emerald-700">
                  <i className="fas fa-handshake"></i>
                  <span>年度合规核签说明</span>
                </h4>
                <p className="leading-relaxed">
                  新一届任期启动时，仲裁员需签署《廉洁声明》等多份信托信用要件。支持CA电子指纹秒签。
                </p>
              </div>

              {promises.map(p => (
                <div key={p.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 space-y-3 relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-1">
                      <i className="fa-solid fa-scroll text-emerald-600"></i>
                      <span>{p.name}</span>
                    </h4>
                    <span className={`text-2xs px-1.5 py-1 rounded font-black border ${
                      p.signed ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {p.signed ? '已核签生效' : '待签名'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-normal text-justify bg-slate-50/60 p-2.5 rounded-xl border border-slate-100">
                    {p.desc}
                  </p>

                  {!p.signed ? (
                    <button
                      onClick={() => handleSignPromise(p.id)}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-heavy text-xs py-1.8 py-2 rounded-xl transition-all flex items-center justify-center gap-1 shadow-sm"
                    >
                      <i className="fa-solid fa-fingerprint text-sm"></i>
                      <span>CA授权一键核章 ➔</span>
                    </button>
                  ) : (
                    <div className="bg-emerald-500/10 border border-emerald-400/20 rounded-xl p-2.5 flex items-center gap-1.5 text-xs text-emerald-800 font-bold">
                      <i className="fa-solid fa-shield-halved text-emerald-500"></i>
                      <span>已由张明专属数字盾于 2026-06-11 签注背书</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>

        {/* TRANSCRIPT SIGNING FLOATING OVERLAY MODAL */}
        {signingTranscriptId && (
          <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
            <div className="bg-white border rounded-3xl max-w-sm w-full p-5 shadow-2xl relative space-y-4 animate-scale-up text-slate-800 text-left">
              
              <div className="space-y-0.5">
                <span className="text-2xs bg-[#1E40AF]/10 text-[#1E40AF] border border-[#1E40AF]/30 px-2 py-1 rounded font-black font-mono">
                  CA TRANSCRIPT SIGN SHIELD
                </span>
                <h3 className="text-sm font-black text-slate-900 pt-1">庭审数字笔录一键印章</h3>
                <p className="text-xs text-slate-500 leading-normal">
                  您正在对刚才结束庭审笔录（加密多端CA存证）进行最终签章确认：
                </p>
                <div className="bg-slate-50 border p-2 rounded-lg text-xs font-mono text-slate-600 truncate mt-1">
                  {transcripts.find(t => t.id === signingTranscriptId)?.title}
                </div>
              </div>

              {isTranscriptStampAdded ? (
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-3 animate-scale-up text-emerald-800">
                  <div className="w-10 h-10 bg-emerald-500 text-slate-900 rounded-full mx-auto flex items-center justify-center font-black">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <strong className="text-xs font-black block">CA签名与时间戳戳印成功！</strong>
                    <p className="text-xs text-slate-550 leading-normal">
                      笔录已安全归档回广州仲裁委核心链网络，签注防伪标识：<strong className="font-mono text-indigo-700 block">SHA256: 0x9B113B9F</strong>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {!isPinVerified ? (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 block">请输入CA盾保护交易Key</label>
                      <div className="flex gap-2">
                        <input
                          type="password"
                          value={pinCode}
                          onChange={(e) => setPinCode(e.target.value)}
                          placeholder="请输入交易密码 (演示：123456)"
                          className="flex-1 bg-slate-50 text-xs p-2.5 rounded-xl border border-slate-200 outline-none focus:border-indigo-500 font-mono"
                        />
                        <button
                          onClick={handleVerifyPIN}
                          className="bg-[#1E40AF] hover:bg-[#1E40AF]/90 text-white font-heavy p-1 px-4 text-xs rounded-xl cursor-pointer"
                        >
                          验证
                        </button>
                      </div>
                      {pinError && <p className="text-xs text-red-500 font-bold">{pinError}</p>}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">双因子印签：张明</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => setSignatureMode('auto')}
                            className={`p-1 px-2 text-xs font-extrabold rounded ${signatureMode === 'auto' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-500'}`}
                          >
                            系统预存
                          </button>
                          <button
                            onClick={() => setSignatureMode('draw')}
                            className={`p-1 px-2 text-xs font-extrabold rounded ${signatureMode === 'draw' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-500'}`}
                          >
                            手绘签字
                          </button>
                        </div>
                      </div>

                      {signatureMode === 'draw' ? (
                        <div className="space-y-2 bg-slate-50 border rounded-lg p-2">
                          <canvas
                            ref={canvasRef}
                            width={300}
                            height={90}
                            onMouseDown={startDrawing}
                            onMouseMove={draw}
                            onMouseUp={endDrawing}
                            onMouseLeave={endDrawing}
                            onTouchStart={startDrawing}
                            onTouchMove={draw}
                            onTouchEnd={endDrawing}
                            className="bg-white border rounded w-full h-[90px] cursor-crosshair touch-none"
                          />
                          <button onClick={clearCanvas} className="text-2xs text-slate-500 underline block text-right">清空手写</button>
                        </div>
                      ) : (
                        <div className="h-16 bg-slate-50 border rounded-lg flex items-center justify-center font-serif text-2xl font-black text-slate-700">
                          张明
                        </div>
                      )}

                      <button
                        onClick={() => handleSignTranscriptSubmit(signingTranscriptId)}
                        disabled={signatureMode === 'draw' && !isSigned}
                        className={`w-full text-white font-heavy p-2.5 text-xs rounded-xl ${
                          signatureMode === 'draw' && !isSigned ? 'bg-slate-300' : 'bg-purple-600 hover:bg-purple-700 shadow-md'
                        }`}
                      >
                        确认此裁决笔录盖印归档
                      </button>
                    </div>
                  )}

                  <button 
                    onClick={() => setSigningTranscriptId(null)}
                    className="w-full text-center text-xs text-slate-500 py-1"
                  >
                    取消并返回
                  </button>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    );
  };

  // Render original task item full process page (like Award signing or schedule picking!)
  if (selectedTask) {
    return (
      <div className="flex-1 bg-slate-50 flex flex-col min-h-0 overflow-y-auto w-full text-slate-800 text-left">
        
        {/* Navigation Breadcrumb Sub-Header */}
        <div className="bg-white border-b border-slate-100 p-3.5 flex items-center justify-between shadow-xs sticky top-0 z-10">
          <button 
            onClick={() => {
              setSelectedTask(null);
            }}
            className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-extrabold text-xs cursor-pointer transition-colors"
          >
            <ChevronLeft size={16} />
            <span>返回列表</span>
          </button>
          
          <span className="text-sm bg-red-100 text-red-800 font-black px-2.5 py-1 rounded-xl font-mono tracking-wider">
            正在阅办：{selectedTask.caseNo}
          </span>
        </div>

        <div className="p-4 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-5 space-y-4 relative overflow-hidden">
            
            {/* Header info */}
            <div className="space-y-0.5">
              <span className="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100/60 px-1 py-0.2 rounded font-black font-mono">
                TASK WORKFLOW STAGE
              </span>
              <h3 className="text-sm font-black pt-1">{selectedTask.title}</h3>
              <p className="text-xs text-slate-500 leading-normal">
                {selectedTask.description}
              </p>
            </div>

            {selectedTask.type === 'sign' && !isStampAdded && (
              <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 flex items-start gap-2 text-xs text-amber-700 leading-relaxed">
                <ShieldAlert size={14} className="flex-shrink-0 text-amber-500 mt-0.5" />
                <span>裁决书签署需要进行身份数字背书安全认证。输入CA私账交易密码授权（默认可用：<strong>123456</strong> 可自动载入数字人智能印签规范格式）。</span>
              </div>
            )}

            {/* AWARD SIGN SUBSTAGE */}
            {selectedTask.type === 'sign' && (
              <div className="space-y-4">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 max-h-[240px] overflow-y-auto text-xs pr-2 text-justify relative line-clamp-10 leading-relaxed">
                  {isStampAdded && (
                    <div className="absolute right-6 bottom-4 pointer-events-none select-none animate-scale-up z-20">
                      <div className="w-20 h-20 rounded-full border-[3px] border-red-600 bg-red-50/10 flex flex-col items-center justify-center text-center relative select-none">
                        <div className="text-2xs text-red-600 font-extrabold tracking-[0.2em] transform -rotate-12 select-none">
                          广州仲裁委员会
                        </div>
                        <div className="text-xs text-red-600 font-bold m-0.5">★</div>
                        <div className="text-2xs text-red-600 font-extrabold tracking-widest select-none">
                          裁决专章
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center font-serif text-2xl font-bold text-red-600/70 select-none transform rotate-12">
                          张明
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-line font-serif pl-1.5 text-xs">
                    {selectedTask.details?.awardText}
                  </div>
                </div>

                {isStampAdded ? (
                  <div className="pt-2 flex flex-col items-center justify-center space-y-2 text-center animate-fade-in bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <RefreshCw size={24} className="text-emerald-500 animate-spin" />
                    <h5 className="text-sm font-bold text-emerald-600">正在生成司法区块链电子存证及签名戳记...</h5>
                    <div className="space-y-1 font-mono text-2xs text-slate-500">
                      <p>同步区快编号: ARB-CHAIN-GZ-2026-0882</p>
                      <p>同步进度: 正在同步中国司法存证枢纽与最高密局网存</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 pt-1">
                    {!isPinVerified ? (
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-2">
                        <label className="text-xs font-bold text-slate-500 block">请输入证书CA盾授权保护密码</label>
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
                            className="bg-[#1E40AF] text-white font-extrabold p-1 px-4 text-xs rounded-xl hover:bg-[#1E40AF]/95 cursor-pointer shadow-sm"
                          >
                            验证授权
                          </button>
                        </div>
                        {pinError && <p className="text-xs text-red-500 font-semibold">{pinError}</p>}
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-1.5">
                          <span className="text-xs font-extrabold text-slate-600">✓ 已授权：首席特聘仲裁员张明盾签库</span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setSignatureMode('auto')}
                              className={`p-1 px-2 text-xs font-extrabold rounded ${signatureMode === 'auto' ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-slate-100 text-slate-500'}`}
                            >
                              系统预存印章
                            </button>
                            <button
                              onClick={() => setSignatureMode('draw')}
                              className={`p-1 px-2 text-xs font-extrabold rounded ${signatureMode === 'draw' ? 'bg-indigo-50 text-indigo-600 border border-[#1E40AF]/20' : 'bg-slate-100 text-slate-500'}`}
                            >
                              手绘盖印格式
                            </button>
                          </div>
                        </div>

                        {signatureMode === 'draw' ? (
                          <div className="space-y-2 bg-slate-50 border rounded-lg p-2">
                            <p className="text-xs text-slate-500 italic">在下框内书写您的中文公章规范姓名：</p>
                            <canvas
                              ref={canvasRef}
                              width={320}
                              height={100}
                              onMouseDown={startDrawing}
                              onMouseMove={draw}
                              onMouseUp={endDrawing}
                              onMouseLeave={endDrawing}
                              onTouchStart={startDrawing}
                              onTouchMove={draw}
                              onTouchEnd={endDrawing}
                              className="bg-white border rounded w-full h-[100px] cursor-crosshair touch-none"
                            />
                            <div className="flex justify-end">
                              <button onClick={clearCanvas} className="text-xs text-slate-500 underline">清空内容</button>
                            </div>
                          </div>
                        ) : (
                          <div className="h-16 bg-slate-50 border rounded-lg flex items-center justify-center text-center font-serif text-2xl font-extrabold text-slate-700 tracking-wider">
                            <span>张明</span>
                          </div>
                        )}

                        <button
                          onClick={handleSubmitSignature}
                          disabled={signatureMode === 'draw' && !isSigned}
                          className={`w-full text-white font-heavy p-3 text-xs rounded-xl shadow-md transition-all cursor-pointer ${
                            signatureMode === 'draw' && !isSigned
                            ? 'bg-slate-300'
                            : 'bg-red-600 hover:bg-red-700'
                          }`}
                        >
                          确认盖印盖章并提交裁决书
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* SCHEDULE HEARINGS SUBSTAGE */}
            {selectedTask.type === 'schedule' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  合议庭成员需要从排庭系统推荐的三个合理会议时段中做决定。请勾选最合适您与王专家、赵专家的开庭日程：
                </p>

                <div className="space-y-2.5">
                  {selectedTask.details?.hearingChoices?.map((choice, idx) => (
                    <div
                      key={idx}
                      onClick={() => setSelectedScheduleChoice(idx)}
                      className={`p-3 rounded-xl border text-xs cursor-pointer transition-all text-left ${
                        selectedScheduleChoice === idx
                        ? 'border-indigo-500 bg-indigo-50/50'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100/55'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                          selectedScheduleChoice === idx ? 'border-[#1E40AF] text-[#1E40AF]' : 'border-slate-300'
                        }`}>
                          {selectedScheduleChoice === idx && <div className="h-2 w-2 bg-[#1E40AF] rounded-full"></div>}
                        </div>
                        <span className="font-semibold text-slate-800 leading-tight">{choice}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border text-xs text-slate-500 font-medium">
                  <p className="font-extrabold text-slate-500 mb-1">【排庭专家意见建议】</p>
                  <p>• 推荐一（2026年7月2日）：广州第三微开庭室（智云加密网络线路空余85%）</p>
                  <p>• 推荐三（2026年7月15日）：线下实体第一合议庭会议大厅</p>
                </div>

                <button
                  onClick={handleSubmitSchedule}
                  disabled={selectedScheduleChoice === null}
                  className={`w-full font-heavy p-3 text-xs rounded-xl transition-all ${
                    selectedScheduleChoice === null
                    ? 'bg-slate-200 text-slate-500'
                    : 'bg-[#1E40AF] text-white hover:bg-[#1E40AF]/95 shadow-md shadow-[#1E40AF]/20'
                  }`}
                >
                  确认选用该时段并呈报书记员
                </button>
              </div>
            )}

            {/* REVIEW STAGE DETAILS */}
            {selectedTask.type === 'review' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500 text-justify">
                  为保障合规与审理精细，请首席仲裁员点击并依次审阅下列各项涉案材料：
                </p>

                <div className="space-y-2 bg-slate-50 p-3 rounded-xl border">
                  {selectedTask.details?.reviewDocs?.map((doc) => (
                    <div 
                      key={doc.id}
                      onClick={() => toggleDocRead(doc.id)}
                      className={`flex items-center justify-between p-2 rounded bg-white border cursor-pointer transition-all ${
                        reviewDocsRead[doc.id] ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-100 hover:border-indigo-300'
                      }`}
                    >
                      <span className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                        <FileText size={12} className={reviewDocsRead[doc.id] ? 'text-emerald-500' : 'text-slate-500'} />
                        <span className={reviewDocsRead[doc.id] ? 'text-emerald-800 font-black' : ''}>{doc.name}</span>
                      </span>
                      
                      <div className={`h-4.5 w-4.5 rounded-lg flex items-center justify-center border transition-all ${
                        reviewDocsRead[doc.id] ? 'bg-emerald-500 border-emerald-500 text-white font-bold text-xs' : 'border-slate-300 bg-white'
                      }`}>
                        {reviewDocsRead[doc.id] && "✓"}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="text-xs font-bold text-slate-500 block">仲裁辅助合议实质意见备忘签注（选填）</label>
                  <textarea
                    rows={3}
                    value={arbitratorOpinionText}
                    onChange={(e) => setArbitratorOpinionText(e.target.value)}
                    placeholder="若阅毕发现证据材料或计算等存疑，请填写您的提点或意见备忘。这些内容将在合议开庭前内部对多合议大员对齐..."
                    className="w-full bg-slate-50 text-xs p-2 rounded-xl border outline-none focus:border-indigo-505"
                  />
                </div>

                <button
                  onClick={handleSubmitReview}
                  disabled={!allReviewDocsRead}
                  className={`w-full font-heavy p-3 text-xs rounded-xl transition-all ${
                    !allReviewDocsRead
                    ? 'bg-slate-200 text-slate-500 pointer-events-none'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
                  }`}
                >
                  {!allReviewDocsRead ? '您仍有一些关键佐证件未打开阅读' : '我已审阅完毕上述材料 (提交并共享合议意见)'}
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    );
  }

  // Primary Overview screen containing the 5 beautiful stats blocks matching arbitrator-todo.html exactly
  return (
    <div className="flex-1 bg-slate-100 flex flex-col overflow-hidden relative">
      
      

      {/* Main List Area scrolling through arbitrator-todo.html stat modules */}
      <div className="flex-1 overflow-y-auto px-4 pt-6  pb-8 space-y-4 no-scrollbar">

        {/* STAT OVERVIEW CARD 1: 待开庭提醒 */}
        <div 
          onClick={() => setSelectedCategory('hearing')}
          className="bg-white rounded-lg p-4  border border-slate-100 transition-all duration-150 active:scale-[0.98] cursor-pointer  hover:border-red-100 group text-left"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-red-50 rounded-lg text-red-600 transition-colors group-hover:bg-red-500 group-hover:text-white flex items-center justify-center" style={{ height: '36px', width: '36px', marginRight: '12px' }}>
                <i className="fas fa-gavel text-base flex items-center justify-center"></i>
              </div>
              <h2 className="font-bold text-slate-800 text-lg">待开庭提醒</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-red-600">{pendingHearingsCount}</div>
              <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-slate-50 mb-3 text-center">
            <div>
              <div className="text-base font-bold text-red-600">{hearingsStats.today}</div>
              <div className="text-sm text-slate-500 tracking-wider">今日</div>
            </div>
            <div className="border-x border-slate-50">
              <div className="text-base font-bold text-amber-500">{hearingsStats.near}</div>
              <div className="text-sm text-slate-500 tracking-wider">临近</div>
            </div>
            <div>
              <div className="text-base font-bold text-green-600">{hearingsStats.scheduled}</div>
              <div className="text-sm text-slate-500 tracking-wider">已排期</div>
            </div>
          </div>

          <div className="space-y-1 text-right">
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-red-500 h-full transition-all duration-500" style={{ width: hearingsStats.near === 0 ? '100%' : '62%' }}></div>
            </div>
            <div className="flex justify-end select-none">
              <span className="text-sm text-slate-500 font-medium">本周开庭完成率 {hearingsStats.near === 0 ? '100%' : '62%'}</span>
            </div>
          </div>
        </div>

        {/* STAT OVERVIEW CARD 2: 结案文书签名 */}
        <div 
          onClick={() => setSelectedCategory('signature')}
          className="bg-white rounded-lg p-4  border border-slate-100 transition-all duration-150 active:scale-[0.98] cursor-pointer  hover:border-blue-100 group text-left"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-50 rounded-lg text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center" style={{ height: '36px', width: '36px', marginRight: '12px' }}>
                <i className="fas fa-file-signature text-base flex items-center justify-center"></i>
              </div>
              <h2 className="font-bold text-slate-800 text-lg">结案文书签名</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-blue-600">{pendingAwardSignaturesCount + 2}</div>
              <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-3 border-t border-b border-slate-50 mb-3 text-center">
            <div className="border-r border-slate-50">
              <div className="text-base font-bold text-blue-600">{signaturesStats.pending}</div>
              <div className="text-sm text-slate-500 tracking-wider">待签</div>
            </div>
            <div>
              <div className="text-base font-bold text-sky-600">{signaturesStats.signed}</div>
              <div className="text-sm text-slate-500 tracking-wider">本月已签</div>
            </div>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-500" style={{ width: signaturesStats.pending === 0 ? '100%' : '62%' }}></div>
            </div>

          <div className="flex justify-between mt-3 text-sm text-slate-500 font-sans tracking-wide">
            <span>本年度应签 6 份，已签 {6 - pendingPromisesSignaturesCount} 份</span>
            <span className="text-sm text-slate-500 font-medium">完成率 {Math.round(((6 - pendingPromisesSignaturesCount) / 6) * 100)}%</span>
          </div>
        </div>

        {/* STAT OVERVIEW CARD 3: 笔录签名 */}
        <div 
          onClick={() => setSelectedCategory('transcript')}
          className="bg-white rounded-lg p-4  border border-slate-100 transition-all duration-150 active:scale-[0.98] cursor-pointer  hover:border-purple-100 group text-left"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-50 rounded-lg text-purple-600 transition-colors group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center" style={{ height: '36px', width: '36px', marginRight: '12px' }}>
                <i className="fas fa-pen-nib text-base flex items-center justify-center"></i>
              </div>
              <h2 className="font-bold text-slate-800 text-lg">笔录签名</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-purple-600">{pendingTranscriptsSignaturesCount}</div>
              <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-50 mb-1 text-center">
            <div className="border-r border-slate-50">
              <div className="text-base font-bold text-purple-600">{pendingTranscriptsSignaturesCount}</div>
              <div className="text-sm text-slate-500 tracking-wider">待签署</div>
            </div>
            <div>
              <div className="text-base font-bold text-slate-500">{transcripts.filter(t => t.signed).length}</div>
              <div className="text-sm text-slate-500 tracking-wider">已签署</div>
            </div>
          </div>
        </div>

        {/* STAT OVERVIEW CARD 4: 延期办理 */}
        <div 
          onClick={() => setSelectedCategory('extension')}
          className="bg-white rounded-lg p-4  border border-slate-100 transition-all duration-150 active:scale-[0.98] cursor-pointer  hover:border-amber-100 group text-left"
        >
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-3">
              <div className="bg-amber-50 rounded-lg text-amber-600 transition-colors group-hover:bg-amber-600 group-hover:text-white flex items-center justify-center" style={{ height: '36px', width: '36px', marginRight: '12px' }}>
                <i className="fas fa-clock text-base flex items-center justify-center"></i>
              </div>
              <div>
                <h2 className="font-bold text-slate-800 text-lg">延期办理审批</h2>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-amber-600">{pendingExtensionsRequestsCount}</div>
              <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-50 mb-1 text-center font-sans">
            <div>
              <div className="text-base font-bold text-amber-600">{pendingExtensionsRequestsCount}</div>
              <div className="text-sm text-slate-500 tracking-wider">待审批</div>
            </div>
            <div className="border-l border-slate-50">
              <div className="text-base font-bold text-green-600">{extensions.filter(e => e.status !== 'pending').length}</div>
              <div className="text-sm text-slate-500 tracking-wider">已审批</div>
            </div>
          </div>
        </div>

        {/* STAT OVERVIEW CARD 5: 承诺书签署 */}
        <div 
          onClick={() => setSelectedCategory('promise')}
          className="bg-white rounded-lg p-4  border border-slate-100 transition-all duration-150 active:scale-[0.98] cursor-pointer  hover:border-emerald-100 group text-left"   
        >
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-3">
              <div className="bg-emerald-50 rounded-lg text-emerald-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center" style={{ height: '36px', width: '36px', marginRight: '12px' }}>
                <i className="fas fa-handshake text-base flex items-center justify-center"></i>
              </div>
              <h2 className="font-bold text-slate-800 text-lg">承诺书签署</h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-black text-emerald-600">{pendingPromisesSignaturesCount}</div>
              <ChevronRight size={14} className="text-slate-500 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 py-3 border-t border-slate-50 mb-1 text-center font-sans">
            <div>
              <div className="text-base font-bold text-emerald-600">{pendingPromisesSignaturesCount}</div>
              <div className="text-sm text-slate-500 tracking-wider">待签署</div>
            </div>
            <div className="border-l border-slate-50">
              <div className="text-base font-bold text-green-600">{promises.filter(p => p.signed).length}</div>
              <div className="text-sm text-slate-500 tracking-wider">已签署</div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
