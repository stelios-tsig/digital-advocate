// ============================================================
//  Digital Advocate v6 — background.js
//  Service Worker. Μόνο: stats, messaging, context menu.
//  ΔΕΝ περιέχει alias engine ή άλλη business logic.
// ============================================================

// ── Storage (inline — importScripts δεν δουλεύει σε MV3) ──
// Minimal version του storage.js για τον service worker
const Storage = (() => {
  const DEFAULTS = {
    stats: {
      totalTrackers: 0, totalCookies: 0, totalAliasesUsed: 0,
      totalAdsBlocked: 0, totalConsent: 0,
      sitesProtected: [], trackerLog: [], dailyStats: {},
    },
    profile: {
      language: "el", autoCookieReject: true, trackerDetection: true,
      aliasDetection: true, floatingBadge: true, consentManager: true,
      httpsUpgrade: true, referrerPolicy: true, dntGpcHeaders: true,
      webrtcProtection: true, aliasFormat: "memorable", firstRun: true,
    },
  };

  function get(keys) {
    return new Promise((resolve) => {
      chrome.storage.local.get(keys, (data) => {
        if (chrome.runtime.lastError) { resolve({}); return; }
        resolve(data);
      });
    });
  }

  function set(data) {
    return new Promise((resolve) => {
      chrome.storage.local.set(data, resolve);
    });
  }

  async function getStats() {
    const data = await get("stats");
    return { ...DEFAULTS.stats, ...(data.stats || {}) };
  }

  async function updateStats(updater) {
    const stats = await getStats();
    const updated = updater(stats);
    if (updated.trackerLog?.length > 200)
      updated.trackerLog = updated.trackerLog.slice(-200);
    const today = new Date().toISOString().slice(0, 10);
    if (!updated.dailyStats) updated.dailyStats = {};
    if (!updated.dailyStats[today])
      updated.dailyStats[today] = { trackers: 0, cookies: 0, ads: 0 };
    await set({ stats: updated });
    return updated;
  }

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

  async function getAliases() {
    const data = await get("aliases");
    return data.aliases || [];
  }

  async function saveAliases(aliases) {
    await set({ aliases });
  }

  async function init() {
    const data = await get(["stats", "aliases", "exceptions", "profile"]);
    const toSet = {};
    if (!data.stats)      toSet.stats      = { ...DEFAULTS.stats };
    if (!data.aliases)    toSet.aliases    = [];
    if (!data.exceptions) toSet.exceptions = [];
    if (!data.profile)    toSet.profile    = { ...DEFAULTS.profile };
    if (Object.keys(toSet).length > 0) await set(toSet);
  }

  return { getStats, updateStats, getProfile, updateProfile,
           getAliases, saveAliases, init, set };
})();

// ── Alias generation (inline — απαραίτητο για context menu) ──
const WORDS_A = [
  "swift","calm","bold","clear","keen","wise","bright","safe","free","pure",
  "brave","cool","deep","fair","firm","grand","happy","just","kind","light",
  "lucky","noble","open","proud","quick","quiet","ready","sharp","smart","solid",
  "strong","true","vast","warm","wild","young","zen","agile","alert","apt"
];
const WORDS_B = [
  "pine","oak","river","stone","cloud","wave","dawn","peak","vale","reef",
  "bay","cove","dune","fjord","glen","hill","isle","knoll","lake","marsh",
  "mesa","moor","pass","pond","ridge","shore","spring","thicket","vista","wood",
  "brook","canyon","delta","estuary","fen","gorge","haven","inlet","jetty","kelp"
];

function generateAlias(format = "memorable") {
  const rand = Math.random().toString(36).slice(2, 6);
  if (format === "random") {
    const r1 = Math.random().toString(36).slice(2, 5);
    const r2 = Math.random().toString(36).slice(2, 5);
    return `${r1}-${r2}-${rand}@advocate.privacy`;
  }
  const wa = WORDS_A[Math.floor(Math.random() * WORDS_A.length)];
  const wb = WORDS_B[Math.floor(Math.random() * WORDS_B.length)];
  return `${wa}-${wb}-${rand}@advocate.privacy`;
}

