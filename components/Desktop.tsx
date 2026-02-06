
import React, { useState, useEffect } from 'react';
import { APPS } from '../constants';
import { AppId, WindowState } from '../types';
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
    <div className="absolute inset-0 p-8 grid grid-cols-[repeat(auto-fill,100px)] grid-rows-[repeat(auto-fill,110px)] gap-4 content-start overflow-hidden pointer-events-none">
      {/* Desktop Icons */}
      {APPS.filter(app => ['filenexus', 'nemodocs', 'nemeterm', 'nemesettings', 'nemeweb'].includes(app.id)).map((app) => (
        <button
          key={app.id}
          onClick={() => onOpenApp(app.id)}
          className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-all pointer-events-auto group w-[100px]"
        >
          <div className="w-14 h-14 glass neon-border-cyan rounded-xl flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
            <app.icon className="w-8 h-8" style={{ color: app.color }} />
          </div>
          <span className="text-xs text-center text-white/90 truncate w-full shadow-black drop-shadow-md font-medium">
            {app.name}
          </span>
        </button>
      ))}

      {/* Widgets Area - Right side positioning using absolute wrapper */}
      <div className="fixed top-8 right-8 space-y-4 pointer-events-none hidden lg:block w-72">
        {/* Clock Widget */}
        <div className="glass p-6 rounded-2xl neon-border-violet pointer-events-auto">
          <div className="flex items-center space-x-3 mb-1">
            <Clock className="w-5 h-5 text-[#6C00FF]" />
            <span className="text-xs font-bold text-white/40 tracking-widest">SYSTEM_TIME</span>
          </div>
          <div className="text-4xl font-bold glow-text-violet">
            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <div className="text-sm text-gray-400 font-medium">
            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Weather/Stats Widget */}
        <div className="glass p-6 rounded-2xl neon-border-cyan pointer-events-auto">
          <div className="flex items-center space-x-3 mb-4">
            <Cloud className="w-5 h-5 text-[#00D4FF]" />
            <span className="text-xs font-bold text-white/40 tracking-widest">ENV_SYNC</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">24&deg;C</span>
            <span className="text-xs text-gray-400">NEO-TOKYO</span>
          </div>
          <div className="space-y-4 mt-6">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span><Cpu className="w-3 h-3 inline mr-1" /> CORE_LOAD</span>
                <span>42%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#00D4FF] w-[42%] shadow-[0_0_8px_#00D4FF]" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span><HardDrive className="w-3 h-3 inline mr-1" /> DATA_NODE</span>
                <span>78%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#6C00FF] w-[78%] shadow-[0_0_8px_#6C00FF]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Desktop;
