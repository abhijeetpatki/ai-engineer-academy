import React, { useState, useEffect } from 'react';
import {
  Award,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Printer,
  RotateCcw,
  ShieldCheck,
  Play,
  FileCheck2
} from 'lucide-react';
import { EXAM_QUESTIONS } from '../data/examQuestions';
import { useAcademy, ExamAttemptRecord } from '../context/AcademyContext';

const EXAM_DURATION_SECONDS = 45 * 60; // 45 minutes

export const CertificationPage: React.FC = () => {
  const { userName, examHistory, recordCertificationExam } = useAcademy();

  const [mode, setMode] = useState<'overview' | 'active_exam' | 'results'>('overview');
  const [examQuestions] = useState(() => EXAM_QUESTIONS.slice(0, 40)); // 40 scenario questions
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [secondsLeft, setSecondsLeft] = useState(EXAM_DURATION_SECONDS);
  const [latestResult, setLatestResult] = useState<ExamAttemptRecord | null>(
    examHistory[0] || null
  );

  // 45-minute countdown timer
  useEffect(() => {
    if (mode !== 'active_exam') return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [mode]);

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const handleStartExam = () => {
    setAnswers({});
    setCurrentIdx(0);
    setSecondsLeft(EXAM_DURATION_SECONDS);
    setMode('active_exam');
  };

  const handleSubmitExam = () => {
    let score = 0;
    const domainScores: Record<string, { correct: number; total: number }> = {};

    examQuestions.forEach((q) => {
      if (!domainScores[q.domain]) {
        domainScores[q.domain] = { correct: 0, total: 0 };
      }
      domainScores[q.domain].total += 1;

      if (answers[q.id] === q.correctIndex) {
        score += 1;
        domainScores[q.domain].correct += 1;
      }
    });

    const percentage = Math.round((score / examQuestions.length) * 100);
    const attempt: ExamAttemptRecord = {
      id: `exam-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      score,
      total: examQuestions.length,
      percentage,
      passed: percentage >= 80,
      domainScores
    };

    recordCertificationExam(attempt);
    setLatestResult(attempt);
    setMode('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Demo helper to preview a 92% passing certification result & Readiness Certificate
  const handleSimulatePassingCertificate = () => {
    const simulatedAnswers: Record<string, number> = {};
    examQuestions.forEach((q, idx) => {
      // 37/40 correct = 93%
      simulatedAnswers[q.id] = idx < 37 ? q.correctIndex : (q.correctIndex + 1) % 4;
    });
    setAnswers(simulatedAnswers);

    const domainScores: Record<string, { correct: number; total: number }> = {};
    let score = 0;
    examQuestions.forEach((q, idx) => {
      if (!domainScores[q.domain]) domainScores[q.domain] = { correct: 0, total: 0 };
      domainScores[q.domain].total += 1;
      if (idx < 37) {
        score += 1;
        domainScores[q.domain].correct += 1;
      }
    });

    const attempt: ExamAttemptRecord = {
      id: `exam-verified-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      score,
      total: examQuestions.length,
      percentage: Math.round((score / examQuestions.length) * 100),
      passed: true,
      domainScores
    };

    recordCertificationExam(attempt);
    setLatestResult(attempt);
    setMode('results');
  };

  const currentQuestion = examQuestions[currentIdx] || examQuestions[0];

  return (
    <div className="space-y-8">
      {/* OVERVIEW MODE */}
      {mode === 'overview' && (
        <div className="space-y-6">
          <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-9 shadow-editorial">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-4 h-4" />
              Official Mock Certification Engine
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] font-editorial">
              Certified AI Engineer Readiness Exam (40 Questions • 45 Mins)
            </h1>
            <p className="text-sm md:text-base text-[#64748B] mt-2 max-w-3xl leading-relaxed">
              Validate your mastery across **AI & LLM Fundamentals**, **Anthropic Claude & MCP**, **Google Cloud Vertex AI & Gemini**, **Hybrid RAG & Agentic Workflows**, and **AI Evals & Red Teaming**. Score **80% or higher (32/40)** to unlock your personalized, printable **Certified AI Engineer Readiness Certificate**.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
              <div className="rounded-2xl bg-white p-4 border border-[#E8A598]/40">
                <div className="text-xs font-bold uppercase text-[#64748B]">Format</div>
                <div className="text-lg font-bold text-[#1E293B] font-editorial mt-1">
                  40 Scenario Questions
                </div>
                <div className="text-xs text-[#64748B]">Real-world production architecture & QA evals</div>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-[#E8A598]/40">
                <div className="text-xs font-bold uppercase text-[#64748B]">Time Limit</div>
                <div className="text-lg font-bold text-[#1E293B] font-editorial mt-1">
                  45 Minutes Timed
                </div>
                <div className="text-xs text-[#64748B]">Question navigator + instant domain radar</div>
              </div>
              <div className="rounded-2xl bg-white p-4 border border-[#E8A598]/40">
                <div className="text-xs font-bold uppercase text-[#64748B]">Passing Standard</div>
                <div className="text-lg font-bold text-[#9E4758] font-editorial mt-1">
                  80% (32 / 40 Correct)
                </div>
                <div className="text-xs text-[#64748B]">Unlocks Readiness Certificate & Badge</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleStartExam}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#9E4758] text-white text-sm font-semibold hover:bg-[#7D3543] transition-all shadow-sm"
              >
                <Play className="w-4 h-4 fill-current" /> Start 40-Question Certification Exam
              </button>

              {latestResult && (
                <button
                  type="button"
                  onClick={() => setMode('results')}
                  className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white border border-[#E8A598] text-sm font-semibold text-[#9E4758] hover:bg-[#FAF7F2]"
                >
                  <FileCheck2 className="w-4 h-4" /> View Latest Diagnostic & Certificate ({latestResult.percentage}%)
                </button>
              )}

              <button
                type="button"
                onClick={handleSimulatePassingCertificate}
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-xl bg-white/80 border border-slate-200 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#9E4758]" /> Preview Verified Certificate & Skill Radar
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ACTIVE 40-QUESTION TIMED EXAM MODE */}
      {mode === 'active_exam' && (
        <div className="space-y-6">
          {/* Sticky Timer & Progress Header */}
          <div className="sticky top-14 z-20 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#9E4758] p-4 shadow-editorial flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-mono font-bold">
                Q {currentIdx + 1} / {examQuestions.length}
              </span>
              <span className="text-xs sm:text-sm font-bold text-[#1E293B]">
                Domain: <span className="text-[#9E4758]">{currentQuestion.domain}</span>
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FAF7F2] border border-[#E8A598] text-xs font-mono font-bold text-[#9E4758]">
                <Clock className="w-4 h-4" /> {formatTimer(secondsLeft)}
              </div>
              <button
                type="button"
                onClick={handleSubmitExam}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white text-xs font-semibold hover:bg-emerald-800 transition-colors"
              >
                Submit & Grade Exam ({Object.keys(answers).length}/{examQuestions.length})
              </button>
            </div>
          </div>

          {/* Question Card */}
          <div className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 md:p-8 shadow-editorial space-y-6">
            <div className="flex items-center justify-between text-xs font-mono text-[#64748B]">
              <span>SCENARIO QUESTION #{currentIdx + 1}</span>
              <span className="px-2.5 py-1 rounded-md bg-[#FAF7F2] text-[#9E4758] font-bold">
                {currentQuestion.difficulty} Level
              </span>
            </div>

            <h2 className="text-lg md:text-xl font-bold text-[#1E293B] leading-relaxed">
              {currentQuestion.scenario}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = answers[currentQuestion.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setAnswers((prev) => ({
                        ...prev,
                        [currentQuestion.id]: idx
                      }))
                    }
                    className={`w-full text-left p-4 rounded-xl border-2 text-sm transition-all flex items-start gap-3 ${
                      isSelected
                        ? 'bg-[#FDF6F4] border-[#9E4758] text-[#1E293B] font-semibold shadow-2xs'
                        : 'bg-white border-slate-200 text-[#1E293B] hover:border-[#E8A598]'
                    }`}
                  >
                    <span className="font-mono font-bold text-[#9E4758] mt-0.5">
                      {String.fromCharCode(65 + idx)}.
                    </span>
                    <span>{opt}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                type="button"
                disabled={currentIdx === 0}
                onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-[#1E293B] disabled:opacity-40"
              >
                ← Previous Question
              </button>

              {currentIdx + 1 < examQuestions.length ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx((i) => i + 1)}
                  className="px-5 py-2.5 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543]"
                >
                  Next Question →
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitExam}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800"
                >
                  Finish & Grade Certification Exam ✨
                </button>
              )}
            </div>
          </div>

          {/* 40-Question Quick Navigator Grid */}
          <div className="rounded-2xl border border-[#E8A598]/40 bg-[#FAF7F2] p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2.5">
              40-Question Exam Navigator (Click any number to jump):
            </div>
            <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-20 gap-1.5">
              {examQuestions.map((q, idx) => {
                const answered = answers[q.id] !== undefined;
                const active = idx === currentIdx;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => setCurrentIdx(idx)}
                    className={`h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                      active
                        ? 'bg-[#9E4758] text-white ring-2 ring-[#E8A598]'
                        : answered
                        ? 'bg-[#E8A598]/40 text-[#9E4758]'
                        : 'bg-white text-[#64748B] border border-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* RESULTS, SKILL RADAR & PRINTABLE CERTIFICATE MODE */}
      {mode === 'results' && latestResult && (
        <div className="space-y-8">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <button
              type="button"
              onClick={handleStartExam}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E8A598] text-xs font-semibold text-[#9E4758] hover:bg-[#FAF7F2]"
            >
              <RotateCcw className="w-4 h-4" /> Retake 40-Question Exam
            </button>

            {latestResult.passed && (
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] shadow-sm"
              >
                <Printer className="w-4 h-4" /> Download / Print Readiness Certificate (PDF)
              </button>
            )}
          </div>

          {/* Score Banner & Diagnostic Skill Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 no-print">
            <div className="rounded-2xl border border-[#E8A598]/60 bg-[#FAF7F2] p-6 shadow-editorial flex flex-col justify-between">
              <div>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    latestResult.passed
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {latestResult.passed ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" /> Certified Readiness Standard Met ✨
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-3.5 h-3.5" /> Almost There — Keep Building!
                    </>
                  )}
                </span>

                <div className="mt-4 flex items-baseline gap-3">
                  <span className="text-4xl md:text-5xl font-bold text-[#9E4758] font-editorial">
                    {latestResult.percentage}%
                  </span>
                  <span className="text-sm font-mono text-[#64748B]">
                    ({latestResult.score} / {latestResult.total} Correct)
                  </span>
                </div>

                <p className="text-sm text-[#1E293B] mt-3 leading-relaxed">
                  {latestResult.passed
                    ? `Extraordinary work, ${userName}! Scoring ${latestResult.percentage}% demonstrates Senior AI Engineering readiness across Prompt Architecture, Hybrid RAG, MCP Agents, and AI Evals.`
                    : `Great effort! Review the domain breakdown on the right to see which tracks will push your score past the 80% certification bar.`}
                </p>
              </div>

              {/* Visual SVG Radar / Pentagon Representation */}
              <div className="mt-6 p-4 rounded-xl bg-white border border-[#E8A598]/40 flex items-center gap-4">
                <svg viewBox="0 0 120 120" className="w-24 h-24 shrink-0">
                  <polygon
                    points="60,10 110,45 92,105 28,105 10,45"
                    fill="#FAF7F2"
                    stroke="#E8A598"
                    strokeWidth="1.5"
                  />
                  <polygon
                    points="60,25 95,50 82,92 38,92 25,50"
                    fill="none"
                    stroke="#E8A598"
                    strokeDasharray="2,2"
                    strokeWidth="1"
                  />
                  <polygon
                    points="60,14 104,47 88,99 32,99 16,47"
                    fill="rgba(158, 71, 88, 0.22)"
                    stroke="#9E4758"
                    strokeWidth="2.5"
                  />
                  <circle cx="60" cy="60" r="3" fill="#9E4758" />
                </svg>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-[#1E293B]">5-Domain Diagnostic Skill Radar</div>
                  <p className="text-[#64748B]">
                    Balanced across LLM Internals, Anthropic Claude & MCP, Google Vertex AI/Gemini, Hybrid RAG, and AI Evals.
                  </p>
                </div>
              </div>
            </div>

            {/* Domain-by-Domain Progress & Recommendations */}
            <div className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial space-y-4">
              <h3 className="text-lg font-bold text-[#1E293B] font-editorial">
                Domain Mastery Breakdown & Recommended Focus
              </h3>

              <div className="space-y-3.5">
                {Object.entries(latestResult.domainScores).map(([domain, stats]) => {
                  const pct = Math.round((stats.correct / stats.total) * 100);
                  return (
                    <div key={domain} className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-semibold">
                        <span className="text-[#1E293B]">{domain}</span>
                        <span className="font-mono text-[#9E4758]">
                          {stats.correct}/{stats.total} ({pct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#FAF7F2] overflow-hidden">
                        <div
                          className={`h-full transition-all ${
                            pct >= 80 ? 'bg-emerald-600' : 'bg-[#9E4758]'
                          }`}
                          style={{ width: `${Math.max(6, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* OFFICIAL CERTIFIED AI ENGINEER READINESS CERTIFICATE */}
          {latestResult.passed && (
            <div className="rounded-3xl border-4 border-double border-[#9E4758] bg-gradient-to-br from-[#FFFFFF] via-[#FAF7F2] to-[#F5EBE6] p-8 md:p-12 shadow-editorial-lg text-center relative overflow-hidden">
              <div className="max-w-3xl mx-auto space-y-5">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#9E4758] text-white shadow-md mx-auto">
                  <ShieldCheck className="w-9 h-9" />
                </div>

                <div className="text-xs font-mono uppercase tracking-[0.25em] text-[#9E4758] font-bold">
                  AI Engineer Academy • Official Readiness Credential
                </div>

                <h2 className="text-3xl md:text-4xl font-bold text-[#1E293B] font-editorial">
                  Certificate of AI Engineering Readiness
                </h2>

                <p className="text-sm text-[#64748B]">This certifies that</p>

                <div className="text-2xl md:text-4xl font-bold text-[#9E4758] font-editorial border-b-2 border-[#E8A598] inline-block px-8 pb-2">
                  {userName}
                </div>

                <p className="text-sm md:text-base text-[#1E293B] leading-relaxed max-w-2xl mx-auto">
                  has successfully demonstrated production-grade mastery across **LLM Internals**, **Anthropic Claude & Model Context Protocol (MCP)**, **Google Cloud Vertex AI & Multimodal Gemini**, **Hybrid RAG & Agentic Workflows**, and **LLM-as-a-Judge AI Evaluations & Red Teaming**.
                </p>

                <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto pt-4 text-xs">
                  <div className="p-3 rounded-xl bg-white/90 border border-[#E8A598]/50">
                    <div className="text-[#64748B] uppercase font-mono text-[10px]">Exam Score</div>
                    <div className="font-bold text-base text-[#9E4758] mt-0.5">
                      {latestResult.percentage}% ({latestResult.score}/{latestResult.total})
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-[#E8A598]/50">
                    <div className="text-[#64748B] uppercase font-mono text-[10px]">Date Issued</div>
                    <div className="font-bold text-xs text-[#1E293B] mt-1">{latestResult.date}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-white/90 border border-[#E8A598]/50">
                    <div className="text-[#64748B] uppercase font-mono text-[10px]">Credential ID</div>
                    <div className="font-mono font-bold text-xs text-[#1E293B] mt-1">
                      AIEA-2026-QA2AI
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
