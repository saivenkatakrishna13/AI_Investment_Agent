import React from 'react';
import { AlertTriangle, Sparkles, CheckCircle2, ShieldAlert, TrendingUp, MessageSquare } from 'lucide-react';

const AIAnalysis = ({ analysis }) => {
  if (!analysis) return null;

  const getDecisionBadge = (decision) => {
    const d = (decision || 'WATCHLIST').toUpperCase();
    if (d.includes('INVEST')) {
      return {
        text: 'INVEST',
        style: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 ring-1 ring-emerald-500/20'
      };
    }
    if (d.includes('PASS')) {
      return {
        text: 'PASS',
        style: 'bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 ring-1 ring-rose-500/20'
      };
    }
    return {
      text: 'WATCHLIST',
      style: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 ring-1 ring-amber-500/20'
    };
  };

  const badge = getDecisionBadge(analysis.decision);
  const confidence = typeof analysis.confidence === 'number' ? analysis.confidence : 85;

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200/90 dark:border-slate-800/80 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/70 bg-slate-50/50 dark:bg-slate-900/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
                ✦ NVIDIA NIM
              </span>
              <span className="text-[11px] font-medium text-slate-400">
                AI Insight
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Executive Verdict
            </h2>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider border shadow-xs ${badge.style}`}>
            {badge.text}
          </span>
        </div>

        {/* Confidence Meter Bar */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-slate-500 dark:text-slate-400">Confidence Rating</span>
            <span className="font-bold text-slate-700 dark:text-slate-200">{confidence}%</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(0, confidence))}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 overflow-y-auto space-y-5 text-sm">
        
        {/* Core Summary */}
        {analysis.summary && (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800/60">
            <p className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed">
              {analysis.summary}
            </p>
          </div>
        )}

        {/* Bullish Signals */}
        {Array.isArray(analysis.keyReasons) && analysis.keyReasons.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
              Bullish Signals
            </h3>
            <ul className="space-y-2">
              {analysis.keyReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="leading-snug">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Bearish Risks */}
        {Array.isArray(analysis.risks) && analysis.risks.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
              Bearish Risks
            </h3>
            <ul className="space-y-2">
              {analysis.risks.map((risk, index) => (
                <li key={index} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-snug">{risk}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* News Sentiment Pill & Summary */}
        {analysis.newsSummary && (
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              <MessageSquare className="w-3 h-3 text-slate-400" />
              News Sentiment Summary
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              {analysis.newsSummary}
            </p>
          </div>
        )}

      </div>

      {/* Footer Verdict Quote */}
      {analysis.finalVerdict && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-800/70 bg-emerald-500/5 dark:bg-emerald-950/10">
          <div className="text-[10px] font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-1">
            Analyst Conclusion
          </div>
          <p className="text-xs font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
            "{analysis.finalVerdict}"
          </p>
        </div>
      )}
    </div>
  );
};

export default AIAnalysis;
