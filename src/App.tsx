/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { mockArbitrator, mockCases, mockTasks } from './data/mockData';
import { Case, Task, CaseStatus } from './types';
import MiniProgramContainer from './components/MiniProgramContainer';
import Workbench from './components/Workbench';
import CaseList from './components/CaseList';
import TaskCenter from './components/TaskCenter';
import CaseStats from './components/CaseStats';
import CaseDetail from './components/CaseDetail';
import MyProfile from './components/MyProfile';
import StatsCenterPage from './components/StatsCenterPage';
import CaseDiscussionPage from './components/CaseDiscussionPage';
import MyAppointmentPage from './components/MyAppointmentPage';
import NotificationPage from './components/NotificationPage';
import RemunerationPage from './components/RemunerationPage';
import PersonalInfoEdit from './components/PersonalInfoEdit';
import WorkInfoEdit from './components/WorkInfoEdit';
import BankInfoEdit from './components/BankInfoEdit';

type SubPageType = 'statsCenter' | 'caseDiscussion' | 'appointment' | 'notifications' | 'remuneration' | 'personalInfoEdit' | 'workInfoEdit' | 'bankInfoEdit' | null;

export default function App() {
  // Navigation State: 0 (首页), 1 (案卷), 2 (待办), 3 (统计 -> 我的)
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Sub-page state for workbench sub-pages
  const [activeSubPage, setActiveSubPage] = useState<SubPageType>(null);
  
  // Login State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  
  // Data States
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  // Global filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<CaseStatus | 'all'>('all');

  // Profile edit data states
  const [personalInfo, setPersonalInfo] = useState({
    name: mockArbitrator.name,
    ranking: mockArbitrator.ranking,
    phone: '138-8888-8888',
    email: 'zhangming@gzac.org.cn',
    homeAddress: '广州市天河区珠江新城华夏路30号',
    contactAddress: '广州市越秀区东风中路418号',
    otherAddress: '深圳市南山区科技园南区',
    preferredAddress: 'home' as 'home' | 'contact' | 'other',
    specialties: mockArbitrator.specialties
  });

  const [workInfo, setWorkInfo] = useState({
    company: '广州市社会科学院政治法律研究所',
    position: '资深执业律师 / 研究所客座专家',
    qualification: '商事及涉外民法律照专职律师'
  });

  const [bankInfo, setBankInfo] = useState({
    bank: '东莞银行股份有限公司',
    branch: '广州分行',
    accountNo: '6223 8812 **** 0918',
    accountName: mockArbitrator.name
  });

  // Callback to mark a task as completed and update case values
  const handleCompleteTask = (taskId: string, extraUpdates?: { caseId: string; nextStatus: CaseStatus }) => {
    // Mark task completed
    setTasks(prevTasks => 
      prevTasks.map(t => t.id === taskId ? { ...t, status: 'completed' } : t)
    );

    // Apply optional follow-up automatic updates (e.g. updating the case status!)
    if (extraUpdates) {
      setCases(prevCases => 
        prevCases.map(c => {
          if (c.id === extraUpdates.caseId) {
            // Update status
            const updatedCase = { ...c, status: extraUpdates.nextStatus };
            
            // If the case status changes, append a new node to the timeline
            const nextTimeline = [...c.timeline];
            
            if (extraUpdates.nextStatus === '已结案') {
              nextTimeline.push({
                title: "正式签署完结获签并发布",
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                status: "completed",
                operator: "独任仲裁员 (张明)",
                remark: "裁决主书签署生效并自动上传国家电子档案中控系统，全案正式结案。"
              });
              updatedCase.closeDate = new Date().toISOString().split('T')[0];
            } else if (extraUpdates.nextStatus === '审理中') {
              nextTimeline.push({
                title: "开庭日程已确认排定",
                time: new Date().toISOString().replace('T', ' ').substring(0, 16),
                status: "completed",
                operator: "合议庭首席 (张明)",
                remark: "首长核阅与各专家日程时间冲突通过，排庭方案送发书记员安排通知双签。"
              });
            }
            
            updatedCase.timeline = nextTimeline;
            return updatedCase;
          }
          return c;
        })
      );
    }
  };

  // Triggered when a user clicks "Process with High urgency" in homeostasis
  const handleSelectTaskDirect = (task: Task) => {
    setActiveTab(2); // Jump to 待办 (index 2)
  };

  // Navigate to sub-page from workbench
  const handleNavigateToSubPage = (page: 'statsCenter' | 'caseDiscussion' | 'appointment' | 'notifications' | 'remuneration' | 'personalInfoEdit' | 'workInfoEdit' | 'bankInfoEdit') => {
    setActiveSubPage(page);
  };

  // Back from sub-page to workbench
  const handleBackFromSubPage = () => {
    setActiveSubPage(null);
  };

  if (!isLoggedIn) {
    return (
      <MiniProgramContainer>
        <div className="flex-1 bg-gradient-to-br from-[#0B0F19] via-[#111827] to-[#1E293B] text-white flex flex-col justify-center items-center p-6 text-center select-none animate-fade-in font-sans relative">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center space-x-1.5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping text-indigo-500"></span>
            <span className="text-xs font-black tracking-widest text-slate-500">广州仲裁委 • 智慧专网盾</span>
          </div>

          <div className="space-y-6 w-full max-w-xs">
            {/* Animated Ring Icon */}
            <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border border-indigo-500/20 animate-pulse" />
              <div className="absolute inset-2 rounded-full border border-indigo-400/40 animate-pulse" />
              <div className="absolute inset-4 rounded-full bg-[#111827] border border-indigo-500/80 flex items-center justify-center shadow-lg shadow-indigo-500/10">
                <i className="fa-solid fa-lock text-indigo-400 text-xl animate-pulse"></i>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-base font-black tracking-tight text-[#F3F4F6]">仲裁端双因子登录认证</h1>
              <p className="text-xs text-slate-500 leading-normal px-2">
                检测到您未载入本委CA防伪专效证书盾，为保证合议内容秘密度及数据，请点击指纹核验或一键进行数字建连登录。
              </p>
            </div>

            <div className="space-y-2.5 pt-3">
              <button 
                onClick={() => {
                  setIsLoggedIn(true);
                  setActiveTab(0); // auto reset tab to workbench
                }}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-heavy p-3 text-sm rounded-2xl cursor-pointer transition-all border border-indigo-600 shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-fingerprint text-xs"></i>
                <span>双因子安全一键核签登录</span>
              </button>
              
              <div className="text-2xs text-slate-500 font-mono">
                硬件指纹及数字校验盾 ID: ARB-2018-0925
              </div>
            </div>
          </div>
        </div>
      </MiniProgramContainer>
    );
  }

  return (
    <MiniProgramContainer>
      {/* Dynamic Content View based on Active bottom tab tab index */}
      <div className="flex-1 flex flex-col min-h-0 w-full relative overflow-y-auto no-scrollbar">
        {/* Sub-page rendering (takes priority over main tabs) */}
        {activeSubPage === 'statsCenter' && (
          <StatsCenterPage
            cases={cases}
            onBack={handleBackFromSubPage}
            onNavigateToTab={(idx) => {
              handleBackFromSubPage();
              setActiveTab(idx);
            }}
            onFilterStatus={setSelectedStatusFilter}
          />
        )}

        {activeSubPage === 'caseDiscussion' && (
          <CaseDiscussionPage
            cases={cases}
            userName={mockArbitrator.name}
            onBack={handleBackFromSubPage}
          />
        )}

        {activeSubPage === 'appointment' && (
          <MyAppointmentPage
            profile={mockArbitrator}
            onBack={handleBackFromSubPage}
          />
        )}

        {activeSubPage === 'notifications' && (
          <NotificationPage
            onBack={handleBackFromSubPage}
          />
        )}

        {activeSubPage === 'remuneration' && (
          <RemunerationPage
            onBack={handleBackFromSubPage}
          />
        )}

        {activeSubPage === 'personalInfoEdit' && (
          <PersonalInfoEdit
            initialData={personalInfo}
            onBack={handleBackFromSubPage}
            onSave={(data) => setPersonalInfo(data)}
          />
        )}

        {activeSubPage === 'workInfoEdit' && (
          <WorkInfoEdit
            initialData={workInfo}
            onBack={handleBackFromSubPage}
            onSave={(data) => setWorkInfo(data)}
          />
        )}

        {activeSubPage === 'bankInfoEdit' && (
          <BankInfoEdit
            initialData={bankInfo}
            onBack={handleBackFromSubPage}
            onSave={(data) => setBankInfo(data)}
          />
        )}

        {/* Main tab content (only show when no sub-page is active) */}
        {!activeSubPage && activeTab === 0 && (
          <Workbench
            profile={mockArbitrator}
            tasks={tasks}
            cases={cases}
            onNavigateToTab={setActiveTab}
            onFilterStatus={setSelectedStatusFilter}
            onSelectCase={setSelectedCase}
            onSelectTaskDirect={handleSelectTaskDirect}
            selectedStatusFilter={selectedStatusFilter}
            onNavigateToSubPage={handleNavigateToSubPage}
          />
        )}

        {!activeSubPage && activeTab === 1 && (
          <CaseList
            cases={cases}
            selectedStatusFilter={selectedStatusFilter}
            onFilterStatusChange={setSelectedStatusFilter}
            onSelectCase={setSelectedCase}
          />
        )}

        {!activeSubPage && activeTab === 2 && (
          <TaskCenter
            tasks={tasks}
            cases={cases}
            onCompleteTask={handleCompleteTask}
            onNavigateToTab={setActiveTab}
            onSelectCase={setSelectedCase}
          />
        )}

        {!activeSubPage && activeTab === 3 && (
          <MyProfile
            profile={mockArbitrator}
            onLogout={() => setIsLoggedIn(false)}
            onNavigateToEdit={handleNavigateToSubPage}
            personalInfo={personalInfo}
            workInfo={workInfo}
            bankInfo={bankInfo}
            onSetPreferredAddress={(type) => setPersonalInfo({...personalInfo, preferredAddress: type})}
          />
        )}

        {/* Floating Case Details Slide-over panel */}
        {selectedCase && (
          <CaseDetail
            caseItem={selectedCase}
            onClose={() => setSelectedCase(null)}
          />
        )}
      </div>

      {/* WeChat Mini Program Styled Bottom Navigation Bar */}
      <div className="h-14 bg-white border-t border-slate-100 flex items-center justify-around select-none z-40 flex-shrink-0">
        {[
          { label: '首页', icon: 'fa-house', index: 0 },
          { label: '案件', icon: 'fa-folder-open', index: 1 },
          { label: '待办', icon: 'fa-square-check', index: 2 },
          { label: '我的', icon: 'fa-user', index: 3 }
        ].map((tab) => {
          const isActive = activeTab === tab.index && !activeSubPage;
          const pendingCount = tab.index === 2 ? tasks.filter(t => t.status === 'pending').length : 0;

          return (
            <button
               key={tab.index}
               onClick={() => { setActiveTab(tab.index); setSelectedCase(null); setActiveSubPage(null); }}
               className="flex flex-col items-center justify-center flex-1 h-full font-bold cursor-pointer relative transition-all"
               aria-label={tab.label}
               aria-current={isActive ? 'page' : undefined}
             >
              <div className="relative">
                <i 
                  className={`fa-solid ${tab.icon} text-xl transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-500'}`}
                  aria-hidden="true"
                />
                {pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-bold text-2xs h-4 w-4 rounded-full flex items-center justify-center border border-white">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-0.5 transition-colors duration-200 ${isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </MiniProgramContainer>
  );
}
