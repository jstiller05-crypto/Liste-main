/* =====================================================================
   server.js – Lokaler Server für den Spicker
   ---------------------------------------------------------------------
   Macht zwei Dinge:

   1. Liefert den Ordner "liste/" als Webseite aus (statische Dateien:
      HTML, CSS, JS, Icons). Aufruf im Browser z. B.:
        http://localhost:3000/Spicker.html

   2. Stellt eine kleine JSON-API bereit, über die more.js speichert,
      wie gut man ein Thema verstanden hat (0–10 Punkte). Die Werte
      landen in einer SQLite-Datenbank unter data/progress.db.

   WICHTIG: Nur eingebaute Node-Module (node:http, node:fs, node:path,
   node:sqlite) – keine npm-Pakete nötig, also auch kein "npm install".

   node:sqlite braucht Node.js 22.5 oder neuer. Mit "node --version"
   prüfen. Ist es älter, bitte Node aktualisieren (nodejs.org).

   AUTOSTART & UNSICHTBAR LAUFEN (siehe start-hidden.vbs):
     - Der Server lauscht NUR auf 127.0.0.1 ("localhost"), nicht auf
       allen Netzwerk-Schnittstellen (siehe Begründung bei server.listen
       weiter unten).
     - Jede Konsolen-Zeile bekommt automatisch eine ISO-Zeit vorangestellt
       (siehe "Zeitstempel für Logs" unten) – wichtig, weil start-hidden.vbs
       die Ausgabe nach data\server.log statt in ein sichtbares Fenster
       schreibt.
     - Beim Start wird die eigene Prozess-ID (PID) nach data\server.pid
       geschrieben. stop-server.bat nutzt das, um GENAU diesen Prozess
       zu beenden – nicht irgendeinen anderen node-Prozess, der zufällig
       nebenbei läuft (z. B. von einem ganz anderen Projekt).
   ===================================================================== */

"use strict";

const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");
const { DatabaseSync } = require("node:sqlite");

// ---------------------------------------------------------------------
// ZEITSTEMPEL FÜR LOGS
// ---------------------------------------------------------------------
// Läuft der Server unsichtbar über start-hidden.vbs, landet die gesamte
// Konsolen-Ausgabe in data\server.log statt in einem sichtbaren Fenster.
// Damit man dort nachvollziehen kann, WANN etwas passiert ist, wird
// hier console.log/warn/error EINMALIG "umgebaut": jeder Aufruf bekommt
// automatisch eine ISO-Zeit (z. B. "2026-09-29T18:04:12.345Z") als
// erstes Argument vorangestellt – man muss also an keiner der späteren
// console.log(...)-Stellen im Code etwas ändern.
//
// "...args" (Rest-Parameter) sammelt ALLE übergebenen Argumente in ein
// Array ein, egal wie viele es sind (console.log("a", "b", "c") → drei
// Argumente). originalFn(...args) "spreadet" sie wieder einzeln aus.
// ---------------------------------------------------------------------
function withTimestamp(originalFn) {
  return function loggedWithTimestamp(...args) {
    originalFn(new Date().toISOString(), ...args);
  };
}
console.log = withTimestamp(console.log.bind(console));
console.warn = withTimestamp(console.warn.bind(console));
console.error = withTimestamp(console.error.bind(console));


/* =====================================================================
   1. GRUND-EINSTELLUNGEN & PFADE
   ===================================================================== */

const PORT = 3000;

// Siehe Begründung weiter unten bei server.listen(...).
const HOST = "127.0.0.1";

// __dirname = der Ordner, in dem diese Datei liegt (Repo-Root).
const ROOT_DIR = __dirname;
const STATIC_ROOT = path.join(ROOT_DIR, "liste");   // hier liegen die Webseiten
const DATA_DIR = path.join(ROOT_DIR, "data");        // hier liegt Datenbank, Log, PID
const DB_PATH = path.join(DATA_DIR, "progress.db");
const PID_PATH = path.join(DATA_DIR, "server.pid");

// data/-Ordner anlegen, falls er noch nicht existiert.
// { recursive: true } = auch Zwischenordner anlegen, und KEIN Fehler,
// falls der Ordner schon da ist.
fs.mkdirSync(DATA_DIR, { recursive: true });
console.log("[server] Datenordner bereit:", DATA_DIR);


/* =====================================================================
   2. DATENBANK (SQLite)
   ---------------------------------------------------------------------
   DatabaseSync öffnet (oder erstellt) die Datei data/progress.db.
   "Sync" heißt: die Befehle laufen nicht nebenläufig ab, sondern einer
   nach dem anderen – für ein kleines Lern-Projekt wie dieses völlig
   ausreichend und einfacher zu verstehen als async-Datenbank-Code.
   ===================================================================== */

