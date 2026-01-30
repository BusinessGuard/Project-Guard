import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadarChartView } from './RadarChartView';
import { BlockScores } from './BlockScores';
import { Recommendations } from './Recommendations';
import { GrowthPlan } from './GrowthPlan';
import { FinancialForecast } from './FinancialForecast';
import { Experts } from './Experts';

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

export const TabsSection = () => {
  const [activeTab, setActiveTab] = useState('overview');
  return (
    <Card>
      <CardContent className="px-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full  justify-start rounded-none h-auto p-0 bg-transparent mb-10 gap-4 ">
            {tabs.map((tab) => (
              <TabsTrigger 
                key={tab.value} 
                value={tab.value} 
                className="text-base font-semibold py-6 data-[state=active]:border-black data-[state=active]:text-black transition-all hover:text-black hover:bg-gray-50 "
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((tab) => (
            <TabsContent key={tab.value} value={tab.value}>
              {tab.content}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
};
