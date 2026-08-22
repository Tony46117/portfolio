/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Github,
  Mail,
  MapPin,
  Send,
  Check,
  ExternalLink,
  Sparkles,
  Quote,
  Search,
  PenTool,
  LifeBuoy,
  Code2,
  Server,
  Layers,
  Wrench,
  Cpu,
  Rocket,
  ChevronDown,
} from 'lucide-react';
import type { ReactNode, FormEvent } from 'react';
import profilePhoto from './assets/images/Screenshot_20260724_135823.png';
import ScrollReveal from './components/ScrollReveal';
import AnimatedCounter from './components/AnimatedCounter';
import {
  about,
  heroTech,
  stats,
  projects,
  skillGroups,
  experience,
  approach,
  testimonials,
} from './data';

const NAV_LINKS = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'contact', label: 'Contact' },
];

const SKILL_ICONS: Record<string, ReactNode> = {
  Languages: <Code2 className="w-4 h-4" />,
  Backend: <Server className="w-4 h-4" />,
  Frontend: <Layers className="w-4 h-4" />,
  Tools: <Wrench className="w-4 h-4" />,
};

const STAT_ICONS: Record<string, ReactNode> = {
  'Years Experience': <Sparkles className="w-5 h-5" />,
  'Projects Built': <Layers className="w-5 h-5" />,
  Technologies: <Cpu className="w-5 h-5" />,
  'Live Deployments': <Rocket className="w-5 h-5" />,
};

// ────────────────────────────────────────────────────────
// Hooks
// ────────────────────────────────────────────────────────

