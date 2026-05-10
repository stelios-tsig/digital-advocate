// ============================================================
//  Digital Advocate v6 — consent-manager.js
//  Auto-reject consent dialogs. 6 πλατφόρμες + generic.
// ============================================================

(function () {
  "use strict";
  if (window.__dav6Consent) return;
  window.__dav6Consent = true;

  // ── Check profile & exceptions ────────────────────────────
  chrome.storage.local.get(["profile", "exceptions"], (data) => {
    if (chrome.runtime.lastError) { init(); return; }

    const domain     = location.hostname.replace(/^www\./, "");
    const exceptions = data.exceptions || [];
    if (exceptions.some((e) => e.domain === domain)) return;

    const profile = data.profile || {};
    if (profile.consentManager !== false) init();
  });

  // ── Platform handlers ─────────────────────────────────────
  const HANDLERS = {
    onetrust: () => {
      const btn = document.querySelector(
        "#onetrust-reject-all-handler, .onetrust-reject-all-handler"
      );
      if (btn) { btn.click(); return true; }
      // Fallback: open preferences then reject
      const prefs = document.querySelector("#onetrust-pc-btn-handler");
      if (prefs) {
        prefs.click();
        setTimeout(() => {
          document.querySelector(".ot-pc-refuse-all-handler")?.click();
        }, 600);
        return true;
      }
      return false;
    },

    cookiebot: () => {
      const btn = document.querySelector(
        "#CybotCookiebotDialogBodyButtonDecline, .cookie-alert-extended-button-secondary"
      );
      if (btn) { btn.click(); return true; }
      return false;
    },

    usercentrics: () => {
      const btn = document.querySelector(
        "[data-testid='uc-deny-all-button'], .uc-deny-all"
      );
      if (btn) { btn.click(); return true; }
      return false;
    },

    didomi: () => {
      const btn = document.querySelector(
        ".didomi-components-button.didomi-button-standard"
      );
      if (btn) { btn.click(); return true; }
      return false;
    },

    trustarc: () => {
      const btn = document.querySelector(".truste-button2, #truste-show-consent");
      if (btn) { btn.click(); return true; }
      return false;
    },

    quantcast: () => {
      const btn = document.querySelector(
        ".qc-cmp2-summary-buttons button[mode='secondary']"
      );
      if (btn) { btn.click(); return true; }
      return false;
    },

    generic: () => {
      const REJECT = [
        "reject all", "refuse all", "decline all", "deny all",
        "necessary only", "essential only", "only necessary",
        "aproripsi", "arnoumai",
      ];
      const ACCEPT = ["accept all", "allow all", "agree", "accept", "apodoxi"];

      const buttons = document.querySelectorAll(
        'button, a[role="button"], [role="button"]'
      );
      for (const btn of buttons) {
        const text = (
          btn.textContent || btn.getAttribute("aria-label") || ""
        ).toLowerCase().trim();
        if (REJECT.some((r) => text.includes(r)) && !ACCEPT.some((a) => text.includes(a))) {
          btn.click();
          return true;
        }
      }
      return false;
    },
  };

  // ── Platform detection ────────────────────────────────────
  function detectPlatform() {
    if (document.getElementById("onetrust-banner-sdk"))     return "onetrust";
    if (document.getElementById("CybotCookiebotDialog"))    return "cookiebot";
    if (document.getElementById("usercentrics-root"))       return "usercentrics";
    if (document.getElementById("didomi-host"))             return "didomi";
    if (document.getElementById("truste-consent-track"))    return "trustarc";
    if (document.querySelector(".qc-cmp2-container"))       return "quantcast";
    return "generic";
  }

  // ── Main logic ────────────────────────────────────────────
  function init() {
    let handled  = false;
    let attempts = 0;

    function tryHandle() {
      if (handled) return;
      const platform = detectPlatform();
      const success  = HANDLERS[platform]?.() || false;
      if (success) {
        handled = true;
        chrome.runtime.sendMessage({ type: "CONSENT_BLOCKED", platform });
      }
    }

    // Observe DOM mutations για lazy-loaded dialogs
    const observer = new MutationObserver(() => {
      if (!handled) setTimeout(tryHandle, 300);
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Initial attempts
    const ready = () => {
      setTimeout(tryHandle, 800);
      const retry = setInterval(() => {
        if (handled || ++attempts > 12) { clearInterval(retry); return; }
        tryHandle();
      }, 900);
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", ready, { once: true });
    } else {
      ready();
    }
  }

})();
