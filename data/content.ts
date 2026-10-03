// All editable copy lives here. Search for "EDIT" to find placeholders.
export const profile = {
  name: 'Doni Vishwa Vardhan',
  short: 'Vishwa',
  roles: ['AI/ML Engineer', 'RAG Builder', 'Program Manager', 'Film Story Writer'],
  tagline: 'Engineer by training. Product mind by practice. Building AI that actually ships.', // EDIT
  about:
    'I started in biochemical engineering at IIT Delhi and learned to think in systems. Then I moved into program management and shipped a real RAG agent into production. Now I am going deep on AI/ML engineering. I play volleyballs and deploy models; both need good timing.', // EDIT
  email: 'vishwavardhan33@gmail.com', // EDIT: add email
  github: 'https://github.com/vishwavardhan33-arch',
  linkedin: 'https://www.linkedin.com/in/vishwa-vardhan-doni-592bb638a/',
  resume: '/resume.pdf', // EDIT: put PDF in /public
  photo: '/images/vishwa.jpg', // EDIT: add photo
  logline: 'You are not your job title.\
You are not your CGPA, or your LinkedIn headline, or the sprint velocity on a slide nobody reads.\
You are the weights you update after every failure.\
Most things ship broken. The good ones get fine-tuned.', // EDIT: your own logline
};

export const clusters = {
  genai: { label: 'GenAI & LLMs', color: '#22d3ee', pos: [-6, 2, -8] },
  ml: { label: 'ML / Deep Learning', color: '#8b5cf6', pos: [6, -2, -16] },
  mlops: { label: 'MLOps & Cloud', color: '#f59e0b', pos: [-5, -3, -24] },
  product: { label: 'Product & Program Mgmt', color: '#34d399', pos: [5, 3, -32] },
  life: { label: 'Life & Hobbies', color: '#f472b6', pos: [0, 0, -40] },
} as const;
export type ClusterKey = keyof typeof clusters;
export interface GNode { id: string; cluster: ClusterKey; size: number; detail?: string }

const s = (cluster: ClusterKey, names: string[], size = 0.3): GNode[] =>
  names.map((id) => ({ id, cluster, size }));

export const projects = [
  {
    id: 'Support Triage Agent', stack: ['MCP', 'FastAPI', 'Ollama', 'Llama 3.2', 'TF-IDF', 'pytest', 'GitHub Actions'],
    blurb: 'MCP server exposing ticket triage as tools (list, retrieve, update, classify), with a FastAPI backend and browser dashboard on the same tools. Fully local classification via Ollama, grounded by TF-IDF retrieval of similar past tickets. Zero external API cost.',
    result: '23 pytest tests, CI, custom eval harness: 100% routing accuracy, 4.4/5 LLM-as-judge quality.',
    flow: ['Ticket', 'MCP tools', 'Retrieve similar', 'Ollama classify', 'Dashboard'], github: 'https://github.com/vishwavardhan33-arch/Support-Triage-MCP-Server'
  },
  {
    id: 'Financial Intelligence Agent', stack: ['LangGraph', 'Qdrant', 'BM25', 'Ollama', 'PostgreSQL', 'sqlglot', 'FastAPI', 'Docker'],
    blurb: 'RAG research agent over annual reports. Hybrid dense+BM25 retrieval, plan-then-execute orchestration, text-to-SQL validated by sqlglot and run read-only, financial calculation tools, all served via FastAPI.',
    result: 'LLM-as-judge eval on correctness, groundedness and routing. Dockerized.',
    flow: ['Question', 'Planner', 'Tools: RAG / SQL / calc', 'Executor', 'Answer'], github: 'https://github.com/vishwavardhan33-arch/Financial-Intelligence-Agent'
  },
  {
    id: 'HR Policy QLoRA', stack: ['Qwen2.5-1.5B', 'QLoRA', 'PEFT', 'TRL', 'bitsandbytes'],
    blurb: 'Qwen2.5-1.5B-Instruct fine-tuned with QLoRA (4-bit NF4 + LoRA adapters) on a company HR policy dataset.',
    result: 'BERTScore 0.88 on a held-out set.', flow: ['HR dataset', '4-bit NF4 base', 'LoRA adapters', 'Eval'], github: 'https://github.com/vishwavardhan33-arch/HR_QA_QLoRA_Finetune'
  },
  {
    id: 'Agent Support RAG Agent', stack: ['RAG', 'CleverTap', 'Figma', 'Production'],
    blurb: 'At Basic Enterprises: designed, built and deployed a RAG agent for call-center operations, from prototype to internal production. Also shipped Agent Flash, an Invoice Rejection Tracker and Agent Retention Strategies.',
    result: 'Roadmap prioritised from CleverTap drop-off analysis.', flow: ['Figma', 'Prototype', 'RAG agent', 'Production'], github: ''
  },
];

