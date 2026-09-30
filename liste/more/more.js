/* =====================================================================
   more.js – Inhaltsverzeichnis
   ---------------------------------------------------------------------
   Wird von ALLEN Detailseiten im Ordner "more" geladen
   (<script defer src="more.js">).

   1. KONFIGURATION   Welche Seite gehört zu welcher Sprache?
                      Welche Wörter werden wohin verlinkt?
   2. COPY-BUTTONS    "Copy"-Button über jedem Codeblock
   3. SMART-LINKS     Fachbegriffe im Text automatisch zu Links machen
   4. START           DOMContentLoaded (setzt alles in Gang)
   5. VERSTÄNDNIS-BEWERTUNG   Button + Punkte-Lineal (0–10) im Footer,
                      speichert über den lokalen Server oder localStorage
   ===================================================================== */


/* =====================================================================
   1. KONFIGURATION
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


// ---------------------------------------------------------------------
// 1d) EINSTELLUNGEN
// ---------------------------------------------------------------------
// true  = jedes Ziel nur beim ERSTEN Vorkommen auf der Seite verlinken
//         (wie bei Wikipedia – sonst ist der Text voller Links)
// false = jedes Vorkommen verlinken
const LINK_ONLY_FIRST_OCCURRENCE = true;

// In diesen Elementen wird nach Begriffen gesucht
// (Überschriften bewusst nicht – Links in Überschriften wirken unruhig)
const SMART_LINK_CONTAINERS = "main p, main li, main td";

// In diesen Elementen wird NIE verlinkt:
//   Code soll Code bleiben, und .preview zeigt echtes HTML-Beispiel,
//   das genauso aussehen soll wie im Code darüber.
const SMART_LINK_EXCLUDED = "a, code, pre, script, style, .preview";


/* =====================================================================
   2. COPY-BUTTONS
   ---------------------------------------------------------------------
   Setzt über jeden Codeblock (<pre> oder .code-block) einen Button,
   der den Code in die Zwischenablage kopiert.
   ===================================================================== */

// ---------------------------------------------------------------------
// Sucht alle Codeblöcke und gibt jedem einen Copy-Button.
// ---------------------------------------------------------------------
function addCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre, .code-block");
  console.log("[copy] Codeblöcke gefunden:", codeBlocks.length);

  codeBlocks.forEach(function addCopyButtonToBlock(block) {
    // Bei <pre> ist der Block selbst der Inhalt.
    // Bei .code-block nehmen wir das <code> darin (falls vorhanden).
    // "? :" = Kurzform für if/else
    const codeBlockContent = block.tagName === "PRE"
      ? block
      : (block.querySelector("code") || block);

    // parentNode = das Eltern-Element. Ohne das können wir nichts einfügen.
    if (!codeBlockContent || !block.parentNode) {
      console.warn("[copy] Codeblock übersprungen:", block);
      return;
    }

    // --- Button bauen ---
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";

    // insertBefore(neu, vorDiesem) → Button direkt ÜBER den Codeblock setzen
    block.parentNode.insertBefore(button, block);

    // --- Klick → kopieren ---
    button.addEventListener("click", function handleCopyClick() {
      copyCodeToClipboard(codeBlockContent.textContent, button);
    });
  });
}

// ---------------------------------------------------------------------
// Kopiert einen Text in die Zwischenablage und zeigt das Ergebnis
// kurz auf dem Button an ("Copied!" oder "Fehler").
//
// "async" + "await": Kopieren dauert einen Moment. "await" wartet,
// bis es fertig ist, OHNE die ganze Seite anzuhalten.
// "try / catch": Geht im try-Teil etwas schief, springt JS in den
// catch-Teil, statt abzustürzen.
// ---------------------------------------------------------------------
async function copyCodeToClipboard(textToCopy, button) {
  try {
    // Manche Browser/Umgebungen haben keine Zwischenablage-API
    if (!navigator.clipboard) {
      throw new Error("Zwischenablage wird von diesem Browser nicht unterstützt");
    }

    await navigator.clipboard.writeText(textToCopy);
    button.textContent = "Copied!";
    console.log("[copy] kopiert:", textToCopy.length, "Zeichen");
  } catch (error) {
    button.textContent = "Fehler";
    console.error("[copy] Kopieren fehlgeschlagen:", error);
  }

  // Nach 1,2 Sekunden wieder "Copy" anzeigen
  // setTimeout(funktion, millisekunden) = Funktion später ausführen
  setTimeout(function restoreCopyButtonLabel() {
    button.textContent = "Copy";
  }, 1200);
}


/* =====================================================================
   3. SMART-LINKS
   ---------------------------------------------------------------------
   Ablauf:
     addSmartLinks()
       ├─ getCurrentPageFile()      → z. B. "for-loop.html"
       ├─ getPageLanguage()         → z. B. "cpp"
       ├─ buildWordLookup()         → Wort → Ziel (nur für DIESE Sprache)
       ├─ buildSearchPattern()      → ein Regex mit ALLEN Wörtern
       └─ für jeden Absatz/Listenpunkt/Überschrift:
            collectTextNodes()            → alle reinen Textstücke holen
            replaceTextNodeTermsWithLinks → Begriffe darin zu <a> machen
   ===================================================================== */

