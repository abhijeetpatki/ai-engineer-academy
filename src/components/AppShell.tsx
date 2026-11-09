import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Briefcase,
  BookA,
  Library,
  FlaskConical,
  HeartHandshake,
  Sparkles,
  Flame,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Radio,
  LogOut,
  UserCheck
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';
import { LEARNING_TRACKS } from '../data/tracksData';
import { WeMissedYouModal } from './WeMissedYouModal';
import { LoginPage } from './LoginPage';

const NAV_ITEMS = [
  {
    path: '/',
    label: 'Dashboard & Hub',
    shortLabel: 'Home',
    icon: LayoutDashboard,
    section: 'core'
  },
  {
    path: '/tracks',
    label: '5 Learning Tracks + Labs',
    shortLabel: 'Tracks',
    icon: BookOpen,
    section: 'core'
  },
  {
    path: '/ai-pulse',
    label: 'Live AI News Radar',
    shortLabel: 'Live News',
    icon: Radio,
    section: 'core',
    badge: 'LIVE'
  },
  {
    path: '/certification',
    label: 'Mock Exam & Cert',
    shortLabel: 'Cert Exam',
    icon: Award,
    section: 'core'
  },
  {
    path: '/practical-labs',
    label: 'Hands-On AI Labs',
    shortLabel: 'AI Labs',
    icon: FlaskConical,
    section: 'pro',
    badge: '6 Labs'
  },
  {
    path: '/interview-prep',
    label: 'Interview Prep Vault',
    shortLabel: 'Interviews',
    icon: Briefcase,
    section: 'pro',
    badge: '26 Qs'
  },
  {
    path: '/jargon-dictionary',
    label: 'AI Jargon Cheat Sheet',
    shortLabel: 'Jargon',
    icon: BookA,
    section: 'pro'
  },
  {
    path: '/reference-docs',
    label: 'Official Docs Library',
    shortLabel: 'Docs',
    icon: Library,
    section: 'pro'
  },
  {
    path: '/achievements',
    label: 'Badges & Love Notes',
    shortLabel: 'Love Notes',
    icon: HeartHandshake,
    section: 'core'
  }
];

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const {
    isAuthenticated,
    loggedInUsername,
    logout,
    userName,
    completedLessons,
    streakDays,
    studyNudgeEnabled,
    toggleStudyNudge,
    activeToast,
    dismissToast,
    unlockedBadges
  } = useAcademy();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <>
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-6 right-4 left-4 md:left-auto md:w-[420px] z-50 rounded-2xl bg-[#9E4758] text-white p-4 shadow-editorial-lg border border-[#E8A598] flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#FAF7F2] shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-medium leading-snug">{activeToast}</p>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                className="text-white/80 hover:text-white p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        <LoginPage />
      </>
    );
  }

  const totalLessons = LEARNING_TRACKS.reduce((acc, t) => acc + t.lessons.length, 0);
  const progressPct = Math.round((completedLessons.length / totalLessons) * 100);

  const getTimeGreeting = () => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good Morning';
    if (hr < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#FFFFFF] text-[#1E293B]">
      {/* Desktop Collapsible Sidebar */}
      <aside
        className={`hidden md:flex flex-col shrink-0 bg-[#FAF7F2] border-r border-[#E8A598]/40 transition-all duration-300 sticky top-0 h-screen no-print ${
          sidebarCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-[#E8A598]/30 flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-[#9E4758] text-white flex items-center justify-center shrink-0 shadow-sm">
              <Sparkles className="w-5 h-5" />
            </div>
            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-bold text-base text-[#1E293B] font-editorial leading-tight">
                  AI Engineer Academy
                </div>
                <div className="text-[11px] font-medium text-[#9E4758]">
                  Sushama's Certification Hub
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarCollapsed((c) => !c)}
            className="p-1.5 rounded-lg text-[#64748B] hover:text-[#9E4758] hover:bg-[#F5EBE6] transition-colors"
            aria-label="Toggle sidebar"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
          <div>
            {!sidebarCollapsed && (
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                Core Curriculum & Cert
              </div>
            )}
            <nav className="space-y-1">
              {NAV_ITEMS.filter((i) => i.section === 'core').map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#9E4758] text-white shadow-sm'
                          : 'text-[#1E293B] hover:bg-[#F5EBE6] hover:text-[#9E4758]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div>
            {!sidebarCollapsed && (
              <div className="px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-[#9E4758] flex items-center justify-between">
                <span>Pro AI Engineer Hub</span>
                <span className="text-[10px] bg-[#9E4758]/10 px-2 py-0.5 rounded-full">PRO</span>
              </div>
            )}
            <nav className="space-y-1">
              {NAV_ITEMS.filter((i) => i.section === 'pro').map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-[#9E4758] text-white shadow-sm'
                          : 'text-[#1E293B] hover:bg-[#F5EBE6] hover:text-[#9E4758]'
                      }`
                    }
                  >
                    <div className="flex items-center gap-3 truncate">
                      <Icon className="w-4 h-4 shrink-0" />
                      {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
                    </div>
                    {!sidebarCollapsed && item.badge && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#F5EBE6] text-[#9E4758] font-bold">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Progress & Streak Card */}
        {!sidebarCollapsed && (
          <div className="p-4 m-3 rounded-2xl bg-[#F5EBE6] border border-[#E8A598]/50 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-[#1E293B]">
              <span>Sushama's Mastery</span>
              <span className="text-[#9E4758] font-mono">{progressPct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#E8A598] to-[#9E4758] transition-all duration-500"
                style={{ width: `${Math.max(4, progressPct)}%` }}
              />
            </div>
            <div className="flex items-center justify-between text-xs text-[#64748B] pt-1">
              <span className="inline-flex items-center gap-1 font-semibold text-[#9E4758]">
                <Flame className="w-3.5 h-3.5 fill-current" /> {streakDays}d Streak
              </span>
              <span>{unlockedBadges.length}/9 Badges</span>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 md:pb-0">
        {/* Top Personalized Greeting & Quick Nudge Bar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#F5EBE6] px-4 md:px-8 py-3.5 flex items-center justify-between gap-4 no-print">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileDrawerOpen(true)}
              className="md:hidden p-2 rounded-xl bg-[#FAF7F2] border border-[#E8A598]/40 text-[#9E4758]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="min-w-0">
              <div className="text-xs md:text-sm font-bold text-[#1E293B] truncate">
                {getTimeGreeting()}, <span className="text-[#9E4758]">{userName}</span>! ✨
              </div>
              <p className="text-[11px] md:text-xs text-[#64748B] truncate">
                Your QA eye for edge cases makes you unstoppable in AI Engineering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8A598]/50 text-xs font-semibold text-[#1E293B]">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>@{loggedInUsername}</span>
            </div>

            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8A598]/50 text-xs font-semibold text-[#9E4758]">
              <Flame className="w-3.5 h-3.5 fill-current" />
              <span>{streakDays}d Streak</span>
            </div>

            <button
              type="button"
              onClick={() => toggleStudyNudge(!studyNudgeEnabled)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                studyNudgeEnabled
                  ? 'bg-[#9E4758] text-white border-[#9E4758]'
                  : 'bg-[#FAF7F2] text-[#1E293B] border-[#E8A598] hover:bg-[#F5EBE6]'
              }`}
              title="Toggle Daily Study Nudges"
            >
              <Bell className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">
                {studyNudgeEnabled ? 'Daily Nudges On 🔔' : 'Enable Nudges 🔔'}
              </span>
            </button>

            <button
              type="button"
              onClick={logout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-semibold text-[#64748B] hover:text-[#9E4758] hover:border-[#E8A598] transition-all"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </header>

        {/* Floating Micro-Appreciation Toast Popup */}
        <AnimatePresence>
          {activeToast && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="fixed top-16 right-4 left-4 md:left-auto md:w-[440px] z-50 rounded-2xl bg-[#9E4758] text-white p-4 shadow-editorial-lg border border-[#E8A598] flex items-start justify-between gap-3 no-print"
            >
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#FAF7F2] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-bold text-[#F5EBE6]">
                    Personal Cheerleader Note
                  </div>
                  <p className="text-xs sm:text-sm font-medium leading-snug mt-0.5">{activeToast}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={dismissToast}
                className="text-white/80 hover:text-white p-1"
                aria-label="Dismiss notification"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Page Body */}
        <main className="flex-1 px-4 sm:px-6 md:px-10 py-6 md:py-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Slide-Over Full Navigation Drawer */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
              onClick={() => setMobileDrawerOpen(false)}
            />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="relative w-72 max-w-[85vw] bg-[#FAF7F2] h-full p-5 flex flex-col justify-between z-10 border-r border-[#E8A598]"
            >
              <div>
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8A598]/40">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#9E4758] text-white flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-base font-editorial text-[#1E293B]">
                      AI Engineer Academy
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileDrawerOpen(false)}
                    className="p-1.5 rounded-lg text-[#64748B]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        end={item.path === '/'}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={({ isActive }) =>
                          `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold ${
                            isActive
                              ? 'bg-[#9E4758] text-white'
                              : 'text-[#1E293B] hover:bg-[#F5EBE6]'
                          }`
                        }
                      >
                        <span className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/20">
                            {item.badge}
                          </span>
                        )}
                      </NavLink>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-2">
                <div className="p-3.5 rounded-xl bg-[#F5EBE6] border border-[#E8A598]/50 text-xs">
                  <div className="font-bold text-[#9E4758]">Sushama's Mastery: {progressPct}%</div>
                  <div className="text-[#64748B] mt-0.5">
                    {completedLessons.length}/{totalLessons} Lessons Completed
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileDrawerOpen(false);
                    logout();
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-white border border-[#E8A598]/50 text-xs font-semibold text-[#9E4758] flex items-center justify-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out (@{loggedInUsername})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8A598]/40 px-2 py-1.5 flex items-center justify-around no-print">
        {[NAV_ITEMS[0], NAV_ITEMS[1], NAV_ITEMS[3], NAV_ITEMS[4], NAV_ITEMS[2]].map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2.5 py-1 rounded-xl text-[11px] font-semibold transition-colors ${
                  isActive ? 'text-[#9E4758]' : 'text-[#64748B]'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.shortLabel}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* >24h Inactivity "We Missed You!" Modal */}
      <WeMissedYouModal />
    </div>
  );
};
