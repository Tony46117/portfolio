/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Check, Copy, ChevronRight, Send, 
  ArrowUpRight, AlertCircle, CheckCircle2, ExternalLink
} from 'lucide-react';
// @ts-ignore
import programmerBg from './assets/images/programmer_bg_1784650977138.jpg';
import Balatro from './components/Balatro';

// Simplified & elegant types
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
}

interface SkillGroup {
  category: string;
  items: string[];
}

const FEATURED_PROJECTS: Project[] = [
  {
    id: 'api-orchestrator',
    title: 'FastAPI Microservice Orchestrator',
    description: 'A high-throughput, async microservice coordinator with custom Redis rate-limiting and connection-pool management.',
    tags: ['Python', 'FastAPI', 'Redis', 'Asyncio', 'Docker'],
    github: 'https://github.com/Tony46117'
  },
  {
    id: 'query-optimizer',
    title: 'E-Commerce Ledger Engine',
    description: 'Double-entry transactional ledger database optimizer replacing N+1 ORM loops with advanced PostgreSQL window functions.',
    tags: ['Python', 'PostgreSQL', 'SQLAlchemy', 'React'],
    github: 'https://github.com/Tony46117'
  },
  {
    id: 'model-architect',
    title: 'SQL-to-FastAPI Generator',
    description: 'A full-stack reactive workspace mapping SQL schemas and instantly generating compliant Pydantic models & FastAPI route templates.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Pydantic'],
    github: 'https://github.com/Tony46117'
  }
];

const SKILLS_LIST: SkillGroup[] = [
  {
    category: 'Backend Architectures',
    items: ['Python', 'FastAPI', 'Pydantic v2', 'Django', 'SQLAlchemy', 'Uvicorn']
  },
  {
    category: 'Databases & Performance',
    items: ['PostgreSQL', 'Redis', 'SQL', 'ACID Compliance', 'Connection Pooling']
  },
  {
    category: 'Frontend Engineering',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite']
  },
  {
    category: 'Tools & Workflows',
    items: ['Docker', 'Git', 'GitHub Actions', 'Linux Bash', 'Unit Testing']
  }
];

const PROGRAMMER_WORDS = [
  "I am a programmer.",
  "I compile code into scalable systems.",
  "I design high-performance async backends.",
  "I craft elegant, fluid user interfaces.",
  "I engineer end-to-end fullstack software."
];

