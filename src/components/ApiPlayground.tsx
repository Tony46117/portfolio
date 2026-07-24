import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Send, ChevronRight, Server, Terminal, Zap, RefreshCw, Code2 } from 'lucide-react';

interface Endpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  icon: React.ReactNode;
}

const ENDPOINTS: Endpoint[] = [
  {
    id: 'get-profile',
    method: 'GET',
    path: '/api/v1/developer/profile',
    summary: 'Developer Profile',
    description: 'Antony\'s core professional profile — skills, location, and contact info as a structured JSON response.',
    icon: <Code2 className="w-3 h-3" />,
  },
  {
    id: 'post-contact',
    method: 'POST',
    path: '/api/v1/contact',
    summary: 'Contact Form',
    description: 'Sends a message with client-side Pydantic-style validation. Simulates a complete request/response cycle.',
    icon: <Send className="w-3 h-3" />,
  },
  {
    id: 'simulate-query',
    method: 'GET',
    path: '/api/v1/ledger/optimize',
    summary: 'Query Optimizer',
    description: 'Compares unoptimized N+1 ORM loops vs PostgreSQL Hash JOIN — with real latency metrics and SQL explain plans.',
    icon: <Zap className="w-3 h-3" />,
  },
];

const PROFILE_RESPONSE = {
  status: 'success',
  data: {
    name: 'Antony Gitau Kihara',
    role: 'Backend-Focused Full-Stack Software Engineer',
    location: 'Nairobi, Kenya',
    core_languages: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
    primary_backend_framework: 'FastAPI',
    primary_frontend_framework: 'React',
    expertise: [
      'High-throughput async microservices',
      'PostgreSQL query optimization & indexing',
      'Pydantic v2 data validation',
      'Redis-backed rate limiting & caching',
    ],
    contact: {
      email: 'tgitau088@gmail.com',
      github: 'github.com/Tony46117',
    },
  },
};

function simulateContact(name: string, email: string, message: string) {
  if (!name.trim() || !email.trim() || !message.trim()) {
    return {
      status: 422,
      body: { detail: [{ loc: ['body'], msg: 'All fields are required', type: 'value_error.missing' }] },
    };
  }
  if (!email.includes('@')) {
    return {
      status: 422,
      body: { detail: [{ loc: ['body', 'email'], msg: 'value is not a valid email address', type: 'value_error.email' }] },
    };
  }
  return {
    status: 201,
    body: {
      status: 'received',
      message: `Thank you ${name}, your message has been processed successfully!`,
      timestamp: new Date().toISOString(),
      pydantic_validation: 'Passed [No Errors]',
      payload_meta: { char_count: message.length, email_domain: email.split('@')[1] },
    },
  };
}

function simulateQuery(level: string) {
  const isOptimized = level === 'optimized';
  return {
    status: 200,
    body: {
      status: 'success',
      query_meta: {
        raw_sql: isOptimized
          ? 'SELECT m.name, SUM(l.amount) FROM merchants m JOIN ledgers l ON m.id = l.merchant_id GROUP BY m.id;'
          : '# N+1 Loop: for m in db.query(Merchant).all():\\n    db.query(Ledger).filter_by(merchant_id=m.id).all()',
        index_used: isOptimized ? 'idx_ledgers_merchant_id (Hash Join)' : 'None (Full Table Seq Scan)',
        estimated_rows: 5120,
      },
      execution_stats: {
        latency_ms: isOptimized ? 1.82 : 32.40,
        speedup: isOptimized ? '17.8x' : '1.0x (unoptimized)',
        cpu_cycles: isOptimized ? 'Low (index scan)' : 'High (sequential scan)',
      },
      sample_data: [
        { merchant: 'Apex Logistics', volume: '$12,450.50' },
        { merchant: 'Vertex Tech', volume: '$8,240.20' },
        { merchant: 'Nile Commerce', volume: '$6,820.75' },
      ],
    },
  };
}

