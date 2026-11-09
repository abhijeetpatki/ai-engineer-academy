export interface LiveAiNewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  publishedAt: string;
  timestampMs: number;
  category: 'Anthropic & Claude' | 'Google & Gemini' | 'RAG, Agents & MCP' | 'AI Evals & QA' | 'LLM Breakthroughs';
  pointsOrStars?: number;
  qaEngineerTakeaway: string;
  isLiveFetched: boolean;
}

const SEEN_NEWS_STORAGE_KEY = 'ai_academy_seen_news_ids_v1';

function categorizeStory(title: string): {
  category: LiveAiNewsItem['category'];
  qaEngineerTakeaway: string;
} {
  const lower = title.toLowerCase();
  if (lower.includes('claude') || lower.includes('anthropic') || lower.includes('mcp') || lower.includes('model context protocol')) {
    return {
      category: 'Anthropic & Claude',
      qaEngineerTakeaway:
        'Anthropic & MCP updates directly impact how we structure XML system prompts, tool-calling schemas, and agent integrations.'
    };
  }
  if (lower.includes('gemini') || lower.includes('vertex') || lower.includes('deepmind') || lower.includes('google ai')) {
    return {
      category: 'Google & Gemini',
      qaEngineerTakeaway:
        'Google Gemini & Vertex AI releases expand native multimodal testing (video/PDF/audio) and enterprise grounding capabilities.'
    };
  }
  if (lower.includes('eval') || lower.includes('test') || lower.includes('benchmark') || lower.includes('hallucinat') || lower.includes('security') || lower.includes('injection')) {
    return {
      category: 'AI Evals & QA',
      qaEngineerTakeaway:
        'Directly relevant to your QA-to-AI superpower: use new benchmarks and red-teaming findings to harden your CI/CD eval gates.'
    };
  }
  if (lower.includes('rag') || lower.includes('agent') || lower.includes('vector') || lower.includes('embedding') || lower.includes('tool')) {
    return {
      category: 'RAG, Agents & MCP',
      qaEngineerTakeaway:
        'Watch how retrieval architectures and bounded agent workflows evolve to reduce latency and prevent multi-step loop failures.'
    };
  }
  return {
    category: 'LLM Breakthroughs',
    qaEngineerTakeaway:
      'New model architectures shift the cost/latency/accuracy Pareto frontier—always benchmark new models against your Golden Eval Suite!'
  };
}

export const CURATED_FALLBACK_NEWS: LiveAiNewsItem[] = [
  {
    id: 'curated-mcp-streamable',
    title: 'Anthropic Model Context Protocol (MCP) Streamable HTTP & Enterprise Tool Registry Updates',
    url: 'https://modelcontextprotocol.io',
    source: 'Model Context Protocol Official',
    publishedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    timestampMs: Date.now() - 2 * 3600 * 1000,
    category: 'Anthropic & Claude',
    pointsOrStars: 420,
    qaEngineerTakeaway:
      'Playwright MCP and GitHub MCP servers now support remote Streamable HTTP sessions, enabling cloud CI/CD agents to run browser verification safely.',
    isLiveFetched: false
  },
  {
    id: 'curated-gemini-multimodal-evals',
    title: 'Google Cloud Vertex AI GenAI Evaluation Service: Native Multimodal & Grounding Rubrics',
    url: 'https://cloud.google.com/vertex-ai/generative-ai/docs',
    source: 'Google Cloud AI Engineering',
    publishedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    timestampMs: Date.now() - 5 * 3600 * 1000,
    category: 'Google & Gemini',
    pointsOrStars: 315,
    qaEngineerTakeaway:
      'Allows QA & AI Engineers to run automated pointwise and pairwise LLM-as-a-Judge evaluations directly against BigQuery golden datasets.',
    isLiveFetched: false
  },
  {
    id: 'curated-owasp-agentic',
    title: 'OWASP GenAI Security Project Releases Updated Agentic AI & Indirect Prompt Injection Defense Guide',
    url: 'https://genai.owasp.org',
    source: 'OWASP GenAI Project',
    publishedAt: new Date(Date.now() - 9 * 3600 * 1000).toISOString(),
    timestampMs: Date.now() - 9 * 3600 * 1000,
    category: 'AI Evals & QA',
    pointsOrStars: 510,
    qaEngineerTakeaway:
      'Essential checklist for red-teaming tool-calling agents against Confused Deputy attacks, unauthorized tool arguments, and RAG data poisoning.',
    isLiveFetched: false
  }
];

export async function fetchLiveAiNews(): Promise<{
  items: LiveAiNewsItem[];
  newSinceLastVisit: LiveAiNewsItem[];
  lastUpdatedIso: string;
}> {
  const liveItems: LiveAiNewsItem[] = [];

  try {
    // Query Hacker News Algolia real-time API for high-signal AI Engineering stories
    const query = encodeURIComponent(
      '"LLM" OR "Claude" OR "Anthropic" OR "Gemini" OR "RAG" OR "Model Context Protocol" OR "AI Agent"'
    );
    const response = await fetch(
      `https://hn.algolia.com/api/v1/search_by_date?query=${query}&tags=story&numericFilters=points>15&hitsPerPage=18`
    );

    if (response.ok) {
      const data = await response.json();
      const hits: any[] = data.hits || [];

      for (const hit of hits) {
        if (!hit.title) continue;
        const { category, qaEngineerTakeaway } = categorizeStory(hit.title);
        const articleUrl =
          hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;

        let hostname = 'Hacker News AI';
        try {
          if (hit.url) {
            hostname = new URL(hit.url).hostname.replace(/^www\./, '');
          }
        } catch {
          // keep default
        }

        liveItems.push({
          id: `hn-${hit.objectID}`,
          title: hit.title,
          url: articleUrl,
          source: hostname,
          publishedAt: hit.created_at || new Date().toISOString(),
          timestampMs: hit.created_at_i ? hit.created_at_i * 1000 : Date.now(),
          category,
          pointsOrStars: hit.points || 20,
          qaEngineerTakeaway,
          isLiveFetched: true
        });
      }
    }
  } catch (err) {
    console.warn('Live HN AI news fetch fallback triggered:', err);
  }

  // Merge live items with curated engineering highlights, sorted newest first
  const combined = [...liveItems, ...CURATED_FALLBACK_NEWS].sort(
    (a, b) => b.timestampMs - a.timestampMs
  );

  // Deduplicate by title
  const seenTitles = new Set<string>();
  const uniqueItems: LiveAiNewsItem[] = [];
  for (const item of combined) {
    const norm = item.title.toLowerCase().trim();
    if (!seenTitles.has(norm)) {
      seenTitles.add(norm);
      uniqueItems.push(item);
    }
  }

  // Detect new articles since user's last check
  let previouslySeenIds: string[] = [];
  try {
    const raw = localStorage.getItem(SEEN_NEWS_STORAGE_KEY);
    if (raw) previouslySeenIds = JSON.parse(raw);
  } catch {
    // ignore
  }

  const newSinceLastVisit =
    previouslySeenIds.length === 0
      ? uniqueItems.slice(0, 3)
      : uniqueItems.filter((item) => !previouslySeenIds.includes(item.id));

  // Save current IDs
  try {
    localStorage.setItem(
      SEEN_NEWS_STORAGE_KEY,
      JSON.stringify(uniqueItems.map((i) => i.id).slice(0, 50))
    );
  } catch {
    // ignore
  }

  return {
    items: uniqueItems.slice(0, 18),
    newSinceLastVisit,
    lastUpdatedIso: new Date().toISOString()
  };
}
