#!/usr/bin/env bash
# =====================================================================
# autostart-install.sh – Server bei jeder Anmeldung automatisch starten
# ---------------------------------------------------------------------
# Richtet einen systemd-"User-Service" ein und startet ihn sofort.
#
# WAS IST SYSTEMD / EINE USER-UNIT?
#   systemd ist unter Arch das Programm, das Dienste (Hintergrund-
#   Programme) startet, überwacht und beendet. Eine "Unit" ist eine
#   kleine Textdatei, die EINEN solchen Dienst beschreibt.
#   Es gibt System-Units (für den ganzen Rechner, brauchen root) und
#   User-Units: Die gehören einem einzelnen Benutzer, liegen in
#   ~/.config/systemd/user/ und werden mit "systemctl --user" bedient –
#   ganz ohne sudo. Genau das nutzen wir hier.
#
# Rückgängig machen: ./autostart-remove.sh
# =====================================================================

# -u und pipefail wie in start.sh erklärt. Bewusst KEIN "-e": Fehler
# werden hier Schritt für Schritt selbst geprüft und mit einer klaren
# Meldung beantwortet, statt dass das Skript kommentarlos abbricht.
set -uo pipefail

# Präfix für alle Ausgaben dieses Skripts.
LOG_PREFIX="[autostart-install]"

# Gemeinsame Konstanten und Funktionen laden (siehe server-common.sh).
# shellcheck source=server-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/server-common.sh" || exit 1


# ---------------------------------------------------------------------
# 1. Voraussetzungen prüfen
# ---------------------------------------------------------------------
log_info "Prüfe, ob systemctl vorhanden ist ..."
require_command systemctl systemd || exit 1

log_info "Prüfe die Node.js-Version ..."
check_node_version || exit 1

# Den ABSOLUTEN Pfad von node ermitteln (z. B. /usr/bin/node).
# systemd verlangt in ExecStart einen vollständigen Pfad und sucht nicht
# selbst im Suchpfad (PATH) wie ein Terminal.
node_path="$(command -v node)"
log_info "Node.js liegt unter: $node_path"


# ---------------------------------------------------------------------
# 2. Laufenden Server stoppen, damit Port 3000 frei ist
# ---------------------------------------------------------------------
# Gibt es eine PID-Datei, läuft vermutlich schon ein Server (von Hand
# gestartet oder von einer älteren Fassung des Service). Der Service
# könnte sonst nicht starten, weil der Port belegt wäre.
# "bash <skript>" startet das Skript in einem eigenen Prozess; danach
# geht es hier ganz normal weiter.
if [[ -f "$PID_PATH" ]]; then
  log_info "Es läuft offenbar schon ein Server – stoppe ihn zuerst (stop-server.sh) ..."
  if ! bash "$SCRIPT_DIR/stop-server.sh"; then
    log_error "Der laufende Server ließ sich nicht stoppen – Abbruch."
    exit 1
  fi
fi


# ---------------------------------------------------------------------
# 3. Unit-Datei schreiben
# ---------------------------------------------------------------------
# dirname schneidet den Dateinamen ab → der Ordner der Unit-Datei.
service_dir="$(dirname "$SERVICE_PATH")"
log_info "Lege die Ordner an (falls sie fehlen): $service_dir und $DATA_DIR"
# Der data-Ordner muss existieren, weil systemd dort die Log-Datei anlegt.
mkdir -p "$service_dir" "$DATA_DIR" || exit 1

# In Unit-Dateien hat "%" eine Sonderbedeutung (z. B. steht %h für den
# Benutzerordner). Ein echtes Prozentzeichen im Pfad muss darum als "%%"
# geschrieben werden.
#   ${variable//suchtext/ersatz}  → ersetzt ALLE Vorkommen von suchtext.
unit_script_dir="${SCRIPT_DIR//%/%%}"
unit_node_path="${node_path//%/%%}"

