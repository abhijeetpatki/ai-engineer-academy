import React, { useState, useEffect } from 'react';
import {
  FlaskConical,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Copy,
  Check,
  RotateCcw,
  FileCode2,
  Award,
  ShieldCheck
} from 'lucide-react';
import { PRACTICAL_LAB_TASKS } from '../data/practicalLabs';
import { gradeLabSubmission, buildExternalLlmJudgePrompt } from '../utils/labGrader';
import { useAcademy } from '../context/AcademyContext';
import { LabScoreBreakdown } from '../types/academy';

export const PracticalLabsPage: React.FC = () => {
  const { labSubmissions, saveLabSubmission } = useAcademy();
  const [selectedTaskId, setSelectedTaskId] = useState<string>(PRACTICAL_LAB_TASKS[0].id);

  const activeTask =
    PRACTICAL_LAB_TASKS.find((t) => t.id === selectedTaskId) || PRACTICAL_LAB_TASKS[0];

  const savedSub = labSubmissions[activeTask.id];
  const [editorText, setEditorText] = useState<string>(
    savedSub ? savedSub.code : activeTask.starterTemplate
  );
  const [latestBreakdown, setLatestBreakdown] = useState<LabScoreBreakdown | null>(
    savedSub ? savedSub.breakdown : null
  );
  const [copiedJudgePrompt, setCopiedJudgePrompt] = useState(false);

  useEffect(() => {
    const existing = labSubmissions[activeTask.id];
    setEditorText(existing ? existing.code : activeTask.starterTemplate);
    setLatestBreakdown(existing ? existing.breakdown : null);
    setCopiedJudgePrompt(false);
  }, [activeTask.id, activeTask.starterTemplate, labSubmissions]);

  const handleRunAiJudge = () => {
    const result = gradeLabSubmission(activeTask, editorText);
    setLatestBreakdown(result);
    saveLabSubmission(activeTask.id, editorText, result);
  };

  const handleLoadExemplar = () => {
    setEditorText(activeTask.exemplarSolution);
    const result = gradeLabSubmission(activeTask, activeTask.exemplarSolution);
    setLatestBreakdown(result);
    saveLabSubmission(activeTask.id, activeTask.exemplarSolution, result);
  };

  const handleResetStarter = () => {
    setEditorText(activeTask.starterTemplate);
    setLatestBreakdown(null);
  };

  const handleCopyExternalJudgePrompt = async () => {
    const promptText = buildExternalLlmJudgePrompt(activeTask, editorText);
    try {
      await navigator.clipboard.writeText(promptText);
      setCopiedJudgePrompt(true);
      setTimeout(() => setCopiedJudgePrompt(false), 3000);
    } catch {
      // Fallback
    }
  };

  const passedCount = Object.values(labSubmissions).filter((s) => s.breakdown.total >= 80).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider">
            <FlaskConical className="w-3.5 h-3.5" />
            Pro AI Engineer Hub • Build & Get Judged Arena
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-white border border-[#E8A598] text-xs font-bold text-[#9E4758]">
            {passedCount} / {PRACTICAL_LAB_TASKS.length} Labs Passed (80+ Score)
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
          Hands-On AI Engineering Labs & Automated 100-Point AI Judge
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-3xl">
          Complete 6 progressive practical challenges—from XML System Prompts and Red Team Guardrails to LLM-as-a-Judge Rubrics, Hybrid RAG Architecture, MCP Release Agents, and the Capstone Test Generator Spec.
        </p>

        {/* 6 Lab Task Selector Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 mt-6">
          {PRACTICAL_LAB_TASKS.map((task) => {
            const isSelected = task.id === activeTask.id;
            const sub = labSubmissions[task.id];
            const isPassed = sub && sub.breakdown.total >= 80;

            return (
              <button
                key={task.id}
                type="button"
                onClick={() => setSelectedTaskId(task.id)}
                className={`text-left p-3.5 rounded-2xl border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#9E4758] text-white border-[#9E4758] shadow-sm'
                    : 'bg-white text-[#1E293B] border-[#E8A598]/60 hover:bg-[#FAF7F2]'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-[11px] font-mono uppercase">
                  <span>Task {task.taskNumber} of 6</span>
                  {sub ? (
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      {sub.breakdown.total}/100 {isPassed ? '✓' : ''}
                    </span>
                  ) : (
                    <span className="opacity-70">{task.estimatedMinutes}m</span>
                  )}
                </div>
                <div className="font-bold text-xs sm:text-sm font-editorial mt-1 line-clamp-1">
                  {task.title.replace(/^Task \d+:\s*/, '')}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Active Lab Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN (5 cols): Scenario Brief & Requirements */}
        <div className="lg:col-span-5 space-y-5">
          <div className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] text-[#9E4758] font-bold">
                {activeTask.trackBadge}
              </span>
              <span className="text-[#64748B]">{activeTask.difficulty}</span>
            </div>

            <h2 className="text-xl font-bold text-[#1E293B] font-editorial">
              {activeTask.title}
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B]">{activeTask.subtitle}</p>

            <div className="rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758] p-4 space-y-1.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
                Engineering Challenge Scenario:
              </div>
              <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                {activeTask.scenarioBrief}
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-[#1E293B]">
                Mandatory Rubric Requirements (100 Points Total):
              </div>
              <ul className="space-y-2">
                {activeTask.requirements.map((req, idx) => (
                  <li
                    key={idx}
                    className="text-xs sm:text-sm text-[#1E293B] bg-[#FAF7F2]/60 p-3 rounded-xl border border-[#E8A598]/40 flex items-start gap-2.5"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#9E4758] text-white text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4-Dimension Rubric Weights Info */}
            <div className="rounded-xl bg-[#FDF6F4] p-4 border border-[#E8A598]/50 space-y-2 text-xs">
              <div className="font-bold text-[#9E4758] uppercase tracking-wider">
                Built-In 4-Dimension Scoring Engine (100 Pts):
              </div>
              <div className="grid grid-cols-2 gap-2 text-[#1E293B]">
                <div>• Technical Accuracy: <strong>30 pts</strong></div>
                <div>• Prompt Structure: <strong>25 pts</strong></div>
                <div>• Safety & Edge-Cases: <strong>25 pts</strong></div>
                <div>• QA-to-AI Eval Rigor: <strong>20 pts</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (7 cols): Code/Prompt Editor + 2-Way AI Judge Output */}
        <div className="lg:col-span-7 space-y-6">
          <div className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <FileCode2 className="w-4 h-4 text-[#9E4758]" />
                <span className="text-sm font-bold text-[#1E293B]">
                  Your Prompt / Architecture Specification Editor
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleLoadExemplar}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8A598] text-xs font-semibold text-[#9E4758] hover:bg-[#F5EBE6]"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Principal Exemplar (100/100)
                </button>
                <button
                  type="button"
                  onClick={handleResetStarter}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs text-[#64748B] hover:text-[#1E293B]"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Reset Template
                </button>
              </div>
            </div>

            <textarea
              value={editorText}
              onChange={(e) => setEditorText(e.target.value)}
              rows={18}
              spellCheck={false}
              className="w-full rounded-xl bg-slate-900 text-emerald-100 font-mono text-xs p-4 leading-relaxed border border-slate-700 focus:outline-none focus:border-[#E8A598]"
            />

            {/* 2-Way Evaluation Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleRunAiJudge}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#9E4758] text-white text-xs sm:text-sm font-bold hover:bg-[#7D3543] transition-all shadow-sm"
              >
                <Award className="w-4 h-4" /> Evaluate with In-App Rubric Judge (100 Pts)
              </button>

              <button
                type="button"
                onClick={handleCopyExternalJudgePrompt}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-[#FAF7F2] border border-[#E8A598] text-xs font-semibold text-[#1E293B] hover:bg-[#F5EBE6]"
              >
                {copiedJudgePrompt ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" /> Copied Judge Prompt for Claude/Gemini!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#9E4758]" /> Copy Live Judge Meta-Prompt (Way 2)
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Automated 100-Point Scorecard Results */}
          {latestBreakdown && (
            <div className="rounded-2xl border-2 border-[#9E4758] bg-[#FAF7F2] p-6 shadow-editorial space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E8A598]/40 pb-4">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
                    Automated AI Judge Scorecard
                  </div>
                  <h3 className="text-xl font-bold text-[#1E293B] font-editorial mt-0.5">
                    {latestBreakdown.verdictTitle}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1">
                    {latestBreakdown.encouragementNote}
                  </p>
                </div>

                <div className="text-right">
                  <div className="text-3xl md:text-4xl font-bold text-[#9E4758] font-editorial">
                    {latestBreakdown.total} <span className="text-lg text-[#64748B]">/ 100</span>
                  </div>
                  <div className="text-[11px] font-mono uppercase text-emerald-700 font-bold">
                    {latestBreakdown.total >= 80 ? 'PASSED MILESTONE ✨' : '80+ REQUIRED TO PASS'}
                  </div>
                </div>
              </div>

              {/* 4-Dimension Progress Bars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white p-3.5 rounded-xl border border-[#E8A598]/40">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>1. Technical Accuracy & Arch</span>
                    <span className="font-mono text-[#9E4758]">{latestBreakdown.technical} / 30 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                    <div
                      className="h-full bg-[#9E4758]"
                      style={{ width: `${(latestBreakdown.technical / 30) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8A598]/40">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>2. Prompt Structure & Determinism</span>
                    <span className="font-mono text-[#9E4758]">{latestBreakdown.structure} / 25 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                    <div
                      className="h-full bg-[#9E4758]"
                      style={{ width: `${(latestBreakdown.structure / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8A598]/40">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>3. Edge-Case, Safety & Hallucination</span>
                    <span className="font-mono text-[#9E4758]">{latestBreakdown.safety} / 25 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                    <div
                      className="h-full bg-[#9E4758]"
                      style={{ width: `${(latestBreakdown.safety / 25) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-[#E8A598]/40">
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span>4. QA-to-AI Eval Rigor</span>
                    <span className="font-mono text-[#9E4758]">{latestBreakdown.evalRigor} / 20 pts</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                    <div
                      className="h-full bg-[#9E4758]"
                      style={{ width: `${(latestBreakdown.evalRigor / 20) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Passed Checks & Actionable Hints */}
              {latestBreakdown.passedChecks.length > 0 && (
                <div className="rounded-xl bg-emerald-50/80 border border-emerald-200 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Verified Rubric Criteria Passed:
                  </div>
                  <ul className="space-y-1">
                    {latestBreakdown.passedChecks.map((chk, i) => (
                      <li key={i} className="text-xs text-emerald-950 flex items-start gap-2">
                        <span className="font-bold text-emerald-700">✓</span>
                        <span>{chk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {latestBreakdown.missingHints.length > 0 && (
                <div className="rounded-xl bg-amber-50/90 border border-amber-200 p-4 space-y-2">
                  <div className="text-xs font-bold uppercase text-amber-900 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-700" /> Actionable Hints to Reach 100/100:
                  </div>
                  <ul className="space-y-1.5">
                    {latestBreakdown.missingHints.map((hint, i) => (
                      <li key={i} className="text-xs text-amber-950 flex items-start gap-2">
                        <span className="font-bold text-amber-700">→</span>
                        <span>{hint}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
