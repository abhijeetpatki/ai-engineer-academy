import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { APPRECIATION_TOAST_MESSAGES } from '../data/achievementsData';
import { LEARNING_TRACKS } from '../data/tracksData';
import { LabScoreBreakdown } from '../types/academy';

export interface ExamAttemptRecord {
  id: string;
  date: string;
  score: number;
  total: number;
  percentage: number;
  passed: boolean;
  domainScores: Record<string, { correct: number; total: number }>;
}

export interface LabSubmissionRecord {
  taskId: string;
  code: string;
  breakdown: LabScoreBreakdown;
  timestamp: number;
}

interface AcademyState {
  userName: string;
  completedLessons: string[];
  bookmarkedItems: string[];
  flashcardsReviewed: string[];
  trackQuizScores: Record<string, { score: number; total: number; timestamp: number }>;
  examHistory: ExamAttemptRecord[];
  unlockedBadges: string[];
  labSubmissions: Record<string, LabSubmissionRecord>;
  interviewDrafts: Record<string, string>;
  streakDays: number;
  lastActiveTimestamp: number;
  studyNudgeEnabled: boolean;
  preferredStudyTime: string;
}

interface AcademyContextValue extends AcademyState {
  activeToast: string | null;
  showWeMissedYouModal: boolean;
  setShowWeMissedYouModal: (show: boolean) => void;
  setUserName: (name: string) => void;
  toggleLessonComplete: (lessonId: string, lessonTitle?: string) => void;
  toggleBookmark: (itemId: string) => void;
  markFlashcardReviewed: (cardId: string) => void;
  recordTrackQuizScore: (trackId: string, score: number, total: number) => void;
  recordCertificationExam: (attempt: ExamAttemptRecord) => void;
  saveLabSubmission: (taskId: string, code: string, breakdown: LabScoreBreakdown) => void;
  saveInterviewDraft: (questionId: string, draftText: string) => void;
  toggleStudyNudge: (enabled: boolean) => Promise<boolean>;
  setPreferredStudyTime: (time: string) => void;
  triggerCelebration: (customMessage?: string) => void;
  dismissToast: () => void;
  sendTestStudyNotification: () => Promise<void>;
}

const STORAGE_KEY = 'ai_engineer_academy_state_v1';

const DEFAULT_STATE: AcademyState = {
  userName: 'Future AI Engineer',
  completedLessons: [],
  bookmarkedItems: [],
  flashcardsReviewed: [],
  trackQuizScores: {},
  examHistory: [],
  unlockedBadges: [],
  labSubmissions: {},
  interviewDrafts: {},
  streakDays: 1,
  lastActiveTimestamp: Date.now(),
  studyNudgeEnabled: false,
  preferredStudyTime: '19:30'
};

const AcademyContext = createContext<AcademyContextValue | undefined>(undefined);

