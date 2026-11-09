export interface GlobalAiModel {
  id: string;
  name: string;
  versionLabel: string;
  provider: string;
  country: string;
  countryFlag: string;
  headquarters: string;
  releaseTimestampMs: number;
  contextWindowTokens: number;
  promptPricePerMillion: string;
  completionPricePerMillion: string;
  licenseType: 'Proprietary API' | 'Open-Weights';
  modalities: string[];
  categoryBadge: 'Frontier Reasoning' | 'Multimodal Flagship' | 'Coding & Agents' | 'Open-Weights Leader' | 'Fast & Cost-Efficient' | 'Sovereign / Regional AI';
  pros: string[];
  cons: string[];
  qaEngineerVerdict: string;
  officialUrl: string;
  isLiveDiscovered?: boolean;
}

const SEEN_MODELS_STORAGE_KEY = 'ai_engineer_academy_seen_models_v1';

interface ProviderCountryMeta {
  provider: string;
  country: string;
  countryFlag: string;
  headquarters: string;
  licenseType: 'Proprietary API' | 'Open-Weights';
  officialUrl: string;
  defaultPros: string[];
  defaultCons: string[];
}

const PROVIDER_COUNTRY_MAP: Record<string, ProviderCountryMeta> = {
  anthropic: {
    provider: 'Anthropic',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    licenseType: 'Proprietary API',
    officialUrl: 'https://docs.anthropic.com',
    defaultPros: [
      'Industry-leading instruction adherence on XML-structured prompts and complex multi-step agentic tool calling',
      'First-party creator of Model Context Protocol (MCP), Claude Code, and Computer Use',
      'Low hallucination rate and strong constitutional safety alignment for enterprise QA workflows'
    ],
    defaultCons: [
      'Higher per-token API cost compared to open-weights Chinese or smaller distilled models',
      'Proprietary weights—cannot be self-hosted on air-gapped on-premise servers',
      'Strict rate limits on lower API usage tiers without prompt caching enabled'
    ]
  },
  google: {
    provider: 'Google DeepMind',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Mountain View / London (US/UK)',
    licenseType: 'Proprietary API',
    officialUrl: 'https://ai.google.dev/gemini-api/docs',
    defaultPros: [
      'Massive 1M–2M native multimodal context window (text, code, audio, video, PDFs in a single prompt)',
      'First-party Grounding with Google Search and enterprise Vertex AI governance',
      'Context caching and Flash-tier variants deliver exceptional price-to-performance at scale'
    ],
    defaultCons: [
      'Very large context prompts (>500K tokens) still require careful prompt structure to avoid attention dilution',
      'Proprietary flagship Gemini models require Google AI Studio or Vertex AI cloud endpoints',
      'Safety filter thresholds need explicit configuration for security red-teaming workloads'
    ]
  },
  openai: {
    provider: 'OpenAI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    licenseType: 'Proprietary API',
    officialUrl: 'https://platform.openai.com/docs/models',
    defaultPros: [
      'Strict JSON Schema Constrained Decoding (`strict: true`) guarantees 100% syntactically valid JSON outputs',
      'Strong reasoning (`o-series`) and multimodal realtime voice/vision ecosystem',
      'Broadest third-party SDK, evaluation framework (Ragas/DeepEval), and tooling support'
    ],
    defaultCons: [
      'Reasoning models (`o1`/`o3`/`o4`) consume hidden thinking tokens that increase latency and billable output cost',
      'Closed-source proprietary frontier weights (except `gpt-oss` variants)',
      'Prompt behavior can shift across dated snapshot deprecations if model versions are not pinned'
    ]
  },
  deepseek: {
    provider: 'DeepSeek AI',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    licenseType: 'Open-Weights',
    officialUrl: 'https://www.deepseek.com',
    defaultPros: [
      'Frontier-grade math, code, and Chain-of-Thought reasoning (`DeepSeek-R1` / `V3`) at ~85–90% lower API cost',
      'Open-weights (MIT license) allow full self-hosting on AWS, GCP, Azure, or private VPCs for data privacy',
      'Transparent visible `<think>` reasoning traces ideal for debugging model logic in QA evals'
    ],
    defaultCons: [
      'Direct first-party API hosted in China raises enterprise data residency concerns (most Western enterprises host via US cloud providers like Together/Fireworks/Bedrock)',
      'Full 671B MoE parameter model requires high-end multi-GPU clusters to self-host without quantization',
      'Primarily optimized for text and code rather than native audio/video ingestion'
    ]
  },
  qwen: {
    provider: 'Alibaba Cloud (Qwen)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    licenseType: 'Open-Weights',
    officialUrl: 'https://qwenlm.github.io',
    defaultPros: [
      'Top-performing open-weights ecosystem (`Qwen3` / `Qwen2.5-Coder` / `QwQ`) across sizes from 0.6B to 235B MoE',
      'Hybrid thinking mode lets developers toggle reasoning budget dynamically per request',
      'Strong multilingual, coding, and tool-calling accuracy; Apache 2.0 license for most weights'
    ],
    defaultCons: [
      'Self-hosting larger MoE variants requires vLLM/SGLang infrastructure expertise',
      'First-party DashScope cloud requires compliance review for US/EU regulated PII workloads',
      'Many sub-variants (Instruct, Coder, VL, Math) require careful model selection'
    ]
  },
  'meta-llama': {
    provider: 'Meta AI (Llama)',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Menlo Park, USA',
    licenseType: 'Open-Weights',
    officialUrl: 'https://www.llama.com',
    defaultPros: [
      'Standard US open-weights foundation (`Llama 4` / `Llama 3.3`) supported by every cloud and local runtime (Ollama, vLLM, Bedrock, Vertex)',
      'Zero per-token vendor lock-in when self-hosted inside enterprise VPCs',
      'Massive fine-tuning (LoRA/QLoRA) and community adapter ecosystem'
    ],
    defaultCons: [
      'Custom Llama Community License has specific commercial terms for platforms with >700M monthly users',
      'Raw reasoning and coding benchmarks trail closed frontier models (Claude/GPT/Gemini) without fine-tuning',
      'Requires external guardrails (e.g., Llama Guard) when deployed directly'
    ]
  },
  mistralai: {
    provider: 'Mistral AI',
    country: 'France',
    countryFlag: '🇫🇷',
    headquarters: 'Paris, France',
    licenseType: 'Open-Weights',
    officialUrl: 'https://docs.mistral.ai',
    defaultPros: [
      'Leading European AI lab with strong EU GDPR compliance and data sovereignty options',
      'Specialized high-speed models for code (`Codestral`), vision (`Pixtral`), and edge (`Ministral`)',
      'Excellent token efficiency and low-latency function calling'
    ],
    defaultCons: [
      'Smaller context windows on some specialized variants compared to Gemini’s 1M+ window',
      'Split licensing (some models are Apache 2.0 open-weights while flagship tiers use Mistral Research/Commercial licenses)',
      'Smaller third-party plugin ecosystem than OpenAI or Anthropic'
    ]
  },
  'x-ai': {
    provider: 'xAI (Grok)',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Palo Alto / Austin, USA',
    licenseType: 'Proprietary API',
    officialUrl: 'https://docs.x.ai',
    defaultPros: [
      'Strong competitive performance on STEM, coding, and real-time reasoning benchmarks (`Grok 3` / `Grok 4`)',
      'Fast token generation speed and large context support',
      'OpenAI-compatible REST SDK makes drop-in migration effortless'
    ],
    defaultCons: [
      'Fewer enterprise compliance certifications and managed cloud integrations than Vertex AI or AWS Bedrock',
      'Proprietary weights on frontier Grok releases',
      'Permissive safety defaults require stricter application-layer output guardrails in enterprise apps'
    ]
  },
  cohere: {
    provider: 'Cohere',
    country: 'Canada',
    countryFlag: '🇨🇦',
    headquarters: 'Toronto, Canada',
    licenseType: 'Proprietary API',
    officialUrl: 'https://docs.cohere.com',
    defaultPros: [
      'Built specifically for enterprise RAG (`Command A` / `Command R+`) with native inline source citations',
      'Industry-standard Cross-Encoder Reranker (`Rerank 3.5`) and multilingual embeddings',
      'Private VPC and on-prem deployment partnerships across Oracle, AWS, and Azure'
    ],
    defaultCons: [
      'Less focused on consumer multimodal tasks (audio/video generation) compared to Gemini or OpenAI',
      'Non-commercial CC-BY-NC license on open-weights research releases requires commercial licensing for production',
      'Smaller developer mindshare for general consumer chatbots'
    ]
  },
  moonshotai: {
    provider: 'Moonshot AI (Kimi)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    licenseType: 'Open-Weights',
    officialUrl: 'https://kimi.moonshot.cn',
    defaultPros: [
      'Pioneered ultra-long context retrieval and 1T-parameter MoE agentic coding (`Kimi K2`)',
      'Exceptional performance on autonomous tool use, SWE-bench coding, and long-document synthesis',
      'Open-weights availability on recent K2 releases enables third-party cloud hosting'
    ],
    defaultCons: [
      'Massive memory footprint makes local self-hosting impractical without multi-node H100/H200 clusters',
      'Direct API subject to cross-border data governance policies for Western regulated industries',
      'Smaller English documentation ecosystem compared to US providers'
    ]
  },
  minimax: {
    provider: 'MiniMax',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Shanghai, China',
    licenseType: 'Open-Weights',
    officialUrl: 'https://www.minimaxi.com',
    defaultPros: [
      'Innovative Lightning Attention architecture supports up to 4M token context windows (`MiniMax-M1` / `Text-01`)',
      'Linear-complexity attention drastically reduces KV-cache memory spikes on massive documents',
      'Strong multimodal and voice synthesis ecosystem'
    ],
    defaultCons: [
      'Non-standard hybrid attention architecture has fewer off-the-shelf quantization integrations',
      'Requires enterprise compliance review when calling hosted endpoints from outside Asia',
      'Fewer native evaluation templates in Western LLM ops tools'
    ]
  },
  thudm: {
    provider: 'Zhipu AI (GLM)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    licenseType: 'Open-Weights',
    officialUrl: 'https://open.bigmodel.cn',
    defaultPros: [
      'Strong bilingual (English/Chinese) agentic tool use and browser/GUI automation (`GLM-4.5` / `ChatGLM`)',
      'Cost-effective open-weights models widely supported in vLLM and Hugging Face',
      'Built-in function calling and code interpreter capabilities'
    ],
    defaultCons: [
      'English creative writing nuances slightly trail Claude and GPT frontier models',
      'Enterprise compliance restrictions apply for US/EU government workloads',
      'Documentation is partially Chinese-first'
    ]
  },
  microsoft: {
    provider: 'Microsoft Research (Phi)',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Redmond, USA',
    licenseType: 'Open-Weights',
    officialUrl: 'https://azure.microsoft.com/en-us/products/phi',
    defaultPros: [
      'Ultra-compact Small Language Models (`Phi-4` 14B / Mini) trained on textbook-grade synthetic data',
      'Runs on a single consumer GPU, laptop NPU, or browser WebGPU with minimal latency',
      'MIT open-source license ideal for specialized fine-tuning and edge/on-device deployment'
    ],
    defaultCons: [
      'Small parameter count means limited world factual knowledge—must be paired with RAG for domain facts',
      'Not designed for massive multi-document synthesis compared to 1M-context frontier models',
      'Higher hallucination risk on obscure trivia if used without retrieval grounding'
    ]
  },
  nvidia: {
    provider: 'NVIDIA (Nemotron)',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Santa Clara, USA',
    licenseType: 'Open-Weights',
    officialUrl: 'https://build.nvidia.com',
    defaultPros: [
      'Hardware-aware NAS optimization (`Llama-Nemotron`) delivers 2–3x higher throughput on NVIDIA GPUs',
      'State-of-the-art reward models and synthetic data judges for LLM-as-a-Judge pipelines',
      'Enterprise-ready NIM container deployment'
    ],
    defaultCons: [
      'Optimized primarily for NVIDIA TensorRT-LLM / NIM software stacks',
      'Primarily text/reasoning focused rather than native audio/video',
      'Requires GPU infrastructure management if self-hosted'
    ]
  }
};

