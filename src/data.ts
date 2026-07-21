import { Project, Skill, ApiEndpoint } from './types';

export const skillsData: Skill[] = [
  // Languages
  { name: 'Python', category: 'languages', rating: 5, years: 4 },
  { name: 'JavaScript', category: 'languages', rating: 5, years: 3 },
  { name: 'TypeScript', category: 'languages', rating: 4, years: 2 },
  { name: 'HTML5/CSS3', category: 'languages', rating: 5, years: 4 },
  { name: 'SQL', category: 'languages', rating: 4, years: 3 },
  
  // Backend
  { name: 'FastAPI', category: 'backend', rating: 5, years: 3 },
  { name: 'Pydantic v2', category: 'backend', rating: 5, years: 3 },
  { name: 'Django / Flask', category: 'backend', rating: 4, years: 3 },
  { name: 'Uvicorn / Gunicorn', category: 'backend', rating: 5, years: 3 },
  { name: 'PostgreSQL / MySQL', category: 'backend', rating: 4, years: 3 },
  { name: 'SQLAlchemy / Tortoise ORM', category: 'backend', rating: 5, years: 3 },
  { name: 'Celery & Redis', category: 'backend', rating: 4, years: 2 },
  { name: 'RESTful API Design', category: 'backend', rating: 5, years: 4 },

  // Frontend
  { name: 'React', category: 'frontend', rating: 5, years: 3 },
  { name: 'Tailwind CSS', category: 'frontend', rating: 5, years: 3 },
  { name: 'React Context / Hooks', category: 'frontend', rating: 5, years: 3 },
  { name: 'Motion (Animations)', category: 'frontend', rating: 4, years: 2 },
  { name: 'Vite / npm', category: 'frontend', rating: 4, years: 3 },

  // Tools & DevOps
  { name: 'Git & GitHub Actions', category: 'tools', rating: 5, years: 4 },
  { name: 'Docker / Compose', category: 'tools', rating: 4, years: 2 },
  { name: 'Postman / OpenAPI Docs', category: 'tools', rating: 5, years: 4 },
  { name: 'Linux / Bash Scripting', category: 'tools', rating: 4, years: 3 },
  { name: 'Pytest / Testing Suites', category: 'tools', rating: 5, years: 3 }
];

export const projectsData: Project[] = [
  {
    id: 'api-orchestrator',
    title: 'FastAPI Microservice Orchestrator',
    description: 'An asynchronous, high-throughput microservice orchestrator featuring dynamic rate limiting, load distribution, and visual status tracking.',
    longDescription: 'Engineered as a robust middleware layer to coordinate upstream API requests safely. Built fully on Python\'s async/await paradigm, leveraging FastAPI\'s dependency injection for high-performance authentication. Integrated Redis token bucket algorithms for sub-millisecond rate limits and task dispatch.',
    category: 'Backend',
    techStack: ['Python', 'FastAPI', 'Redis', 'Docker', 'Asyncio', 'Pytest'],
    role: 'Lead Backend Engineer',
    metrics: [
      { label: 'Throughput', value: '8,400+ rps', description: 'Under heavy load profiles' },
      { label: 'API Latency', value: '< 14ms', description: '99th percentile response time' },
      { label: 'Test Coverage', value: '98%', description: 'Fully mocked unit & integration tests' }
    ],
    features: [
      'Token-bucket dynamic rate limiting via Redis scripting.',
      'Auto-healing connection pools with exponential backoff routing.',
      'Pydantic v2 structured payload parsing with dynamic sanitization layers.',
      'Centralized CORS and secure header configurations.'
    ],
    interactiveType: 'api-sim'
  },
  {
    id: 'query-optimizer',
    title: 'E-Commerce Ledger & Query Optimizer',
    description: 'A transaction ledger back-end equipped with dynamic indexing, raw SQL analytics optimization, and an interactive query cost visualizer.',
    longDescription: 'Created a highly reliable, double-entry ledger database schema mapping complex buyer-merchant operations. Optimized high-load reporting endpoints by auditing and replacing legacy ORM loops with specialized PostgreSQL window functions and index strategies, preventing standard N+1 issues.',
    category: 'Full-Stack',
    techStack: ['Python', 'FastAPI', 'PostgreSQL', 'SQLAlchemy', 'React', 'Recharts'],
    role: 'Database & Backend Architect',
    metrics: [
      { label: 'Query Execution', value: '18x Faster', description: 'Optimized complex ledger aggregations' },
      { label: 'Concurrency', value: '5,000+', description: 'Active concurrent transactions handled' },
      { label: 'DB Connection', value: '0 leaks', description: 'Strict context-managed session pooling' }
    ],
    features: [
      'Advanced compound indices and partial indices implementation.',
      'Double-entry compliance with ACID safety validations.',
      'Interactive query execution plan analyzer for frontend debugging.',
      'Vibrant charts tracking transaction frequency and DB load.'
    ],
    interactiveType: 'query-optimizer'
  },
  {
    id: 'schema-designer',
    title: 'SQL-to-FastAPI Model Architect',
    description: 'A full-stack visual schema builder allowing developers to map SQL tables and instantly generate valid FastAPI routes and Pydantic schemas.',
    longDescription: 'Designed a code-generation workspace showcasing full-stack capabilities. The frontend offers an interactive interface to build relational tables, define properties (integers, strings, constraints, primary keys), and immediately builds highly compliant, lint-clean FastAPI code ready to copy.',
    category: 'Full-Stack',
    techStack: ['React', 'TypeScript', 'Tailwind CSS', 'Pydantic CodeGen', 'Python AST'],
    role: 'Full-Stack Developer',
    metrics: [
      { label: 'Dev Bootstrapping', value: 'Instant', description: 'Reduces setup boilerplate time to seconds' },
      { label: 'Syntax Accuracy', value: '100%', description: 'Valid Pydantic v2 and FastAPI PEP8 compliance' },
      { label: 'Dynamic State', value: 'Zero lag', description: 'Reactive code generation as users edit tables' }
    ],
    features: [
      'Interactive React UI to add, delete, and modify model fields.',
      'Instant code output with syntax highlighting for Pydantic Models and CRUD endpoints.',
      'Flexible data types mapping standard SQL to Python typing.',
      'Copy-to-clipboard integration with visual toast confirmation.'
    ],
    interactiveType: 'schema-designer'
  }
];

