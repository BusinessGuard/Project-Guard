"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/useProjectStore";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

export function Step5Economics() {
  const { projectData, updateEconomics } = useProjectStore();
  const economics = projectData.economics || {
    projectedRevenue12Months: "",
    revenueBreakdown: "",
    costBreakdown: "",
    grossMargin: "",
    breakEven: "",
    funding: "",
  };
  const { projectedRevenue12Months, revenueBreakdown, costBreakdown, grossMargin, breakEven, funding } = economics;

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
            <div className="space-y-2">
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  id="projectedRevenue12Months"
                  type="number"
                  placeholder="120000"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={projectedRevenue12Months}
                  onChange={(e) => updateEconomics({ projectedRevenue12Months: e.target.value })}
                  min="0"
                />
              </InputGroup>
              <Textarea
                placeholder="Describe monthly breakdown and assumptions..."
                className="min-h-[100px]"
                value={revenueBreakdown}
                onChange={(e) => updateEconomics({ revenueBreakdown: e.target.value })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${projectedRevenue12Months ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• First year revenue</p>
              <p>• Monthly breakdown (if available)</p>
              <p>• What assumptions are you using?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "€120,000 in first year. Month 1-3: €2K/month (20 clients × €99). Month 4-6: €5K/month (50 clients). Month 7-12: €10K-15K/month (100-150 clients). Assumption: 15% MoM growth, 10% churn."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="costBreakdown" className="text-sm font-semibold">
              4.2. Main cost categories <span className="text-red-500">*</span>
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
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
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
          <div className="space-y-2">
            <Label htmlFor="grossMargin" className="text-sm font-semibold">
              4.3. Product gross margin <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="grossMargin"
              placeholder="Calculate and explain your gross margin..."
              className="min-h-[100px]"
              value={grossMargin}
              onChange={(e) => updateEconomics({ grossMargin: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${grossMargin ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Gross Margin = (Revenue - COGS) / Revenue × 100%</p>
              <p>• COGS = variable costs per unit</p>
              <p>• SaaS: typically 80-90%</p>
              <p>• E-commerce: 30-60%</p>
              <p>• Marketplace: 60-80%</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Gross margin: 85%. Revenue per customer: €99/month. COGS: €15 (OpenAI API €10 + Stripe fees €5). Contribution margin: €84/customer."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="breakEven" className="text-sm font-semibold">
              4.4. Break-even point <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="breakEven"
              placeholder="When will you reach break-even? How many customers? What revenue?"
              className="min-h-[100px]"
              value={breakEven}
              onChange={(e) => updateEconomics({ breakEven: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${breakEven ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Which month from launch?</p>
              <p>• How many customers needed?</p>
              <p>• What revenue level?</p>
              <p>• Formula: Break-even = Fixed Costs / Contribution Margin</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Break-even at month 18. Need 85 paying customers (€8,415 MRR). With current burn rate €7,200 and contribution margin €84. Plan to achieve through hiring VP Sales and scaling outreach."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="funding" className="text-sm font-semibold">
              4.5. Funding & runway <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="funding"
              placeholder="How much raised? From whom? How much seeking? Use of funds? Current runway?"
              className="min-h-[140px]"
              value={funding}
              onChange={(e) => updateEconomics({ funding: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${funding ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• How much already raised?</p>
              <p>• From whom (bootstrapped, angels, VC, grants)?</p>
              <p>• How much more seeking?</p>
              <p>• What will funds be used for?</p>
              <p>• Current runway (months)?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Raised: €50,000 (€30K bootstrapped + €20K angel at 5% equity). Seeking: €200K seed. Use: €100K for 12-month runway, €50K hiring (VP Sales + developer), €30K marketing, €20K buffer. Current runway: 7 months."
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
