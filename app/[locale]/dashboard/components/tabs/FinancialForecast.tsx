'use client';

import { useVersionsStore } from '@/store/useVersionsStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

export function FinancialForecast() {
  const { currentProject } = useVersionsStore();
  
  if (!currentProject?.analysis) return null;
  
  const { unitEconomics, breakEven, monthlyProjections } = currentProject.analysis.financialForecast;
  
  const unitEconomicsCards = [
    {
      label: 'LTV',
      value: unitEconomics.ltv,
      prefix: '€',
      color: 'text-green-600',
    },
    {
      label: 'CAC',
      value: unitEconomics.cac,
      prefix: '€',
      color: '',
    },
    {
      label: 'LTV/CAC',
      value: unitEconomics.ltvCacRatio,
      suffix: 'x',
      color: 'text-green-600',
      benchmark: 'Benchmark: >3x',
    },
    {
      label: 'Payback',
      value: unitEconomics.paybackPeriod,
      suffix: ' mo',
      color: 'text-green-600',
      benchmark: 'Benchmark: <12mo',
    },
  ];
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h3 className="text-sm md:text-lg font-semibold mb-3 md:mb-4">Unit Economics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
          {unitEconomicsCards.map((card, index) => (
            <Card key={index} className="shadow-none p-0 bg-transparent">
              <CardContent className="pt-3 md:pt-4 p-3 md:p-6">
                <div className="text-xs md:text-sm text-gray-600 mb-1">{card.label}</div>
                <div className={`text-xl md:text-3xl font-bold ${card.color}`}>
                  {card.prefix && card.prefix}
                  {card.value}
                  {card.suffix && card.suffix}
                </div>
                {card.benchmark && (
                  <div className="text-[10px] md:text-xs text-gray-500 mt-1">{card.benchmark}</div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="shadow-none">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-lg">12-Month Financial Forecast</CardTitle>
        </CardHeader>
        <CardContent className="p-2 md:p-6">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280', fontSize: 10 }}
                label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#6B7280', style: { fontSize: '12px' } }}
              />
              <YAxis tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={2}
                name="Revenue"
                dot={{ fill: '#10B981', r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="costs"
                stroke="#EF4444"
                strokeWidth={2}
                name="Costs"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3B82F6"
                strokeWidth={2}
                name="Profit"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="shadow-none gap-0">
        <CardHeader className="p-3 md:p-6">
          <CardTitle className="text-sm md:text-lg">Break-Even Analysis</CardTitle>
        </CardHeader>
        <CardContent className="p-3 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            <div className="text-center p-4 md:p-6 bg-blue-50 rounded-lg">
              <div className="text-xs md:text-sm text-gray-600 mb-2">Break-Even Month</div>
              <div className="text-3xl md:text-5xl font-bold text-blue-600">{breakEven.month}</div>
            </div>
            <div className="text-center p-4 md:p-6 bg-green-50 rounded-lg">
              <div className="text-xs md:text-sm text-gray-600 mb-2">Customers Needed</div>
              <div className="text-3xl md:text-5xl font-bold text-green-600">{breakEven.customers}</div>
            </div>
            <div className="text-center p-4 md:p-6 bg-purple-50 rounded-lg">
              <div className="text-xs md:text-sm text-gray-600 mb-2">MRR at Break-Even</div>
              <div className="text-3xl md:text-5xl font-bold text-purple-600">€{breakEven.mrr}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
