// ============================================================
//  Digital Advocate v6 — floating-badge.js
//  Φάση 3 — Lightweight floating badge. Φορτώνεται μόνο
//  αν είναι ενεργό στο profile. Χρησιμοποιεί requestIdleCallback.
// ============================================================

(function () {
  "use strict";
  if (window.__dav6Badge) return;
  window.__dav6Badge = true;

  // Lazy init — δεν επηρεάζει το page load
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 200));

  chrome.storage.local.get(["profile", "exceptions"], (data) => {
    if (chrome.runtime.lastError) return;

    const domain     = location.hostname.replace(/^www\./, "");
    const exceptions = data.exceptions || [];
    if (exceptions.some((e) => e.domain === domain)) return;
    if (data.profile?.floatingBadge === false) return;

    schedule(() => {
      if (document.body) initBadge();
      else document.addEventListener("DOMContentLoaded", initBadge, { once: true });
    });
  });

  function initBadge() {
    // Inject minimal styles
    const style = document.createElement("style");
    style.textContent = `
      #dav6-badge {
        position:fixed;bottom:18px;right:18px;z-index:2147483646;
        width:44px;height:44px;border-radius:50%;
        background:linear-gradient(135deg,#2dba8c,#1a6b9c);
        display:flex;align-items:center;justify-content:center;
        font-size:18px;cursor:pointer;
        box-shadow:0 3px 14px rgba(45,186,140,.4);
        transition:transform .2s,box-shadow .2s;
        border:2px solid rgba(255,255,255,.1);
        user-select:none;
      }
      #dav6-badge:hover {
        transform:scale(1.1);
        box-shadow:0 5px 20px rgba(45,186,140,.6);
      }
      #dav6-panel {
        position:fixed;bottom:72px;right:18px;z-index:2147483646;
        width:240px;background:#161a1f;
        border:1px solid #2dba8c;border-radius:10px;
        padding:14px;font-family:system-ui,sans-serif;font-size:12px;
        color:#e2e8f0;box-shadow:0 8px 32px rgba(0,0,0,.6);
        display:none;
      }
      #dav6-panel.open { display:block; }
      #dav6-panel .row {
        display:flex;justify-content:space-between;
        padding:4px 0;border-bottom:1px solid rgba(255,255,255,.05);
      }
      #dav6-panel .row:last-child { border:none; }
      #dav6-panel .lbl { color:#64748b;font-size:11px; }
      #dav6-panel .val { font-family:monospace;font-weight:700;color:#2dba8c; }
    `;
    document.head.appendChild(style);

    // Badge
    const badge = document.createElement("div");
    badge.id = "dav6-badge";
    badge.textContent = "🛡";
    document.body.appendChild(badge);

    // Panel
    const panel = document.createElement("div");
    panel.id = "dav6-panel";
    panel.innerHTML = `
      <div class="row"><span class="lbl">Trackers</span><span class="val" id="dav6-tr">—</span></div>
      <div class="row"><span class="lbl">Cookies</span><span class="val" id="dav6-ck">—</span></div>
      <div class="row"><span class="lbl">Ads</span><span class="val" id="dav6-ad">—</span></div>
    `;
    document.body.appendChild(panel);

    // Toggle
    let open = false;
    badge.addEventListener("click", () => {
      open = !open;
      panel.classList.toggle("open", open);
      if (open) updatePanel();
    });

    document.addEventListener("click", (e) => {
      if (open && !panel.contains(e.target) && e.target !== badge) {
        open = false;
        panel.classList.remove("open");
      }
    });

    function updatePanel() {
      chrome.runtime.sendMessage({ type: "GET_STATS" }, (s) => {
        if (!s) return;
        const tr = document.getElementById("dav6-tr");
        const ck = document.getElementById("dav6-ck");
        const ad = document.getElementById("dav6-ad");
        if (tr) tr.textContent = s.totalTrackers   || 0;
        if (ck) ck.textContent = s.totalCookies    || 0;
        if (ad) ad.textContent = s.totalAdsBlocked || 0;
      });
    }
  }
})();
