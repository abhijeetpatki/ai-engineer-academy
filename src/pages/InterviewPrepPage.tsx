import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Search,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Bookmark,
  PenTool
} from 'lucide-react';
import { INTERVIEW_QUESTIONS } from '../data/interviewQuestions';
import { InterviewQuestionItem } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';

const CATEGORIES: Array<InterviewQuestionItem['category'] | 'All'> = [
  'All',
  'LLM Internals',
  'RAG & Vector Systems',
  'Agents & MCP',
  'AI Evals & Red Teaming (QA-to-AI Special)'
];

export const InterviewPrepPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<InterviewQuestionItem['category'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRubrics, setExpandedRubrics] = useState<Record<string, boolean>>({
    'iq-1': true
  });

  const { interviewDrafts, saveInterviewDraft, bookmarkedItems, toggleBookmark, triggerCelebration } =
    useAcademy();

  const filteredQuestions = INTERVIEW_QUESTIONS.filter((q) => {
    const matchesTab = selectedTab === 'All' || q.category === selectedTab;
    const matchesSearch =
      !searchQuery.trim() ||
      q.questionTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.scenarioQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.proAnswer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setExpandedRubrics((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider mb-2">
          <Briefcase className="w-3.5 h-3.5" />
          Pro AI Engineer Hub • Interview Simulator
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
          Interactive AI Engineer Interview Prep Vault ({INTERVIEW_QUESTIONS.length} Scenario Questions)
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-3xl leading-relaxed">
          Practice real-world Senior & Staff AI Engineering interview questions across **LLM Internals**, **RAG & Vector Systems**, **Agents & MCP**, and **AI Evals & Red Teaming**. Draft your answer first, then reveal the **Pro Answer & Hiring Manager Rubric**.
        </p>

        {/* Search & Category Tabs */}
        <div className="mt-6 space-y-4">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search interview topics (e.g., Temperature, RRF, MCP, Lost in the Middle, Ragas)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8A598] text-sm text-[#1E293B] focus:outline-none focus:border-[#9E4758]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedTab(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedTab === cat
                    ? 'bg-[#9E4758] text-white shadow-2xs'
                    : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#FAF7F2]'
                }`}
              >
                {cat}{' '}
                <span className="opacity-75 font-mono">
                  (
                  {cat === 'All'
                    ? INTERVIEW_QUESTIONS.length
                    : INTERVIEW_QUESTIONS.filter((q) => q.category === cat).length}
                  )
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Scenario Cards List */}
      <div className="space-y-6">
        {filteredQuestions.map((item) => {
          const isOpen = !!expandedRubrics[item.id];
          const isBookmarked = bookmarkedItems.includes(item.id);
          const draftValue = interviewDrafts[item.id] || '';

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial space-y-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#9E4758] border border-[#E8A598]/50">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono px-2.5 py-0.5 rounded-md bg-slate-100 text-[#1E293B] font-semibold">
                      {item.difficulty}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B] font-editorial pt-1">
                    {item.questionTitle}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => toggleBookmark(item.id)}
                  className={`p-2 rounded-xl border text-xs transition-colors ${
                    isBookmarked
                      ? 'bg-[#FDF6F4] border-[#9E4758] text-[#9E4758]'
                      : 'bg-white border-slate-200 text-[#64748B] hover:text-[#9E4758]'
                  }`}
                  title="Bookmark question"
                >
                  <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Interviewer Scenario Prompt */}
              <div className="rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758] p-4 space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
                  Interviewer Scenario Prompt:
                </div>
                <p className="text-sm md:text-base font-medium text-[#1E293B] leading-relaxed">
                  "{item.scenarioQuestion}"
                </p>
                <p className="text-xs text-[#64748B] pt-1">
                  <strong>Why Hiring Managers Ask This:</strong> {item.whyTheyAsk}
                </p>
              </div>

              {/* Practice Your Answer Text Box */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor={`draft-${item.id}`}
                    className="text-xs font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5"
                  >
                    <PenTool className="w-3.5 h-3.5 text-[#9E4758]" /> Practice Your Answer (Auto-Saved in Browser)
                  </label>
                  {draftValue.trim().length > 20 && (
                    <button
                      type="button"
                      onClick={() => {
                        setExpandedRubrics((p) => ({ ...p, [item.id]: true }));
                        triggerCelebration(
                          'Awesome interview practice! Compare your points against the Hiring Manager Rubric below ✨'
                        );
                      }}
                      className="text-xs font-semibold text-[#9E4758] hover:underline"
                    >
                      Grade & Compare My Answer →
                    </button>
                  )}
                </div>
                <textarea
                  id={`draft-${item.id}`}
                  rows={3}
                  value={draftValue}
                  onChange={(e) => saveInterviewDraft(item.id, e.target.value)}
                  placeholder="Jot down your key talking points, metrics, and QA-to-AI analogies before revealing the Pro Answer..."
                  className="w-full rounded-xl border border-[#E8A598]/60 bg-[#FAF7F2]/40 p-3.5 text-xs sm:text-sm text-[#1E293B] focus:outline-none focus:border-[#9E4758] focus:bg-white transition-colors"
                />
              </div>

              {/* Reveal Pro Answer & Hiring Manager Rubric Accordion */}
              <div>
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                    isOpen
                      ? 'bg-[#9E4758] text-white'
                      : 'bg-[#F5EBE6] text-[#9E4758] hover:bg-[#E8A598]/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    {isOpen
                      ? 'Hide Pro Answer & Hiring Manager Rubric'
                      : 'Reveal Pro Answer & Hiring Manager Rubric'}
                  </span>
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-4 space-y-4">
                        {/* Pro Answer */}
                        <div className="rounded-xl bg-[#FAF7F2] border border-[#E8A598]/60 p-4 space-y-3">
                          <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
                            Principal AI Engineer Model Answer:
                          </div>
                          <p className="text-xs sm:text-sm text-[#1E293B] whitespace-pre-line leading-relaxed">
                            {item.proAnswer}
                          </p>
                          {item.codeOrFormula && (
                            <pre className="p-3 rounded-lg bg-slate-900 text-emerald-200 text-xs font-mono overflow-x-auto">
                              {item.codeOrFormula}
                            </pre>
                          )}
                        </div>

                        {/* Hiring Manager Rubric Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="rounded-xl bg-emerald-50/70 border border-emerald-200 p-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5 mb-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                              Strong Hire Signals (What to Mention)
                            </div>
                            <ul className="space-y-1.5">
                              {item.hiringManagerRubric.strongSignal.map((sig, i) => (
                                <li key={i} className="text-xs text-emerald-950 flex items-start gap-1.5">
                                  <span className="font-bold text-emerald-700">✓</span>
                                  <span>{sig}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="rounded-xl bg-rose-50/70 border border-rose-200 p-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5 mb-2">
                              <AlertTriangle className="w-4 h-4 text-rose-700" />
                              Red Flags to Avoid
                            </div>
                            <ul className="space-y-1.5">
                              {item.hiringManagerRubric.redFlags.map((rf, i) => (
                                <li key={i} className="text-xs text-rose-950 flex items-start gap-1.5">
                                  <span className="font-bold text-rose-700">×</span>
                                  <span>{rf}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* QA Edge Highlight */}
                        <div className="rounded-xl bg-[#FDF6F4] border-l-4 border-[#9E4758] p-3.5 text-xs sm:text-sm text-[#1E293B]">
                          <strong className="text-[#9E4758]">🌸 Your QA-to-AI Unfair Advantage Line: </strong>
                          {item.hiringManagerRubric.qaEdgeHighlight}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
