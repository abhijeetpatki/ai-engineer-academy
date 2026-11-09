import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Lock,
  User,
  Eye,
  EyeOff,
  Heart,
  ShieldCheck,
  Award,
  BookOpen,
  FlaskConical,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export const LoginPage: React.FC = () => {
  const { login } = useAcademy();
  const [username, setUsername] = useState('sushama');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const ok = login(username, password, rememberMe);
    if (!ok) {
      setError(
        'Invalid username or password. Please use Username: sushama and Password: Sushama@AI2026'
      );
    }
  };

  const handleQuickFill = () => {
    setUsername('sushama');
    setPassword('Sushama@AI2026');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF7F2] via-[#FFFFFF] to-[#F5EBE6] flex flex-col justify-center items-center px-4 py-10 text-[#1E293B]">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-3xl bg-white border border-[#E8A598]/60 shadow-editorial-lg overflow-hidden">
        {/* Left Editorial Welcome Column */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FDF6F4] p-7 sm:p-10 border-b lg:border-b-0 lg:border-r border-[#E8A598]/50 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8A598] text-xs font-bold text-[#9E4758] shadow-2xs">
              <Sparkles className="w-3.5 h-3.5" />
              Exclusive Learning Portal for Sushama 🌸
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold text-[#1E293B] font-editorial leading-tight">
              Welcome, Sushama! Your QA-to-AI Engineer Journey Starts Here ✨
            </h1>

            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Sign in to your personal workspace to track your 5 learning tracks, interactive BPE & RAG simulators, 6 AI-judged engineering labs, and earn your **Certified AI Engineer Readiness Certificate**.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/85 border border-[#E8A598]/40">
                <BookOpen className="w-5 h-5 text-[#9E4758] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">
                    5 Deep-Dive Tracks + Interactive Workbenches
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    LLM Internals, Anthropic Claude & MCP, Google Gemini, Hybrid RAG & QA-to-AI Evals.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/85 border border-[#E8A598]/40">
                <FlaskConical className="w-5 h-5 text-[#9E4758] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">
                    6 AI-Judged Labs + 26 Interview Scenarios
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Hands-on prompt engineering, red-teaming, and rubric grading saved directly to your profile.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white/85 border border-[#E8A598]/40">
                <Award className="w-5 h-5 text-[#9E4758] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-[#1E293B]">
                    Personal Progress, Streak & Official Readiness Certificate
                  </div>
                  <p className="text-[11px] text-[#64748B] mt-0.5">
                    Every completed lesson, quiz, flashcard, and badge is saved under your account.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#E8A598]/60 flex items-start gap-3">
            <Heart className="w-5 h-5 text-[#9E4758] fill-current shrink-0 mt-0.5" />
            <div className="text-xs text-[#1E293B] leading-relaxed">
              <span className="font-bold text-[#9E4758]">A Note from Abhijeet:</span>{' '}
              <em>
                "Built especially for you, Sushama! Your sharp QA eye for edge cases gives you an unfair advantage in AI Engineering. Take it one module at a time—you’ve got this!"
              </em>
            </div>
          </div>
        </div>

        {/* Right Login Form Column */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 p-7 sm:p-10 flex flex-col justify-center"
        >
          <div className="max-w-md mx-auto w-full space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-[#9E4758] text-white flex items-center justify-center shadow-sm mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-[#1E293B] font-editorial">
                Sign In to Your Academy Account
              </h2>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                Enter your personal credentials below to access your dashboard and saved progress.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-username"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                >
                  Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#9E4758] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="sushama"
                    autoComplete="username"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#E8A598] bg-[#FAF7F2]/60 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#9E4758] focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block text-xs font-bold uppercase tracking-wider text-[#1E293B] mb-1.5"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9E4758] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#E8A598] bg-[#FAF7F2]/60 text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#9E4758] focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#9E4758]"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <label className="inline-flex items-center gap-2 cursor-pointer text-[#64748B] font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#E8A598] text-[#9E4758] focus:ring-[#9E4758]"
                  />
                  <span>Keep me signed in on this device</span>
                </label>

                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="font-semibold text-[#9E4758] hover:underline"
                >
                  Auto-fill credentials
                </button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-800">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-5 rounded-xl bg-[#9E4758] text-white text-sm font-bold hover:bg-[#7D3543] transition-all shadow-sm flex items-center justify-center gap-2"
              >
                <span>Sign In as Sushama</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            {/* Quick Credential Reference Card */}
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9E4758] flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sushama's Member Login Details
                </span>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-white border border-[#E8A598] text-[#9E4758] hover:bg-[#F5EBE6]"
                >
                  Tap to Fill
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-white border border-[#E8A598]/30">
                  <div className="text-[10px] uppercase text-[#64748B] font-semibold">Username</div>
                  <div className="font-mono font-bold text-[#1E293B] mt-0.5">sushama</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#E8A598]/30">
                  <div className="text-[10px] uppercase text-[#64748B] font-semibold">Password</div>
                  <div className="font-mono font-bold text-[#9E4758] mt-0.5">Sushama@AI2026</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
