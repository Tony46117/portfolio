import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, TrendingDown, HelpCircle, Activity, RefreshCw } from 'lucide-react';

interface MetricPoint {
  batch: number;
  unoptimized: number;
  optimized: number;
}

export default function QueryOptimizer() {
  const [selectedMode, setSelectedMode] = useState<'unoptimized' | 'optimized'>('optimized');
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [completedBatches, setCompletedBatches] = useState<MetricPoint[]>([]);
  const [activeStep, setActiveStep] = useState<string>('Ready');

  const fullData: MetricPoint[] = [
    { batch: 1, unoptimized: 28.5, optimized: 1.5 },
    { batch: 2, unoptimized: 32.1, optimized: 1.7 },
    { batch: 3, unoptimized: 45.4, optimized: 1.9 },
    { batch: 4, unoptimized: 39.8, optimized: 1.6 },
    { batch: 5, unoptimized: 55.2, optimized: 2.1 },
    { batch: 6, unoptimized: 62.0, optimized: 1.8 },
  ];

  const handleSimulate = async () => {
    setIsRunning(true);
    setCompletedBatches([]);
    setProgress(0);

    const steps = [
      { msg: 'Initiating context pool...', delay: 400 },
      { msg: 'Reading transactions ledger (ACID Level 3)...', delay: 600 },
      { msg: selectedMode === 'unoptimized' ? 'Executing nested ORM loops (N+1 query problem)...' : 'Leveraging dynamic compound PostgreSQL index...', delay: 800 },
      { msg: selectedMode === 'unoptimized' ? 'Aggregating memory lists in Python layers...' : 'Applying Postgres JSONB single-pass aggregates...', delay: 600 },
      { msg: 'Query completed successfully.', delay: 300 }
    ];

    for (let i = 0; i < steps.length; i++) {
      setActiveStep(steps[i].msg);
      setProgress((prev) => ((i + 1) / steps.length) * 100);
      await new Promise(resolve => setTimeout(resolve, steps[i].delay));
    }

    // Load metrics points sequentially for beautiful animation
    for (let i = 0; i < fullData.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 150));
      setCompletedBatches(prev => [...prev, fullData[i]]);
    }

    setIsRunning(false);
    setActiveStep('Simulation Complete');
  };

  useEffect(() => {
    // Initial run
    handleSimulate();
  }, [selectedMode]);

  return (
    <div id="query-optimizer" className="bg-[#0a0a0a] p-6 rounded border border-white/5 text-[#e5e5e5] font-sans shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/30">
              Database Optimizer
            </span>
            <span className="text-xs text-neutral-400 font-mono">PostgreSQL 16 Engine</span>
          </div>
          <h4 className="text-xl font-sans font-bold text-white">Index and Query Optimizer</h4>
          <p className="text-neutral-400 text-sm max-w-xl">
            A visual audit comparing a legacy SQLAlchemy ORM nested loop against an optimized PostgreSQL index configuration with aggregated window operators.
          </p>
        </div>

        {/* Toggle Mode */}
        <div className="flex bg-neutral-900/50 p-1 rounded border border-white/5 shrink-0 self-start md:self-center">
          <button
            id="opt-toggle-unoptimized"
            onClick={() => setSelectedMode('unoptimized')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded text-xs font-semibold font-mono transition-all cursor-pointer ${
              selectedMode === 'unoptimized'
                ? 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-md'
                : 'text-neutral-400 hover:text-[#e5e5e5]'
            }`}
          >
            Legacy ORM (Slow)
          </button>
          <button
            id="opt-toggle-optimized"
            onClick={() => setSelectedMode('optimized')}
            disabled={isRunning}
            className={`px-3 py-1.5 rounded text-xs font-semibold font-mono transition-all cursor-pointer ${
              selectedMode === 'optimized'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-md'
                : 'text-neutral-400 hover:text-[#e5e5e5]'
            }`}
          >
            Optimized SQL (Fast)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* SQL Comparison & Stats Column */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="bg-neutral-900/50 p-4.5 rounded border border-white/5 space-y-4">
            <h5 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Execution Details
            </h5>
            
            {/* Live Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-neutral-400 font-mono">
                <span className="truncate max-w-[250px]">{activeStep}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    selectedMode === 'unoptimized' ? 'bg-red-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Code Snippet Box */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-neutral-400">Executed Syntax:</div>
              <pre className="p-3 bg-neutral-950 rounded border border-white/5 font-mono text-[11px] text-neutral-300 overflow-x-auto whitespace-pre leading-relaxed select-all">
                {selectedMode === 'unoptimized' ? (
`# ❌ UNOPTIMIZED: SQLAlchemy N+1 Loop
ledger_sums = {}
for merchant in db.query(Merchant).all():
    # Triggering query per merchant record
    ledgers = db.query(Ledger).filter(
        Ledger.merchant_id == merchant.id
    ).all()
    ledger_sums[merchant.name] = sum(
        l.amount for l in ledgers
    )`
                ) : (
`-- ✅ OPTIMIZED: Postgres Single-Pass Hash JOIN
SELECT 
  m.name, 
  COALESCE(SUM(l.amount), 0) as total_volume
FROM merchants m
LEFT JOIN ledgers l ON m.id = l.merchant_id
-- Using COMPOUND INDEX: idx_ledgers_merchant_amount
GROUP BY m.id, m.name;`
                )}
              </pre>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-neutral-900/50 p-3.5 rounded border border-white/5">
              <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-1">Average Latency</div>
              <div className={`text-2xl font-sans font-bold ${
                selectedMode === 'unoptimized' ? 'text-red-400' : 'text-emerald-400'
              }`}>
                {selectedMode === 'unoptimized' ? '43.8 ms' : '1.8 ms'}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                {selectedMode === 'unoptimized' ? 'High DB CPU cycle usage' : 'Optimized single-index scan'}
              </div>
            </div>

            <div className="bg-neutral-900/50 p-3.5 rounded border border-white/5 flex flex-col justify-between">
              <div>
                <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider mb-1">Efficiency Gain</div>
                <div className="text-2xl font-sans font-bold text-indigo-400 flex items-center gap-1">
                  <TrendingDown className="w-5 h-5" />
                  95.8%
                </div>
              </div>
              <div className="text-[10px] text-neutral-400 mt-1">
                Reduced network payloads & serialization costs
              </div>
            </div>
          </div>

          <button
            id="btn-re-simulate"
            disabled={isRunning}
            onClick={handleSimulate}
            className="w-full py-2.5 flex items-center justify-center gap-2 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-950 disabled:text-neutral-600 text-neutral-300 border border-white/5 rounded text-xs font-semibold font-mono transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            Run Active Query Profiler
          </button>
        </div>

        {/* Visual Line Chart Column */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-neutral-900/40 p-5 rounded border border-white/5">
          <div>
            <h5 className="text-sm font-semibold text-neutral-200 mb-1 flex items-center gap-2">
              <span>Database Query Latency Comparison</span>
              {selectedMode === 'optimized' && (
                <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <CheckCircle2 className="w-3 h-3" /> Index Match
                </span>
              )}
            </h5>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Latency (ms) plotted across 6 consecutive concurrent query batches under 100 concurrent threads.
            </p>
          </div>

          {/* SVG Custom Graph */}
          <div className="relative h-[220px] w-full flex items-end border-b border-l border-white/5 pb-2 pl-2">
            {/* Grid background lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none select-none">
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
              <div className="w-full border-t border-white/5" />
            </div>

            {/* Left Y-axis labels */}
            <div className="absolute left-[-24px] top-0 bottom-2 flex flex-col justify-between text-[9px] font-mono text-neutral-600 text-right select-none">
              <span>60ms</span>
              <span>45ms</span>
              <span>30ms</span>
              <span>15ms</span>
              <span>0ms</span>
            </div>

            {/* Graph Paths */}
            {completedBatches.length > 0 && (
              <svg className="absolute inset-0 w-full h-full p-2 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  {/* Gradients */}
                  <linearGradient id="grad-unoptimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="grad-optimized" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* Path Unoptimized */}
                {selectedMode === 'unoptimized' && (
                  <>
                    <path
                      d={`M 0,${100 - (completedBatches[0]?.unoptimized / 65) * 100} ` + 
                        completedBatches.slice(1).map((pt, i) => `L ${(i + 1) * 20},${100 - (pt.unoptimized / 65) * 100}`).join(' ')}
                      fill="none"
                      stroke="rgb(239, 68, 68)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <path
                      d={`M 0,100 L 0,${100 - (completedBatches[0]?.unoptimized / 65) * 100} ` + 
                        completedBatches.slice(1).map((pt, i) => `L ${(i + 1) * 20},${100 - (pt.unoptimized / 65) * 100}`).join(' ') + ' L 100,100 Z'}
                      fill="url(#grad-unoptimized)"
                    />
                  </>
                )}

                {/* Path Optimized */}
                <path
                  d={`M 0,${100 - (completedBatches[0]?.optimized / 65) * 100} ` + 
                    completedBatches.slice(1).map((pt, i) => `L ${(i + 1) * 20},${100 - (pt.optimized / 65) * 100}`).join(' ')}
                  fill="none"
                  stroke="rgb(99, 102, 241)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d={`M 0,100 L 0,${100 - (completedBatches[0]?.optimized / 65) * 100} ` + 
                    completedBatches.slice(1).map((pt, i) => `L ${(i + 1) * 20},${100 - (pt.optimized / 65) * 100}`).join(' ') + ' L 100,100 Z'}
                  fill="url(#grad-optimized)"
                />

                {/* Plot dots for current active */}
                {completedBatches.map((pt, idx) => {
                  const cx = idx * 20;
                  const cy = selectedMode === 'unoptimized' ? 100 - (pt.unoptimized / 65) * 100 : 100 - (pt.optimized / 65) * 100;
                  const color = selectedMode === 'unoptimized' ? 'rgb(239, 68, 68)' : 'rgb(99, 102, 241)';
                  return (
                    <circle
                      key={idx}
                      cx={cx}
                      cy={cy}
                      r="3.5"
                      fill={color}
                      stroke="rgb(10, 10, 10)"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            )}

            {/* Render bars dynamically */}
            <div className="absolute inset-x-0 bottom-[-22px] flex justify-between px-2 text-[9px] font-mono text-neutral-500">
              <span>Batch 1</span>
              <span>Batch 2</span>
              <span>Batch 3</span>
              <span>Batch 4</span>
              <span>Batch 5</span>
              <span>Batch 6</span>
            </div>
          </div>

          {/* Explanation Footer */}
          <div className="mt-8 flex gap-3 text-xs bg-[#0a0a0a] p-3 rounded border border-white/5">
            {selectedMode === 'unoptimized' ? (
              <>
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <p className="text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-white">N+1 Query Overhead:</span> Each merchant fetches ledgers independently. As data expands linearly (O(N)), the connection pools saturate, resulting in high latency spikes and unoptimized DB query load.
                </p>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <p className="text-neutral-300 leading-relaxed">
                  <span className="font-semibold text-white">Hash Join optimization:</span> Merging merchant and ledger indexes directly in PostgreSQL memory results in sub-2ms lookups. CPU constraints remain flat even as dataset scales exponentially.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
