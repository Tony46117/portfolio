import type {
  Project,
  SkillGroup,
  Experience,
  Testimonial,
  ApproachStep,
  Stat,
} from './types';

export const about = {
  name: 'Antony Gitau Kihara',
  firstName: 'Antony',
  role: 'Full-Stack Software Engineer',
  location: 'Nairobi, Kenya',
  email: 'tgitau088@gmail.com',
  github: 'https://github.com/Tony46117',
  headlineA: 'Transforming concepts into',
  headlineB: 'seamless user experiences',
  intro:
    "I'm a full-stack developer building responsive, useful products for the web — from bus ticketing platforms to autonomous trading software. I care about clean architecture, performance, and shipping things people actually use.",
  currentlyBuilding: 'A cross-border bus ticketing platform for Greenline Royal.',
};

export const heroTech = [
  'React',
  'TypeScript',
  'Next.js',
  'Python',
  'FastAPI',
  'PostgreSQL',
  'MongoDB',
  'Tailwind CSS',
];

export const stats: Stat[] = [
  { value: 4, suffix: '+', label: 'Years Experience' },
  { value: 21, suffix: '+', label: 'Projects Built' },
  { value: 15, suffix: '+', label: 'Technologies' },
  { value: 2, suffix: '+', label: 'Live Deployments' },
];

export const projects: Project[] = [
  {
    id: 'greenline',
    title: 'Greenline Royal',
    description:
      'Bus ticketing platform with a video hero and ticket search across Kenya & Uganda routes.',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive'],
    live: 'https://greenlineroyal.com/bus/',
    github: 'https://github.com/Tony46117/greenline',
  },
  {
    id: 'trader',
    title: 'Autonomous Trader',
    description:
      'Autonomous trading software in Python that automates strategy execution and market analysis.',
    tags: ['Python', 'Automation', 'Data Analysis'],
    github: 'https://github.com/Tony46117/trader',
  },
  {
    id: 'pendo',
    title: 'Pendo',
    description:
      'A modern dating web app with a clean, responsive interface and real-time interactions.',
    tags: ['TypeScript', 'React', 'Tailwind CSS'],
    live: 'https://pendo-omega.vercel.app',
    github: 'https://github.com/Tony46117/pendo',
  },
  {
    id: 'grill-hotel',
    title: 'Grill Hotel',
    description:
      'A professional hotel website with a modern landing experience and booking flow.',
    tags: ['HTML', 'CSS', 'JavaScript'],
    github: 'https://github.com/Tony46117/grill-hotel-professional',
  },
  {
    id: 'matrix',
    title: 'Matrix Rain',
    description:
      'Terminal-based Matrix rain rendered over a photo using OpenCV face detection.',
    tags: ['Python', 'OpenCV', 'Terminal'],
    github: 'https://github.com/Tony46117/matrix',
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: 'Languages',
    items: ['Python', 'TypeScript', 'JavaScript', 'SQL', 'HTML & CSS'],
  },
  {
    category: 'Backend',
    items: ['FastAPI', 'Django', 'Node.js', 'PostgreSQL', 'MongoDB', 'Redis'],
  },
  {
    category: 'Frontend',
    items: ['React', 'Next.js', 'Tailwind CSS', 'Motion'],
  },
  {
    category: 'Tools',
    items: ['Docker', 'Git & CI/CD', 'Linux', 'Pytest'],
  },
];

export const experience: Experience[] = [
  {
    role: 'Backend Software Engineer',
    company: 'Freelance · Contract',
    period: '2023 — Present',
    description:
      'Architected high-throughput services with FastAPI, PostgreSQL and Redis — delivering scalable APIs with clean architecture and strong test coverage.',
    tags: ['FastAPI', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    role: 'Full-Stack Developer',
    company: 'Independent Projects',
    period: '2022 — Present',
    description:
      'Built full-stack products from schema to deployment — bus ticketing, trading software, and web apps — with an emphasis on responsiveness and real-world usefulness.',
    tags: ['React', 'TypeScript', 'Python', 'REST APIs'],
  },
];

export const approach: ApproachStep[] = [
  {
    step: '01',
    title: 'Discovery & Planning',
    description:
      "We discuss your goals, audience and competitors, then plan the structure and timeline for a smooth build.",
  },
  {
    step: '02',
    title: 'Design & Development',
    description:
      "I design a user-friendly experience that matches your brand, then build and test it thoroughly so everything works flawlessly.",
  },
  {
    step: '03',
    title: 'Launch & Maintenance',
    description:
      "We launch, set up tracking to measure success, and provide ongoing maintenance to keep your product secure and up to date.",
  },
];

// TODO: Replace these with real client testimonials before going live.
export const testimonials: Testimonial[] = [
  {
    quote:
      'Antony delivered a fast, reliable platform that our team now relies on every day. Clear communication and clean, well-organized code from start to finish.',
    name: 'Your Client Name',
    role: 'Product Owner',
  },
  {
    quote:
      'A rare developer who cares about both the user experience and the architecture underneath. The result was polished, performant, and exactly what we needed.',
    name: 'Your Client Name',
    role: 'Founder',
  },
  {
    quote:
      'From planning to launch, everything was on time and thoughtfully built. He explained complex technical decisions in plain language and delivered beyond expectations.',
    name: 'Your Client Name',
    role: 'Startup Lead',
  },
];