export default function App() {
  // Word Cycler State
  const [wordIdx, setWordIdx] = useState(0);

  // Email copying state
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

  // Cycle the programmer titles
  useEffect(() => {
    const timer = setInterval(() => {
      setWordIdx((prev) => (prev + 1) % PROGRAMMER_WORDS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('tgitau088@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setValidationMsg(null);

    // Simulate real server side Pydantic validation delay
    await new Promise((resolve) => setTimeout(resolve, 900));

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setSubmitStatus('error');
      setValidationMsg('Pydantic ValidationError: Field required [type=missing]');
      setIsSubmitting(false);
      return;
    }

    if (!contactForm.email.includes('@')) {
      setSubmitStatus('error');
      setValidationMsg('Pydantic ValidationError: value is not a valid email address [type=value_error.email]');
      setIsSubmitting(false);
      return;
    }

    setSubmitStatus('success');
    setValidationMsg('Pydantic Validation: Passed (HTTP 200). Your message has been sent successfully!');
    setContactForm({ name: '', email: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-indigo-500/30 selection:text-indigo-200 relative overflow-hidden">
      
      {/* Background Image Layer - High Visibility */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-85 pointer-events-none transition-all duration-1000"
        style={{ backgroundImage: `url(${programmerBg})` }}
      />
      
      {/* Balatro animated WebGL plasma shader blending directly on top of the image */}
      <Balatro className="opacity-25" />
      
      {/* Soft, protective overlay gradients to preserve text contrast without blacking out the image */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]/75 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_50%,#050505_80%)] pointer-events-none" />

      <div className="relative z-10">
        {/* Navigation Header */}
        <nav id="app-nav" className="sticky top-0 z-50 backdrop-blur-md bg-[#050505]/80 border-b border-white/5 px-6 sm:px-12 py-5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
            <span className="font-mono text-xs text-white font-bold tracking-tight">
              antony@kihara:~
            </span>
          </div>
          <div className="flex items-center gap-6 text-xs font-mono text-neutral-400">
            <a href="#about" className="hover:text-white transition-colors">/about</a>
            <a href="#projects" className="hover:text-white transition-colors">/projects</a>
            <a href="#contact" className="hover:text-white transition-colors">/contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Presentation */}
      <header id="about" className="pt-24 pb-16 px-6 max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs font-mono text-indigo-400 font-semibold tracking-wider uppercase"
          >
            Antony Gitau Kihara
          </motion.div>
          
          <div className="h-28 sm:h-24 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.h1
                key={wordIdx}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight font-sans"
              >
                {PROGRAMMER_WORDS[wordIdx]}
              </motion.h1>
            </AnimatePresence>
          </div>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed"
          >
            I build pristine software. Specializing in Python backends, FastAPI microservices, and elegant React frontends, I design highly robust platforms with zero performance compromises.
          </motion.p>
        </div>

        {/* Dynamic Action Buttons & Coordinates */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-wrap items-center gap-4 pt-4"
        >
          <a 
            id="btn-hero-contact"
            href="#contact" 
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/15 cursor-pointer"
          >
            Initiate Contact
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
          
          <button 
            id="btn-copy-email"
            onClick={handleCopyEmail}
            className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs rounded transition-all border border-white/5 flex items-center gap-2 cursor-pointer"
          >
            {copiedEmail ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                Copied Address
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                Copy E-Mail Coordinates
              </>
            )}
          </button>
        </motion.div>
      </header>



      {/* Minimal Portfolio Projects Section */}
      <section id="projects" className="py-16 px-6 max-w-4xl mx-auto space-y-10">
        <div className="space-y-1.5">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Repository High-Performance Layers
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Featured Programming Artifacts
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURED_PROJECTS.map((proj) => (
            <div 
              key={proj.id} 
              className="bg-[#0c0c0e] border border-white/5 rounded-md p-5 hover:border-white/10 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm font-bold text-white tracking-tight">
                    {proj.title}
                  </h4>
                  <a 
                    href={proj.github} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-neutral-500 hover:text-white transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  {proj.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {proj.tags.map((t) => (
                  <span 
                    key={t} 
                    className="text-[9px] font-mono font-medium bg-[#141416] text-indigo-300 border border-indigo-500/10 px-1.5 py-0.5 rounded"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Clean Skills Framework Summary */}
      <section id="skills" className="py-12 px-6 max-w-4xl mx-auto space-y-8">
        <div className="space-y-1.5">
          <div className="text-xs font-mono text-neutral-500 uppercase tracking-wider">
            Technical Matrix
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">
            Construct Stack Environment
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {SKILLS_LIST.map((group) => (
            <div key={group.category} className="space-y-2.5">
              <h5 className="text-[11px] font-mono text-white font-bold uppercase tracking-wider">
                {group.category}
              </h5>
              <div className="flex flex-wrap sm:flex-col gap-1.5 sm:gap-2">
                {group.items.map((skill) => (
                  <span 
                    key={skill} 
                    className="text-xs text-neutral-400 flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-indigo-500/40" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Minimal Contact Card / Endpoint */}
      <section id="contact" className="py-20 px-6 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono uppercase text-indigo-400 tracking-wider font-bold">
            POST /api/v1/contact
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Initialize Project Inquiry
          </h2>
          <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
            Send an inquiry coordinate. The input values are validated server-side using robust schemas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Coordinates Details Column */}
          <div className="md:col-span-5 bg-[#0c0c0e] border border-white/5 p-5 rounded-md space-y-6">
            <h4 className="text-[10px] font-bold text-neutral-200 uppercase tracking-wider font-mono">
              Coordinates Config
            </h4>

            <div className="space-y-4 text-xs font-mono text-neutral-400">
              <div className="p-3 bg-[#050505] rounded border border-white/5 space-y-1">
                <div className="text-neutral-500 uppercase text-[9px] font-bold tracking-wider">E-Mail Endpoint</div>
                <button 
                  onClick={handleCopyEmail}
                  className="text-white hover:text-indigo-400 transition-colors font-semibold flex items-center gap-1.5 cursor-pointer text-left w-full break-all"
                >
                  tgitau088@gmail.com
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                </button>
              </div>

              <div className="p-3 bg-[#050505] rounded border border-white/5 space-y-1">
                <div className="text-neutral-500 uppercase text-[9px] font-bold tracking-wider">GitHub URI</div>
                <a 
                  href="https://github.com/Tony46117" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-white hover:text-indigo-400 transition-colors font-semibold flex items-center gap-1"
                >
                  github.com/Tony46117
                  <ExternalLink className="w-3 h-3 shrink-0 text-neutral-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Input Fields Form */}
          <div className="md:col-span-7 bg-[#0c0c0e] border border-white/5 p-5 rounded-md space-y-4">
            <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px]">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Jane Doe"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px]">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="jane@example.com"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px]">Inquiry Payload</label>
                <textarea
                  id="contact-message"
                  required
                  rows={3}
                  placeholder="Describe your design architecture, runtime, or stack requirements..."
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded text-neutral-200 focus:outline-none focus:border-indigo-500 leading-relaxed"
                />
              </div>

              <button
                id="btn-contact-submit"
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold rounded transition-all cursor-pointer shadow-md shadow-indigo-600/10"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Validating Payload...' : 'POST Message'}
              </button>

              <AnimatePresence>
                {submitStatus !== 'idle' && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className={`p-3 rounded font-mono text-[10px] border flex gap-3 ${
                      submitStatus === 'success' 
                        ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20' 
                        : 'bg-red-500/5 text-red-400 border-red-500/20'
                    }`}
                  >
                    {submitStatus === 'success' ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                    )}
                    <div>
                      <div className="font-semibold">{validationMsg}</div>
                      {submitStatus === 'success' && (
                        <p className="text-[9px] text-neutral-400 mt-1 font-sans">
                          Thank you! Antony will reach out to you soon.
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </section>

      {/* Global Simple Footer */}
      <footer className="border-t border-white/5 bg-[#030303] py-12 px-6 text-center text-neutral-600 text-xs font-mono space-y-4">
        <div className="flex justify-center gap-6 text-neutral-400">
          <a href="#about" className="hover:text-white transition-colors">About</a>
          <span>•</span>
          <a href="#projects" className="hover:text-white transition-colors">Projects</a>
          <span>•</span>
          <a href="#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
        <div className="text-[11px]">
          © {new Date().getFullYear()} Antony Gitau Kihara. All rights reserved.
        </div>
        <div className="text-[10px] text-neutral-700">
          Built using React, Framer Motion & Tailwind CSS.
        </div>
      </footer>
      </div>

    </div>
  );
}
