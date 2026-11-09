import React, { useEffect, useState, useCallback, useMemo } from 'react';
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
  Layers,
  Filter,
  X,
  Unlock,
  Lock
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
  { label: '🇯🇵 Japan', value: 'Japan' },
  { label: '🇰🇷 South Korea', value: 'South Korea' },
  { label: '🇮🇳 India', value: 'India' }
];

const PROVIDER_FILTERS = [
  { label: 'All Labs & Providers', value: 'All' },
  { label: 'OpenAI (GPT-6.1 / gpt-oss)', value: 'openai' },
  { label: 'Anthropic (Claude 5.5 / Fable)', value: 'anthropic' },
  { label: 'Google (Gemini 4 / Gemma 4)', value: 'google' },
  { label: 'NVIDIA (Nemotron 3.5 / Ultra)', value: 'nvidia' },
  { label: 'xAI (Grok 4.7 / 4.6)', value: 'x-ai' },
  { label: 'Meta (Muse Spark / Llama 4)', value: 'meta' },
  { label: 'DeepSeek (V4.1 / V4 Pro / R1)', value: 'deepseek' },
  { label: 'Alibaba (Qwen 3.8 / Coder)', value: 'qwen' },
  { label: 'Mistral (Large 4 / Devstral)', value: 'mistralai' },
  { label: 'Moonshot (Kimi K3.1 Pro)', value: 'moonshotai' },
  { label: 'Z.ai / Zhipu (GLM 5.3)', value: 'zai' },
  { label: 'Tencent / MiniMax / Xiaomi', value: 'china-emerging' },
  { label: 'LiquidAI / IBM Granite / MSFT', value: 'us-slm' },
  { label: 'Cohere / Sakana / Upstage / Sarvam', value: 'sovereign' }
];

const CATEGORY_FILTERS: Array<GlobalAiModel['categoryBadge'] | 'All'> = [
  'All',
  'Frontier Reasoning',
  'Coding & Agents',
  'Multimodal Flagship',
  'Open-Weights Leader',
  'Fast & Edge SLM',
  'Sovereign / Regional AI'
];

