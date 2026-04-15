import { create } from 'zustand';
import { VersionsByAudience, ProjectVersionWithAudience } from '@/lib/utils/getVersions';

interface VersionsStore {
  versions: VersionsByAudience;
  version: number;
  audienceType: 'venture' | 'bank' | 'corporate';
  currentProject: ProjectVersionWithAudience | null;
  setVersions: (versions: VersionsByAudience) => void;
  setVersion: (version: number) => void;
  setAudienceType: (audienceType: 'venture' | 'bank' | 'corporate') => void;
}

export const useVersionsStore = create<VersionsStore>((set, get) => ({
  versions: {},
  version: 1,
  audienceType: 'venture',
  currentProject: null,
  
  setVersion: (version: number) => {
    set({ version });
    
    // Обновляем currentProject при смене версии
    const { audienceType, versions } = get();
    const newCurrentProject = versions[version]?.[audienceType];
    if (newCurrentProject) {
      set({ currentProject: newCurrentProject });
    }
  },
  
  setAudienceType: (audienceType: 'venture' | 'bank' | 'corporate') => {
    set({ audienceType });
    
    // Обновляем currentProject при смене аудитории
    const { version, versions } = get();
    const newCurrentProject = versions[version]?.[audienceType];
    if (newCurrentProject) {
      set({ currentProject: newCurrentProject });
    }
  },
  
  setVersions: (versions: VersionsByAudience) => {
    set({ versions });
    
    // Устанавливаем currentProject при загрузке версий
    const { version, audienceType } = get();
    const newCurrentProject = versions[version]?.[audienceType];
    if (newCurrentProject) {
      set({ currentProject: newCurrentProject });
    }
  },
}));
