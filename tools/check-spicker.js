#!/usr/bin/env node
/* =====================================================================
   check-spicker.js – prüft alle Spicker auf kaputte Links & Lücken
   ---------------------------------------------------------------------
   AUFRUF (im Projektordner):
       node tools/check-spicker.js
   ("node" startet das Skript mit Node.js – es wird nichts installiert
   und NICHTS verändert, das Skript LIEST nur.)

   WAS WIRD GEPRÜFT? (für jeden Spicker-Ordner unter spicker/)
     1. Eintrags-Links   jeder "Link" in entries.js zeigt auf eine
                         vorhandene Datei, und der #anker existiert dort
                         als id="…"
     2. Seiten ohne      jede Detailseite in more/ hat mindestens einen
        Eintrag          Eintrag in entries.js
     3. Chips            jeder Chip unter "Verwandte Seiten" zeigt auf
                         eine vorhandene Datei (und einen vorhandenen Anker)
     4. Seiten-Aufbau    page-header, h1, footer mit Zurück-Icon und die
                         onerror-Handler im <head>
     5. Sprach-          jede Seite ist in links.js einer Sprache
        Zuordnung        zugeordnet (Präfix, Eintrag oder data-lang)
     6. Doppelte         derselbe Begriff kommt in derselben Sprache
        Begriffe         nicht zweimal vor
     7. Smart-Link-Ziele jedes Ziel in smartLinkRules / TAG_PAGES existiert
     8. Präfix-          kein Präfix in PAGE_PREFIX_LANGUAGES wird von
        Reihenfolge      einem kürzeren davor "verdeckt"

   AUSGABE: pro Prüfung "OK" oder die Liste der Probleme.
   EXIT-CODE: 0 = alles in Ordnung, 1 = mindestens ein Problem.
   (Der Exit-Code ist die Zahl, die ein Programm beim Beenden an das
   Terminal zurückgibt. In Bash zeigt "echo $?" ihn an, in fish
   "echo $status".)

   WARUM node:vm?
     entries.js und links.js sind BROWSER-Skripte: Sie schreiben nach
     "window.…" bzw. legen ganz oben "const …" an. Node kennt kein
     "window" – mit require() würden sie abstürzen. Das Modul node:vm
     führt Code in einer SANDBOX aus: einem künstlichen globalen Objekt,
     dem wir selbst ein leeres "window" und ein stummes "console" geben.

   NUR NODE-BORDMITTEL: node:fs (Dateien lesen), node:path (Pfade
   zusammenbauen), node:vm (Sandbox). Kein npm install nötig.
   ===================================================================== */
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

// ---------------------------------------------------------------------
// EINSTELLUNGEN
// ---------------------------------------------------------------------
// __dirname = der Ordner, in dem DIESES Skript liegt (tools/).
// Von dort eine Ebene hoch ("..") und in "spicker" hinein.
const SPICKER_ROOT = path.join(__dirname, "..", "spicker");

// Detailseiten, die absichtlich KEINEN Eintrag in entries.js haben.
// template.html ist die Kopiervorlage für neue Seiten – sie soll in der
// Liste nicht auftauchen. Jede weitere Ausnahme gehört mit Begründung hierher.
const PAGES_WITHOUT_ENTRY_ALLOWED = ["template.html"];

// Zähler für die Zusammenfassung am Ende.
let totalProblems = 0;
let totalChecks = 0;


// =====================================================================
// HILFSFUNKTIONEN
// =====================================================================