export const nodes: GNode[] = [
  ...s('ml', ['Python', 'SQL', 'Java', 'JavaScript', 'Dart', 'Scikit-learn', 'PyTorch', 'TensorFlow', 'Keras', 'XGBoost', 'Hugging Face']),
  ...s('genai', ['LangChain', 'LangGraph', 'RAG pipelines', 'Prompt Engineering', 'Chroma', 'FAISS', 'Qdrant', 'Ollama', 'LoRA / QLoRA', 'Llama Guard', 'LiteLLM', 'MCP']),
  ...s('mlops', ['FastAPI', 'Docker', 'Kubernetes', 'MLflow', 'Azure ML', 'SageMaker', 'Vertex AI', 'GitHub Actions', 'Databricks', 'React', 'Next.js', 'Vercel', 'Azure', 'AWS', 'GCP']),
  ...s('product', ['Program Management', 'CleverTap', 'Figma', 'Roadmapping']),
  ...s('life', ['Volleyball', 'Cricket', 'Travel', 'Film Writing']),
  ...projects.map((p, i): GNode => ({ id: p.id, cluster: (['genai', 'genai', 'genai', 'product'] as ClusterKey[])[i], size: 0.8, detail: p.blurb })),
];
nodes.forEach((n) => { if (['Python', 'LangGraph', 'Docker', 'Program Management'].includes(n.id)) n.size = 0.5; });
export const crossLinks: [string, string][] = [
  ['Support Triage Agent', 'MCP'], ['Support Triage Agent', 'Ollama'], ['Support Triage Agent', 'FastAPI'], ['Support Triage Agent', 'GitHub Actions'],
  ['Financial Intelligence Agent', 'LangGraph'], ['Financial Intelligence Agent', 'Qdrant'], ['Financial Intelligence Agent', 'Docker'],
  ['HR Policy QLoRA', 'LoRA / QLoRA'], ['HR Policy QLoRA', 'PyTorch'], ['HR Policy QLoRA', 'Hugging Face'],
  ['Agent Support RAG Agent', 'RAG pipelines'], ['Agent Support RAG Agent', 'CleverTap'], ['Agent Support RAG Agent', 'Figma'],
  ['Python', 'LangChain'], ['Volleyball', 'Program Management'],
];

export const experience = [
  {
    when: 'Jun 2026 – present', title: 'Management Trainee, Program Manager', org: 'Basic Enterprises',
    points: ['Designed, built and deployed a RAG AI agent for Agent Support / Call Center operations, prototype to internal production.', 'Led product development from Figma wireframes to delivery.', 'Used CleverTap analytics to find user drop-offs and prioritise the roadmap.']
  },
  { when: 'Graduating 2026', title: 'B.Tech, Biochemical Engineering & Biotechnology', org: 'IIT Delhi', points: ['Systems thinking, data and a lot of late-night debugging.'] },
];

export const beyond = [
  { id: 'Volleyball', text: 'I play volleyballs and deploy models; both need good timing.' },
  { id: 'Cricket', text: 'Long innings, small iterations. Basically gradient descent with a bat.' },
  { id: 'Travel', text: 'New places are the best out-of-distribution test set.' }, // EDIT: add photos in /public/images
  { id: 'Film Writing', text: 'Hallucinating professionally since forever.' },
];
