import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, RotateCcw, AlertTriangle, ShieldCheck, Cpu, Terminal, ArrowRight } from 'lucide-react';

interface MockResponse {
  status: number;
  statusText: string;
  timeMs: number;
  headers: Record<string, string>;
  body: Record<string, any>;
}

export default function ApiSimulator() {
  const [rateLimitCounter, setRateLimitCounter] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    'SYSTEM: [Uvicorn] Running on http://127.0.0.1:8000 (Press CTRL+C to quit)',
    'SYSTEM: [Redis] Connected to redis://localhost:6379/0 - Token bucket loaded (limit: 5 req/10s)'
  ]);
  const [response, setResponse] = useState<MockResponse | null>(null);
  const [authEnabled, setAuthEnabled] = useState(true);

  const triggerRequest = async (forceOverLimit: boolean) => {
    setIsLoading(true);
    setResponse(null);
    const newLogs = [...logs];
    const timestamp = new Date().toLocaleTimeString();
    
    // Log incoming request
    newLogs.push(`${timestamp} -> INCOMING: GET /api/v1/orchestration/dispatch`);
    setLogs(newLogs);

    // Simulate network & CPU delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (authEnabled && Math.random() < 0.1) {
      // Small chance of authentication error if auth toggle is messed with (or random mock token failure)
      newLogs.push(`${timestamp} <- RESPONSE: 401 Unauthorized - Invalid Authorization Header`);
      setResponse({
        status: 401,
        statusText: 'Unauthorized',
        timeMs: 4,
        headers: {
          'content-type': 'application/json',
          'www-authenticate': 'Bearer realm="secure_endpoints"'
        },
        body: {
          detail: 'Could not validate credentials',
          code: 'AUTH_FAILED',
          suggestion: 'Ensure header contains: Authorization: Bearer <valid_token>'
        }
      });
      setLogs(newLogs);
      setIsLoading(false);
      return;
    }

    if (forceOverLimit || rateLimitCounter >= 5) {
      newLogs.push(`${timestamp} <- WARNING: 429 Too Many Requests - Redis rate limit threshold breached!`);
      setResponse({
        status: 429,
        statusText: 'Too Many Requests',
        timeMs: 3,
        headers: {
          'content-type': 'application/json',
          'x-ratelimit-limit': '5',
          'x-ratelimit-remaining': '0',
          'x-ratelimit-reset': '10',
          'retry-after': '10'
        },
        body: {
          detail: 'Rate limit exceeded. Flow control applied via Redis Token Bucket.',
          policy: 'IP_SLIDING_WINDOW_5_PER_10S',
          actions: ['Apply backoff strategy', 'Retry after cooldown period']
        }
      });
      setLogs(newLogs);
      setIsLoading(false);
      return;
    }

    // Normal successful request
    const mockLatency = Math.floor(Math.random() * 8) + 4; // 4-12ms
    const remaining = Math.max(0, 5 - rateLimitCounter - 1);
    setRateLimitCounter((prev) => prev + 1);

    newLogs.push(`${timestamp} <- RESPONSE: 200 OK - Task dispatched in ${mockLatency}ms`);
    setResponse({
      status: 200,
      statusText: 'OK',
      timeMs: mockLatency,
      headers: {
        'content-type': 'application/json',
        'x-ratelimit-limit': '5',
        'x-ratelimit-remaining': remaining.toString(),
        'x-process-time': `${mockLatency / 1000}s`,
        'server': 'uvicorn / fastapi'
      },
      body: {
        status: 'success',
        task_id: `task_${Math.random().toString(36).substring(2, 9)}`,
        dispatched_at: new Date().toISOString(),
        load_factor: '0.34 (Optimal)',
        worker_group: 'group_async_a',
        data: {
          pipeline_state: 'processing_active',
          queued_jobs: 0,
          memory_allocated_mb: 28.4
        }
      }
    });

    setLogs(newLogs);
    setIsLoading(false);
  };

  const resetSimulator = () => {
    setRateLimitCounter(0);
    setResponse(null);
    setLogs([
      'SYSTEM: [Uvicorn] Running on http://127.0.0.1:8000 (Press CTRL+C to quit)',
      'SYSTEM: [Redis] Connected to redis://localhost:6379/0 - Token bucket loaded (limit: 5 req/10s)'
    ]);
  };

  return (
    <div id="api-simulator" className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-[#0a0a0a] p-6 rounded border border-white/5 text-[#e5e5e5] font-sans shadow-2xl">
      {/* Left Pane: Interactive Controls */}
      <div className="flex flex-col justify-between space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-2 py-0.5 text-xs font-mono font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/30">
              FastAPI Controller
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-neutral-400 font-mono">http://127.0.0.1:8000</span>
          </div>
          <h4 className="text-xl font-sans font-bold text-white mb-2">Redis Token Bucket Simulator</h4>
          <p className="text-neutral-400 text-sm leading-relaxed">
            FastAPI handles async requests incredibly fast. In high-load systems, we need back-pressure protection. This simulator runs a true-to-life token bucket flow control that blocks clients when request limits are crossed.
          </p>
        </div>

        {/* Status meters */}
        <div className="bg-neutral-900/50 p-4 rounded border border-white/5 space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1 text-xs">
              <span className="text-neutral-400 font-medium">Redis Token Capacity (5 max per 10s)</span>
              <span className="font-mono text-white font-semibold">
                {Math.max(0, 5 - rateLimitCounter)} / 5 Available
              </span>
            </div>
            <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden flex">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`h-full flex-1 border-r border-[#0a0a0a] transition-colors duration-300 ${
                    i < 5 - rateLimitCounter
                      ? 'bg-gradient-to-r from-indigo-600 to-indigo-500'
                      : 'bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-between gap-4 text-xs">
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded border border-white/5 flex-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Security Auth</div>
                <div className="font-semibold text-neutral-300">FastAPI Depends()</div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-neutral-950 p-2.5 rounded border border-white/5 flex-1">
              <Cpu className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-neutral-500 text-[10px] uppercase font-bold tracking-wider">Event Loop</div>
                <div className="font-semibold text-neutral-300">Asyncio Task</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <button
              id="btn-trigger-normal"
              disabled={isLoading}
              onClick={() => triggerRequest(false)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold rounded text-sm transition-all shadow-lg shadow-indigo-600/10 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              Send API Request
            </button>

            <button
              id="btn-trigger-spam"
              disabled={isLoading}
              onClick={() => triggerRequest(true)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/20 font-semibold rounded text-sm transition-all cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Simulate Spam Attack
            </button>
          </div>

          <button
            id="btn-reset-sim"
            onClick={resetSimulator}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 rounded text-xs font-mono transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear Logs & Refresh Bucket
          </button>
        </div>
      </div>

      {/* Right Pane: Live CLI / Header Visualizer */}
      <div className="flex flex-col h-[380px] bg-neutral-900/40 rounded border border-white/5 overflow-hidden font-mono text-xs">
        {/* CLI Header tabs */}
        <div className="bg-neutral-950 border-b border-white/5 px-4 py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-4 h-4 text-neutral-400" />
            <span className="text-neutral-300 font-semibold text-xs">FastAPI Middleware Output</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
            <span className="w-2.5 h-2.5 rounded-full bg-neutral-800" />
          </div>
        </div>

        {/* Logs Output scrolling area */}
        <div className="flex-1 p-4 overflow-y-auto space-y-2 select-text text-neutral-300">
          {logs.map((log, idx) => (
            <div key={idx} className={`leading-relaxed ${
              log.includes('SYSTEM:') ? 'text-indigo-400/80' :
              log.includes('429') ? 'text-red-400' :
              log.includes('200') ? 'text-emerald-400' :
              log.includes('401') ? 'text-yellow-400' : 'text-neutral-300'
            }`}>
              {log}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-indigo-400 animate-pulse py-1">
              <span className="inline-block w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" />
              <span>Awaiting thread release from FastAPI middleware...</span>
            </div>
          )}
        </div>

        {/* Mock JSON Response Payload Card */}
        <AnimatePresence>
          {response && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: '210px', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-white/5 bg-neutral-950 flex flex-col overflow-hidden"
            >
              <div className="bg-neutral-900 border-b border-white/5 px-4 py-2 flex justify-between items-center text-[11px]">
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                    response.status === 200 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                  }`}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-neutral-400">Response Header</span>
                </div>
                <span className="text-neutral-500">{response.timeMs}ms</span>
              </div>
              <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] space-y-3">
                {/* Headers */}
                <div className="text-neutral-500">
                  <div className="font-semibold text-neutral-400 mb-1">Response Headers:</div>
                  {Object.entries(response.headers).map(([k, v]) => (
                    <div key={k} className="pl-2">
                      <span className="text-indigo-400">{k}</span>: <span className="text-neutral-300">{v}</span>
                    </div>
                  ))}
                </div>
                {/* Body */}
                <div>
                  <div className="font-semibold text-neutral-400 mb-1">Response JSON Payload:</div>
                  <pre className="bg-[#0a0a0a]/60 p-2 rounded border border-white/5 text-emerald-400 select-all overflow-x-auto">
                    {JSON.stringify(response.body, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
