import React, { useState } from 'react';
import { ArrowLeft, CreditCard, CheckCircle, ShieldCheck } from 'lucide-react';

interface BankInfo {
  bank: string;
  branch: string;
  accountNo: string;
  accountName: string;
}

interface BankInfoEditProps {
  initialData: BankInfo;
  onBack: () => void;
  onSave: (data: BankInfo) => void;
}

export default function BankInfoEdit({ initialData, onBack, onSave }: BankInfoEditProps) {
  const [formData, setFormData] = useState<BankInfo>(initialData);

  const handleSave = () => {
    onSave(formData);
    onBack();
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header - 微信小程序子页面返回样式 */}
      <div className="h-12 bg-[#ddecff] border-b border-slate-100 flex items-center px-4 relative flex-shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-slate-600 hover:text-slate-900 font-medium transition-colors cursor-pointer"
        >
          <i className="fa-solid fa-chevron-left text-xs"></i>
          <span className="text-sm">返回</span>
        </button>
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">编辑银行账号信息</div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4 space-y-4 text-left">
        <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <CreditCard size={14} className="text-indigo-500" />
            银行账户信息
          </h3>
          
          <div className="space-y-3">
            
              <div className="space-y-1.5">
                <label className="text-base font-medium text-slate-600">开户银行</label>
                <input
                  type="text"
                  value={formData.bank}
                  onChange={(e) => setFormData({...formData, bank: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-base font-medium text-slate-600">开户支行</label>
                <input
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({...formData, branch: e.target.value})}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            
            <div className="space-y-1.5">
              <label className="text-base font-medium text-slate-600">银行卡号</label>
              <input
                type="text"
                value={formData.accountNo}
                onChange={(e) => setFormData({...formData, accountNo: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-base font-medium text-slate-600">账户户名</label>
              <input
                disabled
                type="text"
                value={formData.accountName}
                onChange={(e) => setFormData({...formData, accountName: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-base focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        
      </div>

      {/* Footer Buttons */}
      <div className="sticky bottom-0 bg-white border-t border-slate-100 p-4 flex gap-3">
        <button
          onClick={onBack}
          className="flex-1 py-3 rounded-lg bg-slate-100 text-slate-600 font-medium text-sm hover:bg-slate-200 transition-colors"
        >
          取消
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 rounded-lg bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle size={16} />
          保存修改
        </button>
      </div>
    </div>
  );
}