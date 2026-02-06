
import React from 'react';
import { Notification } from '../types';
import { Bell, Info, AlertTriangle, AlertCircle, X } from 'lucide-react';

interface NotificationCenterProps {
  notifications: Notification[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
  return (
    <div className="fixed bottom-16 right-4 z-[10001] w-80 space-y-2 pointer-events-none">
      {notifications.map((n) => (
        <div 
          key={n.id}
          className="glass neon-border-violet p-4 rounded-xl flex items-start space-x-3 animate-in slide-in-from-right-8 duration-300 pointer-events-auto shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-[#6C00FF]" />
          <div className={`mt-0.5 ${
            n.type === 'error' ? 'text-red-400' :
            n.type === 'warning' ? 'text-yellow-400' :
            n.type === 'info' ? 'text-[#00D4FF]' :
            'text-[#6C00FF]'
          }`}>
            {n.type === 'error' ? <AlertCircle className="w-5 h-5" /> :
             n.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> :
             n.type === 'info' ? <Info className="w-5 h-5" /> :
             <Bell className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
             <div className="text-xs font-bold text-white mb-1 tracking-tight">{n.title}</div>
             <div className="text-[11px] text-gray-400 leading-tight">{n.message}</div>
          </div>
          <button className="text-gray-500 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default NotificationCenter;