function updateBadge(tabId, count) {
  chrome.action.setBadgeText({
    text: count > 0 ? String(count) : "",
    tabId,
  });
  chrome.action.setBadgeBackgroundColor({ color: "#2dba8c" });
}

// ── onInstalled ───────────────────────────────────────────
chrome.runtime.onInstalled.addListener(async (details) => {
  await Storage.init();

  // Context menu
  chrome.contextMenus.create({
    id: "generate-alias",
    title: "🛡 Δημιούργησε Email Alias",
    contexts: ["page", "editable"],
  }, () => { chrome.runtime.lastError; }); // suppress duplicate error

  if (details.reason === "install") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Ψηφιακός Συνήγορος — Εγκαταστάθηκε!",
      message: "Δεν είσαι το προϊόν. Είσαι ο ιδιοκτήτης. 🛡",
    });
  }
});

// ── Context menu ──────────────────────────────────────────
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== "generate-alias" || !tab?.url) return;
  try {
    const domain  = new URL(tab.url).hostname;
    const profile = await Storage.getProfile();
    const aliases = await Storage.getAliases();
    const existing = aliases.find((a) => a.domain === domain && a.active);

    const alias = existing
      ? existing.alias
      : generateAlias(profile.aliasFormat);

    if (!existing) {
      aliases.unshift({
        id: Date.now(), alias, domain,
        created: new Date().toISOString(),
        active: true, usedCount: 0,
      });
      await Storage.saveAliases(aliases);
    }

    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (a) => navigator.clipboard.writeText(a),
      args: [alias],
    });
  } catch (e) {
    // Tab might not support scripting — silent fail
  }
});

// ── Message handler ───────────────────────────────────────
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg, sender).then(sendResponse).catch((err) => {
    sendResponse({ ok: false, error: err.message });
  });
  return true; // async response
});

