import React from 'react';
import { Newspaper } from 'lucide-react';

const NewsFeed = ({ newsData }) => {
  if (!newsData || newsData.length === 0) {
    return null;
  }

  // Display top 6 news articles
  const headlines = newsData.slice(0, 6);

  return (
    <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-6">
        <Newspaper className="w-5 h-5 text-emerald-500" />
        <h3 className="text-lg font-bold text-slate-100 font-serif">Latest Headlines</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {headlines.map((article, index) => {
          const date = new Date(article.publishedAt).toLocaleDateString();
          return (
            <a 
              key={index} 
              href={article.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="block group bg-slate-700/30 hover:bg-slate-700/70 rounded-xl p-4 border border-slate-700 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                  {article.source?.name || 'News Source'}
                </span>
                <span className="text-xs text-slate-500">
                  {date}
                </span>
              </div>
              <h4 className="text-sm font-medium text-slate-200 group-hover:text-emerald-300 transition-colors line-clamp-3">
                {article.title}
              </h4>
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default NewsFeed;
