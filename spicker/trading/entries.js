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
          { label: "Krypto", value: "krypto" },
          { label: "Apps & Tools", value: "apps & tools" }
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
          { label: "Funktion", value: "funktion" },
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
      "Erklärung": "Aufbau, Filter und Lerntipps",
      "Bereich": "Spicker",
      "Link": "more/anleitung.html",
      "class": ["hilfe","anleitung","bedienung","lerntipps"]
    },
    {
      "Begriff": "Trading vs. Investieren",
      "Erklärung": "Kurz handeln oder lange halten",
      "Bereich": "Grundlagen",
      "Link": "more/grundlagen.html",
      "class": ["begriff","langfristig","kurzfristig"]
    },
    {
      "Begriff": "Long",
      "Erklärung": "Auf steigende Kurse setzen",
      "Bereich": "Grundlagen",
      "Link": "more/grundlagen.html",
      "class": ["begriff","kaufen"]
    },
    {
      "Begriff": "Short",
      "Erklärung": "Auf fallende Kurse setzen",
      "Bereich": "Grundlagen",
      "Link": "more/grundlagen.html",
      "class": ["begriff","leerverkauf","verkaufen"]
    },
    {
      "Begriff": "Bulle / Bär",
      "Erklärung": "Steigender bzw. fallender Markt",
      "Bereich": "Grundlagen",
      "Link": "more/grundlagen.html",
      "class": ["begriff","bullish","bearish"]
    },
    {
      "Begriff": "Volatilität",
      "Erklärung": "Wie stark ein Kurs schwankt",
      "Bereich": "Grundlagen",
      "Link": "more/bollinger-atr.html",
      "class": ["begriff","schwankung"]
    },
    {
      "Begriff": "Liquidität",
      "Erklärung": "Wie leicht man kaufen/verkaufen kann",
      "Bereich": "Grundlagen",
      "Link": "more/boerse-spread.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Diversifikation",
      "Erklärung": "Geld auf viele Anlagen verteilen",
      "Bereich": "Grundlagen",
      "Link": "more/diversifikation.html",
      "class": ["regel","streuung"]
    },
    {
      "Begriff": "Zinseszins",
      "Erklärung": "Erträge bringen selbst wieder Erträge",
      "Bereich": "Grundlagen",
      "Link": "more/rendite-zinseszins.html",
      "class": ["formel","compounding"]
    },
    {
      "Begriff": "Rendite",
      "Erklärung": "Gewinn im Verhältnis zum Einsatz",
      "Bereich": "Grundlagen",
      "Link": "more/rendite-zinseszins.html",
      "class": ["formel","performance"]
    },
    {
      "Begriff": "Inflation",
      "Erklärung": "Preise steigen, Geld verliert Kaufkraft",
      "Bereich": "Grundlagen",
      "Link": "more/rendite-zinseszins.html",
      "class": ["begriff","realzins"]
    },
    {
      "Begriff": "Asset-Klassen",
      "Erklärung": "Aktien, Anleihen, Rohstoffe, Krypto …",
      "Bereich": "Grundlagen",
      "Link": "more/diversifikation.html",
      "class": ["begriff","anlageklassen"]
    },
    {
      "Begriff": "Demokonto",
      "Erklärung": "Üben mit Spielgeld",
      "Bereich": "Grundlagen",
      "Link": "more/broker-depot.html",
      "class": ["regel","paper trading","üben"]
    },
    {
      "Begriff": "Broker",
      "Erklärung": "Vermittler für deine Orders",
      "Bereich": "Grundlagen",
      "Link": "more/broker-depot.html",
      "class": ["begriff","depot"]
    },
    {
      "Begriff": "Depot",
      "Erklärung": "Konto für deine Wertpapiere",
      "Bereich": "Grundlagen",
      "Link": "more/broker-depot.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Börse",
      "Erklärung": "Marktplatz für Wertpapiere",
      "Bereich": "Börse & Orders",
      "Link": "more/boerse-spread.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Bid / Ask",
      "Erklärung": "Verkaufs- und Kaufpreis",
      "Bereich": "Börse & Orders",
      "Link": "more/boerse-spread.html",
      "class": ["begriff","geldkurs","briefkurs"]
    },
    {
      "Begriff": "Spread",
      "Erklärung": "Differenz Ask − Bid: versteckte Kosten",
      "Bereich": "Börse & Orders",
      "Link": "more/boerse-spread.html",
      "class": ["kennzahl","kosten"]
    },
    {
      "Begriff": "Market-Order",
      "Erklärung": "Sofort zum nächsten Preis kaufen",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["begriff","bestens","billigst"]
    },
    {
      "Begriff": "Limit-Order",
      "Erklärung": "Nur zum Limit oder besser",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["begriff","limit"]
    },
    {
      "Begriff": "Stop-Loss",
      "Erklärung": "Verkauft automatisch bei Verlustgrenze",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["regel","verlustbegrenzung","stop"]
    },
    {
      "Begriff": "Take-Profit",
      "Erklärung": "Schließt automatisch beim Gewinnziel",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["begriff","gewinnziel"]
    },
    {
      "Begriff": "Trailing Stop",
      "Erklärung": "Stop-Loss, der dem Kurs nachzieht",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["strategie","nachziehen"]
    },
    {
      "Begriff": "Slippage",
      "Erklärung": "Ausführung zu schlechterem Preis",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["begriff","ausführung"]
    },
    {
      "Begriff": "Gap / Kurslücke",
      "Erklärung": "Kurssprung zwischen zwei Handelstagen",
      "Bereich": "Börse & Orders",
      "Link": "more/orders.html",
      "class": ["begriff","eröffnung"]
    },
    {
      "Begriff": "Orderbuch",
      "Erklärung": "Alle offenen Kauf- und Verkaufsorders",
      "Bereich": "Börse & Orders",
      "Link": "more/boerse-spread.html",
      "class": ["begriff","markttiefe"]
    },
    {
      "Begriff": "Handelszeiten",
      "Erklärung": "Wann eine Börse handelt (Xetra 9–17:30)",
      "Bereich": "Börse & Orders",
      "Link": "more/boerse-spread.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Ordergebühren",
      "Erklärung": "Kosten pro Trade beim Broker",
      "Bereich": "Börse & Orders",
      "Link": "more/boerse-spread.html",
      "class": ["kennzahl","kosten"]
    },
    {
      "Begriff": "Aktie",
      "Erklärung": "Anteil an einem Unternehmen",
      "Bereich": "Aktien & ETFs",
      "Link": "more/aktie-ipo.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Dividende",
      "Erklärung": "Gewinnausschüttung an Aktionäre",
      "Bereich": "Aktien & ETFs",
      "Link": "more/dividende.html",
      "class": ["begriff","ausschüttung"]
    },
    {
      "Begriff": "ETF",
      "Erklärung": "Börsengehandelter Indexfonds",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["begriff","indexfonds"]
    },
    {
      "Begriff": "Index",
      "Erklärung": "Kennzahl für eine Aktiengruppe (z. B. DAX)",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["begriff","dax","msci"]
    },
    {
      "Begriff": "TER",
      "Erklärung": "Laufende Fondskosten pro Jahr",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["kennzahl","kosten","gebühren"]
    },
    {
      "Begriff": "Thesaurierend / ausschüttend",
      "Erklärung": "Erträge wieder anlegen oder auszahlen",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["begriff","acc","dist"]
    },
    {
      "Begriff": "Sparplan",
      "Erklärung": "Regelmäßig festen Betrag investieren",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["strategie","cost average"]
    },
    {
      "Begriff": "Marktkapitalisierung",
      "Erklärung": "Aktienanzahl · Kurs = Börsenwert",
      "Bereich": "Aktien & ETFs",
      "Link": "more/aktie-ipo.html",
      "class": ["formel","market cap"]
    },
    {
      "Begriff": "Aktiv vs. passiv",
      "Erklärung": "Fondsmanager oder Index nachbilden",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["begriff","fonds"]
    },
    {
      "Begriff": "Rebalancing",
      "Erklärung": "Depot auf Zielaufteilung zurücksetzen",
      "Bereich": "Aktien & ETFs",
      "Link": "more/etf-index.html",
      "class": ["strategie","umschichten"]
    },
    {
      "Begriff": "Anleihe",
      "Erklärung": "Schuldschein mit Zinsen",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["begriff","bond","rente"]
    },
    {
      "Begriff": "Kupon",
      "Erklärung": "Fester Zinssatz einer Anleihe",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["begriff","zins"]
    },
    {
      "Begriff": "Rendite einer Anleihe",
      "Erklärung": "Hängt vom Kaufkurs ab",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["regel","effektivzins"]
    },
    {
      "Begriff": "Zinsen und Anleihekurse",
      "Erklärung": "Zins rauf → Anleihekurs runter",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["regel","zinsrisiko"]
    },
    {
      "Begriff": "Duration",
      "Erklärung": "Zinsempfindlichkeit einer Anleihe",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Rating",
      "Erklärung": "Bonitätsnote von AAA bis D",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["begriff","bonität"]
    },
    {
      "Begriff": "Leitzins",
      "Erklärung": "Zins der Zentralbank (EZB, Fed)",
      "Bereich": "Anleihen & Zinsen",
      "Link": "more/anleihen.html",
      "class": ["begriff","ezb","fed"]
    },
    {
      "Begriff": "CFD",
      "Erklärung": "Vertrag über die Kursdifferenz",
      "Bereich": "CFDs & Hebel",
      "Link": "more/cfd-hebel.html",
      "class": ["begriff","differenzkontrakt"]
    },
    {
      "Begriff": "CFD-Risikohinweis",
      "Erklärung": "Die meisten Privatanleger verlieren",
      "Bereich": "CFDs & Hebel",
      "Link": "more/cfd-hebel.html",
      "class": ["regel","warnung","risiko"]
    },
    {
      "Begriff": "Hebel",
      "Erklärung": "Wenig Geld bewegt große Position",
      "Bereich": "CFDs & Hebel",
      "Link": "more/cfd-hebel.html",
      "class": ["begriff","leverage"]
    },
    {
      "Begriff": "Margin",
      "Erklärung": "Sicherheitsleistung = Position / Hebel",
      "Bereich": "CFDs & Hebel",
      "Link": "more/margin.html",
      "class": ["formel","sicherheitsleistung"]
    },
    {
      "Begriff": "Margin Call",
      "Erklärung": "Aufforderung, Geld nachzuschießen",
      "Bereich": "CFDs & Hebel",
      "Link": "more/margin.html",
      "class": ["begriff","nachschuss"]
    },
    {
      "Begriff": "Glattstellung",
      "Erklärung": "Broker schließt bei 50 % Margin",
      "Bereich": "CFDs & Hebel",
      "Link": "more/margin.html",
      "class": ["regel","stop out"]
    },
    {
      "Begriff": "Hebel-Grenzen (EU)",
      "Erklärung": "30:1 bis 2:1 für Privatkunden",
      "Bereich": "CFDs & Hebel",
      "Link": "more/cfd-hebel.html",
      "class": ["regel","esma"]
    },
    {
      "Begriff": "Negativsaldoschutz",
      "Erklärung": "Kein Verlust über das Guthaben hinaus",
      "Bereich": "CFDs & Hebel",
      "Link": "more/cfd-hebel.html",
      "class": ["regel","nachschusspflicht"]
    },
    {
      "Begriff": "Overnight-Finanzierung",
      "Erklärung": "Gebühr pro Nacht für CFD-Positionen",
      "Bereich": "CFDs & Hebel",
      "Link": "more/margin.html",
      "class": ["kennzahl","swap","kosten"]
    },
    {
      "Begriff": "Forex",
      "Erklärung": "Handel mit Währungspaaren",
      "Bereich": "CFDs & Hebel",
      "Link": "more/forex.html",
      "class": ["begriff","fx","devisen","währung"]
    },
    {
      "Begriff": "Pip",
      "Erklärung": "Kleinste Kursänderung (0,0001)",
      "Bereich": "CFDs & Hebel",
      "Link": "more/forex.html",
      "class": ["begriff","forex"]
    },
    {
      "Begriff": "Lot",
      "Erklärung": "Standardgröße: 100.000 Einheiten",
      "Bereich": "CFDs & Hebel",
      "Link": "more/forex.html",
      "class": ["begriff","positionsgröße"]
    },
    {
      "Begriff": "Derivat",
      "Erklärung": "Wert hängt von einem Basiswert ab",
      "Bereich": "Derivate",
      "Link": "more/derivate.html",
      "class": ["begriff","basiswert"]
    },
    {
      "Begriff": "Option (Call / Put)",
      "Erklärung": "Recht zu kaufen (Call) / verkaufen (Put)",
      "Bereich": "Derivate",
      "Link": "more/derivate.html",
      "class": ["begriff","optionsschein"]
    },
    {
      "Begriff": "Future",
      "Erklärung": "Pflicht zu Kauf/Verkauf zum Termin",
      "Bereich": "Derivate",
      "Link": "more/derivate.html",
      "class": ["begriff","termingeschäft"]
    },
    {
      "Begriff": "Knock-out-Zertifikat",
      "Erklärung": "Hebelprodukt, verfällt an der Schwelle",
      "Bereich": "Derivate",
      "Link": "more/derivate.html",
      "class": ["begriff","turbo"]
    },
    {
      "Begriff": "Optionsschein-Griechen",
      "Erklärung": "Delta, Theta, Vega: Options-Kennzahlen",
      "Bereich": "Derivate",
      "Link": "more/derivate.html",
      "class": ["kennzahl","delta","theta"]
    },
    {
      "Begriff": "Hedging",
      "Erklärung": "Position mit Gegenposition absichern",
      "Bereich": "Derivate",
      "Link": "more/derivate.html",
      "class": ["strategie","absicherung"]
    },
    {
      "Begriff": "Candlestick",
      "Erklärung": "Kerze: Eröffnung, Hoch, Tief, Schluss",
      "Bereich": "Chartanalyse",
      "Link": "more/kerzenchart.html",
      "class": ["begriff","kerze","ohlc"]
    },
    {
      "Begriff": "Zeiteinheit (Timeframe)",
      "Erklärung": "Zeitraum einer Kerze (1 Min. bis 1 Mon.)",
      "Bereich": "Chartanalyse",
      "Link": "more/kerzenchart.html",
      "class": ["begriff","timeframe"]
    },
    {
      "Begriff": "Trend",
      "Erklärung": "Höhere Hochs und Tiefs = Aufwärtstrend",
      "Bereich": "Chartanalyse",
      "Link": "more/trend-unterstuetzung.html",
      "class": ["regel","trendlinie"]
    },
    {
      "Begriff": "Unterstützung / Widerstand",
      "Erklärung": "Preiszonen, an denen der Kurs oft dreht",
      "Bereich": "Chartanalyse",
      "Link": "more/trend-unterstuetzung.html",
      "class": ["begriff","support","resistance"]
    },
    {
      "Begriff": "Ausbruch (Breakout)",
      "Erklärung": "Kurs durchbricht eine wichtige Marke",
      "Bereich": "Chartanalyse",
      "Link": "more/trend-unterstuetzung.html",
      "class": ["strategie","breakout"]
    },
    {
      "Begriff": "Volumen",
      "Erklärung": "Anzahl gehandelter Stücke",
      "Bereich": "Chartanalyse",
      "Link": "more/trend-unterstuetzung.html",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Formationen",
      "Erklärung": "Chartmuster wie Doppelboden, SKS",
      "Bereich": "Chartanalyse",
      "Link": "more/formationen.html",
      "class": ["begriff","muster","pattern"]
    },
    {
      "Begriff": "Log- vs. lineare Skala",
      "Erklärung": "Prozent- oder Euro-Abstände im Chart",
      "Bereich": "Chartanalyse",
      "Link": "more/formationen.html",
      "class": ["begriff","chart"]
    },
    {
      "Begriff": "Gleitender Durchschnitt (SMA)",
      "Erklärung": "Durchschnitt der letzten n Kurse",
      "Bereich": "Indikatoren",
      "Link": "more/gleitende-durchschnitte.html",
      "class": ["formel","moving average","sma"]
    },
    {
      "Begriff": "EMA",
      "Erklärung": "Durchschnitt, neuere Kurse zählen mehr",
      "Bereich": "Indikatoren",
      "Link": "more/gleitende-durchschnitte.html",
      "class": ["formel","moving average"]
    },
    {
      "Begriff": "Golden / Death Cross",
      "Erklärung": "50-Tage-Linie kreuzt 200-Tage-Linie",
      "Bereich": "Indikatoren",
      "Link": "more/gleitende-durchschnitte.html",
      "class": ["strategie","200 tage"]
    },
    {
      "Begriff": "RSI",
      "Erklärung": "Über 70 überkauft, unter 30 überverkauft",
      "Bereich": "Indikatoren",
      "Link": "more/rsi-macd.html",
      "class": ["kennzahl","oszillator"]
    },
    {
      "Begriff": "MACD",
      "Erklärung": "Differenz zweier EMAs plus Signallinie",
      "Bereich": "Indikatoren",
      "Link": "more/rsi-macd.html",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Bollinger-Bänder",
      "Erklärung": "Durchschnitt ± 2 Standardabweichungen",
      "Bereich": "Indikatoren",
      "Link": "more/bollinger-atr.html",
      "class": ["kennzahl","volatilität"]
    },
    {
      "Begriff": "ATR",
      "Erklärung": "Durchschnittliche Schwankungsbreite",
      "Bereich": "Indikatoren",
      "Link": "more/bollinger-atr.html",
      "class": ["kennzahl","stop"]
    },
    {
      "Begriff": "Fibonacci-Retracement",
      "Erklärung": "Umkehrzonen bei 38,2 / 50 / 61,8 %",
      "Bereich": "Indikatoren",
      "Link": "more/formationen.html",
      "class": ["strategie"]
    },
    {
      "Begriff": "KGV",
      "Erklärung": "Kurs / Gewinn je Aktie",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/aktien-kennzahlen.html",
      "class": ["kennzahl","pe ratio"]
    },
    {
      "Begriff": "EPS",
      "Erklärung": "Gewinn je Aktie",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/aktien-kennzahlen.html",
      "class": ["formel","gewinn je aktie"]
    },
    {
      "Begriff": "KBV",
      "Erklärung": "Kurs / Buchwert je Aktie",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/aktien-kennzahlen.html",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Dividendenrendite",
      "Erklärung": "Dividende / Kurs · 100 %",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/dividende.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Ausschüttungsquote",
      "Erklärung": "Anteil des Gewinns als Dividende",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/dividende.html",
      "class": ["kennzahl","payout ratio"]
    },
    {
      "Begriff": "Free Cashflow",
      "Erklärung": "Geld, das nach Investitionen übrig bleibt",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/aktien-kennzahlen.html",
      "class": ["kennzahl","cashflow"]
    },
    {
      "Begriff": "Burggraben (Moat)",
      "Erklärung": "Dauerhafter Vorteil gegenüber Konkurrenz",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/aktien-kennzahlen.html",
      "class": ["begriff","moat"]
    },
    {
      "Begriff": "Quartalszahlen",
      "Erklärung": "Vierteljährliche Geschäftszahlen",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/quartalszahlen-makro.html",
      "class": ["begriff","earnings"]
    },
    {
      "Begriff": "Makrodaten",
      "Erklärung": "Inflation, Zinsen, Arbeitsmarkt, BIP",
      "Bereich": "Fundamentalanalyse",
      "Link": "more/quartalszahlen-makro.html",
      "class": ["begriff","wirtschaftskalender"]
    },
    {
      "Begriff": "1-%-Regel",
      "Erklärung": "Max. 1–2 % des Kontos pro Trade riskieren",
      "Bereich": "Risikomanagement",
      "Link": "more/risiko-positionsgroesse.html",
      "class": ["regel","risiko pro trade"]
    },
    {
      "Begriff": "Positionsgröße",
      "Erklärung": "Risiko / Abstand zum Stop",
      "Bereich": "Risikomanagement",
      "Link": "more/risiko-positionsgroesse.html",
      "class": ["formel","position sizing"]
    },
    {
      "Begriff": "Chance-Risiko-Verhältnis (CRV)",
      "Erklärung": "Möglicher Gewinn / möglicher Verlust",
      "Bereich": "Risikomanagement",
      "Link": "more/risiko-positionsgroesse.html",
      "class": ["formel","risk reward"]
    },
    {
      "Begriff": "Trefferquote",
      "Erklärung": "Anteil der Gewinn-Trades",
      "Bereich": "Risikomanagement",
      "Link": "more/erwartungswert-drawdown.html",
      "class": ["kennzahl","winrate"]
    },
    {
      "Begriff": "Erwartungswert",
      "Erklärung": "Ø Ergebnis pro Trade – muss positiv sein",
      "Bereich": "Risikomanagement",
      "Link": "more/erwartungswert-drawdown.html",
      "class": ["formel","expectancy"]
    },
    {
      "Begriff": "Drawdown",
      "Erklärung": "Rückgang vom Höchststand des Kontos",
      "Bereich": "Risikomanagement",
      "Link": "more/erwartungswert-drawdown.html",
      "class": ["kennzahl","verlust"]
    },
    {
      "Begriff": "Klumpenrisiko",
      "Erklärung": "Zu viel Geld in einem Wert/einer Branche",
      "Bereich": "Risikomanagement",
      "Link": "more/diversifikation.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Korrelation",
      "Erklärung": "Wie stark sich Werte gleich bewegen",
      "Bereich": "Risikomanagement",
      "Link": "more/diversifikation.html",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Notgroschen",
      "Erklärung": "3–6 Monatsausgaben als Reserve",
      "Bereich": "Risikomanagement",
      "Link": "more/risiko-positionsgroesse.html",
      "class": ["regel","reserve"]
    },
    {
      "Begriff": "Backtest",
      "Erklärung": "Strategie an alten Daten testen",
      "Bereich": "Risikomanagement",
      "Link": "more/erwartungswert-drawdown.html",
      "class": ["strategie","test"]
    },
    {
      "Begriff": "Abgeltungsteuer",
      "Erklärung": "25 % + Soli auf Kapitalerträge",
      "Bereich": "Steuern & Recht",
      "Link": "more/steuern.html",
      "class": ["regel","steuer","kapitalertragsteuer"]
    },
    {
      "Begriff": "Sparerpauschbetrag",
      "Erklärung": "1.000 € / 2.000 € steuerfrei pro Jahr",
      "Bereich": "Steuern & Recht",
      "Link": "more/steuern.html",
      "class": ["regel","freistellungsauftrag"]
    },
    {
      "Begriff": "Verlusttopf",
      "Erklärung": "Verluste werden mit Gewinnen verrechnet",
      "Bereich": "Steuern & Recht",
      "Link": "more/steuern.html",
      "class": ["regel","verlustverrechnung"]
    },
    {
      "Begriff": "Teilfreistellung",
      "Erklärung": "30 % der Aktien-ETF-Erträge steuerfrei",
      "Bereich": "Steuern & Recht",
      "Link": "more/steuern.html",
      "class": ["regel","etf"]
    },
    {
      "Begriff": "Vorabpauschale",
      "Erklärung": "Jährliche Steuer auf thesaurierende Fonds",
      "Bereich": "Steuern & Recht",
      "Link": "more/steuern.html",
      "class": ["regel","etf"]
    },
    {
      "Begriff": "BaFin",
      "Erklärung": "Deutsche Finanzaufsicht",
      "Bereich": "Steuern & Recht",
      "Link": "more/broker-depot.html",
      "class": ["begriff","regulierung","aufsicht"]
    },
    {
      "Begriff": "Einlagensicherung",
      "Erklärung": "Bankguthaben bis 100.000 € geschützt",
      "Bereich": "Steuern & Recht",
      "Link": "more/broker-depot.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Insiderhandel",
      "Erklärung": "Handel mit Geheimwissen – strafbar",
      "Bereich": "Steuern & Recht",
      "Link": "more/quartalszahlen-makro.html",
      "class": ["regel","marktmissbrauch"]
    },
    {
      "Begriff": "Trading-Plan",
      "Erklärung": "Schriftliche Regeln für jeden Trade",
      "Bereich": "Psychologie",
      "Link": "more/psychologie.html",
      "class": ["regel","plan"]
    },
    {
      "Begriff": "Trading-Journal",
      "Erklärung": "Jeden Trade notieren und auswerten",
      "Bereich": "Psychologie",
      "Link": "more/psychologie.html",
      "class": ["strategie","tagebuch"]
    },
    {
      "Begriff": "FOMO",
      "Erklärung": "Angst, etwas zu verpassen",
      "Bereich": "Psychologie",
      "Link": "more/psychologie.html",
      "class": ["begriff","angst"]
    },
    {
      "Begriff": "Revenge Trading",
      "Erklärung": "Verluste sofort „zurückholen“ wollen",
      "Bereich": "Psychologie",
      "Link": "more/psychologie.html",
      "class": ["begriff","emotion"]
    },
    {
      "Begriff": "Verlustaversion",
      "Erklärung": "Verluste schmerzen mehr als Gewinne freuen",
      "Bereich": "Psychologie",
      "Link": "more/psychologie.html",
      "class": ["begriff","behavioral finance"]
    },
    {
      "Begriff": "Overtrading",
      "Erklärung": "Zu viele Trades ohne echtes Signal",
      "Bereich": "Psychologie",
      "Link": "more/psychologie.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Kryptowährung",
      "Erklärung": "Digitales Geld auf einer Blockchain",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["begriff","bitcoin"]
    },
    {
      "Begriff": "Blockchain",
      "Erklärung": "Verkettete, kaum fälschbare Datenblöcke",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Wallet",
      "Erklärung": "Speicher für deine privaten Schlüssel",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["regel","private key"]
    },
    {
      "Begriff": "Exchange",
      "Erklärung": "Handelsplatz für Kryptowährungen",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["begriff","börse"]
    },
    {
      "Begriff": "Stablecoin",
      "Erklärung": "Coin mit festem Wert, z. B. 1 USD",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["begriff","usdt","usdc"]
    },
    {
      "Begriff": "Krypto-Steuer (privat)",
      "Erklärung": "Nach 1 Jahr Haltedauer steuerfrei",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["regel","steuer","haltefrist"]
    },
    {
      "Begriff": "MiCA",
      "Erklärung": "EU-Regeln für Krypto-Anbieter",
      "Bereich": "Krypto",
      "Link": "more/krypto.html",
      "class": ["regel","regulierung"]
    },
    {
      "Begriff": "IPO (Börsengang)",
      "Erklärung": "Erstmals Aktien für alle anbieten",
      "Bereich": "Aktien & ETFs",
      "Link": "more/aktie-ipo.html",
      "class": ["begriff","emission","neuemission"]
    },
    {
      "Begriff": "Kursbildung",
      "Erklärung": "Angebot und Nachfrage bilden den Kurs",
      "Bereich": "Börse & Orders",
      "Link": "more/kursbildung.html",
      "class": ["begriff","kurs fällt","kurs steigt"]
    },

    /* ===== Apps & Tools: Trading 212, TradingView, finanzen.net zero ===== */
    {
      "Begriff": "Welche App wofür?",
      "Erklärung": "Analysieren, üben, kaufen – die Rollen",
      "Bereich": "Apps & Tools",
      "Link": "more/apps-vergleich.html",
      "class": ["hilfe","apps","workflow","vergleich"]
    },
    {
      "Begriff": "Trading 212",
      "Erklärung": "App mit Invest-, CFD- und Übungskonto",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-ueberblick.html",
      "class": ["begriff","t212","broker","app"]
    },
    {
      "Begriff": "Invest- vs. CFD-Konto",
      "Erklärung": "Aktie besitzen oder nur auf Kurs wetten",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-ueberblick.html",
      "class": ["begriff","t212","kontotyp"]
    },
    {
      "Begriff": "Practice-Konto (T212)",
      "Erklärung": "Spielgeld-Konto, gleiche Oberfläche",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-ueberblick.html",
      "class": ["funktion","t212","demo","üben"]
    },
    {
      "Begriff": "FX-Gebühr",
      "Erklärung": "0,15 % beim Kauf in Fremdwährung (T212)",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-ueberblick.html",
      "class": ["kennzahl","t212","währung","kosten"]
    },
    {
      "Begriff": "Bruchstücke",
      "Erklärung": "Teile einer Aktie kaufen, ab 1 €",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-invest.html",
      "class": ["begriff","fractional","t212","zero"]
    },
    {
      "Begriff": "Pie (T212)",
      "Erklärung": "Eigenes Mini-Portfolio mit Zielgewichten",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-invest.html",
      "class": ["funktion","t212","portfolio"]
    },
    {
      "Begriff": "AutoInvest",
      "Erklärung": "Pie automatisch regelmäßig besparen",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-invest.html",
      "class": ["funktion","t212","sparplan"]
    },
    {
      "Begriff": "Zinsen auf Guthaben",
      "Erklärung": "Freies Geld wird verzinst (variabel)",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-invest.html",
      "class": ["funktion","t212","cash"]
    },
    {
      "Begriff": "Steuereinfach",
      "Erklärung": "Broker führt Steuer selbst ans Finanzamt ab",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-invest.html",
      "class": ["regel","steuer","freistellungsauftrag"]
    },
    {
      "Begriff": "Margin-Status (T212)",
      "Erklärung": "Ampel fürs CFD-Konto in Prozent",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-cfd.html",
      "class": ["kennzahl","t212","margin"]
    },
    {
      "Begriff": "Margin Call & Stop-out (T212)",
      "Erklärung": "45 % Warnung, 25 % automatisch schließen",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-cfd.html",
      "class": ["regel","t212","glattstellung"]
    },
    {
      "Begriff": "Freie Mittel",
      "Erklärung": "Geld, das noch als Margin nutzbar ist",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-cfd.html",
      "class": ["begriff","free funds","t212"]
    },
    {
      "Begriff": "Unrealisierter G/V",
      "Erklärung": "Gewinn/Verlust noch offener Positionen",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-cfd.html",
      "class": ["begriff","unrealised","pnl"]
    },
    {
      "Begriff": "Sizing-Pills (T212)",
      "Erklärung": "25/50/75/100 % der freien Mittel",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-cfd.html",
      "class": ["funktion","t212","positionsgröße"]
    },
    {
      "Begriff": "Instrument-Details",
      "Erklärung": "Spread, Hebel, Overnight-Sätze ansehen",
      "Bereich": "Apps & Tools",
      "Link": "more/t212-cfd.html",
      "class": ["funktion","t212","overnight"]
    },
    {
      "Begriff": "TradingView",
      "Erklärung": "Chart-Plattform zum Analysieren, kein Broker",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-ueberblick.html",
      "class": ["begriff","tv","charts","app"]
    },
    {
      "Begriff": "Symbol / Ticker",
      "Erklärung": "Kürzel eines Werts, z. B. NASDAQ:AAPL",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-ueberblick.html",
      "class": ["begriff","tv","ticker"]
    },
    {
      "Begriff": "TradingView-Pläne",
      "Erklärung": "Basic gratis, mehr Limits im Abo",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-ueberblick.html",
      "class": ["begriff","tv","abo","kosten"]
    },
    {
      "Begriff": "Watchlist",
      "Erklärung": "Liste der Werte, die man beobachtet",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-ueberblick.html",
      "class": ["funktion","tv","zero"]
    },
    {
      "Begriff": "Zeichenwerkzeuge",
      "Erklärung": "Trendlinie, Fibonacci, Rechteck …",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-zeichnen-indikatoren.html",
      "class": ["funktion","tv","drawing"]
    },
    {
      "Begriff": "Long-/Short-Position-Tool",
      "Erklärung": "Zeichnet Einstieg, Stop, Ziel und CRV",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-zeichnen-indikatoren.html",
      "class": ["funktion","tv","crv"]
    },
    {
      "Begriff": "Indikator hinzufügen",
      "Erklärung": "„/“ drücken oder Indikatoren-Button",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-zeichnen-indikatoren.html",
      "class": ["funktion","tv"]
    },
    {
      "Begriff": "Chart-Layout & Vorlagen",
      "Erklärung": "Einstellungen speichern und wiederverwenden",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-zeichnen-indikatoren.html",
      "class": ["funktion","tv","template"]
    },
    {
      "Begriff": "Tastenkürzel (TradingView)",
      "Erklärung": "Alt+H Linie, Alt+T Trendlinie …",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-zeichnen-indikatoren.html",
      "class": ["funktion","tv","shortcuts"]
    },
    {
      "Begriff": "Alarm (Alert)",
      "Erklärung": "Meldung, wenn eine Bedingung eintritt",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-alarme-replay.html",
      "class": ["funktion","tv","kursalarm","zero"]
    },
    {
      "Begriff": "Bar Replay",
      "Erklärung": "Chart zurückspulen, Kerze für Kerze üben",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-alarme-replay.html",
      "class": ["funktion","tv","üben"]
    },
    {
      "Begriff": "Screener",
      "Erklärung": "Werte nach Kriterien filtern",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-alarme-replay.html",
      "class": ["funktion","tv","filter"]
    },
    {
      "Begriff": "Paper Trading (TradingView)",
      "Erklärung": "Simuliertes Konto direkt im Chart",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-paper-trading.html",
      "class": ["funktion","tv","demo","üben"]
    },
    {
      "Begriff": "Order Ticket",
      "Erklärung": "Fenster zum Eingeben einer Order",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-paper-trading.html",
      "class": ["funktion","tv","ordermaske"]
    },
    {
      "Begriff": "Chart-Trading",
      "Erklärung": "Orders und Stops im Chart ziehen",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-paper-trading.html",
      "class": ["funktion","tv"]
    },
    {
      "Begriff": "Account Manager",
      "Erklärung": "Panel: Positionen, Orders, Historie",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-paper-trading.html",
      "class": ["funktion","tv"]
    },
    {
      "Begriff": "Pine Script",
      "Erklärung": "Sprache für eigene Indikatoren",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-pine-script.html",
      "class": ["begriff","tv","programmieren","code"]
    },
    {
      "Begriff": "Strategy Tester",
      "Erklärung": "Pine-Strategie an alten Daten testen",
      "Bereich": "Apps & Tools",
      "Link": "more/tv-pine-script.html",
      "class": ["funktion","tv","backtest"]
    },
    {
      "Begriff": "finanzen.net zero",
      "Erklärung": "Neobroker, Depot bei der Baader Bank",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-ueberblick.html",
      "class": ["begriff","zero","broker","app"]
    },
    {
      "Begriff": "gettex",
      "Erklärung": "Münchner Handelsplatz, 7:30–23 Uhr",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-ueberblick.html",
      "class": ["begriff","zero","handelsplatz"]
    },
    {
      "Begriff": "Market Maker",
      "Erklärung": "Stellt laufend Kauf- und Verkaufskurse",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-ueberblick.html",
      "class": ["begriff","zero","liquidität"]
    },
    {
      "Begriff": "Mindermengenzuschlag",
      "Erklärung": "1 € bei Orders unter 500 € (zero)",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-ueberblick.html",
      "class": ["kennzahl","zero","kosten"]
    },
    {
      "Begriff": "PFOF",
      "Erklärung": "Rückvergütung vom Handelsplatz an Broker",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-ueberblick.html",
      "class": ["regel","zero","payment for order flow"]
    },
    {
      "Begriff": "OCO-Order",
      "Erklärung": "Zwei Orders: eine läuft, andere wird gelöscht",
      "Bereich": "Börse & Orders",
      "Link": "more/zero-orders-sparplan.html",
      "class": ["begriff","zero","one cancels other"]
    },
    {
      "Begriff": "Sparplan bei zero",
      "Erklärung": "Ab 1 €, wöchentlich bis quartalsweise",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-orders-sparplan.html",
      "class": ["funktion","zero","sparplan"]
    },
    {
      "Begriff": "Quote (verbindlicher Kurs)",
      "Erklärung": "Kurs, der wenige Sekunden fest gilt",
      "Bereich": "Apps & Tools",
      "Link": "more/zero-orders-sparplan.html",
      "class": ["begriff","zero","gettex"]
    }
  ]}
};

console.log("[entries] trading/entries.js geladen:", window.SpickerData["trading"].oTableEntries.List.length, "Einträge");
