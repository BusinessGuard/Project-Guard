import { create } from 'zustand';

interface ScoreboardState {
  // ScoreboardHeader states
  activeVersion: number; // Version number (1, 2, 3)
  
  // ProjectHeader states
  projectName: string;
  projectIndustry: string;
  projectStage: string;
  investorProfile: 'vc' | 'bank' | 'corporate';
  
  // ScoreCard states
  overallScore: number;

  existingVersions: Array<{ id: string; version: number; score: number; name: string; date: string }> | null;
  
  // Recommendations progress
  recommendationsProgress: Record<string, number[]>;
  
  // Mobile Sheet state
  isSheetOpen: boolean;
  
  // Actions
  setExistingVersions: (versions: Array<{ id: string; version: number; score: number; name: string; date: string }>) => void;
  setActiveVersion: (versionNumber: number) => void;
  setProjectInfo: (name: string, industry: string, stage: string) => void;
  setInvestorProfile: (profile: 'vc' | 'bank' | 'corporate') => void;
  setOverallScore: (score: number) => void;
  setRecommendationsProgress: (progress: Record<string, number[]>) => void;
  setIsSheetOpen: (isOpen: boolean) => void;
  toggleSheet: () => void;
}

export const useScoreboardState = create<ScoreboardState>((set) => ({
  // Initial state (demo values - will be replaced with real data from server)
  existingVersions: [
    {
      id: 'v1',
      version: 1,
      score: 62,
      name: 'Initial Version',
      date: '2025-12-01',
    }
  ],
  activeVersion: 1, // Default to version 1
  projectName: 'v24',
  projectIndustry: 'Healthtech',
  projectStage: 'MVP / Pre-seed',
  investorProfile: 'vc',
  overallScore: 0,
  recommendationsProgress: {},
  isSheetOpen: false,
  
  // Actions
  setExistingVersions: (versions) => set({ 
    existingVersions: versions || null, 
  }),
  
  setActiveVersion: (versionNumber) => set({ activeVersion: versionNumber }),
  
  setProjectInfo: (name, industry, stage) => set({ 
    projectName: name, 
    projectIndustry: industry, 
    projectStage: stage 
  }),
  
  setInvestorProfile: (profile) => set({ investorProfile: profile }),
  
  setOverallScore: (score) => set({ overallScore: score }),
  
  setRecommendationsProgress: (progress) => set({ recommendationsProgress: progress }),
  
  setIsSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
  
  toggleSheet: () => set((state) => ({ isSheetOpen: !state.isSheetOpen })),
}));
