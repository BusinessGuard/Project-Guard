"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { useTranslations } from "next-intl";

export function Step8Competition() {
  const t = useTranslations('create.step8');
  const { projectData, updateCompetition } = useProjectStore();
  const competition = projectData.competition || {
    directCompetitors: "",
    indirectCompetitors: "",
    whyChooseYou: "",
    defensibility: "",
  };
  const { directCompetitors, indirectCompetitors, whyChooseYou, defensibility } = competition;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="directCompetitors" className="text-sm font-semibold">
              {t('directCompetitorsLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="directCompetitors"
              placeholder={t('directCompetitorsPlaceholder')}
              className="min-h-[120px]"
              value={directCompetitors}
              onChange={(e) => updateCompetition({ directCompetitors: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${directCompetitors ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {directCompetitors && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('directCompetitorsGuidelines.1')}</p>
              <p>• {t('directCompetitorsGuidelines.2')}</p>
              <p>• {t('directCompetitorsGuidelines.3')}</p>
              <p>• {t('directCompetitorsGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('directCompetitorsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="indirectCompetitors" className="text-sm font-semibold">
              {t('indirectCompetitorsLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="indirectCompetitors"
              placeholder={t('indirectCompetitorsPlaceholder')}
              className="min-h-[100px]"
              value={indirectCompetitors}
              onChange={(e) => updateCompetition({ indirectCompetitors: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${indirectCompetitors ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {indirectCompetitors && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('indirectCompetitorsGuidelines.1')}</p>
              <p>• {t('indirectCompetitorsGuidelines.2')}</p>
              <p>• {t('indirectCompetitorsGuidelines.3')}</p>
              <p>• {t('indirectCompetitorsGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('indirectCompetitorsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="whyChooseYou" className="text-sm font-semibold">
              {t('whyChooseYouLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="whyChooseYou"
              placeholder={t('whyChooseYouPlaceholder')}
              className="min-h-[120px]"
              value={whyChooseYou}
              onChange={(e) => updateCompetition({ whyChooseYou: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${whyChooseYou ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {whyChooseYou && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('whyChooseYouGuidelines.1')}</p>
              <p>• {t('whyChooseYouGuidelines.2')}</p>
              <p>• {t('whyChooseYouGuidelines.3')}</p>
              <p>• {t('whyChooseYouGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('whyChooseYouExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="defensibility" className="text-sm font-semibold">
              {t('defensibilityLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="defensibility"
              placeholder={t('defensibilityPlaceholder')}
              className="min-h-[100px]"
              value={defensibility}
              onChange={(e) => updateCompetition({ defensibility: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${defensibility ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {defensibility && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('defensibilityGuidelines.1')}</p>
              <p>• {t('defensibilityGuidelines.2')}</p>
              <p>• {t('defensibilityGuidelines.3')}</p>
              <p>• {t('defensibilityGuidelines.4')}</p>
              <p>• {t('defensibilityGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('defensibilityExample')}
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
