import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Clock, ArrowRight, X, CheckCircle2 } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { LEARNING_TRACKS } from '../data/tracksData';
import { useNavigate } from 'react-router-dom';

export const WeMissedYouModal: React.FC = () => {
  const { showWeMissedYouModal, setShowWeMissedYouModal, completedLessons, userName } = useAcademy();
  const navigate = useNavigate();

  if (!showWeMissedYouModal) return null;

  // Find the most recently completed lesson or the first lesson to offer a 2-minute recap
  const allLessons = LEARNING_TRACKS.flatMap((t) => t.lessons);
  const lastCompletedLesson =
    allLessons.filter((l) => completedLessons.includes(l.id)).slice(-1)[0] || allLessons[0];
  const nextUpLesson =
    allLessons.find((l) => !completedLessons.includes(l.id)) || allLessons[0];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="max-w-lg w-full rounded-3xl bg-[#FFFFFF] border-2 border-[#E8A598] shadow-editorial-lg overflow-hidden"
        >
          {/* Warm Header Banner */}
          <div className="bg-gradient-to-r from-[#FAF7F2] via-[#F5EBE6] to-[#FAF7F2] p-6 border-b border-[#E8A598]/40 relative">
            <button
              type="button"
              onClick={() => setShowWeMissedYouModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#64748B] hover:text-[#1E293B] hover:bg-white/70 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-semibold mb-3">
              <Heart className="w-3.5 h-3.5 fill-current" />
              Zero-Guilt Welcome Back
            </div>
            <h2 className="text-2xl font-bold text-[#1E293B] font-editorial">
              We Missed You, {userName}! 🌸
            </h2>
            <p className="text-sm text-[#64748B] mt-1">
              Life gets busy—and that’s 100% okay! Progress isn’t about perfection; it’s about gently picking back up right where you left off.
            </p>
          </div>

          {/* 2-Minute Quick Recap Card */}
          <div className="p-6 space-y-5">
            <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/60 p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#9E4758]">
                  <Clock className="w-3.5 h-3.5" /> 2-Minute Warm-Up Refresher
                </span>
                <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Instant Memory Spark
                </span>
              </div>

              <h3 className="text-base font-bold text-[#1E293B] mb-1">
                {lastCompletedLesson.title}
              </h3>
              <p className="text-xs text-[#64748B] mb-3">
                {lastCompletedLesson.modes.simple.headline}
              </p>

              <ul className="space-y-1.5">
                {lastCompletedLesson.modes.simple.keyTakeaways.slice(0, 2).map((pt, idx) => (
                  <li key={idx} className="text-xs text-[#1E293B] flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#9E4758] shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-[#FDF6F4] p-3.5 border border-[#E8A598]/40 flex items-center justify-between gap-3">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E4758]">
                  Recommended Next Bite-Sized Step (5 Mins)
                </div>
                <div className="text-sm font-semibold text-[#1E293B] mt-0.5">
                  {nextUpLesson.title}
                </div>
              </div>
              <Sparkles className="w-5 h-5 text-[#9E4758] shrink-0" />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowWeMissedYouModal(false)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-[#64748B] hover:text-[#1E293B] hover:bg-slate-50 transition-colors"
              >
                Explore Dashboard First
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowWeMissedYouModal(false);
                  navigate(`/tracks?track=${nextUpLesson.trackId}`);
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] transition-colors shadow-sm"
              >
                Jump Back In (5-Min Session) <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
