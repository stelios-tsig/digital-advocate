// ============================================================
//  Digital Advocate v6 — content.js
//  Tracker detection + Ad hiding.
//  Τρέχει σε κάθε σελίδα. Γρήγορο, ελαφρύ, αξιόπιστο.
// ============================================================

(function () {
  "use strict";
  if (window.__dav6Content) return;
  window.__dav6Content = true;

  // ── Constants ─────────────────────────────────────────────
  const TRACKER_PATTERNS = [
    "google-analytics.com", "googletagmanager.com", "doubleclick.net",
    "googlesyndication.com", "googleadservices.com", "amazon-adsystem.com",
    "facebook.com/tr", "connect.facebook.net", "hotjar.com", "clarity.ms",
    "mouseflow.com", "fullstory.com", "mixpanel.com", "segment.com",
    "intercom.io", "crisp.chat", "tiktok.com/i18n", "analytics.tiktok.com",
    "twitter.com/i/adsct", "ads.twitter.com", "snap.licdn.com",
    "linkedin.com/px", "sc-static.net", "tr.snapchat.com",
    "outbrain.com", "taboola.com", "criteo.com", "criteo.net",
    "rubiconproject.com", "pubmatic.com", "openx.net", "adnxs.com",
    "quantserve.com", "scorecardresearch.com", "moatads.com",
    "adform.net", "smartadserver.com", "teads.tv", "revcontent.com",
    "mgid.com", "zedo.com",
  ];

  const AD_SELECTORS = [
    "[id*='google_ads']", "[id*='div-gpt-ad']", "ins.adsbygoogle",
    "[class*='adsbygoogle']", "[data-ad-slot]", "[data-ad-client]",
    "ytd-display-ad-renderer", "ytd-promoted-sparkles-web-renderer",
    "ytd-video-masthead-ad-v3-renderer", "ytd-banner-promo-renderer",
    "[class*='promoted']", "[data-promoted-url]", "[class*='sponsored']",
  ].join(",");

  // ── State ─────────────────────────────────────────────────
  const foundTrackers = new Set();
  let   adsHidden     = 0;
  let   enabled       = true;

  // ── Check profile before doing anything ───────────────────
  async function checkEnabled() {
    return new Promise((resolve) => {
      chrome.storage.local.get(["profile", "exceptions"], (data) => {
        if (chrome.runtime.lastError) { resolve(true); return; }

        // Έλεγχος site exception
        const exceptions = data.exceptions || [];
        const domain     = location.hostname.replace(/^www\./, "");
        if (exceptions.some((e) => e.domain === domain)) {
          resolve(false);
          return;
        }

        const profile = data.profile || {};
        resolve(profile.trackerDetection !== false);
      });
    });
  }

  // ── Tracker detection ─────────────────────────────────────
  function detectTracker(url) {
    if (!url) return null;
    return TRACKER_PATTERNS.find((p) => url.includes(p)) || null;
  }

  function reportTrackers() {
    if (!foundTrackers.size) return;
    chrome.runtime.sendMessage({
      type: "TRACKERS_FOUND",
      trackers: [...foundTrackers],
      url: location.hostname,
    });
  }

  function observeScripts() {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType !== 1) continue;
          const src = node.src || node.getAttribute?.("src") || "";
          const tracker = detectTracker(src);
          if (tracker && !foundTrackers.has(tracker)) {
            foundTrackers.add(tracker);
            reportTrackers();
          }
        }
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });
  }

  // ── Ad hiding ─────────────────────────────────────────────
  function hideAds() {
    const ads = document.querySelectorAll(AD_SELECTORS);
    let count = 0;
    ads.forEach((el) => {
      if (el.dataset.davHidden) return;
      el.style.cssText = "display:none!important;visibility:hidden!important;";
      el.dataset.davHidden = "1";
      count++;
    });
    if (count > 0) {
      adsHidden += count;
      chrome.runtime.sendMessage({ type: "AD_BLOCKED", count, url: location.hostname });
    }
  }

  function observeAds() {
    const observer = new MutationObserver(() => hideAds());
    const target   = document.body || document.documentElement;
    observer.observe(target, { childList: true, subtree: true });
    hideAds();
  }

  // ── Cookie banner auto-reject ─────────────────────────────
  const REJECT_TEXTS = [
    "reject all", "refuse all", "decline all", "deny all",
    "only necessary", "only essential", "necessary only",
    "aproripsi olon", "mono aparaitita", "arnoumai",
  ];
  const ACCEPT_TEXTS = [
    "accept all", "allow all", "agree", "accept", "apodoxi",
  ];

  let cookieHandled = false;

  function tryRejectCookies() {
    if (cookieHandled) return;
    const buttons = document.querySelectorAll(
      'button, a[role="button"], [role="button"], input[type="button"]'
    );
    for (const btn of buttons) {
      const text = (
        btn.textContent || btn.value || btn.getAttribute("aria-label") || ""
      ).toLowerCase().trim();

      const isReject = REJECT_TEXTS.some((r) => text.includes(r));
      const isAccept = ACCEPT_TEXTS.some((a) => text.includes(a));

      if (isReject && !isAccept) {
        btn.click();
        cookieHandled = true;
        chrome.runtime.sendMessage({ type: "COOKIE_HANDLED", url: location.hostname });
        return;
      }
    }
  }

  // ── Message listener ──────────────────────────────────────
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (msg.type === "GET_PAGE_DATA") {
      sendResponse({
        trackers:      [...foundTrackers],
        adsHidden,
        url:           location.hostname,
        cookieHandled,
      });
    }
  });

  // ── Init ──────────────────────────────────────────────────
  async function init() {
    enabled = await checkEnabled();
    if (!enabled) return;

    observeScripts();

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        observeAds();
        setTimeout(tryRejectCookies, 800);
      }, { once: true });
    } else {
      observeAds();
      setTimeout(tryRejectCookies, 800);
    }

    // Retry cookie reject για lazy-loaded banners
    let attempts = 0;
    const retry = setInterval(() => {
      if (cookieHandled || ++attempts > 10) { clearInterval(retry); return; }
      tryRejectCookies();
    }, 1000);
  }

  init();
})();
