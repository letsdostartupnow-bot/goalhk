
import React, { useState } from 'react';
import { Star, ThumbsUp } from 'lucide-react';

interface ReviewModalProps {
  providerName: string;
  onSubmit: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ providerName, onSubmit }) => {
  const [rating, setRating] = useState(0);

  return (
    <div className="fixed inset-0 z-[90] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in">
      <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center shadow-2xl relative">
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-yellow-400 p-4 rounded-full shadow-lg border-4 border-white">
            <ThumbsUp size={32} className="text-white"/>
        </div>

        <h2 className="text-2xl font-bold mt-6 mb-2">任務完成!</h2>
        <p className="text-gray-500 mb-6">請為 <span className="font-bold text-black">{providerName}</span> 的服務評分</p>

        <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
                <button 
                    key={star} 
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110 focus:scale-125"
                >
                    <Star 
                        size={32} 
                        className={`${rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                    />
                </button>
            ))}
        </div>

        <textarea 
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 ring-black outline-none mb-6 resize-none"
            rows={3}
            placeholder="寫下您的評價 (可選)..."
        />

        <button 
            onClick={onSubmit}
            className="w-full bg-black text-white py-4 rounded-xl font-bold shadow-lg hover:bg-gray-800 transition transform active:scale-95"
        >
            提交評價
        </button>
      </div>
    </div>
  );
};

export default ReviewModal;