export const apiPlaygroundEndpoints: ApiEndpoint[] = [
  {
    id: 'get-profile',
    method: 'GET',
    path: '/api/v1/developer/profile',
    summary: 'Retrieve Antony\'s Core Profile',
    description: 'Returns professional high-level metadata, summary of expertise, and contact information for the developer.',
    responseExample: {
      status: 'success',
      data: {
        name: 'Antony Gitau Kihara',
        role: 'Backend-Focused Full-Stack Software Engineer',
        location: 'Nairobi, Kenya',
        core_languages: ['Python', 'JavaScript', 'TypeScript', 'SQL'],
        primary_backend_framework: 'FastAPI',
        primary_frontend_framework: 'React',
        contact: {
          email: 'tgitau088@gmail.com',
          github: 'github.com/AntonyGitauKihara',
          linkedin: 'linkedin.com/in/antonygitaukihara'
        }
      }
    }
  },
  {
    id: 'post-contact',
    method: 'POST',
    path: '/api/v1/contact',
    summary: 'Submit Contact Message',
    description: 'Validates contact form contents via Pydantic model structures, stores them locally, and schedules an instant response.',
    parameters: [
      { name: 'name', type: 'string', required: true, description: 'Sender full name', defaultValue: 'Jane Doe' },
      { name: 'email', type: 'string', required: true, description: 'Valid sender email', defaultValue: 'jane@example.com' },
      { name: 'message', type: 'string', required: true, description: 'Inquiry details', defaultValue: 'Looking to build a FastAPI API integration!' }
    ],
    responseExample: {
      status: 'received',
      message: 'Thank you Jane Doe, your message has been processed successfully.',
      timestamp: '2026-07-21T03:41:15Z',
      pydantic_validation: 'Passed [No Errors]',
      payload_meta: {
        char_count: 52,
        email_domain: 'example.com'
      }
    }
  },
  {
    id: 'simulate-query',
    method: 'GET',
    path: '/api/v1/ledger/query',
    summary: 'Analyze Ledger SQL Cost',
    description: 'Simulates a FastAPI endpoint query execution with raw PG explain plan diagnostics.',
    parameters: [
      { name: 'optimization_level', type: 'string', required: true, description: 'unoptimized | optimized', defaultValue: 'optimized' }
    ],
    responseExample: {
      status: 'success',
      query_meta: {
        raw_sql: 'SELECT m.name, SUM(l.amount) FROM merchants m JOIN ledgers l ON m.id = l.merchant_id GROUP BY m.id;',
        index_used: 'idx_ledgers_merchant_id (Hash Join)',
        estimated_rows: 5120
      },
      execution_stats: {
        latency_ms: 1.82,
        unoptimized_latency_ms: 32.4,
        speedup: '17.8x'
      },
      payload: [
        { merchant: 'Apex Logistics', total_volume: 12450.50 },
        { merchant: 'Vertex Tech', total_volume: 8240.20 }
      ]
    }
  }
];
