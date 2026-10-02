/* =====================================================================
   links.js – Smart-Link-Daten für den Wirtschaft-Spicker
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
  { words: ["Bilanz", "Aktiva", "Passiva", "Eigenkapital", "Fremdkapital", "Anlagevermögen", "Umlaufvermögen", "Eigenkapitalquote"], links: { all: "bilanz.html" } },
  { words: ["GuV", "Gewinn- und Verlustrechnung", "Jahresüberschuss", "Aufwendungen", "Erträge", "Umsatzrendite"], links: { all: "guv.html" } },
  { words: ["Break-even", "Break-even-Point", "Gewinnschwelle", "Fixkosten", "variable Kosten", "Variable Kosten", "Deckungsbeitrag"], links: { all: "break-even.html" } }
];

console.log("[smart-link] wirtschaft/links.js geladen:", smartLinkRules.length, "Wort-Regeln");
