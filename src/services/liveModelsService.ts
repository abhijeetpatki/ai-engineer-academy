export interface GlobalAiModel {
  id: string;
  name: string;
  versionLabel: string;
  provider: string;
  providerKey: string;
  country: string;
  countryFlag: string;
  headquarters: string;
  releaseDateLabel: string;
  releaseTimestampMs: number;
  contextWindowTokens: number;
  promptPricePerMillion: string;
  completionPricePerMillion: string;
  licenseType: 'Open-Weights / Open-Source' | 'Proprietary API';
  licenseDetail: string;
  modalities: string[];
  categoryBadge:
    | 'Frontier Reasoning'
    | 'Multimodal Flagship'
    | 'Coding & Agents'
    | 'Open-Weights Leader'
    | 'Fast & Edge SLM'
    | 'Sovereign / Regional AI';
  pros: string[];
  cons: string[];
  qaEngineerVerdict: string;
  officialUrl: string;
  isLiveDiscovered?: boolean;
}

const SEEN_MODELS_STORAGE_KEY = 'ai_engineer_academy_seen_models_v2';

interface ProviderCountryMeta {
  providerKey: string;
  provider: string;
  country: string;
  countryFlag: string;
  headquarters: string;
  licenseType: 'Open-Weights / Open-Source' | 'Proprietary API';
  licenseDetail: string;
  officialUrl: string;
  defaultPros: string[];
  defaultCons: string[];
}

