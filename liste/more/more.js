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
//   3. Dateiname beginnt mit "css-" → css, "js-" → js, "cpp-" → cpp
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
  "html-sprache.html":    "html"
  // alle anderen Seiten (die HTML-Tags) → DEFAULT_PAGE_LANGUAGE
};

const DEFAULT_PAGE_LANGUAGE = "html";


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

  // ===== Programmier-Grundlagen (je Sprache verschieden!) =====
  { words: ["for-Schleife", "for-Schleifen"],
    links: { cpp: "for-loop.html",   js: "js-schleifen.html" } },
  { words: ["while-Schleife", "while-Schleifen"],
    links: { cpp: "while-loop.html", js: "js-schleifen.html" } },
  { words: ["Schleife", "Schleifen"],
    links: { cpp: "for-loop.html",   js: "js-schleifen.html" } },
  { words: ["Funktion", "Funktionen"],
    links: { cpp: "function.html",   js: "js-funktionen.html" } },
  { words: ["Variable", "Variablen"],
    links: { cpp: "variable.html",   js: "js-variablen.html", css: "css-variablen.html" } },
  { words: ["if-else", "Bedingung", "Bedingungen"],
    links: { cpp: "if-else.html",    js: "js-bedingungen.html" } },
  { words: ["Datentyp", "Datentypen"],
    links: { cpp: "datatypes.html",  js: "js-variablen.html" } },

  // ===== Nur C++ =====
  { words: ["Zeiger", "Pointer"],                         links: { cpp: "pointer.html" } },
  { words: ["Referenz", "Referenzen"],                    links: { cpp: "reference.html" } },
  { words: ["Objekt", "Objekte", "Methode", "Methoden",
            "OOP", "objektorientiert", "objektorientierte"],
                                                          links: { cpp: "cpp-class.html", js: "js-objekte.html" } },
  { words: ["Konstruktor", "Destruktor", "Kapselung", "private", "public"],
                                                          links: { cpp: "cpp-konstruktor.html" } },
  { words: ["Namespace", "Namespaces", "using namespace"], links: { cpp: "using-namespace.html" } },
  { words: ["#include", "Bibliothek", "Bibliotheken",
            "Header-Datei", "Header-Dateien"],            links: { cpp: "include.html" } },
  { words: ["Header-Datei", "Header-Dateien", "Headerdatei", "Include Guard", "#pragma once"],
                                                          links: { cpp: "cpp-header.html" } },
  { words: ["Vererbung", "Polymorphie", "virtual", "override", "Basisklasse"],
                                                          links: { cpp: "cpp-vererbung.html" } },
  { words: ["Vector", "Vectors", "std::vector"],          links: { cpp: "cpp-vector.html" } },
  { words: ["std::string"],                               links: { cpp: "cpp-string.html" } },
  { words: ["std::map", "Map", "std::set"],               links: { cpp: "cpp-map.html" } },
  { words: ["Lambda", "Lambdas", "Algorithmus", "Algorithmen"], links: { cpp: "cpp-algorithmen.html" } },
  { words: ["struct", "enum", "enum class"],              links: { cpp: "cpp-struct-enum.html" } },
  { words: ["switch", "do-while", "break", "continue"],   links: { cpp: "cpp-kontrolle.html" } },
  { words: ["const", "constexpr", "auto"],                links: { cpp: "cpp-const-auto.html" } },
  { words: ["Smart Pointer", "unique_ptr", "shared_ptr", "Heap", "Stack", "Speicherleck", "new", "delete"],
                                                          links: { cpp: "cpp-speicher.html" } },
  { words: ["Exception", "Exceptions", "Ausnahme"],       links: { cpp: "cpp-fehler.html" } },
  { words: ["Textdatei", "Textdateien", "fstream", "ifstream", "ofstream"],               links: { cpp: "cpp-dateien.html" } },
  { words: ["Template", "Templates"],                     links: { cpp: "cpp-templates.html" } },
  { words: ["Compiler", "kompilieren", "g++", "CMake", "Linker"], links: { cpp: "cpp-kompilieren.html" } },
  { words: ["main()", "main-Funktion", "Einstiegspunkt"], links: { cpp: "cpp-main.html" } },
  { words: ["cout", "std::cout", "Ausgabe"],              links: { cpp: "cout.html" } },
  { words: ["cin", "std::cin"],                           links: { cpp: "cin.html" } },

  // ===== Gleiches Wort, andere Bedeutung je Sprache =====
  // "Klasse" ist in C++ eine Objekt-Vorlage, in HTML/CSS eine CSS-Klasse
  { words: ["Klasse", "Klassen"],
    links: { cpp: "cpp-class.html", all: "Class.html" } },
  { words: ["CSS-Klasse", "CSS-Klassen"],
    links: { all: "Class.html" } },
  // "Eingabe" ist in C++ cin, im Web ein Eingabefeld
  { words: ["Eingabe", "Eingaben"],
    links: { cpp: "cin.html", all: "input.html" } },
  // "einbinden" ist in C++ #include, im Web <link>/<script>
  { words: ["einbinden", "eingebunden", "Einbinden"],
    links: { cpp: "include.html", all: "link.html" } },

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
  { words: ["Operator", "Operatoren"],                    links: { js: "js-operatoren.html", cpp: "cpp-operatoren.html" } },
  { words: ["String", "Strings", "Template-String"],      links: { js: "js-strings.html", cpp: "cpp-string.html" } },
  { words: ["JSON"],                                      links: { js: "js-objekte.html", html: "js-objekte.html" } },
  { words: ["Konsole", "console.log"],                    links: { js: "js-konsole.html", html: "js-konsole.html", css: "js-konsole.html", cpp: "cout.html" } },
  { words: ["try/catch", "Fehlermeldung", "try", "catch"], links: { js: "js-konsole.html", cpp: "cpp-fehler.html" } },
  { words: ["Promise", "async", "await", "fetch"],        links: { js: "js-async.html" } },
  { words: ["localStorage"],                              links: { js: "js-speicher.html", html: "js-speicher.html" } },
  { words: ["Zufallszahl", "Zufallszahlen", "Math.random"], links: { js: "js-mathe.html", cpp: "cpp-zufall.html" } },
  { words: ["Modul", "Module", "import", "export"],       links: { js: "js-module.html" } },

  // ===== Web (HTML / CSS / JS) =====
  { words: ["Element", "Elemente", "HTML-Element", "HTML-Elemente"],
    links: { html: "html-sprache.html#elemente", css: "html-sprache.html#elemente" } },   // in JS meist Array-Elemente → kein Link
  { words: ["DOM"],                                       links: { js: "js-dom.html", html: "js-dom.html", css: "js-dom.html" } },
  { words: ["Selektor", "Selektoren"],                    links: { css: "css-selektoren.html", html: "css-selektoren.html", js: "css-selektoren.html" } },
  { words: ["Überschrift", "Überschriften"],              links: { html: "headings.html", css: "headings.html", js: "headings.html" } },
  { words: ["Array", "Arrays"],                           links: { js: "js-arrays.html", cpp: "cpp-arrays.html" } },
  { words: ["Auswahlmenü", "Dropdown"],                   links: { html: "select.html", css: "select.html", js: "select.html" } },
  { words: ["Untertitel"],                                links: { html: "video.html", css: "video.html", js: "video.html" } },
  { words: ["Layout", "Layouts"],                         links: { css: "css-display.html", html: "css-display.html" } },
  { words: ["Flexbox"],                                   links: { css: "css-flexbox.html", html: "css-flexbox.html", js: "css-flexbox.html" } },
  { words: ["Grid"],                                      links: { css: "css-grid.html", html: "css-grid.html", js: "css-grid.html" } },
  { words: ["Stylesheet", "Stylesheets", "CSS-Datei", "CSS-Dateien"],
                                                          links: { html: "link.html", css: "link.html" } },
  { words: ["Tabelle", "Tabellen"],                       links: { html: "table.html", css: "table.html", js: "table.html" } },
  { words: ["Liste", "Listen"],                           links: { html: "liste.html", css: "liste.html", js: "liste.html" } },
  { words: ["Formular", "Formulare"],                     links: { html: "form.html", css: "form.html", js: "form.html" } },
  { words: ["Container", "Containern"],                   links: { html: "container.html", css: "container.html", js: "container.html" } },
  { words: ["Bild", "Bilder"],                            links: { html: "img.html", css: "img.html", js: "img.html" } },
  { words: ["Link", "Links", "Hyperlink", "Hyperlinks"],  links: { html: "a.html", css: "a.html", js: "a.html" } },
  { words: ["Button", "Buttons", "Schaltfläche", "Schaltflächen"],
                                                          links: { html: "button.html", css: "button.html", js: "button.html" } },
  { words: ["Eingabefeld", "Eingabefelder"],              links: { html: "input.html", css: "input.html", js: "input.html" } },
  { words: ["Attribut", "Attribute", "ID-Attribut", "ID"],
                                                          links: { html: "id.html", css: "id.html", js: "id.html" } }
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
  smartLinkRules.forEach(function addRuleToLookup(rule) {
    // erst die Sprache probieren, sonst "all", sonst null (= kein Link)
    const target = rule.links[language] ?? rule.links.all ?? null;
    if (!target) return;

    rule.words.forEach(function addWord(word) {
      lookup.set(word.toLowerCase(), target);
    });
  });

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

  console.log("[start] fertig");
});
