/* =====================================================================
   entries.js – DATEN des Coding-Spickers (keine Logik!)
   ---------------------------------------------------------------------
   Die Logik (Suche, Filter, Sortierung, Tabelle) steckt in
   shared/list.js und ist für alle Spicker gleich. Hier stehen nur:
     1. config        Spalten, Filtergruppen, Sortierung, Suchtext
     2. oTableEntries die Einträge der Tabelle

   Alles wird unter window.SpickerData["coding"] abgelegt.
   WARUM so und nicht einfach "let oTableEntries = ..."?
     Die Übersicht (spicker/index.html) lädt die entries.js ALLER
     Spicker, um die Einträge zu zählen. Hätten alle eine eigene
     Variable "oTableEntries", gäbe es beim zweiten Laden einen Fehler
     ("schon deklariert"). Unter SpickerData["coding"],
     SpickerData["mathe"] … stören sie sich nicht.

   "window.SpickerData = window.SpickerData || {}" heißt:
     Gibt es SpickerData schon (von einer anderen entries.js), nimm das –
     sonst lege ein leeres Objekt an.
   ===================================================================== */
window.SpickerData = window.SpickerData || {};

window.SpickerData["coding"] = {

  /* ===================================================================
     1. KONFIGURATION
     -------------------------------------------------------------------
     columns       Spalten der Tabelle, von links nach rechts.
                   title = Überschrift, field = Feld im Eintrag.
                   type "link" = Feld ist ein Link, angezeigt als linkText.
                   Die ERSTE Spalte ist die Haupt-Spalte für A–Z.
     filterGroups  Filter im Dropdown. field = welches Feld verglichen wird:
                     "class"  → Wert muss im class-Array stehen (Kategorie)
                     sonst    → Feld klein geschrieben == value
                   value "" = "Alle" (kein Filter)
     sortOptions   "az", "za" (nach der ersten Spalte), "field:<Feld>"
                   (erst nach diesem Feld, dann A–Z) oder "level"
                   (nach dem optionalen Feld "Stufe" aufsteigend, dann
                   A–Z – siehe getEntryLevel() in shared/list.js).
                   Die ERSTE sortOption ist die Standard-Sortierung
                   beim Laden der Seite.
     =================================================================== */
  config: {
    searchPlaceholder: "Begriffe, Beschreibungen oder Sprachen suchen …",

    columns: [
      { title: "Begriff",         field: "Begriff" },
      { title: "Beschreibung",    field: "Beschreibung" },
      { title: "Sprache/Bereich", field: "Sprache" },
      { title: "Link",            field: "Link", type: "link", linkText: "mehr" }
    ],

    filterGroups: [
      {
        id: "language",
        title: "Sprache/Bereich",
        field: "Sprache",
        buttons: [
        { label: "Alle", value: "" },
        { label: "HTML", value: "html" },
        { label: "CSS", value: "css" },
        { label: "JavaScript", value: "js" },
        { label: "C++", value: "c++" },
        { label: "Node.js", value: "node.js" },
        { label: "SQL", value: "sql" },
        { label: "PHP", value: "php" },
        { label: "Lua", value: "lua" },
        { label: "C", value: "c" },
        { label: "C#", value: "c#" },
        { label: "Swift", value: "swift" },
        { label: "Terminal", value: "terminal" },
        { label: "TypeScript", value: "typescript" }
        ]
      },
      {
        id: "category",
        title: "Kategorie",
        field: "class",
        buttons: [
        { label: "Alle", value: "" },
        { label: "Basis", value: "basis" },
        { label: "Grundlagen", value: "grundlagen" },
        { label: "Text", value: "text" },
        { label: "Container", value: "container" },
        { label: "Medien", value: "media" },
        { label: "Formular", value: "form" },
        { label: "Tabelle", value: "tabelle" },
        { label: "Selektoren", value: "selektoren" },
        { label: "Kontrollstrukturen", value: "kontrolle" },
        { label: "Layout", value: "layout" },
        { label: "Gestaltung", value: "gestaltung" },
        { label: "Daten", value: "daten" },
        { label: "DOM & Events", value: "dom" },
        { label: "OOP", value: "oop" },
        { label: "Speicher", value: "speicher" },
        { label: "Werkzeuge", value: "werkzeuge" },
        { label: "Server", value: "server" },
        { label: "Hilfe", value: "hilfe" }
        ]
      }
    ],

    sortOptions: [
      { label: "Empfohlen", value: "level" },
      { label: "A – Z",   value: "az" },
      { label: "Z – A",   value: "za" },
      { label: "Sprache/Bereich", value: "field:Sprache" }
    ]
  },

  /* ===================================================================
     2. DATEN
     -------------------------------------------------------------------
     Jeder Eintrag ist ein Objekt { ... } mit diesen Feldern:
       "Begriff"      → Spalte 1 (Befehl, Tag, Methode ODER Fachbegriff wie
                        Binärsystem, CPU, DNS – nicht mehr nur HTML-Tags)
       "Beschreibung" → Spalte 2
       "Sprache"      → Spalte 3 (+ Sprach-Filter, klein geschrieben verglichen).
                        Trotz des Feldnamens dürfen hier auch Bereiche wie
                        "Hardware" oder "Netzwerk" stehen, nicht nur Sprachen –
                        das field bleibt "Sprache", damit nicht alle Einträge
                        geändert werden müssen; die Spalte heißt daher
                        "Sprache/Bereich".
       "Link"         → Spalte 4 ("mehr"-Link), leer lassen = kein Link.
                        Relativ zu coding/index.html, also "more/xyz.html".
       "class"        → Array mit Schlagwörtern für den Kategorie-Filter UND die Suche
       "Stufe"        → OPTIONAL, nur für die Sortierung "Empfohlen" (value
                        "level", Lernreihenfolge). Zahl in 10er-Schritten,
                        damit später etwas dazwischen passt. Einträge OHNE
                        "Stufe" landen bei "Empfohlen" ganz hinten (A–Z) –
                        es muss also NICHT jeder Eintrag eine Stufe haben.
                        Bisher vergebene Stufen:
                          0  Spicker selbst (Anleitung, später Übersicht)
                          10 IT-Grundbegriffe        20 Daten & Zahlensysteme
                          30 Hardware                40 Betriebssystem
                          50 Netzwerk                60 Protokolle
                          70 Programmier-Grundlagen  80 Sprachen (HTML,
                             CSS, JavaScript, C++, Node.js, SQL, PHP, Lua,
                             C, C#, Swift, TypeScript)
                          ohne Stufe = alles andere
                        Stand jetzt sind nur Stufe 0 (Anleitung) und
                        Stufe 80 (die zwölf Sprach-Überblicke oben) vergeben;
                        10–70 kommen später als eigene Schritte dazu.
     Neuer Eintrag: einfach einen { ... }-Block kopieren und anpassen.
     Die Reihenfolge hier ist egal – list.js sortiert beim Anzeigen.
     Hinweis: mathe/entries.js nutzt bereits "Begriff" als Spalte 1 –
     die Coding-Liste ist damit einheitlich mit der Mathe-Liste.
     =================================================================== */
  oTableEntries: { "List": [
    // Spicker selbst
    {
      "Begriff": "Anleitung",
      "Beschreibung": "Aufbau, Funktionen und Lerntipps",
      "Sprache": "Spicker",
      "Link": "more/anleitung.html",
      "class": ["spicker","hilfe","anleitung","bedienung","funktionen","lernen","lerntipps","verständnis","bewertung","speichern","suche","filter","aufbau"],
      "Stufe": 0
    },
    // Sonderzeichen
    {
      "Begriff": "[]",
      "Beschreibung": "zum Definieren von Listen und Arrays",
      "Sprache": "JS",
      "Link": "more/js-klammern.html",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Begriff": "()",
      "Beschreibung": "Funktionsaufrufe und Gruppierung",
      "Sprache": "JS",
      "Link": "more/js-klammern.html",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Begriff": "{}",
      "Beschreibung": "Objekte und Codeblöcke",
      "Sprache": "JS",
      "Link": "more/js-klammern.html",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Begriff": "<element>",
      "Beschreibung": "Platzhalter für ein beliebiges HTML-Element",
      "Sprache": "html",
      "Link": "more/elements.html",
      "class": ["zeichen","html"]
    },
    {
      "Begriff": "</element>",
      "Beschreibung": "Schließt ein HTML-Element",
      "Sprache": "html",
      "Link": "more/elements.html",
      "class": ["zeichen","html","basis"]
    },
    // A
    {
      "Begriff": "<a>",
      "Beschreibung": "Hyperlink zu einer URL oder Seite",
      "Sprache": "html",
      "Link": "more/a.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<abbr>",
      "Beschreibung": "Abkürzung mit erklärtem Text",
      "Sprache": "html",
      "Link": "more/abbr.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<address>",
      "Beschreibung": "Adressblock für Kontaktinformationen",
      "Sprache": "html",
      "Link": "more/address.html",
      "class": ["html","container","semantik"]
    },
    {
      "Begriff": "<area>",
      "Beschreibung": "Interaktive Fläche in einer Bild-Map",
      "Sprache": "html",
      "Link": "more/area & map.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<article>",
      "Beschreibung": "Eigenständiger Inhaltsbereich",
      "Sprache": "html",
      "Link": "more/article.html",
      "class": ["html","container","semantik"]
    },
    {
      "Begriff": "<aside>",
      "Beschreibung": "Inhalt neben dem Hauptinhalt",
      "Sprache": "html",
      "Link": "more/aside.html",
      "class": ["html","container","semantik"]
    },
    {
      "Begriff": "<audio>",
      "Beschreibung": "Einbettung von Audiodateien",
      "Sprache": "html",
      "Link": "more/audio.html",
      "class": ["html","media"]
    },
    // B
    {
      "Begriff": "<b>",
      "Beschreibung": "Fetter Text ohne zusätzliche Semantik",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<base>",
      "Beschreibung": "Basis-URL für relative Links",
      "Sprache": "html",
      "Link": "more/base.html",
      "class": ["html","metadata"]
    },
    {
      "Begriff": "<bdi>",
      "Beschreibung": "Steuert die Schreibrichtung für Textblöcke",
      "Sprache": "html",
      "Link": "more/bdi.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<bdo>",
      "Beschreibung": "Überschreibt die Schreibrichtung des Textes",
      "Sprache": "html",
      "Link": "more/bdo.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<blockquote>",
      "Beschreibung": "Blockzitat für längere Zitate",
      "Sprache": "html",
      "Link": "more/blockquote.html",
      "class": ["html","container","text"]
    },
    {
      "Begriff": "<body>",
      "Beschreibung": "Hauptkörper des Dokuments",
      "Sprache": "html",
      "Link": "more/body.html",
      "class": ["basis","html","container"]
    },
    {
      "Begriff": "<br>",
      "Beschreibung": "Zeilenumbruch im Text",
      "Sprache": "html",
      "Link": "more/br.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<button>",
      "Beschreibung": "Schaltfläche für Benutzerinteraktionen",
      "Sprache": "html",
      "Link": "more/button.html",
      "class": ["html","form","interactive"]
    },
    // C
    {
      "Begriff": "<canvas>",
      "Beschreibung": "Grafikfläche für dynamische Zeichnungen",
      "Sprache": "html",
      "Link": "more/canvas.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<caption>",
      "Beschreibung": "Beschriftung einer Tabelle",
      "Sprache": "html",
      "Link": "more/caption.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<cite>",
      "Beschreibung": "Quellenangabe für ein Werk oder Zitat",
      "Sprache": "html",
      "Link": "more/cite.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<code>",
      "Beschreibung": "Code oder Programmtext",
      "Sprache": "html",
      "Link": "more/code.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<col>",
      "Beschreibung": "Definiert eine Tabelle-Spalte",
      "Sprache": "html",
      "Link": "more/col.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<colgroup>",
      "Beschreibung": "Gruppierung von Tabellenspalten",
      "Sprache": "html",
      "Link": "more/colgroup.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<data>",
      "Beschreibung": "Maschinenlesbarer Wert mit sichtbarem Text",
      "Sprache": "html",
      "Link": "more/data.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<datalist>",
      "Beschreibung": "Liste von Vorschlägen für ein Eingabefeld",
      "Sprache": "html",
      "Link": "more/datalist.html",
      "class": ["html","form"]
    },
    {
      "Begriff": "<dd>",
      "Beschreibung": "Beschreibung in einer Definitionsliste",
      "Sprache": "html",
      "Link": "more/dd.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<del>",
      "Beschreibung": "Durchgestrichener Text",
      "Sprache": "html",
      "Link": "more/del.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<details>",
      "Beschreibung": "Ein- und ausklappbarer Bereich",
      "Sprache": "html",
      "Link": "more/details.html",
      "class": ["html","interactive","container"]
    },
    {
      "Begriff": "<dfn>",
      "Beschreibung": "Definition eines Begriffs",
      "Sprache": "html",
      "Link": "more/dfn.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<dialog>",
      "Beschreibung": "Dialogfenster für Nachrichten oder Aktionen",
      "Sprache": "html",
      "Link": "more/dialog.html",
      "class": ["html","interactive","container"]
    },
    {
      "Begriff": "<div>",
      "Beschreibung": "Allzweck-Container für Layout und Struktur",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","container"]
    },
    {
      "Begriff": "<dl>",
      "Beschreibung": "Liste aus Begriffen und Erklärungen",
      "Sprache": "html",
      "Link": "more/dl.html",
      "class": ["html","liste"]
    },
    {
      "Begriff": "<dt>",
      "Beschreibung": "Begriff in einer Definitionsliste",
      "Sprache": "html",
      "Link": "more/dt.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<em>",
      "Beschreibung": "Hervorgehobener Text mit Betonung",
      "Sprache": "html",
      "Link": "more/em.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<embed>",
      "Beschreibung": "Eingebetteter externer Inhalt",
      "Sprache": "html",
      "Link": "more/embed.html",
      "class": ["html","embed"]
    },
    // F
    {
      "Begriff": "<fieldset>",
      "Beschreibung": "Gruppiert Formularfelder",
      "Sprache": "html",
      "Link": "more/fieldset.html",
      "class": ["html","form","container"]
    },
    {
      "Begriff": "<figcaption>",
      "Beschreibung": "Beschriftung für ein Figure-Element",
      "Sprache": "html",
      "Link": "more/figcaption.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<figure>",
      "Beschreibung": "Medieninhalt mit Beschreibung",
      "Sprache": "html",
      "Link": "more/figure.html",
      "class": ["html","container","media"]
    },
    {
      "Begriff": "<footer>",
      "Beschreibung": "Fußbereich eines Dokuments oder Abschnitts",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","container"]
    },
    {
      "Begriff": "<form>",
      "Beschreibung": "Formular zur Eingabe von Daten",
      "Sprache": "html",
      "Link": "more/form.html",
      "class": ["html","form","container"]
    },
    // G
    {
      "Begriff": "<g>",
      "Beschreibung": "Gruppiert SVG-Elemente",
      "Sprache": "html",
      "Link": "more/svg.html",
      "class": ["html","media"]
    },
    // H
    {
      "Begriff": "<h1>",
      "Beschreibung": "Wichtigste Überschrift",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Begriff": "<h2>",
      "Beschreibung": "Zweite Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Begriff": "<h3>",
      "Beschreibung": "Dritte Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Begriff": "<h4>",
      "Beschreibung": "Vierte Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Begriff": "<h5>",
      "Beschreibung": "Fünfte Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Begriff": "<h6>",
      "Beschreibung": "Sechste Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Begriff": "<head>",
      "Beschreibung": "Metadaten und Verweise des Dokuments",
      "Sprache": "html",
      "Link": "more/head.html",
      "class": ["basis","html","metadata","einbinden"]
    },
    {
      "Begriff": "<header>",
      "Beschreibung": "Kopfbereich einer Seite oder Sektion",
      "Sprache": "html",
      "Link": "more/header.html",
      "class": ["html","container"]
    },
    {
      "Begriff": "<hr>",
      "Beschreibung": "Horizontale Trennlinie",
      "Sprache": "html",
      "Link": "more/hr.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<html>",
      "Beschreibung": "Wurzelelement des HTML-Dokuments",
      "Sprache": "html",
      "Link": "more/html.html",
      "class": ["basis","html"]
    },
    // I
    {
      "Begriff": "<i>",
      "Beschreibung": "Kursiver Text ohne zusätzliche Semantik",
      "Sprache": "html",
      "Link": "more/i.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<iframe>",
      "Beschreibung": "Eingebettete externe Webseite",
      "Sprache": "html",
      "Link": "more/iframe.html",
      "class": ["html","embed","media"]
    },
    {
      "Begriff": "<img>",
      "Beschreibung": "Bild einfügen",
      "Sprache": "html",
      "Link": "more/img.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<input>",
      "Beschreibung": "Eingabefeld für Formulare",
      "Sprache": "html",
      "Link": "more/input.html",
      "class": ["html","form","interactive"]
    },
    {
      "Begriff": "<ins>",
      "Beschreibung": "Eingefügter Text",
      "Sprache": "html",
      "Link": "more/ins.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<kbd>",
      "Beschreibung": "Tastatureingabe darstellen",
      "Sprache": "html",
      "Link":"more/kbd.html",
      "class": ["html","text"]
    },
    // K
    {
      "Begriff": "<label>",
      "Beschreibung": "Beschriftung für ein Formularfeld",
      "Sprache": "html",
      "Link": "more/label.html",
      "class": ["html","form","text"]
    },
    {
      "Begriff": "<legend>",
      "Beschreibung": "Beschriftung für ein Fieldset",
      "Sprache": "html",
      "Link": "more/legend.html",
      "class": ["html","form","text"]
    },
    {
      "Begriff": "<li>",
      "Beschreibung": "Eintrag in einer Liste",
      "Sprache": "html",
      "Link": "more/liste.html",
      "class": ["html","liste"]
    },
    {
      "Begriff": "<link>",
      "Beschreibung": "Verknüpft externe Ressourcen oder Stile",
      "Sprache": "html",
      "Link": "more/link.html",
      "class": ["html","metadata","einbinden"]
    },
    {
      "Begriff": "<main>",
      "Beschreibung": "Hauptinhalt der Seite",
      "Sprache": "html",
      "Link": "more/main.html",
      "class": ["html","container"]
    },
    {
      "Begriff": "<map>",
      "Beschreibung": "Bild mit klickbaren Bereichen",
      "Sprache": "html",
      "Link": "more/area & map.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<mark>",
      "Beschreibung": "Hervorhebung von Text",
      "Sprache": "html",
      "Link": "more/mark.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<menu>",
      "Beschreibung": "Menü für Befehle oder Navigation",
      "Sprache": "html",
      "Link": "more/menu.html",
      "class": ["html","container"]
    },
    {
      "Begriff": "<meta>",
      "Beschreibung": "Metadaten wie Zeichensatz oder Beschreibung",
      "Sprache": "html",
      "Link": "more/meta.html",
      "class": ["html","metadata"]
    },
    {
      "Begriff": "<meter>",
      "Beschreibung": "Messwert in einem Bereich anzeigen",
      "Sprache": "html",
      "Link": "more/meter.html",
      "class": ["html","form"]
    },
    {
      "Begriff": "<nav>",
      "Beschreibung": "Navigationsbereich mit Links",
      "Sprache": "html",
      "Link": "more/nav.html",
      "class": ["html","container","semantik"]
    },
    {
      "Begriff": "<noscript>",
      "Beschreibung": "Inhalt, wenn JavaScript deaktiviert ist",
      "Sprache": "html",
      "Link": "more/noscript.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<object>",
      "Beschreibung": "Eingebetteter Inhalt oder Multimedia",
      "Sprache": "html",
      "Link": "more/object.html",
      "class": ["html","embed"]
    },
    {
      "Begriff": "<ol>",
      "Beschreibung": "Nummerierte Liste",
      "Sprache": "html",
      "Link": "more/liste.html",
      "class": ["html","liste","container"]
    },
    {
      "Begriff": "<optgroup>",
      "Beschreibung": "Gruppierung von Optionen in einem Select",
      "Sprache": "html",
      "Link": "more/optgroup.html",
      "class": ["html","form"]
    },
    {
      "Begriff": "<option>",
      "Beschreibung": "Auswahloption in einem Select-Feld",
      "Sprache": "html",
      "Link": "more/option.html",
      "class": ["html","form","text"]
    },
    {
      "Begriff": "<output>",
      "Beschreibung": "Ausgabe eines Formulars oder Skripts",
      "Sprache": "html",
      "Link": "more/output.html",
      "class": ["html","form","text"]
    },
    {
      "Begriff": "<picture>",
      "Beschreibung": "Responsive Bildquelle mit mehreren Quellen",
      "Sprache": "html",
      "Link": "more/picture.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<pre>",
      "Beschreibung": "Vorformatierter Text mit festen Abständen",
      "Sprache": "html",
      "Link": "more/computer-text.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<progress>",
      "Beschreibung": "Fortschrittsanzeige",
      "Sprache": "html",
      "Link": "more/meter.html",
      "class": ["html","form"]
    },
    // Q
    {
      "Begriff": "<q>",
      "Beschreibung": "Kurz-Zitat innerhalb eines Textes",
      "Sprache": "html",
      "Link": "more/blockquote.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<ruby>",
      "Beschreibung": "Text mit Aussprachehilfe",
      "Sprache": "html",
      "Link": "more/ruby.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<rp>",
      "Beschreibung": "Text für Browser ohne Ruby-Unterstützung",
      "Sprache": "html",
      "Link": "more/ruby.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<rt>",
      "Beschreibung": "Ruby-Text zur Aussprache",
      "Sprache": "html",
      "Link": "more/ruby.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<s>",
      "Beschreibung": "Durchgestrichener Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<samp>",
      "Beschreibung": "Beispielausgabe eines Programms",
      "Sprache": "html",
      "Link": "more/computer-text.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<script>",
      "Beschreibung": "JavaScript oder andere Skripte einbinden",
      "Sprache": "html",
      "Link": "more/script.html",
      "class": ["html","einbinden"]
    },
    {
      "Begriff": "<section>",
      "Beschreibung": "Thematischer Abschnitt einer Seite",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","container","semantik"]
    },
    {
      "Begriff": "<select>",
      "Beschreibung": "Auswahlmenü im Formular",
      "Sprache": "html",
      "Link": "more/select.html",
      "class": ["html","form","interactive"]
    },
    {
      "Begriff": "<small>",
      "Beschreibung": "Kleinerer Nebentext",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<source>",
      "Beschreibung": "Quelle für Audio, Video oder Bild",
      "Sprache": "html",
      "Link": "more/picture.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<span>",
      "Beschreibung": "Inline-Container für Styling oder Text",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<strong>",
      "Beschreibung": "Wichtig hervorgehobener Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<style>",
      "Beschreibung": "CSS direkt im Dokument",
      "Sprache": "html",
      "Link": "more/style.html",
      "class": ["html","css","einbinden"]
    },
    {
      "Begriff": "<sub>",
      "Beschreibung": "Tiefgestellter Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<summary>",
      "Beschreibung": "Zusammenfassung für details",
      "Sprache": "html",
      "Link": "more/details.html",
      "class": ["html","interactive","text"]
    },
    {
      "Begriff": "<sup>",
      "Beschreibung": "Hochgestellter Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<svg>",
      "Beschreibung": "Vektorgrafik im HTML-Dokument",
      "Sprache": "html",
      "Link": "more/svg.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<table>",
      "Beschreibung": "Tabelle mit Zeilen und Spalten",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle","container"]
    },
    {
      "Begriff": "<tbody>",
      "Beschreibung": "Hauptbereich einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<td>",
      "Beschreibung": "Zelle in einer Tabellenzeile",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<template>",
      "Beschreibung": "Vorlage für wiederverwendbaren HTML-Code",
      "Sprache": "html",
      "Link": "more/template-tag.html",
      "class": ["html","container"]
    },
    {
      "Begriff": "<textarea>",
      "Beschreibung": "Mehrzeiliges Texteingabefeld",
      "Sprache": "html",
      "Link": "more/textarea.html",
      "class": ["html","form","interactive"]
    },
    {
      "Begriff": "<tfoot>",
      "Beschreibung": "Fußbereich einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<th>",
      "Beschreibung": "Kopfzelle einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<thead>",
      "Beschreibung": "Kopfbereich einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<time>",
      "Beschreibung": "Datum oder Uhrzeit markieren",
      "Sprache": "html",
      "Link": "more/time.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<title>",
      "Beschreibung": "Titel des Dokuments im Browser-Tab",
      "Sprache": "html",
      "Link": "more/head.html",
      "class": ["html","metadata"]
    },
    {
      "Begriff": "<tr>",
      "Beschreibung": "Zeile in einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Begriff": "<track>",
      "Beschreibung": "Untertitel oder Textspur für Video/Audio",
      "Sprache": "html",
      "Link": "more/video.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<u>",
      "Beschreibung": "Unterstrichener Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<ul>",
      "Beschreibung": "Ungeordnete Liste mit Punkten",
      "Sprache": "html",
      "Link": "more/liste.html",
      "class": ["html","liste","container"]
    },
    {
      "Begriff": "<var>",
      "Beschreibung": "Variable oder Ausdruck im Text",
      "Sprache": "html",
      "Link": "more/computer-text.html",
      "class": ["html","text"]
    },
    {
      "Begriff": "<video>",
      "Beschreibung": "Einbettung von Videodateien",
      "Sprache": "html",
      "Link": "more/video.html",
      "class": ["html","media"]
    },
    {
      "Begriff": "<wbr>",
      "Beschreibung": "Optionale Zeilenumbruchstelle",
      "Sprache": "html",
      "Link": "more/br.html",
      "class": ["html","text"]
    },
    // CSS
    {
      "Begriff": "HTML",
      "Beschreibung": "Struktur und Inhalt von Webseiten",
      "Sprache": "html",
      "Link": "more/html-sprache.html",
      "class": ["html","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "CSS",
      "Beschreibung": "Aussehen und Layout von Webseiten",
      "Sprache": "CSS",
      "Link": "more/css-sprache.html",
      "class": ["css","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "JavaScript",
      "Beschreibung": "Macht Webseiten interaktiv",
      "Sprache": "JS",
      "Link": "more/javascript-sprache.html",
      "class": ["javascript","js","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "C++",
      "Beschreibung": "Schnelle Sprache für Programme und Spiele",
      "Sprache": "C++",
      "Link": "more/cpp-sprache.html",
      "class": ["cpp","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "Typselektor",
      "Beschreibung": "Wählt alle Elemente des angegebenen Typs aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Klassenselektor",
      "Beschreibung": "Wählt Elemente nach ihrer CSS-Klasse aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "ID-Selektor",
      "Beschreibung": "Wählt Elemente anhand ihres id-Attributs aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Universalselektor",
      "Beschreibung": "Wählt alle Elemente auf der Seite aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Kindselektoren",
      "Beschreibung": "Wählt direkte Kinder eines Elements aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Nachfahrensselektoren",
      "Beschreibung": "Wählt Nachfahren eines Elements aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Allgemeine Geschwisterselektoren",
      "Beschreibung": "Wählt nachfolgende Geschwisterelemente aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Angrenzende Geschwisterselektoren",
      "Beschreibung": "Direkt folgendes Geschwisterelement (+)",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "Attributselektor",
      "Beschreibung": "Wählt Elemente nach Attributwert aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    // C++
    {
      "Begriff": "#include",
      "Beschreibung": "Bibliotheken und Header einbinden",
      "Sprache": "C++",
      "Link": "more/include.html",
      "class": ["cpp","praeprozessor"]
    },
    {
      "Begriff": "using namespace",
      "Beschreibung": "Namespace ohne std:: benutzen",
      "Sprache": "C++",
      "Link": "more/using-namespace.html",
      "class": ["cpp","namespace"]
    },
    {
      "Begriff": "int main()",
      "Beschreibung": "Startpunkt jedes C++-Programms",
      "Sprache": "C++",
      "Link": "more/cpp-main.html",
      "class": ["cpp","funktion","basis"]
    },
    {
      "Begriff": "std::cout",
      "Beschreibung": "Text in der Konsole ausgeben",
      "Sprache": "C++",
      "Link": "more/cout.html",
      "class": ["cpp","io","ausgabe"]
    },
    {
      "Begriff": "std::cin",
      "Beschreibung": "Eingabe von der Tastatur lesen",
      "Sprache": "C++",
      "Link": "more/cin.html",
      "class": ["cpp","io","eingabe"]
    },
    {
      "Begriff": "int, float, string, bool",
      "Beschreibung": "Grundlegende Datentypen in C++",
      "Sprache": "C++",
      "Link": "more/datatypes.html",
      "class": ["cpp","datentyp","basis"]
    },
    {
      "Begriff": "Variablen",
      "Beschreibung": "Werte mit Typ und Namen speichern",
      "Sprache": "C++",
      "Link": "more/variable.html",
      "class": ["cpp","variable"]
    },
    {
      "Begriff": "for-Schleife",
      "Beschreibung": "Code feste Anzahl Male wiederholen",
      "Sprache": "C++",
      "Link": "more/for-loop.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Begriff": "while-Schleife",
      "Beschreibung": "Wiederholen, solange Bedingung gilt",
      "Sprache": "C++",
      "Link": "more/while-loop.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Begriff": "if-else",
      "Beschreibung": "Code nur unter einer Bedingung ausführen",
      "Sprache": "C++",
      "Link": "more/if-else.html",
      "class": ["cpp","bedingung","kontrolle"]
    },
    {
      "Begriff": "Funktionen",
      "Beschreibung": "Wiederverwendbare Codeblöcke",
      "Sprache": "C++",
      "Link": "more/function.html",
      "class": ["cpp","funktion"]
    },
    {
      "Begriff": "Zeiger (*)",
      "Beschreibung": "Speichert die Adresse einer Variable",
      "Sprache": "C++",
      "Link": "more/pointer.html",
      "class": ["cpp","zeiger","speicher"]
    },
    {
      "Begriff": "Referenzen (&)",
      "Beschreibung": "Zweiter Name für eine Variable",
      "Sprache": "C++",
      "Link": "more/reference.html",
      "class": ["cpp","referenz","speicher"]
    },
    {
      "Begriff": "Klasse",
      "Beschreibung": "Bauplan für Objekte",
      "Sprache": "C++",
      "Link": "more/cpp-class.html",
      "class": ["cpp","klasse","oop"]
    },
    // CSS – Eigenschaften & Konzepte
    {
      "Begriff": "CSS-Regel",
      "Beschreibung": "Selektor { Eigenschaft: Wert; }",
      "Sprache": "CSS",
      "Link": "more/css-grundlagen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Begriff": "Kaskade & Spezifität",
      "Beschreibung": "Welche CSS-Regel gewinnt, wenn mehrere gelten",
      "Sprache": "CSS",
      "Link": "more/css-grundlagen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Begriff": "Vererbung (inherit)",
      "Beschreibung": "Eigenschaften, die Kind-Elemente übernehmen",
      "Sprache": "CSS",
      "Link": "more/css-grundlagen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Begriff": "color",
      "Beschreibung": "Textfarbe",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Begriff": "background",
      "Beschreibung": "Hintergrundfarbe, -bild und Farbverläufe",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Begriff": "Farbformate (hex, rgb, hsl)",
      "Beschreibung": "Schreibweisen für Farben",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Begriff": "opacity",
      "Beschreibung": "Durchsichtigkeit eines Elements",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Begriff": "font-family / font-size",
      "Beschreibung": "Schriftart und Schriftgröße",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Begriff": "font-weight",
      "Beschreibung": "Schriftdicke (normal, fett)",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Begriff": "line-height",
      "Beschreibung": "Zeilenabstand",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Begriff": "text-align",
      "Beschreibung": "Textausrichtung (links, zentriert, rechts)",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Begriff": "text-decoration / text-transform",
      "Beschreibung": "Unterstreichen, Großbuchstaben usw.",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Begriff": "@font-face",
      "Beschreibung": "Eigene Schriftarten einbinden",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Begriff": "Box-Modell",
      "Beschreibung": "Inhalt, padding, border und margin einer Box",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "margin",
      "Beschreibung": "Außenabstand eines Elements",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "padding",
      "Beschreibung": "Innenabstand eines Elements",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "border / border-radius",
      "Beschreibung": "Rahmen und abgerundete Ecken",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout","gestaltung"]
    },
    {
      "Begriff": "width / height",
      "Beschreibung": "Breite und Höhe (auch min-/max-)",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "box-sizing",
      "Beschreibung": "Ob padding und border zur Breite zählen",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "box-shadow",
      "Beschreibung": "Schatten um eine Box",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","gestaltung"]
    },
    {
      "Begriff": "overflow",
      "Beschreibung": "Umgang mit überstehendem Inhalt",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "Einheiten (px, rem, %, vw)",
      "Beschreibung": "Größenangaben in CSS",
      "Sprache": "CSS",
      "Link": "more/css-einheiten.html",
      "class": ["css","grundlagen"]
    },
    {
      "Begriff": "calc() / clamp()",
      "Beschreibung": "Mit Werten rechnen und begrenzen",
      "Sprache": "CSS",
      "Link": "more/css-einheiten.html",
      "class": ["css","grundlagen"]
    },
    {
      "Begriff": "display",
      "Beschreibung": "block, inline, inline-block, none",
      "Sprache": "CSS",
      "Link": "more/css-display.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "visibility",
      "Beschreibung": "Element unsichtbar machen, Platz bleibt",
      "Sprache": "CSS",
      "Link": "more/css-display.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "Flexbox",
      "Beschreibung": "Elemente in Reihe oder Spalte anordnen",
      "Sprache": "CSS",
      "Link": "more/css-flexbox.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "justify-content / align-items",
      "Beschreibung": "Ausrichtung in Flexbox und Grid",
      "Sprache": "CSS",
      "Link": "more/css-flexbox.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "gap",
      "Beschreibung": "Abstand zwischen Flex- und Grid-Elementen",
      "Sprache": "CSS",
      "Link": "more/css-flexbox.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "Grid",
      "Beschreibung": "Zweidimensionales Raster-Layout",
      "Sprache": "CSS",
      "Link": "more/css-grid.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "grid-template-columns",
      "Beschreibung": "Spalten eines Grids festlegen",
      "Sprache": "CSS",
      "Link": "more/css-grid.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "position",
      "Beschreibung": "static, relative, absolute, fixed, sticky",
      "Sprache": "CSS",
      "Link": "more/css-position.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "z-index",
      "Beschreibung": "Stapelreihenfolge überlappender Elemente",
      "Sprache": "CSS",
      "Link": "more/css-position.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": ":hover / :focus",
      "Beschreibung": "Pseudoklassen für Zustände",
      "Sprache": "CSS",
      "Link": "more/css-pseudo.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": ":nth-child()",
      "Beschreibung": "Elemente nach Position auswählen",
      "Sprache": "CSS",
      "Link": "more/css-pseudo.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "::before / ::after",
      "Beschreibung": "Pseudoelemente: Inhalt vor/nach einem Element",
      "Sprache": "CSS",
      "Link": "more/css-pseudo.html",
      "class": ["css","selektoren"]
    },
    {
      "Begriff": "@media",
      "Beschreibung": "Media Queries für Responsive Design",
      "Sprache": "CSS",
      "Link": "more/css-media-queries.html",
      "class": ["css","layout"]
    },
    {
      "Begriff": "CSS-Variablen (--name)",
      "Beschreibung": "Wiederverwendbare Werte mit var()",
      "Sprache": "CSS",
      "Link": "more/css-variablen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Begriff": "transition",
      "Beschreibung": "Weicher Übergang zwischen zwei Zuständen",
      "Sprache": "CSS",
      "Link": "more/css-animation.html",
      "class": ["css","effekte"]
    },
    {
      "Begriff": "transform",
      "Beschreibung": "Verschieben, drehen, skalieren",
      "Sprache": "CSS",
      "Link": "more/css-animation.html",
      "class": ["css","effekte"]
    },
    {
      "Begriff": "@keyframes / animation",
      "Beschreibung": "Eigene Animationen definieren",
      "Sprache": "CSS",
      "Link": "more/css-animation.html",
      "class": ["css","effekte"]
    },
    {
      "Begriff": "cursor",
      "Beschreibung": "Mauszeiger über einem Element",
      "Sprache": "CSS",
      "Link": "more/css-sonstiges.html",
      "class": ["css","gestaltung"]
    },
    {
      "Begriff": "list-style",
      "Beschreibung": "Aufzählungszeichen von Listen",
      "Sprache": "CSS",
      "Link": "more/css-sonstiges.html",
      "class": ["css","gestaltung"]
    },
    {
      "Begriff": "object-fit / aspect-ratio",
      "Beschreibung": "Bilder in Boxen einpassen, Seitenverhältnis",
      "Sprache": "CSS",
      "Link": "more/css-sonstiges.html",
      "class": ["css","gestaltung"]
    },
    // JavaScript – Grundlagen, Daten, DOM
    {
      "Begriff": "let / const",
      "Beschreibung": "Variablen anlegen",
      "Sprache": "JS",
      "Link": "more/js-variablen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Datentypen (string, number, boolean)",
      "Beschreibung": "Grundtypen in JavaScript",
      "Sprache": "JS",
      "Link": "more/js-variablen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "typeof",
      "Beschreibung": "Datentyp eines Werts prüfen",
      "Sprache": "JS",
      "Link": "more/js-variablen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Operatoren (+ - * / %)",
      "Beschreibung": "Rechnen in JavaScript",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "=== / !==",
      "Beschreibung": "Streng vergleichen (Wert und Typ)",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "&& / || / !",
      "Beschreibung": "Logisches UND, ODER, NICHT",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "? : (Ternär)",
      "Beschreibung": "Kurzes if/else in einer Zeile",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen","kontrolle"]
    },
    {
      "Begriff": "if / else",
      "Beschreibung": "Code nur unter einer Bedingung ausführen",
      "Sprache": "JS",
      "Link": "more/js-bedingungen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Begriff": "switch",
      "Beschreibung": "Mehrere feste Fälle unterscheiden",
      "Sprache": "JS",
      "Link": "more/js-bedingungen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Begriff": "for",
      "Beschreibung": "Schleife mit Zähler",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Begriff": "while / do…while",
      "Beschreibung": "Schleife solange eine Bedingung gilt",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Begriff": "for…of / for…in",
      "Beschreibung": "Über Arrays bzw. Objekt-Schlüssel laufen",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Begriff": "break / continue",
      "Beschreibung": "Schleife abbrechen / Runde überspringen",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Begriff": "function",
      "Beschreibung": "Funktion deklarieren",
      "Sprache": "JS",
      "Link": "more/js-funktionen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "=> (Pfeilfunktion)",
      "Beschreibung": "Kurze Schreibweise für Funktionen",
      "Sprache": "JS",
      "Link": "more/js-funktionen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "return",
      "Beschreibung": "Wert aus einer Funktion zurückgeben",
      "Sprache": "JS",
      "Link": "more/js-funktionen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Array",
      "Beschreibung": "Liste von Werten",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "push / pop",
      "Beschreibung": "Elemente hinten anfügen / entfernen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "forEach",
      "Beschreibung": "Für jedes Array-Element etwas ausführen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "map",
      "Beschreibung": "Jedes Element umwandeln → neues Array",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "filter",
      "Beschreibung": "Passende Elemente auswählen → neues Array",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "find / includes",
      "Beschreibung": "Element suchen / Enthaltensein prüfen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "sort",
      "Beschreibung": "Array sortieren",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "reduce",
      "Beschreibung": "Array zu einem Wert zusammenfassen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Objekt",
      "Beschreibung": "Daten als Schlüssel-Wert-Paare",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Destructuring",
      "Beschreibung": "Werte aus Objekten/Arrays auspacken",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "... (Spread)",
      "Beschreibung": "Arrays/Objekte kopieren und zusammenführen",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "JSON",
      "Beschreibung": "JSON.stringify / JSON.parse",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Template-String",
      "Beschreibung": "Text mit ${Variablen} in Backticks",
      "Sprache": "JS",
      "Link": "more/js-strings.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "String-Methoden",
      "Beschreibung": "toUpperCase, trim, includes, split, slice …",
      "Sprache": "JS",
      "Link": "more/js-strings.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "document.querySelector",
      "Beschreibung": "Element per CSS-Selektor finden",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "getElementById",
      "Beschreibung": "Element über seine ID finden",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "textContent / innerHTML",
      "Beschreibung": "Inhalt eines Elements lesen/ändern",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "classList",
      "Beschreibung": "CSS-Klassen hinzufügen, entfernen, umschalten",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "createElement / appendChild",
      "Beschreibung": "Neue Elemente erzeugen und einfügen",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "dataset",
      "Beschreibung": "data-*-Attribute auslesen",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "addEventListener",
      "Beschreibung": "Auf Ereignisse wie Klicks reagieren",
      "Sprache": "JS",
      "Link": "more/js-events.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "event.preventDefault()",
      "Beschreibung": "Standardverhalten des Browsers verhindern",
      "Sprache": "JS",
      "Link": "more/js-events.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "console.log",
      "Beschreibung": "Ausgabe in der Browser-Konsole",
      "Sprache": "JS",
      "Link": "more/js-konsole.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Begriff": "try / catch",
      "Beschreibung": "Fehler abfangen",
      "Sprache": "JS",
      "Link": "more/js-konsole.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Begriff": "setTimeout / setInterval",
      "Beschreibung": "Code verzögert oder wiederholt ausführen",
      "Sprache": "JS",
      "Link": "more/js-async.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Begriff": "async / await",
      "Beschreibung": "Auf asynchrone Vorgänge warten",
      "Sprache": "JS",
      "Link": "more/js-async.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Begriff": "fetch",
      "Beschreibung": "Daten aus dem Netz laden",
      "Sprache": "JS",
      "Link": "more/js-async.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Begriff": "localStorage",
      "Beschreibung": "Daten im Browser speichern",
      "Sprache": "JS",
      "Link": "more/js-speicher.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Math",
      "Beschreibung": "Runden, Zufallszahlen, Wurzel …",
      "Sprache": "JS",
      "Link": "more/js-mathe.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Date",
      "Beschreibung": "Datum und Uhrzeit",
      "Sprache": "JS",
      "Link": "more/js-mathe.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "import / export",
      "Beschreibung": "Code auf Module verteilen",
      "Sprache": "JS",
      "Link": "more/js-module.html",
      "class": ["javascript","js","werkzeuge"]
    },
    // C++ – weiterführende Themen
    {
      "Begriff": "Operatoren (+ - * / %)",
      "Beschreibung": "Rechnen, Rest, Kurzformen wie +=",
      "Sprache": "C++",
      "Link": "more/cpp-operatoren.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Begriff": "== / != / && / ||",
      "Beschreibung": "Vergleichen und logisch verknüpfen",
      "Sprache": "C++",
      "Link": "more/cpp-operatoren.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Begriff": "static_cast",
      "Beschreibung": "Datentypen sicher umwandeln",
      "Sprache": "C++",
      "Link": "more/cpp-operatoren.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Begriff": "stoi / to_string",
      "Beschreibung": "Text in Zahl umwandeln und zurück",
      "Sprache": "C++",
      "Link": "more/cpp-string.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "switch",
      "Beschreibung": "Mehrere feste Fälle unterscheiden",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","kontrolle"]
    },
    {
      "Begriff": "do-while-Schleife",
      "Beschreibung": "Schleife, die mindestens einmal läuft",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Begriff": "break / continue",
      "Beschreibung": "Schleife abbrechen / Runde überspringen",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","kontrolle"]
    },
    {
      "Begriff": "Bereichsbasierte for-Schleife",
      "Beschreibung": "for (auto& x : container)",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Begriff": "Array (C-Array)",
      "Beschreibung": "Feste Anzahl Werte gleichen Typs",
      "Sprache": "C++",
      "Link": "more/cpp-arrays.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "std::array",
      "Beschreibung": "Modernes Array mit fester Größe",
      "Sprache": "C++",
      "Link": "more/cpp-arrays.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "std::vector",
      "Beschreibung": "Dynamische Liste, wächst automatisch",
      "Sprache": "C++",
      "Link": "more/cpp-vector.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "push_back / size",
      "Beschreibung": "Element anhängen, Anzahl abfragen",
      "Sprache": "C++",
      "Link": "more/cpp-vector.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "std::string",
      "Beschreibung": "Text speichern und bearbeiten",
      "Sprache": "C++",
      "Link": "more/cpp-string.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "getline",
      "Beschreibung": "Ganze Zeile mit Leerzeichen einlesen",
      "Sprache": "C++",
      "Link": "more/cpp-string.html",
      "class": ["cpp","io","eingabe"]
    },
    {
      "Begriff": "const",
      "Beschreibung": "Unveränderliche Werte",
      "Sprache": "C++",
      "Link": "more/cpp-const-auto.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Begriff": "constexpr",
      "Beschreibung": "Zur Compile-Zeit berechnete Konstanten",
      "Sprache": "C++",
      "Link": "more/cpp-const-auto.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Begriff": "auto",
      "Beschreibung": "Typ vom Compiler bestimmen lassen",
      "Sprache": "C++",
      "Link": "more/cpp-const-auto.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Begriff": "struct",
      "Beschreibung": "Eigener Datentyp aus mehreren Werten",
      "Sprache": "C++",
      "Link": "more/cpp-struct-enum.html",
      "class": ["cpp","daten","oop"]
    },
    {
      "Begriff": "enum class",
      "Beschreibung": "Benannte feste Auswahlmöglichkeiten",
      "Sprache": "C++",
      "Link": "more/cpp-struct-enum.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "Konstruktor / Destruktor",
      "Beschreibung": "Objekt erzeugen und aufräumen",
      "Sprache": "C++",
      "Link": "more/cpp-konstruktor.html",
      "class": ["cpp","oop","klasse"]
    },
    {
      "Begriff": "public / private / protected",
      "Beschreibung": "Zugriffsrechte in Klassen (Kapselung)",
      "Sprache": "C++",
      "Link": "more/cpp-konstruktor.html",
      "class": ["cpp","oop","klasse"]
    },
    {
      "Begriff": "this",
      "Beschreibung": "Zeiger auf das aktuelle Objekt",
      "Sprache": "C++",
      "Link": "more/cpp-konstruktor.html",
      "class": ["cpp","oop","klasse"]
    },
    {
      "Begriff": "Vererbung",
      "Beschreibung": "Klasse von einer Basisklasse ableiten",
      "Sprache": "C++",
      "Link": "more/cpp-vererbung.html",
      "class": ["cpp","oop"]
    },
    {
      "Begriff": "virtual / override",
      "Beschreibung": "Methoden überschreiben, Polymorphie",
      "Sprache": "C++",
      "Link": "more/cpp-vererbung.html",
      "class": ["cpp","oop"]
    },
    {
      "Begriff": "new / delete",
      "Beschreibung": "Speicher auf dem Heap anlegen und freigeben",
      "Sprache": "C++",
      "Link": "more/cpp-speicher.html",
      "class": ["cpp","speicher"]
    },
    {
      "Begriff": "Smart Pointer (unique_ptr)",
      "Beschreibung": "Automatische Speicherverwaltung",
      "Sprache": "C++",
      "Link": "more/cpp-speicher.html",
      "class": ["cpp","speicher"]
    },
    {
      "Begriff": "std::map",
      "Beschreibung": "Werte über Schlüssel nachschlagen",
      "Sprache": "C++",
      "Link": "more/cpp-map.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "std::set",
      "Beschreibung": "Menge ohne doppelte Werte",
      "Sprache": "C++",
      "Link": "more/cpp-map.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "std::pair",
      "Beschreibung": "Zwei Werte als Paar",
      "Sprache": "C++",
      "Link": "more/cpp-map.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "Lambda",
      "Beschreibung": "Kleine Funktion direkt im Code",
      "Sprache": "C++",
      "Link": "more/cpp-algorithmen.html",
      "class": ["cpp","funktion"]
    },
    {
      "Begriff": "std::sort",
      "Beschreibung": "Container sortieren",
      "Sprache": "C++",
      "Link": "more/cpp-algorithmen.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "std::find / std::count",
      "Beschreibung": "Suchen und Zählen in Containern",
      "Sprache": "C++",
      "Link": "more/cpp-algorithmen.html",
      "class": ["cpp","daten"]
    },
    {
      "Begriff": "Zufallszahlen (<random>)",
      "Beschreibung": "mt19937 und uniform_int_distribution",
      "Sprache": "C++",
      "Link": "more/cpp-zufall.html",
      "class": ["cpp","werkzeuge"]
    },
    {
      "Begriff": "Header-Dateien (.h)",
      "Beschreibung": "Code auf mehrere Dateien verteilen",
      "Sprache": "C++",
      "Link": "more/cpp-header.html",
      "class": ["cpp","werkzeuge","praeprozessor"]
    },
    {
      "Begriff": "#pragma once",
      "Beschreibung": "Header nur einmal einbinden",
      "Sprache": "C++",
      "Link": "more/cpp-header.html",
      "class": ["cpp","werkzeuge","praeprozessor"]
    },
    {
      "Begriff": "try / catch / throw",
      "Beschreibung": "Exceptions werfen und abfangen",
      "Sprache": "C++",
      "Link": "more/cpp-fehler.html",
      "class": ["cpp","werkzeuge"]
    },
    {
      "Begriff": "std::cerr",
      "Beschreibung": "Ausgabe auf dem Fehlerkanal",
      "Sprache": "C++",
      "Link": "more/cpp-fehler.html",
      "class": ["cpp","io","ausgabe"]
    },
    {
      "Begriff": "fstream",
      "Beschreibung": "Dateien lesen und schreiben",
      "Sprache": "C++",
      "Link": "more/cpp-dateien.html",
      "class": ["cpp","io","werkzeuge"]
    },
    {
      "Begriff": "template",
      "Beschreibung": "Funktionen/Klassen für beliebige Typen",
      "Sprache": "C++",
      "Link": "more/cpp-templates.html",
      "class": ["cpp","funktion"]
    },
    {
      "Begriff": "g++ / Kompilieren",
      "Beschreibung": "Vom Quellcode zum Programm",
      "Sprache": "C++",
      "Link": "more/cpp-kompilieren.html",
      "class": ["cpp","werkzeuge"]
    },
    {
      "Begriff": "CMake",
      "Beschreibung": "Build-System für C++-Projekte",
      "Sprache": "C++",
      "Link": "more/cpp-kompilieren.html",
      "class": ["cpp","werkzeuge"]
    },
    // Node.js
    {
      "Begriff": "Node.js",
      "Beschreibung": "JavaScript außerhalb des Browsers",
      "Sprache": "Node.js",
      "Link": "more/node-einfuehrung.html",
      "class": ["node.js","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "node datei.js",
      "Beschreibung": "Ein Skript mit Node.js ausführen",
      "Sprache": "Node.js",
      "Link": "more/node-einfuehrung.html",
      "class": ["node.js","grundlagen","werkzeuge"]
    },
    {
      "Begriff": "npm install",
      "Beschreibung": "Pakete installieren",
      "Sprache": "Node.js",
      "Link": "more/node-npm.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "package.json",
      "Beschreibung": "Projektdatei mit Skripten und Paketen",
      "Sprache": "Node.js",
      "Link": "more/node-npm.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "npm run",
      "Beschreibung": "Skripte aus package.json starten",
      "Sprache": "Node.js",
      "Link": "more/node-npm.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "import / require",
      "Beschreibung": "Module in Node.js laden (ESM / CommonJS)",
      "Sprache": "Node.js",
      "Link": "more/node-module.html",
      "class": ["node.js","grundlagen"]
    },
    {
      "Begriff": "path",
      "Beschreibung": "Pfade sicher zusammensetzen",
      "Sprache": "Node.js",
      "Link": "more/node-module.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "fs (readFile / writeFile)",
      "Beschreibung": "Dateien lesen und schreiben",
      "Sprache": "Node.js",
      "Link": "more/node-dateien.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "http.createServer",
      "Beschreibung": "Einfachen Webserver starten",
      "Sprache": "Node.js",
      "Link": "more/node-http.html",
      "class": ["node.js","server"]
    },
    {
      "Begriff": "Express",
      "Beschreibung": "Framework für Webserver und APIs",
      "Sprache": "Node.js",
      "Link": "more/node-express.html",
      "class": ["node.js","server"]
    },
    {
      "Begriff": "app.get / app.post",
      "Beschreibung": "Routen in Express definieren",
      "Sprache": "Node.js",
      "Link": "more/node-express.html",
      "class": ["node.js","server"]
    },
    {
      "Begriff": "req / res",
      "Beschreibung": "Anfrage und Antwort im Server",
      "Sprache": "Node.js",
      "Link": "more/node-express.html",
      "class": ["node.js","server"]
    },
    {
      "Begriff": "process.argv",
      "Beschreibung": "Kommandozeilen-Argumente lesen",
      "Sprache": "Node.js",
      "Link": "more/node-process.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "process.env / .env",
      "Beschreibung": "Umgebungsvariablen und Geheimnisse",
      "Sprache": "Node.js",
      "Link": "more/node-process.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Begriff": "node:sqlite / mysql2",
      "Beschreibung": "Datenbank aus Node.js ansprechen",
      "Sprache": "Node.js",
      "Link": "more/node-datenbank.html",
      "class": ["node.js","server","daten"]
    },
    // SQL
    {
      "Begriff": "SQL",
      "Beschreibung": "Sprache für relationale Datenbanken",
      "Sprache": "SQL",
      "Link": "more/sql-einfuehrung.html",
      "class": ["sql","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "CREATE TABLE",
      "Beschreibung": "Tabelle mit Spalten und Datentypen anlegen",
      "Sprache": "SQL",
      "Link": "more/sql-tabellen.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "PRIMARY KEY",
      "Beschreibung": "Eindeutige ID einer Zeile",
      "Sprache": "SQL",
      "Link": "more/sql-tabellen.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "ALTER / DROP TABLE",
      "Beschreibung": "Tabelle ändern oder löschen",
      "Sprache": "SQL",
      "Link": "more/sql-tabellen.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "SELECT",
      "Beschreibung": "Daten abfragen",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "WHERE",
      "Beschreibung": "Zeilen filtern",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "ORDER BY / LIMIT",
      "Beschreibung": "Sortieren und begrenzen",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "LIKE / IN / BETWEEN",
      "Beschreibung": "Muster, Listen und Bereiche prüfen",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "INSERT INTO",
      "Beschreibung": "Datensatz einfügen",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "UPDATE",
      "Beschreibung": "Datensätze ändern",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "DELETE",
      "Beschreibung": "Datensätze löschen",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "Transaktion (BEGIN / COMMIT)",
      "Beschreibung": "Mehrere Änderungen ganz oder gar nicht",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "COUNT / SUM / AVG",
      "Beschreibung": "Zählen, summieren, Durchschnitt",
      "Sprache": "SQL",
      "Link": "more/sql-aggregat.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "GROUP BY / HAVING",
      "Beschreibung": "Ergebnisse gruppieren und Gruppen filtern",
      "Sprache": "SQL",
      "Link": "more/sql-aggregat.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "JOIN",
      "Beschreibung": "Tabellen verbinden",
      "Sprache": "SQL",
      "Link": "more/sql-joins.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "FOREIGN KEY",
      "Beschreibung": "Verweis auf eine andere Tabelle",
      "Sprache": "SQL",
      "Link": "more/sql-joins.html",
      "class": ["sql","daten"]
    },
    {
      "Begriff": "SQL-Injection",
      "Beschreibung": "Sicherheitslücke und wie Platzhalter schützen",
      "Sprache": "SQL",
      "Link": "more/sql-sicherheit.html",
      "class": ["sql","werkzeuge"]
    },
    // PHP
    {
      "Begriff": "PHP",
      "Beschreibung": "Server-Sprache, die HTML-Seiten erzeugt",
      "Sprache": "PHP",
      "Link": "more/php-einfuehrung.html",
      "class": ["php","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "<?php ?> / echo",
      "Beschreibung": "PHP-Code einbetten und ausgeben",
      "Sprache": "PHP",
      "Link": "more/php-einfuehrung.html",
      "class": ["php","grundlagen"]
    },
    {
      "Begriff": "$variable",
      "Beschreibung": "Variablen in PHP",
      "Sprache": "PHP",
      "Link": "more/php-grundlagen.html",
      "class": ["php","grundlagen"]
    },
    {
      "Begriff": ". (Verkettung)",
      "Beschreibung": "Texte in PHP verbinden",
      "Sprache": "PHP",
      "Link": "more/php-grundlagen.html",
      "class": ["php","grundlagen"]
    },
    {
      "Begriff": "var_dump / print_r",
      "Beschreibung": "Werte zum Debuggen ausgeben",
      "Sprache": "PHP",
      "Link": "more/php-grundlagen.html",
      "class": ["php","werkzeuge"]
    },
    {
      "Begriff": "if / elseif / match",
      "Beschreibung": "Bedingungen in PHP",
      "Sprache": "PHP",
      "Link": "more/php-kontrolle.html",
      "class": ["php","kontrolle"]
    },
    {
      "Begriff": "foreach",
      "Beschreibung": "Über Arrays laufen",
      "Sprache": "PHP",
      "Link": "more/php-kontrolle.html",
      "class": ["php","kontrolle"]
    },
    {
      "Begriff": "function (PHP)",
      "Beschreibung": "Eigene Funktionen mit Typangaben",
      "Sprache": "PHP",
      "Link": "more/php-funktionen.html",
      "class": ["php","funktion"]
    },
    {
      "Begriff": "include / require",
      "Beschreibung": "Andere PHP-Dateien einbinden",
      "Sprache": "PHP",
      "Link": "more/php-funktionen.html",
      "class": ["php","einbinden"]
    },
    {
      "Begriff": "Array (PHP)",
      "Beschreibung": "Indizierte und assoziative Arrays",
      "Sprache": "PHP",
      "Link": "more/php-arrays.html",
      "class": ["php","daten"]
    },
    {
      "Begriff": "array_map / array_filter",
      "Beschreibung": "Arrays umwandeln und filtern",
      "Sprache": "PHP",
      "Link": "more/php-arrays.html",
      "class": ["php","daten"]
    },
    {
      "Begriff": "$_GET / $_POST",
      "Beschreibung": "Formulardaten empfangen",
      "Sprache": "PHP",
      "Link": "more/php-formulare.html",
      "class": ["php","form","server"]
    },
    {
      "Begriff": "htmlspecialchars",
      "Beschreibung": "Ausgaben gegen XSS absichern",
      "Sprache": "PHP",
      "Link": "more/php-formulare.html",
      "class": ["php","form","werkzeuge"]
    },
    {
      "Begriff": "session_start / $_SESSION",
      "Beschreibung": "Daten über mehrere Seiten merken",
      "Sprache": "PHP",
      "Link": "more/php-sessions.html",
      "class": ["php","server"]
    },
    {
      "Begriff": "setcookie",
      "Beschreibung": "Cookies setzen",
      "Sprache": "PHP",
      "Link": "more/php-sessions.html",
      "class": ["php","server"]
    },
    {
      "Begriff": "password_hash",
      "Beschreibung": "Passwörter sicher speichern",
      "Sprache": "PHP",
      "Link": "more/php-sessions.html",
      "class": ["php","werkzeuge"]
    },
    {
      "Begriff": "PDO",
      "Beschreibung": "Datenbankzugriff mit Prepared Statements",
      "Sprache": "PHP",
      "Link": "more/php-datenbank.html",
      "class": ["php","server","daten"]
    },
    {
      "Begriff": "class (PHP)",
      "Beschreibung": "Klassen und Objekte in PHP",
      "Sprache": "PHP",
      "Link": "more/php-oop.html",
      "class": ["php","oop"]
    },
    // Terminal
    {
      "Begriff": "Terminal (Windows vs. Linux)",
      "Beschreibung": "Befehle für PowerShell und Bash",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    {
      "Begriff": "cd / ls / mkdir",
      "Beschreibung": "Im Terminal navigieren und Ordner anlegen",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    {
      "Begriff": "winget / apt",
      "Beschreibung": "Software über die Kommandozeile installieren",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    {
      "Begriff": "Umgebungsvariablen ($env / export)",
      "Beschreibung": "Variablen im Terminal setzen",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    // Lua
    {
      "Begriff": "Lua",
      "Beschreibung": "Kleine Skriptsprache für Spiele und Mods",
      "Sprache": "Lua",
      "Link": "more/lua-einfuehrung.html",
      "class": ["lua","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "local",
      "Beschreibung": "Lokale Variable anlegen",
      "Sprache": "Lua",
      "Link": "more/lua-grundlagen.html",
      "class": ["lua","grundlagen"]
    },
    {
      "Begriff": "nil / type()",
      "Beschreibung": "Kein Wert / Datentyp prüfen",
      "Sprache": "Lua",
      "Link": "more/lua-grundlagen.html",
      "class": ["lua","grundlagen"]
    },
    {
      "Begriff": ".. (Verkettung)",
      "Beschreibung": "Texte in Lua verbinden",
      "Sprache": "Lua",
      "Link": "more/lua-grundlagen.html",
      "class": ["lua","grundlagen"]
    },
    {
      "Begriff": "if … then … end",
      "Beschreibung": "Bedingungen in Lua",
      "Sprache": "Lua",
      "Link": "more/lua-kontrolle.html",
      "class": ["lua","kontrolle"]
    },
    {
      "Begriff": "for / while / repeat",
      "Beschreibung": "Schleifen in Lua",
      "Sprache": "Lua",
      "Link": "more/lua-kontrolle.html",
      "class": ["lua","kontrolle","schleife"]
    },
    {
      "Begriff": "function (Lua)",
      "Beschreibung": "Funktionen, mehrere Rückgabewerte, Closures",
      "Sprache": "Lua",
      "Link": "more/lua-funktionen.html",
      "class": ["lua","funktion"]
    },
    {
      "Begriff": "Tabelle (table)",
      "Beschreibung": "Liste, Wörterbuch und Objekt in einem",
      "Sprache": "Lua",
      "Link": "more/lua-tabellen.html",
      "class": ["lua","daten"]
    },
    {
      "Begriff": "ipairs / pairs",
      "Beschreibung": "Über Tabellen laufen",
      "Sprache": "Lua",
      "Link": "more/lua-tabellen.html",
      "class": ["lua","daten","kontrolle"]
    },
    {
      "Begriff": "table.insert / table.sort",
      "Beschreibung": "Tabellen bearbeiten",
      "Sprache": "Lua",
      "Link": "more/lua-tabellen.html",
      "class": ["lua","daten"]
    },
    {
      "Begriff": "string.format / Patterns",
      "Beschreibung": "Texte formatieren und durchsuchen",
      "Sprache": "Lua",
      "Link": "more/lua-strings.html",
      "class": ["lua","daten"]
    },
    {
      "Begriff": "require",
      "Beschreibung": "Module laden",
      "Sprache": "Lua",
      "Link": "more/lua-module.html",
      "class": ["lua","werkzeuge"]
    },
    {
      "Begriff": "setmetatable",
      "Beschreibung": "Klassen mit Metatabellen",
      "Sprache": "Lua",
      "Link": "more/lua-module.html",
      "class": ["lua","oop"]
    },
    {
      "Begriff": "pcall / error",
      "Beschreibung": "Fehler abfangen und auslösen",
      "Sprache": "Lua",
      "Link": "more/lua-module.html",
      "class": ["lua","werkzeuge"]
    },
    {
      "Begriff": "core.register_node",
      "Beschreibung": "Block in einem Luanti-Mod registrieren",
      "Sprache": "Lua",
      "Link": "more/lua-luanti.html",
      "class": ["lua","werkzeuge"]
    },
    // C
    {
      "Begriff": "C",
      "Beschreibung": "Systemnahe Sprache, Vorgängerin von C++",
      "Sprache": "C",
      "Link": "more/c-einfuehrung.html",
      "class": ["c","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "printf",
      "Beschreibung": "Formatierte Ausgabe",
      "Sprache": "C",
      "Link": "more/c-ein-ausgabe.html",
      "class": ["c","io","ausgabe"]
    },
    {
      "Begriff": "scanf / fgets",
      "Beschreibung": "Eingaben einlesen",
      "Sprache": "C",
      "Link": "more/c-ein-ausgabe.html",
      "class": ["c","io","eingabe"]
    },
    {
      "Begriff": "char-Array (String)",
      "Beschreibung": "Texte in C mit \\0 am Ende",
      "Sprache": "C",
      "Link": "more/c-strings.html",
      "class": ["c","daten"]
    },
    {
      "Begriff": "strlen / strcmp / snprintf",
      "Beschreibung": "Funktionen aus string.h",
      "Sprache": "C",
      "Link": "more/c-strings.html",
      "class": ["c","daten"]
    },
    {
      "Begriff": "Zeiger (C)",
      "Beschreibung": "Adressen und Zeiger-Arithmetik",
      "Sprache": "C",
      "Link": "more/c-zeiger.html",
      "class": ["c","speicher"]
    },
    {
      "Begriff": "malloc / free",
      "Beschreibung": "Speicher anfordern und freigeben",
      "Sprache": "C",
      "Link": "more/c-speicher.html",
      "class": ["c","speicher"]
    },
    {
      "Begriff": "struct / typedef (C)",
      "Beschreibung": "Eigene Datentypen in C",
      "Sprache": "C",
      "Link": "more/c-structs.html",
      "class": ["c","daten"]
    },
    {
      "Begriff": "#define",
      "Beschreibung": "Konstanten und Makros",
      "Sprache": "C",
      "Link": "more/c-praeprozessor.html",
      "class": ["c","praeprozessor"]
    },
    {
      "Begriff": "fopen / fclose",
      "Beschreibung": "Dateien in C",
      "Sprache": "C",
      "Link": "more/c-praeprozessor.html",
      "class": ["c","werkzeuge","io"]
    },
    // C#
    {
      "Begriff": "C#",
      "Beschreibung": "Sprache von .NET für Apps, Web und Spiele",
      "Sprache": "C#",
      "Link": "more/csharp-einfuehrung.html",
      "class": ["c#","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "dotnet new / run",
      "Beschreibung": "Projekt anlegen und starten",
      "Sprache": "C#",
      "Link": "more/csharp-einfuehrung.html",
      "class": ["c#","werkzeuge"]
    },
    {
      "Begriff": "Console.WriteLine",
      "Beschreibung": "Ausgabe in der Konsole",
      "Sprache": "C#",
      "Link": "more/csharp-einfuehrung.html",
      "class": ["c#","io","ausgabe"]
    },
    {
      "Begriff": "var / int / string",
      "Beschreibung": "Variablen und Datentypen",
      "Sprache": "C#",
      "Link": "more/csharp-grundlagen.html",
      "class": ["c#","grundlagen"]
    },
    {
      "Begriff": "$\"…{x}…\"",
      "Beschreibung": "String-Interpolation",
      "Sprache": "C#",
      "Link": "more/csharp-grundlagen.html",
      "class": ["c#","grundlagen"]
    },
    {
      "Begriff": "int.TryParse",
      "Beschreibung": "Text sicher in Zahl umwandeln",
      "Sprache": "C#",
      "Link": "more/csharp-grundlagen.html",
      "class": ["c#","grundlagen"]
    },
    {
      "Begriff": "switch-Ausdruck",
      "Beschreibung": "Werte je nach Fall zuordnen",
      "Sprache": "C#",
      "Link": "more/csharp-kontrolle.html",
      "class": ["c#","kontrolle"]
    },
    {
      "Begriff": "foreach (C#)",
      "Beschreibung": "Über Listen laufen",
      "Sprache": "C#",
      "Link": "more/csharp-kontrolle.html",
      "class": ["c#","kontrolle","schleife"]
    },
    {
      "Begriff": "List<T>",
      "Beschreibung": "Dynamische Liste",
      "Sprache": "C#",
      "Link": "more/csharp-collections.html",
      "class": ["c#","daten"]
    },
    {
      "Begriff": "Dictionary",
      "Beschreibung": "Schlüssel-Wert-Paare",
      "Sprache": "C#",
      "Link": "more/csharp-collections.html",
      "class": ["c#","daten"]
    },
    {
      "Begriff": "LINQ (Where / Select)",
      "Beschreibung": "Daten filtern, sortieren, auswerten",
      "Sprache": "C#",
      "Link": "more/csharp-collections.html",
      "class": ["c#","daten"]
    },
    {
      "Begriff": "class / Properties",
      "Beschreibung": "Klassen mit get/set",
      "Sprache": "C#",
      "Link": "more/csharp-klassen.html",
      "class": ["c#","oop"]
    },
    {
      "Begriff": "interface",
      "Beschreibung": "Vorgabe, welche Methoden eine Klasse hat",
      "Sprache": "C#",
      "Link": "more/csharp-klassen.html",
      "class": ["c#","oop"]
    },
    {
      "Begriff": "async / await (C#)",
      "Beschreibung": "Asynchrone Methoden",
      "Sprache": "C#",
      "Link": "more/csharp-async.html",
      "class": ["c#","werkzeuge"]
    },
    {
      "Begriff": "File.ReadAllText",
      "Beschreibung": "Dateien lesen und schreiben",
      "Sprache": "C#",
      "Link": "more/csharp-async.html",
      "class": ["c#","werkzeuge","io"]
    },
    // Swift
    {
      "Begriff": "Swift",
      "Beschreibung": "Apples Sprache für iOS und macOS",
      "Sprache": "Swift",
      "Link": "more/swift-einfuehrung.html",
      "class": ["swift","sprache","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "let / var (Swift)",
      "Beschreibung": "Konstanten und Variablen",
      "Sprache": "Swift",
      "Link": "more/swift-grundlagen.html",
      "class": ["swift","grundlagen"]
    },
    {
      "Begriff": "\\(…) Interpolation",
      "Beschreibung": "Werte in Text einsetzen",
      "Sprache": "Swift",
      "Link": "more/swift-grundlagen.html",
      "class": ["swift","grundlagen"]
    },
    {
      "Begriff": "Optional (?)",
      "Beschreibung": "Werte, die fehlen dürfen",
      "Sprache": "Swift",
      "Link": "more/swift-optionals.html",
      "class": ["swift","grundlagen"]
    },
    {
      "Begriff": "if let / guard let",
      "Beschreibung": "Optionals sicher auspacken",
      "Sprache": "Swift",
      "Link": "more/swift-optionals.html",
      "class": ["swift","kontrolle"]
    },
    {
      "Begriff": "switch (Swift)",
      "Beschreibung": "Fallunterscheidung mit Bereichen",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","kontrolle"]
    },
    {
      "Begriff": "for-in / Bereiche (1...5)",
      "Beschreibung": "Schleifen in Swift",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","kontrolle","schleife"]
    },
    {
      "Begriff": "func",
      "Beschreibung": "Funktionen mit Argument-Labels",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","funktion"]
    },
    {
      "Begriff": "Closure ($0)",
      "Beschreibung": "Kurze Funktionen, z. B. für map/filter",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","funktion"]
    },
    {
      "Begriff": "struct / class (Swift)",
      "Beschreibung": "Wert- und Referenztypen",
      "Sprache": "Swift",
      "Link": "more/swift-typen.html",
      "class": ["swift","oop"]
    },
    {
      "Begriff": "enum (Swift)",
      "Beschreibung": "Aufzählungen mit angehängten Werten",
      "Sprache": "Swift",
      "Link": "more/swift-typen.html",
      "class": ["swift","daten"]
    },
    {
      "Begriff": "protocol",
      "Beschreibung": "Vorgabe für Typen (wie Interface)",
      "Sprache": "Swift",
      "Link": "more/swift-typen.html",
      "class": ["swift","oop"]
    },
    {
      "Begriff": "SwiftUI",
      "Beschreibung": "Oberflächen für Apple-Apps (nur macOS)",
      "Sprache": "Swift",
      "Link": "more/swiftui.html",
      "class": ["swift","gestaltung"]
    },
    {
      "Begriff": "@State",
      "Beschreibung": "Zustand einer SwiftUI-Ansicht",
      "Sprache": "Swift",
      "Link": "more/swiftui.html",
      "class": ["swift","gestaltung"]
    },
    {
      "Begriff": "VStack / HStack",
      "Beschreibung": "Ansichten stapeln",
      "Sprache": "Swift",
      "Link": "more/swiftui.html",
      "class": ["swift","layout"]
    },
    {
      "Begriff": "Xcode",
      "Beschreibung": "Apples Entwicklungsumgebung (nur macOS)",
      "Sprache": "Swift",
      "Link": "more/xcode.html",
      "class": ["swift","werkzeuge"]
    },
    // JavaScript (Erweiterung)
    {
      "Begriff": "class",
      "Beschreibung": "Klassen, Konstruktor und Vererbung",
      "Sprache": "JS",
      "Link": "more/js-klassen.html",
      "class": ["javascript","js","oop"]
    },
    {
      "Begriff": "extends / super",
      "Beschreibung": "Eine Klasse von einer anderen erben lassen",
      "Sprache": "JS",
      "Link": "more/js-klassen.html",
      "class": ["javascript","js","oop"]
    },
    {
      "Begriff": "get / set",
      "Beschreibung": "Getter und Setter in Klassen",
      "Sprache": "JS",
      "Link": "more/js-klassen.html",
      "class": ["javascript","js","oop"]
    },
    {
      "Begriff": "#privat",
      "Beschreibung": "Private Felder in Klassen",
      "Sprache": "JS",
      "Link": "more/js-klassen.html",
      "class": ["javascript","js","oop"]
    },
    {
      "Begriff": "Scope",
      "Beschreibung": "Wo eine Variable sichtbar ist",
      "Sprache": "JS",
      "Link": "more/js-scope.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Closure",
      "Beschreibung": "Funktion, die sich Variablen von außen merkt",
      "Sprache": "JS",
      "Link": "more/js-scope.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "this",
      "Beschreibung": "Worauf this zeigt",
      "Sprache": "JS",
      "Link": "more/js-scope.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Hoisting",
      "Beschreibung": "Funktionen vor ihrer Definition nutzen",
      "Sprache": "JS",
      "Link": "more/js-scope.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Map",
      "Beschreibung": "Schlüssel-Wert-Speicher",
      "Sprache": "JS",
      "Link": "more/js-map-set.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Set",
      "Beschreibung": "Liste ohne doppelte Werte",
      "Sprache": "JS",
      "Link": "more/js-map-set.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "FormData",
      "Beschreibung": "Formularwerte auf einmal auslesen",
      "Sprache": "JS",
      "Link": "more/js-formulare.html",
      "class": ["javascript","js","form"]
    },
    {
      "Begriff": "Formular prüfen",
      "Beschreibung": "Eingaben mit JavaScript validieren",
      "Sprache": "JS",
      "Link": "more/js-formulare.html",
      "class": ["javascript","js","form"]
    },
    {
      "Begriff": "preventDefault",
      "Beschreibung": "Absenden eines Formulars verhindern",
      "Sprache": "JS",
      "Link": "more/js-formulare.html",
      "class": ["javascript","js","form"]
    },
    {
      "Begriff": "fetch",
      "Beschreibung": "Daten von einem Server oder einer API laden",
      "Sprache": "JS",
      "Link": "more/js-fetch.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "POST mit fetch",
      "Beschreibung": "Daten als JSON an einen Server senden",
      "Sprache": "JS",
      "Link": "more/js-fetch.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "AbortController",
      "Beschreibung": "Anfragen abbrechen und Timeouts setzen",
      "Sprache": "JS",
      "Link": "more/js-fetch.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Zwischenablage",
      "Beschreibung": "Text kopieren mit navigator.clipboard",
      "Sprache": "JS",
      "Link": "more/js-browser-apis.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "IntersectionObserver",
      "Beschreibung": "Erkennen, wann ein Element sichtbar wird",
      "Sprache": "JS",
      "Link": "more/js-browser-apis.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "URLSearchParams",
      "Beschreibung": "Parameter aus der Adresszeile lesen",
      "Sprache": "JS",
      "Link": "more/js-browser-apis.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "Debounce",
      "Beschreibung": "Funktion erst nach einer Pause ausführen",
      "Sprache": "JS",
      "Link": "more/js-debounce.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "Throttle",
      "Beschreibung": "Funktion höchstens alle X ms ausführen",
      "Sprache": "JS",
      "Link": "more/js-debounce.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "requestAnimationFrame",
      "Beschreibung": "Flüssige Animationen im Takt des Bildschirms",
      "Sprache": "JS",
      "Link": "more/js-animation.html",
      "class": ["javascript","js","gestaltung"]
    },
    {
      "Begriff": "element.animate",
      "Beschreibung": "Web Animations API",
      "Sprache": "JS",
      "Link": "more/js-animation.html",
      "class": ["javascript","js","gestaltung"]
    },
    {
      "Begriff": "XSS",
      "Beschreibung": "Sicherheit: innerHTML vs. textContent",
      "Sprache": "JS",
      "Link": "more/js-sicherheit.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "ARIA",
      "Beschreibung": "Barrierefreiheit für eigene Bedienelemente",
      "Sprache": "JS",
      "Link": "more/js-barrierefreiheit.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "Fokus steuern",
      "Beschreibung": "Tastaturbedienung mit focus() und tabindex",
      "Sprache": "JS",
      "Link": "more/js-barrierefreiheit.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Begriff": "RegExp",
      "Beschreibung": "Reguläre Ausdrücke: Muster in Texten finden",
      "Sprache": "JS",
      "Link": "more/js-regex.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "replace / match",
      "Beschreibung": "Text mit Regex ersetzen und suchen",
      "Sprache": "JS",
      "Link": "more/js-regex.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Event Loop",
      "Beschreibung": "Wie JS Aufgaben der Reihe nach abarbeitet",
      "Sprache": "JS",
      "Link": "more/js-event-loop.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Begriff": "Intl.NumberFormat",
      "Beschreibung": "Zahlen und Währungen formatieren",
      "Sprache": "JS",
      "Link": "more/js-intl.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Intl.DateTimeFormat",
      "Beschreibung": "Datum und Uhrzeit formatieren",
      "Sprache": "JS",
      "Link": "more/js-intl.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "function*",
      "Beschreibung": "Generatoren und yield",
      "Sprache": "JS",
      "Link": "more/js-generatoren.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Symbol.iterator",
      "Beschreibung": "Eigene Objekte mit for...of durchlaufen",
      "Sprache": "JS",
      "Link": "more/js-generatoren.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Begriff": "Vite",
      "Beschreibung": "Entwicklungsserver und Build-Tool",
      "Sprache": "JS",
      "Link": "more/js-vite.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Begriff": "Vitest",
      "Beschreibung": "Automatische Tests schreiben",
      "Sprache": "JS",
      "Link": "more/js-testen.html",
      "class": ["javascript","js","werkzeuge"]
    },
    // TypeScript
    {
      "Begriff": "TypeScript",
      "Beschreibung": "JavaScript mit Typen",
      "Sprache": "TypeScript",
      "Link": "more/ts-einfuehrung.html",
      "class": ["typescript","grundlagen"],
      "Stufe": 80
    },
    {
      "Begriff": "tsc",
      "Beschreibung": "Der TypeScript-Compiler",
      "Sprache": "TypeScript",
      "Link": "more/ts-einfuehrung.html",
      "class": ["typescript","werkzeuge"]
    },
    {
      "Begriff": "string / number / boolean",
      "Beschreibung": "Grundtypen und Typangaben",
      "Sprache": "TypeScript",
      "Link": "more/ts-typen.html",
      "class": ["typescript","grundlagen"]
    },
    {
      "Begriff": "Union-Typ",
      "Beschreibung": "Wert kann das eine ODER das andere sein",
      "Sprache": "TypeScript",
      "Link": "more/ts-typen.html",
      "class": ["typescript","grundlagen"]
    },
    {
      "Begriff": "any / unknown",
      "Beschreibung": "Unbekannte Werte sicher behandeln",
      "Sprache": "TypeScript",
      "Link": "more/ts-typen.html",
      "class": ["typescript","grundlagen"]
    },
    {
      "Begriff": "type",
      "Beschreibung": "Einem Typ einen Namen geben",
      "Sprache": "TypeScript",
      "Link": "more/ts-typen.html",
      "class": ["typescript","grundlagen"]
    },
    {
      "Begriff": "as",
      "Beschreibung": "Type Assertion – TS einen Typ mitteilen",
      "Sprache": "TypeScript",
      "Link": "more/ts-typen.html",
      "class": ["typescript","grundlagen"]
    },
    {
      "Begriff": "interface",
      "Beschreibung": "Aufbau eines Objekts beschreiben",
      "Sprache": "TypeScript",
      "Link": "more/ts-interfaces.html",
      "class": ["typescript","oop"]
    },
    {
      "Begriff": "optional ?",
      "Beschreibung": "Optionale und readonly Eigenschaften",
      "Sprache": "TypeScript",
      "Link": "more/ts-interfaces.html",
      "class": ["typescript","oop"]
    },
    {
      "Begriff": "Partial / Pick / Omit",
      "Beschreibung": "Hilfstypen zum Umbauen von Typen",
      "Sprache": "TypeScript",
      "Link": "more/ts-interfaces.html",
      "class": ["typescript","daten"]
    },
    {
      "Begriff": "Record",
      "Beschreibung": "Objekt mit beliebigen Schlüsseln",
      "Sprache": "TypeScript",
      "Link": "more/ts-interfaces.html",
      "class": ["typescript","daten"]
    },
    {
      "Begriff": "private / public",
      "Beschreibung": "Sichtbarkeit in Klassen",
      "Sprache": "TypeScript",
      "Link": "more/ts-klassen-generics.html",
      "class": ["typescript","oop"]
    },
    {
      "Begriff": "implements",
      "Beschreibung": "Klasse erfüllt ein Interface",
      "Sprache": "TypeScript",
      "Link": "more/ts-klassen-generics.html",
      "class": ["typescript","oop"]
    },
    {
      "Begriff": "Generics <T>",
      "Beschreibung": "Typen als Platzhalter",
      "Sprache": "TypeScript",
      "Link": "more/ts-klassen-generics.html",
      "class": ["typescript","oop"]
    },
    {
      "Begriff": "tsconfig.json",
      "Beschreibung": "Projekt-Einstellungen für TypeScript",
      "Sprache": "TypeScript",
      "Link": "more/ts-projekt.html",
      "class": ["typescript","werkzeuge"]
    }
  ]}
};

console.log("[entries] coding/entries.js geladen:", window.SpickerData["coding"].oTableEntries.List.length, "Einträge");
