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
  
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Unit Economics</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="shadow-none">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">LTV</div>
              <div className="text-3xl font-bold text-green-600">
                €{unitEconomics.ltv}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">CAC</div>
              <div className="text-3xl font-bold">
                €{unitEconomics.cac}
              </div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">LTV/CAC</div>
              <div className="text-3xl font-bold text-green-600">
                {unitEconomics.ltvCacRatio}x
              </div>
              <div className="text-xs text-gray-500">Benchmark: &gt;3x</div>
            </CardContent>
          </Card>
          <Card className="shadow-none">
            <CardContent className="pt-4">
              <div className="text-sm text-gray-600 mb-1">Payback</div>
              <div className="text-3xl font-bold text-green-600">
                {unitEconomics.paybackPeriod} mo
              </div>
              <div className="text-xs text-gray-500">Benchmark: &lt;12mo</div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>12-Month Financial Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyProjections}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="month" 
                tick={{ fill: '#6B7280' }}
                label={{ value: 'Month', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
              />
              <YAxis tick={{ fill: '#6B7280' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px'
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#10B981"
                strokeWidth={3}
                name="Revenue"
                dot={{ fill: '#10B981', r: 4 }}
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

      <Card className="shadow-none">
        <CardHeader>
          <CardTitle>Break-Even Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Break-Even Month</div>
              <div className="text-5xl font-bold text-blue-600">{breakEven.month}</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Customers Needed</div>
              <div className="text-5xl font-bold text-green-600">{breakEven.customers}</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">MRR at Break-Even</div>
              <div className="text-5xl font-bold text-purple-600">€{breakEven.mrr}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
