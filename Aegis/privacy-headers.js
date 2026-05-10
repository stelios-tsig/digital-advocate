// ============================================================
//  Digital Advocate v6 — privacy-headers.js
//  HTTPS upgrade, Referrer Policy, DNT/GPC, WebRTC protection.
// ============================================================

(function () {
  "use strict";
  if (window.__dav6PrivacyHeaders) return;
  window.__dav6PrivacyHeaders = true;

  chrome.storage.local.get(["profile", "exceptions"], (data) => {
    if (chrome.runtime.lastError) { applyAll({}); return; }

    const domain     = location.hostname.replace(/^www\./, "");
    const exceptions = data.exceptions || [];
    if (exceptions.some((e) => e.domain === domain)) return;

    applyAll(data.profile || {});
  });

  function applyAll(profile) {
    if (profile.httpsUpgrade    !== false) applyHttpsUpgrade();
    if (profile.referrerPolicy  !== false) applyReferrerPolicy();
    if (profile.dntGpcHeaders   !== false) applyDntGpc();
    if (profile.webrtcProtection !== false) applyWebrtcProtection();
  }

  function applyHttpsUpgrade() {
    if (location.protocol !== "http:") return;
    const httpsUrl = location.href.replace(/^http:/, "https:");
    fetch(httpsUrl, { method: "HEAD", mode: "no-cors" })
      .then(() => { location.href = httpsUrl; })
      .catch(() => {}); // HTTPS not available — stay on HTTP
  }

  function applyReferrerPolicy() {
    if (document.querySelector('meta[name="referrer"]')) return;
    const meta    = document.createElement("meta");
    meta.name     = "referrer";
    meta.content  = "strict-origin-when-cross-origin";
    (document.head || document.documentElement).appendChild(meta);
  }

  function applyDntGpc() {
    // Do Not Track
    try {
      Object.defineProperty(navigator, "doNotTrack", {
        value: "1", writable: false, configurable: false,
      });
    } catch {}

    // Global Privacy Control
    try {
      Object.defineProperty(navigator, "globalPrivacyControl", {
        value: true, writable: false, configurable: false,
      });
    } catch {}

    // Inject headers via fetch override
    const originalFetch = window.fetch;
    window.fetch = function (resource, init = {}) {
      if (typeof resource === "string" || resource instanceof Request) {
        const headers = new Headers(init.headers || {});
        headers.set("DNT",     "1");
        headers.set("Sec-GPC", "1");
        init = { ...init, headers };
      }
      return originalFetch.call(this, resource, init);
    };
  }

  function applyWebrtcProtection() {
    const OriginalRTC =
      window.RTCPeerConnection ||
      window.webkitRTCPeerConnection ||
      window.mozRTCPeerConnection;

    if (!OriginalRTC) return;

    window.RTCPeerConnection = function (config = {}) {
      // Αφαίρεσε STUN servers που αποκαλύπτουν IP
      const iceServers = (config.iceServers || []).filter((s) => {
        const url = (Array.isArray(s.urls) ? s.urls[0] : s.urls) || s.url || "";
        return url.toLowerCase().startsWith("turn:"); // Κράτα μόνο TURN
      });
      return new OriginalRTC({ ...config, iceServers });
    };

    // Αντέγραψε static properties
    Object.setPrototypeOf(window.RTCPeerConnection, OriginalRTC);
  }

})();
