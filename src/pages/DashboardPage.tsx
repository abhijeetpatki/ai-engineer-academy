import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  BookOpen,
  Award,
  Briefcase,
  BookA,
  Library,
  FlaskConical,
  Bell,
  Clock,
  Flame,
  Heart,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Edit3
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { LEARNING_TRACKS } from '../data/tracksData';
import { ACHIEVEMENT_BADGES, PERSONAL_LOVE_NOTES } from '../data/achievementsData';
import { PRACTICAL_LAB_TASKS } from '../data/practicalLabs';

export const DashboardPage: React.FC = () => {
  const {
    userName,
    setUserName,
    completedLessons,
    streakDays,
    unlockedBadges,
    studyNudgeEnabled,
    toggleStudyNudge,
    preferredStudyTime,
    setPreferredStudyTime,
    sendTestStudyNotification,
    setShowWeMissedYouModal,
    labSubmissions,
    examHistory,
    triggerCelebration
  } = useAcademy();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(userName);
  const navigate = useNavigate();

  const totalLessons = LEARNING_TRACKS.reduce((sum, t) => sum + t.lessons.length, 0);
  const completedCount = completedLessons.length;
  const overallPct = Math.round((completedCount / totalLessons) * 100);

  const passedLabsCount = Object.values(labSubmissions).filter((s) => s.breakdown.total >= 80).length;
  const bestExamScore = examHistory.reduce((max, ex) => Math.max(max, ex.percentage), 0);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      setUserName(nameInput.trim());
      setEditingName(false);
      triggerCelebration(`Welcome, ${nameInput.trim()}! Your personalized certificate & portal are updated ✨`);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FDF6F4] border border-[#E8A598]/60 p-6 md:p-9 shadow-editorial relative overflow-hidden">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8A598] text-xs font-bold text-[#9E4758] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
            QA-to-AI Engineer Career Transformation Portal
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl md:text-4xl font-bold text-[#1E293B] font-editorial leading-tight">
              Hey {userName}! Your QA Superpower Makes You Unstoppable in AI.
            </h1>
            {!editingName ? (
              <button
                type="button"
                onClick={() => {
                  setNameInput(userName);
                  setEditingName(true);
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/80 border border-[#E8A598]/60 text-xs font-medium text-[#64748B] hover:text-[#9E4758]"
              >
                <Edit3 className="w-3 h-3" /> Personalize Name
              </button>
            ) : (
              <form onSubmit={handleSaveName} className="inline-flex items-center gap-2">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="px-3 py-1 rounded-lg border border-[#9E4758] text-sm bg-white focus:outline-none"
                  placeholder="Enter your name..."
                />
                <button
                  type="submit"
                  className="px-3 py-1 rounded-lg bg-[#9E4758] text-white text-xs font-semibold"
                >
                  Save
                </button>
              </form>
            )}
          </div>

          <p className="text-sm md:text-base text-[#64748B] leading-relaxed">
            While traditional developers stop at happy-path prompts, your background in boundary analysis, edge-case discovery, and systematic verification is the #1 skill set modern AI engineering teams need for **RAG, Agent Guardrails, and LLM-as-a-Judge Evals**.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate('/tracks')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#9E4758] text-white text-sm font-semibold hover:bg-[#7D3543] transition-all shadow-sm"
            >
              Continue Learning Tracks <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => navigate('/practical-labs')}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white text-[#9E4758] border border-[#E8A598] text-sm font-semibold hover:bg-[#FAF7F2] transition-all"
            >
              <FlaskConical className="w-4 h-4" /> Launch Hands-On AI Labs
            </button>
            <button
              type="button"
              onClick={() => navigate('/certification')}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-white/80 text-[#1E293B] border border-slate-200 text-sm font-semibold hover:bg-white transition-all"
            >
              <Award className="w-4 h-4 text-[#9E4758]" /> Mock Certification Exam
            </button>
          </div>
        </div>
      </section>

      {/* Key Metrics Row */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/40 p-5 shadow-editorial">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <span>Curriculum Mastery</span>
            <BookOpen className="w-4 h-4 text-[#9E4758]" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial mt-2">
            {overallPct}%
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            {completedCount} of {totalLessons} core lessons mastered
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/40 p-5 shadow-editorial">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <span>AI-Judged Practical Labs</span>
            <FlaskConical className="w-4 h-4 text-[#9E4758]" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial mt-2">
            {passedLabsCount} / {PRACTICAL_LAB_TASKS.length}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            Hands-on engineering challenges passed
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/40 p-5 shadow-editorial">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <span>Cert Readiness Score</span>
            <Award className="w-4 h-4 text-[#9E4758]" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial mt-2">
            {bestExamScore > 0 ? `${bestExamScore}%` : 'Ready to Test'}
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            80%+ unlocks Official Readiness Certificate
          </div>
        </div>

        <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/40 p-5 shadow-editorial">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-[#64748B]">
            <span>Consistency & Badges</span>
            <Flame className="w-4 h-4 text-[#9E4758]" />
          </div>
          <div className="text-2xl md:text-3xl font-bold text-[#9E4758] font-editorial mt-2">
            {streakDays}d Streak
          </div>
          <div className="text-xs text-[#64748B] mt-1">
            {unlockedBadges.length} of {ACHIEVEMENT_BADGES.length} milestone badges unlocked
          </div>
        </div>
      </section>

      {/* Pro AI Engineer Hub — 4 Add-On Modules Highlight */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
              Pro AI Engineer Hub • Career Accelerator
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] font-editorial">
              Interviews, Jargon Cheat Sheet, First-Party Docs & AI-Judged Labs
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/interview-prep"
            className="group rounded-2xl border border-[#E8A598]/50 bg-white p-5 hover:border-[#9E4758] hover:shadow-editorial-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8A598]/50 text-[#9E4758] flex items-center justify-center mb-3 group-hover:bg-[#9E4758] group-hover:text-white transition-colors">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-[#9E4758] mb-1">
                26 SCENARIO QUESTIONS
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] font-editorial">
                Interactive Interview Prep Vault
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Practice across LLM Internals, Hybrid RAG, Agents & MCP, and QA-to-AI Evals with Hiring Manager Rubrics.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9E4758]">
              <span>Open Simulator</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/jargon-dictionary"
            className="group rounded-2xl border border-[#E8A598]/50 bg-white p-5 hover:border-[#9E4758] hover:shadow-editorial-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8A598]/50 text-[#9E4758] flex items-center justify-center mb-3 group-hover:bg-[#9E4758] group-hover:text-white transition-colors">
                <BookA className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-[#9E4758] mb-1">
                3-VIEW TRANSLATOR GRID
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] font-editorial">
                Interactive AI Jargon Cheat Sheet
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Every AI term explained in Plain English, a QA/Testing Analogy, and a Production Code snippet.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9E4758]">
              <span>Explore Jargon Grid</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/reference-docs"
            className="group rounded-2xl border border-[#E8A598]/50 bg-white p-5 hover:border-[#9E4758] hover:shadow-editorial-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8A598]/50 text-[#9E4758] flex items-center justify-center mb-3 group-hover:bg-[#9E4758] group-hover:text-white transition-colors">
                <Library className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-[#9E4758] mb-1">
                FIRST-PARTY SOURCES
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] font-editorial">
                Official Reference Library
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Direct curated guides from Anthropic, Google Cloud Vertex AI, OpenAI Cookbook, OWASP, Ragas & DeepEval.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9E4758]">
              <span>Browse Official Docs</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            to="/practical-labs"
            className="group rounded-2xl border border-[#E8A598]/50 bg-white p-5 hover:border-[#9E4758] hover:shadow-editorial-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#FAF7F2] border border-[#E8A598]/50 text-[#9E4758] flex items-center justify-center mb-3 group-hover:bg-[#9E4758] group-hover:text-white transition-colors">
                <FlaskConical className="w-5 h-5" />
              </div>
              <div className="text-xs font-mono font-bold text-[#9E4758] mb-1">
                100-PT AI RUBRIC JUDGE
              </div>
              <h3 className="text-lg font-bold text-[#1E293B] font-editorial">
                Hands-On AI Engineering Labs
              </h3>
              <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                Complete 6 practical challenges—XML Triage, Red Team Guardrails, Judge Rubrics, Hybrid RAG & MCP Agents.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#9E4758]">
              <span>Build & Get Judged</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* 5 Core Learning Tracks Roadmap */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
              Structured 5-Track Curriculum
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] font-editorial">
              Your QA-to-AI Engineering Learning Path
            </h2>
          </div>
          <Link
            to="/tracks"
            className="text-xs font-semibold text-[#9E4758] hover:underline inline-flex items-center gap-1"
          >
            View All Tracks <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {LEARNING_TRACKS.map((track) => {
            const doneInTrack = track.lessons.filter((l) => completedLessons.includes(l.id)).length;
            const pct = Math.round((doneInTrack / track.lessons.length) * 100);

            return (
              <Link
                key={track.id}
                to={`/tracks?track=${track.id}`}
                className="rounded-2xl border border-[#E8A598]/50 bg-[#FAF7F2] p-5 hover:border-[#9E4758] hover:bg-white transition-all flex flex-col justify-between shadow-editorial"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-mono font-bold uppercase px-2.5 py-1 rounded-md bg-[#9E4758] text-white">
                      Track {track.number}
                    </span>
                    <span className="text-xs font-mono text-[#64748B]">{track.estimatedHours}</span>
                  </div>
                  <h3 className="text-lg font-bold text-[#1E293B] font-editorial leading-snug">
                    {track.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-1.5 line-clamp-2">{track.subtitle}</p>

                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-[#E8A598]/30 text-[11px] font-medium text-[#9E4758] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 shrink-0" />
                    <span className="truncate">{track.qaSuperpowerTag}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8A598]/30">
                  <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#1E293B]">
                      {doneInTrack}/{track.lessons.length} Lessons
                    </span>
                    <span className="text-[#9E4758] font-mono">{pct}%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-white overflow-hidden">
                    <div
                      className="h-full bg-[#9E4758] transition-all"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Smart Daily Study Nudge Scheduler & Personal Love Note Row */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Smart Notification & Inactivity Engine Card */}
        <div className="rounded-2xl border border-[#E8A598]/60 bg-[#FAF7F2] p-6 shadow-editorial flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758]/10 text-[#9E4758] text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              Gentle Daily Study Nudges & Inactivity Engine
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
              Stay Consistent with 15-Minute Daily Habits 🌸
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
              Enable browser notifications so we can send you a warm study nudge at your preferred time—and if you’re away for 24+ hours, our zero-guilt Welcome Back recap card helps you jump right back in.
            </p>

            <div className="mt-5 p-4 rounded-xl bg-white border border-[#E8A598]/40 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-[#9E4758]" />
                  <label htmlFor="study-time-input" className="text-xs font-bold text-[#1E293B]">
                    Preferred Daily Nudge Time (15 mins/day):
                  </label>
                </div>
                <input
                  id="study-time-input"
                  type="time"
                  value={preferredStudyTime}
                  onChange={(e) => setPreferredStudyTime(e.target.value)}
                  className="px-3 py-1.5 rounded-lg border border-[#E8A598] text-xs font-mono font-bold text-[#9E4758] bg-[#FAF7F2]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleStudyNudge(!studyNudgeEnabled)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    studyNudgeEnabled
                      ? 'bg-emerald-700 text-white'
                      : 'bg-[#9E4758] text-white hover:bg-[#7D3543]'
                  }`}
                >
                  {studyNudgeEnabled ? '✓ Daily Study Nudges Active 🔔' : 'Enable Daily Study Nudges 🔔'}
                </button>

                <button
                  type="button"
                  onClick={sendTestStudyNotification}
                  className="px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8A598] text-xs font-semibold text-[#9E4758] hover:bg-[#F5EBE6]"
                >
                  Test Push Nudge Now
                </button>

                <button
                  type="button"
                  onClick={() => setShowWeMissedYouModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-[#64748B] hover:text-[#1E293B]"
                >
                  Preview "We Missed You!" Modal
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Encouragement & Love Note Card */}
        <div className="rounded-2xl border border-[#E8A598]/60 bg-gradient-to-br from-[#FDF6F4] to-[#F5EBE6] p-6 shadow-editorial flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#9E4758] border border-[#E8A598]/50 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Personal Cheerleader Note
            </div>
            <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
              {PERSONAL_LOVE_NOTES[0].title}
            </h3>
            <p className="text-xs sm:text-sm text-[#1E293B] mt-2 leading-relaxed italic">
              "{PERSONAL_LOVE_NOTES[0].body}"
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E8A598]/40 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#9E4758]">
              <CheckCircle2 className="w-4 h-4" />
              <span>{unlockedBadges.length} Milestone Badges Unlocked</span>
            </div>
            <Link
              to="/achievements"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-[#9E4758] border border-[#E8A598] text-xs font-semibold hover:bg-[#FAF7F2]"
            >
              Open Badges & Love Notes Wall <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
