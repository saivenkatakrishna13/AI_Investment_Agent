import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const PriceChart = ({ historicalData }) => {
  if (!historicalData || historicalData.length === 0) {
    return (
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-sm mb-6 flex flex-col h-[400px] items-center justify-center text-center">
        <h3 className="text-lg font-bold text-slate-100 mb-2 font-serif">6-Month Price History</h3>
        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
          <p className="mb-2">⚠️ Chart Data Unavailable</p>
          <p className="text-sm">You may have hit the Alpha Vantage free API limit (25 requests/day) or entered an invalid ticker.</p>
        </div>
      </div>
    );
  }

  // Calculate min and max for a better domain, providing some padding
  const prices = historicalData.map(d => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-sm mb-6 flex flex-col h-[400px]">
      <h3 className="text-lg font-bold text-slate-100 mb-4 font-serif">6-Month Price History</h3>
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historicalData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis 
              dataKey="date" 
              tick={{fill: '#94a3b8', fontSize: 11}} 
              tickLine={{stroke: '#475569'}}
              axisLine={false}
              tickFormatter={(tick) => {
                const d = new Date(tick);
                return `${d.getMonth()+1}/${d.getDate()}`;
              }}
              minTickGap={30}
            />
            <YAxis 
              domain={[minPrice - padding, maxPrice + padding]} 
              tick={{fill: '#94a3b8', fontSize: 11}}
              tickLine={false}
              axisLine={false}
              tickFormatter={(tick) => `$${tick.toFixed(0)}`}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                backdropFilter: 'blur(8px)',
                borderRadius: '8px', 
                border: '1px solid #334155', 
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
                color: '#f1f5f9'
              }}
              itemStyle={{ color: '#34d399' }}
              formatter={(value) => [`$${value.toFixed(2)}`, 'Price']}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#34d399" 
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 6, fill: '#34d399', stroke: '#0f172a', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;
