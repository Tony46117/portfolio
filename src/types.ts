export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  live?: string;
  github?: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}

export interface ApproachStep {
  step: string;
  title: string;
  description: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}
