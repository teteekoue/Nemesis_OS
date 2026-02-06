
import React from 'react';
import { 
  Folder, 
  FileText, 
  Table, 
  Presentation, 
  Music, 
  Calculator, 
  Calendar, 
  StickyNote, 
  Terminal, 
  Settings, 
  Globe,
  LucideIcon
} from 'lucide-react';
import { AppId } from './types';

export interface AppMetadata {
  id: AppId;
  name: string;
  icon: LucideIcon;
  color: string;
  description: string;
}

export const APPS: AppMetadata[] = [
  { id: 'filenexus', name: 'FileNexus', icon: Folder, color: '#00D4FF', description: 'Advanced file manager' },
  { id: 'nemodocs', name: 'NemeDocs', icon: FileText, color: '#6C00FF', description: 'Markdown word processor' },
  { id: 'nemesheets', name: 'NemeSheets', icon: Table, color: '#4ADE80', description: 'Smart spreadsheet' },
  { id: 'nemeslides', name: 'NemeSlides', icon: Presentation, color: '#FACC15', description: 'Presentation builder' },
  { id: 'nemeplayer', name: 'NemePlayer', icon: Music, color: '#F472B6', description: 'Neon media player' },
  { id: 'nemecalc', name: 'NemeCalc', icon: Calculator, color: '#A78BFA', description: 'Scientific calculator' },
  { id: 'nemecalendar', name: 'NemeCalendar', icon: Calendar, color: '#FB7185', description: 'Interactive calendar' },
  { id: 'nemenotes', name: 'NemeNotes', icon: StickyNote, color: '#FDE047', description: 'Quick notes' },
  { id: 'nemeterm', name: 'NemeTerm', icon: Terminal, color: '#FFFFFF', description: 'Cyberpunk terminal' },
  { id: 'nemeweb', name: 'NemeWeb', icon: Globe, color: '#60A5FA', description: 'Secure browser' },
  { id: 'nemesettings', name: 'Settings', icon: Settings, color: '#94A3B8', description: 'System configuration' },
];

export const WALLPAPERS = [
  'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1635776062127-d379bfcba9f8?auto=format&fit=crop&q=80&w=1920',
  'https://images.unsplash.com/photo-1605142859862-978be7eba909?auto=format&fit=crop&q=80&w=1920',
];
