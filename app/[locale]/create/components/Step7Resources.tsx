"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IoMdClose } from "react-icons/io";
import { TbChecks } from "react-icons/tb";
import { useProjectStore } from "@/store/useProjectStore";
import { useState } from "react";

const partnerTypes = ["Technology", "Distribution", "Strategic Alliance", "Supplier", "Co-marketing", "Integration", "Other"];

export function Step7Resources() {
  const { projectData, updateResources } = useProjectStore();
  const resources = projectData.resources || {
    existing: "",
    needed: "",
    techStack: "",
    dependencies: "",
    activities: {
      production: "",
      innovation: "",
      platform: "",
      marketing: "",
      operations: "",
    },
    partners: [],
  };
  const { existing, needed, techStack, dependencies, activities, partners } = resources;
  const { production, innovation, platform, marketing, operations } = activities || {
    production: "",
    innovation: "",
    platform: "",
    marketing: "",
    operations: "",
  };

  const [newPartnerType, setNewPartnerType] = useState("");
  const [newPartnerName, setNewPartnerName] = useState("");
  const [newPartnerValue, setNewPartnerValue] = useState("");

  const handleAddPartner = () => {
    if (newPartnerType && newPartnerName && newPartnerValue) {
      updateResources({ 
        partners: [{ 
          type: newPartnerType, 
          name: newPartnerName,
          value: newPartnerValue
        }, ...(partners || [])] 
      });
      setNewPartnerType("");
      setNewPartnerName("");
      setNewPartnerValue("");
    }
  };

  const handleRemovePartner = (index: number) => {
    updateResources({ partners: (partners || []).filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Key Resources & Activities</h2>
        <p className="text-sm text-slate-600">Describe your assets, infrastructure, and key business activities</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${existing ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {existing && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${needed ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {needed && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${techStack ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {techStack && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${dependencies ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {dependencies && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              6.5. Key Activities <span className="text-slate-400">(optional)</span>
            </Label>

            <div className="space-y-2">
              <Label htmlFor="production" className="text-xs text-slate-600 font-semibold">Production/Development</Label>
              <Textarea
                id="production"
                placeholder="How do you build and deliver your product?"
                className="min-h-[70px]"
                value={production}
                onChange={(e) => updateResources({ activities: { ...activities, production: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="innovation" className="text-xs text-slate-600 font-semibold">Innovation/R&D</Label>
              <Textarea
                id="innovation"
                placeholder="How do you research and develop new features?"
                className="min-h-[70px]"
                value={innovation}
                onChange={(e) => updateResources({ activities: { ...activities, innovation: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="platform" className="text-xs text-slate-600 font-semibold">Platform/Infrastructure</Label>
              <Textarea
                id="platform"
                placeholder="How do you maintain your technical infrastructure?"
                className="min-h-[70px]"
                value={platform}
                onChange={(e) => updateResources({ activities: { ...activities, platform: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="marketing" className="text-xs text-slate-600 font-semibold">Marketing</Label>
              <Textarea
                id="marketing"
                placeholder="How do you attract and retain customers?"
                className="min-h-[70px]"
                value={marketing}
                onChange={(e) => updateResources({ activities: { ...activities, marketing: e.target.value } })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="operations" className="text-xs text-slate-600 font-semibold">Operations</Label>
              <Textarea
                id="operations"
                placeholder="How do you handle daily operations?"
                className="min-h-[70px]"
                value={operations}
                onChange={(e) => updateResources({ activities: { ...activities, operations: e.target.value } })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(production || innovation || platform || marketing || operations) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {(production || innovation || platform || marketing || operations) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• <strong>Production:</strong> Development process, CI/CD, testing</p>
              <p>• <strong>Innovation:</strong> User research, feature prioritization, A/B testing</p>
              <p>• <strong>Platform:</strong> Infrastructure monitoring, security, scaling</p>
              <p>• <strong>Marketing:</strong> Content creation, SEO, paid ads, email campaigns</p>
              <p>• <strong>Operations:</strong> Customer support, onboarding, billing, compliance</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Production:</strong> "2-week sprints, CI/CD via GitHub Actions, 80% test coverage"
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Innovation:</strong> "Monthly user interviews, quarterly roadmap planning"
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Platform:</strong> "24/7 monitoring via Datadog, auto-scaling on AWS"
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Marketing:</strong> "2 blog posts/week, LinkedIn daily, €500/mo Google Ads"
            </div>
            <div className="text-slate-600 italic pt-2">
              <strong>Operations:</strong> "Email support 24h SLA, automated onboarding, GDPR compliant"
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              6.6. Key Partners <span className="text-slate-400">(optional)</span>
            </Label>
            <p className="text-xs text-slate-500">Add partners if applicable</p>
            
            <div className="border border-slate-200 overflow-hidden rounded-md">
              <div className="p-2 bg-white border-b border-slate-200">
                <div className="flex flex-col md:flex-row gap-2">
                  <div className="flex gap-2 flex-1">
                    <Select value={newPartnerType} onValueChange={setNewPartnerType}>
                      <SelectTrigger className="h-10 flex-1 md:w-[140px]">
                        <SelectValue placeholder="Type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {partnerTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    <Input
                      placeholder="Name"
                      className="!h-10 flex-1 md:w-[140px]"
                      value={newPartnerName}
                      onChange={(e) => setNewPartnerName(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex gap-2 w-full md:w-auto md:flex-1">
                    <Input
                      placeholder="Value/benefit..."
                      className="!h-10 flex-1"
                      value={newPartnerValue}
                      onChange={(e) => setNewPartnerValue(e.target.value)}
                    />
                    
                    <Button
                      type="button"
                      className="h-10 px-4 text-sm whitespace-nowrap"
                      onClick={handleAddPartner}
                      disabled={!newPartnerType || !newPartnerName || !newPartnerValue}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>

              {partners && partners.length > 0 && (
                <div className="divide-y divide-slate-200">
                  {partners.map((partner, index) => (
                    <div key={index} className="relative flex flex-col md:flex-row md:items-center gap-2 md:gap-3 px-4 py-3 hover:bg-slate-50 transition-colors pr-12">
                      <span className="text-xs font-semibold text-slate-500 md:min-w-[24px]">{index + 1}.</span>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 flex-1">
                        <span className="text-sm font-medium text-slate-900 md:min-w-[100px]">{partner.type}</span>
                        <span className="text-sm font-medium text-slate-800 md:min-w-[120px]">{partner.name}</span>
                        <span className="text-sm text-slate-700 flex-1">{partner.value}</span>
                      </div>
                      <button
                        type="button"
                        className="absolute top-1/2 -translate-y-1/2 right-2 hover:bg-red-50 rounded-full p-1.5 transition-colors"
                        onClick={() => handleRemovePartner(index)}
                      >
                        <IoMdClose className="size-6 " />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${partners && partners.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {partners && partners.length > 0 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• Strategic alliances and partnerships</p>
              <p>• Key suppliers and vendors</p>
              <p>• Distribution partners</p>
              <p>• Technology integrations</p>
              <p>• Co-marketing partnerships</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Technology: Stripe (payment processing, critical). Distribution: AWS Marketplace (sales channel, 20% of leads). Strategic: HubSpot (integration partner, co-marketing, access to 100K customers)."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Show you have key resources, mitigation plans for dependencies, clear operational processes, and strategic partnerships.
          </p>
        </div>
      </div>
    </div>
  );
}