export const PROVIDER_COUNTRY_MAP: Record<string, ProviderCountryMeta> = {
  openai: {
    providerKey: 'openai',
    provider: 'OpenAI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary Frontier API (+ Apache 2.0 on gpt-oss)',
    officialUrl: 'https://platform.openai.com/docs/models',
    defaultPros: [
      'Flagship GPT-6 (Astra, Sol, Terra, Luna) & GPT-6.1 series with 1.05M token context and strict JSON Schema Constrained Decoding',
      'Elite multi-app tool orchestration, computer use, and automated test-case verification',
      'Also offers official Apache 2.0 open-weights reasoning models (`gpt-oss-120b` & `gpt-oss-20b`) for self-hosting'
    ],
    defaultCons: [
      'Flagship GPT-6 / 6.1 Pro tiers carry premium token pricing and consume internal reasoning tokens',
      'Proprietary frontier weights (Astra/Sol/Terra) cannot be self-hosted on air-gapped on-prem servers',
      'Requires pinning exact snapshot IDs to avoid subtle prompt drift across model upgrades'
    ]
  },
  anthropic: {
    providerKey: 'anthropic',
    provider: 'Anthropic',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary API (Anthropic, Vertex AI, AWS Bedrock)',
    officialUrl: 'https://docs.anthropic.com/en/docs/about-claude/models/overview',
    defaultPros: [
      'Claude 5.5 Fleet (Opus 5.5, Sonnet 5.5, Haiku 5.5) and Claude Fable 5.1 / Mythos 5.1 with full 1M token context windows',
      'Gold standard for autonomous software engineering (`Claude Code`), MCP tool orchestration, and XML prompt adherence',
      'Adaptive Extended Thinking and Enterprise Frontier Safeguards (EFS) minimize hallucinations'
    ],
    defaultCons: [
      'Higher per-token cost on Opus 5.5 / Fable 5.1 unless KV Prompt Caching is configured',
      'Closed-source proprietary weights—no self-hosted local weights option',
      'Strict rate limits on uncached 1M-token context prompts'
    ]
  },
  google: {
    providerKey: 'google',
    provider: 'Google DeepMind',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Mountain View, USA / London, UK',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary Gemini API + Open-Weights Gemma 4',
    officialUrl: 'https://ai.google.dev/gemini-api/docs/models',
    defaultPros: [
      'Gemini 4 Argon / Carbon, Gemini 3.8 Flash & Gemini Omni 1.2 Flash with native 1M–2M multimodal context (text, video, audio, code, PDF)',
      'First-party Grounding with Google Search and Vertex AI enterprise governance',
      'Gemma 4 (31B IT & 26B MoE) provides high-speed open-weights local/workstation execution'
    ],
    defaultCons: [
      'Ultra-large context prompts (>500K tokens) require Context Caching to keep Time-To-First-Token low',
      'Flagship Gemini 4 models are cloud-only via Google AI Studio or Vertex AI',
      'Safety filter thresholds need explicit tuning when running red-team security evals'
    ]
  },
  nvidia: {
    providerKey: 'nvidia',
    provider: 'NVIDIA',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Santa Clara, USA',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'NVIDIA Open Model License (Self-Host / NIM / API)',
    officialUrl: 'https://build.nvidia.com/models',
    defaultPros: [
      'Nemotron 3.5 Super VL (1M ctx), Nemotron-3 Ultra 550B MoE (A55B), Switchyard & Llama-3.3-Nemotron-Super-49B',
      'Open-weights models optimized with Neural Architecture Search (NAS) for 2–3x higher throughput on GPUs',
      'State-of-the-art Vision-Language (VL), reasoning, and LLM-as-a-Judge reward modeling'
    ],
    defaultCons: [
      'Highest inference speed gains require NVIDIA TensorRT-LLM, vLLM, or NIM microservices on NVIDIA GPUs',
      'Ultra 550B / 253B variants require multi-GPU H100/H200/B200 nodes to self-host',
      'Smaller consumer chat ecosystem compared to OpenAI or Anthropic'
    ]
  },
  'x-ai': {
    providerKey: 'x-ai',
    provider: 'xAI (SpaceXAI)',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Palo Alto / Austin, USA',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary API (xAI / OpenRouter / Vercel Gateway)',
    officialUrl: 'https://docs.x.ai',
    defaultPros: [
      'Grok 4.7 & Grok 4.6 feature 500K context windows engineered for multi-hour autonomous coding & terminal agents',
      'Built-in self-correction verification loops, Grok Voice 3.0, and Grok Imagine Video 1.5 multimodal generation',
      'Unrivaled real-time world knowledge integration via live X stream grounding'
    ],
    defaultCons: [
      'Proprietary weights on Grok 4.6 / 4.7 (only older Grok-1/2 weights were open-sourced)',
      '500K context window is half the 1M+ ceiling of Gemini 4, GPT-6.1, and Claude 5.5',
      'Permissive safety defaults require explicit output guardrails in regulated enterprise apps'
    ]
  },
  meta: {
    providerKey: 'meta',
    provider: 'Meta AI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Menlo Park, USA',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights (Meta Muse Open & Llama 4 License)',
    officialUrl: 'https://ai.meta.com',
    defaultPros: [
      'Meta Muse Spark Open (1.3), Muse Wonder & Llama 4 (Maverick, Behemoth, Scout) with 1M to 10M token context windows',
      'Open-weights availability lets enterprises self-host inside private VPCs with zero per-token API vendor lock-in',
      'Universal day-one support across vLLM, Ollama, Hugging Face, AWS Bedrock, and Vertex AI'
    ],
    defaultCons: [
      'Community license includes commercial threshold clauses (>700M MAU) and specific regional regulatory terms',
      'Requires pairing with external safety classifiers (Llama Guard) when self-hosted directly',
      'Ultra-long context (1M–10M) requires multi-GPU KV-cache offloading in self-hosted clusters'
    ]
  },
  deepseek: {
    providerKey: 'deepseek',
    provider: 'DeepSeek AI',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: '100% Open-Source (MIT License)',
    officialUrl: 'https://www.deepseek.com',
    defaultPros: [
      'DeepSeek V4.1 Flash (1017), DeepSeek V4 Pro (0813), V4 Flash Vision & DeepSeek-R1 with 1.05M token context',
      'Permissive MIT Open-Source license—can be freely fine-tuned, distilled, and hosted on any US/EU/India cloud',
      'Frontier-grade reasoning, math, and coding at ~85–90% lower token cost with inspectable `<think>` traces'
    ],
    defaultCons: [
      'Direct first-party DeepSeek API is hosted in China (enterprises should route via US/EU hosts like Fireworks, Baseten, Bedrock, or Vertex)',
      'Full MoE weights require multi-GPU nodes unless running quantized distills',
      'Verbose reasoning chains can add latency on simple classification prompts if thinking is not capped'
    ]
  },
  qwen: {
    providerKey: 'qwen',
    provider: 'Alibaba Cloud (Qwen)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights (Apache 2.0 on Core & Coder Series)',
    officialUrl: 'https://qwenlm.github.io',
    defaultPros: [
      'Qwen 3.8 Max Prime, Qwen 3.8 (2.4T A95B & 27B), Qwen 3.8 Omni Flash & Qwen3 Coder (480B A35B / 30B A3B) with 1M context',
      'World’s #1 open-weights ecosystem across dense and MoE sizes with dynamic thinking-budget control',
      'Exceptional SWE-bench coding, MCP tool-calling, and 119-language fluency'
    ],
    defaultCons: [
      '2.4T / 480B flagship MoE variants require cluster-grade GPU VRAM to self-host (use 27B/30B-A3B for local hardware)',
      'First-party DashScope API endpoints require cross-border data residency review for Western PII workloads',
      'Rapid release cadence across 3.5 / 3.6 / 3.7 / 3.8 requires pinning exact model versions in CI'
    ]
  },
  mistralai: {
    providerKey: 'mistralai',
    provider: 'Mistral AI',
    country: 'France',
    countryFlag: '🇫🇷',
    headquarters: 'Paris, France',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Apache 2.0 Open-Weights (Devstral/Small) + Commercial Flagship',
    officialUrl: 'https://docs.mistral.ai',
    defaultPros: [
      'Mistral Large 4 (1.05M context), Mistral Medium 3.5, Devstral, Magistral, Codestral & Voxtral',
      'Europe’s flagship AI lab offering strict EU GDPR compliance and sovereign European deployment',
      'Permissive Apache 2.0 open-source weights on Devstral (agentic coding), Magistral Small, and Mistral Small'
    ],
    defaultCons: [
      'Split licensing: flagship Mistral Large 4 is commercial/research-licensed while smaller/coding models are Apache 2.0',
      'Smaller native cloud ecosystem than Google Vertex AI or AWS',
      'Fewer consumer multimodal video generation features than Google Veo or OpenAI'
    ]
  },
  moonshotai: {
    providerKey: 'moonshotai',
    provider: 'Moonshot AI (Kimi)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights MoE + Commercial API',
    officialUrl: 'https://kimi.moonshot.cn',
    defaultPros: [
      'Kimi K3.1 Pro, Kimi K3 & Kimi K2.7 Code with 1.05M context windows and 1T+ MoE architecture',
      'Built natively for multi-agent swarm orchestration, long-horizon coding, and deep document synthesis',
      'Open-weights availability on K2/K2.5/K3 families enables hosting on global GPU clouds'
    ],
    defaultCons: [
      '1T+ total MoE parameter footprint demands heavy multi-GPU infrastructure if self-hosted directly',
      'First-party API requires cross-border data compliance review outside Asia',
      'Smaller English community plugin ecosystem than OpenAI or Anthropic'
    ]
  },
  zai: {
    providerKey: 'zai',
    provider: 'Z.ai / Zhipu AI (GLM)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights (GLM-5 / 5.3 Series) + API',
    officialUrl: 'https://z.ai',
    defaultPros: [
      'GLM 5.3 Prime, GLM 5.3 FlashX, GLM 5.3 FlashX Legal & GLM-5V Turbo with 1.05M token context',
      'Rivals Claude Opus on complex software engineering, browser/GUI agent automation, and legal/domain reasoning',
      'Strong open-weights heritage from Tsinghua University KEG lab'
    ],
    defaultCons: [
      'Requires western cloud hosting (OpenRouter/Fireworks/vLLM) for enterprises with strict US/EU data residency rules',
      'Some specialized variants (e.g., Legal/FlashX) have domain-specific system prompt conventions',
      'English creative copywriting slightly trails Claude Fable 5.1'
    ]
  },
  minimax: {
    providerKey: 'minimax',
    provider: 'MiniMax',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Shanghai, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights Lightning Attention + API',
    officialUrl: 'https://www.minimaxi.com',
    defaultPros: [
      'MiniMax M3.1 Flash & MiniMax M3 with 1.05M–4M context powered by linear-complexity Lightning Attention',
      'Drastically lower KV-cache memory consumption and fast throughput on massive document corpora',
      'Strong multimodal and speech synthesis integration'
    ],
    defaultCons: [
      'Hybrid Lightning Attention requires recent vLLM/SGLang kernels when self-hosting',
      'Cross-border enterprise data governance applies to direct hosted APIs',
      'Fewer out-of-the-box LoRA fine-tuning scripts than standard Llama architectures'
    ]
  },
  tencent: {
    providerKey: 'tencent',
    provider: 'Tencent (Hunyuan)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Shenzhen, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights Hunyuan Community License + API',
    officialUrl: 'https://hunyuan.tencent.com',
    defaultPros: [
      'Tencent Hunyuan Hy4 (1.05M context) & Hy-MT2-30B-A3B open-weights MoE models',
      'Strong multimodal, translation (MT2), 3D/video generation, and long-context reasoning',
      'Active open-weights releases on Hugging Face'
    ],
    defaultCons: [
      'Enterprise data residency review required for non-Asian deployments using direct Tencent Cloud APIs',
      'Smaller English developer documentation footprint',
      'MT2 sub-models have smaller 8K–32K context windows specialized for translation'
    ]
  },
  xiaomi: {
    providerKey: 'xiaomi',
    provider: 'Xiaomi AI (MiMo)',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights Apache 2.0 (MiMo Series)',
    officialUrl: 'https://github.com/XiaomiMiMo',
    defaultPros: [
      'MiMo-V2.6-Pro, MiMo-V2.6-Pro-UltraSpeed & MiMo-V2.6-Flash with 1.05M token context',
      'Engineered from pre-training specifically for reinforcement-learning math/code reasoning and ultra-fast token generation',
      'Open-weights availability for local and edge-to-cloud deployment'
    ],
    defaultCons: [
      'Newer entrant in enterprise cloud marketplaces compared to Qwen or DeepSeek',
      'Primarily optimized for STEM, code, and fast reasoning rather than creative prose',
      'Requires third-party gateway routing for Western enterprise compliance'
    ]
  },
  bytedance: {
    providerKey: 'bytedance',
    provider: 'ByteDance Seed',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing / Singapore',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights Seed Research + API',
    officialUrl: 'https://team.doubao.com',
    defaultPros: [
      'Seed 2.1 Turbo & Seed-2.0-Code (262K context) plus Seedance / Seedream multimodal models',
      'Strong SWE-bench code generation, patch synthesis, and unit-test verification',
      'Low-latency Turbo inference profile'
    ],
    defaultCons: [
      'Strict enterprise governance restrictions in US/EU government and regulated sectors',
      '262K context is smaller than 1M-context competitors',
      'Fewer Western cloud managed endpoints'
    ]
  },
  liquid: {
    providerKey: 'liquid',
    provider: 'Liquid AI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Cambridge (MIT spinout), USA',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights (LFM3 / LFM2.5) + Enterprise API',
    officialUrl: 'https://www.liquid.ai',
    defaultPros: [
      'LFM3-1.7B, LFM2.5-24B-A2B & Liquid D1 Ultra built on non-Transformer Liquid Foundation Model dynamical systems',
      'Constant memory footprint across long 128K–262K contexts—ideal for on-device, automotive, and edge QA',
      'Dramatically lower RAM/VRAM usage than traditional attention-heavy Transformers'
    ],
    defaultCons: [
      'Smaller parameter sizes (1.7B–24B) mean less memorized world trivia without RAG grounding',
      'Non-Transformer architecture requires compatible inference runtimes (vLLM/Llama.cpp recent builds)',
      'Not intended to replace 500B+ frontier models on open-ended scientific research'
    ]
  },
  ibm: {
    providerKey: 'ibm',
    provider: 'IBM Research (Granite)',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Armonk, New York, USA',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: '100% Open-Source (Apache 2.0 + IP Indemnification)',
    officialUrl: 'https://www.ibm.com/granite',
    defaultPros: [
      'Granite 4.2 8B (131K context) trained on audited, enterprise-clean datasets with full Apache 2.0 open-source license',
      'Backed by IBM intellectual-property indemnification for Fortune 500 compliance teams',
      'Runs effortlessly on a single GPU or laptop for RAG, log triage, and cybersecurity tasks'
    ],
    defaultCons: [
      'Compact 8B parameter size trails 100B+ frontier models on unassisted multi-hop reasoning',
      'Must be paired with RAG or fine-tuning for specialized domain synthesis',
      'Text/code focused rather than native video/audio'
    ]
  },
  microsoft: {
    providerKey: 'microsoft',
    provider: 'Microsoft AI',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Redmond, USA',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'MIT Open-Source (Phi-4) + Azure MAI API',
    officialUrl: 'https://azure.microsoft.com/en-us/products/phi',
    defaultPros: [
      'Phi-4 Reasoning (MIT Open-Source SLM) plus MAI-Voice-2.1, MAI-Transcribe-2 & Microsoft-Decision-1',
      'Phi-4 delivers remarkable math and logic density per parameter on a single GPU or NPU',
      'Deep native integration with Azure AI Foundry and GitHub Copilot'
    ],
    defaultCons: [
      'Small parameter count limits broad encyclopedic recall without RAG',
      'MAI-Voice / Decision models are proprietary to Azure / Gateway endpoints',
      'Smaller context window on compact SLMs compared to 1M-context frontier models'
    ]
  },
  cohere: {
    providerKey: 'cohere',
    provider: 'Cohere',
    country: 'Canada',
    countryFlag: '🇨🇦',
    headquarters: 'Toronto, Canada',
    licenseType: 'Proprietary API',
    licenseDetail: 'Enterprise API + Private VPC + Open Research Weights',
    officialUrl: 'https://docs.cohere.com',
    defaultPros: [
      'Command A+ (192K–256K ctx), Rerank v5 Pro / Fast, and Embed v5.0 Pro built specifically for enterprise RAG',
      'Verifiable character-level source citations and industry-leading Cross-Encoder Reranking',
      'Deploys on just 2 GPUs inside private enterprise VPCs'
    ],
    defaultCons: [
      'Focused strictly on enterprise text/RAG rather than consumer video or image generation',
      'Open-weights releases carry CC-BY-NC non-commercial licenses unless commercially licensed',
      'Smaller context window (192K) than 1M-token competitors'
    ]
  },
  sakana: {
    providerKey: 'sakana',
    provider: 'Sakana AI',
    country: 'Japan',
    countryFlag: '🇯🇵',
    headquarters: 'Tokyo, Japan',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Evolutionary Open-Weights + API',
    officialUrl: 'https://sakana.ai',
    defaultPros: [
      'Fugu Ultra v2, Fugu Max & Namazu with 1M token context windows built by former Google Brain Transformer co-authors',
      'Pioneered evolutionary model merging and automated AI Scientist discovery loops',
      'Unmatched Japanese + English bilingual and sovereign Asian enterprise performance'
    ],
    defaultCons: [
      'Smaller global cloud availability outside OpenRouter, Vercel AI Gateway, and Japanese cloud providers',
      'Less pre-built tooling in Western enterprise CRM integrations',
      'Specialized focus on reasoning, coding, and Asian-Western bilingual workflows'
    ]
  },
  upstage: {
    providerKey: 'upstage',
    provider: 'Upstage AI',
    country: 'South Korea',
    countryFlag: '🇰🇷',
    headquarters: 'Seoul, South Korea / San Jose, USA',
    licenseType: 'Proprietary API',
    licenseDetail: 'Enterprise Document & LLM API + Open-Weights Solar',
    officialUrl: 'https://www.upstage.ai',
    defaultPros: [
      'Solar Mini 4 & Solar Pro with 524K context window and Depth-Up Scaling (DUS) architecture',
      'World-class OCR/Document Parse pipeline for complex financial tables, medical forms, and PDFs',
      'Low latency and strong English, Korean, and Japanese enterprise accuracy'
    ],
    defaultCons: [
      'Smaller parameter footprint than 1T+ MoE frontier models on abstract math olympiads',
      'Best paired with Upstage Document Parse for enterprise RAG pipelines',
      'Smaller general consumer awareness'
    ]
  },
  sarvam: {
    providerKey: 'sarvam',
    provider: 'Sarvam AI / Krutrim',
    country: 'India',
    countryFlag: '🇮🇳',
    headquarters: 'Bengaluru, India',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights Apache 2.0 (Sarvam-M) + Sovereign Cloud',
    officialUrl: 'https://www.sarvam.ai',
    defaultPros: [
      'Sarvam-M (Open-Weights) & Krutrim-2 built with Indic tokenizers covering 10+ Indian languages (Marathi, Hindi, Tamil, Telugu, etc.)',
      '3–4x better token fertility and lower cost on Indian languages and code-mixed Hinglish/Marathi-English',
      'Full MeitY / RBI Indian data residency compliance'
    ],
    defaultCons: [
      'Smaller context window than 1M-token US/Chinese frontier models',
      'Not intended to replace Claude 5.5 or GPT-6.1 on heavy C++/Rust systems programming',
      'Regional cloud focus'
    ]
  }
};