function useActiveSection() {
  const [active, setActive] = useState('hero');
  useEffect(() => {
    const sections = ['hero', ...NAV_LINKS.map((l) => l.id)];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px 0px 0px' }
    );
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

// ────────────────────────────────────────────────────────
// App
// ────────────────────────────────────────────────────────

export default function App() {
  const activeSection = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileOpen(false);
    }
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(about.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${about.email}`;
    }
  };

  return (
    <div className="min-h-screen bg-background text-zinc-200 font-sans antialiased overflow-x-hidden">
      {/* ─── Nav ─── */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-background/80 backdrop-blur-xl border-b border-line'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => scrollTo('hero')}
            className="flex items-center gap-2 cursor-pointer group"
          >
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-accent-deep flex items-center justify-center text-white font-display font-bold text-sm shadow-lg shadow-accent/30">
              A
            </span>
            <span className="font-display font-semibold text-white tracking-tight">
              Antony<span className="text-accent-strong">.dev</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <button
                key={link.id}
                onClick={() => scrollTo(link.id)}
                className={`px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer ${
                  activeSection === link.id
                    ? 'text-white'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a
              href={about.github}
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <button
              onClick={() => scrollTo('contact')}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 bg-white text-background text-sm font-semibold rounded-lg hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              Let's talk
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 text-zinc-300 hover:text-white cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden border-b border-line bg-background/95 backdrop-blur-xl"
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => scrollTo(link.id)}
                    className={`text-left px-3 py-2.5 rounded-lg transition-colors cursor-pointer ${
                      activeSection === link.id
                        ? 'text-white bg-white/5'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </button>
                ))}
                <button
                  onClick={() => scrollTo('contact')}
                  className="mt-2 px-3 py-2.5 bg-white text-background text-sm font-semibold rounded-lg cursor-pointer"
                >
                  Let's talk
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* ─── Hero ─── */}
      <section
        id="hero"
        className="relative min-h-screen flex flex-col justify-center pt-28 pb-16 px-6"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 bg-grid pointer-events-none opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-accent/20 blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-[480px] h-[480px] rounded-full bg-fuchsia-500/10 blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid lg:grid-cols-2 gap-14 lg:gap-10 items-center">
            {/* Text */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-line bg-white/5 text-xs font-mono text-accent-strong mb-6"
              >
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                </span>
                Available for work
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.08] tracking-tight text-white"
              >
                {about.headlineA}{' '}
                <span className="gradient-text glow">{about.headlineB}</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mt-6 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed"
              >
                {about.intro}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-4 flex items-center gap-2 text-sm text-zinc-500"
              >
                <MapPin className="w-4 h-4 text-accent-strong" />
                Based in {about.location}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => scrollTo('projects')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent hover:bg-accent-deep text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 hover:-translate-y-0.5 cursor-pointer"
                >
                  View my work <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={copyEmail}
                  className="inline-flex items-center gap-2 px-6 py-3 border border-line bg-white/5 hover:bg-white/10 text-zinc-200 font-semibold rounded-xl transition-all cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" /> Copied
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4" /> Get in touch
                    </>
                  )}
                </button>
              </motion.div>

              {/* Tech stack */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-10"
              >
                <p className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-3">
                  My tech stack
                </p>
                <div className="flex flex-wrap gap-2">
                  {heroTech.map((t) => (
                    <span
                      key={t}
                      className="px-3 py-1.5 text-xs font-medium rounded-full border border-line bg-white/5 text-zinc-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Portrait */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative mx-auto lg:mx-0 w-full max-w-sm"
            >
              <div className="relative aspect-square">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/50 via-accent-deep/30 to-fuchsia-500/40 blur-2xl opacity-60" />
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent to-fuchsia-500 p-[2px]">
                  <div className="w-full h-full rounded-3xl bg-surface overflow-hidden">
                    <img
                      src={profilePhoto}
                      alt={about.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="absolute -bottom-4 -left-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-card border border-line shadow-xl"
                >
                  <Code2 className="w-4 h-4 text-accent-strong" />
                  <span className="text-xs font-medium text-white">
                    Full-Stack Developer
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-6 py-8 border-t border-line"
          >
            {stats.map((s) => (
              <AnimatedCounter
                key={s.label}
                to={s.value}
                suffix={s.suffix}
                label={s.label}
                icon={STAT_ICONS[s.label]}
              />
            ))}
          </motion.div>
        </div>

        <motion.button
          onClick={() => scrollTo('about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-zinc-600 hover:text-white transition-colors cursor-pointer"
          aria-label="Scroll down"
        >
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </section>

      {/* ─── About ─── */}
      <section id="about" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="font-mono text-sm text-accent-strong mb-3">The inside scoop</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              About me
            </h2>
            <p className="mt-4 text-zinc-400 leading-relaxed">
              I'm {about.name}, a {about.role.toLowerCase()} based in {about.location}.
              I enjoy taking a product from a rough idea all the way to a polished,
              deployed experience — and making the technical decisions that keep it
              fast and maintainable along the way.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="h-full rounded-2xl border border-line bg-card p-7">
                <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent-strong" /> Currently building
                </h3>
                <p className="text-zinc-400 leading-relaxed">
                  {about.currentlyBuilding}
                </p>
                <a
                  href="https://greenlineroyal.com/bus/"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent-strong hover:text-white transition-colors"
                >
                  See it live <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <div className="h-full rounded-2xl border border-line bg-card p-7">
                <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Rocket className="w-4 h-4 text-accent-strong" /> What I do
                </h3>
                <ul className="space-y-3 text-zinc-400 text-sm">
                  {[
                    'Design and build full-stack web applications',
                    'Create scalable, well-tested backend APIs',
                    'Turn complex requirements into clean interfaces',
                    'Deploy and maintain production systems',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-accent-strong mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Projects ─── */}
      <section id="projects" className="py-24 px-6 scroll-mt-20 bg-surface/40 border-y border-line">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="font-mono text-sm text-accent-strong mb-3">Recent work</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              A small selection of projects
            </h2>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <ScrollReveal key={project.id} delay={0.08 * i}>
                <div className="group h-full flex flex-col rounded-2xl border border-line bg-card p-6 hover:border-accent/40 transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl">💡</span>
                    <div className="flex items-center gap-2">
                      {project.github && (
                        <a
                          href={project.github}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} on GitHub`}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                      {project.live && (
                        <a
                          href={project.live}
                          target="_blank"
                          rel="noreferrer"
                          aria-label={`${project.title} live site`}
                          className="text-zinc-500 hover:text-white transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                  <h3 className="font-display text-lg font-semibold text-white group-hover:text-accent-strong transition-colors">
                    {project.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-400 leading-relaxed flex-1">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {project.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/5 border border-line text-zinc-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent-strong hover:text-white transition-colors"
                    >
                      Check live site <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </ScrollReveal>
            ))}

            {/* View more card */}
            <ScrollReveal delay={0.4}>
              <a
                href={`${about.github}?tab=repositories`}
                target="_blank"
                rel="noreferrer"
                className="group h-full flex flex-col items-center justify-center text-center rounded-2xl border border-dashed border-line bg-transparent p-6 hover:border-accent/40 hover:bg-white/[0.02] transition-all"
              >
                <Github className="w-8 h-8 text-zinc-600 group-hover:text-accent-strong transition-colors mb-3" />
                <h3 className="font-display text-lg font-semibold text-white">
                  See more on GitHub
                </h3>
                <p className="mt-2 text-sm text-zinc-500">
                  Explore the rest of my repositories
                </p>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Experience & Approach ─── */}
      <section id="experience" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="font-mono text-sm text-accent-strong mb-3">My work experience</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Experience & approach
            </h2>
          </ScrollReveal>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Timeline */}
            <div className="space-y-6">
              {experience.map((exp, i) => (
                <ScrollReveal key={exp.role} delay={0.1 * i}>
                  <div className="relative pl-6 border-l border-line">
                    <span className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-accent ring-4 ring-accent/20" />
                    <div className="rounded-2xl border border-line bg-card p-6">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <h3 className="font-display font-semibold text-white">
                          {exp.role}
                        </h3>
                        <span className="text-xs font-mono text-zinc-500">{exp.period}</span>
                      </div>
                      <p className="text-sm text-accent-strong mb-3">{exp.company}</p>
                      <p className="text-sm text-zinc-400 leading-relaxed">{exp.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.tags.map((t) => (
                          <span
                            key={t}
                            className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/5 border border-line text-zinc-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Approach */}
            <div className="space-y-6">
              {approach.map((step, i) => (
                <ScrollReveal key={step.step} delay={0.1 * i}>
                  <div className="flex gap-5 rounded-2xl border border-line bg-card p-6">
                    <span className="font-display text-3xl font-bold text-accent/30 shrink-0">
                      {step.step}
                    </span>
                    <div>
                      <h3 className="font-display font-semibold text-white flex items-center gap-2">
                        {step.title}
                        {i === 0 && <Search className="w-4 h-4 text-accent-strong" />}
                        {i === 1 && <PenTool className="w-4 h-4 text-accent-strong" />}
                        {i === 2 && <LifeBuoy className="w-4 h-4 text-accent-strong" />}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="mt-16">
            <ScrollReveal className="mb-8">
              <h3 className="font-display text-xl font-semibold text-white">
                Technical stack
              </h3>
            </ScrollReveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillGroups.map((group, i) => (
                <ScrollReveal key={group.category} delay={0.08 * i}>
                  <div className="h-full rounded-2xl border border-line bg-card p-6">
                    <h4 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
                      <span className="text-accent-strong">{SKILL_ICONS[group.category]}</span>
                      {group.category}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 text-[11px] font-medium rounded-md bg-white/5 border border-line text-zinc-300"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section id="testimonials" className="py-24 px-6 scroll-mt-20 bg-surface/40 border-y border-line">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="font-mono text-sm text-accent-strong mb-3">Kind words</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              What clients say
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <ScrollReveal key={i} delay={0.1 * i}>
                <div className="h-full flex flex-col rounded-2xl border border-line bg-card p-7">
                  <Quote className="w-7 h-7 text-accent/40 mb-4" />
                  <p className="text-zinc-300 leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="mt-6 pt-5 border-t border-line">
                    <div className="font-display font-semibold text-white">{t.name}</div>
                    <div className="text-sm text-zinc-500">{t.role}</div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Locations ─── */}
      <section id="locations" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal className="mb-14 max-w-2xl">
            <p className="font-mono text-sm text-accent-strong mb-3">Find Us</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Our Locations
            </h2>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              We serve you from two convenient locations in the Kisumu region.
            </p>
          </ScrollReveal>

          <div className="grid sm:grid-cols-2 gap-6">
            <ScrollReveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-card p-8 text-center hover:border-accent/40 transition-colors">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-accent-strong" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Nyalenda</h3>
                <p className="text-sm text-zinc-500 font-mono mb-5">0°15'16.4"S 36°14'02.6"E</p>
                <a
                  href="https://www.google.com/maps?q=-0.2545556,36.2340556"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-strong hover:bg-accent-strong/90 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View on Map <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="rounded-2xl border border-line bg-card p-8 text-center hover:border-accent/40 transition-colors">
                <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
                  <MapPin className="w-7 h-7 text-accent-strong" />
                </div>
                <h3 className="font-display text-xl font-bold text-white mb-2">Texas</h3>
                <p className="text-sm text-zinc-500 font-mono mb-5">0°15'31.7"S 36°17'23.5"E</p>
                <a
                  href="https://www.google.com/maps?q=-0.2588056,36.2898611"
                  target="_blank"
                  rel="noopener"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent-strong hover:bg-accent-strong/90 text-white text-sm font-medium rounded-lg transition-colors"
                >
                  View on Map <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Contact ─── */}
      <section id="contact" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-14 items-start">
            <ScrollReveal>
              <p className="font-mono text-sm text-accent-strong mb-3">Get in touch</p>
              <h2 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight leading-tight">
                Ready to take your digital presence to the next level?
              </h2>
              <p className="mt-5 text-zinc-400 leading-relaxed max-w-md">
                Have a project in mind or just want to say hello? Drop me a message
                and I'll get back to you as soon as I can.
              </p>

              <div className="mt-8 space-y-4">
                <a
                  href={`mailto:${about.email}`}
                  className="flex items-center gap-4 rounded-xl border border-line bg-card p-4 hover:border-accent/40 transition-colors"
                >
                  <span className="w-10 h-10 rounded-lg bg-accent/10 text-accent-strong flex items-center justify-center">
                    <Mail className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-zinc-500">Email</div>
                    <div className="text-white font-medium">{about.email}</div>
                  </div>
                </a>
                <a
                  href={about.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-4 rounded-xl border border-line bg-card p-4 hover:border-accent/40 transition-colors"
                >
                  <span className="w-10 h-10 rounded-lg bg-accent/10 text-accent-strong flex items-center justify-center">
                    <Github className="w-5 h-5" />
                  </span>
                  <div>
                    <div className="text-xs text-zinc-500">GitHub</div>
                    <div className="text-white font-medium">github.com/Tony46117</div>
                  </div>
                </a>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <ContactForm />
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-line py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} {about.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-5 text-zinc-500">
            <a
              href={about.github}
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${about.email}`}
              className="hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Contact form
// ────────────────────────────────────────────────────────

function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${form.name || 'your site'}`);
    const body = encodeURIComponent(
      `${form.message}\n\n— ${form.name}\n${form.email}`
    );
    window.location.href = `mailto:${about.email}?subject=${subject}&body=${body}`;
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl bg-white/5 border border-line text-zinc-100 placeholder:text-zinc-600 focus:outline-none transition-colors';

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-card p-7 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium text-zinc-300">
            Name
          </label>
          <input
            id="name"
            type="text"
            required
            placeholder="Jane Doe"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            placeholder="jane@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={inputClass}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium text-zinc-300">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          placeholder="Tell me about your project..."
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          className={`${inputClass} resize-none`}
        />
      </div>
      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent hover:bg-accent-deep text-white font-semibold rounded-xl transition-all shadow-lg shadow-accent/30 hover:shadow-accent/50 cursor-pointer"
      >
        <Send className="w-4 h-4" /> Send message
      </button>
      <AnimatePresence>
        {sent && (
          <motion.p
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="text-sm text-emerald-400 text-center"
          >
            Opening your email client…
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
}
