export type SkillCategory = 'backend' | 'frontend' | 'tools' | 'languages';

export interface Skill {
  name: string;
  category: SkillCategory;
  rating: number; // 1-5 scale
  years: number;
}

export interface Metric {
  label: string;
  value: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  category: 'Backend' | 'Full-Stack';
  techStack: string[];
  metrics: Metric[];
  role: string;
  features: string[];
  interactiveType: 'api-sim' | 'query-optimizer' | 'schema-designer';
}

export interface ApiEndpoint {
  id: string;
  method: 'GET' | 'POST';
  path: string;
  summary: string;
  description: string;
  parameters?: {
    name: string;
    type: string;
    required: boolean;
    description: string;
    defaultValue?: string;
  }[];
  responseExample: Record<string, any>;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}
