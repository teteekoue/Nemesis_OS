
import React, { useState } from 'react';
import { Search, Power, LogOut, Settings, User } from 'lucide-react';
import { APPS } from '../constants.tsx';
import { AppId } from '../types.ts';

interface StartMenuProps {
  onClose: () => void;
  onOpenApp: (id: AppId) => void;
  onLogout: () => void;
}

const StartMenu: React.FC<StartMenuProps> = ({ onClose, onOpenApp, onLogout }) => {
  const [search, setSearch] = useState('');

  const filteredApps = APPS.filter(app => 
    app.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div 
      className="fixed bottom-16 left-2 right-2 md:left-4 md:right-auto w-auto md:w-96 max-h-[calc(100vh-100px)] glass neon-border-violet rounded-2xl z-[10000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 shadow-2xl"
    >
      {/* Header with Search */}
      <div className="p-4 md:p-6 bg-white/5 border-b border-white/10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00D4FF]" />
          <input
            autoFocus
            type="text"
            placeholder="Search terminal..."
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2 md:py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#00D4FF] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
        <h3 className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 md:mb-4 px-2">Applications</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-3 gap-2">
          {filteredApps.map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center justify-center p-2 md:p-3 rounded-xl hover:bg-white/10 transition-all group"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-black/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shrink-0">
                <app.icon className="w-5 h-5 md:w-6 md:h-6" style={{ color: app.color }} />
              </div>
              <span className="text-[9px] md:text-[10px] text-center text-white/70 group-hover:text-white truncate w-full">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* System Utilities Section */}
        <div className="mt-6 md:mt-8 px-2">
          <h3 className="text-[9px] md:text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">System Utilities</h3>
          <div className="space-y-1">
             <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 text-[10px] md:text-xs text-gray-300 hover:text-white transition-colors">
                <Settings className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#94A3B8]" />
                <span>Console Configurator</span>
             </button>
             <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 text-[10px] md:text-xs text-gray-300 hover:text-white transition-colors">
                <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#00D4FF]" />
                <span>Security Permissions</span>
             </button>
          </div>
        </div>
      </div>

      {/* Footer Profile & Power */}
      <div className="p-3 md:p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3 px-2 group cursor-pointer overflow-hidden">
          <img 
            src="https://picsum.photos/seed/nemesis/40/40" 
            alt="Profile" 
            className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-[#00D4FF]/30 group-hover:border-[#00D4FF] shrink-0" 
          />
          <div className="flex flex-col text-left truncate">
            <span className="text-[10px] md:text-xs font-bold text-white group-hover:glow-text-cyan truncate">NEMESIS_USER</span>
            <span className="text-[8px] md:text-[10px] text-gray-500">ROOT_ACCESS</span>
          </div>
        </div>
        <div className="flex space-x-1 shrink-0">
          <button 
            onClick={onLogout}
            className="p-2 md:p-2.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#6C00FF] transition-all"
            title="Log Out"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
          </button>
          <button 
            className="p-2 md:p-2.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
            title="Shut Down"
          >
            <Power className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
