import React, { useState } from 'react';
import { BookA, Search, Lightbulb, ShieldCheck, Code2, Bookmark } from 'lucide-react';
import { JARGON_TERMS } from '../data/jargonTerms';
import { JargonTermItem } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';

type JargonViewMode = 'plain' | 'qa' | 'code';

const CATEGORIES: Array<JargonTermItem['category'] | 'All'> = [
  'All',
  'Core LLM',
  'RAG & Search',
  'Agents & Protocols',
  'Evals & Security',
  'Optimization'
];

export const JargonDictionaryPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<JargonTermItem['category'] | 'All'>('All');
  const [globalView, setGlobalView] = useState<JargonViewMode>('qa');
  const [cardViews, setCardViews] = useState<Record<string, JargonViewMode>>({});

  const { bookmarkedItems, toggleBookmark } = useAcademy();

  const filteredTerms = JARGON_TERMS.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.plainEnglish.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.qaAnalogy.analogyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.qaAnalogy.comparison.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSetAllViews = (view: JargonViewMode) => {
    setGlobalView(view);
    setCardViews({});
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider mb-2">
              <BookA className="w-3.5 h-3.5" />
              Pro AI Engineer Hub • Jargon Translator
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
              Interactive AI Jargon Cheat Sheet ({JARGON_TERMS.length} Essential Terms)
            </h1>
            <p className="text-sm text-[#64748B] mt-1 max-w-2xl">
              Never feel intimidated by AI buzzwords again. Every term translates directly into **Plain English**, a **QA/Software Testing Analogy**, and a **Production Code Example**.
            </p>
          </div>

          {/* Global View Mode Switcher */}
          <div className="bg-white p-1.5 rounded-2xl border border-[#E8A598] inline-flex gap-1 self-start">
            <button
              type="button"
              onClick={() => handleSetAllViews('plain')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalView === 'plain' && Object.keys(cardViews).length === 0
                  ? 'bg-[#9E4758] text-white'
                  : 'text-[#1E293B] hover:bg-[#FAF7F2]'
              }`}
            >
              Plain English
            </button>
            <button
              type="button"
              onClick={() => handleSetAllViews('qa')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalView === 'qa' && Object.keys(cardViews).length === 0
                  ? 'bg-[#9E4758] text-white'
                  : 'text-[#1E293B] hover:bg-[#FAF7F2]'
              }`}
            >
              QA/Testing Analogy
            </button>
            <button
              type="button"
              onClick={() => handleSetAllViews('code')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                globalView === 'code' && Object.keys(cardViews).length === 0
                  ? 'bg-[#9E4758] text-white'
                  : 'text-[#1E293B] hover:bg-[#FAF7F2]'
              }`}
            >
              Production Code
            </button>
          </div>
        </div>

        {/* Search & Filter Row */}
        <div className="mt-6 space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any AI jargon or QA analogy (e.g., Reranker, MCP, Hallucination, KV Cache, BPE)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8A598] text-sm text-[#1E293B] focus:outline-none focus:border-[#9E4758]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#9E4758] text-white'
                    : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#FAF7F2]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTerms.map((item) => {
          const activeView = cardViews[item.id] || globalView;
          const isBookmarked = bookmarkedItems.includes(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#9E4758] border border-[#E8A598]/50">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-mono text-[#64748B]">
                        {item.pronunciationOrTag}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-[#1E293B] font-editorial mt-1.5">
                      {item.term}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleBookmark(item.id)}
                    className={`p-2 rounded-xl border text-xs ${
                      isBookmarked
                        ? 'bg-[#FDF6F4] border-[#9E4758] text-[#9E4758]'
                        : 'bg-white border-slate-200 text-[#64748B]'
                    }`}
                    title="Bookmark term"
                  >
                    <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Per-Card 3-Tab Switcher */}
                <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#FAF7F2] border border-[#E8A598]/40 my-3">
                  <button
                    type="button"
                    onClick={() => setCardViews((p) => ({ ...p, [item.id]: 'plain' }))}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      activeView === 'plain'
                        ? 'bg-white text-[#9E4758] shadow-2xs border border-[#E8A598]/50'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <Lightbulb className="w-3.5 h-3.5" /> Plain English
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardViews((p) => ({ ...p, [item.id]: 'qa' }))}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      activeView === 'qa'
                        ? 'bg-[#9E4758] text-white shadow-2xs'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" /> QA Analogy
                  </button>
                  <button
                    type="button"
                    onClick={() => setCardViews((p) => ({ ...p, [item.id]: 'code' }))}
                    className={`py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all ${
                      activeView === 'code'
                        ? 'bg-white text-[#9E4758] shadow-2xs border border-[#E8A598]/50'
                        : 'text-[#64748B] hover:text-[#1E293B]'
                    }`}
                  >
                    <Code2 className="w-3.5 h-3.5" /> Prod Code
                  </button>
                </div>

                {/* View Content */}
                {activeView === 'plain' && (
                  <div className="rounded-xl bg-[#FAF7F2] p-4 border border-[#E8A598]/40 space-y-2">
                    <div className="text-xs font-bold uppercase text-[#9E4758]">
                      Plain-English Definition:
                    </div>
                    <p className="text-sm text-[#1E293B] leading-relaxed">{item.plainEnglish}</p>
                  </div>
                )}

                {activeView === 'qa' && (
                  <div className="rounded-xl bg-[#FDF6F4] p-4 border border-[#E8A598] space-y-2.5">
                    <div className="text-xs font-bold uppercase text-[#9E4758]">
                      QA Analogy: {item.qaAnalogy.analogyTitle}
                    </div>
                    <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">
                      {item.qaAnalogy.comparison}
                    </p>
                    <div className="pt-2 border-t border-[#E8A598]/40 text-xs font-semibold text-[#9E4758]">
                      💡 QA Rule of Thumb: {item.qaAnalogy.qaRuleOfThumb}
                    </div>
                  </div>
                )}

                {activeView === 'code' && (
                  <div className="space-y-2">
                    <pre className="p-3.5 rounded-xl bg-slate-900 text-emerald-200 text-xs font-mono overflow-x-auto leading-relaxed">
                      {item.productionCode.snippet}
                    </pre>
                    <p className="text-xs text-[#64748B] font-medium">
                      ⚡ <strong>Production Note:</strong> {item.productionCode.note}
                    </p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
