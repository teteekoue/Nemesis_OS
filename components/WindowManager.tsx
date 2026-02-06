
import React, { useState, useRef, useEffect } from 'react';
import { WindowState } from '../types.ts';
import { X, Minus, Square } from 'lucide-react';
import { APPS } from '../constants.tsx';

// App specific components
import FileNexus from './apps/FileNexus.tsx';
import NemeDocs from './apps/NemeDocs.tsx';
import NemeTerm from './apps/NemeTerm.tsx';
import NemeCalc from './apps/NemeCalc.tsx';

interface WindowManagerProps {
  windows: WindowState[];
  activeWindowId: string | null;
  onClose: (id: string) => void;
  onFocus: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateSize: (id: string, width: number, height: number) => void;
}

const WindowManager: React.FC<WindowManagerProps> = ({
  windows,
  activeWindowId,
  onClose,
  onFocus,
  onMinimize,
  onMaximize,
  onUpdatePosition,
  onUpdateSize
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {windows.map((win) => (
        <Window 
          key={win.id} 
          window={win} 
          isActive={activeWindowId === win.id}
          onClose={() => onClose(win.id)}
          onFocus={() => onFocus(win.id)}
          onMinimize={() => onMinimize(win.id)}
          onMaximize={() => onMaximize(win.id)}
          onUpdatePosition={(x, y) => onUpdatePosition(win.id, x, y)}
          onUpdateSize={(w, h) => onUpdateSize(win.id, w, h)}
        />
      ))}
    </div>
  );
};

interface WindowProps {
  window: WindowState;
  isActive: boolean;
  onClose: () => void;
  onFocus: () => void;
  onMinimize: () => void;
  onMaximize: () => void;
  onUpdatePosition: (x: number, y: number) => void;
  onUpdateSize: (w: number, h: number) => void;
}

const Window: React.FC<WindowProps> = ({ 
  window, 
  isActive, 
  onClose, 
  onFocus, 
  onMinimize, 
  onMaximize,
  onUpdatePosition,
  onUpdateSize
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const windowRef = useRef<HTMLDivElement>(null);

  const appMetadata = APPS.find(a => a.id === window.appId);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !window.isMaximized) {
        // Constraints to keep window within viewport
        const newX = Math.max(-window.width + 100, Math.min(window.innerWidth - 100, e.clientX - dragOffset.x));
        const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));
        onUpdatePosition(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset, window.isMaximized, window.width, onUpdatePosition]);

  const handleMouseDown = (e: React.MouseEvent) => {
    onFocus();
    if ((e.target as HTMLElement).closest('.window-titlebar')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - window.x,
        y: e.clientY - window.y
      });
    }
  };

  if (window.isMinimized) return null;

  const style: React.CSSProperties = window.isMaximized 
    ? { top: 0, left: 0, width: '100%', height: 'calc(100% - 3.5rem)', zIndex: window.zIndex }
    : { top: window.y, left: window.x, width: window.width, height: window.height, zIndex: window.zIndex };

  const renderContent = () => {
    if (!appMetadata) return null;
    switch(window.appId) {
      case 'filenexus': return <FileNexus />;
      case 'nemodocs': return <NemeDocs />;
      case 'nemeterm': return <NemeTerm />;
      case 'nemecalc': return <NemeCalc />;
      default: return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-black/20">
          <appMetadata.icon className="w-16 h-16 mb-4 opacity-20" style={{ color: appMetadata.color }} />
          <h2 className="text-xl font-bold text-white/40 uppercase tracking-widest">{appMetadata.name}</h2>
          <p className="text-xs text-gray-600 mt-2 font-mono">ENCRYPTED_MODULE_LOAD_PENDING</p>
        </div>
      );
    }
  };

  return (
    <div
      ref={windowRef}
      onMouseDown={handleMouseDown}
      style={style}
      className={`absolute glass rounded-xl flex flex-col pointer-events-auto overflow-hidden border transition-shadow duration-300 ${
        isActive ? 'neon-border-cyan ring-1 ring-[#00D4FF]/20 shadow-[0_0_40px_rgba(0,212,255,0.15)]' : 'border-white/10 opacity-95 shadow-xl'
      } ${window.isMaximized ? 'rounded-none border-x-0 border-t-0' : ''}`}
    >
      {/* Titlebar */}
      <div className="window-titlebar h-10 bg-black/60 flex items-center justify-between px-3 cursor-default select-none border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center space-x-2 overflow-hidden">
          {appMetadata && <appMetadata.icon className="w-4 h-4 shrink-0" style={{ color: appMetadata.color }} />}
          <span className={`text-[10px] font-black tracking-widest uppercase truncate ${isActive ? 'glow-text-cyan text-[#00D4FF]' : 'text-gray-500'}`}>
            {window.title}
          </span>
        </div>
        <div className="flex items-center space-x-1 shrink-0">
          <button onClick={(e) => { e.stopPropagation(); onMinimize(); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
            <Minus className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onMaximize(); }} className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-gray-500 hover:text-white">
            <Square className="w-3.5 h-3.5" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-1.5 hover:bg-red-500/80 rounded-lg transition-colors text-gray-500 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {renderContent()}
      </div>

      {/* Resize Handle - Improved for mobile/tablet */}
      {!window.isMaximized && (
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize z-50 flex items-end justify-end p-0.5"
          onMouseDown={(e) => {
            e.preventDefault();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = window.width;
            const startHeight = window.height;

            const handleResize = (moveEvent: MouseEvent) => {
              const newW = Math.max(300, Math.min(window.innerWidth - window.x, startWidth + (moveEvent.clientX - startX)));
              const newH = Math.max(200, Math.min(window.innerHeight - window.y - 60, startHeight + (moveEvent.clientY - startY)));
              onUpdateSize(newW, newH);
            };

            const stopResize = () => {
              window.removeEventListener('mousemove', handleResize);
              window.removeEventListener('mouseup', stopResize);
            };

            window.addEventListener('mousemove', handleResize);
            window.addEventListener('mouseup', stopResize);
          }}
        >
           <div className="w-2 h-2 border-r-2 border-b-2 border-white/20 rounded-br-sm" />
        </div>
      )}
    </div>
  );
};

export default WindowManager;
