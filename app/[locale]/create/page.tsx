"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/lib/navigation";
import { useSearchParams } from "next/navigation";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { LayoutDashboard } from "lucide-react";
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
import { useProject } from "@/lib/hooks/useProjects";

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
  const { projectData, currentStep, setCurrentStep, resetProject, setProjectData } = useProjectStore();
  const [showDemoLimitModal, setShowDemoLimitModal] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [isLoadingProjectData, setIsLoadingProjectData] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  const isReAnalysis = !!projectId;
  const { data: existingProject } = useProject(projectId ?? "");
  const projectName = existingProject?.name ?? projectData.basicInfo.projectName;

  const { data: existingProject } = useProject(projectId ?? "");
  const projectName = existingProject?.name ?? projectData.basicInfo.projectName;

  useEffect(() => {
    const pageTitle = isReAnalysis 
      ? (existingProject?.name 
          ? t('reAnalyzeTitle', { projectName: existingProject.name }) 
          : t('reAnalyzeTitleDefault'))
      : t('title');
    document.title = `${tNav('appName')} | ${pageTitle}`;
  }, [t, tNav, isReAnalysis, existingProject?.name]);

  // Load canvas_data from latest venture version when re-analyzing
  useEffect(() => {
    const loadCanvasData = async () => {
      if (!projectId) return;
      
      setIsLoadingProjectData(true);
      try {
        const supabase = createClient();
        
        // Get the latest version for venture audience
        const { data: versions, error } = await supabase
          .from('project_versions')
          .select('canvas_data, version_number')
          .eq('project_id', projectId)
          .eq('audience_type', 'venture')
          .order('version_number', { ascending: false })
          .limit(1);
        
        if (error) {
          console.error('Failed to load canvas data:', error);
          return;
        }
        
        if (versions && versions.length > 0 && versions[0].canvas_data) {
          const canvasData = versions[0].canvas_data as ProjectData;
          console.log('✅ Loaded canvas data from version:', versions[0].version_number);
          setProjectData(canvasData);
        }
      } catch (error) {
        console.error('Error loading canvas data:', error);
      } finally {
        setIsLoadingProjectData(false);
      }
    };
    
    loadCanvasData();
  }, [projectId, setProjectData]);

  useEffect(() => {
    const checkDemoLimit = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      setIsLoggedIn(!!user);
      
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

  // Scroll to top when step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentStep]);

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

  const handleSubmit = async () => {
    if (isSubmitting) {
      console.log('⚠️ Submit already in progress, ignoring duplicate click');
      return;
    }
    setIsSubmitting(true);

    try {
      console.log('📤 Creating analysis job...');
      const jobResponse = await fetch('/api/projects/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!jobResponse.ok) {
        throw new Error('Failed to create analysis job');
      }

      const jobPayload = await jobResponse.json();
      const jobId = jobPayload.jobId as string;
      console.log('✅ Job created:', jobId);

      const requestPayload = {
        projectData,
        projectId: projectId || undefined,
        jobId,
      };

      // Start analysis in background (ignore connection errors - will poll instead)
      console.log('📤 Starting analysis (background)...');
      fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestPayload),
        keepalive: true,
      }).catch(err => {
        // Ignore network errors - analysis continues on server, we'll poll for status
        console.warn('⚠️ Request connection closed (analysis continues on server, polling...):', err.message);
      });

      // Poll for completion - keep loading screen until we get result
      console.log('⏳ Polling for job completion...');
      const maxAttempts = 240; // 8 minutes
      let lastError: Error | null = null;
      
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        try {
          const statusResponse = await fetch(`/api/projects/jobs/${jobId}`, {
            method: 'GET',
            cache: 'no-store',
          });

          if (!statusResponse.ok) {
            console.warn(`⚠️ Status check failed (attempt ${attempt + 1}/${maxAttempts}), retrying...`);
            continue;
          }

          const statusData = await statusResponse.json();
          console.log(`📊 Job status: ${statusData.status} (attempt ${attempt + 1}/${maxAttempts})`);

          if (statusData.status === 'completed' && statusData.projectId) {
            const resultProjectId = statusData.projectId as string;
            
            // Save for anonymous users
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
              setAnonymousProjectId(resultProjectId);
            }

            console.log('✅ Analysis complete! Redirecting to:', resultProjectId);
            // Keep loading screen during redirect
            router.push(`/dashboard/projects/${resultProjectId}`);
            // Don't reset isSubmitting - let redirect happen with loading screen
            return;
          }

          if (statusData.status === 'failed') {
            lastError = new Error(statusData.error || 'Analysis failed');
            break; // Exit loop, will throw below
          }
        } catch (pollError) {
          // Network errors during polling - just retry, don't give up
          console.warn(`⚠️ Polling error (attempt ${attempt + 1}), retrying...:`, pollError);
          continue;
        }
      }

      // Only throw error if we exhausted all attempts or got failed status
      if (lastError) {
        throw lastError;
      }
      throw new Error('Timeout waiting for analysis');
    } catch (error) {
      // Only hide loading screen on real errors (failed status or timeout)
      console.error('❌ Analysis failed:', error);
      setIsSubmitting(false);
    }
  };

  if (isLoadingProjectData) return <LoadingScreen text={tCommon('loading')} />;
  if (isSubmitting) return <LoadingScreen text={t('analyzing')} />;

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b px-2 md:px-8 py-4">
        <div className="mx-auto max-w-[1200px] flex flex-col gap-2 md:flex-row justify-between items-center">
          <h1 className="text-xl font-bold text-black">
            {isReAnalysis 
              ? (existingProject?.name 
                  ? t('reAnalyzeTitle', { projectName: existingProject.name }) 
                  : t('reAnalyzeTitleDefault'))
              : t('title')}
          </h1>
          <div className="flex items-center gap-3 ml-auto">
            <LanguageSwitcher />
            <Button 
              size="sm"
              onClick={() => router.push('/dashboard/projects')}
              className="flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              {tNav('dashboard')}
            </Button>
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
              <span className="text-sm text-slate-600">
                {t('progressStep', { current: currentStep, total: 10 })}
              </span>
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
                  {t('pageBack', { label: tCommon('back') })}
                </Button>
                <Button 
                  onClick={currentStep === 10 ? handleSubmit : handleNext}
                  className="bg-black hover:bg-black/90 text-lg px-8 py-6"
                  disabled={!validateStep(currentStep, projectData) || isSubmitting}
                >
                  {isSubmitting 
                    ? tCommon('submitting')
                    : currentStep === 10 
                      ? (isReAnalysis 
                          ? (existingProject?.name 
                              ? t('reAnalyzeProject', { projectName: existingProject.name }) 
                              : t('reAnalyzeProjectDefault'))
                          : t('submitProject'))
                      : t('pageNext', { label: tCommon('next') })}
                </Button>
            </div>
          </div>
        </div>
      </div>
      
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md space-y-4 shadow-lg">
            <h2 className="text-lg font-semibold text-slate-800">{t('resetModal.title')}</h2>
            <p className="text-slate-600">{t('resetModal.message')}</p>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowResetConfirm(false)}>
                {t('resetModal.cancel')}
              </Button>
              <Button
                onClick={() => {
                  resetProject();
                  setShowResetConfirm(false);
                }}
              >
                {t('resetModal.confirm')}
              </Button>
            </div>
          </div>
        </div>
      )}

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
