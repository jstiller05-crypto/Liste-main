#!/usr/bin/env bash
# =====================================================================
# stop-server.sh – den laufenden Spicker-Server beenden
# ---------------------------------------------------------------------
# Zwei Fälle:
#   A) Der Server läuft als systemd-Service (Autostart eingerichtet):
#      "systemctl --user stop" erledigt alles.
#   B) Der Server wurde von Hand gestartet (start.sh ohne Autostart):
#      Er wird über seine Prozess-ID aus data/server.pid beendet – in
#      drei Stufen, von freundlich bis Notbremse:
#        1. HTTP-Anfrage POST /api/shutdown (der Server beendet sich selbst)
#        2. kill -TERM  (Signal "bitte beenden")
#        3. kill -KILL  (hartes Abwürgen, nur wenn nichts anderes hilft)
# =====================================================================

# -u und pipefail wie in start.sh erklärt. Bewusst KEIN "-e": Viele
# Befehle hier dürfen fehlschlagen und werden gezielt ausgewertet (curl
# erreicht den Server nicht, kill -0 findet keinen Prozess, ...).
set -uo pipefail

# Präfix für alle Ausgaben dieses Skripts.
LOG_PREFIX="[stop]"

# Gemeinsame Konstanten und Funktionen laden (siehe server-common.sh).
# shellcheck source=server-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/server-common.sh" || exit 1

# So viele Sekunden bekommt der Server je Stufe Zeit, sich zu beenden.
STOP_WAIT_SECONDS=3


# ---------------------------------------------------------------------
# Läuft unter dieser PID wirklich UNSER Server?
# Aufruf: is_server_process <pid>
#
#   kill -0 <pid>  → schickt KEIN Signal, sondern prüft nur, ob es den
#                    Prozess gibt (Rückgabewert 0 = ja). "2>/dev/null"
#                    wirft die Fehlermeldung weg, falls es ihn nicht gibt.
#
# Das allein reicht nicht: Linux vergibt PIDs neu. Stürzt der Server ab
# und die PID-Datei bleibt liegen, kann später ein völlig fremdes
# Programm dieselbe Nummer bekommen – das dürfen wir nicht beenden.
# Darum zusätzlich: /proc/<pid>/cmdline enthält die Befehlszeile, mit
# der der Prozess gestartet wurde. Nur wenn darin "server.js" vorkommt,
# ist es unser Server.
#
#   /proc           → kein echter Ordner auf der Platte, sondern ein
#                     Fenster in den Kernel: pro Prozess ein Unterordner.
#   tr '\0' ' '     → in cmdline sind die Argumente durch NUL-Zeichen
#                     getrennt; tr ersetzt sie durch Leerzeichen, damit
#                     grep normalen Text bekommt.
#   "|" (Pipe)      → die Ausgabe des linken Befehls wird zur Eingabe
#                     des rechten.
#   grep -q         → "quiet": nichts ausgeben, nur per Rückgabewert
#                     melden, ob der Text gefunden wurde.
# ---------------------------------------------------------------------
is_server_process() {
  local pid="$1"

  kill -0 "$pid" 2>/dev/null || return 1
  tr '\0' ' ' < "/proc/$pid/cmdline" 2>/dev/null | grep -q "server.js"
}

# ---------------------------------------------------------------------
# Wartet, bis der Prozess verschwunden ist.
# Aufruf: wait_for_exit <pid>
# Rückgabewert: 0 = Prozess ist weg, 1 = läuft nach der Wartezeit noch.
# ---------------------------------------------------------------------
wait_for_exit() {
  local pid="$1"
  local second

  for (( second = 1; second <= STOP_WAIT_SECONDS; second++ )); do
    if ! kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
    log_info "Prozess $pid läuft noch – warte 1 Sekunde ($second von $STOP_WAIT_SECONDS) ..."
    sleep 1
  done

  # Letzte Prüfung; "!" kehrt um: Prozess weg → Rückgabewert 0.
  ! kill -0 "$pid" 2>/dev/null
}

# ---------------------------------------------------------------------
# Entfernt die PID-Datei, falls sie noch da ist.
# server.js löscht sie beim sauberen Beenden selbst – das hier ist nur
# das Aufräumen für die Fälle, in denen er das nicht konnte.
#   rm -f  → löschen, ohne Rückfrage und ohne Fehler, falls nichts da ist.
# ---------------------------------------------------------------------
remove_pid_file() {
  if [[ -f "$PID_PATH" ]]; then
    log_info "Entferne die übrig gebliebene PID-Datei: $PID_PATH"
    rm -f "$PID_PATH"
  fi
}


