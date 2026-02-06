import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProjectData, BasicInfo, ValueProposition, CustomerSegments, Channels, Economics, Team, Resources, Competition, Risks, Growth } from "@/types/project";
import { initialProjectData } from "@/types/project";

interface ProjectStore {
  projectData: ProjectData;
  currentStep: number;
  
  setCurrentStep: (step: number) => void;
  setProjectData: (data: ProjectData) => void;
  updateBasicInfo: (data: Partial<BasicInfo>) => void;
  updateValueProposition: (data: Partial<ValueProposition>) => void;
  updateCustomerSegments: (data: Partial<CustomerSegments>) => void;
  updateChannels: (data: Partial<Channels>) => void;
  updateEconomics: (data: Partial<Economics>) => void;
  updateTeam: (data: Partial<Team>) => void;
  updateResources: (data: Partial<Resources>) => void;
  updateCompetition: (data: Partial<Competition>) => void;
  updateRisks: (data: Partial<Risks>) => void;
  updateGrowth: (data: Partial<Growth>) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projectData: initialProjectData,
      currentStep: 1,

      setCurrentStep: (step) => set({ currentStep: step }),

      setProjectData: (data) => set({ projectData: data }),

      updateBasicInfo: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            basicInfo: {
              ...state.projectData.basicInfo,
              ...data,
            },
          },
        })),

      updateValueProposition: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            valueProposition: {
              ...state.projectData.valueProposition,
              ...data,
            },
          },
        })),

      updateCustomerSegments: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            customerSegments: {
              ...state.projectData.customerSegments,
              ...data,
            },
          },
        })),

      updateChannels: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            channels: {
              ...state.projectData.channels,
              ...data,
            },
          },
        })),

      updateEconomics: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            economics: {
              ...state.projectData.economics,
              ...data,
            },
          },
        })),

      updateTeam: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            team: {
              ...state.projectData.team,
              ...data,
            },
          },
        })),

      updateResources: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            resources: {
              ...state.projectData.resources,
              ...data,
            },
          },
        })),

      updateCompetition: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            competition: {
              ...state.projectData.competition,
              ...data,
            },
          },
        })),

      updateRisks: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            risks: {
              ...state.projectData.risks,
              ...data,
            },
          },
        })),

      updateGrowth: (data) =>
        set((state) => ({
          projectData: {
            ...state.projectData,
            growth: {
              ...state.projectData.growth,
              ...data,
            },
          },
        })),

      resetProject: () =>
        set({
          projectData: initialProjectData,
          currentStep: 1,
        }),
    }),
    {
      name: "project-storage",
    }
  )
);
