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

export default function App() {
  // Navigation State: 0 (首页), 1 (案卷), 2 (待办), 3 (统计)
  const [activeTab, setActiveTab] = useState<number>(0);
  
  // Data States
  const [cases, setCases] = useState<Case[]>(mockCases);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  
  // Global filters
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<CaseStatus | 'all'>('all');

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

  return (
    <MiniProgramContainer>
      {/* Dynamic Content View based on Active bottom tab tab index */}
      <div className="flex-1 flex flex-col min-h-0 w-full relative">
        {activeTab === 0 && (
          <Workbench
            profile={mockArbitrator}
            tasks={tasks}
            cases={cases}
            onNavigateToTab={setActiveTab}
            onFilterStatus={setSelectedStatusFilter}
            onSelectCase={setSelectedCase}
            onSelectTaskDirect={handleSelectTaskDirect}
            selectedStatusFilter={selectedStatusFilter}
          />
        )}

        {activeTab === 1 && (
          <CaseList
            cases={cases}
            onFilterStatus={setSelectedStatusFilter}
            selectedStatusFilter={selectedStatusFilter}
            onSelectCase={setSelectedCase}
          />
        )}

        {activeTab === 2 && (
          <TaskCenter
            tasks={tasks}
            cases={cases}
            onCompleteTask={handleCompleteTask}
            onNavigateToTab={setActiveTab}
            onSelectCase={setSelectedCase}
          />
        )}

        {activeTab === 3 && (
          <CaseStats
            cases={cases}
            onNavigateToTab={setActiveTab}
            onFilterStatus={setSelectedStatusFilter}
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
          { label: '案卷', icon: 'fa-folder-open', index: 1 },
          { label: '待办', icon: 'fa-square-check', index: 2 },
          { label: '统计', icon: 'fa-chart-pie', index: 3 }
        ].map((tab) => {
          const isActive = activeTab === tab.index;
          const pendingCount = tab.index === 2 ? tasks.filter(t => t.status === 'pending').length : 0;

          return (
            <button
               key={tab.index}
               onClick={() => { setActiveTab(tab.index); setSelectedCase(null); }}
               className="flex flex-col items-center justify-center flex-1 h-full font-bold cursor-pointer relative transition-all"
             >
              <div className="relative">
                <i 
                  className={`fa-solid ${tab.icon} text-[18px] transition-colors duration-200 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} 
                />
                {pendingCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white font-bold text-[8.5px] h-4 w-4 rounded-full flex items-center justify-center border border-white">
                    {pendingCount}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 transition-colors duration-200 ${isActive ? 'text-indigo-600 font-extrabold' : 'text-slate-500 font-semibold'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </MiniProgramContainer>
  );
}
