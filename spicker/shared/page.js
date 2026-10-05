/* =====================================================================
   page.js – Logik für ALLE Detailseiten (<spicker>/more/*.html)
   ---------------------------------------------------------------------
   Wird von jeder Detailseite geladen, egal aus welchem Spicker:
       <script defer src="../links.js"></script>        (nur falls vorhanden)
       <script defer src="../../shared/page.js"></script>

   Die DATEN für Smart-Links (welche Wörter wohin führen) stehen NICHT
   hier, sondern in <spicker>/links.js. Fehlt die Datei, gibt es auf
   dieser Seite einfach keine Smart-Links.

   Inhaltsverzeichnis
   1. EINSTELLUNGEN   Smart-Link-Einstellungen
   2. COPY-BUTTONS    "Copy"-Button über jedem Codeblock
   3. SMART-LINKS     Fachbegriffe im Text automatisch zu Links machen
   3b. EIGENE BEGRIFFE  entries.js nachladen, Begriffe dieser Seite finden
                      (Grundlage für "Auf dieser Seite" und "Weiter im
                      Lernpfad")
   4. START           DOMContentLoaded (setzt alles in Gang)
   5. VERSTÄNDNIS-BEWERTUNG   Button + Punkte-Lineal (0–10) im Footer,
                      speichert über den lokalen Server oder localStorage.
                      Schlüssel: "<spicker>/<datei>", z. B. "coding/cpp-vector.html"
   ===================================================================== */


/* =====================================================================
   1. EINSTELLUNGEN
   ===================================================================== */
