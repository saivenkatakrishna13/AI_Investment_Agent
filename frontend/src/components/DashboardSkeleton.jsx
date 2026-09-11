import React from 'react';

const DashboardSkeleton = () => {
  return (
    <div className="animate-pulse space-y-6">
      {/* Ticker & Hero Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800/80">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            <div className="h-6 w-36 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
          </div>
          <div className="h-4 w-48 bg-slate-200 dark:bg-slate-800/60 rounded"></div>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-9 w-28 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
        </div>
      </div>

      {/* Metrics Cards Skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-3"
          >
            <div className="flex justify-between items-center">
              <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-6 w-6 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
            <div className="h-7 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & AI Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart Skeleton */}
        <div className="lg:col-span-8 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm flex flex-col h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <div className="h-4 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="flex gap-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-6 w-10 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 w-full bg-slate-100 dark:bg-slate-800/40 rounded-xl flex items-end p-4 gap-3">
            {[40, 65, 50, 80, 70, 90, 85, 95, 75, 88].map((h, idx) => (
              <div
                key={idx}
                className="flex-1 bg-slate-200 dark:bg-slate-800/80 rounded-t"
                style={{ height: `${h}%` }}
              ></div>
            ))}
          </div>
        </div>

        {/* AI Insight Skeleton */}
        <div className="lg:col-span-4 p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-5">
          <div className="flex justify-between items-start pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-5 w-36 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
            <div className="h-7 w-20 bg-slate-200 dark:bg-slate-800 rounded-full"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3.5 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-3.5 w-5/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-3.5 w-4/6 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
          <div className="space-y-3 pt-2">
            <div className="h-4 w-24 bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
            <div className="h-3 w-11/12 bg-slate-200 dark:bg-slate-800 rounded"></div>
          </div>
        </div>
      </div>

      {/* News Skeleton */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 shadow-sm space-y-4">
        <div className="h-4 w-40 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/30 space-y-3">
              <div className="flex justify-between">
                <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-3 w-12 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
              <div className="h-3 w-4/5 bg-slate-200 dark:bg-slate-800 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;
