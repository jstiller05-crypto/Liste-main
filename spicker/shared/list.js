/* =====================================================================
   list.js – Logik für ALLE Listen-Seiten (coding/index.html, mathe/index.html …)
   ---------------------------------------------------------------------
   Diese Datei enthält KEINE Daten. Die Einträge und die Einstellungen
   (Spalten, Filter, Sortierung) kommen aus der entries.js im Ordner des
   jeweiligen Spickers. So nutzen alle Spicker denselben Code.

   Welcher Spicker gerade offen ist, steht im HTML:
     <body class="list-page" data-topic="coding">
   entries.js legt seine Daten unter genau diesem Namen ab:
     window.SpickerData["coding"] = { config: {...}, oTableEntries: {...} }

   Inhaltsverzeichnis
   1. DATEN LADEN      getTopicId(), getTopicData()
   2. ZUSTAND          filterState   (was der Nutzer gerade gewählt hat)
   3. WERKZEUGE        class TableSearcher (suchen + Tabelle zeichnen)
   4. AUFBAU           Tabellenkopf, Filter-Buttons, Sortier-Auswahl und
                       Spicker-Wechsler aus der Konfiguration bauen
   5. HILFSFUNKTIONEN  syncFilterButtons(), toggleFilterValue(),
                       sortEntriesBySelectedOrder()
   6. HERZSTÜCK        applyEntryFilters()  (alle Filter nacheinander)
   7. EVENTS           setup...()-Funktionen (Klicks, Tippen, Auswahl)
   7b. MERKEN          Beim Klick auf "mehr" Suche/Filter/Sortierung/
                       Scroll-Position + geöffnete Seite in sessionStorage
                       merken, damit die Liste beim Zurückkommen wieder
                       so aussieht wie vorher ("gleiche Seite" markieren)
   8. START            DOMContentLoaded (setzt alles in Gang)
   ===================================================================== */


/* =====================================================================
   1. DATEN LADEN
   ===================================================================== */

// ---------------------------------------------------------------------
// Liest die Spicker-ID aus <body data-topic="...">.
// document.body.dataset.topic = Wert von data-topic (z. B. "coding")
// ---------------------------------------------------------------------
function getTopicId() {
  const topicId = document.body.dataset.topic || "";
  if (!topicId) {
    console.error("[entries] <body> hat kein data-topic – welcher Spicker ist das?");
  }
  return topicId;
}

// ---------------------------------------------------------------------
// Holt die Daten, die entries.js abgelegt hat. Gibt null zurück, wenn
// entries.js fehlt oder kaputt ist – dann wird eine Meldung angezeigt,
// statt dass die Seite mit einem Fehler stehen bleibt.
//
// "window.SpickerData && window.SpickerData[topicId]" = erst prüfen, ob
// es SpickerData überhaupt gibt, sonst würde [topicId] einen Fehler werfen.
// ---------------------------------------------------------------------
function getTopicData(topicId) {
  const data = window.SpickerData && window.SpickerData[topicId];

  if (!data) {
    console.error("[entries] Keine Daten für '" + topicId + "' gefunden – wurde " + topicId + "/entries.js geladen?");
    return null;
  }
  if (!data.config || !data.oTableEntries || !Array.isArray(data.oTableEntries.List)) {
    console.error("[entries] Daten für '" + topicId + "' sind unvollständig (config oder oTableEntries.List fehlt):", data);
    return null;
  }

  console.log("[entries] '" + topicId + "' geladen:", data.oTableEntries.List.length, "Einträge,",
    data.config.columns.length, "Spalten,", data.config.filterGroups.length, "Filtergruppen");
  return data;
}

// Werden in initializeListPage() (8. START) gefüllt.
// "let" statt "const", weil der Wert erst später zugewiesen wird.
let listConfig = null;   // Spalten, Filter, Sortierung aus entries.js
let allEntries = [];     // alle Einträge dieses Spickers
let searcher = null;     // das TableSearcher-Objekt

// Eintrag → Position in oTableEntries.List (entries.js-Reihenfolge).
// Wird einmal in initializeListPage() befüllt und danach nur gelesen –
// siehe sortEntriesBySelectedOrder(), Fall "level". Als Map-SCHLÜSSEL
// dient der Eintrag (das Objekt) selbst, nicht Begriff/Index als Text:
// filter() und sort() verändern die Einträge nie, sie ordnen nur
// dieselben Objekt-Referenzen um – darum funktioniert entryOrder.get(entry)
// unabhängig davon, in welcher (gefilterten/sortierten) Liste der Eintrag
// gerade steht. Bewusst KEIN neues Feld in den Eintrag selbst geschrieben
// (siehe Auftrag) – die Reihenfolge lebt nur hier, außerhalb der Daten.
let entryOrder = new Map();


/* =====================================================================
   2. ZUSTAND
   ---------------------------------------------------------------------
   Das "Gedächtnis" der Seite. Hier steht, was gerade eingestellt ist.
   Regel: Events ändern NUR dieses Objekt und rufen dann applyEntryFilters().
   Leere Liste [] in einer Filtergruppe = nichts ausgewählt = kein Filter,
   es wird also ALLES gezeigt (einen "Alle"-Button gibt es nicht mehr).
   ===================================================================== */