// ---------------------------------------------------------------------
// Dateiname der aktuellen Seite, klein geschrieben.
//   location.pathname  = z. B. "/C:/Dev/Liste-main/liste/more/for-loop.html"
//   .split("/").pop()  = letztes Stück nach dem letzten "/"
//   decodeURIComponent = macht "%20" wieder zu Leerzeichen ("area & map.html")
// ---------------------------------------------------------------------
function getCurrentPageFile() {
  const lastPart = window.location.pathname.split("/").pop() || "";
  try {
    return decodeURIComponent(lastPart).toLowerCase();
  } catch (error) {
    console.warn("[smart-link] Dateiname konnte nicht gelesen werden:", lastPart, error);
    return lastPart.toLowerCase();
  }
}

// ---------------------------------------------------------------------
// Bestimmt die Sprache der Seite (siehe 1a).
// document.documentElement = das <html>-Element
// .dataset.lang            = liest data-lang="..." aus
// ---------------------------------------------------------------------
function getPageLanguage(pageFile) {
  const fromHtmlTag = document.documentElement.dataset.lang;
  if (fromHtmlTag) {
    return fromHtmlTag.toLowerCase();
  }
  // Dateien mit "css-" bzw. "js-" am Anfang gehören automatisch zu CSS bzw. JS
  // (startsWith prüft, ob ein Text mit etwas beginnt)
  if (!(pageFile in PAGE_LANGUAGES)) {
    if (pageFile.startsWith("css-")) return "css";
    if (pageFile.startsWith("js-")) return "js";
    if (pageFile.startsWith("cpp-")) return "cpp";
    if (pageFile.startsWith("node-")) return "node";
    if (pageFile.startsWith("sql-")) return "sql";
    if (pageFile.startsWith("php-")) return "php";
    if (pageFile.startsWith("lua-")) return "lua";
    if (pageFile.startsWith("csharp-")) return "csharp";
    if (pageFile.startsWith("swift-")) return "swift";
    if (pageFile.startsWith("c-")) return "c";
    if (pageFile.startsWith("ts-")) return "ts";
  }
  // "??" = nimm den rechten Wert, wenn der linke undefined/null ist
  return PAGE_LANGUAGES[pageFile] ?? DEFAULT_PAGE_LANGUAGE;
}

// ---------------------------------------------------------------------
// Baut eine Nachschlage-Tabelle: Wort (klein) → Ziel-Seite.
// Enthält NUR Wörter, die in der aktuellen Sprache ein Ziel haben.
//
// new Map() = wie ein Objekt, aber speziell zum Nachschlagen gebaut.
//   map.set(schlüssel, wert)  → eintragen
//   map.get(schlüssel)        → nachschlagen
// ---------------------------------------------------------------------
function buildWordLookup(language) {
  const lookup = new Map();

  // --- Wort-Regeln (1b) ---
  // Zwei Stufen, damit eine eigene Angabe für die Sprache IMMER gewinnt:
  //   explicitTargets: Regel nennt die Sprache direkt (z. B. c: "c-zeiger.html")
  //   fallbackTargets: nur über LANGUAGE_FALLBACK oder "all" gefunden
  const explicitTargets = new Map();
  const fallbackTargets = new Map();
  const fallback = LANGUAGE_FALLBACK[language];

  smartLinkRules.forEach(function addRuleToLookup(rule) {
    const explicit = rule.links[language];
    const indirect = (fallback ? rule.links[fallback] : undefined) ?? rule.links.all;

    rule.words.forEach(function addWord(word) {
      const key = word.toLowerCase();
      if (explicit !== undefined) {
        explicitTargets.set(key, explicit);          // "" = bewusst kein Link
      } else if (indirect) {
        fallbackTargets.set(key, indirect);
      }
    });
  });

  // erst die Ersatz-Ziele, dann die direkten darüber (überschreiben)
  fallbackTargets.forEach((target, key) => lookup.set(key, target));
  explicitTargets.forEach((target, key) => lookup.set(key, target));

  // Wörter mit leerem Ziel wieder entfernen
  lookup.forEach((target, key) => { if (!target) lookup.delete(key); });

  // --- HTML-Tags (1c): "<div>" → "container.html" ---
  // Object.entries(obj) macht aus { a: "a.html" } → [ ["a", "a.html"] ]
  Object.entries(TAG_PAGES).forEach(function addTagToLookup([tagName, file]) {
    lookup.set("<" + tagName + ">", file);
  });

  return lookup;
}

// ---------------------------------------------------------------------
// Macht aus allen Wörtern EIN großes Suchmuster (Regex).
//
// Warum so kompliziert? Wörter wie "C++" oder "main()" enthalten
// Zeichen, die in Regex eine Sonderbedeutung haben ( + ( ) . usw.).
// escapeRegex() setzt davor ein "\", damit sie als normale Zeichen gelten.
//
// Wortgrenzen:
//   (?<![\p{L}\p{N}_-])  → davor steht KEIN Buchstabe/Zahl/_/-
//   (?![\p{L}\p{N}_])    → danach steht KEIN Buchstabe/Zahl/_
//   \p{L} = jeder Buchstabe, auch ä ö ü ß (dafür braucht es das "u")
//   Ein "-" danach ist erlaubt → "HTML-Dokument" verlinkt "HTML"
//   Ein "-" davor nicht        → "while-Schleife" wird nicht als "Schleife" erkannt
// ---------------------------------------------------------------------
function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchPattern(words) {
  // Längste Wörter zuerst: sonst findet Regex "Schleife" bevor es
  // "for-Schleife" überhaupt probiert.
  const sortedWords = [...words].sort(function byLengthDescending(first, second) {
    return second.length - first.length;
  });

  const alternatives = sortedWords.map(escapeRegex).join("|");
  // Flags: g = alle Treffer, i = Groß/klein egal, u = Unicode (für ä ö ü)
  return new RegExp("(?<![\\p{L}\\p{N}_-])(?:" + alternatives + ")(?![\\p{L}\\p{N}_])", "giu");
}

