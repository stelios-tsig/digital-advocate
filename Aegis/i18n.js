// ============================================================
//  Digital Advocate v6 — i18n.js
//  EL / EN translations. Χρησιμοποιείται μόνο από popup.js
// ============================================================

const I18N = (() => {

  const T = {
    el: {
      // Header
      tagline:            "Δεν είσαι το προϊόν.",

      // Tabs
      tab_dashboard:      "Dashboard",
      tab_aliases:        "Aliases",
      tab_settings:       "Ρυθμίσεις",

      // Dashboard
      trackers:           "Trackers",
      cookies:            "Cookies",
      ads:                "Διαφημίσεις",
      consent:            "Consent",
      site_protected:     "🛡 Προστατεύεται",
      site_excluded:      "⊘ Εξαίρεση",
      no_trackers:        "✓ Καθαρή σελίδα",
      trackers_found:     "Trackers σε αυτή τη σελίδα:",
      chart_label:        "Trackers (7 ημέρες)",

      // Aliases
      alias_for:          "Alias για",
      btn_new_alias:      "＋ Νέο alias",
      btn_copy:           "⎘ Αντιγραφή",
      btn_copied:         "✓ Αντιγράφηκε",
      btn_toggle_pause:   "⏸ Παύση",
      btn_toggle_resume:  "▶ Ενεργό",
      btn_delete:         "✕",
      uses:               "χρήσεις",
      no_aliases:         "Δεν έχεις aliases ακόμα.",
      no_aliases_sub:     "Πάτα «Νέο alias» για να δημιουργήσεις.",
      alias_copied:       "✓ Alias αντιγράφηκε!",
      alias_created:      "✓ Νέο alias δημιουργήθηκε!",

      // Settings — Language
      section_language:   "Γλώσσα",
      // Settings — Site
      section_site:       "Τρέχουσα σελίδα",
      btn_exclude:        "⊘ Εξαίρεση αυτής της σελίδας",
      btn_include:        "🛡 Ενεργοποίηση προστασίας",
      excluded_sites:     "Εξαιρεμένες σελίδες",
      no_exclusions:      "Καμία εξαίρεση",
      // Settings — Features
      section_features:   "Λειτουργίες",
      toggle_cookies:     "Auto-reject cookies",
      toggle_cookies_s:   "Αυτόματη απόρριψη cookie banners",
      toggle_trackers:    "Tracker detection",
      toggle_trackers_s:  "Εντοπισμός trackers & ads",
      toggle_consent:     "Consent Manager",
      toggle_consent_s:   "Υποστήριξη 6 consent platforms",
      toggle_badge:       "Floating badge",
      toggle_badge_s:     "Εικονίδιο 🛡 στη σελίδα",
      toggle_https:       "HTTPS Upgrade",
      toggle_https_s:     "Αναγκαστικό HTTPS",
      toggle_referrer:    "Referrer Policy",
      toggle_referrer_s:  "Σταματάει URL leaks",
      toggle_dnt:         "DNT & GPC",
      toggle_dnt_s:       "Do Not Track + Global Privacy Control",
      toggle_webrtc:      "WebRTC Protection",
      toggle_webrtc_s:    "Αποφυγή IP leak",
      // Settings — Data
      section_data:       "Δεδομένα",
      btn_export:         "📥 Εξαγωγή aliases",
      btn_import:         "📤 Εισαγωγή aliases",
      btn_import_confirm: "✓ Εισαγωγή",
      btn_reset:          "⚠️ Reset στατιστικών",
      import_placeholder: "Επικόλλησε το backup JSON εδώ...",
      confirm_reset:      "Διαγραφή όλων των στατιστικών;",
      confirm_delete:     "Διαγραφή αυτού του alias;",

      // Footer
      version:            "v6.0.0",
    },

    en: {
      // Header
      tagline:            "You're not the product.",

      // Tabs
      tab_dashboard:      "Dashboard",
      tab_aliases:        "Aliases",
      tab_settings:       "Settings",

      // Dashboard
      trackers:           "Trackers",
      cookies:            "Cookies",
      ads:                "Ads",
      consent:            "Consent",
      site_protected:     "🛡 Protected",
      site_excluded:      "⊘ Excluded",
      no_trackers:        "✓ Clean page",
      trackers_found:     "Trackers on this page:",
      chart_label:        "Trackers (7 days)",

      // Aliases
      alias_for:          "Alias for",
      btn_new_alias:      "＋ New alias",
      btn_copy:           "⎘ Copy",
      btn_copied:         "✓ Copied",
      btn_toggle_pause:   "⏸ Pause",
      btn_toggle_resume:  "▶ Active",
      btn_delete:         "✕",
      uses:               "uses",
      no_aliases:         "No aliases yet.",
      no_aliases_sub:     "Click «New alias» to create one.",
      alias_copied:       "✓ Alias copied!",
      alias_created:      "✓ New alias created!",

      // Settings — Language
      section_language:   "Language",
      // Settings — Site
      section_site:       "Current site",
      btn_exclude:        "⊘ Exclude this site",
      btn_include:        "🛡 Enable protection",
      excluded_sites:     "Excluded sites",
      no_exclusions:      "No exclusions",
      // Settings — Features
      section_features:   "Features",
      toggle_cookies:     "Auto-reject cookies",
      toggle_cookies_s:   "Automatically reject cookie banners",
      toggle_trackers:    "Tracker detection",
      toggle_trackers_s:  "Detect trackers & ads",
      toggle_consent:     "Consent Manager",
      toggle_consent_s:   "Supports 6 consent platforms",
      toggle_badge:       "Floating badge",
      toggle_badge_s:     "🛡 icon on every page",
      toggle_https:       "HTTPS Upgrade",
      toggle_https_s:     "Force HTTPS where available",
      toggle_referrer:    "Referrer Policy",
      toggle_referrer_s:  "Stop URL leaks",
      toggle_dnt:         "DNT & GPC",
      toggle_dnt_s:       "Do Not Track + Global Privacy Control",
      toggle_webrtc:      "WebRTC Protection",
      toggle_webrtc_s:    "Prevent IP leak via WebRTC",
      // Settings — Data
      section_data:       "Data",
      btn_export:         "📥 Export aliases",
      btn_import:         "📤 Import aliases",
      btn_import_confirm: "✓ Import",
      btn_reset:          "⚠️ Reset statistics",
      import_placeholder: "Paste your backup JSON here...",
      confirm_reset:      "Delete all statistics?",
      confirm_delete:     "Delete this alias?",

      // Footer
      version:            "v6.0.0",
    },
  };

  let lang = "el";

  async function init() {
    return new Promise((resolve) => {
      chrome.storage.local.get("profile", (data) => {
        const l = data.profile?.language;
        if (l === "el" || l === "en") lang = l;
        resolve(lang);
      });
    });
  }

  function t(key) {
    return T[lang]?.[key] ?? T["el"]?.[key] ?? key;
  }

  async function setLang(newLang) {
    if (newLang !== "el" && newLang !== "en") return;
    lang = newLang;
    return new Promise((resolve) => {
      chrome.storage.local.get("profile", (data) => {
        const profile = { ...(data.profile || {}), language: newLang };
        chrome.storage.local.set({ profile }, resolve);
      });
    });
  }

  function getLang() { return lang; }

  return { init, t, setLang, getLang };
})();
