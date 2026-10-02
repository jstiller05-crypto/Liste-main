/* =====================================================================
   links.js – Smart-Link-Daten für den Trading-Spicker
   ---------------------------------------------------------------------
   Gleicher Aufbau wie coding/links.js, nur einfacher: Dieser Spicker hat
   keine "Sprachen", deshalb gilt jede Regel überall ("all").
   NEUES WORT? → eine Zeile { words: [...], links: { all: "seite.html" } }
   (nur auf Seiten verlinken, die es schon gibt!)
   ===================================================================== */

const PAGE_LANGUAGES = {};            // keine Sonderfälle
const DEFAULT_PAGE_LANGUAGE = "all";
const PAGE_PREFIX_LANGUAGES = [];       // keine Präfixe
const LANGUAGE_FALLBACK = {};
const TAG_PAGES = {};                 // keine HTML-Tags in diesem Spicker

const smartLinkRules = [
  { words: ["Aktie", "Aktien", "Aktionär", "Aktionäre", "Hauptversammlung"], links: { all: "aktie-ipo.html" } },
  { words: ["IPO", "Börsengang", "Börsengangs", "Emissionspreis", "Zeichnungsfrist", "Primärmarkt", "Sekundärmarkt"], links: { all: "aktie-ipo.html" } },
  { words: ["Kurs", "Kurse", "Kursbildung", "Angebot und Nachfrage", "Orderbuch", "Nachfrage"], links: { all: "kursbildung.html" } },
  { words: ["Kerze", "Kerzen", "Kerzenchart", "Candlestick", "Docht", "Dochte"], links: { all: "kerzenchart.html" } },
  { words: ["Long-Position", "Short-Position", "Leerverkauf", "Leerverkäufe", "Bullenmarkt", "Bärenmarkt", "Daytrading", "Daytrader"], links: { all: "grundlagen.html" } },
  { words: ["Rendite", "Renditen", "Zinseszins", "Zinseszinseffekt", "Inflation", "Inflationsrate", "Realrendite", "Kaufkraft"], links: { all: "rendite-zinseszins.html" } },
  { words: ["Diversifikation", "diversifizieren", "Streuung", "Klumpenrisiko", "Korrelation", "Asset-Klasse", "Asset-Klassen", "Anlageklassen"], links: { all: "diversifikation.html" } },
  { words: ["Broker", "Neobroker", "Depot", "Depots", "Demokonto", "BaFin", "Einlagensicherung", "Sondervermögen"], links: { all: "broker-depot.html" } },
  { words: ["Market-Order", "Limit-Order", "Stop-Loss", "Take-Profit", "Trailing Stop", "Slippage", "Kurslücke", "Kurslücken", "Stop-Limit"], links: { all: "orders.html" } },
  { words: ["Spread", "Spreads", "Bid", "Ask", "Geldkurs", "Briefkurs", "Liquidität", "Markttiefe", "Xetra", "Handelszeiten", "Ordergebühren"], links: { all: "boerse-spread.html" } },
  { words: ["ETF", "ETFs", "Indexfonds", "Index", "Indizes", "DAX", "MSCI World", "S&P 500", "TER", "thesaurierend", "ausschüttend", "Sparplan", "Sparpläne", "Rebalancing", "Cost-Average-Effekt"], links: { all: "etf-index.html" } },
  { words: ["Dividende", "Dividenden", "Dividendenrendite", "Ausschüttungsquote", "Ex-Tag", "Dividendenabschlag"], links: { all: "dividende.html" } },
  { words: ["Anleihe", "Anleihen", "Kupon", "Duration", "Rating", "Ratings", "Leitzins", "Nennwert", "Staatsanleihe", "Staatsanleihen"], links: { all: "anleihen.html" } },
  { words: ["CFD", "CFDs", "Hebel", "Hebelprodukt", "Hebelprodukte", "Negativsaldoschutz", "ESMA"], links: { all: "cfd-hebel.html" } },
  { words: ["Margin", "Margin Call", "Glattstellung", "Overnight-Finanzierung", "Nachschusspflicht"], links: { all: "margin.html" } },
  { words: ["Forex", "Devisen", "Devisenmarkt", "Währungspaar", "Währungspaare", "Pip", "Pips", "Lot", "Lots"], links: { all: "forex.html" } },
  { words: ["Derivat", "Derivate", "Option", "Optionen", "Optionsschein", "Optionsscheine", "Future", "Futures", "Knock-out", "Knock-outs", "Hedging", "Basiswert"], links: { all: "derivate.html" } },
  { words: ["Trend", "Trends", "Aufwärtstrend", "Abwärtstrend", "Trendlinie", "Unterstützung", "Widerstand", "Ausbruch", "Breakout", "Volumen"], links: { all: "trend-unterstuetzung.html" } },
  { words: ["Formation", "Formationen", "Doppelboden", "Schulter-Kopf-Schulter", "Fibonacci", "Fibonacci-Retracement", "logarithmische Skala", "Log-Skala"], links: { all: "formationen.html" } },
  { words: ["gleitender Durchschnitt", "gleitende Durchschnitt", "gleitenden Durchschnitt", "SMA", "EMA", "Golden Cross", "Death Cross", "200-Tage-Linie"], links: { all: "gleitende-durchschnitte.html" } },
  { words: ["RSI", "MACD", "Oszillator", "Oszillatoren", "überkauft", "überverkauft"], links: { all: "rsi-macd.html" } },
  { words: ["Volatilität", "volatil", "Bollinger-Bänder", "Bollinger", "ATR", "Standardabweichung"], links: { all: "bollinger-atr.html" } },
  { words: ["KGV", "EPS", "Gewinn je Aktie", "KBV", "Buchwert", "Free Cashflow", "Burggraben", "Fundamentalanalyse"], links: { all: "aktien-kennzahlen.html" } },
  { words: ["Quartalszahlen", "Makrodaten", "Wirtschaftskalender", "Insiderhandel", "Ad-hoc-Mitteilung"], links: { all: "quartalszahlen-makro.html" } },
  { words: ["Risikomanagement", "1-%-Regel", "Positionsgröße", "CRV", "Chance-Risiko-Verhältnis", "Notgroschen"], links: { all: "risiko-positionsgroesse.html" } },
  { words: ["Trefferquote", "Erwartungswert", "Drawdown", "Backtest", "Backtests", "Overfitting"], links: { all: "erwartungswert-drawdown.html" } },
  { words: ["Abgeltungsteuer", "Sparerpauschbetrag", "Freistellungsauftrag", "Verlusttopf", "Teilfreistellung", "Vorabpauschale", "Solidaritätszuschlag"], links: { all: "steuern.html" } },
  { words: ["Trading-Plan", "Trading-Journal", "FOMO", "Revenge Trading", "Verlustaversion", "Overtrading"], links: { all: "psychologie.html" } },
  { words: ["Kryptowährung", "Kryptowährungen", "Krypto", "Bitcoin", "Ether", "Blockchain", "Wallet", "Wallets", "Stablecoin", "Stablecoins", "MiCA"], links: { all: "krypto.html" } }
];

console.log("[smart-link] trading/links.js geladen:", smartLinkRules.length, "Wort-Regeln");
