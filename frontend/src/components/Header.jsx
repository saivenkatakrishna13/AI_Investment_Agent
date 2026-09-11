import React, { useState, useEffect, useRef } from 'react';
import { Search, Sparkles, Sun, Moon, ArrowRight, Loader2 } from 'lucide-react';
import axios from 'axios';

const Header = ({ query, setQuery, handleSearch, loading, theme, toggleTheme }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced autocomplete search
  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(async () => {
      setIsSearchingSuggestions(true);
      try {
        const API_BASE = import.meta.env.PROD ? '' : 'http://localhost:5002';
        const res = await axios.get(`${API_BASE}/api/search?q=${encodeURIComponent(query.trim())}`);
        if (Array.isArray(res.data) && res.data.length > 0) {
          setSuggestions(res.data);
          setIsDropdownOpen(true);
        } else {
          setSuggestions([]);
          setIsDropdownOpen(false);
        }
      } catch (err) {
        setSuggestions([]);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 250);

    return () => clearTimeout(debounceTimerRef.current);
  }, [query]);

  const selectSuggestion = (item) => {
    setQuery(item.symbol);
    setIsDropdownOpen(false);
    // Trigger search immediately for selected ticker
    const fakeEvent = { preventDefault: () => {} };
    handleSearch(fakeEvent, item.symbol);
  };

  const handleKeyDown = (e) => {
    if (!isDropdownOpen || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-[#0b0f17]/80 backdrop-blur-xl transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-[1px] shadow-sm shadow-emerald-500/20">
              <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[11px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base tracking-tight text-slate-900 dark:text-white">
                  InvestIQ
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  NVIDIA NIM
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5">
                Financial Intelligence
              </p>
            </div>
          </div>

          {/* Smart Search Bar */}
          <div ref={searchContainerRef} className="flex-1 max-w-lg relative">
            <form onSubmit={(e) => handleSearch(e, query)} className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                {isSearchingSuggestions ? (
                  <Loader2 className="h-4 w-4 text-emerald-500 animate-spin" />
                ) : (
                  <Search className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                )}
              </div>
              <input
                type="text"
                placeholder="Search ticker or company (e.g. Apple, NVDA, TSLA)..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(-1);
                }}
                onKeyDown={handleKeyDown}
                onFocus={() => {
                  if (suggestions.length > 0) setIsDropdownOpen(true);
                }}
                disabled={loading}
                className="w-full pl-10 pr-10 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/60 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !query.trim()}
                aria-label="Submit search"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 dark:hover:text-emerald-400 hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Autocomplete Dropdown */}
            {isDropdownOpen && suggestions.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-xl shadow-slate-950/10 dark:shadow-slate-950/40 z-50 overflow-hidden">
                <div className="px-3 py-1 text-[11px] font-medium tracking-wider uppercase text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/80">
                  Matching Companies & Tickers
                </div>
                {suggestions.map((item, idx) => (
                  <button
                    key={`${item.symbol}-${idx}`}
                    type="button"
                    onClick={() => selectSuggestion(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between transition-colors ${
                      selectedIndex === idx
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className="font-semibold text-xs px-1.5 py-0.5 rounded bg-slate-200/70 dark:bg-slate-800 text-slate-800 dark:text-slate-200 shrink-0">
                        {item.symbol}
                      </span>
                      <span className="text-xs truncate font-medium">
                        {item.description}
                      </span>
                    </div>
                    {item.type && (
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0 ml-2">
                        {item.type}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions: Theme Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle light or dark theme"
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600 hover:-rotate-12 transition-transform" />
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
