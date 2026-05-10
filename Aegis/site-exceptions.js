// ============================================================
//  Digital Advocate v6 — site-exceptions.js
//  Per-domain exception management. Popup only.
// ============================================================

const SiteExceptions = (() => {

  function send(msg) {
    return new Promise((resolve) => {
      chrome.storage.local.get("exceptions", (data) => {
        resolve(data.exceptions || []);
      });
    });
  }

  async function getAll() {
    return new Promise((resolve) => {
      chrome.storage.local.get("exceptions", (data) => {
        resolve(data.exceptions || []);
      });
    });
  }

  async function save(list) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ exceptions: list }, resolve);
    });
  }

  function clean(domain) {
    return domain.replace(/^www\./, "");
  }

  async function isExcluded(domain) {
    const list = await getAll();
    const d    = clean(domain);
    return list.some((e) => e.domain === d);
  }

  async function add(domain) {
    const list = await getAll();
    const d    = clean(domain);
    if (list.some((e) => e.domain === d)) return false;
    list.unshift({ domain: d, addedAt: new Date().toISOString() });
    await save(list);
    return true;
  }

  async function remove(domain) {
    const list    = await getAll();
    const d       = clean(domain);
    const updated = list.filter((e) => e.domain !== d);
    await save(updated);
  }

  async function toggle(domain) {
    const excluded = await isExcluded(domain);
    if (excluded) { await remove(domain); return false; }
    else          { await add(domain);    return true;  }
  }

  return { getAll, isExcluded, add, remove, toggle };
})();