async function handleMessage(msg, sender) {
  const { type } = msg;

  // ── Stats ───────────────────────────────────────────────
  if (type === "TRACKERS_FOUND") {
    const { trackers, url } = msg;
    await Storage.updateStats((s) => {
      const newOnes = trackers.filter(
        (t) => !s.trackerLog.some((l) => l.tracker === t && l.domain === url)
      );
      newOnes.forEach((t) =>
        s.trackerLog.push({ domain: url, tracker: t, time: new Date().toISOString() })
      );
      s.totalTrackers += newOnes.length;
      if (!s.sitesProtected.includes(url)) s.sitesProtected.push(url);
      const today = new Date().toISOString().slice(0, 10);
      if (!s.dailyStats[today]) s.dailyStats[today] = { trackers: 0, cookies: 0, ads: 0 };
      s.dailyStats[today].trackers += newOnes.length;
      return s;
    });
    if (sender.tab?.id) {
      const stats = await Storage.getStats();
      const count = stats.trackerLog.filter((l) => l.domain === msg.url).length;
      updateBadge(sender.tab.id, count);
    }
    return { ok: true };
  }

  if (type === "COOKIE_HANDLED") {
    await Storage.updateStats((s) => {
      s.totalCookies++;
      const today = new Date().toISOString().slice(0, 10);
      if (!s.dailyStats[today]) s.dailyStats[today] = { trackers: 0, cookies: 0, ads: 0 };
      s.dailyStats[today].cookies++;
      return s;
    });
    return { ok: true };
  }

  if (type === "CONSENT_BLOCKED") {
    await Storage.updateStats((s) => { s.totalConsent = (s.totalConsent || 0) + 1; return s; });
    return { ok: true };
  }

  if (type === "AD_BLOCKED") {
    await Storage.updateStats((s) => {
      s.totalAdsBlocked = (s.totalAdsBlocked || 0) + (msg.count || 1);
      const today = new Date().toISOString().slice(0, 10);
      if (!s.dailyStats[today]) s.dailyStats[today] = { trackers: 0, cookies: 0, ads: 0 };
      s.dailyStats[today].ads += (msg.count || 1);
      return s;
    });
    return { ok: true };
  }

  if (type === "GET_STATS")  return await Storage.getStats();
  if (type === "RESET_STATS") {
    await Storage.set({
      stats: {
        totalTrackers: 0, totalCookies: 0, totalAliasesUsed: 0,
        totalAdsBlocked: 0, totalConsent: 0,
        sitesProtected: [], trackerLog: [], dailyStats: {},
      }
    });
    return { ok: true };
  }

  // ── Aliases ─────────────────────────────────────────────
  if (type === "GET_ALIASES") {
    return { aliases: await Storage.getAliases() };
  }

  if (type === "GET_OR_CREATE_ALIAS") {
    const aliases = await Storage.getAliases();
    const profile = await Storage.getProfile();
    const existing = aliases.find((a) => a.domain === msg.domain && a.active);
    if (existing) return { alias: existing.alias, isNew: false };
    const alias = generateAlias(profile.aliasFormat);
    aliases.unshift({
      id: Date.now(), alias, domain: msg.domain,
      created: new Date().toISOString(), active: true, usedCount: 0,
    });
    await Storage.saveAliases(aliases);
    return { alias, isNew: true };
  }

  if (type === "GENERATE_ALIAS") {
    const profile  = await Storage.getProfile();
    const aliases  = await Storage.getAliases();
    const alias    = generateAlias(profile.aliasFormat);
    aliases.unshift({
      id: Date.now(), alias, domain: msg.domain,
      created: new Date().toISOString(), active: true, usedCount: 0,
    });
    await Storage.saveAliases(aliases);
    return { alias };
  }

  if (type === "TOGGLE_ALIAS") {
    const aliases = await Storage.getAliases();
    const updated = aliases.map((a) =>
      a.id === msg.id ? { ...a, active: !a.active } : a
    );
    await Storage.saveAliases(updated);
    return { ok: true };
  }

  if (type === "DELETE_ALIAS") {
    const aliases = await Storage.getAliases();
    await Storage.saveAliases(aliases.filter((a) => a.id !== msg.id));
    return { ok: true };
  }

  if (type === "ALIAS_USED") {
    const aliases = await Storage.getAliases();
    const updated = aliases.map((a) =>
      a.alias === msg.alias ? { ...a, usedCount: (a.usedCount || 0) + 1 } : a
    );
    await Storage.saveAliases(updated);
    await Storage.updateStats((s) => {
      s.totalAliasesUsed = (s.totalAliasesUsed || 0) + 1;
      return s;
    });
    return { ok: true };
  }

  if (type === "EXPORT_ALIASES") {
    const aliases = await Storage.getAliases();
    return {
      data: JSON.stringify({
        version: "6.0.0",
        exported: new Date().toISOString(),
        aliases,
      }, null, 2),
    };
  }

  if (type === "IMPORT_ALIASES") {
    try {
      const parsed = JSON.parse(msg.data);
      if (!Array.isArray(parsed.aliases)) throw new Error("Invalid format");
      await Storage.saveAliases(parsed.aliases);
      return { ok: true, count: parsed.aliases.length };
    } catch (e) {
      return { ok: false, error: e.message };
    }
  }

  // ── Profile ─────────────────────────────────────────────
  if (type === "GET_PROFILE")    return await Storage.getProfile();
  if (type === "UPDATE_PROFILE") return await Storage.updateProfile(msg.updates);

  // ── Page data (από content.js) ───────────────────────────
  if (type === "GET_PAGE_DATA") return { ok: true };

  return { ok: false, error: `Unknown message type: ${type}` };
}
