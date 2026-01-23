"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/useProjectStore";

const riskFields = [
  { id: "technical", label: "8.1. Technical risks", placeholder: "Tech stack feasibility, API dependencies, technical debt, security..." },
  { id: "financial", label: "8.2. Financial risks", placeholder: "Runway, burn rate, revenue assumptions, funding risk..." },
  { id: "legal", label: "8.3. Legal/regulatory risks", placeholder: "Licensing, GDPR, third-party ToS, IP issues..." },
  { id: "market", label: "8.4. Market risks", placeholder: "Competition, timing, adoption barriers, economic downturn..." },
  { id: "team", label: "8.5. Team risks", placeholder: "Founder conflicts, key person dependency, hiring, burnout..." },
  { id: "mitigation", label: "8.6. Risk mitigation plan", placeholder: "Concrete strategies, timeline, budget..." },
];

export function Step9Risks() {
  const { projectData, updateRisks } = useProjectStore();
  const risks = projectData.risks || {
    technical: "",
    financial: "",
    legal: "",
    market: "",
    team: "",
    mitigation: "",
  };

  const guidelines = {
    technical: {
      points: ["Can you build with current tech stack?", "Third-party API dependencies?", "Technical debt?", "Security/privacy concerns?"],
      example: "Risks: 1) OpenAI API instability (mitigation: Claude fallback), 2) Scaling at >10K users (mitigation: async processing + Redis cache), 3) Data privacy for EU (mitigation: GDPR-compliant Supabase), 4) Prompt injection attacks (mitigation: input sanitization)."
    },
    financial: {
      points: ["Runway too short?", "Burn rate too high?", "Revenue assumptions too optimistic?", "Funding risk?"],
      example: "Risks: 1) 7-month runway (critical!) - mitigation: raise €200K seed in 3 months, 2) OpenAI costs grow faster than expected - mitigation: optimize prompts, cap usage per user, 3) Customers churn faster - mitigation: improve onboarding, add value."
    },
    legal: {
      points: ["Licensing requirements?", "Data protection (GDPR)?", "Third-party API ToS?", "IP issues?"],
      example: "Risks: 1) OpenAI ToS prohibits competitive products (checked - OK for tools), 2) GDPR compliance for EU customers (solved via Supabase EU hosting), 3) Giving financial advice without license (disclaimer: educational purposes only), 4) Customer data security (mitigation: encryption, SOC2)."
    },
    market: {
      points: ["Competitors with bigger funding?", "Market timing (too early/late)?", "Customer adoption barriers?", "Economic downturn?"],
      example: "Risks: 1) Big players (Carta, YC) may launch similar product (mitigation: speed, niche focus), 2) VC funding winter = fewer customers (mitigation: profitable unit economics), 3) AI hype fades (mitigation: real value, not just AI buzzword), 4) Startups close in recession (mitigation: diversify to SMB)."
    },
    team: {
      points: ["Founder disagreements?", "Key person dependency?", "Hiring challenges?", "Team burnout?"],
      example: "Risks: 1) Co-founder conflict (mitigation: 4-year vesting, clear roles), 2) CEO knows everything (mitigation: documentation, processes), 3) Can't hire VP Sales (mitigation: founder-led sales until €20K MRR), 4) Burnout (mitigation: sustainable pace, no weekends)."
    },
    mitigation: {
      points: ["Concrete mitigation strategies", "Action timeline", "Risk management budget"],
      example: "Risk reduction plan Q1 2026: 1) Raise €200K seed (Jan-Mar, high priority), 2) Hire contractor for backup development (Feb, €3K/month), 3) Launch Claude integration (Mar, 40h dev time), 4) Build customer success process for retention (Jan, 20h), 5) Legal ToS review (Jan, €1K)."
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Risks</h2>
        <p className="text-sm text-slate-600">Identify and mitigate key risks</p>
      </div>

      <div className="space-y-8">
        {riskFields.map((field) => (
          <div key={field.id} className="grid grid-cols-2 gap-8 group">
            <div className="space-y-2">
              <Label htmlFor={field.id} className="text-sm font-semibold">
                {field.label} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id={field.id}
                placeholder={field.placeholder}
                className="min-h-[100px]"
                value={risks[field.id as keyof typeof risks]}
                onChange={(e) => updateRisks({ [field.id]: e.target.value })}
              />
            </div>

            <div className={`space-y-2 text-xs transition-opacity duration-300 ${risks[field.id as keyof typeof risks] ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
              <h4 className="text-sm font-semibold text-black">Guidelines</h4>
              <div className="text-black space-y-1">
                {guidelines[field.id as keyof typeof guidelines].points.map((point, idx) => (
                  <p key={idx}>• {point}</p>
                ))}
              </div>
              <div className="text-slate-600 italic pt-2">
                Example: {guidelines[field.id as keyof typeof guidelines].example}
              </div>
            </div>
          </div>
        ))}

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Investors want to see you've thought through risks and have concrete mitigation plans.
          </p>
        </div>
      </div>
    </div>
  );
}
