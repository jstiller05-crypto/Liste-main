@echo off
REM =====================================================================
REM start.bat
REM -----------------------------------------------------------------
REM Oeffnet den Spicker im Browser. Kuemmert sich dabei selbst darum,
REM dass der Server laeuft:
REM   1. Erst pruefen, ob unter http://127.0.0.1:3000 schon ein Server
REM      antwortet (z. B. weil der Autostart ihn beim Anmelden schon
REM      unsichtbar gestartet hat, oder weil er noch von vorhin laeuft).
REM   2. Falls JA: nur den Browser oeffnen, fertig.
REM   3. Falls NEIN: den Server unsichtbar starten (start-hidden.vbs,
REM      kein schwarzes Konsolenfenster), kurz warten, bis er bereit
REM      ist (mit ein paar Wiederholungen, maximal ~5 Sekunden), und
REM      DANACH den Browser oeffnen.
REM
REM %~dp0 = Laufwerk + Ordner DIESER .bat-Datei (mit \ am Ende). Damit
REM funktioniert das Skript unabhaengig davon, von wo aus man es
REM startet.
REM =====================================================================
cd /d "%~dp0"

set "CHECK_URL=http://127.0.0.1:3000/api/progress"
set "PAGE_URL=http://localhost:3000/Spicker.html"

REM curl mit "-s" (still, keine Fortschrittsanzeige) und "-o nul"
REM (Antwort-Inhalt verwerfen - uns interessiert nur, OB curl sich
REM verbinden konnte). "%%errorlevel%%" wuerde man in einer runden
REM Klammer brauchen; hier reicht "%errorlevel%": 0 = curl kam durch
REM (der Server hat geantwortet, egal mit welchem HTTP-Status), jede
REM andere Zahl = keine Verbindung moeglich (Server laeuft nicht).
curl -s -o nul "%CHECK_URL%"
if %errorlevel%==0 (
    echo Server laeuft bereits.
    goto open_browser
)

echo Server nicht erreichbar, starte ihn jetzt unsichtbar ...
wscript.exe "%~dp0start-hidden.vbs"

REM Bis zu 5-mal (mit je ~1 Sekunde Pause) nachfragen, ob der Server
REM inzwischen bereit ist, statt fest eine feste Zeit zu warten - so
REM geht es auf einem schnellen Rechner zuegiger und auf einem
REM langsamen trotzdem zuverlaessig.
set "TRIES=0"

:wait_loop
curl -s -o nul "%CHECK_URL%"
if %errorlevel%==0 goto open_browser

set /a TRIES+=1
if %TRIES% GEQ 5 (
    echo Server antwortet nach 5 Sekunden immer noch nicht - oeffne die
    echo Seite trotzdem ^(im Browser ggf. einfach neu laden^).
    goto open_browser
)

REM "ping -n 2 127.0.0.1" ist ein bekannter Batch-Trick fuer eine kurze
REM Pause von ca. 1 Sekunde (der ERSTE Ping geht sofort, nur der ZWEITE
REM wartet die volle Sekunde). Der eigentlich naheliegendere Befehl
REM "timeout /t 1" verweigert seinen Dienst, sobald die Eingabe
REM umgeleitet ist (z. B. bei automatisiertem statt manuellem Start) -
REM ping funktioniert dagegen immer zuverlaessig.
ping -n 2 127.0.0.1 >nul
goto wait_loop

:open_browser
start "" "%PAGE_URL%"
