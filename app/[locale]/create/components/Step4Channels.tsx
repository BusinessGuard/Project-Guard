"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IoMdClose } from "react-icons/io";
import { TbChecks, TbCheck } from "react-icons/tb";
import { useState } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const channelOptions = [
  "SEO / Organic Search",
  "Google Ads / PPC",
  "Social Media (Facebook, Instagram, LinkedIn)",
  "Content Marketing / Blog",
  "Email Marketing",
  "Referral Program",
  "Partnership / Affiliate",
  "Product Hunt",
  "Cold Outreach",
  "Events / Conferences",
  "Other",
];

export function Step4Channels() {
  const { projectData, updateChannels } = useProjectStore();
  const channels = projectData.channels || {
    acquisitionChannels: [],
    salesChannel: "",
    cac: 0,
    cacDescription: "",
    marketingTools: "",
    marketingFunnel: "",
  };
  const { acquisitionChannels, salesChannel, cac, cacDescription, marketingTools, marketingFunnel } = channels;
  const [isOpen, setIsOpen] = useState(false);
  const [customChannel, setCustomChannel] = useState("");

  const handleToggleChannel = (channel: string) => {
    if (acquisitionChannels.includes(channel)) {
      updateChannels({ acquisitionChannels: acquisitionChannels.filter((c) => c !== channel) });
    } else {
      updateChannels({ acquisitionChannels: [...acquisitionChannels, channel] });
    }
  };

  const handleAddCustomChannel = () => {
    if (customChannel.trim() && !acquisitionChannels.includes(customChannel.trim())) {
      updateChannels({ acquisitionChannels: [...acquisitionChannels, customChannel.trim()] });
      setCustomChannel("");
    }
  };

  const handleRemoveChannel = (channel: string) => {
    updateChannels({ acquisitionChannels: acquisitionChannels.filter((c) => c !== channel) });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-black">Sales & Marketing Channels</h2>
        <p className="text-sm text-slate-600">Define your customer acquisition strategy</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              3.1. Main customer acquisition channels <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-500">Select 3-5 channels (minimum 3 required)</p>
            
            {acquisitionChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-md">
                {acquisitionChannels.map((channel, index) => (
                  <div key={index} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full text-sm">
                    <span>{channel}</span>
                    <button
                      type="button"
                      className="ml-1 hover:bg-slate-100 rounded-full p-0.5"
                      onClick={() => handleRemoveChannel(channel)}
                    >
                      <IoMdClose className="h-3.5 w-3.5 text-slate-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <Popover open={isOpen} onOpenChange={setIsOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-10 justify-start text-left font-normal"
                >
                  {acquisitionChannels.length === 0 ? (
                    <span className="text-slate-500">Select channels...</span>
                  ) : (
                    <span>{acquisitionChannels.length} channel(s) selected</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-2" align="start">
                <div className="max-h-[300px] overflow-y-auto space-y-0.5">
                  {channelOptions.filter(c => c !== "Other").map((channel) => (
                    <button
                      key={channel}
                      type="button"
                      className="flex items-center gap-2 w-full cursor-pointer hover:bg-slate-50 px-2 py-1.5 rounded-md transition-colors text-left"
                      onClick={() => handleToggleChannel(channel)}
                    >
                      <div className="w-4 h-4 flex items-center justify-center">
                        {acquisitionChannels.includes(channel) && (
                          <TbCheck className="text-black text-base" />
                        )}
                      </div>
                      <span className="text-sm flex-1">{channel}</span>
                    </button>
                  ))}
                  
                  <div className="border-t pt-2 mt-2 space-y-2">
                    <Label className="text-xs text-slate-600">Custom Channel</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Enter custom channel..."
                        className="h-9 flex-1"
                        value={customChannel}
                        onChange={(e) => setCustomChannel(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddCustomChannel();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        size="sm"
                        className="h-9"
                        onClick={handleAddCustomChannel}
                        disabled={!customChannel.trim()}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {acquisitionChannels.length < 3 && (
              <p className="text-xs text-red-500">Please select at least 3 channels</p>
            )}
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${acquisitionChannels.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {acquisitionChannels.length >= 3 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${salesChannel ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {salesChannel && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              3.3. Customer Acquisition Cost (CAC) <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Label htmlFor="cac" className="text-xs text-slate-600">CAC Value</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  id="cac"
                  type="number"
                  placeholder="55"
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={cac || ""}
                  onChange={(e) => updateChannels({ cac: parseFloat(e.target.value) || 0 })}
                  min="0"
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cacDescription" className="text-xs text-slate-600">CAC Breakdown & Calculation</Label>
              <Textarea
                id="cacDescription"
                placeholder="Describe your CAC calculation: Google Ads €30, Content €15, Referrals €10..."
                className="min-h-[100px]"
                value={cacDescription}
                onChange={(e) => updateChannels({ cacDescription: e.target.value })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(cac || cacDescription) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {(cac > 0 && cacDescription) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• CAC Value: total cost to acquire one customer</p>
              <p>• Breakdown: explain calculation by channels</p>
              <p>• If tested - provide actual CAC</p>
              <p>• If not - provide forecast with reasoning</p>
              <p>• Formula: CAC = Marketing & Sales costs / New customers</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              Example: "CAC: €55. Breakdown: Google Ads €30/customer (CPC €2, conversion 6.7%), Content Marketing €15/customer (SEO + blog), Referral program €10/customer (20% commission)."
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${marketingTools ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {marketingTools && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
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

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${marketingFunnel ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              Guidelines
              {marketingFunnel && <TbChecks className="text-green-500 text-lg" />}
            </h4>
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
