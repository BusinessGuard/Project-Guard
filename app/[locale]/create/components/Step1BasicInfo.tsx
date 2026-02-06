"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectStore } from "@/store/useProjectStore";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

export function Step1BasicInfo() {
  const t = useTranslations('create.step1');
  const { projectData, updateBasicInfo } = useProjectStore();
  const { projectName, industry, stage, description } = projectData.basicInfo;
  
  const [customIndustry, setCustomIndustry] = useState("");
  const [touched, setTouched] = useState({ projectName: false, industry: false, stage: false });
  
  const industries = useMemo(() => [
    { value: "saas-b2b", label: t('industries.saasB2b') },
    { value: "saas-b2c", label: t('industries.saasB2c') },
    { value: "marketplace", label: t('industries.marketplace') },
    { value: "ecommerce", label: t('industries.ecommerce') },
    { value: "fintech", label: t('industries.fintech') },
    { value: "healthtech", label: t('industries.healthtech') },
    { value: "edtech", label: t('industries.edtech') },
    { value: "other", label: t('industries.other') },
  ], [t]);
  
  const stages = [
    { value: "idea", label: "Idea" },
    { value: "mvp", label: "MVP" },
    { value: "seed", label: "Seed" },
    { value: "series-a", label: "Series A" },
    { value: "series-b", label: "Series B" },
  ];
  
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
          <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
          <p className="text-sm text-slate-600">{t('subtitle')}</p>
        </div>

        <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="projectName" className="text-sm">
            {t('projectName')} <span className="text-red-500">*</span>
          </Label>
            <Input
              id="projectName"
              placeholder={t('projectNamePlaceholder')}
              className={`h-12 ${errors.projectName ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
              value={projectName}
              onChange={(e) => updateBasicInfo({ projectName: e.target.value })}
              onBlur={() => setTouched({ ...touched, projectName: true })}
            />
            {errors.projectName && (
              <p className="text-xs text-red-500">{t('projectNameRequired')}</p>
            )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry" className="text-sm">
            {t('industry')} <span className="text-red-500">*</span>
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
                <SelectValue placeholder={t('selectIndustry')} />
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
                placeholder={t('specifyIndustry')}
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
                {t('add')}
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
            <p className="text-xs text-red-500">{t('industryRequired')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stage" className="text-sm">
            {t('currentStage')} <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={stage} 
            onValueChange={(value) => {
              setTouched({ ...touched, stage: true });
              updateBasicInfo({ stage: value });
            }}
          >
            <SelectTrigger className={`!h-12 w-full py-0 ${errors.stage ? 'border-red-500' : ''}`}>
              <SelectValue placeholder={t('selectStage')} />
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
            <p className="text-xs text-red-500">{t('stageRequired')}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm">
            {t('description')} <span className="text-slate-400">{t('optional')}</span>
          </Label>
          <Textarea
            id="description"
            placeholder={t('descriptionPlaceholder')}
            className="min-h-[80px]"
            value={description}
            onChange={(e) => updateBasicInfo({ description: e.target.value })}
          />
        </div>

          <div className="border-l-2 border-slate-300 pl-4">
            <p className="text-sm text-slate-600">
              {t('tip')}
            </p>
          </div>
        </div>
      </div>
      
      {/* Empty right column for consistent width */}
      <div></div>
    </div>
  );
}
