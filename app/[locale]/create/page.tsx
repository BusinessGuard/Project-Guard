"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";
import { useMutation } from "@tanstack/react-query";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { Step1BasicInfo } from "./components/Step1BasicInfo";
import { Step2ValueProposition } from "./components/Step2ValueProposition";
import { Step3CustomerSegments } from "./components/Step3CustomerSegments";
import { Step4Channels } from "./components/Step4Channels";
import { Step5Economics } from "./components/Step5Economics";
import { Step6Team } from "./components/Step6Team";
import { Step7Resources } from "./components/Step7Resources";
import { Step8Competition } from "./components/Step8Competition";
import { Step9Risks } from "./components/Step9Risks";
import { Step10Growth } from "./components/Step10Growth";
import { LoadingScreen } from "./components/LoadingScreen";
import { useProjectStore } from "@/store/useProjectStore";
import type { ProjectData } from "@/types/project";
import { hasDemoLimit } from "@/lib/utils/demoLimit";
import { createClient } from "@/lib/supabase/client";
import { setAnonymousProjectId } from "@/lib/utils/anonymousProject";

const getStepFieldsCount = (step: number, data: ProjectData): { filled: number; total: number } => {
  const { basicInfo, valueProposition, customerSegments, channels, economics, team, resources, competition, risks, growth } = data;
  
  const fieldCounts: Record<number, { filled: number; total: number }> = {
    1: {
      total: 1,
      filled: [!!basicInfo.projectName].filter(Boolean).length
    },
    2: {
      total: 5,
      filled: [
        !!valueProposition.problem,
        !!valueProposition.solution,
        !!valueProposition.solutionUniqueness,
        valueProposition.advantages.length >= 3,
        !!valueProposition.measurableValue
      ].filter(Boolean).length
    },
    3: {
      total: 8,
      filled: [
        !!customerSegments?.primarySegment,
        customerSegments?.marketSize?.tam > 0 && !!customerSegments?.marketSize?.tamDescription,
        customerSegments?.marketSize?.sam > 0 && !!customerSegments?.marketSize?.samDescription,
        customerSegments?.marketSize?.som > 0 && !!customerSegments?.marketSize?.somDescription,
        customerSegments?.geography?.markets?.length > 0,
        !!customerSegments?.geography?.notes,
        !!customerSegments?.willingnessToPay?.evidence,
        customerSegments?.willingnessToPay?.averageDealSize > 0
      ].filter(Boolean).length
    },
    4: {
      total: 6,
      filled: [
        channels?.acquisitionChannels?.length >= 3,
        !!channels?.salesChannel,
        channels?.cac > 0,
        !!channels?.cacDescription,
        !!channels?.marketingTools,
        !!channels?.marketingFunnel
      ].filter(Boolean).length
    },
    5: {
      total: 13,
      filled: [
        economics?.projectedRevenue12Months > 0,
        economics?.revenueStreams?.length > 0,
        !!economics?.revenuePricing,
        !!economics?.costBreakdown,
        economics?.grossMargin > 0,
        economics?.arpu > 0,
        economics?.customerLifetime > 0,
        economics?.contributionMargin > 0,
        economics?.fundingRaised > 0,
        economics?.fundingSources?.length > 0,
        economics?.amountSeeking > 0,
        economics?.useOfFunds?.length > 0,
        economics?.currentRunway > 0
      ].filter(Boolean).length
    },
    6: {
      total: 4,
      filled: [!!team?.keyRoles, !!team?.founderExperience, !!team?.specialists, !!team?.gaps].filter(Boolean).length
    },
    7: {
      total: 4,
      filled: [!!resources?.existing, !!resources?.needed, !!resources?.techStack, !!resources?.dependencies].filter(Boolean).length
    },
    8: {
      total: 4,
      filled: [
        !!competition?.directCompetitors,
        !!competition?.indirectCompetitors,
        !!competition?.whyChooseYou,
        !!competition?.defensibility
      ].filter(Boolean).length
    },
    9: {
      total: 6,
      filled: [
        !!risks?.technical,
        !!risks?.financial,
        !!risks?.legal,
        !!risks?.market,
        !!risks?.team,
        !!risks?.mitigation
      ].filter(Boolean).length
    },
    10: {
      total: 7,
      filled: [
        !!growth?.traction,
        !!growth?.scalingPlan,
        !!growth?.newMarkets,
        !!growth?.paybackPeriod,
        !!growth?.targets12Months,
        !!growth?.targets24Months,
        !!growth?.targets36Months
      ].filter(Boolean).length
    }
  };
  
  return fieldCounts[step] ?? { filled: 0, total: 0 };
};

const validateStep = (step: number, data: ProjectData): boolean => {
  const counts = getStepFieldsCount(step, data);
  return counts.filled === counts.total;
};