// ---------------------------------------------------------------------
// Holt alle Text-Knoten aus einem Element – außer denen in Links/Code.
//
// Ein "Text-Knoten" ist reiner Text ohne Tags. Beispiel:
//   <p>Eine <b>fette</b> Tabelle</p>
//   → 3 Knoten: "Eine ", "fette", " Tabelle"
//
// TreeWalker = ein "Spaziergänger", der Schritt für Schritt durch
// alle Knoten im Element läuft (nextNode() = nächster Schritt).
// ---------------------------------------------------------------------
function collectTextNodes(container) {
  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
    acceptNode: function shouldVisitTextNode(node) {
      const parent = node.parentElement;

      // closest() sucht nach oben: Steckt der Text in <a>, <code> usw.?
      if (!parent || parent.closest(SMART_LINK_EXCLUDED)) {
        return NodeFilter.FILTER_REJECT; // überspringen
      }
      return NodeFilter.FILTER_ACCEPT;   // aufnehmen
    }
  });

  // Erst ALLE sammeln, dann ändern. Würden wir direkt beim Laufen
  // ändern, käme der Walker durcheinander.
  const textNodes = [];
  let currentNode;
  while ((currentNode = walker.nextNode())) {
    textNodes.push(currentNode);
  }
  return textNodes;
}

// ---------------------------------------------------------------------
// Prüft, ob ein Ziel auf die AKTUELLE Seite zeigen würde.
// "for-loop.html#abc" → vor dem "#" abschneiden → "for-loop.html"
// ---------------------------------------------------------------------
function isSamePage(target, pageFile) {
  return target.split("#")[0].toLowerCase() === pageFile;
}

// ---------------------------------------------------------------------
// Ersetzt in EINEM Text-Knoten alle Begriffe durch Links.
//
// Beispiel: "Eine Tabelle mit Links"
//   → "Eine " + <a>Tabelle</a> + " mit " + <a>Links</a>
//
// context = { pattern, lookup, pageFile, usedTargets }
//   usedTargets = new Set() → merkt sich, welche Ziele schon verlinkt sind
//   (Set = Liste ohne doppelte Einträge; .has() prüft, .add() fügt hinzu)
//
// DocumentFragment = unsichtbarer Sammelbehälter. Wir bauen alle
// Stücke darin zusammen und tauschen am Ende EINMAL aus.
// ---------------------------------------------------------------------
function replaceTextNodeTermsWithLinks(textNode, context) {
  const text = textNode.textContent;
  const { pattern, lookup, pageFile, usedTargets } = context; // "Destructuring": Werte auspacken

  // WICHTIG: Ein Regex mit "g" merkt sich in lastIndex, wo es zuletzt
  // aufgehört hat. Vor jeder neuen Suche auf 0 zurücksetzen!
  pattern.lastIndex = 0;

  const fragment = document.createDocumentFragment();
  let lastIndex = 0;     // bis wohin der Text schon verarbeitet ist
  let linksCreated = 0;
  let match;

  // exec() liefert bei jedem Aufruf den NÄCHSTEN Treffer, am Ende null.
  // match[0] = das gefundene Wort, match.index = seine Position im Text
  while ((match = pattern.exec(text)) !== null) {
    const word = match[0];
    const target = lookup.get(word.toLowerCase());

    // Gründe, NICHT zu verlinken → "continue" = weiter zum nächsten Treffer
    if (!target) continue;
    if (isSamePage(target, pageFile)) continue;                           // Seite verlinkt sich nicht selbst
    if (LINK_ONLY_FIRST_OCCURRENCE && usedTargets.has(target)) continue;  // schon einmal verlinkt

    // 1) normaler Text VOR dem Begriff
    if (match.index > lastIndex) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
    }

    // 2) der Begriff selbst als Link
    const link = document.createElement("a");
    link.href = target;
    link.className = "smart-link";
    link.textContent = word;
    fragment.appendChild(link);

    usedTargets.add(target);
    linksCreated++;
    lastIndex = match.index + word.length;
  }

  // Kein einziger Link gebaut → Original lassen
  if (linksCreated === 0) {
    return;
  }

  // 3) restlicher Text NACH dem letzten Begriff
  if (lastIndex < text.length) {
    fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
  }

  // alten Text-Knoten durch den fertigen Inhalt ersetzen
  textNode.replaceWith(fragment);
}

// ---------------------------------------------------------------------
// Hauptfunktion für Smart-Links.
// ---------------------------------------------------------------------
function addSmartLinks() {
  const pageFile = getCurrentPageFile();
  const language = getPageLanguage(pageFile);
  console.log("[smart-link] Seite:", pageFile, "→ Sprache:", language);

  const lookup = buildWordLookup(language);
  if (lookup.size === 0) {
    console.warn("[smart-link] keine Wörter für Sprache", language);
    return;
  }

  // lookup.keys() = alle Wörter; [...] macht daraus ein normales Array
  const pattern = buildSearchPattern([...lookup.keys()]);
  console.log("[smart-link] Wörter für diese Sprache:", lookup.size);

  // Alles, was replaceTextNodeTermsWithLinks braucht, in einem Paket
  const context = { pattern, lookup, pageFile, usedTargets: new Set() };

  const textContainers = document.querySelectorAll(SMART_LINK_CONTAINERS);
  textContainers.forEach(function addSmartLinksToContainer(container) {
    collectTextNodes(container).forEach(function linkTextNode(textNode) {
      replaceTextNodeTermsWithLinks(textNode, context);
    });
  });

  // Zum Nachvollziehen: welche Links entstanden sind
  const createdLinks = document.querySelectorAll(".smart-link");
  console.log("[smart-link] Links erstellt:", createdLinks.length);
  createdLinks.forEach(function logLink(link) {
    console.log("   ", link.textContent, "→", link.getAttribute("href"));
  });
}


