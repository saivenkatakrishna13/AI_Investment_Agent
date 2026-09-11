import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Sparkles, TrendingUp, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import PriceChart from './components/PriceChart';
import AIAnalysis from './components/AIAnalysis';
import NewsFeed from './components/NewsFeed';
import DashboardSkeleton from './components/DashboardSkeleton';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Theme Management (Dark by default, persisted in localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleSearch = async (e, tickerOverride) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetSymbol = (tickerOverride || query).trim();
    if (!targetSymbol) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5002';
      const response = await axios.post(`${API_BASE}/api/research`, {
        company: targetSymbol
      });
      setResult(response.data);
      if (response.data?.company?.symbol) {
        setQuery(response.data.company.symbol);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || 
        err.message || 
        'An error occurred while fetching the analysis.'
      );
    } finally {
      setLoading(false);
    }
  };

  const quickTickers = [
    { symbol: 'AAPL', name: 'Apple Inc.' },
    { symbol: 'NVDA', name: 'NVIDIA Corp.' },
    { symbol: 'MSFT', name: 'Microsoft Corp.' },
    { symbol: 'AMZN', name: 'Amazon.com' },
    { symbol: 'TSLA', name: 'Tesla Inc.' }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500/20 selection:text-emerald-500 transition-colors duration-200">
      <Header 
        query={query} 
        setQuery={setQuery} 
        handleSearch={handleSearch} 
        loading={loading}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>

          {/* Loading Skeleton State */}
          {loading && <DashboardSkeleton />}

          {/* Empty State (Modern Interactive Hero) */}
          {!loading && !result && !error && (
            <div className="flex flex-col items-center justify-center py-20 sm:py-28 text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 mb-6 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen Financial Intelligence</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-3">
                Institutional-Grade Market Analysis Powered by AI
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-lg mb-8 leading-relaxed">
                Enter any company name or stock ticker to aggregate real-time valuation multiples, price action, and autonomous investment thesis synthesis via NVIDIA NIM.
              </p>

              {/* Quick Select Shortcut Chips */}
              <div className="w-full">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  Trending Assets
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {quickTickers.map((item) => (
                    <button
                      key={item.symbol}
                      onClick={() => {
                        setQuery(item.symbol);
                        handleSearch(null, item.symbol);
                      }}
                      className="group flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-xs hover:shadow-sm hover:-translate-y-0.5 transition-all text-left"
                    >
                      <span className="font-bold text-xs text-slate-900 dark:text-white">
                        {item.symbol}
                      </span>
                      <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {item.name}
                      </span>
                      <ArrowUpRight className="w-3 h-3 text-slate-400 group-hover:text-emerald-500 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-6 rounded-2xl bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/30 text-center max-w-xl mx-auto my-12 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center mx-auto">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Analysis Request Failed
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                {error}
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleSearch(null, query)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Try Again
                </button>
              </div>
            </div>
          )}

          {/* Dashboard View */}
          {result && !loading && !error && (
            <div className="space-y-6">
              
              {/* Top Section: Hero Ticker Header + Compact Metric Cards */}
              <MetricCards 
                metrics={result.financialMetrics} 
                company={result.company?.symbol || result.ticker}
                companyName={result.company?.name || result.companyName}
              />

              {/* Middle Section: Price Chart (8 cols) & AI Analysis (4 cols) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Column: Price Chart */}
                <div className="lg:col-span-8">
                  <PriceChart 
                    historicalData={result.historicalData} 
                    historicalStatus={result.historicalStatus}
                    historicalReason={result.historicalReason}
                  />
                </div>

                {/* Right Column: AI Analysis Panel */}
                <div className="lg:col-span-4">
                  <AIAnalysis analysis={result} />
                </div>

              </div>

              {/* Bottom Section: Market Intelligence / News Feed */}
              <NewsFeed newsData={result.newsData} />

            </div>
          )}

        </ErrorBoundary>
      </main>
    </div>
  );
}

export default App;