export default function CreateProjectPage() {
  const t = useTranslations('create');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const router = useRouter();
  const { projectData, currentStep, setCurrentStep, resetProject } = useProjectStore();
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);
  
  const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
  const projectId = searchParams.get('projectId');
  const isReAnalysis = !!projectId;

  useEffect(() => {
    const checkDemoLimit = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      // Don't show limit modal if user is re-analyzing (has projectId in URL)
      if (!user && !isReAnalysis && hasDemoLimit()) {
        setShowDemoLimitModal(true);
      }
    };
    
    checkDemoLimit();
    
    const navigationEntry = window.performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (navigationEntry?.type === 'navigate') {
      setCurrentStep(1);
    }
  }, [setCurrentStep, isReAnalysis]);

  const createProjectMutation = useMutation({
    mutationFn: async (data: { projectData: any; projectId?: string }) => {
      const startTime = Date.now();
      console.log('🚀 Starting project creation at:', new Date().toISOString());
      console.log('📦 Project data:', data.projectData.basicInfo.projectName);
      if (data.projectId) {
        console.log('🔄 Re-analyzing existing project:', data.projectId);
      }
      
      try {
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        console.log(`⏱️ Request completed in ${duration} seconds`);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('❌ Server error:', response.status, errorText);
          throw new Error(`Server error: ${response.status} - ${errorText}`);
        }
        
        const result = await response.json();
        console.log('✅ Response received:', result);
        return result;
      } catch (error) {
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(1);
        console.error(`❌ Request failed after ${duration} seconds:`, error);
        throw error;
      }
    },
    onSuccess: async (data) => {
      if (data?.projectId) {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.log('💾 Saving anonymous project ID to localStorage:', data.projectId);
          setAnonymousProjectId(data.projectId);
        }
        
        console.log('🔀 Redirecting to:', `/dashboard/projects/${data.projectId}`);
        router.push(`/dashboard/projects/${data.projectId}`);
      } else {
        console.log('⚠️ No projectId in response, redirecting to projects list');
        router.push('/dashboard/projects');
      }
    },
    onError: (error) => {
      console.error('❌ Project creation failed');
      console.error('Error:', error instanceof Error ? error.message : String(error));
      if (error instanceof Error && error.stack) {
        console.error('Stack trace:', error.stack);
      }
    },
  });

  const handleNext = () => {
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Get projectId from URL query params if exists (for re-analysis)
    const searchParams = new URLSearchParams(window.location.search);
    const projectId = searchParams.get('projectId');
    
    createProjectMutation.mutate({
      projectData,
      projectId: projectId || undefined,
    });
  };

  if (createProjectMutation.isPending) return <LoadingScreen text={t('analyzing')} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b px-8 py-4">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-black">
            {isReAnalysis ? t('reAnalyzeTitle') : t('title')}
          </h1>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                if (confirm(t('resetConfirm'))) {
                  resetProject();
                }
              }}
            >
              {t('resetForm')}
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8 px-2 md:px-8">
        <div className={`w-full mx-auto space-y-8 ${currentStep === 1 ? 'max-w-[600px]' : 'max-w-[1200px]'}`}>
          <div className="space-y-2 max-w-[600px]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">{t('step')} {currentStep} {t('of')} 10</span>
              <span className="text-sm text-slate-600">{Math.round((currentStep / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1">
              <div className="bg-black h-1 transition-all duration-300" style={{ width: `${(currentStep / 10) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white px-4 py-8 md:px-8 rounded-lg shadow-sm">
          {currentStep === 1 && <Step1BasicInfo />}
          {currentStep === 2 && <Step2ValueProposition />}
          {currentStep === 3 && <Step3CustomerSegments />}
          {currentStep === 4 && <Step4Channels />}
          {currentStep === 5 && <Step5Economics />}
          {currentStep === 6 && <Step6Team />}
          {currentStep === 7 && <Step7Resources />}
          {currentStep === 8 && <Step8Competition />}
          {currentStep === 9 && <Step9Risks />}
          {currentStep === 10 && <Step10Growth />}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-end text-sm">
              <span className="text-slate-600">
                {t('fieldsCompleted')}: <span className="font-semibold text-black">{getStepFieldsCount(currentStep, projectData).filled}</span> / {getStepFieldsCount(currentStep, projectData).total}
              </span>
            </div>
            
            <div className="flex gap-4 justify-end">
                <Button 
                  variant="outline"
                  onClick={currentStep === 1 ? () => router.back() : handleBack}
                  className="text-lg px-8 py-6"
                >
                  ← {tCommon('back')}
                </Button>
                <Button 
                  onClick={currentStep === 10 ? handleSubmit : handleNext}
                  className="bg-black hover:bg-black/90 text-lg px-8 py-6"
                  disabled={!validateStep(currentStep, projectData) || createProjectMutation.isPending}
                >
                  {createProjectMutation.isPending 
                    ? tCommon('submitting')
                    : currentStep === 10 
                      ? (isReAnalysis ? t('reAnalyzeProject') : t('submitProject'))
                      : `${tCommon('next')} →`}
                </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showDemoLimitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md space-y-4">
            <h2 className="text-2xl font-bold">{t('demoLimit.title')}</h2>
            <p className="text-slate-600">
              {t('demoLimit.message')}
            </p>
            <div className="flex gap-3">
              <Button onClick={() => router.push('/login')} className="flex-1">
                {tAuth('signUp')}
              </Button>
              <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
                {t('demoLimit.goHome')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