# ---------------------------------------------------------------------
# FALL A: Server läuft als systemd-Service
# ---------------------------------------------------------------------
# "is-active --quiet" gibt nichts aus und meldet nur per Rückgabewert,
# ob der Service gerade läuft. Die Prüfung mit "command -v" davor sorgt
# dafür, dass das Skript auch ohne systemctl funktioniert ("&&" = der
# zweite Befehl läuft nur, wenn der erste geklappt hat).
log_info "Prüfe, ob der Server als systemd-Service läuft ..."
if command -v systemctl &> /dev/null && systemctl --user is-active --quiet "$SERVICE_NAME"; then
  log_info "Service ist aktiv – stoppe ihn: systemctl --user stop $SERVICE_NAME"
  # systemd schickt dem Server dabei das Signal SIGTERM ("bitte beenden").
  # server.js fängt SIGTERM ab und beendet sich darauf schon sauber
  # (Datenbank schließen, PID-Datei löschen) – mehr ist hier nicht nötig.
  if systemctl --user stop "$SERVICE_NAME"; then
    log_info "Server gestoppt."
    exit 0
  fi
  log_error "Der Service ließ sich nicht stoppen."
  log_error "Details: systemctl --user status $SERVICE_NAME --no-pager"
  exit 1
fi
log_info "Kein aktiver systemd-Service – suche einen von Hand gestarteten Server."


# ---------------------------------------------------------------------
# FALL B: Server von Hand gestartet → über die PID-Datei beenden
# ---------------------------------------------------------------------
if [[ ! -f "$PID_PATH" ]]; then
  log_info "Keine PID-Datei gefunden ($PID_PATH) – der Server läuft wohl nicht."
  exit 0
fi

# Inhalt der Datei lesen. tr -d '[:space:]' entfernt dabei alle
# Leerzeichen und Zeilenumbrüche; "<" gibt die Datei als Eingabe an tr.
server_pid="$(tr -d '[:space:]' < "$PID_PATH")"

# -z = wahr, wenn der Text leer ist.
if [[ -z "$server_pid" ]]; then
  log_info "Die PID-Datei ist leer – der Server läuft wohl nicht."
  remove_pid_file
  exit 0
fi

# "=~" vergleicht mit einem Muster (regulärer Ausdruck):
# ^ = Anfang, [0-9]+ = eine oder mehr Ziffern, $ = Ende → "nur Ziffern".
if [[ ! "$server_pid" =~ ^[0-9]+$ ]]; then
  log_error "In der PID-Datei steht keine Zahl: \"$server_pid\""
  remove_pid_file
  exit 1
fi

log_info "PID-Datei gefunden – Prozess-ID des Servers: $server_pid"
if ! is_server_process "$server_pid"; then
  log_info "Unter PID $server_pid läuft kein Spicker-Server (mehr) – die PID-Datei ist veraltet."
  remove_pid_file
  exit 0
fi

# --- Schritt 1: freundlich über die eigene HTTP-Route des Servers -----
if command -v curl &> /dev/null; then
  log_info "Schritt 1: Bitte den Server per HTTP, sich zu beenden (POST $SHUTDOWN_URL) ..."
  # -X POST legt die HTTP-Methode fest (ohne Angabe wäre es GET, und der
  # Server reagiert auf dieser Adresse nur auf POST).
  curl -s -o /dev/null -X POST "$SHUTDOWN_URL"
  if wait_for_exit "$server_pid"; then
    log_info "Server hat sich sauber beendet."
    remove_pid_file
    exit 0
  fi
  log_info "Der Server hat auf die HTTP-Anfrage nicht reagiert."
else
  log_info "Schritt 1 übersprungen: curl fehlt (sudo pacman -S --needed curl)."
fi

# --- Schritt 2: Signal SIGTERM ---------------------------------------
# kill schickt einem Prozess ein Signal. -TERM ("terminate") ist die
# höfliche Aufforderung zum Beenden; server.js fängt sie ab und räumt
# vorher noch auf.
log_info "Schritt 2: Schicke SIGTERM an Prozess $server_pid (kill -TERM) ..."
kill -TERM "$server_pid" 2>/dev/null
if wait_for_exit "$server_pid"; then
  log_info "Server hat sich nach SIGTERM beendet."
  remove_pid_file
  exit 0
fi

# --- Schritt 3: Notbremse SIGKILL ------------------------------------
# -KILL kann ein Prozess weder abfangen noch ignorieren: Der Kernel
# beendet ihn sofort. server.js bekommt dadurch KEINE Gelegenheit mehr
# aufzuräumen – darum löschen wir die PID-Datei hier selbst.
log_error "Der Server reagiert nicht – Notbremse."
log_info "Schritt 3: Beende Prozess $server_pid hart (kill -KILL) ..."
kill -KILL "$server_pid" 2>/dev/null
if wait_for_exit "$server_pid"; then
  log_info "Server wurde hart beendet."
  remove_pid_file
  exit 0
fi

log_error "Prozess $server_pid ließ sich nicht beenden."
exit 1
