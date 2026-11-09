import React from 'react';
import {
  Sparkles,
  Cpu,
  Terminal,
  Globe,
  Crown,
  Compass,
  Wrench,
  Award,
  ShieldCheck,
  Heart,
  Lock,
  CheckCircle2,
  PartyPopper
} from 'lucide-react';
import { ACHIEVEMENT_BADGES, PERSONAL_LOVE_NOTES } from '../data/achievementsData';
import { useAcademy } from '../context/AcademyContext';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles,
  Cpu,
  Terminal,
  Globe,
  Crown,
  Compass,
  Wrench,
  Award,
  ShieldCheck
};

export const AchievementsPage: React.FC = () => {
  const { unlockedBadges, triggerCelebration, userName } = useAcademy();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FAF7F2] via-[#F5EBE6] to-[#FAF7F2] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-semibold uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 fill-current" />
            Milestone Badges & Love Notes Wall
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
            Celebrating Every Step of Your AI Engineering Journey, {userName} 🌸
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Unlock badges as you complete lessons, pass AI-judged practical labs, and conquer the mock certification exam.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            triggerCelebration(
              `You are doing amazing, ${userName}! Every single day you invest in yourself builds an extraordinary future 💖`
            )
          }
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] transition-all shrink-0 self-start md:self-center shadow-sm"
        >
          <PartyPopper className="w-4 h-4" /> Trigger Pep Talk & Confetti ✨
        </button>
      </div>

      {/* Milestone Badges Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#1E293B] font-editorial">
            Unlockable AI Engineer Milestone Badges ({unlockedBadges.length}/{ACHIEVEMENT_BADGES.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {ACHIEVEMENT_BADGES.map((badge) => {
            const isUnlocked = unlockedBadges.includes(badge.id);
            const IconComponent = ICON_MAP[badge.iconName] || Sparkles;

            return (
              <div
                key={badge.id}
                className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-white via-[#FAF7F2] to-[#F5EBE6] border-2 border-[#9E4758] shadow-editorial'
                    : 'bg-[#FAF7F2]/70 border-[#E8A598]/40 opacity-85'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        isUnlocked
                          ? 'bg-[#9E4758] text-white shadow-sm'
                          : 'bg-white text-[#D48C84] border border-[#E8A598]/50'
                      }`}
                    >
                      <IconComponent className="w-6 h-6" />
                    </div>
                    {isUnlocked ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Unlocked ✨
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white text-[#64748B] border border-slate-200 text-xs font-medium">
                        <Lock className="w-3 h-3" /> Locked Milestone
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-[#1E293B] font-editorial">{badge.title}</h3>
                  <p className="text-xs font-semibold text-[#9E4758] mt-0.5">{badge.subtitle}</p>

                  <div className="mt-3 p-3.5 rounded-xl bg-white border border-[#E8A598]/40">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E4758] mb-1">
                      Heartfelt Note for You:
                    </div>
                    <p className="text-xs text-[#1E293B] leading-relaxed italic">"{badge.loveNote}"</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8A598]/30 text-[11px] text-[#64748B] font-mono">
                  Criteria: {badge.unlockCriteria}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Personal Encouragement & Love Notes Wall */}
      <section className="space-y-4">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758]">
            Whenever You Need a Confidence Boost
          </div>
          <h2 className="text-xl font-bold text-[#1E293B] font-editorial">
            The QA-to-AI Engineer Love Notes Wall 💌
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PERSONAL_LOVE_NOTES.map((note) => (
            <div
              key={note.id}
              className="rounded-2xl border border-[#E8A598]/60 bg-[#FAF7F2] p-6 shadow-editorial space-y-2.5"
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#9E4758]/10 text-[#9E4758]">
                {note.tag}
              </span>
              <h3 className="text-lg font-bold text-[#1E293B] font-editorial">{note.title}</h3>
              <p className="text-sm text-[#1E293B] leading-relaxed">{note.body}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
