
import React, { useState, useEffect, useCallback } from 'react';
import { 
  Folder, File, ChevronRight, LayoutGrid, Search, 
  Cloud, Download, Plus, Upload, MoreVertical, ShieldCheck,
  Zap, Database, CheckCircle2, AlertCircle, Loader2,
  HardDrive, Settings
} from 'lucide-react';

/** 
 * CONFIGURATION DÉVELOPPEUR (NEMESIS OS OWNER)
 * ID Client mis à jour selon la demande utilisateur
 */
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

  // Initialisation GAPI au montage
  useEffect(() => {
    const initGapi = () => {
      if (!(window as any).gapi) return;
      (window as any).gapi.load('client', async () => {
        try {
          await (window as any).gapi.client.init({
            discoveryDocs: [DISCOVERY_DOC],
          });
          
          if (accessToken) {
            (window as any).gapi.client.setToken({ access_token: accessToken });
            if (rootFolderId) setStep('BROWSER');
            else setStep('QUOTA');
          }
        } catch (err) {
          console.error('Erreur GAPI:', err);
        }
      });
    };
    initGapi();
  }, [accessToken, rootFolderId]);

  // Lancement du flux d'authentification standard Google
  const handleAuth = () => {
    setStep('AUTH');
    try {
      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: GOOGLE_CLIENT_ID,
        scope: SCOPES,
        callback: (response: any) => {
          if (response.error) {
            setStep('ERROR');
            setErrorMessage(response.error_description || 'Authentification Google échouée');
            return;
          }
          setAccessToken(response.access_token);
          localStorage.setItem('nemesis_drive_token', response.access_token);
          (window as any).gapi.client.setToken({ access_token: response.access_token });
          setStep('QUOTA');
        },
      });
      client.requestAccessToken();
    } catch (err: any) {
      setStep('ERROR');
      setErrorMessage("Erreur système : Impossible d'initialiser le module Google Identity.");
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
            description: `Dossier système Nemesis OS - Quota : ${selectedQuota}GB`
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
      setErrorMessage(err.result?.error?.message || "Échec de création de l'espace sur Drive");
    }
  };

  const fetchFiles = useCallback(async () => {
    if (!rootFolderId || step !== 'BROWSER') return;
    setIsSyncing(true);
    try {
      const response = await (window as any).gapi.client.drive.files.list({
        q: `'${rootFolderId}' in parents and trashed = false`,
        fields: 'files(id, name, mimeType, size, modifiedTime)',
      });
      setFiles(response.result.files);
    } catch (err) {
      console.error('Erreur de chargement des fichiers:', err);
    } finally {
      setIsSyncing(false);
    }
  }, [rootFolderId, step]);

  useEffect(() => {
    if (step === 'BROWSER') fetchFiles();
  }, [step, fetchFiles]);

  if (step === 'WELCOME') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 text-center bg-[#0A0A0F]">
        <div className="w-20 h-20 md:w-24 md:h-24 glass neon-border-cyan rounded-3xl flex items-center justify-center mb-6 animate-pulse">
          <Cloud className="w-10 h-10 md:w-12 md:h-12 text-[#00D4FF]" />
        </div>
        <h2 className="text-2xl md:text-3xl font-bold glow-text-cyan mb-3 tracking-tighter uppercase">Nexus_Bridge</h2>
        <p className="text-gray-400 max-w-sm md:max-w-md text-xs md:text-sm leading-relaxed mb-8">
          Liez votre compte Google Drive pour activer le stockage persistant de vos données Nemesis.
        </p>
        <button 
          onClick={handleAuth}
          className="bg-[#6C00FF] hover:bg-[#8B33FF] text-white px-6 md:px-10 py-3 md:py-4 rounded-2xl font-bold transition-all shadow-[0_0_30px_rgba(108,0,255,0.4)] flex items-center justify-center space-x-3 md:space-x-4 group"
        >
          <span className="text-sm md:text-base">CONNEXION DRIVE</span>
          <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    );
  }

  if (step === 'AUTH') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0A0A0F]">
        <Loader2 className="w-12 h-12 text-[#00D4FF] animate-spin mb-4" />
        <div className="text-xs font-mono text-[#00D4FF] tracking-[0.3em] animate-pulse">AUTHORIZING_ACCESS...</div>
      </div>
    );
  }

  if (step === 'QUOTA') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-[#0A0A0F] overflow-y-auto">
        <h2 className="text-xl md:text-2xl font-bold text-white mb-6 md:mb-8 uppercase tracking-tight">Configuration</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-xl">
          {[2, 5, 10, 50].map((size) => (
            <button 
              key={size}
              onClick={() => initializeEnclave(size)}
              className="glass p-6 md:p-8 rounded-3xl border border-white/5 hover:neon-border-violet transition-all group text-left"
            >
              <div className="flex justify-between items-center mb-2">
                <Database className="w-6 h-6 md:w-8 md:h-8 text-[#6C00FF]" />
                <span className="text-2xl md:text-3xl font-black text-white">{size}GB</span>
              </div>
              <div className="text-[9px] text-gray-500 font-bold uppercase tracking-[0.2em]">Volume Virtuel</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (step === 'INITIALIZING') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 bg-[#0A0A0F]">
        <Zap className="w-16 h-16 text-[#00D4FF] animate-pulse mb-6" />
        <h2 className="text-xl font-bold glow-text-cyan mb-2">CRÉATION_DE_L'ENCLAVE</h2>
        <p className="text-xs font-mono text-gray-500">Initialisation du secteur cloud...</p>
      </div>
    );
  }

  if (step === 'ERROR') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-4 md:p-8 bg-[#0A0A0F] text-center">
        <AlertCircle className="w-12 h-12 md:w-16 md:h-16 text-red-500 mb-6" />
        <h2 className="text-xl md:text-2xl font-bold text-white mb-2 uppercase">Échec du Protocole</h2>
        <p className="text-red-400 font-mono text-[10px] md:text-xs mb-8 max-w-md break-all">{errorMessage}</p>
        <button onClick={() => setStep('WELCOME')} className="glass px-6 py-2 rounded-lg text-xs hover:bg-white/10 transition-colors uppercase font-bold tracking-widest">
          Réinitialiser
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-[#0A0A0F] flex-col md:flex-row">
      <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/5 bg-black/40 flex flex-row md:flex-col overflow-x-auto md:overflow-x-hidden">
        <div className="p-4 md:p-6 flex md:flex-col flex-row items-center md:items-start space-x-4 md:space-x-0">
          <div className="flex items-center space-x-3 md:mb-8">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-[#6C00FF]/20 flex items-center justify-center border border-[#6C00FF]/30 shrink-0">
              <HardDrive className="w-4 h-4 md:w-5 md:h-5 text-[#6C00FF]" />
            </div>
            <div className="hidden sm:block">
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Connecté</div>
              <div className="text-xs font-bold text-white truncate">Drive_Active</div>
            </div>
          </div>
          <div className="space-y-1">
            <button className="flex items-center space-x-3 px-3 md:px-4 py-2 rounded-xl text-xs bg-[#6C00FF]/10 text-white border border-[#6C00FF]/20 whitespace-nowrap">
              <Cloud className="w-4 h-4 text-[#00D4FF]" />
              <span className="font-medium">NEMESIS_DATA</span>
            </button>
          </div>
        </div>

        <div className="p-4 md:p-6 mt-auto bg-black/20 border-t border-white/5 hidden md:block">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Utilisation</span>
                <span className="text-[11px] font-bold text-[#00D4FF]">En ligne</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#6C00FF] to-[#00D4FF] w-[5%] shadow-[0_0_8px_rgba(0,212,255,0.5)]" />
              </div>
              <div className="text-[8px] text-gray-600 font-mono text-right">Quota: {quota} GB</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="h-12 md:h-14 border-b border-white/5 flex items-center justify-between px-4 md:px-6 bg-black/20 backdrop-blur-md">
          <div className="flex items-center space-x-3 md:space-x-4 overflow-hidden">
             <button onClick={fetchFiles} className="p-1.5 md:p-2 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors shrink-0">
               <Zap className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#00D4FF]' : ''}`} />
             </button>
             <div className="h-4 w-px bg-white/10 shrink-0" />
             <div className="text-[9px] md:text-[10px] font-mono text-white tracking-widest uppercase font-bold truncate">ROOT/NEMESIS_OS_DATA</div>
          </div>
          <button 
            onClick={() => { localStorage.removeItem('nemesis_drive_token'); window.location.reload(); }} 
            className="text-[9px] md:text-[10px] text-red-500 hover:text-red-400 uppercase font-bold shrink-0 ml-2"
          >
            Sortir
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8 overflow-y-auto">
          {files.length === 0 && !isSyncing ? (
            <div className="h-full flex flex-col items-center justify-center opacity-10">
              <Folder className="w-16 h-16 md:w-20 md:h-20 mb-4" />
              <p className="text-xs md:text-sm font-mono tracking-widest uppercase text-center">Espace_Nul_Secteur_Vide</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-8">
              {files.map(file => (
                <div key={file.id} className="group flex flex-col items-center p-3 md:p-4 rounded-2xl hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-default overflow-hidden">
                  <div className="w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shrink-0">
                    {file.mimeType.includes('folder') ? <Folder className="w-10 h-10 md:w-12 md:h-12 text-[#6C00FF]" /> : <File className="w-10 h-10 md:w-12 md:h-12 text-[#00D4FF]" />}
                  </div>
                  <span className="text-[10px] md:text-[11px] text-center text-gray-300 group-hover:text-white truncate w-full px-1 font-medium">{file.name}</span>
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
