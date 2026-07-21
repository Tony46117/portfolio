import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, FileText, Send, CheckCircle2, ChevronRight, CornerDownRight, Server, Terminal, Lock } from 'lucide-react';
import { apiPlaygroundEndpoints } from '../data';
import { ApiEndpoint } from '../types';

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(apiPlaygroundEndpoints[0]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({
    name: 'Jane Doe',
    email: 'jane@example.com',
    message: 'Hi Antony, I would love to talk about a full-stack FastAPI + React contract!',
    optimization_level: 'optimized'
  });
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [headersOutput, setHeadersOutput] = useState<Record<string, string> | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);

  const handleParamChange = (name: string, val: string) => {
    setParamValues(prev => ({ ...prev, [name]: val }));
  };

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponseOutput(null);
    setHttpStatus(null);

    // Network simulate
    await new Promise(resolve => setTimeout(resolve, 900));

    if (selectedEndpoint.id === 'get-profile') {
      setHttpStatus(200);
      setHeadersOutput({
        'content-type': 'application/json',
        'server': 'uvicorn / fastapi',
        'x-process-time': '0.0031s',
        'cache-control': 'max-age=3600'
      });
      setResponseOutput(selectedEndpoint.responseExample);
    } else if (selectedEndpoint.id === 'post-contact') {
      const name = paramValues.name || 'Anonymous';
      const email = paramValues.email || 'anon@example.com';
      const message = paramValues.message || '';

      if (!email.includes('@')) {
        setHttpStatus(422);
        setHeadersOutput({
          'content-type': 'application/json',
          'server': 'uvicorn / fastapi',
          'x-process-time': '0.0018s'
        });
        setResponseOutput({
          detail: [
            {
              loc: ['body', 'email'],
              msg: 'value is not a valid email address',
              type: 'value_error.email'
            }
          ]
        });
      } else {
        setHttpStatus(200);
        setHeadersOutput({
          'content-type': 'application/json',
          'server': 'uvicorn / fastapi',
          'x-process-time': '0.0042s'
        });
        setResponseOutput({
          status: 'received',
          message: `Thank you ${name}, your contact message has been processed successfully!`,
          timestamp: new Date().toISOString(),
          pydantic_validation: 'Passed [No Errors]',
          payload_meta: {
            char_count: message.length,
            email_domain: email.split('@')[1]
          }
        });
      }
    } else if (selectedEndpoint.id === 'simulate-query') {
      const isOptimized = paramValues.optimization_level === 'optimized';
      setHttpStatus(200);
      setHeadersOutput({
        'content-type': 'application/json',
        'server': 'uvicorn / fastapi',
        'x-process-time': isOptimized ? '0.0015s' : '0.0324s'
      });
      setResponseOutput({
        status: 'success',
        query_meta: {
          raw_sql: 'SELECT m.name, SUM(l.amount) FROM merchants m JOIN ledgers l ON m.id = l.merchant_id GROUP BY m.id;',
          index_used: isOptimized ? 'idx_ledgers_merchant_id (Hash Join)' : 'None (Full Table Seq Scan)',
          estimated_rows: 5120
        },
        execution_stats: {
          latency_ms: isOptimized ? 1.82 : 32.40,
          unoptimized_latency_ms: 32.40,
          speedup: isOptimized ? '17.8x' : '1.0x (unoptimized)'
        },
        payload: [
          { merchant: 'Apex Logistics', total_volume: 12450.50 },
          { merchant: 'Vertex Tech', total_volume: 8240.20 }
        ]
      });
    }

    setIsExecuting(false);
  };

  return (
    <div className="bg-[#0a0a0a] rounded border border-white/5 shadow-2xl overflow-hidden text-[#e5e5e5] font-sans">
      {/* Top Banner styled like Swagger Docs UI */}
      <div className="bg-neutral-950 px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-lg font-bold text-white flex items-center gap-2">
              FastAPI Interactive API Sandbox
            </h4>
            <p className="text-xs text-neutral-400">
              Auto-generated from Pydantic models. Click endpoints to inspect schema properties and test live queries.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center font-mono text-xs text-neutral-500">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span>v1.2.0 (OpenAPI 3.1)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Endpoint Navigation Sidebar */}
        <div className="md:col-span-4 bg-neutral-950/40 border-r border-white/5 p-4 space-y-2.5">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 mb-2">
            API Core Paths
          </div>
          {apiPlaygroundEndpoints.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                id={`btn-api-${ep.id}`}
                key={ep.id}
                onClick={() => {
                  setSelectedEndpoint(ep);
                  setResponseOutput(null);
                  setHttpStatus(null);
                }}
                className={`w-full flex items-center gap-3 p-3 rounded border transition-all text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 border-white/10 shadow-sm'
                    : 'bg-neutral-900/20 border-transparent hover:bg-neutral-900/50 hover:border-white/5'
                }`}
              >
                {/* Method tag */}
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  ep.method === 'GET' 
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {ep.method}
                </span>
                
                <div className="flex-1 truncate">
                  <div className="text-xs font-mono font-medium text-neutral-200 group-hover:text-white transition-colors">
                    {ep.path}
                  </div>
                  <div className="text-[10px] text-neutral-400 truncate mt-0.5">
                    {ep.summary}
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 text-neutral-500 transition-transform ${isSelected ? 'translate-x-0.5 text-slate-300' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Live Endpoint Workspace */}
        <div className="md:col-span-8 p-6 space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            {/* Header info */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                  selectedEndpoint.method === 'GET' 
                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20' 
                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  {selectedEndpoint.method}
                </span>
                <span className="font-mono text-xs text-neutral-300 font-semibold">{selectedEndpoint.path}</span>
              </div>
              <h5 className="text-sm font-semibold text-white">{selectedEndpoint.summary}</h5>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{selectedEndpoint.description}</p>
            </div>

            {/* Input parameters */}
            {selectedEndpoint.parameters && selectedEndpoint.parameters.length > 0 && (
              <div className="space-y-3 bg-neutral-950/40 p-4 rounded border border-white/5">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Request Request Body / Query Params
                </div>
                <div className="space-y-3.5">
                  {selectedEndpoint.parameters.map((param) => (
                    <div key={param.name} className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start text-xs">
                      <div className="sm:col-span-1">
                        <span className="font-mono font-bold text-indigo-400">{param.name}</span>
                        {param.required && <span className="text-red-400 ml-0.5">*</span>}
                        <div className="text-[10px] text-neutral-500 font-mono mt-0.5">{param.type}</div>
                      </div>
                      <div className="sm:col-span-2">
                        {param.name === 'message' ? (
                          <textarea
                            id={`param-input-${param.name}`}
                            rows={2}
                            value={paramValues[param.name] ?? ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-sans"
                          />
                        ) : param.name === 'optimization_level' ? (
                          <select
                            id={`param-input-${param.name}`}
                            value={paramValues[param.name] ?? 'optimized'}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono font-medium"
                          >
                            <option value="optimized">optimized</option>
                            <option value="unoptimized">unoptimized</option>
                          </select>
                        ) : (
                          <input
                            id={`param-input-${param.name}`}
                            type="text"
                            value={paramValues[param.name] ?? ''}
                            onChange={(e) => handleParamChange(param.name, e.target.value)}
                            className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono"
                          />
                        )}
                        <p className="text-[10px] text-neutral-500 mt-1">{param.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div className="space-y-4">
            <button
              id="btn-api-execute"
              disabled={isExecuting}
              onClick={handleExecute}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold rounded text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              <Send className="w-4 h-4" />
              {isExecuting ? 'Calling server thread...' : 'Execute API Call'}
            </button>

            {/* Response Console */}
            <AnimatePresence>
              {(isExecuting || responseOutput) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-neutral-950 rounded border border-white/5 overflow-hidden font-mono text-xs"
                >
                  <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-300 font-semibold text-[11px]">Server Response</span>
                    </div>
                    {httpStatus && (
                      <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                        httpStatus === 200 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}>
                        HTTP {httpStatus}
                      </span>
                    )}
                  </div>

                  <div className="p-4 space-y-4 max-h-[220px] overflow-y-auto">
                    {isExecuting ? (
                      <div className="flex items-center gap-3 text-indigo-400 py-3">
                        <svg className="animate-spin h-4 w-4 text-indigo-400" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-xs">Processing via Python FastAPI router thread...</span>
                      </div>
                    ) : (
                      <>
                        {/* Response Headers */}
                        {headersOutput && (
                          <div className="text-[11px] text-neutral-500 space-y-0.5">
                            <div className="font-semibold text-neutral-400">Response Headers:</div>
                            {Object.entries(headersOutput).map(([k, v]) => (
                              <div key={k} className="pl-2">
                                <span className="text-indigo-400">{k}</span>: <span className="text-neutral-300">{v}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Response Body */}
                        <div className="space-y-1">
                          <div className="font-semibold text-neutral-400 text-[11px]">JSON Payload:</div>
                          <pre className="bg-[#0a0a0a] p-2.5 rounded border border-white/5 text-emerald-400 text-[11px] select-all overflow-x-auto whitespace-pre">
                            {JSON.stringify(responseOutput, null, 2)}
                          </pre>
                        </div>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
