"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { IoMdClose } from "react-icons/io";
import { TbChecks, TbCheck } from "react-icons/tb";
import { useState, useMemo } from "react";
import { useProjectStore } from "@/store/useProjectStore";
import { useTranslations } from "next-intl";
import { handleNonNegativeNumberInput } from "@/lib/utils/numberValidation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function Step4Channels() {
  const t = useTranslations('create.step4');
  const { projectData, updateChannels } = useProjectStore();

  const channelOptions = useMemo(() => [
    t('channels.seo'),
    t('channels.googleAds'),
    t('channels.socialMedia'),
    t('channels.contentMarketing'),
    t('channels.emailMarketing'),
    t('channels.referralProgram'),
    t('channels.partnership'),
    t('channels.productHunt'),
    t('channels.coldOutreach'),
    t('channels.events'),
    t('channels.other'),
  ], [t]);
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
        <h2 className="text-2xl font-bold text-black">{t('title')}</h2>
        <p className="text-sm text-slate-600">{t('subtitle')}</p>
      </div>

      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label className="text-sm font-semibold">
              {t('acquisitionChannelsLabel')} <span className="text-red-500">*</span>
            </Label>
            <p className="text-xs text-slate-500">{t('acquisitionChannelsHint')}</p>
            
            {acquisitionChannels.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-slate-50 rounded-md">
                {acquisitionChannels.map((channel, index) => (
                  <div key={index} className="flex items-center gap-1 bg-white border border-slate-200 px-3 py-1 rounded-full text-sm">
                    <span>{channel}</span>
                    <button
                      type="button"
                      className="group/btn ml-1 hover:bg-slate-100 rounded-full p-0.5"
                      onClick={() => handleRemoveChannel(channel)}
                    >
                      <IoMdClose className="h-3.5 w-3.5 text-blue-600 group-hover/btn:text-red-600" />
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
                    <span className="text-slate-500">{t('selectChannels')}</span>
                  ) : (
                    <span>{acquisitionChannels.length} {t('channelsSelected')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[400px] p-2" align="start">
                <div className="max-h-[300px] overflow-y-auto space-y-0.5">
                  {channelOptions.filter(c => c !== t('channels.other')).map((channel) => (
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
                    <Label className="text-xs text-slate-600">{t('customChannel')}</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder={t('customChannelPlaceholder')}
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
                        {t('add')}
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {acquisitionChannels.length < 3 && (
              <p className="text-xs text-red-500">{t('channelsRequired')}</p>
            )}
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${acquisitionChannels.length > 0 ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {acquisitionChannels.length >= 3 && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('acquisitionChannelsGuidelines.1')}</p>
              <p>• {t('acquisitionChannelsGuidelines.2')}</p>
              <p>• {t('acquisitionChannelsGuidelines.3')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('acquisitionChannelsExamples')}
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('acquisitionChannelsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="salesChannel" className="text-sm font-semibold">
              {t('salesChannelLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="salesChannel"
              placeholder={t('salesChannelPlaceholder')}
              className="min-h-[100px]"
              value={salesChannel}
              onChange={(e) => updateChannels({ salesChannel: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${salesChannel ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {salesChannel && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('salesChannelGuidelines.1')}</p>
              <p>• {t('salesChannelGuidelines.2')}</p>
              <p>• {t('salesChannelGuidelines.3')}</p>
              <p>• {t('salesChannelGuidelines.4')}</p>
              <p>• {t('salesChannelGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('salesChannelExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-4">
            <Label className="text-sm font-semibold">
              {t('cacLabel')} <span className="text-red-500">*</span>
            </Label>
            
            <div className="space-y-2">
              <Label htmlFor="cac" className="text-xs text-slate-600">{t('cacValue')}</Label>
              <InputGroup className="h-12">
                <InputGroupAddon>€</InputGroupAddon>
                <InputGroupInput
                  id="cac"
                  type="number"
                  placeholder={t('cacValuePlaceholder')}
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  value={cac || ""}
                  onChange={(e) => {
                    handleNonNegativeNumberInput(e.target.value, (num) => {
                      updateChannels({ cac: num });
                    });
                  }}
                  min="0"
                />
              </InputGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cacDescription" className="text-xs text-slate-600">{t('cacBreakdown')}</Label>
              <Textarea
                id="cacDescription"
                placeholder={t('cacBreakdownPlaceholder')}
                className="min-h-[100px]"
                value={cacDescription}
                onChange={(e) => updateChannels({ cacDescription: e.target.value })}
              />
            </div>
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${(cac || cacDescription) ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {(cac > 0 && cacDescription) && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('cacGuidelines.1')}</p>
              <p>• {t('cacGuidelines.2')}</p>
              <p>• {t('cacGuidelines.3')}</p>
              <p>• {t('cacGuidelines.4')}</p>
              <p>• {t('cacGuidelines.5')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('cacExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="marketingTools" className="text-sm font-semibold">
              {t('marketingToolsLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="marketingTools"
              placeholder={t('marketingToolsPlaceholder')}
              className="min-h-[100px]"
              value={marketingTools}
              onChange={(e) => updateChannels({ marketingTools: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${marketingTools ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {marketingTools && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('marketingToolsGuidelines.1')}</p>
              <p>• {t('marketingToolsGuidelines.2')}</p>
              <p>• {t('marketingToolsGuidelines.3')}</p>
              <p>• {t('marketingToolsGuidelines.4')}</p>
              <p>• {t('marketingToolsGuidelines.5')}</p>
              <p>• {t('marketingToolsGuidelines.6')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('marketingToolsExample')}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 group border-b md:border-b-0 pb-8 md:pb-0">
          <div className="space-y-2">
            <Label htmlFor="marketingFunnel" className="text-sm font-semibold">
              {t('marketingFunnelLabel')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="marketingFunnel"
              placeholder={t('marketingFunnelPlaceholder')}
              className="min-h-[120px]"
              value={marketingFunnel}
              onChange={(e) => updateChannels({ marketingFunnel: e.target.value })}
            />
          </div>

          <div className={`space-y-2 text-sm transition-opacity duration-300 ${marketingFunnel ? 'opacity-100' : 'opacity-10 group-focus-within:opacity-100'}`}>
            <h4 className="text-base font-semibold text-black flex items-center gap-2">
              {t('guidelines')}
              {marketingFunnel && <TbChecks className="text-green-500 text-lg" />}
            </h4>
            <div className="text-black space-y-1">
              <p>• {t('marketingFunnelGuidelines.1')}</p>
              <p>• {t('marketingFunnelGuidelines.2')}</p>
              <p>• {t('marketingFunnelGuidelines.3')}</p>
            </div>
            <div className="text-slate-600 italic pt-2">
              {t('marketingFunnelExample')}
            </div>
          </div>
        </div>

        <div className="border-l-2 border-slate-300 pl-4">
          <p className="text-sm text-slate-600">
            {t('tip')}
          </p>
        </div>
      </div>
    </div>
  );
}
