import React, { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LineChart as LineChartIcon, Info, Calendar } from 'lucide-react';

const PriceChart = ({ historicalData, historicalStatus, historicalReason }) => {
  const [timeRange, setTimeRange] = useState('6M');

  const hasData = Array.isArray(historicalData) && historicalData.length > 0;

  // Filter available data based on selected range (1M ~ 21 trading days, 3M ~ 63 days, 6M ~ 126 days)
  const filteredData = useMemo(() => {
    if (!hasData) return [];
    if (timeRange === '1M') return historicalData.slice(-21);
    if (timeRange === '3M') return historicalData.slice(-63);
    return historicalData;
  }, [historicalData, timeRange, hasData]);

  if (!hasData) {
    const isRateLimited = historicalStatus === 'rate_limited';

    return (
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-sm mb-6 flex flex-col h-[380px]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-2">
            <LineChartIcon className="w-4 h-4 text-slate-400" />
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Price History
            </h3>
          </div>
          <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
            isRateLimited 
              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
              : 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20'
          }`}>
            {isRateLimited ? 'Provider Limit Reached' : 'Data Unavailable'}
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500">
            <Info className="w-6 h-6" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              {isRateLimited ? 'Alpha Vantage Rate Limit' : 'Historical Data Unavailable'}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {historicalReason || (
                isRateLimited
                  ? 'Alpha Vantage free tier has reached its per-minute rate limit (25 req/day). Live price quote, fundamental metrics, and NVIDIA NIM AI synthesis remain fully active.'
                  : 'Historical price action is currently unavailable for this ticker.'
              )}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const prices = filteredData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.08 || 5;

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-sm mb-6 flex flex-col h-[380px]">
      {/* Chart Header & Controls */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/60 mb-4">
        <div className="flex items-center gap-2">
          <LineChartIcon className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Historical Trend
          </h3>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-0.5 rounded-lg border border-slate-200/60 dark:border-slate-700/60">
          {['1M', '3M', '6M'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                timeRange === range
                  ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Area Chart Container */}
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800/60" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11 }}
              className="text-slate-400 dark:text-slate-500"
              tickLine={false}
              axisLine={false}
              tickFormatter={(tick) => {
                const d = new Date(tick);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              minTickGap={35}
            />
            <YAxis 
              domain={[minPrice - padding, maxPrice + padding]} 
              tick={{ fontSize: 11 }}
              className="text-slate-400 dark:text-slate-500"
              tickLine={false}
              axisLine={false}
              tickFormatter={(tick) => `$${tick.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.92)', 
                backdropFilter: 'blur(12px)',
                borderRadius: '10px', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                boxShadow: '0 12px 24px -4px rgba(0, 0, 0, 0.3)',
                color: '#f8fafc',
                fontSize: '12px',
                padding: '8px 12px'
              }}
              formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Price']}
              labelStyle={{ color: '#94a3b8', marginBottom: '2px', fontWeight: 500 }}
            />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke="#10b981" 
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#chartGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
