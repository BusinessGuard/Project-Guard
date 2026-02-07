"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { TbChecks } from "react-icons/tb";
import { useState, useMemo } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useTranslations } from "next-intl";

export function Step2ValueProposition() {
  const t = useTranslations('create.step2');
  const { projectData, updateValueProposition } = useProjectStore();
  const { problem, solution, solutionUniqueness, advantages, measurableValue } = projectData.valueProposition;
  const [currentAdvantage, setCurrentAdvantage] = useState("");

  const problemGuidelines = useMemo(() => [
    t('problemGuidelines.1'),
    t('problemGuidelines.2'),
    t('problemGuidelines.3'),
    t('problemGuidelines.4'),
  ], [t]);

  const solutionGuidelines = useMemo(() => [
    t('solutionGuidelines.1'),
    t('solutionGuidelines.2'),
    t('solutionGuidelines.3'),
  ], [t]);

  const solutionUniquenessGuidelines = useMemo(() => [
    t('solutionUniquenessGuidelines.1'),
    t('solutionUniquenessGuidelines.2'),
    t('solutionUniquenessGuidelines.3'),
  ], [t]);

  const measurableValueGuidelines = useMemo(() => [
    t('measurableValueGuidelines.1'),
    t('measurableValueGuidelines.2'),
    t('measurableValueGuidelines.3'),
    t('measurableValueGuidelines.4'),
  ], [t]);

  const handleAddAdvantage = () => {
    if (currentAdvantage.trim()) {
      updateValueProposition({ advantages: [currentAdvantage.trim(), ...advantages] });
      setCurrentAdvantage("");
    }
  };

  const handleRemoveAdvantage = (index: number) => {
    updateValueProposition({ advantages: advantages.filter((_, i) => i !== index) });
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
            <Label htmlFor="problem" className="text-sm font-semibold">
              {t('problemLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="problem"
              placeholder={t('problemPlaceholder')}
              className="min-h-[120px]"
              value={problem}
              onChange={(e) => updateValueProposition({ problem: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${problem ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {problem && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {problemGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('problemExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="solution" className="text-sm font-semibold">
              {t('solutionLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="solution"
              placeholder={t('solutionPlaceholder')}
              className="min-h-[120px]"
              value={solution}
              onChange={(e) => updateValueProposition({ solution: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${solution ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {solution && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {solutionGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('solutionExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="solutionUniqueness" className="text-sm font-semibold">
              {t('solutionUniquenessLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="solutionUniqueness"
              placeholder={t('solutionUniquenessPlaceholder')}
              className="min-h-[120px]"
              value={solutionUniqueness}
              onChange={(e) => updateValueProposition({ solutionUniqueness: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${solutionUniqueness ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {solutionUniqueness && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {solutionUniquenessGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('solutionUniquenessExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t('advantagesLabel')} <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-500">
              {t('advantagesHint')} <span className={advantages.length < 3 ? 'text-red-500' : 'text-slate-500'}>{t('advantagesHintRequired')}</span>
            </p>
            
            <div className="border border-slate-200 overflow-hidden rounded-md">
              
              <div className="p-2 bg-white border-b border-slate-200">
                <div className="flex gap-2">
                  <Input
                    placeholder={t('advantagesPlaceholder')}
                    className="h-10 flex-1"
                    value={currentAdvantage}
                    onChange={(e) => setCurrentAdvantage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAdvantage();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    className="h-10 px-4"
                    onClick={handleAddAdvantage}
                    disabled={!currentAdvantage.trim()}
                  >
                    {t('add')}
                  </Button>
                </div>
              </div>

              {advantages.length > 0 && (
                <div className="divide-y divide-slate-200">
                  {advantages.map((advantage, index) => (
                    <div key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                      <span className="text-xs font-semibold text-slate-500 min-w-[24px]">{index + 1}.</span>
                      <span className="text-sm text-slate-900 flex-1">{advantage}</span>
                      <button
                        type="button"
                        className="ml-4 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                        onClick={() => handleRemoveAdvantage(index)}
                      >
                        <IoMdClose className="h-4 w-4 text-red-600" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${advantages.length > 2 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {advantages.length > 2 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-slate-600 italic">
              {t('advantagesExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="measurableValue" className="text-sm font-semibold">
              {t('measurableValueLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="measurableValue"
              placeholder={t('measurableValuePlaceholder')}
              className="min-h-[100px]"
              value={measurableValue}
              onChange={(e) => updateValueProposition({ measurableValue: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${measurableValue ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {measurableValue && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {measurableValueGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('measurableValueExample')}
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
