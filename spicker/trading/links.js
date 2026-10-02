/* =====================================================================
   links.js – Smart-Link-Daten für den Trading-Spicker
   ---------------------------------------------------------------------
   Gleicher Aufbau wie coding/links.js, nur einfacher: Dieser Spicker hat
   keine "Sprachen", deshalb gilt jede Regel überall ("all").
   NEUES WORT? → eine Zeile { words: [...], links: { all: "seite.html" } }
   (nur auf Seiten verlinken, die es schon gibt!)
   ===================================================================== */

const PAGE_LANGUAGES = {};            // keine Sonderfälle
const DEFAULT_PAGE_LANGUAGE = "all";
const PAGE_PREFIX_LANGUAGES = [];       // keine Präfixe
const LANGUAGE_FALLBACK = {};
const TAG_PAGES = {};                 // keine HTML-Tags in diesem Spicker

const smartLinkRules = [
  { words: ["Aktie", "Aktien", "Aktionär", "Aktionäre", "Hauptversammlung"], links: { all: "aktie-ipo.html" } },
  { words: ["IPO", "Börsengang", "Börsengangs", "Emissionspreis", "Zeichnungsfrist", "Primärmarkt", "Sekundärmarkt"], links: { all: "aktie-ipo.html" } },
  { words: ["Kurs", "Kurse", "Kursbildung", "Angebot und Nachfrage", "Orderbuch", "Nachfrage"], links: { all: "kursbildung.html" } },
  { words: ["Kerze", "Kerzen", "Kerzenchart", "Candlestick", "Docht", "Dochte"], links: { all: "kerzenchart.html" } }
];

console.log("[smart-link] trading/links.js geladen:", smartLinkRules.length, "Wort-Regeln");
