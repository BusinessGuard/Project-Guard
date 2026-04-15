'use client';

import { usePostHog } from 'posthog-js/react';

export function useAnalytics() {
  const posthog = usePostHog();

  return {
    trackFormStep: (step: number, stepName: string) => {
      posthog.capture('form_step_viewed', { step, step_name: stepName });
    },
    trackStepCompleted: (step: number) => {
      posthog.capture('form_step_completed', { step, step_name: `step_${step}` });
    },
    trackFormAbandoned: (step: number) => {
      posthog.capture('form_abandoned', { last_step: step, step_name: `step_${step}` });
    },
    trackAnalysisStarted: () => {
      posthog.capture('analysis_started');
    },
    trackAnalysisCompleted: (projectId: string) => {
      posthog.capture('analysis_completed', { project_id: projectId });
    },
  };
}