/* =====================================================================
   4. START
   ---------------------------------------------------------------------
   "defer" im <script>-Tag lädt das Skript erst nach dem HTML.
   DOMContentLoaded ist trotzdem als Sicherheit drin – so klappt es
   auch, falls das "defer" mal vergessen wird.

   try/catch um die Smart-Links: Falls dort etwas schiefgeht, bleibt
   die Seite trotzdem lesbar (nur ohne automatische Links).
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function initializeMorePages() {
  console.log("[start] Detailseite geladen:", document.title);

  addCopyButtons();

  try {
    addSmartLinks();
  } catch (error) {
    console.error("[smart-link] Fehler – Seite bleibt ohne Smart-Links:", error);
  }

  try {
    initProgressWidget();
  } catch (error) {
    console.error("[progress] Fehler – Verständnis-Bewertung nicht verfügbar:", error);
  }

  console.log("[start] fertig");
});


/* =====================================================================
   5. VERSTÄNDNIS-BEWERTUNG
   ---------------------------------------------------------------------
   Ein kleiner Button im Footer (über dem Zurück-Pfeil) zeigt, wie gut
   man dieses Thema schon verstanden hat: "–" = noch nicht bewertet,
   eine Zahl von 0 bis 10 = bewertet, "!" = Server-Problem (s. u.).

   Klick auf den Button öffnet ein "Lineal" aus 11 Punkten (0 bis 10).
   Klick/Enter auf einen Punkt speichert den Wert und schließt das
   Lineal wieder.

   SPEICHERORT – UNTERSCHEIDUNG NACH URL:
     Woher die Seite kommt (window.location.hostname), entscheidet, was
     bei einem Fehler passiert:

     a) http://localhost:3000/... oder http://127.0.0.1:3000/...
        Hier GEHÖRT ein Server zu diesem Projekt (server.js). Schlägt
        eine Anfrage fehl, ist das ein ECHTES Problem (Server nicht
        gestartet, abgestürzt, ...) – deshalb KEIN stiller Ausweich auf
        localStorage (das würde nur unbemerkt zwei getrennte Datentöpfe
        entstehen lassen, ohne dass man es merkt). Stattdessen: bis zu
        PROGRESS_RETRY_COUNT-mal erneut versuchen, dazwischen kurz
        warten, bei endgültigem Fehlschlag "!" im Button zeigen (Tooltip
        "Server nicht erreichbar") und console.error.

     b) file://... (Seite per Doppelklick geöffnet) oder ein fremder
        Host (z. B. GitHub Pages) – hier kann es GAR KEINEN eigenen
        Server geben. localStorage ist hier der normale, erwartete Weg,
        kein Fehlerfall – kein Retry, kein "!", nur ein Hinweis in der
        Konsole.

   EINMALIGE ÜBERNAHME:
     Ist der Server erreichbar (Fall a), werden alte, noch im
     localStorage liegende Werte einmalig per PUT in die Datenbank
     übertragen (siehe migrateLocalStorageToServer) – aber nur für
     Seiten, für die die Datenbank noch KEINEN eigenen Eintrag hat, um
     nichts zu überschreiben. Danach werden die übernommenen Einträge
     aus dem localStorage entfernt.

   Ablauf:
     initProgressWidget()
       ├─ baut Button + Lineal und hängt sie in den vorhandenen <footer>
       ├─ loadProgressLevel()            → lädt den gespeicherten Wert
       ├─ migrateLocalStorageToServer()  → einmalige Übernahme (nur
       │                                    wenn der Server erreichbar ist)
       └─ Klicks/Tasten steuern das Lineal (buildProgressRuler)
   ===================================================================== */

// ---------------------------------------------------------------------
// 5a) SPEICHERN & LADEN
// ---------------------------------------------------------------------

// Unter diesem Pfad läuft die API von server.js.
const PROGRESS_API_BASE = "/api/progress";

// Unter diesem Schlüssel liegen die Werte im localStorage, falls kein
// Server erreichbar ist (oder gar keiner existieren kann). localStorage
// kann nur TEXT speichern, deshalb wird hier ein Objekt als JSON-Text
// abgelegt, z. B.: '{"a.html":7,"button.html":3}'
const PROGRESS_STORAGE_KEY = "spicker-progress";

// Woher stammt ein geladener/gespeicherter Wert? Wird u. a. benutzt, um
// zu entscheiden, ob der Button "!" zeigen soll (nur bei UNREACHABLE).
const PROGRESS_SOURCE = {
  SERVER: "server",
  LOCAL_STORAGE: "localStorage",
  UNREACHABLE: "unreachable"
};

// Bei wie vielen Fehlschlägen in Folge wird aufgegeben, und wie lange
// wartet man zwischen zwei Versuchen? Nur relevant auf localhost/
// 127.0.0.1 (siehe isLocalServerContext) – dort SOLLTE der Server ja
// laufen, ein Fehlschlag ist also vermutlich nur vorübergehend.
const PROGRESS_RETRY_COUNT = 3;
const PROGRESS_RETRY_DELAY_MS = 2000;

