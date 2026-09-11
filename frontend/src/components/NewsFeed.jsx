import React from 'react';
import { Newspaper, ExternalLink, Calendar } from 'lucide-react';

const NewsFeed = ({ newsData }) => {
  if (!Array.isArray(newsData) || newsData.length === 0) {
    return null;
  }

  // Display top 6 news articles
  const headlines = newsData.slice(0, 6);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recent';
    }
  };

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-sm mt-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/70 mb-5">
        <div className="flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-emerald-500" />
          <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Market Intelligence & Recent Coverage
          </h3>
        </div>
        <span className="text-[11px] font-medium text-slate-400">
          {headlines.length} Articles Sourced
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {headlines.map((article, index) => {
          return (
            <a 
              key={index} 
              href={article.url || '#'} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-4 rounded-xl border border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-800/70 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 truncate max-w-[140px]">
                    {article.source?.name || 'Market News'}
                  </span>
                  <span className="text-[11px] text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(article.publishedAt)}
                  </span>
                </div>

                <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2 leading-snug">
                  {article.title}
                </h4>

                {article.description && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {article.description}
                  </p>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between text-[11px] font-semibold text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                <span>Read Coverage</span>
                <ExternalLink className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;
