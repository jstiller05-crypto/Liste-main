/* =====================================================================
   spicker.js – Inhaltsverzeichnis
   ---------------------------------------------------------------------
   1. DATEN            oTableEntries (die ganze Liste)
   2. ZUSTAND          filterState   (was der Nutzer gerade gewählt hat)
   3. WERKZEUGE        class TableSearcher (suchen + Tabelle zeichnen)
  4. HILFSFUNKTIONEN  setActiveFilterButton(), sortEntriesBySelectedOrder()
  5. HERZSTÜCK        applyEntryFilters()  (alle Filter nacheinander)
   6. EVENTS           setup...()-Funktionen (Klicks, Tippen, Auswahl)
   7. START            DOMContentLoaded (setzt alles in Gang)
   ===================================================================== */


/* =====================================================================
   1. DATEN
   ---------------------------------------------------------------------
   Jeder Eintrag ist ein Objekt { ... } mit diesen Feldern:
     "Tag"          → wird in Spalte 1 angezeigt
     "Beschreibung" → Spalte 2
     "Sprache"      → Spalte 3 (+ Sprach-Filter, klein geschrieben verglichen)
     "Link"         → Spalte 4 ("mehr"-Link), leer lassen = kein Link
     "class"        → Array mit Schlagwörtern für den Kategorie-Filter
   Neuer Eintrag: einfach einen { ... }-Block kopieren und anpassen.
  Die Reihenfolge hier ist egal – sortEntriesBySelectedOrder() sortiert beim Anzeigen.
   ===================================================================== */
