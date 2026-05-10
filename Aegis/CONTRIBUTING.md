# 🤝 Οδηγός Συνεισφοράς / Contributing Guide

**[🇬🇷 Ελληνικά](#-ελληνικά) · [🇬🇧 English](#-english)**

---

## 🇬🇷 Ελληνικά

Ευχαριστούμε που ενδιαφέρεσαι να συνεισφέρεις στον **Ψηφιακό Συνήγορο**!
Κάθε συνεισφορά — από διόρθωση τυπογραφικών λαθών μέχρι νέα features — είναι ευπρόσδεκτη.

### Πώς να ξεκινήσεις

```bash
# 1. Fork το repository
# 2. Clone το fork σου
git clone https://github.com/YOURUSERNAME/digital-advocate.git
cd digital-advocate

# 3. Δημιούργησε νέο branch
git checkout -b feature/το-feature-σου

# 4. Κάνε τις αλλαγές σου

# 5. Test σε Chrome
# chrome://extensions/ → Load unpacked → Επίλεξε τον φάκελο

# 6. Commit
git add .
git commit -m "feat: περιγραφή"

# 7. Push και Pull Request
git push origin feature/το-feature-σου
```

### Κανόνες κώδικα

- **Vanilla JavaScript** — χωρίς frameworks
- **Zero inline onclick** — event delegation παντού
- **Pure async/await** — χωρίς `.then()` εκτός αν είναι απολύτως απαραίτητο
- **Zero console.log** στον τελικό κώδικα
- Κάθε content script **ελέγχει πρώτα** profile και exceptions
- Μόνο το `storage.js` αγγίζει `chrome.storage` απευθείας

### Commit Messages

Ακολούθησε το [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: προσθήκη νέου feature
fix: διόρθωση bug
docs: αλλαγές τεκμηρίωσης
refactor: αναδόμηση χωρίς αλλαγή λειτουργικότητας
chore: ενημέρωση dependencies κλπ
```

### Areas για contribution

- 📋 Νέα tracker patterns στο `content.js`
- 🍪 Νέες consent platforms στο `consent-manager.js`
- 🌍 Νέες γλώσσες στο `i18n.js`
- 🦊 Firefox compatibility
- 🐛 Bug fixes και βελτιώσεις performance

### Αναφορά Bugs

Άνοιξε ένα [Issue](https://github.com/yourusername/digital-advocate/issues) με:
- Τι συνέβη
- Τι περίμενες να συμβεί
- Chrome version & OS

---

## 🇬🇧 English

Thank you for your interest in contributing to **Digital Advocate**!
Every contribution — from typo fixes to new features — is welcome.

### Getting Started

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/YOURUSERNAME/digital-advocate.git
cd digital-advocate

# 3. Create a new branch
git checkout -b feature/your-feature

# 4. Make your changes

# 5. Test in Chrome
# chrome://extensions/ → Load unpacked → Select the folder

# 6. Commit
git add .
git commit -m "feat: description"

# 7. Push and open Pull Request
git push origin feature/your-feature
```

### Code Rules

- **Vanilla JavaScript** — no frameworks
- **Zero inline onclick** — event delegation everywhere
- **Pure async/await** — no `.then()` unless absolutely necessary
- **Zero console.log** in final code
- Every content script **checks profile and exceptions first**
- Only `storage.js` touches `chrome.storage` directly

### Commit Messages

Follow the [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: add new feature
fix: fix a bug
docs: documentation changes
refactor: restructure without changing functionality
chore: update dependencies etc.
```

### Areas for Contribution

- 📋 New tracker patterns in `content.js`
- 🍪 New consent platforms in `consent-manager.js`
- 🌍 New languages in `i18n.js`
- 🦊 Firefox compatibility
- 🐛 Bug fixes and performance improvements

### Reporting Bugs

Open an [Issue](https://github.com/yourusername/digital-advocate/issues) with:
- What happened
- What you expected to happen
- Chrome version & OS

---

<div align="center">

**🛡️ Digital Advocate — "Δεν είσαι το προϊόν. Είσαι ο ιδιοκτήτης."**

</div>