export const LiveAiNewsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'models' | 'news'>('models');

  // Models filter & sort state
  const [models, setModels] = useState<GlobalAiModel[]>([]);
  const [newlyLaunchedModels, setNewlyLaunchedModels] = useState<GlobalAiModel[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [selectedProvider, setSelectedProvider] = useState<string>('All');
  const [selectedCategoryBadge, setSelectedCategoryBadge] = useState<GlobalAiModel['categoryBadge'] | 'All'>('All');
  const [licenseFilter, setLicenseFilter] = useState<'All' | 'Open-Weights / Open-Source' | 'Proprietary API'>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'context' | 'opensource'>('featured');
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

  const filteredModels = useMemo(() => {
    const list = models.filter((m) => {
      if (selectedCountry !== 'All' && m.country !== selectedCountry) return false;
      if (licenseFilter !== 'All' && m.licenseType !== licenseFilter) return false;
      if (selectedCategoryBadge !== 'All' && m.categoryBadge !== selectedCategoryBadge) return false;

      if (selectedProvider !== 'All') {
        if (selectedProvider === 'china-emerging') {
          if (!['tencent', 'minimax', 'xiaomi', 'bytedance'].includes(m.providerKey)) return false;
        } else if (selectedProvider === 'us-slm') {
          if (!['liquid', 'ibm', 'microsoft'].includes(m.providerKey)) return false;
        } else if (selectedProvider === 'sovereign') {
          if (!['cohere', 'sakana', 'upstage', 'sarvam'].includes(m.providerKey)) return false;
        } else if (m.providerKey !== selectedProvider) {
          return false;
        }
      }

      if (modelSearch.trim()) {
        const q = modelSearch.toLowerCase().trim();
        const hay = [
          m.id,
          m.name,
          m.versionLabel,
          m.provider,
          m.country,
          m.headquarters,
          m.licenseType,
          m.licenseDetail,
          m.categoryBadge,
          ...m.modalities,
          ...m.pros,
          ...m.cons
        ]
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === 'newest') {
      return [...list].sort((a, b) => b.releaseTimestampMs - a.releaseTimestampMs);
    }
    if (sortBy === 'context') {
      return [...list].sort((a, b) => b.contextWindowTokens - a.contextWindowTokens);
    }
    if (sortBy === 'opensource') {
      return [...list].sort((a, b) => {
        if (a.licenseType === b.licenseType) return b.releaseTimestampMs - a.releaseTimestampMs;
        return a.licenseType === 'Open-Weights / Open-Source' ? -1 : 1;
      });
    }
    return list;
  }, [models, selectedCountry, licenseFilter, selectedCategoryBadge, selectedProvider, modelSearch, sortBy]);

  const openWeightsCount = useMemo(
    () => models.filter((m) => m.licenseType === 'Open-Weights / Open-Source').length,
    [models]
  );

  const hasActiveFilters =
    selectedCountry !== 'All' ||
    selectedProvider !== 'All' ||
    selectedCategoryBadge !== 'All' ||
    licenseFilter !== 'All' ||
    modelSearch.trim() !== '';

  const resetAllFilters = () => {
    setSelectedCountry('All');
    setSelectedProvider('All');
    setSelectedCategoryBadge('All');
    setLicenseFilter('All');
    setModelSearch('');
    setSortBy('featured');
  };

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
          Global AI Models Directory (Frontier + Open-Source, Country Origin, Pros & Cons) 🌍
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-4xl leading-relaxed">
          Live-synced with the **OpenRouter & Vercel AI Gateway 2026 Model Registries**—featuring **OpenAI (`GPT-6.1 Terra/Sol`, `GPT-6 Astra`, `gpt-oss-120b`)**, **Anthropic (`Claude 5.5 Fleet`, `Fable 5.1`)**, **Google (`Gemini 4 Argon`, `Omni 1.2 Flash`, `Gemma 4`)**, **NVIDIA (`Nemotron 3.5 Super VL`, `Nemotron-3 Ultra 550B`)**, **xAI (`Grok 4.7`)**, **Meta (`Muse Spark Open`, `Llama 4`)**, **DeepSeek (`V4.1 Flash`, `V4 Pro`, `R1`)**, **Alibaba (`Qwen 3.8`, `Qwen3 Coder`)**, **Mistral (`Large 4`, `Devstral`)**, **Moonshot (`Kimi K3.1 Pro`)**, **Z.ai (`GLM 5.3`)**, **LiquidAI (`LFM3`)**, and **IBM (`Granite 4.2`)**.
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
              <span>🌍 Live Global Models ({models.length} Total • {openWeightsCount} Open-Source)</span>
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
              <span>📡 Breaking AI Engineering News ({newsItems.length})</span>
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
              {loading ? 'Syncing Live Registry...' : 'Sync New Model Launches & Notify 🔔'}
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
          {/* Comprehensive Search & Multi-Filter Console */}
          <div className="rounded-3xl bg-[#FAF7F2] border border-[#E8A598]/60 p-5 sm:p-6 shadow-editorial space-y-5">
            {/* Row 1: Search Bar + License Toggle + Sort Selector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
              {/* Instant Search Input */}
              <div className="lg:col-span-5 relative">
                <Search className="w-4 h-4 text-[#9E4758] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={modelSearch}
                  onChange={(e) => setModelSearch(e.target.value)}
                  placeholder="Search model, version, lab (e.g. Nemotron, Grok 4.7, GPT-6.1, Claude 5.5, Gemma 4, DeepSeek V4.1)..."
                  className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-white border border-[#E8A598] text-xs sm:text-sm font-medium text-[#1E293B] focus:outline-none focus:border-[#9E4758] shadow-2xs"
                />
                {modelSearch && (
                  <button
                    type="button"
                    onClick={() => setModelSearch('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64748B] hover:text-[#9E4758]"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Open-Source vs Proprietary Filter Buttons */}
              <div className="lg:col-span-4 flex items-center gap-1.5 bg-white p-1 rounded-xl border border-[#E8A598]/60">
                <button
                  type="button"
                  onClick={() => setLicenseFilter('All')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold transition-all ${
                    licenseFilter === 'All'
                      ? 'bg-[#9E4758] text-white'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  All ({models.length})
                </button>
                <button
                  type="button"
                  onClick={() => setLicenseFilter('Open-Weights / Open-Source')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1 transition-all ${
                    licenseFilter === 'Open-Weights / Open-Source'
                      ? 'bg-emerald-700 text-white'
                      : 'text-emerald-800 hover:bg-emerald-50'
                  }`}
                >
                  <Unlock className="w-3.5 h-3.5" />
                  <span>Open-Source ({openWeightsCount})</span>
                </button>
                <button
                  type="button"
                  onClick={() => setLicenseFilter('Proprietary API')}
                  className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1 transition-all ${
                    licenseFilter === 'Proprietary API'
                      ? 'bg-[#9E4758] text-white'
                      : 'text-[#64748B] hover:text-[#1E293B]'
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Proprietary</span>
                </button>
              </div>

              {/* Sort By Dropdown */}
              <div className="lg:col-span-3 flex items-center gap-2">
                <label htmlFor="model-sort-select" className="text-xs font-bold text-[#64748B] shrink-0">
                  Sort:
                </label>
                <select
                  id="model-sort-select"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'featured' | 'newest' | 'context' | 'opensource')
                  }
                  className="w-full py-2.5 px-3 rounded-xl bg-white border border-[#E8A598] text-xs font-bold text-[#1E293B] focus:outline-none focus:border-[#9E4758]"
                >
                  <option value="featured">⭐ Featured Flagships + Live</option>
                  <option value="newest">🕒 Newest Launch Date First</option>
                  <option value="opensource">🔓 Open-Source / Open-Weights First</option>
                  <option value="context">📏 Largest Context Window First</option>
                </select>
              </div>
            </div>

            {/* Row 2: Filter by Provider / Lab (NVIDIA, Grok, OpenAI, Anthropic, Google, DeepSeek, Qwen, Meta, Mistral, etc.) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-[#9E4758]" /> Filter by AI Lab / Provider:
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PROVIDER_FILTERS.map((pf) => (
                  <button
                    key={pf.value}
                    type="button"
                    onClick={() => setSelectedProvider(pf.value)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedProvider === pf.value
                        ? 'bg-[#9E4758] text-white shadow-2xs'
                        : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#F5EBE6]'
                    }`}
                  >
                    {pf.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Row 3: Filter by Country of Origin + Specialization Category */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-3 border-t border-[#E8A598]/40">
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Filter by Country of Origin:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {COUNTRY_FILTERS.map((cf) => (
                    <button
                      key={cf.value}
                      type="button"
                      onClick={() => setSelectedCountry(cf.value)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedCountry === cf.value
                          ? 'bg-[#9E4758] text-white shadow-2xs'
                          : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#F5EBE6]'
                      }`}
                    >
                      {cf.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Filter by Engineering Specialization:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {CATEGORY_FILTERS.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategoryBadge(cat)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedCategoryBadge === cat
                          ? 'bg-[#9E4758] text-white shadow-2xs'
                          : 'bg-white text-[#1E293B] border border-[#E8A598]/50 hover:bg-[#F5EBE6]'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filter Result Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#E8A598]/30 text-xs">
              <div className="font-semibold text-[#1E293B]">
                Showing <span className="font-bold text-[#9E4758]">{filteredModels.length}</span> of{' '}
                <span className="font-bold">{models.length}</span> live & flagship models
              </div>
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-white border border-[#9E4758] text-xs font-bold text-[#9E4758] hover:bg-[#F5EBE6]"
                >
                  <X className="w-3.5 h-3.5" /> Reset All Filters
                </button>
              )}
            </div>
          </div>

          {/* Empty state if search has no matches */}
          {filteredModels.length === 0 && (
            <div className="rounded-3xl border border-[#E8A598]/60 bg-white p-10 text-center space-y-3">
              <div className="text-lg font-bold text-[#1E293B] font-editorial">
                No models matched your current filter combination
              </div>
              <p className="text-xs text-[#64748B]">
                Try clearing one of the country, license, or provider filters above to view all {models.length} models.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="px-4 py-2 rounded-xl bg-[#9E4758] text-white text-xs font-bold"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Models Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredModels.map((model, idx) => {
              const isNewlyLaunched =
                newlyLaunchedModels.some((n) => n.id === model.id) || idx < 6;

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
                        <span className="text-[#9E4758] font-bold">• {model.provider}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full ${
                            model.licenseType === 'Open-Weights / Open-Source'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-[#F5EBE6] text-[#9E4758] border border-[#E8A598]'
                          }`}
                        >
                          {model.licenseType === 'Open-Weights / Open-Source'
                            ? '🔓 Open-Weights / Open-Source'
                            : '🔒 Proprietary API'}
                        </span>
                        {isNewlyLaunched && (
                          <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-full bg-[#9E4758] text-white flex items-center gap-1">
                            <Sparkles className="w-3 h-3" /> {model.releaseDateLabel}
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
                        <span className="font-mono text-[11px]">{model.licenseDetail}</span>
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
