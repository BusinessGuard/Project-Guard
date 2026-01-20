"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Step1BasicInfo } from "./components/Step1BasicInfo";

export default function CreateProjectPage() {
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState("");
  const [industry, setIndustry] = useState("");
  const [stage, setStage] = useState("");
  const [description, setDescription] = useState("");
  const router = useRouter();

  const handleNext = () => {
    if (step < 7) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="w-full border-b px-8 py-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-xl font-bold text-black">Create New Project</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="max-w-2xl w-full space-y-8 bg-white">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-600">Step {step} of 7</span>
              <span className="text-sm text-slate-600">{Math.round((step / 7) * 100)}%</span>
            </div>
            <div className="w-full bg-slate-200 h-1">
              <div 
                className="bg-black h-1 transition-all duration-300"
                style={{ width: `${(step / 7) * 100}%` }}
              />
            </div>
          </div>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <Step1BasicInfo
              projectName={projectName}
              industry={industry}
              stage={stage}
              description={description}
              onProjectNameChange={setProjectName}
              onIndustryChange={setIndustry}
              onStageChange={setStage}
              onDescriptionChange={setDescription}
            />
          )}

          {/* Step 2-7: Placeholder */}
          {step > 1 && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black">Step {step}</h2>
              <p className="text-sm text-slate-600">Content for step {step} coming soon...</p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-end pt-8">
            {step > 1 && (
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
              disabled={step === 1 && !projectName}
            >
              {step === 7 ? "Create Project" : "Next →"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
