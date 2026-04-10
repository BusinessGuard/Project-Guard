"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { useTranslations } from "next-intl";

export function Step10Growth() {
  const t = useTranslations('create.step10');
  const { projectData, updateGrowth } = useProjectStore();
  const growth = projectData.growth || {
    traction: "",
    scalingPlan: "",
    newMarkets: "",
    paybackPeriod: "",
    targets12Months: "",
    targets24Months: "",
    targets36Months: "",
  };
  const { traction, scalingPlan, newMarkets, paybackPeriod, targets12Months, targets24Months, targets36Months } = growth;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="traction" className="text-sm font-semibold">
              {t('tractionLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="traction"
              placeholder={t('tractionPlaceholder')}
              className="min-h-[100px]"
              value={traction}
              onChange={(e) => updateGrowth({ traction: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${traction ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {traction && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('tractionGuidelines.1')}</p>
              <p>• {t('tractionGuidelines.2')}</p>
              <p>• {t('tractionGuidelines.3')}</p>
              <p>• {t('tractionGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('tractionExampleLabels.b2b')}</strong> {t('tractionExamples.b2b')}
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('tractionExampleLabels.marketplace')}</strong> {t('tractionExamples.marketplace')}
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>{t('tractionExampleLabels.preRevenue')}</strong> {t('tractionExamples.preRevenue')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="scalingPlan" className="text-sm font-semibold">
              {t('scalingPlanLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="scalingPlan"
              placeholder={t('scalingPlanPlaceholder')}
              className="min-h-[120px]"
              value={scalingPlan}
              onChange={(e) => updateGrowth({ scalingPlan: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${scalingPlan ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {scalingPlan && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('scalingPlanGuidelines.1')}</p>
              <p>• {t('scalingPlanGuidelines.2')}</p>
              <p>• {t('scalingPlanGuidelines.3')}</p>
              <p>• {t('scalingPlanGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('scalingPlanExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="newMarkets" className="text-sm font-semibold">
              {t('newMarketsLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="newMarkets"
              placeholder={t('newMarketsPlaceholder')}
              className="min-h-[100px]"
              value={newMarkets}
              onChange={(e) => updateGrowth({ newMarkets: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${newMarkets ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {newMarkets && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('newMarketsGuidelines.1')}</p>
              <p>• {t('newMarketsGuidelines.2')}</p>
              <p>• {t('newMarketsGuidelines.3')}</p>
              <p>• {t('newMarketsGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('newMarketsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="paybackPeriod" className="text-sm font-semibold">
              {t('paybackPeriodLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="paybackPeriod"
              placeholder={t('paybackPeriodPlaceholder')}
              className="min-h-[100px]"
              value={paybackPeriod}
              onChange={(e) => updateGrowth({ paybackPeriod: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${paybackPeriod ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {paybackPeriod && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('paybackPeriodGuidelines.1')}</p>
              <p>• {t('paybackPeriodGuidelines.2')}</p>
              <p>• {t('paybackPeriodGuidelines.3')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('paybackPeriodExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('targetsLabel')} <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600 font-semibold">{t('targets12Months')}</Label>
              <Textarea
                placeholder={t('targets12MonthsPlaceholder')}
                className="min-h-[70px]"
                value={targets12Months}
                onChange={(e) => updateGrowth({ targets12Months: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600 font-semibold">{t('targets24Months')}</Label>
              <Textarea
                placeholder={t('targets24MonthsPlaceholder')}
                className="min-h-[70px]"
                value={targets24Months}
                onChange={(e) => updateGrowth({ targets24Months: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600 font-semibold">{t('targets36Months')}</Label>
              <Textarea
                placeholder={t('targets36MonthsPlaceholder')}
                className="min-h-[70px]"
                value={targets36Months}
                onChange={(e) => updateGrowth({ targets36Months: e.target.value })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(targets12Months || targets24Months || targets36Months) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(targets12Months && targets24Months && targets36Months) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('targetsGuidelines.1')}</p>
              <p>• {t('targetsGuidelines.2')}</p>
              <p>• {t('targetsGuidelines.3')}</p>
              <p>• {t('targetsGuidelines.4')}</p>
              <p>• {t('targetsGuidelines.5')}</p>
              <p>• {t('targetsGuidelines.6')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('targetsExamples.12mo')}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('targetsExamples.24mo')}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('targetsExamples.36mo')}
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
