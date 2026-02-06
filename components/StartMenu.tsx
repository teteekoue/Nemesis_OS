
import React, { useState } from 'react';
import { Search, Power, LogOut, Settings, User } from 'lucide-react';
import { APPS } from '../constants';
import { AppId } from '../types';

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
      className="fixed bottom-16 left-4 w-96 h-[500px] glass neon-border-violet rounded-2xl z-[10000] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300 shadow-2xl"
    >
      {/* Header with Search */}
      <div className="p-6 bg-white/5 border-b border-white/10">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#00D4FF]" />
          <input
            autoFocus
            type="text"
            placeholder="Search terminal..."
            className="w-full bg-black/40 border border-white/10 rounded-lg py-2.5 pl-11 pr-4 text-sm text-white outline-none focus:border-[#00D4FF] transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Apps Grid */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">Pinned Applications</h3>
        <div className="grid grid-cols-3 gap-2">
          {filteredApps.map(app => (
            <button
              key={app.id}
              onClick={() => onOpenApp(app.id)}
              className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-white/10 transition-all group"
            >
              <div className="w-12 h-12 rounded-lg bg-black/40 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <app.icon className="w-6 h-6" style={{ color: app.color }} />
              </div>
              <span className="text-[10px] text-center text-white/70 group-hover:text-white truncate w-full">
                {app.name}
              </span>
            </button>
          ))}
        </div>

        {/* Recent Items / Help Section */}
        <div className="mt-8 px-2">
          <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">System Utilities</h3>
          <div className="space-y-1">
             <button className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-white/5 text-xs text-gray-300 hover:text-white transition-colors">
                <Settings className="w-4 h-4 text-[#94A3B8]" />
                <span>Console Configurator</span>
             </button>
             <button className="w-full flex items-center space-x-3 p-2.5 rounded-lg hover:bg-white/5 text-xs text-gray-300 hover:text-white transition-colors">
                <User className="w-4 h-4 text-[#00D4FF]" />
                <span>Security Permissions</span>
             </button>
          </div>
        </div>
      </div>

      {/* Footer Profile & Power */}
      <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-between">
        <div className="flex items-center space-x-3 px-2 group cursor-pointer">
          <img 
            src="https://picsum.photos/seed/nemesis/40/40" 
            alt="Profile" 
            className="w-8 h-8 rounded-full border border-[#00D4FF]/30 group-hover:border-[#00D4FF]" 
          />
          <div className="flex flex-col text-left">
            <span className="text-xs font-bold text-white group-hover:glow-text-cyan">NEMESIS_USER</span>
            <span className="text-[10px] text-gray-500">ROOT_ACCESS</span>
          </div>
        </div>
        <div className="flex space-x-1">
          <button 
            onClick={onLogout}
            className="p-2.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-[#6C00FF] transition-all"
            title="Log Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
          <button 
            className="p-2.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-red-500 transition-all"
            title="Shut Down"
          >
            <Power className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default StartMenu;
