import React, { useState } from 'react';
import { Mic, Search, X, ScanLine, FileText, ShieldCheck, ArrowRight, Phone, MessageCircle, Calendar, Loader2, Award, Clock, Briefcase, Zap } from 'lucide-react';
import MapInterface from './components/MapInterface';
import AIAssistant from './components/AIAssistant';
import CRMSystem from './components/CRMSystem';
import JobBoard from './components/JobBoard';
import BottomNav from './components/BottomNav';
import PaymentModal from './components/PaymentModal';
import ReviewModal from './components/ReviewModal';
import { Task, TaskStatus, Provider, JobItem, Quote } from './types';
import { processUserRequest, generateQuote } from './services/geminiService';

// Mock Data for Job Board (Same as before)
const MOCK_JOBS: JobItem[] = [
  { id: 'j1', title: '緊急爆水管維修', description: '廚房洗手盆底漏水嚴重，急需持牌師傅上門處理。', category: 'HOME_REPAIR', location: '旺角', budget: 800, isBiddingAllowed: true, postedTime: '5m', distance: '0.5km', requesterName: 'Mrs. Wong', requesterRating: 4.8 },
  { id: 'j2', title: '尋找行山拍檔', description: '星期六早上去西貢行麥理浩徑第3段。', category: 'SOCIAL', location: '西貢', budget: 0, isBiddingAllowed: false, postedTime: '20m', distance: '12km', requesterName: 'David', requesterRating: 4.5 },
];

const SUGGESTIONS = [
  { id: 's1', label: '💦 爆水管 (Burst Pipe)', query: '爆水管' },
  { id: 's2', label: '🏠 全屋裝修 (Renovation)', query: '我想全屋裝修' },
  { id: 's3', label: '🥾 找人行山 (Hiking)', query: '找人行山' },
  { id: 's4', label: '🏥 陪診 (Doctor)', query: '陪看醫生' },
  { id: 's5', label: '🍱 找飯腳 (Eat)', query: '找人食飯' },
];

