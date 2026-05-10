// ============================================================
//  Digital Advocate v6 — popup.js
//  Όλη η λογική του popup. Zero inline handlers.
// ============================================================

// ── Tracker labels ────────────────────────────────────────────
const TRACKER_INFO = {
  "google-analytics.com":  { name: "Google Analytics", type: "Analytics" },
  "googletagmanager.com":  { name: "Google Tag Mgr",   type: "Tag Mgr" },
  "doubleclick.net":       { name: "DoubleClick",       type: "Ads" },
  "googlesyndication.com": { name: "Google Ads",        type: "Ads" },
  "googleadservices.com":  { name: "Google AdSvc",      type: "Ads" },
  "amazon-adsystem.com":   { name: "Amazon Ads",        type: "Ads" },
  "facebook.com/tr":       { name: "Facebook Pixel",    type: "Ads" },
  "connect.facebook.net":  { name: "Facebook SDK",      type: "Ads" },
  "hotjar.com":            { name: "Hotjar",             type: "Heatmap" },
  "clarity.ms":            { name: "MS Clarity",         type: "Heatmap" },
  "mouseflow.com":         { name: "Mouseflow",          type: "Heatmap" },
  "fullstory.com":         { name: "FullStory",          type: "Session" },
  "mixpanel.com":          { name: "Mixpanel",           type: "Analytics" },
  "segment.com":           { name: "Segment",            type: "Analytics" },
  "intercom.io":           { name: "Intercom",           type: "Chat" },
  "snap.licdn.com":        { name: "LinkedIn Insight",   type: "Ads" },
  "ads.twitter.com":       { name: "Twitter Ads",        type: "Ads" },
  "analytics.tiktok.com":  { name: "TikTok Pixel",       type: "Ads" },
  "outbrain.com":          { name: "Outbrain",            type: "Content" },
  "taboola.com":           { name: "Taboola",             type: "Content" },
  "criteo.com":            { name: "Criteo",              type: "Retarget" },
};

// ── State ─────────────────────────────────────────────────────
let currentDomain  = "";
let currentTab     = null;
let miniChart      = null;

// ── Helpers ───────────────────────────────────────────────────
function $(id) { return document.getElementById(id); }

function animNum(el, target) {
  if (!el) return;
  const start = parseInt(el.textContent) || 0;
  if (start === target) return;
  const t0 = performance.now();
  const dur = 350;
  const tick = (now) => {
    const p = Math.min((now - t0) / dur, 1);
    el.textContent = Math.round(start + (target - start) * (1 - (1 - p) ** 3));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

function toast(msg, color = "var(--accent)") {
  const el = $("toast");
  el.textContent = msg;
  el.style.background = color;
  el.style.color = color === "var(--accent)" ? "#0d0f12" : "#fff";
  el.classList.add("show");
  setTimeout(() => el.classList.remove("show"), 2000);
}

// ── i18n: apply to DOM ────────────────────────────────────────
function applyI18n() {
  const t = I18N.t.bind(I18N);
  const lang = I18N.getLang();

  // Tabs
  $("tab-dashboard").textContent = t("tab_dashboard");
  $("tab-aliases").textContent   = t("tab_aliases");
  $("tab-settings").textContent  = t("tab_settings");

  // Dashboard
  $("lbl-trackers").textContent = t("trackers");
  $("lbl-cookies").textContent  = t("cookies");
  $("lbl-ads").textContent      = t("ads");
  $("lbl-consent").textContent  = t("consent");
  $("chart-lbl").textContent    = t("chart_label");

  // Aliases
  $("btn-new-alias").textContent = t("btn_new_alias");

  // Settings labels
  $("lbl-section-language").textContent  = t("section_language");
  $("lbl-section-site").textContent      = t("section_site");
  $("lbl-section-features").textContent  = t("section_features");
  $("lbl-section-data").textContent      = t("section_data");
  $("lbl-excluded-sites").textContent    = t("excluded_sites");

  // Toggles
  $("tl-cookies").textContent   = t("toggle_cookies");
  $("ts-cookies").textContent   = t("toggle_cookies_s");
  $("tl-trackers").textContent  = t("toggle_trackers");
  $("ts-trackers").textContent  = t("toggle_trackers_s");
  $("tl-consent").textContent   = t("toggle_consent");
  $("ts-consent").textContent   = t("toggle_consent_s");
  $("tl-badge").textContent     = t("toggle_badge");
  $("ts-badge").textContent     = t("toggle_badge_s");
  $("tl-https").textContent     = t("toggle_https");
  $("ts-https").textContent     = t("toggle_https_s");
  $("tl-referrer").textContent  = t("toggle_referrer");
  $("ts-referrer").textContent  = t("toggle_referrer_s");
  $("tl-dnt").textContent       = t("toggle_dnt");
  $("ts-dnt").textContent       = t("toggle_dnt_s");
  $("tl-webrtc").textContent    = t("toggle_webrtc");
  $("ts-webrtc").textContent    = t("toggle_webrtc_s");

  // Data buttons
  $("btn-export").textContent         = t("btn_export");
  $("btn-import-toggle").textContent  = t("btn_import");
  $("btn-import-confirm").textContent = t("btn_import_confirm");
  $("btn-reset").textContent          = t("btn_reset");
  $("import-text").placeholder        = t("import_placeholder");

  // Footer
  $("footer-tagline").textContent = t("tagline");
  $("footer-ver").textContent     = t("version");

  // Lang buttons
  $("lang-el").classList.toggle("active", lang === "el");
  $("lang-en").classList.toggle("active", lang === "en");

  document.getElementById("html-root").lang = lang;
}

// ── Tabs ──────────────────────────────────────────────────────
function switchTab(name) {
  document.querySelectorAll(".tab").forEach((t) =>
    t.classList.toggle("active", t.dataset.tab === name)
  );
  document.querySelectorAll(".tab-panel").forEach((p) =>
    p.classList.toggle("active", p.id === `panel-${name}`)
  );
  if (name === "aliases")  renderAliases();
  if (name === "settings") renderSettings();
}

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => switchTab(tab.dataset.tab));
});