// ---------------------------------------------------------------------
// Läuft diese Seite gerade UNTER DEM EIGENEN SERVER (server.js), also
// über http://localhost:3000/... oder http://127.0.0.1:3000/...?
//
// Das ist wichtig, um zu unterscheiden:
//   - JA:  hier MUSS server.js laufen. Ein Fehler ist ein echtes
//          Problem → nicht einfach schweigend auf localStorage
//          ausweichen, sondern sichtbar machen (Retry, dann "!").
//   - NEIN: file:// (Seite per Doppelklick geöffnet) oder ein fremder
//          Host (z. B. GitHub Pages) – dort kann es GAR KEINEN eigenen
//          Server geben. localStorage ist dort der normale Weg, kein
//          Fehlerfall.
// ---------------------------------------------------------------------
function isLocalServerContext() {
  return window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
}

// Liest alle lokal gespeicherten Werte aus dem localStorage.
// try/catch, weil localStorage z. B. im privaten Modus mancher Browser
// blockiert sein kann und dann einen Fehler wirft, statt einfach leer
// zu sein.
function readAllLocalProgress() {
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("[progress] localStorage konnte nicht gelesen werden:", error);
    return {};
  }
}

// Schreibt EINEN Wert in den localStorage (Rest bleibt erhalten).
// level === null → Eintrag wird entfernt (Zurücksetzen bzw. nach einer
// erfolgreichen Übernahme in die Datenbank, siehe migrateLocalStorageToServer).
function writeLocalProgress(pageFile, level) {
  try {
    const allValues = readAllLocalProgress();
    if (level === null) {
      delete allValues[pageFile];
    } else {
      allValues[pageFile] = level;
    }
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allValues));
    console.log("[progress] in localStorage gespeichert:", pageFile, "=", level);
  } catch (error) {
    console.warn("[progress] localStorage konnte nicht geschrieben werden:", error);
  }
}

// ---------------------------------------------------------------------
// Wartet die angegebene Anzahl Millisekunden. Ein Promise, das ohne
// Fehler erst NACH "ms" Millisekunden erfolgreich wird – "await
// wait(2000)" pausiert eine async-Funktion also für 2 Sekunden, ohne
// den Rest der Seite zu blockieren (anderer JS-Code läuft normal weiter).
// ---------------------------------------------------------------------
function wait(ms) {
  return new Promise(function waitExecutor(resolve) {
    setTimeout(resolve, ms);
  });
}

// ---------------------------------------------------------------------
// fetch() mit automatischen Wiederholungen. Wird NUR auf localhost/
// 127.0.0.1 benutzt (dort soll ein Fehlschlag nicht sofort aufgeben).
// Bei jedem Fehlschlag: loggen, kurz warten, erneut versuchen – bis zu
// PROGRESS_RETRY_COUNT-mal. Klappt es gar nicht, wird der letzte Fehler
// am Ende weitergereicht ("throw"), damit die aufrufende Funktion darauf
// reagieren kann (→ Button zeigt "!").
// ---------------------------------------------------------------------
async function fetchProgressApiWithRetry(url, options, actionLabel) {
  let lastError;

  for (let attempt = 1; attempt <= PROGRESS_RETRY_COUNT; attempt++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error("Server antwortete mit Status " + response.status);
      }
      return response;
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === PROGRESS_RETRY_COUNT;
      console.error(
        "[progress] " + actionLabel + " fehlgeschlagen (Versuch " + attempt + "/" + PROGRESS_RETRY_COUNT + "):",
        error.message
      );
      if (!isLastAttempt) {
        await wait(PROGRESS_RETRY_DELAY_MS);
      }
    }
  }

  throw lastError;
}

// ---------------------------------------------------------------------
// Lädt den gespeicherten Wert für die aktuelle Seite. Gibt IMMER ein
// Objekt { level, source } zurück (nie nur die Zahl), damit der
// Aufrufer weiß, WOHER der Wert kommt bzw. ob gerade gar nichts
// geklappt hat (source: PROGRESS_SOURCE.UNREACHABLE → Button zeigt "!").
// ---------------------------------------------------------------------
async function loadProgressLevel(pageFile) {
  if (!isLocalServerContext()) {
    // file:// oder fremder Host: hier ist localStorage der normale,
    // erwartete Weg – kein Fehlerfall, kein Retry nötig.
    const allValues = readAllLocalProgress();
    const level = typeof allValues[pageFile] === "number" ? allValues[pageFile] : null;
    console.log("[progress] geladen aus localStorage (kein eigener Server hier möglich):", pageFile, "=", level);
    return { level: level, source: PROGRESS_SOURCE.LOCAL_STORAGE };
  }

  try {
    const response = await fetchProgressApiWithRetry(
      PROGRESS_API_BASE + "/" + encodeURIComponent(pageFile),
      undefined,
      "Laden von " + pageFile
    );
    const row = await response.json(); // { page, level, updated } oder null
    console.log("[progress] vom Server geladen:", pageFile, "→", row);
    return { level: row ? row.level : null, source: PROGRESS_SOURCE.SERVER };
  } catch (error) {
    // Wir sind auf localhost/127.0.0.1 – server.js SOLLTE also laufen.
    // KEIN stiller Ausweich auf localStorage (das würde nur unbemerkt
    // zwei getrennte Datentöpfe entstehen lassen) – stattdessen deutlich
    // sichtbar machen (Aufrufer zeigt "!", siehe initProgressWidget).
    console.error("[progress] Server auf " + window.location.hostname + " nicht erreichbar (alle Versuche fehlgeschlagen):", error.message);
    return { level: null, source: PROGRESS_SOURCE.UNREACHABLE };
  }
}

