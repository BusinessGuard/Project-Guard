"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/useProjectStore";

export function Step10Growth() {
  const { projectData, updateGrowth } = useProjectStore();
  const growth = projectData.growth || {
    scalingPlan: "",
    newMarkets: "",
    paybackPeriod: "",
    targets: "",
  };
  const { scalingPlan, newMarkets, paybackPeriod, targets } = growth;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Growth Forecast</h2>
        <p className="text-sm text-slate-600">Define your scaling strategy and targets</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="scalingPlan" className="text-sm font-semibold">
              9.1. Scaling plan <span className="text-red-500">*</span>
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
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
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
              9.2. New market potential <span className="text-red-500">*</span>
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
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
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
              9.3. Payback period <span className="text-red-500">*</span>
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
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
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
          <div className="space-y-2">
            <Label htmlFor="targets" className="text-sm font-semibold">
              9.4. Targets (12/24/36 months) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="targets"
              placeholder="Users, revenue, team size, market share, profitability targets..."
              className="min-h-[140px]"
              value={targets}
              onChange={(e) => updateGrowth({ targets: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${targets ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Users/customers</p>
              <p>• Revenue/MRR</p>
              <p>• Team size</p>
              <p>• Market share</p>
              <p>• Profitability</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Month 12: 150 customers, €15K MRR (€180K ARR), 5 team, 0.5% SAM. Month 24: 600 customers, €60K MRR (€720K ARR), 12 team, profitable (20% margin), 2% SAM, Series A €1.5M. Month 36: 2,000 customers, €200K MRR (€2.4M ARR), 25 team, 30% margin (€720K profit/year), 5% SAM."
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
