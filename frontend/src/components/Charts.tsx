"use client";

import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface RevenueChartProps {
  data: any[];
}

export function RevenueGrowthChart({ data }: RevenueChartProps) {
  const chartData = data.map(proj => ({
    year: `Year ${proj.Year}`,
    revenue: proj.Revenue / 1e9,
    ebitda: proj.EBITDA / 1e9,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
          </linearGradient>
          <linearGradient id="ebitdaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="year" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" label={{ value: 'Billions ($)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#F3F4F6' }}
        />
        <Legend />
        <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#revenueGradient)" name="Revenue ($B)" />
        <Area type="monotone" dataKey="ebitda" stroke="#10B981" fillOpacity={1} fill="url(#ebitdaGradient)" name="EBITDA ($B)" />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function FCFWaterfallChart({ data }: RevenueChartProps) {
  const chartData = data.slice(0, 5).map(proj => ({
    year: `Y${proj.Year}`,
    fcf: proj.FCF / 1e9,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="year" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" label={{ value: 'FCF ($B)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#F3F4F6' }}
          formatter={(value: any) => [`$${value.toFixed(2)}B`, 'Free Cash Flow']}
        />
        <Bar dataKey="fcf" fill="#3B82F6" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface ScenarioChartProps {
  scenarios: {
    bear: { value_per_share: number };
    base: { value_per_share: number };
    bull: { value_per_share: number };
  };
  currentPrice: number;
}

export function ScenarioComparisonChart({ scenarios, currentPrice }: ScenarioChartProps) {
  const chartData = [
    { scenario: 'Bear', value: scenarios.bear.value_per_share, fill: '#EF4444' },
    { scenario: 'Base', value: scenarios.base.value_per_share, fill: '#3B82F6' },
    { scenario: 'Bull', value: scenarios.bull.value_per_share, fill: '#10B981' },
    { scenario: 'Current Price', value: currentPrice, fill: '#6B7280' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} layout="vertical">
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis type="number" stroke="#9CA3AF" label={{ value: 'Price ($)', position: 'insideBottom', fill: '#9CA3AF' }} />
        <YAxis type="category" dataKey="scenario" stroke="#9CA3AF" />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#F3F4F6' }}
          formatter={(value: any) => [`$${value.toFixed(2)}`, 'Value']}
        />
        <Bar dataKey="value" radius={[0, 8, 8, 0]}>
          {chartData.map((entry, index) => (
            <Bar key={`cell-${index}`} dataKey="value" fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

interface ValuationBreakdownProps {
  pvFCF: number;
  pvTerminal: number;
}

export function ValuationBreakdownChart({ pvFCF, pvTerminal }: ValuationBreakdownProps) {
  const total = pvFCF + pvTerminal;
  const chartData = [
    { name: 'PV of FCF', value: pvFCF / 1e9, percentage: ((pvFCF / total) * 100).toFixed(1), fill: '#3B82F6' },
    { name: 'Terminal Value', value: pvTerminal / 1e9, percentage: ((pvTerminal / total) * 100).toFixed(1), fill: '#8B5CF6' },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis dataKey="name" stroke="#9CA3AF" />
        <YAxis stroke="#9CA3AF" label={{ value: 'Value ($B)', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #374151', borderRadius: '8px' }}
          labelStyle={{ color: '#F3F4F6' }}
          formatter={(value: any, name: any, props: any) => [
            `$${value.toFixed(2)}B (${props.payload.percentage}%)`, 
            name
          ]}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Bar key={`cell-${index}`} dataKey="value" fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
