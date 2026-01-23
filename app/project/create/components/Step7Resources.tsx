"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProjectStore } from "@/store/useProjectStore";

export function Step7Resources() {
  const { projectData, updateResources } = useProjectStore();
  const resources = projectData.resources || {
    existing: "",
    needed: "",
    techStack: "",
    dependencies: "",
  };
  const { existing, needed, techStack, dependencies } = resources;

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Key Resources</h2>
        <p className="text-sm text-slate-600">Describe your assets and infrastructure</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="existing" className="text-sm font-semibold">
              6.1. Existing resources <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="existing"
              placeholder="Physical, intellectual, human, financial resources..."
              className="min-h-[100px]"
              value={existing}
              onChange={(e) => updateResources({ existing: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${existing ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Physical: Office? Equipment? Inventory?</p>
              <p>• Intellectual: Patents, trademarks? Proprietary tech? Databases? Algorithms?</p>
              <p>• Human: Team, advisors, network?</p>
              <p>• Financial: Cash? Credit lines? Assets?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Physical: Remote team, no office. Macbooks for founders. Intellectual: Proprietary AI prompts (6 expert system), database 1,000+ analyzed startups, trademark application filed. Human: 2 founders, 1 contractor, 2 advisors, network 500+ YC alumni. Financial: €50K cash, no debt."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="needed" className="text-sm font-semibold">
              6.2. Resources needed <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="needed"
              placeholder="What's critical for launch? Cost? Timeline?"
              className="min-h-[100px]"
              value={needed}
              onChange={(e) => updateResources({ needed: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${needed ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• What resources are critical for launch?</p>
              <p>• Cost of acquisition?</p>
              <p>• Timeline?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Need: 1) GPT-4 API access (have it), 2) Legal entity setup (€2K, 2 weeks), 3) Payment processing (Stripe, €0 setup), 4) Domain + branding (€500, done). Total: €2,500 one-time."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="techStack" className="text-sm font-semibold">
              6.3. Technology stack <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="techStack"
              placeholder="Stack, cloud provider, infrastructure, scalability, security..."
              className="min-h-[100px]"
              value={techStack}
              onChange={(e) => updateResources({ techStack: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${techStack ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Stack?</p>
              <p>• Cloud provider?</p>
              <p>• Infrastructure?</p>
              <p>• Scalability?</p>
              <p>• Security?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Next.js 14 + TypeScript, Supabase (Postgres), Vercel hosting, OpenAI API. Fully cloud-based, auto-scaling. SOC2 compliance via Supabase. Can scale to 100K users without rewriting."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="dependencies" className="text-sm font-semibold">
              6.4. Vendor dependencies <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="dependencies"
              placeholder="Critical dependencies? Risks? Alternatives?"
              className="min-h-[100px]"
              value={dependencies}
              onChange={(e) => updateResources({ dependencies: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${dependencies ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Who are you critically dependent on?</p>
              <p>• What if they raise prices or leave?</p>
              <p>• Are there alternatives?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Critical dependency on OpenAI API. Risk: 2-3x price increase. Mitigation: 1) Testing Claude/Gemini as fallback, 2) Building own fine-tuned models, 3) 50% gross margin provides buffer."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Show you have key resources and mitigation plans for critical dependencies.
          </p>
        </div>
      </div>
    </div>
  );
}
