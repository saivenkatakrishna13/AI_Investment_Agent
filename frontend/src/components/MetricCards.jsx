import React from 'react';
import { DollarSign, TrendingUp, TrendingDown, PieChart, BarChart2, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const MetricCard = ({ title, value, subtext, icon: Icon, trend }) => {
  const isPositive = trend === 'up';
  const isNegative = trend === 'down';
  const isUnavailable = !value || value === 'Unavailable' || value === 'N/A';

  let valueColor = "text-slate-900 dark:text-slate-100";
  let iconColor = "text-slate-500 dark:text-slate-400";
  let badgeBg = "";

  if (isPositive) {
    valueColor = "text-emerald-600 dark:text-emerald-400";
    iconColor = "text-emerald-500";
    badgeBg = "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20";
  } else if (isNegative) {
    valueColor = "text-rose-600 dark:text-rose-400";
    iconColor = "text-rose-500";
    badgeBg = "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20";
  } else if (isUnavailable) {
    valueColor = "text-slate-400 dark:text-slate-500 font-normal";
  }

  return (
    <div className="group p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 tracking-wide truncate">
          {title}
        </span>
        <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/60 ${iconColor} transition-colors shrink-0`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline justify-between gap-1.5">
          <h3 className={`text-lg sm:text-xl font-bold tracking-tight truncate ${valueColor}`}>
            {value || 'Unavailable'}
          </h3>
          {trend && trend !== 'neutral' && !isUnavailable && (
            <span className={`inline-flex items-center gap-0.5 text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${badgeBg}`}>
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            </span>
          )}
        </div>
        {subtext && (
          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">
            {subtext}
          </p>
        )}
      </div>
    </div>
  );
};

const MetricCards = ({ metrics, company, companyName }) => {
  if (!metrics) return null;

  let changeTrend = 'neutral';
  if (metrics.dailyChange && (metrics.dailyChange.includes('+') || metrics.dailyChange.startsWith('+'))) changeTrend = 'up';
  if (metrics.dailyChange && (metrics.dailyChange.includes('-') || metrics.dailyChange.startsWith('-'))) changeTrend = 'down';

  const hasRange = metrics.low && metrics.high && metrics.low !== 'Unavailable' && metrics.high !== 'Unavailable';
  const rangeDisplay = hasRange ? `${metrics.low} - ${metrics.high}` : 'Unavailable';

  return (
    <div className="space-y-4 mb-6">
      {/* Ticker Hero Row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pb-3 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 tracking-wider">
              {company || 'TICKER'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              {companyName || company || 'Asset Overview'}
            </h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
            Real-Time Market Fundamentals & Intelligence
          </p>
        </div>

        {metrics.currentPrice && metrics.currentPrice !== 'Unavailable' && (
          <div className="flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              {metrics.currentPrice}
            </span>
            {metrics.dailyChange && metrics.dailyChange !== 'Unavailable' && (
              <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold tracking-wide ${
                changeTrend === 'up'
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                  : changeTrend === 'down'
                  ? 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                  : 'bg-slate-500/15 text-slate-600 dark:text-slate-400 border border-slate-500/20'
              }`}>
                {changeTrend === 'up' ? <TrendingUp className="w-3.5 h-3.5" /> : changeTrend === 'down' ? <TrendingDown className="w-3.5 h-3.5" /> : null}
                {metrics.dailyChange}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Modern High-Density Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <MetricCard 
          title="Current Price" 
          value={metrics.currentPrice} 
          subtext={metrics.previousClose && metrics.previousClose !== 'Unavailable' ? `Prev: ${metrics.previousClose}` : 'Real-time quote'}
          icon={DollarSign} 
        />
        <MetricCard 
          title="Daily Change" 
          value={metrics.dailyChange} 
          subtext={metrics.dailyChangePercent && metrics.dailyChangePercent !== 'Unavailable' ? `Percent: ${metrics.dailyChangePercent}` : 'Session delta'}
          icon={changeTrend === 'up' ? TrendingUp : TrendingDown} 
          trend={changeTrend}
        />
        <MetricCard 
          title="Market Capitalization" 
          value={metrics.marketCap} 
          subtext="Total company valuation"
          icon={PieChart} 
        />
        <MetricCard 
          title="P/E Ratio (TTM)" 
          value={metrics.peRatio} 
          subtext="Price to earnings multiple"
          icon={BarChart2} 
        />
        <MetricCard 
          title="Day Range" 
          value={rangeDisplay} 
          subtext={hasRange ? "Session Low — High" : "Intraday spread"}
          icon={Activity} 
        />
        <MetricCard 
          title="EPS (TTM)" 
          value={metrics.eps} 
          subtext="Diluted earnings per share"
          icon={BarChart2} 
        />
      </div>
    </div>
  );
};

export default MetricCards;
