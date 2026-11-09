import React, { useState, useMemo } from 'react';
import { Sliders, Cpu, Search, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

// ============================================================================
// SIMULATOR 1: LIVE TOKENIZER & TEMPERATURE / TOP-P PROBABILITY PLAYGROUND
// ============================================================================
const TOKEN_COLORS = [
  'bg-rose-100 text-rose-900 border-rose-300',
  'bg-amber-100 text-amber-900 border-amber-300',
  'bg-emerald-100 text-emerald-900 border-emerald-300',
  'bg-sky-100 text-sky-900 border-sky-300',
  'bg-purple-100 text-purple-900 border-purple-300'
];

const RAW_LOGITS = [
  { token: '"P1_CRITICAL"', rawLogit: 4.2, note: 'Strict Schema Enum (Best for JSON)' },
  { token: '"High"', rawLogit: 3.1, note: 'Informal Synonym (Breaks Enum)' },
  { token: '"Urgent"', rawLogit: 2.5, note: 'Conversational Synonym' },
  { token: '"Severe"', rawLogit: 1.8, note: 'Creative Adjective' },
  { token: '" catastrophic!!"', rawLogit: 0.9, note: 'Hallucinated Tail Token' }
];

export const TokenizerAndTemperatureSimulator: React.FC = () => {
  const [sampleText, setSampleText] = useState(
    'Order #99812-UUID-8f3c failed on iOS 18.2 with ERR_PAYMENT_TIMEOUT.'
  );
  const [temperature, setTemperature] = useState<number>(0.0);
  const [topP, setTopP] = useState<number>(1.0);

  // Realistic sub-word BPE simulation
  const tokens = useMemo(() => {
    if (!sampleText) return [];
    const rawParts = sampleText.match(/([A-Z]{2,}|[a-z]+|[0-9]{1,3}|[^\sA-Za-z0-9]+|\s+)/g) || [];
    const splitTokens: string[] = [];
    rawParts.forEach((part) => {
      if (part.length > 6 && /^[a-zA-Z]+$/.test(part)) {
        splitTokens.push(part.slice(0, 4), part.slice(4));
      } else {
        splitTokens.push(part);
      }
    });
    return splitTokens;
  }, [sampleText]);

  // Compute Softmax with Temperature & Top-P cutoff
  const distribution = useMemo(() => {
    const effTemp = Math.max(0.05, temperature);
    const scaled = RAW_LOGITS.map((item) => ({
      ...item,
      expVal: temperature === 0 ? (item.rawLogit === 4.2 ? 1 : 0) : Math.exp(item.rawLogit / effTemp)
    }));
    const sumExp = scaled.reduce((acc, i) => acc + i.expVal, 0);

    let cumulative = 0;
    return scaled.map((item) => {
      const prob = item.expVal / sumExp;
      const prevCumulative = cumulative;
      cumulative += prob;
      const includedInTopP = temperature === 0 ? prob > 0 : prevCumulative < topP;
      return {
        ...item,
        probabilityPct: Math.round(prob * 1000) / 10,
        includedInTopP
      };
    });
  }, [temperature, topP]);

  return (
    <div className="rounded-2xl border-2 border-[#9E4758]/40 bg-white p-5 md:p-6 shadow-editorial space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5EBE6] pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider mb-1.5">
            <Sliders className="w-3.5 h-3.5" /> Interactive Hands-On Lab Simulator
          </span>
          <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
            Live BPE Tokenizer & Temperature / Top-P Probability Engine
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Type below to see how LLMs chop strings into sub-word tokens, then drag the Temperature slider to see why `temperature = 0` prevents JSON schema bugs!
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Live BPE Tokenizer */}
        <div className="space-y-3 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8A598]/50">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
              1. Type or Paste Input Text to Tokenize Live:
            </label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() =>
                  setSampleText('Simple English sentences use very few tokens.')
                }
                className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#E8A598] text-[#9E4758] font-semibold"
              >
                Prose Preset
              </button>
              <button
                type="button"
                onClick={() =>
                  setSampleText('UUID: a8f9-4b2c-991e-77d2 | SKU: ERR_AUTH_504_B')
                }
                className="text-[11px] px-2 py-0.5 rounded bg-white border border-[#E8A598] text-[#9E4758] font-semibold"
              >
                UUID/Code Preset
              </button>
            </div>
          </div>

          <textarea
            rows={2}
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full rounded-xl border border-[#E8A598] bg-white p-3 text-xs sm:text-sm font-mono text-[#1E293B] focus:outline-none focus:border-[#9E4758]"
          />

          <div className="text-xs font-semibold text-[#64748B]">
            Live Sub-Word Token Stream ({tokens.length} tokens from {sampleText.length} chars →{' '}
            <span className="text-[#9E4758] font-mono">
              {(sampleText.length / Math.max(1, tokens.length)).toFixed(1)} chars/token
            </span>
            ):
          </div>

          <div className="p-3 rounded-xl bg-white border border-slate-200 flex flex-wrap gap-1.5 min-h-[68px]">
            {tokens.map((tok, i) => (
              <span
                key={i}
                className={`px-2 py-0.5 rounded border text-xs font-mono ${
                  TOKEN_COLORS[i % TOKEN_COLORS.length]
                }`}
              >
                {tok === ' ' ? '␣' : tok}
              </span>
            ))}
          </div>

          <div className="text-[11px] text-[#1E293B] bg-white p-2.5 rounded-lg border border-[#E8A598]/40">
            💡 <strong>QA Insight:</strong> Notice how UUIDs, numbers, and error codes split into 3x more tokens than plain English words! Always replace long UUIDs with short aliases (`DOC_1`) before prompting.
          </div>
        </div>

        {/* Right: Live Temperature & Top-P Softmax Simulator */}
        <div className="space-y-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8A598]/50">
          <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
            2. Drag Sliders to See How Temperature & Top-P Change Next-Token Choice:
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-xl border border-slate-200">
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Temperature:</span>
                <span className="font-mono text-[#9E4758]">{temperature.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.5"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full accent-[#9E4758]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>0.0 (Deterministic JSON)</span>
                <span>1.5 (Wild/Creative)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span>Top-P (Nucleus Cutoff):</span>
                <span className="font-mono text-[#9E4758]">{topP.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.2"
                max="1.0"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full accent-[#9E4758]"
              />
              <div className="flex justify-between text-[10px] text-[#64748B]">
                <span>0.2 (Strict Top 20%)</span>
                <span>1.0 (All Tokens)</span>
              </div>
            </div>
          </div>

          {temperature > 0 && topP < 1.0 && (
            <div className="rounded-lg bg-rose-50 border border-rose-300 p-2.5 text-xs text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                <strong>Production Warning:</strong> You are tuning BOTH Temperature ({temperature}) and Top-P ({topP}) simultaneously! In interviews and production, tune one and leave the other at default.
              </span>
            </div>
          )}

          {/* Probability Bars */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-[#1E293B]">
              Next Token Candidates for JSON field <code>"severity": ___</code>
            </div>
            {distribution.map((item) => (
              <div
                key={item.token}
                className={`p-2 rounded-lg border text-xs transition-all ${
                  item.includedInTopP
                    ? 'bg-white border-slate-200'
                    : 'bg-slate-100 border-slate-200 opacity-45'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <code className="font-bold text-[#9E4758]">{item.token}</code>
                    <span className="text-[11px] text-[#64748B]">{item.note}</span>
                  </div>
                  <span className="font-mono font-bold text-[#1E293B]">
                    {item.probabilityPct}% {!item.includedInTopP && '(Cut by Top-P)'}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      item.includedInTopP ? 'bg-[#9E4758]' : 'bg-slate-400'
                    }`}
                    style={{ width: `${Math.max(2, item.probabilityPct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SIMULATOR 2: LIVE RAG CHUNKING, CONTEXTUAL HEADERS & HYBRID SEARCH LAB
// ============================================================================
const SAMPLE_POLICY_DOC = `SECTION 4.2: PARENTAL LEAVE & CERTIFICATION BENEFITS (Code: HR-BEN-402B)
Full-time salaried engineers with at least 90 days of continuous tenure receive 16 weeks of paid parental leave at 100% base salary.
Additionally, eligible engineers receive up to $1,500 per calendar year for official AI and Cloud certification exams (including Anthropic Claude and Google Cloud Vertex AI certifications).
Contractors and temporary summer interns are not eligible for policy HR-BEN-402B reimbursements unless explicitly approved in writing by the VP of Engineering.`;

export const RagChunkingAndHybridSimulator: React.FC = () => {
  const [chunkSize, setChunkSize] = useState<number>(180);
  const [overlapPct, setOverlapPct] = useState<number>(15);
  const [prependContextHeader, setPrependContextHeader] = useState<boolean>(true);
  const [testQuery, setTestQuery] = useState<string>('HR-BEN-402B');

  const chunks = useMemo(() => {
    const step = Math.max(40, Math.floor(chunkSize * (1 - overlapPct / 100)));
    const result: Array<{
      id: string;
      text: string;
      vectorScore: number;
      bm25Score: number;
      rrfScore: number;
    }> = [];

    for (let start = 0, idx = 1; start < SAMPLE_POLICY_DOC.length; start += step, idx++) {
      const rawSlice = SAMPLE_POLICY_DOC.slice(start, start + chunkSize);
      const fullText = prependContextHeader
        ? `[Doc: Employee_Handbook.pdf | Section 4.2 | Code: HR-BEN-402B]\n${rawSlice}`
        : rawSlice;

      const qLower = testQuery.toLowerCase();
      const textLower = fullText.toLowerCase();

      // Simulate BM25 exact keyword match vs semantic vector match
      const hasExactCode = textLower.includes(qLower);
      const bm25Score = hasExactCode ? 0.96 : qLower.split(' ').some((w) => w.length > 3 && textLower.includes(w)) ? 0.65 : 0.12;
      const vectorScore =
        textLower.includes('parental') || textLower.includes('certification') ? 0.88 - idx * 0.04 : 0.55;

      result.push({
        id: `Chunk #${idx}`,
        text: fullText,
        vectorScore: Number(vectorScore.toFixed(2)),
        bm25Score: Number(bm25Score.toFixed(2)),
        rrfScore: Number(((vectorScore + bm25Score) / 2).toFixed(2))
      });
      if (start + chunkSize >= SAMPLE_POLICY_DOC.length) break;
    }
    return result;
  }, [chunkSize, overlapPct, prependContextHeader, testQuery]);

  return (
    <div className="rounded-2xl border-2 border-[#9E4758]/40 bg-white p-5 md:p-6 shadow-editorial space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F5EBE6] pb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider mb-1.5">
            <Search className="w-3.5 h-3.5" /> Interactive RAG & Hybrid Search Workbench
          </span>
          <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
            Experiment with Chunk Size, Overlap, Contextual Prepending & BM25 + Vector Search
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Toggle "Contextual Header Prepending" off and on to see why raw chunking creates orphan chunks that lose their policy code!
          </p>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-[#FAF7F2] p-4 rounded-xl border border-[#E8A598]/50">
        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span>Chunk Size (Chars):</span>
            <span className="font-mono text-[#9E4758]">{chunkSize} chars</span>
          </div>
          <input
            type="range"
            min="120"
            max="320"
            step="20"
            value={chunkSize}
            onChange={(e) => setChunkSize(Number(e.target.value))}
            className="w-full accent-[#9E4758]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs font-bold mb-1">
            <span>Chunk Overlap (%):</span>
            <span className="font-mono text-[#9E4758]">{overlapPct}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="30"
            step="5"
            value={overlapPct}
            onChange={(e) => setOverlapPct(Number(e.target.value))}
            className="w-full accent-[#9E4758]"
          />
        </div>

        <div className="flex items-center">
          <label className="inline-flex items-center gap-2.5 cursor-pointer text-xs font-bold text-[#1E293B]">
            <input
              type="checkbox"
              checked={prependContextHeader}
              onChange={(e) => setPrependContextHeader(e.target.checked)}
              className="w-4 h-4 accent-[#9E4758] rounded"
            />
            <span>Prepend Contextual Header (Anthropic Contextual RAG)</span>
          </label>
        </div>
      </div>

      {/* Search Test Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-[#1E293B]">Test Search Query:</span>
        {[
          { label: 'Exact Code: "HR-BEN-402B"', q: 'HR-BEN-402B' },
          { label: 'Semantic: "intern certification refund"', q: 'interns certification' },
          { label: 'Semantic: "16 weeks paid leave"', q: '16 weeks paid parental' }
        ].map((preset) => (
          <button
            key={preset.label}
            type="button"
            onClick={() => setTestQuery(preset.q)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
              testQuery === preset.q
                ? 'bg-[#9E4758] text-white border-[#9E4758]'
                : 'bg-[#FAF7F2] text-[#1E293B] border-[#E8A598]/50'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Resulting Chunks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {chunks.map((c) => (
          <div
            key={c.id}
            className="rounded-xl border border-[#E8A598]/60 bg-[#FAF7F2]/60 p-4 flex flex-col justify-between space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-bold text-[#9E4758] mb-2">
                <span>{c.id}</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-[#E8A598]/40">
                  Hybrid RRF: {c.rrfScore}
                </span>
              </div>
              <pre className="text-[11px] font-mono text-[#1E293B] bg-white p-3 rounded-lg border border-slate-200 whitespace-pre-wrap leading-relaxed">
                {c.text}
              </pre>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8A598]/30 text-[11px] font-mono">
              <div className="bg-white p-1.5 rounded border border-slate-200">
                Vector: <strong>{c.vectorScore}</strong>
              </div>
              <div className="bg-white p-1.5 rounded border border-slate-200">
                BM25: <strong className={c.bm25Score > 0.8 ? 'text-emerald-700' : 'text-rose-700'}>{c.bm25Score}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
