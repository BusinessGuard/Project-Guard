"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectStore } from "@/store/useProjectStore";
import { useState } from "react";

const industries = [
  { value: "saas-b2b", label: "SaaS / B2B" },
  { value: "saas-b2c", label: "SaaS / B2C" },
  { value: "marketplace", label: "Marketplace" },
  { value: "ecommerce", label: "E-commerce" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthtech" },
  { value: "edtech", label: "Edtech" },
  { value: "other", label: "Other" },
];

const stages = [
  { value: "idea", label: "Idea" },
  { value: "mvp", label: "MVP / Pre-seed" },
  { value: "seed", label: "Seed" },
  { value: "series-a", label: "Series A" },
  { value: "series-b", label: "Series B+" },
];

export function Step1BasicInfo() {
  const { projectData, updateBasicInfo } = useProjectStore();
  const { projectName, industry, stage, description } = projectData.basicInfo;
  
  const [customIndustry, setCustomIndustry] = useState("");
  const [touched, setTouched] = useState({ projectName: false, industry: false, stage: false });
  
  const isOtherIndustry = industry === "other" || (industry && !industries.some(i => i.value === industry));
  
  // Validation
  const errors = {
    projectName: touched.projectName && !projectName,
    industry: touched.industry && (!industry || industry === "other"),
    stage: touched.stage && !stage,
  };

  return (
    <div className="max-w-600 gap-8">
      <div className="space-y-8">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-black">Project Details</h2>
          <p className="text-sm text-slate-600">Let's start with the basics</p>
        </div>

        <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-sm">
            Project Name <span className="text-red-500">*</span>
          </Label>
            <Input
              id="projectName"
              placeholder="HRFlow - Smart HR Automation"
              className={`h-12 ${errors.projectName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              value={projectName}
              onChange={(e) => updateBasicInfo({ projectName: e.target.value })}
              onBlur={() => setTouched({ ...touched, projectName: true })}
            />
            {errors.projectName && (
              <p className="text-xs text-red-500">Project name is required</p>
            )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm">
            Industry <span className="text-red-500">*</span>
          </Label>
          
          {/* Show select only if no custom industry is set */}
          {(!industry || industry === "other" || industries.some(i => i.value === industry)) && (
            <Select 
              value={isOtherIndustry ? "other" : industry} 
              onValueChange={(value) => {
                setTouched({ ...touched, industry: true });
                if (value === "other") {
                  updateBasicInfo({ industry: "other" });
                } else {
                  updateBasicInfo({ industry: value });
                }
              }}
            >
              <SelectTrigger className={`!h-12 w-full py-0 ${errors.industry ? 'border-red-500' : ''}`}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industries.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Show input field when "Other" is selected */}
          {industry === "other" && (
            <div className="flex gap-2">
              <Input
                placeholder="Specify your industry..."
                className="h-12 flex-1"
                value={customIndustry}
                onChange={(e) => setCustomIndustry(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customIndustry.trim()) {
                    e.preventDefault();
                    updateBasicInfo({ industry: customIndustry.trim() });
                    setCustomIndustry("");
                  }
                }}
              />
              <Button
                type="button"
                className="h-12 px-4"
                onClick={() => {
                  if (customIndustry.trim()) {
                    updateBasicInfo({ industry: customIndustry.trim() });
                    setCustomIndustry("");
                  }
                }}
                disabled={!customIndustry.trim()}
              >
                Add
              </Button>
            </div>
          )}
          
          {/* Show custom industry value with delete button */}
          {industry && industry !== "other" && !industries.some(i => i.value === industry) && (
            <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-md border border-slate-200">
              <span className="text-sm flex-1 font-medium">{industry}</span>
              <button
                type="button"
                className="text-slate-500 hover:text-red-600 text-lg font-bold"
                onClick={() => updateBasicInfo({ industry: "" })}
              >
                ✕
              </button>
            </div>
          )}
          
          {errors.industry && (
            <p className="text-xs text-red-500">Please select or specify an industry</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage" className="text-sm">
            Current Stage <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={stage} 
            onValueChange={(value) => {
              setTouched({ ...touched, stage: true });
              updateBasicInfo({ stage: value });
            }}
          >
            <SelectTrigger className={`!h-12 w-full py-0 ${errors.stage ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Select stage" />
            </SelectTrigger>
            <SelectContent>
              {stages.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.stage && (
            <p className="text-xs text-red-500">Please select a stage</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm">
            One-line Description <span className="text-slate-400">(optional)</span>
          </Label>
          <Textarea
            id="description"
            placeholder="AI-powered HR platform for SMBs to automate hiring and onboarding"
            className="min-h-[80px]"
            value={description}
            onChange={(e) => updateBasicInfo({ description: e.target.value })}
          />
        </div>

          <div className="border-l-2 border-slate-300 pl-4">
            <p className="text-sm text-slate-600">
              Tip: You can save draft and come back anytime
            </p>
          </div>
        </div>
      </div>
      
      {/* Empty right column for consistent width */}
      <div></div>
    </div>
  );
}
