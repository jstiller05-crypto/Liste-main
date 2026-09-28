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
      "Link": "more/js-klammern.html",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Tag": "()",
      "Beschreibung": "zum Definieren von Funktionen und Gruppierungen",
      "Sprache": "JS",
      "Link": "more/js-klammern.html",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Tag": "{}",
      "Beschreibung": "zum Definieren von Objekten und Blockstrukturen",
      "Sprache": "JS",
      "Link": "more/js-klammern.html",
      "class": ["zeichen","javascript","js"]
    },
    {
      "Tag": "<element>",
      "Beschreibung": "Platzhalter für ein beliebiges HTML-Element",
      "Sprache": "html",
      "Link": "more/elements.html",
      "class": ["zeichen","html"]
    },
    {
      "Tag": "</element>",
      "Beschreibung": "Schließt ein HTML-Element",
      "Sprache": "html",
      "Link": "more/elements.html",
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
      "Link": "more/text-format.html",
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
      "Link": "more/svg.html",
      "class": ["html","media"]
    },
    // H
    {
      "Tag": "<h1>",
      "Beschreibung": "Wichtigste Überschrift",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h2>",
      "Beschreibung": "Zweite Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h3>",
      "Beschreibung": "Dritte Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h4>",
      "Beschreibung": "Vierte Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h5>",
      "Beschreibung": "Fünfte Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
      "class": ["basis","html","text","container"]
    },
    {
      "Tag": "<h6>",
      "Beschreibung": "Sechste Überschriftenebene",
      "Sprache": "html",
      "Link": "more/headings.html",
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
      "Link": "more/output.html",
      "class": ["html","form","text"]
    },
    {
      "Tag": "<picture>",
      "Beschreibung": "Responsive Bildquelle mit mehreren Quellen",
      "Sprache": "html",
      "Link": "more/picture.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<pre>",
      "Beschreibung": "Vorformatierter Text mit festen Abständen",
      "Sprache": "html",
      "Link": "more/computer-text.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<progress>",
      "Beschreibung": "Fortschrittsanzeige",
      "Sprache": "html",
      "Link": "more/meter.html",
      "class": ["html","form"]
    },
    // Q
    {
      "Tag": "<q>",
      "Beschreibung": "Kurz-Zitat innerhalb eines Textes",
      "Sprache": "html",
      "Link": "more/blockquote.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<ruby>",
      "Beschreibung": "Text mit Aussprachehilfe",
      "Sprache": "html",
      "Link": "more/ruby.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<rp>",
      "Beschreibung": "Text für Browser ohne Ruby-Unterstützung",
      "Sprache": "html",
      "Link": "more/ruby.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<rt>",
      "Beschreibung": "Ruby-Text zur Aussprache",
      "Sprache": "html",
      "Link": "more/ruby.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<s>",
      "Beschreibung": "Durchgestrichener Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<samp>",
      "Beschreibung": "Beispielausgabe eines Programms",
      "Sprache": "html",
      "Link": "more/computer-text.html",
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
      "Link": "more/container.html",
      "class": ["html","container","semantik"]
    },
    {
      "Tag": "<select>",
      "Beschreibung": "Auswahlmenü im Formular",
      "Sprache": "html",
      "Link": "more/select.html",
      "class": ["html","form","interactive"]
    },
    {
      "Tag": "<small>",
      "Beschreibung": "Kleinerer Nebentext",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<source>",
      "Beschreibung": "Quelle für Audio, Video oder Bild",
      "Sprache": "html",
      "Link": "more/picture.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<span>",
      "Beschreibung": "Inline-Container für Styling oder Text",
      "Sprache": "html",
      "Link": "more/container.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<strong>",
      "Beschreibung": "Wichtig hervorgehobener Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
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
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<summary>",
      "Beschreibung": "Zusammenfassung für details",
      "Sprache": "html",
      "Link": "more/details.html",
      "class": ["html","interactive","text"]
    },
    {
      "Tag": "<sup>",
      "Beschreibung": "Hochgestellter Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<svg>",
      "Beschreibung": "Vektorgrafik im HTML-Dokument",
      "Sprache": "html",
      "Link": "more/svg.html",
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
      "Link": "more/table.html",
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
      "Link": "more/template-tag.html",
      "class": ["html","container"]
    },
    {
      "Tag": "<textarea>",
      "Beschreibung": "Mehrzeiliges Texteingabefeld",
      "Sprache": "html",
      "Link": "more/textarea.html",
      "class": ["html","form","interactive"]
    },
    {
      "Tag": "<tfoot>",
      "Beschreibung": "Fußbereich einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<th>",
      "Beschreibung": "Kopfzelle einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<thead>",
      "Beschreibung": "Kopfbereich einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<time>",
      "Beschreibung": "Datum oder Uhrzeit markieren",
      "Sprache": "html",
      "Link": "more/time.html",
      "class": ["html","text"]
    },
    {
      "Tag": "<title>",
      "Beschreibung": "Titel des Dokuments im Browser-Tab",
      "Sprache": "html",
      "Link": "more/head.html",
      "class": ["html","metadata"]
    },
    {
      "Tag": "<tr>",
      "Beschreibung": "Zeile in einer Tabelle",
      "Sprache": "html",
      "Link": "more/table.html",
      "class": ["html","tabelle"]
    },
    {
      "Tag": "<track>",
      "Beschreibung": "Untertitel oder Textspur für Video/Audio",
      "Sprache": "html",
      "Link": "more/video.html",
      "class": ["html","media"]
    },
    {
      "Tag": "<u>",
      "Beschreibung": "Unterstrichener Text",
      "Sprache": "html",
      "Link": "more/text-format.html",
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
      "Link": "more/computer-text.html",
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
      "Link": "more/br.html",
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
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Klassenselektor",
      "Beschreibung": "Wählt Elemente nach ihrer CSS-Klasse aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "ID-Selektor",
      "Beschreibung": "Wählt Elemente anhand ihres id-Attributs aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Universalselektor",
      "Beschreibung": "Wählt alle Elemente auf der Seite aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Kindselektoren",
      "Beschreibung": "Wählt direkte Kinder eines Elements aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Nachfahrensselektoren",
      "Beschreibung": "Wählt Nachfahren eines Elements aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Allgemeine Geschwisterselektoren",
      "Beschreibung": "Wählt nachfolgende Geschwisterelemente aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Angrenzende Geschwisterselektoren",
      "Beschreibung": "Wählt das unmittelbar folgende Geschwisterelement aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "Attributselektor",
      "Beschreibung": "Wählt Elemente nach Attributwert aus",
      "Sprache": "CSS",
      "Link": "more/css-selektoren.html",
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
    },
    // CSS – Eigenschaften & Konzepte
    {
      "Tag": "CSS-Regel",
      "Beschreibung": "Aufbau einer Regel: Selektor { Eigenschaft: Wert; }",
      "Sprache": "CSS",
      "Link": "more/css-grundlagen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Tag": "Kaskade & Spezifität",
      "Beschreibung": "Welche CSS-Regel gewinnt, wenn mehrere gelten",
      "Sprache": "CSS",
      "Link": "more/css-grundlagen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Tag": "Vererbung (inherit)",
      "Beschreibung": "Eigenschaften, die Kind-Elemente übernehmen",
      "Sprache": "CSS",
      "Link": "more/css-grundlagen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Tag": "color",
      "Beschreibung": "Textfarbe",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Tag": "background",
      "Beschreibung": "Hintergrundfarbe, -bild und Farbverläufe",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Tag": "Farbformate (hex, rgb, hsl)",
      "Beschreibung": "Schreibweisen für Farben",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Tag": "opacity",
      "Beschreibung": "Durchsichtigkeit eines Elements",
      "Sprache": "CSS",
      "Link": "more/css-farben.html",
      "class": ["css","gestaltung","farben"]
    },
    {
      "Tag": "font-family / font-size",
      "Beschreibung": "Schriftart und Schriftgröße",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Tag": "font-weight",
      "Beschreibung": "Schriftdicke (normal, fett)",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Tag": "line-height",
      "Beschreibung": "Zeilenabstand",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Tag": "text-align",
      "Beschreibung": "Textausrichtung (links, zentriert, rechts)",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Tag": "text-decoration / text-transform",
      "Beschreibung": "Unterstreichen, Großbuchstaben usw.",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Tag": "@font-face",
      "Beschreibung": "Eigene Schriftarten einbinden",
      "Sprache": "CSS",
      "Link": "more/css-text.html",
      "class": ["css","gestaltung","text"]
    },
    {
      "Tag": "Box-Modell",
      "Beschreibung": "Inhalt, padding, border und margin einer Box",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "margin",
      "Beschreibung": "Außenabstand eines Elements",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "padding",
      "Beschreibung": "Innenabstand eines Elements",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "border / border-radius",
      "Beschreibung": "Rahmen und abgerundete Ecken",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout","gestaltung"]
    },
    {
      "Tag": "width / height",
      "Beschreibung": "Breite und Höhe (auch min-/max-)",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "box-sizing",
      "Beschreibung": "Ob padding und border zur Breite zählen",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "box-shadow",
      "Beschreibung": "Schatten um eine Box",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","gestaltung"]
    },
    {
      "Tag": "overflow",
      "Beschreibung": "Umgang mit überstehendem Inhalt",
      "Sprache": "CSS",
      "Link": "more/css-boxmodell.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "Einheiten (px, rem, %, vw)",
      "Beschreibung": "Größenangaben in CSS",
      "Sprache": "CSS",
      "Link": "more/css-einheiten.html",
      "class": ["css","grundlagen"]
    },
    {
      "Tag": "calc() / clamp()",
      "Beschreibung": "Mit Werten rechnen und begrenzen",
      "Sprache": "CSS",
      "Link": "more/css-einheiten.html",
      "class": ["css","grundlagen"]
    },
    {
      "Tag": "display",
      "Beschreibung": "block, inline, inline-block, none",
      "Sprache": "CSS",
      "Link": "more/css-display.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "visibility",
      "Beschreibung": "Element unsichtbar machen, Platz bleibt",
      "Sprache": "CSS",
      "Link": "more/css-display.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "Flexbox",
      "Beschreibung": "Elemente in Reihe oder Spalte anordnen",
      "Sprache": "CSS",
      "Link": "more/css-flexbox.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "justify-content / align-items",
      "Beschreibung": "Ausrichtung in Flexbox und Grid",
      "Sprache": "CSS",
      "Link": "more/css-flexbox.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "gap",
      "Beschreibung": "Abstand zwischen Flex- und Grid-Elementen",
      "Sprache": "CSS",
      "Link": "more/css-flexbox.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "Grid",
      "Beschreibung": "Zweidimensionales Raster-Layout",
      "Sprache": "CSS",
      "Link": "more/css-grid.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "grid-template-columns",
      "Beschreibung": "Spalten eines Grids festlegen",
      "Sprache": "CSS",
      "Link": "more/css-grid.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "position",
      "Beschreibung": "static, relative, absolute, fixed, sticky",
      "Sprache": "CSS",
      "Link": "more/css-position.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "z-index",
      "Beschreibung": "Stapelreihenfolge überlappender Elemente",
      "Sprache": "CSS",
      "Link": "more/css-position.html",
      "class": ["css","layout"]
    },
    {
      "Tag": ":hover / :focus",
      "Beschreibung": "Pseudoklassen für Zustände",
      "Sprache": "CSS",
      "Link": "more/css-pseudo.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": ":nth-child()",
      "Beschreibung": "Elemente nach Position auswählen",
      "Sprache": "CSS",
      "Link": "more/css-pseudo.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "::before / ::after",
      "Beschreibung": "Pseudoelemente: Inhalt vor/nach einem Element",
      "Sprache": "CSS",
      "Link": "more/css-pseudo.html",
      "class": ["css","selektoren"]
    },
    {
      "Tag": "@media",
      "Beschreibung": "Media Queries für Responsive Design",
      "Sprache": "CSS",
      "Link": "more/css-media-queries.html",
      "class": ["css","layout"]
    },
    {
      "Tag": "CSS-Variablen (--name)",
      "Beschreibung": "Wiederverwendbare Werte mit var()",
      "Sprache": "CSS",
      "Link": "more/css-variablen.html",
      "class": ["css","grundlagen"]
    },
    {
      "Tag": "transition",
      "Beschreibung": "Weicher Übergang zwischen zwei Zuständen",
      "Sprache": "CSS",
      "Link": "more/css-animation.html",
      "class": ["css","effekte"]
    },
    {
      "Tag": "transform",
      "Beschreibung": "Verschieben, drehen, skalieren",
      "Sprache": "CSS",
      "Link": "more/css-animation.html",
      "class": ["css","effekte"]
    },
    {
      "Tag": "@keyframes / animation",
      "Beschreibung": "Eigene Animationen definieren",
      "Sprache": "CSS",
      "Link": "more/css-animation.html",
      "class": ["css","effekte"]
    },
    {
      "Tag": "cursor",
      "Beschreibung": "Mauszeiger über einem Element",
      "Sprache": "CSS",
      "Link": "more/css-sonstiges.html",
      "class": ["css","gestaltung"]
    },
    {
      "Tag": "list-style",
      "Beschreibung": "Aufzählungszeichen von Listen",
      "Sprache": "CSS",
      "Link": "more/css-sonstiges.html",
      "class": ["css","gestaltung"]
    },
    {
      "Tag": "object-fit / aspect-ratio",
      "Beschreibung": "Bilder in Boxen einpassen, Seitenverhältnis",
      "Sprache": "CSS",
      "Link": "more/css-sonstiges.html",
      "class": ["css","gestaltung"]
    },
    // JavaScript – Grundlagen, Daten, DOM
    {
      "Tag": "let / const",
      "Beschreibung": "Variablen anlegen",
      "Sprache": "JS",
      "Link": "more/js-variablen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "Datentypen (string, number, boolean)",
      "Beschreibung": "Grundtypen in JavaScript",
      "Sprache": "JS",
      "Link": "more/js-variablen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "typeof",
      "Beschreibung": "Datentyp eines Werts prüfen",
      "Sprache": "JS",
      "Link": "more/js-variablen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "Operatoren (+ - * / %)",
      "Beschreibung": "Rechnen in JavaScript",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "=== / !==",
      "Beschreibung": "Streng vergleichen (Wert und Typ)",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "&& / || / !",
      "Beschreibung": "Logisches UND, ODER, NICHT",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "? : (Ternär)",
      "Beschreibung": "Kurzes if/else in einer Zeile",
      "Sprache": "JS",
      "Link": "more/js-operatoren.html",
      "class": ["javascript","js","grundlagen","kontrolle"]
    },
    {
      "Tag": "if / else",
      "Beschreibung": "Code nur unter einer Bedingung ausführen",
      "Sprache": "JS",
      "Link": "more/js-bedingungen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Tag": "switch",
      "Beschreibung": "Mehrere feste Fälle unterscheiden",
      "Sprache": "JS",
      "Link": "more/js-bedingungen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Tag": "for",
      "Beschreibung": "Schleife mit Zähler",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Tag": "while / do…while",
      "Beschreibung": "Schleife solange eine Bedingung gilt",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Tag": "for…of / for…in",
      "Beschreibung": "Über Arrays bzw. Objekt-Schlüssel laufen",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Tag": "break / continue",
      "Beschreibung": "Schleife abbrechen oder Durchlauf überspringen",
      "Sprache": "JS",
      "Link": "more/js-schleifen.html",
      "class": ["javascript","js","kontrolle"]
    },
    {
      "Tag": "function",
      "Beschreibung": "Funktion deklarieren",
      "Sprache": "JS",
      "Link": "more/js-funktionen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "=> (Pfeilfunktion)",
      "Beschreibung": "Kurze Schreibweise für Funktionen",
      "Sprache": "JS",
      "Link": "more/js-funktionen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "return",
      "Beschreibung": "Wert aus einer Funktion zurückgeben",
      "Sprache": "JS",
      "Link": "more/js-funktionen.html",
      "class": ["javascript","js","grundlagen"]
    },
    {
      "Tag": "Array",
      "Beschreibung": "Liste von Werten",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "push / pop",
      "Beschreibung": "Elemente hinten anfügen / entfernen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "forEach",
      "Beschreibung": "Für jedes Array-Element etwas ausführen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "map",
      "Beschreibung": "Jedes Element umwandeln → neues Array",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "filter",
      "Beschreibung": "Passende Elemente auswählen → neues Array",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "find / includes",
      "Beschreibung": "Element suchen / Enthaltensein prüfen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "sort",
      "Beschreibung": "Array sortieren",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "reduce",
      "Beschreibung": "Array zu einem Wert zusammenfassen",
      "Sprache": "JS",
      "Link": "more/js-arrays.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "Objekt",
      "Beschreibung": "Daten als Schlüssel-Wert-Paare",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "Destructuring",
      "Beschreibung": "Werte aus Objekten/Arrays auspacken",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "... (Spread)",
      "Beschreibung": "Arrays/Objekte kopieren und zusammenführen",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "JSON",
      "Beschreibung": "JSON.stringify / JSON.parse",
      "Sprache": "JS",
      "Link": "more/js-objekte.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "Template-String",
      "Beschreibung": "Text mit ${Variablen} in Backticks",
      "Sprache": "JS",
      "Link": "more/js-strings.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "String-Methoden",
      "Beschreibung": "toUpperCase, trim, includes, split, slice …",
      "Sprache": "JS",
      "Link": "more/js-strings.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "document.querySelector",
      "Beschreibung": "Element per CSS-Selektor finden",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "getElementById",
      "Beschreibung": "Element über seine ID finden",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "textContent / innerHTML",
      "Beschreibung": "Inhalt eines Elements lesen/ändern",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "classList",
      "Beschreibung": "CSS-Klassen hinzufügen, entfernen, umschalten",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "createElement / appendChild",
      "Beschreibung": "Neue Elemente erzeugen und einfügen",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "dataset",
      "Beschreibung": "data-*-Attribute auslesen",
      "Sprache": "JS",
      "Link": "more/js-dom.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "addEventListener",
      "Beschreibung": "Auf Ereignisse wie Klicks reagieren",
      "Sprache": "JS",
      "Link": "more/js-events.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "event.preventDefault()",
      "Beschreibung": "Standardverhalten des Browsers verhindern",
      "Sprache": "JS",
      "Link": "more/js-events.html",
      "class": ["javascript","js","dom"]
    },
    {
      "Tag": "console.log",
      "Beschreibung": "Ausgabe in der Browser-Konsole",
      "Sprache": "JS",
      "Link": "more/js-konsole.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Tag": "try / catch",
      "Beschreibung": "Fehler abfangen",
      "Sprache": "JS",
      "Link": "more/js-konsole.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Tag": "setTimeout / setInterval",
      "Beschreibung": "Code verzögert oder wiederholt ausführen",
      "Sprache": "JS",
      "Link": "more/js-async.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Tag": "async / await",
      "Beschreibung": "Auf asynchrone Vorgänge warten",
      "Sprache": "JS",
      "Link": "more/js-async.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Tag": "fetch",
      "Beschreibung": "Daten aus dem Netz laden",
      "Sprache": "JS",
      "Link": "more/js-async.html",
      "class": ["javascript","js","werkzeuge"]
    },
    {
      "Tag": "localStorage",
      "Beschreibung": "Daten im Browser speichern",
      "Sprache": "JS",
      "Link": "more/js-speicher.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "Math",
      "Beschreibung": "Runden, Zufallszahlen, Wurzel …",
      "Sprache": "JS",
      "Link": "more/js-mathe.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "Date",
      "Beschreibung": "Datum und Uhrzeit",
      "Sprache": "JS",
      "Link": "more/js-mathe.html",
      "class": ["javascript","js","daten"]
    },
    {
      "Tag": "import / export",
      "Beschreibung": "Code auf Module verteilen",
      "Sprache": "JS",
      "Link": "more/js-module.html",
      "class": ["javascript","js","werkzeuge"]
    },
    // C++ – weiterführende Themen
    {
      "Tag": "Operatoren (+ - * / %)",
      "Beschreibung": "Rechnen, Rest, Kurzformen wie +=",
      "Sprache": "C++",
      "Link": "more/cpp-operatoren.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Tag": "== / != / && / ||",
      "Beschreibung": "Vergleichen und logisch verknüpfen",
      "Sprache": "C++",
      "Link": "more/cpp-operatoren.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Tag": "static_cast",
      "Beschreibung": "Datentypen sicher umwandeln",
      "Sprache": "C++",
      "Link": "more/cpp-operatoren.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Tag": "stoi / to_string",
      "Beschreibung": "Text in Zahl umwandeln und zurück",
      "Sprache": "C++",
      "Link": "more/cpp-string.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "switch",
      "Beschreibung": "Mehrere feste Fälle unterscheiden",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","kontrolle"]
    },
    {
      "Tag": "do-while-Schleife",
      "Beschreibung": "Schleife, die mindestens einmal läuft",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Tag": "break / continue",
      "Beschreibung": "Schleife abbrechen oder Durchlauf überspringen",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","kontrolle"]
    },
    {
      "Tag": "Bereichsbasierte for-Schleife",
      "Beschreibung": "for (auto& x : container)",
      "Sprache": "C++",
      "Link": "more/cpp-kontrolle.html",
      "class": ["cpp","schleife","kontrolle"]
    },
    {
      "Tag": "Array (C-Array)",
      "Beschreibung": "Feste Anzahl Werte gleichen Typs",
      "Sprache": "C++",
      "Link": "more/cpp-arrays.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "std::array",
      "Beschreibung": "Modernes Array mit fester Größe",
      "Sprache": "C++",
      "Link": "more/cpp-arrays.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "std::vector",
      "Beschreibung": "Dynamische Liste, wächst automatisch",
      "Sprache": "C++",
      "Link": "more/cpp-vector.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "push_back / size",
      "Beschreibung": "Element anhängen, Anzahl abfragen",
      "Sprache": "C++",
      "Link": "more/cpp-vector.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "std::string",
      "Beschreibung": "Text speichern und bearbeiten",
      "Sprache": "C++",
      "Link": "more/cpp-string.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "getline",
      "Beschreibung": "Ganze Zeile mit Leerzeichen einlesen",
      "Sprache": "C++",
      "Link": "more/cpp-string.html",
      "class": ["cpp","io","eingabe"]
    },
    {
      "Tag": "const",
      "Beschreibung": "Unveränderliche Werte",
      "Sprache": "C++",
      "Link": "more/cpp-const-auto.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Tag": "constexpr",
      "Beschreibung": "Zur Compile-Zeit berechnete Konstanten",
      "Sprache": "C++",
      "Link": "more/cpp-const-auto.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Tag": "auto",
      "Beschreibung": "Typ vom Compiler bestimmen lassen",
      "Sprache": "C++",
      "Link": "more/cpp-const-auto.html",
      "class": ["cpp","grundlagen"]
    },
    {
      "Tag": "struct",
      "Beschreibung": "Eigener Datentyp aus mehreren Werten",
      "Sprache": "C++",
      "Link": "more/cpp-struct-enum.html",
      "class": ["cpp","daten","oop"]
    },
    {
      "Tag": "enum class",
      "Beschreibung": "Benannte feste Auswahlmöglichkeiten",
      "Sprache": "C++",
      "Link": "more/cpp-struct-enum.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "Konstruktor / Destruktor",
      "Beschreibung": "Objekt erzeugen und aufräumen",
      "Sprache": "C++",
      "Link": "more/cpp-konstruktor.html",
      "class": ["cpp","oop","klasse"]
    },
    {
      "Tag": "public / private / protected",
      "Beschreibung": "Zugriffsrechte in Klassen (Kapselung)",
      "Sprache": "C++",
      "Link": "more/cpp-konstruktor.html",
      "class": ["cpp","oop","klasse"]
    },
    {
      "Tag": "this",
      "Beschreibung": "Zeiger auf das aktuelle Objekt",
      "Sprache": "C++",
      "Link": "more/cpp-konstruktor.html",
      "class": ["cpp","oop","klasse"]
    },
    {
      "Tag": "Vererbung",
      "Beschreibung": "Klasse von einer Basisklasse ableiten",
      "Sprache": "C++",
      "Link": "more/cpp-vererbung.html",
      "class": ["cpp","oop"]
    },
    {
      "Tag": "virtual / override",
      "Beschreibung": "Methoden überschreiben, Polymorphie",
      "Sprache": "C++",
      "Link": "more/cpp-vererbung.html",
      "class": ["cpp","oop"]
    },
    {
      "Tag": "new / delete",
      "Beschreibung": "Speicher auf dem Heap anlegen und freigeben",
      "Sprache": "C++",
      "Link": "more/cpp-speicher.html",
      "class": ["cpp","speicher"]
    },
    {
      "Tag": "Smart Pointer (unique_ptr)",
      "Beschreibung": "Automatische Speicherverwaltung",
      "Sprache": "C++",
      "Link": "more/cpp-speicher.html",
      "class": ["cpp","speicher"]
    },
    {
      "Tag": "std::map",
      "Beschreibung": "Werte über Schlüssel nachschlagen",
      "Sprache": "C++",
      "Link": "more/cpp-map.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "std::set",
      "Beschreibung": "Menge ohne doppelte Werte",
      "Sprache": "C++",
      "Link": "more/cpp-map.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "std::pair",
      "Beschreibung": "Zwei Werte als Paar",
      "Sprache": "C++",
      "Link": "more/cpp-map.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "Lambda",
      "Beschreibung": "Kleine Funktion direkt im Code: [](int x){ … }",
      "Sprache": "C++",
      "Link": "more/cpp-algorithmen.html",
      "class": ["cpp","funktion"]
    },
    {
      "Tag": "std::sort",
      "Beschreibung": "Container sortieren",
      "Sprache": "C++",
      "Link": "more/cpp-algorithmen.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "std::find / std::count",
      "Beschreibung": "Suchen und Zählen in Containern",
      "Sprache": "C++",
      "Link": "more/cpp-algorithmen.html",
      "class": ["cpp","daten"]
    },
    {
      "Tag": "Zufallszahlen (<random>)",
      "Beschreibung": "mt19937 und uniform_int_distribution",
      "Sprache": "C++",
      "Link": "more/cpp-zufall.html",
      "class": ["cpp","werkzeuge"]
    },
    {
      "Tag": "Header-Dateien (.h)",
      "Beschreibung": "Code auf mehrere Dateien verteilen",
      "Sprache": "C++",
      "Link": "more/cpp-header.html",
      "class": ["cpp","werkzeuge","praeprozessor"]
    },
    {
      "Tag": "#pragma once",
      "Beschreibung": "Header nur einmal einbinden",
      "Sprache": "C++",
      "Link": "more/cpp-header.html",
      "class": ["cpp","werkzeuge","praeprozessor"]
    },
    {
      "Tag": "try / catch / throw",
      "Beschreibung": "Exceptions werfen und abfangen",
      "Sprache": "C++",
      "Link": "more/cpp-fehler.html",
      "class": ["cpp","werkzeuge"]
    },
    {
      "Tag": "std::cerr",
      "Beschreibung": "Ausgabe auf dem Fehlerkanal",
      "Sprache": "C++",
      "Link": "more/cpp-fehler.html",
      "class": ["cpp","io","ausgabe"]
    },
    {
      "Tag": "fstream",
      "Beschreibung": "Dateien lesen und schreiben",
      "Sprache": "C++",
      "Link": "more/cpp-dateien.html",
      "class": ["cpp","io","werkzeuge"]
    },
    {
      "Tag": "template",
      "Beschreibung": "Funktionen/Klassen für beliebige Typen",
      "Sprache": "C++",
      "Link": "more/cpp-templates.html",
      "class": ["cpp","funktion"]
    },
    {
      "Tag": "g++ / Kompilieren",
      "Beschreibung": "Vom Quellcode zum Programm",
      "Sprache": "C++",
      "Link": "more/cpp-kompilieren.html",
      "class": ["cpp","werkzeuge"]
    },
    {
      "Tag": "CMake",
      "Beschreibung": "Build-System für C++-Projekte",
      "Sprache": "C++",
      "Link": "more/cpp-kompilieren.html",
      "class": ["cpp","werkzeuge"]
    },
    // Node.js
    {
      "Tag": "Node.js",
      "Beschreibung": "JavaScript auf dem Server und in der Kommandozeile",
      "Sprache": "Node.js",
      "Link": "more/node-einfuehrung.html",
      "class": ["node.js","sprache","grundlagen"]
    },
    {
      "Tag": "node datei.js",
      "Beschreibung": "Ein Skript mit Node.js ausführen",
      "Sprache": "Node.js",
      "Link": "more/node-einfuehrung.html",
      "class": ["node.js","grundlagen","werkzeuge"]
    },
    {
      "Tag": "npm install",
      "Beschreibung": "Pakete installieren",
      "Sprache": "Node.js",
      "Link": "more/node-npm.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "package.json",
      "Beschreibung": "Projektbeschreibung, Skripte und Abhängigkeiten",
      "Sprache": "Node.js",
      "Link": "more/node-npm.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "npm run",
      "Beschreibung": "Skripte aus package.json starten",
      "Sprache": "Node.js",
      "Link": "more/node-npm.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "import / require",
      "Beschreibung": "Module in Node.js laden (ESM / CommonJS)",
      "Sprache": "Node.js",
      "Link": "more/node-module.html",
      "class": ["node.js","grundlagen"]
    },
    {
      "Tag": "path",
      "Beschreibung": "Pfade sicher zusammensetzen",
      "Sprache": "Node.js",
      "Link": "more/node-module.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "fs (readFile / writeFile)",
      "Beschreibung": "Dateien lesen und schreiben",
      "Sprache": "Node.js",
      "Link": "more/node-dateien.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "http.createServer",
      "Beschreibung": "Einfachen Webserver starten",
      "Sprache": "Node.js",
      "Link": "more/node-http.html",
      "class": ["node.js","server"]
    },
    {
      "Tag": "Express",
      "Beschreibung": "Framework für Webserver und APIs",
      "Sprache": "Node.js",
      "Link": "more/node-express.html",
      "class": ["node.js","server"]
    },
    {
      "Tag": "app.get / app.post",
      "Beschreibung": "Routen in Express definieren",
      "Sprache": "Node.js",
      "Link": "more/node-express.html",
      "class": ["node.js","server"]
    },
    {
      "Tag": "req / res",
      "Beschreibung": "Anfrage und Antwort im Server",
      "Sprache": "Node.js",
      "Link": "more/node-express.html",
      "class": ["node.js","server"]
    },
    {
      "Tag": "process.argv",
      "Beschreibung": "Kommandozeilen-Argumente lesen",
      "Sprache": "Node.js",
      "Link": "more/node-process.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "process.env / .env",
      "Beschreibung": "Umgebungsvariablen und Geheimnisse",
      "Sprache": "Node.js",
      "Link": "more/node-process.html",
      "class": ["node.js","werkzeuge"]
    },
    {
      "Tag": "node:sqlite / mysql2",
      "Beschreibung": "Datenbank aus Node.js ansprechen",
      "Sprache": "Node.js",
      "Link": "more/node-datenbank.html",
      "class": ["node.js","server","daten"]
    },
    // SQL
    {
      "Tag": "SQL",
      "Beschreibung": "Sprache für relationale Datenbanken",
      "Sprache": "SQL",
      "Link": "more/sql-einfuehrung.html",
      "class": ["sql","sprache","grundlagen"]
    },
    {
      "Tag": "CREATE TABLE",
      "Beschreibung": "Tabelle mit Spalten und Datentypen anlegen",
      "Sprache": "SQL",
      "Link": "more/sql-tabellen.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "PRIMARY KEY",
      "Beschreibung": "Eindeutige ID einer Zeile",
      "Sprache": "SQL",
      "Link": "more/sql-tabellen.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "ALTER / DROP TABLE",
      "Beschreibung": "Tabelle ändern oder löschen",
      "Sprache": "SQL",
      "Link": "more/sql-tabellen.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "SELECT",
      "Beschreibung": "Daten abfragen",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "WHERE",
      "Beschreibung": "Zeilen filtern",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "ORDER BY / LIMIT",
      "Beschreibung": "Sortieren und begrenzen",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "LIKE / IN / BETWEEN",
      "Beschreibung": "Muster, Listen und Bereiche prüfen",
      "Sprache": "SQL",
      "Link": "more/sql-select.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "INSERT INTO",
      "Beschreibung": "Datensatz einfügen",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "UPDATE",
      "Beschreibung": "Datensätze ändern",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "DELETE",
      "Beschreibung": "Datensätze löschen",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "Transaktion (BEGIN / COMMIT)",
      "Beschreibung": "Mehrere Änderungen ganz oder gar nicht",
      "Sprache": "SQL",
      "Link": "more/sql-daten-aendern.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "COUNT / SUM / AVG",
      "Beschreibung": "Zählen, summieren, Durchschnitt",
      "Sprache": "SQL",
      "Link": "more/sql-aggregat.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "GROUP BY / HAVING",
      "Beschreibung": "Ergebnisse gruppieren und Gruppen filtern",
      "Sprache": "SQL",
      "Link": "more/sql-aggregat.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "JOIN",
      "Beschreibung": "Tabellen verbinden",
      "Sprache": "SQL",
      "Link": "more/sql-joins.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "FOREIGN KEY",
      "Beschreibung": "Verweis auf eine andere Tabelle",
      "Sprache": "SQL",
      "Link": "more/sql-joins.html",
      "class": ["sql","daten"]
    },
    {
      "Tag": "SQL-Injection",
      "Beschreibung": "Sicherheitslücke und wie Platzhalter schützen",
      "Sprache": "SQL",
      "Link": "more/sql-sicherheit.html",
      "class": ["sql","werkzeuge"]
    },
    // PHP
    {
      "Tag": "PHP",
      "Beschreibung": "Server-Sprache, die HTML-Seiten erzeugt",
      "Sprache": "PHP",
      "Link": "more/php-einfuehrung.html",
      "class": ["php","sprache","grundlagen"]
    },
    {
      "Tag": "<?php ?> / echo",
      "Beschreibung": "PHP-Code einbetten und ausgeben",
      "Sprache": "PHP",
      "Link": "more/php-einfuehrung.html",
      "class": ["php","grundlagen"]
    },
    {
      "Tag": "$variable",
      "Beschreibung": "Variablen in PHP",
      "Sprache": "PHP",
      "Link": "more/php-grundlagen.html",
      "class": ["php","grundlagen"]
    },
    {
      "Tag": ". (Verkettung)",
      "Beschreibung": "Texte in PHP verbinden",
      "Sprache": "PHP",
      "Link": "more/php-grundlagen.html",
      "class": ["php","grundlagen"]
    },
    {
      "Tag": "var_dump / print_r",
      "Beschreibung": "Werte zum Debuggen ausgeben",
      "Sprache": "PHP",
      "Link": "more/php-grundlagen.html",
      "class": ["php","werkzeuge"]
    },
    {
      "Tag": "if / elseif / match",
      "Beschreibung": "Bedingungen in PHP",
      "Sprache": "PHP",
      "Link": "more/php-kontrolle.html",
      "class": ["php","kontrolle"]
    },
    {
      "Tag": "foreach",
      "Beschreibung": "Über Arrays laufen",
      "Sprache": "PHP",
      "Link": "more/php-kontrolle.html",
      "class": ["php","kontrolle"]
    },
    {
      "Tag": "function (PHP)",
      "Beschreibung": "Eigene Funktionen mit Typangaben",
      "Sprache": "PHP",
      "Link": "more/php-funktionen.html",
      "class": ["php","funktion"]
    },
    {
      "Tag": "include / require",
      "Beschreibung": "Andere PHP-Dateien einbinden",
      "Sprache": "PHP",
      "Link": "more/php-funktionen.html",
      "class": ["php","einbinden"]
    },
    {
      "Tag": "Array (PHP)",
      "Beschreibung": "Indizierte und assoziative Arrays",
      "Sprache": "PHP",
      "Link": "more/php-arrays.html",
      "class": ["php","daten"]
    },
    {
      "Tag": "array_map / array_filter",
      "Beschreibung": "Arrays umwandeln und filtern",
      "Sprache": "PHP",
      "Link": "more/php-arrays.html",
      "class": ["php","daten"]
    },
    {
      "Tag": "$_GET / $_POST",
      "Beschreibung": "Formulardaten empfangen",
      "Sprache": "PHP",
      "Link": "more/php-formulare.html",
      "class": ["php","form","server"]
    },
    {
      "Tag": "htmlspecialchars",
      "Beschreibung": "Ausgaben gegen XSS absichern",
      "Sprache": "PHP",
      "Link": "more/php-formulare.html",
      "class": ["php","form","werkzeuge"]
    },
    {
      "Tag": "session_start / $_SESSION",
      "Beschreibung": "Daten über mehrere Seiten merken",
      "Sprache": "PHP",
      "Link": "more/php-sessions.html",
      "class": ["php","server"]
    },
    {
      "Tag": "setcookie",
      "Beschreibung": "Cookies setzen",
      "Sprache": "PHP",
      "Link": "more/php-sessions.html",
      "class": ["php","server"]
    },
    {
      "Tag": "password_hash",
      "Beschreibung": "Passwörter sicher speichern",
      "Sprache": "PHP",
      "Link": "more/php-sessions.html",
      "class": ["php","werkzeuge"]
    },
    {
      "Tag": "PDO",
      "Beschreibung": "Datenbankzugriff mit Prepared Statements",
      "Sprache": "PHP",
      "Link": "more/php-datenbank.html",
      "class": ["php","server","daten"]
    },
    {
      "Tag": "class (PHP)",
      "Beschreibung": "Klassen und Objekte in PHP",
      "Sprache": "PHP",
      "Link": "more/php-oop.html",
      "class": ["php","oop"]
    },
    // Terminal
    {
      "Tag": "Terminal (Windows vs. Linux)",
      "Beschreibung": "Wichtige Befehle für PowerShell und Bash im Vergleich",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    {
      "Tag": "cd / ls / mkdir",
      "Beschreibung": "Im Terminal navigieren und Ordner anlegen",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    {
      "Tag": "winget / apt",
      "Beschreibung": "Software über die Kommandozeile installieren",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    {
      "Tag": "Umgebungsvariablen ($env / export)",
      "Beschreibung": "Variablen im Terminal setzen",
      "Sprache": "Terminal",
      "Link": "more/terminal.html",
      "class": ["terminal","werkzeuge"]
    },
    // Lua
    {
      "Tag": "Lua",
      "Beschreibung": "Kleine Skriptsprache für Spiele und Mods",
      "Sprache": "Lua",
      "Link": "more/lua-einfuehrung.html",
      "class": ["lua","sprache","grundlagen"]
    },
    {
      "Tag": "local",
      "Beschreibung": "Lokale Variable anlegen",
      "Sprache": "Lua",
      "Link": "more/lua-grundlagen.html",
      "class": ["lua","grundlagen"]
    },
    {
      "Tag": "nil / type()",
      "Beschreibung": "Kein Wert / Datentyp prüfen",
      "Sprache": "Lua",
      "Link": "more/lua-grundlagen.html",
      "class": ["lua","grundlagen"]
    },
    {
      "Tag": ".. (Verkettung)",
      "Beschreibung": "Texte in Lua verbinden",
      "Sprache": "Lua",
      "Link": "more/lua-grundlagen.html",
      "class": ["lua","grundlagen"]
    },
    {
      "Tag": "if … then … end",
      "Beschreibung": "Bedingungen in Lua",
      "Sprache": "Lua",
      "Link": "more/lua-kontrolle.html",
      "class": ["lua","kontrolle"]
    },
    {
      "Tag": "for / while / repeat",
      "Beschreibung": "Schleifen in Lua",
      "Sprache": "Lua",
      "Link": "more/lua-kontrolle.html",
      "class": ["lua","kontrolle","schleife"]
    },
    {
      "Tag": "function (Lua)",
      "Beschreibung": "Funktionen, mehrere Rückgabewerte, Closures",
      "Sprache": "Lua",
      "Link": "more/lua-funktionen.html",
      "class": ["lua","funktion"]
    },
    {
      "Tag": "Tabelle (table)",
      "Beschreibung": "Liste, Wörterbuch und Objekt in einem",
      "Sprache": "Lua",
      "Link": "more/lua-tabellen.html",
      "class": ["lua","daten"]
    },
    {
      "Tag": "ipairs / pairs",
      "Beschreibung": "Über Tabellen laufen",
      "Sprache": "Lua",
      "Link": "more/lua-tabellen.html",
      "class": ["lua","daten","kontrolle"]
    },
    {
      "Tag": "table.insert / table.sort",
      "Beschreibung": "Tabellen bearbeiten",
      "Sprache": "Lua",
      "Link": "more/lua-tabellen.html",
      "class": ["lua","daten"]
    },
    {
      "Tag": "string.format / Patterns",
      "Beschreibung": "Texte formatieren und durchsuchen",
      "Sprache": "Lua",
      "Link": "more/lua-strings.html",
      "class": ["lua","daten"]
    },
    {
      "Tag": "require",
      "Beschreibung": "Module laden",
      "Sprache": "Lua",
      "Link": "more/lua-module.html",
      "class": ["lua","werkzeuge"]
    },
    {
      "Tag": "setmetatable",
      "Beschreibung": "Klassen mit Metatabellen",
      "Sprache": "Lua",
      "Link": "more/lua-module.html",
      "class": ["lua","oop"]
    },
    {
      "Tag": "pcall / error",
      "Beschreibung": "Fehler abfangen und auslösen",
      "Sprache": "Lua",
      "Link": "more/lua-module.html",
      "class": ["lua","werkzeuge"]
    },
    {
      "Tag": "core.register_node",
      "Beschreibung": "Block in einem Luanti-Mod registrieren",
      "Sprache": "Lua",
      "Link": "more/lua-luanti.html",
      "class": ["lua","werkzeuge"]
    },
    // C
    {
      "Tag": "C",
      "Beschreibung": "Systemnahe Sprache, Vorgängerin von C++",
      "Sprache": "C",
      "Link": "more/c-einfuehrung.html",
      "class": ["c","sprache","grundlagen"]
    },
    {
      "Tag": "printf",
      "Beschreibung": "Formatierte Ausgabe",
      "Sprache": "C",
      "Link": "more/c-ein-ausgabe.html",
      "class": ["c","io","ausgabe"]
    },
    {
      "Tag": "scanf / fgets",
      "Beschreibung": "Eingaben einlesen",
      "Sprache": "C",
      "Link": "more/c-ein-ausgabe.html",
      "class": ["c","io","eingabe"]
    },
    {
      "Tag": "char-Array (String)",
      "Beschreibung": "Texte in C mit \\0 am Ende",
      "Sprache": "C",
      "Link": "more/c-strings.html",
      "class": ["c","daten"]
    },
    {
      "Tag": "strlen / strcmp / snprintf",
      "Beschreibung": "Funktionen aus string.h",
      "Sprache": "C",
      "Link": "more/c-strings.html",
      "class": ["c","daten"]
    },
    {
      "Tag": "Zeiger (C)",
      "Beschreibung": "Adressen und Zeiger-Arithmetik",
      "Sprache": "C",
      "Link": "more/c-zeiger.html",
      "class": ["c","speicher"]
    },
    {
      "Tag": "malloc / free",
      "Beschreibung": "Speicher anfordern und freigeben",
      "Sprache": "C",
      "Link": "more/c-speicher.html",
      "class": ["c","speicher"]
    },
    {
      "Tag": "struct / typedef (C)",
      "Beschreibung": "Eigene Datentypen in C",
      "Sprache": "C",
      "Link": "more/c-structs.html",
      "class": ["c","daten"]
    },
    {
      "Tag": "#define",
      "Beschreibung": "Konstanten und Makros",
      "Sprache": "C",
      "Link": "more/c-praeprozessor.html",
      "class": ["c","praeprozessor"]
    },
    {
      "Tag": "fopen / fclose",
      "Beschreibung": "Dateien in C",
      "Sprache": "C",
      "Link": "more/c-praeprozessor.html",
      "class": ["c","werkzeuge","io"]
    },
    // C#
    {
      "Tag": "C#",
      "Beschreibung": "Sprache von .NET für Apps, Web und Spiele",
      "Sprache": "C#",
      "Link": "more/csharp-einfuehrung.html",
      "class": ["c#","sprache","grundlagen"]
    },
    {
      "Tag": "dotnet new / run",
      "Beschreibung": "Projekt anlegen und starten",
      "Sprache": "C#",
      "Link": "more/csharp-einfuehrung.html",
      "class": ["c#","werkzeuge"]
    },
    {
      "Tag": "Console.WriteLine",
      "Beschreibung": "Ausgabe in der Konsole",
      "Sprache": "C#",
      "Link": "more/csharp-einfuehrung.html",
      "class": ["c#","io","ausgabe"]
    },
    {
      "Tag": "var / int / string",
      "Beschreibung": "Variablen und Datentypen",
      "Sprache": "C#",
      "Link": "more/csharp-grundlagen.html",
      "class": ["c#","grundlagen"]
    },
    {
      "Tag": "$\"…{x}…\"",
      "Beschreibung": "String-Interpolation",
      "Sprache": "C#",
      "Link": "more/csharp-grundlagen.html",
      "class": ["c#","grundlagen"]
    },
    {
      "Tag": "int.TryParse",
      "Beschreibung": "Text sicher in Zahl umwandeln",
      "Sprache": "C#",
      "Link": "more/csharp-grundlagen.html",
      "class": ["c#","grundlagen"]
    },
    {
      "Tag": "switch-Ausdruck",
      "Beschreibung": "Werte je nach Fall zuordnen",
      "Sprache": "C#",
      "Link": "more/csharp-kontrolle.html",
      "class": ["c#","kontrolle"]
    },
    {
      "Tag": "foreach (C#)",
      "Beschreibung": "Über Listen laufen",
      "Sprache": "C#",
      "Link": "more/csharp-kontrolle.html",
      "class": ["c#","kontrolle","schleife"]
    },
    {
      "Tag": "List<T>",
      "Beschreibung": "Dynamische Liste",
      "Sprache": "C#",
      "Link": "more/csharp-collections.html",
      "class": ["c#","daten"]
    },
    {
      "Tag": "Dictionary",
      "Beschreibung": "Schlüssel-Wert-Paare",
      "Sprache": "C#",
      "Link": "more/csharp-collections.html",
      "class": ["c#","daten"]
    },
    {
      "Tag": "LINQ (Where / Select)",
      "Beschreibung": "Daten filtern, sortieren, auswerten",
      "Sprache": "C#",
      "Link": "more/csharp-collections.html",
      "class": ["c#","daten"]
    },
    {
      "Tag": "class / Properties",
      "Beschreibung": "Klassen mit get/set",
      "Sprache": "C#",
      "Link": "more/csharp-klassen.html",
      "class": ["c#","oop"]
    },
    {
      "Tag": "interface",
      "Beschreibung": "Vorgabe, welche Methoden eine Klasse hat",
      "Sprache": "C#",
      "Link": "more/csharp-klassen.html",
      "class": ["c#","oop"]
    },
    {
      "Tag": "async / await (C#)",
      "Beschreibung": "Asynchrone Methoden",
      "Sprache": "C#",
      "Link": "more/csharp-async.html",
      "class": ["c#","werkzeuge"]
    },
    {
      "Tag": "File.ReadAllText",
      "Beschreibung": "Dateien lesen und schreiben",
      "Sprache": "C#",
      "Link": "more/csharp-async.html",
      "class": ["c#","werkzeuge","io"]
    },
    // Swift
    {
      "Tag": "Swift",
      "Beschreibung": "Apples Sprache für iOS-, macOS- und Server-Apps",
      "Sprache": "Swift",
      "Link": "more/swift-einfuehrung.html",
      "class": ["swift","sprache","grundlagen"]
    },
    {
      "Tag": "let / var (Swift)",
      "Beschreibung": "Konstanten und Variablen",
      "Sprache": "Swift",
      "Link": "more/swift-grundlagen.html",
      "class": ["swift","grundlagen"]
    },
    {
      "Tag": "\\(…) Interpolation",
      "Beschreibung": "Werte in Text einsetzen",
      "Sprache": "Swift",
      "Link": "more/swift-grundlagen.html",
      "class": ["swift","grundlagen"]
    },
    {
      "Tag": "Optional (?)",
      "Beschreibung": "Werte, die fehlen dürfen",
      "Sprache": "Swift",
      "Link": "more/swift-optionals.html",
      "class": ["swift","grundlagen"]
    },
    {
      "Tag": "if let / guard let",
      "Beschreibung": "Optionals sicher auspacken",
      "Sprache": "Swift",
      "Link": "more/swift-optionals.html",
      "class": ["swift","kontrolle"]
    },
    {
      "Tag": "switch (Swift)",
      "Beschreibung": "Fallunterscheidung mit Bereichen",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","kontrolle"]
    },
    {
      "Tag": "for-in / Bereiche (1...5)",
      "Beschreibung": "Schleifen in Swift",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","kontrolle","schleife"]
    },
    {
      "Tag": "func",
      "Beschreibung": "Funktionen mit Argument-Labels",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","funktion"]
    },
    {
      "Tag": "Closure ($0)",
      "Beschreibung": "Kurze Funktionen, z. B. für map/filter",
      "Sprache": "Swift",
      "Link": "more/swift-kontrolle.html",
      "class": ["swift","funktion"]
    },
    {
      "Tag": "struct / class (Swift)",
      "Beschreibung": "Wert- und Referenztypen",
      "Sprache": "Swift",
      "Link": "more/swift-typen.html",
      "class": ["swift","oop"]
    },
    {
      "Tag": "enum (Swift)",
      "Beschreibung": "Aufzählungen mit angehängten Werten",
      "Sprache": "Swift",
      "Link": "more/swift-typen.html",
      "class": ["swift","daten"]
    },
    {
      "Tag": "protocol",
      "Beschreibung": "Vorgabe für Typen (wie Interface)",
      "Sprache": "Swift",
      "Link": "more/swift-typen.html",
      "class": ["swift","oop"]
    },
    {
      "Tag": "SwiftUI",
      "Beschreibung": "Oberflächen für Apple-Apps (nur macOS)",
      "Sprache": "Swift",
      "Link": "more/swiftui.html",
      "class": ["swift","gestaltung"]
    },
    {
      "Tag": "@State",
      "Beschreibung": "Zustand einer SwiftUI-Ansicht",
      "Sprache": "Swift",
      "Link": "more/swiftui.html",
      "class": ["swift","gestaltung"]
    },
    {
      "Tag": "VStack / HStack",
      "Beschreibung": "Ansichten stapeln",
      "Sprache": "Swift",
      "Link": "more/swiftui.html",
      "class": ["swift","layout"]
    },
    {
      "Tag": "Xcode",
      "Beschreibung": "Apples Entwicklungsumgebung (nur macOS)",
      "Sprache": "Swift",
      "Link": "more/xcode.html",
      "class": ["swift","werkzeuge"]
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