// Up-to-date Late-2026 Flagship & Open-Source Reference Catalog (verified against live Oct/Nov 2026 registries)
export const CURATED_GLOBAL_MODELS: GlobalAiModel[] = [
  {
    id: 'openai/gpt-6.1-terra-pro',
    name: 'OpenAI GPT-6.1 Terra Pro, Sol Pro & GPT-6 Astra',
    versionLabel: 'gpt-6.1-terra-pro / gpt-6-astra',
    provider: 'OpenAI',
    providerKey: 'openai',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-26T00:00:00Z'),
    contextWindowTokens: 1050000,
    promptPricePerMillion: '$2.50',
    completionPricePerMillion: '$10.00',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary Frontier API',
    modalities: ['Text', 'Vision', 'Audio', 'Browser/Computer Use', 'Strict JSON'],
    categoryBadge: 'Frontier Reasoning',
    pros: [
      'OpenAI’s latest Oct 2026 flagship family (`GPT-6.1 Terra Pro`, `GPT-6.1 Sol Pro`, `GPT-6 Astra Pro`, `GPT-6 Luna`) with 1.05M token context',
      '100% guaranteed schema compliance via Constrained Decoding (`strict: true`)—zero malformed JSON in production',
      'Elite multi-app tool orchestration, cybersecurity analysis, and autonomous browser/computer execution'
    ],
    cons: [
      'Pro/Astra reasoning tiers consume internal thinking tokens that increase billable output cost and TTFT latency',
      'Closed-source proprietary weights (cannot be self-hosted on air-gapped on-premise servers)',
      'Requires pinning exact model slugs (`gpt-6.1-terra` vs `gpt-6.1-sol`) to balance cost vs. reasoning depth'
    ],
    qaEngineerVerdict:
      'Choose `GPT-6.1 Sol` for fast, cost-efficient structured JSON extraction & coding, and `GPT-6.1 Terra Pro` / `GPT-6 Astra` for deep multi-step agent verification.',
    officialUrl: 'https://platform.openai.com/docs/models'
  },
  {
    id: 'openai/gpt-oss-120b',
    name: 'OpenAI gpt-oss-120b & gpt-oss-20b (Open-Source)',
    versionLabel: 'gpt-oss-120b / 20b',
    provider: 'OpenAI',
    providerKey: 'openai',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    releaseDateLabel: '2026 Open-Weights',
    releaseTimestampMs: Date.parse('2026-09-15T00:00:00Z'),
    contextWindowTokens: 131072,
    promptPricePerMillion: '$0.15 (or Free Self-Hosted)',
    completionPricePerMillion: '$0.60',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Apache 2.0 Open-Weights',
    modalities: ['Text', 'Code', 'Chain-of-Thought', 'Tool Calling'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'OpenAI’s official open-weights reasoning models released under the permissive Apache 2.0 license',
      '`gpt-oss-20b` runs locally on workstation GPUs while `gpt-oss-120b` fits on a single 80GB H100/H200 GPU',
      'Natively trained for OpenAI-style tool calling, Harmony prompt formatting, and configurable reasoning effort'
    ],
    cons: [
      'Text/code only—does not include native audio/video multimodality of proprietary GPT-6',
      '128K context window is smaller than GPT-6.1’s 1.05M token window',
      'Requires self-hosted guardrails when deployed outside managed cloud APIs'
    ],
    qaEngineerVerdict:
      'Best choice when your company uses the OpenAI SDK ecosystem but compliance requires self-hosting an Apache 2.0 open-weights model inside your own VPC.',
    officialUrl: 'https://openai.com/open-models'
  },
  {
    id: 'anthropic/claude-opus-5.5',
    name: 'Claude 5.5 Fleet (Opus 5.5, Sonnet 5.5, Haiku 5.5) & Fable 5.1',
    versionLabel: 'claude-opus-5.5 / sonnet-5.5 / fable-5.1',
    provider: 'Anthropic',
    providerKey: 'anthropic',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'San Francisco, USA',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-07T00:00:00Z'),
    contextWindowTokens: 1000000,
    promptPricePerMillion: '$3.00 (Sonnet 5.5) / $0.80 (Haiku 5.5)',
    completionPricePerMillion: '$15.00 (Sonnet 5.5) / $4.00 (Haiku 5.5)',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary API (Anthropic / Vertex / Bedrock)',
    modalities: ['Text', 'Code', 'Vision', 'PDF', 'Adaptive Thinking', 'MCP'],
    categoryBadge: 'Coding & Agents',
    pros: [
      'Full 1,000,000-token context window across `Claude Opus 5.5`, `Claude Sonnet 5.5`, `Claude Haiku 5.5`, and `Claude Fable 5.1`',
      'Unrivaled accuracy on autonomous software engineering (`Claude Code`), MCP server tool use, and XML system prompt adherence',
      '`Sonnet 5.5` delivers 30%+ faster execution speed while `Fable 5.1` / `Mythos 5.1` lead on deep security & scientific reasoning'
    ],
    cons: [
      'Proprietary cloud-only model—no open-weights variant available for local air-gapped hosting',
      '1M-token prompts become expensive quickly without enabling KV Prompt Caching (`cache_control`)',
      'Strict safety classifiers on Mythos/Fable tiers require authorized security context for red-team exploit generation'
    ],
    qaEngineerVerdict:
      'The #1 model family for agentic coding, MCP tool orchestration, XML-structured test triage, and high-precision LLM-as-a-Judge evaluation.',
    officialUrl: 'https://docs.anthropic.com/en/docs/about-claude/models/overview'
  },
  {
    id: 'google/gemini-4-argon',
    name: 'Google Gemini 4 Argon, Gemini 3.8 Flash & Omni 1.2 Flash',
    versionLabel: 'gemini-4-argon / gemini-omni-1.2-flash',
    provider: 'Google DeepMind',
    providerKey: 'google',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Mountain View, USA / London, UK',
    releaseDateLabel: 'Nov 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-11-05T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$1.25 (Argon) / $0.15 (Flash)',
    completionPricePerMillion: '$10.00 (Argon) / $0.60 (Flash)',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary API (Google AI Studio & Vertex AI)',
    modalities: ['Text', 'Video', 'Audio', 'Images', 'Code', 'PDF', 'Google Search Grounding'],
    categoryBadge: 'Multimodal Flagship',
    pros: [
      'Latest `Gemini 4 Argon` / `Carbon` and `Gemini Omni 1.2 Flash` process native video, audio, PDFs, and whole repositories in a 1M–2M window',
      'First-party Grounding with Google Search automatically attaches verifiable web citations and reduces hallucinations',
      '`Gemini 3.8 Flash` & `Omni 1.2 Flash` deliver sub-second multimodal streaming at ultra-low token cost'
    ],
    cons: [
      'Flagship Gemini 4 models are proprietary cloud endpoints (use `Gemma 4` for open-weights local deployment)',
      'Uncached prompts above 300K tokens have higher initial prefill latency',
      'Vertex AI IAM and regional quota setup has a steeper learning curve than simple API keys'
    ],
    qaEngineerVerdict:
      'Unbeatable when testing multimodal apps (analyzing failed UI video recordings, audio call logs, and 500-page PDF specs) or building grounded enterprise RAG.',
    officialUrl: 'https://ai.google.dev/gemini-api/docs/models'
  },
  {
    id: 'google/gemma-4-31b-it',
    name: 'Google Gemma 4 (31B IT & 26B MoE) — Open-Weights',
    versionLabel: 'gemma-4-31b-it / gemma-4-26b-moe',
    provider: 'Google DeepMind',
    providerKey: 'google',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Mountain View, USA',
    releaseDateLabel: '2026 Open-Weights',
    releaseTimestampMs: Date.parse('2026-09-18T00:00:00Z'),
    contextWindowTokens: 262144,
    promptPricePerMillion: '$0.10 (or Free Self-Hosted)',
    completionPricePerMillion: '$0.30',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Gemma Open-Weights License',
    modalities: ['Text', 'Vision', 'Code', 'Structured JSON'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Built directly from Google’s Gemini 4 research lineage into a compact 31B dense and 26B MoE open-weights footprint',
      'Runs at blazing tokens-per-second on a single workstation/server GPU via Ollama, vLLM, or Hugging Face',
      'Native multimodal image+text understanding and strong structured JSON adherence'
    ],
    cons: [
      '31B parameter ceiling cannot match 500B+ frontier models on highly esoteric multi-hop research without RAG',
      'Gemma Terms of Use include standard responsible-AI behavioral clauses',
      'No built-in Google Search grounding unless wired to an external search MCP tool'
    ],
    qaEngineerVerdict:
      'Top choice for running a Google-engineered multimodal open-weights model locally or inside a private CI/CD test runner.',
    officialUrl: 'https://ai.google.dev/gemma'
  },
  {
    id: 'nvidia/nemotron-3.5-super-vl',
    name: 'NVIDIA Nemotron 3.5 Super VL, Nemotron-3 Ultra 550B & Switchyard',
    versionLabel: 'nemotron-3.5-super-vl / ultra-550b-a55b',
    provider: 'NVIDIA',
    providerKey: 'nvidia',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Santa Clara, USA',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-15T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.20 (Free Tier Available)',
    completionPricePerMillion: '$0.60',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'NVIDIA Open Model License (Open-Weights)',
    modalities: ['Text', 'Vision-Language (VL)', 'Code', 'Reasoning', 'RAG & Reward Judging'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Includes Oct 2026 `Nemotron 3.5 Super VL` (1M ctx), `Nemotron-3 Ultra 550B (A55B)`, `Nemotron 3.5 Lightning`, and `Llama-3.3-Nemotron-Super-49B`',
      'Neural Architecture Search (NAS) optimization yields 2–3x higher token throughput and lower VRAM on NVIDIA GPUs',
      'Open-weights availability plus industry-leading accuracy as an LLM-as-a-Judge evaluator and multimodal RAG engine'
    ],
    cons: [
      'Maximum throughput optimizations are tailored specifically to NVIDIA TensorRT-LLM / NIM / Blackwell & Hopper GPUs',
      '550B Ultra MoE variant requires multi-GPU server nodes when self-hosted (use Super 49B or Nano 12B VL for single GPU)',
      'No native audio generation modality (focused on Vision-Language, Reasoning, and Code)'
    ],
    qaEngineerVerdict:
      'Must-use open-weights family when deploying high-throughput self-hosted RAG, UI visual regression analysis (`Super VL`), or fast LLM-as-a-Judge pipelines on NVIDIA GPUs.',
    officialUrl: 'https://build.nvidia.com/models'
  },
  {
    id: 'x-ai/grok-4.7',
    name: 'xAI Grok 4.7 & Grok 4.6 (+ Grok Imagine Video 1.5)',
    versionLabel: 'grok-4.7 / grok-4.6',
    provider: 'xAI (SpaceXAI)',
    providerKey: 'x-ai',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Palo Alto / Austin, USA',
    releaseDateLabel: 'Sep 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-09-21T00:00:00Z'),
    contextWindowTokens: 500000,
    promptPricePerMillion: '$2.00',
    completionPricePerMillion: '$10.00',
    licenseType: 'Proprietary API',
    licenseDetail: 'Proprietary API (xAI / SpaceXAI)',
    modalities: ['Text', 'Code', 'Vision', 'Realtime X Grounding', 'Voice 3.0 & Video 1.5'],
    categoryBadge: 'Frontier Reasoning',
    pros: [
      '`Grok 4.7` and `Grok 4.6` feature 500K token context windows and self-correcting verification loops for multi-hour coding & terminal agents',
      'Unmatched real-time access to breaking global events and developer discussions via live X stream grounding',
      'Drop-in OpenAI-compatible SDK plus `Grok Voice 3.0` and `Grok Imagine Video 1.5` multimodal endpoints'
    ],
    cons: [
      'Frontier Grok 4.6 / 4.7 weights are proprietary (unlike earlier open-weights Grok-1/2 releases)',
      '500K context window is smaller than the 1M+ windows of GPT-6.1, Claude 5.5, and Gemini 4',
      'Requires explicit enterprise guardrail wrappers when deploying in strict compliance industries'
    ],
    qaEngineerVerdict:
      'Excellent for long-running autonomous terminal/coding agents, STEM verification, and applications needing real-time social/news grounding.',
    officialUrl: 'https://docs.x.ai'
  },
  {
    id: 'meta/muse-spark-open',
    name: 'Meta Muse Spark Open (1.3), Muse Wonder & Llama 4 (Maverick / Scout)',
    versionLabel: 'muse-spark-open / llama-4-maverick',
    provider: 'Meta AI',
    providerKey: 'meta',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Menlo Park, USA',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-15T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.18 (or Free Self-Hosted)',
    completionPricePerMillion: '$0.50',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Meta Open-Weights License',
    modalities: ['Text', 'Vision', 'Code', 'Multilingual', '1M–10M Context'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Oct 2026 `Meta Muse Spark Open` & `Muse Wonder` (1.05M ctx) alongside `Llama 4 Maverick` & `Llama 4 Scout` (up to 10M ctx)',
      'US-origin open-weights foundation supported by every cloud provider, local runtime (Ollama/vLLM), and fine-tuning framework',
      'Zero vendor lock-in—can be fine-tuned with LoRA/QLoRA on private enterprise QA datasets'
    ],
    cons: [
      'Meta license requires custom commercial agreement only if your platform exceeds 700M monthly active users',
      'Requires pairing with Llama Guard / prompt-injection shields when exposed to untrusted public users',
      'Ultra-long context (1M–10M) requires distributed GPU memory when self-hosting'
    ],
    qaEngineerVerdict:
      'The default US open-weights foundation for private VPC deployments, fine-tuning, and high-volume enterprise RAG.',
    officialUrl: 'https://ai.meta.com'
  },
  {
    id: 'deepseek/deepseek-v4.1-flash-1017',
    name: 'DeepSeek V4.1 Flash (1017), DeepSeek V4 Pro & DeepSeek-R1',
    versionLabel: 'deepseek-v4.1-flash-1017 / v4-pro-0813',
    provider: 'DeepSeek AI',
    providerKey: 'deepseek',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-17T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.14 – $0.55',
    completionPricePerMillion: '$0.28 – $2.19',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: '100% Open-Source (MIT License)',
    modalities: ['Text', 'Code', 'Vision (V4 Vision Exp)', 'Visible <think> CoT'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Latest Oct 2026 `DeepSeek V4.1 Flash (1017)` and `DeepSeek V4 Pro (0813)` scale context to 1,048,576 tokens with multimodal vision support',
      '100% permissive MIT Open-Source license—weights can be freely self-hosted or called via US/EU cloud providers (Fireworks, Baseten, Bedrock)',
      'Exposes transparent `<think>` reasoning chains at ~1/10th the cost of proprietary frontier APIs'
    ],
    cons: [
      'Direct `api.deepseek.com` endpoints are hosted in China—regulated Western enterprises must use US/EU-hosted inference or self-host',
      'Full 671B+ MoE weights require multi-GPU H100/H200 clusters to self-host unquantized',
      'Extended thinking traces can increase latency if not using the `V4.1 Flash Ultrafast` profile'
    ],
    qaEngineerVerdict:
      'Best open-source MIT reasoning & coding family in the world—use via US/EU cloud hosts or self-hosted vLLM for transparent reasoning audits and low-cost evals.',
    officialUrl: 'https://www.deepseek.com'
  },
  {
    id: 'qwen/qwen3.8-max-prime',
    name: 'Alibaba Qwen 3.8 Max Prime, Qwen 3.8 (2.4T / 27B) & Qwen3 Coder',
    versionLabel: 'qwen3.8-max-prime / qwen3.8-2.4t-a95b / qwen3-coder',
    provider: 'Alibaba Cloud (Qwen)',
    providerKey: 'qwen',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Hangzhou, China',
    releaseDateLabel: 'Sep 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-09-23T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.20',
    completionPricePerMillion: '$0.60',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Apache 2.0 Open-Weights + Max API',
    modalities: ['Text', 'Code', 'Vision-Language', 'Audio (Omni)', '119 Languages'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Massive `Qwen 3.8 2.4T-A95B` MoE, `Qwen 3.8 27B` dense, `Qwen 3.8 Omni Flash`, and `Qwen3 Coder 480B / 30B` with 1M token context',
      'Apache 2.0 open-source license on core & coder weights makes it the #1 base model for custom fine-tuning worldwide',
      'Hybrid thinking toggle lets you switch between instant non-thinking replies and deep step-by-step reasoning per API call'
    ],
    cons: [
      'Flagship 2.4T MoE requires enterprise GPU clusters to self-host (choose `Qwen 3.8 27B` or `Qwen3 Coder 30B-A3B` for single/dual GPU)',
      'Direct Alibaba DashScope cloud requires data-residency approval for US/EU PII workloads',
      'Large number of sub-models requires careful slug selection'
    ],
    qaEngineerVerdict:
      'Use `Qwen3 Coder` or `Qwen 3.8 27B` (Apache 2.0) for self-hosted coding agents and multilingual test generation.',
    officialUrl: 'https://qwenlm.github.io'
  },
  {
    id: 'mistralai/mistral-large-4-0',
    name: 'Mistral Large 4 (1M Context), Devstral, Magistral & Codestral',
    versionLabel: 'mistral-large-4-0 / devstral / magistral',
    provider: 'Mistral AI',
    providerKey: 'mistralai',
    country: 'France',
    countryFlag: '🇫🇷',
    headquarters: 'Paris, France',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-06T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$2.00 ($0.20 Devstral/Small)',
    completionPricePerMillion: '$6.00 ($0.60 Devstral/Small)',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Apache 2.0 Open-Weights (Devstral/Small) + Commercial Large 4',
    modalities: ['Text', 'Code', 'Vision (Pixtral)', 'Audio (Voxtral 3)', 'Function Calling'],
    categoryBadge: 'Sovereign / Regional AI',
    pros: [
      'Oct 2026 `Mistral Large 4` upgrades context to a full 1,048,576 tokens with top-tier European multilingual & coding intelligence',
      '`Devstral` and `Magistral Small` offer 100% Apache 2.0 open-source weights purpose-built for SWE-bench agentic software engineering',
      'Strict EU GDPR compliance and European sovereign hosting ("Le Plateforme" + Azure/Bedrock/Vertex)'
    ],
    cons: [
      'Flagship `Mistral Large 4` weights are commercial/research-licensed rather than Apache 2.0',
      'Smaller US consumer ecosystem than OpenAI or Google',
      'Requires explicit tool-schema validation for deeply nested recursive JSON objects'
    ],
    qaEngineerVerdict:
      'The top European model family—pick `Mistral Large 4` for GDPR-compliant 1M-context enterprise apps and `Devstral` for open-source coding agents.',
    officialUrl: 'https://docs.mistral.ai'
  },
  {
    id: 'moonshotai/kimi-k3.1-pro',
    name: 'Moonshot Kimi K3.1 Pro, Kimi K3 & Kimi K2.7 Code',
    versionLabel: 'kimi-k3.1-pro / kimi-k2.7-code',
    provider: 'Moonshot AI (Kimi)',
    providerKey: 'moonshotai',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    releaseDateLabel: 'Oct 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-10-23T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.60',
    completionPricePerMillion: '$2.40',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights MoE + High-Speed API',
    modalities: ['Text', 'Code', 'Multi-Agent Swarms', '1M Long Context'],
    categoryBadge: 'Coding & Agents',
    pros: [
      'Oct 2026 `Kimi K3.1 Pro` and `Kimi K2.7 Code` scale to 1,048,576 context tokens with MuonClip-trained 1T+ MoE architecture',
      'Purpose-built for orchestrating parallel sub-agent swarms, long-horizon repository refactoring, and deep research',
      'Open-weights availability on K2/K3 lineage allows deployment on independent US/EU GPU clouds'
    ],
    cons: [
      '1T+ total MoE parameter count requires multi-node H100/H200 clusters if self-hosting without cloud APIs',
      'Direct Moonshot API endpoints require cross-border data compliance checks for Western PII',
      'Less focused on realtime voice/video generation than Gemini Omni'
    ],
    qaEngineerVerdict:
      'A top-tier powerhouse for multi-agent coding swarms and 1M-token repository-wide bug hunting.',
    officialUrl: 'https://kimi.moonshot.cn'
  },
  {
    id: 'z-ai/glm-5.3-prime',
    name: 'Z.ai (Zhipu) GLM 5.3 Prime, GLM 5.3 FlashX & GLM-5V Turbo',
    versionLabel: 'glm-5.3-prime / glm-5.3-flashx-legal',
    provider: 'Z.ai / Zhipu AI (GLM)',
    providerKey: 'zai',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Beijing, China',
    releaseDateLabel: 'Nov 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-11-02T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.25 ($0.08 FlashX)',
    completionPricePerMillion: '$1.00 ($0.30 FlashX)',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights GLM Series + API',
    modalities: ['Text', 'Code', 'Vision (GLM-5V)', 'Browser/GUI Agents', 'Legal/Domain'],
    categoryBadge: 'Coding & Agents',
    pros: [
      'Nov 2026 `GLM 5.3 FlashX Legal`, `GLM 5.3 Prime`, and `GLM-5V Turbo` feature 1,048,576 context tokens',
      'Exceptional autonomous browser/phone GUI agent capabilities (`AutoGLM`) and full-stack code generation',
      'Includes specialized high-precision domain variants (such as `GLM 5.3 FlashX Legal`) and open-weights releases'
    ],
    cons: [
      'Regulated US/EU enterprises must route via independent cloud hosts (OpenRouter/Fireworks/vLLM) rather than direct Beijing endpoints',
      'English idiomatic creative writing trails Claude Fable 5.1',
      'Requires pinning sub-variant (`Prime` vs `FlashX`) based on latency needs'
    ],
    qaEngineerVerdict:
      'Strong contender for automated UI/browser testing agents, legal/contract compliance RAG, and low-cost high-context coding.',
    officialUrl: 'https://z.ai'
  },
  {
    id: 'tencent/hy4',
    name: 'Tencent Hunyuan Hy4, MiniMax M3.1 Flash & Xiaomi MiMo-V2.6-Pro',
    versionLabel: 'tencent/hy4 / minimax-m3.1-flash / mimo-v2.6-pro',
    provider: 'Tencent (Hunyuan)',
    providerKey: 'tencent',
    country: 'China',
    countryFlag: '🇨🇳',
    headquarters: 'Shenzhen / Shanghai / Beijing, China',
    releaseDateLabel: 'Nov 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-11-04T00:00:00Z'),
    contextWindowTokens: 1048576,
    promptPricePerMillion: '$0.15',
    completionPricePerMillion: '$0.60',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights (Hy-MT2 / MiMo Apache 2.0 / MiniMax)',
    modalities: ['Text', 'Code', 'Multimodal', '1.05M Lightning Context'],
    categoryBadge: 'Open-Weights Leader',
    pros: [
      'Nov 2026 `Tencent Hy4` (1.05M ctx), Oct 2026 `MiniMax M3.1 Flash` (1.05M ctx), and `Xiaomi MiMo-V2.6-Pro-UltraSpeed` (1.05M ctx)',
      'Linear/Lightning Attention architectures slash KV-cache memory overhead and deliver ultra-high tokens/sec on 1M-token prompts',
      'Strong open-weights releases (`Hy-MT2-30B-A3B` for translation, `MiMo` Apache 2.0 for math/code)'
    ],
    cons: [
      'Direct cloud endpoints require cross-border data governance review for non-Asian enterprises',
      'Fewer Western tutorials and LangChain/LlamaIndex starter templates than OpenAI or Anthropic',
      'Custom hybrid attention kernels require up-to-date vLLM when self-hosting'
    ],
    qaEngineerVerdict:
      'Great high-speed, low-cost alternatives for 1M-token log analysis, translation (`Hy-MT2`), and high-throughput batch evaluation.',
    officialUrl: 'https://hunyuan.tencent.com'
  },
  {
    id: 'liquid/lfm-3-1.7b',
    name: 'LiquidAI LFM3-1.7B & LFM2.5-24B-A2B + IBM Granite 4.2 8B (Open-Source SLMs)',
    versionLabel: 'lfm-3-1.7b / lfm2.5-24b-a2b / granite-4.2-8b',
    provider: 'Liquid AI',
    providerKey: 'liquid',
    country: 'United States',
    countryFlag: '🇺🇸',
    headquarters: 'Cambridge (MIT) & Armonk (IBM), USA',
    releaseDateLabel: 'Nov 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-11-06T00:00:00Z'),
    contextWindowTokens: 262144,
    promptPricePerMillion: '$0.03 (or Free On-Device)',
    completionPricePerMillion: '$0.10',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Open-Weights / Apache 2.0 (IBM Granite 4.2 & Microsoft Phi-4)',
    modalities: ['Text', 'Code', 'Edge / On-Device', 'RAG Classification'],
    categoryBadge: 'Fast & Edge SLM',
    pros: [
      'Launched Nov 6, 2026: `LiquidAI LFM3-1.7B` & `LFM2.5-24B-A2B` (262K ctx) alongside `IBM Granite 4.2 8B` (Apache 2.0) and `Microsoft Phi-4` (MIT)',
      'Non-Transformer dynamical systems (`LFM3`) and compact SLMs run locally on laptops, mobile NPUs, or single GPUs with constant memory',
      'IBM Granite 4.2 provides full Apache 2.0 licensing + enterprise IP indemnification for strict legal compliance'
    ],
    cons: [
      'Small parameter counts (1.7B–24B) do not store broad encyclopedic trivia—must be paired with RAG for factual Q&A',
      'Not designed for 50-file autonomous repository refactoring compared to Claude Opus 5.5 or GPT-6.1',
      'Primarily text/structured-data focused'
    ],
    qaEngineerVerdict:
      'Choose when building ultra-fast local/on-device guardrails, PII redaction filters, CI test classifiers, or Apache 2.0 indemnified enterprise microservices.',
    officialUrl: 'https://www.liquid.ai'
  },
  {
    id: 'cohere/command-a-plus',
    name: 'Cohere Command A+ & Rerank v5 Pro (Enterprise RAG)',
    versionLabel: 'command-a-plus / rerank-v5-pro',
    provider: 'Cohere',
    providerKey: 'cohere',
    country: 'Canada',
    countryFlag: '🇨🇦',
    headquarters: 'Toronto, Canada',
    releaseDateLabel: 'Sep 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-09-22T00:00:00Z'),
    contextWindowTokens: 192000,
    promptPricePerMillion: '$2.50',
    completionPricePerMillion: '$10.00',
    licenseType: 'Proprietary API',
    licenseDetail: 'Enterprise API & Private On-Prem VPC',
    modalities: ['Text', 'Citation-Backed RAG', 'Cross-Encoder Rerank v5', 'Embed v5'],
    categoryBadge: 'Sovereign / Regional AI',
    pros: [
      'Sep 2026 `Command A+` paired with `Cohere Rerank v5 Pro` / `v5 Fast` and `Embed v5.0 Pro`',
      'Purpose-built for enterprise RAG with character-level inline source citations that make hallucination auditing trivial for QA',
      'Deploys efficiently inside private enterprise VPCs or air-gapped on-premise clusters'
    ],
    cons: [
      '192K context window is smaller than 1M-token competitors',
      'Not aimed at consumer video/audio generation',
      'Open-weights research checkpoints require a commercial license for production revenue use'
    ],
    qaEngineerVerdict:
      'Pair `Cohere Rerank v5 Pro` with any vector database to immediately boost RAG retrieval precision and citation faithfulness.',
    officialUrl: 'https://docs.cohere.com'
  },
  {
    id: 'sakana/fugu-ultra-v2',
    name: 'Sakana Fugu Ultra v2 (🇯🇵), Upstage Solar Mini 4 (🇰🇷) & Sarvam-M (🇮🇳)',
    versionLabel: 'fugu-ultra-v2 / solar-mini4 / sarvam-m',
    provider: 'Sakana AI',
    providerKey: 'sakana',
    country: 'Japan',
    countryFlag: '🇯🇵',
    headquarters: 'Tokyo (🇯🇵) / Seoul (🇰🇷) / Bengaluru (🇮🇳)',
    releaseDateLabel: 'Sep 2026 (Latest)',
    releaseTimestampMs: Date.parse('2026-09-23T00:00:00Z'),
    contextWindowTokens: 1000000,
    promptPricePerMillion: '$0.30',
    completionPricePerMillion: '$1.20',
    licenseType: 'Open-Weights / Open-Source',
    licenseDetail: 'Sovereign Regional Open-Weights & APIs',
    modalities: ['Text', 'Multilingual (JP/KR/Indic/EN)', 'Document OCR', 'Voice'],
    categoryBadge: 'Sovereign / Regional AI',
    pros: [
      'Sep 2026 `Sakana Fugu Ultra v2` & `Fugu Max` (🇯🇵 1M ctx), `Upstage Solar Mini 4` (🇰🇷 524K ctx), and `Sarvam-M` / `Krutrim-2` (🇮🇳 Apache 2.0)',
      'Custom tokenizers deliver 3–4x better token efficiency and accuracy on Japanese, Korean, and 10+ Indian languages (Marathi, Hindi, Tamil, etc.)',
      'Meets strict national data-sovereignty regulations across Japan, South Korea, and India'
    ],
    cons: [
      'Smaller global plugin ecosystems outside their respective regional clouds and unified gateways (OpenRouter / Vercel Gateway)',
      'Less specialized for Western legal/medical compliance than US frontier models',
      'Some regional endpoints require localized cloud accounts unless accessed via OpenRouter/Vercel AI Gateway'
    ],
    qaEngineerVerdict:
      'Essential when building or testing APAC and Indian enterprise apps where regional language tokenization, OCR, and data sovereignty matter.',
    officialUrl: 'https://sakana.ai'
  }
];

