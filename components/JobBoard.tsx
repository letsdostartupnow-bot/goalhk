import React, { useState } from 'react';
import { MapPin, Clock, DollarSign, Briefcase, Wrench, Coffee, Heart, Users, ChevronRight, Send, Check, HandHeart } from 'lucide-react';
import { JobItem } from '../types';

interface JobBoardProps {
  jobs: JobItem[];
  onAccept: (job: JobItem) => void;
  onBid: (job: JobItem, bidAmount: number) => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ jobs, onAccept, onBid }) => {
  const [biddingJobId, setBiddingJobId] = useState<string | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');

  const getIcon = (category: string) => {
    switch (category) {
      case 'HOME_REPAIR': return <Wrench className="text-orange-500" />;
      case 'SOCIAL': return <Coffee className="text-pink-500" />;
      case 'CARE': return <Heart className="text-red-500" />;
      case 'EVENT': return <Users className="text-purple-500" />;
      default: return <Briefcase className="text-blue-500" />;
    }
  };

  const handleBidSubmit = (job: JobItem) => {
    const amount = parseFloat(bidAmount);
    if (!isNaN(amount) && amount >= 0) { // Allow 0 for volunteer
      onBid(job, amount);
      setBiddingJobId(null);
      setBidAmount('');
    }
  };

  const handleVolunteer = (job: JobItem) => {
      onBid(job, 0);
  };

  return (
    <div className="h-full bg-gray-50 overflow-y-auto pb-20">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-200 px-6 py-4 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Job Board (接單大廳)</h1>
        <p className="text-sm text-gray-500">發現附近的任務機會</p>
      </div>

      <div className="max-w-3xl mx-auto p-4 space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p>暫時沒有新任務，請稍後再試。</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden">
              
              {/* Category Badge */}
              <div className="absolute top-0 right-0 bg-gray-100 px-3 py-1 rounded-bl-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
                {job.postedTime}
              </div>

              <div className="flex gap-4">
                {/* Icon Column */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                    {getIcon(job.category)}
                  </div>
                </div>

                {/* Content Column */}
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{job.description}</p>
                  
                  {/* Meta Info */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      <MapPin size={12} /> {job.location} ({job.distance})
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      <Clock size={12} /> 即時開始
                    </span>
                    <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                      User: {job.requesterName} ({job.requesterRating}★)
                    </span>
                  </div>

                  {/* Pricing & Actions */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-gray-400">預算</span>
                      <span className="text-xl font-bold text-emerald-600">${job.budget}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 justify-end">
                      {job.isBiddingAllowed ? (
                        biddingJobId === job.id ? (
                          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-5">
                            <input 
                              type="number" 
                              className="w-24 px-2 py-2 border rounded-lg text-sm outline-none focus:ring-2 ring-emerald-500"
                              placeholder="$ 報價"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              autoFocus
                            />
                            <button 
                              onClick={() => handleBidSubmit(job)}
                              className="bg-emerald-600 text-white p-2 rounded-lg hover:bg-emerald-700"
                            >
                              <Send size={16} />
                            </button>
                            <button 
                              onClick={() => setBiddingJobId(null)}
                              className="text-gray-400 p-2 hover:text-gray-600"
                            >
                              <Check size={16} className="rotate-45" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                                onClick={() => handleVolunteer(job)}
                                className="px-3 py-2 text-xs font-bold text-pink-600 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors flex items-center gap-1"
                            >
                                <HandHeart size={14} /> Help Free
                            </button>
                            <button 
                                onClick={() => { setBiddingJobId(job.id); setBidAmount(job.budget.toString()); }}
                                className="px-4 py-2 text-sm font-bold text-emerald-600 bg-emerald-50 rounded-xl hover:bg-emerald-100 transition-colors"
                            >
                                報價
                            </button>
                          </>
                        )
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center bg-gray-100 px-2 rounded">一口價</span>
                      )}

                      {biddingJobId !== job.id && (
                        <button 
                          onClick={() => onAccept(job)}
                          className="px-5 py-2 text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 shadow-sm transition-transform active:scale-95 flex items-center gap-2"
                        >
                          接單 <ChevronRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default JobBoard;