
export type AppId = 'filenexus' | 'nemodocs' | 'nemesheets' | 'nemeslides' | 'nemeplayer' | 'nemecalc' | 'nemecalendar' | 'nemenotes' | 'nemeterm' | 'nemesettings' | 'nemeweb';

export interface WindowState {
  id: string;
  appId: AppId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  parentId: string | null;
  icon?: string;
  createdAt: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'system' | 'info' | 'warning' | 'error';
  timestamp: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  theme: 'dark' | 'light';
  wallpaper: string;
}