export const CURATED_GLOBAL_MODELS: GlobalAiModel[] = [
  {
    id: 'anthropic/claude-opus-4-6',
    name: 'Claude Opus 4.6 / Sonnet 4.6',
    versionLabel: 'v4.6 (Latest Frontier)',
    provider: 'Anthropic',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    releaseTimestampMs: Date.now() - 2 * 24 * 3600 * 1000,
    contextWindowTokens: 200000,
    promptPricePerMillion: '$3.00',
    completionPricePerMillion: '$15.00',
    licenseType: 'Proprietary API',
    modalities: ['Text', 'Code', 'Vision', 'PDF', 'Extended Thinking'],
    categoryBadge: 'Coding & Agents',
    pros: [
      'Gold standard for autonomous coding (`Claude Code`), SWE-bench software engineering, and multi-step MCP agents',
      'Extended Thinking mode lets you allocate explicit reasoning token budgets (`budget_tokens`) for hard architecture tasks',
      'Best-in-class adherence to XML-tagged system instructions (`<rules>`, `<context>`) and low hallucination rates'
    ],
    cons: [
      'Higher token cost than Gemini Flash or DeepSeek—requires KV Prompt Caching (`cache_control`) in production',
      'Closed-source proprietary model (available via Anthropic API, AWS Bedrock, and Google Vertex AI)',
      '200K–1M context ceiling is smaller than Gemini 2.5 Pro’s 2M native window'
    ],
    qaEngineerVerdict:
      'Use as your primary model for complex agentic coding, MCP tool orchestration, and high-precision LLM-as-a-Judge grading rubrics.',
    officialUrl: 'https://docs.anthropic.com/en/docs/about-claude/models/overview'
  },
  {
    id: 'google/gemini-2.5-pro',
    name: 'Gemini 2.5 Pro & 2.5 Flash',
    versionLabel: 'v2.5 (Latest GA)',
    provider: 'Google DeepMind',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Mountain View, USA / London, UK',
    releaseTimestampMs: Date.now() - 3 * 24 * 3600 * 1000,
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$1.25 ($0.15 Flash)',
    completionPricePerMillion: '$10.00 ($0.60 Flash)',
    licenseType: 'Proprietary API',
    modalities: ['Text', 'Audio', 'Video', 'Images', 'Code', 'PDF'],
    categoryBadge: 'Multimodal Flagship',
    pros: [
      '1M to 2M token native multimodal context window—ingest entire codebases, 1-hour videos, or 1,000-page PDFs natively',
      'Built-in Grounding with Google Search returns verifiable source URLs and reduces factual hallucinations',
      'Gemini 2.5 Flash offers configurable `thinkingBudget` with ultra-low latency and industry-leading cost efficiency'
    ],
    cons: [
      'Long prompts (>250K tokens) increase Time-To-First-Token (TTFT) unless Context Caching is enabled',
      'Closed weights (for open-weights from Google, use `Gemma 3` 27B)',
      'Strict enterprise Vertex AI IAM setup required for regulated production environments'
    ],
    qaEngineerVerdict:
      'Unbeatable for multimodal QA (analyzing UI screen recordings, PDFs, audio logs) and high-volume production RAG pipelines.',
    officialUrl: 'https://ai.google.dev/gemini-api/docs/models'
  },
  {
    id: 'openai/o3-and-gpt-4.1',
    name: 'OpenAI o3 / o4-mini & GPT-4.1',
    versionLabel: 'o3 / GPT-4.1 Series',
    provider: 'OpenAI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    releaseTimestampMs: Date.now() - 4 * 24 * 3600 * 1000,
    contextWindowTokens: 1000000,
    promptPricePerMillion: '$2.00',
    completionPricePerMillion: '$8.00',
    licenseType: 'Proprietary API',
    modalities: ['Text', 'Vision', 'Audio', 'Structured JSON'],
    categoryBadge: 'Frontier Reasoning',
    pros: [
      'Guaranteed 100% schema adherence via Structured Outputs (`response_format: { type: "json_schema", strict: true }`)',
      '`o3` and `o4-mini` excel at mathematical verification, formal logic, and multi-hop tool reasoning',
      '`GPT-4.1` supports 1M context tokens with improved needle-in-a-haystack recall'
    ],
    cons: [
      'Reasoning models (`o3`/`o4-mini`) bill for internal reasoning tokens even though raw chain-of-thought is summarized',
      'Proprietary cloud-only API (cannot self-host on private air-gapped hardware)',
      'Higher latency on deep reasoning tasks makes `o3` unsuitable for sub-second autocomplete'
    ],
    qaEngineerVerdict:
      'Best choice when your pipeline requires strict schema-enforced JSON extraction or automated test-case generation.',
    officialUrl: 'https://platform.openai.com/docs/models'
  },
  {
    id: 'deepseek/deepseek-r1-0528',
    name: 'DeepSeek-R1 & DeepSeek-V3 (0324/0528)',
    versionLabel: 'R1-0528 / V3-0324',
    provider: 'DeepSeek AI',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    releaseTimestampMs: Date.now() - 5 * 24 * 3600 * 1000,
    contextWindowTokens: 128000,
    promptPricePerMillion: '$0.55',
    completionPricePerMillion: '$2.19',
    licenseType: 'Open-Weights',
    modalities: ['Text', 'Code', 'Visible <think> CoT'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Matches frontier US reasoning models on math, logic, and coding at ~1/10th the token price',
      '100% Open-Weights under the permissive MIT License—can be self-hosted on US/EU/India cloud GPUs',
      'Exposes full unfiltered `<think>...</think>` reasoning trace so QA engineers can audit exact failure steps'
    ],
    cons: [
      'Calling DeepSeek’s direct Chinese API endpoint is blocked by many Western enterprise compliance policies (use AWS Bedrock, Azure, Together AI, or self-hosted vLLM instead)',
      'Verbose thinking traces increase total response time on simple queries',
      'Text-only architecture (no native audio or video input)'
    ],
    qaEngineerVerdict:
      'Ideal when you need transparent reasoning traces (`<think>`) or want to self-host a frontier reasoning model inside your own VPC.',
    officialUrl: 'https://github.com/deepseek-ai/DeepSeek-R1'
  },
  {
    id: 'qwen/qwen3-235b-a22b',
    name: 'Qwen3-235B-A22B & Qwen2.5-Coder-32B',
    versionLabel: 'Qwen3 Flagship MoE',
    provider: 'Alibaba Cloud (Qwen)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    releaseTimestampMs: Date.now() - 6 * 24 * 3600 * 1000,
    contextWindowTokens: 131072,
    promptPricePerMillion: '$0.20',
    completionPricePerMillion: '$0.60',
    licenseType: 'Open-Weights',
    modalities: ['Text', 'Code', 'Hybrid Thinking', '119 Languages'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Mixture-of-Experts (235B total, only 22B active per token) delivers massive intelligence with fast inference speed',
      'Supports dynamic `/think` and `/no_think` switching in the same model for hybrid latency control',
      'Apache 2.0 open-weights license across sizes (0.6B, 4B, 8B, 14B, 32B, 235B) for easy local Ollama or cloud deployment'
    ],
    cons: [
      'Requires careful quantization (FP8/AWQ) and high VRAM to self-host the largest 235B MoE variant',
      'Direct Alibaba Cloud endpoints require data-residency evaluation for non-Asian enterprises',
      'Smaller native context window (128K) than Gemini or Llama 4 Scout'
    ],
    qaEngineerVerdict:
      'Top recommendation for local/self-hosted coding assistants (`Qwen2.5-Coder-32B`) and cost-effective multilingual eval pipelines.',
    officialUrl: 'https://qwenlm.github.io'
  },
  {
    id: 'meta-llama/llama-4-maverick',
    name: 'Llama 4 Maverick & Llama 4 Scout',
    versionLabel: 'Llama 4 MoE',
    provider: 'Meta AI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Menlo Park, USA',
    releaseTimestampMs: Date.now() - 7 * 24 * 3600 * 1000,
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.19',
    completionPricePerMillion: '$0.49',
    licenseType: 'Open-Weights',
    modalities: ['Text', 'Images', 'Code', 'Multilingual'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Native Mixture-of-Experts multimodal architecture with ultra-long context support (`Llama 4 Scout` up to 10M tokens)',
      'Available on every major cloud (AWS Bedrock, Google Vertex, Azure, Groq, Cerebras) at ultra-low cost',
      'Strong US-origin open-weights governance for regulated enterprises'
    ],
    cons: [
      'Llama Community License includes geographic/regulatory restrictions (e.g., certain EU multimodal clauses)',
      'Complex agentic coding accuracy still trails Claude Sonnet/Opus 4.6 without fine-tuning',
      '10M context window requires specialized inference hardware to achieve advertised recall'
    ],
    qaEngineerVerdict:
      'Best US open-weights workhorse for high-throughput enterprise RAG, classification, and fine-tuning.',
    officialUrl: 'https://www.llama.com'
  },
  {
    id: 'mistralai/mistral-large-2411',
    name: 'Mistral Large 2.1, Magistral & Codestral',
    versionLabel: '2411 / Magistral',
    provider: 'Mistral AI',
    country: 'France',
    countryFlag: '🇫🇷',
    headquarters: 'Paris, France',
    releaseTimestampMs: Date.now() - 8 * 24 * 3600 * 1000,
    contextWindowTokens: 128000,
    promptPricePerMillion: '$2.00 ($0.30 Codestral)',
    completionPricePerMillion: '$6.00 ($0.90 Codestral)',
    licenseType: 'Proprietary API',
    modalities: ['Text', 'Code', 'Vision (Pixtral)', 'Function Calling'],
    categoryBadge: 'Sovereign / Regional AI',
    pros: [
      'Flagship European AI lab offering strict EU GDPR compliance and European data residency',
      '`Codestral` is one of the fastest Fill-in-the-Middle (FIM) code completion models for IDE plugins',
      'Strong multilingual fluency across French, German, Spanish, Italian, and Dutch'
    ],
    cons: [
      '128K context window is smaller than US counterparts (Gemini 1M–2M, GPT-4.1 1M)',
      'Fewer built-in platform tools (like Google Search grounding or Anthropic Computer Use)',
      'Flagship Mistral Large weights use a restrictive non-production research license unless licensed commercially'
    ],
    qaEngineerVerdict:
      'Essential when building for European clients requiring strict EU GDPR data sovereignty or low-latency IDE code completion.',
    officialUrl: 'https://docs.mistral.ai'
  },
  {
    id: 'moonshotai/kimi-k2',
    name: 'Kimi K2 & Kimi k1.5 (1T MoE)',
    versionLabel: 'Kimi K2 (Latest)',
    provider: 'Moonshot AI',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    releaseTimestampMs: Date.now() - 9 * 24 * 3600 * 1000,
    contextWindowTokens: 131072,
    promptPricePerMillion: '$0.60',
    completionPricePerMillion: '$2.50',
    licenseType: 'Open-Weights',
    modalities: ['Text', 'Code', 'Agentic Tool Use'],
    categoryBadge: 'Coding & Agents',
    pros: [
      '1-Trillion parameter MoE (32B active) trained specifically with MuonClip optimizer for autonomous agent tool calling',
      'Top-tier open-weights performance on SWE-bench Verified and multi-step terminal/coding benchmarks',
      'Significantly cheaper than proprietary US frontier models for agentic loops'
    ],
    cons: [
      '1T total parameter footprint requires ~500GB–1TB VRAM to self-host, making managed API providers mandatory for most teams',
      'Cross-border data privacy rules apply if using first-party Moonshot endpoints directly',
      'No native audio/video multimodal input in the base K2 instruct release'
    ],
    qaEngineerVerdict:
      'A powerhouse open-weights alternative to Claude Sonnet for agentic coding and multi-tool orchestration.',
    officialUrl: 'https://moonshotai.github.io/Kimi-K2/'
  },
  {
    id: 'cohere/command-a-03-2025',
    name: 'Cohere Command A & Rerank 3.5',
    versionLabel: 'Command A (2025/2026)',
    provider: 'Cohere',
    country: 'Canada',
    countryFlag: '🇨🇦',
    headquarters: 'Toronto, Canada',
    releaseTimestampMs: Date.now() - 10 * 24 * 3600 * 1000,
    contextWindowTokens: 256000,
    promptPricePerMillion: '$2.50',
    completionPricePerMillion: '$10.00',
    licenseType: 'Proprietary API',
    modalities: ['Text', 'Citations-First RAG', '23 Languages'],
    categoryBadge: 'Sovereign / Regional AI',
    pros: [
      'Engineered from the ground up for enterprise RAG with fine-grained, verifiable character-level citations',
      'Runs on just 2 GPUs (H100/A100) for private on-premise enterprise deployments',
      'Paired with `Cohere Rerank 3.5`, the industry gold standard for hybrid search reranking'
    ],
    cons: [
      'Not designed for consumer creative writing or multimodal video/audio tasks',
      'Open-weights release is restricted to non-commercial research unless an enterprise license is purchased',
      'Smaller general coding community compared to Anthropic or OpenAI'
    ],
    qaEngineerVerdict:
      'Your go-to stack for enterprise RAG citation verification and Cross-Encoder Reranking.',
    officialUrl: 'https://docs.cohere.com'
  },
  {
    id: 'sarvam/sarvam-m-indic',
    name: 'Sarvam-M & Krutrim-2 (Indic Sovereign AI)',
    versionLabel: 'Sarvam-M (24B)',
    provider: 'Sarvam AI / Ola Krutrim',
    country: 'India',
    countryFlag: '🇮🇳',
    headquarters: 'Bengaluru, India',
    releaseTimestampMs: Date.now() - 11 * 24 * 3600 * 1000,
    contextWindowTokens: 64000,
    promptPricePerMillion: '$0.25',
    completionPricePerMillion: '$0.75',
    licenseType: 'Open-Weights',
    modalities: ['Text', '10+ Indian Languages', 'Code-Mixed Hinglish', 'Voice'],
    categoryBadge: 'Sovereign / Regional AI',
    pros: [
      'Tokenizer specifically optimized for 10+ Indian languages (Hindi, Marathi, Tamil, Telugu, Kannada, Bengali, etc.)—3x fewer tokens than US models',
      'Handles real-world code-mixed inputs (e.g., Hinglish/Marathi-English) and Indian cultural/financial nuances accurately',
      'Full Indian data residency compliance (MeitY / RBI guidelines)'
    ],
    cons: [
      'Smaller context window and lower complex software-engineering depth compared to Claude Opus or GPT-4.1',
      'Smaller global third-party framework ecosystem',
      'Best used for regional language interfaces rather than heavy C++/Rust compiler tasks'
    ],
    qaEngineerVerdict:
      'Essential when testing or building multilingual Indian enterprise banking, healthcare, or voice-bot applications.',
    officialUrl: 'https://www.sarvam.ai'
  }
];

