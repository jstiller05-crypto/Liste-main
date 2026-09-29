' =====================================================================
' start-hidden.vbs
' -----------------------------------------------------------------
' Startet server.js OHNE sichtbares Konsolenfenster ("headless").
' Wird von autostart-install.bat in den Windows-Autostart verknuepft,
' kann aber auch jederzeit per Doppelklick von Hand gestartet werden.
'
' WARUM EIN VBS-SKRIPT UND KEINE .BAT-DATEI?
'   Jede .bat-Datei zeigt beim Ausfuehren ein schwarzes Konsolenfenster.
'   VBScript kennt ueber WScript.Shell.Run einen "Fensterstil"-Parameter.
'   Der Wert 0 bedeutet "unsichtbar" - das ist unter Windows der
'   einfachste eingebaute Weg, ein Programm ganz ohne Fenster im
'   Hintergrund zu starten, ohne Zusatzsoftware zu installieren.
'
' WAS server.js SELBST SCHON MACHT (hier NICHT noetig):
'   server.js schreibt seine eigene Prozess-ID nach data\server.pid und
'   loescht sie beim sauberen Beenden wieder. Dieses Skript hier muss
'   sich darum nicht kuemmern.
' =====================================================================

Option Explicit   ' zwingt dazu, jede Variable vorher mit "Dim" anzumelden -
                   ' so fallen Tippfehler in Variablennamen sofort auf,
                   ' statt spaeter zu stillem Fehlverhalten zu fuehren.

Dim shell, fso, scriptDir, dataDir, logPath, nodePath

Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' --- Arbeitsordner bestimmen ---
' WScript.ScriptFullName = der komplette Pfad zu DIESER .vbs-Datei.
' GetParentFolderName schneidet den Dateinamen ab - uebrig bleibt nur
' der Ordner, in dem die Datei liegt (das Repo-Root). Das ist das
' VBS-Gegenstueck zu "%~dp0" in Batch-Dateien.
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)
dataDir = scriptDir & "\data"
logPath = dataDir & "\server.log"

' data\-Ordner sicherstellen. server.js legt ihn zwar beim Start auch
' selbst an, aber die Umleitung der Ausgabe (s. u.) braucht die Datei
' bzw. den Ordner schon, BEVOR node ueberhaupt gestartet wird.
If Not fso.FolderExists(dataDir) Then
    fso.CreateFolder(dataDir)
End If

' --- node.exe suchen ---
nodePath = FindNodePath(shell, fso)

If nodePath = "" Then
    ' MsgBox zeigt IMMER ein sichtbares Dialogfenster, unabhaengig vom
    ' Fensterstil weiter unten - genau das wollen wir hier, damit ein
    ' fehlendes Node.js nicht unbemerkt bleibt.
    MsgBox "node.exe wurde nicht gefunden (Suche ueber 'where node')." & vbCrLf & vbCrLf & _
           "Node.js ist entweder nicht installiert oder nicht im PATH." & vbCrLf & _
           "Bitte Node.js von https://nodejs.org installieren." & vbCrLf & _
           "Falls gerade erst installiert: einmal ab- und wieder anmelden" & vbCrLf & _
           "(oder den Rechner neu starten), damit der PATH aktualisiert wird.", _
           vbCritical, "Spicker-Server - Autostart"
    WScript.Quit 1
End If

' --- Server starten ---
' Jeder Pfad einzeln in Anfuehrungszeichen - wichtig, falls ein Pfad
' Leerzeichen enthaelt (z. B. "C:\Program Files\nodejs\node.exe" oder
' ein Repo-Ordner wie "C:\Eigene Dateien\liste-main").
Dim quotedNode, quotedScript, quotedLog, serverCommand, fullCommand

quotedNode = """" & nodePath & """"
quotedScript = """" & scriptDir & "\server.js" & """"
quotedLog = """" & logPath & """"

' ">"   = die Ausgabe (console.log/warn/error) in die Log-Datei
'         schreiben, JEDES MAL NEU (ueberschreiben statt anhaengen).
'         Wuerde man stattdessen ">>" benutzen, wuerde die Datei bei
'         jedem Neustart weiter waechsen, ohne dass alte Zeilen je
'         verschwinden.
' 2>&1  = "Kanal 2" ist stderr (Fehlermeldungen), "Kanal 1" ist stdout
'         (normale Ausgabe). "2>&1" leitet stderr zusaetzlich dorthin,
'         wo stdout schon hingeht - so landen BEIDE Kanaele in
'         derselben Log-Datei.
serverCommand = quotedNode & " " & quotedScript & " > " & quotedLog & " 2>&1"

' node.exe selbst versteht ">" und "2>&1" nicht - das sind Befehle der
' Kommandozeile (cmd.exe), nicht von node. Deshalb wird nicht node
' direkt gestartet, sondern cmd.exe, dem der ganze Befehl als Text
' mitgegeben wird. "/c" heisst "diesen einen Befehl ausfuehren und
' danach beenden". Der doppelte Anfuehrungszeichen-Rahmen (cmd /c
' "...") ist noetig, weil serverCommand selbst schon Anfuehrungszeichen
' enthaelt - ohne den aeusseren Rahmen wuerde cmd.exe die inneren
' Anfuehrungszeichen falsch interpretieren.
fullCommand = "cmd /c """ & serverCommand & """"

' Fensterstil 0 = unsichtbar. "False" = NICHT auf das Ende warten - der
' Server soll ja dauerhaft im Hintergrund weiterlaufen, waehrend dieses
' VBS-Skript selbst gleich fertig ist.
shell.Run fullCommand, 0, False


' =====================================================================
' Sucht node.exe ueber den eingebauten Windows-Befehl "where node"
' (durchsucht den PATH, genauso wie "where" auf der normalen Kommando-
' zeile). Gibt den ersten gefundenen Pfad zurueck, oder "" wenn nichts
' gefunden wurde.
'
' Laeuft komplett unsichtbar: die Ausgabe von "where" wird in eine
' TEMPORAERE Datei umgeleitet und von dort gelesen, statt sie in einem
' (kurz aufblitzenden) Konsolenfenster anzuzeigen.
' =====================================================================
Function FindNodePath(shellObj, fsoObj)
    Dim tempFile, whereCommand, textStream, firstLine

    tempFile = fsoObj.GetSpecialFolder(2) & "\spicker-where-node.txt" ' 2 = TemporaryFolder

    ' "2>nul" verwirft Fehlermeldungen (z. B. falls "node" unbekannt
    ' ist), damit sie nicht als Text in der Ergebnis-Datei landen.
    whereCommand = "cmd /c where node > """ & tempFile & """ 2>nul"

    ' "True" hier (anders als oben!) heisst: DIESMAL warten, bis der
    ' Befehl fertig ist - das Ergebnis wird ja sofort danach gebraucht.
    shellObj.Run whereCommand, 0, True

    FindNodePath = ""

    If fsoObj.FileExists(tempFile) Then
        Set textStream = fsoObj.OpenTextFile(tempFile, 1) ' 1 = ForReading

        If Not textStream.AtEndOfStream Then
            ' "where" kann mehrere Treffer liefern (z. B. node.exe UND
            ' eine gleichnamige .cmd-Datei) - die erste Zeile reicht.
            firstLine = Trim(textStream.ReadLine)
            If firstLine <> "" And fsoObj.FileExists(firstLine) Then
                FindNodePath = firstLine
            End If
        End If

        textStream.Close
        fsoObj.DeleteFile tempFile, True
    End If
End Function
