import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Bookmark,
  Sparkles,
  Code2,
  ShieldCheck,
  Lightbulb,
  ExternalLink,
  Clock,
  Award,
  HelpCircle
} from 'lucide-react';
import { LEARNING_TRACKS } from '../data/tracksData';
import { EXAM_QUESTIONS } from '../data/examQuestions';
import { ConceptMode } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';
import { InteractiveFlowchart } from '../components/InteractiveFlowchart';
import { PromptDiffSandbox } from '../components/PromptDiffSandbox';
import { FlashcardDeck } from '../components/FlashcardDeck';

export const TracksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTrackId = searchParams.get('track') || LEARNING_TRACKS[0].id;

  const [selectedTrackId, setSelectedTrackId] = useState<string>(initialTrackId);
  const [conceptMode, setConceptMode] = useState<ConceptMode>('qa_analogy');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  const {
    completedLessons,
    toggleLessonComplete,
    bookmarkedItems,
    toggleBookmark,
    recordTrackQuizScore,
    trackQuizScores
  } = useAcademy();

  useEffect(() => {
    const paramTrack = searchParams.get('track');
    if (paramTrack && LEARNING_TRACKS.some((t) => t.id === paramTrack)) {
      setSelectedTrackId(paramTrack);
    }
  }, [searchParams]);

  const activeTrack =
    LEARNING_TRACKS.find((t) => t.id === selectedTrackId) || LEARNING_TRACKS[0];

  const trackQuestions = EXAM_QUESTIONS.filter((q) => q.trackId === activeTrack.id);

  const handleSelectTrack = (trackId: string) => {
    setSelectedTrackId(trackId);
    setSearchParams({ track: trackId });
    setQuizAnswers({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGradeTrackQuiz = () => {
    let correct = 0;
    trackQuestions.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) correct++;
    });
    recordTrackQuizScore(activeTrack.id, correct, trackQuestions.length);
  };

  const completedInTrack = activeTrack.lessons.filter((l) =>
    completedLessons.includes(l.id)
  ).length;

  return (
    <div className="space-y-8">
      {/* Track Selector Tabs */}
      <div className="flex overflow-x-auto gap-2.5 pb-2">
        {LEARNING_TRACKS.map((track) => {
          const isSelected = track.id === activeTrack.id;
          const done = track.lessons.filter((l) => completedLessons.includes(l.id)).length;
          return (
            <button
              key={track.id}
              type="button"
              onClick={() => handleSelectTrack(track.id)}
              className={`shrink-0 text-left px-4 py-3 rounded-2xl border transition-all ${
                isSelected
                  ? 'bg-[#9E4758] text-white border-[#9E4758] shadow-sm'
                  : 'bg-[#FAF7F2] text-[#1E293B] border-[#E8A598]/50 hover:bg-[#F5EBE6]'
              }`}
            >
              <div className="flex items-center justify-between gap-3 text-[11px] font-mono uppercase opacity-90">
                <span>Track {track.number}</span>
                <span>
                  {done}/{track.lessons.length} Done
                </span>
              </div>
              <div className="font-bold text-sm font-editorial mt-0.5 max-w-[210px] truncate">
                {track.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Track Hero Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider">
            Track {activeTrack.number} of 5 • {activeTrack.badgeTitle}
          </span>
          <span className="text-xs font-semibold text-[#9E4758] bg-white px-3.5 py-1.5 rounded-full border border-[#E8A598]">
            {completedInTrack}/{activeTrack.lessons.length} Lessons Completed • {activeTrack.estimatedHours}
          </span>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
          {activeTrack.title}
        </h1>
        <p className="text-sm md:text-base text-[#64748B] mt-2 leading-relaxed">
          {activeTrack.overview}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#E8A598]/60 text-xs font-semibold text-[#9E4758]">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>QA Bridge Superpower: {activeTrack.qaSuperpowerTag}</span>
        </div>
      </section>

      {/* Interactive Architectural Flowchart (Every Track) */}
      <InteractiveFlowchart spec={activeTrack.flowchart} />

      {/* 3-Mode Concept Switcher Sticky Bar */}
      <section className="space-y-5">
        <div className="sticky top-14 z-20 rounded-2xl bg-white/95 backdrop-blur-md border-2 border-[#9E4758]/30 p-3.5 shadow-editorial flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 3-Mode Concept Switcher
            </div>
            <div className="text-xs text-[#64748B]">
              Toggle how every lesson below is explained: Simple, QA/Testing Analogy, or Production Code Deep-Dive
            </div>
          </div>

          <div className="inline-flex rounded-xl bg-[#FAF7F2] p-1 border border-[#E8A598]/50 self-start sm:self-center">
            <button
              type="button"
              onClick={() => setConceptMode('simple')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                conceptMode === 'simple'
                  ? 'bg-[#9E4758] text-white shadow-2xs'
                  : 'text-[#1E293B] hover:text-[#9E4758]'
              }`}
            >
              <Lightbulb className="w-3.5 h-3.5" /> 1. Explain Simply
            </button>
            <button
              type="button"
              onClick={() => setConceptMode('qa_analogy')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                conceptMode === 'qa_analogy'
                  ? 'bg-[#9E4758] text-white shadow-2xs'
                  : 'text-[#1E293B] hover:text-[#9E4758]'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> 2. QA/Testing Analogy
            </button>
            <button
              type="button"
              onClick={() => setConceptMode('deep_dive')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                conceptMode === 'deep_dive'
                  ? 'bg-[#9E4758] text-white shadow-2xs'
                  : 'text-[#1E293B] hover:text-[#9E4758]'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" /> 3. Technical Deep-Dive
            </button>
          </div>
        </div>

        {/* Lessons List */}
        <div className="space-y-6">
          {activeTrack.lessons.map((lesson, idx) => {
            const isCompleted = completedLessons.includes(lesson.id);
            const isBookmarked = bookmarkedItems.includes(lesson.id);

            return (
              <article
                key={lesson.id}
                className={`rounded-2xl border p-6 transition-all ${
                  isCompleted
                    ? 'bg-[#FAF7F2] border-emerald-300 shadow-editorial'
                    : 'bg-white border-[#E8A598]/60 shadow-editorial'
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4 pb-4 mb-4 border-b border-[#F5EBE6]">
                  <div>
                    <div className="flex items-center gap-2 text-xs font-mono text-[#9E4758] font-bold">
                      <span>
                        LESSON {activeTrack.number}.{idx + 1}
                      </span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-1 text-[#64748B]">
                        <Clock className="w-3.5 h-3.5" /> {lesson.durationMinutes} mins
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#1E293B] font-editorial mt-1">
                      {lesson.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#64748B] mt-1">{lesson.summary}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleBookmark(lesson.id)}
                      className={`p-2 rounded-xl border text-xs transition-colors ${
                        isBookmarked
                          ? 'bg-[#FDF6F4] border-[#9E4758] text-[#9E4758]'
                          : 'bg-white border-slate-200 text-[#64748B] hover:text-[#9E4758]'
                      }`}
                      title="Bookmark lesson"
                    >
                      <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleLessonComplete(lesson.id, lesson.title)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-[#9E4758] text-white hover:bg-[#7D3543]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle2 className="w-4 h-4" /> Completed ✨
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" /> Mark Lesson Complete
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Mode 1: Explain Simply */}
                {conceptMode === 'simple' && (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                      <Lightbulb className="w-3.5 h-3.5" /> Mode 1: Plain-English Concept View
                    </div>
                    <h4 className="text-lg font-bold text-[#1E293B] font-editorial">
                      {lesson.modes.simple.headline}
                    </h4>
                    <p className="text-sm md:text-base text-[#1E293B] leading-relaxed">
                      {lesson.modes.simple.explanation}
                    </p>
                    <div className="rounded-xl bg-[#FAF7F2] p-4 border border-[#E8A598]/50">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] mb-2">
                        Core Takeaways to Remember:
                      </div>
                      <ul className="space-y-2">
                        {lesson.modes.simple.keyTakeaways.map((kt, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[#1E293B] flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-[#9E4758] shrink-0 mt-0.5" />
                            <span>{kt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Mode 2: Explain with a QA/Testing Analogy */}
                {conceptMode === 'qa_analogy' && (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E4758] bg-[#FDF6F4] px-3 py-1 rounded-full border border-[#E8A598]">
                      <ShieldCheck className="w-3.5 h-3.5" /> Mode 2: QA-to-AI Bridge Analogy
                    </div>
                    <h4 className="text-lg font-bold text-[#1E293B] font-editorial">
                      {lesson.modes.qa_analogy.headline}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-1">
                          In Your Traditional QA World:
                        </div>
                        <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                          {lesson.modes.qa_analogy.oldQaWorld}
                        </p>
                      </div>
                      <div className="rounded-xl bg-[#FDF6F4] p-4 border border-[#E8A598]">
                        <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] mb-1">
                          In Your New AI Engineering World:
                        </div>
                        <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                          {lesson.modes.qa_analogy.newAiWorld}
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-[#1E293B] leading-relaxed">
                      {lesson.modes.qa_analogy.explanation}
                    </p>

                    <div className="rounded-xl bg-gradient-to-r from-[#FAF7F2] to-[#F5EBE6] border-l-4 border-[#9E4758] p-4">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] mb-1">
                        Why This Gives You an Unfair Advantage in Interviews:
                      </div>
                      <p className="text-xs sm:text-sm text-[#1E293B] font-medium">
                        {lesson.modes.qa_analogy.unfairAdvantage}
                      </p>
                    </div>
                  </div>
                )}

                {/* Mode 3: Technical Deep-Dive */}
                {conceptMode === 'deep_dive' && (
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      <Code2 className="w-3.5 h-3.5" /> Mode 3: Production Architecture & Code Deep-Dive
                    </div>
                    <h4 className="text-lg font-bold text-[#1E293B] font-editorial">
                      {lesson.modes.deep_dive.headline}
                    </h4>
                    <p className="text-sm text-[#1E293B] leading-relaxed">
                      {lesson.modes.deep_dive.explanation}
                    </p>

                    <div>
                      <div className="flex items-center justify-between px-4 py-2 rounded-t-xl bg-slate-800 text-slate-300 text-xs font-mono">
                        <span>Production Implementation Pattern</span>
                        <span className="uppercase text-[#E8A598]">{lesson.modes.deep_dive.codeLanguage}</span>
                      </div>
                      <pre className="p-4 rounded-b-xl bg-slate-900 text-emerald-100 text-xs font-mono overflow-x-auto leading-relaxed">
                        {lesson.modes.deep_dive.codeSnippet}
                      </pre>
                    </div>

                    <div className="rounded-xl bg-[#FAF7F2] p-4 border border-[#E8A598]/50">
                      <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] mb-2">
                        Staff Engineer Production Notes:
                      </div>
                      <ul className="space-y-1.5">
                        {lesson.modes.deep_dive.productionNotes.map((note, i) => (
                          <li key={i} className="text-xs sm:text-sm text-[#1E293B] flex items-start gap-2">
                            <span className="font-bold text-[#9E4758]">→</span>
                            <span>{note}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* Track 2 Special: Interactive Prompt Engineering Sandbox */}
      {activeTrack.promptSandbox && activeTrack.promptSandbox.length > 0 && (
        <PromptDiffSandbox scenarios={activeTrack.promptSandbox} />
      )}

      {/* Track 5 Special: The AI Pulse Visual Radar Cards */}
      {activeTrack.pulseCards && activeTrack.pulseCards.length > 0 && (
        <section className="space-y-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
              Cutting-Edge Industry Radar & Official Certifications
            </div>
            <h3 className="text-2xl font-bold text-[#1E293B] font-editorial">
              The AI Pulse: Trends, Architectures & Official Certification Links
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {activeTrack.pulseCards.map((card) => (
              <div
                key={card.id}
                className="rounded-2xl border border-[#E8A598]/60 bg-white p-5 shadow-editorial flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#9E4758] border border-[#E8A598]/50">
                      {card.category}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {card.maturity}
                    </span>
                  </div>
                  <h4 className="text-lg font-bold text-[#1E293B] font-editorial">{card.title}</h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-2 leading-relaxed">{card.summary}</p>

                  <div className="mt-3 p-3 rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758]">
                    <div className="text-[11px] font-bold uppercase text-[#9E4758]">Why QA Engineers Care:</div>
                    <p className="text-xs text-[#1E293B] mt-0.5">{card.whyQaCares}</p>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {card.keyTech.map((tech) => (
                      <span
                        key={tech}
                        className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F5EBE6] text-[#1E293B]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {card.externalUrl && (
                  <a
                    href={card.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 pt-3 border-t border-slate-100 inline-flex items-center justify-between text-xs font-semibold text-[#9E4758] hover:underline"
                  >
                    <span>{card.externalLabel || 'Explore Official Resource'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Active Recall Flashcards for this Track */}
      <FlashcardDeck cards={activeTrack.flashcards} trackTitle={activeTrack.title} />

      {/* Inline Track Quick-Check Quiz */}
      <section className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758]/10 text-[#9E4758] text-xs font-bold uppercase tracking-wider mb-1">
              <HelpCircle className="w-3.5 h-3.5" />
              Track {activeTrack.number} Practice Check ({trackQuestions.length} Scenario Questions)
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
              Verify Your Track Mastery with Instant QA-Bridge Feedback
            </h3>
          </div>
          {trackQuizScores[activeTrack.id] && (
            <div className="px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
              Best Score: {trackQuizScores[activeTrack.id].score}/{trackQuizScores[activeTrack.id].total}
            </div>
          )}
        </div>

        <div className="space-y-5">
          {trackQuestions.map((q, qIdx) => {
            const selectedOpt = quizAnswers[q.id];
            const isAnswered = selectedOpt !== undefined;
            const isCorrect = selectedOpt === q.correctIndex;

            return (
              <div
                key={q.id}
                className="rounded-xl border border-slate-200 bg-[#FAF7F2]/60 p-4 md:p-5 space-y-3"
              >
                <div className="flex items-center justify-between text-xs font-mono text-[#9E4758]">
                  <span>
                    QUESTION {qIdx + 1} OF {trackQuestions.length}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E8A598]/40">
                    {q.difficulty}
                  </span>
                </div>
                <p className="text-sm md:text-base font-bold text-[#1E293B] leading-snug">
                  {q.scenario}
                </p>

                <div className="space-y-2">
                  {q.options.map((opt, optIdx) => {
                    const chosen = selectedOpt === optIdx;
                    let btnStyle = 'bg-white border-slate-200 text-[#1E293B] hover:border-[#9E4758]';
                    if (isAnswered) {
                      if (optIdx === q.correctIndex) {
                        btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-semibold';
                      } else if (chosen) {
                        btnStyle = 'bg-rose-50 border-rose-400 text-rose-900';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        onClick={() =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [q.id]: optIdx
                          }))
                        }
                        className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-2.5 ${btnStyle}`}
                      >
                        <span className="font-mono font-bold text-[#9E4758]">
                          {String.fromCharCode(65 + optIdx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                {isAnswered && (
                  <div
                    className={`rounded-xl p-3.5 border text-xs sm:text-sm space-y-1.5 ${
                      isCorrect
                        ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                        : 'bg-amber-50/90 border-amber-300 text-amber-950'
                    }`}
                  >
                    <div className="font-bold">
                      {isCorrect
                        ? '✨ Spot On! Your engineering instinct nailed it.'
                        : '🌸 Great learning moment! Here is the production breakdown:'}
                    </div>
                    <p>{q.explanation}</p>
                    <p className="text-xs font-semibold text-[#9E4758] pt-1">
                      💡 QA Perspective: {q.qaPerspective}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={handleGradeTrackQuiz}
            className="px-5 py-2.5 rounded-xl bg-[#9E4758] text-white text-xs sm:text-sm font-semibold hover:bg-[#7D3543] transition-colors shadow-sm"
          >
            Record Track Practice Score & Celebrate 🎉
          </button>

          <Link
            to="/certification"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#9E4758] hover:underline"
          >
            <Award className="w-4 h-4" /> Ready for the 40-Question Full Certification Exam? →
          </Link>
        </div>
      </section>
    </div>
  );
};
