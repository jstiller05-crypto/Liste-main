@echo off
REM =====================================================================
REM autostart-remove.bat
REM -----------------------------------------------------------------
REM Macht autostart-install.bat rueckgaengig:
REM   1. Entfernt die Verknuepfung aus dem Windows-Autostart-Ordner.
REM   2. Stoppt den gerade laufenden Server (falls einer laeuft).
REM =====================================================================
cd /d "%~dp0"

echo.
echo === Spicker-Server: Autostart entfernen ===
echo.

set "STARTUP_DIR=%APPDATA%\Microsoft\Windows\Start Menu\Programs\Startup"
set "SHORTCUT_PATH=%STARTUP_DIR%\Spicker-Server.lnk"

if exist "%SHORTCUT_PATH%" (
    del /f /q "%SHORTCUT_PATH%"
    echo Verknuepfung entfernt: %SHORTCUT_PATH%
) else (
    echo Keine Verknuepfung gefunden ^(war wohl schon entfernt^) - ok.
)

echo.
echo Stoppe den Server, falls er laeuft ...
REM "call" ist noetig, damit die Kontrolle nach stop-server.bat wieder
REM HIERHER zurueckkommt - ohne "call" wuerde das Skript nach
REM stop-server.bat einfach aufhoeren. Das Argument "silent" sorgt
REM dafuer, dass stop-server.bat am Ende NICHT selbst noch auf einen
REM Tastendruck wartet (das macht ohnehin schon dieses Skript hier).
call "%~dp0stop-server.bat" silent

echo.
echo Fertig. Der Server startet nicht mehr automatisch bei der Anmeldung.
echo Von Hand starten geht weiterhin jederzeit ueber start.bat.
echo.
pause
