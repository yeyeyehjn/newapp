import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Case } from '../types';

interface ChatMessage {
  id: string;
  sender: string;
  role: string;
  avatarLetter: string;
  content: string;
  time: string;
  isMe?: boolean;
}

interface CaseDiscussionPageProps {
  cases: Case[];
  userName: string;
  onBack: () => void;
}

export default function CaseDiscussionPage({
  cases,
  userName,
  onBack
}: CaseDiscussionPageProps) {
  const [selectedDiscussionCaseId, setSelectedDiscussionCaseId] = useState<string>('1');
  const [customChatMessage, setCustomChatMessage] = useState<string>('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  const [discussionHistories, setDiscussionHistories] = useState<{ [caseId: string]: ChatMessage[] }>({
    '1': [
      { id: '1_1', sender: '李秘书', role: '办案秘书', avatarLetter: '李', content: '张首席好，赵老师、王老师好：关于华夏科技与蓝海创投股权受让一案，双方第2轮对于质辩补证材料的答复已经审核无误发给双方。', time: '09:42' },
      { id: '1_2', sender: '赵东', role: '合议庭成员', avatarLetter: '赵', content: '收到。被申请人主张大雾延迟导致交易不满足15日时限，但我发现他们转让声明在去年底就发出了。这一事实有关键证据印证。', time: '10:15' },
      { id: '1_3', sender: '王琦', role: '合议庭成员', avatarLetter: '王', content: '赞同赵老师的切入。首席，我建议这周我们对华夏科技解除合同要求是否由于对方迟延给付导致的过错比例进行闭门会议，您怎么看？', time: '11:03' },
    ],
    '3': [
      { id: '3_1', sender: '李秘书', role: '办案秘书', avatarLetter: '李', content: '各位老师，润物高科智能产业园二期建设工程案标的额较大，当事人双方在选择开庭时间上具有极强的摩擦抗辩，目前已提出排除部分开庭时段的诉请。', time: '昨日 15:30' },
      { id: '3_2', sender: '赵东', role: '合议庭成员', avatarLetter: '赵', content: '建设工程纠纷专业鉴定耗时很长，咱们庭期一旦拖延两个月以上，会产生巨额利息累积，因此一定要强硬按排庭规则确认推进开庭时间。', time: '昨日 17:12' },
    ],
    '5': [
      { id: '5_1', sender: '李秘书', role: '办案秘书', avatarLetter: '李', content: '众盛信托与乾坤置业金融借款保全核定已通过。目前法院已查封被申请人名下三块商业用地，资产保护稳固。', time: '前天 11:20' }
    ]
  });

  const handleSendMessage = (textToSend?: string) => {
    const messageContent = textToSend || customChatMessage;
    if (!messageContent.trim()) return;

    const newMsg: ChatMessage = {
      id: `custom_${Date.now()}`,
      sender: userName,
      role: '首席仲裁员 (我)',
      avatarLetter: '我',
      content: messageContent,
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };

    setDiscussionHistories(prev => ({
      ...prev,
      [selectedDiscussionCaseId]: [...(prev[selectedDiscussionCaseId] || []), newMsg]
    }));

    if (!textToSend) {
      setCustomChatMessage('');
    }

    setTimeout(() => {
      if (chatScrollRef.current) {
        chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
      }
    }, 100);
  };

  const quickReplies = [
    "同意，我已拟定本案主要合议焦点大纲，请安排下周多点线上预备合议。",
    "收到。请秘书通知当事人对第二轮反驳证物原件进行快递线下比照核对。",
    "对答辩时效的认定需要遵循2022版规则，请起草正式的实体管辖阻碍裁定回复。"
  ];

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="h-13 bg-slate-900 border-b border-slate-800 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-xs text-indigo-200 hover:text-white font-bold transition-colors cursor-pointer"
        >
          <span>❮ 返回首页</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-xs font-black text-white tracking-widest whitespace-nowrap">
          广州仲裁委 • 案件讨论
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar pb-10 bg-slate-50">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col h-[520px] overflow-hidden animate-fade-in text-left">
          {/* Header Selector inside Discussion Room */}
          <div className="bg-slate-50 p-3.5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
              <span className="text-xs font-black text-slate-700">在案合议交流室</span>
            </div>
            <select
              value={selectedDiscussionCaseId}
              onChange={(e) => setSelectedDiscussionCaseId(e.target.value)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs font-extrabold text-slate-600 outline-none cursor-pointer focus:border-indigo-400"
            >
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.caseNo.split('号')[0]}号庭</option>
              ))}
            </select>
          </div>

          {/* Chat Log History list */}
          <div
            ref={chatScrollRef}
            className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50 no-scrollbar min-h-[220px]"
          >
            {(discussionHistories[selectedDiscussionCaseId] || []).map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 max-w-[90%] text-left ${msg.isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div className={`w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs select-none text-white flex-shrink-0 ${msg.isMe ? 'bg-indigo-600' : 'bg-slate-600'}`}>
                  {msg.avatarLetter}
                </div>
                <div className="space-y-1">
                  <div className={`flex items-center gap-2 text-xs text-slate-500 ${msg.isMe ? 'justify-end' : ''}`}>
                    <strong className="text-slate-600 font-extrabold">{msg.sender}</strong>
                    <span className="bg-slate-100 text-slate-500 px-1 py-0.2 rounded text-2xs scale-90">{msg.role}</span>
                    <span className="font-mono text-2xs">{msg.time}</span>
                  </div>
                  <div className={`p-3 rounded-2xl text-sm leading-relaxed relative ${
                    msg.isMe
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none shadow-xs'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action input bar */}
          <div className="p-3 border-t border-slate-100 bg-white flex flex-col gap-2 flex-shrink-0">
            {/* Quick reply tags */}
            <div className="flex space-x-1.5 overflow-x-auto no-scrollbar pb-1">
              {quickReplies.map((qr, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(qr)}
                  className="bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg p-1.5 px-3 text-xs font-bold text-slate-500 truncate max-w-[140px] flex-shrink-0 transition-colors cursor-pointer"
                >
                  {qr}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/25 rounded-2xl px-3 py-1.5 shadow-inner">
              <input
                type="text"
                placeholder="畅所欲言，草拟合议质辩见地意见..."
                className="bg-transparent border-none outline-none text-sm placeholder:text-slate-500 w-full text-slate-800"
                value={customChatMessage}
                onChange={(e) => setCustomChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
              />
              <button
                onClick={() => handleSendMessage()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-xl transition-all cursor-pointer shadow-sm shadow-indigo-600/20"
              >
                <Send size={11} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
