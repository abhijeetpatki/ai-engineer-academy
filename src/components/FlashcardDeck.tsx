import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, ChevronLeft, ChevronRight, CheckCircle2, Sparkles, HelpCircle } from 'lucide-react';
import { FlashcardItem } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';

interface Props {
  cards: FlashcardItem[];
  trackTitle: string;
}

export const FlashcardDeck: React.FC<Props> = ({ cards, trackTitle }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const { flashcardsReviewed, markFlashcardReviewed, triggerCelebration } = useAcademy();

  if (!cards.length) return null;

  const currentCard = cards[currentIndex] || cards[0];
  const isReviewed = flashcardsReviewed.includes(currentCard.id);

  const handleFlip = () => {
    const nextFlip = !isFlipped;
    setIsFlipped(nextFlip);
    if (nextFlip) {
      markFlashcardReviewed(currentCard.id);
    }
  };

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex + 1 < cards.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
      triggerCelebration(`You flipped through the entire "${trackTitle}" flashcard deck! Active recall mastery ✨`);
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  return (
    <div className="rounded-2xl border border-[#E8A598]/40 bg-[#FAF7F2] p-5 md:p-6 shadow-editorial">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758]/10 text-[#9E4758] text-xs font-semibold uppercase tracking-wider mb-1.5">
            <RotateCw className="w-3.5 h-3.5" />
            Active Recall Flashcards
          </div>
          <h3 className="text-xl font-bold text-[#1E293B] font-editorial">
            Quick Concept & Interview Recall Deck
          </h3>
        </div>
        <div className="text-xs font-semibold text-[#64748B] bg-white px-3.5 py-1.5 rounded-full border border-[#E8A598]/40">
          Card {currentIndex + 1} of {cards.length} •{' '}
          <span className="text-[#9E4758]">
            {cards.filter((c) => flashcardsReviewed.includes(c.id)).length}/{cards.length} Mastered
          </span>
        </div>
      </div>

      {/* Interactive Flip Card */}
      <div
        onClick={handleFlip}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleFlip();
          }
        }}
        className="cursor-pointer select-none"
      >
        <motion.div
          key={`${currentCard.id}-${isFlipped ? 'back' : 'front'}`}
          initial={{ opacity: 0, rotateX: isFlipped ? -12 : 12, scale: 0.98 }}
          animate={{ opacity: 1, rotateX: 0, scale: 1 }}
          transition={{ duration: 0.22 }}
          className={`min-h-[220px] rounded-2xl p-6 md:p-8 flex flex-col justify-between border-2 transition-colors ${
            isFlipped
              ? 'bg-gradient-to-br from-[#FDF6F4] via-white to-[#F5EBE6] border-[#9E4758]'
              : 'bg-white border-[#E8A598]/60 hover:border-[#9E4758]'
          }`}
        >
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-mono font-semibold uppercase px-2.5 py-1 rounded-md bg-[#FAF7F2] text-[#9E4758] border border-[#E8A598]/40">
              {currentCard.tag}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#64748B]">
              {isReviewed && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
              {isFlipped ? 'Showing Answer (Click to flip back)' : 'Click card to reveal answer ↻'}
            </span>
          </div>

          {!isFlipped ? (
            <div className="my-6">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#9E4758] shrink-0 mt-0.5" />
                <p className="text-lg md:text-xl font-bold text-[#1E293B] leading-snug font-editorial">
                  {currentCard.front}
                </p>
              </div>
            </div>
          ) : (
            <div className="my-4 space-y-4">
              <p className="text-sm md:text-base text-[#1E293B] font-medium leading-relaxed">
                {currentCard.back}
              </p>
              <div className="rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758] p-3.5">
                <div className="text-xs font-bold uppercase tracking-wider text-[#9E4758] flex items-center gap-1.5 mb-1">
                  <Sparkles className="w-3.5 h-3.5" /> QA Bridge Pro-Tip:
                </div>
                <p className="text-xs sm:text-sm text-[#1E293B]">{currentCard.qaBridgeTip}</p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-[#64748B]">
            <span>Tap anywhere on card to flip</span>
            <span className="font-semibold text-[#9E4758]">Active Recall Engine</span>
          </div>
        </motion.div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-4">
        <button
          type="button"
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E8A598]/60 text-xs font-semibold text-[#1E293B] hover:bg-[#F5EBE6] transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Previous Card
        </button>

        <div className="flex items-center gap-1.5">
          {cards.map((c, idx) => (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                setIsFlipped(false);
                setCurrentIndex(idx);
              }}
              aria-label={`Go to card ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex
                  ? 'w-6 bg-[#9E4758]'
                  : flashcardsReviewed.includes(c.id)
                  ? 'w-2 bg-[#E8A598]'
                  : 'w-2 bg-slate-300'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] transition-colors shadow-sm"
        >
          {currentIndex + 1 === cards.length ? 'Finish Deck ✨' : 'Next Card'}{' '}
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
