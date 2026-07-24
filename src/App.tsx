/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowRight, Check, Copy, Send,
  ArrowUpRight, AlertCircle, CheckCircle2, ExternalLink,
  Menu, X, Github, Mail, Terminal, Code2,
  Database, Brain, Cpu, Zap, ChevronDown,
  Layers, Server, Star, Rocket,
  GitBranch, Quote, ShieldCheck,
  Sparkles
} from 'lucide-react';
// @ts-ignore
import programmerBg from './assets/images/programmer_bg_1784650977138.jpg';
import Balatro from './components/Balatro';
import ApiPlayground from './components/ApiPlayground';
import ScrollReveal from './components/ScrollReveal';
import ScrollProgress from './components/ScrollProgress';
import ParticleNetwork from './components/ParticleNetwork';
import CodeTerminal from './components/CodeTerminal';
import AnimatedCounter from './components/AnimatedCounter';
import TiltCard from './components/TiltCard';
import CursorFollower from './components/CursorFollower';
import TextScramble from './components/TextScramble';
import Spotlight from './components/Spotlight';
import NoiseOverlay from './components/NoiseOverlay';
import SectionDivider from './components/SectionDivider';
import MagneticButton from './components/MagneticButton';

// ────────────────────────────────────────────────────────
// Data
// ────────────────────────────────────────────────────────

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
  icon: React.ReactNode;
}

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

const FEATURED_PROJECTS: Project[] = [
  {
    id: 'api-orchestrator',
    title: 'FastAPI Microservice Orchestrator',
    description: 'High-throughput async microservice coordinator with Redis rate-limiting, connection pooling, and 8,400+ req/s throughput.',
    tags: ['Python', 'FastAPI', 'Redis', 'Asyncio', 'Docker'],
    github: 'https://github.com/Tony46117',
  },
  {
    id: 'query-optimizer',
    title: 'E-Commerce Ledger Engine',
    description: 'Double-entry transactional ledger with PostgreSQL window functions, compound indexing, and 18x query speed improvement.',
    tags: ['Python', 'PostgreSQL', 'SQLAlchemy', 'React'],
    github: 'https://github.com/Tony46117',
  },
  {
    id: 'model-architect',
    title: 'SQL-to-FastAPI Generator',
    description: 'Full-stack reactive workspace that maps SQL schemas and instantly generates valid Pydantic models & FastAPI route templates.',
    tags: ['React', 'TypeScript', 'Tailwind', 'Pydantic'],
    github: 'https://github.com/Tony46117',
  },
];

const SKILLS_LIST: SkillGroup[] = [
  {
    category: 'Backend',
    items: ['Python', 'FastAPI', 'Pydantic v2', 'Django', 'SQLAlchemy', 'Uvicorn'],
    icon: <Server className="w-3.5 h-3.5" />,
  },
  {
    category: 'Databases',
    items: ['PostgreSQL', 'Redis', 'SQL', 'MongoDB', 'ACID', 'Connection Pooling'],
    icon: <Database className="w-3.5 h-3.5" />,
  },
  {
    category: 'Frontend',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vite', 'Next.js'],
    icon: <Code2 className="w-3.5 h-3.5" />,
  },
  {
    category: 'DevOps',
    items: ['Docker', 'Git', 'GitHub Actions', 'Linux', 'Pytest', 'CI/CD'],
    icon: <Cpu className="w-3.5 h-3.5" />,
  },
];

const EXPERIENCES: Experience[] = [
  {
    role: 'Backend Software Engineer',
    company: 'Freelance · Contract',
    period: '2023 — Present',
    description: 'Architected high-throughput microservices with FastAPI, PostgreSQL, and Redis. Delivered scalable API solutions with 98%+ test coverage and sub-15ms p99 latency.',
    tags: ['FastAPI', 'PostgreSQL', 'Redis', 'Docker', 'CI/CD'],
  },
  {
    role: 'Full-Stack Developer',
    company: 'Independent Projects',
    period: '2022 — Present',
    description: 'Built full-stack applications from schema to deployment. Specialized in Python backends with clean React frontends and optimized database architectures.',
    tags: ['React', 'TypeScript', 'Python', 'SQL', 'REST APIs'],
  },
];

const PROGRAMMER_WORDS = [
  "I architect scalable systems.",
  "I build high-performance APIs.",
  "I craft elegant user interfaces.",
  "I optimize database queries.",
  "I engineer fullstack solutions.",
];

