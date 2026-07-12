import React, { useState } from 'react';
import axios from 'axios';
import { Bot } from 'lucide-react';
import Header from './components/Header';
import MetricCards from './components/MetricCards';
import PriceChart from './components/PriceChart';
import AIAnalysis from './components/AIAnalysis';
import NewsFeed from './components/NewsFeed';

function App() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const API_URL = import.meta.env.PROD 
        ? '/api/research' 
        : 'http://localhost:5001/api/research';
        
      const response = await axios.post(API_URL, {
        company: query
      });
      setResult(response.data);
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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans selection:bg-emerald-500/30">
      <Header 
        query={query} 
        setQuery={setQuery} 
        handleSearch={handleSearch} 
        loading={loading} 
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Empty State */}
        {!loading && !result && !error && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-lg border border-slate-700">
              <Bot className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-slate-200 mb-2">Awaiting Instructions</h2>
            <p className="text-slate-500 max-w-md">
              Enter a valid stock ticker (e.g., AAPL, TSLA) in the search bar above to generate a deep-dive AI analysis and view real-time market data.
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
            </div>
            <h3 className="text-xl font-medium text-slate-200">Synthesizing Data...</h3>
            <p className="text-slate-500 mt-2">Gemini is analyzing fundamentals and recent news.</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-red-900/20 border border-red-500/30 rounded-2xl text-center max-w-2xl mx-auto mt-10">
            <h3 className="text-lg font-medium text-red-400 mb-2">Analysis Failed</h3>
            <p className="text-red-300/80">{error}</p>
          </div>
        )}

        {/* Dashboard Grid */}
        {result && !loading && !error && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-serif font-bold text-slate-100 uppercase tracking-wider">
                  {result.company} <span className="text-slate-500 text-xl font-sans normal-case ml-2">Overview</span>
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Metrics & Chart */}
              <div className="lg:col-span-8 flex flex-col">
                {/* Section A: Key Metrics */}
                <MetricCards metrics={result.financialMetrics} />
                
                {/* Section B: Price Chart */}
                <PriceChart historicalData={result.historicalData} />
              </div>

              {/* Right Column: AI Analysis */}
              <div className="lg:col-span-4">
                {/* Section C: AI Analysis Panel */}
                <AIAnalysis analysis={result} />
              </div>

            </div>

            {/* Section D: News Feed */}
            <NewsFeed newsData={result.newsData} />

          </div>
        )}

      </main>
    </div>
  );
}

export default App;
