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
import { useState, useEffect } from "react";

const fundingTypes = ["Bootstrapped", "Angel investors", "VC", "Grants", "Accelerator", "Other"];
const revenueStreamTypes = ["Subscription", "One-time payment", "Usage-based", "Commission/Marketplace", "Advertising", "Licensing", "Other"];

export function Step5Economics() {
  const { projectData, updateEconomics } = useProjectStore();
  
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
    if (newStreamType && newStreamDescription && newStreamPercentage) {
      updateEconomics({ 
        revenueStreams: [...revenueStreams, { 
          type: newStreamType, 
          description: newStreamDescription,
          percentage: parseFloat(newStreamPercentage) || 0 
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
    const finalType = newSourceType === "Other" ? newSourceCustomType : newSourceType;
    if (finalType && newSourceAmount) {
      updateEconomics({ 
        fundingSources: [...fundingSources, { type: finalType, amount: parseFloat(newSourceAmount) || 0 }] 
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
    if (newFundItem && newFundAmount) {
      updateEconomics({ 
        useOfFunds: [...useOfFunds, { item: newFundItem, amount: parseFloat(newFundAmount) || 0 }] 
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
        <h2 className="text-2xl font-bold text-black">Revenue & Cost Structure</h2>
        <p className="text-sm text-slate-600">Define your financial model</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="projectedRevenue12Months" className="text-sm font-semibold">
              4.1. Projected revenue for 12 months <span className="text-red-500">*</span>
            </Label>
            <InputGroup className="h-12">
              <InputGroupAddon>€</InputGroupAddon>
              <InputGroupInput
                id="projectedRevenue12Months"
                type="number"
                placeholder="120000"
                className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                value={projectedRevenue12Months || ""}
                onChange={(e) => updateEconomics({ projectedRevenue12Months: parseFloat(e.target.value) || 0 })}
                min="0"
              />
            </InputGroup>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${projectedRevenue12Months ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {projectedRevenue12Months > 0 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• First year revenue projection</p>
              <p>• Based on pricing × expected customers</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "€120,000 (100 customers × €99/mo × 12 months)"
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              4.2. Revenue Streams <span className="text-red-500">*</span>
            </Label>
            
            {revenueStreams.length > 0 && (
              <div className="space-y-1.5">
                {revenueStreams.map((stream, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-md text-sm">
                    <span className="font-semibold min-w-[140px]">{stream.type}</span>
                    <span className="flex-1 text-slate-600">{stream.description}</span>
                    <span className="text-slate-600 min-w-[40px] text-right">{stream.percentage}%</span>
                    <button
                      type="button"
                      className="hover:bg-slate-200 rounded-full p-0.5"
                      onClick={() => handleRemoveStream(index)}
                    >
                      <IoMdClose className="h-4 w-4 text-slate-500" />
                    </button>
                  </div>
                ))}
                <div className="text-xs font-semibold text-slate-700 pl-2">
                  Total: {totalPercentage}% {totalPercentage !== 100 && <span className="text-red-500">(should be 100%)</span>}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Select value={newStreamType} onValueChange={setNewStreamType}>
                <SelectTrigger className="!h-10 py-0 w-[180px]">
                  <SelectValue placeholder="Type" />
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
                placeholder="Description (e.g., €99/mo subscription)"
                className="h-10 flex-1"
                value={newStreamDescription}
                onChange={(e) => setNewStreamDescription(e.target.value)}
              />
              
              <InputGroup className="h-10 w-[90px]">
                <InputGroupInput
                  type="number"
                  placeholder="0"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                  value={newStreamPercentage}
                  onChange={(e) => setNewStreamPercentage(e.target.value)}
                  min="0"
                  max="100"
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
              
              <Button
                type="button"
                className="h-10 px-3 text-sm"
                onClick={handleAddStream}
                disabled={!newStreamType || !newStreamDescription || !newStreamPercentage}
              >
                Add
              </Button>
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${revenueStreams.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {revenueStreams.length > 0 && totalPercentage === 100 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• List all revenue sources</p>
              <p>• Percentage of total revenue for each</p>
              <p>• Total should be 100%</p>
              <p>• Diversification reduces risk</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Subscription (80%): €99/mo per company. Setup fees (15%): €500 one-time. Consulting (5%): €150/hr for custom integrations."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="revenuePricing" className="text-sm font-semibold">
              4.3. Pricing Strategy <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="revenuePricing"
              placeholder="Describe your pricing model, tiers, and strategy..."
              className="min-h-[120px]"
              value={revenuePricing}
              onChange={(e) => updateEconomics({ revenuePricing: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${revenuePricing ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {revenuePricing && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Pricing model (freemium, tiered, usage-based)</p>
              <p>• Price points for each tier/plan</p>
              <p>• What's included in each tier?</p>
              <p>• Why this pricing? (competitor analysis, value-based)</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Tiered subscription: Starter €49/mo (5 users, basic features), Pro €99/mo (20 users, advanced analytics), Enterprise €299/mo (unlimited, custom integrations, dedicated support). Value-based pricing: customers save €500/mo in HR time, so €99 is 5x ROI."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="costBreakdown" className="text-sm font-semibold">
              4.4. Main cost categories <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="costBreakdown"
              placeholder="Break down your monthly/annual costs by category..."
              className="min-h-[140px]"
              value={costBreakdown}
              onChange={(e) => updateEconomics({ costBreakdown: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${costBreakdown ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {costBreakdown && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Personnel (salaries, contractors)</p>
              <p>• Technology (hosting, APIs, SaaS tools)</p>
              <p>• Marketing & Sales</p>
              <p>• Office/Operations</p>
              <p>• Legal/Admin</p>
              <p>• R&D</p>
              <p>• Mark fixed vs variable costs</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Monthly costs: Founders salary €3,000 (€1,500 × 2), Developer €2,000 (contractor), OpenAI API €500 (variable), Hosting €200, Marketing €1,000, SaaS tools €200, Legal/Admin €300. Total burn: €7,200/month."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              4.5. Key unit economics <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Gross Margin (%)</Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  type="number"
                  placeholder="80"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={grossMargin || ""}
                  onChange={(e) => updateEconomics({ grossMargin: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                />
                <InputGroupAddon align="inline-end">%</InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Average Revenue Per User (ARPU)</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="99"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={arpu || ""}
                  onChange={(e) => updateEconomics({ arpu: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
                <InputGroupAddon align="inline-end">per month</InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Customer Lifetime (months)</Label>
              <InputGroup className="h-12">
                <InputGroupInput
                  type="number"
                  placeholder="18"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={customerLifetime || ""}
                  onChange={(e) => updateEconomics({ customerLifetime: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
                <InputGroupAddon align="inline-end">months</InputGroupAddon>
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Contribution Margin per Customer</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="84"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={contributionMargin || ""}
                  onChange={(e) => updateEconomics({ contributionMargin: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </InputGroup>
              <p className="text-xs text-slate-500">Revenue per customer - COGS</p>
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${(grossMargin || arpu || customerLifetime || contributionMargin) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {(grossMargin > 0 && arpu > 0 && customerLifetime > 0 && contributionMargin > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Gross Margin = (Revenue - COGS) / Revenue × 100%</p>
              <p>• ARPU = Revenue ÷ Active Users</p>
              <p>• Customer Lifetime = 1 ÷ Churn Rate</p>
              <p>• Contribution Margin = Revenue per customer - COGS</p>
              <p>• LTV = ARPU × Customer Lifetime × Gross Margin</p>
              <p>• CAC is in Step 3 (Channels)</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Gross Margin: 85%, ARPU: €99/month, Lifetime: 18 months, Contribution: €84. LTV: €1,505 (€99 × 18 × 0.85)."
            </div>
          </div>
        </div>

        {(ltv > 0 || ltvCacRatio > 0 || paybackPeriod > 0 || monthlyBurn > 0) && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
            <h4 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
              📊 Unit Economics Summary (Auto-calculated)
            </h4>
            <div className="grid grid-cols-2 gap-4">
              {ltv > 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-sm text-slate-600 mb-1">Lifetime Value (LTV)</div>
                  <div className="text-2xl font-bold text-blue-900">€{ltv.toFixed(2)}</div>
                  <div className="text-xs text-slate-500 mt-1">ARPU × Lifetime × Margin</div>
                </div>
              )}
              
              {ltvCacRatio > 0 && cac > 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-sm text-slate-600 mb-1">LTV/CAC Ratio</div>
                  <div className={`text-2xl font-bold ${ltvCacRatio >= 3 ? 'text-green-600' : ltvCacRatio >= 2 ? 'text-orange-600' : 'text-red-600'}`}>
                    {ltvCacRatio.toFixed(1)}x
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {ltvCacRatio >= 3 ? '✅ Excellent' : ltvCacRatio >= 2 ? '⚠️ Acceptable' : '🔴 Needs improvement'}
                  </div>
                </div>
              )}
              
              {paybackPeriod > 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-sm text-slate-600 mb-1">Payback Period</div>
                  <div className={`text-2xl font-bold ${paybackPeriod <= 12 ? 'text-green-600' : paybackPeriod <= 18 ? 'text-orange-600' : 'text-red-600'}`}>
                    {paybackPeriod.toFixed(1)} mo
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {paybackPeriod <= 12 ? '✅ Excellent' : paybackPeriod <= 18 ? '⚠️ Acceptable' : '🔴 Too long'}
                  </div>
                </div>
              )}
              
              {monthlyBurn > 0 && (
                <div className="bg-white rounded-lg p-4 border border-blue-100">
                  <div className="text-sm text-slate-600 mb-1">Monthly Burn Rate</div>
                  <div className="text-2xl font-bold text-blue-900">€{monthlyBurn.toFixed(0)}</div>
                  <div className="text-xs text-slate-500 mt-1">Funding / Runway</div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              4.6. Funding & runway <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Amount Already Raised</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="50000"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={fundingRaised || ""}
                  onChange={(e) => updateEconomics({ fundingRaised: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Funding Sources</Label>
              
              {fundingSources.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {fundingSources.map((source, index) => (
                      <div key={index} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs">
                        <span className="font-medium">{source.type}</span>
                        <span className="text-slate-600">€{source.amount.toLocaleString()}</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-0.5 ml-0.5"
                          onClick={() => handleRemoveSource(index)}
                        >
                          <IoMdClose className="h-3 w-3 text-slate-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    Total: €{totalRaised.toLocaleString()}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <div className="flex gap-2">
                  <Select value={newSourceType} onValueChange={setNewSourceType}>
                    <SelectTrigger className="!h-10 flex-1 py-0">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {fundingTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <InputGroup className="h-10 w-32">
                    <InputGroupAddon>€</InputGroupAddon>
                    <InputGroupInput
                      type="number"
                      placeholder="0"
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                      value={newSourceAmount}
                      onChange={(e) => setNewSourceAmount(e.target.value)}
                      min="0"
                    />
                  </InputGroup>
                  <Button
                    type="button"
                    className="h-10 px-3 text-sm"
                    onClick={handleAddSource}
                    disabled={(!newSourceType || (newSourceType === "Other" && !newSourceCustomType)) || !newSourceAmount}
                  >
                    Add
                  </Button>
                </div>
                {newSourceType === "Other" && (
                  <Input
                    placeholder="Specify source type..."
                    className="h-10"
                    value={newSourceCustomType}
                    onChange={(e) => setNewSourceCustomType(e.target.value)}
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Amount Seeking</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="300000"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={amountSeeking || ""}
                  onChange={(e) => updateEconomics({ amountSeeking: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Use of Funds</Label>
              
              {useOfFunds.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {useOfFunds.map((fund, index) => (
                      <div key={index} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-full text-xs">
                        <span className="font-medium">{fund.item}</span>
                        <span className="text-slate-600">€{fund.amount.toLocaleString()}</span>
                        <button
                          type="button"
                          className="hover:bg-slate-200 rounded-full p-0.5 ml-0.5"
                          onClick={() => handleRemoveFundItem(index)}
                        >
                          <IoMdClose className="h-3 w-3 text-slate-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <Input
                  placeholder="e.g., Runway, Hiring"
                  className="h-10 flex-1"
                  value={newFundItem}
                  onChange={(e) => setNewFundItem(e.target.value)}
                />
                <InputGroup className="h-10 w-32">
                  <InputGroupAddon>€</InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="0"
                    className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-sm"
                    value={newFundAmount}
                    onChange={(e) => setNewFundAmount(e.target.value)}
                    min="0"
                  />
                </InputGroup>
                <Button
                  type="button"
                  className="h-10 px-3 text-sm"
                  onClick={handleAddFundItem}
                  disabled={!newFundItem || !newFundAmount}
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Current Runway (months)</Label>
              <InputGroup className="h-10">
                <InputGroupInput
                  type="number"
                  placeholder="11"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={currentRunway || ""}
                  onChange={(e) => updateEconomics({ currentRunway: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
                <InputGroupAddon align="inline-end">months</InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${(fundingRaised > 0 || fundingSources.length > 0 || amountSeeking || useOfFunds.length > 0) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {(fundingRaised > 0 && fundingSources.length > 0 && amountSeeking > 0 && useOfFunds.length > 0 && currentRunway > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Amount Raised: total funding received to date</p>
              <p>• Funding Sources: add each source with type and amount</p>
              <p>• Amount Seeking: target for next funding round</p>
              <p>• Use of Funds: detailed allocation plan</p>
              <p>• Runway: enter your calculated runway in months</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Sources: Bootstrapped €50K, Angel €25K. Seeking: €300K. Use: €150K runway, €80K hiring, €40K marketing, €30K buffer. Runway: 11 months."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Investors prioritize clear unit economics and realistic path to profitability.
          </p>
        </div>
      </div>
    </div>
  );
}
