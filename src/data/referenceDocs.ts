import { OfficialDocResource } from '../types/academy';

export const OFFICIAL_REFERENCE_DOCS: OfficialDocResource[] = [
  // ============================================================================
  // ANTHROPIC (CLAUDE, PROMPTING, MCP & AGENTS)
  // ============================================================================
  {
    id: 'doc-anthropic-prompt-guide',
    provider: 'Anthropic',
    title: 'Anthropic Prompt Engineering Guide (Official Documentation)',
    url: 'https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview',
    difficulty: 'Essential',
    estimatedReadTime: '45 mins',
    whyReadThis: 'The definitive first-party blueprint for structuring production Claude prompts: XML tagging hierarchy, multishot examples, Chain-of-Thought (`<thinking>`), role prompting, and quote-based hallucination mitigation.',
    qaToAiTakeaway: 'Learn how to turn ambiguous requirements into deterministic XML-delimited acceptance criteria that Claude follows with 99%+ consistency.',
    tags: ['XML Tags', 'Chain-of-Thought', 'Hallucination Control', 'System Prompts']
  },
  {
    id: 'doc-anthropic-academy',
    provider: 'Anthropic',
    title: 'Anthropic Academy (Official Skilljar Certification Courses)',
    url: 'https://anthropic.skilljar.com',
    difficulty: 'Essential',
    estimatedReadTime: '4–6 hrs (Self-Paced)',
    whyReadThis: 'Anthropic’s official interactive training portal offering structured courses and completion credentials on building with the Claude API, Prompt Engineering, Model Context Protocol (MCP), and enterprise deployment.',
    qaToAiTakeaway: 'Complete these official tracks alongside our Mock Exam to add verified Anthropic credentials directly to your LinkedIn profile and resume.',
    tags: ['Official Certification', 'Claude API', 'Enterprise AI', 'Career Credential']
  },
  {
    id: 'doc-anthropic-interactive-courses',
    provider: 'Anthropic',
    title: 'Anthropic Interactive Prompt Engineering & Tool Use Tutorials (GitHub)',
    url: 'https://github.com/anthropics/courses',
    difficulty: 'Intermediate',
    estimatedReadTime: '3 hrs',
    whyReadThis: 'Hands-on Jupyter notebooks authored by Anthropic’s Developer Relations & Applied AI teams covering real-world prompt engineering, evaluations, tool use (function calling), and prompt caching.',
    qaToAiTakeaway: 'Contains runnable evaluation notebooks showing how Anthropic engineers test prompts against edge-case datasets.',
    tags: ['Jupyter Notebooks', 'Tool Calling', 'Prompt Evals', 'Hands-On Code']
  },
  {
    id: 'doc-mcp-spec',
    provider: 'Anthropic',
    title: 'Model Context Protocol (MCP) Official Specification & SDKs',
    url: 'https://modelcontextprotocol.io',
    difficulty: 'Advanced Production',
    estimatedReadTime: '60 mins',
    whyReadThis: 'The official open specification for the Model Context Protocol—detailing the Host-Client-Server architecture, JSON-RPC 2.0 transport, Resources, Tools, Prompts, and security best practices.',
    qaToAiTakeaway: 'Essential reading for connecting AI agents to Playwright, GitHub, Jira, and PostgreSQL via standardized MCP servers.',
    tags: ['MCP', 'Agent Architecture', 'JSON-RPC', 'Tool Integration']
  },
  {
    id: 'doc-anthropic-effective-agents',
    provider: 'Anthropic',
    title: 'Anthropic Engineering Guide — Building Effective Agents',
    url: 'https://www.anthropic.com/engineering/building-effective-agents',
    difficulty: 'Advanced Production',
    estimatedReadTime: '30 mins',
    whyReadThis: 'One of the most cited engineering posts in modern AI: explains when to choose deterministic Workflows (Prompt Chaining, Routing, Parallelization, Orchestrator-Workers, Evaluator-Optimizer) vs. autonomous Agents.',
    qaToAiTakeaway: 'Memorize the 5 workflow patterns in this guide—they come up in almost every Senior AI Engineer system design interview!',
    tags: ['System Design', 'Workflows vs Agents', 'Evaluator-Optimizer', 'Guardrails']
  },

  // ============================================================================
  // GOOGLE CLOUD & GEMINI ECOSYSTEM
  // ============================================================================
  {
    id: 'doc-google-skills-boost',
    provider: 'Google Cloud & Gemini',
    title: 'Google Cloud Skills Boost — Generative AI & Vertex AI Learning Path',
    url: 'https://www.cloudskillsboost.google/paths/118',
    difficulty: 'Essential',
    estimatedReadTime: '6–8 hrs (Self-Paced)',
    whyReadThis: 'Google Cloud’s official guided certification path with hands-on Qwiklabs sandboxes covering Foundation Models, Prompt Design in Vertex AI, Multimodal Gemini, and Responsible AI.',
    qaToAiTakeaway: 'Earns official Google Cloud Skill Badges validating enterprise Vertex AI proficiency for your portfolio.',
    tags: ['Google Cloud Certification', 'Vertex AI', 'Hands-On Labs', 'Skill Badges']
  },
  {
    id: 'doc-gemini-api-docs',
    provider: 'Google Cloud & Gemini',
    title: 'Google Gemini API Official Docs & Multimodal Prompt Design',
    url: 'https://ai.google.dev/gemini-api/docs',
    difficulty: 'Essential',
    estimatedReadTime: '45 mins',
    whyReadThis: 'Comprehensive developer documentation for the `@google/genai` SDK, covering native multimodal inputs (Video, Audio, PDF, Images), Structured Outputs (`responseSchema`), Context Caching, Function Calling, and Live API.',
    qaToAiTakeaway: 'Shows how to enforce 100% schema-valid JSON via Constrained Decoding (`responseSchema`) and process native PDF tables/videos.',
    tags: ['Gemini SDK', 'Multimodal', 'Structured Outputs', 'Context Caching']
  },
  {
    id: 'doc-vertex-ai-genai',
    provider: 'Google Cloud & Gemini',
    title: 'Vertex AI Generative AI Enterprise Documentation',
    url: 'https://cloud.google.com/vertex-ai/generative-ai/docs',
    difficulty: 'Advanced Production',
    estimatedReadTime: '60 mins',
    whyReadThis: 'Enterprise cloud reference covering Vertex AI Search Grounding, Google Search Grounding, Vertex AI GenAI Evaluation Service, Safety Filters, IAM security, VPC-SC, and Model Garden.',
    qaToAiTakeaway: 'Focus on the "GenAI Evaluation Service" and "Grounding" sections to master enterprise verification and compliance.',
    tags: ['Vertex AI', 'Search Grounding', 'GenAI Eval Service', 'Enterprise Security']
  },

  // ============================================================================
  // OPENAI & INDUSTRY EVALUATION STANDARDS
  // ============================================================================
  {
    id: 'doc-openai-cookbook',
    provider: 'OpenAI & Industry Evaluation Standards',
    title: 'OpenAI Cookbook (Production RAG, Automated Evals & Guardrails)',
    url: 'https://cookbook.openai.com',
    difficulty: 'Intermediate',
    estimatedReadTime: '60 mins',
    whyReadThis: 'A treasure trove of production-tested recipes and architecture patterns covering Hybrid RAG, LLM-as-a-Judge calibration, latency optimization, voice agents, and asynchronous guardrails.',
    qaToAiTakeaway: 'Study the recipes on "Evaluating RAG Systems" and "How to implement LLM Guardrails" for production code patterns.',
    tags: ['Production Recipes', 'RAG Patterns', 'Guardrails', 'Latency Optimization']
  },
  {
    id: 'doc-openai-prompt-structured',
    provider: 'OpenAI & Industry Evaluation Standards',
    title: 'OpenAI Prompt Engineering & Structured Outputs Guide',
    url: 'https://platform.openai.com/docs/guides/prompt-engineering',
    difficulty: 'Essential',
    estimatedReadTime: '35 mins',
    whyReadThis: 'Covers tactical prompt engineering principles, instruction hierarchy, reasoning model prompting best practices, and strict JSON Schema Constrained Decoding (`strict: true`).',
    qaToAiTakeaway: 'Demonstrates how deterministic JSON Schema enforcement eliminates brittle regex post-processing.',
    tags: ['Structured Outputs', 'JSON Schema', 'Instruction Hierarchy', 'Reasoning']
  },
  {
    id: 'doc-owasp-llm-top-10',
    provider: 'OpenAI & Industry Evaluation Standards',
    title: 'OWASP Top 10 for Large Language Model Applications (AI Security & Red Teaming)',
    url: 'https://genai.owasp.org',
    difficulty: 'Essential',
    estimatedReadTime: '50 mins',
    whyReadThis: 'The global cybersecurity standard for AI applications—defining LLM01 (Prompt Injection), LLM02 (Sensitive Information Disclosure), LLM06 (Excessive Agency), and concrete mitigation checklists.',
    qaToAiTakeaway: 'Your ultimate bible for AI Security Testing & Red Teaming! Referencing OWASP LLM01 and LLM06 in interviews sets you apart immediately.',
    tags: ['OWASP LLM Top 10', 'Red Teaming', 'Prompt Injection', 'AI Security']
  },
  {
    id: 'doc-ragas-framework',
    provider: 'OpenAI & Industry Evaluation Standards',
    title: 'Ragas Documentation — Reference-Free & Reference-Based RAG Evaluation',
    url: 'https://docs.ragas.io',
    difficulty: 'Advanced Production',
    estimatedReadTime: '45 mins',
    whyReadThis: 'Official documentation for the Ragas evaluation framework—detailing the mathematical formulas and prompts behind Faithfulness, Answer Relevance, Context Precision, Context Recall, and Synthetic Testset Generation.',
    qaToAiTakeaway: 'Master how Ragas decomposes answers into atomic claims to compute `Faithfulness = Supported Claims / Total Claims`.',
    tags: ['Ragas', 'RAG Triad', 'Faithfulness', 'Synthetic Test Data']
  },
  {
    id: 'doc-deepeval-framework',
    provider: 'OpenAI & Industry Evaluation Standards',
    title: 'DeepEval (Confident AI) — Pytest-Style Unit Testing & Red Teaming for LLMs',
    url: 'https://docs.confident-ai.com',
    difficulty: 'Advanced Production',
    estimatedReadTime: '45 mins',
    whyReadThis: 'The open-source LLM evaluation framework built specifically like Pytest (`assert_test`)—supporting G-Eval custom rubrics, RAG Triad metrics, agent tool-calling trajectory assertions, and automated OWASP vulnerability scanning.',
    qaToAiTakeaway: 'If you know Pytest, Playwright, or Jest, DeepEval feels right at home—it turns probabilistic LLM checks into clean CI/CD unit tests.',
    tags: ['DeepEval', 'G-Eval', 'CI/CD Pytest for AI', 'Automated Red Teaming']
  }
];