# Zwei weitere Zeichen hätten in der ExecStart-Zeile eine Sonderbedeutung:
# "$" (Variablen-Ersetzung durch systemd) und "\" (Maskierung). Statt sie
# kompliziert umzuschreiben, brechen wir bei so einem Pfad lieber mit
# einer klaren Meldung ab.
#   *'$'*  → Muster: "enthält irgendwo ein $" (* = beliebig viele Zeichen).
#   Einfache Anführungszeichen verhindern, dass Bash selbst "$" und "\"
#   auswertet.
if [[ "$SCRIPT_DIR$node_path" == *'$'* || "$SCRIPT_DIR$node_path" == *'\'* || "$SCRIPT_DIR$node_path" == *'"'* ]]; then
  log_error "Der Projekt- oder node-Pfad enthält eines der Zeichen \$ \\ \" –"
  log_error "damit kann die Unit-Datei nicht zuverlässig geschrieben werden."
  log_error "Bitte den Projektordner umbenennen oder verschieben."
  exit 1
fi

log_info "Schreibe die Unit-Datei: $SERVICE_PATH"
# HERE-DOC: Alles zwischen "<< UNIT_FILE" und der Zeile, in der NUR
# "UNIT_FILE" steht, wird dem Befehl als Eingabe übergeben – hier an
# cat, das den Text unverändert ausgibt; ">" schreibt ihn in die Datei.
# Weil das Schlusswort NICHT in Anführungszeichen steht, werden
# Variablen wie $unit_script_dir im Text durch ihren Wert ersetzt.
#
# Die Zeilen der Unit im Einzelnen:
#
#   [Unit]     Allgemeine Angaben.
#     Description     → frei wählbarer Name, erscheint in "systemctl status".
#
#   [Service]  Wie der Dienst läuft.
#     Type=simple     → das gestartete Programm IST der Dienst (es
#                       verzweigt sich nicht selbst in den Hintergrund).
#     WorkingDirectory → Ordner, in dem der Server gestartet wird.
#     ExecStart       → der Startbefehl. Die Anführungszeichen halten
#                       Pfade mit Leerzeichen zusammen.
#     Restart=on-failure → stürzt der Server ab, startet systemd ihn neu.
#                       NICHT nach einem sauberen Ende (z. B. durch
#                       stop-server.sh) – dann bleibt er aus.
#     RestartSec=5    → vor dem Neustart 5 Sekunden warten.
#     StandardOutput=truncate:<datei> → die normale Ausgabe in diese
#                       Datei schreiben. "truncate:" leert die Datei bei
#                       jedem Start – das Log beginnt also jedes Mal neu,
#                       genau wie das ">" beim Start von Hand in start.sh.
#                       ("append:" würde stattdessen anhängen.)
#     StandardError=inherit → die Fehlerausgabe "erbt" das Ziel der
#                       normalen Ausgabe, landet also in derselben Datei
#                       (Gegenstück zu "2>&1").
#
#   [Install]  Wann der Dienst automatisch startet (wirkt bei "enable").
#     WantedBy=default.target → default.target ist der Zustand "die
#                       Benutzer-Sitzung ist fertig hochgefahren". Der
#                       Dienst startet also bei jeder Anmeldung.
cat > "$SERVICE_PATH" << UNIT_FILE
[Unit]
Description=Spicker lokaler Server (Liste-main)

[Service]
Type=simple
WorkingDirectory=$unit_script_dir
ExecStart="$unit_node_path" "$unit_script_dir/server.js"
Restart=on-failure
RestartSec=5
StandardOutput=truncate:$unit_script_dir/data/server.log
StandardError=inherit

[Install]
WantedBy=default.target
UNIT_FILE

# "$?" ist der Rückgabewert des zuletzt ausgeführten Befehls (hier: cat).
# -ne = "not equal", ungleich. 0 bedeutet Erfolg.
if [[ $? -ne 0 ]]; then
  log_error "Die Unit-Datei konnte nicht geschrieben werden."
  exit 1
fi


# ---------------------------------------------------------------------
# 4. Service aktivieren und starten
# ---------------------------------------------------------------------
# daemon-reload: systemd liest seine Unit-Dateien neu ein. Nötig nach
# jeder Änderung, sonst kennt es die neue Datei noch nicht.
log_info "Lasse systemd die Unit-Dateien neu einlesen: systemctl --user daemon-reload"
if ! systemctl --user daemon-reload; then
  log_error "daemon-reload ist fehlgeschlagen."
  exit 1
fi

# enable = bei jeder Anmeldung automatisch starten (legt dafür einen
#          Verweis unter default.target.wants/ an).
# --now  = zusätzlich SOFORT starten, ohne dass man sich neu anmelden muss.
log_info "Aktiviere und starte den Service: systemctl --user enable --now $SERVICE_NAME"
if ! systemctl --user enable --now "$SERVICE_NAME"; then
  log_error "Der Service ließ sich nicht aktivieren oder starten."
  log_error "Details: systemctl --user status $SERVICE_NAME --no-pager"
  exit 1
fi

log_info "Warte, bis der Server antwortet (maximal 5 Sekunden) ..."
if command -v curl &> /dev/null; then
  if wait_for_server 5; then
    log_info "Server läuft und antwortet."
  else
    log_error "Der Server antwortet noch nicht – siehe Status unten und Log: $LOG_PATH"
  fi
else
  log_info "curl fehlt (sudo pacman -S --needed curl) – Prüfung übersprungen."
fi

# status zeigt den Zustand des Service und die letzten Meldungen.
# --no-pager gibt alles direkt aus, statt es in einem Blätter-Programm
# (less) zu öffnen, das man erst mit "q" verlassen müsste.
log_info "Aktueller Zustand des Service:"
systemctl --user status "$SERVICE_NAME" --no-pager

log_info "Fertig!"
log_info "  - Der Server startet ab jetzt bei JEDER Anmeldung automatisch im Hintergrund."
log_info "  - Testen: http://127.0.0.1:$PORT/ im Browser öffnen."
log_info "  - Log-Datei: data/server.log"
log_info "  - Wieder entfernen: ./autostart-remove.sh"
