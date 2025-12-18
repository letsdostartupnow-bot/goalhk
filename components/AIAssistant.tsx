import React from 'react';
import { Bot, ChevronRight, CheckCircle, Radio, Shield } from 'lucide-react';
import { Task, TaskStep } from '../types';

interface AIAssistantProps {
  task: Task | null;
  status: string;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ task, status }) => {
  if (!task) {
      // Idle State - Positioned above BottomNav (approx 72px)
      return (
        <div className="fixed bottom-[72px] left-0 w-full bg-gradient-to-t from-white/90 via-white/50 to-transparent pt-12 pb-2 px-6 z-40 pointer-events-none">
            <div className="max-w-xl mx-auto flex items-end gap-4 pointer-events-auto">
                <div className="bg-black/90 backdrop-blur text-white p-4 rounded-2xl rounded-bl-sm shadow-xl flex items-center gap-3 animate-bounce-slow border border-white/20">
                    <Bot size={24} className="text-emerald-400" />
                    <div>
                        <p className="font-bold text-sm">你好！我是 GOAL AI。</p>
                        <p className="text-xs text-gray-400">請按語音輸入或打字告訴我你想解決的問題。</p>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  const currentStep = task.steps[task.currentStepIndex];

  // Active State - Positioned above BottomNav
  return (
    <div className="fixed bottom-[72px] left-0 w-full z-40 pointer-events-none">
      <div className="max-w-2xl mx-auto px-4 pointer-events-auto">
        <div className="bg-white/95 backdrop-blur-xl border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-3xl overflow-hidden">
            {/* Progress Bar Line */}
            <div className="w-full h-1 bg-gray-100 mb-2">
                <div 
                    className="h-full bg-emerald-500 transition-all duration-700 ease-out" 
                    style={{ width: `${((task.currentStepIndex + 1) / task.steps.length) * 100}%` }}
                />
            </div>

            <div className="px-6 pb-6 pt-2">
                {/* Header: AI Analysis */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="bg-black p-2 rounded-xl mt-1 shrink-0 shadow-lg">
                        <Bot size={24} className="text-emerald-400" />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                            <h3 className="font-bold text-lg text-gray-800 leading-tight">
                                {status === 'COMPLETED' ? '任務完成！' : task.aiAnalysis}
                            </h3>
                            {task.hasInsurance && (
                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full flex items-center gap-1 font-bold whitespace-nowrap">
                                    <Shield size={10} /> 受保中
                                </span>
                            )}
                        </div>
                        
                        {/* Steps Visualizer */}
                        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar py-1">
                            {task.steps.map((step, idx) => {
                                const isActive = idx === task.currentStepIndex;
                                const isDone = idx < task.currentStepIndex;
                                return (
                                    <div key={step.id} className="flex items-center shrink-0">
                                        <div className={`
                                            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all
                                            ${isActive ? 'bg-black text-white border-black ring-2 ring-offset-1 ring-black/20' : 
                                            isDone ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-white text-gray-400 border-gray-200'}
                                        `}>
                                            <span>{idx + 1}. {step.title}</span>
                                            {isActive && <Radio size={10} className="animate-pulse text-emerald-400" />}
                                            {isDone && <CheckCircle size={10} />}
                                        </div>
                                        {idx < task.steps.length - 1 && <ChevronRight size={12} className="text-gray-300 mx-1" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Context Action Button */}
                {currentStep?.action === 'OPEN_CAMERA' && (
                    <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition flex justify-center items-center gap-2 shadow-lg shadow-blue-200">
                        開啟 AR 鏡頭診斷 (建議)
                    </button>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;