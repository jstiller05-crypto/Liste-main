/* =====================================================================
   links.js – Smart-Link-Daten für den Coding-Spicker
   ---------------------------------------------------------------------
   Nur DATEN, keine Logik. Die Logik steckt in shared/page.js und ist
   für alle Spicker gleich. Jede Detailseite in coding/more/ lädt:
       <script defer src="../links.js"></script>
       <script defer src="../../shared/page.js"></script>
   ("defer" = nach dem HTML ausführen, in genau dieser Reihenfolge –
   page.js findet die Werte hier also schon vor.)

   Ein Spicker OHNE links.js (z. B. mathe) hat einfach keine Smart-Links;
   page.js prüft das und meldet es in der Konsole.

   WARUM "const" OHNE window.?
     Variablen, die in einem normalen <script> ganz oben mit const/let
     angelegt werden, sind für ALLE anderen <script>-Dateien derselben
     Seite sichtbar. page.js kann PAGE_LANGUAGES usw. also direkt benutzen.

   Inhalt:
   1a) Sprache der Seiten   PAGE_LANGUAGES, PAGE_PREFIX_LANGUAGES, …
   1b) Wörter → Links       smartLinkRules
   1c) HTML-Tags im Text    TAG_PAGES
   ===================================================================== */

// ---------------------------------------------------------------------
// 1a) SPRACHE DER SEITEN
// ---------------------------------------------------------------------
// Jede Seite gehört zu einer Sprache. Davon hängt ab, wohin ein Wort
// verlinkt: "Schleife" auf einer C++-Seite → C++-Erklärung,
//           "Schleife" auf einer JS-Seite  → JS-Erklärung.
//
// Sprach-Kürzel:  "html"  "css"  "js"  "cpp"
//
// Die Sprache wird in dieser Reihenfolge bestimmt:
//   1. <html lang="de" data-lang="cpp">  im HTML der Seite (falls gesetzt)
//   2. diese Liste hier (Dateiname → Sprache, klein geschrieben)
//   3. Dateiname beginnt mit "css-", "js-", "cpp-", "node-", "sql-", "php-",
//      "lua-", "c-", "csharp-", "swift-", "ts-"
//   4. sonst DEFAULT_PAGE_LANGUAGE
//
// NEUE SEITE? → hier eintragen ODER im <html>-Tag data-lang="..." setzen.
const PAGE_LANGUAGES = {
  // --- C++ ---
  "cpp-sprache.html":     "cpp",
  "cpp-main.html":        "cpp",
  "cpp-class.html":       "cpp",
  "cin.html":             "cpp",
  "cout.html":            "cpp",
  "include.html":         "cpp",
  "using-namespace.html": "cpp",
  "datatypes.html":       "cpp",
  "variable.html":        "cpp",
  "for-loop.html":        "cpp",
  "while-loop.html":      "cpp",
  "if-else.html":         "cpp",
  "function.html":        "cpp",
  "pointer.html":         "cpp",
  "reference.html":       "cpp",

  // --- CSS ---
  "css-sprache.html":     "css",
  "css-selektoren.html":  "css",
  "class.html":           "css",

  // --- JavaScript ---
  "javascript-sprache.html": "js",
  "js-klammern.html":        "js",

  // --- HTML ---
  "html-sprache.html":    "html",

  // --- Swift-Seiten ohne "swift-"-Präfix ---
  "swiftui.html":         "swift",
  "xcode.html":           "swift"
  // alle anderen Seiten (die HTML-Tags) → DEFAULT_PAGE_LANGUAGE
};

const DEFAULT_PAGE_LANGUAGE = "html";

// Dateiname beginnt mit … → Sprache (siehe Punkt 3 oben).
// Es gewinnt der ERSTE passende Eintrag. Lange, speziellere Präfixe
// ("csharp-", "cpp-") stehen darum vor kurzen ("c-") – so kann beim
// Ergänzen neuer Präfixe nichts durcheinandergeraten.
// (Array aus Paaren statt Objekt, weil die Reihenfolge zählt.)
const PAGE_PREFIX_LANGUAGES = [
  ["css-", "css"],
  ["js-", "js"],
  ["cpp-", "cpp"],
  ["node-", "node"],
  ["sql-", "sql"],
  ["php-", "php"],
  ["lua-", "lua"],
  ["csharp-", "csharp"],
  ["swift-", "swift"],
  ["c-", "c"],
  ["ts-", "ts"]
];

