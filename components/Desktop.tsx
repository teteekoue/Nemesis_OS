
import React, { useState, useEffect } from 'react';
import { APPS } from '../constants.tsx';
import { AppId, WindowState } from '../types.ts';
import { Clock, Cloud, Cpu, HardDrive } from 'lucide-react';

interface DesktopProps {
  onOpenApp: (id: AppId) => void;
  windows: WindowState[];
}

const Desktop: React.FC<DesktopProps> = ({ onOpenApp, windows }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 p-4 md:p-6 lg:p-8 flex flex-col pointer-events-none overflow-hidden">
      {/* Dynamic Grid for Apps - Refined for responsiveness */}
      <div className="flex-1 flex flex-col flex-wrap content-start gap-2 md:gap-4 max-h-full overflow-hidden">
        {APPS.filter(app => ['filenexus', 'nemodocs', 'nemeterm', 'nemesettings', 'nemeweb'].includes(app.id)).map((app) => (
          <button
            key={app.id}
            onClick={() => onOpenApp(app.id)}
            className="flex flex-col items-center justify-center p-2 rounded-xl hover:bg-white/10 transition-all pointer-events-auto group w-[80px] md:w-[100px] shrink-0"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 glass neon-border-cyan rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0 shadow-lg">
              <app.icon className="w-6 h-6 md:w-8 md:h-8" style={{ color: app.color }} />
            </div>
            <span className="text-[10px] md:text-xs text-center text-white/90 truncate w-full shadow-black drop-shadow-md font-bold tracking-tight">
              {app.name}
            </span>
          </button>
        ))}
      </div>

      {/* Widgets Area - Hidden on small screens to prevent overflow */}
      <div className="fixed top-4 right-4 md:top-8 md:right-8 space-y-4 pointer-events-none hidden lg:block w-64 xl:w-72">
        {/* Clock Widget */}
        <div className="glass p-4 xl:p-6 rounded-2xl neon-border-violet pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-3 mb-1">
            <Clock className="w-4 h-4 text-[#6C00FF]" />
            <span className="text-[10px] font-bold text-white/40 tracking-widest">SYSTEM_TIME</span>
          </div>
          <div className="text-3xl xl:text-4xl font-bold glow-text-violet">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-xs xl:text-sm text-gray-400 font-medium truncate uppercase tracking-tighter">
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Status Widget */}
        <div className="glass p-4 xl:p-6 rounded-2xl neon-border-cyan pointer-events-auto shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="w-4 h-4 text-[#00D4FF]" />
            <span className="text-[10px] font-bold text-white/40 tracking-widest">CORE_STABILITY</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xl xl:text-2xl font-bold">OPTIMIZED</span>
            <span className="text-[10px] text-gray-400 font-mono">NODE_01</span>
          </div>
          <div className="space-y-4 mt-6">
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-400">
                <span><Cpu className="w-3 h-3 inline mr-1" /> CPU_LOAD</span>
                <span>28%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00D4FF] w-[28%] shadow-[0_0_8px_#00D4FF]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] font-bold text-gray-400">
                <span><HardDrive className="w-3 h-3 inline mr-1" /> DISK_LINK</span>
                <span>ACTIVE</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#6C00FF] w-[100%] shadow-[0_0_8px_#6C00FF]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
