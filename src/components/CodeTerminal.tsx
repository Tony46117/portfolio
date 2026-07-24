import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Play, Square, ChevronRight } from 'lucide-react';

interface CodeSnippet {
  language: string;
  filename: string;
  code: string[];
}

const SNIPPETS: CodeSnippet[] = [
  {
    language: 'python',
    filename: 'fastapi_microservice.py',
    code: [
      'from fastapi import FastAPI, HTTPException, Depends',
      'from pydantic import BaseModel, Field',
      'from typing import Optional',
      'import asyncpg, redis.asyncio as redis',
      '',
      'app = FastAPI(title="Async Orchestrator")',
      'redis_pool = redis.ConnectionPool.from_url("redis://localhost")',
      '',
      'class DispatchRequest(BaseModel):',
      '    """Pydantic v2 validated request schema"""',
      '    task_id: str = Field(..., min_length=8)',
      '    payload: dict = Field(default_factory=dict)',
      '    priority: int = Field(default=0, ge=0, le=5)',
      '',
      '@app.post("/dispatch")',
      'async def dispatch_task(req: DispatchRequest):',
      '    """Route task with Redis-backed rate limiting"""',
      '    remaining = await check_rate_limit(req.task_id)',
      '    if remaining <= 0:',
      '        raise HTTPException(',
      '            status_code=429,',
      '            detail="Token bucket depleted"',
      '        )',
      '    return {"status": "dispatched", "ttl_ms": 14}',
    ],
  },
  {
    language: 'typescript',
    filename: 'react_portfolio.tsx',
    code: [
      'import { motion, AnimatePresence } from "motion/react"',
      'import { useState, useEffect } from "react"',
      '',
      'interface Project {',
      '  title: string;',
      '  description: string;',
      '  tags: string[];',
      '  github?: string;',
      '}',
      '',
      'export function ProjectCard({ project }: { project: Project }) {',
      '  const [isHovered, setIsHovered] = useState(false)',
      '',
      '  return (',
      '    <motion.div',
      '      whileHover={{ y: -4, scale: 1.02 }}',
      '      className="bg-surface rounded-xl p-6',
      '                 border border-white/5"',
      '      onHoverStart={() => setIsHovered(true)}',
      '      onHoverEnd={() => setIsHovered(false)}',
      '    >',
      '      <h3 className="text-lg font-bold">{project.title}</h3>',
      '      <AnimatePresence>',
      '        {isHovered && (',
      '          <motion.p',
      '            initial={{ opacity: 0, y: 8 }}',
      '            animate={{ opacity: 1, y: 0 }}',
      '          >',
      '            {project.description}',
      '          </motion.p>',
      '        )}',
      '      </AnimatePresence>',
      '    </motion.div>',
      '  )',
      '}',
    ],
  },
  {
    language: 'sql',
    filename: 'optimized_query.sql',
    code: [
      '-- PostgreSQL query optimization',
      '-- Replacing N+1 ORM loops with Hash JOIN',
      '',
      'WITH ledger_aggregates AS (',
      '    SELECT',
      '        m.id AS merchant_id,',
      '        m.name AS merchant_name,',
      '        COUNT(l.id) AS transaction_count,',
      '        SUM(l.amount) AS total_volume,',
      '        AVG(l.amount) AS avg_ticket_size',
      '    FROM merchants m',
      '    JOIN ledgers l ON l.merchant_id = m.id',
      '    WHERE l.created_at >= NOW() - INTERVAL \'30 days\'',
      '    GROUP BY m.id, m.name',
      ')',
      'SELECT * FROM ledger_aggregates',
      'ORDER BY total_volume DESC',
      'LIMIT 100;',
    ],
  },
  {
    language: 'python',
    filename: 'redis_rate_limiter.py',
    code: [
      'import asyncio',
      'from redis.asyncio import Redis',
      '',
      'class TokenBucketRateLimiter:',
      '    """Sliding window rate limiter using Redis"""',
      '',
      '    def __init__(self, redis: Redis):',
      '        self.redis = redis',
      '        self.lua_script = """',
      '            local key = KEYS[1]',
      '            local limit = tonumber(ARGV[1])',
      '            local now = tonumber(ARGV[2])',
      '            local window = tonumber(ARGV[3])',
      '            ...',
      '        """',
      '',
      '    async def check(self, key: str, limit: int = 100):',
      '        """Check and consume one token"""',
      '        current = await self.redis.get(key)',
      '        if current and int(current) >= limit:',
      '            return False  # Rate limited',
      '        await self.redis.incr(key)',
      '        await self.redis.expire(key, 10)',
      '        return True',
    ],
  },
];