// ────────────────────────────────────────────────────────
// Hooks
// ────────────────────────────────────────────────────────

function useActiveSection() {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const sections = ['hero', 'code', 'playground', 'projects', 'experience', 'skills', 'contact'];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.2, rootMargin: '-80px 0px 0px 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

function useScrollVelocity() {
  const [velocity, setVelocity] = useState(0);
  useEffect(() => {
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();
    let rafId: number;
    const handle = () => {
      const now = performance.now();
      const dt = now - lastTime;
      if (dt > 0) {
        const currentScrollY = window.scrollY;
        const v = Math.abs(currentScrollY - lastScrollY) / dt * 1000;
        setVelocity(Math.min(v, 2000));
        lastScrollY = currentScrollY;
        lastTime = now;
      }
      rafId = requestAnimationFrame(handle);
    };
    rafId = requestAnimationFrame(handle);
    return () => cancelAnimationFrame(rafId);
  }, []);
  return velocity;
}

// ────────────────────────────────────────────────────────
// Component
// ────────────────────────────────────────────────────────

export default function App() {
  const activeSection = useActiveSection();
  const scrollVelocity = useScrollVelocity();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [validationMsg, setValidationMsg] = useState<string | null>(null);

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

    await new Promise((r) => setTimeout(r, 800));

    if (!contactForm.name.trim() || !contactForm.email.trim() || !contactForm.message.trim()) {
      setSubmitStatus('error');
      setValidationMsg('ValidationError: All fields are required');
    } else if (!contactForm.email.includes('@')) {
      setSubmitStatus('error');
      setValidationMsg('ValidationError: value is not a valid email address');
    } else {
      setSubmitStatus('success');
      setValidationMsg('Message sent successfully! Antony will reach out soon.');
      setContactForm({ name: '', email: '', message: '' });
    }

    setIsSubmitting(false);
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth' }); setMobileOpen(false); }
  };

  const navLinks = [
    { id: 'projects', label: 'Projects' },
    { id: 'skills', label: 'Skills' },
    { id: 'contact', label: 'Contact' },
  ];

  // Calculate scroll-based opacity for navbar background
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-[#e5e5e5] font-sans selection:bg-indigo-500/30 selection:text-indigo-200">

      {/* Global Components */}
      <CursorFollower />
      <Spotlight opacity={0.8} size={500} />
      <NoiseOverlay opacity={0.02} />
      <ScrollProgress />

      {/* Particle Network (over background) */}
      <ParticleNetwork />

      {/* Background */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-20 pointer-events-none"
        style={{ backgroundImage: `url(${programmerBg})` }}
      />
      <Balatro className="opacity-10" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-[#050505]/90 via-transparent to-[#050505]/95 pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,transparent_50%,#050505_85%)] pointer-events-none" />

      <div className="relative z-10">

        {/* ─── Navigation ─── */}
        <motion.nav
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`sticky top-[2px] z-50 transition-all duration-500 ${
            scrolled ? 'bg-[#050505]/80 backdrop-blur-xl shadow-lg shadow-indigo-500/5' : 'bg-[#050505]/40 backdrop-blur-md'
          } border-b border-white/5 px-6 sm:px-12 py-4`}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <MagneticButton strength={0.2}>
              <button onClick={() => scrollTo('hero')} className="flex items-center gap-2.5 group cursor-pointer">
                <span className="relative flex items-center justify-center w-8 h-8">
                  <span className="absolute inset-0 rounded-full bg-indigo-500/20 animate-pulse" />
                  <span className="w-2 h-2 rounded-full bg-indigo-400 group-hover:scale-125 transition-transform relative" />
                </span>
                <span className="font-mono text-xs text-white font-bold tracking-tight">
                  antony@kihara:~
                </span>
              </button>
            </MagneticButton>

            <div className="hidden sm:flex items-center gap-6 text-xs font-mono text-neutral-400">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollTo(link.id)}
                  className={`transition-all cursor-pointer relative py-1 ${
                    activeSection === link.id ? 'text-indigo-400' : 'hover:text-white'
                  }`}
                >
                  /{link.label.toLowerCase()}
                  {activeSection === link.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-[2px] bg-indigo-500 rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              ))}
              <a href="https://github.com/Tony46117" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                <Github className="w-4 h-4" />
              </a>
            </div>

            <button onClick={() => setMobileOpen(!mobileOpen)} className="sm:hidden p-2 text-neutral-400 hover:text-white transition-colors cursor-pointer">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="sm:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 flex flex-col gap-3 text-sm font-mono">
                  {navLinks.map((link) => (
                    <button key={link.id} onClick={() => scrollTo(link.id)}
                      className={`text-left px-2 py-2 rounded transition-all cursor-pointer ${
                        activeSection === link.id ? 'text-indigo-400 bg-indigo-500/5' : 'text-neutral-400 hover:text-white hover:bg-white/5'
                      }`}>
                      /{link.label.toLowerCase()}
                    </button>
                  ))}
                  <a href="https://github.com/Tony46117" target="_blank" rel="noreferrer"
                    className="px-2 py-2 text-neutral-400 hover:text-white hover:bg-white/5 rounded transition-all flex items-center gap-2">
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        {/* ─── Hero ─── */}
        <section id="hero" className="relative pt-24 pb-16 px-6 max-w-4xl mx-auto min-h-[85vh] flex flex-col justify-center">
          <ScrollReveal>
            <div className="space-y-6">

              {/* Terminal badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-900/80 border border-white/5 rounded-full text-xs font-mono text-indigo-400 group hover:border-indigo-500/20 transition-all"
              >
                <Terminal className="w-3.5 h-3.5" />
                <span className="text-neutral-500">$</span>
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                >_</motion.span>
                <span className="text-neutral-300">./portfolio --fullstack</span>
                <Sparkles className="w-3 h-3 text-indigo-400/50 group-hover:text-indigo-400 transition-colors" />
              </motion.div>

              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-xs font-mono font-semibold tracking-wider uppercase gradient-text-subtle"
                >
                  Antony Gitau Kihara
                </motion.div>

                {/* Animated word cycler with scramble effect */}
                <div className="h-28 sm:h-24 flex flex-col justify-center">
                  <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight glow">
                    <TextScramble
                      texts={PROGRAMMER_WORDS}
                      className="gradient-text"
                      letterSpeed={30}
                      nextLetterSpeed={20}
                      pauseTime={3500}
                    />
                  </h1>
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-neutral-400 text-base sm:text-lg max-w-2xl leading-relaxed"
                >
                  I build <span className="text-indigo-400 font-semibold">high-performance software</span> — 
                  from <span className="text-indigo-400 font-semibold">Python/FastAPI</span> microservices 
                  to <span className="text-indigo-400 font-semibold">React</span> frontends. 
                  Every system I design prioritizes speed, scalability, and clean architecture.
                </motion.p>
              </div>

              {/* CTA Buttons - with magnetic effect */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <MagneticButton strength={0.25}>
                  <button onClick={() => scrollTo('contact')}
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 cursor-pointer"
                    data-cursor-hover
                  >
                    Initiate Contact <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <button onClick={handleCopyEmail}
                    className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs rounded-lg transition-all border border-white/5 flex items-center gap-2 cursor-pointer hover:-translate-y-0.5"
                    data-cursor-hover
                  >
                    {copiedEmail ? <><Check className="w-3.5 h-3.5 text-emerald-400" /> Copied</> : <><Copy className="w-3.5 h-3.5" /> Copy E-Mail</>}
                  </button>
                </MagneticButton>
                <MagneticButton strength={0.2}>
                  <a href="https://github.com/Tony46117" target="_blank" rel="noreferrer"
                    className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-medium text-xs rounded-lg transition-all border border-white/5 flex items-center gap-2 hover:-translate-y-0.5"
                    data-cursor-hover
                  >
                    <Github className="w-3.5 h-3.5" /> GitHub
                  </a>
                </MagneticButton>
              </motion.div>
            </div>
          </ScrollReveal>

          {/* Animated Stats Counters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 py-6 border-y border-white/5"
          >
            <AnimatedCounter to={4} suffix="+" label="Years Experience" icon={<Star className="w-5 h-5" />} />
            <AnimatedCounter to={8400} suffix="+ rps" label="Max Throughput" icon={<Zap className="w-5 h-5" />} />
            <AnimatedCounter to={18} suffix="x" label="Query Speedup" icon={<Brain className="w-5 h-5" />} />
            <AnimatedCounter to={98} suffix="%" label="Test Coverage" icon={<ShieldCheck className="w-5 h-5" />} />
          </motion.div>

          {/* Scroll velocity indicator */}
          <motion.div className="mt-8 flex justify-center relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}>
            <button onClick={() => scrollTo('code')} className="cursor-pointer group relative">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-neutral-600 group-hover:text-indigo-400 transition-colors relative"
              >
                <ChevronDown className="w-6 h-6" />
              </motion.div>
              {/* Scroll velocity ring */}
              <motion.div
                className="absolute -inset-4 rounded-full border border-indigo-500/10"
                animate={{ scale: [1, 1 + Math.min(scrollVelocity / 2000, 0.3)], opacity: [0.3, 0] }}
                transition={{ duration: 0.5 }}
              />
            </button>
          </motion.div>
        </section>

        <SectionDivider />

        {/* ─── Code Terminal Section ─── */}
        <section id="code" className="py-24 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="space-y-1.5 mb-10">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold gradient-text">
                <Code2 className="w-3.5 h-3.5 inline mr-1" />
                Live Code Showcase
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Watch Code Being Written in Real-Time
              </h3>
              <p className="text-xs text-neutral-400 max-w-2xl">
                Watch as the terminal types out real Python, TypeScript, and SQL snippets — 
                demonstrating the actual code patterns I use in production.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <motion.div
              whileHover={{ scale: 1.005 }}
              transition={{ type: 'spring', stiffness: 300 }}
              className="animated-border rounded-xl"
            >
              <div className="relative rounded-xl overflow-hidden">
                <CodeTerminal />
              </div>
            </motion.div>
          </ScrollReveal>
        </section>

        <SectionDivider flip />

        {/* ─── Interactive Playground ─── */}
        <section id="playground" className="py-24 px-6 max-w-5xl mx-auto">
          <ScrollReveal>
            <div className="space-y-1.5 mb-10">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold gradient-text">
                <Zap className="w-3.5 h-3.5 inline mr-1" />
                Interactive API Demo
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Try the API Yourself
              </h3>
              <p className="text-xs text-neutral-400 max-w-2xl">
                Browse endpoints, add parameters, and see realistic JSON responses — 
                all running client-side with beautifully simulated backend behavior.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <TiltCard tiltDeg={3} glare={true}>
              <ApiPlayground />
            </TiltCard>
          </ScrollReveal>
        </section>

        <SectionDivider />

        {/* ─── Projects ─── */}
        <section id="projects" className="py-24 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="space-y-1.5 mb-10">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold gradient-text">
                <Layers className="w-3.5 h-3.5 inline mr-1" />
                Featured Work
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Engineering Artifacts
              </h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {FEATURED_PROJECTS.map((proj, i) => (
              <ScrollReveal key={proj.id} delay={0.1 * i} direction={i === 0 ? 'left' : i === 2 ? 'right' : 'up'}>
                <TiltCard tiltDeg={6} glare={true}>
                  <motion.div
                    className="group bg-[#0c0c0e] border border-white/5 rounded-xl p-5 hover:border-indigo-500/20 hover:bg-[#0c0c0e]/80 transition-all duration-300 flex flex-col justify-between space-y-4 min-h-[200px] relative overflow-hidden"
                    whileHover={{ y: -2 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                  >
                    {/* Shimmer overlay on hover */}
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />

                    <div className="space-y-2 relative z-10">
                      <div className="flex items-start justify-between">
                        <h4 className="text-sm font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                          {proj.title}
                        </h4>
                        <a href={proj.github} target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors">
                          <ArrowUpRight className="w-4 h-4" />
                        </a>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">{proj.description}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 relative z-10">
                      {proj.tags.map((t) => (
                        <span key={t} className="text-[9px] font-mono font-medium bg-[#141416] text-indigo-300 border border-indigo-500/10 px-1.5 py-0.5 rounded group-hover:border-indigo-500/20 transition-colors">
                          {t}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <SectionDivider flip />

        {/* ─── Experience ─── */}
        <section id="experience" className="py-24 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="space-y-1.5 mb-10">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold gradient-text">
                <GitBranch className="w-3.5 h-3.5 inline mr-1" />
                Professional Timeline
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Engineering Journey</h3>
            </div>
          </ScrollReveal>

          <div className="space-y-6">
            {EXPERIENCES.map((exp, i) => (
              <ScrollReveal key={i} delay={0.1 * i}>
                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="relative flex gap-6 pl-6 before:content-[''] before:absolute before:left-[7px] before:top-3 before:bottom-[-24px] before:w-[1px] before:bg-gradient-to-b before:from-indigo-500/20 before:to-transparent last:before:hidden"
                >
                  <div className="absolute left-0 top-1.5 w-[15px] h-[15px] rounded-full bg-indigo-500/20 border-2 border-indigo-500 flex items-center justify-center animate-pulse-glow">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-[5px] h-[5px] rounded-full bg-indigo-400"
                    />
                  </div>
                  <div className="flex-1 bg-[#0c0c0e] border border-white/5 rounded-xl p-5 hover:border-indigo-500/20 hover:bg-[#0c0c0e]/70 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                      <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                      <span className="text-[10px] font-mono text-neutral-500">{exp.period}</span>
                    </div>
                    <p className="text-xs text-neutral-500 font-medium mb-2">{exp.company}</p>
                    <p className="text-xs text-neutral-400 leading-relaxed mb-3">{exp.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {exp.tags.map((t) => (
                        <span key={t} className="text-[9px] font-mono bg-[#141416] text-indigo-300 border border-indigo-500/10 px-1.5 py-0.5 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <SectionDivider />

        {/* ─── Skills ─── */}
        <section id="skills" className="py-24 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="space-y-1.5 mb-10">
              <div className="text-xs font-mono uppercase tracking-wider font-semibold gradient-text">
                <Rocket className="w-3.5 h-3.5 inline mr-1" />
                Technical Stack
              </div>
              <h3 className="text-lg font-bold text-white tracking-tight">Stack Environment</h3>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SKILLS_LIST.map((group, i) => (
              <ScrollReveal key={group.category} delay={0.1 * i} direction={i % 2 === 0 ? 'left' : 'right'}>
                <TiltCard tiltDeg={5} glare={true}>
                  <motion.div
                    className="bg-[#0c0c0e] border border-white/5 rounded-xl p-5 hover:border-indigo-500/20 transition-all h-full"
                    whileHover={{ y: -2 }}
                  >
                    <h5 className="text-[11px] font-mono text-white font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                      <span className="text-indigo-400">{group.icon}</span>
                      {group.category}
                    </h5>
                    <div className="flex flex-col gap-2.5">
                      {group.items.map((skill, j) => (
                        <motion.div
                          key={skill}
                          className="flex items-center gap-2.5 group/skill"
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.05 * j, duration: 0.3 }}
                          viewport={{ once: true }}
                          whileHover={{ x: 4 }}
                        >
                          <span className="relative flex items-center justify-center w-4 h-4">
                            <span className="absolute inset-0 rounded-full bg-indigo-500/10 group-hover/skill:bg-indigo-500/30 scale-0 group-hover/skill:scale-100 transition-all duration-300" />
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/40 group-hover/skill:bg-indigo-400 transition-colors shrink-0 relative" />
                          </span>
                          <span className="text-xs text-neutral-400 group-hover/skill:text-neutral-200 transition-colors">{skill}</span>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </TiltCard>
              </ScrollReveal>
            ))}
          </div>
        </section>

        <SectionDivider flip />

        {/* ─── Quote ─── */}
        <section className="py-16 px-6 max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="relative"
            >
              <Quote className="w-8 h-8 text-indigo-500/20 absolute -top-4 -left-4 animate-float-slow" />
              <p className="text-lg sm:text-xl text-neutral-300 italic leading-relaxed font-light">
                "Good code isn't just about making the computer understand — 
                it's about making other developers understand too."
              </p>
              <div className="mt-4 text-xs font-mono text-neutral-500">
                — Antony Gitau Kihara
              </div>
            </motion.div>
          </ScrollReveal>
        </section>

        <SectionDivider />

        {/* ─── Contact ─── */}
        <section id="contact" className="py-24 px-6 max-w-4xl mx-auto">
          <ScrollReveal>
            <div className="text-center space-y-2 mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-[10px] font-mono uppercase text-indigo-400 font-bold tracking-wider">
                <Send className="w-3 h-3" />
                Get in Touch
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight glow">
                Let's Build Something Great
              </h2>
              <p className="text-neutral-400 text-xs max-w-md mx-auto leading-relaxed">
                Have a project in mind? Send a message and I'll get back to you within 24 hours.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Info */}
            <ScrollReveal direction="left" className="md:col-span-5">
              <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-xl space-y-6 hover:border-indigo-500/20 transition-all">
                <h4 className="text-[10px] font-bold text-neutral-200 uppercase tracking-wider font-mono">
                  Contact Info
                </h4>
                <div className="space-y-4 text-xs font-mono text-neutral-400">
                  <div className="p-3 bg-[#050505] rounded-lg border border-white/5 space-y-1 hover:border-indigo-500/10 transition-all">
                    <div className="text-neutral-500 uppercase text-[9px] font-bold tracking-wider">Email</div>
                    <button onClick={handleCopyEmail}
                      className="text-white hover:text-indigo-400 transition-colors font-semibold flex items-center gap-1.5 cursor-pointer text-left w-full break-all"
                      data-cursor-hover
                    >
                      tgitau088@gmail.com
                      {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-neutral-400 shrink-0" />}
                    </button>
                  </div>
                  <div className="p-3 bg-[#050505] rounded-lg border border-white/5 space-y-1 hover:border-indigo-500/10 transition-all">
                    <div className="text-neutral-500 uppercase text-[9px] font-bold tracking-wider">GitHub</div>
                    <a href="https://github.com/Tony46117" target="_blank" rel="noreferrer"
                      className="text-white hover:text-indigo-400 transition-colors font-semibold flex items-center gap-1"
                      data-cursor-hover
                    >
                      github.com/Tony46117 <ExternalLink className="w-3 h-3 shrink-0 text-neutral-500" />
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>

            {/* Form */}
            <ScrollReveal direction="right" className="md:col-span-7">
              <div className="bg-[#0c0c0e] border border-white/5 p-6 rounded-xl hover:border-indigo-500/20 transition-all">
                <form onSubmit={handleContactSubmit} className="space-y-4 text-xs font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="contact-name" className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px]">Name</label>
                      <input id="contact-name" type="text" required placeholder="Jane Doe" value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="contact-email" className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px]">Email</label>
                      <input id="contact-email" type="email" required placeholder="jane@example.com" value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="font-semibold text-neutral-500 uppercase tracking-wider text-[9px]">Message</label>
                    <textarea id="contact-message" required rows={3} placeholder="Tell me about your project..."
                      value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-3 py-2 bg-[#050505] border border-white/10 rounded-lg text-neutral-200 focus:outline-none focus:border-indigo-500 transition-colors leading-relaxed" />
                  </div>
                  <MagneticButton strength={0.15} className="w-full">
                    <button type="submit" disabled={isSubmitting}
                      className="w-full py-2.5 flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-neutral-800 disabled:text-neutral-500 text-white font-semibold rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/10 hover:-translate-y-0.5"
                      data-cursor-hover
                    >
                      <Send className="w-3.5 h-3.5" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </MagneticButton>
                  <AnimatePresence>
                    {submitStatus !== 'idle' && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className={`p-3 rounded-lg font-mono text-[10px] border flex gap-3 ${
                          submitStatus === 'success'
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                            : 'bg-red-500/5 text-red-400 border-red-500/20'
                        }`}
                      >
                        {submitStatus === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />}
                        <div>
                          <div className="font-semibold">{validationMsg}</div>
                          {submitStatus === 'success' && <p className="text-[9px] text-neutral-400 mt-1 font-sans">Thank you! I'll reach out soon.</p>}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </form>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* Back to Top */}
        <BackToTop />

        {/* Footer */}
        <footer className="relative border-t border-white/5 bg-[#030303] py-12 px-6 text-center text-neutral-600 text-xs font-mono space-y-4 overflow-hidden">
          {/* Subtle footer gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.02] to-transparent pointer-events-none" />
          
          <div className="flex justify-center gap-6 text-neutral-400 relative z-10">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => scrollTo(link.id)} className="hover:text-white transition-colors cursor-pointer">
                {link.label}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-4 pt-2 relative z-10">
            <a href="https://github.com/Tony46117" target="_blank" rel="noreferrer" className="text-neutral-500 hover:text-white transition-colors"><Github className="w-4 h-4" /></a>
            <a href="mailto:tgitau088@gmail.com" className="text-neutral-500 hover:text-white transition-colors"><Mail className="w-4 h-4" /></a>
          </div>
          <div className="text-[11px] relative z-10">© {new Date().getFullYear()} Antony Gitau Kihara. All rights reserved.</div>
          <div className="text-[10px] text-neutral-700 relative z-10">Built with React · TypeScript · Tailwind CSS · Framer Motion</div>
        </footer>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Back to Top
// ────────────────────────────────────────────────────────

function BackToTop() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-50 p-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full shadow-lg shadow-indigo-600/20 transition-all hover:-translate-y-1 hover:shadow-indigo-600/40 cursor-pointer group"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          data-cursor-hover
        >
          <ChevronDown className="w-4 h-4 rotate-180 group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
