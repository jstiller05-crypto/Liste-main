@echo off
REM =====================================================================
REM autostart-install.bat
REM -----------------------------------------------------------------
REM Richtet den automatischen Start des Spicker-Servers ein:
REM   1. Legt eine Verknuepfung (.lnk-Datei) auf start-hidden.vbs im
REM      persoenlichen AUTOSTART-ORDNER von Windows an.
REM   2. Startet den Server danach direkt einmal, damit man nicht extra
REM      ab- und wieder anmelden muss, um ihn auszuprobieren.
REM
REM WAS IST DER AUTOSTART-ORDNER?
REM   %APPDATA% ist eine von Windows gesetzte Umgebungsvariable und
REM   zeigt auf   C:\Users\<Benutzername>\AppData\Roaming
REM   Der Unterordner "...\Start Menu\Programs\Startup" darin ist der
REM   persoenliche Autostart-Ordner: ALLES, was DORT als Verknuepfung
REM   oder Programm liegt, fuehrt Windows automatisch bei der naechsten
REM   Anmeldung DIESES Benutzers aus - ganz ohne Registry-Eintrag.
REM
REM %~dp0 = Laufwerk + Ordner DIESER .bat-Datei (mit \ am Ende). Damit
REM funktioniert das Skript unabhaengig davon, von wo aus man es
REM startet (Doppelklick, anderer Ordner, ...).
REM =====================================================================
cd /d "%~dp0"

echo.
echo === Spicker-Server: Autostart einrichten ===
echo.

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_DIR%\Spicker-Server.lnk"
set "VBS_PATH=%~dp0start-hidden.vbs"
set "WORK_DIR=%~dp0"

if not exist "%VBS_PATH%" (
    echo FEHLER: %VBS_PATH% wurde nicht gefunden.
    echo Bitte sicherstellen, dass start-hidden.vbs im selben Ordner liegt.
    pause
    exit /b 1
)

echo Lege Verknuepfung an:
echo   %SHORTCUT_PATH%
echo   -^> startet: wscript.exe "%VBS_PATH%"
echo.

REM Die Verknuepfung wird per PowerShell erstellt, ueber dasselbe
REM COM-Objekt (WScript.Shell), das Windows auch selbst benutzt, wenn
REM man im Explorer "Verknuepfung erstellen" waehlt - hier nur als
REM automatisierter Ein-Zeiler statt per Maus-Klicks.
REM
REM Die Pfade werden NICHT direkt als Text in den PowerShell-Befehl
REM eingebaut, sondern ueber Umgebungsvariablen ($env:...) gelesen. So
REM muessen sie nicht mit Anfuehrungszeichen in den Befehlstext
REM eingebettet werden - das waere sonst sehr fehleranfaellig, weil
REM cmd.exe UND PowerShell Anfuehrungszeichen beide besonders behandeln
REM und sich dabei leicht gegenseitig in die Quere kommen.
REM
REM [char]34 erzeugt zur LAUFZEIT ein einzelnes "-Zeichen (34 ist der
REM Zeichen-Code von "). Dadurch kommt im gesamten Befehlstext, den
REM cmd.exe hier lesen muss, kein einziges echtes " mehr vor - cmd.exe
REM kann sich also gar nicht erst daran "verschlucken".
powershell -NoProfile -Command "$q = [char]34; $w = New-Object -ComObject WScript.Shell; $s = $w.CreateShortcut($env:SHORTCUT_PATH); $s.TargetPath = 'wscript.exe'; $s.Arguments = $q + $env:VBS_PATH + $q; $s.WorkingDirectory = $env:WORK_DIR; $s.Description = 'Spicker lokaler Server (unsichtbar)'; $s.Save()"

if not exist "%SHORTCUT_PATH%" (
    echo.
    echo FEHLER: Verknuepfung konnte nicht angelegt werden.
    pause
    exit /b 1
)

echo Verknuepfung angelegt.
echo.
echo Starte den Server jetzt einmal direkt ...
start "" wscript.exe "%VBS_PATH%"

echo.
echo Fertig!
echo   - Der Server startet ab jetzt bei JEDER Windows-Anmeldung
echo     automatisch im Hintergrund (kein sichtbares Fenster).
echo   - Testen: http://127.0.0.1:3000/ im Browser oeffnen.
echo   - Log-Datei: data\server.log
echo   - Wieder entfernen: autostart-remove.bat ausfuehren.
echo.
pause
