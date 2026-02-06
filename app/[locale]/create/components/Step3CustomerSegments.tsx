"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

const marketSizeFields = [
  { id: 'tam', label: 'TAM (Total Addressable Market)', placeholder: '500' },
  { id: 'sam', label: 'SAM (Serviceable Available Market)', placeholder: '100' },
  { id: 'som', label: 'SOM (Serviceable Obtainable Market)', placeholder: '10' },
];

const primarySegmentGuidelines = [
  "Clear description of target audience (B2B/B2C)",
  "Demographics (age, gender, income) for B2C",
  "Firmographics (company size, industry, role) for B2B",
  "Geography",
  "Behavioral characteristics",
];

const marketSizeGuidelines = [
  "TAM - total market size globally",
  "SAM - your accessible market",
  "SOM - realistic share in 3 years",
  "Always specify calculation methodology!",
];

const geographyGuidelines = [
  "Which countries/regions are your customers in?",
  "Are there cultural/language barriers?",
  "Is localization required?",
  "Which regions are priority at launch?",
];

const availableMarkets = ["Ukraine", "Poland", "Germany", "Kazakhstan", "USA", "Other"];

const willingnessToPayGuidelines = [
  "Did you conduct surveys/interviews?",
  "Do you have Letters of Intent (LOI)?",
  "Did you test pricing?",
  "What average check is customer ready to pay?",
  "How often (one-time/subscription)?",
];

export function Step3CustomerSegments() {
  const { projectData, updateCustomerSegments } = useProjectStore();
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
        <h2 className="text-2xl font-bold text-black">Customer Segments</h2>
        <p className="text-sm text-slate-600">Define your target audience</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="primarySegment" className="text-sm font-semibold">
              2.1. Primary customer segment <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="primarySegment"
              placeholder="Describe your target audience..."
              className="min-h-[120px]"
              value={primarySegment}
              onChange={(e) => updateCustomerSegments({ primarySegment: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${primarySegment ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {primarySegment && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {primarySegmentGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Pre-seed and seed stage founders of tech startups (SaaS, marketplace, fintech), seeking €200K-€2M investments. Age 28-45. Location: Europe and English-speaking countries."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              2.2. Market size <span className="text-red-500">*</span>
            </Label>
            
            {marketSizeFields.map((field) => (
              <div key={field.id} className="space-y-2">
                <Label htmlFor={field.id} className="text-xs text-slate-600">
                  {field.label}
                </Label>
                <div className="grid grid-cols-[140px_1fr] gap-2">
                  <InputGroup className="h-10">
                    <InputGroupAddon>€</InputGroupAddon>
                    <InputGroupInput
                      id={field.id}
                      type="number"
                      placeholder={field.placeholder}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={marketSize[field.id as keyof typeof marketSize] || ""}
                      onChange={(e) => updateCustomerSegments({ 
                        marketSize: { ...marketSize, [field.id]: parseFloat(e.target.value) || 0 } 
                      })}
                      min="0"
                    />
                    <InputGroupAddon align="inline-end">M</InputGroupAddon>
                  </InputGroup>
                  <Input
                    placeholder="Calculation description (e.g., 15K companies × €10K budget)"
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
              Guidelines
              {(marketSize.tam > 0 && marketSize.sam > 0 && marketSize.som > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {marketSizeGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: TAM: €500M (500,000 early-stage startups globally × €1,000 average check) • SAM: €100M (European tech startup market) • SOM: €10M (10,000 clients × €99/month × 10 months in first year)
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              2.3. Geographic features <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Primary Markets</Label>
              <div className="flex flex-wrap gap-3">
                {availableMarkets.map((market) => (
                  <label key={market} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={geography.markets?.includes(market) || false}
                      onCheckedChange={() => handleMarketToggle(market)}
                    />
                    <span className="text-sm">{market}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Focus on UK first (English, 15K target companies)..."
                className="min-h-[80px]"
                value={geography.notes}
                onChange={(e) => updateCustomerSegments({ geography: { ...geography, notes: e.target.value } })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(geography.markets?.length > 0 || geography.notes) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {(geography.markets?.length > 0 && geography.notes) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {geographyGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Focus on Europe (UK, Germany, France, Netherlands) due to high startup density. English is sufficient for 70% of market. Localization to German and French planned for Year 2."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              2.4. Willingness to pay <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Customer Validation Evidence</Label>
              <Textarea
                placeholder="Conducted 80 interviews with HR managers. 70% said they'd pay €50-150/mo for this..."
                className="min-h-[100px]"
                value={willingnessToPay.evidence}
                onChange={(e) => updateCustomerSegments({ willingnessToPay: { ...willingnessToPay, evidence: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs text-slate-600">Average Deal Size</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  type="number"
                  placeholder="99"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={willingnessToPay.averageDealSize || ""}
                  onChange={(e) => updateCustomerSegments({ willingnessToPay: { ...willingnessToPay, averageDealSize: parseFloat(e.target.value) || 0 } })}
                  min="0"
                />
                <InputGroupAddon align="inline-end">per month</InputGroupAddon>
              </InputGroup>
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(willingnessToPay.evidence || willingnessToPay.averageDealSize) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {(willingnessToPay.evidence && willingnessToPay.averageDealSize > 0) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              {willingnessToPayGuidelines.map((guideline, idx) => (
                <p key={idx}>• {guideline}</p>
              ))}
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Conducted 100 interviews with founders. 65% ready to pay €50-150 for analysis. Launched landing page: 500 registrations, 50 prepayments at €99. Average LTV: €1,188 (12 months × €99)."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Investors want to see market validation. Include specific numbers from your research.
          </p>
        </div>
      </div>
    </div>
  );
}
