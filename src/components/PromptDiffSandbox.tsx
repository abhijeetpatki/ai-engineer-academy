import React, { useState } from 'react';
import { AlertTriangle, CheckCircle2, Sparkles, ArrowLeftRight, Code2, ShieldAlert } from 'lucide-react';
import { PromptComparisonScenario } from '../types/academy';

interface Props {
  scenarios: PromptComparisonScenario[];
}

export const PromptDiffSandbox: React.FC<Props> = ({ scenarios }) => {
  const [selectedId, setSelectedId] = useState<string>(scenarios[0]?.id || '');
  const active = scenarios.find((s) => s.id === selectedId) || scenarios[0];

  if (!active) return null;

  return (
    <div className="rounded-2xl border border-[#E8A598]/50 bg-[#FAF7F2] p-5 md:p-6 shadow-editorial">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <ArrowLeftRight className="w-3.5 h-3.5" />
            Interactive Prompt Engineering Sandbox
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
            Weak Prompt vs. Engineered XML Prompt (Side-by-Side Diff)
          </h3>
          <p className="text-sm text-[#64748B] mt-0.5">
            Switch scenarios below to inspect how XML tags, explicit null handling, and grounding rules eliminate hallucinations.
          </p>
        </div>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {scenarios.map((scen) => (
          <button
            key={scen.id}
            type="button"
            onClick={() => setSelectedId(scen.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
              scen.id === active.id
                ? 'bg-[#9E4758] text-white shadow-sm'
                : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#F5EBE6]'
            }`}
          >
            {scen.title}
          </button>
        ))}
      </div>

      {/* Metrics Delta Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl p-3.5 border border-[#E8A598]/40">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Hallucination Risk Delta
          </div>
          <div className="text-base font-bold text-[#9E4758] font-mono mt-1">
            {active.metricsDelta.hallucinationRisk}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-[#E8A598]/40">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            JSON Schema Compliance
          </div>
          <div className="text-base font-bold text-emerald-700 font-mono mt-1">
            {active.metricsDelta.schemaCompliance}
          </div>
        </div>
        <div className="bg-white rounded-xl p-3.5 border border-[#E8A598]/40">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
            Production Determinism
          </div>
          <div className="text-base font-bold text-[#1E293B] font-mono mt-1">
            {active.metricsDelta.determinismScore}
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: Naive / Weak Prompt */}
        <div className="rounded-xl border-2 border-rose-200 bg-white p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-rose-100">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" />
              Weak / Naive Prompt
            </span>
            <span className="text-xs text-[#64748B] font-mono">Fails in Production</span>
          </div>

          <div className="text-xs font-semibold text-[#64748B] uppercase mb-1.5">Prompt Input:</div>
          <pre className="text-xs font-mono bg-rose-50/50 text-[#1E293B] p-3 rounded-lg border border-rose-200/60 whitespace-pre-wrap mb-4 overflow-x-auto">
            {active.weakPrompt}
          </pre>

          <div className="text-xs font-semibold text-[#64748B] uppercase mb-1.5">Model Output (Flawed):</div>
          <pre className="text-xs font-mono bg-slate-900 text-rose-200 p-3 rounded-lg whitespace-pre-wrap mb-4 overflow-x-auto">
            {active.weakOutput}
          </pre>

          <div className="mt-auto rounded-lg bg-rose-50 p-3 border border-rose-200">
            <div className="text-xs font-bold text-rose-800 mb-1.5 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4" /> QA Defect Root-Cause Analysis:
            </div>
            <ul className="space-y-1.5">
              {active.weakFlaws.map((flaw, i) => (
                <li key={i} className="text-xs text-rose-900 flex items-start gap-1.5">
                  <span className="font-bold text-rose-600">×</span>
                  <span>{flaw}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* RIGHT: Engineered Production Prompt */}
        <div className="rounded-xl border-2 border-emerald-300 bg-white p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-emerald-100">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Engineered XML Prompt
            </span>
            <span className="text-xs text-emerald-700 font-mono font-semibold">Production Grade ✨</span>
          </div>

          <div className="text-xs font-semibold text-[#64748B] uppercase mb-1.5">Engineered XML Input:</div>
          <pre className="text-xs font-mono bg-emerald-50/40 text-[#1E293B] p-3 rounded-lg border border-emerald-200/80 whitespace-pre-wrap mb-4 overflow-x-auto">
            {active.engineeredPrompt}
          </pre>

          <div className="text-xs font-semibold text-[#64748B] uppercase mb-1.5">Verified Deterministic Output:</div>
          <pre className="text-xs font-mono bg-slate-900 text-emerald-200 p-3 rounded-lg whitespace-pre-wrap mb-4 overflow-x-auto">
            {active.engineeredOutput}
          </pre>

          <div className="mt-auto rounded-lg bg-emerald-50 p-3 border border-emerald-200">
            <div className="text-xs font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-700" /> Why This Passes Production QA Gates:
            </div>
            <ul className="space-y-1.5">
              {active.improvements.map((imp, i) => (
                <li key={i} className="text-xs text-emerald-900 flex items-start gap-1.5">
                  <span className="font-bold text-emerald-600">✓</span>
                  <span>{imp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