function inferProviderKey(modelId: string, ownedBy?: string): string {
  const prefix = (ownedBy || modelId.split('/')[0] || '').toLowerCase().replace(/^~/, '');
  if (PROVIDER_COUNTRY_MAP[prefix]) return prefix;
  if (prefix.includes('openai')) return 'openai';
  if (prefix.includes('anthropic')) return 'anthropic';
  if (prefix.includes('google')) return 'google';
  if (prefix.includes('nvidia')) return 'nvidia';
  if (prefix.includes('x-ai') || prefix.includes('spacexai') || prefix.includes('grok')) return 'x-ai';
  if (prefix.includes('meta')) return 'meta';
  if (prefix.includes('deepseek')) return 'deepseek';
  if (prefix.includes('qwen') || prefix.includes('alibaba')) return 'qwen';
  if (prefix.includes('mistral')) return 'mistralai';
  if (prefix.includes('moonshot') || prefix.includes('kimi')) return 'moonshotai';
  if (prefix.includes('z-ai') || prefix.includes('zai') || prefix.includes('thudm') || prefix.includes('zhipu') || prefix.includes('glm')) return 'zai';
  if (prefix.includes('minimax')) return 'minimax';
  if (prefix.includes('tencent') || prefix.includes('hunyuan')) return 'tencent';
  if (prefix.includes('xiaomi') || prefix.includes('mimo')) return 'xiaomi';
  if (prefix.includes('bytedance') || prefix.includes('seed')) return 'bytedance';
  if (prefix.includes('liquid')) return 'liquid';
  if (prefix.includes('ibm') || prefix.includes('granite')) return 'ibm';
  if (prefix.includes('microsoft') || prefix.includes('phi')) return 'microsoft';
  if (prefix.includes('cohere')) return 'cohere';
  if (prefix.includes('sakana')) return 'sakana';
  if (prefix.includes('upstage') || prefix.includes('solar')) return 'upstage';
  if (prefix.includes('sarvam') || prefix.includes('krutrim')) return 'sarvam';
  return '';
}