// ---------------------------------------------------------------------
// Smart-Links
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
//   location.pathname  = z. B. "/C:/Dev/Liste-main/spicker/coding/more/for-loop.html"
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
// Bestimmt die Sprache der Seite (siehe 1a in links.js).
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
  // Die Präfix-Liste steht in links.js (PAGE_PREFIX_LANGUAGES).
  // .find() liefert das ERSTE Paar, dessen Präfix passt – oder undefined.
  if (!(pageFile in PAGE_LANGUAGES)) {
    const prefixMatch = PAGE_PREFIX_LANGUAGES.find(([prefix]) => pageFile.startsWith(prefix));
    if (prefixMatch) return prefixMatch[1];
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
  // (alle Großbuchstaben-Namen hier kommen aus links.js)
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
// Gibt es die Daten aus links.js? "typeof" wirft KEINEN Fehler, wenn
// eine Variable gar nicht existiert – es liefert dann nur "undefined".
function hasSmartLinkData() {
  return typeof smartLinkRules !== "undefined" &&
    typeof PAGE_LANGUAGES !== "undefined" &&
    typeof PAGE_PREFIX_LANGUAGES !== "undefined" &&
    typeof TAG_PAGES !== "undefined";
}

function addSmartLinks() {
  if (!hasSmartLinkData()) {
    console.log("[smart-link] keine links.js für diesen Spicker geladen – Seite bleibt ohne Smart-Links");
    return;
  }

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
   3b. EIGENE BEGRIFFE DIESER SEITE
   ---------------------------------------------------------------------
   Eine Detailseite kennt bisher nur sich SELBST (ihren eigenen Text).
   Für die "Auf dieser Seite"-Leiste (Teil D) und "Weiter im Lernpfad"
   (Teil E) muss sie zusätzlich wissen, welche Begriffe aus entries.js
   auf SIE zeigen – und in welcher Reihenfolge.
   ===================================================================== */

// ---------------------------------------------------------------------
// Spicker-ID aus dem Pfad lesen – Detailseiten haben (anders als die
// Listen-Seiten mit <body data-topic="...">) kein eigenes Attribut
// dafür, liegen aber IMMER unter ".../<topic>/more/<datei>.html".
//   ".../spicker/coding/more/it-git.html" → Teile: [..., "coding", "more", "it-git.html"]
//   lastIndexOf("more") findet die Stelle, der Spicker steht GENAU davor.
// Funktioniert so sowohl über den Server (/coding/more/...) als auch
// per Doppelklick ohne Server (file:///C:/.../spicker/coding/more/...),
// weil in BEIDEN Fällen ".../<topic>/more/..." am Pfadende steht.
// ---------------------------------------------------------------------
function getCurrentTopicId() {
  const parts = window.location.pathname.split("/").filter(Boolean);
  const moreIndex = parts.lastIndexOf("more");

  if (moreIndex < 1) {
    console.warn("[entries] Spicker-ID nicht im Pfad gefunden:", window.location.pathname);
    return "";
  }
  return parts[moreIndex - 1];
}

// ---------------------------------------------------------------------
// Lädt "../entries.js" dieses Spickers per JavaScript nach – GENAU das,
// was eine feste <script src="../entries.js">-Zeile im <head> auch tun
// würde, nur eben erst HIER zur Laufzeit statt beim Seitenaufbau.
//
// WARUM dynamisch statt fest im HTML? entries.js enthält für JEDEN
// Spicker alle paar hundert Einträge – würde jede der 600+ Detailseiten
// das fest einbinden, müsste man sie alle von Hand ändern. So reicht
// diese eine Funktion hier für ALLE Detailseiten aller Spicker.
//
// Klappt auch OHNE Server (file://): Ein <script>-Element lädt seine
// Datei relativ zum Ordner der aktuellen Seite – das ist dem Browser
// egal, ob "davor" ein echter Server oder nur das Dateisystem steckt.
// load/error feuern in beiden Fällen gleich zuverlässig.
//
// Gibt ein PROMISE zurück (siehe Teil C der Aufgabe): Ein Promise ist
// ein "Versprechen auf einen Wert, der erst SPÄTER feststeht" – hier:
// entweder die geladenen Daten oder (bei jedem Fehler) null. WICHTIG:
// Dieses Promise wird NIE abgelehnt (reject) – auch wenn entries.js
// fehlt oder kaputt ist, löst es sich mit null auf. Die Seite soll dann
// einfach OHNE die neuen Extras weiterlaufen, nie abstürzen.
// ---------------------------------------------------------------------
function loadTopicEntries() {
  return new Promise(function executor(resolve) {
    const topicId = getCurrentTopicId();
    if (!topicId) {
      resolve(null);
      return;
    }

    const script = document.createElement("script");
    script.src = "../entries.js";

    script.onload = function handleEntriesLoaded() {
      const data = window.SpickerData && window.SpickerData[topicId];
      if (!data || !data.oTableEntries || !Array.isArray(data.oTableEntries.List)) {
        console.warn("[entries] '" + topicId + "' hat keine passenden Daten – Seite läuft ohne die Extras weiter");
        resolve(null);
        return;
      }
      console.log("[entries] '" + topicId + "/entries.js' nachgeladen:", data.oTableEntries.List.length, "Einträge");
      resolve(data);
    };

    script.onerror = function handleEntriesLoadError() {
      console.warn("[entries] '" + topicId + "/entries.js' konnte nicht geladen werden – Seite läuft ohne die Extras weiter");
      resolve(null);
    };

    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------
// Filtert aus ALLEN Einträgen dieses Spickers nur die heraus, deren
// Link auf DIESE Detailseite zeigt – in der Reihenfolge, in der sie in
// entries.js stehen (= Reihenfolge auf der Seite, siehe Unterstufen-
// Regel in entries.js).
//   entry.Link z. B. "more/it-git.html#git"
//   .split("#")[0]            → "more/it-git.html"  (Anker weg)
//   .split("/").pop()         → "it-git.html"        (nur der Dateiname)
//   decodeURIComponent + toLowerCase()  → wie getCurrentPageFile() oben,
//     damit "area%20&%20map.html" und Groß-/Kleinschreibung keine Rolle spielen
// ---------------------------------------------------------------------
function getEntriesForThisPage(topicData, pageFile) {
  const entries = topicData.oTableEntries.List.filter(function linksToThisPage(entry) {
    if (!entry.Link) return false;

    const fileName = entry.Link.split("#")[0].split("/").pop() || "";
    let decodedFileName;
    try {
      decodedFileName = decodeURIComponent(fileName).toLowerCase();
    } catch (error) {
      decodedFileName = fileName.toLowerCase();
    }
    return decodedFileName === pageFile;
  });

  console.log("[entries] Begriffe auf dieser Seite (" + entries.length + "):", entries.map(entry => entry.Begriff).join(", "));
  return entries;
}

// ---------------------------------------------------------------------
// Baut die "Auf dieser Seite"-Leiste direkt unter .page-lead: einen
// Chip pro Begriff, der zu dessen Abschnitt (#id) springt. NUR ab zwei
// Begriffen – bei nur einem gibt es nichts zum Auswählen.
// ---------------------------------------------------------------------
function buildOnThisPageBar(pageEntries) {
  if (pageEntries.length < 2) {
    console.log("[on-this-page] nur", pageEntries.length, "Begriff(e) – keine Leiste nötig");
    return;
  }

  const pageLead = document.querySelector(".page-lead");
  if (!pageLead) {
    console.warn("[on-this-page] .page-lead nicht gefunden – keine Leiste gebaut");
    return;
  }

  const row = document.createElement("div");
  row.className = "chip-row";

  pageEntries.forEach(function appendChip(entry) {
    // Eintrag ohne "#id" im Link → kein Abschnitt zum Springen vorhanden
    if (!entry.Link || !entry.Link.includes("#")) {
      console.warn("[on-this-page] Begriff ohne #id übersprungen:", entry.Begriff);
      return;
    }

    const id = entry.Link.split("#")[1];
    const chip = document.createElement("a");
    chip.className = "chip";
    chip.href = "#" + id;
    chip.textContent = entry.Begriff;
    // Eigenes data-Attribut, damit setupActiveSectionHighlight() den
    // passenden Abschnitt wiederfindet, ohne den href erneut zu zerlegen.
    chip.dataset.targetId = id;
    row.appendChild(chip);
  });

  if (!row.children.length) {
    console.warn("[on-this-page] keine Begriffe mit #id – keine Leiste gebaut");
    return;
  }

  const nav = document.createElement("nav");
  nav.className = "on-this-page";
  nav.setAttribute("aria-label", "Auf dieser Seite");

  const title = document.createElement("p");
  title.className = "on-this-page-title";
  title.textContent = "Auf dieser Seite";

  nav.append(title, row);
  // insertAdjacentElement("afterend", …) = NACH .page-lead einfügen,
  // also als eigenes Element direkt darunter (nicht hinein).
  pageLead.insertAdjacentElement("afterend", nav);

  console.log("[on-this-page] Leiste mit", row.children.length, "Chips eingefügt");
  setupActiveSectionHighlight(nav);
}

// ---------------------------------------------------------------------
// Markiert in der Leiste den Chip des Abschnitts, der gerade "dran" ist
// – nach demselben Grundprinzip wie das IntersectionObserver-Beispiel
// auf js-browser-apis.html: Ein Observer meldet sich von SELBST, sobald
// ein beobachtetes Element eine Trigger-Linie kreuzt, statt dass man bei
// JEDEM "scroll"-Event selbst nachrechnen muss – deutlich sparsamer.
//
// WICHTIG, warum hier trotzdem bei jedem Aufruf NEU über ALLE Abschnitte
// gerechnet wird, statt einfach nur das eine Element aus dem Callback zu
// benutzen: Beim Vorbeiscrollen kann der ALTE Abschnitt mit einem
// winzigen Rest (z. B. nur 8 px) noch genauso "sichtbar" sein wie der
// NEUE – IntersectionObserver kennt nur "sichtbar: ja/nein" PRO Element,
// nicht "welcher von mehreren sichtbaren ist der wichtigste". Deshalb
// wird bei jedem Aufruf bestimmt: Welcher Abschnitt hat seinen Anfang am
// weitesten oben, ohne die Trigger-Linie schon nach OBEN verlassen zu
// haben? Nur DER bekommt "active" – alle anderen verlieren es.
// ---------------------------------------------------------------------
function setupActiveSectionHighlight(nav) {
  // Map: Abschnitt-Element → zugehöriger Chip, für schnellen Zugriff.
  const chipBySection = new Map();
  nav.querySelectorAll(".chip").forEach(function mapChipToSection(chip) {
    const section = document.getElementById(chip.dataset.targetId);
    if (section) {
      chipBySection.set(section, chip);
    } else {
      console.warn("[on-this-page] Abschnitt #" + chip.dataset.targetId + " nicht gefunden");
    }
  });

  if (chipBySection.size === 0) return;

  const sections = [...chipBySection.keys()]; // Dokument-Reihenfolge
  const TRIGGER_LINE = 100; // px von der Fensteroberkante, grob unter dem Seitenkopf

  function updateActiveChip() {
    let current = null;
    let currentTop = -Infinity;

    sections.forEach(function checkSection(section) {
      const top = section.getBoundingClientRect().top;
      // Oberkante schon über der Linie (oder genau darauf) UND weiter
      // unten als der bisher beste Treffer → das ist jetzt der beste.
      if (top <= TRIGGER_LINE && top > currentTop) {
        current = section;
        currentTop = top;
      }
    });

    chipBySection.forEach(function updateChip(chip, section) {
      chip.classList.toggle("active", section === current);
    });
  }

  // threshold mit vielen Stufen (0, 0.01, 0.02, … 1) statt nur 0/1,
  // damit der Observer möglichst oft auslöst, während ein Abschnitt die
  // Trigger-Linie passiert – updateActiveChip() rechnet dann aus den
  // ECHTEN Positionen die Linie trotzdem exakt nach.
  const observer = new IntersectionObserver(updateActiveChip, {
    threshold: Array.from({ length: 21 }, (_, i) => i / 20)
  });
  sections.forEach(section => observer.observe(section));

  updateActiveChip(); // sofort einmal rechnen, nicht erst beim ersten Scrollen

  console.log("[on-this-page] Hervorhebung aktiv für", chipBySection.size, "Abschnitt(e)");
}

// ---------------------------------------------------------------------
// GLEICHE REGEL wie getEntryLevel() in shared/list.js – bei Änderungen
// BEIDE Funktionen anpassen! Liefert die Stufe eines Eintrags als Zahl,
// Infinity wenn keine oder keine gültige Stufe gesetzt ist (landet dann
// nie im Lernpfad, siehe buildLearningPath()).
// ---------------------------------------------------------------------
function getEntryLevel(entry) {
  if (entry.Stufe === undefined) return Infinity;
  const level = Number(entry.Stufe);
  if (Number.isNaN(level)) {
    console.warn("[lernpfad] ungültige Stufe, Eintrag wird ignoriert:", entry);
    return Infinity;
  }
  return level;
}

// ---------------------------------------------------------------------
// Baut die Liste ALLER Detailseiten mit Stufe, in Lernreihenfolge
// (Stufe aufsteigend, bei Gleichstand Reihenfolge in entries.js –
// dieselbe Regel wie beim Sortieren "Empfohlen" in shared/list.js,
// siehe getEntryLevel oben). Jede Datei kommt nur EINMAL vor, mit
// ihrem ERSTEN Eintrag als Vertreter – dessen Begriff wird später der
// Linktext für "← vorige Seite" bzw. "nächste Seite →".
// ---------------------------------------------------------------------

// ---------------------------------------------------------------------
// Macht aus einem entries.js-Link (relativ zur LISTE, z. B.
// "more/it-zahlensysteme.html#binaersystem") einen Link, der von einer
// DETAILSEITE aus funktioniert: nur noch der reine Dateiname, OHNE
// Ordner ("more/") und OHNE "#…" (Anker). Beispiel:
//   "more/it-zahlensysteme.html#binaersystem" → "it-zahlensysteme.html"
//
// WARUM überhaupt umrechnen? entries.js liegt im Spicker-Ordner (z. B.
// coding/), seine Links sind relativ zu DORT gemeint – relativ zu
// coding/index.html. Eine Detailseite liegt aber eine Ebene TIEFER, in
// coding/more/. Derselbe Link würde dort auf coding/more/more/…
// zeigen – die Datei gibt es nicht. Nimmt man stattdessen nur den
// Dateinamen, zeigt er korrekt auf eine andere Datei IM SELBEN Ordner
// (coding/more/), in dem auch die aktuelle Detailseite selbst liegt.
// Und ohne "#…" landet man am ANFANG der Zielseite, nicht mitten in
// einem Abschnitt.
//
// Groß-/Kleinschreibung bleibt UNVERÄNDERT (z. B. "Class.html") – auf
// Linux-Servern sind Dateinamen case-sensitive, ein kleingeschriebener
// Link würde die Datei dort nicht finden.
// ---------------------------------------------------------------------
function getPageHrefFromEntryLink(link) {
  if (!link) {
    console.warn("[lernpfad] Eintrag ohne Link übersprungen");
    return null;
  }
  const fileName = link.split("#")[0].split("/").pop();
  if (!fileName) {
    console.warn("[lernpfad] Link ohne Dateinamen übersprungen:", link);
    return null;
  }
  return fileName;
}

function buildLearningPath(topicData) {
  // Nur Einträge MIT Stufe, zusammen mit ihrer Position in entries.js
  // (für den Gleichstand-Fall, genau wie entryOrder in shared/list.js).
  const withLevel = topicData.oTableEntries.List
    .map(function addIndex(entry, index) { return { entry: entry, index: index }; })
    .filter(function hasLevel(item) { return getEntryLevel(item.entry) !== Infinity; });

  withLevel.sort(function byLevelThenPosition(a, b) {
    const levelDiff = getEntryLevel(a.entry) - getEntryLevel(b.entry);
    return levelDiff !== 0 ? levelDiff : a.index - b.index;
  });

  const seenFiles = new Set();
  const learningPath = [];
  withLevel.forEach(function keepFirstEntryPerFile(item) {
    const href = getPageHrefFromEntryLink(item.entry.Link);
    if (!href) return;

    // "file" NUR für Vergleiche (seenFiles hier, findIndex gegen das
    // bereits kleingeschriebene getCurrentPageFile() in
    // buildLearningPathNav) – fürs Navigieren zählt allein "href" in
    // der ORIGINAL-Schreibweise (siehe getPageHrefFromEntryLink).
    const file = href.toLowerCase();
    if (seenFiles.has(file)) return; // diese Datei steht schon im Lernpfad (weiterer Begriff derselben Seite)

    seenFiles.add(file);
    learningPath.push({ file: file, href: href, begriff: item.entry.Begriff });
  });

  return learningPath;
}

// ---------------------------------------------------------------------
// Sucht unter <main> den Abschnitt, dessen <h2> genau "Verwandte Seiten"
// heißt – dort soll der Lernpfad-Abschnitt DAVOR eingefügt werden.
// ---------------------------------------------------------------------
function findRelatedPagesSection() {
  let found = null;
  document.querySelectorAll("main section").forEach(function checkSection(section) {
    const heading = section.querySelector("h2");
    if (heading && heading.textContent.trim() === "Verwandte Seiten") {
      found = section;
    }
  });
  return found;
}

// ---------------------------------------------------------------------
// Fügt (sofern diese Seite Teil des Lernpfads ist) VOR "Verwandte
// Seiten" einen Abschnitt mit "← vorige Seite" / "nächste Seite →" ein.
// Erste Seite im Lernpfad → kein "←". Letzte Seite → kein "→".
// ---------------------------------------------------------------------
function buildLearningPathNav(learningPath, pageFile) {
  const currentIndex = learningPath.findIndex(function matchesCurrentFile(page) {
    return page.file === pageFile;
  });

  if (currentIndex === -1) {
    console.log("[lernpfad] diese Seite hat keine Stufe – kein Lernpfad-Abschnitt");
    return;
  }

  const prev = currentIndex > 0 ? learningPath[currentIndex - 1] : null;
  const next = currentIndex < learningPath.length - 1 ? learningPath[currentIndex + 1] : null;

  if (!prev && !next) {
    console.log("[lernpfad] einzige Seite im Lernpfad – nichts zu verlinken");
    return;
  }

  const section = document.createElement("section");
  section.className = "learning-path";

  const heading = document.createElement("h2");
  heading.textContent = "Weiter im Lernpfad";
  section.appendChild(heading);

  const nav = document.createElement("div");
  nav.className = "learning-path-nav";

  // IMMER beide Slots anlegen (auch leer) – so bleibt "vorige" links und
  // "nächste" rechts, egal welcher der beiden fehlt (siehe CSS
  // justify-content: space-between).
  const prevSlot = document.createElement("span");
  if (prev) {
    const prevLink = document.createElement("a");
    prevLink.className = "chip";
    prevLink.href = prev.href; // nur Dateiname, kein "more/", kein "#…" – siehe getPageHrefFromEntryLink
    prevLink.textContent = "← " + prev.begriff;
    prevSlot.appendChild(prevLink);
  }

  const nextSlot = document.createElement("span");
  if (next) {
    const nextLink = document.createElement("a");
    nextLink.className = "chip";
    nextLink.href = next.href;
    nextLink.textContent = next.begriff + " →";
    nextSlot.appendChild(nextLink);
  }

  nav.append(prevSlot, nextSlot);
  section.appendChild(nav);

  const relatedSection = findRelatedPagesSection();
  if (relatedSection) {
    relatedSection.insertAdjacentElement("beforebegin", section);
  } else {
    // Kein "Verwandte Seiten" gefunden (sollte nicht vorkommen) → ans Ende von <main>
    console.warn("[lernpfad] Abschnitt 'Verwandte Seiten' nicht gefunden – Lernpfad ans Ende gehängt");
    document.querySelector("main").appendChild(section);
  }

  console.log("[lernpfad] Position " + (currentIndex + 1) + "/" + learningPath.length +
    " | zurück: " + (prev ? prev.begriff : "–") + " | weiter: " + (next ? next.begriff : "–"));
  console.log("[lernpfad] zurück → " + (prev ? prev.href : "–") + " | weiter → " + (next ? next.href : "–"));
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

  // entries.js nachladen (siehe 3b) – läuft NEBENHER weiter (kein await),
  // weil Copy-Buttons, Smart-Links und Bewertung nicht darauf warten
  // müssen. .then() statt async/await an dieser Stelle, damit
  // initializeMorePages() selbst eine ganz normale, synchrone Funktion
  // bleiben kann.
  loadTopicEntries().then(function handleTopicEntriesLoaded(topicData) {
    if (!topicData) return; // Fehler/Fehlen wurde schon in loadTopicEntries() gemeldet

    try {
      const pageFile = getCurrentPageFile();
      const pageEntries = getEntriesForThisPage(topicData, pageFile);
      buildOnThisPageBar(pageEntries);

      const learningPath = buildLearningPath(topicData);
      buildLearningPathNav(learningPath, pageFile);
    } catch (error) {
      console.error("[entries] Fehler beim Verarbeiten der Begriffe dieser Seite:", error);
    }
  });

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

// ---------------------------------------------------------------------
// SCHLÜSSEL FÜR DIE BEWERTUNG: "<spicker>/<datei>"
// ---------------------------------------------------------------------
// Früher war der Schlüssel nur der Dateiname ("cpp-vector.html"). Mit
// mehreren Spickern könnten aber zwei Seiten gleich heißen (z. B.
// "einfuehrung.html" in coding UND in mathe) – dann würden sie sich
// gegenseitig überschreiben. Deshalb steht jetzt der Spicker davor:
//   "coding/cpp-vector.html", "mathe/pythagoras.html"
//
// Den Spicker lesen wir aus dem Pfad der Seite:
//   .../spicker/coding/more/cpp-vector.html
//                ↑ drittletztes Stück   ↑ letztes Stück
// .split("/") macht daraus ein Array, .at(-3) = drittes von hinten.
// ---------------------------------------------------------------------

// Werte ohne "/" im localStorage stammen aus der Zeit vor dem Umbau und
// gehören alle zum Coding-Spicker (es gab ja nur den).
const LEGACY_TOPIC_ID = "coding";

function getCurrentTopicId() {
  const parts = window.location.pathname.split("/");
  let topicId = "";
  try {
    topicId = decodeURIComponent(parts.at(-3) || "").toLowerCase();
  } catch (error) {
    console.warn("[progress] Spicker-Ordner konnte nicht gelesen werden:", parts.at(-3), error);
  }

  // Sicherheitsnetz: Liegt die Seite nicht in <spicker>/more/, passt der
  // Pfad nicht zum erwarteten Aufbau → in der Konsole melden.
  if (parts.at(-2) !== "more" || !topicId) {
    console.warn("[progress] Seite liegt nicht in <spicker>/more/ – Pfad:", window.location.pathname);
  }
  return topicId;
}

function getProgressKey() {
  const key = getCurrentTopicId() + "/" + getCurrentPageFile();
  console.log("[progress] Schlüssel dieser Seite:", key);
  return key;
}

// Unter diesem Pfad läuft die API von server.js.
const PROGRESS_API_BASE = "/api/progress";

// Unter diesem Schlüssel liegen die Werte im localStorage, falls kein
// Server erreichbar ist (oder gar keiner existieren kann). localStorage
// kann nur TEXT speichern, deshalb wird hier ein Objekt als JSON-Text
// abgelegt, z. B.: '{"coding/a.html":7,"coding/button.html":3}'
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

// ---------------------------------------------------------------------
// EINMALIGE UMSTELLUNG DER localStorage-SCHLÜSSEL
// ---------------------------------------------------------------------
// Alte Einträge heißen "a.html", neue "coding/a.html". Diese Funktion
// benennt alte Schlüssel einmal um und schreibt alles zurück. Beim
// nächsten Aufruf gibt es keine Schlüssel ohne "/" mehr → sie tut
// dann nichts mehr (keine doppelte Umstellung möglich).
// Gibt es den neuen Schlüssel schon, gewinnt der neue Wert, und der
// alte wird nur entfernt.
// ---------------------------------------------------------------------
function migrateLocalStorageKeys() {
  const allValues = readAllLocalProgress();
  const legacyKeys = Object.keys(allValues).filter(key => !key.includes("/"));

  if (legacyKeys.length === 0) {
    return;
  }

  console.log("[migration] localStorage: " + legacyKeys.length + " alte Schlüssel ohne Spicker gefunden → bekommen \"" + LEGACY_TOPIC_ID + "/\"");

  legacyKeys.forEach(function renameLegacyKey(oldKey) {
    const newKey = LEGACY_TOPIC_ID + "/" + oldKey;
    if (newKey in allValues) {
      console.log("[migration]   " + oldKey + " → übersprungen, " + newKey + " gibt es schon (" + allValues[newKey] + ")");
    } else {
      allValues[newKey] = allValues[oldKey];
      console.log("[migration]   " + oldKey + " → " + newKey + " = " + allValues[newKey]);
    }
    delete allValues[oldKey];
  });

  try {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allValues));
    console.log("[migration] localStorage umgestellt");
  } catch (error) {
    console.warn("[migration] localStorage konnte nicht geschrieben werden:", error);
  }
}

// Schreibt EINEN Wert in den localStorage (Rest bleibt erhalten).
// level === null → Eintrag wird entfernt (Zurücksetzen bzw. nach einer
// erfolgreichen Übernahme in die Datenbank, siehe migrateLocalStorageToServer).
function writeLocalProgress(progressKey, level) {
  try {
    const allValues = readAllLocalProgress();
    if (level === null) {
      delete allValues[progressKey];
    } else {
      allValues[progressKey] = level;
    }
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allValues));
    console.log("[progress] in localStorage gespeichert:", progressKey, "=", level);
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
async function loadProgressLevel(progressKey) {
  if (!isLocalServerContext()) {
    // file:// oder fremder Host: hier ist localStorage der normale,
    // erwartete Weg – kein Fehlerfall, kein Retry nötig.
    const allValues = readAllLocalProgress();
    const level = typeof allValues[progressKey] === "number" ? allValues[progressKey] : null;
    console.log("[progress] geladen aus localStorage (kein eigener Server hier möglich):", progressKey, "=", level);
    return { level: level, source: PROGRESS_SOURCE.LOCAL_STORAGE };
  }

  try {
    const response = await fetchProgressApiWithRetry(
      PROGRESS_API_BASE + "/" + encodeURIComponent(progressKey),
      undefined,
      "Laden von " + progressKey
    );
    const row = await response.json(); // { page, level, updated } oder null
    console.log("[progress] vom Server geladen:", progressKey, "→", row);
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
async function saveProgressLevel(progressKey, level) {
  if (!isLocalServerContext()) {
    writeLocalProgress(progressKey, level);
    return { source: PROGRESS_SOURCE.LOCAL_STORAGE };
  }

  try {
    await fetchProgressApiWithRetry(
      PROGRESS_API_BASE + "/" + encodeURIComponent(progressKey),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ level: level })
      },
      "Speichern von " + progressKey
    );
    console.log("[progress] auf dem Server gespeichert:", progressKey, "=", level);
    return { source: PROGRESS_SOURCE.SERVER };
  } catch (error) {
    console.error("[progress] Speichern auf dem Server fehlgeschlagen (" + progressKey + " = " + level + "):", error.message);
    return { source: PROGRESS_SOURCE.UNREACHABLE };
  }
}

// Setzt die Bewertung für die aktuelle Seite zurück (löscht sie).
async function resetProgressLevel(progressKey) {
  if (!isLocalServerContext()) {
    writeLocalProgress(progressKey, null);
    return { source: PROGRESS_SOURCE.LOCAL_STORAGE };
  }

  try {
    await fetchProgressApiWithRetry(
      PROGRESS_API_BASE + "/" + encodeURIComponent(progressKey),
      { method: "DELETE" },
      "Zurücksetzen von " + progressKey
    );
    console.log("[progress] auf dem Server zurückgesetzt:", progressKey);
    return { source: PROGRESS_SOURCE.SERVER };
  } catch (error) {
    console.error("[progress] Zurücksetzen auf dem Server fehlgeschlagen (" + progressKey + "):", error.message);
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
// entfernt. Gibt zurück, was übernommen wurde ({ "coding/a.html": level, ... }),
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
function buildProgressRuler(progressKey, button) {
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
    saveProgressLevel(progressKey, value).then(function handleSaveResult(result) {
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
    resetProgressLevel(progressKey).then(function handleResetResult(result) {
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

  // Schlüssel "<spicker>/<datei>" (siehe 5a). Alte localStorage-Werte
  // ohne Spicker vorher einmalig umstellen.
  migrateLocalStorageKeys();
  const progressKey = getProgressKey();

  // Container für Button + Lineal. "position: relative" in core.css
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

  const ruler = buildProgressRuler(progressKey, button);

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
  loadProgressLevel(progressKey).then(async function handleInitialLoad(result) {
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
      if (Object.prototype.hasOwnProperty.call(migratedPages, progressKey)) {
        ruler.setLevel(migratedPages[progressKey]);
      }
    }
  });

  console.log("[progress] Verständnis-Bewertung eingerichtet für:", progressKey);
}
