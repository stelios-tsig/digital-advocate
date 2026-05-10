// ============================================================
//  Digital Advocate v6 — storage.js
//  Κεντρικό storage API. Μόνο αυτό το αρχείο αγγίζει
//  chrome.storage. Όλα τα άλλα καλούν αυτό.
// ============================================================

const Storage = (() => {

  // ── Defaults ─────────────────────────────────────────────
  const DEFAULTS = {
    stats: {
      totalTrackers:       0,
      totalCookies:        0,
      totalAliasesUsed:    0,
      totalAdsBlocked:     0,
      totalConsent:        0,
      sitesProtected:      [],
      trackerLog:          [],   // max 200 εγγραφές
      dailyStats:          {},   // { "2025-01-01": { trackers: N, cookies: N } }
    },
    aliases:    [],
    exceptions: [],
    profile: {
      language:          "el",
      autoCookieReject:  true,
      trackerDetection:  true,
      aliasDetection:    true,
      floatingBadge:     true,
      consentManager:    true,
      httpsUpgrade:      true,
      referrerPolicy:    true,
      dntGpcHeaders:     true,
      webrtcProtection:  true,
      aliasFormat:       "memorable",
      firstRun:          true,
    },
  };

  // ── Low-level helpers ─────────────────────────────────────
  function get(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (data) => {
        if (chrome.runtime.lastError) {
          console.warn("[Storage] get error:", chrome.runtime.lastError.message);
          resolve({});
          return;
        }
        resolve(data);
      });
    });
  }

  function set(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, () => {
        if (chrome.runtime.lastError) {
          console.warn("[Storage] set error:", chrome.runtime.lastError.message);
        }
        resolve();
      });
    });
  }

  // ── Stats ─────────────────────────────────────────────────
  async function getStats() {
    const data = await get("stats");
    return { ...DEFAULTS.stats, ...(data.stats || {}) };
  }

  async function updateStats(updater) {
    const stats = await getStats();
    const updated = updater(stats);

    // Κρατάμε το trackerLog μικρό
    if (updated.trackerLog?.length > 200) {
      updated.trackerLog = updated.trackerLog.slice(-200);
    }

    // Ενημερώνουμε τα daily stats
    const today = new Date().toISOString().slice(0, 10);
    if (!updated.dailyStats) updated.dailyStats = {};
    if (!updated.dailyStats[today]) {
      updated.dailyStats[today] = { trackers: 0, cookies: 0, ads: 0 };
    }

    await set({ stats: updated });
    return updated;
  }

  async function resetStats() {
    await set({ stats: { ...DEFAULTS.stats } });
  }

  // ── Profile ───────────────────────────────────────────────
  async function getProfile() {
    const data = await get("profile");
    return { ...DEFAULTS.profile, ...(data.profile || {}) };
  }

  async function updateProfile(updates) {
    const profile = await getProfile();
    const updated = { ...profile, ...updates };
    await set({ profile: updated });
    return updated;
  }

  // ── Aliases ───────────────────────────────────────────────
  async function getAliases() {
    const data = await get("aliases");
    return data.aliases || [];
  }

  async function saveAliases(aliases) {
    await set({ aliases });
  }

  // ── Exceptions ────────────────────────────────────────────
  async function getExceptions() {
    const data = await get("exceptions");
    return data.exceptions || [];
  }

  async function saveExceptions(exceptions) {
    await set({ exceptions });
  }

  // ── Init (καλείται μια φορά στο onInstalled) ──────────────
  async function init() {
    const data = await get(["stats", "aliases", "exceptions", "profile"]);
    const toSet = {};
    if (!data.stats)      toSet.stats      = { ...DEFAULTS.stats };
    if (!data.aliases)    toSet.aliases    = [];
    if (!data.exceptions) toSet.exceptions = [];
    if (!data.profile)    toSet.profile    = { ...DEFAULTS.profile };
    if (Object.keys(toSet).length > 0) await set(toSet);
  }

  return {
    getStats, updateStats, resetStats,
    getProfile, updateProfile,
    getAliases, saveAliases,
    getExceptions, saveExceptions,
    init,
    DEFAULTS,
  };

})();

if (typeof window !== "undefined") window.Storage = Storage;