function formatPricePerMillion(rawPerToken?: string | number): string {
  const num = Number(rawPerToken);
  if (!Number.isFinite(num) || num <= 0) return 'Free / Open';
  const perMillion = num * 1_000_000;
  if (perMillion < 0.05) return `$${perMillion.toFixed(3)}`;
  return `$${perMillion.toFixed(2)}`;
}

function detectOpenWeightsFromSlug(id: string, defaultLicense: ProviderCountryMeta['licenseType']): ProviderCountryMeta['licenseType'] {
  const lower = id.toLowerCase();
  if (
    lower.includes('gemma') ||
    lower.includes('gpt-oss') ||
    lower.includes('devstral') ||
    lower.includes('codestral') ||
    lower.includes('mistral-small') ||
    lower.includes('mistral-nemo') ||
    lower.includes('muse-spark-open') ||
    lower.includes('llama') ||
    lower.includes('nemotron') ||
    lower.includes('deepseek') ||
    lower.includes('qwen') ||
    lower.includes('glm') ||
    lower.includes('granite') ||
    lower.includes('phi') ||
    lower.includes('lfm') ||
    lower.includes('mimo')
  ) {
    return 'Open-Weights / Open-Source';
  }
  return defaultLicense;
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

      // Filter out duplicate `:batch` and `:free` aliases and ~routers, keep all tracked labs sorted newest first
      const relevant = rawList
        .filter((m: { id?: string; created?: number }) => {
          if (!m?.id) return false;
          if (m.id.startsWith('~') || m.id.includes(':batch') || m.id.includes(':free')) return false;
          return Boolean(inferProviderKey(m.id));
        })
        .sort((a: { created?: number }, b: { created?: number }) => (b.created || 0) - (a.created || 0))
        .slice(0, 65);

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

        const licenseType = detectOpenWeightsFromSlug(item.id, meta.licenseType);
        const createdMs = (Number(item.created) || Math.floor(Date.now() / 1000)) * 1000;
        const releaseDateLabel = new Date(createdMs).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });

        const shortVersion = item.id.split('/')[1] || item.id;

        const dynamicPros = [
          ctx >= 500000
            ? `Massive ${Math.round(ctx / 1000).toLocaleString()}K token context window with ${inputMods.join(' + ')} support`
            : `${Math.round(ctx / 1000).toLocaleString()}K context window (${inputMods.join(' + ')}) — Input: ${promptCost}/1M tokens`,
          ...meta.defaultPros.slice(0, 2)
        ];

        const dynamicCons = [...meta.defaultCons.slice(0, 3)];

        discoveredModels.push({
          id: item.id,
          name: item.name || shortVersion,
          versionLabel: shortVersion,
          provider: meta.provider,
          providerKey: meta.providerKey,
          country: meta.country,
          countryFlag: meta.countryFlag,
          headquarters: meta.headquarters,
          releaseDateLabel: `Launched ${releaseDateLabel}`,
          releaseTimestampMs: createdMs,
          contextWindowTokens: ctx,
          promptPricePerMillion: promptCost,
          completionPricePerMillion: completionCost,
          licenseType,
          licenseDetail: meta.licenseDetail,
          modalities: inputMods,
          categoryBadge:
            shortVersion.includes('r1') ||
            shortVersion.includes('pro') ||
            shortVersion.includes('astra') ||
            shortVersion.includes('fable') ||
            shortVersion.includes('argon') ||
            shortVersion.includes('grok')
              ? 'Frontier Reasoning'
              : shortVersion.includes('code') || shortVersion.includes('sonnet') || shortVersion.includes('devstral')
              ? 'Coding & Agents'
              : licenseType === 'Open-Weights / Open-Source'
              ? 'Open-Weights Leader'
              : 'Multimodal Flagship',
          pros: dynamicPros,
          cons: dynamicCons,
          qaEngineerVerdict: `Live ${meta.provider} (${meta.countryFlag} ${meta.country}) release \`${item.id}\` (${releaseDateLabel}) — ${ctx.toLocaleString()} context window, ${licenseType}.`,
          officialUrl: meta.officialUrl,
          isLiveDiscovered: true
        });
      }
    }
  } catch {
    // Graceful fallback when offline
  }

  // Merge Curated 2026 Flagship & Open-Source Reference Cards + Live-Discovered Models
  // Deduplicate by exact model ID so every unique live version is preserved and searchable!
  const seenIds = new Set<string>();
  const combined: GlobalAiModel[] = [];

  for (const m of [...CURATED_GLOBAL_MODELS, ...discoveredModels]) {
    const key = m.id.toLowerCase();
    if (!seenIds.has(key)) {
      seenIds.add(key);
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
      ? combined.slice(0, 4)
      : combined.filter((m) => !previouslySeen.includes(m.id));

  try {
    localStorage.setItem(
      SEEN_MODELS_STORAGE_KEY,
      JSON.stringify(Array.from(new Set([...previouslySeen, ...combined.map((m) => m.id)])).slice(-300))
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
