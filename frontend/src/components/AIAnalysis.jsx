import React from 'react';
import { AlertTriangle, Lightbulb, Activity, CheckCircle2 } from 'lucide-react';

const AIAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const getBadgeStyle = (decision) => {
    if (!decision) return 'bg-slate-700 text-slate-300 border-slate-600';
    const d = decision.toUpperCase();
    if (d.includes('INVEST')) return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (d.includes('PASS')) return 'bg-red-500/20 text-red-400 border-red-500/30';
    if (d.includes('WATCH')) return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
  };

  return (
    <div className="bg-slate-800/80 rounded-2xl border border-slate-700 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-700 bg-slate-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-serif font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              Gemini Analysis
            </h2>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
              Confidence Score: <span className="font-bold text-slate-200">{analysis.confidence}%</span>
            </p>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold tracking-wide border ${getBadgeStyle(analysis.decision)}`}>
            {analysis.decision || 'WATCHLIST'}
          </span>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
        
        {/* Summary */}
        <div>
          <p className="text-slate-300 leading-relaxed text-sm">
            {analysis.summary}
          </p>
        </div>

        {/* Key Reasons */}
        {analysis.keyReasons && analysis.keyReasons.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <Lightbulb className="w-4 h-4 text-emerald-400" />
              Bullish Signals
            </h3>
            <ul className="space-y-3">
              {analysis.keyReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                  <span className="leading-relaxed">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Risks */}
        {analysis.risks && analysis.risks.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-slate-100 mb-3 flex items-center gap-2 uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Bearish Risks
            </h3>
            <ul className="space-y-3">
              {analysis.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                  <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Sentiment */}
        {analysis.newsSummary && (
          <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50">
            <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">News Sentiment</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              {analysis.newsSummary}
            </p>
          </div>
        )}

      </div>

      {/* Footer Verdict */}
      <div className="p-6 border-t border-slate-700 bg-slate-900/30">
        <p className="text-sm text-slate-100 font-medium italic font-serif text-center">
          "{analysis.finalVerdict}"
        </p>
      </div>

    </div>
  );
};

export default AIAnalysis;
