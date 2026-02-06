
import React, { useState } from 'react';
import { Bold, Italic, List, Heading, Save, Download, FileText, Layout, Eye } from 'lucide-react';

const NemeDocs: React.FC = () => {
  const [content, setContent] = useState('# MISSION_OBJECTIVE\n\n- [x] Secure neural bridge\n- [ ] Decrypt core archives\n- [ ] Initiate system purge\n\n> The future belongs to those who control the code.');
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#1A1A2E]/30">
      {/* Toolbar */}
      <div className="h-10 border-b border-white/5 flex items-center px-4 bg-black/40 space-x-4">
        <div className="flex items-center space-x-1">
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><Bold className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><Italic className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><Heading className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors"><List className="w-4 h-4" /></button>
        </div>
        <div className="h-4 w-px bg-white/10" />
        <div className="flex items-center space-x-2">
           <button 
             onClick={() => setIsPreview(!isPreview)}
             className={`flex items-center space-x-2 px-2 py-1 rounded text-xs transition-colors ${
               isPreview ? 'bg-[#00D4FF]/20 text-[#00D4FF]' : 'text-gray-400 hover:bg-white/5'
             }`}
           >
              {isPreview ? <Layout className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span>{isPreview ? 'EDIT_MODE' : 'PREVIEW_MODE'}</span>
           </button>
        </div>
        <div className="ml-auto flex items-center space-x-2">
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-400 hover:text-white transition-colors">
            <Save className="w-3.5 h-3.5" />
            <span>SYNC_NODE</span>
          </button>
          <button className="flex items-center space-x-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#6C00FF] hover:bg-[#8B33FF] text-white transition-colors shadow-[0_0_10px_rgba(108,0,255,0.3)]">
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT_DATA</span>
          </button>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="flex-1 flex overflow-hidden">
        {!isPreview ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="flex-1 bg-transparent p-8 outline-none resize-none text-gray-300 font-mono text-sm leading-relaxed"
            placeholder="Initialize node content..."
            spellCheck={false}
          />
        ) : (
          <div className="flex-1 p-8 overflow-y-auto prose prose-invert max-w-none prose-sm">
             <div className="space-y-4">
                {content.split('\n').map((line, i) => {
                  if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-bold text-[#00D4FF] border-b border-[#00D4FF]/20 pb-2">{line.replace('# ', '')}</h1>;
                  if (line.startsWith('- ')) return <div key={i} className="flex items-center space-x-2 text-gray-300 ml-4"><span className="w-1.5 h-1.5 rounded-full bg-[#6C00FF]" /><span>{line.replace('- ', '')}</span></div>;
                  if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-[#6C00FF] pl-4 italic text-gray-400 my-4">{line.replace('> ', '')}</blockquote>;
                  return <p key={i} className="text-gray-300 leading-relaxed">{line}</p>;
                })}
             </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="h-6 bg-black/40 border-t border-white/5 px-4 flex items-center justify-between text-[10px] text-gray-500 font-mono">
         <div className="flex items-center space-x-4">
            <span>WORDS: {content.split(/\s+/).filter(x => x.length > 0).length}</span>
            <span>CHARS: {content.length}</span>
         </div>
         <div className="flex items-center space-x-2">
            <span className="text-[#00D4FF]">ENCRYPTION: AES-256</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
         </div>
      </div>
    </div>
  );
};

export default NemeDocs;
