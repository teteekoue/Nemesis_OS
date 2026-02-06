
import React, { useState, useRef, useEffect } from 'react';

const NemeTerm: React.FC = () => {
  const [history, setHistory] = useState<string[]>([
    'Nemesis OS [Version 4.0.1.002]',
    '(c) 2025 Nemesis Core Systems. All rights reserved.',
    '',
    'Type "help" for a list of available system commands.',
    ''
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, `> ${input}`];

    switch (cmd) {
      case 'help':
        newHistory.push('AVAILABLE COMMANDS:', '- help: List commands', '- clear: Reset terminal', '- date: System time', '- ls: List directory', '- whoami: User info', '- ping: Network test');
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'date':
        newHistory.push(new Date().toString());
        break;
      case 'ls':
        newHistory.push('Documents/', 'Downloads/', 'System/', 'kernel.sys', 'core.bin');
        break;
      case 'whoami':
        newHistory.push('NEMESIS_USER (ROOT_PRIVILEGES)', 'NODE_ID: 0x92FB-4A12');
        break;
      case 'ping':
        newHistory.push('PING nexus.core (127.0.0.1): 56 data bytes', '64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.04 ms', '64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.05 ms');
        break;
      default:
        newHistory.push(`Command not found: ${cmd}`);
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="h-full bg-black/90 p-4 font-mono text-sm overflow-y-auto selection:bg-[#6C00FF]/50 selection:text-white">
      <div className="space-y-1">
        {history.map((line, i) => (
          <div key={i} className={line.startsWith('>') ? 'text-[#00D4FF]' : 'text-gray-300'}>
            {line}
          </div>
        ))}
      </div>
      <form onSubmit={handleCommand} className="mt-2 flex items-center group">
        <span className="text-[#6C00FF] mr-2">ROOT@NEMESIS:~$</span>
        <input
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-[#00D4FF] caret-[#00D4FF]"
          spellCheck={false}
        />
      </form>
      <div ref={bottomRef} />
    </div>
  );
};

export default NemeTerm;
