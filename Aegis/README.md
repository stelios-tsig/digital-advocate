# 🛡️ Ψηφιακός Συνήγορος — Digital Advocate

<div align="center">

[![Version](https://img.shields.io/badge/version-6.0.0-2dba8c.svg?style=flat-square)](https://github.com/yourusername/digital-advocate)
[![License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](LICENSE)
[![Manifest](https://img.shields.io/badge/manifest-v3-yellow.svg?style=flat-square)](manifest.json)
[![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg?style=flat-square&logo=google-chrome)](https://chrome.google.com/webstore)

**[🇬🇷 Ελληνικά](#-ελληνικά) · [🇬🇧 English](#-english)**

> *"Δεν είσαι το προϊόν. Είσαι ο ιδιοκτήτης."*
> *"You're not the product. You're the owner."*

</div>

---

## 🇬🇷 Ελληνικά

### Τι είναι

Ο **Ψηφιακός Συνήγορος** είναι ένα δωρεάν, open-source Chrome extension που προστατεύει την ιδιωτικότητά σου στο internet:

- 🚫 Μπλοκάρει **trackers, ads και cookie banners** αυτόματα
- ✉️ Δημιουργεί **email aliases** για να προστατεύσεις την πραγματική σου email
- 📊 Εμφανίζει **live στατιστικά** μέσα στο popup
- 🌐 Υποστηρίζει **Ελληνικά & English**
- ⊘ Επιτρέπει **εξαιρέσεις** ανά site

### Χαρακτηριστικά

| Feature | Περιγραφή |
|---------|-----------|
| 🚫 Ad & Tracker Blocking | 50 network-level κανόνες + 40+ tracker patterns |
| 🍪 Cookie Protection | Auto-reject σε 6 consent platforms |
| ✉️ Email Aliases | `swift-oak-a3f2@advocate.privacy` |
| 🛡️ Privacy Headers | HTTPS, Referrer, DNT/GPC, WebRTC |
| 📊 Dashboard | Mini chart 7 ημερών μέσα στο popup |
| ⊘ Site Exceptions | Εξαίρεση συγκεκριμένων sites |
| 🌐 i18n | 🇬🇷 Ελληνικά / 🇬🇧 English |

### Εγκατάσταση

```bash
# 1. Κατέβασε το ZIP και εξάγαγέ το
# 2. Άνοιξε Chrome → chrome://extensions/
# 3. Ενεργοποίησε Developer mode (πάνω δεξιά)
# 4. Load unpacked → Επίλεξε τον φάκελο
```

### Χρήση

Κλικ στο 🛡 icon → Popup με 3 καρτέλες:

- **📊 Dashboard** — Stats τρέχουσας σελίδας + γράφημα 7 ημερών
- **✉️ Aliases** — Δημιουργία & διαχείριση email aliases
- **⚙️ Ρυθμίσεις** — Γλώσσα, εξαιρέσεις, 8 feature toggles

Για λεπτομερείς οδηγίες δες το [📖 User Guide](docs/USER_GUIDE.md).

### Δομή αρχείων

```
digital-advocate/
├── manifest.json        # Chrome MV3
├── background.js        # Service Worker
├── storage.js           # Κεντρικό storage API
├── content.js           # Tracker detection + ad hiding
├── consent-manager.js   # 6 consent platforms
├── privacy-headers.js   # HTTPS/Referrer/DNT/WebRTC
├── floating-badge.js    # 🛡 Live stats badge
├── site-exceptions.js   # Per-domain exceptions
├── alias-engine.js      # Email alias generation
├── i18n.js              # EL/EN translations
├── popup.html / popup.js
├── rules.json           # 50 blocking rules
├── chart.min.js         # Chart.js (local, CSP-compliant)
└── docs/
    └── USER_GUIDE.md
```

---

## 🇬🇧 English

### What is it

**Digital Advocate** is a free, open-source Chrome extension that protects your privacy online:

- 🚫 Blocks **trackers, ads and cookie banners** automatically
- ✉️ Creates **email aliases** to protect your real email
- 📊 Shows **live statistics** inside the popup
- 🌐 Supports **Greek & English**
- ⊘ Allows **per-site exceptions**

### Features

| Feature | Description |
|---------|-------------|
| 🚫 Ad & Tracker Blocking | 50 network-level rules + 40+ tracker patterns |
| 🍪 Cookie Protection | Auto-reject on 6 consent platforms |
| ✉️ Email Aliases | `swift-oak-a3f2@advocate.privacy` |
| 🛡️ Privacy Headers | HTTPS, Referrer, DNT/GPC, WebRTC |
| 📊 Dashboard | 7-day mini chart inside the popup |
| ⊘ Site Exceptions | Exclude specific sites from protection |
| 🌐 i18n | 🇬🇷 Greek / 🇬🇧 English |

### Installation

```bash
# 1. Download the ZIP and extract it
# 2. Open Chrome → chrome://extensions/
# 3. Enable Developer mode (top right)
# 4. Load unpacked → Select the folder
```

### Usage

Click the 🛡 icon → Popup with 3 tabs:

- **📊 Dashboard** — Current page stats + 7-day chart
- **✉️ Aliases** — Create & manage email aliases
- **⚙️ Settings** — Language, exceptions, 8 feature toggles

For detailed instructions see the [📖 User Guide](docs/USER_GUIDE.md).

### File Structure

```
digital-advocate/
├── manifest.json        # Chrome MV3
├── background.js        # Service Worker
├── storage.js           # Central storage API
├── content.js           # Tracker detection + ad hiding
├── consent-manager.js   # 6 consent platforms
├── privacy-headers.js   # HTTPS/Referrer/DNT/WebRTC
├── floating-badge.js    # 🛡 Live stats badge
├── site-exceptions.js   # Per-domain exceptions
├── alias-engine.js      # Email alias generation
├── i18n.js              # EL/EN translations
├── popup.html / popup.js
├── rules.json           # 50 blocking rules
├── chart.min.js         # Chart.js (local, CSP-compliant)
└── docs/
    └── USER_GUIDE.md
```

---

## 🤝 Contributing

Δες το [CONTRIBUTING.md](CONTRIBUTING.md) για οδηγίες συνεισφοράς.
See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

MIT — δες το [LICENSE](LICENSE) για λεπτομέρειες.
MIT — see [LICENSE](LICENSE) for details.

---

<div align="center">

**🛡️ Digital Advocate v6.0.0**

*"Δεν είσαι το προϊόν. Είσαι ο ιδιοκτήτης."*

</div>
