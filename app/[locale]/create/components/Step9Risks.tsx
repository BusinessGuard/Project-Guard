"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function Step9Risks() {
  const t = useTranslations('create.step9');
  const { projectData, updateRisks } = useProjectStore();
  const risks = projectData.risks || {
    technical: "",
    financial: "",
    legal: "",
    market: "",
    team: "",
    mitigation: "",
  };

  const riskFields = useMemo(() => [
    { id: "technical", label: t('riskFields.technical.label'), placeholder: t('riskFields.technical.placeholder') },
    { id: "financial", label: t('riskFields.financial.label'), placeholder: t('riskFields.financial.placeholder') },
    { id: "legal", label: t('riskFields.legal.label'), placeholder: t('riskFields.legal.placeholder') },
    { id: "market", label: t('riskFields.market.label'), placeholder: t('riskFields.market.placeholder') },
    { id: "team", label: t('riskFields.team.label'), placeholder: t('riskFields.team.placeholder') },
    { id: "mitigation", label: t('riskFields.mitigation.label'), placeholder: t('riskFields.mitigation.placeholder') },
  ], [t]);

  const guidelines = useMemo(() => ({
    technical: {
      points: [
        t('guidelines.technical.1'),
        t('guidelines.technical.2'),
        t('guidelines.technical.3'),
        t('guidelines.technical.4'),
      ],
      example: t('examples.technical')
    },
    financial: {
      points: [
        t('guidelines.financial.1'),
        t('guidelines.financial.2'),
        t('guidelines.financial.3'),
        t('guidelines.financial.4'),
      ],
      example: t('examples.financial')
    },
    legal: {
      points: [
        t('guidelines.legal.1'),
        t('guidelines.legal.2'),
        t('guidelines.legal.3'),
        t('guidelines.legal.4'),
      ],
      example: t('examples.legal')
    },
    market: {
      points: [
        t('guidelines.market.1'),
        t('guidelines.market.2'),
        t('guidelines.market.3'),
        t('guidelines.market.4'),
      ],
      example: t('examples.market')
    },
    team: {
      points: [
        t('guidelines.team.1'),
        t('guidelines.team.2'),
        t('guidelines.team.3'),
        t('guidelines.team.4'),
      ],
      example: t('examples.team')
    },
    mitigation: {
      points: [
        t('guidelines.mitigation.1'),
        t('guidelines.mitigation.2'),
        t('guidelines.mitigation.3'),
      ],
      example: t('examples.mitigation')
    }
  }), [t]);

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        {riskFields.map((field) => (
          <div key={field.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
            <div className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-semibold">
                {field.label} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                className="min-h-[100px]"
                value={risks[field.id as keyof typeof risks]}
                onChange={(e) => updateRisks({ [field.id]: e.target.value })}
              />
            </div>

            <div className={`space-y-2 text-sm transition-opacity duration-300 ${risks[field.id as keyof typeof risks] ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
              <h4 className="text-base font-semibold text-black flex items-center gap-2">
                {t('guidelinesTitle')}
                {risks[field.id as keyof typeof risks] && <TbChecks className="text-green-500 text-lg" />}
              </h4>
              <div className="text-black space-y-1">
                {guidelines[field.id as keyof typeof guidelines].points.map((point, idx) => (
                  <p key={idx}>• {point}</p>
                ))}
              </div>
              <div className="text-slate-600 italic pt-2">
                {t('example')}: {guidelines[field.id as keyof typeof guidelines].example}
              </div>
            </div>
          </div>
        ))}

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            {t('tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
