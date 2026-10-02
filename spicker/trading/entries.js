/* =====================================================================
   entries.js – DATEN des Trading-Spickers (keine Logik!)
   ---------------------------------------------------------------------
   Gleicher Aufbau wie coding/entries.js – die Logik steckt in
   shared/list.js. Erklärung der Felder:
     "Begriff"   → Spalte 1 (Haupt-Spalte für A–Z)
     "Erklärung" → Spalte 2
     "Bereich"   → Spalte 3 + Filter "Bereich" (klein geschrieben verglichen)
     "Link"      → Spalte 4 ("mehr"), leer = kein Link
     "class"     → erster Wert = Typ (Filter "Typ"), danach Schlagwörter
                   für die Suche
   ===================================================================== */
window.SpickerData = window.SpickerData || {};

window.SpickerData["trading"] = {

  config: {
    searchPlaceholder: "Begriffe, Kennzahlen oder Bereiche suchen …",
    dropdownColumns: "2fr 1fr 1fr",   // Bereich hat viele Buttons → breiter

    columns: [
      { title: "Begriff",   field: "Begriff" },
      { title: "Erklärung", field: "Erklärung" },
      { title: "Bereich",   field: "Bereich" },
      { title: "Link",      field: "Link", type: "link", linkText: "mehr" }
    ],

    filterGroups: [
      {
        id: "area",
        title: "Bereich",
        field: "Bereich",
        buttons: [
          { label: "Alle", value: "" },
          { label: "Grundlagen", value: "grundlagen" },
          { label: "Börse & Orders", value: "börse & orders" },
          { label: "Aktien & ETFs", value: "aktien & etfs" },
          { label: "Anleihen & Zinsen", value: "anleihen & zinsen" },
          { label: "CFDs & Hebel", value: "cfds & hebel" },
          { label: "Derivate", value: "derivate" },
          { label: "Chartanalyse", value: "chartanalyse" },
          { label: "Indikatoren", value: "indikatoren" },
          { label: "Fundamentalanalyse", value: "fundamentalanalyse" },
          { label: "Risikomanagement", value: "risikomanagement" },
          { label: "Steuern & Recht", value: "steuern & recht" },
          { label: "Psychologie", value: "psychologie" },
          { label: "Krypto", value: "krypto" }
        ]
      },
      {
        id: "type",
        title: "Typ",
        field: "class",
        buttons: [
          { label: "Alle", value: "" },
          { label: "Begriff", value: "begriff" },
          { label: "Formel", value: "formel" },
          { label: "Kennzahl", value: "kennzahl" },
          { label: "Regel", value: "regel" },
          { label: "Strategie", value: "strategie" },
          { label: "Hilfe", value: "hilfe" }
        ]
      }
    ],

    sortOptions: [
      { label: "A – Z",   value: "az" },
      { label: "Z – A",   value: "za" },
      { label: "Bereich", value: "field:Bereich" }
    ]
  },

  oTableEntries: { "List": [
    {
      "Begriff": "Anleitung",
      "Erklärung": "So funktioniert dieser Spicker: Aufbau, Filter und Lerntipps",
      "Bereich": "Spicker",
      "Link": "more/anleitung.html",
      "class": ["hilfe","anleitung","bedienung","lerntipps"]
    },
    {
      "Begriff": "Trading vs. Investieren",
      "Erklärung": "Trading: kurze Haltedauer, Kursbewegungen ausnutzen. Investieren: Jahre bis Jahrzehnte, Wachstum und Dividenden.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","langfristig","kurzfristig"]
    },
    {
      "Begriff": "Long",
      "Erklärung": "Auf steigende Kurse setzen: jetzt kaufen, später teurer verkaufen.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","kaufen"]
    },
    {
      "Begriff": "Short",
      "Erklärung": "Auf fallende Kurse setzen: erst (geliehen) verkaufen, später billiger zurückkaufen.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","leerverkauf","verkaufen"]
    },
    {
      "Begriff": "Bulle / Bär",
      "Erklärung": "Bulle = Optimist, steigende Märkte (Bullenmarkt). Bär = Pessimist, fallende Märkte (Bärenmarkt).",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","bullish","bearish"]
    },
    {
      "Begriff": "Volatilität",
      "Erklärung": "Wie stark ein Kurs schwankt. Hohe Volatilität = größere Chancen, aber auch größere Verluste.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","schwankung"]
    },
    {
      "Begriff": "Liquidität",
      "Erklärung": "Wie leicht ein Wert ohne großen Kurssprung gekauft/verkauft werden kann. Viel Handel = hohe Liquidität.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Diversifikation",
      "Erklärung": "Geld auf viele, möglichst unabhängige Anlagen verteilen, damit ein einzelner Verlust nicht alles trifft.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["regel","streuung"]
    },
    {
      "Begriff": "Zinseszins",
      "Erklärung": "Erträge werden wieder angelegt und bringen selbst Erträge. Endwert = Startwert · (1 + Zins)^Jahre.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["formel","compounding"]
    },
    {
      "Begriff": "Rendite",
      "Erklärung": "Gewinn im Verhältnis zum Einsatz: (Endwert − Startwert) / Startwert · 100 %.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["formel","performance"]
    },
    {
      "Begriff": "Inflation",
      "Erklärung": "Allgemeiner Preisanstieg. Senkt die Kaufkraft von Bargeld – Rendite nach Inflation zählt.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","realzins"]
    },
    {
      "Begriff": "Asset-Klassen",
      "Erklärung": "Gruppen von Anlagen: Aktien, Anleihen, Rohstoffe, Immobilien, Devisen, Kryptowährungen, Bargeld.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","anlageklassen"]
    },
    {
      "Begriff": "Demokonto",
      "Erklärung": "Konto mit Spielgeld beim Broker. Zum Üben von Plattform und Strategie ohne echtes Risiko.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["regel","paper trading","üben"]
    },
    {
      "Begriff": "Broker",
      "Erklärung": "Vermittler, über den man an der Börse oder außerbörslich handelt. Auf Regulierung (z. B. BaFin) und Kosten achten.",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff","depot"]
    },
    {
      "Begriff": "Depot",
      "Erklärung": "Konto, in dem Wertpapiere verwahrt werden. Gehört dem Anleger, nicht der Bank (Sondervermögen).",
      "Bereich": "Grundlagen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Börse",
      "Erklärung": "Marktplatz, auf dem Käufer und Verkäufer Wertpapiere handeln.",
      "Bereich": "Börse & Orders",
      "Link": "more/kursbildung.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Bid / Ask",
      "Erklärung": "Kaufpreis (Bid) und Verkaufspreis (Ask) im Orderbuch.",
      "Bereich": "Börse & Orders",
      "Link": "more/kursbildung.html",
      "class": ["begriff","geldkurs","briefkurs"]
    },
    {
      "Begriff": "Spread",
      "Erklärung": "Differenz zwischen Ask und Bid. Versteckte Kosten jedes Trades – bei illiquiden Werten größer.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["kennzahl","kosten"]
    },
    {
      "Begriff": "Market-Order",
      "Erklärung": "Sofort zum nächsten verfügbaren Preis ausführen. Schnell, aber Preis nicht garantiert.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["begriff","bestens","billigst"]
    },
    {
      "Begriff": "Limit-Order",
      "Erklärung": "Nur zu einem bestimmten Preis oder besser ausführen. Preis sicher, Ausführung nicht.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["begriff","limit"]
    },
    {
      "Begriff": "Stop-Loss",
      "Erklärung": "Verkauft automatisch, wenn der Kurs eine Grenze unterschreitet. Begrenzt Verluste – bei Kurslücken evtl. schlechter ausgeführt.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["regel","verlustbegrenzung","stop"]
    },
    {
      "Begriff": "Take-Profit",
      "Erklärung": "Schließt die Position automatisch, wenn ein Gewinnziel erreicht ist.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["begriff","gewinnziel"]
    },
    {
      "Begriff": "Trailing Stop",
      "Erklärung": "Stop-Loss, der dem Kurs im Abstand folgt, aber nie zurückgeht. Sichert Gewinne bei laufendem Trend.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["strategie","nachziehen"]
    },
    {
      "Begriff": "Slippage",
      "Erklärung": "Abweichung zwischen gewünschtem und tatsächlichem Ausführungspreis, v. a. bei schnellen Märkten.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["begriff","ausführung"]
    },
    {
      "Begriff": "Gap / Kurslücke",
      "Erklärung": "Sprung zwischen Schlusskurs und nächstem Eröffnungskurs, z. B. nach Nachrichten über Nacht.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["begriff","eröffnung"]
    },
    {
      "Begriff": "Orderbuch",
      "Erklärung": "Liste aller offenen Kauf- und Verkaufsaufträge.",
      "Bereich": "Börse & Orders",
      "Link": "more/kursbildung.html",
      "class": ["begriff","markttiefe"]
    },
    {
      "Begriff": "Handelszeiten",
      "Erklärung": "Börsen handeln zu festen Zeiten (Xetra 9–17:30 Uhr). Außerhalb: größere Spreads, weniger Liquidität.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Ordergebühren",
      "Erklärung": "Kosten pro Trade beim Broker plus Börsenentgelte. Bei vielen kleinen Trades fressen sie die Rendite.",
      "Bereich": "Börse & Orders",
      "Link": "",
      "class": ["kennzahl","kosten"]
    },
    {
      "Begriff": "Aktie",
      "Erklärung": "Anteil an einem Unternehmen.",
      "Bereich": "Aktien & ETFs",
      "Link": "more/aktie-ipo.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Dividende",
      "Erklärung": "Ausschüttung eines Teils des Gewinns an die Aktionäre, meist jährlich oder quartalsweise.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["begriff","ausschüttung"]
    },
    {
      "Begriff": "ETF",
      "Erklärung": "Börsengehandelter Indexfonds: bildet einen Index nach, breit gestreut, meist günstig.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["begriff","indexfonds"]
    },
    {
      "Begriff": "Index",
      "Erklärung": "Kennzahl für eine Gruppe von Aktien, z. B. DAX (40 deutsche Werte), S&P 500, MSCI World.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["begriff","dax","msci"]
    },
    {
      "Begriff": "TER",
      "Erklärung": "Total Expense Ratio: laufende jährliche Kosten eines Fonds in Prozent des Vermögens.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["kennzahl","kosten","gebühren"]
    },
    {
      "Begriff": "Thesaurierend / ausschüttend",
      "Erklärung": "Thesaurierend: Erträge werden automatisch wieder angelegt. Ausschüttend: Erträge werden ausgezahlt.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["begriff","acc","dist"]
    },
    {
      "Begriff": "Sparplan",
      "Erklärung": "Regelmäßig (z. B. monatlich) einen festen Betrag investieren. Glättet Einstiegskurse (Cost-Average-Effekt).",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["strategie","cost average"]
    },
    {
      "Begriff": "Marktkapitalisierung",
      "Erklärung": "Anzahl Aktien · Aktienkurs = Börsenwert eines Unternehmens.",
      "Bereich": "Aktien & ETFs",
      "Link": "more/aktie-ipo.html",
      "class": ["formel","market cap"]
    },
    {
      "Begriff": "Aktiv vs. passiv",
      "Erklärung": "Aktiv: Fondsmanager wählt Titel aus. Passiv: Index wird nachgebildet. Passiv meist günstiger.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["begriff","fonds"]
    },
    {
      "Begriff": "Rebalancing",
      "Erklärung": "Depot regelmäßig auf die geplante Aufteilung zurückbringen, z. B. 70 % Aktien / 30 % Anleihen.",
      "Bereich": "Aktien & ETFs",
      "Link": "",
      "class": ["strategie","umschichten"]
    },
    {
      "Begriff": "Anleihe",
      "Erklärung": "Schuldschein: Man leiht einem Staat/Unternehmen Geld und bekommt Zinsen (Kupon) und am Ende den Nennwert zurück.",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["begriff","bond","rente"]
    },
    {
      "Begriff": "Kupon",
      "Erklärung": "Fester Zinssatz einer Anleihe bezogen auf den Nennwert.",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["begriff","zins"]
    },
    {
      "Begriff": "Rendite einer Anleihe",
      "Erklärung": "Hängt vom Kaufkurs ab: Kurs unter 100 % → Rendite höher als der Kupon, darüber → niedriger.",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["regel","effektivzins"]
    },
    {
      "Begriff": "Zinsen und Anleihekurse",
      "Erklärung": "Steigen die Marktzinsen, fallen die Kurse bestehender Anleihen – und umgekehrt.",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["regel","zinsrisiko"]
    },
    {
      "Begriff": "Duration",
      "Erklärung": "Maß für die Zinsempfindlichkeit einer Anleihe. Faustregel: Zins +1 % → Kurs ca. −Duration %.",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Rating",
      "Erklärung": "Bonitätsnote von Agenturen (AAA bis D). Ab unter BBB− spricht man von 'High Yield' (Ramsch).",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["begriff","bonität"]
    },
    {
      "Begriff": "Leitzins",
      "Erklärung": "Zins, zu dem sich Banken bei der Zentralbank (EZB, Fed) Geld leihen. Beeinflusst alle anderen Zinsen.",
      "Bereich": "Anleihen & Zinsen",
      "Link": "",
      "class": ["begriff","ezb","fed"]
    },
    {
      "Begriff": "CFD",
      "Erklärung": "Contract for Difference: Vertrag mit dem Broker über die Kursdifferenz. Man besitzt den Basiswert nicht.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["begriff","differenzkontrakt"]
    },
    {
      "Begriff": "CFD-Risikohinweis",
      "Erklärung": "Die meisten Privatanleger verlieren mit CFDs Geld – Broker müssen den Anteil der Verlustkonten angeben.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["regel","warnung","risiko"]
    },
    {
      "Begriff": "Hebel",
      "Erklärung": "Mit wenig Eigenkapital eine große Position bewegen. Hebel 10 = 1 % Kursbewegung → 10 % Gewinn oder Verlust.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["begriff","leverage"]
    },
    {
      "Begriff": "Margin",
      "Erklärung": "Sicherheitsleistung, die für eine gehebelte Position hinterlegt wird. Margin = Positionswert / Hebel.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["formel","sicherheitsleistung"]
    },
    {
      "Begriff": "Margin Call",
      "Erklärung": "Aufforderung, Geld nachzuschießen, weil das Konto die nötige Margin nicht mehr deckt.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["begriff","nachschuss"]
    },
    {
      "Begriff": "Glattstellung",
      "Erklärung": "Broker schließt Positionen automatisch, wenn die Margin zu stark sinkt (in der EU spätestens bei 50 %).",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["regel","stop out"]
    },
    {
      "Begriff": "Hebel-Grenzen (EU)",
      "Erklärung": "Für Privatkunden begrenzt: 30:1 Hauptwährungen, 20:1 Indizes/Gold, 10:1 Rohstoffe, 5:1 Aktien, 2:1 Krypto.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["regel","esma"]
    },
    {
      "Begriff": "Negativsaldoschutz",
      "Erklärung": "In der EU dürfen Privatkunden bei CFDs nicht mehr als ihr Kontoguthaben verlieren.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["regel","nachschusspflicht"]
    },
    {
      "Begriff": "Overnight-Finanzierung",
      "Erklärung": "Gebühr für über Nacht gehaltene CFD-Positionen. Macht CFDs für lange Haltedauern teuer.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["kennzahl","swap","kosten"]
    },
    {
      "Begriff": "Forex",
      "Erklärung": "Devisenhandel mit Währungspaaren wie EUR/USD. Wird oft per CFD gehandelt.",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["begriff","fx","devisen","währung"]
    },
    {
      "Begriff": "Pip",
      "Erklärung": "Kleinste übliche Kursänderung im Forex, meist die 4. Nachkommastelle (0,0001).",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["begriff","forex"]
    },
    {
      "Begriff": "Lot",
      "Erklärung": "Standardgröße im Forex: 1 Lot = 100.000 Einheiten der Basiswährung (Mini 10.000, Micro 1.000).",
      "Bereich": "CFDs & Hebel",
      "Link": "",
      "class": ["begriff","positionsgröße"]
    },
    {
      "Begriff": "Derivat",
      "Erklärung": "Finanzprodukt, dessen Wert von einem anderen Wert (Basiswert) abhängt, z. B. Optionen, Futures, CFDs.",
      "Bereich": "Derivate",
      "Link": "",
      "class": ["begriff","basiswert"]
    },
    {
      "Begriff": "Option (Call / Put)",
      "Erklärung": "Recht, aber keine Pflicht, einen Basiswert zu einem festen Preis zu kaufen (Call) oder zu verkaufen (Put).",
      "Bereich": "Derivate",
      "Link": "",
      "class": ["begriff","optionsschein"]
    },
    {
      "Begriff": "Future",
      "Erklärung": "Verbindlicher Vertrag, einen Basiswert zu einem festen Termin und Preis zu kaufen oder zu verkaufen.",
      "Bereich": "Derivate",
      "Link": "",
      "class": ["begriff","termingeschäft"]
    },
    {
      "Begriff": "Knock-out-Zertifikat",
      "Erklärung": "Hebelprodukt mit Schwelle: Wird sie berührt, verfällt das Produkt (fast) wertlos.",
      "Bereich": "Derivate",
      "Link": "",
      "class": ["begriff","turbo"]
    },
    {
      "Begriff": "Optionsschein-Griechen",
      "Erklärung": "Kennzahlen für Optionen: Delta (Kursreaktion), Theta (Zeitwertverlust), Vega (Volatilität).",
      "Bereich": "Derivate",
      "Link": "",
      "class": ["kennzahl","delta","theta"]
    },
    {
      "Begriff": "Hedging",
      "Erklärung": "Absichern einer Position mit einer Gegenposition, z. B. Put-Option auf gehaltene Aktien.",
      "Bereich": "Derivate",
      "Link": "",
      "class": ["strategie","absicherung"]
    },
    {
      "Begriff": "Candlestick",
      "Erklärung": "Kerze mit Eröffnung, Hoch, Tief und Schluss.",
      "Bereich": "Chartanalyse",
      "Link": "more/kerzenchart.html",
      "class": ["begriff","kerze","ohlc"]
    },
    {
      "Begriff": "Zeiteinheit (Timeframe)",
      "Erklärung": "Länge einer Kerze, z. B. 1 Minute, 1 Stunde, 1 Tag. Größere Zeiteinheit = weniger Rauschen.",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["begriff","timeframe"]
    },
    {
      "Begriff": "Trend",
      "Erklärung": "Aufwärtstrend: höhere Hochs und höhere Tiefs. Abwärtstrend: tiefere Hochs und tiefere Tiefs.",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["regel","trendlinie"]
    },
    {
      "Begriff": "Unterstützung / Widerstand",
      "Erklärung": "Kursbereiche, an denen der Kurs oft dreht: Unterstützung unten (Käufer), Widerstand oben (Verkäufer).",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["begriff","support","resistance"]
    },
    {
      "Begriff": "Ausbruch (Breakout)",
      "Erklärung": "Kurs durchbricht einen Widerstand oder eine Unterstützung deutlich, oft mit hohem Volumen.",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["strategie","breakout"]
    },
    {
      "Begriff": "Volumen",
      "Erklärung": "Anzahl gehandelter Stücke. Bestätigt Bewegungen: Ausbruch mit hohem Volumen ist aussagekräftiger.",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Formationen",
      "Erklärung": "Wiederkehrende Muster wie Schulter-Kopf-Schulter, Doppelboden, Dreieck, Flagge.",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["begriff","muster","pattern"]
    },
    {
      "Begriff": "Log- vs. lineare Skala",
      "Erklärung": "Logarithmisch: gleiche Prozent-Bewegung = gleicher Abstand. Für lange Zeiträume besser.",
      "Bereich": "Chartanalyse",
      "Link": "",
      "class": ["begriff","chart"]
    },
    {
      "Begriff": "Gleitender Durchschnitt (SMA)",
      "Erklärung": "Durchschnitt der letzten n Schlusskurse. Glättet den Kurs und zeigt die Trendrichtung.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["formel","moving average","sma"]
    },
    {
      "Begriff": "EMA",
      "Erklärung": "Exponentieller Durchschnitt: gewichtet neuere Kurse stärker, reagiert schneller als der SMA.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["formel","moving average"]
    },
    {
      "Begriff": "Golden / Death Cross",
      "Erklärung": "50-Tage-Linie kreuzt die 200-Tage-Linie nach oben (Golden) bzw. unten (Death).",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["strategie","200 tage"]
    },
    {
      "Begriff": "RSI",
      "Erklärung": "Relative Strength Index (0–100). Über 70 gilt als überkauft, unter 30 als überverkauft.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["kennzahl","oszillator"]
    },
    {
      "Begriff": "MACD",
      "Erklärung": "Differenz zweier EMAs plus Signallinie. Kreuzungen gelten als Kauf-/Verkaufssignal.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Bollinger-Bänder",
      "Erklärung": "Gleitender Durchschnitt ± 2 Standardabweichungen. Enge Bänder = wenig Volatilität, oft vor großen Bewegungen.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["kennzahl","volatilität"]
    },
    {
      "Begriff": "ATR",
      "Erklärung": "Average True Range: durchschnittliche Schwankungsbreite. Hilft, Stop-Abstände sinnvoll zu wählen.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["kennzahl","stop"]
    },
    {
      "Begriff": "Fibonacci-Retracement",
      "Erklärung": "Linien bei 23,6 / 38,2 / 50 / 61,8 % einer Bewegung als mögliche Umkehrzonen.",
      "Bereich": "Indikatoren",
      "Link": "",
      "class": ["strategie"]
    },
    {
      "Begriff": "KGV",
      "Erklärung": "Kurs-Gewinn-Verhältnis = Aktienkurs / Gewinn je Aktie. Wie viele Jahresgewinne man 'bezahlt'.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["kennzahl","pe ratio"]
    },
    {
      "Begriff": "EPS",
      "Erklärung": "Gewinn je Aktie = Jahresüberschuss / Anzahl Aktien.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["formel","gewinn je aktie"]
    },
    {
      "Begriff": "KBV",
      "Erklärung": "Kurs-Buchwert-Verhältnis = Kurs / Buchwert (Eigenkapital) je Aktie. Unter 1 = unter Substanzwert.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Dividendenrendite",
      "Erklärung": "Dividende je Aktie / Aktienkurs · 100 %.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Ausschüttungsquote",
      "Erklärung": "Anteil des Gewinns, der als Dividende ausgezahlt wird. Über 100 % ist auf Dauer nicht haltbar.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["kennzahl","payout ratio"]
    },
    {
      "Begriff": "Free Cashflow",
      "Erklärung": "Operativer Cashflow minus Investitionen: Geld, das wirklich übrig bleibt.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["kennzahl","cashflow"]
    },
    {
      "Begriff": "Burggraben (Moat)",
      "Erklärung": "Dauerhafter Wettbewerbsvorteil, z. B. Marke, Netzwerkeffekt, Patente, Kostenvorteil.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["begriff","moat"]
    },
    {
      "Begriff": "Quartalszahlen",
      "Erklärung": "Unternehmen berichten vierteljährlich. Abweichungen von den Erwartungen bewegen den Kurs stark.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["begriff","earnings"]
    },
    {
      "Begriff": "Makrodaten",
      "Erklärung": "Wirtschaftsdaten wie Inflation, Arbeitsmarkt, Leitzins, BIP. Ein Wirtschaftskalender zeigt die Termine.",
      "Bereich": "Fundamentalanalyse",
      "Link": "",
      "class": ["begriff","wirtschaftskalender"]
    },
    {
      "Begriff": "1-%-Regel",
      "Erklärung": "Pro Trade höchstens 1–2 % des Kontos riskieren. Auch eine Verlustserie ist dann überlebbar.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["regel","risiko pro trade"]
    },
    {
      "Begriff": "Positionsgröße",
      "Erklärung": "Positionsgröße = riskierter Betrag / Abstand Einstieg–Stop. Erst den Stop festlegen, dann die Größe.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["formel","position sizing"]
    },
    {
      "Begriff": "Chance-Risiko-Verhältnis (CRV)",
      "Erklärung": "Möglicher Gewinn / möglicher Verlust. CRV 2 = doppelt so viel Gewinn wie Risiko.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["formel","risk reward"]
    },
    {
      "Begriff": "Trefferquote",
      "Erklärung": "Anteil der Gewinn-Trades. Mit gutem CRV kann man auch mit unter 50 % Trefferquote profitabel sein.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["kennzahl","winrate"]
    },
    {
      "Begriff": "Erwartungswert",
      "Erklärung": "Trefferquote · Ø Gewinn − Verlustquote · Ø Verlust. Muss positiv sein, sonst verliert die Strategie langfristig.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["formel","expectancy"]
    },
    {
      "Begriff": "Drawdown",
      "Erklärung": "Rückgang vom Höchststand des Kontos. −50 % brauchen danach +100 %, um wieder auszugleichen.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["kennzahl","verlust"]
    },
    {
      "Begriff": "Klumpenrisiko",
      "Erklärung": "Zu viel Geld in einem Wert, einer Branche oder einem Land. Gegenmittel: Diversifikation.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Korrelation",
      "Erklärung": "Wie stark sich zwei Werte gemeinsam bewegen (−1 bis +1). Viele korrelierte Positionen = ein großes Risiko.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Notgroschen",
      "Erklärung": "Vor dem Investieren 3–6 Monatsausgaben als sofort verfügbare Reserve. Nur Geld anlegen, das man entbehren kann.",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["regel","reserve"]
    },
    {
      "Begriff": "Backtest",
      "Erklärung": "Strategie mit historischen Daten testen. Vorsicht: Vergangenheit garantiert keine Zukunft (Overfitting).",
      "Bereich": "Risikomanagement",
      "Link": "",
      "class": ["strategie","test"]
    },
    {
      "Begriff": "Abgeltungsteuer",
      "Erklärung": "In Deutschland 25 % auf Kapitalerträge plus Solidaritätszuschlag und ggf. Kirchensteuer.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel","steuer","kapitalertragsteuer"]
    },
    {
      "Begriff": "Sparerpauschbetrag",
      "Erklärung": "Steuerfreie Kapitalerträge pro Jahr: 1.000 € (Zusammenveranlagung 2.000 €). Per Freistellungsauftrag nutzen. (Stand 2026)",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel","freistellungsauftrag"]
    },
    {
      "Begriff": "Verlusttopf",
      "Erklärung": "Die Bank verrechnet Verluste automatisch mit Gewinnen. Aktienverluste nur mit Aktiengewinnen.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel","verlustverrechnung"]
    },
    {
      "Begriff": "Teilfreistellung",
      "Erklärung": "Bei Aktien-ETFs (mind. 51 % Aktien) sind 30 % der Erträge steuerfrei.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel","etf"]
    },
    {
      "Begriff": "Vorabpauschale",
      "Erklärung": "Steuer auf thesaurierende Fonds für einen fiktiven Mindestertrag – wird später beim Verkauf angerechnet.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel","etf"]
    },
    {
      "Begriff": "BaFin",
      "Erklärung": "Bundesanstalt für Finanzdienstleistungsaufsicht. Prüft, ob ein Anbieter in Deutschland zugelassen ist.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["begriff","regulierung","aufsicht"]
    },
    {
      "Begriff": "Einlagensicherung",
      "Erklärung": "Bankguthaben gesetzlich bis 100.000 € pro Person und Bank geschützt. Wertpapiere im Depot sind Sondervermögen.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Insiderhandel",
      "Erklärung": "Handel mit nicht öffentlichen, kursrelevanten Informationen – strafbar.",
      "Bereich": "Steuern & Recht",
      "Link": "",
      "class": ["regel","marktmissbrauch"]
    },
    {
      "Begriff": "Trading-Plan",
      "Erklärung": "Schriftliche Regeln: Was, wann, wie viel, Ein- und Ausstieg, maximaler Tagesverlust. Vorher festlegen, dann befolgen.",
      "Bereich": "Psychologie",
      "Link": "",
      "class": ["regel","plan"]
    },
    {
      "Begriff": "Trading-Journal",
      "Erklärung": "Jeden Trade mit Grund, Ergebnis und Gefühl notieren. Zeigt Muster und Fehler.",
      "Bereich": "Psychologie",
      "Link": "",
      "class": ["strategie","tagebuch"]
    },
    {
      "Begriff": "FOMO",
      "Erklärung": "Fear of Missing Out: Angst, eine Bewegung zu verpassen. Führt zu spätem, ungeplantem Einstieg.",
      "Bereich": "Psychologie",
      "Link": "",
      "class": ["begriff","angst"]
    },
    {
      "Begriff": "Revenge Trading",
      "Erklärung": "Nach einem Verlust sofort größer handeln, um ihn 'zurückzuholen'. Häufiger Grund für große Verluste.",
      "Bereich": "Psychologie",
      "Link": "",
      "class": ["begriff","emotion"]
    },
    {
      "Begriff": "Verlustaversion",
      "Erklärung": "Verluste schmerzen stärker als gleich große Gewinne freuen → Verlierer zu lange halten, Gewinner zu früh verkaufen.",
      "Bereich": "Psychologie",
      "Link": "",
      "class": ["begriff","behavioral finance"]
    },
    {
      "Begriff": "Overtrading",
      "Erklärung": "Zu viele Trades ohne echtes Signal – meist aus Langeweile. Kostet Gebühren und Nerven.",
      "Bereich": "Psychologie",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Kryptowährung",
      "Erklärung": "Digitale Währung auf einer Blockchain, z. B. Bitcoin, Ether. Sehr hohe Volatilität.",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["begriff","bitcoin"]
    },
    {
      "Begriff": "Blockchain",
      "Erklärung": "Dezentral gespeicherte, verkettete Liste von Transaktionen, die nachträglich kaum änderbar ist.",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Wallet",
      "Erklärung": "Speicher für die privaten Schlüssel. Wer den Schlüssel hat, kontrolliert die Coins ('Not your keys, not your coins').",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["regel","private key"]
    },
    {
      "Begriff": "Exchange",
      "Erklärung": "Krypto-Handelsplatz. Coins auf der Börse liegen bei der Börse – Pleite- und Hackrisiko.",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["begriff","börse"]
    },
    {
      "Begriff": "Stablecoin",
      "Erklärung": "Coin, der an einen festen Wert gekoppelt ist (z. B. 1 USD). Kopplung kann trotzdem brechen.",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["begriff","usdt","usdc"]
    },
    {
      "Begriff": "Krypto-Steuer (privat)",
      "Erklärung": "Privat gehaltene Coins: Gewinne nach über einem Jahr Haltedauer steuerfrei, vorher Einkommensteuer (Freigrenze 1.000 €/Jahr).",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["regel","steuer","haltefrist"]
    },
    {
      "Begriff": "MiCA",
      "Erklärung": "EU-Verordnung für Kryptowerte: Anbieter brauchen eine Zulassung und müssen Regeln zum Anlegerschutz einhalten.",
      "Bereich": "Krypto",
      "Link": "",
      "class": ["regel","regulierung"]
    },
    {
      "Begriff": "IPO (Börsengang)",
      "Erklärung": "Ein Unternehmen verkauft zum ersten Mal Aktien an alle.",
      "Bereich": "Aktien & ETFs",
      "Link": "more/aktie-ipo.html",
      "class": ["begriff","emission","neuemission"]
    },
    {
      "Begriff": "Kursbildung",
      "Erklärung": "Warum Kurse steigen und fallen: Angebot und Nachfrage.",
      "Bereich": "Börse & Orders",
      "Link": "more/kursbildung.html",
      "class": ["begriff","kurs fällt","kurs steigt"]
    }
  ]}
};

console.log("[entries] trading/entries.js geladen:", window.SpickerData["trading"].oTableEntries.List.length, "Einträge");