let oTableEntries = { "List": [
    // Sonderzeichen
    {
      "Tag": "[]",
      "Beschreibung": "zum Definieren von Listen und Arrays",
      "Sprache": "JS",
      "Link": "",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Tag": "()",
      "Beschreibung": "zum Definieren von Funktionen und Gruppierungen",
      "Sprache": "JS",
      "Link": "",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Tag": "{}",
      "Beschreibung": "zum Definieren von Objekten und Blockstrukturen",
      "Sprache": "JS",
      "Link": "",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Tag": "<element>",
      "Beschreibung": "Platzhalter für ein beliebiges HTML-Element",
      "Sprache": "html",
      "Link": "",
      "class": ["zeichen","html"]
    },
    {
      "Tag": "</element>",
      "Beschreibung": "Schließt ein HTML-Element",
      "Sprache": "html",
      "Link": "",
      "class": ["zeichen","html","basis"]
    },
    // A
    {
      "Tag": "<a>",
      "Beschreibung": "Hyperlink zu einer URL oder Seite",
      "Sprache": "html",
      "Link": "more/a.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<abbr>",
      "Beschreibung": "Abkürzung mit erklärtem Text",
      "Sprache": "html",
      "Link": "more/abbr.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<address>",
      "Beschreibung": "Adressblock für Kontaktinformationen",
      "Sprache": "html",
      "Link": "more/address.html",
      "class": ["html","container","semantik"]
    },
    {
      "Tag": "<area>",
      "Beschreibung": "Interaktive Fläche in einer Bild-Map",
      "Sprache": "html",
      "Link": "more/area & map.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<article>",
      "Beschreibung": "Eigenständiger Inhaltsbereich",
      "Sprache": "html",
      "Link": "more/article.html",
      "class": ["html","container","semantik"]
    },
    {
      "Tag": "<aside>",
      "Beschreibung": "Inhalt neben dem Hauptinhalt",
      "Sprache": "html",
      "Link": "more/aside.html",
      "class": ["html","container","semantik"]
    },
    {
      "Tag": "<audio>",
      "Beschreibung": "Einbettung von Audiodateien",
      "Sprache": "html",
      "Link": "more/audio.html",
      "class": ["html","media"]
    },
    // B
    {
      "Tag": "<b>",
      "Beschreibung": "Fetter Text ohne zusätzliche Semantik",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<base>",
      "Beschreibung": "Basis-URL für relative Links",
      "Sprache": "html",
      "Link": "more/base.html",
      "class": ["html","metadata"]
    },
    {
      "Tag": "<bdi>",
      "Beschreibung": "Steuert die Schreibrichtung für Textblöcke",
      "Sprache": "html",
      "Link": "more/bdi.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<bdo>",
      "Beschreibung": "Überschreibt die Schreibrichtung des Textes",
      "Sprache": "html",
      "Link": "more/bdo.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<blockquote>",
      "Beschreibung": "Blockzitat für längere Zitate",
      "Sprache": "html",
      "Link": "more/blockquote.html",
      "class": ["html","container","text"]
    },
    {
      "Tag": "<body>",
      "Beschreibung": "Hauptkörper des Dokuments",
      "Sprache": "html",
      "Link": "more/body.html",
      "class": ["basis","html","container"]
    },
    {
      "Tag": "<br>",
      "Beschreibung": "Zeilenumbruch im Text",
      "Sprache": "html",
      "Link": "more/br.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<button>",
      "Beschreibung": "Schaltfläche für Benutzerinteraktionen",
      "Sprache": "html",
      "Link": "more/button.html",
      "class": ["html","form","interactive"]
    },
    // C
    {
      "Tag": "<canvas>",
      "Beschreibung": "Grafikfläche für dynamische Zeichnungen",
      "Sprache": "html",
      "Link": "more/canvas.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<caption>",
      "Beschreibung": "Beschriftung einer Tabelle",
      "Sprache": "html",
      "Link": "more/caption.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<cite>",
      "Beschreibung": "Quellenangabe für ein Werk oder Zitat",
      "Sprache": "html",
      "Link": "more/cite.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<code>",
      "Beschreibung": "Code oder Programmtext",
      "Sprache": "html",
      "Link": "more/code.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<col>",
      "Beschreibung": "Definiert eine Tabelle-Spalte",
      "Sprache": "html",
      "Link": "more/col.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<colgroup>",
      "Beschreibung": "Gruppierung von Tabellenspalten",
      "Sprache": "html",
      "Link": "more/colgroup.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<data>",
      "Beschreibung": "Maschinenlesbarer Wert mit sichtbarem Text",
      "Sprache": "html",
      "Link": "more/data.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<datalist>",
      "Beschreibung": "Liste von Vorschlägen für ein Eingabefeld",
      "Sprache": "html",
      "Link": "more/datalist.html",
      "class": ["html","form"]
    },
    {
      "Tag": "<dd>",
      "Beschreibung": "Beschreibung in einer Definitionsliste",
      "Sprache": "html",
      "Link": "more/dd.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<del>",
      "Beschreibung": "Durchgestrichener Text",
      "Sprache": "html",
      "Link": "more/del.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<details>",
      "Beschreibung": "Ein- und ausklappbarer Bereich",
      "Sprache": "html",
      "Link": "more/details.html",
      "class": ["html","interactive","container"]
    },
    {
      "Tag": "<dfn>",
      "Beschreibung": "Definition eines Begriffs",
      "Sprache": "html",
      "Link": "more/dfn.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<dialog>",
      "Beschreibung": "Dialogfenster für Nachrichten oder Aktionen",
      "Sprache": "html",
      "Link": "more/dialog.html",
      "class": ["html","interactive","container"]
    },
    {
      "Tag": "<div>",
      "Beschreibung": "Allzweck-Container für Layout und Struktur",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<dl>",
      "Beschreibung": "Definitionsliste mit Begriffen und Beschreibungen",
      "Sprache": "html",
      "Link": "more/dl.html",
      "class": ["html","liste"]
    },
    {
      "Tag": "<dt>",
      "Beschreibung": "Begriff in einer Definitionsliste",
      "Sprache": "html",
      "Link": "more/dt.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<em>",
      "Beschreibung": "Hervorgehobener Text mit Betonung",
      "Sprache": "html",
      "Link": "more/em.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<embed>",
      "Beschreibung": "Eingebetteter externer Inhalt",
      "Sprache": "html",
      "Link": "more/embed.html",
      "class": ["html","embed"]
    },
    // F
    {
      "Tag": "<fieldset>",
      "Beschreibung": "Gruppiert Formularfelder",
      "Sprache": "html",
      "Link": "more/fieldset.html",
      "class": ["html","form","container"]
    },
    {
      "Tag": "<figcaption>",
      "Beschreibung": "Beschriftung für ein Figure-Element",
      "Sprache": "html",
      "Link": "more/figcaption.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<figure>",
      "Beschreibung": "Medieninhalt mit Beschreibung",
      "Sprache": "html",
      "Link": "more/figure.html",
      "class": ["html","container","media"]
    },
    {
      "Tag": "<footer>",
      "Beschreibung": "Fußbereich eines Dokuments oder Abschnitts",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<form>",
      "Beschreibung": "Formular zur Eingabe von Daten",
      "Sprache": "html",
      "Link": "more/form.html",
      "class": ["html","form","container"]
    },
    // G
    {
      "Tag": "<g>",
      "Beschreibung": "Gruppiert SVG-Elemente innerhalb eines svg-Tags",
      "Sprache": "html",
      "Link": "",
      "class": ["html","media"]
    },
    // H
    {
      "Tag": "<h1>",
      "Beschreibung": "Wichtigste Überschrift",
      "Sprache": "html",
      "Link": "",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h2>",
      "Beschreibung": "Zweite Überschriftenebene",
      "Sprache": "html",
      "Link": "",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h3>",
      "Beschreibung": "Dritte Überschriftenebene",
      "Sprache": "html",
      "Link": "",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h4>",
      "Beschreibung": "Vierte Überschriftenebene",
      "Sprache": "html",
      "Link": "",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h5>",
      "Beschreibung": "Fünfte Überschriftenebene",
      "Sprache": "html",
      "Link": "",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h6>",
      "Beschreibung": "Sechste Überschriftenebene",
      "Sprache": "html",
      "Link": "",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<head>",
      "Beschreibung": "Metadaten und Verweise des Dokuments",
      "Sprache": "html",
      "Link": "more/head.html",
      "class": ["basis","html","metadata","einbinden"]
    },
    {
      "Tag": "<header>",
      "Beschreibung": "Kopfbereich einer Seite oder Sektion",
      "Sprache": "html",
      "Link": "more/header.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<hr>",
      "Beschreibung": "Horizontale Trennlinie",
      "Sprache": "html",
      "Link": "more/hr.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<html>",
      "Beschreibung": "Wurzelelement des HTML-Dokuments",
      "Sprache": "html",
      "Link": "more/html.html",
      "class": ["basis","html"]
    },
    // I
    {
      "Tag": "<i>",
      "Beschreibung": "Kursiver Text ohne zusätzliche Semantik",
      "Sprache": "html",
      "Link": "more/i.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<iframe>",
      "Beschreibung": "Eingebettete externe Webseite",
      "Sprache": "html",
      "Link": "more/iframe.html",
      "class": ["html","embed","media"]
    },
    {
      "Tag": "<img>",
      "Beschreibung": "Bild einfügen",
      "Sprache": "html",
      "Link": "more/img.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<input>",
      "Beschreibung": "Eingabefeld für Formulare",
      "Sprache": "html",
      "Link": "more/input.html",
      "class": ["html","form","interactive"]
    },
    {
      "Tag": "<ins>",
      "Beschreibung": "Eingefügter Text",
      "Sprache": "html",
      "Link": "more/ins.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<kbd>",
      "Beschreibung": "Tastatureingabe darstellen",
      "Sprache": "html",
      "Link":"more/kbd.html",
      "class": ["html","text"]
    },
    // K
    {
      "Tag": "<label>",
      "Beschreibung": "Beschriftung für ein Formularfeld",
      "Sprache": "html",
      "Link": "more/label.html",
      "class": ["html","form","text"]
    },
    {
      "Tag": "<legend>",
      "Beschreibung": "Beschriftung für ein Fieldset",
      "Sprache": "html",
      "Link": "more/legend.html",
      "class": ["html","form","text"]
    },
    {
      "Tag": "<li>",
      "Beschreibung": "Eintrag in einer Liste",
      "Sprache": "html",
      "Link": "more/liste.html",
      "class": ["html","liste"]
    },
    {
      "Tag": "<link>",
      "Beschreibung": "Verknüpft externe Ressourcen oder Stile",
      "Sprache": "html",
      "Link": "more/link.html",
      "class": ["html","metadata","einbinden"]
    },
    {
      "Tag": "<main>",
      "Beschreibung": "Hauptinhalt der Seite",
      "Sprache": "html",
      "Link": "more/main.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<map>",
      "Beschreibung": "Definiert eine Bild-Map mit klickbaren Bereichen",
      "Sprache": "html",
      "Link": "more/area & map.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<mark>",
      "Beschreibung": "Hervorhebung von Text",
      "Sprache": "html",
      "Link": "more/mark.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<menu>",
      "Beschreibung": "Menü für Befehle oder Navigation",
      "Sprache": "html",
      "Link": "more/menu.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<meta>",
      "Beschreibung": "Metadaten wie Zeichensatz oder Beschreibung",
      "Sprache": "html",
      "Link": "more/meta.html",
      "class": ["html","metadata"]
    },
    {
      "Tag": "<meter>",
      "Beschreibung": "Anzeige eines Messwerts innerhalb eines Bereichs",
      "Sprache": "html",
      "Link": "more/meter.html",
      "class": ["html","form"]
    },
    {
      "Tag": "<nav>",
      "Beschreibung": "Navigationsbereich mit Links",
      "Sprache": "html",
      "Link": "more/nav.html",
      "class": ["html","container","semantik"]
    },
    {
      "Tag": "<noscript>",
      "Beschreibung": "Inhalt, wenn JavaScript deaktiviert ist",
      "Sprache": "html",
      "Link": "more/noscript.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<object>",
      "Beschreibung": "Eingebetteter Inhalt oder Multimedia",
      "Sprache": "html",
      "Link": "more/object.html",
      "class": ["html","embed"]
    },
    {
      "Tag": "<ol>",
      "Beschreibung": "Nummerierte Liste",
      "Sprache": "html",
      "Link": "more/liste.html",
      "class": ["html","liste","container"]
    },
    {
      "Tag": "<optgroup>",
      "Beschreibung": "Gruppierung von Optionen in einem Select",
      "Sprache": "html",
      "Link": "more/optgroup.html",
      "class": ["html","form"]
    },
    {
      "Tag": "<option>",
      "Beschreibung": "Auswahloption in einem Select-Feld",
      "Sprache": "html",
      "Link": "more/option.html",
      "class": ["html","form","text"]
    },
    {
      "Tag": "<output>",
      "Beschreibung": "Ausgabe eines Formulars oder Skripts",
      "Sprache": "html",
      "Link": "",
      "class": ["html","form","text"]
    },
    {
      "Tag": "<picture>",
      "Beschreibung": "Responsive Bildquelle mit mehreren Quellen",
      "Sprache": "html",
      "Link": "",
      "class": ["html","media"]
    },
    {
      "Tag": "<pre>",
      "Beschreibung": "Vorformatierter Text mit festen Abständen",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<progress>",
      "Beschreibung": "Fortschrittsanzeige",
      "Sprache": "html",
      "Link": "",
      "class": ["html","form"]
    },
    // Q
    {
      "Tag": "<q>",
      "Beschreibung": "Kurz-Zitat innerhalb eines Textes",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<ruby>",
      "Beschreibung": "Text mit Aussprachehilfe",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<rp>",
      "Beschreibung": "Text für Browser ohne Ruby-Unterstützung",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<rt>",
      "Beschreibung": "Ruby-Text zur Aussprache",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<s>",
      "Beschreibung": "Durchgestrichener Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<samp>",
      "Beschreibung": "Beispielausgabe eines Programms",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<script>",
      "Beschreibung": "JavaScript oder andere Skripte einbinden",
      "Sprache": "html",
      "Link": "more/script.html",
      "class": ["html","einbinden"]
    },
    {
      "Tag": "<section>",
      "Beschreibung": "Thematischer Abschnitt einer Seite",
      "Sprache": "html",
      "Link": "",
      "class": ["html","container","semantik"]
    },
    {
      "Tag": "<select>",
      "Beschreibung": "Auswahlmenü im Formular",
      "Sprache": "html",
      "Link": "",
      "class": ["html","form","interactive"]
    },
    {
      "Tag": "<small>",
      "Beschreibung": "Kleinerer Nebentext",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<source>",
      "Beschreibung": "Quelle für Audio, Video oder Bild",
      "Sprache": "html",
      "Link": "",
      "class": ["html","media"]
    },
    {
      "Tag": "<span>",
      "Beschreibung": "Inline-Container für Styling oder Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<strong>",
      "Beschreibung": "Wichtig hervorgehobener Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<style>",
      "Beschreibung": "CSS direkt im Dokument",
      "Sprache": "html",
      "Link": "more/style.html",
      "class": ["html","css","einbinden"]
    },
    {
      "Tag": "<sub>",
      "Beschreibung": "Tiefgestellter Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<summary>",
      "Beschreibung": "Zusammenfassung für details",
      "Sprache": "html",
      "Link": "",
      "class": ["html","interactive","text"]
    },
    {
      "Tag": "<sup>",
      "Beschreibung": "Hochgestellter Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<svg>",
      "Beschreibung": "Vektorgrafik im HTML-Dokument",
      "Sprache": "html",
      "Link": "",
      "class": ["html","media"]
    },
    {
      "Tag": "<table>",
      "Beschreibung": "Tabelle mit Zeilen und Spalten",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle","container"]
    },
    {
      "Tag": "<tbody>",
      "Beschreibung": "Hauptbereich einer Tabelle",
      "Sprache": "html",
      "Link": "",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<td>",
      "Beschreibung": "Zelle in einer Tabellenzeile",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<template>",
      "Beschreibung": "Vorlage für wiederverwendbaren HTML-Code",
      "Sprache": "html",
      "Link": "more/template.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<textarea>",
      "Beschreibung": "Mehrzeiliges Texteingabefeld",
      "Sprache": "html",
      "Link": "",
      "class": ["html","form","interactive"]
    },
    {
      "Tag": "<tfoot>",
      "Beschreibung": "Fußbereich einer Tabelle",
      "Sprache": "html",
      "Link": "",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<th>",
      "Beschreibung": "Kopfzelle einer Tabelle",
      "Sprache": "html",
      "Link": "",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<thead>",
      "Beschreibung": "Kopfbereich einer Tabelle",
      "Sprache": "html",
      "Link": "",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<time>",
      "Beschreibung": "Datum oder Uhrzeit markieren",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<title>",
      "Beschreibung": "Titel des Dokuments im Browser-Tab",
      "Sprache": "html",
      "Link": "",
      "class": ["html","metadata"]
    },
    {
      "Tag": "<tr>",
      "Beschreibung": "Zeile in einer Tabelle",
      "Sprache": "html",
      "Link": "",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<track>",
      "Beschreibung": "Untertitel oder Textspur für Video/Audio",
      "Sprache": "html",
      "Link": "",
      "class": ["html","media"]
    },
    {
      "Tag": "<u>",
      "Beschreibung": "Unterstrichener Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<ul>",
      "Beschreibung": "Ungeordnete Liste mit Punkten",
      "Sprache": "html",
      "Link": "more/liste.html",
      "class": ["html","liste","container"]
    },
    {
      "Tag": "<var>",
      "Beschreibung": "Variable oder Ausdruck im Text",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    {
      "Tag": "<video>",
      "Beschreibung": "Einbettung von Videodateien",
      "Sprache": "html",
      "Link": "more/video.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<wbr>",
      "Beschreibung": "Optionale Zeilenumbruchstelle",
      "Sprache": "html",
      "Link": "",
      "class": ["html","text"]
    },
    // CSS
    {
      "Tag": "HTML",
      "Beschreibung": "Grundlage des Webs: Struktur, Inhalte und semantische Elemente",
      "Sprache": "html",
      "Link": "more/html-sprache.html",
      "class": ["html","sprache","grundlagen"]
    },
    {
      "Tag": "CSS",
      "Beschreibung": "Gestaltung und Layout von Webseiten mit Farben, Abständen und Positionierung",
      "Sprache": "CSS",
      "Link": "more/css-sprache.html",
      "class": ["css","sprache","grundlagen"]
    },
    {
      "Tag": "JavaScript",
      "Beschreibung": "Interaktive Sprache für Dynamik, Events und DOM-Logik im Browser",
      "Sprache": "JS",
      "Link": "more/javascript-sprache.html",
      "class": ["javascript","js","sprache","grundlagen"]
    },
    {
      "Tag": "C++",
      "Beschreibung": "Leistungsstarke Sprache für Systemsoftware, Spiele und effiziente Anwendungen",
      "Sprache": "C++",
      "Link": "more/cpp-sprache.html",
      "class": ["cpp","sprache","grundlagen"]
    },
    {
      "Tag": "Typselektor",
      "Beschreibung": "Wählt alle Elemente des angegebenen Typs aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Klassenselektor",
      "Beschreibung": "Wählt Elemente nach ihrer CSS-Klasse aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "ID-Selektor",
      "Beschreibung": "Wählt Elemente anhand ihres id-Attributs aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Universalselektor",
      "Beschreibung": "Wählt alle Elemente auf der Seite aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Kindselektoren",
      "Beschreibung": "Wählt direkte Kinder eines Elements aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Nachfahrensselektoren",
      "Beschreibung": "Wählt Nachfahren eines Elements aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Allgemeine Geschwisterselektoren",
      "Beschreibung": "Wählt nachfolgende Geschwisterelemente aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Angrenzende Geschwisterselektoren",
      "Beschreibung": "Wählt das unmittelbar folgende Geschwisterelement aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Attributselektor",
      "Beschreibung": "Wählt Elemente nach Attributwert aus",
      "Sprache": "CSS",
      "Link": "",
      "class": ["css","selektoren"]
    },
    // C++
    {
      "Tag": "#include",
      "Beschreibung": "Präprozessor-Direktive zum Einbinden von Bibliotheken oder Header-Dateien",
      "Sprache": "C++",
      "Link": "more/include.html",
      "class": ["cpp","praeprozessor"]
    },
    {
      "Tag": "using namespace",
      "Beschreibung": "Macht Symbole aus einem Namespace verfügbar ohne Präfix",
      "Sprache": "C++",
      "Link": "more/using-namespace.html",
      "class": ["cpp","namespace"]
    },
    {
      "Tag": "int main()",
      "Beschreibung": "Hauptfunktion - Einstiegspunkt eines C++-Programms",
      "Sprache": "C++",
      "Link": "more/cpp-main.html",
      "class": ["cpp","funktion","basis"]
    },
    {
      "Tag": "std::cout",
      "Beschreibung": "Ausgabe von Daten in die Standardausgabe (Konsole)",
      "Sprache": "C++",
      "Link": "more/cout.html",
      "class": ["cpp","io","ausgabe"]
    },
    {
      "Tag": "std::cin",
      "Beschreibung": "Eingabe von Daten aus der Standardeingabe (Tastatur)",
      "Sprache": "C++",
      "Link": "more/cin.html",
      "class": ["cpp","io","eingabe"]
    },
    {
      "Tag": "int, float, string, bool",
      "Beschreibung": "Grundlegende Datentypen in C++",
      "Sprache": "C++",
      "Link": "more/datatypes.html",
      "class": ["cpp","datentyp","basis"]
    },
    {
      "Tag": "Variablen",
      "Beschreibung": "Deklaration und Initialisierung von Variablen mit Typ und Wert",
      "Sprache": "C++",
      "Link": "more/variable.html",
      "class": ["cpp","variable"]
    },
    {
      "Tag": "for-Schleife",
      "Beschreibung": "Wiederholung eines Codeblocks eine bestimmte Anzahl von Malen",
      "Sprache": "C++",
      "Link": "more/for-loop.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Tag": "while-Schleife",
      "Beschreibung": "Wiederholung eines Codeblocks solange eine Bedingung erfüllt ist",
      "Sprache": "C++",
      "Link": "more/while-loop.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Tag": "if-else",
      "Beschreibung": "Bedingte Ausführung von Codeblöcken basierend auf Bedingungen",
      "Sprache": "C++",
      "Link": "more/if-else.html",
      "class": ["cpp","bedingung","kontrolle"]
    },
    {
      "Tag": "Funktionen",
      "Beschreibung": "Wiederverwendbare Codeblöcke mit Parametern und Rückgabewert",
      "Sprache": "C++",
      "Link": "more/function.html",
      "class": ["cpp","funktion"]
    },
    {
      "Tag": "Zeiger (*)",
      "Beschreibung": "Variable, die die Speicheradresse einer anderen Variable speichert",
      "Sprache": "C++",
      "Link": "more/pointer.html",
      "class": ["cpp","zeiger","speicher"]
    },
    {
      "Tag": "Referenzen (&)",
      "Beschreibung": "Alias für eine existierende Variable mit derselben Speicheradresse",
      "Sprache": "C++",
      "Link": "more/reference.html",
      "class": ["cpp","referenz","speicher"]
    },
    {
      "Tag": "Klasse",
      "Beschreibung": "Vorlage für die Erstellung von Objekten mit Eigenschaften und Methoden",
      "Sprache": "C++",
      "Link": "more/cpp-class.html",
      "class": ["cpp","klasse","oop"]
    }
  ]};

/* =====================================================================
   2. ZUSTAND
   ---------------------------------------------------------------------
   Das "Gedächtnis" der Seite. Hier steht, was gerade eingestellt ist.
  Regel: Events ändern NUR dieses Objekt und rufen dann applyEntryFilters().
   "" (leerer Text) bedeutet immer: kein Filter aktiv.
   ===================================================================== */
const filterState = {
  search: "",     // Text aus dem Suchfeld
  language: "",   // z. B. "html", "css", "js", "c++"
  category: "",   // z. B. "text", "media" (Wert aus dem class-Array)
  sort: "az"      // "az", "za" oder "language"
};

// CSS-Selektor für den Tabellenkörper – einmal festgelegt, überall benutzt.
// Wenn du die Tabelle umbenennst, musst du nur diese Zeile ändern.
const TABLE_BODY_SELECTOR = "#dynamicTable tbody";

// Hier kommt später das TableSearcher-Objekt rein (siehe 7. START).
// "let" statt "const", weil der Wert erst später zugewiesen wird.
let searcher = null;


/* =====================================================================
   3. WERKZEUGE: class TableSearcher
   ---------------------------------------------------------------------
   Eine Klasse ist ein Bauplan. Mit "new TableSearcher(liste)" wird
   daraus ein Objekt, das die Liste kennt und damit arbeiten kann.
   ===================================================================== */
class TableSearcher {

  // Läuft automatisch bei "new TableSearcher(...)".
  // "this" = das Objekt, das gerade gebaut wird.
  constructor(entries) {
    this.entries = entries;
    console.log("[TableSearcher] erstellt mit", entries.length, "Einträgen");
  }

  // -------------------------------------------------------------------
  // Sucht einen Text in Tag, Beschreibung und Sprache.
  // toUpperCase() auf beiden Seiten → Groß-/Kleinschreibung egal.
  // Rückgabe: NEUE Liste mit allen Treffern.
  // -------------------------------------------------------------------
  findEntriesByText(text) {
    const upper = text.toUpperCase();

    return this.entries.filter(function matchesEntryText(entry) {
      // "entry.Tag &&" schützt vor Fehlern, falls ein Feld fehlt
      return (entry.Tag          && entry.Tag.toUpperCase().includes(upper)) ||
        (entry.Beschreibung && entry.Beschreibung.toUpperCase().includes(upper)) ||
        (entry.Sprache      && entry.Sprache.toUpperCase().includes(upper));
    });
  }

  // -------------------------------------------------------------------
  // Sucht Einträge, deren class-Array einen bestimmten Wert enthält.
  // HINWEIS: wird aktuell nicht benutzt (applyEntryFilters macht das selbst),
  //          bleibt aber als Werkzeug für später drin.
  // -------------------------------------------------------------------
  findEntriesByCategory(className) {
    const lower = className.toLowerCase();

    return this.entries.filter(function matchesEntryCategory(entry) {
      if (!entry.class) return false;            // kein class-Feld → raus

      if (Array.isArray(entry.class)) {          // class ist ein Array
        // .some() = "mindestens ein Element erfüllt die Bedingung"
        return entry.class.some(function hasMatchingCategory(categoryName) {
          return categoryName.toLowerCase() === lower;
        });
      }

      return entry.class.toLowerCase() === lower; // class ist ein einzelner Text
    });
  }

  // -------------------------------------------------------------------
  // Zeichnet eine Liste als Zeilen in die Tabelle.
  // Ablauf: Tabelle leeren → für jeden Eintrag eine <tr> mit 4 <td> bauen.
  // -------------------------------------------------------------------
  renderEntriesInTable(targetSelector, list) {
    const tableBody = document.querySelector(targetSelector);
    const overlay   = document.getElementById("noResultsOverlay");

    // Sicherheitsprüfung: Wenn das HTML-Element fehlt, nicht abstürzen,
    // sondern einen Fehler in die Konsole schreiben.
    if (!tableBody) {
      console.error("[render] Tabelle nicht gefunden:", targetSelector);
      return;
    }

    tableBody.innerHTML = ""; // alte Zeilen löschen

    // --- Keine Treffer → Overlay zeigen und abbrechen ---
    if (list.length === 0) {
      if (overlay) overlay.style.display = "flex";
      console.log("[render] keine Treffer");
      return;
    }
    if (overlay) overlay.style.display = "none";

    // --- Für jeden Eintrag eine Tabellenzeile bauen ---
    list.forEach(function appendEntryRow(entry) {
      const row = document.createElement("tr"); // neue Zeile (noch unsichtbar)

      // Spalte 1: Tag
      const cellTag = document.createElement("td");
      cellTag.textContent = entry.Tag;
      row.appendChild(cellTag);

      // Spalte 2: Beschreibung
      const cellDesc = document.createElement("td");
      cellDesc.textContent = entry.Beschreibung;
      row.appendChild(cellDesc);

      // Spalte 3: Sprache
      const cellLanguage = document.createElement("td");
      cellLanguage.textContent = entry.Sprache;
      row.appendChild(cellLanguage);

      // Spalte 4: Link (nur wenn einer eingetragen ist)
      const cellLink = document.createElement("td");
      if (entry.Link) {
        const link = document.createElement("a");
        link.href = entry.Link;
        link.textContent = "mehr";
        cellLink.appendChild(link);
      }
      row.appendChild(cellLink);

      tableBody.appendChild(row); // erst jetzt ist die Zeile sichtbar
    });

    console.log("[render]", list.length, "Zeilen gezeichnet");
  }
}


/* =====================================================================
   4. HILFSFUNKTIONEN
   ---------------------------------------------------------------------
   Kleine Funktionen, die eine einzige Aufgabe erledigen.
   ===================================================================== */

// ---------------------------------------------------------------------
// Markiert in einer Button-Gruppe genau EINEN Button als aktiv.
// allButtons    = alle Buttons der Gruppe (z. B. alle Sprach-Buttons)
// clickedButton = der Button, der gerade geklickt wurde
// ---------------------------------------------------------------------
function setActiveFilterButton(allButtons, clickedButton) {
  // Schritt 1: bei ALLEN die Markierung entfernen
  allButtons.forEach(function clearActiveButtonState(button) {
    button.classList.remove("active");
  });

  clickedButton.classList.add("active"); // CSS-Klasse "active" setzen → .button.active greift
}

// ---------------------------------------------------------------------
// Sortiert eine Liste je nach filterState.sort.
// Gibt eine SORTIERTE KOPIE zurück – die Originalliste bleibt unverändert.
// ---------------------------------------------------------------------
function sortEntriesBySelectedOrder(list) {
  const copy = [...list]; // [...x] = Kopie (Spread-Operator)

  // Kleine Hilfe: liefert den Tag als Text, auch wenn er mal fehlt.
  // (a.Tag || "") → wenn a.Tag leer/undefined ist, nimm "" stattdessen
  function getEntryTag(entry) {
    return entry.Tag || "";
  }

  switch (filterState.sort) {

    case "az":
      // localeCompare liefert: negativ = a zuerst, positiv = b zuerst, 0 = gleich
      copy.sort(function compareEntriesAlphabetically(firstEntry, secondEntry) {
        return getEntryTag(firstEntry).localeCompare(getEntryTag(secondEntry), "de");
      });
      break; // break = diesen case beenden

    case "za":
      // b mit a vergleichen statt a mit b → Reihenfolge umgedreht
      copy.sort(function compareEntriesReverseAlphabetically(firstEntry, secondEntry) {
        return getEntryTag(secondEntry).localeCompare(getEntryTag(firstEntry), "de");
      });
      break;

    case "language":
      // Erst nach Sprache sortieren. Ist die Sprache gleich (Ergebnis 0),
      // greift der Teil nach || und sortiert nach Tag.
      copy.sort(function compareEntriesByLanguageThenTag(firstEntry, secondEntry) {
        return (firstEntry.Sprache || "").localeCompare(secondEntry.Sprache || "", "de") ||
          getEntryTag(firstEntry).localeCompare(getEntryTag(secondEntry), "de");
      });
      break;

    default:
      // Unbekannter Wert → nichts sortieren, aber in der Konsole melden
      console.warn("[sort] unbekannte Sortierung:", filterState.sort);
  }

  return copy;
}


/* =====================================================================
  5. HERZSTÜCK: applyEntryFilters()
   ---------------------------------------------------------------------
   Wird nach JEDER Änderung aufgerufen und fängt jedes Mal von vorne an:
   Suche → Sprache → Kategorie → Sortieren → Anzeigen
   Dadurch lassen sich alle Filter frei kombinieren und wieder abwählen.
   ===================================================================== */
function applyEntryFilters() {
  console.log("[filter] Start mit:", filterState);

  // --- Schritt 1: Suche ---
  // Kurzform für if/else:  bedingung ? wennJa : wennNein
  let result = filterState.search === ""
    ? [...oTableEntries.List]                    // keine Suche → alles
    : searcher.findEntriesByText(filterState.search); // Suche → nur Treffer
  console.log("[filter] nach Suche:", result.length);

  // --- Schritt 2: Sprache ---
  if (filterState.language !== "") {
    // Nur Einträge behalten, deren Sprache zum gewählten Button passt.
    // toLowerCase(): "HTML"/"html"/"Html" werden alle zu "html"
    result = result.filter(item =>
      (item.Sprache || "").toLowerCase() === filterState.language
    );
    console.log("[filter] nach Sprache:", result.length);
  }

  // --- Schritt 3: Kategorie ---
  if (filterState.category !== "") {
    result = result.filter(function matchesSelectedCategory(entry) {
      // .includes() prüft, ob der Wert im class-Array vorkommt
      return Array.isArray(entry.class) && entry.class.includes(filterState.category);
    });
    console.log("[filter] nach Kategorie:", result.length);
  }

  // --- Schritt 4: Sortieren ---
  result = sortEntriesBySelectedOrder(result);

  // --- Schritt 5: Anzeigen ---
  searcher.renderEntriesInTable(TABLE_BODY_SELECTOR, result);
}


/* =====================================================================
   6. EVENTS
   ---------------------------------------------------------------------
   Jede Funktion folgt demselben Muster:
     1. Element(e) holen
     2. Event anmelden (addEventListener)
    3. Bei Event: filterState ändern → applyEntryFilters() aufrufen
   ===================================================================== */

// --- Suchfeld ---------------------------------------------------------
function setupTextSearch() {
  const input = document.getElementById("myInput");
  if (!input) {
    console.error("[setup] #myInput nicht gefunden");
    return;
  }

  // "input" feuert bei JEDEM Tastendruck (anders als "change")
  input.addEventListener("input", function handleSearchInput() {
    filterState.search = input.value.trim(); // trim() = Leerzeichen außen weg
    console.log("[event] Suche:", filterState.search);
    applyEntryFilters();
  });
}

// --- Sprach-Buttons ---------------------------------------------------
function setupLanguageFilterButtons() {
  const buttons = document.querySelectorAll(".language-btn");
  console.log("[setup] Sprach-Buttons gefunden:", buttons.length);

  buttons.forEach(function setupLanguageFilterButton(button) {
    button.addEventListener("click", function selectLanguageFilter() {
      // dataset.language liest data-language="..." aus dem HTML
      filterState.language = button.dataset.language;
      console.log("[event] Sprache:", filterState.language || "(alle)");

      setActiveFilterButton(buttons, button);
      applyEntryFilters();
    });
  });
}

// --- Kategorie-Buttons ------------------------------------------------
function setupCategoryFilterButtons() {
  const buttons = document.querySelectorAll(".category-btn");
  console.log("[setup] Kategorie-Buttons gefunden:", buttons.length);
  // Für JEDEN Kategorie-Button einen Klick-Listener anmelden
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // data-category="..." aus dem HTML in den Zustand schreiben
      filterState.category = btn.dataset.category;
      console.log("[event] Kategorie:", filterState.category || "(alle)");

      setActiveFilterButton(buttons, btn); // diesen Button hervorheben
      applyEntryFilters();                 // Tabelle neu berechnen
    });
  });

}

// --- Sortier-Auswahl --------------------------------------------------
function setupSortSelector() {
  const select = document.getElementById("sortSelect");
  if (!select) {
    console.error("[setup] #sortSelect nicht gefunden");
    return;
  }

  // "change" reicht hier: ein <select> ändert sich nur beim Auswählen
  select.addEventListener("change", function handleSortSelectionChange() {
    filterState.sort = select.value;
    console.log("[event] Sortierung:", filterState.sort);
    applyEntryFilters();
  });
}


/* =====================================================================
   7. START
   ---------------------------------------------------------------------
   Das <script> steht im <head>, also VOR dem restlichen HTML.
   DOMContentLoaded wartet, bis das ganze HTML geladen ist –
   erst dann gibt es Tabelle, Buttons und Suchfeld.
   Steht ganz unten, weil hier alles oben Definierte benutzt wird.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function initializeSpickerPage() {
  console.log("[start] Seite geladen");

  searcher = new TableSearcher(oTableEntries.List);

  setupTextSearch();
  setupLanguageFilterButtons();
  setupCategoryFilterButtons();
  setupSortSelector();

  applyEntryFilters(); // einmal alles anzeigen
  console.log("[start] fertig");
});