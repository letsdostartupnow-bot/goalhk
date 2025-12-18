
import React, { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Smartphone, ShieldCheck, Loader2 } from 'lucide-react';

interface PaymentModalProps {
  total: number;
  onSuccess: () => void;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ total, onSuccess, onClose }) => {
  const [step, setStep] = useState<'SELECT' | 'PROCESSING' | 'SUCCESS'>('SELECT');

  useEffect(() => {
      if (step === 'PROCESSING') {
          setTimeout(() => setStep('SUCCESS'), 2000);
      }
      if (step === 'SUCCESS') {
          setTimeout(onSuccess, 1500);
      }
  }, [step, onSuccess]);

  return (
    <div className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
        
        {step === 'SELECT' && (
            <>
                <div className="p-6 text-center">
                    <h3 className="text-2xl font-bold mb-1">支付確認</h3>
                    <p className="text-gray-500 text-sm">Escrow 託管保護中</p>
                    <div className="my-6">
                        <span className="text-4xl font-extrabold text-emerald-600">${total}</span>
                    </div>
                </div>
                <div className="px-6 space-y-3 pb-6">
                    <button onClick={() => setStep('PROCESSING')} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-black transition group">
                        <div className="flex items-center gap-3">
                            <div className="bg-black text-white p-2 rounded-lg"><Smartphone size={20}/></div>
                            <span className="font-bold">Apple Pay</span>
                        </div>
                        <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:bg-black group-hover:border-black"></div>
                    </button>
                    <button onClick={() => setStep('PROCESSING')} className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-black transition group">
                        <div className="flex items-center gap-3">
                            <div className="bg-blue-600 text-white p-2 rounded-lg"><CreditCard size={20}/></div>
                            <span className="font-bold">Credit Card</span>
                        </div>
                        <div className="w-4 h-4 rounded-full border border-gray-300 group-hover:bg-black group-hover:border-black"></div>
                    </button>
                </div>
                <div className="bg-gray-50 p-4 text-center text-xs text-gray-400 flex items-center justify-center gap-2">
                    <ShieldCheck size={12}/> Payment processed securely by Stripe
                </div>
            </>
        )}

        {step === 'PROCESSING' && (
            <div className="p-12 text-center">
                <Loader2 size={48} className="animate-spin mx-auto mb-4 text-emerald-500"/>
                <h3 className="text-lg font-bold">Processing...</h3>
                <p className="text-sm text-gray-500">Securing funds in Escrow</p>
            </div>
        )}

        {step === 'SUCCESS' && (
            <div className="p-12 text-center bg-emerald-500 text-white">
                <div className="bg-white text-emerald-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg animate-bounce">
                    <CheckCircle size={32} strokeWidth={3}/>
                </div>
                <h3 className="text-2xl font-bold">付款成功!</h3>
                <p className="text-emerald-100 mt-2">師傅已收到通知，準備出發。</p>
            </div>
        )}

      </div>
    </div>
  );
};

export default PaymentModal;
