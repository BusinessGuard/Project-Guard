"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { handleNonNegativeNumberInput } from "@/lib/utils/numberValidation";

export function Step3CustomerSegments() {
  const t = useTranslations('create.step3');
  const { projectData, updateCustomerSegments } = useProjectStore();
  const [tamUnit, setTamUnit] = useState<'M' | 'K'>('M');
  const [samUnit, setSamUnit] = useState<'M' | 'K'>('M');
  const [somUnit, setSomUnit] = useState<'M' | 'K'>('M');

  const marketSizeFields = useMemo(() => [
    { id: 'tam', label: t('marketSizeFields.tam'), placeholder: '500', unit: tamUnit, setUnit: setTamUnit },
    { id: 'sam', label: t('marketSizeFields.sam'), placeholder: '100', unit: samUnit, setUnit: setSamUnit },
    { id: 'som', label: t('marketSizeFields.som'), placeholder: '10', unit: somUnit, setUnit: setSomUnit },
  ], [t, tamUnit, samUnit, somUnit]);

  const primarySegmentGuidelines = useMemo(() => [
    t('primarySegmentGuidelines.1'),
    t('primarySegmentGuidelines.2'),
    t('primarySegmentGuidelines.3'),
    t('primarySegmentGuidelines.4'),
    t('primarySegmentGuidelines.5'),
  ], [t]);

  const marketSizeGuidelines = useMemo(() => [
    t('marketSizeGuidelines.1'),
    t('marketSizeGuidelines.2'),
    t('marketSizeGuidelines.3'),
    t('marketSizeGuidelines.4'),
  ], [t]);

  const geographyGuidelines = useMemo(() => [
    t('geographyGuidelines.1'),
    t('geographyGuidelines.2'),
    t('geographyGuidelines.3'),
    t('geographyGuidelines.4'),
  ], [t]);

  const availableMarkets = useMemo(() => [
    { value: 'ukraine', label: t('markets.ukraine') },
    { value: 'poland', label: t('markets.poland') },
    { value: 'germany', label: t('markets.germany') },
    { value: 'kazakhstan', label: t('markets.kazakhstan') },
    { value: 'usa', label: t('markets.usa') },
    { value: 'other', label: t('markets.other') },
  ], [t]);

  const willingnessToPayGuidelines = useMemo(() => [
    t('willingnessToPayGuidelines.1'),
    t('willingnessToPayGuidelines.2'),
    t('willingnessToPayGuidelines.3'),
    t('willingnessToPayGuidelines.4'),
    t('willingnessToPayGuidelines.5'),
  ], [t]);
  const customerSegments = projectData.customerSegments || {
    primarySegment: "",
    marketSize: {
      tam: "",
      tamCalculation: "",
      sam: "",
      samCalculation: "",
      som: "",
      somCalculation: "",
    },
    geography: {
      markets: [],
      notes: "",
    },
    willingnessToPay: {
      evidence: "",
      averageDealSize: 0,
    },
  };
  const { primarySegment, marketSize, geography, willingnessToPay } = customerSegments;

  const handleMarketToggle = (market: string) => {
    const currentMarkets = geography.markets || [];
    const isSelected = currentMarkets.includes(market);
    const newMarkets = isSelected
      ? currentMarkets.filter((m) => m !== market)
      : [...currentMarkets, market];
    updateCustomerSegments({ geography: { ...geography, markets: newMarkets } });
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
            <Label htmlFor="primarySegment" className="text-sm font-semibold">
              {t('primarySegmentLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="primarySegment"
              placeholder={t('primarySegmentPlaceholder')}
              className="min-h-[120px]"
              value={primarySegment}
              onChange={(e) => updateCustomerSegments({ primarySegment: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${primarySegment ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {primarySegment && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {primarySegmentGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('primarySegmentExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('marketSizeLabel')} <span className="text-red-500">*</span>
            </Label>
            
            {marketSizeFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-xs text-slate-600">
                  {field.label}
                </Label>
                <div className="grid grid-cols-[140px_60px_1fr] gap-2">
                  <InputGroup className="h-10">
                    <InputGroupAddon>€</InputGroupAddon>
                    <InputGroupInput
                      id={field.id}
                      type="number"
                      placeholder={field.placeholder}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={marketSize[field.id as keyof typeof marketSize] || ""}
                      onChange={(e) => {
                        handleNonNegativeNumberInput(e.target.value, (num) => {
                          updateCustomerSegments({ 
                            marketSize: { ...marketSize, [field.id]: num } 
                          });
                        });
                      }}
                      min="0"
                    />
                  </InputGroup>
                  <Select value={field.unit} onValueChange={(value: 'M' | 'K') => field.setUnit(value)}>
                    <SelectTrigger className="!h-10">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="K">K</SelectItem>
                      <SelectItem value="M">M</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder={t('calculationPlaceholder')}
                    className="h-10"
                    value={marketSize[`${field.id}Description` as keyof typeof marketSize] || ""}
                    onChange={(e) => updateCustomerSegments({ 
                      marketSize: { ...marketSize, [`${field.id}Description`]: e.target.value } 
                    })}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(marketSize.tam || marketSize.sam || marketSize.som) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(marketSize.tam > 0 && marketSize.sam > 0 && marketSize.som > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {marketSizeGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('marketSizeExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('geographyLabel')} <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('primaryMarkets')}</Label>
              <div className="flex flex-wrap gap-3">
                {availableMarkets.map((market) => (
                  <label key={market.value} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={geography.markets?.includes(market.value) || false}
                      onCheckedChange={() => handleMarketToggle(market.value)}
                    />
                    <span className="text-sm">{market.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={t('geographyPlaceholder')}
                className="min-h-[80px]"
                value={geography.notes}
                onChange={(e) => updateCustomerSegments({ geography: { ...geography, notes: e.target.value } })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(geography.markets?.length > 0 || geography.notes) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(geography.markets?.length > 0 && geography.notes) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {geographyGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('geographyExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('willingnessToPayLabel')} <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('customerValidationEvidence')}</Label>
              <Textarea
                placeholder={t('customerValidationPlaceholder')}
                className="min-h-[100px]"
                value={willingnessToPay.evidence}
                onChange={(e) => updateCustomerSegments({ willingnessToPay: { ...willingnessToPay, evidence: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('averageDealSize')}</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder={t('averageDealSizePlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={willingnessToPay.averageDealSize || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateCustomerSegments({ willingnessToPay: { ...willingnessToPay, averageDealSize: num } });
                    });
                  }}
                  min="0"
                />
                <InputGroupAddon align="inline-end">{t('perMonth')}</InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(willingnessToPay.evidence || willingnessToPay.averageDealSize) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(willingnessToPay.evidence && willingnessToPay.averageDealSize > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {willingnessToPayGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('willingnessToPayExample')}
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