// ── Dashboard ─────────────────────────────────────────────────
async function loadDashboard() {
  // Current tab info
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  currentTab = tab;

  if (tab?.url) {
    try {
      currentDomain = new URL(tab.url).hostname;
    } catch {
      currentDomain = "";
    }
  }

  $("header-domain").textContent = currentDomain || "—";
  $("site-domain").textContent   = currentDomain || "—";

  // Stats
  const stats = await chrome.runtime.sendMessage({ type: "GET_STATS" });
  animNum($("s-trackers"), stats?.totalTrackers    || 0);
  animNum($("s-cookies"),  stats?.totalCookies     || 0);
  animNum($("s-ads"),      stats?.totalAdsBlocked  || 0);
  animNum($("s-consent"),  stats?.totalConsent     || 0);

  // Site badge
  await updateSiteBadge($("site-badge"));

  // Alias domain label
  $("alias-domain-lbl").textContent =
    currentDomain ? `${I18N.t("alias_for")} ${currentDomain}` : "";

  // Exception site name
  $("exc-site-name").textContent = currentDomain || "—";

  // Page trackers
  if (tab?.id) {
    chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_DATA" }, (data) => {
      if (chrome.runtime.lastError || !data) {
        renderTrackers([]);
        return;
      }
      renderTrackers(data.trackers || []);
    });
  } else {
    renderTrackers([]);
  }

  // Mini chart
  renderMiniChart(stats?.dailyStats || {});
}

async function updateSiteBadge(el) {
  if (!el || !currentDomain) return;
  const excluded = await SiteExceptions.isExcluded(currentDomain);
  el.textContent = excluded ? I18N.t("site_excluded") : I18N.t("site_protected");
  el.className   = `site-badge ${excluded ? "excluded" : "protected"}`;
}

function renderTrackers(trackers) {
  const list = $("tracker-list");
  if (!trackers.length) {
    list.innerHTML = `<div class="no-trackers">${I18N.t("no_trackers")}</div>`;
    return;
  }
  list.innerHTML = trackers.map((t) => {
    const info = TRACKER_INFO[t] || { name: t, type: "Tracker" };
    return `<div class="tracker-row">
      <div class="t-dot"></div>
      <span class="t-name">${info.name}</span>
      <span class="t-type">${info.type}</span>
    </div>`;
  }).join("");
}

