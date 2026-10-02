/* =====================================================================
   topics.js – Register ALLER Spicker
   ---------------------------------------------------------------------
   Eine Zeile pro Spicker. Daraus entstehen:
     - die Kacheln auf der Übersicht (spicker/index.html)
     - das Auswahl-Menü neben dem Logo auf jeder Liste

   NEUEN SPICKER ANLEGEN:
     1. einen vorhandenen Ordner kopieren (z. B. mathe/ → physik/)
     2. in der Kopie: theme.css (Farbe), entries.js (Einträge, und dort
        den Namen in window.SpickerData["…"] anpassen) und in index.html
        data-topic="…" ändern
     3. hier eine Zeile ergänzen

   Felder:
     id        kurzer Name, gleich wie data-topic in <ordner>/index.html
               und wie window.SpickerData["…"] in <ordner>/entries.js.
               Steht auch vor jeder Bewertung: "coding/cpp-vector.html"
               → NACHTRÄGLICH NICHT ÄNDERN, sonst passen alte
               Bewertungen nicht mehr.
     title     Name auf Kachel und im Menü
     subtitle  kurze Beschreibung darunter
     folder    Ordnername unter spicker/
     accent    Akzentfarbe (Kachel-Rand). Sollte zu --accent in
               <ordner>/theme.css passen.
     icon      Datei in shared/icons/
   ===================================================================== */

const SPICKER_TOPICS = [
  {
    id: "coding",
    title: "Coding",
    subtitle: "HTML, CSS, JavaScript, C++ und mehr",
    folder: "coding",
    accent: "#4f8cff",
    icon: "S logo.ico"
  },
  {
    id: "mathe",
    title: "Mathe",
    subtitle: "Algebra, Geometrie, Analysis, Stochastik",
    folder: "mathe",
    accent: "#f0a040",
    icon: "S logo.ico"
  },
  {
    id: "trading",
    title: "Trading",
    subtitle: "Börse, ETFs, CFDs, Charts, Risiko",
    folder: "trading",
    accent: "#3fb950",
    icon: "S logo.ico"
  },
  {
    id: "wirtschaft",
    title: "Wirtschaft",
    subtitle: "BWL, Buchhaltung, Steuern, Recht",
    folder: "wirtschaft",
    accent: "#a371f7",
    icon: "S logo.ico"
  }
];

console.log("[hub] topics.js geladen:", SPICKER_TOPICS.map(topic => topic.id).join(", "));