function inferProviderKey(modelId: string): string {
  const prefix = modelId.split('/')[0]?.toLowerCase() || '';
  if (PROVIDER_COUNTRY_MAP[prefix]) return prefix;
  if (prefix.includes('anthropic')) return 'anthropic';
  if (prefix.includes('google')) return 'google';
  if (prefix.includes('openai')) return 'openai';
  if (prefix.includes('deepseek')) return 'deepseek';
  if (prefix.includes('qwen')) return 'qwen';
  if (prefix.includes('llama') || prefix.includes('meta')) return 'meta-llama';
  if (prefix.includes('mistral')) return 'mistralai';
  if (prefix.includes('x-ai') || prefix.includes('grok')) return 'x-ai';
  if (prefix.includes('cohere')) return 'cohere';
  if (prefix.includes('moonshot') || prefix.includes('kimi')) return 'moonshotai';
  if (prefix.includes('minimax')) return 'minimax';
  if (prefix.includes('thudm') || prefix.includes('zhipu') || prefix.includes('glm')) return 'thudm';
  if (prefix.includes('microsoft') || prefix.includes('phi')) return 'microsoft';
  if (prefix.includes('nvidia')) return 'nvidia';
  return '';
}

function formatPricePerMillion(rawPerToken?: string): string {
  const num = Number(rawPerToken);
  if (!Number.isFinite(num) || num <= 0) return 'Free / Open';
  const perMillion = num * 1_000_000;
  if (perMillion < 0.05) return `$${perMillion.toFixed(3)}`;
  return `$${perMillion.toFixed(2)}`;
}

