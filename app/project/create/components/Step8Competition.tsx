"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/useProjectStore";

export function Step8Competition() {
  const { projectData, updateCompetition } = useProjectStore();
  const competition = projectData.competition || {
    directCompetitors: "",
    indirectCompetitors: "",
    whyChooseYou: "",
    defensibility: "",
  };
  const { directCompetitors, indirectCompetitors, whyChooseYou, defensibility } = competition;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Competition</h2>
        <p className="text-sm text-slate-600">Analyze your competitive landscape</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="directCompetitors" className="text-sm font-semibold">
              7.1. Direct competitors <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="directCompetitors"
              placeholder="List 3-5 direct competitors with strengths, weaknesses, size..."
              className="min-h-[120px]"
              value={directCompetitors}
              onChange={(e) => updateCompetition({ directCompetitors: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${directCompetitors ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Name 3-5 direct competitors</p>
              <p>• What do they do well?</p>
              <p>• Their size (users, revenue, funding)?</p>
              <p>• Their weaknesses?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "1. Carta (YC W11, $7.4B valuation) - Strengths: Brand, cap table management. Weaknesses: Complex, expensive ($2K+/year), not for pre-seed. 2. Pulley ($40M raised) - Strengths: Modern UI, simpler than Carta. Weaknesses: Focus on cap table, no AI analysis."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="indirectCompetitors" className="text-sm font-semibold">
              7.2. Indirect competitors/alternatives <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="indirectCompetitors"
              placeholder="What else can customers use instead of you?"
              className="min-h-[100px]"
              value={indirectCompetitors}
              onChange={(e) => updateCompetition({ indirectCompetitors: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${indirectCompetitors ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• What else can customers use instead?</p>
              <p>• Excel templates?</p>
              <p>• Consultants?</p>
              <p>• DIY approach?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Indirect: 1) Business plan templates (Bplans.com - free but time-consuming), 2) Startup consultants (€5K-20K, slow), 3) Accelerators (free but need to pass selection), 4) Just guessing (free, risky)."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="whyChooseYou" className="text-sm font-semibold">
              7.3. Why choose you over competitors <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="whyChooseYou"
              placeholder="Your unique advantage, price/value, speed, quality..."
              className="min-h-[120px]"
              value={whyChooseYou}
              onChange={(e) => updateCompetition({ whyChooseYou: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${whyChooseYou ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Your unique advantage?</p>
              <p>• Price/value proposition?</p>
              <p>• Speed/convenience?</p>
              <p>• Quality/accuracy?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Choose us because: 1) AI-powered in 30 sec vs 2 weeks consultants, 2) €99 vs €5,000 consulting vs €2,000 Carta, 3) Concrete action plan vs generic templates, 4) 6 expert perspectives vs single opinion, 5) Industry benchmarks (1000+ startups data). Positioning: 'Carta for pre-seed startups'."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="defensibility" className="text-sm font-semibold">
              7.4. Competitive defensibility <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="defensibility"
              placeholder="What prevents competitors from copying you?"
              className="min-h-[100px]"
              value={defensibility}
              onChange={(e) => updateCompetition({ defensibility: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${defensibility ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Network effects?</p>
              <p>• Data moat?</p>
              <p>• Brand?</p>
              <p>• Patents?</p>
              <p>• Speed of execution?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Protection: 1) Proprietary dataset (1000+ analyses, growing daily), 2) Expert prompt engineering (6 months R&D), 3) First-mover in pre-seed segment, 4) Community (founders helping founders), 5) Integration partnerships (accelerators). Window: 12-18 months before copying."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Show clear differentiation and sustainable competitive advantages.
          </p>
        </div>
      </div>
    </div>
  );
}
