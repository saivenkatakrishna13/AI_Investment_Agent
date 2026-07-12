import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart2 } from 'lucide-react';

const MetricCard = ({ title, value, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  
  let valueColor = "text-slate-100";
  if (isPositive) valueColor = "text-emerald-400";
  if (isNegative) valueColor = "text-red-400";

  return (
    <div className="bg-slate-800 rounded-2xl p-5 border border-slate-700 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
        <h3 className={`text-2xl font-bold tracking-tight ${valueColor}`}>
          {value || 'N/A'}
        </h3>
      </div>
      <div className="p-3 bg-slate-700/50 rounded-xl">
        <Icon className="w-6 h-6 text-slate-300" />
      </div>
    </div>
  );
};

const MetricCards = ({ metrics }) => {
  if (!metrics) return null;

  // Determine trend for daily change
  let changeTrend = 'neutral';
  if (metrics.dailyChange && metrics.dailyChange.includes('+')) changeTrend = 'up';
  if (metrics.dailyChange && metrics.dailyChange.includes('-')) changeTrend = 'down';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <MetricCard 
        title="Current Price" 
        value={metrics.currentPrice} 
        icon={DollarSign} 
      />
      <MetricCard 
        title="Daily Change" 
        value={metrics.dailyChange} 
        icon={changeTrend === 'up' ? TrendingUp : TrendingDown} 
        trend={changeTrend}
      />
      <MetricCard 
        title="Market Cap" 
        value={metrics.marketCap} 
        icon={PieChart} 
      />
      <MetricCard 
        title="P/E Ratio" 
        value={metrics.peRatio} 
        icon={BarChart2} 
      />
    </div>
  );
};

export default MetricCards;