// ---------------------------------------------------------------------
// Speichert einen neuen Wert (0–10) für die aktuelle Seite. Gibt
// { source } zurück, damit der Aufrufer weiß, ob es geklappt hat und wo
// der Wert gelandet ist.
// ---------------------------------------------------------------------
async function saveProgressLevel(pageFile, level) {
  if (!isLocalServerContext()) {
    writeLocalProgress(pageFile, level);
    return { source: PROGRESS_SOURCE.LOCAL_STORAGE };
  }

  try {
    await fetchProgressApiWithRetry(
      PROGRESS_API_BASE + "/" + encodeURIComponent(pageFile),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: level })
      },
      "Speichern von " + pageFile
    );
    console.log("[progress] auf dem Server gespeichert:", pageFile, "=", level);
    return { source: PROGRESS_SOURCE.SERVER };
  } catch (error) {
    console.error("[progress] Speichern auf dem Server fehlgeschlagen (" + pageFile + " = " + level + "):", error.message);
    return { source: PROGRESS_SOURCE.UNREACHABLE };
  }
}

// Setzt die Bewertung für die aktuelle Seite zurück (löscht sie).
async function resetProgressLevel(pageFile) {
  if (!isLocalServerContext()) {
    writeLocalProgress(pageFile, null);
    return { source: PROGRESS_SOURCE.LOCAL_STORAGE };
  }

  try {
    await fetchProgressApiWithRetry(
      PROGRESS_API_BASE + "/" + encodeURIComponent(pageFile),
      { method: "DELETE" },
      "Zurücksetzen von " + pageFile
    );
    console.log("[progress] auf dem Server zurückgesetzt:", pageFile);
    return { source: PROGRESS_SOURCE.SERVER };
  } catch (error) {
    console.error("[progress] Zurücksetzen auf dem Server fehlgeschlagen (" + pageFile + "):", error.message);
    return { source: PROGRESS_SOURCE.UNREACHABLE };
  }
}

// ---------------------------------------------------------------------
// EINMALIGE ÜBERNAHME: localStorage → Datenbank
// ---------------------------------------------------------------------
// Wird nur aufgerufen, wenn der Server nachweislich erreichbar ist
// (siehe initProgressWidget). Geht alle im localStorage gespeicherten
// Seiten durch und überträgt sie per PUT in die Datenbank – aber NUR
// für Seiten, die dort noch KEINEN Eintrag haben (nichts überschreiben).
// Erfolgreich übertragene Einträge werden danach aus dem localStorage
// entfernt. Gibt zurück, was übernommen wurde ({ pageFile: level, ... }),
// damit initProgressWidget die aktuelle Seite ggf. sofort neu anzeigen
// kann, statt bis zum nächsten Laden zu warten.
// ---------------------------------------------------------------------
async function migrateLocalStorageToServer() {
  const localValues = readAllLocalProgress();
  const pages = Object.keys(localValues);
  const migrated = {};

  if (pages.length === 0) {
    return migrated;
  }

  console.log("[progress] einmalige Übernahme: prüfe", pages.length, "Eintrag/Einträge aus localStorage ...");

  // "for...of" statt forEach: wir wollen in der Schleife bei jedem
  // fetch() mit "await" warten – in einem forEach-Callback würde await
  // NICHT die äußere Funktion pausieren, die Anfragen liefen also alle
  // gleichzeitig los statt nacheinander.
  for (const page of pages) {
    try {
      const checkResponse = await fetch(PROGRESS_API_BASE + "/" + encodeURIComponent(page));
      if (!checkResponse.ok) {
        throw new Error("Status " + checkResponse.status);
      }
      const existingRow = await checkResponse.json();

      if (existingRow) {
        console.log("[progress] Übernahme übersprungen für " + page + " – Datenbank hat schon einen Eintrag (" + existingRow.level + ")");
        continue;
      }

      const level = localValues[page];
      const putResponse = await fetch(PROGRESS_API_BASE + "/" + encodeURIComponent(page), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: level })
      });
      if (!putResponse.ok) {
        throw new Error("Status " + putResponse.status);
      }

      writeLocalProgress(page, null); // aus localStorage entfernen
      migrated[page] = level;
      console.log("[progress] übernommen: " + page + " = " + level + " (localStorage → Server, danach aus localStorage entfernt)");
    } catch (error) {
      // Einzelner Eintrag fehlgeschlagen: bleibt einfach im localStorage
      // stehen und wird beim nächsten Seitenaufruf erneut versucht.
      console.error("[progress] Übernahme fehlgeschlagen für " + page + " – bleibt vorerst im localStorage:", error.message);
    }
  }

  console.log("[progress] einmalige Übernahme abgeschlossen:", Object.keys(migrated).length, "von", pages.length, "übernommen");
  return migrated;
}


// ---------------------------------------------------------------------
// Zeigt/versteckt den Fehlerzustand "Server nicht erreichbar" auf dem
// Haupt-Button: "!" statt der Zahl, plus ein "title"-Attribut (das
// zeigen Browser automatisch als kleine Sprechblase beim Hovern an –
// das ist der einfachste Weg für einen Tooltip ohne eigenes CSS/JS).
// ---------------------------------------------------------------------
function showServerUnreachable(button) {
  button.textContent = "!";
  button.title = "Server nicht erreichbar";
}

function clearServerUnreachable(button) {
  button.title = "";
}