function renderMiniChart(dailyStats) {
  const canvas = $("mini-chart");
  if (!canvas) return;

  // Τελευταίες 7 ημέρες
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().slice(0, 10));
  }

  const values = days.map((d) => dailyStats[d]?.trackers || 0);
  const labels = days.map((d) => {
    const dt = new Date(d);
    return dt.toLocaleDateString(I18N.getLang() === "el" ? "el-GR" : "en-GB",
      { day: "2-digit", month: "2-digit" });
  });

  if (miniChart) miniChart.destroy();

  miniChart = new Chart(canvas.getContext("2d"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: "rgba(45,186,140,0.5)",
        borderColor: "#2dba8c",
        borderWidth: 1,
        borderRadius: 3,
      }],
    },
    options: {
      responsive: true,
      animation: { duration: 400 },
      plugins: { legend: { display: false } },
      scales: {
        x: {
          ticks: { color: "#64748b", font: { size: 9 } },
          grid:  { display: false },
        },
        y: {
          ticks: { color: "#64748b", font: { size: 9 }, maxTicksLimit: 4 },
          grid:  { color: "rgba(255,255,255,.05)" },
          beginAtZero: true,
        },
      },
    },
  });
}

// ── Aliases ───────────────────────────────────────────────────
async function renderAliases() {
  const aliases = await AliasEngine.getAll();
  const list    = $("alias-list");

  if (!aliases.length) {
    list.innerHTML = `<div class="alias-empty">
      ${I18N.t("no_aliases")}<br>
      <span style="font-size:11px">${I18N.t("no_aliases_sub")}</span>
    </div>`;
    return;
  }

  list.innerHTML = aliases.map((a) => `
    <div class="alias-card ${a.active ? "" : "inactive"}" data-id="${a.id}" data-alias="${a.alias}">
      <div class="alias-addr">${a.alias}</div>
      <div class="alias-meta">
        <span class="alias-site">${a.domain}</span>
        <span class="alias-uses">×${a.usedCount || 0} ${I18N.t("uses")}</span>
      </div>
      <div class="alias-actions">
        <button class="alias-btn" data-action="copy">${I18N.t("btn_copy")}</button>
        <button class="alias-btn" data-action="toggle">
          ${a.active ? I18N.t("btn_toggle_pause") : I18N.t("btn_toggle_resume")}
        </button>
        <button class="alias-btn del" data-action="delete">${I18N.t("btn_delete")}</button>
      </div>
    </div>`).join("");

  // Event delegation
  list.addEventListener("click", async (e) => {
    const btn  = e.target.closest("[data-action]");
    if (!btn) return;
    const card   = btn.closest("[data-id]");
    const id     = parseInt(card.dataset.id);
    const alias  = card.dataset.alias;
    const action = btn.dataset.action;

    if (action === "copy") {
      await navigator.clipboard.writeText(alias);
      const orig = btn.textContent;
      btn.textContent = I18N.t("btn_copied");
      setTimeout(() => btn.textContent = orig, 1500);
      toast(I18N.t("alias_copied"));
    }
    if (action === "toggle") {
      await AliasEngine.toggle(id);
      renderAliases();
    }
    if (action === "delete") {
      if (!confirm(I18N.t("confirm_delete"))) return;
      await AliasEngine.remove(id);
      renderAliases();
    }
  }, { once: true }); // re-added on each render
}

// New alias button
$("btn-new-alias").addEventListener("click", async () => {
  if (!currentDomain) return;
  const res = await AliasEngine.createNew(currentDomain);
  if (res) {
    toast(I18N.t("alias_created"));
    renderAliases();
  }
});

// ── Settings ──────────────────────────────────────────────────
async function renderSettings() {
  // Toggles
  const profile = await chrome.runtime.sendMessage({ type: "GET_PROFILE" });
  const TOGGLES = {
    "tog-cookies":  "autoCookieReject",
    "tog-trackers": "trackerDetection",
    "tog-consent":  "consentManager",
    "tog-badge":    "floatingBadge",
    "tog-https":    "httpsUpgrade",
    "tog-referrer": "referrerPolicy",
    "tog-dnt":      "dntGpcHeaders",
    "tog-webrtc":   "webrtcProtection",
  };
  Object.entries(TOGGLES).forEach(([elId, key]) => {
    const el = $(elId);
    if (el) el.checked = profile?.[key] !== false;
  });

  // Exception
  await renderExcBlock();
}

