"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoMdClose } from "react-icons/io";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";

export function Step7Resources() {
  const t = useTranslations('create.step7');
  const { projectData, updateResources } = useProjectStore();

  const partnerTypes = useMemo(() => [
    t('partnerTypes.technology'),
    t('partnerTypes.distribution'),
    t('partnerTypes.strategicAlliance'),
    t('partnerTypes.supplier'),
    t('partnerTypes.coMarketing'),
    t('partnerTypes.integration'),
    t('partnerTypes.other'),
  ], [t]);
  const resources = projectData.resources || {
    existing: "",
    needed: "",
    techStack: "",
    dependencies: "",
    activities: {
      production: "",
      innovation: "",
      platform: "",
      marketing: "",
      operations: "",
    },
    partners: [],
  };
  const { existing, needed, techStack, dependencies, activities, partners } = resources;
  const { production, innovation, platform, marketing, operations } = activities || {
    production: "",
    innovation: "",
    platform: "",
    marketing: "",
    operations: "",
  };

  const [newPartnerType, setNewPartnerType] = useState("");
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerValue, setNewPartnerValue] = useState("");

  const handleAddPartner = () => {
    if (newPartnerType && newPartnerName && newPartnerValue) {
      updateResources({ 
        partners: [{ 
          type: newPartnerType, 
          name: newPartnerName,
          value: newPartnerValue
        }, ...(partners || [])] 
      });
      setNewPartnerType("");
      setNewPartnerName("");
      setNewPartnerValue("");
    }
  };

  const handleRemovePartner = (index: number) => {
    updateResources({ partners: (partners || []).filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="existing" className="text-sm font-semibold">
              {t('existingLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="existing"
              placeholder={t('existingPlaceholder')}
              className="min-h-[100px]"
              value={existing}
              onChange={(e) => updateResources({ existing: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${existing ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {existing && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('existingGuidelines.1')}</p>
              <p>• {t('existingGuidelines.2')}</p>
              <p>• {t('existingGuidelines.3')}</p>
              <p>• {t('existingGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('existingExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="needed" className="text-sm font-semibold">
              {t('neededLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="needed"
              placeholder={t('neededPlaceholder')}
              className="min-h-[100px]"
              value={needed}
              onChange={(e) => updateResources({ needed: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${needed ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {needed && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('neededGuidelines.1')}</p>
              <p>• {t('neededGuidelines.2')}</p>
              <p>• {t('neededGuidelines.3')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('neededExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="techStack" className="text-sm font-semibold">
              {t('techStackLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="techStack"
              placeholder={t('techStackPlaceholder')}
              className="min-h-[100px]"
              value={techStack}
              onChange={(e) => updateResources({ techStack: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${techStack ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {techStack && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('techStackGuidelines.1')}</p>
              <p>• {t('techStackGuidelines.2')}</p>
              <p>• {t('techStackGuidelines.3')}</p>
              <p>• {t('techStackGuidelines.4')}</p>
              <p>• {t('techStackGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('techStackExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="dependencies" className="text-sm font-semibold">
              {t('dependenciesLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="dependencies"
              placeholder={t('dependenciesPlaceholder')}
              className="min-h-[100px]"
              value={dependencies}
              onChange={(e) => updateResources({ dependencies: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${dependencies ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {dependencies && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('dependenciesGuidelines.1')}</p>
              <p>• {t('dependenciesGuidelines.2')}</p>
              <p>• {t('dependenciesGuidelines.3')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('dependenciesExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('keyActivitiesLabel')} <span className="text-slate-400">{t('optional')}</span>
            </Label>

            <div className="space-y-2">
              <Label htmlFor="production" className="text-xs text-slate-600 font-semibold">{t('production')}</Label>
              <Textarea
                id="production"
                placeholder={t('productionPlaceholder')}
                className="min-h-[70px]"
                value={production}
                onChange={(e) => updateResources({ activities: { ...activities, production: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="innovation" className="text-xs text-slate-600 font-semibold">{t('innovation')}</Label>
              <Textarea
                id="innovation"
                placeholder={t('innovationPlaceholder')}
                className="min-h-[70px]"
                value={innovation}
                onChange={(e) => updateResources({ activities: { ...activities, innovation: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-xs text-slate-600 font-semibold">{t('platform')}</Label>
              <Textarea
                id="platform"
                placeholder={t('platformPlaceholder')}
                className="min-h-[70px]"
                value={platform}
                onChange={(e) => updateResources({ activities: { ...activities, platform: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketing" className="text-xs text-slate-600 font-semibold">{t('marketing')}</Label>
              <Textarea
                id="marketing"
                placeholder={t('marketingPlaceholder')}
                className="min-h-[70px]"
                value={marketing}
                onChange={(e) => updateResources({ activities: { ...activities, marketing: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operations" className="text-xs text-slate-600 font-semibold">{t('operations')}</Label>
              <Textarea
                id="operations"
                placeholder={t('operationsPlaceholder')}
                className="min-h-[70px]"
                value={operations}
                onChange={(e) => updateResources({ activities: { ...activities, operations: e.target.value } })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(production || innovation || platform || marketing || operations) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(production || innovation || platform || marketing || operations) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• <strong>{t('production')}:</strong> {t('keyActivitiesGuidelines.production')}</p>
              <p>• <strong>{t('innovation')}:</strong> {t('keyActivitiesGuidelines.innovation')}</p>
              <p>• <strong>{t('platform')}:</strong> {t('keyActivitiesGuidelines.platform')}</p>
              <p>• <strong>{t('marketing')}:</strong> {t('keyActivitiesGuidelines.marketing')}</p>
              <p>• <strong>{t('operations')}:</strong> {t('keyActivitiesGuidelines.operations')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('production')}:</strong> {t('keyActivitiesExamples.production')}
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('innovation')}:</strong> {t('keyActivitiesExamples.innovation')}
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('platform')}:</strong> {t('keyActivitiesExamples.platform')}
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('marketing')}:</strong> {t('keyActivitiesExamples.marketing')}
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('operations')}:</strong> {t('keyActivitiesExamples.operations')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t('keyPartnersLabel')} <span className="text-slate-400">{t('optional')}</span>
            </Label>
            <p className="text-xs text-slate-500">{t('keyPartnersHint')}</p>
            
            <div className="border border-slate-200 overflow-hidden rounded-md">
              <div className="p-2 bg-white border-b border-slate-200">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <Select value={newPartnerType} onValueChange={setNewPartnerType}>
                      <SelectTrigger className="h-10 flex-1 md:w-[140px]">
                        <SelectValue placeholder={t('type')} />
                      </SelectTrigger>
                      <SelectContent>
                        {partnerTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder={t('name')}
                      className="!h-10 flex-1 md:w-[140px]"
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto md:flex-1">
                    <Input
                      placeholder={t('value')}
                      className="!h-10 flex-1"
                      value={newPartnerValue}
                      onChange={(e) => setNewPartnerValue(e.target.value)}
                    />
                    
                    <Button
                      type="button"
                      className="h-10 px-4 text-sm whitespace-nowrap"
                      onClick={handleAddPartner}
                      disabled={!newPartnerType || !newPartnerName || !newPartnerValue}
                    >
                      {t('add')}
                    </Button>
                  </div>
                </div>
              </div>

              {partners && partners.length > 0 && (
                <div className="divide-y divide-slate-200">
                  {partners.map((partner, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row md:items-center gap-2 md:gap-3 px-4 py-3 hover:bg-slate-50 transition-colors pr-12">
                      <span className="text-xs font-semibold text-slate-500 w-6 md:w-8 shrink-0 text-center">{index + 1}.</span>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 flex-1 min-w-0">
                        <span className="text-sm font-medium text-slate-900 w-full md:w-[140px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{partner.type}</span>
                        <span className="text-sm font-medium text-slate-800 w-full md:w-[160px] shrink-0 overflow-hidden text-ellipsis whitespace-nowrap">{partner.name}</span>
                        <span className="text-sm text-slate-700 flex-1 min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">{partner.value}</span>
                      </div>
                      <button
                        type="button"
                        className="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-red-50 rounded-full p-1.5 transition-colors shrink-0"
                        onClick={() => handleRemovePartner(index)}
                      >
                        <IoMdClose className="size-6 " />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${partners && partners.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {partners && partners.length > 0 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('keyPartnersGuidelines.1')}</p>
              <p>• {t('keyPartnersGuidelines.2')}</p>
              <p>• {t('keyPartnersGuidelines.3')}</p>
              <p>• {t('keyPartnersGuidelines.4')}</p>
              <p>• {t('keyPartnersGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('keyPartnersExample')}
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            {t('tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