const db = new DatabaseSync(DB_PATH);
console.log("[db] Datenbank geöffnet:", DB_PATH);

// CREATE TABLE IF NOT EXISTS = Tabelle nur anlegen, wenn sie noch nicht
// existiert. So kann man den Server beliebig oft neu starten, ohne dass
// vorhandene Daten verloren gehen.
db.exec(`
  CREATE TABLE IF NOT EXISTS progress (
    page    TEXT PRIMARY KEY,
    level   INTEGER NOT NULL CHECK (level BETWEEN 0 AND 10),
    updated TEXT NOT NULL
  )
`);
console.log("[db] Tabelle 'progress' bereit");

// ---------------------------------------------------------------------
// PREPARED STATEMENTS
// ---------------------------------------------------------------------
// Was ist SQL-Injection?
//   Würde man eine Anfrage per String zusammenbauen, z. B.:
//     db.exec("SELECT * FROM progress WHERE page = '" + page + "'")
//   könnte jemand als "page" etwas wie   x'; DROP TABLE progress; --
//   einschleusen. Die Datenbank würde das als eigenen SQL-Befehl lesen
//   und die Tabelle löschen – eine "SQL-Injection".
//
// Die Lösung: Prepared Statements. Man schreibt die Anfrage EINMAL mit
// "?" als Platzhalter (db.prepare(...)). Erst beim Ausführen (.run(),
// .get(), .all()) werden die echten Werte übergeben. Die Datenbank
// behandelt sie dann IMMER als reine Daten, niemals als SQL-Code –
// egal was darin steht. Deshalb werden hier alle Anfragen einmal
// vorbereitet und danach nur noch mit Werten "gefüttert".
// ---------------------------------------------------------------------
const statements = {
  getAll: db.prepare("SELECT page, level, updated FROM progress ORDER BY page"),
  getOne: db.prepare("SELECT page, level, updated FROM progress WHERE page = ?"),
  // UPSERT = "INSERT or UPDATE" in einem Befehl:
  //   Gibt es die Seite schon (page ist PRIMARY KEY → Konflikt),
  //   wird per "ON CONFLICT ... DO UPDATE" stattdessen aktualisiert,
  //   statt einen Fehler zu werfen.
  upsert: db.prepare(`
    INSERT INTO progress (page, level, updated)
    VALUES (?, ?, ?)
    ON CONFLICT(page) DO UPDATE SET level = excluded.level, updated = excluded.updated
  `),
  remove: db.prepare("DELETE FROM progress WHERE page = ?")
};


/* =====================================================================
   3. STATISCHE DATEIEN (liste/ ausliefern)
   ===================================================================== */

// Datei-Endung → Content-Type. Ohne den richtigen Content-Type zeigt
// der Browser z. B. CSS-Dateien manchmal nicht richtig an.
const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ico": "image/x-icon",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2"
};

function getContentType(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  return CONTENT_TYPES[extension] || "application/octet-stream";
}

// ---------------------------------------------------------------------
// Baut aus der angefragten URL einen sicheren Dateipfad innerhalb von
// STATIC_ROOT. Verhindert einen "Verzeichnis-Ausbruch" über "../", mit
// dem man sonst z. B. an server.js oder data/progress.db kommen könnte.
//
// Trick: erst den Pfad normal zusammenbauen (path.join löst "../" aber
// noch nicht ab), dann mit path.resolve in einen ABSOLUTEN Pfad ohne
// "../"-Stücke umwandeln, und am Ende prüfen: liegt dieser absolute
// Pfad wirklich noch INNERHALB von STATIC_ROOT?
// ---------------------------------------------------------------------
function resolveStaticFilePath(urlPathname) {
  // "/" → Startseite des Spickers
  const relativePath = urlPathname === "/" ? "/Spicker.html" : urlPathname;

  // %20 usw. wieder in normale Zeichen umwandeln (z. B. "area%20&%20map.html")
  const decodedPath = decodeURIComponent(relativePath);

  const requestedPath = path.join(STATIC_ROOT, decodedPath);
  const resolvedPath = path.resolve(requestedPath);

  // path.relative liefert "..." falls resolvedPath AUSSERHALB von
  // STATIC_ROOT liegt. Beginnt das Ergebnis mit "..", war der Versuch
  // ein Ausbruch aus dem erlaubten Ordner.
  const relativeToRoot = path.relative(STATIC_ROOT, resolvedPath);
  const isInsideRoot =
    relativeToRoot === "" ||
    (!relativeToRoot.startsWith("..") && !path.isAbsolute(relativeToRoot));

  return isInsideRoot ? resolvedPath : null;
}

