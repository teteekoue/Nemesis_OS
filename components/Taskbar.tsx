
import React from 'react';
import { APPS } from '../constants.tsx';
import { AppId, WindowState } from '../types.ts';
import { LayoutGrid } from 'lucide-react';

interface TaskbarProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onToggleStartMenu: () => void;
  onAppClick: (id: AppId) => void;
  onWindowClick: (id: string) => void;
}

const Taskbar: React.FC<TaskbarProps> = ({ 
  windows, 
  activeWindowId, 
  onToggleStartMenu, 
  onAppClick,
  onWindowClick 
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 md:h-16 glass border-t border-white/10 flex items-center px-2 md:px-4 z-[9999] backdrop-blur-3xl">
      <button 
        onClick={onToggleStartMenu}
        className="p-1.5 md:p-2.5 mr-2 md:mr-4 rounded-xl hover:bg-[#6C00FF]/20 group transition-all duration-300 shrink-0"
      >
        <div className="w-7 h-7 md:w-9 md:h-9 flex items-center justify-center relative">
          <svg className="w-full h-full text-[#00D4FF] group-hover:scale-110 transition-transform drop-shadow-[0_0_8px_rgba(0,212,255,0.5)]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div className="absolute inset-0 bg-[#00D4FF]/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <div className="flex-1 flex items-center space-x-1 md:space-x-3 overflow-x-auto no-scrollbar h-full scroll-smooth py-1">
        {/* Pinned & Running Apps */}
        {['filenexus', 'nemodocs', 'nemeterm', 'nemeweb'].map(appId => {
          const app = APPS.find(a => a.id === appId)!;
          const activeWindow = windows.find(w => w.appId === appId);
          const isActive = activeWindow?.id === activeWindowId;
          
          return (
            <button
              key={appId}
              onClick={() => activeWindow ? onWindowClick(activeWindow.id) : onAppClick(appId as AppId)}
              className={`relative p-2 md:p-3 rounded-xl transition-all group shrink-0 ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}`}
            >
              <app.icon className={`w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:scale-110`} style={{ color: app.color }} />
              {activeWindow && (
                <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all ${isActive ? 'bg-[#00D4FF] w-4 md:w-6 shadow-[0_0_8px_#00D4FF]' : 'bg-white/30 w-1'}`} />
              )}
            </button>
          );
        })}

        {/* Separator */}
        <div className="h-6 w-px bg-white/10 mx-1 shrink-0" />

        {/* Other Dynamically Opened Windows */}
        {windows.filter(w => !['filenexus', 'nemodocs', 'nemeterm', 'nemeweb'].includes(w.appId)).map(win => {
          const app = APPS.find(a => a.id === win.appId)!;
          const isActive = win.id === activeWindowId;

          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`relative p-2 md:p-3 rounded-xl transition-all group shrink-0 ${isActive ? 'bg-white/10 scale-105' : 'hover:bg-white/5'}`}
            >
              <app.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: app.color }} />
              <div className={`absolute bottom-1 left-1/2 -translate-x-1/2 h-1 rounded-full transition-all ${isActive ? 'bg-[#00D4FF] w-4 md:w-6 shadow-[0_0_8px_#00D4FF]' : 'bg-white/30 w-1'}`} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 pl-2 md:pl-4 border-l border-white/10 h-full shrink-0">
         <div className="hidden sm:flex flex-col items-end text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
            <span className="text-[#00D4FF] glow-text-cyan">SECURE_LINK</span>
            <span>OS_STABLE</span>
         </div>
         <button className="p-2 hover:bg-white/10 rounded-xl transition-colors">
           <LayoutGrid className="w-5 h-5 text-gray-400" />
         </button>
      </div>
    </div>
  );
};

export default Taskbar;
