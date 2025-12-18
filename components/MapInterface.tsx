
import React from 'react';
import { Navigation, ShieldCheck, Star } from 'lucide-react';
import { Provider, ServiceMode } from '../types';

interface MapInterfaceProps {
  providers: Provider[];
  userLocation: { lat: number; lng: number };
  onSelectProvider: (provider: Provider) => void;
  selectedProviderId?: string;
  modes: ServiceMode[];
  selectedModeId?: string;
  onSelectMode: (modeId: string) => void;
  isInteractive: boolean;
}

const MapInterface: React.FC<MapInterfaceProps> = ({ 
    providers, userLocation, onSelectProvider, selectedProviderId, 
    modes, selectedModeId, onSelectMode, isInteractive 
}) => {
  
  return (
    <div className="relative w-full h-full bg-slate-100 overflow-hidden">
      
      {/* 1. Map Background (Simulated) */}
      <div className="absolute inset-0 opacity-40" 
           style={{
             backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
             backgroundSize: '24px 24px',
             backgroundColor: '#f1f5f9'
           }}>
      </div>
      
      {/* 2. Mode Selector (Uber/Amap Style) - Only visible if we have modes */}
      {isInteractive && modes.length > 0 && (
          <div className="absolute top-24 left-0 right-0 z-30 flex justify-center gap-2 px-4 overflow-x-auto no-scrollbar">
              {modes.map(mode => (
                  <button
                    key={mode.id}
                    onClick={() => onSelectMode(mode.id)}
                    className={`flex flex-col items-center p-3 rounded-xl min-w-[100px] border transition-all shadow-sm backdrop-blur-md ${
                        selectedModeId === mode.id 
                        ? 'bg-black text-white border-black scale-105 shadow-lg' 
                        : 'bg-white/80 text-gray-600 border-white hover:bg-white'
                    }`}
                  >
                      <span className="text-xs font-bold mb-1">{mode.name}</span>
                      <span className="text-[10px] opacity-80">{mode.estimatedPrice}</span>
                      <span className="text-[10px] opacity-80">{mode.estimatedTime}</span>
                  </button>
              ))}
          </div>
      )}

      {/* 3. User Location Pulse */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
        <div className="relative">
            <div className="absolute -inset-8 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            <div className="bg-blue-600 p-3 rounded-full shadow-xl border-4 border-white z-20">
                <Navigation className="text-white w-6 h-6 fill-current transform rotate-0" />
            </div>
        </div>
      </div>

      {/* 4. Providers on Map */}
      {isInteractive && providers.map((provider) => {
        // Simple visual offset logic based on index/random for demo
        // In real app, use projection
        const isSelected = selectedProviderId === provider.id;
        
        return (
          <button
            key={provider.id}
            onClick={() => onSelectProvider(provider)}
            className={`absolute z-20 transition-all duration-500 ease-out flex flex-col items-center group
                ${isSelected ? 'z-40 scale-125' : 'hover:scale-110'}
            `}
            style={{ 
                top: `calc(50% + ${provider.coordinates.lat * 4000}px)`, 
                left: `calc(50% + ${provider.coordinates.lng * 4000}px)` 
            }}
          >
            {/* Tag/Badge */}
            {provider.badges.includes('Verified') && (
                <div className="absolute -top-6 bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full flex items-center shadow-sm">
                    <ShieldCheck size={10} className="mr-1"/> 已認證
                </div>
            )}
            
            {/* Avatar Pin */}
            <div className={`p-1 rounded-full shadow-lg transition-colors duration-300 ${isSelected ? 'bg-black' : 'bg-white'}`}>
                <img src={provider.avatar} alt={provider.name} className="w-12 h-12 rounded-full object-cover border-2 border-white" />
            </div>

            {/* Price Label */}
            <div className={`mt-1 px-2 py-1 rounded text-xs font-bold shadow transition-all
                ${isSelected ? 'bg-black text-white' : 'bg-white text-gray-800 opacity-80 group-hover:opacity-100'}
            `}>
                ${provider.basePrice}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default MapInterface;
