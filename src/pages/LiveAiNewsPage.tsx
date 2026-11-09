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
  CheckCircle2
} from 'lucide-react';
import { fetchLiveAiNews, LiveAiNewsItem } from '../services/liveAiNewsService';
import { useAcademy } from '../context/AcademyContext';

const CATEGORIES: Array<LiveAiNewsItem['category'] | 'All'> = [
  'All',
  'Anthropic & Claude',
  'Google & Gemini',
  'RAG, Agents & MCP',
  'AI Evals & QA',
  'LLM Breakthroughs'
];

export const LiveAiNewsPage: React.FC = () => {
  const [newsItems, setNewsItems] = useState<LiveAiNewsItem[]>([]);
  const [newItems, setNewItems] = useState<LiveAiNewsItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<LiveAiNewsItem['category'] | 'All'>('All');
  const [loading, setLoading] = useState<boolean>(true);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [autoNotifyEnabled, setAutoNotifyEnabled] = useState<boolean>(true);

  const { triggerCelebration } = useAcademy();

  const sendBreakingNewsNotification = useCallback(
    async (headline: string) => {
      const title = '🔥 Breaking AI Engineering Update!';
      const body = `${headline} — Open AI Engineer Academy to see the QA-to-AI takeaway.`;

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
                triggerCelebration(`🔔 Live AI News Notification Sent: "${headline}"`);
                return;
              }
            }
            new Notification(title, { body, icon: '/icon.svg' });
            triggerCelebration(`🔔 Live AI News Notification Sent: "${headline}"`);
            return;
          }
        } catch {
          // Fallback to in-app notification toast
        }
      }
      triggerCelebration(`🔔 Breaking AI News Alert: "${headline}"`);
    },
    [triggerCelebration]
  );

  const loadLiveFeed = useCallback(
    async (notifyOnNew = false) => {
      setLoading(true);
      const result = await fetchLiveAiNews();
      setNewsItems(result.items);
      setNewItems(result.newSinceLastVisit);
      setLastUpdated(
        new Date(result.lastUpdatedIso).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
      setLoading(false);

      if (notifyOnNew && result.items.length > 0) {
        const topStory = result.newSinceLastVisit[0] || result.items[0];
        await sendBreakingNewsNotification(topStory.title);
      }
    },
    [sendBreakingNewsNotification]
  );

  // Initial load + automatic background polling every 5 minutes
  useEffect(() => {
    loadLiveFeed(false);
    const interval = setInterval(() => {
      loadLiveFeed(autoNotifyEnabled);
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadLiveFeed, autoNotifyEnabled]);

  const filteredItems = newsItems.filter(
    (item) => selectedCategory === 'All' || item.category === selectedCategory
  );

  const formatRelativeTime = (ts: number) => {
    const diffHours = Math.max(1, Math.round((Date.now() - ts) / (1000 * 3600)));
    if (diffHours < 24) return `${diffHours}h ago`;
    const days = Math.round(diffHours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="space-y-8">
      {/* Live Header Banner */}
      <section className="rounded-3xl bg-gradient-to-br from-[#FAF7F2] via-[#F5EBE6] to-[#FFFFFF] border border-[#E8A598]/60 p-6 md:p-8 shadow-editorial">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#9E4758] text-white text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            <Radio className="w-3.5 h-3.5" />
            Live Auto-Updating AI News & Breakthroughs Radar
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#64748B] bg-white px-3 py-1.5 rounded-full border border-[#E8A598]/50">
            <Clock className="w-3.5 h-3.5 text-[#9E4758]" />
            <span>Auto-Polls Every 5m • Last Synced: {lastUpdated || 'Syncing...'}</span>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-[#1E293B] font-editorial">
          Real-Time AI Engineering Feed + Instant Browser Notifications 🔔
        </h1>
        <p className="text-sm text-[#64748B] mt-1 max-w-3xl leading-relaxed">
          Automatically fetches the latest high-signal discussions and releases across **Anthropic Claude**, **Google Gemini & Vertex AI**, **MCP & Agents**, **RAG**, and **AI Evals**—and translates every story into what it means for you as a QA-to-AI Engineer.
        </p>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-4 border-t border-[#E8A598]/40">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={() => loadLiveFeed(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#9E4758] text-white text-xs font-semibold hover:bg-[#7D3543] transition-all shadow-sm disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Fetching Live AI News...' : 'Sync Live AI News & Send Notification 🔔'}
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
              {autoNotifyEnabled ? 'Auto-Notify on New Releases: ON' : 'Auto-Notify: OFF'}
            </button>
          </div>

          {newItems.length > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FDF6F4] border border-[#9E4758] text-xs font-bold text-[#9E4758]">
              <Sparkles className="w-3.5 h-3.5" /> {newItems.length} New Stories Since Last Check
            </span>
          )}
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-5">
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
      </section>

      {/* Live News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item, idx) => {
          const isNew = newItems.some((n) => n.id === item.id) || idx < 2;

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
                    onClick={() => sendBreakingNewsNotification(item.title)}
                    className="text-xs font-semibold text-[#64748B] hover:text-[#9E4758] inline-flex items-center gap-1"
                    title="Send notification for this article"
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
    </div>
  );
};
