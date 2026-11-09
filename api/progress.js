import { put, list } from '@vercel/blob';

const ALLOWED_USERS = new Set([
  'sushama',
  'sushama.patki',
  'sushamapatki',
  'sushama@ai-academy.com'
]);

function normalizeUsername(raw) {
  const clean = String(raw || 'sushama').trim().toLowerCase();
  return ALLOWED_USERS.has(clean) ? 'sushama' : 'sushama';
}

function mergeAcademyStates(existing, incoming) {
  if (!existing) return incoming;
  if (!incoming) return existing;

  const completedLessons = Array.from(
    new Set([...(existing.completedLessons || []), ...(incoming.completedLessons || [])])
  );
  const bookmarkedItems = Array.from(
    new Set([...(existing.bookmarkedItems || []), ...(incoming.bookmarkedItems || [])])
  );
  const flashcardsReviewed = Array.from(
    new Set([...(existing.flashcardsReviewed || []), ...(incoming.flashcardsReviewed || [])])
  );
  const unlockedBadges = Array.from(
    new Set([...(existing.unlockedBadges || []), ...(incoming.unlockedBadges || [])])
  );

  // Merge track quiz scores keeping highest score per track
  const trackQuizScores = { ...(existing.trackQuizScores || {}) };
  for (const [trackId, record] of Object.entries(incoming.trackQuizScores || {})) {
    const prev = trackQuizScores[trackId];
    if (!prev || record.score >= prev.score) {
      trackQuizScores[trackId] = record;
    }
  }

  // Merge lab submissions keeping highest score or newest per lab task
  const labSubmissions = { ...(existing.labSubmissions || {}) };
  for (const [taskId, sub] of Object.entries(incoming.labSubmissions || {})) {
    const prev = labSubmissions[taskId];
    const prevTotal = prev?.breakdown?.total ?? -1;
    const nextTotal = sub?.breakdown?.total ?? 0;
    if (!prev || nextTotal >= prevTotal || (sub.timestamp || 0) >= (prev.timestamp || 0)) {
      labSubmissions[taskId] = sub;
    }
  }

  // Merge exam history by id
  const examMap = new Map();
  for (const ex of [...(existing.examHistory || []), ...(incoming.examHistory || [])]) {
    if (ex && ex.id) {
      examMap.set(ex.id, ex);
    }
  }
  const examHistory = Array.from(examMap.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Merge interview drafts keeping non-empty latest
  const interviewDrafts = {
    ...(existing.interviewDrafts || {}),
    ...(incoming.interviewDrafts || {})
  };

  return {
    ...existing,
    ...incoming,
    userName: incoming.userName || existing.userName || 'Sushama',
    completedLessons,
    bookmarkedItems,
    flashcardsReviewed,
    unlockedBadges,
    trackQuizScores,
    labSubmissions,
    examHistory,
    interviewDrafts,
    streakDays: Math.max(existing.streakDays || 1, incoming.streakDays || 1),
    lastActiveTimestamp: Math.max(
      existing.lastActiveTimestamp || 0,
      incoming.lastActiveTimestamp || Date.now()
    ),
    cloudUpdatedAt: new Date().toISOString()
  };
}

async function readCloudProfile(blobKey) {
  const { blobs } = await list({ prefix: blobKey, limit: 5 });
  const match = blobs.find((b) => b.pathname === blobKey) || blobs[0];
  if (!match) return null;

  const res = await fetch(`${match.url}?t=${Date.now()}`, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' }
  });
  if (!res.ok) return null;
  return await res.json();
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(503).json({
      ok: false,
      error: 'BLOB_READ_WRITE_TOKEN is not configured in this environment.'
    });
  }

  try {
    if (req.method === 'GET') {
      const userKey = normalizeUsername(req.query?.username);
      const blobKey = `profiles/${userKey}.json`;
      const profile = await readCloudProfile(blobKey);

      return res.status(200).json({
        ok: true,
        username: userKey,
        store: 'sushama-academy-db',
        profile: profile || null,
        syncedAt: profile?.cloudUpdatedAt || new Date().toISOString()
      });
    }

    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body || {};
      const userKey = normalizeUsername(body.username);
      const blobKey = `profiles/${userKey}.json`;

      const existing = await readCloudProfile(blobKey);
      const merged = mergeAcademyStates(existing, body.state || {});

      const savedBlob = await put(blobKey, JSON.stringify(merged, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        contentType: 'application/json',
        cacheControlMaxAge: 0
      });

      return res.status(200).json({
        ok: true,
        username: userKey,
        store: 'sushama-academy-db',
        blobUrl: savedBlob.url,
        profile: merged,
        syncedAt: merged.cloudUpdatedAt
      });
    }

    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  } catch (err) {
    console.error('Cloud DB sync error:', err);
    return res.status(500).json({
      ok: false,
      error: err instanceof Error ? err.message : 'Unexpected storage error'
    });
  }
}