export async function fetchLiveGlobalModels(): Promise<{
  models: GlobalAiModel[];
  newlyLaunched: GlobalAiModel[];
  lastSyncedIso: string;
}> {
  const discoveredModels: GlobalAiModel[] = [];

  try {
    const res = await fetch('https://openrouter.ai/api/v1/models', {
      headers: { Accept: 'application/json' }
    });

    if (res.ok) {
      const json = await res.json();
      const rawList = Array.isArray(json?.data) ? json.data : [];

      // Filter to major tracked AI labs and sort by newest `created` launch timestamp
      const relevant = rawList
        .filter((m: { id?: string; created?: number }) => {
          if (!m?.id) return false;
          return Boolean(inferProviderKey(m.id));
        })
        .sort((a: { created?: number }, b: { created?: number }) => (b.created || 0) - (a.created || 0))
        .slice(0, 18);

      for (const item of relevant) {
        const providerKey = inferProviderKey(item.id);
        const meta = PROVIDER_COUNTRY_MAP[providerKey];
        if (!meta) continue;

        const ctx = Number(item.context_length) || 128000;
        const promptCost = formatPricePerMillion(item.pricing?.prompt);
        const completionCost = formatPricePerMillion(item.pricing?.completion);
        const inputMods: string[] = Array.isArray(item.architecture?.input_modalities)
          ? item.architecture.input_modalities.map((m: string) => m.toUpperCase())
          : ['TEXT'];

        // Build dynamic model-specific pros & cons based on live specs + lab traits
        const dynamicPros = [
          ctx >= 500000
            ? `Massive ${Math.round(ctx / 1000)}K token context window for whole-repo and multi-document analysis`
            : `Supports ${Math.round(ctx / 1000)}K context window with ${inputMods.join(' + ')} input capabilities`,
          ...meta.defaultPros.slice(0, 2)
        ];

        const dynamicCons = [...meta.defaultCons.slice(0, 3)];

        const shortVersion = item.id.split('/')[1] || item.id;

        discoveredModels.push({
          id: `live-${item.id}`,
          name: item.name || shortVersion,
          versionLabel: shortVersion,
          provider: meta.provider,
          country: meta.country,
          countryFlag: meta.countryFlag,
          headquarters: meta.headquarters,
          releaseTimestampMs: (Number(item.created) || Math.floor(Date.now() / 1000)) * 1000,
          contextWindowTokens: ctx,
          promptPricePerMillion: promptCost,
          completionPricePerMillion: completionCost,
          licenseType: meta.licenseType,
          modalities: inputMods,
          categoryBadge:
            shortVersion.includes('r1') || shortVersion.includes('o3') || shortVersion.includes('o4') || shortVersion.includes('thinking')
              ? 'Frontier Reasoning'
              : shortVersion.includes('coder') || shortVersion.includes('sonnet')
              ? 'Coding & Agents'
              : meta.licenseType === 'Open-Weights'
              ? 'Open-Weights Leader'
              : 'Multimodal Flagship',
          pros: dynamicPros,
          cons: dynamicCons,
          qaEngineerVerdict: `${meta.provider} (${meta.countryFlag} ${meta.country}) live release (${shortVersion}) — ${ctx.toLocaleString()} context window, ${promptCost}/1M input tokens.`,
          officialUrl: meta.officialUrl,
          isLiveDiscovered: true
        });
      }
    }
  } catch {
    // Graceful fallback to curated global models when offline
  }

  // Combine curated flagship cards + live-discovered models without duplicating exact IDs
  const seenKeySet = new Set<string>();
  const combined: GlobalAiModel[] = [];

  for (const m of [...CURATED_GLOBAL_MODELS, ...discoveredModels]) {
    const norm = m.versionLabel.toLowerCase();
    if (!seenKeySet.has(norm)) {
      seenKeySet.add(norm);
      combined.push(m);
    }
  }

  // Detect brand-new model launches since Sushama's last check
  let previouslySeen: string[] = [];
  try {
    const raw = localStorage.getItem(SEEN_MODELS_STORAGE_KEY);
    if (raw) previouslySeen = JSON.parse(raw);
  } catch {
    previouslySeen = [];
  }

  const newlyLaunched =
    previouslySeen.length === 0
      ? combined.slice(0, 2)
      : combined.filter((m) => !previouslySeen.includes(m.id));

  try {
    localStorage.setItem(
      SEEN_MODELS_STORAGE_KEY,
      JSON.stringify(Array.from(new Set([...previouslySeen, ...combined.map((m) => m.id)])).slice(-200))
    );
  } catch {
    // Ignore storage quota issues
  }

  return {
    models: combined,
    newlyLaunched,
    lastSyncedIso: new Date().toISOString()
  };
}