export const AcademyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AcademyState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATE, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to parse localStorage state:', e);
    }
    return DEFAULT_STATE;
  });

  const [activeToast, setActiveToast] = useState<string | null>(null);
  const [showWeMissedYouModal, setShowWeMissedYouModal] = useState<boolean>(false);

  // Check >24h inactivity on initial mount & update streak
  useEffect(() => {
    const now = Date.now();
    const hoursSinceLastActive = (now - state.lastActiveTimestamp) / (1000 * 60 * 60);

    if (hoursSinceLastActive >= 24 && state.completedLessons.length > 0) {
      setShowWeMissedYouModal(true);
    }

    // Update streak if returning on a new calendar day within 48h
    const lastDate = new Date(state.lastActiveTimestamp).toDateString();
    const todayDate = new Date(now).toDateString();

    if (lastDate !== todayDate) {
      setState((prev) => ({
        ...prev,
        streakDays: hoursSinceLastActive <= 48 ? prev.streakDays + 1 : 1,
        lastActiveTimestamp: now
      }));
    } else {
      setState((prev) => ({ ...prev, lastActiveTimestamp: now }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Failed to save state to localStorage:', e);
    }
  }, [state]);

  const triggerCelebration = useCallback((customMessage?: string) => {
    try {
      confetti({
        particleCount: 70,
        spread: 65,
        origin: { y: 0.7 },
        colors: ['#9E4758', '#E8A598', '#D48C84', '#F59E0B', '#10B981']
      });
    } catch {
      // Ignore confetti errors in headless test environments
    }

    const randomMsg =
      customMessage ||
      APPRECIATION_TOAST_MESSAGES[Math.floor(Math.random() * APPRECIATION_TOAST_MESSAGES.length)];
    setActiveToast(randomMsg);
  }, []);

  // Automatically evaluate badge unlock rules whenever progress updates
  useEffect(() => {
    const newlyUnlocked: string[] = [];
    const hasBadge = (id: string) => state.unlockedBadges.includes(id) || newlyUnlocked.includes(id);

    if (state.completedLessons.length >= 1 && !hasBadge('badge-first-step')) {
      newlyUnlocked.push('badge-first-step');
    }

    LEARNING_TRACKS.forEach((track, idx) => {
      const badgeId = `badge-track-${idx + 1}`;
      const allLessonsDone = track.lessons.every((l) => state.completedLessons.includes(l.id));
      if (allLessonsDone && !hasBadge(badgeId)) {
        newlyUnlocked.push(badgeId);
      }
    });

    const passedLabs = Object.values(state.labSubmissions).filter((sub) => sub.breakdown.total >= 80);
    if (passedLabs.length >= 1 && !hasBadge('badge-lab-starter')) {
      newlyUnlocked.push('badge-lab-starter');
    }
    if (passedLabs.length >= 6 && !hasBadge('badge-lab-master')) {
      newlyUnlocked.push('badge-lab-master');
    }

    const passedExam = state.examHistory.some((ex) => ex.passed);
    if (passedExam && !hasBadge('badge-certified-ready')) {
      newlyUnlocked.push('badge-certified-ready');
    }

    if (newlyUnlocked.length > 0) {
      setState((prev) => ({
        ...prev,
        unlockedBadges: Array.from(new Set([...prev.unlockedBadges, ...newlyUnlocked]))
      }));
      triggerCelebration(`New Milestone Badge Unlocked! Check your Achievements & Love Notes Wall ✨`);
    }
  }, [state.completedLessons, state.labSubmissions, state.examHistory, state.unlockedBadges, triggerCelebration]);

  const setUserName = (userName: string) => {
    setState((prev) => ({ ...prev, userName }));
  };

  const toggleLessonComplete = (lessonId: string, lessonTitle?: string) => {
    setState((prev) => {
      const alreadyDone = prev.completedLessons.includes(lessonId);
      const updated = alreadyDone
        ? prev.completedLessons.filter((id) => id !== lessonId)
        : [...prev.completedLessons, lessonId];

      if (!alreadyDone) {
        triggerCelebration(
          lessonTitle
            ? `You just mastered "${lessonTitle}"! One step closer to that AI Engineer title ✨`
            : undefined
        );
      }
      return {
        ...prev,
        completedLessons: updated,
        lastActiveTimestamp: Date.now()
      };
    });
  };

  const toggleBookmark = (itemId: string) => {
    setState((prev) => {
      const exists = prev.bookmarkedItems.includes(itemId);
      return {
        ...prev,
        bookmarkedItems: exists
          ? prev.bookmarkedItems.filter((id) => id !== itemId)
          : [...prev.bookmarkedItems, itemId]
      };
    });
  };

  const markFlashcardReviewed = (cardId: string) => {
    setState((prev) => {
      if (prev.flashcardsReviewed.includes(cardId)) return prev;
      const updated = [...prev.flashcardsReviewed, cardId];
      if (updated.length % 4 === 0) {
        triggerCelebration(`Active Recall Superstar! You've reviewed ${updated.length} flashcards 🌸`);
      }
      return { ...prev, flashcardsReviewed: updated, lastActiveTimestamp: Date.now() };
    });
  };

  const recordTrackQuizScore = (trackId: string, score: number, total: number) => {
    setState((prev) => ({
      ...prev,
      trackQuizScores: {
        ...prev.trackQuizScores,
        [trackId]: { score, total, timestamp: Date.now() }
      },
      lastActiveTimestamp: Date.now()
    }));
    const pct = Math.round((score / total) * 100);
    triggerCelebration(
      pct >= 80
        ? `Brilliant ${pct}% on the Track Check! Your QA analytical instincts are spot-on ✨`
        : `Great practice round (${pct}%)! Every explanation reviewed sharpens your engineering edge 🌸`
    );
  };

  const recordCertificationExam = (attempt: ExamAttemptRecord) => {
    setState((prev) => ({
      ...prev,
      examHistory: [attempt, ...prev.examHistory],
      lastActiveTimestamp: Date.now()
    }));
    if (attempt.passed) {
      triggerCelebration(
        `CONGRATULATIONS! You scored ${attempt.percentage}% and unlocked your Certified AI Engineer Readiness Certificate! 🎓💖`
      );
    } else {
      triggerCelebration(
        `Exam completed (${attempt.percentage}%)! Review your Diagnostic Skill Radar to target your next study session ✨`
      );
    }
  };

  const saveLabSubmission = (taskId: string, code: string, breakdown: LabScoreBreakdown) => {
    setState((prev) => ({
      ...prev,
      labSubmissions: {
        ...prev.labSubmissions,
        [taskId]: { taskId, code, breakdown, timestamp: Date.now() }
      },
      lastActiveTimestamp: Date.now()
    }));
    if (breakdown.total >= 80) {
      triggerCelebration(
        `Lab Passed with ${breakdown.total}/100 (${breakdown.verdictTitle})! Your hands-on AI engineering skills are shining ✨`
      );
    }
  };

  const saveInterviewDraft = (questionId: string, draftText: string) => {
    setState((prev) => ({
      ...prev,
      interviewDrafts: {
        ...prev.interviewDrafts,
        [questionId]: draftText
      }
    }));
  };

  const sendTestStudyNotification = async () => {
    const title = 'AI Engineer Academy 🌸';
    const body =
      'We miss you, Future AI Engineer! Just 5 minutes today on Claude MCP or RAG Evals will keep your streak glowing ✨';

    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        if ('serviceWorker' in navigator) {
          const reg = await navigator.serviceWorker.getRegistration();
          if (reg && 'showNotification' in reg) {
            await reg.showNotification(title, {
              body,
              icon: '/icon.svg',
              badge: '/icon.svg'
            });
            setActiveToast('Sent browser notification! Check your system notification tray 🔔');
            return;
          }
        }
        new Notification(title, { body, icon: '/icon.svg' });
        setActiveToast('Sent browser notification! Check your system notification tray 🔔');
        return;
      } catch {
        // Fallback to in-app toast
      }
    }
    setActiveToast(`🔔 Daily Study Nudge Preview: "${body}"`);
  };

  const toggleStudyNudge = async (enabled: boolean): Promise<boolean> => {
    if (!enabled) {
      setState((prev) => ({ ...prev, studyNudgeEnabled: false }));
      setActiveToast('Daily study nudges paused. You can re-enable them anytime!');
      return false;
    }

    if ('Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        if (perm === 'granted') {
          setState((prev) => ({ ...prev, studyNudgeEnabled: true }));
          await sendTestStudyNotification();
          return true;
        }
      } catch {
        // Fallback for sandboxed/restricted browsers
      }
    }

    // Even if browser blocks native OS push permission, enable Smart In-App Nudge mode
    setState((prev) => ({ ...prev, studyNudgeEnabled: true }));
    setActiveToast(
      `Smart Daily Study Nudges enabled for ${state.preferredStudyTime}! We'll keep your streak glowing 🌸`
    );
    return true;
  };

  const setPreferredStudyTime = (preferredStudyTime: string) => {
    setState((prev) => ({ ...prev, preferredStudyTime }));
  };

  const dismissToast = () => setActiveToast(null);

  return (
    <AcademyContext.Provider
      value={{
        ...state,
        activeToast,
        showWeMissedYouModal,
        setShowWeMissedYouModal,
        setUserName,
        toggleLessonComplete,
        toggleBookmark,
        markFlashcardReviewed,
        recordTrackQuizScore,
        recordCertificationExam,
        saveLabSubmission,
        saveInterviewDraft,
        toggleStudyNudge,
        setPreferredStudyTime,
        triggerCelebration,
        dismissToast,
        sendTestStudyNotification
      }}
    >
      {children}
    </AcademyContext.Provider>
  );
};

export const useAcademy = (): AcademyContextValue => {
  const ctx = useContext(AcademyContext);
  if (!ctx) throw new Error('useAcademy must be used inside AcademyProvider');
  return ctx;
};
