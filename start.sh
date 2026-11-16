#!/usr/bin/env bash
# =====================================================================
# start.sh – Server starten (falls nötig) und den Spicker im Browser öffnen
# ---------------------------------------------------------------------
# Ablauf:
#   1. Antwortet unter http://127.0.0.1:3000 schon ein Server (z. B. weil
#      der Autostart ihn beim Einloggen gestartet hat)? → nur Browser öffnen.
#   2. Sonst den Server starten:
#        - über systemd, wenn der Autostart eingerichtet ist
#          (siehe autostart-install.sh),
#        - sonst direkt als Hintergrund-Prozess.
#   3. Bis zu 5 Sekunden warten, bis er antwortet, dann den Browser öffnen.
#
# Die erste Zeile ("Shebang") sagt dem System, womit die Datei ausgeführt
# wird. "/usr/bin/env bash" sucht bash über den Suchpfad (PATH), statt
# einen festen Ort wie /bin/bash vorauszusetzen.
# =====================================================================

# Sicherheits-Einstellungen für das ganze Skript:
#   -u           → eine NICHT gesetzte Variable zu benutzen ist ein Fehler
#                  (statt still einen leeren Text einzusetzen). So fallen
#                  Tippfehler in Variablennamen sofort auf.
#   -o pipefail  → eine Befehlskette "a | b" gilt als fehlgeschlagen, wenn
#                  IRGENDEIN Teil fehlschlägt (sonst zählt nur der letzte).
# Bewusst KEIN "-e" (= bei jedem Fehler sofort abbrechen): Wir werten
# fehlschlagende Befehle absichtlich selbst aus – z. B. bedeutet ein
# fehlgeschlagenes curl hier einfach "Server läuft nicht" und ist kein
# Grund, das Skript abzubrechen.
set -uo pipefail

# Präfix für alle Ausgaben dieses Skripts (benutzt von log_info/log_error).
LOG_PREFIX="[start]"

# Gemeinsame Konstanten und Funktionen laden (Erklärung zu "source" und
# BASH_SOURCE steht in server-common.sh). "|| exit 1" = klappt das Laden
# nicht, sofort mit Fehler beenden – ohne die Funktionen geht nichts.
# Die shellcheck-Zeile sagt dem Prüf-Werkzeug nur, welche Datei gemeint ist.
# shellcheck source=server-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/server-common.sh" || exit 1


# ---------------------------------------------------------------------
# Öffnet die Übersicht im Standard-Browser.
# ---------------------------------------------------------------------
open_browser() {
  if ! command -v xdg-open &> /dev/null; then
    log_info "xdg-open fehlt (Paket: sudo pacman -S --needed xdg-utils)."
    log_info "Bitte die Seite von Hand öffnen: $PAGE_URL"
    return 0
  fi

  log_info "Öffne $PAGE_URL im Browser ..."
  # xdg-open öffnet eine Adresse mit dem eingestellten Standard-Programm.
  #   ">/dev/null 2>&1" → Ausgabe und Fehlerausgabe wegwerfen (manche
  #                       Browser schreiben viel Unwichtiges ins Terminal).
  #   "&"               → im Hintergrund starten, das Skript wartet nicht.
  xdg-open "$PAGE_URL" >/dev/null 2>&1 &
}