// Hat eine Regel für eine Sprache kein eigenes Ziel, wird diese Sprache probiert.
// Node.js IST JavaScript – dort sollen also die JS-Seiten verlinkt werden.
const LANGUAGE_FALLBACK = {
  node: "js",
  c: "cpp",         // C-Grundlagen (Schleifen, if, Zeiger …) sind wie in C++
  ts: "js"          // TypeScript IST JavaScript mit Typen → sonst die JS-Seiten
};


// ---------------------------------------------------------------------
// 1b) WÖRTER → LINKS
// ---------------------------------------------------------------------
// Jede Regel hat:
//   words: Liste der Schreibweisen (Groß-/Kleinschreibung egal)
//   links: Ziel-Seite JE SPRACHE
//            html / css / js / cpp  → nur auf Seiten dieser Sprache
//            all                    → auf allen übrigen Seiten
//          Fehlt die Sprache (und "all"), wird NICHT verlinkt.
//          Lieber gar kein Link als ein Link zur falschen Sprache!
//
// "#grundlagen" hinter dem Dateinamen = springt direkt zu dem
// Abschnitt mit id="grundlagen" auf der Seite.
//
// NEUES WORT? → einfach eine neue Regel { words: [...], links: {...} }
// (Die Reihenfolge ist egal – längere Wörter werden automatisch zuerst
//  gesucht, damit "for-Schleife" nicht als "Schleife" erkannt wird.)
const smartLinkRules = [
  // ===== Sprachen (überall gleich) =====
  { words: ["HTML"],             links: { all: "html-sprache.html" } },
  { words: ["CSS"],              links: { all: "css-sprache.html" } },
  { words: ["JavaScript", "JS"], links: { all: "javascript-sprache.html" } },
  { words: ["C++"],              links: { all: "cpp-sprache.html" } },
  { words: ["Node.js", "Node"],  links: { all: "node-einfuehrung.html" } },
  { words: ["npm"],              links: { all: "node-npm.html" } },
  { words: ["SQL", "MySQL", "SQLite", "MariaDB", "PostgreSQL"], links: { all: "sql-einfuehrung.html" } },
  { words: ["PHP"],              links: { all: "php-einfuehrung.html" } },
  { words: ["Lua", "LuaJIT"],    links: { all: "lua-einfuehrung.html" } },
  { words: ["C#", ".NET"],       links: { all: "csharp-einfuehrung.html" } },
  { words: ["Swift"],            links: { all: "swift-einfuehrung.html" } },
  { words: ["TypeScript", "TS"], links: { all: "ts-einfuehrung.html" } },
  { words: ["tsconfig", "tsconfig.json", "tsc"], links: { all: "ts-projekt.html" } },
  { words: ["SwiftUI"],          links: { all: "swiftui.html" } },
  { words: ["Xcode"],            links: { all: "xcode.html" } },
  { words: ["Luanti", "Mod", "Mods"], links: { all: "lua-luanti.html" } },
  { words: ["Terminal", "Kommandozeile", "PowerShell", "Bash", "WSL"], links: { all: "terminal.html" } },

  // ===== Lua / C / C# / Swift =====
  { words: ["Metatabelle", "Metatabellen", "require"],    links: { lua: "lua-module.html" } },
  { words: ["pcall", "Pattern", "Patterns"],              links: { lua: "lua-module.html" } },
  { words: ["printf", "scanf", "Platzhalter"],            links: { c: "c-ein-ausgabe.html" } },
  { words: ["malloc", "free", "calloc", "realloc", "Speicherleck"], links: { c: "c-speicher.html" } },
  { words: ["Zeiger", "Pointer"],                         links: { c: "c-zeiger.html" } },
  { words: ["struct", "typedef", "enum"],                 links: { c: "c-structs.html", csharp: "csharp-klassen.html", swift: "swift-typen.html" } },
  { words: ["Makro", "Makros", "#define", "Header-Datei", "Header-Dateien"], links: { c: "c-praeprozessor.html" } },
  { words: ["LINQ", "List", "Dictionary"],                links: { csharp: "csharp-collections.html" } },
  { words: ["Property", "Properties", "Interface", "Interfaces", "record"], links: { csharp: "csharp-klassen.html" } },
  { words: ["Optional", "Optionals", "nil"],              links: { swift: "swift-optionals.html" } },
  { words: ["Closure", "Closures"],                       links: { swift: "swift-kontrolle.html", lua: "lua-funktionen.html" } },
  { words: ["Protocol", "Protocols"],                     links: { swift: "swift-typen.html" } },

  // ===== Server, Datenbank & Web-Backend =====
  { words: ["Datenbank", "Datenbanken"],
    links: { all: "sql-einfuehrung.html", node: "node-datenbank.html", php: "php-datenbank.html" } },
  { words: ["SQL-Injection", "Prepared Statement", "Prepared Statements", "Platzhalter"],
    links: { sql: "sql-sicherheit.html", node: "sql-sicherheit.html", php: "sql-sicherheit.html" } },
  { words: ["Server", "Webserver"],
    links: { node: "node-http.html", php: "php-einfuehrung.html", js: "node-http.html" } },
  { words: ["Express"],          links: { node: "node-express.html", js: "node-express.html" } },
  { words: ["API", "REST-API", "APIs"], links: { node: "node-express.html" } },
  { words: [".env", "Umgebungsvariable", "Umgebungsvariablen"], links: { node: "node-process.html", php: "node-process.html" } },
  { words: ["package.json"],     links: { node: "node-npm.html", js: "node-npm.html" } },
  { words: ["fs"],               links: { node: "node-dateien.html" } },
  { words: ["SELECT", "WHERE", "ORDER BY"], links: { sql: "sql-select.html", node: "sql-select.html", php: "sql-select.html" } },
  { words: ["INSERT", "UPDATE", "DELETE"],  links: { sql: "sql-daten-aendern.html" } },
  { words: ["JOIN", "Fremdschlüssel"],      links: { sql: "sql-joins.html", node: "sql-joins.html", php: "sql-joins.html" } },
  { words: ["GROUP BY", "COUNT", "Aggregatfunktion", "Aggregatfunktionen"], links: { sql: "sql-aggregat.html" } },
  { words: ["Primärschlüssel", "CREATE TABLE", "Datentyp", "Datentypen"], links: { sql: "sql-tabellen.html" } },
  { words: ["Session", "Sessions", "Cookie", "Cookies"], links: { php: "php-sessions.html" } },
  { words: ["PDO"],              links: { php: "php-datenbank.html" } },
  { words: ["$_GET", "$_POST", "htmlspecialchars"], links: { php: "php-formulare.html" } },
  { words: ["include", "require"], links: { php: "php-funktionen.html" } },

  // ===== Programmier-Grundlagen (je Sprache verschieden!) =====
  { words: ["for-Schleife", "for-Schleifen"],
    links: { cpp: "for-loop.html",   js: "js-schleifen.html" } },
  { words: ["while-Schleife", "while-Schleifen"],
    links: { cpp: "while-loop.html", js: "js-schleifen.html" } },
  { words: ["Schleife", "Schleifen"],
    links: { cpp: "for-loop.html",   js: "js-schleifen.html", php: "php-kontrolle.html" , lua: "lua-kontrolle.html", csharp: "csharp-kontrolle.html", swift: "swift-kontrolle.html" } },
  { words: ["Funktion", "Funktionen"],
    links: { cpp: "function.html",   js: "js-funktionen.html", php: "php-funktionen.html" , lua: "lua-funktionen.html", csharp: "csharp-kontrolle.html", swift: "swift-kontrolle.html" } },
  { words: ["Variable", "Variablen"],
    links: { cpp: "variable.html",   js: "js-variablen.html", css: "css-variablen.html", php: "php-grundlagen.html" , lua: "lua-grundlagen.html", csharp: "csharp-grundlagen.html", swift: "swift-grundlagen.html" } },
  { words: ["if-else", "Bedingung", "Bedingungen"],
    links: { cpp: "if-else.html",    js: "js-bedingungen.html", php: "php-kontrolle.html" , lua: "lua-kontrolle.html", csharp: "csharp-kontrolle.html", swift: "swift-kontrolle.html" } },
  { words: ["Datentyp", "Datentypen"],
    links: { cpp: "datatypes.html",  js: "js-variablen.html" } },

  // ===== Nur C++ =====
  { words: ["Zeiger", "Pointer"],                         links: { cpp: "pointer.html" } },
  { words: ["Referenz", "Referenzen"],                    links: { cpp: "reference.html" , c: "" } },
  { words: ["Objekt", "Objekte", "Methode", "Methoden",
            "OOP", "objektorientiert", "objektorientierte"],
                                                          links: { cpp: "cpp-class.html", js: "js-objekte.html", php: "php-oop.html" , lua: "lua-module.html", csharp: "csharp-klassen.html", swift: "swift-typen.html" , c: "" } },
  { words: ["Konstruktor", "Destruktor", "Kapselung", "private", "public"],
                                                          links: { cpp: "cpp-konstruktor.html" , c: "" } },
  { words: ["Namespace", "Namespaces", "using namespace"], links: { cpp: "using-namespace.html" } },
  { words: ["#include", "Bibliothek", "Bibliotheken",
            "Header-Datei", "Header-Dateien"],            links: { cpp: "include.html" } },
  { words: ["Header-Datei", "Header-Dateien", "Headerdatei", "Include Guard", "#pragma once"],
                                                          links: { cpp: "cpp-header.html" } },
  { words: ["Vererbung", "Polymorphie", "virtual", "override", "Basisklasse"],
                                                          links: { cpp: "cpp-vererbung.html" , c: "" } },
  { words: ["Vector", "Vectors", "std::vector"],          links: { cpp: "cpp-vector.html" } },
  { words: ["std::string"],                               links: { cpp: "cpp-string.html" } },
  { words: ["std::map", "Map", "std::set"],               links: { cpp: "cpp-map.html" } },
  { words: ["Lambda", "Lambdas", "Algorithmus", "Algorithmen"], links: { cpp: "cpp-algorithmen.html" } },
  { words: ["struct", "enum", "enum class"],              links: { cpp: "cpp-struct-enum.html" } },
  { words: ["switch", "do-while", "break", "continue"],   links: { cpp: "cpp-kontrolle.html" } },
  { words: ["const", "constexpr", "auto"],                links: { cpp: "cpp-const-auto.html" } },
  { words: ["Smart Pointer", "unique_ptr", "shared_ptr", "Heap", "Stack", "Speicherleck", "new", "delete"],
                                                          links: { cpp: "cpp-speicher.html" } },
  { words: ["Exception", "Exceptions", "Ausnahme"],       links: { cpp: "cpp-fehler.html" , c: "" } },
  { words: ["Textdatei", "Textdateien", "fstream", "ifstream", "ofstream"],               links: { cpp: "cpp-dateien.html" } },
  { words: ["Template", "Templates"],                     links: { cpp: "cpp-templates.html" } },
  { words: ["Compiler", "kompilieren", "g++", "CMake", "Linker"], links: { cpp: "cpp-kompilieren.html" , c: "c-einfuehrung.html" } },
  { words: ["main()", "main-Funktion", "Einstiegspunkt"], links: { cpp: "cpp-main.html" } },
  { words: ["cout", "std::cout", "Ausgabe"],              links: { cpp: "cout.html" } },
  { words: ["cin", "std::cin"],                           links: { cpp: "cin.html" } },

  // ===== Gleiches Wort, andere Bedeutung je Sprache =====
  // "Klasse" ist in C++ eine Objekt-Vorlage, in HTML/CSS eine CSS-Klasse
  { words: ["Klasse", "Klassen"],
    links: { cpp: "cpp-class.html", php: "php-oop.html", js: "js-klassen.html", ts: "ts-klassen-generics.html", sql: "", all: "Class.html" , lua: "lua-module.html", c: "", csharp: "csharp-klassen.html", swift: "swift-typen.html" } },   // "" = bewusst kein Link
  { words: ["CSS-Klasse", "CSS-Klassen"],
    links: { all: "Class.html" } },
  // "Eingabe" ist in C++ cin, im Web ein Eingabefeld
  { words: ["Eingabe", "Eingaben"],
    links: { cpp: "cin.html", php: "php-formulare.html", node: "", sql: "", all: "input.html" } },
  // "einbinden" ist in C++ #include, im Web <link>/<script>
  { words: ["einbinden", "eingebunden", "Einbinden"],
    links: { cpp: "include.html", php: "php-funktionen.html", sql: "", all: "link.html" } },

  // ===== Nur CSS =====
  { words: ["Farbe", "Farben", "Hintergrundfarbe", "Farbverlauf"],
                                                          links: { css: "css-farben.html" } },
  { words: ["Schriftart", "Schriftgröße", "Zeilenabstand"], links: { css: "css-text.html", html: "css-text.html" } },
  { words: ["Box-Modell", "Innenabstand", "Außenabstand", "Rahmen", "margin", "padding"],
                                                          links: { css: "css-boxmodell.html", html: "css-boxmodell.html" } },
  { words: ["Einheit", "Einheiten"],                      links: { css: "css-einheiten.html" } },
  { words: ["Media Query", "Media Queries", "responsive", "Responsive Design"],
                                                          links: { css: "css-media-queries.html", html: "css-media-queries.html" } },
  { words: ["Pseudoklasse", "Pseudoklassen", "Pseudoelement", "Pseudoelemente"],
                                                          links: { css: "css-pseudo.html", html: "css-pseudo.html" } },
  { words: ["Animation", "Animationen", "Transition", "Übergang"],
                                                          links: { css: "css-animation.html", html: "css-animation.html" } },
  { words: ["Spezifität", "Kaskade", "Vererbung"],        links: { css: "css-grundlagen.html", html: "css-grundlagen.html" } },

  // ===== Nur JavaScript =====
  { words: ["Event", "Events", "Ereignis", "Ereignisse", "addEventListener"],
                                                          links: { js: "js-events.html", html: "js-events.html" } },
  { words: ["Operator", "Operatoren"],                    links: { js: "js-operatoren.html", cpp: "cpp-operatoren.html", php: "php-grundlagen.html" , lua: "lua-grundlagen.html", csharp: "csharp-grundlagen.html", swift: "swift-grundlagen.html" } },
  { words: ["String", "Strings", "Template-String"],      links: { js: "js-strings.html", cpp: "cpp-string.html", php: "php-grundlagen.html" , lua: "lua-strings.html", c: "c-strings.html", csharp: "csharp-grundlagen.html", swift: "swift-grundlagen.html" } },
  { words: ["JSON"],                                      links: { js: "js-objekte.html", html: "js-objekte.html" } },
  { words: ["Konsole", "console.log"],                    links: { js: "js-konsole.html", html: "js-konsole.html", css: "js-konsole.html", cpp: "cout.html" , c: "c-ein-ausgabe.html", csharp: "csharp-einfuehrung.html" } },
  { words: ["try/catch", "Fehlermeldung", "try", "catch"], links: { js: "js-konsole.html", cpp: "cpp-fehler.html" } },
  { words: ["Promise", "async", "await"],                 links: { js: "js-async.html" } },
  { words: ["localStorage"],                              links: { js: "js-speicher.html", html: "js-speicher.html" } },
  { words: ["Zufallszahl", "Zufallszahlen", "Math.random"], links: { js: "js-mathe.html", cpp: "cpp-zufall.html" , lua: "lua-module.html" } },
  { words: ["Modul", "Module", "import", "export"],       links: { js: "js-module.html" } },

  // ===== Web (HTML / CSS / JS) =====
  { words: ["Element", "Elemente", "HTML-Element", "HTML-Elemente"],
    links: { html: "html-sprache.html#elemente", css: "html-sprache.html#elemente" } },   // in JS meist Array-Elemente → kein Link
  { words: ["DOM"],                                       links: { js: "js-dom.html", html: "js-dom.html", css: "js-dom.html" } },
  { words: ["Selektor", "Selektoren"],                    links: { css: "css-selektoren.html", html: "css-selektoren.html", js: "css-selektoren.html" } },
  { words: ["Überschrift", "Überschriften"],              links: { html: "headings.html", css: "headings.html", js: "headings.html" } },
  { words: ["Array", "Arrays"],                           links: { js: "js-arrays.html", cpp: "cpp-arrays.html", php: "php-arrays.html" , lua: "lua-tabellen.html", c: "c-zeiger.html", csharp: "csharp-collections.html", swift: "swift-typen.html" } },
  { words: ["Auswahlmenü", "Dropdown"],                   links: { html: "select.html", css: "select.html", js: "select.html" } },
  { words: ["Untertitel"],                                links: { html: "video.html", css: "video.html", js: "video.html" } },
  { words: ["Layout", "Layouts"],                         links: { css: "css-display.html", html: "css-display.html" } },
  { words: ["Flexbox"],                                   links: { css: "css-flexbox.html", html: "css-flexbox.html", js: "css-flexbox.html" } },
  { words: ["Grid"],                                      links: { css: "css-grid.html", html: "css-grid.html", js: "css-grid.html" } },
  { words: ["Stylesheet", "Stylesheets", "CSS-Datei", "CSS-Dateien"],
                                                          links: { html: "link.html", css: "link.html" } },
  { words: ["Tabelle", "Tabellen"],                       links: { html: "table.html", css: "table.html", js: "table.html", sql: "sql-tabellen.html", php: "sql-tabellen.html" , lua: "lua-tabellen.html" } },
  { words: ["Liste", "Listen"],                           links: { html: "liste.html", css: "liste.html", js: "liste.html" } },
  { words: ["Formular", "Formulare"],                     links: { html: "form.html", css: "form.html", js: "js-formulare.html", php: "php-formulare.html" } },
  { words: ["Container", "Containern"],                   links: { html: "container.html", css: "container.html", js: "container.html" } },
  { words: ["Bild", "Bilder"],                            links: { html: "img.html", css: "img.html", js: "img.html" } },
  { words: ["Link", "Links", "Hyperlink", "Hyperlinks"],  links: { html: "a.html", css: "a.html", js: "a.html" } },
  { words: ["Button", "Buttons", "Schaltfläche", "Schaltflächen"],
                                                          links: { html: "button.html", css: "button.html", js: "button.html" } },
  { words: ["Eingabefeld", "Eingabefelder"],              links: { html: "input.html", css: "input.html", js: "input.html" } },
  { words: ["Attribut", "Attribute", "ID-Attribut", "ID"],
                                                          links: { html: "id.html", css: "id.html", js: "id.html" } },
  // ===== Weitere JavaScript-Themen =====
  // (stehen am Ende: kommt ein Wort doppelt vor, gewinnt die spätere Regel)
  { words: ["Konstruktor", "constructor", "extends", "Vererbung", "Getter", "Setter"],
                                                          links: { js: "js-klassen.html", ts: "ts-klassen-generics.html" } },
  { words: ["Scope", "Closure", "Closures", "Hoisting", "this"], links: { js: "js-scope.html" } },
  { words: ["Map", "Set", "WeakMap"],                     links: { js: "js-map-set.html" } },
  { words: ["fetch", "API", "APIs", "REST-API", "HTTP-Anfrage"], links: { js: "js-fetch.html" } },
  { words: ["FormData", "Validierung", "preventDefault"], links: { js: "js-formulare.html" } },
  { words: ["Zwischenablage", "IntersectionObserver", "Geolocation", "Notification"],
                                                          links: { js: "js-browser-apis.html" } },
  { words: ["Debounce", "Throttle", "Debouncing"],        links: { js: "js-debounce.html" } },
  { words: ["Animation", "Animationen", "requestAnimationFrame"], links: { js: "js-animation.html" } },
  { words: ["XSS", "Sicherheit", "innerHTML"],            links: { js: "js-sicherheit.html" } },
  { words: ["Barrierefreiheit", "barrierefrei", "ARIA", "Screenreader"],
                                                          links: { js: "js-barrierefreiheit.html", html: "js-barrierefreiheit.html" } },
  { words: ["Regex", "regulärer Ausdruck", "reguläre Ausdrücke"], links: { js: "js-regex.html" } },
  { words: ["Event Loop", "Microtask", "Microtasks", "Callstack"], links: { js: "js-event-loop.html" } },
  { words: ["Intl", "toLocaleString", "Zeitzone"],        links: { js: "js-intl.html" } },
  { words: ["Generator", "Generatoren", "Iterator", "Iteratoren", "yield"], links: { js: "js-generatoren.html" } },
  { words: ["Vite", "Build-Tool", "Bundler"],             links: { all: "js-vite.html" } },
  { words: ["Vitest", "Test", "Tests", "Unit-Test", "Unit-Tests"], links: { js: "js-testen.html" } },

  // ===== Nur TypeScript =====
  { words: ["Typ", "Typen", "Union", "Union-Typ", "Union-Typen", "any", "unknown"],
                                                          links: { ts: "ts-typen.html" } },
  { words: ["Interface", "Interfaces", "Record", "Partial"], links: { ts: "ts-interfaces.html" } },
  { words: ["Generic", "Generics", "private", "public", "protected", "implements"],
                                                          links: { ts: "ts-klassen-generics.html" } },
];


