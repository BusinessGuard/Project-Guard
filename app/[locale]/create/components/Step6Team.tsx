"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { useTranslations } from "next-intl";

export function Step6Team() {
  const t = useTranslations('create.step6');
  const { projectData, updateTeam } = useProjectStore();
  const team = projectData.team || {
    keyRoles: "",
    founderExperience: "",
    specialists: "",
    gaps: "",
  };
  const { keyRoles, founderExperience, specialists, gaps } = team;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="keyRoles" className="text-sm font-semibold">
              {t('keyRolesLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="keyRoles"
              placeholder={t('keyRolesPlaceholder')}
              className="min-h-[100px]"
              value={keyRoles}
              onChange={(e) => updateTeam({ keyRoles: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${keyRoles ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {keyRoles && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('keyRolesGuidelines.1')}</p>
              <p>• {t('keyRolesGuidelines.2')}</p>
              <p>• {t('keyRolesGuidelines.3')}</p>
              <p>• {t('keyRolesGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('keyRolesExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="founderExperience" className="text-sm font-semibold">
              {t('founderExperienceLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="founderExperience"
              placeholder={t('founderExperiencePlaceholder')}
              className="min-h-[100px]"
              value={founderExperience}
              onChange={(e) => updateTeam({ founderExperience: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${founderExperience ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {founderExperience && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('founderExperienceGuidelines.1')}</p>
              <p>• {t('founderExperienceGuidelines.2')}</p>
              <p>• {t('founderExperienceGuidelines.3')}</p>
              <p>• {t('founderExperienceGuidelines.4')}</p>
              <p>• {t('founderExperienceGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('founderExperienceExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="specialists" className="text-sm font-semibold">
              {t('specialistsLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="specialists"
              placeholder={t('specialistsPlaceholder')}
              className="min-h-[100px]"
              value={specialists}
              onChange={(e) => updateTeam({ specialists: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${specialists ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {specialists && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('specialistsGuidelines.1')}</p>
              <p>• {t('specialistsGuidelines.2')}</p>
              <p>• {t('specialistsGuidelines.3')}</p>
              <p>• {t('specialistsGuidelines.4')}</p>
              <p>• {t('specialistsGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('specialistsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="gaps" className="text-sm font-semibold">
              {t('gapsLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="gaps"
              placeholder={t('gapsPlaceholder')}
              className="min-h-[100px]"
              value={gaps}
              onChange={(e) => updateTeam({ gaps: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${gaps ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {gaps && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('gapsGuidelines.1')}</p>
              <p>• {t('gapsGuidelines.2')}</p>
              <p>• {t('gapsGuidelines.3')}</p>
              <p>• {t('gapsGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('gapsExample')}
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