export default function CodeTerminal() {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedLines, setDisplayedLines] = useState<string[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [currentCharIdx, setCurrentCharIdx] = useState(0);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  
  const snippet = SNIPPETS[currentSnippet];

  // Typing effect
  useEffect(() => {
    if (isPaused) return;
    
    const allLines = snippet.code;
    if (currentLineIdx >= allLines.length) {
      // Done typing — hold for a moment then move to next
      const hold = setTimeout(() => {
        setCurrentSnippet((prev) => (prev + 1) % SNIPPETS.length);
        setDisplayedLines([]);
        setCurrentCharIdx(0);
        setCurrentLineIdx(0);
      }, 2500);
      return () => clearTimeout(hold);
    }

    const currentLine = allLines[currentLineIdx];
    if (currentCharIdx < currentLine.length) {
      const timer = setTimeout(() => {
        setCurrentCharIdx((prev) => prev + 1);
      }, 12 + Math.random() * 18); // Varied typing speed
      return () => clearTimeout(timer);
    } else {
      // Move to next line
      const timer = setTimeout(() => {
        setDisplayedLines((prev) => [...prev, currentLine]);
        setCurrentLineIdx((prev) => prev + 1);
        setCurrentCharIdx(0);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [currentLineIdx, currentCharIdx, snippet.code, isPaused, currentSnippet]);

  const partiallyTypedLine = currentLineIdx < snippet.code.length
    ? snippet.code[currentLineIdx].slice(0, currentCharIdx)
    : '';

  const togglePause = () => setIsPaused((p) => !p);

  const restartAnimation = () => {
    setDisplayedLines([]);
    setCurrentCharIdx(0);
    setCurrentLineIdx(0);
    setIsPaused(false);
  };

  // Color the code based on language patterns
  const colorizeLine = (line: string, idx: number) => {
    // Python keywords
    if (snippet.language === 'python') {
      if (line.startsWith('def ') || line.startsWith('class ') || line.startsWith('import ') || line.startsWith('from ') || line.startsWith('return ') || line.startsWith('async ') || line.startsWith('await ') || line.startsWith('if ') || line.startsWith('raise ') || line.trimStart().startsWith('if ')) {
        return 'text-purple-400';
      }
      if (line.includes('"""') || line.includes('#')) {
        return 'text-emerald-500/70';
      }
      if (line.includes(':') && !line.includes('"""')) {
        return 'text-orange-300/80';
      }
    }
    // TypeScript/JS keywords
    if (snippet.language === 'typescript') {
      if (line.startsWith('import ') || line.startsWith('export ') || line.startsWith('interface ') || line.startsWith('function ') || line.startsWith('return ') || line.startsWith('const ') || line.startsWith('  const ')) {
        return 'text-sky-400';
      }
      if (line.includes(':') && !line.includes('://')) {
        return 'text-amber-300/70';
      }
    }
    // SQL keywords
    if (snippet.language === 'sql') {
      if (line.startsWith('--') || line.startsWith('-- ')) {
        return 'text-emerald-500/60 italic';
      }
      if (line.match(/^(SELECT|FROM|WHERE|JOIN|GROUP|ORDER|LIMIT|WITH|AS|ON|AND|OR|CASE|WHEN|THEN|ELSE|END|LEFT|RIGHT|INNER|OUTER|COUNT|SUM|AVG|NOW|INTERVAL)/i)) {
        return 'text-purple-400';
      }
    }
    return 'text-neutral-300';
  };

  return (
    <div className="bg-[#0c0c0e] rounded-xl border border-white/5 overflow-hidden shadow-2xl font-mono text-xs">
      {/* Terminal Title Bar */}
      <div className="bg-neutral-900 px-4 py-2.5 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {/* Traffic light dots */}
          <div className="flex gap-1.5">
            <button onClick={restartAnimation} className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 transition-colors cursor-pointer" title="Restart" />
            <button onClick={togglePause} className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-400 transition-colors cursor-pointer" title={isPaused ? 'Resume' : 'Pause'} />
            <button onClick={() => setCurrentSnippet((prev) => (prev + 1) % SNIPPETS.length)} className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 transition-colors cursor-pointer" title="Next snippet" />
          </div>
          <span className="text-neutral-400 text-[10px] ml-2 select-none">
            {snippet.filename}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] text-neutral-500 bg-neutral-950 px-1.5 py-0.5 rounded border border-white/5">
            {snippet.language}
          </span>
          <span className="text-[9px] text-neutral-600">
            {currentSnippet + 1}/{SNIPPETS.length}
          </span>
        </div>
      </div>

      {/* Code Output */}
      <div className="p-4 min-h-[320px] max-h-[380px] overflow-y-auto bg-[#050505]">
        <div className="flex items-center gap-2 text-emerald-400/80 text-[10px] mb-3 pb-2 border-b border-white/5">
          <ChevronRight className="w-3 h-3" />
          <span>~/portfolio $ cat {snippet.filename}</span>
        </div>

        {displayedLines.map((line, i) => (
          <div key={i} className={`whitespace-pre leading-relaxed ${colorizeLine(line, i)}`}>
            {line || '\u00A0'}
          </div>
        ))}

        {/* Currently typing line */}
        {currentLineIdx < snippet.code.length && (
          <div className={`whitespace-pre leading-relaxed ${colorizeLine(partiallyTypedLine, currentLineIdx)}`}>
            {partiallyTypedLine}
            {!isPaused && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="inline-block w-[6px] h-[14px] bg-indigo-400 ml-[1px] align-middle"
              />
            )}
            {isPaused && (
              <span className="text-yellow-400 text-[10px] ml-2 animate-pulse">⏸ PAUSED</span>
            )}
          </div>
        )}

        {/* Blinking cursor when all lines shown */}
        {currentLineIdx >= snippet.code.length && (
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            className="inline-block w-[6px] h-[14px] bg-emerald-400 ml-[1px] align-middle"
          />
        )}
      </div>

      {/* Bottom controls */}
      <div className="bg-neutral-900 px-4 py-2 border-t border-white/5 flex items-center justify-between text-[9px] text-neutral-500">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePause}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Square className="w-3 h-3" />}
            {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button
            onClick={() => setCurrentSnippet((prev) => (prev + 1) % SNIPPETS.length)}
            className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"
          >
            <ChevronRight className="w-3 h-3" />
            Next
          </button>
        </div>
        <div>
          Lines: {displayedLines.length + (currentLineIdx < snippet.code.length ? 1 : 0)}/{snippet.code.length}
        </div>
      </div>
    </div>
  );
}
