
import React from 'react';
import { APPS } from '../constants';
import { AppId, WindowState } from '../types';
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
    <div className="fixed bottom-0 left-0 right-0 h-14 glass border-t border-white/10 flex items-center px-4 z-[9999] backdrop-blur-2xl">
      <button 
        onClick={onToggleStartMenu}
        className="p-2 mr-4 rounded-lg hover:bg-[#6C00FF]/20 group transition-all duration-300"
      >
        <div className="w-8 h-8 flex items-center justify-center relative">
          <svg className="w-8 h-8 text-[#00D4FF] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <div className="absolute inset-0 bg-[#00D4FF]/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </button>

      <div className="flex-1 flex items-center space-x-2 overflow-x-auto no-scrollbar h-full">
        {/* Pinned Apps */}
        {['filenexus', 'nemodocs', 'nemeterm', 'nemeweb'].map(appId => {
          const app = APPS.find(a => a.id === appId)!;
          const activeWindow = windows.find(w => w.appId === appId);
          const isActive = activeWindow?.id === activeWindowId;
          
          return (
            <button
              key={appId}
              onClick={() => activeWindow ? onWindowClick(activeWindow.id) : onAppClick(appId as AppId)}
              className={`relative p-2 rounded-lg transition-all group ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <app.icon className={`w-6 h-6 transition-transform group-hover:scale-110`} style={{ color: app.color }} />
              {activeWindow && (
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1 rounded-full transition-all ${isActive ? 'bg-[#00D4FF] w-4' : 'bg-white/40'}`} />
              )}
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/90 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-white/10">
                {app.name}
              </div>
            </button>
          );
        })}

        {/* Separator */}
        <div className="h-6 w-px bg-white/10 mx-2" />

        {/* Other Open Apps */}
        {windows.filter(w => !['filenexus', 'nemodocs', 'nemeterm', 'nemeweb'].includes(w.appId)).map(win => {
          const app = APPS.find(a => a.id === win.appId)!;
          const isActive = win.id === activeWindowId;

          return (
            <button
              key={win.id}
              onClick={() => onWindowClick(win.id)}
              className={`relative p-2 rounded-lg transition-all group ${isActive ? 'bg-white/10' : 'hover:bg-white/5'}`}
            >
              <app.icon className="w-6 h-6" style={{ color: app.color }} />
              <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1 rounded-full transition-all ${isActive ? 'bg-[#00D4FF] w-4' : 'bg-white/40'}`} />
            </button>
          );
        })}
      </div>

      <div className="flex items-center space-x-4 pl-4 border-l border-white/10 h-full">
         <div className="flex flex-col items-end text-[10px] font-bold text-gray-400">
            <span>UPTIME: 12:45</span>
            <span className="text-[#00D4FF]">STATUS: ONLINE</span>
         </div>
         <button className="p-2 hover:bg-white/10 rounded-lg">
           <LayoutGrid className="w-5 h-5 text-gray-400 hover:text-white" />
         </button>
      </div>
    </div>
  );
};

export default Taskbar;
