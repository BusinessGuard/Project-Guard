"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";

export function Step10Growth() {
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
        <h2 className="text-2xl font-bold text-black">Growth Forecast</h2>
        <p className="text-sm text-slate-600">Define your scaling strategy and targets</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="traction" className="text-sm font-semibold">
              9.1. Current Traction <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="traction"
              placeholder="Current users/customers, revenue, growth metrics, key achievements..."
              className="min-h-[100px]"
              value={traction}
              onChange={(e) => updateGrowth({ traction: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${traction ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {traction && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Current users/customers and revenue</p>
              <p>• Growth metrics (MoM, retention, churn, NPS)</p>
              <p>• Key achievements and milestones</p>
              <p>• For pre-revenue: signups, pilots, validation</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>B2B SaaS:</strong> "120 paying customers, €11.8K MRR, +25% MoM growth for last 3 months, 3.5% monthly churn, NPS 65, CAC payback 4.2 months"
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Marketplace:</strong> "€45K GMV/month, 320 active buyers, 45 active sellers, 15% take rate, 40% repeat purchase rate, 3x growth in last quarter"
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Pre-revenue:</strong> "2,500 signups, 80 customer interviews completed, 5 pilot customers using for free (3 ready to pay), 12 LOIs worth €1,200 MRR potential"
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="scalingPlan" className="text-sm font-semibold">
              9.2. Scaling plan <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="scalingPlan"
              placeholder="Growth strategy, scaling channels, international expansion, new products..."
              className="min-h-[120px]"
              value={scalingPlan}
              onChange={(e) => updateGrowth({ scalingPlan: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${scalingPlan ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {scalingPlan && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Growth strategy (product-led, sales-led, community-led)?</p>
              <p>• Which channels will you scale?</p>
              <p>• International expansion?</p>
              <p>• New product lines?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Months 1-6: Product-led growth (freemium model, viral referral 20% discount, SEO 50 blog posts). Months 7-12: Sales-assisted (hire VP Sales, outbound to YC/Techstars, accelerator partnerships). Year 2: International expansion (German/French localization, US market via YC network)."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="newMarkets" className="text-sm font-semibold">
              9.3. New market potential <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="newMarkets"
              placeholder="Adjacent markets, different segments, geographic expansion, product extensions..."
              className="min-h-[100px]"
              value={newMarkets}
              onChange={(e) => updateGrowth({ newMarkets: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${newMarkets ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {newMarkets && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Adjacent markets?</p>
              <p>• Different customer segments?</p>
              <p>• Geographic expansion?</p>
              <p>• Product extensions?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Year 1: European pre-seed startups. Year 2: US market (500K startups), Seed/Series A stage ($199/month plan). Year 3: SMB market (brick-and-mortar businesses), White-label for banks/accelerators (B2B2C model)."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="paybackPeriod" className="text-sm font-semibold">
              9.4. Payback period <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="paybackPeriod"
              placeholder="When break-even? When ROI for investors? IRR?"
              className="min-h-[100px]"
              value={paybackPeriod}
              onChange={(e) => updateGrowth({ paybackPeriod: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${paybackPeriod ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {paybackPeriod && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• When will you reach break-even?</p>
              <p>• When will you return invested capital?</p>
              <p>• IRR for investors?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Break-even: month 18 (85 customers, €8.4K MRR). Payback period for €200K seed: month 30 (at 30% net margin, €6K profit/month after break-even). Projected IRR for seed investors: 35% annually with exit at Year 5 at €50M valuation."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              9.5. Targets <span className="text-red-500">*</span>
            </Label>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600 font-semibold">12 Months</Label>
              <Textarea
                placeholder="150 customers, €15K MRR, 5 team, 0.5% SAM..."
                className="min-h-[70px]"
                value={targets12Months}
                onChange={(e) => updateGrowth({ targets12Months: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600 font-semibold">24 Months</Label>
              <Textarea
                placeholder="600 customers, €60K MRR, 12 team, profitable (20% margin), 2% SAM..."
                className="min-h-[70px]"
                value={targets24Months}
                onChange={(e) => updateGrowth({ targets24Months: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600 font-semibold">36 Months</Label>
              <Textarea
                placeholder="2,000 customers, €200K MRR, 25 team, 30% margin, 5% SAM..."
                className="min-h-[70px]"
                value={targets36Months}
                onChange={(e) => updateGrowth({ targets36Months: e.target.value })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${(targets12Months || targets24Months || targets36Months) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black flex items-center gap-2">
              Guidelines
              {(targets12Months && targets24Months && targets36Months) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Users/customers</p>
              <p>• Revenue/MRR (and ARR)</p>
              <p>• Team size</p>
              <p>• Market share (% of SAM)</p>
              <p>• Profitability (break-even, margins)</p>
              <p>• Funding milestones</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example 12 mo: "150 customers, €15K MRR (€180K ARR), 5 team, break-even: NO, 0.5% SAM"
            </div>
            <div className="text-slate-600 italic pt-2">
              Example 24 mo: "600 customers, €60K MRR (€720K ARR), 12 team, profitable (20% margin), 2% SAM, Series A €1.5M"
            </div>
            <div className="text-slate-600 italic pt-2">
              Example 36 mo: "2,000 customers, €200K MRR (€2.4M ARR), 25 team, 30% margin (€720K profit/year), 5% SAM"
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Show ambitious but realistic growth targets with clear path to profitability.
          </p>
        </div>
      </div>
    </div>
  );
}
