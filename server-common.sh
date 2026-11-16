# shellcheck shell=bash
# =====================================================================
# server-common.sh – gemeinsame Konstanten und Funktionen
# ---------------------------------------------------------------------
# Diese Datei wird NICHT selbst ausgeführt (darum kein Shebang und kein
# Ausführ-Recht). Die anderen Skripte (start.sh, stop-server.sh,
# autostart-install.sh, autostart-remove.sh) laden sie mit
#
#     source "<ordner>/server-common.sh"
#
# "source" liest eine Datei so ein, als stünde ihr Inhalt direkt im
# aufrufenden Skript: alle Variablen und Funktionen von hier sind danach
# dort verfügbar. (Würde man die Datei stattdessen normal STARTEN, liefe
# sie in einem eigenen Prozess – und alles wäre danach wieder weg.)
#
# So steht jede Einstellung (Port, Pfade, Service-Name) genau EINMAL
# hier und nicht in jedem Skript einzeln.
#
# Die erste Zeile "# shellcheck shell=bash" ist nur ein Hinweis für das
# Prüf-Werkzeug shellcheck: Ohne Shebang wüsste es sonst nicht, dass
# diese Datei Bash-Syntax enthält.
#
# VORAUSSETZUNG: Das ladende Skript setzt VOR dem "source" die Variable
# LOG_PREFIX (z. B. LOG_PREFIX="[start]"). Sie wird jeder Ausgabe
# vorangestellt, damit man sieht, welches Skript gerade spricht.
# =====================================================================


# ---------------------------------------------------------------------
# KONSTANTEN
# ---------------------------------------------------------------------

# SCRIPT_DIR = der Ordner, in dem DIESE Datei liegt (= der Repo-Ordner).
# Von innen nach außen gelesen:
#   "${BASH_SOURCE[0]}"  → Pfad der Datei, in der diese Zeile STEHT.
#   dirname ...          → schneidet den Dateinamen ab, übrig bleibt der Ordner.
#   cd ... && pwd        → wechselt dorthin und gibt den Ordner als
#                          ABSOLUTEN Pfad aus ("&&" = nur wenn cd klappte).
#   $( ... )             → "Kommando-Ersetzung": führt den Befehl aus und
#                          setzt seine Ausgabe an diese Stelle ein. Das cd
#                          passiert dabei in einer Unter-Shell und ändert
#                          den Ordner des eigentlichen Skripts NICHT.
#
# Warum BASH_SOURCE und nicht $0?
#   $0 ist der Name des Skripts, das GESTARTET wurde (z. B. ./start.sh).
#   Bei einer per "source" geladenen Datei bleibt $0 der Name des
#   ladenden Skripts – nicht der dieser Datei. BASH_SOURCE[0] zeigt
#   dagegen immer auf die Datei, in der der Code wirklich steht, und
#   stimmt darum auch beim "source"-Laden.
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Port, auf dem server.js lauscht (dort als PORT festgelegt).
PORT=3000

# Adresse, mit der wir prüfen, ob der Server antwortet.
CHECK_URL="http://127.0.0.1:${PORT}/api/progress"

# Adresse, über die der Server sich selbst sauber beendet (POST-Anfrage).
SHUTDOWN_URL="http://127.0.0.1:${PORT}/api/shutdown"

# Adresse, die im Browser geöffnet wird.
PAGE_URL="http://localhost:${PORT}/"

# Ordner und Dateien für lokale Daten (steht komplett in der .gitignore).
DATA_DIR="$SCRIPT_DIR/data"
PID_PATH="$DATA_DIR/server.pid"   # schreibt server.js selbst: seine Prozess-ID
LOG_PATH="$DATA_DIR/server.log"   # hier landet die Konsolen-Ausgabe des Servers

# Name und Ablageort des systemd-Service für den Autostart.
# "$HOME" ist der eigene Benutzerordner (dasselbe wie "~", funktioniert
# aber auch innerhalb von Anführungszeichen zuverlässig).
SERVICE_NAME="spicker-server.service"
SERVICE_PATH="$HOME/.config/systemd/user/$SERVICE_NAME"

# Mindestversion von Node.js: Ab 22.13 funktioniert das eingebaute Modul
# node:sqlite ohne den Zusatz-Schalter --experimental-sqlite.
NODE_MIN_MAJOR=22
NODE_MIN_MINOR=13


# ---------------------------------------------------------------------
# AUSGABE
# ---------------------------------------------------------------------

# Normale Meldung mit Präfix ausgeben.
#   "$*"    → alle übergebenen Argumente, zu EINEM Text zusammengefügt.
#   printf  → wie echo, aber mit festem Format: jedes %s wird durch das
#             nächste Argument ersetzt, \n ist der Zeilenumbruch.
log_info() {
  printf '%s %s\n' "$LOG_PREFIX" "$*"
}

# Fehlermeldung mit Präfix ausgeben.
#   ">&2" leitet die Ausgabe auf den Fehler-Kanal (stderr, Kanal 2) um.
#   Im Terminal sieht das gleich aus; so lassen sich Fehler aber von
#   normaler Ausgabe trennen (z. B. beim Umleiten in eine Datei).
log_error() {
  printf '%s FEHLER: %s\n' "$LOG_PREFIX" "$*" >&2
}


# ---------------------------------------------------------------------
# PRÜFUNGEN
# ---------------------------------------------------------------------