const FEED_ITEMS = [
    { id: 'f1', text: '🔔 Mrs. Wong (Mong Kok) just posted: Emergency Pipe Fix ($800)', link: 'j1' },
    { id: 'f2', text: '🏔️ David (Sai Kung) is looking for Hiking Buddy (Free)', link: 'j2' },
    { id: 'f3', text: '🚗 Jason requested Airport Transfer ($350)', link: 'j1' },
    { id: 'f4', text: '🥘 Sarah needs a Cooking Helper for Party ($1200)', link: 'j1' },
    { id: 'f5', text: '💻 Alex is looking for Wifi Repair ($400)', link: 'j1' },
];

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'USER' | 'JOBS' | 'CRM' | 'PROFILE'>('USER');
  const [userInput, setUserInput] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isListening, setIsListening] = useState(false);
  
  // App Flow State
  const [task, setTask] = useState<Task | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [availableJobs, setAvailableJobs] = useState<JobItem[]>(MOCK_JOBS);
  
  // Modals & UI
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [arMode, setArMode] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- Logic Handlers ---

  const generateMockProviders = (modeId: string | undefined, modes: any[]): Provider[] => {
      if(!modes || modes.length === 0) return [];
      
      const selectedMode = modes.find(m => m.id === modeId);
      const priceStr = selectedMode ? selectedMode.estimatedPrice : '100';
      const basePrice = parseInt(priceStr.replace(/\D/g, '') || '100');

      return Array(3).fill(0).map((_, i) => ({
        id: `p-${Date.now()}-${i}`,
        name: ['David Chen', 'Alan Fix', 'Jenny Service'][i],
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + Math.random()}`,
        profession: 'Pro',
        type: (i === 2 ? 'COMPANY' : 'INDIVIDUAL'),
        rating: 4.8,
        distance: '0.8km',
        coordinates: { lat: (Math.random() - 0.5) * 0.005, lng: (Math.random() - 0.5) * 0.005 },
        badges: ['Verified'],
        isAvailable: true,
        basePrice: basePrice
      }));
  };

  const simulateIncomingBids = (currentTask: Task) => {
    // Show toast
    showToast("Request broadcasted! Waiting for bids...");

    setTimeout(() => {
        const mockBids: Quote[] = [
            {
                id: 'bid-1', taskId: currentTask.id, providerId: 'p1', providerName: '強記裝修工程', 
                providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eng1', providerRating: 4.5,
                status: 'SENT', createdAt: new Date().toISOString(), total: 220000,
                items: [{ id: 'i1', description: '全屋基本裝修套餐', quantity: 1, unitPrice: 220000, category: 'LABOR' }]
            },
            {
                id: 'bid-2', taskId: currentTask.id, providerId: 'p2', providerName: '陳師傅 (個人)', 
                providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eng2', providerRating: 4.9,
                status: 'SENT', createdAt: new Date().toISOString(), total: 185000,
                items: [{ id: 'i2', description: '人工連料優惠價', quantity: 1, unitPrice: 185000, category: 'LABOR' }]
            },
            {
                id: 'bid-3', taskId: currentTask.id, providerId: 'p3', providerName: 'Design House Pro', 
                providerAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=eng3', providerRating: 4.2,
                status: 'SENT', createdAt: new Date().toISOString(), total: 280000,
                items: [{ id: 'i3', description: '高端設計連施工', quantity: 1, unitPrice: 280000, category: 'LABOR' }]
            }
        ];
        
        setTask(prev => prev ? { ...prev, bids: mockBids } : null);
        showToast("Ding! Ding! 3 New Quotes Received!");
    }, 4000);
  };

  const handleInputSubmit = async (overrideInput?: string) => {
    const textToProcess = overrideInput || userInput;
    if (!textToProcess.trim()) return;
    
    // Update input UI if triggered by suggestion
    if (overrideInput) setUserInput(overrideInput);

    setTask(null); 
    setProviders([]);

    const partialTask = await processUserRequest(textToProcess);
    
    // Select first mode by default if available
    const defaultModeId = partialTask.recommendedModes && partialTask.recommendedModes.length > 0 
        ? partialTask.recommendedModes[0].id 
        : undefined;

    const newTask: Task = {
        id: `T-${Date.now()}`,
        userId: 'U-1',
        description: partialTask.description!,
        category: partialTask.category || 'GENERAL',
        status: TaskStatus.MODE_SELECTION,
        aiAnalysis: partialTask.aiAnalysis!,
        recommendedModes: partialTask.recommendedModes || [],
        steps: partialTask.steps || [],
        currentStepIndex: 0,
        hasInsurance: false,
        isEscrowActive: false,
        selectedModeId: defaultModeId,
        dueDate: selectedDate || undefined
    };

    setTask(newTask);
    setProviders(generateMockProviders(newTask.selectedModeId, partialTask.recommendedModes));
  };

  const handleSelectMode = (modeId: string) => {
      if (!task) return;
      const selectedMode = task.recommendedModes.find(m => m.id === modeId);
      
      if (selectedMode?.isBidding) {
          // Enter Bidding Flow
          setTask({ ...task, selectedModeId: modeId, status: TaskStatus.AWAITING_BIDS, bids: [], currentStepIndex: 1 });
          setProviders([]); // Clear map providers as we are broadcasting
          simulateIncomingBids(task);
      } else {
          // Standard Flow
          setTask({ ...task, selectedModeId: modeId, status: TaskStatus.PROVIDER_SELECTION });
          setProviders(generateMockProviders(modeId, task.recommendedModes));
      }
  };

  const handleProviderSelect = async (provider: Provider) => {
      if (!task) return;
      setTask({ ...task, status: TaskStatus.NEGOTIATING, selectedProviderId: provider.id, currentStepIndex: 1 });
      const quote = await generateQuote(task, provider.name);
      setTask(prev => prev ? { ...prev, quote } : null);
      setShowQuoteModal(true);
  };

  const handleBidSelect = (bid: Quote) => {
      if (!task) return;
      setTask({ 
          ...task, 
          status: TaskStatus.NEGOTIATING, 
          selectedProviderId: bid.providerId, 
          quote: bid,
          currentStepIndex: 2
      });
      setShowQuoteModal(true);
  };

  const handleProceedToPayment = () => {
      setShowQuoteModal(false);
      setShowPaymentModal(true);
  }

  const handlePaymentSuccess = () => {
      setShowPaymentModal(false);
      if (!task || !task.quote) return;
      setTask({
          ...task,
          status: TaskStatus.IN_PROGRESS,
          quote: { ...task.quote, status: 'PAID' },
          isEscrowActive: true,
          currentStepIndex: task.status === TaskStatus.AWAITING_BIDS ? 3 : 2, // Adjust step index based on flow
          hasInsurance: true
      });
      showToast("Payment secured in Escrow. Provider notified.");
  };

  const handleCompleteTask = () => {
      if(!task) return;
      setTask({...task, status: TaskStatus.COMPLETED});
      setShowReviewModal(true);
  };

  const handleReviewSubmit = () => {
      setShowReviewModal(false);
      setTask(null); // Reset flow
      setProviders([]);
      setUserInput('');
      setSelectedDate(null);
      showToast("Thank you for your review!");
  };

  const handleFeedClick = () => {
      setCurrentView('JOBS');
      showToast("Viewing Community Jobs");
  };

  // --- Views ---

  return (
    <div className="h-screen w-full overflow-hidden flex flex-col bg-white font-sans text-gray-900">
      
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-black/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-2xl z-[100] animate-in slide-in-from-top-5 fade-in font-bold text-sm flex items-center gap-2 border border-white/20">
            <ShieldCheck size={16} className="text-emerald-400" />
            {toastMessage}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 relative overflow-hidden">
        
        {currentView === 'CRM' && (
            <div className="h-full overflow-y-auto bg-gray-50 no-scrollbar">
                <CRMSystem activeTasks={task ? [task] : []} quotes={task?.quote ? [task.quote] : []} />
            </div>
        )}
        
        {currentView === 'JOBS' && (
            <div className="h-full bg-gray-50 pt-6 no-scrollbar">
                <JobBoard 
                    jobs={availableJobs} 
                    onAccept={(j) => {
                        setAvailableJobs(prev => prev.filter(x => x.id !== j.id));
                        showToast("Job Accepted!");
                    }} 
                    onBid={(j, amt) => showToast(amt === 0 ? "You are amazing! Thanks for Volunteering!" : `Bid $${amt} Sent!`)} 
                />
            </div>
        )}

        {currentView === 'PROFILE' && (
            <div className="h-full flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                    <h2 className="text-xl font-bold">My Profile</h2>
                    <p className="text-gray-500">Coming Soon in MVP v2</p>
                </div>
            </div>
        )}

        {currentView === 'USER' && (
            <>
                {/* Search / Top Bar */}
                <div className="absolute top-0 left-0 w-full z-40 p-4 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-lg p-3 pointer-events-auto max-w-xl mx-auto border border-gray-100 flex items-center gap-3 transition-all hover:shadow-xl relative z-50">
                        {task ? (
                            <>
                                <button onClick={() => { setTask(null); setUserInput(''); }} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200"><X size={18}/></button>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-bold text-sm truncate">{task.description}</h2>
                                    <p className="text-xs text-emerald-600 font-medium truncate">
                                        {task.status === TaskStatus.AWAITING_BIDS ? 'Waiting for Bids...' : `${task.status} • ${task.selectedProviderId ? 'Provider Selected' : 'Searching...'}`}
                                    </p>
                                    {task.dueDate && <p className="text-[10px] text-gray-400">Due: {task.dueDate.toLocaleDateString()}</p>}
                                </div>
                                {task.status === TaskStatus.IN_PROGRESS && (
                                    <button onClick={() => setShowQuoteModal(true)} className="p-2 bg-black text-white rounded-full"><FileText size={16}/></button>
                                )}
                            </>
                        ) : (
                            <div className="flex-1 flex items-center bg-gray-100/50 rounded-xl px-3 py-2.5 group focus-within:bg-white focus-within:ring-2 ring-black/5 transition-all">
                                <Search className="text-gray-400 w-5 h-5 mr-2 group-focus-within:text-black" />
                                <input 
                                    type="text" 
                                    className="bg-transparent flex-1 outline-none text-sm placeholder:text-gray-400 text-gray-800"
                                    placeholder="Search goals (e.g. Repair pipe, Hiking)" 
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleInputSubmit()}
                                />
                                
                                {/* Date Picker Trigger */}
                                <div className="relative flex items-center justify-center mx-1">
                                    <button className={`p-2 rounded-full hover:bg-gray-200 transition ${selectedDate ? 'text-black' : 'text-gray-400'}`}>
                                        <Calendar size={20} />
                                    </button>
                                    <input 
                                        type="date" 
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                    />
                                    {selectedDate && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full"></span>
                                    )}
                                </div>

                                <button onClick={() => setIsListening(!isListening)} className={`${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400 hover:text-black'}`}><Mic size={20}/></button>
                                <button onClick={() => setArMode(true)} className="ml-2 text-blue-600 hover:scale-110 transition"><ScanLine size={20}/></button>
                            </div>
                        )}
                    </div>

                    {/* NEW: Suggestion Bar & Live Feed (Visible when no task is active) */}
                    {!task && (
                        <div className="max-w-xl mx-auto mt-2 pointer-events-auto flex flex-col gap-2 relative z-40">
                             
                             {/* Row 1: Suggestion Chips */}
                             <div className="overflow-x-auto no-scrollbar flex gap-2 pl-1 pb-1">
                                {/* Live Job Counter */}
                                <button 
                                    onClick={() => setCurrentView('JOBS')}
                                    className="flex items-center gap-1 bg-black text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg shadow-black/20 whitespace-nowrap hover:scale-105 transition border border-white/10"
                                >
                                    <Zap size={12} className="text-yellow-400 fill-yellow-400"/> {availableJobs.length} Live Jobs
                                </button>
                                
                                {SUGGESTIONS.map(s => (
                                    <button
                                        key={s.id}
                                        onClick={() => handleInputSubmit(s.query)}
                                        className="bg-white/90 backdrop-blur-md text-gray-700 px-3 py-2 rounded-full text-xs font-medium shadow-sm border border-gray-200 whitespace-nowrap hover:bg-gray-50 transition active:scale-95"
                                    >
                                        {s.label}
                                    </button>
                                ))}
                             </div>

                             {/* Row 2: Live Community Feed (Marquee) */}
                             <div 
                                className="bg-black/80 backdrop-blur-md rounded-xl p-2 overflow-hidden flex items-center shadow-lg border border-white/10 cursor-pointer hover:bg-black/90 transition"
                                onClick={handleFeedClick}
                             >
                                <div className="shrink-0 mr-3">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                </div>
                                <div className="flex-1 overflow-hidden relative h-5">
                                    <div className="absolute whitespace-nowrap animate-marquee flex gap-8">
                                        {FEED_ITEMS.map((item, i) => (
                                            <span key={item.id} className="text-xs font-medium text-white/90 inline-flex items-center gap-1">
                                                {item.text}
                                            </span>
                                        ))}
                                        {/* Duplicate for smooth loop if needed, for basic CSS animation one set is usually okay but looks better with more content */}
                                        {FEED_ITEMS.map((item, i) => (
                                            <span key={`${item.id}-dup`} className="text-xs font-medium text-white/90 inline-flex items-center gap-1">
                                                {item.text}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                {/* Map Layer */}
                <MapInterface 
                    providers={providers}
                    userLocation={{lat:0, lng:0}}
                    onSelectProvider={handleProviderSelect}
                    selectedProviderId={task?.selectedProviderId}
                    modes={task?.recommendedModes || []}
                    selectedModeId={task?.selectedModeId}
                    onSelectMode={(id) => handleSelectMode(id)}
                    isInteractive={!!task && (task.status === TaskStatus.MODE_SELECTION || task.status === TaskStatus.PROVIDER_SELECTION)}
                />

                {/* AI Controller - Positioned above BottomNav */}
                <AIAssistant task={task} status={task?.status || 'IDLE'} />

                {/* Special View: Awaiting Bids */}
                {task?.status === TaskStatus.AWAITING_BIDS && (
                    <div className="fixed inset-0 top-24 bottom-24 z-30 pointer-events-none flex flex-col justify-end">
                        <div className="mx-4 mb-4 pointer-events-auto">
                            {!task.bids || task.bids.length === 0 ? (
                                <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-white/50 text-center animate-in slide-in-from-bottom-5">
                                    <div className="relative w-16 h-16 mx-auto mb-4">
                                        <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                                        <div className="relative bg-white rounded-full p-3 shadow-sm border border-emerald-100">
                                            <Loader2 size={32} className="text-emerald-500 animate-spin" />
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">Broadcasting Request...</h3>
                                    <p className="text-sm text-gray-500">Notifying 5 qualified renovation experts in your area.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 animate-in slide-in-from-bottom-10">
                                    <div className="bg-black text-white px-4 py-2 rounded-full text-xs font-bold inline-block shadow-lg mb-1">
                                        {task.bids.length} Quotes Received
                                    </div>
                                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                        {task.bids.map((bid) => (
                                            <div key={bid.id} className="bg-white p-4 rounded-2xl shadow-xl min-w-[260px] border border-gray-100 flex flex-col">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <img src={bid.providerAvatar} alt="" className="w-10 h-10 rounded-full bg-gray-100" />
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900">{bid.providerName}</p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Award size={10} className="text-yellow-500"/> {bid.providerRating} Rating
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mb-4 flex-1">
                                                    <p className="text-xs text-gray-500 mb-1">Total Estimate</p>
                                                    <p className="text-2xl font-extrabold text-emerald-600">${(bid.total / 10000).toFixed(1)}萬</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 flex gap-1 items-center"><Clock size={10}/> 2 Months</p>
                                                </div>
                                                <button 
                                                    onClick={() => handleBidSelect(bid)}
                                                    className="w-full py-2 bg-black text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition"
                                                >
                                                    View & Accept
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* In-Progress Controls */}
                {task?.status === TaskStatus.IN_PROGRESS && (
                    <div className="fixed bottom-24 left-0 right-0 flex justify-center gap-4 z-40 px-4 animate-in slide-in-from-bottom-10 pointer-events-auto">
                        <button className="bg-white p-4 rounded-full shadow-xl text-emerald-600 hover:bg-emerald-50 transition"><Phone/></button>
                        <button className="bg-white p-4 rounded-full shadow-xl text-blue-600 hover:bg-blue-50 transition"><MessageCircle/></button>
                        <button onClick={handleCompleteTask} className="bg-black px-8 py-4 rounded-full shadow-xl text-white font-bold flex items-center gap-2 hover:scale-105 transition">
                            Complete <ArrowRight size={18} />
                        </button>
                    </div>
                )}
            </>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav currentView={currentView} onChange={setCurrentView} />

      {/* --- Modals --- */}

      {/* 1. Quote Modal */}
      {showQuoteModal && task?.quote && (
          <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
              <div className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-10">
                  <div className="p-6 bg-gray-50 border-b flex justify-between items-center">
                      <div>
                          <h3 className="text-xl font-bold">Quotation</h3>
                          <p className="text-sm text-gray-500">{task.quote.providerName}</p>
                      </div>
                      <button onClick={() => setShowQuoteModal(false)} className="bg-gray-200 p-1 rounded-full"><X size={16}/></button>
                  </div>
                  <div className="p-6 space-y-4 max-h-[50vh] overflow-y-auto">
                      {task.quote.items.map(item => (
                          <div key={item.id} className="flex justify-between items-center border-b border-dashed border-gray-200 pb-3">
                              <div>
                                  <p className="font-medium text-sm text-gray-800">{item.description}</p>
                                  <p className="text-xs text-gray-400 capitalize">{item.category} x{item.quantity}</p>
                              </div>
                              <span className="font-mono font-bold">${item.unitPrice * item.quantity}</span>
                          </div>
                      ))}
                      <div className="flex justify-between items-center pt-2 text-xl font-extrabold">
                          <span>Total</span>
                          <span className="text-emerald-600">${task.quote.total}</span>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-xl text-xs text-blue-700 flex gap-2 items-start">
                          <ShieldCheck size={16} className="shrink-0 mt-0.5" />
                          <p>Funds are held securely in Escrow until you confirm the job is done.</p>
                      </div>
                  </div>
                  <div className="p-4 bg-white border-t safe-pb">
                      {task.quote.status === 'ACCEPTED' || task.quote.status === 'PAID' ? (
                          <button disabled className="w-full py-3.5 bg-gray-100 text-gray-400 rounded-xl font-bold">Paid & Accepted</button>
                      ) : (
                          <button onClick={handleProceedToPayment} className="w-full py-3.5 bg-black text-white rounded-xl font-bold shadow-lg hover:bg-gray-800 transition">
                              Pay & Start Job
                          </button>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* 2. Payment Modal */}
      {showPaymentModal && task?.quote && (
          <PaymentModal 
            total={task.quote.total} 
            onSuccess={handlePaymentSuccess} 
            onClose={() => setShowPaymentModal(false)} 
          />
      )}

      {/* 3. Review Modal */}
      {showReviewModal && task && (
          <ReviewModal 
            providerName={task.quote?.providerName || 'Provider'} 
            onSubmit={handleReviewSubmit}
          />
      )}

      {/* 4. AR Overlay */}
      {arMode && (
          <div className="fixed inset-0 z-[70] bg-black flex flex-col items-center justify-center">
              <div className="relative w-full h-full max-w-lg">
                  <img src="https://images.unsplash.com/photo-1585338662972-7473d0859569?q=80&w=1000&auto=format&fit=crop" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-64 h-64 border-2 border-emerald-400 rounded-lg animate-pulse relative">
                          <div className="absolute top-2 left-2 bg-emerald-500 text-black text-xs px-2 py-1 font-bold rounded">AI Analysis Active</div>
                          <div className="absolute bottom-2 right-2 text-emerald-400 text-xs font-mono">Pipe_Leak_Detected (98%)</div>
                      </div>
                      <p className="mt-8 text-white font-bold drop-shadow-md">Scan the problem area...</p>
                  </div>
                  <button onClick={() => setArMode(false)} className="absolute bottom-20 left-1/2 transform -translate-x-1/2 px-8 py-3 bg-white text-black rounded-full font-bold shadow-lg">
                      Close AR
                  </button>
              </div>
          </div>
      )}

    </div>
  );
};

export default App;