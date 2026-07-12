import React from 'react';
import { Search, Activity } from 'lucide-react';

const Header = ({ query, setQuery, handleSearch, loading }) => {
  return (
    <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Activity className="w-6 h-6 text-emerald-400" />
            </div>
            <h1 className="text-xl font-bold font-serif text-slate-100 tracking-wide">
              AI Investment Agent
            </h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md ml-8">
            <form onSubmit={handleSearch} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-400 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search ticker (e.g., AAPL)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={loading}
                className="block w-full pl-10 pr-4 py-2 border border-slate-700 rounded-full bg-slate-800/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm transition-all disabled:opacity-50"
              />
              <button type="submit" className="hidden">Search</button>
            </form>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
