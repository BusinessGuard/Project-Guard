import { create } from 'zustand';
import type { AnalizeStore, ProjectInfoStore, Analysis, ProjectVersionDB } from './useAnalizeStore.types';

export const useAnalizeStore = create<AnalizeStore>((set) => ({
  project: undefined,
  analysis: undefined,
  versions: [],
  
  setProjectInfo: (id, name, industry, stage) => set({
    project: { id, name, industry, stage },
  }),
  
  setProject: (project: ProjectInfoStore) => set({ project }),
  setAnalysisScores: (overall, readiness, blocks) => set((state) => {
    if (!state.analysis) return { analysis: undefined };
    return {
      analysis: {
        ...state.analysis,
        scores: { overall, readiness, blocks },
      },
    };
  }),
  
  setAnalysisBenchmark: (percentile, betterThan) => set((state) => {
    if (!state.analysis) return { analysis: undefined };
    return {
      analysis: {
        ...state.analysis,
        benchmark: { percentile, betterThan },
      },
    };
  }),
  
  setAnalysisConsensus: (findings) => set((state) => {
    if (!state.analysis) return { analysis: undefined };
    return {
      analysis: {
        ...state.analysis,
        consensus: { findings },
      },
    };
  }),
  
  setAnalysisExperts: (experts) => set((state) => ({
    analysis: state.analysis ? {
      ...state.analysis,
      experts,
    } : undefined,
  })),
  
  setAnalysisRecommendations: (recommendations) => set((state) => ({
    analysis: state.analysis ? {
      ...state.analysis,
      recommendations,
    } : undefined,
  })),
  
  setAnalysisGrowthPlan: (growthPlan) => set((state) => ({
    analysis: state.analysis ? {
      ...state.analysis,
      growthPlan,
    } : undefined,
  })),
  
  setAnalysisFinancialForecast: (financialForecast) => set((state) => ({
    analysis: state.analysis ? {
      ...state.analysis,
      financialForecast,
    } : undefined,
  })),
  
  setAnalysis: (analysis: Analysis) => set({ analysis }),
  
  setVersions: (versions: ProjectVersionDB[]) => set({ versions }),
  
  setAnalysisData: (data) => set((state) => {
    if (!state.analysis) return { analysis: undefined };
    return {
      analysis: {
        ...state.analysis,
        scores: {
          overall: data.overallScore,
          readiness: data.readinessStatus,
          blocks: data.blockScores,
        },
        benchmark: {
          percentile: data.benchmarkPercentile,
          betterThan: data.benchmarkBetterThan,
        },
        consensus: data.consensusFindings 
          ? { findings: data.consensusFindings }
          : state.analysis.consensus,
      },
    };
  }),
}));