function serveStaticFile(req, res, urlPathname) {
  const filePath = resolveStaticFilePath(urlPathname);

  if (!filePath) {
    console.warn("[server] Verzeichnis-Ausbruch blockiert:", urlPathname);
    send404(res);
    return;
  }

  fs.stat(filePath, function handleStat(statError, stats) {
    if (statError || !stats.isFile()) {
      send404(res);
      return;
    }

    fs.readFile(filePath, function handleReadFile(readError, fileContent) {
      if (readError) {
        console.error("[server] Datei konnte nicht gelesen werden:", filePath, readError);
        send500(res);
        return;
      }

      res.writeHead(200, { "Content-Type": getContentType(filePath) });
      res.end(fileContent);
    });
  });
}

function send404(res) {
  res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("404 – Nicht gefunden");
}

function send500(res) {
  res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("500 – Serverfehler");
}


/* =====================================================================
   4. JSON-API  (/api/progress/...)
   ===================================================================== */

const API_PREFIX = "/api/progress";

// Eigene, kleine Route zum SAUBEREN Beenden des Servers, siehe
// gracefulShutdown() weiter unten (Abschnitt 6) für die Begründung,
// warum das zuverlässiger ist als taskkill von außen.
const SHUTDOWN_PATH = "/api/shutdown";

function sendJson(res, statusCode, data) {
  const body = JSON.stringify(data);
  res.writeHead(statusCode, { "Content-Type": "application/json; charset=utf-8" });
  res.end(body);
}

