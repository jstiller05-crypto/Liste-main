@echo off
REM =====================================================================
REM stop-server.bat
REM -----------------------------------------------------------------
REM Stoppt den Spicker-Server sauber, auch wenn er unsichtbar im
REM Hintergrund laeuft (kein Fenster zum Schliessen vorhanden).
REM
REM Ablauf:
REM   1. data\server.pid lesen (server.js schreibt dort beim Start
REM      seine eigene Prozess-ID hinein - die "PID", eine Zahl, mit der
REM      Windows JEDEN laufenden Prozess eindeutig identifiziert).
REM   2. Pruefen, ob ueberhaupt noch ein Prozess mit dieser PID laeuft.
REM   3. ZUERST hoeflich fragen: ein POST-Aufruf an die eigene Server-
REM      Route /api/shutdown. Das laesst server.js sauber aufraeumen
REM      (Datenbank schliessen, PID-Datei loeschen), BEVOR der Prozess
REM      sich beendet.
REM   4. Klappt das nicht (Server antwortet nicht mehr) als Notbremse:
REM      "taskkill /F /PID" - das beendet den Prozess sofort und ohne
REM      Rueckfrage. Warum nicht gleich /F benutzen? Ohne /F bekommt
REM      der Prozess die Chance, selbst aufzuraeumen; das haben wir
REM      hier aber schon ueber Schritt 3 (den saubereren Weg) versucht -
REM      /F ist wirklich nur die letzte Rettung.
REM
REM %~1 = das ERSTE Argument, mit dem diese Datei aufgerufen wurde.
REM       autostart-remove.bat ruft uns mit einem Argument auf (z. B.
REM       "silent"), um die Nachfrage am Ende ("Taste druecken")
REM       zu ueberspringen. Wird die Datei per Doppelklick gestartet,
REM       ist %~1 leer, und die Nachfrage bleibt - sonst wuerde sich
REM       das Fenster sofort wieder schliessen, bevor man das Ergebnis
REM       lesen kann.
REM =====================================================================
cd /d "%~dp0"

echo.
echo === Spicker-Server stoppen ===
echo.

set "PID_PATH=%~dp0data\server.pid"

if not exist "%PID_PATH%" (
    echo Keine PID-Datei gefunden ^(%PID_PATH%^).
    echo Der Server laeuft vermutlich gar nicht - nichts zu tun.
    goto end
)

REM /p liest die ERSTE Zeile der Datei in die Variable SERVER_PID ein.
set /p SERVER_PID=<"%PID_PATH%"

if "%SERVER_PID%"=="" (
    echo PID-Datei ist leer - kann keinen Prozess bestimmen.
    goto end
)

echo Gefundene PID: %SERVER_PID%

REM tasklist mit einem Filter prueft, OHNE etwas zu beenden, ob diese
REM PID gerade zu einem laufenden node.exe gehoert. /NH = keine
REM Kopfzeile in der Ausgabe (leichter zu pruefen).
tasklist /FI "PID eq %SERVER_PID%" /FI "IMAGENAME eq node.exe" /NH 2>nul | findstr /I "node.exe" >nul
if errorlevel 1 (
    echo Prozess %SERVER_PID% laeuft nicht mehr ^(vermutlich schon beendet^).
    echo Entferne veraltete PID-Datei ...
    del /f /q "%PID_PATH%" >nul 2>&1
    goto end
)

echo.
echo Versuche sauberes Beenden ueber die Server-eigene Route /api/shutdown ...
curl -s -o nul -X POST http://127.0.0.1:3000/api/shutdown

REM Kurz warten, damit server.js Zeit hat, Datenbank zu schliessen und
REM sich selbst zu beenden, bevor wir nachschauen, ob es geklappt hat.
REM "ping -n 3 127.0.0.1" ist ein bekannter Batch-Trick fuer eine kurze
REM Pause (2 Sekunden, da der ERSTE Ping sofort geht): der eingebaute
REM Befehl "timeout" waere hier eigentlich naheliegender, verweigert
REM aber seinen Dienst mit einem Fehler, sobald die Eingabe umgeleitet
REM ist (z. B. wenn dieses Skript automatisiert statt per Doppelklick
REM gestartet wird) - ping funktioniert dagegen immer zuverlaessig.
ping -n 3 127.0.0.1 >nul

tasklist /FI "PID eq %SERVER_PID%" /FI "IMAGENAME eq node.exe" /NH 2>nul | findstr /I "node.exe" >nul
if errorlevel 1 (
    echo.
    echo Server sauber beendet.
    goto end
)

echo.
echo Server antwortet nicht auf /api/shutdown - erzwinge Beenden ^(taskkill /F^) ...
taskkill /F /PID %SERVER_PID% >nul 2>&1
if errorlevel 1 (
    echo FEHLER: Prozess %SERVER_PID% konnte nicht beendet werden.
    goto end
)

REM Beim erzwungenen Beenden ^(/F^) bekommt server.js KEINE Chance mehr,
REM seine eigene PID-Datei zu loeschen ^(das passiert normalerweise beim
REM sauberen Beenden im "exit"-Ereignis, s. server.js^) - deshalb hier
REM von Hand aufraeumen.
del /f /q "%PID_PATH%" >nul 2>&1
echo Server wurde erzwungen beendet ^(PID-Datei entfernt^).

:end
echo.
if "%~1"=="" pause
