
import React, { useState } from 'react';
import { User, Lock, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  onLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('NEMESIS_USER');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      onLogin();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 bg-[#0A0A0F] flex items-center justify-center overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#6C00FF] rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#00D4FF] rounded-full blur-[150px] animate-pulse delay-700" />
      </div>

      <div className="relative w-full max-w-md p-8 glass neon-border-violet rounded-2xl flex flex-col items-center space-y-8 z-10 transition-all duration-1000">
        <div className="w-24 h-24 rounded-full border-2 border-[#00D4FF] p-1 flex items-center justify-center bg-black overflow-hidden group">
          <img 
            src="https://picsum.photos/seed/nemesis/200/200" 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover group-hover:scale-110 transition-transform duration-500" 
          />
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold glow-text-cyan tracking-tighter">NEMESIS_OS</h1>
          <p className="text-gray-400 text-sm mt-1">SECURE ACCESS TERMINAL</p>
        </div>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#00D4FF] transition-colors" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white outline-none focus:border-[#00D4FF] focus:ring-1 focus:ring-[#00D4FF] transition-all"
                placeholder="Username"
                required
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-[#6C00FF] transition-colors" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-12 pr-4 text-white outline-none focus:border-[#6C00FF] focus:ring-1 focus:ring-[#6C00FF] transition-all"
                placeholder="Enter Access Key"
                autoFocus
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-[#6C00FF] hover:bg-[#8B33FF] disabled:opacity-50 text-white font-bold py-3 rounded-lg flex items-center justify-center space-x-2 transition-all group overflow-hidden relative"
          >
            {isLoggingIn ? (
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>INITIATE SEQUENCE</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
            <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </button>
        </form>

        <div className="flex justify-between w-full text-xs text-gray-500">
          <button type="button" className="hover:text-white transition-colors">FORGOT KEY?</button>
          <button type="button" className="hover:text-white transition-colors">EMERGENCY BOOT</button>
        </div>
      </div>

      <div className="absolute bottom-8 text-white/20 text-xs tracking-widest font-mono">
        &copy; 2025 NEMESIS CORE SYSTEMS v4.0.1
      </div>
    </div>
  );
};

export default LoginScreen;