// Toggle change listeners (attach once)
const TOGGLE_MAP = {
  "tog-cookies":  "autoCookieReject",
  "tog-trackers": "trackerDetection",
  "tog-consent":  "consentManager",
  "tog-badge":    "floatingBadge",
  "tog-https":    "httpsUpgrade",
  "tog-referrer": "referrerPolicy",
  "tog-dnt":      "dntGpcHeaders",
  "tog-webrtc":   "webrtcProtection",
};
Object.entries(TOGGLE_MAP).forEach(([elId, key]) => {
  $(elId)?.addEventListener("change", (e) => {
    chrome.runtime.sendMessage({
      type: "UPDATE_PROFILE",
      updates: { [key]: e.target.checked },
    });
  });
});

// ── Site exceptions ───────────────────────────────────────────
async function renderExcBlock() {
  // Button
  const btn      = $("btn-exc");
  const badge    = $("exc-badge");
  const excluded = currentDomain
    ? await SiteExceptions.isExcluded(currentDomain)
    : false;

  btn.textContent = I18N.t(excluded ? "btn_include" : "btn_exclude");
  btn.classList.toggle("is-excluded", excluded);
  await updateSiteBadge(badge);

  // Exceptions list
  const excList = $("exc-list");
  const all     = await SiteExceptions.getAll();
  if (!all.length) {
    excList.innerHTML = `<div class="exc-empty">${I18N.t("no_exclusions")}</div>`;
    return;
  }
  excList.innerHTML = all.map((e) => `
    <div class="exc-item">
      <span style="color:var(--muted);font-size:10px;">⊘</span>
      <span class="exc-domain">${e.domain}</span>
      <button class="exc-remove" data-domain="${e.domain}">✕</button>
    </div>`).join("");

  excList.querySelectorAll(".exc-remove").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await SiteExceptions.remove(btn.dataset.domain);
      renderExcBlock();
      updateSiteBadge($("site-badge"));
    });
  });
}

$("btn-exc").addEventListener("click", async () => {
  if (!currentDomain) return;
  const nowExcluded = await SiteExceptions.toggle(currentDomain);
  toast(nowExcluded ? I18N.t("site_excluded") : I18N.t("site_protected"));
  await renderExcBlock();
  await updateSiteBadge($("site-badge"));
});

// ── Language ──────────────────────────────────────────────────
$("lang-el").addEventListener("click", async () => {
  await I18N.setLang("el");
  applyI18n();
  renderSettings();
});
$("lang-en").addEventListener("click", async () => {
  await I18N.setLang("en");
  applyI18n();
  renderSettings();
});

// ── Data buttons ──────────────────────────────────────────────
$("btn-export").addEventListener("click", async () => {
  const data = await AliasEngine.exportAll();
  if (!data) return;
  const blob = new Blob([data], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url;
  a.download = "digital-advocate-aliases.json";
  a.click();
  URL.revokeObjectURL(url);
});

$("btn-import-toggle").addEventListener("click", () => {
  const wrap = $("import-wrap");
  wrap.style.display = wrap.style.display === "none" ? "block" : "none";
});

$("btn-import-confirm").addEventListener("click", async () => {
  const text = $("import-text").value.trim();
  if (!text) return;
  const res = await AliasEngine.importAll(text);
  if (res?.ok) {
    $("import-wrap").style.display = "none";
    $("import-text").value = "";
    toast(`✓ ${res.count} aliases`);
    renderAliases();
  } else {
    toast("✗ Invalid format", "var(--warn)");
  }
});

$("btn-reset").addEventListener("click", async () => {
  if (!confirm(I18N.t("confirm_reset"))) return;
  await chrome.runtime.sendMessage({ type: "RESET_STATS" });
  toast("✓ Reset");
  await loadDashboard();
});

// ── Init ──────────────────────────────────────────────────────
async function init() {
  await I18N.init();
  applyI18n();
  await loadDashboard();
}

// Chart.js needed — load it then init
const chartScript    = document.createElement("script");
chartScript.src      = chrome.runtime.getURL("chart.min.js");
chartScript.onload   = init;
chartScript.onerror  = init; // Αν δεν φορτώσει, προχώρα χωρίς chart
document.head.appendChild(chartScript);
