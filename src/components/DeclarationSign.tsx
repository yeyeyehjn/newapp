import React, { useState, useRef } from 'react';
import { ArrowLeft, User, Phone, Building2, MapPin, FileText, X, Shield, PenTool, RotateCcw, Check } from 'lucide-react';

interface DeclarationSignProps {
  caseNo: string;
  claimant: string;
  respondent: string;
  secretary: string;
  arbitrator: string;
  status: 'pending' | 'signed';
  signedDate?: string;
  onBack: () => void;
}

export default function DeclarationSign({
  caseNo,
  claimant,
  respondent,
  secretary,
  arbitrator,
  status,
  signedDate,
  onBack
}: DeclarationSignProps) {
  const [mainDeclaration, setMainDeclaration] = useState<string>('');
  const [subDeclaration, setSubDeclaration] = useState<string>('');
  const [recusalNumber, setRecusalNumber] = useState<string>('');
  const [customReason, setCustomReason] = useState<string>('');
  const [disclosureContent, setDisclosureContent] = useState<string>('');
  const [showRecusalModal, setShowRecusalModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSigned, setIsSigned] = useState<boolean>(status === 'signed');

  // 手写签名相关状态
  const canvasRef = useRef<HTMLCanvasElement>(null);      // 内联预览
  const fullCanvasRef = useRef<HTMLCanvasElement>(null);   // 全屏签名画布
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [signatureError, setSignatureError] = useState('');
  const [showSignModal, setShowSignModal] = useState(false);

  const handleMainDeclarationChange = (value: string) => {
    setMainDeclaration(value);
    if (value !== '3') {
      setSubDeclaration('');
    }
  };

  const handleSubDeclarationChange = (value: string) => {
    setSubDeclaration(value);
    setMainDeclaration('3');
  };

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

  const validateSignature = (): boolean => hasSignature;
  // ========== 手写签名逻辑结束 ==========

  const handleSubmit = () => {
    if (!mainDeclaration) {
      alert('请选择声明选项');
      return;
    }
    if (mainDeclaration === '3' && !subDeclaration) {
      alert('请选择3.1或3.2');
      return;
    }
    if (!validateSignature()) {
      setSignatureError('请先完成手写签名后再提交');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSigned(true);
      alert('签署成功！');
    }, 1500);
  };

  return (
    <div className="absolute inset-0 bg-slate-50 z-50 flex flex-col animate-slide-in text-left">
      {/* Header - 微信小程序子页面返回样式 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button 
          onClick={onBack} 
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap truncate max-w-[60%]">{caseNo}</div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-md mx-auto w-full">
        
        {/* Arbitrator Info */}
        <section className="bg-white p-4 rounded-lg  space-y-3">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <User size={14} className="text-indigo-500" />
            <span>仲裁员信息</span>
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1">仲裁员姓名</label>
              <div className="text-base font-medium text-slate-900">{arbitrator.split('（')[0]}</div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1">仲裁员手机号码</label>
              <div className="text-base font-medium text-slate-900 flex items-center gap-2">
                138 0000 0000
                <a href="tel:13800000000" className="text-indigo-500 bg-indigo-50 p-1 rounded-full">
                  <Phone size={12} />
                </a>
              </div>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-sm text-slate-400 mb-1">工作单位</label>
            <div className="text-base font-medium text-slate-900">广州市社会科学院政治法律研究所</div>
          </div>
        </section>

        {/* Applicants */}
        <section className="bg-white p-4 rounded-lg  space-y-3">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Building2 size={14} className="text-emerald-500" />
            <span>申请人</span>
          </h2>
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 space-y-2">
            <div>
              <label className="block text-sm text-slate-400">企业名称</label>
              <div className="text-base font-medium text-slate-900 py-1">{claimant}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-slate-400">机构代码</label>
                <div className="text-sm font-medium text-slate-900 py-1">91330100MA2XXXXX</div>
              </div>
              <div>
                <label className="block text-sm text-slate-400">代理人</label>  
                <div className="text-sm font-medium text-slate-900 py-1">李律师</div>
              </div>
            </div>
            <div>
              <label className="block text-base text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> 地址
              </label>
              <div className="text-base font-medium text-slate-900 py-1">广州市天河区珠江新城华夏路30号</div>
            </div>
          </div>
        </section>

        {/* Respondents */}
        <section className="bg-white p-4 rounded-lg  space-y-3">
          <h2 className="text-base font-bold text-slate-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <Building2 size={14} className="text-red-400" />
            <span>被申请人</span>
          </h2>
          <div className="border border-slate-100 rounded-lg p-3 bg-slate-50/50 space-y-2">
            <div>
              <label className="block text-sm text-slate-400">企业名称</label>
              <div className="text-sm font-medium text-slate-900 py-1">{respondent}</div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-sm text-slate-400">机构代码</label>
                <div className="text-base font-medium text-slate-900 py-1">91310000MA1XXXXX</div>
              </div>
              <div>
                <label className="block text-sm text-slate-400">代理人</label>
                <div className="text-base font-medium text-slate-900 py-1">王律师</div>
              </div>
            </div>
            <div>
              <label className="block text-sm text-slate-400 flex items-center gap-1">
                <MapPin size={10} /> 地址
              </label>
              <div className="text-base font-medium text-slate-900 py-1">上海市浦东新区某某路789号</div>
            </div>
          </div>
        </section>

        {/* Arbitrator Declaration */}
        <section className="bg-white p-4 rounded-lg  space-y-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
            <FileText size={14} className="text-indigo-500" />
            <span>仲裁员声明</span>
          </h2>
          
          {isSigned ? (
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 text-center space-y-2">
              <Shield size={32} className="text-emerald-500 mx-auto" />
              <div className="text-sm font-bold text-emerald-600">已完成签署</div>
              <div className="text-sm text-slate-500">签署日期：{signedDate || new Date().toISOString().split('T')[0]}</div>
              <div className="text-sm text-slate-500 bg-slate-100/50 rounded p-2 mt-2">
                声明选项：本人郑重声明不存在回避事由，接受担任本案仲裁员。
              </div>
            </div>
          ) : (
            <>
              <div className="text-sm text-slate-500 mb-2">请仔细阅读并认真填写：</div>

              <div className="space-y-3">
                {/* Option 1 */}
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="radio" 
                    name="declaration" 
                    value="1" 
                    checked={mainDeclaration === '1'}
                    onChange={() => handleMainDeclarationChange('1')}
                    className="mt-1 text-indigo-600"
                  />
                  <span className="text-sm text-slate-800">
                    1. 本人郑重声明不存在《中华人民共和国仲裁法》及本会《仲裁规则》规定需要回避的事由，接受担任本案仲裁员。
                  </span>
                </label>

                {/* Option 2 */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="declaration" 
                      value="2" 
                      checked={mainDeclaration === '2'}
                      onChange={() => handleMainDeclarationChange('2')}
                      className="mt-1 text-indigo-600"
                    />
                    <span className="text-sm text-slate-800 flex-1">
                      2. 本人存在附件第
                      <input 
                        type="text" 
                        value={recusalNumber}
                        onChange={(e) => setRecusalNumber(e.target.value)}
                        onClick={() => handleMainDeclarationChange('2')}
                        className="mx-1 w-12 border-b border-slate-300 focus:border-indigo-500 outline-none text-center inline-block"
                      />
                      项回避事由，不接受担任本案仲裁员。
                      <button 
                        type="button" 
                        onClick={() => setShowRecusalModal(true)} 
                        className="text-indigo-600 underline ml-1 font-medium"
                      >
                        查阅回避事由
                      </button>
                    </span>
                  </label>
                </div>

                {/* Option 3 */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="declaration" 
                      value="3" 
                      checked={mainDeclaration === '3'}
                      onChange={() => handleMainDeclarationChange('3')}
                      className="mt-1 text-indigo-600"
                    />
                    <span className="text-sm text-slate-800">
                      3. 本人认为存在可能引起当事人对本人独立性、公正性产生合理怀疑的情形需要披露：
                    </span>
                  </label>
                  <textarea 
                    value={disclosureContent}
                    onChange={(e) => setDisclosureContent(e.target.value)}
                    onClick={() => handleMainDeclarationChange('3')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none ml-6"
                    style={{ width: 'calc(100% - 1.5rem)' }}
                    rows={2}
                    placeholder="请填写需要披露的情形..."
                  ></textarea>
                  <div className="ml-6 space-y-1">
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="declaration3_sub" 
                        value="3.1" 
                        checked={subDeclaration === '3.1'}
                        onChange={() => handleSubDeclarationChange('3.1')}
                        className="mt-1 text-indigo-600"
                      />
                      <span className="text-sm text-slate-600">3.1 本人认为以上披露情形不影响本案公正裁决，接受担任本案仲裁员。</span>
                    </label>
                    <label className="flex items-start gap-2 cursor-pointer">
                      <input 
                        type="radio" 
                        name="declaration3_sub" 
                        value="3.2" 
                        checked={subDeclaration === '3.2'}
                        onChange={() => handleSubDeclarationChange('3.2')}
                        className="mt-1 text-indigo-600"
                      />
                      <span className="text-sm text-slate-600">3.2 本人认为以上披露情形影响本案公正裁决，不接受担任本案仲裁员。</span>
                    </label>
                  </div>
                </div>

                {/* Option 4 */}
                <div className="space-y-2">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="declaration" 
                      value="4" 
                      checked={mainDeclaration === '4'}
                      onChange={() => handleMainDeclarationChange('4')}
                      className="mt-1 text-indigo-600"
                    />
                    <span className="text-sm text-slate-800">
                      4. 本人存在
                      <input 
                        type="text" 
                        value={customReason}
                        onChange={(e) => setCustomReason(e.target.value)}
                        onClick={() => handleMainDeclarationChange('4')}
                        className="mx-1 w-24 border-b border-slate-300 focus:border-indigo-500 outline-none text-center inline-block"
                      />
                      事由，不接受担任本案仲裁员。
                    </span>
                  </label>
                </div>
              </div>

              {/* Commitments */}
              <div className="text-xs text-slate-500 space-y-2 bg-slate-50 p-3 rounded-lg leading-relaxed">
                <p><span className="font-bold">保密义务：</span>仲裁员应当遵守仲裁不公开原则，严格履行保密义务，不得对外界透露任何有关案件的情况，包括但不限于案情、审理过程、案件涉及的商业秘密、仲裁庭合议意见等内容；不得向当事人透露本人对案件的看法和仲裁庭合议的情况；不得利用履行仲裁职责获取案件保密信息为自己或他人谋取利益。</p>
                <p><span className="font-bold">本人确知：</span>仲裁员无论是由当事人选定或由广州仲裁委员会主任指定而参加案件审理，都应平等对待双方当事人，不代表任何一方当事人的利益，不偏袒任何一方当事人。</p>
                <p><span className="font-bold">本人承诺：</span>遵守本会《仲裁规则》和《仲裁员守则》的规定，保证办案时间，不私下会见当事人、代理人，不接受当事人、代理人的请客送礼，独立、公正、勤勉、高效地为当事人解决争议。如有违反上述规定情形，本人主动辞去仲裁员一职并接受广州仲裁委员会按相关规定处理。</p>
              </div>

              {/* 手写签名模块 */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="flex items-center gap-1.5 text-sm text-slate-500 font-medium">
                    <PenTool size={14} className="text-indigo-500" />
                    手写签名
                  </label>
                  {hasSignature && (
                    <span className="flex items-center gap-1 text-sm text-emerald-600">
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
                  <p className="text-sm text-red-500 mt-1.5 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-red-500" />
                    {signatureError}
                  </p>
                )}
                {hasSignature && (
                  <button
                    onClick={openSignModal}
                    className="mt-2 flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-500 transition-colors"
                  >
                    <RotateCcw size={12} />
                    重新签名
                  </button>
                )}
              </div>


            </>
          )}
        </section>
        
        {/* Submit Button */}
        {!isSigned && (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '签署中...' : '提交确认'}
          </button>
        )}
      </div>

      {/* 全屏手写签名 Modal - absolute 相对于手机框架 */}
      {showSignModal && (
        <div className="absolute inset-0 z-[200] bg-white flex flex-col animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-shrink-0">
            <button
              onClick={() => setShowSignModal(false)}
              className="flex items-center gap-1 text-slate-600 font-medium text-base"
            >
              <i className="fa-solid fa-chevron-left text-sm"></i>
              返回
            </button>
            <span className="text-base font-bold text-slate-800">手写签名</span>
            <button
              onClick={clearSignature}
              className="flex items-center gap-1 text-slate-500 hover:text-red-500 text-base transition-colors"
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
            <div className="absolute left-8 bottom-16 text-sm text-slate-400 pointer-events-none">
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

      {/* Recusal Reasons Modal */}
      {showRecusalModal && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-md max-h-[80vh] flex flex-col shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">附件：回避事由</h3>
              <button 
                onClick={() => setShowRecusalModal(false)} 
                className="p-1 rounded-full hover:bg-slate-100 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto text-sm text-slate-600 space-y-3 leading-relaxed">
              <p className="font-medium text-slate-900">根据《中华人民共和国仲裁法》以及本会仲裁规则，需要回避的事由包括以下情形：</p>
              <p>1. 本人及配偶、直系亲属与本案当事人、法定代表人、负责人、代理人及其配偶既非直系亲属也非三代以内的旁系亲属；</p>
              <p>2. 本人及配偶、直系亲属与本案没有利害关系；</p>
              <p>3. 本人未私自会见过当事人、法定代表人、负责人、代理人，或者接受过当事人、法定代表人、负责人、代理人请客送礼；</p>
              <p>4. 本人与本案当事人、法定代表人、负责人、代理人现在没有在同一单位工作；</p>
              <p>5. 本人对本案所涉争议没有向当事人推荐、介绍过代理人；</p>
              <p>6. 本人对本案所涉争议没有提供过咨询，也没有担任过与本案所涉争议有关案件的证人、鉴定人、勘验人、翻译人员、辩护人、代理人；</p>
              <p>7. 本会正在审理的其他案件中，本人不存在与本案当事人、代理人同为仲裁员的情形；</p>
              <p>8. 本人未与本案当事人、代理人有咨询与被咨询、管理与被管理关系，或者担任本案当事人、代理人的代理人、顾问，但至组庭之日有关关系已经结束超过二年的除外；</p>
              <p>9. 在广州仲裁委员会同时审理的案件或已审结的案件中，本人不存在与本案互为案件的当事人、代理人和仲裁员的情形，但至组庭之日案件已经审结超过二年的除外；</p>
              <p>10. 以上情形外可能影响本人对本案作出公正裁决的情形。</p>
            </div>
            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={() => setShowRecusalModal(false)} 
                className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-black transition-colors text-sm"
              >
                我已阅读
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
