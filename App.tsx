
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen.tsx';
import Desktop from './components/Desktop.tsx';
import Taskbar from './components/Taskbar.tsx';
import StartMenu from './components/StartMenu.tsx';
import WindowManager from './components/WindowManager.tsx';
import NotificationCenter from './components/NotificationCenter.tsx';
import { WindowState, AppId, Notification } from './types.ts';
import { APPS } from './constants.tsx';

const App: React.FC = () => {
  const [isBooting, setIsBooting] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wallpaper, setWallpaper] = useState('https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1920');

  useEffect(() => {
    const timer = setTimeout(() => setIsBooting(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const addNotification = useCallback((title: string, message: string, type: Notification['type'] = 'system') => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotifications(prev => [{ id, title, message, type, timestamp: Date.now() }, ...prev].slice(0, 10));
    
    // Auto remove notification after 5s
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  }, []);

  const openApp = useCallback((appId: AppId) => {
    const app = APPS.find(a => a.id === appId);
    if (!app) return;

    // Check if app already has a window
    const existingWindow = windows.find(w => w.appId === appId);
    if (existingWindow) {
      if (existingWindow.isMinimized) {
        setWindows(prev => prev.map(w => w.id === existingWindow.id ? { ...w, isMinimized: false } : w));
      }
      setActiveWindowId(existingWindow.id);
      setIsStartMenuOpen(false);
      return;
    }

    const newWindow: WindowState = {
      id: Math.random().toString(36).substr(2, 9),
      appId,
      title: app.name,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: windows.length + 10,
      x: 100 + (windows.length * 40),
      y: 100 + (windows.length * 40),
      width: 800,
      height: 600
    };

    setWindows(prev => [...prev, newWindow]);
    setActiveWindowId(newWindow.id);
    setIsStartMenuOpen(false);
  }, [windows]);

  const closeWindow = useCallback((id: string) => {
    setWindows(prev => prev.filter(w => w.id !== id));
    if (activeWindowId === id) setActiveWindowId(null);
  }, [activeWindowId]);

  const focusWindow = useCallback((id: string) => {
    setActiveWindowId(id);
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 10);
      return prev.map(w => w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w);
    });
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMinimized: true } : w));
    setActiveWindowId(null);
  }, []);

  const toggleMaximizeWindow = useCallback((id: string) => {
    setWindows(prev => prev.map(w => w.id === id ? { ...w, isMaximized: !w.isMaximized } : w));
  }, []);

  if (isBooting) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0F] flex flex-col items-center justify-center space-y-8">
        <div className="w-24 h-24 border-4 border-[#6C00FF] rounded-lg animate-pulse flex items-center justify-center">
           <svg className="w-16 h-16 text-[#00D4FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
             <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
           </svg>
        </div>
        <div className="text-xl font-bold tracking-widest text-[#00D4FF] animate-pulse">NEMESIS OS INITIALIZING...</div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="h-screen w-screen overflow-hidden relative" style={{ 
      backgroundImage: `url(${wallpaper})`, 
      backgroundSize: 'cover', 
      backgroundPosition: 'center' 
    }}>
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      {/* Main Desktop Area */}
      <Desktop onOpenApp={openApp} windows={windows} />

      {/* Dynamic Window Layer */}
      <WindowManager 
        windows={windows} 
        activeWindowId={activeWindowId}
        onClose={closeWindow}
        onFocus={focusWindow}
        onMinimize={minimizeWindow}
        onMaximize={toggleMaximizeWindow}
        onUpdatePosition={(id, x, y) => setWindows(prev => prev.map(w => w.id === id ? { ...w, x, y } : w))}
        onUpdateSize={(id, width, height) => setWindows(prev => prev.map(w => w.id === id ? { ...w, width, height } : w))}
      />

      {/* UI Overlays */}
      <NotificationCenter notifications={notifications} />
      
      {isStartMenuOpen && (
        <StartMenu 
          onClose={() => setIsStartMenuOpen(false)} 
          onOpenApp={openApp} 
          onLogout={() => setIsLoggedIn(false)}
        />
      )}

      {/* Persistent Taskbar */}
      <Taskbar 
        windows={windows} 
        activeWindowId={activeWindowId} 
        onToggleStartMenu={() => setIsStartMenuOpen(!isStartMenuOpen)} 
        onAppClick={(appId) => openApp(appId)}
        onWindowClick={(id) => focusWindow(id)}
      />
    </div>
  );
};

export default App;
