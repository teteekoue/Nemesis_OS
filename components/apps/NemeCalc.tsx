
import React, { useState } from 'react';

const NemeCalc: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handleBtn = (val: string) => {
    if (display === '0') setDisplay(val);
    else setDisplay(display + val);
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const calculate = () => {
    try {
      // eslint-disable-next-line no-eval
      const result = eval(equation + display);
      setEquation(equation + display + ' =');
      setDisplay(result.toString());
    } catch {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
  };

  return (
    <div className="h-full flex flex-col bg-[#1A1A2E]/50 p-6">
      <div className="glass neon-border-violet rounded-xl p-4 mb-4 text-right">
        <div className="text-xs text-gray-500 font-mono h-4 truncate">{equation}</div>
        <div className="text-3xl font-bold glow-text-cyan overflow-hidden">{display}</div>
      </div>
      <div className="grid grid-cols-4 gap-2 flex-1">
        {['7', '8', '9', '/'].map(btn => (
          <button key={btn} onClick={() => btn === '/' ? handleOp(btn) : handleBtn(btn)} className="calc-btn">{btn}</button>
        ))}
        {['4', '5', '6', '*'].map(btn => (
          <button key={btn} onClick={() => btn === '*' ? handleOp(btn) : handleBtn(btn)} className="calc-btn">{btn}</button>
        ))}
        {['1', '2', '3', '-'].map(btn => (
          <button key={btn} onClick={() => btn === '-' ? handleOp(btn) : handleBtn(btn)} className="calc-btn">{btn}</button>
        ))}
        {['0', '.', '=', '+'].map(btn => (
          <button 
            key={btn} 
            onClick={() => {
              if (btn === '=') calculate();
              else if (btn === '+') handleOp(btn);
              else handleBtn(btn);
            }} 
            className={`calc-btn ${btn === '=' ? 'bg-[#6C00FF] text-white hover:bg-[#8B33FF]' : ''}`}
          >
            {btn}
          </button>
        ))}
        <button onClick={clear} className="col-span-4 mt-2 p-2 bg-red-500/20 text-red-400 rounded-lg text-xs font-bold hover:bg-red-500/30 transition-all uppercase tracking-widest">
          Clear Sequence
        </button>
      </div>
      <style>{`
        .calc-btn {
          @apply bg-white/5 hover:bg-white/10 text-gray-300 font-bold rounded-lg p-3 transition-all active:scale-95;
          border: 1px solid rgba(255,255,255,0.05);
        }
      `}</style>
    </div>
  );
};

export default NemeCalc;
