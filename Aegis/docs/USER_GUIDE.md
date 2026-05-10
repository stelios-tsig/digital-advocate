# 📖 Οδηγός Χρήσης / User Guide

**[🇬🇷 Ελληνικά](#-ελληνικά) · [🇬🇧 English](#-english)**

---

## 🇬🇷 Ελληνικά

### Εγκατάσταση

1. **Κατέβασε τα αρχεία** — κατέβασε το ZIP από το GitHub και εξάγαγέ το
2. **Άνοιξε Chrome** — πήγαινε στη διεύθυνση `chrome://extensions/`
3. **Developer mode** — ενεργοποίησε το toggle πάνω δεξιά
4. **Load unpacked** — κλικ στο κουμπί και επίλεξε τον φάκελο
5. **Έτοιμο!** — το εικονίδιο 🛡 εμφανίζεται στη γραμμή εργαλείων

---

### Το Popup — 3 καρτέλες

Κλικ στο 🛡 για να ανοίξεις το popup.

#### 📊 Dashboard

Η πρώτη καρτέλα που βλέπεις. Εμφανίζει:

- **4 counters** — Trackers, Cookies, Ads, Consent που έχουν μπλοκαριστεί
- **Κατάσταση σελίδας** — αν η τρέχουσα σελίδα είναι 🛡 Προστατευμένη ή ⊘ Εξαιρεμένη
- **Λίστα trackers** — ποιοι trackers εντοπίστηκαν σε αυτή τη σελίδα
- **Γράφημα 7 ημερών** — ιστορικό trackers της εβδομάδας

#### ✉️ Aliases

- Πάτα **＋ Νέο alias** για να δημιουργήσεις alias για τον τρέχοντα domain
- Κάθε alias έχει μορφή: `swift-oak-a3f2@advocate.privacy`
- **⎘ Αντιγραφή** — αντιγράφει το alias στο clipboard
- **⏸ Παύση** — απενεργοποιεί το alias χωρίς να το διαγράψει
- **✕ Διαγραφή** — αφαιρεί το alias οριστικά

#### ⚙️ Ρυθμίσεις

| Ρύθμιση | Περιγραφή |
|---------|-----------|
| 🇬🇷 / 🇬🇧 Γλώσσα | Εναλλαγή μεταξύ Ελληνικών και Αγγλικών |
| ⊘ Εξαίρεση σελίδας | Απενεργοποίηση προστασίας για τον τρέχοντα domain |
| Auto-reject cookies | Αυτόματη απόρριψη cookie banners |
| Tracker detection | Εντοπισμός trackers & ads |
| Consent Manager | Υποστήριξη 6 consent platforms |
| Floating badge | Εικονίδιο 🛡 στη σελίδα |
| HTTPS Upgrade | Αναγκαστικό HTTPS |
| Referrer Policy | Σταματάει URL leaks |
| DNT & GPC | Do Not Track + Global Privacy Control |
| WebRTC Protection | Αποφυγή IP leak |

---

### Email Aliases — Τι είναι και γιατί

Αντί να δίνεις την πραγματική σου email σε κάθε site, δίνεις ένα **alias** — μια ψεύτικη διεύθυνση που έχεις δημιουργήσει εσύ.

**Πλεονεκτήματα:**
- Αν ένα site σε στείλει spam → διαγράφεις το alias, η πραγματική σου email παραμένει ανέπαφη
- Αν πουλήσουν τα στοιχεία σου → ξέρεις ακριβώς ποιο site το έκανε
- Δεν χρειάζεσαι ξεχωριστό email account για κάθε εγγραφή

**Πώς:**

1. Πήγαινε στο site που θέλεις να εγγραφείς
2. Άνοιξε το popup → ✉️ Aliases
3. Πάτα «＋ Νέο alias»
4. Αντίγραψε το alias και χρησιμοποίησέ το στη φόρμα εγγραφής

---

### Εξαίρεση σελίδων

Μερικά sites μπορεί να μην λειτουργούν σωστά με την προστασία ενεργή (π.χ. internet banking, εταιρικά intranets).

**Πώς να εξαιρέσεις μια σελίδα:**

1. Βρίσκεσαι στη σελίδα που θέλεις να εξαιρέσεις
2. Κλικ στο 🛡 icon → ⚙️ Ρυθμίσεις
3. Πάτα **«⊘ Εξαίρεση αυτής της σελίδας»**

Η προστασία απενεργοποιείται **μόνο** για αυτόν τον domain — παντού αλλού παραμένει ενεργή.

Για να την επαναφέρεις, επαναλάβε τα ίδια βήματα και πάτα **«🛡 Ενεργοποίηση προστασίας»**.

---

### Floating Badge 🛡

Ένα μικρό εικονίδιο εμφανίζεται κάτω δεξιά σε κάθε σελίδα (αν είναι ενεργό στις Ρυθμίσεις).

- Κλικ για να δεις τα στατιστικά της τρέχουσας σελίδας
- Είναι ελαφρύ — δεν επηρεάζει την ταχύτητα φόρτωσης
- Μπορείς να το απενεργοποιήσεις από τις ⚙️ Ρυθμίσεις

---

### Backup & Restore Aliases

**Εξαγωγή (backup):**
1. ⚙️ Ρυθμίσεις → «📥 Εξαγωγή aliases»
2. Αποθηκεύεται αρχείο `.json` στον υπολογιστή σου

**Εισαγωγή (restore):**
1. ⚙️ Ρυθμίσεις → «📤 Εισαγωγή aliases»
2. Επικόλλησε το περιεχόμενο του `.json` αρχείου
3. Πάτα «✓ Εισαγωγή»

---

## 🇬🇧 English

### Installation

1. **Download the files** — download the ZIP from GitHub and extract it
2. **Open Chrome** — navigate to `chrome://extensions/`
3. **Developer mode** — enable the toggle in the top right
4. **Load unpacked** — click the button and select the folder
5. **Done!** — the 🛡 icon appears in your toolbar

---

### The Popup — 3 tabs

Click 🛡 to open the popup.

#### 📊 Dashboard

The first tab you see. Shows:

- **4 counters** — Trackers, Cookies, Ads, Consent blocked
- **Site status** — whether the current page is 🛡 Protected or ⊘ Excluded
- **Tracker list** — which trackers were detected on this page
- **7-day chart** — weekly tracker history

#### ✉️ Aliases

- Click **＋ New alias** to create an alias for the current domain
- Each alias looks like: `swift-oak-a3f2@advocate.privacy`
- **⎘ Copy** — copies the alias to clipboard
- **⏸ Pause** — disables the alias without deleting it
- **✕ Delete** — permanently removes the alias

#### ⚙️ Settings

| Setting | Description |
|---------|-------------|
| 🇬🇷 / 🇬🇧 Language | Switch between Greek and English |
| ⊘ Site exception | Disable protection for the current domain |
| Auto-reject cookies | Automatically reject cookie banners |
| Tracker detection | Detect trackers & ads |
| Consent Manager | Support for 6 consent platforms |
| Floating badge | 🛡 icon on every page |
| HTTPS Upgrade | Force HTTPS where available |
| Referrer Policy | Stop URL leaks |
| DNT & GPC | Do Not Track + Global Privacy Control |
| WebRTC Protection | Prevent IP leak via WebRTC |

---

### Email Aliases — What and Why

Instead of giving your real email to every site, you give an **alias** — a disposable address you created.

**Benefits:**
- If a site spams you → delete the alias, your real email stays untouched
- If they sell your data → you know exactly which site did it
- No need for a separate email account for every signup

**How:**

1. Go to the site you want to sign up for
2. Open the popup → ✉️ Aliases
3. Click «＋ New alias»
4. Copy the alias and use it in the signup form

---

### Site Exceptions

Some sites may not work correctly with protection enabled (e.g., internet banking, corporate intranets).

**How to exclude a site:**

1. Go to the site you want to exclude
2. Click 🛡 icon → ⚙️ Settings
3. Click **«⊘ Exclude this site»**

Protection is disabled **only** for that domain — everywhere else it remains active.

To re-enable it, repeat the same steps and click **«🛡 Enable protection»**.

---

### Floating Badge 🛡

A small icon appears in the bottom right of every page (if enabled in Settings).

- Click to see statistics for the current page
- Lightweight — does not affect page load speed
- Can be disabled from ⚙️ Settings

---

### Backup & Restore Aliases

**Export (backup):**
1. ⚙️ Settings → «📥 Export aliases»
2. A `.json` file is saved to your computer

**Import (restore):**
1. ⚙️ Settings → «📤 Import aliases»
2. Paste the contents of the `.json` file
3. Click «✓ Import»

---

<div align="center">

**🛡️ Digital Advocate v6.0.0**

*"Δεν είσαι το προϊόν. Είσαι ο ιδιοκτήτης." / "You're not the product. You're the owner."*

</div>