// ---------------------------------------------------------------------
// Führt ein Browser-Skript in einer Sandbox aus und gibt die Sandbox
// zurück. "exportNames" sind Namen von const-Variablen, die das Skript
// ganz oben anlegt (z. B. smartLinkRules). const-Variablen landen NICHT
// automatisch auf dem globalen Objekt – darum hängen wir eine Zeile an,
// die sie ausdrücklich unter "exported" ablegt.
// Gibt null zurück, wenn die Datei fehlt oder einen Fehler wirft.
// ---------------------------------------------------------------------
function runBrowserScript(filePath, exportNames = []) {
  if (!fs.existsSync(filePath)) {
    return null;
  }
  // Stummes console: Die Skripte melden beim Laden "… geladen" – das
  // würde die Ausgabe dieses Prüfskripts nur zumüllen.
  const silentConsole = { log() {}, warn() {}, error() {}, info() {} };
  const sandbox = { window: {}, console: silentConsole, exported: {} };
  vm.createContext(sandbox);

  // "typeof X !== 'undefined'" verhindert einen Absturz, falls eine
  // links.js eine der Variablen gar nicht anlegt.
  const exportCode = exportNames
    .map((name) => `if (typeof ${name} !== "undefined") { exported.${name} = ${name}; }`)
    .join("\n");

  try {
    const source = fs.readFileSync(filePath, "utf8");
    vm.runInContext(source + "\n" + exportCode, sandbox, { filename: filePath });
    return sandbox;
  } catch (error) {
    console.error("   [FEHLER] Skript konnte nicht ausgeführt werden:", filePath);
    console.error("           ", error.message);
    return null;
  }
}

// ---------------------------------------------------------------------
// Wandelt HTML-Schreibweisen in echte Zeichen um: im HTML steht
// href="area &amp; map.html", die Datei heißt aber "area & map.html".
// decodeURIComponent macht zusätzlich aus "%20" ein Leerzeichen.
// ---------------------------------------------------------------------
function decodeHref(href) {
  const withoutEntities = href.replaceAll("&amp;", "&");
  try {
    return decodeURIComponent(withoutEntities);
  } catch (error) {
    // Ein einzelnes "%" ohne gültige Zahl dahinter → Text unverändert lassen.
    console.warn("   [WARNUNG] href konnte nicht dekodiert werden:", href, "-", error.message);
    return withoutEntities;
  }
}

// ---------------------------------------------------------------------
// Zerlegt "more/seite.html#anker" in { file: "more/seite.html",
// anchor: "anker" }. Ohne "#" ist anchor ein leerer Text.
// ---------------------------------------------------------------------
function splitLink(link) {
  const hashIndex = link.indexOf("#");
  if (hashIndex === -1) {
    return { file: link, anchor: "" };
  }
  return { file: link.slice(0, hashIndex), anchor: link.slice(hashIndex + 1) };
}

// ---------------------------------------------------------------------
// Liest eine HTML-Datei EINMAL und merkt sich das Ergebnis (Cache) –
// viele Einträge zeigen auf dieselbe Seite, sie soll nicht hundertmal
// von der Platte gelesen werden.
// Map = Nachschlage-Tabelle: Dateipfad → { html, ids }
// ---------------------------------------------------------------------
const pageCache = new Map();

function readPage(filePath) {
  if (pageCache.has(filePath)) {
    return pageCache.get(filePath);
  }
  const html = fs.readFileSync(filePath, "utf8");
  // Alle id="…" der Seite einsammeln. matchAll liefert jeden Treffer;
  // match[1] ist der Teil in der ersten Klammer, also der id-Wert.
  // Set = Sammlung ohne Doppelte, mit schnellem .has().
  const ids = new Set();
  for (const match of html.matchAll(/\sid="([^"]+)"/g)) {
    ids.add(match[1]);
  }
  const page = { html, ids };
  pageCache.set(filePath, page);
  return page;
}

// ---------------------------------------------------------------------
// Gibt das Ergebnis EINER Prüfung aus und zählt die Probleme mit.
// problems = Liste von Texten; leer = alles gut.
// ---------------------------------------------------------------------
function report(title, problems) {
  totalChecks += 1;
  if (problems.length === 0) {
    console.log(`   OK      ${title}`);
    return;
  }
  totalProblems += problems.length;
  console.log(`   FEHLER  ${title} – ${problems.length} Problem(e):`);
  for (const problem of problems) {
    console.log(`             - ${problem}`);
  }
}


// =====================================================================
// DIE PRÜFUNGEN
// Jede Funktion bekommt die Daten eines Spickers und gibt eine Liste
// von Problem-Texten zurück (leer = OK). Sie geben selbst nichts aus –
// das macht report().
// =====================================================================