// Liest den Request-Body (bei PUT der Teil mit z. B. {"level": 7}) in
// einen einzigen String ein. HTTP-Bodies kommen häppchenweise als
// "data"-Events an, deshalb wird hier gesammelt, bis "end" kommt.
// Ein Limit verhindert, dass jemand riesige Bodies schickt.
function readRequestBody(req, maxBytes) {
  return new Promise(function executor(resolve, reject) {
    let receivedBytes = 0;
    const chunks = [];

    req.on("data", function handleChunk(chunk) {
      receivedBytes += chunk.length;
      if (receivedBytes > maxBytes) {
        reject(new Error("Anfrage-Body zu groß"));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on("end", function handleEnd() {
      resolve(Buffer.concat(chunks).toString("utf8"));
    });

    req.on("error", reject);
  });
}

// Prüft, ob "page" ein gültiger Dateiname ist: endet auf ".html",
// enthält keine Pfad-Trenner (kein Ordnerwechsel möglich).
function isValidPageName(page) {
  return typeof page === "string" && /^[^/\\]+\.html$/i.test(page);
}

// Prüft, ob "level" eine ganze Zahl zwischen 0 und 10 ist.
function isValidLevel(level) {
  return Number.isInteger(level) && level >= 0 && level <= 10;
}

async function handleApiRequest(req, res, urlPathname) {
  const method = req.method;

  // Fall A: /api/progress  (ohne Seitenname) → nur GET (alle Einträge)
  if (urlPathname === API_PREFIX) {
    if (method !== "GET") {
      sendJson(res, 405, { error: "Nur GET erlaubt auf " + API_PREFIX });
      return;
    }
    const rows = statements.getAll.all();
    console.log("[db] GET alle Einträge:", rows.length);
    sendJson(res, 200, rows);
    return;
  }

  // Fall B: /api/progress/<page>
  const rawPage = urlPathname.slice((API_PREFIX + "/").length);
  const page = decodeURIComponent(rawPage);

  if (!isValidPageName(page)) {
    sendJson(res, 400, { error: "Ungültiger Seitenname (muss auf .html enden)" });
    return;
  }

  if (method === "GET") {
    const row = statements.getOne.get(page) ?? null;
    console.log("[db] GET", page, "→", row);
    sendJson(res, 200, row);
    return;
  }

  if (method === "PUT") {
    let bodyText;
    try {
      bodyText = await readRequestBody(req, 10 * 1024); // max. 10 KB
    } catch (error) {
      console.warn("[server] Body lesen fehlgeschlagen:", error.message);
      sendJson(res, 400, { error: "Body konnte nicht gelesen werden" });
      return;
    }

    let payload;
    try {
      payload = JSON.parse(bodyText);
    } catch (error) {
      sendJson(res, 400, { error: "Ungültiges JSON im Body" });
      return;
    }

    if (!isValidLevel(payload.level)) {
      sendJson(res, 400, { error: "level muss eine Ganzzahl von 0 bis 10 sein" });
      return;
    }

    const updated = new Date().toISOString();
    // .run(...) führt das vorbereitete Statement MIT diesen Werten aus.
    // Die Werte ersetzen die "?" in der Reihenfolge, in der sie hier stehen.
    statements.upsert.run(page, payload.level, updated);
    console.log("[db] UPSERT", page, "=", payload.level);

    sendJson(res, 200, { page, level: payload.level, updated });
    return;
  }

  if (method === "DELETE") {
    const info = statements.remove.run(page);
    console.log("[db] DELETE", page, "→ entfernte Zeilen:", info.changes);
    sendJson(res, 200, { deleted: info.changes > 0, page });
    return;
  }

  sendJson(res, 405, { error: "Methode nicht erlaubt: " + method });
}


/* =====================================================================
   5. SERVER STARTEN
   ===================================================================== */

const server = http.createServer(function handleRequest(req, res) {
  // Jede Anfrage protokollieren – hilft beim Nachvollziehen, was passiert.
  console.log("[server]", req.method, req.url);

  let urlPathname;
  try {
    // "http://localhost" ist nur eine Basis, damit new URL() mit dem
    // relativen req.url (z. B. "/api/progress/a.html?x=1") klarkommt.
    urlPathname = new URL(req.url, "http://localhost").pathname;
  } catch (error) {
    console.warn("[server] Ungültige URL:", req.url, error.message);
    send404(res);
    return;
  }

  // Der Server darf NIE abstürzen – deshalb liegt die ganze
  // Anfrage-Behandlung in try/catch. Ein einzelner Fehler soll nur
  // diese eine Anfrage mit 500 beantworten, nicht den ganzen Prozess.
  try {
    if (urlPathname === SHUTDOWN_PATH && req.method === "POST") {
      handleShutdownRequest(res);
    } else if (urlPathname === API_PREFIX || urlPathname.startsWith(API_PREFIX + "/")) {
      handleApiRequest(req, res, urlPathname).catch(function handleApiError(error) {
        console.error("[server] Fehler in der API:", error);
        sendJson(res, 500, { error: "Interner Serverfehler" });
      });
    } else {
      serveStaticFile(req, res, urlPathname);
    }
  } catch (error) {
    console.error("[server] Unerwarteter Fehler:", error);
    send500(res);
  }
});

// Falls der Server selbst einen Fehler wirft (z. B. Port schon belegt),
// hier abfangen statt mit Stacktrace abzustürzen.
server.on("error", function handleServerError(error) {
  if (error.code === "EADDRINUSE") {
    // Läuft schon ein Server auf diesem Port (z. B. weil der Autostart
    // ihn schon gestartet hat)? Dann macht ein zweiter Prozess keinen
    // Sinn – sauber beenden (process.exit), statt mit offenem, aber
    // nutzlosem Prozess weiterzulaufen. WICHTIG: An dieser Stelle wurde
    // data\server.pid noch NICHT beschrieben (das passiert erst, wenn
    // listen() wirklich erfolgreich war, s. u.) – die PID-Datei des
    // schon laufenden, echten Servers bleibt also unangetastet.
    console.error("[server] Port", PORT, "ist bereits belegt – läuft der Server schon? Beende diesen zweiten Prozess.");
    process.exit(1);
  } else {
    console.error("[server] Server-Fehler:", error);
  }
});

// ---------------------------------------------------------------------
// NUR AUF 127.0.0.1 ("localhost") LAUSCHEN
// ---------------------------------------------------------------------
// Ohne die zweite Adresse hier würde Node auf ALLEN Netzwerk-
// Schnittstellen lauschen (auch dem echten WLAN/LAN-Adapter). Andere
// Geräte im selben Netzwerk (WG, Schule, Café-WLAN, ...) könnten den
// Server dann über deine lokale IP erreichen und ohne jede Anmeldung
// Verständnis-Werte lesen UND ÄNDERN (die API prüft keine Passwörter).
// "127.0.0.1" ist die "Loopback"-Adresse: Anfragen von AUSSERHALB
// dieses Rechners kommen dort gar nicht erst an.
server.listen(PORT, HOST, function handleListening() {
  // Erst JETZT, wo das Lauschen wirklich erfolgreich war, die eigene
  // PID in die Datei schreiben (siehe gracefulShutdown/removeOwnPidFile
  // weiter unten für den Grund, warum die Reihenfolge wichtig ist).
  try {
    fs.writeFileSync(PID_PATH, String(process.pid), "utf8");
    console.log("[server] PID-Datei geschrieben:", PID_PATH, "→", process.pid);
  } catch (error) {
    console.error("[server] PID-Datei konnte nicht geschrieben werden:", error);
  }

  console.log("[server] läuft auf http://" + HOST + ":" + PORT + "/Spicker.html", "(PID " + process.pid + ")");
});


/* =====================================================================
   6. SAUBER BEENDEN
   ---------------------------------------------------------------------
   Zwei Wege, den Server zu stoppen:

   a) STRG+C / SIGTERM (falls der Server sichtbar in einem Fenster
      läuft, z. B. über "node server.js" oder start.bat).

   b) Der HTTP-Aufruf POST /api/shutdown (das nutzt stop-server.bat).
      Warum nicht einfach "taskkill /PID <pid>" von außen? Ausprobiert:
      Windows verweigert das bei einem UNSICHTBAREN Hintergrund-Prozess
      ohne eigenes Fenster mit der Meldung "Die Beendigung dieses
      Prozesses muss erzwungen werden (mit der Option /F)". "/F" wäre
      aber ein hartes Abwürgen (wie SIGKILL) – der Prozess bekommt dann
      GAR KEINE Chance mehr, die Datenbank sauber zu schließen oder die
      PID-Datei zu löschen. Der Umweg über eine eigene HTTP-Route
      innerhalb des Servers läuft dagegen ganz normal im eigenen
      JavaScript-Code und kann darum zuverlässig aufräumen. stop-
      server.bat versucht darum ZUERST diesen Weg und nutzt
      "taskkill /F" nur noch als Notbremse, falls der Server gar nicht
      mehr reagiert.
   ===================================================================== */

function handleShutdownRequest(res) {
  console.log("[server] Sauberes Beenden angefordert über POST", SHUTDOWN_PATH);
  sendJson(res, 200, { message: "Server wird beendet" });

  // Kurz warten, BEVOR der Prozess sich beendet, damit die Antwort
  // oben beim Aufrufer (stop-server.bat/curl) sicher noch ankommt.
  setTimeout(function () {
    gracefulShutdown("HTTP " + SHUTDOWN_PATH);
  }, 100);
}

function gracefulShutdown(reason) {
  console.log("[server] Beende Server sauber (" + reason + ") ...");

  try {
    db.close();
    console.log("[db] Datenbank geschlossen");
  } catch (error) {
    console.error("[db] Fehler beim Schließen:", error);
  }

  server.close(function handleServerClosed() {
    console.log("[server] HTTP-Server geschlossen");
    process.exit(0);
  });

  // Sicherheitsnetz: server.close() wartet auf noch offene Verbindungen.
  // Hängt das (sollte praktisch nie passieren), trotzdem spätestens
  // nach 2 Sekunden beenden. ".unref()" heißt: dieser Timer allein
  // soll den Prozess nicht künstlich am Leben halten, falls alles
  // andere längst fertig ist.
  setTimeout(function () { process.exit(0); }, 2000).unref();
}

// SIGINT = Strg+C in einem sichtbaren Konsolenfenster.
// SIGTERM = "bitte freundlich beenden", von anderen Tools/Systemen.
process.on("SIGINT", function () { gracefulShutdown("SIGINT / Strg+C"); });
process.on("SIGTERM", function () { gracefulShutdown("SIGTERM"); });

// ---------------------------------------------------------------------
// "exit" feuert IMMER als allerletztes Ereignis, egal WIE der Prozess
// endet (sauber über gracefulShutdown, oder weil z. B. taskkill /F von
// außen zuschlägt). Nur noch SYNCHRONER Code funktioniert hier.
//
// WICHTIG: Nur die PID-Datei löschen, wenn wirklich UNSERE EIGENE PID
// darin steht. Grund: startet man den Server zweimal (Port schon
// belegt, s. o.), würde der zweite Prozess sonst beim eigenen Beenden
// die PID-Datei des ERSTEN, echten Servers löschen und stop-server.bat
// könnte ihn danach nicht mehr finden.
// ---------------------------------------------------------------------
process.on("exit", function removeOwnPidFile() {
  try {
    if (fs.existsSync(PID_PATH)) {
      const storedPid = fs.readFileSync(PID_PATH, "utf8").trim();
      if (storedPid === String(process.pid)) {
        fs.unlinkSync(PID_PATH);
        console.log("[server] PID-Datei entfernt");
      }
    }
  } catch (error) {
    console.error("[server] PID-Datei konnte nicht entfernt werden:", error);
  }
});
