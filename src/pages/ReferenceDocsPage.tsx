import React, { useState } from 'react';
import { Library, ExternalLink, Clock, ShieldCheck, Bookmark, Search } from 'lucide-react';
import { OFFICIAL_REFERENCE_DOCS } from '../data/referenceDocs';
import { OfficialDocResource } from '../types/academy';
import { useAcademy } from '../context/AcademyContext';

const PROVIDERS: Array<OfficialDocResource['provider'] | 'All'> = [
  'All',
  'Anthropic',
  'Google Cloud & Gemini',
  'OpenAI & Industry Evaluation Standards'
];

export const ReferenceDocsPage: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<OfficialDocResource['provider'] | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { bookmarkedItems, toggleBookmark } = useAcademy();

  const filteredDocs = OFFICIAL_REFERENCE_DOCS.filter((doc) => {
    const matchesProvider = selectedProvider === 'All' || doc.provider === selectedProvider;
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.whyReadThis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesProvider && matchesSearch;
  });

  const getDifficultyStyle = (diff: OfficialDocResource['difficulty']) => {
    if (diff === 'Essential') return 'bg-emerald-50 text-emerald-800 border-emerald-200';
    if (diff === 'Intermediate') return 'bg-amber-50 text-amber-800 border-amber-200';
    return 'bg-[#FDF6F4] text-[#9E4758] border-[#E8A598]';
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider mb-2">
          <Library className="w-3.5 h-3.5" />
          Pro AI Engineer Hub • First-Party Engineering Library
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
          Official Reference Library ({OFFICIAL_REFERENCE_DOCS.length} Curated Primary Sources)
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-3xl">
          Skip outdated blog posts and go straight to the authoritative engineering specifications from **Anthropic**, **Google Cloud & Gemini**, **OpenAI Cookbook**, **OWASP GenAI**, **Ragas**, and **DeepEval**.
        </p>

        {/* Search & Filter */}
        <div className="mt-6 space-y-3">
          <div className="relative max-w-xl">
            <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter official guides (e.g., MCP, Skilljar, Vertex AI, OWASP, Ragas, DeepEval)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8A598] text-sm text-[#1E293B] focus:outline-none focus:border-[#9E4758]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {PROVIDERS.map((prov) => (
              <button
                key={prov}
                type="button"
                onClick={() => setSelectedProvider(prov)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedProvider === prov
                    ? 'bg-[#9E4758] text-white'
                    : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#FAF7F2]'
                }`}
              >
                {prov}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Docs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredDocs.map((doc) => {
          const isBookmarked = bookmarkedItems.includes(doc.id);

          return (
            <div
              key={doc.id}
              className="rounded-2xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial flex flex-col justify-between space-y-4 hover:border-[#9E4758] transition-all"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#FAF7F2] text-[#9E4758] border border-[#E8A598]/50">
                      {doc.provider}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${getDifficultyStyle(
                        doc.difficulty
                      )}`}
                    >
                      {doc.difficulty}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-xs font-mono text-[#64748B]">
                      <Clock className="w-3.5 h-3.5" /> {doc.estimatedReadTime}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(doc.id)}
                      className={`p-1.5 rounded-lg border ${
                        isBookmarked
                          ? 'bg-[#FDF6F4] border-[#9E4758] text-[#9E4758]'
                          : 'bg-white border-slate-200 text-[#64748B]'
                      }`}
                      title="Bookmark resource"
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-bold text-[#1E293B] font-editorial">{doc.title}</h2>

                <div className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    Why Read This:
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E293B] leading-relaxed">{doc.whyReadThis}</p>
                </div>

                <div className="rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758] p-3.5">
                  <div className="text-xs font-bold uppercase text-[#9E4758] flex items-center gap-1.5 mb-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> QA-to-AI Takeaway:
                  </div>
                  <p className="text-xs sm:text-sm text-[#1E293B]">{doc.qaToAiTakeaway}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[11px] font-mono px-2.5 py-0.5 rounded-md bg-[#F5EBE6] text-[#1E293B]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-[#64748B] truncate max-w-[60%]">
                  {doc.url}
                </span>
                <a
                  href={doc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] transition-colors shrink-0 shadow-2xs"
                >
                  Open Official Source <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