// ---------------------------------------------------------------------
// 5b) DAS PUNKTE-LINEAL
// ---------------------------------------------------------------------
// Baut das aufklappbare Lineal (11 Punkte von 0 bis 10) und gibt ein
// Objekt mit Funktionen zurück, mit denen initProgressWidget() es
// steuern kann (open/close/toggle/setLevel/reset).
//
// "role='button' + tabindex='0'" auf den Punkten (statt <button>):
// So sind es zwar normale <div>-Elemente (leicht mit CSS zu gestalten,
// z. B. als Kreis), aber Screenreader kündigen sie trotzdem als Button
// an, und man kann mit Tab dorthin springen. Die Tastatur-Bedienung
// (Pfeiltasten, Enter) muss dafür aber selbst gebaut werden – das
// übernimmt <button> normalerweise automatisch.
// ---------------------------------------------------------------------
function buildProgressRuler(pageFile, button) {
  const panel = document.createElement("div");
  panel.className = "progress-ruler";
  panel.hidden = true; // [hidden] blendet das Element komplett aus (display: none)

  // Kopfzeile: Vorschau-Zahl links, "×"-Button zum Zurücksetzen rechts.
  // (Einfacher als Rechtsklick/langer Klick auf den Punkten und
  // funktioniert genauso gut mit Maus, Tastatur und Touch.)
  const head = document.createElement("div");
  head.className = "progress-ruler-head";

  const previewLabel = document.createElement("span");
  previewLabel.className = "progress-ruler-preview";

  const resetButton = document.createElement("button");
  resetButton.type = "button";
  resetButton.className = "progress-ruler-reset";
  resetButton.textContent = "×";
  resetButton.title = "Bewertung zurücksetzen";
  resetButton.setAttribute("aria-label", "Bewertung zurücksetzen");

  head.append(previewLabel, resetButton);

  // Die 11 Punkte (0 bis 10).
  const dotsRow = document.createElement("div");
  dotsRow.className = "progress-ruler-dots";

  const dots = [];
  for (let value = 0; value <= 10; value++) {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    dot.setAttribute("role", "button");
    dot.tabIndex = 0;
    dot.dataset.value = String(value);
    dot.setAttribute("aria-label", "Verständnis " + value + " von 10");
    dotsRow.appendChild(dot);
    dots.push(dot);
  }

  // Beschriftung nur an den Enden ("0" links, "10" rechts).
  const endLabels = document.createElement("div");
  endLabels.className = "progress-ruler-labels";
  const startLabel = document.createElement("span");
  startLabel.textContent = "0";
  const endLabel = document.createElement("span");
  endLabel.textContent = "10";
  endLabels.append(startLabel, endLabel);

  panel.append(head, dotsRow, endLabels);

  // aktueller, GESPEICHERTER Wert (null = noch nicht bewertet).
  // "let", weil sich der Wert später ändert.
  let currentLevel = null;

  // Malt die Punkte neu: gefüllt bis "value" (Vorschau beim Hovern
  // ODER, falls keine Vorschau aktiv ist, bis zum gespeicherten Wert).
  function renderDots(previewValue) {
    const activeValue = previewValue !== null ? previewValue : currentLevel;

    dots.forEach(function updateDot(dot, index) {
      const isFilled = activeValue !== null && index <= activeValue;
      // classList.toggle(klasse, true/false) = Klasse gezielt an/aus
      dot.classList.toggle("is-filled", isFilled);
    });

    previewLabel.textContent = activeValue !== null ? String(activeValue) : "";
  }

  // Setzt den angezeigten Wert, OHNE zu speichern (wird von
  // initProgressWidget() beim Laden benutzt).
  function setLevel(level) {
    currentLevel = (typeof level === "number" && level >= 0 && level <= 10) ? level : null;
    button.textContent = currentLevel !== null ? String(currentLevel) : "–";
    renderDots(null);
  }

  // Wert auswählen: sofort anzeigen (optimistisch, fühlt sich schneller
  // an), Lineal schließen, im Hintergrund speichern. Schlägt das
  // Speichern endgültig fehl (nur möglich auf localhost/127.0.0.1,
  // s. o.), zeigt der Button stattdessen "!" statt der dann falschen Zahl.
  function selectLevel(value) {
    setLevel(value);
    close();
    saveProgressLevel(pageFile, value).then(function handleSaveResult(result) {
      if (result.source === PROGRESS_SOURCE.UNREACHABLE) {
        showServerUnreachable(button);
      } else {
        clearServerUnreachable(button);
      }
    });
  }

  function open() {
    panel.hidden = false;
    button.setAttribute("aria-expanded", "true");
    renderDots(null);
    // Fokus auf den aktuell aktiven Punkt (oder "0", falls noch keiner
    // gewählt ist) – so kann man sofort mit den Pfeiltasten weiter.
    dots[currentLevel !== null ? currentLevel : 0].focus();
  }

  function close() {
    if (panel.hidden) return;

    // Lag der Fokus GERADE auf einem der Punkte (also innerhalb des
    // Lineals), soll er zurück auf den Haupt-Button springen. Ohne das
    // würde der Fokus beim Verstecken (panel.hidden = true → display:
    // none) einfach auf <body> "herunterfallen", und Tastatur-Nutzer
    // müssten sich mit Tab komplett neu orientieren. Gilt für ALLE
    // Wege, wie close() aufgerufen wird: Escape, Klick außerhalb, und
    // auch nach einer Auswahl.
    const focusWasInsidePanel = panel.contains(document.activeElement);

    panel.hidden = true;
    button.setAttribute("aria-expanded", "false");

    if (focusWasInsidePanel) {
      button.focus();
    }
  }

  function toggle() {
    if (panel.hidden) {
      open();
    } else {
      close();
    }
  }

  function reset() {
    setLevel(null);
    close();
    resetProgressLevel(pageFile).then(function handleResetResult(result) {
      if (result.source === PROGRESS_SOURCE.UNREACHABLE) {
        showServerUnreachable(button);
      } else {
        clearServerUnreachable(button);
      }
    });
  }

  // --- Maus: Hovern zeigt eine Vorschau, Klick wählt aus ---
  dots.forEach(function wireDot(dot, index) {
    dot.addEventListener("mouseenter", function () { renderDots(index); });
    dot.addEventListener("mouseleave", function () { renderDots(null); });
    dot.addEventListener("focus", function () { renderDots(index); });
    dot.addEventListener("blur", function () { renderDots(null); });
    dot.addEventListener("click", function () { selectLevel(index); });

    // --- Tastatur: Pfeiltasten bewegen, Enter/Leertaste bestätigt ---
    dot.addEventListener("keydown", function handleDotKeydown(event) {
      if (event.key === "ArrowRight") {
        event.preventDefault(); // Seite soll dabei nicht scrollen
        dots[Math.min(index + 1, 10)].focus();
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        dots[Math.max(index - 1, 0)].focus();
      } else if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectLevel(index);
      }
    });
  });

  resetButton.addEventListener("click", function handleResetClick(event) {
    // stopPropagation: verhindert, dass der Klick zusätzlich als
    // "Klick außerhalb" beim <button> ankommt und Dinge doppelt passieren.
    event.stopPropagation();
    reset();
  });

  return { panel: panel, setLevel: setLevel, open: open, close: close, toggle: toggle };
}


