"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";

export function Step4Channels() {
  const { projectData, updateChannels } = useProjectStore();
  const channels = projectData.channels || {
    acquisitionChannels: [],
    salesChannel: "",
    cac: "",
    marketingTools: "",
    marketingFunnel: "",
  };
  const { acquisitionChannels, salesChannel, cac, marketingTools, marketingFunnel } = channels;
  const [currentChannel, setCurrentChannel] = useState("");

  const handleAddChannel = () => {
    if (currentChannel.trim()) {
      updateChannels({ acquisitionChannels: [...acquisitionChannels, currentChannel.trim()] });
      setCurrentChannel("");
    }
  };

  const handleRemoveChannel = (index: number) => {
    updateChannels({ acquisitionChannels: acquisitionChannels.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Sales & Marketing Channels</h2>
        <p className="text-sm text-slate-600">Define your customer acquisition strategy</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              3.1. Main customer acquisition channels <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-500">Add 3-5 channels (minimum 3 required)</p>
            
            {acquisitionChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-md">
                {acquisitionChannels.map((channel, index) => (
                  <div key={index} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full text-sm">
                    <span>{channel}</span>
                    <button
                      type="button"
                      className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
                      onClick={() => handleRemoveChannel(index)}
                    >
                      <IoMdClose className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Input
                placeholder="Enter channel and click Add"
                className="h-12 flex-1"
                value={currentChannel}
                onChange={(e) => setCurrentChannel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddChannel();
                  }
                }}
              />
              <Button
                type="button"
                className="h-12 px-6"
                onClick={handleAddChannel}
                disabled={!currentChannel.trim()}
              >
                Add
              </Button>
            </div>
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${acquisitionChannels.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• List all channels (minimum 3-5)</p>
              <p>• Which channel will you test first?</p>
              <p>• Do you have experience/results with these channels?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Examples: Paid ads (Google, Facebook, LinkedIn) • SEO/content marketing • Social media • Email marketing • Partnerships/affiliates • Direct sales (outbound) • Referral program • Community (forums, groups)
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Product Hunt (launch), Indie Hackers (community), Y Combinator network (partnership), LinkedIn outreach (outbound), SEO blog (long-term), startup podcasts (PR)."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="salesChannel" className="text-sm font-semibold">
              3.2. Main sales channel <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="salesChannel"
              placeholder="Describe your sales process..."
              className="min-h-[100px]"
              value={salesChannel}
              onChange={(e) => updateChannels({ salesChannel: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${salesChannel ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Self-serve (customer buys on website)?</p>
              <p>• Sales-assisted (manager helps)?</p>
              <p>• Enterprise sales (long deal cycle)?</p>
              <p>• Marketplace/platform?</p>
              <p>• Through partners/distributors?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Self-serve via Stripe checkout for €99/month plan. Founder-led sales for annual €999 plan (cold outreach + demo). Plan to hire VP Sales at €10K MRR."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="cac" className="text-sm font-semibold">
              3.3. Customer Acquisition Cost (CAC) <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="cac"
              placeholder="Describe your CAC calculation and breakdown..."
              className="min-h-[100px]"
              value={cac}
              onChange={(e) => updateChannels({ cac: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${cac ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• If tested - provide actual CAC</p>
              <p>• If not - provide forecast with reasoning</p>
              <p>• Break down by channels if possible</p>
              <p>• Formula: CAC = Marketing & Sales costs / New customers</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Forecast CAC: €45. Reasoning: average CPC on LinkedIn for B2B SaaS €2-3, landing page conversion 5%, trial→paid conversion 30%. Total: €45-60. Actual CAC after Product Hunt launch: €35."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="marketingTools" className="text-sm font-semibold">
              3.4. Marketing tools <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="marketingTools"
              placeholder="List marketing tools you plan to use..."
              className="min-h-[100px]"
              value={marketingTools}
              onChange={(e) => updateChannels({ marketingTools: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${marketingTools ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Marketing automation (HubSpot, Mailchimp)</p>
              <p>• CRM (Salesforce, Pipedrive)</p>
              <p>• Analytics (Google Analytics, Mixpanel)</p>
              <p>• Social media management</p>
              <p>• Content tools (blog, newsletters)</p>
              <p>• Paid ads platforms</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "PostHog for analytics, ConvertKit for email (newsletter), Buffer for social media, Notion for content calendar. Budget: €200/month on tools."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 group">
          <div className="space-y-2">
            <Label htmlFor="marketingFunnel" className="text-sm font-semibold">
              3.5. Marketing funnel <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="marketingFunnel"
              placeholder="Describe your marketing funnel with conversions..."
              className="min-h-[120px]"
              value={marketingFunnel}
              onChange={(e) => updateChannels({ marketingFunnel: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-xs transition-opacity duration-300 ${marketingFunnel ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-sm font-semibold text-black">Guidelines</h4>
            <div className="text-black space-y-1">
              <p>• Awareness → Interest → Consideration → Purchase → Retention</p>
              <p>• Conversions at each stage</p>
              <p>• Where are main bottlenecks?</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "Landing page → Free tool (lite) → Trial (full) → Paid. 100% → 5% signup → 30% trial → 25% paid (1000 visitors → 50 signups → 15 trials → 4 customers). Bottleneck: signup conversion. Improvement plan: add social proof, video demo."
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            Tip: Investors want to see clear acquisition strategy with realistic numbers.
          </p>
        </div>
      </div>
    </div>
  );
}