# ---------------------------------------------------------------------
# Startet server.js direkt als Hintergrund-Prozess (ohne systemd).
# Rückgabewert: 0 = Start wurde angestoßen, 1 = Voraussetzung fehlt.
# ---------------------------------------------------------------------
start_server_directly() {
  log_info "Kein systemd-Service eingerichtet – starte den Server direkt."

  log_info "Prüfe die Node.js-Version ..."
  check_node_version || return 1

  # mkdir -p legt den Ordner an und meldet KEINEN Fehler, wenn es ihn
  # schon gibt (und würde auch fehlende Ober-Ordner gleich mit anlegen).
  log_info "Lege den Daten-Ordner an (falls er fehlt): $DATA_DIR"
  mkdir -p "$DATA_DIR" || return 1

  log_info "Starte server.js im Hintergrund (Log: $LOG_PATH) ..."
  # Der Server soll weiterlaufen, auch wenn dieses Terminal geschlossen
  # wird. Normalerweise würde er dabei mit beendet: Das Terminal schickt
  # beim Schließen allen seinen Prozessen das Signal SIGHUP ("hang up"),
  # und ein Programm, das noch am Terminal hängt, kann daran scheitern,
  # dass es dort nichts mehr lesen oder schreiben kann. Jedes Stück der
  # folgenden Zeile löst einen Teil davon:
  #
  #   setsid        → startet den Befehl in einer NEUEN "Sitzung". Damit
  #                   gehört er nicht mehr zum Terminal und bekommt
  #                   dessen SIGHUP gar nicht erst zugeschickt.
  #   nohup         → "no hang up": lässt den Befehl SIGHUP zusätzlich
  #                   ignorieren (doppelte Absicherung).
  #   node "...server.js" → der eigentliche Server.
  #   > "$LOG_PATH" → normale Ausgabe (stdout, Kanal 1) in die Log-Datei
  #                   schreiben. Ein einzelnes ">" ÜBERSCHREIBT die Datei,
  #                   das Log beginnt also bei jedem Start neu
  #                   (">>" würde stattdessen anhängen).
  #   2>&1          → Fehlerausgabe (stderr, Kanal 2) dorthin leiten, wo
  #                   Kanal 1 gerade hinzeigt – also in dieselbe Datei.
  #                   Muss NACH dem ">" stehen, sonst zeigt Kanal 1 noch
  #                   aufs Terminal.
  #   < /dev/null   → die Eingabe (stdin) kommt aus dem "Nichts" statt
  #                   vom Terminal. So hängt der Server an keiner Stelle
  #                   mehr am Terminal.
  #   &             → im Hintergrund starten: Das Skript wartet nicht,
  #                   bis der Server endet, sondern läuft sofort weiter.
  setsid nohup node "$SCRIPT_DIR/server.js" > "$LOG_PATH" 2>&1 < /dev/null &
}

# ---------------------------------------------------------------------
# Startet den Server über den systemd-Service.
# ---------------------------------------------------------------------
start_server_via_systemd() {
  log_info "systemd-Service ist eingerichtet: $SERVICE_PATH"
  require_command systemctl systemd || return 1

  log_info "Starte den Service: systemctl --user start $SERVICE_NAME"
  # "--user" = die Dienste des eigenen Benutzers (kein sudo nötig),
  # nicht die des ganzen Systems.
  if ! systemctl --user start "$SERVICE_NAME"; then
    log_error "Der Service ließ sich nicht starten."
    log_error "Details: systemctl --user status $SERVICE_NAME --no-pager"
    return 1
  fi
}


# ---------------------------------------------------------------------
# ABLAUF
# ---------------------------------------------------------------------

# Ohne curl können wir nicht prüfen, ob der Server läuft.
require_command curl curl || exit 1

log_info "Prüfe, ob der Server unter http://127.0.0.1:$PORT antwortet ..."
if is_server_running; then
  log_info "Server läuft bereits."
  open_browser
  # exit 0 = Skript erfolgreich beenden.
  exit 0
fi

log_info "Server ist nicht erreichbar – er wird jetzt gestartet."
if is_service_installed; then
  start_server_via_systemd || exit 1
else
  start_server_directly || exit 1
fi

log_info "Warte, bis der Server bereit ist (maximal 5 Sekunden) ..."
if wait_for_server 5; then
  log_info "Server läuft und antwortet."
else
  log_error "Der Server antwortet nach 5 Sekunden immer noch nicht."
  log_error "Im Log nachsehen: $LOG_PATH"
  log_info "Die Seite wird trotzdem geöffnet (im Browser ggf. einfach neu laden)."
fi

open_browser
