"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { useProjectStore } from "@/store/useProjectStore";
import type { ProjectData } from "@/types/project";

const validateStep = (step: number, data: ProjectData): boolean => {
  const { basicInfo, valueProposition, customerSegments, channels, economics, team, resources, competition, risks, growth } = data;
  
  const validations: Record<number, boolean> = {
    1: !!basicInfo.projectName,
    2: !!(valueProposition.problem && valueProposition.solutionUniqueness && 
         valueProposition.advantages.length >= 3 && valueProposition.measurableValue),
    3: !!(customerSegments?.primarySegment && customerSegments?.marketSize?.tam && 
         customerSegments?.marketSize?.sam && customerSegments?.marketSize?.som && 
         customerSegments?.geography?.markets?.length > 0 && customerSegments?.willingnessToPay?.evidence && customerSegments?.willingnessToPay?.averageDealSize),
    4: !!(channels?.acquisitionChannels?.length >= 3 && channels?.salesChannel && 
         channels?.cac && channels?.marketingTools && channels?.marketingFunnel),
    5: !!(economics?.projectedRevenue12Months && economics?.costBreakdown && 
         economics?.grossMargin && economics?.breakEven && economics?.funding),
    6: !!(team?.keyRoles && team?.founderExperience && team?.specialists && team?.gaps),
    7: !!(resources?.existing && resources?.needed && resources?.techStack && resources?.dependencies),
    8: !!(competition?.directCompetitors && competition?.indirectCompetitors && 
         competition?.whyChooseYou && competition?.defensibility),
    9: !!(risks?.technical && risks?.financial && risks?.legal && 
         risks?.market && risks?.team && risks?.mitigation),
    10: !!(growth?.scalingPlan && growth?.newMarkets && growth?.paybackPeriod && growth?.targets),
  };
  
  return validations[step] ?? true;
};

export default function CreateProjectPage() {
  const router = useRouter();
  const { projectData, currentStep, setCurrentStep } = useProjectStore();

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

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full border-b px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-black">Create New Project</h1>
        </div>
      </div>

      <div className="p-8">
        <div className={`w-full mx-auto space-y-8 ${currentStep === 1 ? 'max-w-[600px]' : 'max-w-[1200px]'}`}>
          <div className="space-y-2 max-w-[600px]">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Step {currentStep} of 10</span>
              <span className="text-sm text-slate-600">{Math.round((currentStep / 10) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1">
              <div className="bg-black h-1 transition-all duration-300" style={{ width: `${(currentStep / 10) * 100}%` }} />
            </div>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-sm">
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

          <div className="flex gap-4 justify-end">
                {currentStep > 1 && (
                  <Button 
                    variant="outline"
                    onClick={handleBack}
                    className="text-lg px-8 py-6"
                  >
                    ← Back
                  </Button>
                )}
                <Button 
                  onClick={handleNext}
                  className="bg-black hover:bg-black/90 text-lg px-8 py-6"
                  disabled={!validateStep(currentStep, projectData)}
                >
                  {currentStep === 10 ? "Submit Project" : "Next →"}
                </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