// ---------------------------------------------------------------------
// 5c) EINRICHTEN
// ---------------------------------------------------------------------
function initProgressWidget() {
  const footer = document.querySelector("footer");
  if (!footer) {
    console.warn("[progress] Kein <footer> auf dieser Seite gefunden – Verständnis-Bewertung wird übersprungen.");
    return;
  }

  const pageFile = getCurrentPageFile(); // schon vorhanden (Abschnitt 3)

  // Container für Button + Lineal. "position: relative" in more.css
  // sorgt dafür, dass sich das Lineal (position: absolute) daran
  // ausrichtet statt am ganzen Bildschirm.
  const widget = document.createElement("div");
  widget.className = "progress-widget";

  const button = document.createElement("button");
  button.type = "button";
  button.className = "progress-button";
  button.textContent = "–"; // Platzhalter, bis geladen ist
  button.setAttribute("aria-label", "Verständnis dieser Seite bewerten (0 bis 10)");
  button.setAttribute("aria-haspopup", "true");
  button.setAttribute("aria-expanded", "false");

  const ruler = buildProgressRuler(pageFile, button);

  // Reihenfolge im DOM = Reihenfolge im Footer von oben nach unten:
  // zuerst das Lineal (liegt anfangs versteckt "über" dem Button),
  // dann der Button, DAVOR (insertBefore) der schon vorhandene
  // Zurück-Pfeil. So steht der neue Button über dem Zurück-Pfeil.
  widget.append(ruler.panel, button);
  footer.insertBefore(widget, footer.firstChild);

  button.addEventListener("click", function handleButtonClick() {
    ruler.toggle();
  });

  // --- "Klick außerhalb schließt das Lineal" ---
  // Ein Klick passiert IMMER zuerst auf dem genauen Element, auf das
  // geklickt wurde, und "blubbert" danach durch alle Eltern-Elemente
  // nach oben bis zum <body>/<document> (Event Bubbling). Hier wird
  // deshalb auf dem ganzen document gehorcht: Liegt das tatsächlich
  // angeklickte Element (event.target) NICHT innerhalb von "widget"
  // (widget.contains(...)), war der Klick "außerhalb" → schließen.
  document.addEventListener("click", function handleOutsideClick(event) {
    if (!widget.contains(event.target)) {
      ruler.close();
    }
  });

  // --- Escape schließt das Lineal ---
  document.addEventListener("keydown", function handleGlobalKeydown(event) {
    if (event.key === "Escape") {
      ruler.close();
    }
  });

  // Gespeicherten Wert laden, anzeigen, und (falls der Server erreichbar
  // ist) alte localStorage-Werte einmalig in die Datenbank übernehmen.
  loadProgressLevel(pageFile).then(async function handleInitialLoad(result) {
    if (result.source === PROGRESS_SOURCE.UNREACHABLE) {
      showServerUnreachable(button);
    } else {
      clearServerUnreachable(button);
      ruler.setLevel(result.level);
    }

    // Übernahme nur versuchen, wenn wir GERADE ERST erfolgreich mit dem
    // Server gesprochen haben – sonst würde jeder fehlgeschlagene
    // Versuch zusätzlich noch die Übernahme-Anfragen auslösen.
    if (result.source === PROGRESS_SOURCE.SERVER) {
      const migratedPages = await migrateLocalStorageToServer();
      // Wurde ausgerechnet die AKTUELLE Seite gerade übernommen, sofort
      // den neuen Wert anzeigen, statt bis zum nächsten Laden zu warten.
      if (Object.prototype.hasOwnProperty.call(migratedPages, pageFile)) {
        ruler.setLevel(migratedPages[pageFile]);
      }
    }
  });

  console.log("[progress] Verständnis-Bewertung eingerichtet für:", pageFile);
}
