/* =====================================================================
   hub.js – Logik der Übersicht (spicker/index.html)
   ---------------------------------------------------------------------
   Baut aus SPICKER_TOPICS (shared/topics.js) eine Kachel pro Spicker:
     Titel, Untertitel, Akzentfarbe als Rand, Anzahl der Einträge.

   Die Anzahl wird ermittelt, indem die entries.js des Spickers
   zusätzlich geladen wird. Klappt das nicht (Datei fehlt, Tippfehler
   darin), steht auf der Kachel "Einträge: ?" – die Seite funktioniert
   trotzdem.

   WARUM <script> STATT fetch()?
     fetch() funktioniert nicht, wenn die Seite per Doppelklick
     (file://) geöffnet wird – der Browser verbietet das. Ein normales
     <script src="..."> darf dagegen auch lokale Dateien laden.
   ===================================================================== */

// ---------------------------------------------------------------------
// Lädt eine JS-Datei nachträglich und meldet über ein Promise, ob es
// geklappt hat. resolve = fertig geladen, reject = Fehler.
// ---------------------------------------------------------------------
function loadScript(src) {
  return new Promise(function loadScriptExecutor(resolve, reject) {
    const script = document.createElement("script");
    script.src = src;
    script.onload = function handleScriptLoad() { resolve(); };
    script.onerror = function handleScriptError() { reject(new Error("konnte nicht geladen werden: " + src)); };
    document.head.appendChild(script);
  });
}

// ---------------------------------------------------------------------
// Baut EINE Kachel. Gibt das <a>-Element und das Feld für die Anzahl zurück.
//
// style.setProperty("--tile-accent", farbe) setzt eine CSS-Variable nur
// für DIESE Kachel. core.css benutzt sie für den farbigen Rand links.
// ---------------------------------------------------------------------
function buildTopicTile(topic) {
  const tile = document.createElement("a");
  tile.className = "topic-tile";
  tile.href = topic.folder + "/index.html"; // index.html mit angeben → klappt auch ohne Server
  tile.style.setProperty("--tile-accent", topic.accent);

  const icon = document.createElement("img");
  icon.className = "topic-icon";
  icon.src = "shared/icons/" + topic.icon;
  icon.alt = "";
  icon.addEventListener("error", function handleIconError() {
    console.warn("[hub] Icon konnte nicht geladen werden:", icon.src);
    icon.style.display = "none";
  });

  const title = document.createElement("h2");
  title.className = "topic-title";
  title.textContent = topic.title;

  const subtitle = document.createElement("p");
  subtitle.className = "topic-subtitle";
  subtitle.textContent = topic.subtitle;

  const count = document.createElement("p");
  count.className = "topic-count";
  count.textContent = "Einträge: …";

  tile.append(icon, title, subtitle, count);
  return { tile, count };
}

// ---------------------------------------------------------------------
// Lädt <ordner>/entries.js und schreibt die Anzahl in die Kachel.
// "async" + "await": wartet auf loadScript, ohne die Seite anzuhalten.
// ---------------------------------------------------------------------
async function showEntryCount(topic, countElement) {
  try {
    await loadScript(topic.folder + "/entries.js");
    const data = window.SpickerData && window.SpickerData[topic.id];
    if (!data || !data.oTableEntries || !Array.isArray(data.oTableEntries.List)) {
      throw new Error("entries.js geladen, aber keine Daten unter SpickerData[\"" + topic.id + "\"]");
    }
    const total = data.oTableEntries.List.length;
    countElement.textContent = "Einträge: " + total;
    console.log("[hub] " + topic.id + ":", total, "Einträge");
  } catch (error) {
    countElement.textContent = "Einträge: ?";
    console.warn("[hub] Anzahl für '" + topic.id + "' nicht ermittelbar:", error.message);
  }
}

// ---------------------------------------------------------------------
// START
// ---------------------------------------------------------------------
document.addEventListener("DOMContentLoaded", function initializeHub() {
  console.log("[hub] Übersicht geladen");

  const grid = document.getElementById("topicGrid");
  if (!grid) {
    console.error("[hub] #topicGrid nicht gefunden");
    return;
  }

  // typeof wirft keinen Fehler, falls topics.js gar nicht geladen wurde
  if (typeof SPICKER_TOPICS === "undefined" || !Array.isArray(SPICKER_TOPICS)) {
    console.error("[hub] shared/topics.js nicht geladen – keine Kacheln möglich");
    grid.textContent = "Die Liste der Spicker konnte nicht geladen werden (siehe Konsole, F12).";
    return;
  }

  SPICKER_TOPICS.forEach(function addTopicTile(topic) {
    const { tile, count } = buildTopicTile(topic); // Destructuring: beide Werte auspacken
    grid.appendChild(tile);
    showEntryCount(topic, count);
  });

  console.log("[hub] Kacheln gebaut:", SPICKER_TOPICS.length);
});