# Prüft, ob ein Programm installiert ist.
# Aufruf: require_command <programm> <arch-paket>
#   "local"       → die Variable gilt nur INNERHALB dieser Funktion und
#                   überschreibt keine gleichnamige Variable außerhalb.
#   "$1", "$2"    → erstes und zweites Argument der Funktion.
#   command -v X  → gibt den Pfad von X aus, wenn es X gibt; Rückgabewert
#                   0 = gefunden, sonst nicht gefunden.
#   "&> /dev/null" → normale Ausgabe UND Fehlerausgabe wegwerfen
#                   (/dev/null ist der "Mülleimer" des Systems). Kurzform
#                   von "> /dev/null 2>&1". Uns interessiert hier nur der
#                   Rückgabewert, nicht der ausgegebene Pfad.
#   "!"           → kehrt das Ergebnis um: "wenn NICHT gefunden".
#   return 1      → Funktion mit "Fehler" beenden (0 = ok, alles andere
#                   = Fehler). Der Aufrufer entscheidet, wie es weitergeht.
require_command() {
  local command_name="$1"
  local arch_package="$2"

  if ! command -v "$command_name" &> /dev/null; then
    log_error "Das Programm \"$command_name\" fehlt."
    log_error "Installieren mit: sudo pacman -S --needed $arch_package"
    return 1
  fi
}

# Antwortet der Server gerade?
#   curl -s           → "silent": keine Fortschrittsanzeige.
#   -o /dev/null      → den Inhalt der Antwort wegwerfen.
# Uns interessiert nur der Rückgabewert von curl: 0 = Verbindung hat
# geklappt (der Server hat geantwortet, egal mit welchem HTTP-Status),
# jede andere Zahl = keine Verbindung möglich (Server läuft nicht).
# Eine Funktion gibt automatisch den Rückgabewert ihres LETZTEN Befehls
# zurück – darum braucht es hier kein eigenes "return".
is_server_running() {
  curl -s -o /dev/null "$CHECK_URL"
}

# Prüft, ob node vorhanden und neu genug ist (siehe NODE_MIN_...).
check_node_version() {
  # "A || B" → B wird nur ausgeführt, wenn A fehlschlägt.
  require_command node nodejs || return 1

  # "node -p <ausdruck>" wertet einen JavaScript-Ausdruck aus und gibt
  # das Ergebnis aus. process.versions.node ist die Version ohne das
  # "v" davor, z. B. "22.13.1".
  local node_version
  node_version="$(node -p process.versions.node)"

  # Die Version an den Punkten in ihre Teile zerlegen:
  #   IFS='.'   → das Trennzeichen, an dem "read" aufteilt (gilt nur für
  #               diesen einen Befehl, weil es direkt davor steht).
  #   read -r   → liest eine Zeile in die genannten Variablen; -r heißt:
  #               Backslashes nicht besonders behandeln.
  #   "_"       → Sammel-Variable für den Rest (die dritte Zahl), den wir
  #               nicht brauchen.
  #   <<< "..." → "Here-String": gibt den Text als Eingabe an den Befehl.
  local node_major node_minor
  IFS='.' read -r node_major node_minor _ <<< "$node_version"

  # (( ... )) rechnet mit Zahlen und liefert "wahr" oder "falsch".
  # Neu genug heißt: Hauptversion größer – ODER gleich und Nebenversion
  # mindestens so groß wie verlangt. "||" = oder, "&&" = und.
  if (( node_major > NODE_MIN_MAJOR || (node_major == NODE_MIN_MAJOR && node_minor >= NODE_MIN_MINOR) )); then
    log_info "Node.js $node_version gefunden – passt (mindestens $NODE_MIN_MAJOR.$NODE_MIN_MINOR nötig)."
    return 0
  fi

  log_error "Node.js $node_version ist zu alt – nötig ist mindestens $NODE_MIN_MAJOR.$NODE_MIN_MINOR."
  log_error "Aktualisieren mit: sudo pacman -Syu nodejs"
  return 1
}

# Ist der systemd-Service für den Autostart eingerichtet?
#   [[ ... ]]  → Bash-Test (die robustere Variante von [ ... ]).
#   -f <pfad>  → wahr, wenn es dort eine normale Datei gibt.
is_service_installed() {
  [[ -f "$SERVICE_PATH" ]]
}

# Wartet, bis der Server antwortet.
# Aufruf: wait_for_server <max_tries>
# Fragt bis zu <max_tries>-mal nach, mit je 1 Sekunde Pause dazwischen –
# statt stur eine feste Zeit zu warten. So geht es auf einem schnellen
# Rechner zügig und auf einem langsamen trotzdem zuverlässig.
# Rückgabewert: 0 = Server antwortet, 1 = auch nach allen Versuchen nicht.
wait_for_server() {
  local max_tries="$1"
  local try

  # Zähl-Schleife: try läuft von 1 bis max_tries, "try++" erhöht um 1.
  for (( try = 1; try <= max_tries; try++ )); do
    if is_server_running; then
      return 0
    fi
    log_info "Server antwortet noch nicht (Versuch $try von $max_tries) – warte 1 Sekunde ..."
    sleep 1
  done

  # Letzte Prüfung nach der letzten Pause; ihr Rückgabewert ist zugleich
  # der Rückgabewert der Funktion.
  is_server_running
}
