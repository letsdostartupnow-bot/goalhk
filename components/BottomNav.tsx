
import React from 'react';
import { Map, Briefcase, FileText, User } from 'lucide-react';

interface BottomNavProps {
  currentView: 'USER' | 'JOBS' | 'CRM' | 'PROFILE';
  onChange: (view: 'USER' | 'JOBS' | 'CRM' | 'PROFILE') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChange }) => {
  const navItems = [
    { id: 'USER', label: 'Home', icon: Map },
    { id: 'JOBS', label: 'Jobs', icon: Briefcase },
    { id: 'CRM', label: 'CRM', icon: FileText },
    { id: 'PROFILE', label: 'Me', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] pb-safe z-50">
      <div className="flex justify-around items-center h-16 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChange(item.id as any)}
              className={`flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${
                isActive ? 'text-black scale-110' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <div className={`p-1.5 rounded-full mb-0.5 ${isActive ? 'bg-gray-100' : ''}`}>
                 <Icon size={isActive ? 24 : 22} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
