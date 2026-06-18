import React, { useState } from 'react';
import { ArrowLeft, Building2, CheckCircle } from 'lucide-react';

interface WorkInfo {
  company: string;
  position: string;
  qualification: string;
}

interface WorkInfoEditProps {
  initialData: WorkInfo;
  onBack: () => void;
  onSave: (data: WorkInfo) => void;
}

export default function WorkInfoEdit({ initialData, onBack, onSave }: WorkInfoEditProps) {
  const [formData, setFormData] = useState<WorkInfo>(initialData);

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
        <div className="absolute left-1/2 -translate-x-1/2 text-base font-bold text-slate-800 whitespace-nowrap">编辑工作单位</div>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4 space-y-4 text-left">
        <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Building2 size={14} className="text-indigo-500" />
            工作单位信息
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">工作单位</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">现任职务</label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">行业资质</label>
              <input
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({...formData, qualification: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
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