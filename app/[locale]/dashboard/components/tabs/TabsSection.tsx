import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadarChartView } from './RadarChartView';
import { BlockScores } from './BlockScores';
import { Recommendations } from './Recommendations';
import { GrowthPlan } from './GrowthPlan';
import { FinancialForecast } from './FinancialForecast';
import { Experts } from './Experts';
import { LuChartBar, LuNotebookPen } from "react-icons/lu";
import { GoCommentDiscussion } from "react-icons/go";
import { TbZoomMoney } from "react-icons/tb";

interface TabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

const tabs: TabItem[] = [
  { value: 'overview', label: 'Overview', content: <div className="grid lg:grid-cols-2 gap-6"><RadarChartView /><BlockScores /></div>},
  { value: 'experts', label: 'Expert Insights', content: <Experts /> },
  { value: 'recommendations', label: 'Recommendations', content: <Recommendations /> },
  { value: 'growth', label: 'Growth Plan', content: <GrowthPlan /> },
  { value: 'financial', label: 'Financial Forecast', content: <FinancialForecast /> },
];

const mobileIcons = [
  LuChartBar,           // Overview
  GoCommentDiscussion,  // Expert Insights
  LuNotebookPen,        // Recommendations
  LuNotebookPen,        // Growth Plan
  TbZoomMoney,          // Financial Forecast
];

export const TabsSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const tabsListRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<{ [key: string]: HTMLButtonElement | null }>({});

  useEffect(() => {
    const updateIndicator = () => {
      const activeTabElement = tabRefs.current[activeTab];
      const tabsListElement = tabsListRef.current;
      
      if (activeTabElement && tabsListElement) {
        const tabsListRect = tabsListElement.getBoundingClientRect();
        const activeTabRect = activeTabElement.getBoundingClientRect();
        
        setIndicatorStyle({
          left: activeTabRect.left - tabsListRect.left,
          width: activeTabRect.width,
        });
      }
    };

    const timeoutId = setTimeout(updateIndicator, 0);
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTab]);

  return (
      <div className="md:p-6 md:rounded-lg md:border md:bg-white ">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* Mobile Grid Layout */}
          <div className="md:hidden mb-8 h-auto">
            <TabsList className="w-full grid grid-cols-2 gap-2 rounded-none !h-auto min-h-fit p-0 bg-transparent">
              {tabs.slice(0, 4).map((tab, index) => {
                const Icon = mobileIcons[index];
                return (
                  <TabsTrigger 
                    key={tab.value} 
                    value={tab.value}
                    className="!h-auto min-h-fit border border-gray-300 rounded-md text-[10px] sm:text-sm font-semibold py-3 flex items-center justify-center gap-2 data-[state=active]:border-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:!shadow-none transition-all hover:border-black hover:text-black hover:bg-gray-50"
                  >
                    {Icon && <Icon className="size-4" />}
                    {tab.label}
                  </TabsTrigger>
                );
              })}
              {tabs[4] && (() => {
                const Icon = mobileIcons[4];
                return (
                  <TabsTrigger 
                    key={tabs[4].value} 
                    value={tabs[4].value}
                    className="col-span-2 !h-auto min-h-fit border border-gray-300 rounded-md text-[10px] sm:text-sm font-semibold py-3 flex items-center justify-center gap-2 data-[state=active]:border-black data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:!shadow-none transition-all hover:border-black hover:text-black hover:bg-gray-50"
                  >
                    {Icon && <Icon className="size-4" />}
                    {tabs[4].label}
                  </TabsTrigger>
                );
              })()}
            </TabsList>
          </div>

          {/* Desktop Horizontal Layout */}
          <div className="hidden md:block relative mb-8 mt-4" ref={tabsListRef}>
            <TabsList className="w-full justify-start rounded-none  p-0 bg-transparent gap-2">
              {tabs.map((tab) => (
                <TabsTrigger 
                  key={tab.value} 
                  value={tab.value}
                  ref={(el) => {
                    tabRefs.current[tab.value] = el;
                  }}
                  className="flex-1 rounded-md text-base font-semibold py-5 px-4  data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:!shadow-none transition-all hover:border-black hover:text-black hover:bg-gray-50"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            <div
              className="absolute -bottom-2 h-0.5 bg-black transition-all duration-500 ease-in-out"
              style={{
                left: `${indicatorStyle.left}px`,
                width: `${indicatorStyle.width}px`,
              }}
            />
          </div>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value} className="mt-4">
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
    </div>
  );
};
