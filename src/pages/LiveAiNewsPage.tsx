import React, { useEffect, useState, useCallback } from 'react';
import {
  Radio,
  RefreshCw,
  Bell,
  ExternalLink,
  Sparkles,
  ShieldCheck,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Cpu,
  Search,
  Layers
} from 'lucide-react';
import { fetchLiveAiNews, LiveAiNewsItem } from '../services/liveAiNewsService';
import { fetchLiveGlobalModels, GlobalAiModel } from '../services/liveModelsService';
import { useAcademy } from '../context/AcademyContext';

const NEWS_CATEGORIES: Array<LiveAiNewsItem['category'] | 'All'> = [
  'All',
  'Anthropic & Claude',
  'Google & Gemini',
  'RAG, Agents & MCP',
  'AI Evals & QA',
  'LLM Breakthroughs'
];

const COUNTRY_FILTERS = [
  { label: 'All Countries 🌍', value: 'All' },
  { label: '🇺🇸 United States', value: 'United States' },
  { label: '🇨🇳 China', value: 'China' },
  { label: '🇫🇷 France', value: 'France' },
  { label: '🇨🇦 Canada', value: 'Canada' },
  { label: '🇮🇳 India', value: 'India' }
];

export const LiveAiNewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'news'>('models');

  // Models state
  const [models, setModels] = useState<GlobalAiModel[]>([]);
  const [newlyLaunchedModels, setNewlyLaunchedModels] = useState<GlobalAiModel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [licenseFilter, setLicenseFilter] = useState<'All' | 'Proprietary API' | 'Open-Weights'>('All');
  const [modelSearch, setModelSearch] = useState<string>('');

  // News state
  const [newsItems, setNewsItems] = useState<LiveAiNewsItem[]>([]);
  const [newNewsItems, setNewNewsItems] = useState<LiveAiNewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LiveAiNewsItem['category'] | 'All'>('All');

  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState<boolean>(true);

  const { triggerCelebration } = useAcademy();

  const sendLivePushNotification = useCallback(
    async (title: string, body: string) => {
      if ('Notification' in window) {
        try {
          if (Notification.permission === 'default') {
            await Notification.requestPermission();
          }
          if (Notification.permission === 'granted') {
            if ('serviceWorker' in navigator) {
              const reg = await navigator.serviceWorker.getRegistration();
              if (reg && 'showNotification' in reg) {
                await reg.showNotification(title, {
                  body,
                  icon: '/icon.svg',
                  badge: '/icon.svg'
                });
                triggerCelebration(`🔔 ${title}: ${body}`);
                return;
              }
            }
            new Notification(title, { body, icon: '/icon.svg' });
            triggerCelebration(`🔔 ${title}: ${body}`);
            return;
          }
        } catch {
          // Fallback to in-app notification toast
        }
      }
      triggerCelebration(`🔔 ${title}: ${body}`);
    },
    [triggerCelebration]
  );

  const loadAllLiveRadar = useCallback(
    async (notifyOnNew = false) => {
      setLoading(true);
      const [modelsResult, newsResult] = await Promise.all([
        fetchLiveGlobalModels(),
        fetchLiveAiNews()
      ]);

      setModels(modelsResult.models);
      setNewlyLaunchedModels(modelsResult.newlyLaunched);

      setNewsItems(newsResult.items);
      setNewNewsItems(newsResult.newSinceLastVisit);

      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      setLoading(false);

      if (notifyOnNew) {
        if (modelsResult.newlyLaunched.length > 0) {
          const topModel = modelsResult.newlyLaunched[0];
          await sendLivePushNotification(
            `🚀 New AI Model Version Live: ${topModel.name}`,
            `${topModel.countryFlag} ${topModel.country} (${topModel.provider}) — View Pros, Cons & QA Verdict!`
          );
        } else if (newsResult.items.length > 0) {
          const topStory = newsResult.newSinceLastVisit[0] || newsResult.items[0];
          await sendLivePushNotification(
            '🔥 Breaking AI Engineering Update!',
            `${topStory.title} — Open AI Engineer Academy for QA takeaway.`
          );
        }
      }
    },
    [sendLivePushNotification]
  );

  // Initial load + automatic background polling every 5 minutes
  useEffect(() => {
    loadAllLiveRadar(false);
    const interval = setInterval(() => {
      loadAllLiveRadar(autoNotifyEnabled);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadAllLiveRadar, autoNotifyEnabled]);

  const filteredModels = models.filter((m) => {
    if (selectedCountry !== 'All' && m.country !== selectedCountry) return false;
    if (licenseFilter !== 'All' && m.licenseType !== licenseFilter) return false;
    if (modelSearch.trim()) {
      const q = modelSearch.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.provider.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.versionLabel.toLowerCase().includes(q) ||
        m.categoryBadge.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const filteredNews = newsItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const formatRelativeTime = (ts: number) => {
    const diffHours = Math.max(1, Math.round((Date.now() - ts) / (1000 * 3600)));
    if (diffHours < 24) return `${diffHours}h ago`;
    const days = Math.round(diffHours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.max(1, Math.round(days / 30));
    return `${months}mo ago`;
  };

  return (
    <div className="space-y-8">
      {/* Live Header Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <Radio className="w-3.5 h-3.5" />
            Live Auto-Updating Global AI Models & News Radar
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] bg-white px-3 py-1.5 rounded-full border border-[#E8A598]/50">
            <Clock className="w-3.5 h-3.5 text-[#9E4758]" />
            <span>Auto-Syncs Live Registry Every 5m • Last Synced: {lastUpdated || 'Syncing...'}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
          Global AI Models Directory (Country of Origin, Pros & Cons) + Live Releases 🌍
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-4xl leading-relaxed">
          Automatically tracks every newly launched LLM and version via the live **OpenRouter Global Model Registry API** & **Hacker News AI Feed**—showing you each model's **Country of Origin**, **Context Window**, **Pricing**, **Engineering Pros & Cons**, and **QA-to-AI Verdict**.
        </p>

        {/* Primary View Switcher Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-[#E8A598]/40">
          <div className="inline-flex rounded-2xl bg-white p-1.5 border border-[#E8A598]/60 shadow-2xs">
            <button
              type="button"
              onClick={() => setActiveTab('models')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'models'
                  ? 'bg-[#9E4758] text-white shadow-xs'
                  : 'text-[#1E293B] hover:bg-[#FAF7F2]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>🌍 Live Global Models (Country, Pros & Cons)</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20">
                {models.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('news')}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'news'
                  ? 'bg-[#9E4758] text-white shadow-xs'
                  : 'text-[#1E293B] hover:bg-[#FAF7F2]'
              }`}
            >
              <Radio className="w-4 h-4" />
              <span>📡 Breaking AI Engineering News</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/20">
                {newsItems.length}
              </span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadAllLiveRadar(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] transition-all shadow-sm disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Checking Live Launches...' : 'Sync New Model Launches & Notify 🔔'}
            </button>

            <button
              type="button"
              onClick={() => setAutoNotifyEnabled((p) => !p)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                autoNotifyEnabled
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-[#64748B] border-slate-200'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              {autoNotifyEnabled ? 'Live Launch Alerts: ON' : 'Live Launch Alerts: OFF'}
            </button>
          </div>
        </div>
      </section>

      {/* TAB 1: LIVE GLOBAL AI MODELS DIRECTORY (COUNTRY OF ORIGIN + PROS & CONS) */}
      {activeTab === 'models' && (
        <section className="space-y-6">
          {/* Country, License & Search Filter Bar */}
          <div className="rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/50 p-4 sm:p-5 space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
              {/* Country Pills */}
              <div className="flex flex-wrap items-center gap-2">
                {COUNTRY_FILTERS.map((cf) => (
                  <button
                    key={cf.value}
                    type="button"
                    onClick={() => setSelectedCountry(cf.value)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedCountry === cf.value
                        ? 'bg-[#9E4758] text-white shadow-2xs'
                        : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#F5EBE6]'
                    }`}
                  >
                    {cf.label}
                  </button>
                ))}
              </div>

              {/* License & Search */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex rounded-xl bg-white p-1 border border-[#E8A598]/50 text-xs font-semibold">
                  {(['All', 'Proprietary API', 'Open-Weights'] as const).map((lic) => (
                    <button
                      key={lic}
                      type="button"
                      onClick={() => setLicenseFilter(lic)}
                      className={`px-2.5 py-1 rounded-lg transition-all ${
                        licenseFilter === lic
                          ? 'bg-[#9E4758] text-white'
                          : 'text-[#64748B] hover:text-[#1E293B]'
                      }`}
                    >
                      {lic}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 sm:w-64">
                  <Search className="w-3.5 h-3.5 text-[#9E4758] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={modelSearch}
                    onChange={(e) => setModelSearch(e.target.value)}
                    placeholder="Search Claude, Gemini, DeepSeek, China..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-white border border-[#E8A598] text-xs font-medium text-[#1E293B] focus:outline-none focus:border-[#9E4758]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Models Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModels.map((model, idx) => {
              const isNewlyLaunched =
                newlyLaunchedModels.some((n) => n.id === model.id) || idx < 3;

              return (
                <article
                  key={model.id}
                  className="rounded-3xl border border-[#E8A598]/60 bg-white p-6 shadow-editorial flex flex-col justify-between space-y-5 hover:border-[#9E4758] transition-all"
                >
                  <div className="space-y-4">
                    {/* Top Row: Country Flag Badge + License + Live Status */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF7F2] border border-[#E8A598] text-xs font-bold text-[#1E293B]">
                        <span className="text-base leading-none">{model.countryFlag}</span>
                        <span>{model.country}</span>
                        <span className="text-[#64748B] font-normal">• {model.provider}</span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                            model.licenseType === 'Open-Weights'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#F5EBE6] text-[#9E4758] border border-[#E8A598]'
                          }`}
                        >
                          {model.licenseType}
                        </span>
                        {isNewlyLaunched && (
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[#9E4758] text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> LIVE VERSION
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Model Name & Version Pill */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-bold text-[#1E293B] font-editorial">
                          {model.name}
                        </h2>
                        <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700">
                          {model.versionLabel}
                        </span>
                      </div>
                      <div className="text-xs text-[#64748B] mt-1 flex flex-wrap items-center gap-2">
                        <span>HQ: {model.headquarters}</span>
                        <span>•</span>
                        <span className="font-semibold text-[#9E4758]">{model.categoryBadge}</span>
                        <span>•</span>
                        <span>Updated {formatRelativeTime(model.releaseTimestampMs)}</span>
                      </div>
                    </div>

                    {/* Technical Specs Strip */}
                    <div className="grid grid-cols-3 gap-2.5 p-3 rounded-2xl bg-[#FAF7F2] border border-[#E8A598]/40 text-xs">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#64748B]">
                          Context Window
                        </div>
                        <div className="font-mono font-bold text-[#1E293B] mt-0.5">
                          {model.contextWindowTokens.toLocaleString()} tok
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#64748B]">
                          Input / 1M Tok
                        </div>
                        <div className="font-mono font-bold text-[#9E4758] mt-0.5">
                          {model.promptPricePerMillion}
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#64748B]">
                          Output / 1M Tok
                        </div>
                        <div className="font-mono font-bold text-[#1E293B] mt-0.5">
                          {model.completionPricePerMillion}
                        </div>
                      </div>
                    </div>

                    {/* Modalities Pills */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] font-bold text-[#64748B] mr-1 flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#9E4758]" /> Modalities:
                      </span>
                      {model.modalities.map((mod) => (
                        <span
                          key={mod}
                          className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-[#F5EBE6] text-[#9E4758] font-semibold"
                        >
                          {mod}
                        </span>
                      ))}
                    </div>

                    {/* PROS & CONS Side-by-Side / Stacked Boxes */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* PROS */}
                      <div className="rounded-2xl bg-emerald-50/70 border border-emerald-200 p-3.5 space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span>Strengths & Pros</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-emerald-950 leading-relaxed">
                          {model.pros.map((pro, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="font-bold text-emerald-700 mt-0.5">+</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* CONS */}
                      <div className="rounded-2xl bg-amber-50/70 border border-amber-200 p-3.5 space-y-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                          <span>Trade-Offs & Cons</span>
                        </div>
                        <ul className="space-y-1.5 text-xs text-amber-950 leading-relaxed">
                          {model.cons.map((con, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="font-bold text-amber-700 mt-0.5">−</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* QA-to-AI Engineer Verdict */}
                    <div className="rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758] p-3.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E4758] flex items-center gap-1.5 mb-1">
                        <Cpu className="w-3.5 h-3.5" /> When Sushama Should Choose This Model:
                      </div>
                      <p className="text-xs text-[#1E293B] leading-relaxed">
                        {model.qaEngineerVerdict}
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        sendLivePushNotification(
                          `🚀 Model Alert: ${model.name} (${model.countryFlag} ${model.country})`,
                          model.qaEngineerVerdict
                        )
                      }
                      className="font-semibold text-[#64748B] hover:text-[#9E4758] inline-flex items-center gap-1"
                    >
                      <Bell className="w-3.5 h-3.5" /> Test Launch Alert
                    </button>

                    <a
                      href={model.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-bold text-[#9E4758] hover:underline"
                    >
                      Official Model Docs <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* TAB 2: BREAKING AI ENGINEERING NEWS FEED */}
      {activeTab === 'news' && (
        <section className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {NEWS_CATEGORIES.map((cat) => (
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredNews.map((item, idx) => {
              const isNew = newNewsItems.some((n) => n.id === item.id) || idx < 2;

              return (
                <article
                  key={item.id}
                  className="rounded-2xl border border-[#E8A598]/60 bg-white p-5 shadow-editorial flex flex-col justify-between space-y-4 hover:border-[#9E4758] transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#9E4758] border border-[#E8A598]/50">
                          {item.category}
                        </span>
                        {isNew && (
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            NEW LIVE
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 text-xs font-mono text-[#64748B]">
                        {item.pointsOrStars && (
                          <span className="inline-flex items-center gap-1 text-[#9E4758] font-semibold">
                            <TrendingUp className="w-3.5 h-3.5" /> {item.pointsOrStars} pts
                          </span>
                        )}
                        <span>•</span>
                        <span>{formatRelativeTime(item.timestampMs)}</span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-[#1E293B] font-editorial leading-snug">
                      {item.title}
                    </h2>

                    <div className="rounded-xl bg-[#FAF7F2] border-l-4 border-[#9E4758] p-3.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-[#9E4758] flex items-center gap-1.5 mb-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Why This Matters for Your QA-to-AI Role:
                      </div>
                      <p className="text-xs text-[#1E293B] leading-relaxed">
                        {item.qaEngineerTakeaway}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-mono text-[#64748B]">Source: {item.source}</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          sendLivePushNotification('🔥 Breaking AI News Alert!', item.title)
                        }
                        className="text-xs font-semibold text-[#64748B] hover:text-[#9E4758] inline-flex items-center gap-1"
                      >
                        <Bell className="w-3.5 h-3.5" /> Notify
                      </button>
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-bold text-[#9E4758] hover:underline"
                      >
                        Read Full Story <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};