// ---------------------------------------------------------------------
// 1c) HTML-TAGS IM TEXT
// ---------------------------------------------------------------------
// Steht im Text z. B. "<head>" oder "<div>", wird es automatisch auf
// die passende Tag-Seite verlinkt – egal in welcher Sprache.
// Tag-Name → Datei.  NEUE TAG-SEITE? → hier eine Zeile ergänzen.
const TAG_PAGES = {
  a: "a.html", abbr: "abbr.html", address: "address.html",
  area: "area & map.html", map: "area & map.html",
  article: "article.html", aside: "aside.html", audio: "audio.html",
  base: "base.html", bdi: "bdi.html", bdo: "bdo.html",
  b: "text-format.html", blockquote: "blockquote.html", body: "body.html", br: "br.html", wbr: "br.html", q: "blockquote.html",
  button: "button.html", canvas: "canvas.html", caption: "caption.html",
  cite: "cite.html", code: "code.html", col: "col.html", colgroup: "colgroup.html",
  data: "data.html", datalist: "datalist.html", dd: "dd.html", del: "del.html",
  details: "details.html", dfn: "dfn.html", dialog: "dialog.html",
  div: "container.html", dl: "dl.html", dt: "dt.html",
  em: "em.html", embed: "embed.html",
  fieldset: "fieldset.html", figcaption: "figcaption.html", figure: "figure.html",
  footer: "footer.html", form: "form.html", g: "svg.html",
  h1: "headings.html", h2: "headings.html", h3: "headings.html",
  h4: "headings.html", h5: "headings.html", h6: "headings.html",
  head: "head.html", header: "header.html", hr: "hr.html", html: "html.html",
  i: "i.html", iframe: "iframe.html", img: "img.html", input: "input.html", ins: "ins.html",
  kbd: "kbd.html", label: "label.html", legend: "legend.html",
  li: "liste.html", ol: "liste.html", ul: "liste.html",
  link: "link.html", main: "main.html", mark: "mark.html", menu: "menu.html",
  meta: "meta.html", meter: "meter.html", nav: "nav.html", noscript: "noscript.html",
  object: "object.html", optgroup: "optgroup.html", option: "option.html", output: "output.html",
  picture: "picture.html", pre: "computer-text.html", progress: "meter.html",
  rp: "ruby.html", rt: "ruby.html", ruby: "ruby.html",
  s: "text-format.html", samp: "computer-text.html", script: "script.html",
  section: "container.html", select: "select.html", small: "text-format.html",
  source: "picture.html", span: "container.html", strong: "text-format.html",
  style: "style.html", sub: "text-format.html", summary: "details.html", sup: "text-format.html", svg: "svg.html",
  table: "table.html", tbody: "table.html", td: "table.html", template: "template-tag.html",
  textarea: "textarea.html", tfoot: "table.html", th: "table.html", thead: "table.html",
  time: "time.html", title: "head.html", tr: "table.html", track: "video.html",
  u: "text-format.html", var: "computer-text.html", video: "video.html"
};


console.log("[smart-link] coding/links.js geladen:", smartLinkRules.length, "Wort-Regeln,", Object.keys(TAG_PAGES).length, "HTML-Tags");
