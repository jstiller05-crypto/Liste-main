#!/usr/bin/env bash
# =====================================================================
# autostart-remove.sh – macht autostart-install.sh rückgängig
# ---------------------------------------------------------------------
#   1. Deaktiviert und stoppt den systemd-Service.
#   2. Entfernt die Unit-Datei.
#   3. Stoppt einen eventuell von Hand gestarteten Server.
# =====================================================================

# -u und pipefail wie in start.sh erklärt. Bewusst KEIN "-e": Dass der
# Service gar nicht eingerichtet ist, ist hier kein Grund zum Abbruch –
# solche Fälle werden einzeln geprüft.
set -uo pipefail

# Präfix für alle Ausgaben dieses Skripts.
LOG_PREFIX="[autostart-remove]"

# Gemeinsame Konstanten und Funktionen laden (siehe server-common.sh).
# shellcheck source=server-common.sh
source "$(dirname "${BASH_SOURCE[0]}")/server-common.sh" || exit 1


# ---------------------------------------------------------------------
# 1. + 2. Service deaktivieren, stoppen und Unit-Datei entfernen
# ---------------------------------------------------------------------
if ! is_service_installed; then
  log_info "Keine Unit-Datei gefunden ($SERVICE_PATH) – der Autostart war wohl schon entfernt."
elif ! require_command systemctl systemd; then
  # "elif" = "sonst, wenn": wird nur geprüft, wenn die Bedingung davor
  # nicht zutraf. Ohne systemctl lässt sich der Service nicht abmelden.
  log_error "Die Unit-Datei bleibt liegen: $SERVICE_PATH"
  exit 1
else
  # disable = nicht mehr bei der Anmeldung starten (entfernt den Verweis
  #           unter default.target.wants/).
  # --now   = zusätzlich SOFORT stoppen. systemd schickt dabei SIGTERM,
  #           worauf server.js sich sauber beendet.
  log_info "Deaktiviere und stoppe den Service: systemctl --user disable --now $SERVICE_NAME"
  if ! systemctl --user disable --now "$SERVICE_NAME"; then
    # Kein Abbruch: Die Datei soll trotzdem entfernt werden.
    log_error "disable ist fehlgeschlagen – mache trotzdem mit dem Aufräumen weiter."
  fi

  log_info "Entferne die Unit-Datei: $SERVICE_PATH"
  # rm -f = löschen ohne Rückfrage und ohne Fehler, falls nichts da ist.
  rm -f "$SERVICE_PATH"

  # systemd liest seine Unit-Dateien neu ein und vergisst damit den
  # eben gelöschten Service.
  log_info "Lasse systemd die Unit-Dateien neu einlesen: systemctl --user daemon-reload"
  if ! systemctl --user daemon-reload; then
    log_error "daemon-reload ist fehlgeschlagen."
  fi
fi


# ---------------------------------------------------------------------
# 3. Von Hand gestarteten Server stoppen
# ---------------------------------------------------------------------
# Der Service ist jetzt aus. Es könnte aber zusätzlich ein Server laufen,
# der über start.sh direkt gestartet wurde – den beendet stop-server.sh.
log_info "Stoppe den Server, falls noch einer läuft (stop-server.sh) ..."
if ! bash "$SCRIPT_DIR/stop-server.sh"; then
  log_error "stop-server.sh hat einen Fehler gemeldet – siehe Ausgabe oben."
  exit 1
fi

log_info "Fertig. Der Server startet nicht mehr automatisch bei der Anmeldung."
log_info "Von Hand starten geht weiterhin jederzeit über ./start.sh"