export default function ApiPlayground() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<Endpoint>(ENDPOINTS[0]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [responseOutput, setResponseOutput] = useState<any>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const [name, setName] = useState('Jane Doe');
  const [email, setEmail] = useState('jane@example.com');
  const [message, setMessage] = useState('Hi Antony! Love your FastAPI + React work.');
  const [queryLevel, setQueryLevel] = useState('optimized');

  const handleExecute = async () => {
    setIsExecuting(true);
    setResponseOutput(null);
    setHttpStatus(null);
    setResponseTime(null);

    const start = performance.now();

    // Simulate network delay
    await new Promise((r) => setTimeout(r, 600 + Math.random() * 400));

    let result: { status: number; body: any };

    switch (selectedEndpoint.id) {
      case 'get-profile':
        result = { status: 200, body: PROFILE_RESPONSE };
        break;
      case 'post-contact':
        result = simulateContact(name, email, message);
        break;
      case 'simulate-query':
        result = simulateQuery(queryLevel);
        break;
      default:
        result = { status: 500, body: { error: 'Unknown endpoint' } };
    }

    setHttpStatus(result.status);
    setResponseTime(Math.round(performance.now() - start));
    setResponseOutput(result.body);

    setIsExecuting(false);
  };

  return (
    <div className="bg-[#0a0a0a] rounded-xl border border-white/5 shadow-2xl overflow-hidden text-[#e5e5e5] font-sans">
      {/* Header */}
      <div className="bg-neutral-950 px-6 py-4 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-lg border border-indigo-500/20">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-sans text-lg font-bold text-white">
              Interactive API Showcase
            </h4>
            <p className="text-xs text-neutral-400">
              Click endpoints to see realistic API responses. Purely client-side — no server needed.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-1 rounded border border-white/5">
          Simulation Mode
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12">
        {/* Sidebar */}
        <div className="md:col-span-4 bg-neutral-950/40 border-r border-white/5 p-4 space-y-2">
          <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-2 mb-2">
            API Endpoints
          </div>
          {ENDPOINTS.map((ep) => {
            const isSelected = selectedEndpoint.id === ep.id;
            return (
              <button
                key={ep.id}
                onClick={() => { setSelectedEndpoint(ep); setResponseOutput(null); setHttpStatus(null); }}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left group cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-800 border-white/10 shadow-sm'
                    : 'bg-neutral-900/20 border-transparent hover:bg-neutral-900/50 hover:border-white/5'
                }`}
              >
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

        {/* Workspace */}
        <div className="md:col-span-8 p-6 space-y-5">
          <div className="space-y-4">
            {/* Endpoint Info */}
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
                <span className="flex items-center gap-1 text-[9px] text-emerald-400 font-mono">
                  <Zap className="w-2.5 h-2.5" />
                  Simulated
                </span>
              </div>
              <h5 className="text-sm font-semibold text-white">{selectedEndpoint.summary}</h5>
              <p className="text-xs text-neutral-400 mt-1 leading-relaxed">{selectedEndpoint.description}</p>
            </div>

            {/* Params for POST contact */}
            {selectedEndpoint.id === 'post-contact' && (
              <div className="space-y-3 bg-neutral-950/40 p-4 rounded-lg border border-white/5">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  Request Body
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-xs">
                    <div><span className="font-mono font-bold text-indigo-400">name</span><span className="text-red-400 ml-0.5">*</span></div>
                    <div className="sm:col-span-2">
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-xs">
                    <div><span className="font-mono font-bold text-indigo-400">email</span><span className="text-red-400 ml-0.5">*</span></div>
                    <div className="sm:col-span-2">
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-start text-xs">
                    <div><span className="font-mono font-bold text-indigo-400">message</span><span className="text-red-400 ml-0.5">*</span></div>
                    <div className="sm:col-span-2">
                      <textarea rows={2} value={message} onChange={(e) => setMessage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-sans" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Params for query optimizer */}
            {selectedEndpoint.id === 'simulate-query' && (
              <div className="space-y-3 bg-neutral-950/40 p-4 rounded-lg border border-white/5">
                <div className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  Query Parameters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center text-xs">
                  <div><span className="font-mono font-bold text-indigo-400">optimization_level</span><span className="text-red-400 ml-0.5">*</span></div>
                  <div className="sm:col-span-2">
                    <select value={queryLevel} onChange={(e) => setQueryLevel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-neutral-950 border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 text-xs font-mono">
                      <option value="optimized">optimized</option>
                      <option value="unoptimized">unoptimized</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Execute + Response */}
          <div className="space-y-4">
            <button
              disabled={isExecuting}
              onClick={handleExecute}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold rounded-lg text-sm transition-all cursor-pointer shadow-lg shadow-indigo-600/10"
            >
              <Send className="w-4 h-4" />
              {isExecuting ? 'Simulating response...' : `Execute ${selectedEndpoint.method} Request`}
            </button>

            <AnimatePresence>
              {(isExecuting || responseOutput) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="bg-neutral-950 rounded-lg border border-white/5 overflow-hidden font-mono text-xs"
                >
                  <div className="bg-neutral-900 px-4 py-2 flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-neutral-400" />
                      <span className="text-neutral-300 font-semibold text-[11px]">Response</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {responseTime !== null && <span className="text-[10px] text-neutral-500">{responseTime}ms</span>}
                      {httpStatus && (
                        <span className={`px-1.5 py-0.5 rounded font-bold uppercase text-[10px] ${
                          httpStatus === 200 || httpStatus === 201
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}>
                          {httpStatus === 201 ? '201 Created' : httpStatus === 422 ? '422 Error' : `${httpStatus} OK`}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4 max-h-[280px] overflow-y-auto">
                    {isExecuting ? (
                      <div className="flex items-center gap-3 text-indigo-400 py-3">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span className="text-xs">Processing request...</span>
                      </div>
                    ) : (
                      <pre className="text-emerald-400 text-[11px] select-all whitespace-pre-wrap leading-relaxed">
                        {JSON.stringify(responseOutput, null, 2)}
                      </pre>
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
