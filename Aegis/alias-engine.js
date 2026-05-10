// ============================================================
//  Digital Advocate v6 — alias-engine.js
//  Alias generation & CRUD. Χρησιμοποιείται μόνο από popup.js
// ============================================================

const AliasEngine = (() => {

  const WORDS_A = [
    "swift","calm","bold","clear","keen","wise","bright","safe","free","pure",
    "brave","cool","deep","fair","firm","grand","happy","just","kind","light",
    "lucky","noble","open","proud","quick","quiet","ready","sharp","smart","solid",
    "strong","true","vast","warm","wild","young","zen","agile","alert","apt",
  ];
  const WORDS_B = [
    "pine","oak","river","stone","cloud","wave","dawn","peak","vale","reef",
    "bay","cove","dune","fjord","glen","hill","isle","knoll","lake","marsh",
    "mesa","moor","pass","pond","ridge","shore","spring","thicket","vista","wood",
    "brook","canyon","delta","estuary","fen","gorge","haven","inlet","jetty","kelp",
  ];

  function generate(format = "memorable") {
    const rand = Math.random().toString(36).slice(2, 6);
    if (format === "random") {
      const r1 = Math.random().toString(36).slice(2, 5);
      const r2 = Math.random().toString(36).slice(2, 5);
      return `${r1}-${r2}-${rand}@advocate.privacy`;
    }
    const wa = WORDS_A[Math.floor(Math.random() * WORDS_A.length)];
    const wb = WORDS_B[Math.floor(Math.random() * WORDS_B.length)];
    return `${wa}-${wb}-${rand}@advocate.privacy`;
  }

  // ── Messaging helpers (popup → background) ─────────────────
  function send(msg) {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(msg, resolve);
    });
  }

  async function getAll() {
    const res = await send({ type: "GET_ALIASES" });
    return res?.aliases || [];
  }

  async function getForDomain(domain) {
    const aliases = await getAll();
    const clean   = domain.replace(/^www\./, "");
    return aliases.find((a) => a.domain === clean && a.active) || null;
  }

  async function getOrCreate(domain) {
    const res = await send({ type: "GET_OR_CREATE_ALIAS", domain });
    return res;
  }

  async function createNew(domain) {
    const res = await send({ type: "GENERATE_ALIAS", domain });
    return res?.alias || null;
  }

  async function toggle(id) {
    return send({ type: "TOGGLE_ALIAS", id });
  }

  async function remove(id) {
    return send({ type: "DELETE_ALIAS", id });
  }

  async function exportAll() {
    const res = await send({ type: "EXPORT_ALIASES" });
    return res?.data || null;
  }

  async function importAll(jsonString) {
    return send({ type: "IMPORT_ALIASES", data: jsonString });
  }

  return { generate, getAll, getForDomain, getOrCreate, createNew, toggle, remove, exportAll, importAll };
})();
