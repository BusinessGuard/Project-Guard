"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectStore } from "@/store/useProjectStore";

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
              className="h-12"
              value={projectName}
              onChange={(e) => updateBasicInfo({ projectName: e.target.value })}
            />
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm">
            Industry
          </Label>
          <Select value={industry} onValueChange={(value) => updateBasicInfo({ industry: value })}>
            <SelectTrigger className="!h-12 w-full py-0">
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
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage" className="text-sm">
            Current Stage
          </Label>
          <Select value={stage} onValueChange={(value) => updateBasicInfo({ stage: value })}>
            <SelectTrigger className="!h-12 w-full py-0">
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
