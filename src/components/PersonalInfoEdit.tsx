import React, { useState } from 'react';
import { ArrowLeft, MapPin, CheckCircle } from 'lucide-react';

interface PersonalInfo {
  name: string;
  ranking: string;
  phone: string;
  email: string;
  homeAddress: string;
  contactAddress: string;
  otherAddress: string;
  preferredAddress: 'home' | 'contact' | 'other';
  specialties: string[];
}

interface PersonalInfoEditProps {
  initialData: PersonalInfo;
  onBack: () => void;
  onSave: (data: PersonalInfo) => void;
}

export default function PersonalInfoEdit({ initialData, onBack, onSave }: PersonalInfoEditProps) {
  const [formData, setFormData] = useState<PersonalInfo>(initialData);

  const handleSave = () => {
    onSave(formData);
    onBack();
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col overflow-y-auto no-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-bold text-slate-800">编辑个人信息</h1>
      </div>

      {/* Form Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Basic Info */}
        <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <span className="w-1 h-4 bg-indigo-500 rounded-full"></span>
            基本信息
          </h3>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">中文姓名</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">聘用职称</label>
              <input
                type="text"
                value={formData.ranking}
                onChange={(e) => setFormData({...formData, ranking: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">手机号</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-600">联系邮箱</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Info */}
        <div className="bg-white rounded-lg border border-slate-100 p-4 space-y-4">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <MapPin size={14} className="text-indigo-500" />
            地址信息
          </h3>
          
          <div className="space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">居住地址</label>
                <button
                  onClick={() => setFormData({...formData, preferredAddress: 'home'})}
                  className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                    formData.preferredAddress === 'home' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {formData.preferredAddress === 'home' ? '★ 首选' : '设为首选'}
                </button>
              </div>
              <input
                type="text"
                value={formData.homeAddress}
                onChange={(e) => setFormData({...formData, homeAddress: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">联系地址</label>
                <button
                  onClick={() => setFormData({...formData, preferredAddress: 'contact'})}
                  className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                    formData.preferredAddress === 'contact' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {formData.preferredAddress === 'contact' ? '★ 首选' : '设为首选'}
                </button>
              </div>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) => setFormData({...formData, contactAddress: e.target.value})}
                className="w-full px-3 py-2.5 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-600">其他地址</label>
                <button
                  onClick={() => setFormData({...formData, preferredAddress: 'other'})}
                  className={`text-xs px-2 py-1 rounded font-medium transition-colors ${
                    formData.preferredAddress === 'other' 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {formData.preferredAddress === 'other' ? '★ 首选' : '设为首选'}
                </button>
              </div>
              <input
                type="text"
                value={formData.otherAddress}
                onChange={(e) => setFormData({...formData, otherAddress: e.target.value})}
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