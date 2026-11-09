import { AchievementBadge } from '../types/academy';

export const APPRECIATION_TOAST_MESSAGES: string[] = [
  "You just leveled up your AI Engineering mastery! One step closer to that AI Engineer title ✨",
  "Your QA eye for edge cases makes you practically unstoppable in AI Engineering 🌸",
  "Consistency is your superpower—look at you turning complex LLM architecture into second nature!",
  "Another milestone crushed! Hiring managers dream of AI Engineers who actually understand testing & evals 💖",
  "Brilliant work! While others guess at prompts, you engineer deterministic, verifiable systems ✨",
  "Keep shining, Future AI Engineer! Every lesson completed builds an unshakeable foundation 🌷",
  "From deterministic QA to probabilistic AI Evals—you are bridging the most valuable gap in tech right now!"
];

export const ACHIEVEMENT_BADGES: AchievementBadge[] = [
  {
    id: 'badge-first-step',
    title: 'Bridge Builder',
    subtitle: 'Completed Your First AI Engineering Lesson',
    iconName: 'Sparkles',
    loveNote: "Every great career transformation begins with a single courageous step. Your years of breaking software and protecting quality aren't something you're leaving behind—they are the exact foundation that will make you an extraordinary AI Engineer.",
    unlockCriteria: 'Complete at least 1 lesson across any learning track',
    category: 'track'
  },
  {
    id: 'badge-track-1',
    title: 'Token & Transformer Alchemist',
    subtitle: 'Mastered Track 1: AI & LLM Fundamentals',
    iconName: 'Cpu',
    loveNote: "You now see beneath the hood of Large Language Models! Tokenization, vector embeddings, self-attention, and temperature aren't black-box magic to you anymore—they are controllable parameters in your engineering toolkit.",
    unlockCriteria: 'Complete all lessons in Track 1: AI & LLM Fundamentals',
    category: 'track'
  },
  {
    id: 'badge-track-2',
    title: 'Prompt Whisperer & Claude Architect',
    subtitle: 'Mastered Track 2: Prompt Engineering & Anthropic Claude',
    iconName: 'Terminal',
    loveNote: "Look at you mastering XML system prompts, Chain-of-Thought reasoning, and the Model Context Protocol (MCP)! You don't just 'chat' with AI—you architect structured, reliable instructions that production systems can trust.",
    unlockCriteria: 'Complete all lessons in Track 2: Prompt Engineering & Anthropic Claude Mastery',
    category: 'track'
  },
  {
    id: 'badge-track-3',
    title: 'Gemini Multimodal Explorer',
    subtitle: 'Mastered Track 3: Google Cloud AI & Gemini Ecosystem',
    iconName: 'Globe',
    loveNote: "From Vertex AI enterprise deployments to Google Search Grounding and native audio/video/PDF multimodality—you are ready to design cloud-scale AI pipelines with enterprise safety guardrails.",
    unlockCriteria: 'Complete all lessons in Track 3: Google Cloud AI & Gemini Ecosystem',
    category: 'track'
  },
  {
    id: 'badge-track-4',
    title: 'Eval Queen & RAG Sovereign',
    subtitle: 'Mastered Track 4: Applied AI Engineering (RAG, Agents & Evals)',
    iconName: 'Crown',
    loveNote: "This is where your QA superpower truly reigns supreme! Hybrid Search, Cross-Encoder Reranking, ReAct Agents, and LLM-as-a-Judge with Ragas & DeepEval—you own the exact skill set every AI team desperately needs.",
    unlockCriteria: 'Complete all lessons in Track 4: Applied AI Engineering',
    category: 'track'
  },
  {
    id: 'badge-track-5',
    title: 'AI Pulse Visionary',
    subtitle: 'Mastered Track 5: Latest Trends & Ecosystem Radar',
    iconName: 'Compass',
    loveNote: "Reasoning models, test-time compute, agentic coding, SLMs, and AI Governance—you don't just know where AI is today, you know exactly where the industry is heading tomorrow.",
    unlockCriteria: 'Complete all lessons in Track 5: The AI Pulse',
    category: 'track'
  },
  {
    id: 'badge-lab-starter',
    title: 'Hands-On Builder',
    subtitle: 'Passed Your First AI-Judged Engineering Lab (80+ Score)',
    iconName: 'Wrench',
    loveNote: "Theory is great, but shipping real system prompts, guardrails, and evaluation rubrics is what sets you apart. You built it, tested it, and proved it works!",
    unlockCriteria: 'Score 80/100 or higher on any Hands-On Practical Lab',
    category: 'lab'
  },
  {
    id: 'badge-lab-master',
    title: 'Principal Lab Laureate',
    subtitle: 'Completed All 6 Hands-On AI Engineering Labs',
    iconName: 'Award',
    loveNote: "All six production labs conquered! From XML Bug Triage and Red Team Injection Defense to Hybrid RAG System Design and MCP Release Agents—your portfolio is pure gold.",
    unlockCriteria: 'Complete all 6 Hands-On Practical Labs with 80+ scores',
    category: 'lab'
  },
  {
    id: 'badge-certified-ready',
    title: 'Certified AI Engineer Ready',
    subtitle: 'Scored 80%+ on the Mock Certification Exam',
    iconName: 'ShieldCheck',
    loveNote: "You did it! Passing this rigorous scenario-based certification exam proves beyond a shadow of a doubt: you are ready to step into interviews and own your title as an AI Engineer. We are so proud of you! 💖",
    unlockCriteria: 'Score 80% or higher on the Mock Certification Exam',
    category: 'exam'
  }
];

export const PERSONAL_LOVE_NOTES = [
  {
    id: 'note-1',
    title: 'Why Your QA Background Is Your Unfair Advantage',
    tag: 'Mindset Reminder',
    body: "Traditional software engineers often build a happy-path prompt, test it twice with 'Hello world', and ship it to production. You never do that. You immediately ask: What if the document is empty? What if the user injects malicious instructions? How do we measure faithfulness across 500 regression cases? In AI Engineering, Evals and Reliability are 70% of the real work—and you already speak that language fluently."
  },
  {
    id: 'note-2',
    title: 'On Days When the Jargon Feels Heavy',
    tag: 'Gentle Encouragement',
    body: "Every complex AI term—whether it's 'Reciprocal Rank Fusion', 'Cross-Encoder Reranking', or 'Constrained Decoding'—is just a fancy wrapper around concepts you already know from testing: sorting, filtering, schema validation, and contract testing. Take a deep breath, switch any lesson to the 'QA Analogy' tab, and remember how capable you are."
  },
  {
    id: 'note-3',
    title: 'Small Daily Steps Beat Weekend Marathons',
    tag: 'Consistency Note',
    body: "Even 15 focused minutes today—flipping 5 flashcards, reading one interview rubric, or tweaking a system prompt in the sandbox—compounds into career-changing mastery. You don't have to learn everything in one afternoon. Just keep showing up for your future self."
  },
  {
    id: 'note-4',
    title: 'You Belong in Every AI Engineering Room',
    tag: 'Confidence Boost',
    body: "When you walk into your next technical conversation or interview, remember: nobody knows how to make probabilistic LLMs trustworthy better than an engineer trained in quality engineering, boundary analysis, and systematic verification. Own your voice!"
  }
];
