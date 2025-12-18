
import React, { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { FileText, CheckCircle, Clock, DollarSign, Mic, Send, Bot, Loader2, Plus } from 'lucide-react';
import { Task, Quote, QuoteItem } from '../types';
import { parseQuoteRequest } from '../services/geminiService';

interface CRMSystemProps {
  activeTasks: Task[];
  quotes: Quote[];
}

const dataStatus = [
  { name: 'Completed', value: 400 },
  { name: 'In Progress', value: 300 },
  { name: 'Pending', value: 300 },
  { name: 'Cancelled', value: 200 },
];

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'];

const CRMSystem: React.FC<CRMSystemProps> = ({ activeTasks, quotes: initialQuotes }) => {
  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'QUOTE_BUILDER'>('DASHBOARD');
  
  // Quote Builder State
  const [quoteInput, setQuoteInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftQuoteItems, setDraftQuoteItems] = useState<QuoteItem[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Fake Chat History for Builder
  const [chatHistory, setChatHistory] = useState<{sender: 'AI'|'USER', text: string}[]>([
      { sender: 'AI', text: '你好！我是您的智能報價助手。請告訴我您想加入報價單的項目 (例如：新增 防水工程 $1500)。' }
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleSendMessage = async () => {
      if (!quoteInput.trim()) return;
      
      const userText = quoteInput;
      setChatHistory(prev => [...prev, { sender: 'USER', text: userText }]);
      setQuoteInput('');
      setIsProcessing(true);

      // Simulate AI Parsing
      try {
          // 1. Parse item
          const newItem = await parseQuoteRequest(userText);
          
          // 2. Add to draft
          setDraftQuoteItems(prev => [...prev, newItem]);

          // 3. AI Reply
          setTimeout(() => {
              setChatHistory(prev => [...prev, { 
                  sender: 'AI', 
                  text: `已為您新增項目：「${newItem.description}」金額 $${newItem.unitPrice}。還有其他項目嗎？` 
              }]);
              setIsProcessing(false);
          }, 1000);

      } catch (e) {
          setIsProcessing(false);
      }
  };

  const toggleVoice = () => {
      setIsListening(true);
      setTimeout(() => {
          setQuoteInput('更換洗手盆水龍頭 $800');
          setIsListening(false);
      }, 2000);
  };

  const renderDashboard = () => (
    <div className="space-y-6 pb-24">
       {/* Stats Cards */}
       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center text-green-600 mb-2"><CheckCircle size={16}/></div>
            <p className="text-xs text-gray-500 uppercase">已完成</p>
            <p className="text-xl font-bold">128</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-8 h-8 rounded-full flex items-center justify-center text-blue-600 mb-2"><Clock size={16}/></div>
            <p className="text-xs text-gray-500 uppercase">進行中</p>
            <p className="text-xl font-bold">{activeTasks.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-8 h-8 rounded-full flex items-center justify-center text-purple-600 mb-2"><FileText size={16}/></div>
            <p className="text-xs text-gray-500 uppercase">待報價</p>
            <p className="text-xl font-bold">{initialQuotes.length}</p>
        </div>
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center text-yellow-600 mb-2"><DollarSign size={16}/></div>
            <p className="text-xs text-gray-500 uppercase">本月營收</p>
            <p className="text-xl font-bold">$45k</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-bold text-gray-700 mb-4">任務狀態</h3>
            <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={dataStatus} cx="50%" cy="50%" innerRadius={40} outerRadius={60} fill="#8884d8" paddingAngle={5} dataKey="value">
                        {dataStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
             <h3 className="font-bold text-gray-700 mb-4">最新報價單</h3>
             <div className="space-y-3">
                 {initialQuotes.slice(0, 3).map(q => (
                     <div key={q.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                         <div>
                             <p className="font-bold text-sm text-gray-800">#{q.id.slice(-6)}</p>
                             <p className="text-xs text-gray-500">{q.items.length} 項目</p>
                         </div>
                         <span className="font-bold text-emerald-600">${q.total}</span>
                     </div>
                 ))}
             </div>
        </div>
      </div>
    </div>
  );

  const renderQuoteBuilder = () => (
      <div className="flex flex-col h-[calc(100vh-180px)] md:flex-row gap-4 pb-24">
          {/* Chat Area */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
              <div className="p-4 border-b bg-gray-50 flex items-center gap-2">
                  <Bot size={20} className="text-blue-500"/>
                  <h3 className="font-bold text-gray-700">AI 報價助手</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {chatHistory.map((msg, i) => (
                      <div key={i} className={`flex ${msg.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                              msg.sender === 'USER' ? 'bg-black text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}>
                              {msg.text}
                          </div>
                      </div>
                  ))}
                  {isProcessing && <div className="text-gray-400 text-xs flex items-center gap-1"><Loader2 size={12} className="animate-spin"/> AI thinking...</div>}
                  <div ref={chatEndRef} />
              </div>

              <div className="p-3 border-t bg-white flex items-center gap-2">
                  <button onClick={toggleVoice} className={`p-2 rounded-full transition-colors ${isListening ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-gray-100 text-gray-500'}`}>
                      <Mic size={20} />
                  </button>
                  <input 
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-2 ring-black/10"
                    placeholder="輸入項目和金額..."
                    value={quoteInput}
                    onChange={(e) => setQuoteInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button onClick={handleSendMessage} className="p-2 bg-black text-white rounded-full hover:bg-gray-800">
                      <Send size={18} />
                  </button>
              </div>
          </div>

          {/* Live Preview */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800">報價單預覽</h3>
                  <span className="bg-yellow-100 text-yellow-700 text-xs px-2 py-1 rounded-full">DRAFT</span>
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-2">
                  {draftQuoteItems.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-gray-300 border-2 border-dashed border-gray-100 rounded-xl">
                          <Plus size={32} className="mb-2 opacity-50"/>
                          <p className="text-sm">請在左側輸入項目</p>
                      </div>
                  ) : (
                      draftQuoteItems.map((item, idx) => (
                          <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg animate-in slide-in-from-left-2">
                              <div>
                                  <p className="font-medium text-sm text-gray-800">{item.description}</p>
                                  <span className="text-[10px] text-gray-400 uppercase">{item.category}</span>
                              </div>
                              <p className="font-mono font-bold">${item.unitPrice}</p>
                          </div>
                      ))
                  )}
              </div>

              <div className="mt-4 pt-4 border-t">
                  <div className="flex justify-between items-center text-lg font-bold mb-4">
                      <span>總計</span>
                      <span className="text-emerald-600">${draftQuoteItems.reduce((acc, i) => acc + i.unitPrice, 0)}</span>
                  </div>
                  <button className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition">
                      發送報價單
                  </button>
              </div>
          </div>
      </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Provider CRM</h1>
            <p className="text-sm text-gray-500">Welcome back, Master Chen</p>
        </div>
        <div className="flex bg-white rounded-lg p-1 shadow-sm border border-gray-100">
            <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'DASHBOARD' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                Dashboard
            </button>
            <button 
                onClick={() => setActiveTab('QUOTE_BUILDER')}
                className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${activeTab === 'QUOTE_BUILDER' ? 'bg-black text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
                AI Quote Builder
            </button>
        </div>
      </header>

      {activeTab === 'DASHBOARD' ? renderDashboard() : renderQuoteBuilder()}
    </div>
  );
};

export default CRMSystem;
