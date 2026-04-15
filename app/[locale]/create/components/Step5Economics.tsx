"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useProjectStore } from "@/store/useProjectStore";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IoMdClose } from "react-icons/io";
import { TbChecks } from "react-icons/tb";
import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import { handleNonNegativeNumberInput, createNonNegativeNumberHandler } from "@/lib/utils/numberValidation";

export function Step5Economics() {
  const t = useTranslations('create.step5');
  const { projectData, updateEconomics } = useProjectStore();

  const fundingTypes = useMemo(() => [
    t('fundingTypes.bootstrapped'),
    t('fundingTypes.angel'),
    t('fundingTypes.vc'),
    t('fundingTypes.grants'),
    t('fundingTypes.accelerator'),
    t('fundingTypes.other'),
  ], [t]);

  const revenueStreamTypes = useMemo(() => [
    t('revenueStreamTypes.subscription'),
    t('revenueStreamTypes.oneTime'),
    t('revenueStreamTypes.usageBased'),
    t('revenueStreamTypes.commission'),
    t('revenueStreamTypes.advertising'),
    t('revenueStreamTypes.licensing'),
    t('revenueStreamTypes.other'),
  ], [t]);
  
  const economics = projectData.economics ? {
    ...projectData.economics,
    revenueStreams: Array.isArray(projectData.economics.revenueStreams) ? projectData.economics.revenueStreams : [],
    fundingSources: Array.isArray(projectData.economics.fundingSources) ? projectData.economics.fundingSources : [],
    useOfFunds: Array.isArray(projectData.economics.useOfFunds) ? projectData.economics.useOfFunds : [],
    fundingRaised: projectData.economics.fundingRaised || 0,
    revenuePricing: projectData.economics.revenuePricing || "",
    currentRunway: projectData.economics.currentRunway || 0,
  } : {
    projectedRevenue12Months: 0,
    revenueStreams: [],
    revenuePricing: "",
    costBreakdown: "",
    grossMargin: 0,
    arpu: 0,
    customerLifetime: 0,
    contributionMargin: 0,
    fundingRaised: 0,
    fundingSources: [],
    amountSeeking: 0,
    useOfFunds: [],
    currentRunway: 0,
  };
  const { projectedRevenue12Months, revenueStreams, revenuePricing, costBreakdown, grossMargin, arpu, customerLifetime, contributionMargin, fundingRaised, fundingSources, amountSeeking, useOfFunds, currentRunway = 0 } = economics;

  const [newStreamType, setNewStreamType] = useState("");
  const [newStreamDescription, setNewStreamDescription] = useState("");
  const [newStreamPercentage, setNewStreamPercentage] = useState("");
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [newSourceType, setNewSourceType] = useState("");
  const [newSourceCustomType, setNewSourceCustomType] = useState("");
  const [newSourceAmount, setNewSourceAmount] = useState("");
  const [newFundItem, setNewFundItem] = useState("");
  const [newFundAmount, setNewFundAmount] = useState("");

  const totalRaised = fundingSources.reduce((sum, source) => sum + (source.amount || 0), 0);
  const totalPercentage = revenueStreams.reduce((sum, stream) => sum + (stream.percentage || 0), 0);

  // Calculate metrics (not stored, just displayed)
  const cac = projectData.channels?.cac || 0;
  const ltv = arpu && customerLifetime && grossMargin 
    ? arpu * customerLifetime * (grossMargin / 100) 
    : 0;
  const ltvCacRatio = ltv && cac ? ltv / cac : 0;
  const paybackPeriod = cac && arpu && grossMargin 
    ? cac / (arpu * (grossMargin / 100)) 
    : 0;
  const monthlyBurn = fundingRaised && currentRunway 
    ? fundingRaised / currentRunway 
    : 0;

  const handleAddStream = () => {
    const percentage = parseFloat(newStreamPercentage);
    if (newStreamType && newStreamDescription && newStreamPercentage && percentage > 0) {
      updateEconomics({ 
        revenueStreams: [...revenueStreams, { 
          type: newStreamType, 
          description: newStreamDescription,
          percentage: percentage 
        }] 
      });
      setNewStreamType("");
      setNewStreamDescription("");
      setNewStreamPercentage("");
    }
  };

  const handleRemoveStream = (index: number) => {
    updateEconomics({ revenueStreams: revenueStreams.filter((_, i) => i !== index) });
  };

  const handleAddSource = () => {
    const finalType = newSourceType === t('fundingTypes.other') ? newSourceCustomType : newSourceType;
    if (finalType && newSourceAmount) {
      updateEconomics({ 
        fundingSources: [{ type: finalType, amount: parseFloat(newSourceAmount) || 0 }, ...fundingSources] 
      });
      setNewSourceType("");
      setNewSourceCustomType("");
      setNewSourceAmount("");
    }
  };

  const handleRemoveSource = (index: number) => {
    updateEconomics({ fundingSources: fundingSources.filter((_, i) => i !== index) });
  };

  const handleAddFundItem = () => {
    const amount = parseFloat(newFundAmount);
    if (newFundItem && newFundAmount && amount >= 0) {
      updateEconomics({ 
        useOfFunds: [{ item: newFundItem, amount: amount }, ...useOfFunds] 
      });
      setNewFundItem("");
      setNewFundAmount("");
    }
  };

  const handleRemoveFundItem = (index: number) => {
    updateEconomics({ useOfFunds: useOfFunds.filter((_, i) => i !== index) });
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
            <Label htmlFor="projectedRevenue12Months" className="text-sm font-semibold">
              {t('projectedRevenueLabel')} <span className="text-red-500">*</span>
            </Label>
            <InputGroup className="h-12">
              <InputGroupAddon>€</InputGroupAddon>
              <InputGroupInput
                id="projectedRevenue12Months"
                type="number"
                placeholder={t('projectedRevenuePlaceholder')}
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={projectedRevenue12Months || ""}
                onChange={(e) => {
                  handleNonNegativeNumberInput(e.target.value, (num) => {
                    updateEconomics({ projectedRevenue12Months: num });
                  });
                }}
                min="0"
              />
            </InputGroup>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${projectedRevenue12Months ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {projectedRevenue12Months > 0 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('projectedRevenueGuidelines.1')}</p>
              <p>• {t('projectedRevenueGuidelines.2')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('projectedRevenueExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('revenueStreamsLabel')} <span className="text-red-500">*</span>
            </Label>
            
            {revenueStreams.length > 0 && (
              <div className="space-y-1.5">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="relative flex flex-col lg:flex-row lg:items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm pr-10">
                    <span className="font-semibold min-w-[140px]">{stream.type}</span>
                    <div className='flex items-center gap-2'>
                      <span className="flex-1 text-slate-600">{stream.description}</span>
                      <span className="text-slate-600 min-w-[40px] text-right">{stream.percentage}%</span>
                    </div>
                    <button
                      type="button"
                      className="hover:bg-slate-200 rounded-full p-0.5 absolute top-1/2 -translate-y-1/2 right-2"
                      onClick={() => handleRemoveStream(index)}
                    >
                      <IoMdClose className="size-6 text-slate-500" />
                    </button>
                  </div>
                ))}
                <div className="text-xs font-semibold text-slate-700 pl-2">
                  {t('total')}: {totalPercentage}% {totalPercentage !== 100 && <span className="text-red-500">{t('shouldBe100')}</span>}
                </div>
              </div>
            )}

            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex gap-2 flex-1">
                <Select 
                  value={newStreamType} 
                  onValueChange={setNewStreamType}
                  onOpenChange={setIsSelectOpen}
                >
                  <SelectTrigger className="!h-10 flex-1 md:w-[180px]">
                    <SelectValue placeholder={t('type')} />
                  </SelectTrigger>
                  <SelectContent>
                    {revenueStreamTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  placeholder={t('description')}
                  className="!h-10 flex-1"
                  value={newStreamDescription}
                  onChange={(e) => setNewStreamDescription(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 w-full md:w-auto">
                <InputGroup className="h-10 flex-1 md:w-[90px]">
                  <InputGroupInput
                    type="number"
                    placeholder="0"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                    value={newStreamPercentage}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '' || (parseFloat(value) > 0 && parseFloat(value) <= 100)) {
                        setNewStreamPercentage(value);
                      }
                    }}
                    min="0.01"
                    max="100"
                    step="0.01"
                  />
                  <InputGroupAddon align="inline-end">%</InputGroupAddon>
                </InputGroup>
                
                <Button
                  type="button"
                  className="h-10 px-3 text-sm whitespace-nowrap"
                  onClick={handleAddStream}
                  disabled={!newStreamType || !newStreamDescription || !newStreamPercentage || parseFloat(newStreamPercentage) <= 0}
                >
                  {t('add')}
                </Button>
              </div>
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${revenueStreams.length > 0 || isSelectOpen ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {revenueStreams.length > 0 && totalPercentage === 100 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('revenueStreamsGuidelines.1')}</p>
              <p>• {t('revenueStreamsGuidelines.2')}</p>
              <p>• {t('revenueStreamsGuidelines.3')}</p>
              <p>• {t('revenueStreamsGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('revenueStreamsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="revenuePricing" className="text-sm font-semibold">
              {t('revenuePricingLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="revenuePricing"
              placeholder={t('revenuePricingPlaceholder')}
              className="min-h-[120px]"
              value={revenuePricing}
              onChange={(e) => updateEconomics({ revenuePricing: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${revenuePricing ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {revenuePricing && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('revenuePricingGuidelines.1')}</p>
              <p>• {t('revenuePricingGuidelines.2')}</p>
              <p>• {t('revenuePricingGuidelines.3')}</p>
              <p>• {t('revenuePricingGuidelines.4')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('revenuePricingExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="costBreakdown" className="text-sm font-semibold">
              {t('costBreakdownLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="costBreakdown"
              placeholder={t('costBreakdownPlaceholder')}
              className="min-h-[140px]"
              value={costBreakdown}
              onChange={(e) => updateEconomics({ costBreakdown: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${costBreakdown ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {costBreakdown && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('costBreakdownGuidelines.1')}</p>
              <p>• {t('costBreakdownGuidelines.2')}</p>
              <p>• {t('costBreakdownGuidelines.3')}</p>
              <p>• {t('costBreakdownGuidelines.4')}</p>
              <p>• {t('costBreakdownGuidelines.5')}</p>
              <p>• {t('costBreakdownGuidelines.6')}</p>
              <p>• {t('costBreakdownGuidelines.7')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('costBreakdownExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('unitEconomicsLabel')} <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('grossMargin')}</Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  type="number"
                  placeholder={t('grossMarginPlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={grossMargin || ""}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === '' || (parseFloat(value) >= 0 && parseFloat(value) <= 100)) {
                      updateEconomics({ grossMargin: parseFloat(value) || 0 });
                    }
                  }}
                  min="0"
                  max="100"
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('arpu')}</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder={t('arpuPlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={arpu || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateEconomics({ arpu: num });
                    });
                  }}
                  min="0"
                />
                <InputGroupAddon align="inline-end">{t('perMonth')}</InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('customerLifetime')}</Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  type="number"
                  placeholder={t('customerLifetimePlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={customerLifetime || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateEconomics({ customerLifetime: num });
                    });
                  }}
                  min="0"
                />
                <InputGroupAddon align="inline-end">{t('months')}</InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('contributionMargin')}</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder={t('contributionMarginPlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={contributionMargin || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateEconomics({ contributionMargin: num });
                    });
                  }}
                  min="0"
                />
              </InputGroup>
              <p className="text-xs text-slate-500">{t('contributionMarginHint')}</p>
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(grossMargin || arpu || customerLifetime || contributionMargin) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(grossMargin > 0 && arpu > 0 && customerLifetime > 0 && contributionMargin > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('unitEconomicsGuidelines.1')}</p>
              <p>• {t('unitEconomicsGuidelines.2')}</p>
              <p>• {t('unitEconomicsGuidelines.3')}</p>
              <p>• {t('unitEconomicsGuidelines.4')}</p>
              <p>• {t('unitEconomicsGuidelines.5')}</p>
              <p>• {t('unitEconomicsGuidelines.6')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('unitEconomicsExample')}
            </div>
        {(ltv > 0 || ltvCacRatio > 0 || paybackPeriod > 0 || monthlyBurn > 0) && (
          <div className="text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-600">{t('unitEconomicsCalculated')}</p>
            {ltv > 0 && <p>• LTV: €{ltv.toFixed(2)}</p>}
            {ltvCacRatio > 0 && cac > 0 && (
              <p>• {t('ltvCacRatio')}: {ltvCacRatio.toFixed(1)}x {ltvCacRatio >= 3 ? t('excellent') : ltvCacRatio >= 2 ? t('acceptable') : t('needsImprovement')}</p>
            )}
            {paybackPeriod > 0 && (
              <p>• {t('paybackPeriod')}: {paybackPeriod.toFixed(1)} {t('months')} {paybackPeriod <= 12 ? t('excellent') : paybackPeriod <= 18 ? t('acceptable') : t('tooLong')}</p>
            )}
            {monthlyBurn > 0 && <p>• {t('monthlyBurnRate')}: €{monthlyBurn.toFixed(0)}</p>}
          </div>
        )}
          </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('fundingRunwayLabel')} <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('amountRaised')}</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder={t('amountRaisedPlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={fundingRaised || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateEconomics({ fundingRaised: num });
                    });
                  }}
                  min="0"
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-900">{t('fundingSources')} <span className="text-red-500">*</span></Label>
              <p className="text-xs text-slate-500">{t('fundingSourcesHint')}</p>
              
              <div className="border border-slate-200 overflow-hidden rounded-md">
                <div className="p-2 bg-white border-b border-slate-200">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Select value={newSourceType} onValueChange={setNewSourceType}>
                      <SelectTrigger className="h-10 flex-1">
                        <SelectValue placeholder={t('selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {fundingTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2 w-full md:w-auto">
                      <InputGroup className="h-10 flex-1 md:w-32">
                        <InputGroupAddon>€</InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          placeholder={t('amount')}
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                          value={newSourceAmount}
                          onChange={createNonNegativeNumberHandler(setNewSourceAmount)}
                          min="0"
                        />
                      </InputGroup>
                      <Button
                        type="button"
                        className="h-10 px-4 text-sm whitespace-nowrap"
                        onClick={handleAddSource}
                        disabled={(!newSourceType || (newSourceType === t('fundingTypes.other') && !newSourceCustomType)) || !newSourceAmount}
                      >
                        {t('add')}
                      </Button>
                    </div>
                  </div>
                  {newSourceType === t('fundingTypes.other') && (
                    <Input
                      placeholder={t('specifySourceType')}
                      className="!h-10 mt-2"
                      value={newSourceCustomType}
                      onChange={(e) => setNewSourceCustomType(e.target.value)}
                    />
                  )}
                </div>

                {fundingSources.length > 0 && (
                  <div className="divide-y divide-slate-200">
                    {fundingSources.map((source, index) => (
                      <div key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <span className="text-xs font-semibold text-slate-500 min-w-[24px]">{index + 1}.</span>
                        <span className="text-sm font-medium text-slate-900 min-w-[120px]">{source.type}</span>
                        <span className="text-sm text-slate-700 flex-1">€{source.amount.toLocaleString()}</span>
                        <button
                          type="button"
                          className="group/btn ml-4 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                          onClick={() => handleRemoveSource(index)}
                        >
                          <IoMdClose className="h-4 w-4 text-blue-600 group-hover/btn:text-red-600" />
                        </button>
                      </div>
                    ))}
                    <div className="px-4 py-2 bg-slate-50 border-t border-slate-200">
                      <span className="text-xs font-semibold text-slate-700">{t('total')}: €{totalRaised.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('amountSeeking')}</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder={t('amountSeekingPlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={amountSeeking || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateEconomics({ amountSeeking: num });
                    });
                  }}
                  min="0"
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-slate-900">{t('useOfFunds')} <span className="text-red-500">*</span></Label>
              <p className="text-xs text-slate-500">{t('useOfFundsHint')}</p>
              
              <div className="border border-slate-200 overflow-hidden rounded-md">
                <div className="p-2 bg-white border-b border-slate-200">
                  <div className="flex flex-col md:flex-row gap-2">
                    <Input
                      placeholder={t('useOfFundsPlaceholder')}
                      className="!min-h-10 flex-1"
                      value={newFundItem}
                      onChange={(e) => setNewFundItem(e.target.value)}
                    />
                    <div className="flex gap-2 w-full md:w-auto">
                      <InputGroup className="h-10 flex-1 md:w-32">
                        <InputGroupAddon>€</InputGroupAddon>
                        <InputGroupInput
                          type="number"
                          placeholder={t('amount')}
                          className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                          value={newFundAmount}
                          onChange={createNonNegativeNumberHandler(setNewFundAmount)}
                          min="0"
                        />
                      </InputGroup>
                      <Button
                        type="button"
                        className="h-10 px-4 text-sm whitespace-nowrap"
                        onClick={handleAddFundItem}
                        disabled={!newFundItem || !newFundAmount}
                      >
                        {t('add')}
                      </Button>
                    </div>
                  </div>
                </div>

                {useOfFunds.length > 0 && (
                  <div className="divide-y divide-slate-200">
                    {useOfFunds.map((fund, index) => (
                      <div key={index} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors">
                        <span className="text-xs font-semibold text-slate-500 min-w-[24px]">{index + 1}.</span>
                        <span className="text-sm font-medium text-slate-900 flex-1">{fund.item}</span>
                        <span className="text-sm text-slate-700">€{fund.amount.toLocaleString()}</span>
                        <button
                          type="button"
                          className="group/btn ml-4 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                          onClick={() => handleRemoveFundItem(index)}
                      >
                        <IoMdClose className="h-4 w-4 text-blue-600 group-hover/btn:text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">{t('currentRunway')}</Label>
              <InputGroup className="h-10">
                <InputGroupInput
                  type="number"
                  placeholder={t('currentRunwayPlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={currentRunway || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateEconomics({ currentRunway: num });
                    });
                  }}
                  min="0"
                />
                <InputGroupAddon align="inline-end">{t('months')}</InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(fundingRaised > 0 || fundingSources.length > 0 || amountSeeking || useOfFunds.length > 0) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(fundingRaised > 0 && fundingSources.length > 0 && amountSeeking > 0 && useOfFunds.length > 0 && currentRunway > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('fundingRunwayGuidelines.1')}</p>
              <p>• {t('fundingRunwayGuidelines.2')}</p>
              <p>• {t('fundingRunwayGuidelines.3')}</p>
              <p>• {t('fundingRunwayGuidelines.4')}</p>
              <p>• {t('fundingRunwayGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('fundingRunwayExample')}
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
