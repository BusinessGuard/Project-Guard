"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/useProjectStore";

export function Step6Team() {
  const { projectData, updateTeam } = useProjectStore();
  const team = projectData.team || {
    keyRoles: "",
    founderExperience: "",
    specialists: "",
    gaps: "",
  };
  const { keyRoles, founderExperience, specialists, gaps } = team;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Team</h2>
        <p className="text-sm text-slate-600">Describe your team and expertise</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="keyRoles" className="text-sm font-semibold">
              5.1. Key roles and current team <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="keyRoles"
              placeholder="Describe founders, team size, roles..."
              className="min-h-[100px]"
              value={keyRoles}
              onChange={(e) => updateTeam({ keyRoles: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${keyRoles ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• How many founders?</p>
              <p>• Who is CEO, CTO, etc?</p>
              <p>• Full-time or part-time?</p>
              <p>• How many employees/contractors?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Founders (2): John Doe, CEO (full-time): 10 years in startup consulting, MBA, first startup. Jane Smith, CTO (full-time): 8 years senior engineer at Google, first startup. Team: 1 full-stack developer (contractor, part-time), 1 designer (freelancer, as needed). Total: 2 full-time + 2 part-time."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="founderExperience" className="text-sm font-semibold">
              5.2. Founder experience <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="founderExperience"
              placeholder="Describe previous startups, industry experience, skills..."
              className="min-h-[100px]"
              value={founderExperience}
              onChange={(e) => updateTeam({ founderExperience: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${founderExperience ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Previous startups (successes/failures)?</p>
              <p>• Relevant industry experience?</p>
              <p>• Technical skills?</p>
              <p>• Business skills (sales, marketing, fundraising)?</p>
              <p>• Education?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "CEO: consulted 50+ startups, helped raise €10M for clients, but never launched own startup. CTO: shipped 5 products at Google with millions of users, no startup experience. Both first-time founding team."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="specialists" className="text-sm font-semibold">
              5.3. Domain specialists <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="specialists"
              placeholder="Do you have marketing, financial, product, sales experts?"
              className="min-h-[100px]"
              value={specialists}
              onChange={(e) => updateTeam({ specialists: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${specialists ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Marketing/Growth expert?</p>
              <p>• Financial expert/CFO?</p>
              <p>• Product manager?</p>
              <p>• Sales leader?</p>
              <p>• Industry domain expert?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "No in-house experts. Have advisors: 1) VC partner from Sequoia (fundraising strategy, 2h/month), 2) ex-CMO of SaaS unicorn (growth advice, 1h/month). Plan to hire VP Sales at month 6 when reaching €10K MRR."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="gaps" className="text-sm font-semibold">
              5.4. Competency gaps <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="gaps"
              placeholder="What's missing? How will you fill gaps? When? Budget?"
              className="min-h-[100px]"
              value={gaps}
              onChange={(e) => updateTeam({ gaps: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${gaps ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• What's missing in the team?</p>
              <p>• How do you plan to close the gap?</p>
              <p>• When do you plan to hire?</p>
              <p>• Hiring budget?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Critical gaps: 1) VP Sales (HIGH priority, hire month 6, budget €60K/year + equity), 2) Growth marketer (MEDIUM, month 9, €45K/year), 3) Customer success (LOW, month 12, €35K/year). Interim: Founders handle sales/marketing first 6 months."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Investors invest in teams. Show relevant experience and clear hiring plan.
          </p>
        </div>
      </div>
    </div>
  );
}