// ---------------------------------------------------------------------
// 1. Jeder "Link" zeigt auf eine vorhandene Datei + vorhandenen Anker.
//    Links sind relativ zur index.html des Spickers ("more/xyz.html").
// ---------------------------------------------------------------------
function checkEntryLinks(spicker) {
  const problems = [];
  for (const entry of spicker.entries) {
    if (!entry.Link) {
      continue; // leerer Link ist erlaubt (= kein "mehr"-Link)
    }
    const { file, anchor } = splitLink(decodeHref(entry.Link));
    const targetPath = path.join(spicker.folder, file);
    if (!fs.existsSync(targetPath)) {
      problems.push(`"${entry.Begriff}": Datei fehlt → ${entry.Link}`);
      continue;
    }
    if (anchor && !readPage(targetPath).ids.has(anchor)) {
      problems.push(`"${entry.Begriff}": Anker #${anchor} fehlt in ${file}`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------
// 2. Jede Detailseite in more/ hat mindestens einen Eintrag.
// ---------------------------------------------------------------------
function checkPagesHaveEntry(spicker) {
  // Alle Dateinamen sammeln, auf die irgendein Eintrag zeigt.
  const linkedFiles = new Set();
  for (const entry of spicker.entries) {
    if (entry.Link) {
      // path.basename("more/seite.html") → "seite.html"
      linkedFiles.add(path.basename(splitLink(decodeHref(entry.Link)).file));
    }
  }
  const problems = [];
  for (const pageFile of spicker.pageFiles) {
    if (PAGES_WITHOUT_ENTRY_ALLOWED.includes(pageFile)) {
      continue;
    }
    if (!linkedFiles.has(pageFile)) {
      problems.push(`${pageFile}: kein Eintrag in entries.js zeigt auf diese Seite`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------
// 3. Chips unter "Verwandte Seiten" zeigen auf vorhandene Dateien.
//    Vorgehen: die <section> suchen, deren <h2> "Verwandte Seiten"
//    heißt, und darin alle <a class="chip" href="…"> prüfen.
// ---------------------------------------------------------------------
function checkRelatedChips(spicker) {
  const problems = [];
  for (const pageFile of spicker.pageFiles) {
    const pagePath = path.join(spicker.moreFolder, pageFile);
    const { html } = readPage(pagePath);

    const headingIndex = html.indexOf("Verwandte Seiten</h2>");
    if (headingIndex === -1) {
      continue; // Seite hat den Abschnitt nicht – das ist kein Link-Fehler
    }
    // Der Abschnitt reicht von der Überschrift bis zum nächsten </section>.
    const sectionEnd = html.indexOf("</section>", headingIndex);
    const sectionHtml = html.slice(headingIndex, sectionEnd === -1 ? undefined : sectionEnd);

    for (const match of sectionHtml.matchAll(/<a\s+class="chip"\s+href="([^"]+)"/g)) {
      const { file, anchor } = splitLink(decodeHref(match[1]));
      // Ein Chip "#abschnitt" (ohne Datei) meint die Seite selbst.
      const targetPath = file === "" ? pagePath : path.join(spicker.moreFolder, file);
      if (!fs.existsSync(targetPath)) {
        problems.push(`${pageFile}: Chip zeigt auf fehlende Datei → ${match[1]}`);
        continue;
      }
      if (anchor && !readPage(targetPath).ids.has(anchor)) {
        problems.push(`${pageFile}: Chip-Anker #${anchor} fehlt in ${file || pageFile}`);
      }
    }
  }
  return problems;
}

// ---------------------------------------------------------------------
// 4. Seiten-Aufbau: page-header, h1, footer mit Zurück-Icon, onerror.
// ---------------------------------------------------------------------
function checkPageStructure(spicker) {
  const problems = [];
  for (const pageFile of spicker.pageFiles) {
    const { html } = readPage(path.join(spicker.moreFolder, pageFile));
    const missing = [];

    if (!html.includes('class="page-header"')) missing.push("page-header");
    if (!/<h1[\s>]/.test(html)) missing.push("h1");

    // Footer mit Zurück-Icon: <footer> … <a class="back-icon"> … <img … onerror=…>
    const footerMatch = html.match(/<footer[\s>][\s\S]*?<\/footer>/);
    if (!footerMatch) {
      missing.push("footer");
    } else {
      if (!footerMatch[0].includes('class="back-icon"')) missing.push("Zurück-Icon im footer");
      // Das Icon-Bild braucht onerror, damit ein fehlendes Icon nur
      // geloggt wird und kein kaputtes Bild-Symbol stehen bleibt.
      const imgMatch = footerMatch[0].match(/<img[^>]*>/);
      if (imgMatch && !imgMatch[0].includes("onerror=")) missing.push("onerror am Zurück-Icon");
    }

    // <head>: JEDES Stylesheet und JEDES Skript braucht einen onerror-Handler.
    const headMatch = html.match(/<head>[\s\S]*?<\/head>/);
    if (!headMatch) {
      missing.push("head");
    } else {
      const loaderTags = headMatch[0].match(/<link\s+rel="stylesheet"[^>]*>|<script[^>]*\ssrc="[^"]*"[^>]*>/g) || [];
      if (loaderTags.length === 0) missing.push("CSS/JS im head");
      for (const tag of loaderTags) {
        if (!tag.includes("onerror=")) missing.push(`onerror fehlt bei ${tag.slice(0, 60)}…`);
      }
    }

    if (missing.length > 0) {
      problems.push(`${pageFile}: fehlt → ${missing.join(", ")}`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------
// 5. Jede Seite ist in links.js einer Sprache zugeordnet.
//    Reihenfolge wie in getPageLanguage() (shared/page.js):
//      a) <html data-lang="…">
//      b) Eintrag in PAGE_LANGUAGES (Dateiname klein geschrieben)
//      c) Präfix in PAGE_PREFIX_LANGUAGES
//      d) sonst DEFAULT_PAGE_LANGUAGE
//    (d) ist der stille Standard – genau dort versteckt sich eine neue
//    Seite, deren Präfix man vergessen hat. Darum gilt (d) nur als
//    "zugeordnet", wenn ALLE Einträge der Seite als Sprache auch wirklich
//    die Standard-Sprache nennen (z. B. die vielen HTML-Tag-Seiten mit
//    "Sprache": "html"). Alles andere muss ausdrücklich eingetragen sein.
// ---------------------------------------------------------------------
function checkPageLanguages(spicker) {
  if (!spicker.linkData) {
    return null; // Spicker ohne links.js → Prüfung entfällt
  }
  const pageLanguages = spicker.linkData.PAGE_LANGUAGES || {};
  const prefixLanguages = spicker.linkData.PAGE_PREFIX_LANGUAGES || [];
  const defaultLanguage = spicker.linkData.DEFAULT_PAGE_LANGUAGE;
  // Spicker mit nur EINER Sprache (mathe, trading, wirtschaft) haben
  // weder Präfixe noch Einzel-Einträge: Dort gilt für alle Seiten der
  // Standard, es gibt also nichts zuzuordnen.
  if (Object.keys(pageLanguages).length === 0 && prefixLanguages.length === 0) {
    return null;
  }

  // Pro Seite die Sprachen ihrer Einträge sammeln (klein geschrieben).
  const entryLanguagesByPage = new Map();
  for (const entry of spicker.entries) {
    if (!entry.Link) continue;
    const pageFile = path.basename(splitLink(decodeHref(entry.Link)).file);
    if (!entryLanguagesByPage.has(pageFile)) {
      entryLanguagesByPage.set(pageFile, new Set());
    }
    entryLanguagesByPage.get(pageFile).add(String(entry.Sprache).toLowerCase());
  }

  const problems = [];
  for (const pageFile of spicker.pageFiles) {
    if (PAGES_WITHOUT_ENTRY_ALLOWED.includes(pageFile)) continue;

    const lowerName = pageFile.toLowerCase();
    const { html } = readPage(path.join(spicker.moreFolder, pageFile));

    const hasDataLang = /<html[^>]*\sdata-lang="[^"]+"/.test(html);
    const hasEntry = lowerName in pageLanguages;
    const hasPrefix = prefixLanguages.some(([prefix]) => lowerName.startsWith(prefix));
    if (hasDataLang || hasEntry || hasPrefix) {
      continue;
    }

    // Fall (d): nur in Ordnung, wenn die Einträge die Standard-Sprache nennen.
    const entryLanguages = entryLanguagesByPage.get(pageFile) || new Set();
    const onlyDefault = entryLanguages.size > 0 && [...entryLanguages].every((language) => language === defaultLanguage);
    if (!onlyDefault) {
      const shown = entryLanguages.size > 0 ? [...entryLanguages].join(", ") : "keine Einträge";
      problems.push(`${pageFile}: keine Zuordnung in links.js (Einträge nennen: ${shown}; stiller Standard wäre "${defaultLanguage}")`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------
// 6. Doppelte Begriffe innerhalb derselben Sprache.
// ---------------------------------------------------------------------
function checkDuplicateTerms(spicker) {
  // Schlüssel "sprache|begriff" → Liste der Links, unter denen er vorkommt.
  const seen = new Map();
  for (const entry of spicker.entries) {
    const key = `${String(entry.Sprache).toLowerCase()}|${entry.Begriff}`;
    if (!seen.has(key)) {
      seen.set(key, []);
    }
    seen.get(key).push(entry.Link || "(ohne Link)");
  }
  const problems = [];
  for (const [key, links] of seen) {
    if (links.length > 1) {
      const [language, term] = key.split("|");
      problems.push(`"${term}" (${language}) kommt ${links.length}× vor: ${links.join(" | ")}`);
    }
  }
  return problems;
}

// ---------------------------------------------------------------------
// 7. Jedes Smart-Link-Ziel (smartLinkRules, TAG_PAGES) existiert.
//    Ziele sind relativ zu more/ ("seite.html#anker"). "" = bewusst
//    kein Link (siehe Kommentar in links.js) und wird übersprungen.
// ---------------------------------------------------------------------
function checkSmartLinkTargets(spicker) {
  if (!spicker.linkData) {
    return null;
  }
  const problems = [];

  const checkTarget = (target, description) => {
    if (!target) return;
    const { file, anchor } = splitLink(target);
    const targetPath = path.join(spicker.moreFolder, file);
    if (!fs.existsSync(targetPath)) {
      problems.push(`${description}: Datei fehlt → ${target}`);
      return;
    }
    if (anchor && !readPage(targetPath).ids.has(anchor)) {
      problems.push(`${description}: Anker #${anchor} fehlt in ${file}`);
    }
  };

  for (const rule of spicker.linkData.smartLinkRules || []) {
    // Object.entries macht aus { cpp: "a.html", js: "b.html" } die Paare
    // ["cpp", "a.html"], ["js", "b.html"].
    for (const [language, target] of Object.entries(rule.links)) {
      checkTarget(target, `Regel "${rule.words[0]}" (${language})`);
    }
  }
  for (const [tagName, target] of Object.entries(spicker.linkData.TAG_PAGES || {})) {
    checkTarget(target, `TAG_PAGES <${tagName}>`);
  }
  return problems;
}

// ---------------------------------------------------------------------
// 8. Präfix-Reihenfolge: In PAGE_PREFIX_LANGUAGES gewinnt der ERSTE
//    passende Eintrag. Steht ein kurzes Präfix ("c-") VOR einem längeren,
//    das mit ihm beginnt, käme das längere nie zum Zug.
// ---------------------------------------------------------------------
function checkPrefixOrder(spicker) {
  if (!spicker.linkData || !spicker.linkData.PAGE_PREFIX_LANGUAGES) {
    return null;
  }
  const prefixes = spicker.linkData.PAGE_PREFIX_LANGUAGES.map(([prefix]) => prefix);
  const problems = [];
  for (let later = 0; later < prefixes.length; later++) {
    for (let earlier = 0; earlier < later; earlier++) {
      if (prefixes[later].startsWith(prefixes[earlier])) {
        problems.push(`"${prefixes[later]}" steht hinter "${prefixes[earlier]}" und wird davon verdeckt – das längere Präfix muss zuerst stehen`);
      }
    }
  }
  return problems;
}


// =====================================================================
// EINEN SPICKER LADEN UND PRÜFEN
// =====================================================================
function checkSpicker(name) {
  const folder = path.join(SPICKER_ROOT, name);
  const moreFolder = path.join(folder, "more");

  console.log("");
  console.log(`=== Spicker "${name}" ===`);

  // entries.js laden → window.SpickerData[name].oTableEntries.List
  const entriesSandbox = runBrowserScript(path.join(folder, "entries.js"));
  const data = entriesSandbox && entriesSandbox.window.SpickerData && entriesSandbox.window.SpickerData[name];
  if (!data || !data.oTableEntries || !Array.isArray(data.oTableEntries.List)) {
    report("entries.js laden", [`window.SpickerData["${name}"].oTableEntries.List nicht gefunden`]);
    return;
  }

  // links.js ist optional (ein Spicker ohne Smart-Links hat keine).
  const linksSandbox = runBrowserScript(path.join(folder, "links.js"), [
    "PAGE_LANGUAGES", "PAGE_PREFIX_LANGUAGES", "DEFAULT_PAGE_LANGUAGE", "smartLinkRules", "TAG_PAGES"
  ]);

  // Alle .html-Dateien in more/ (sortiert, damit die Ausgabe stabil ist).
  const pageFiles = fs.existsSync(moreFolder)
    ? fs.readdirSync(moreFolder).filter((file) => file.endsWith(".html")).sort()
    : [];

  const spicker = {
    name,
    folder,
    moreFolder,
    entries: data.oTableEntries.List,
    linkData: linksSandbox ? linksSandbox.exported : null,
    pageFiles
  };

  console.log(`   ${spicker.entries.length} Einträge, ${pageFiles.length} Detailseiten, links.js: ${spicker.linkData ? "ja" : "nein"}`);

  // [Titel, Prüf-Funktion] – in dieser Reihenfolge wird geprüft.
  const checks = [
    ["1. Eintrags-Links (Datei + Anker)", checkEntryLinks],
    ["2. Jede Detailseite hat einen Eintrag", checkPagesHaveEntry],
    ["3. Chips unter „Verwandte Seiten“", checkRelatedChips],
    ["4. Seiten-Aufbau (page-header, h1, footer, onerror)", checkPageStructure],
    ["5. Sprach-Zuordnung in links.js", checkPageLanguages],
    ["6. Doppelte Begriffe je Sprache", checkDuplicateTerms],
    ["7. Smart-Link-Ziele", checkSmartLinkTargets],
    ["8. Präfix-Reihenfolge", checkPrefixOrder]
  ];
  for (const [title, checkFunction] of checks) {
    const problems = checkFunction(spicker);
    if (problems === null) {
      console.log(`   –       ${title} (entfällt: keine passenden Daten in links.js)`);
      continue;
    }
    report(title, problems);
  }
}


// =====================================================================
// HAUPTPROGRAMM
// =====================================================================
console.log("check-spicker.js – prüfe", SPICKER_ROOT);

if (!fs.existsSync(SPICKER_ROOT)) {
  console.error("[FEHLER] Ordner nicht gefunden:", SPICKER_ROOT);
  process.exit(1);
}

// Ein Spicker ist jeder Unterordner von spicker/, der eine entries.js hat
// (shared/ hat keine und wird darum automatisch übersprungen).
// withFileTypes liefert Objekte mit .isDirectory() statt bloßer Namen.
const spickerNames = fs.readdirSync(SPICKER_ROOT, { withFileTypes: true })
  .filter((item) => item.isDirectory())
  .map((item) => item.name)
  .filter((name) => fs.existsSync(path.join(SPICKER_ROOT, name, "entries.js")))
  .sort();

console.log("Gefundene Spicker:", spickerNames.join(", "));

for (const name of spickerNames) {
  checkSpicker(name);
}

console.log("");
console.log("=== Zusammenfassung ===");
console.log(`   ${totalChecks} Prüfungen gelaufen, ${totalProblems} Problem(e) gefunden.`);
if (totalProblems > 0) {
  console.log("   Ergebnis: FEHLER (Exit-Code 1)");
  process.exit(1);
}
console.log("   Ergebnis: alles OK (Exit-Code 0)");
