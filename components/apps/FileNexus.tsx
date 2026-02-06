
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Folder, File, Search, Cloud, Download, Plus, Upload, 
  ShieldCheck, Zap, Database, AlertCircle, Loader2,
  HardDrive, Trash2, ArrowLeft, MoreHorizontal, FileText,
  Music, Film, Image as ImageIcon
} from 'lucide-react';

const GOOGLE_CLIENT_ID = '123231941953-8h4fgrnsjt0h0c432fkjd5fqt8d5at95.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

type ConfigStep = 'WELCOME' | 'AUTH' | 'QUOTA' | 'INITIALIZING' | 'BROWSER' | 'ERROR';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: string;
  modifiedTime?: string;
}

const FileNexus: React.FC = () => {
  const [step, setStep] = useState<ConfigStep>('WELCOME');
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('nemesis_drive_token'));
  const [rootFolderId, setRootFolderId] = useState<string | null>(localStorage.getItem('nemesis_root_id'));
  const [quota, setQuota] = useState<number>(Number(localStorage.getItem('nemesis_quota')) || 2);
  const [files, setFiles] = useState<DriveFile[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [usedSpace, setUsedSpace] = useState(0); // In Bytes
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialisation GAPI
  useEffect(() => {
    const initGapi = () => {
      if (!(window as any).gapi) return;
      (window as any).gapi.load('client', async () => {
        try {
          await (window as any).gapi.client.init({ discoveryDocs: [DISCOVERY_DOC] });
          if (accessToken) {
            (window as any).gapi.client.setToken({ access_token: accessToken });
            if (rootFolderId) setStep('BROWSER');
            else setStep('QUOTA');
          }
        } catch (err) {
          console.error('GAPI Init Error:', err);
        }
      });
    };
    initGapi();
  }, [accessToken, rootFolderId]);

  const handleAuth = () => {
    setStep('AUTH');
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error) {
            setStep('ERROR');
            setErrorMessage(response.error_description || 'Auth failed');
            return;
          }
          setAccessToken(response.access_token);
          localStorage.setItem('nemesis_drive_token', response.access_token);
          (window as any).gapi.client.setToken({ access_token: response.access_token });
          setStep('QUOTA');
        },
      });
      client.requestAccessToken();
    } catch (err) {
      setStep('ERROR');
      setErrorMessage("Module Google Identity inaccessible.");
    }
  };

  const initializeEnclave = async (selectedQuota: number) => {
    setStep('INITIALIZING');
    try {
      const response = await (window as any).gapi.client.drive.files.list({
        q: "name = 'NEMESIS_OS_DATA' and mimeType = 'application/vnd.google-apps.folder' and trashed = false",
        fields: 'files(id, name)',
      });

      let folderId;
      if (response.result.files.length > 0) {
        folderId = response.result.files[0].id;
      } else {
        const createResponse = await (window as any).gapi.client.drive.files.create({
          resource: {
            name: 'NEMESIS_OS_DATA',
            mimeType: 'application/vnd.google-apps.folder',
            description: `Nemesis OS Enclave - Quota: ${selectedQuota}GB`
          },
          fields: 'id',
        });
        folderId = createResponse.result.id;
      }

      setQuota(selectedQuota);
      setRootFolderId(folderId);
      localStorage.setItem('nemesis_root_id', folderId);
      localStorage.setItem('nemesis_quota', selectedQuota.toString());
      setStep('BROWSER');
    } catch (err: any) {
      setStep('ERROR');
      setErrorMessage(err.result?.error?.message || "Cloud sector initialization failed.");
    }
  };

  const fetchFiles = useCallback(async () => {
    if (!rootFolderId || step !== 'BROWSER') return;
    setIsSyncing(true);
    try {
      const response = await (window as any).gapi.client.drive.files.list({
        q: `'${rootFolderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime)',
        orderBy: 'folder, name'
      });
      const fetchedFiles = response.result.files || [];
      setFiles(fetchedFiles);
      
      // Calculate used space
      const total = fetchedFiles.reduce((acc: number, file: any) => acc + parseInt(file.size || '0'), 0);
      setUsedSpace(total);
    } catch (err) {
      console.error('Fetch Error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [rootFolderId, step]);

  useEffect(() => {
    if (step === 'BROWSER') fetchFiles();
  }, [step, fetchFiles]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !rootFolderId) return;

    setIsUploading(true);
    try {
      const metadata = {
        name: file.name,
        parents: [rootFolderId]
      };
      
      const formData = new FormData();
      formData.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      formData.append('file', file);

      const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: new Headers({ 'Authorization': 'Bearer ' + accessToken }),
        body: formData
      });

      if (response.ok) {
        fetchFiles();
      } else {
        alert("Upload failed. Check quota or connection.");
      }
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteFile = async (id: string) => {
    if (!confirm("Voulez-vous vraiment supprimer ce fichier ?")) return;
    try {
      await (window as any).gapi.client.drive.files.delete({ fileId: id });
      fetchFiles();
    } catch (err) {
      alert("Erreur lors de la suppression.");
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('folder')) return <Folder className="w-10 h-10 text-[#6C00FF]" />;
    if (mimeType.includes('image')) return <ImageIcon className="w-10 h-10 text-pink-500" />;
    if (mimeType.includes('video')) return <Film className="w-10 h-10 text-orange-500" />;
    if (mimeType.includes('audio')) return <Music className="w-10 h-10 text-yellow-500" />;
    return <FileText className="w-10 h-10 text-[#00D4FF]" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const usagePercent = Math.min(100, (usedSpace / (quota * 1024 * 1024 * 1024)) * 100);

  if (step === 'WELCOME') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center bg-[#0A0A0F]">
        <div className="w-24 h-24 glass neon-border-cyan rounded-3xl flex items-center justify-center mb-8 animate-pulse">
          <Cloud className="w-12 h-12 text-[#00D4FF]" />
        </div>
        <h2 className="text-3xl font-bold glow-text-cyan mb-4 tracking-tighter uppercase">NEXUS_STORAGE_INIT</h2>
        <p className="text-gray-400 max-w-md text-sm leading-relaxed mb-10">
          Nemesis OS nécessite une enclave de stockage. Liez votre Drive pour créer un disque virtuel sécurisé de {quota}GB.
        </p>
        <button 
          onClick={handleAuth}
          className="bg-[#6C00FF] hover:bg-[#8B33FF] text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(108,0,255,0.4)] flex items-center space-x-4 group"
        >
          <span>MONTER LE DISQUE</span>
          <ShieldCheck className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  if (['AUTH', 'INITIALIZING'].includes(step)) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0A0A0F]">
        <Loader2 className="w-12 h-12 text-[#00D4FF] animate-spin mb-4" />
        <div className="text-xs font-mono text-[#00D4FF] tracking-[0.3em] animate-pulse">
          {step === 'AUTH' ? 'AUTHORIZING...' : 'FORMATTING_VIRTUAL_SECTORS...'}
        </div>
      </div>
    );
  }

  if (step === 'QUOTA') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0A0A0F]">
        <h2 className="text-2xl font-bold text-white mb-8 uppercase tracking-tight">Capacité du Disque Virtuel</h2>
        <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
          {[2, 5, 10, 15].map((size) => (
            <button 
              key={size}
              onClick={() => initializeEnclave(size)}
              className="glass p-8 rounded-3xl border border-white/5 hover:neon-border-violet transition-all group text-left relative overflow-hidden"
            >
              <div className="flex justify-between items-center mb-2">
                <Database className="w-8 h-8 text-[#6C00FF]" />
                <span className="text-3xl font-black text-white">{size}GB</span>
              </div>
              <div className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">Secteur Isolé</div>
              <div className="absolute inset-0 bg-white/5 translate-y-full group-hover:translate-y-0 transition-transform" />
            </button>
          ))}
        </div>
        <p className="mt-8 text-gray-600 text-[10px] font-mono uppercase">Note: Basé sur votre quota Google Drive gratuit (15GB max conseillé)</p>
      </div>
    );
  }

  if (step === 'ERROR') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0A0A0F] text-center">
        <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
        <h2 className="text-2xl font-bold text-white mb-2 uppercase">I/O_ERROR</h2>
        <p className="text-red-400 font-mono text-xs mb-8 max-w-md break-all">{errorMessage}</p>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }} className="glass px-8 py-3 rounded-xl text-xs hover:bg-white/10 transition-colors uppercase font-bold tracking-widest">
          Réinitialiser le Montage
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0A0A0F] overflow-hidden">
      {/* Sidebar Storage Stats */}
      <div className="w-64 border-r border-white/5 bg-black/40 flex flex-col shrink-0">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-[#6C00FF]/20 flex items-center justify-center border border-[#6C00FF]/30">
              <HardDrive className="w-5 h-5 text-[#6C00FF]" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Disque A:</div>
              <div className="text-xs font-bold text-white uppercase tracking-tighter">Nemesis_Cloud</div>
            </div>
          </div>
          
          <div className="space-y-6">
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs bg-[#6C00FF]/10 text-white border border-[#6C00FF]/20">
              <Cloud className="w-4 h-4 text-[#00D4FF]" />
              <span className="font-bold">ROOT/DATA</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs text-gray-500 hover:bg-white/5 transition-colors">
              <Trash2 className="w-4 h-4" />
              <span className="font-bold">CORBEILLE</span>
            </button>
          </div>
        </div>

        <div className="mt-auto p-6 bg-black/20 border-t border-white/5">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Occupation</span>
                <span className="text-[11px] font-bold text-[#00D4FF]">{usagePercent.toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#6C00FF] to-[#00D4FF] transition-all duration-1000 shadow-[0_0_8px_rgba(0,212,255,0.5)]" 
                  style={{ width: `${usagePercent}%` }}
                />
              </div>
              <div className="flex justify-between text-[8px] text-gray-600 font-mono">
                <span>{formatSize(usedSpace)}</span>
                <span>LIMITE: {quota}GB</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-14 border-b border-white/5 flex items-center justify-between px-6 bg-black/20 backdrop-blur-md">
          <div className="flex items-center space-x-4">
             <button onClick={fetchFiles} className="p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
               <Zap className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#00D4FF]' : ''}`} />
             </button>
             <div className="h-4 w-px bg-white/10" />
             <div className="text-[10px] font-mono text-white tracking-widest uppercase font-bold flex items-center space-x-2">
               <span className="text-gray-600">NEMESIS_OS:</span>
               <span>/ENCLAVE_DATA</span>
             </div>
          </div>

          <div className="flex items-center space-x-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleUpload} 
              className="hidden" 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center space-x-2 px-4 py-2 bg-[#6C00FF] hover:bg-[#8B33FF] rounded-xl text-[10px] font-black uppercase text-white transition-all disabled:opacity-50"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
              <span>{isUploading ? 'EN_COURS...' : 'IMPORTER'}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
          {files.length === 0 && !isSyncing ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Folder className="w-24 h-24 mb-4" />
              <p className="text-sm font-mono tracking-widest uppercase">Secteur_Vierge</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
              {files.map(file => (
                <div 
                  key={file.id} 
                  className="group flex flex-col items-center p-4 rounded-3xl hover:bg-white/5 border border-transparent hover:neon-border-cyan transition-all cursor-default relative overflow-hidden"
                >
                  <div className="w-20 h-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {getFileIcon(file.mimeType)}
                  </div>
                  <span className="text-[11px] text-center text-gray-300 group-hover:text-white truncate w-full px-2 font-medium mb-1">
                    {file.name}
                  </span>
                  <span className="text-[8px] text-gray-600 font-mono uppercase">
                    {file.size ? formatSize(parseInt(file.size)) : 'DOSSIER'}
                  </span>
                  
                  {/* Hover Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
                    <button 
                      onClick={() => deleteFile(file.id)}
                      className="p-1.5 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="p-1.5 bg-white/10 text-gray-400 rounded-lg hover:bg-white/20 hover:text-white transition-all"
                      title="Détails"
                    >
                      <MoreHorizontal className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileNexus;