const filterState = {
  search: "",    // Text aus dem Suchfeld
  // pro Filtergruppe eine LISTE der gewählten Werte (Mehrfachauswahl),
  // z. B. { language: ["html", "css", "js"], category: [] }
  filters: {},
  sort: "az",    // Wert aus config.sortOptions, z. B. "level", "az", "za", "field:Sprache"
  // Merkt sich die Sortierung, die VOR dem Suchen eingestellt war, wenn
  // beim Suchen automatisch von "Empfohlen" auf A–Z umgeschaltet wurde.
  // "" = es wurde nicht automatisch umgeschaltet.
  sortBeforeSearch: ""
};

// CSS-Selektor für den Tabellenkörper – einmal festgelegt, überall benutzt.
const TABLE_BODY_SELECTOR = "#dynamicTable tbody";


/* =====================================================================
   3. WERKZEUGE: class TableSearcher
   ---------------------------------------------------------------------
   Eine Klasse ist ein Bauplan. Mit "new TableSearcher(liste, config)"
   wird daraus ein Objekt, das die Liste kennt und damit arbeiten kann.
   ===================================================================== */
class TableSearcher {

  // Läuft automatisch bei "new TableSearcher(...)".
  // "this" = das Objekt, das gerade gebaut wird.
  constructor(entries, config) {
    this.entries = entries;
    this.columns = config.columns;

    // In welchen Feldern gesucht wird: alle Spalten außer Links,
    // plus das class-Array (Kategorien/Schlagwörter).
    // .filter() behält nur Spalten ohne type "link", .map() holt das Feld.
    this.searchFields = config.columns
      .filter(function isTextColumn(column) { return column.type !== "link"; })
      .map(function getColumnField(column) { return column.field; });

    console.log("[TableSearcher] erstellt mit", entries.length, "Einträgen, Suche in:", this.searchFields.join(", "), "+ class");
  }

  // -------------------------------------------------------------------
  // Sucht einen Text in allen Text-Spalten und in den Kategorien (class).
  // toUpperCase() auf beiden Seiten → Groß-/Kleinschreibung egal.
  // Rückgabe: NEUE Liste mit allen Treffern.
  // -------------------------------------------------------------------
  findEntriesByText(text) {
    const upper = text.toUpperCase();
    const fields = this.searchFields;

    return this.entries.filter(function matchesEntryText(entry) {
      // .some() = "mindestens ein Feld enthält den Suchtext"
      // String(...) macht aus Zahlen o. ä. sicher einen Text;
      // "entry[field] &&" schützt vor Fehlern, falls ein Feld fehlt.
      const matchesField = fields.some(function fieldContainsText(field) {
        return entry[field] && String(entry[field]).toUpperCase().includes(upper);
      });

      // Kategorien (class) werden mit durchsucht, z. B. "hilfe" → Anleitung.
      // Array.isArray schützt vor Einträgen, bei denen class fehlt oder
      // nur ein einzelner Text ist.
      const classes = Array.isArray(entry.class) ? entry.class : [entry.class || ""];
      const matchesClass = classes.some(function classContainsText(className) {
        return className.toUpperCase().includes(upper);
      });

      return matchesField || matchesClass;
    });
  }

  // -------------------------------------------------------------------
  // Zeichnet eine Liste als Zeilen in die Tabelle.
  // Ablauf: Tabelle leeren → für jeden Eintrag eine <tr> mit einer <td>
  // pro Spalte aus der Konfiguration bauen.
  // -------------------------------------------------------------------
  renderEntriesInTable(targetSelector, list) {
    const tableBody = document.querySelector(targetSelector);
    const overlay   = document.getElementById("noResultsOverlay");
    const columns   = this.columns;

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
      let rowIsOpenedPage = false; // siehe 7b: "gleiche Seite" + Aufblitzen

      columns.forEach(function appendCell(column) {
        const cell = document.createElement("td");

        if (column.type === "link") {
          // Link-Spalte: nur einen Link bauen, wenn einer eingetragen ist
          if (entry[column.field]) {
            const link = document.createElement("a");
            link.href = entry[column.field];

            // Zeigt dieser Link auf GENAU die Seite, die zuletzt über
            // "mehr" geöffnet wurde (siehe 7b)? Dann statt "mehr" den
            // Text "gleiche Seite" zeigen – andere Links in derselben
            // Zeile (z. B. zu einem anderen Abschnitt derselben Datei)
            // zählen durch den Dateinamen-Vergleich ebenfalls dazu.
            if (isSameFileAsLastOpened(entry[column.field])) {
              link.textContent = "gleiche Seite";
              link.className = "link-same-page";
              link.title = "Diese Seite hast du gerade gelesen";
              rowIsOpenedPage = true;
            } else {
              link.textContent = column.linkText || "mehr";
            }

            // Beim Klick merken, WAS gerade geöffnet wird – siehe 7b,
            // saveListStateBeforeLeaving(). Das greift für "mehr" UND
            // "gleiche Seite" gleichermaßen (beide führen zu einer
            // Detailseite, von der man zurückkommen kann).
            link.addEventListener("click", function handleEntryLinkClick() {
              saveListStateBeforeLeaving(entry[column.field]);
            });

            cell.appendChild(link);
          }
        } else {
          // textContent statt innerHTML: Text wird NIE als HTML gelesen
          // (sicher, auch wenn mal "<b>" in einem Eintrag steht)
          cell.textContent = entry[column.field] ?? "";
        }

        row.appendChild(cell);
      });

      // Nur bei der Zeile, von der man GERADE zurückgekommen ist, und
      // auch dann nur EINMAL (nicht bei jedem weiteren Neuzeichnen
      // durch Filtern/Sortieren) – siehe shouldFlashOpenedRow in 7b.
      if (rowIsOpenedPage && shouldFlashOpenedRow) {
        row.classList.add("row-flash-highlight");
        shouldFlashOpenedRow = false;
      }

      tableBody.appendChild(row); // erst jetzt ist die Zeile sichtbar
    });

    console.log("[render]", list.length, "Zeilen gezeichnet");
  }
}


