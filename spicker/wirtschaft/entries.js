/* =====================================================================
   entries.js – DATEN des Wirtschaft-Spickers (keine Logik!)
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

window.SpickerData["wirtschaft"] = {

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
          { label: "BWL-Grundlagen", value: "bwl-grundlagen" },
          { label: "Gründung & Rechtsformen", value: "gründung & rechtsformen" },
          { label: "Buchhaltung", value: "buchhaltung" },
          { label: "Bilanz & GuV", value: "bilanz & guv" },
          { label: "Kennzahlen", value: "kennzahlen" },
          { label: "Steuern", value: "steuern" },
          { label: "Kostenrechnung", value: "kostenrechnung" },
          { label: "Finanzierung & Liquidität", value: "finanzierung & liquidität" },
          { label: "Controlling & Planung", value: "controlling & planung" },
          { label: "Personal", value: "personal" },
          { label: "Marketing & Vertrieb", value: "marketing & vertrieb" },
          { label: "Recht & Verträge", value: "recht & verträge" },
          { label: "Risiko & Absicherung", value: "risiko & absicherung" }
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
      "Begriff": "Betriebswirtschaftslehre (BWL)",
      "Erklärung": "Lehre davon, wie Unternehmen planen, entscheiden, produzieren, verkaufen und finanzieren.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["begriff","bwl"]
    },
    {
      "Begriff": "Ökonomisches Prinzip",
      "Erklärung": "Maximalprinzip: mit gegebenen Mitteln möglichst viel erreichen. Minimalprinzip: ein Ziel mit möglichst wenig Mitteln.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["regel","wirtschaftlichkeit"]
    },
    {
      "Begriff": "Produktionsfaktoren",
      "Erklärung": "Arbeit, Betriebsmittel (Maschinen, Gebäude), Werkstoffe – plus die Leitung, die alles kombiniert.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Angebot und Nachfrage",
      "Erklärung": "Der Preis pendelt sich dort ein, wo angebotene und nachgefragte Menge gleich sind.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["regel","markt","preis"]
    },
    {
      "Begriff": "Wertschöpfungskette",
      "Erklärung": "Alle Schritte vom Einkauf über Produktion und Vertrieb bis zum Service, die Wert für den Kunden schaffen.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["begriff","porter"]
    },
    {
      "Begriff": "Geschäftsmodell",
      "Erklärung": "Wie ein Unternehmen Wert schafft und Geld verdient: Kunden, Angebot, Kanäle, Einnahmen, Kosten.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["begriff","business model canvas"]
    },
    {
      "Begriff": "SWOT-Analyse",
      "Erklärung": "Stärken, Schwächen (intern), Chancen, Risiken (extern) gegenüberstellen und daraus Strategien ableiten.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["strategie","analyse"]
    },
    {
      "Begriff": "Zielgruppe",
      "Erklärung": "Die Kunden, für die ein Angebot gemacht ist – nach Alter, Bedarf, Branche, Budget usw. beschrieben.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["begriff","kunde"]
    },
    {
      "Begriff": "Alleinstellungsmerkmal (USP)",
      "Erklärung": "Was das eigene Angebot klar von der Konkurrenz unterscheidet.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["begriff","usp"]
    },
    {
      "Begriff": "Skaleneffekt",
      "Erklärung": "Mit steigender Menge sinken die Stückkosten, weil Fixkosten auf mehr Einheiten verteilt werden.",
      "Bereich": "BWL-Grundlagen",
      "Link": "",
      "class": ["regel","economies of scale"]
    },
    {
      "Begriff": "Einzelunternehmen",
      "Erklärung": "Eine Person, kein Mindestkapital, volle private Haftung. Einfachste Form.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["begriff","rechtsform"]
    },
    {
      "Begriff": "Freiberufler",
      "Erklärung": "Bestimmte Berufe (z. B. Ärzte, Ingenieure, Journalisten, viele IT-Berater) – keine Gewerbeanmeldung, keine Gewerbesteuer.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["begriff","selbstständig"]
    },
    {
      "Begriff": "Gewerbeanmeldung",
      "Erklärung": "Beim Gewerbeamt vor Beginn der gewerblichen Tätigkeit. Danach meldet sich das Finanzamt (Fragebogen zur steuerlichen Erfassung).",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["regel","gewerbe"]
    },
    {
      "Begriff": "GbR",
      "Erklärung": "Gesellschaft bürgerlichen Rechts: mindestens zwei Personen, kein Mindestkapital, Gesellschafter haften privat.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["begriff","rechtsform"]
    },
    {
      "Begriff": "GmbH",
      "Erklärung": "Gesellschaft mit beschränkter Haftung: 25.000 € Stammkapital, Haftung auf das Gesellschaftsvermögen beschränkt.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["begriff","rechtsform","haftung"]
    },
    {
      "Begriff": "UG (haftungsbeschränkt)",
      "Erklärung": "'Mini-GmbH' ab 1 € Stammkapital. Muss 25 % des Jahresüberschusses zurücklegen, bis 25.000 € erreicht sind.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["begriff","rechtsform"]
    },
    {
      "Begriff": "Handelsregister",
      "Erklärung": "Öffentliches Verzeichnis der Kaufleute und Gesellschaften. GmbH/UG entstehen erst mit der Eintragung.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Businessplan",
      "Erklärung": "Schriftliches Konzept: Idee, Markt, Wettbewerb, Marketing, Organisation, Finanzplan. Pflicht für Bank und Förderung.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["strategie","gründung"]
    },
    {
      "Begriff": "Haftung",
      "Erklärung": "Wer für Schulden einsteht. Einzelunternehmer und GbR-Gesellschafter mit Privatvermögen, GmbH nur mit Firmenvermögen.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Buchführungspflicht",
      "Erklärung": "Kaufleute (HGB) müssen doppelt buchen und bilanzieren. Kleine Einzelunternehmer/Freiberufler dürfen die EÜR nutzen.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","hgb"]
    },
    {
      "Begriff": "EÜR",
      "Erklärung": "Einnahmen-Überschuss-Rechnung: Gewinn = Betriebseinnahmen − Betriebsausgaben. Einfacher als die Bilanz.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["formel","gewinnermittlung"]
    },
    {
      "Begriff": "Doppelte Buchführung",
      "Erklärung": "Jeder Geschäftsvorfall wird zweimal gebucht: im Soll eines Kontos und im Haben eines anderen.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","doppik"]
    },
    {
      "Begriff": "Buchungssatz",
      "Erklärung": "'Soll an Haben', z. B. 'Bank an Umsatzerlöse' bei einer Kundenzahlung.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","soll","haben"]
    },
    {
      "Begriff": "Kontenrahmen",
      "Erklärung": "Standardliste aller Konten, in Deutschland meist SKR 03 oder SKR 04 (DATEV).",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["begriff","skr"]
    },
    {
      "Begriff": "Beleg",
      "Erklärung": "Grundlage jeder Buchung: Rechnung, Quittung, Kontoauszug. 'Keine Buchung ohne Beleg.'",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","rechnung"]
    },
    {
      "Begriff": "Pflichtangaben Rechnung",
      "Erklärung": "U. a. Name/Anschrift beider Seiten, Steuernummer oder USt-IdNr., Datum, fortlaufende Nummer, Leistung, Netto, Steuersatz, Steuer, Brutto.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","rechnung"]
    },
    {
      "Begriff": "E-Rechnung",
      "Erklärung": "Rechnung in strukturiertem Datenformat (XRechnung, ZUGFeRD). Unternehmen müssen sie seit 2025 empfangen können; Versandpflicht folgt schrittweise.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","xrechnung","zugferd"]
    },
    {
      "Begriff": "Aufbewahrungsfristen",
      "Erklärung": "Bücher, Bilanzen: 10 Jahre. Buchungsbelege: 8 Jahre. Geschäftsbriefe: 6 Jahre. (Stand 2026)",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","archiv"]
    },
    {
      "Begriff": "GoBD",
      "Erklärung": "Regeln für ordnungsgemäße, digitale Buchführung: vollständig, richtig, zeitgerecht, unveränderbar, nachvollziehbar.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Abschreibung (AfA)",
      "Erklärung": "Anschaffungskosten langlebiger Güter werden über die Nutzungsdauer verteilt als Aufwand gebucht.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","afa"]
    },
    {
      "Begriff": "Lineare Abschreibung",
      "Erklärung": "Jährlicher Betrag = Anschaffungskosten / Nutzungsdauer (Jahre).",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["formel","afa"]
    },
    {
      "Begriff": "Geringwertiges Wirtschaftsgut (GWG)",
      "Erklärung": "Bewegliche Güter bis 800 € netto dürfen sofort im Jahr der Anschaffung voll abgeschrieben werden.",
      "Bereich": "Buchhaltung",
      "Link": "",
      "class": ["regel","gwg"]
    },
    {
      "Begriff": "Bilanz",
      "Erklärung": "Was das Unternehmen hat (Aktiva) und woher das Geld kommt (Passiva).",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff","jahresabschluss"]
    },
    {
      "Begriff": "Aktiva",
      "Erklärung": "Linke Bilanzseite: Vermögen.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff","vermögen"]
    },
    {
      "Begriff": "Passiva",
      "Erklärung": "Rechte Bilanzseite: Eigen- und Fremdkapital.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff","kapital"]
    },
    {
      "Begriff": "Anlagevermögen",
      "Erklärung": "Was dauerhaft im Betrieb bleibt: Grundstücke, Gebäude, Maschinen, Software, Beteiligungen.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Umlaufvermögen",
      "Erklärung": "Was sich schnell umschlägt: Vorräte, Forderungen, Kasse, Bankguthaben.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Eigenkapital",
      "Erklärung": "Vermögen minus Schulden: Geld der Eigentümer plus einbehaltene Gewinne.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["formel","ek"]
    },
    {
      "Begriff": "Rückstellungen",
      "Erklärung": "Schulden, deren Höhe oder Zeitpunkt noch unsicher ist, z. B. für Steuernachzahlungen oder Prozesse.",
      "Bereich": "Bilanz & GuV",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "GuV",
      "Erklärung": "Erträge − Aufwendungen eines Jahres = Gewinn oder Verlust.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/guv.html",
      "class": ["formel","erfolgsrechnung"]
    },
    {
      "Begriff": "Aufwand vs. Ausgabe",
      "Erklärung": "Ausgabe = Geld fließt ab. Aufwand = Werteverzehr in der GuV. Beispiel: Maschinenkauf ist Ausgabe, die Abschreibung Aufwand.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/guv.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Inventur",
      "Erklärung": "Körperliche Bestandsaufnahme aller Vermögensteile und Schulden, meist zum Jahresende.",
      "Bereich": "Bilanz & GuV",
      "Link": "",
      "class": ["begriff","inventar"]
    },
    {
      "Begriff": "Jahresabschluss",
      "Erklärung": "Bilanz + GuV (bei Kapitalgesellschaften zusätzlich Anhang, ggf. Lagebericht). Muss offengelegt werden.",
      "Bereich": "Bilanz & GuV",
      "Link": "",
      "class": ["regel","offenlegung"]
    },
    {
      "Begriff": "Cashflow",
      "Erklärung": "Tatsächlicher Geldzufluss minus Geldabfluss einer Periode – zeigt, ob Geld verdient wird, nicht nur Gewinn.",
      "Bereich": "Bilanz & GuV",
      "Link": "",
      "class": ["kennzahl","liquidität"]
    },
    {
      "Begriff": "Umsatz",
      "Erklärung": "Menge · Preis: alle Erlöse aus verkauften Leistungen (netto, ohne Umsatzsteuer).",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","erlös"]
    },
    {
      "Begriff": "Gewinn",
      "Erklärung": "Erträge − Aufwendungen. Positiv = Gewinn, negativ = Verlust.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","jahresüberschuss"]
    },
    {
      "Begriff": "Umsatzrendite",
      "Erklärung": "Gewinn / Umsatz · 100 %. Wie viel von jedem Euro Umsatz als Gewinn bleibt.",
      "Bereich": "Kennzahlen",
      "Link": "more/guv.html",
      "class": ["formel","marge"]
    },
    {
      "Begriff": "Eigenkapitalrendite",
      "Erklärung": "Gewinn / Eigenkapital · 100 %. Verzinsung des Kapitals der Eigentümer.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","roe"]
    },
    {
      "Begriff": "Gesamtkapitalrendite",
      "Erklärung": "(Gewinn + Fremdkapitalzinsen) / Gesamtkapital · 100 %.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","roi"]
    },
    {
      "Begriff": "ROI",
      "Erklärung": "Return on Investment = Gewinn / eingesetztes Kapital · 100 %. Lohnt sich eine Investition?",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Eigenkapitalquote",
      "Erklärung": "Eigenkapital / Gesamtkapital · 100 %. Je höher, desto unabhängiger und krisenfester.",
      "Bereich": "Kennzahlen",
      "Link": "more/bilanz.html",
      "class": ["formel","ek-quote"]
    },
    {
      "Begriff": "Verschuldungsgrad",
      "Erklärung": "Fremdkapital / Eigenkapital. Zeigt die Abhängigkeit von Geldgebern.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Liquiditätsgrade",
      "Erklärung": "1. Grad: flüssige Mittel / kurzfr. Verbindlichkeiten. 2. Grad: + Forderungen. 3. Grad: + Vorräte.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","liquidität"]
    },
    {
      "Begriff": "EBIT / EBITDA",
      "Erklärung": "Gewinn vor Zinsen und Steuern (EBIT), zusätzlich vor Abschreibungen (EBITDA). Gut zum Vergleichen.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Rohertrag",
      "Erklärung": "Umsatz − Wareneinsatz. Was nach dem Einkauf der Ware übrig bleibt.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","handelsspanne"]
    },
    {
      "Begriff": "Lagerumschlag",
      "Erklärung": "Wareneinsatz / Ø Lagerbestand. Wie oft sich das Lager pro Jahr leert.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Debitorenlaufzeit (DSO)",
      "Erklärung": "Ø Forderungen / Umsatz · 365. Wie viele Tage Kunden im Schnitt bis zur Zahlung brauchen.",
      "Bereich": "Kennzahlen",
      "Link": "",
      "class": ["formel","forderungen"]
    },
    {
      "Begriff": "Umsatzsteuer",
      "Erklärung": "19 % Regelsatz, 7 % ermäßigt (z. B. Lebensmittel, Bücher). Wird auf den Netto-Preis aufgeschlagen und ans Finanzamt abgeführt.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","mehrwertsteuer","ust"]
    },
    {
      "Begriff": "Vorsteuer",
      "Erklärung": "Umsatzsteuer auf Einkäufe. Wird mit der eingenommenen Umsatzsteuer verrechnet – Zahllast = USt − Vorsteuer.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["formel","zahllast"]
    },
    {
      "Begriff": "Umsatzsteuer-Voranmeldung",
      "Erklärung": "Monatlich oder vierteljährlich elektronisch über ELSTER an das Finanzamt.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","elster","ustva"]
    },
    {
      "Begriff": "Kleinunternehmerregelung",
      "Erklärung": "Keine Umsatzsteuer, wenn Vorjahr ≤ 25.000 € und laufendes Jahr ≤ 100.000 € Umsatz. Dafür kein Vorsteuerabzug. (Stand 2026)",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","§19 ustg"]
    },
    {
      "Begriff": "Einkommensteuer",
      "Erklärung": "Steuer auf das Einkommen natürlicher Personen (auch Einzelunternehmer). Progressiv, mit Grundfreibetrag.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","est"]
    },
    {
      "Begriff": "Gewerbesteuer",
      "Erklärung": "Gemeindesteuer auf Gewerbebetriebe, Höhe abhängig vom Hebesatz. Personenunternehmen haben 24.500 € Freibetrag.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","hebesatz"]
    },
    {
      "Begriff": "Körperschaftsteuer",
      "Erklärung": "Einkommensteuer der Kapitalgesellschaften (GmbH, UG): 15 % plus Solidaritätszuschlag; Senkung ab 2028 beschlossen.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","kst"]
    },
    {
      "Begriff": "Betriebsausgaben",
      "Erklärung": "Alle betrieblich veranlassten Kosten. Mindern den Gewinn und damit die Steuer.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["begriff","absetzen"]
    },
    {
      "Begriff": "Steuerrücklagen",
      "Erklärung": "Faustregel für Selbstständige: 30–40 % des Gewinns sofort zurücklegen, damit Nachzahlungen bezahlbar sind.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","rücklage"]
    },
    {
      "Begriff": "Reverse-Charge",
      "Erklärung": "Bei bestimmten Leistungen (z. B. aus dem EU-Ausland) schuldet der Kunde die Umsatzsteuer statt des Lieferanten.",
      "Bereich": "Steuern",
      "Link": "",
      "class": ["regel","§13b"]
    },
    {
      "Begriff": "Fixkosten",
      "Erklärung": "Kosten, die immer anfallen (Miete, Gehälter).",
      "Bereich": "Kostenrechnung",
      "Link": "more/break-even.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Variable Kosten",
      "Erklärung": "Kosten pro Stück (Material, Versand).",
      "Bereich": "Kostenrechnung",
      "Link": "more/break-even.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Deckungsbeitrag",
      "Erklärung": "Preis − variable Kosten je Stück.",
      "Bereich": "Kostenrechnung",
      "Link": "more/break-even.html",
      "class": ["formel","db"]
    },
    {
      "Begriff": "Break-even-Point",
      "Erklärung": "Menge, ab der Gewinn entsteht.",
      "Bereich": "Kostenrechnung",
      "Link": "more/break-even.html",
      "class": ["formel","gewinnschwelle"]
    },
    {
      "Begriff": "Kalkulation",
      "Erklärung": "Preis aufbauen: Materialkosten + Fertigungskosten + Gemeinkosten-Zuschläge + Gewinnzuschlag = Netto-Verkaufspreis.",
      "Bereich": "Kostenrechnung",
      "Link": "",
      "class": ["formel","preis"]
    },
    {
      "Begriff": "Stundensatz",
      "Erklärung": "(Fixkosten + gewünschter Gewinn + Steuerreserve) / verrechenbare Stunden pro Jahr.",
      "Bereich": "Kostenrechnung",
      "Link": "",
      "class": ["formel","freelancer"]
    },
    {
      "Begriff": "Gemeinkosten",
      "Erklärung": "Kosten, die keinem Produkt direkt zuzuordnen sind (Verwaltung, Strom) – werden per Zuschlag verteilt.",
      "Bereich": "Kostenrechnung",
      "Link": "",
      "class": ["begriff","overhead"]
    },
    {
      "Begriff": "Kostenstelle",
      "Erklärung": "Bereich, in dem Kosten entstehen und verantwortet werden, z. B. Vertrieb, Produktion, IT.",
      "Bereich": "Kostenrechnung",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Opportunitätskosten",
      "Erklärung": "Entgangener Nutzen der besten nicht gewählten Alternative.",
      "Bereich": "Kostenrechnung",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Liquidität",
      "Erklärung": "Fähigkeit, Rechnungen pünktlich zu bezahlen. Häufiger Insolvenzgrund ist fehlende Liquidität, nicht fehlender Gewinn.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Liquiditätsplan",
      "Erklärung": "Plan der erwarteten Ein- und Auszahlungen pro Monat für die nächsten 6–12 Monate.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["strategie","finanzplan"]
    },
    {
      "Begriff": "Eigenfinanzierung",
      "Erklärung": "Finanzierung aus eigenem Geld oder einbehaltenen Gewinnen. Keine Zinsen, keine Abhängigkeit.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Fremdfinanzierung",
      "Erklärung": "Kredite, Darlehen, Lieferantenkredit. Kostet Zinsen, Eigentümer behalten die Kontrolle.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["begriff","kredit"]
    },
    {
      "Begriff": "Kontokorrentkredit",
      "Erklärung": "Dispo-Rahmen für das Geschäftskonto. Flexibel, aber teuer – nur für kurze Engpässe.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["begriff","dispo"]
    },
    {
      "Begriff": "Leasing",
      "Erklärung": "Gegenstand mieten statt kaufen. Schont die Liquidität, ist über die Laufzeit meist teurer.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Factoring",
      "Erklärung": "Offene Forderungen an einen Dienstleister verkaufen und sofort Geld erhalten (gegen Gebühr).",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["begriff","forderungen"]
    },
    {
      "Begriff": "Fördermittel",
      "Erklärung": "Zuschüsse und günstige Kredite, z. B. über die KfW oder Landesförderbanken. Meist VOR dem Projekt beantragen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["regel","kfw"]
    },
    {
      "Begriff": "Skonto",
      "Erklärung": "Preisnachlass bei schneller Zahlung, z. B. '2 % Skonto bei Zahlung in 10 Tagen' – oft sehr lohnend.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Mahnwesen",
      "Erklärung": "Zahlungserinnerung → Mahnung(en) → gerichtliches Mahnverfahren. Verzug spätestens 30 Tage nach Rechnung.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "",
      "class": ["regel","mahnung","verzug"]
    },
    {
      "Begriff": "Controlling",
      "Erklärung": "Planung, Steuerung und Kontrolle anhand von Zahlen: Plan mit Ist vergleichen und gegensteuern.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Soll-Ist-Vergleich",
      "Erklärung": "Geplante Werte den tatsächlichen gegenüberstellen und Abweichungen begründen.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["strategie","abweichung"]
    },
    {
      "Begriff": "BWA",
      "Erklärung": "Betriebswirtschaftliche Auswertung: monatlicher Kurzbericht aus der Buchhaltung (Umsatz, Kosten, Ergebnis).",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["begriff","datev"]
    },
    {
      "Begriff": "KPI",
      "Erklärung": "Key Performance Indicator: wenige Kennzahlen, an denen der Erfolg gemessen wird.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["begriff","kennzahl"]
    },
    {
      "Begriff": "SMART-Ziele",
      "Erklärung": "Spezifisch, Messbar, Attraktiv, Realistisch, Terminiert.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["regel","ziel"]
    },
    {
      "Begriff": "Budget",
      "Erklärung": "Für einen Zeitraum festgelegter Betrag für Kosten oder Investitionen.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Investitionsrechnung",
      "Erklärung": "Lohnt sich eine Investition? Z. B. Amortisationsdauer, Kapitalwertmethode.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["strategie"]
    },
    {
      "Begriff": "Amortisationsdauer",
      "Erklärung": "Investition / jährlicher Rückfluss = Jahre, bis das Geld wieder drin ist.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["formel","payback"]
    },
    {
      "Begriff": "Kapitalwert (NPV)",
      "Erklärung": "Summe aller abgezinsten zukünftigen Zahlungen minus Investition. Positiv = lohnt sich.",
      "Bereich": "Controlling & Planung",
      "Link": "",
      "class": ["formel","abzinsung"]
    },
    {
      "Begriff": "Arbeitsvertrag",
      "Erklärung": "Regelt Tätigkeit, Lohn, Arbeitszeit, Urlaub, Kündigungsfristen. Wesentliche Bedingungen müssen schriftlich festgehalten werden.",
      "Bereich": "Personal",
      "Link": "",
      "class": ["regel","nachweisgesetz"]
    },
    {
      "Begriff": "Mindestlohn",
      "Erklärung": "Gesetzliche Lohnuntergrenze pro Stunde – wird regelmäßig angepasst (2026: 13,90 €).",
      "Bereich": "Personal",
      "Link": "",
      "class": ["regel","lohn"]
    },
    {
      "Begriff": "Minijob",
      "Erklärung": "Geringfügige Beschäftigung bis zur Minijob-Grenze pro Monat; pauschale Abgaben über die Minijob-Zentrale.",
      "Bereich": "Personal",
      "Link": "",
      "class": ["begriff","geringfügig"]
    },
    {
      "Begriff": "Lohnnebenkosten",
      "Erklärung": "Arbeitgeberanteile zur Sozialversicherung (ca. 20 % vom Brutto) plus Umlagen, Berufsgenossenschaft.",
      "Bereich": "Personal",
      "Link": "",
      "class": ["kennzahl","sozialversicherung"]
    },
    {
      "Begriff": "Brutto / Netto",
      "Erklärung": "Brutto = vereinbarter Lohn. Netto = Brutto minus Lohnsteuer und Arbeitnehmeranteile zur Sozialversicherung.",
      "Bereich": "Personal",
      "Link": "",
      "class": ["begriff","lohn"]
    },
    {
      "Begriff": "Probezeit",
      "Erklärung": "Bis zu 6 Monate, in denen mit 2 Wochen Frist gekündigt werden kann.",
      "Bereich": "Personal",
      "Link": "",
      "class": ["regel","kündigung"]
    },
    {
      "Begriff": "Arbeitsschutz",
      "Erklärung": "Arbeitgeber muss Gefährdungen beurteilen und Mitarbeiter schützen (Arbeitsschutzgesetz).",
      "Bereich": "Personal",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Scheinselbstständigkeit",
      "Erklärung": "Freie Mitarbeiter, die wie Angestellte arbeiten → Nachzahlung von Sozialabgaben droht.",
      "Bereich": "Personal",
      "Link": "",
      "class": ["regel","freelancer"]
    },
    {
      "Begriff": "Marketing-Mix (4P)",
      "Erklärung": "Product (Produkt), Price (Preis), Place (Vertrieb), Promotion (Kommunikation).",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["begriff","4p"]
    },
    {
      "Begriff": "Customer Journey",
      "Erklärung": "Alle Berührungspunkte eines Kunden vom ersten Kontakt bis nach dem Kauf.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Conversion Rate",
      "Erklärung": "Käufer / Besucher · 100 %. Wie viele Interessenten tatsächlich kaufen.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["formel","konversion"]
    },
    {
      "Begriff": "Kundenakquisekosten (CAC)",
      "Erklärung": "Marketing- und Vertriebskosten / Anzahl neuer Kunden.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["formel","cac"]
    },
    {
      "Begriff": "Customer Lifetime Value",
      "Erklärung": "Gesamter Deckungsbeitrag, den ein Kunde über die ganze Zeit bringt. Sollte deutlich über den CAC liegen.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["formel","clv","ltv"]
    },
    {
      "Begriff": "Wiederkehrende Umsätze",
      "Erklärung": "Abo- oder Wartungsverträge mit monatlicher Zahlung – planbarer als Einzelaufträge.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["strategie","abo","mrr"]
    },
    {
      "Begriff": "Preisstrategie",
      "Erklärung": "Kostenorientiert, konkurrenzorientiert oder wertorientiert (nach Nutzen für den Kunden).",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["strategie","preis"]
    },
    {
      "Begriff": "Impressumspflicht",
      "Erklärung": "Geschäftliche Webseiten brauchen ein leicht erreichbares Impressum (Digitale-Dienste-Gesetz).",
      "Bereich": "Marketing & Vertrieb",
      "Link": "",
      "class": ["regel","webseite"]
    },
    {
      "Begriff": "Vertrag",
      "Erklärung": "Entsteht durch zwei übereinstimmende Willenserklärungen: Angebot und Annahme.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["regel","bgb"]
    },
    {
      "Begriff": "AGB",
      "Erklärung": "Allgemeine Geschäftsbedingungen: vorformulierte Vertragsbedingungen. Unwirksam, wenn sie den Kunden unangemessen benachteiligen.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Gewährleistung",
      "Erklärung": "Gesetzliche Mängelhaftung des Verkäufers: 2 Jahre bei neuen Sachen.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["regel","mängel"]
    },
    {
      "Begriff": "Widerrufsrecht",
      "Erklärung": "Verbraucher können Online- und Fernabsatzkäufe meist 14 Tage ohne Grund widerrufen.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["regel","fernabsatz"]
    },
    {
      "Begriff": "Dienst- vs. Werkvertrag",
      "Erklärung": "Dienstvertrag: Tätigkeit geschuldet. Werkvertrag: Ergebnis (Werk) geschuldet, mit Abnahme.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "DSGVO",
      "Erklärung": "Datenschutz-Grundverordnung: personenbezogene Daten nur mit Rechtsgrundlage verarbeiten; Datenschutzerklärung, Auskunftsrecht.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["regel","datenschutz"]
    },
    {
      "Begriff": "Verjährung",
      "Erklärung": "Regelmäßige Verjährungsfrist: 3 Jahre, beginnend mit Ende des Jahres, in dem der Anspruch entstand.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["regel","frist"]
    },
    {
      "Begriff": "Insolvenz",
      "Erklärung": "Zahlungsunfähigkeit oder Überschuldung. Geschäftsführer einer GmbH müssen dann unverzüglich Insolvenz anmelden.",
      "Bereich": "Recht & Verträge",
      "Link": "",
      "class": ["regel","insolvenzantrag"]
    },
    {
      "Begriff": "Betriebshaftpflicht",
      "Erklärung": "Deckt Schäden, die das Unternehmen Dritten zufügt. Für fast jedes Unternehmen wichtig.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["begriff","versicherung"]
    },
    {
      "Begriff": "Berufshaftpflicht",
      "Erklärung": "Deckt Vermögensschäden durch fachliche Fehler, z. B. bei Beratern, IT-Dienstleistern.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["begriff","versicherung"]
    },
    {
      "Begriff": "Krankenversicherung (Selbstständige)",
      "Erklärung": "Pflicht für alle: gesetzlich (freiwillig) oder privat. Beiträge vom Einkommen bzw. nach Tarif.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["regel","versicherung"]
    },
    {
      "Begriff": "Altersvorsorge (Selbstständige)",
      "Erklärung": "Meist keine Rentenpflicht – selbst vorsorgen, z. B. über ETF-Sparplan, Rürup-Rente oder freiwillig gesetzlich.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["strategie","rente"]
    },
    {
      "Begriff": "Risikomanagement",
      "Erklärung": "Risiken erkennen, bewerten (Wahrscheinlichkeit · Schaden), vermeiden, vermindern, versichern oder tragen.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["strategie","risiko"]
    },
    {
      "Begriff": "Abhängigkeit von Großkunden",
      "Erklärung": "Mehr als ca. 30 % Umsatz mit einem Kunden ist ein Klumpenrisiko.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["regel","klumpenrisiko"]
    },
    {
      "Begriff": "Liquiditätsreserve",
      "Erklärung": "Rücklage für mehrere Monate Fixkosten, um Umsatzeinbrüche zu überstehen.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["regel","reserve"]
    },
    {
      "Begriff": "Datensicherung",
      "Erklärung": "Regelmäßige Backups nach der 3-2-1-Regel: 3 Kopien, 2 Medien, 1 außer Haus.",
      "Bereich": "Risiko & Absicherung",
      "Link": "",
      "class": ["regel","backup"]
    }
  ]}
};

console.log("[entries] wirtschaft/entries.js geladen:", window.SpickerData["wirtschaft"].oTableEntries.List.length, "Einträge");
