/* =====================================================================
   links.js – Smart-Link-Daten für den Mathe-Spicker
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
  { words: ["Variable", "Variablen", "Term", "Terme", "Gleichung", "Gleichungen", "Unbekannte", "Parameter"], links: { all: "variablen-terme.html" } },
  { words: ["Funktion", "Funktionen", "Wertetabelle", "Graph", "Graphen", "Definitionsbereich", "Wertebereich", "Nullstelle"], links: { all: "funktion.html" } },
  { words: ["lineare Funktion", "lineare Funktionen", "Steigung", "y-Achsenabschnitt", "Steigungsdreieck"], links: { all: "lineare-funktion.html" } },
  { words: ["Pythagoras", "Hypotenuse", "Kathete", "Katheten", "rechtwinkligen Dreieck", "rechtwinkliges Dreieck"], links: { all: "pythagoras.html" } }
];

console.log("[smart-link] mathe/links.js geladen:", smartLinkRules.length, "Wort-Regeln");