/* =====================================================================
   4. AUFBAU AUS DER KONFIGURATION
   ---------------------------------------------------------------------
   Tabellenkopf, Filter-Buttons und Sortier-Optionen stehen NICHT mehr
   fest im HTML, sondern werden hier aus config (entries.js) gebaut.
   Neuer Filter-Button = eine Zeile in entries.js, kein HTML nötig.
   ===================================================================== */

// --- Tabellenkopf: <th> pro Spalte ------------------------------------
function buildTableHead(config) {
  const headRow = document.querySelector("#dynamicTable thead tr");
  if (!headRow) {
    console.error("[setup] #dynamicTable thead tr nicht gefunden");
    return;
  }

  headRow.innerHTML = "";
  config.columns.forEach(function appendHeaderCell(column) {
    const th = document.createElement("th");
    th.textContent = column.title;
    headRow.appendChild(th);
  });
  console.log("[setup] Tabellenkopf:", config.columns.map(column => column.title).join(" | "));
}

// --- Filtergruppen + Sortierung im Dropdown ---------------------------
// Baut für jede Filtergruppe so etwas:
//   <div class="filter-group">
//     <p class="filter-title">Sprache</p>
//     <div class="chip-row">
//       <button class="button filter-btn" data-group="language" data-value="html">HTML</button>
//       ...
// Buttons mit value "" ("Alle") werden NICHT mehr gebaut: Ist in einer
// Gruppe nichts ausgewählt, wird automatisch alles gezeigt. So können
// alte entries.js-Dateien ihren "Alle"-Eintrag behalten, ohne zu stören.
// und am Ende die Sortier-Auswahl (<select id="sortSelect">).
function buildFilterDropdown(config) {
  const dropdown = document.querySelector(".class-dropdown");
  if (!dropdown) {
    console.error("[setup] .class-dropdown nicht gefunden");
    return;
  }

  dropdown.innerHTML = "";

  // Optional: eigene Spaltenbreiten fürs Dropdown, z. B. "2fr 1fr 1fr",
  // wenn die erste Filtergruppe viele Buttons hat. Ohne Angabe gilt der
  // Standard aus core.css (1fr 2fr 1fr).
  // Gesetzt wird die CSS-Variable --dropdown-columns statt der Eigenschaft
  // selbst – so kann core.css auf dem Handy trotzdem auf eine Spalte umstellen.
  if (config.dropdownColumns) {
    dropdown.style.setProperty("--dropdown-columns", config.dropdownColumns);
    console.log("[setup] Dropdown-Spalten:", config.dropdownColumns);
  }

  config.filterGroups.forEach(function appendFilterGroup(group) {
    // Startwert: leere Liste = nichts ausgewählt = alles zeigen
    filterState.filters[group.id] = [];

    const groupElement = document.createElement("div");
    groupElement.className = "filter-group";

    const title = document.createElement("p");
    title.className = "filter-title";
    title.textContent = group.title;

    const row = document.createElement("div");
    row.className = "chip-row";

    let builtButtons = 0;
    group.buttons.forEach(function appendFilterButton(buttonConfig) {
      // "Alle"-Button (value "") überspringen – siehe Kommentar oben
      if (buttonConfig.value === "") {
        console.log("[setup] '" + buttonConfig.label + "'-Button in '" + group.title + "' übersprungen (nichts ausgewählt = alles)");
        return;
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "button filter-btn";
      // dataset.group/value werden zu data-group="..." / data-value="..."
      button.dataset.group = group.id;
      button.dataset.value = buttonConfig.value;
      button.textContent = buttonConfig.label;
      // aria-pressed sagt Screenreadern: das ist ein An/Aus-Schalter
      button.setAttribute("aria-pressed", "false");
      row.appendChild(button);
      builtButtons++;
    });

    groupElement.append(title, row);
    dropdown.appendChild(groupElement);
    console.log("[setup] Filtergruppe '" + group.title + "':", builtButtons, "Buttons (Feld:", group.field + ")");
  });

  // --- Sortierung ---
  const sortGroup = document.createElement("div");
  sortGroup.className = "filter-group";

  const sortLabel = document.createElement("label");
  sortLabel.className = "filter-title";
  sortLabel.htmlFor = "sortSelect"; // htmlFor = das for="..." aus HTML
  sortLabel.textContent = "Sortieren nach";

  const select = document.createElement("select");
  select.id = "sortSelect";
  config.sortOptions.forEach(function appendSortOption(option) {
    // new Option(text, wert) = kurze Schreibweise für ein <option>-Element
    select.appendChild(new Option(option.label, option.value));
  });

  sortGroup.append(sortLabel, select);
  dropdown.appendChild(sortGroup);

  filterState.sort = config.sortOptions.length > 0 ? config.sortOptions[0].value : "az";
  console.log("[setup] Sortier-Optionen:", config.sortOptions.map(option => option.value).join(", "));
}

// --- Platzhalter im Suchfeld ------------------------------------------
function applySearchPlaceholder(config) {
  const input = document.getElementById("myInput");
  if (input && config.searchPlaceholder) {
    input.placeholder = config.searchPlaceholder;
  }
}

// --- Spicker-Wechsler neben dem Logo ----------------------------------
// Ein <select> mit "Übersicht" + allen Spickern aus shared/topics.js.
// Auswahl ändern → zur Seite des gewählten Spickers springen.
//
// Pfade: Die Listen-Seite liegt in spicker/<ordner>/index.html, die
// Übersicht in spicker/index.html → von hier aus "../index.html" bzw.
// "../<anderer-ordner>/index.html". "index.html" wird immer mit
// angegeben, damit es auch ohne Server (Doppelklick, file://) klappt.
function setupTopicSwitcher(currentTopicId) {
  const select = document.getElementById("topicSwitcher");
  if (!select) {
    console.warn("[hub] #topicSwitcher nicht gefunden – kein Spicker-Wechsler auf dieser Seite");
    return;
  }

  // typeof prüft, ob es die Variable überhaupt gibt – ohne Fehler,
  // auch wenn topics.js gar nicht geladen werden konnte.
  if (typeof SPICKER_TOPICS === "undefined" || !Array.isArray(SPICKER_TOPICS)) {
    console.error("[hub] shared/topics.js nicht geladen – Spicker-Wechsler wird ausgeblendet");
    select.hidden = true;
    return;
  }

  select.innerHTML = "";
  select.appendChild(new Option("Übersicht", "../index.html"));

  SPICKER_TOPICS.forEach(function appendTopicOption(topic) {
    const option = new Option(topic.title, "../" + topic.folder + "/index.html");
    if (topic.id === currentTopicId) {
      option.selected = true; // aktuellen Spicker vorauswählen
    }
    select.appendChild(option);
  });

  select.addEventListener("change", function handleTopicChange() {
    console.log("[hub] wechsle zu:", select.value);
    window.location.href = select.value;
  });

  console.log("[hub] Spicker-Wechsler bereit:", SPICKER_TOPICS.length, "Spicker + Übersicht");
}

// --- Untertitel aus topics.js -----------------------------------------
// Steht für den aktuellen Spicker ein Untertitel in topics.js, wird er
// unter "Spicker" angezeigt. Sonst bleibt der Text aus dem HTML stehen.
function applyTopicSubtitle(currentTopicId) {
  if (typeof SPICKER_TOPICS === "undefined") return;
  const topic = SPICKER_TOPICS.find(entry => entry.id === currentTopicId);
  const subtitle = document.querySelector(".brand-subtitle");
  if (topic && subtitle) {
    subtitle.textContent = topic.subtitle;
  }
}


/* =====================================================================
   5. HILFSFUNKTIONEN
   ---------------------------------------------------------------------
   Kleine Funktionen, die eine einzige Aufgabe erledigen.
   ===================================================================== */

// ---------------------------------------------------------------------
// Färbt die Buttons einer Gruppe passend zu filterState ein:
// Jeder Button, dessen Wert in der Auswahl-Liste steht, bekommt "active".
// Wird nach jedem Klick UND nach dem Laden gespeicherter Filter benutzt,
// damit Anzeige und Zustand immer zusammenpassen.
// classList.toggle(name, true/false) = Klasse setzen bzw. entfernen
// ---------------------------------------------------------------------
function syncFilterButtons(groupId) {
  const selectedValues = filterState.filters[groupId] || [];
  const buttons = document.querySelectorAll('.filter-btn[data-group="' + groupId + '"]');

  buttons.forEach(function updateButtonState(button) {
    const isSelected = selectedValues.includes(button.dataset.value);
    button.classList.toggle("active", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  });
}

// ---------------------------------------------------------------------
// Schaltet einen Wert in einer Filtergruppe an oder aus (Mehrfachauswahl).
//   Wert schon ausgewählt → rausnehmen
//   Wert noch nicht drin  → dazunehmen
// ---------------------------------------------------------------------
function toggleFilterValue(groupId, value) {
  const selectedValues = filterState.filters[groupId];
  const position = selectedValues.indexOf(value); // -1 = nicht gefunden

  if (position === -1) {
    selectedValues.push(value);
  } else {
    selectedValues.splice(position, 1); // splice(stelle, 1) = 1 Element an dieser Stelle löschen
  }
}

// ---------------------------------------------------------------------
// Liefert die Lernstufe eines Eintrags als Zahl (für sortOptions-Wert
// "level", siehe "Empfohlen"). Das Feld "Stufe" ist OPTIONAL – so muss
// nicht jeder der 400+ Einträge eine Stufe bekommen.
//   Stufe fehlt ODER ist keine gültige Zahl → Infinity, damit der
//   Eintrag beim Sortieren ganz ans Ende rutscht (jede echte Zahl ist
//   kleiner als Infinity).
//   Ist "Stufe" zwar gesetzt, aber kein gültiger Zahlenwert (z. B. ein
//   Tippfehler wie "abc"), zusätzlich eine Warnung in die Konsole –
//   so fallen Tippfehler in entries.js auf, statt den Eintrag einfach
//   still ans Ende zu schieben.
// ---------------------------------------------------------------------
function getEntryLevel(entry) {
  if (entry.Stufe === undefined) {
    return Infinity;
  }

  const level = Number(entry.Stufe);
  if (Number.isNaN(level)) {
    console.warn("[sort] ungültige Stufe, Eintrag wird ans Ende sortiert:", entry);
    return Infinity;
  }

  return level;
}

// ---------------------------------------------------------------------
// Sortiert eine Liste je nach filterState.sort.
// Gibt eine SORTIERTE KOPIE zurück – die Originalliste bleibt unverändert.
//
// Mögliche Werte (aus config.sortOptions):
//   "az"           → nach der ERSTEN Spalte A–Z (bei Coding: Begriff)
//   "za"           → nach der ersten Spalte Z–A
//   "field:<Feld>" → erst nach diesem Feld, bei Gleichstand nach der
//                    ersten Spalte (z. B. "field:Sprache")
//   "level"        → nach entry.Stufe aufsteigend (siehe getEntryLevel).
//                    Bei GLEICHER Stufe: Reihenfolge aus entries.js
//                    (siehe entryOrder), NICHT A–Z – mehrere Begriffe
//                    derselben Detailseite stehen so wie auf der Seite.
//                    NUR Einträge ganz OHNE Stufe (beide Infinity)
//                    stehen untereinander weiterhin A–Z.
// ---------------------------------------------------------------------
function sortEntriesBySelectedOrder(list) {
  const copy = [...list]; // [...x] = Kopie (Spread-Operator)
  const mainField = listConfig.columns[0].field;

  // Kleine Hilfe: liefert ein Feld als Text, auch wenn es mal fehlt.
  // (entry[field] || "") → wenn leer/undefined, nimm "" stattdessen
  function getFieldText(entry, field) {
    return String(entry[field] || "");
  }

  if (filterState.sort === "az") {
    // localeCompare liefert: negativ = a zuerst, positiv = b zuerst, 0 = gleich
    copy.sort(function compareEntriesAlphabetically(firstEntry, secondEntry) {
      return getFieldText(firstEntry, mainField).localeCompare(getFieldText(secondEntry, mainField), "de");
    });
  } else if (filterState.sort === "za") {
    // b mit a vergleichen statt a mit b → Reihenfolge umgedreht
    copy.sort(function compareEntriesReverseAlphabetically(firstEntry, secondEntry) {
      return getFieldText(secondEntry, mainField).localeCompare(getFieldText(firstEntry, mainField), "de");
    });
  } else if (filterState.sort.startsWith("field:")) {
    // "field:Sprache".slice(6) → "Sprache"
    const sortField = filterState.sort.slice("field:".length);
    // Erst nach diesem Feld sortieren. Ist es gleich (Ergebnis 0),
    // greift der Teil nach || und sortiert nach der ersten Spalte.
    copy.sort(function compareEntriesByFieldThenMain(firstEntry, secondEntry) {
      return getFieldText(firstEntry, sortField).localeCompare(getFieldText(secondEntry, sortField), "de") ||
        getFieldText(firstEntry, mainField).localeCompare(getFieldText(secondEntry, mainField), "de");
    });
  } else if (filterState.sort === "level") {
    copy.sort(function compareEntriesByLevelThenMain(firstEntry, secondEntry) {
      const firstLevel = getEntryLevel(firstEntry);
      const secondLevel = getEntryLevel(secondEntry);

      // WICHTIG: erst auf Gleichheit prüfen, NICHT gleich
      // "firstLevel - secondLevel" bilden – Infinity - Infinity ergibt
      // NaN, nicht 0. Zwei Einträge OHNE Stufe (beide Infinity) würden
      // über die Differenz also nicht als "gleich" erkannt.
      if (firstLevel !== secondLevel) {
        return firstLevel - secondLevel;
      }

      // Ab hier: GLEICHE Stufe.
      //   Beide OHNE Stufe (Infinity)  → wie bisher A–Z.
      //   Beide MIT derselben Stufe    → Reihenfolge aus entries.js
      //     (= Reihenfolge auf der Detailseite, siehe Unterstufen-Regel
      //     in entries.js). NICHT auf die Stabilität von Array.sort()
      //     verlassen (seit ES2019 zwar garantiert: gleiche Elemente
      //     behalten ihre Reihenfolge aus dem Eingabe-Array) – das würde
      //     hier nur ZUFÄLLIG die Begriffs-Reihenfolge treffen, WEIL
      //     applyEntryFilters() die Liste vorher nur filtert (filter()
      //     erhält die Reihenfolge) und nie selbst schon anders sortiert.
      //     Käme davor irgendwann ein weiterer Sortierschritt dazu (z. B.
      //     Suchtreffer nach Relevanz vorsortiert), würde sich die
      //     Reihenfolge hier still und unbemerkt ändern. Der explizite
      //     Blick in entryOrder ist dagegen IMMER richtig, unabhängig
      //     davon, in welcher Reihenfolge "list" hier ankommt.
      if (firstLevel === Infinity) {
        return getFieldText(firstEntry, mainField).localeCompare(getFieldText(secondEntry, mainField), "de");
      }
      return entryOrder.get(firstEntry) - entryOrder.get(secondEntry);
    });

    const withLevel = copy.filter(entry => getEntryLevel(entry) !== Infinity).length;
    console.log("[sort] Empfohlen: " + withLevel + " mit Stufe, " + (copy.length - withLevel) + " ohne Stufe");
  } else {
    // Unbekannter Wert → nichts sortieren, aber in der Konsole melden
    console.warn("[sort] unbekannte Sortierung:", filterState.sort);
  }

  return copy;
}

// ---------------------------------------------------------------------
// Passt ein Eintrag zum gewählten Wert einer Filtergruppe?
//   field "class" → Wert muss im class-Array vorkommen (Kategorie)
//   jedes andere  → Feld klein geschrieben muss GENAU gleich sein
//                   (z. B. "JS".toLowerCase() === "js")
// ---------------------------------------------------------------------
function entryMatchesFilter(entry, group, selectedValue) {
  if (group.field === "class") {
    // .includes() prüft, ob der Wert im class-Array vorkommt
    return Array.isArray(entry.class) && entry.class.includes(selectedValue);
  }
  return String(entry[group.field] || "").toLowerCase() === selectedValue;
}


/* =====================================================================
   6. HERZSTÜCK: applyEntryFilters()
   ---------------------------------------------------------------------
   Wird nach JEDER Änderung aufgerufen und fängt jedes Mal von vorne an:
   Suche → jede Filtergruppe → Sortieren → Anzeigen
   Dadurch lassen sich alle Filter frei kombinieren und wieder abwählen.
   ===================================================================== */
function applyEntryFilters() {
  console.log("[filter] Start mit:", JSON.stringify(filterState));

  // --- Schritt 1: Suche ---
  // Kurzform für if/else:  bedingung ? wennJa : wennNein
  let result = filterState.search === ""
    ? [...allEntries]                                   // keine Suche → alles
    : searcher.findEntriesByText(filterState.search);   // Suche → nur Treffer
  console.log("[filter] nach Suche:", result.length);

  // --- Schritt 2: alle Filtergruppen nacheinander ---
  // INNERHALB einer Gruppe gilt ODER: HTML + CSS + JS gewählt → Eintrag
  // passt, wenn er zu IRGENDEINEM davon gehört (.some()).
  // ZWISCHEN den Gruppen gilt UND: Sprache UND Kategorie müssen passen,
  // weil die Gruppen nacheinander filtern.
  listConfig.filterGroups.forEach(function applyFilterGroup(group) {
    const selectedValues = filterState.filters[group.id] || [];
    if (selectedValues.length === 0) return; // nichts ausgewählt → diese Gruppe filtert nicht

    result = result.filter(function matchesAnySelectedValue(entry) {
      return selectedValues.some(value => entryMatchesFilter(entry, group, value));
    });
    console.log("[filter] nach " + group.title + " (" + selectedValues.join(" oder ") + "):", result.length);
  });

  // --- Schritt 3: Sortieren ---
  result = sortEntriesBySelectedOrder(result);

  // --- Schritt 4: Anzeigen ---
  searcher.renderEntriesInTable(TABLE_BODY_SELECTOR, result);

  // KEIN "Einstellung merken" mehr hier, anders als früher: Teil F
  // speichert gezielt nur noch beim Klick auf einen "mehr"-Link (siehe
  // 7b, saveListStateBeforeLeaving) – nicht bei jeder Filteränderung.
}


/* =====================================================================
   7. EVENTS
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
    updateSortForSearch();
    applyEntryFilters();
  });
}

// ---------------------------------------------------------------------
// "Empfohlen" ist eine Lern-Reihenfolge. Wer etwas SUCHT, will aber
// gezielt einen Begriff finden – da ist A–Z praktischer. Deshalb:
//   Suche beginnt + Sortierung ist "Empfohlen" → auf A–Z umschalten
//                                                und "level" merken
//   Suchfeld wieder leer                       → gemerkte Sortierung
//                                                zurückholen
// Wählt man WÄHREND der Suche selbst eine Sortierung, gilt die (siehe
// setupSortSelector) und es wird nichts mehr zurückgestellt.
// ---------------------------------------------------------------------
function updateSortForSearch() {
  const select = document.getElementById("sortSelect");
  const isSearching = filterState.search !== "";

  if (isSearching && filterState.sort === "level") {
    filterState.sortBeforeSearch = "level";
    filterState.sort = "az";
    console.log("[sort] Suche aktiv → automatisch von 'Empfohlen' auf A–Z");
  } else if (!isSearching && filterState.sortBeforeSearch) {
    filterState.sort = filterState.sortBeforeSearch;
    filterState.sortBeforeSearch = "";
    console.log("[sort] Suche leer → zurück zu:", filterState.sort);
  } else {
    return; // nichts geändert
  }

  // Auswahlfeld anpassen, damit man sieht, wie gerade sortiert wird
  if (select) select.value = filterState.sort;
}

// --- Filter-Buttons (alle Gruppen) ------------------------------------
// Jeder Klick schaltet EINEN Button an oder aus. Mehrere Buttons pro
// Gruppe dürfen gleichzeitig an sein (z. B. HTML + CSS + JS).
// Sind alle aus, wird wieder alles gezeigt.
function setupFilterButtons() {
  listConfig.filterGroups.forEach(function setupFilterGroup(group) {
    // [data-group="language"] = nur Buttons mit genau diesem Attribut
    const buttons = document.querySelectorAll('.filter-btn[data-group="' + group.id + '"]');
    console.log("[setup] Buttons für '" + group.title + "' gefunden:", buttons.length);

    buttons.forEach(function setupFilterButton(button) {
      button.addEventListener("click", function toggleFilterButton() {
        // dataset.value liest data-value="..." aus dem HTML
        toggleFilterValue(group.id, button.dataset.value);
        const selected = filterState.filters[group.id];
        console.log("[event] " + group.title + ":", selected.length ? selected.join(", ") : "(nichts ausgewählt = alles)");

        syncFilterButtons(group.id); // Buttons passend einfärben
        applyEntryFilters();         // Tabelle neu berechnen
      });
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
    // Selbst gewählt → nach der Suche NICHT automatisch zurückstellen
    filterState.sortBeforeSearch = "";
    console.log("[event] Sortierung:", filterState.sort);
    applyEntryFilters();
  });
}


/* =====================================================================
   7b. MERKEN (sessionStorage)
   ---------------------------------------------------------------------
   sessionStorage UND localStorage speichern beide nur Text (Objekte
   darum mit JSON.stringify/JSON.parse) und überstehen ein Neuladen der
   Seite. Der Unterschied liegt darin, WIE LANGE und FÜR WEN:
     localStorage    bleibt, bis man es selbst löscht – sogar nach dem
                      Schließen des Browsers, und in JEDEM Tab/Fenster
                      gleichermaßen sichtbar.
     sessionStorage   gehört zu GENAU diesem einen Tab und ist weg,
                      sobald der Tab geschlossen wird. Ein zweiter Tab
                      mit derselben Seite hat seinen EIGENEN Speicher.
   Für "wohin war ich gerade unterwegs" (dieser Teil F) passt
   sessionStorage besser: Es soll nur innerhalb des AKTUELLEN Besuchs
   wirken, nicht wochenlang jede künftige Sitzung beeinflussen.

   Ablauf:
     1. Klick auf "mehr"/"gleiche Seite" (siehe TableSearcher) →
        saveListStateBeforeLeaving() schreibt Suche, Filter, Sortierung,
        Scroll-Position UND den Dateinamen der geöffneten Seite weg.
     2. Zurück zur Liste → loadListState() liest das, BEVOR die Tabelle
        gebaut wird, und übernimmt es in filterState.
     3. Tabelle wird gezeichnet (dabei greift "gleiche Seite", siehe
        TableSearcher), DANACH erst gescrollt.
     4. Nur der Scroll-Wert wird danach aus dem gespeicherten Objekt
        entfernt (nicht alles!) – Suche/Filter/Sortierung/Dateiname
        bleiben stehen, damit "gleiche Seite" auch nach einer weiteren
        Filteränderung noch stimmt. Ein SPÄTERES, ganz normales Öffnen
        der Liste soll aber nicht nochmal an die alte Stelle springen.

   try/catch überall: sessionStorage kann z. B. im privaten Fenster
   gesperrt sein – dann läuft die Liste einfach normal weiter, ohne
   sich etwas zu merken.
   ===================================================================== */
let currentTopicId = "";          // wird in initializeListPage() gesetzt
let lastOpenedFile = "";          // Dateiname der zuletzt per Link geöffneten Seite
let shouldFlashOpenedRow = false; // true = beim NÄCHSTEN Zeichnen genau diese eine Zeile aufblitzen lassen

function getListStateStorageKey() {
  return "spicker:" + currentTopicId + ":listState";
}

// ---------------------------------------------------------------------
// Vergleicht ein Link-Ziel (z. B. "more/it-git.html#git") mit
// lastOpenedFile – nur der reine Dateiname zählt (Ordner und Anker
// werden abgeschnitten), Groß-/Kleinschreibung ist egal.
// ---------------------------------------------------------------------
function isSameFileAsLastOpened(linkTarget) {
  if (!lastOpenedFile || !linkTarget) return false;
  const fileName = linkTarget.split("#")[0].split("/").pop() || "";
  return fileName.toLowerCase() === lastOpenedFile;
}

// --- Beim Klick auf "mehr"/"gleiche Seite" aufgerufen -----------------
function saveListStateBeforeLeaving(linkTarget) {
  if (!currentTopicId) return;

  const fileName = (linkTarget.split("#")[0].split("/").pop() || "").toLowerCase();
  const state = {
    search: filterState.search,
    filters: filterState.filters,
    sort: filterState.sort,
    sortBeforeSearch: filterState.sortBeforeSearch,
    scrollY: Math.round(window.scrollY),
    openedFile: fileName
  };

  try {
    sessionStorage.setItem(getListStateStorageKey(), JSON.stringify(state));
    console.log("[storage] Zustand vor dem Öffnen von", fileName, "gespeichert:", JSON.stringify(state));
  } catch (error) {
    console.warn("[storage] Zustand konnte nicht gespeichert werden:", error);
  }
}

// ---------------------------------------------------------------------
// Liest den gespeicherten Zustand (falls vorhanden) und übernimmt ihn in
// filterState + lastOpenedFile/shouldFlashOpenedRow. Wird VOR dem ersten
// Zeichnen der Tabelle aufgerufen. Alles wird GEPRÜFT, bevor es
// übernommen wird – genau wie früher: Hat sich entries.js inzwischen
// geändert (Button gelöscht, Sortierung umbenannt), werden unbekannte
// Werte einfach ignoriert statt Fehler zu verursachen.
// Rückgabe: die gespeicherte Scroll-Position (0 = keine vorhanden).
// ---------------------------------------------------------------------
function loadListState() {
  let saved = null;
  try {
    const text = sessionStorage.getItem(getListStateStorageKey());
    if (!text) {
      console.log("[storage] kein gespeicherter Zustand – Liste startet normal");
      return 0;
    }
    saved = JSON.parse(text);
  } catch (error) {
    console.warn("[storage] gespeicherter Zustand unlesbar – Liste startet normal:", error);
    return 0;
  }
  if (!saved || typeof saved !== "object") return 0;

  if (typeof saved.search === "string") {
    filterState.search = saved.search;
  }

  listConfig.filterGroups.forEach(function restoreGroup(group) {
    const savedValues = saved.filters && saved.filters[group.id];
    const valueList = Array.isArray(savedValues) ? savedValues : [];
    const knownValues = group.buttons.map(button => button.value).filter(value => value !== "");
    filterState.filters[group.id] = valueList.filter(value => knownValues.includes(value));
  });

  const knownSorts = listConfig.sortOptions.map(option => option.value);
  if (knownSorts.includes(saved.sort)) {
    filterState.sort = saved.sort;
  }
  filterState.sortBeforeSearch = knownSorts.includes(saved.sortBeforeSearch) ? saved.sortBeforeSearch : "";

  if (typeof saved.openedFile === "string" && saved.openedFile) {
    lastOpenedFile = saved.openedFile;
    // NUR beim allerersten Zurückkommen blitzen lassen. Erkennbar daran,
    // dass noch ein ECHTER (noch nicht verbrauchter) scrollY-Wert da ist
    // – "typeof ... === number" statt nur "if (saved.scrollY)", weil 0
    // ein gültiger, aber falsy Wert wäre (ganz oben geklickt). Auf jedem
    // SPÄTEREN Laden fehlt scrollY schon (siehe restoreScrollAndForgetIt),
    // "gleiche Seite" bleibt aber über lastOpenedFile weiterhin korrekt.
    shouldFlashOpenedRow = typeof saved.scrollY === "number";
  }

  console.log("[storage] gespeicherten Zustand geladen:", JSON.stringify(saved));
  return Number(saved.scrollY) || 0;
}

// ---------------------------------------------------------------------
// Bringt Suchfeld, Buttons und Sortier-Auswahl sichtbar auf den Stand
// von filterState (nach loadListState()).
// ---------------------------------------------------------------------
function applyFilterStateToControls() {
  const input = document.getElementById("myInput");
  if (input) input.value = filterState.search;

  const select = document.getElementById("sortSelect");
  if (select) select.value = filterState.sort;

  listConfig.filterGroups.forEach(group => syncFilterButtons(group.id));
}

// ---------------------------------------------------------------------
// Scrollt (nach dem ersten Zeichnen der Tabelle) zur gespeicherten
// Stelle und entfernt DANACH NUR den Scroll-Wert aus dem gespeicherten
// Objekt – der Rest (Suche/Filter/Sortierung/Dateiname) bleibt stehen,
// siehe Erklärung oben am Abschnitt.
// ---------------------------------------------------------------------
function restoreScrollAndForgetIt(scrollY) {
  if (scrollY > 0) {
    window.scrollTo(0, scrollY);
    console.log("[scroll] zurück zu Position", scrollY, "px (erreicht:", Math.round(window.scrollY) + " px)");
  } else {
    console.log("[scroll] keine gespeicherte Position – Seite bleibt oben");
  }

  if (!currentTopicId) return;
  try {
    const text = sessionStorage.getItem(getListStateStorageKey());
    if (!text) return;
    const saved = JSON.parse(text);
    delete saved.scrollY;
    sessionStorage.setItem(getListStateStorageKey(), JSON.stringify(saved));
  } catch (error) {
    console.warn("[storage] Scroll-Wert konnte nicht entfernt werden:", error);
  }
}


/* =====================================================================
   8. START
   ---------------------------------------------------------------------
   DOMContentLoaded wartet, bis das ganze HTML geladen ist – erst dann
   gibt es Tabelle, Dropdown und Suchfeld. Die Skripte sind mit "defer"
   eingebunden und laufen in der Reihenfolge topics.js → entries.js →
   list.js, deshalb sind die Daten hier schon da.
   ===================================================================== */
document.addEventListener("DOMContentLoaded", function initializeListPage() {
  console.log("[start] Listen-Seite geladen");

  // Der Browser soll NICHT selbst (nach eigenem Ermessen, z. B. bei F5)
  // irgendeine Scroll-Position wiederherstellen – das übernehmen WIR
  // gezielt über restoreScrollAndForgetIt() (siehe 7b), sonst können
  // sich beide Mechanismen gegenseitig ins Gehege kommen.
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const topicId = getTopicId();
  currentTopicId = topicId;
  console.log("[start] Spicker:", topicId);

  // Der Wechsler funktioniert auch ohne Daten – deshalb zuerst.
  setupTopicSwitcher(topicId);
  applyTopicSubtitle(topicId);

  const data = getTopicData(topicId);
  if (!data) {
    // entries.js fehlt/kaputt: Meldung zeigen statt abzustürzen
    const overlay = document.getElementById("noResultsOverlay");
    if (overlay) {
      overlay.querySelector(".overlay-content").textContent = "Einträge konnten nicht geladen werden (siehe Konsole, F12).";
      overlay.style.display = "flex";
    }
    return;
  }

  listConfig = data.config;
  allEntries = data.oTableEntries.List;

  // entryOrder EINMAL hier befüllen (nicht bei jedem Sortieren neu) –
  // forEach liefert (wert, index), also genau Eintrag → Position.
  allEntries.forEach(function rememberEntryPosition(entry, index) {
    entryOrder.set(entry, index);
  });
  console.log("[start] entryOrder gemerkt für", entryOrder.size, "Einträge (Reihenfolge aus entries.js)");

  buildTableHead(listConfig);
  buildFilterDropdown(listConfig);
  applySearchPlaceholder(listConfig);

  searcher = new TableSearcher(allEntries, listConfig);

  setupTextSearch();
  setupFilterButtons();
  setupSortSelector();

  // Gespeicherten Zustand laden (siehe 7b) und Buttons/Suchfeld/Auswahl
  // anpassen – NOCH bevor die Tabelle gezeichnet wird, damit die Filter
  // beim ersten Zeichnen schon stimmen.
  const pendingScrollY = loadListState();
  applyFilterStateToControls();

  applyEntryFilters(); // einmal alles anzeigen (hier greift ggf. "gleiche Seite" + Aufblitzen)

  // Erst NACH dem Zeichnen ist die Tabelle lang genug, um zu scrollen.
  restoreScrollAndForgetIt(pendingScrollY);
  console.log("[start] fertig");
});
