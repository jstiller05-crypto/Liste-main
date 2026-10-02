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
      "Erklärung": "Aufbau, Filter und Lerntipps",
      "Bereich": "Spicker",
      "Link": "more/anleitung.html",
      "class": ["hilfe","anleitung","bedienung","lerntipps"]
    },
    {
      "Begriff": "Betriebswirtschaftslehre (BWL)",
      "Erklärung": "Wie Unternehmen planen und wirtschaften.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/bwl-grundlagen.html",
      "class": ["begriff","bwl"]
    },
    {
      "Begriff": "Ökonomisches Prinzip",
      "Erklärung": "Maximal- oder Minimalprinzip.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/bwl-grundlagen.html",
      "class": ["regel","wirtschaftlichkeit"]
    },
    {
      "Begriff": "Produktionsfaktoren",
      "Erklärung": "Arbeit, Betriebsmittel, Werkstoffe.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/bwl-grundlagen.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Angebot und Nachfrage",
      "Erklärung": "Bestimmen gemeinsam den Marktpreis.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/bwl-grundlagen.html",
      "class": ["regel","markt","preis"]
    },
    {
      "Begriff": "Wertschöpfungskette",
      "Erklärung": "Alle Schritte, die Kundenwert schaffen.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/bwl-grundlagen.html",
      "class": ["begriff","porter"]
    },
    {
      "Begriff": "Geschäftsmodell",
      "Erklärung": "Wie du Wert schaffst und Geld verdienst.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/geschaeftsmodell.html",
      "class": ["begriff","business model canvas"]
    },
    {
      "Begriff": "SWOT-Analyse",
      "Erklärung": "Stärken, Schwächen, Chancen, Risiken.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/geschaeftsmodell.html",
      "class": ["strategie","analyse"]
    },
    {
      "Begriff": "Zielgruppe",
      "Erklärung": "Genau beschriebene Wunschkunden.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/geschaeftsmodell.html",
      "class": ["begriff","kunde"]
    },
    {
      "Begriff": "Alleinstellungsmerkmal (USP)",
      "Erklärung": "Was dich klar von anderen abhebt.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/geschaeftsmodell.html",
      "class": ["begriff","usp"]
    },
    {
      "Begriff": "Skaleneffekt",
      "Erklärung": "Mehr Menge → kleinere Stückkosten.",
      "Bereich": "BWL-Grundlagen",
      "Link": "more/bwl-grundlagen.html",
      "class": ["regel","economies of scale"]
    },
    {
      "Begriff": "Einzelunternehmen",
      "Erklärung": "Eine Person, volle private Haftung.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/rechtsformen.html",
      "class": ["begriff","rechtsform"]
    },
    {
      "Begriff": "Freiberufler",
      "Erklärung": "Katalogberufe, keine Gewerbesteuer.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/rechtsformen.html",
      "class": ["begriff","selbstständig"]
    },
    {
      "Begriff": "Gewerbeanmeldung",
      "Erklärung": "Beim Gewerbeamt vor dem Start.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/gruendung.html",
      "class": ["regel","gewerbe"]
    },
    {
      "Begriff": "GbR",
      "Erklärung": "Ab 2 Personen, Gesellschafter haften privat.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/rechtsformen.html",
      "class": ["begriff","rechtsform"]
    },
    {
      "Begriff": "GmbH",
      "Erklärung": "25.000 € Kapital, Haftung beschränkt.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/rechtsformen.html",
      "class": ["begriff","rechtsform","haftung"]
    },
    {
      "Begriff": "UG (haftungsbeschränkt)",
      "Erklärung": "Mini-GmbH ab 1 €, 25 % Rücklage.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/rechtsformen.html",
      "class": ["begriff","rechtsform"]
    },
    {
      "Begriff": "Handelsregister",
      "Erklärung": "Öffentliches Register der Firmen.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/gruendung.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Businessplan",
      "Erklärung": "Konzept mit Markt- und Finanzplan.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/gruendung.html",
      "class": ["strategie","gründung"]
    },
    {
      "Begriff": "Haftung",
      "Erklärung": "Wer mit welchem Vermögen einsteht.",
      "Bereich": "Gründung & Rechtsformen",
      "Link": "more/rechtsformen.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Buchführungspflicht",
      "Erklärung": "Wer bilanzieren muss, wer EÜR darf.",
      "Bereich": "Buchhaltung",
      "Link": "more/buchfuehrung.html",
      "class": ["regel","hgb"]
    },
    {
      "Begriff": "EÜR",
      "Erklärung": "Gewinn = Einnahmen − Ausgaben.",
      "Bereich": "Buchhaltung",
      "Link": "more/buchfuehrung.html",
      "class": ["formel","gewinnermittlung"]
    },
    {
      "Begriff": "Doppelte Buchführung",
      "Erklärung": "Jede Buchung im Soll und im Haben.",
      "Bereich": "Buchhaltung",
      "Link": "more/buchfuehrung.html",
      "class": ["regel","doppik"]
    },
    {
      "Begriff": "Buchungssatz",
      "Erklärung": "„Soll an Haben“, z. B. Bank an Erlöse.",
      "Bereich": "Buchhaltung",
      "Link": "more/buchungssatz.html",
      "class": ["regel","soll","haben"]
    },
    {
      "Begriff": "Kontenrahmen",
      "Erklärung": "Kontenliste, meist SKR 03 / SKR 04.",
      "Bereich": "Buchhaltung",
      "Link": "more/buchfuehrung.html",
      "class": ["begriff","skr"]
    },
    {
      "Begriff": "Beleg",
      "Erklärung": "Keine Buchung ohne Beleg.",
      "Bereich": "Buchhaltung",
      "Link": "more/buchfuehrung.html",
      "class": ["regel","rechnung"]
    },
    {
      "Begriff": "Pflichtangaben Rechnung",
      "Erklärung": "Was laut § 14 UStG draufstehen muss.",
      "Bereich": "Buchhaltung",
      "Link": "more/rechnung.html",
      "class": ["regel","rechnung"]
    },
    {
      "Begriff": "E-Rechnung",
      "Erklärung": "XRechnung/ZUGFeRD, Empfang seit 2025.",
      "Bereich": "Buchhaltung",
      "Link": "more/rechnung.html",
      "class": ["regel","xrechnung","zugferd"]
    },
    {
      "Begriff": "Aufbewahrungsfristen",
      "Erklärung": "10 / 8 / 6 Jahre aufbewahren.",
      "Bereich": "Buchhaltung",
      "Link": "more/aufbewahrung-gobd.html",
      "class": ["regel","archiv"]
    },
    {
      "Begriff": "GoBD",
      "Erklärung": "Regeln für digitale Buchführung.",
      "Bereich": "Buchhaltung",
      "Link": "more/aufbewahrung-gobd.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Abschreibung (AfA)",
      "Erklärung": "Kaufpreis über die Nutzungsdauer verteilen.",
      "Bereich": "Buchhaltung",
      "Link": "more/abschreibung.html",
      "class": ["regel","afa"]
    },
    {
      "Begriff": "Lineare Abschreibung",
      "Erklärung": "AfA = Kosten / Nutzungsdauer.",
      "Bereich": "Buchhaltung",
      "Link": "more/abschreibung.html",
      "class": ["formel","afa"]
    },
    {
      "Begriff": "Geringwertiges Wirtschaftsgut (GWG)",
      "Erklärung": "Bis 800 € netto sofort absetzbar.",
      "Bereich": "Buchhaltung",
      "Link": "more/abschreibung.html",
      "class": ["regel","gwg"]
    },
    {
      "Begriff": "Bilanz",
      "Erklärung": "Vermögen (Aktiva) = Kapital (Passiva).",
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
      "Erklärung": "Rechte Seite: Eigen- und Fremdkapital.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff","kapital"]
    },
    {
      "Begriff": "Anlagevermögen",
      "Erklärung": "Bleibt dauerhaft im Betrieb.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Umlaufvermögen",
      "Erklärung": "Vorräte, Forderungen, Bank.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Eigenkapital",
      "Erklärung": "Vermögen minus Schulden.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/bilanz.html",
      "class": ["formel","ek"]
    },
    {
      "Begriff": "Rückstellungen",
      "Erklärung": "Schulden mit unsicherer Höhe.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/jahresabschluss.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "GuV",
      "Erklärung": "Erträge − Aufwendungen = Ergebnis.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/guv.html",
      "class": ["formel","erfolgsrechnung"]
    },
    {
      "Begriff": "Aufwand vs. Ausgabe",
      "Erklärung": "Werteverzehr ist nicht Geldabfluss.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/guv.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Inventur",
      "Erklärung": "Alles zählen zum Jahresende.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/jahresabschluss.html",
      "class": ["begriff","inventar"]
    },
    {
      "Begriff": "Jahresabschluss",
      "Erklärung": "Bilanz + GuV (+ Anhang).",
      "Bereich": "Bilanz & GuV",
      "Link": "more/jahresabschluss.html",
      "class": ["regel","offenlegung"]
    },
    {
      "Begriff": "Cashflow",
      "Erklärung": "Geldzufluss minus Geldabfluss.",
      "Bereich": "Bilanz & GuV",
      "Link": "more/liquiditaet.html",
      "class": ["kennzahl","liquidität"]
    },
    {
      "Begriff": "Umsatz",
      "Erklärung": "Menge × Preis, netto.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","erlös"]
    },
    {
      "Begriff": "Gewinn",
      "Erklärung": "Erträge − Aufwendungen.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","jahresüberschuss"]
    },
    {
      "Begriff": "Umsatzrendite",
      "Erklärung": "Gewinn / Umsatz × 100 %.",
      "Bereich": "Kennzahlen",
      "Link": "more/guv.html",
      "class": ["formel","marge"]
    },
    {
      "Begriff": "Eigenkapitalrendite",
      "Erklärung": "Gewinn / Eigenkapital × 100 %.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","roe"]
    },
    {
      "Begriff": "Gesamtkapitalrendite",
      "Erklärung": "(Gewinn + Zinsen) / Gesamtkapital.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","roi"]
    },
    {
      "Begriff": "ROI",
      "Erklärung": "Gewinn / eingesetztes Kapital.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Eigenkapitalquote",
      "Erklärung": "Eigenkapital / Gesamtkapital.",
      "Bereich": "Kennzahlen",
      "Link": "more/bilanz.html",
      "class": ["formel","ek-quote"]
    },
    {
      "Begriff": "Verschuldungsgrad",
      "Erklärung": "Fremdkapital / Eigenkapital.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Liquiditätsgrade",
      "Erklärung": "Flüssige Mittel / kurzfr. Schulden.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","liquidität"]
    },
    {
      "Begriff": "EBIT / EBITDA",
      "Erklärung": "Gewinn vor Zinsen, Steuern (und AfA).",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["kennzahl"]
    },
    {
      "Begriff": "Rohertrag",
      "Erklärung": "Umsatz − Wareneinsatz.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","handelsspanne"]
    },
    {
      "Begriff": "Lagerumschlag",
      "Erklärung": "Wie oft sich das Lager pro Jahr leert.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Debitorenlaufzeit (DSO)",
      "Erklärung": "Tage bis Kunden im Schnitt zahlen.",
      "Bereich": "Kennzahlen",
      "Link": "more/kennzahlen.html",
      "class": ["formel","forderungen"]
    },
    {
      "Begriff": "Umsatzsteuer",
      "Erklärung": "19 % / 7 % auf den Nettopreis.",
      "Bereich": "Steuern",
      "Link": "more/umsatzsteuer.html",
      "class": ["regel","mehrwertsteuer","ust"]
    },
    {
      "Begriff": "Vorsteuer",
      "Erklärung": "USt auf Einkäufe, wird verrechnet.",
      "Bereich": "Steuern",
      "Link": "more/umsatzsteuer.html",
      "class": ["formel","zahllast"]
    },
    {
      "Begriff": "Umsatzsteuer-Voranmeldung",
      "Erklärung": "Monatlich/quartalsweise per ELSTER.",
      "Bereich": "Steuern",
      "Link": "more/umsatzsteuer.html",
      "class": ["regel","elster","ustva"]
    },
    {
      "Begriff": "Kleinunternehmerregelung",
      "Erklärung": "Keine USt bis 25.000 € Vorjahresumsatz.",
      "Bereich": "Steuern",
      "Link": "more/umsatzsteuer.html",
      "class": ["regel","§19 ustg"]
    },
    {
      "Begriff": "Einkommensteuer",
      "Erklärung": "Steuer auf den Gewinn von Personen.",
      "Bereich": "Steuern",
      "Link": "more/ertragsteuern.html",
      "class": ["regel","est"]
    },
    {
      "Begriff": "Gewerbesteuer",
      "Erklärung": "Gemeindesteuer, Freibetrag 24.500 €.",
      "Bereich": "Steuern",
      "Link": "more/ertragsteuern.html",
      "class": ["regel","hebesatz"]
    },
    {
      "Begriff": "Körperschaftsteuer",
      "Erklärung": "15 % + Soli für GmbH und UG.",
      "Bereich": "Steuern",
      "Link": "more/ertragsteuern.html",
      "class": ["regel","kst"]
    },
    {
      "Begriff": "Betriebsausgaben",
      "Erklärung": "Betriebliche Kosten mindern den Gewinn.",
      "Bereich": "Steuern",
      "Link": "more/ertragsteuern.html",
      "class": ["begriff","absetzen"]
    },
    {
      "Begriff": "Steuerrücklagen",
      "Erklärung": "30–40 % des Gewinns zurücklegen.",
      "Bereich": "Steuern",
      "Link": "more/ertragsteuern.html",
      "class": ["regel","rücklage"]
    },
    {
      "Begriff": "Reverse-Charge",
      "Erklärung": "Kunde schuldet die Umsatzsteuer.",
      "Bereich": "Steuern",
      "Link": "more/umsatzsteuer.html",
      "class": ["regel","§13b"]
    },
    {
      "Begriff": "Fixkosten",
      "Erklärung": "Kosten, die immer anfallen.",
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
      "Erklärung": "Preis aus Kosten + Zuschlägen bauen.",
      "Bereich": "Kostenrechnung",
      "Link": "more/kalkulation.html",
      "class": ["formel","preis"]
    },
    {
      "Begriff": "Stundensatz",
      "Erklärung": "Jahresbedarf / abrechenbare Stunden.",
      "Bereich": "Kostenrechnung",
      "Link": "more/kalkulation.html",
      "class": ["formel","freelancer"]
    },
    {
      "Begriff": "Gemeinkosten",
      "Erklärung": "Indirekte Kosten, per Zuschlag verteilt.",
      "Bereich": "Kostenrechnung",
      "Link": "more/kalkulation.html",
      "class": ["begriff","overhead"]
    },
    {
      "Begriff": "Kostenstelle",
      "Erklärung": "Bereich, in dem Kosten entstehen.",
      "Bereich": "Kostenrechnung",
      "Link": "more/kalkulation.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Opportunitätskosten",
      "Erklärung": "Entgangener Nutzen der Alternative.",
      "Bereich": "Kostenrechnung",
      "Link": "more/kalkulation.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Liquidität",
      "Erklärung": "Rechnungen pünktlich zahlen können.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/liquiditaet.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Liquiditätsplan",
      "Erklärung": "Ein- und Auszahlungen je Monat planen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/liquiditaet.html",
      "class": ["strategie","finanzplan"]
    },
    {
      "Begriff": "Eigenfinanzierung",
      "Erklärung": "Mit eigenem Geld oder Gewinnen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Fremdfinanzierung",
      "Erklärung": "Mit Krediten und Darlehen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["begriff","kredit"]
    },
    {
      "Begriff": "Kontokorrentkredit",
      "Erklärung": "Dispo: flexibel, aber teuer.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["begriff","dispo"]
    },
    {
      "Begriff": "Leasing",
      "Erklärung": "Mieten statt kaufen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Factoring",
      "Erklärung": "Offene Rechnungen verkaufen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["begriff","forderungen"]
    },
    {
      "Begriff": "Fördermittel",
      "Erklärung": "Zuschüsse, KfW – vorher beantragen.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["regel","kfw"]
    },
    {
      "Begriff": "Skonto",
      "Erklärung": "Rabatt bei schneller Zahlung.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/finanzierung.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Mahnwesen",
      "Erklärung": "Erinnerung → Mahnung → Mahnbescheid.",
      "Bereich": "Finanzierung & Liquidität",
      "Link": "more/mahnwesen.html",
      "class": ["regel","mahnung","verzug"]
    },
    {
      "Begriff": "Controlling",
      "Erklärung": "Planen, messen, vergleichen, steuern.",
      "Bereich": "Controlling & Planung",
      "Link": "more/controlling.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Soll-Ist-Vergleich",
      "Erklärung": "Plan und Wirklichkeit vergleichen.",
      "Bereich": "Controlling & Planung",
      "Link": "more/controlling.html",
      "class": ["strategie","abweichung"]
    },
    {
      "Begriff": "BWA",
      "Erklärung": "Monatlicher Kurzbericht aus der Buchhaltung.",
      "Bereich": "Controlling & Planung",
      "Link": "more/controlling.html",
      "class": ["begriff","datev"]
    },
    {
      "Begriff": "KPI",
      "Erklärung": "Die wichtigsten Erfolgskennzahlen.",
      "Bereich": "Controlling & Planung",
      "Link": "more/controlling.html",
      "class": ["begriff","kennzahl"]
    },
    {
      "Begriff": "SMART-Ziele",
      "Erklärung": "Spezifisch, messbar, …, terminiert.",
      "Bereich": "Controlling & Planung",
      "Link": "more/controlling.html",
      "class": ["regel","ziel"]
    },
    {
      "Begriff": "Budget",
      "Erklärung": "Festgelegter Betrag für einen Zeitraum.",
      "Bereich": "Controlling & Planung",
      "Link": "more/controlling.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Investitionsrechnung",
      "Erklärung": "Prüfen, ob sich eine Investition lohnt.",
      "Bereich": "Controlling & Planung",
      "Link": "more/investitionsrechnung.html",
      "class": ["strategie"]
    },
    {
      "Begriff": "Amortisationsdauer",
      "Erklärung": "Investition / jährlicher Rückfluss.",
      "Bereich": "Controlling & Planung",
      "Link": "more/investitionsrechnung.html",
      "class": ["formel","payback"]
    },
    {
      "Begriff": "Kapitalwert (NPV)",
      "Erklärung": "Abgezinste Rückflüsse − Investition.",
      "Bereich": "Controlling & Planung",
      "Link": "more/investitionsrechnung.html",
      "class": ["formel","abzinsung"]
    },
    {
      "Begriff": "Arbeitsvertrag",
      "Erklärung": "Regelt Tätigkeit, Lohn, Zeit, Urlaub.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["regel","nachweisgesetz"]
    },
    {
      "Begriff": "Mindestlohn",
      "Erklärung": "13,90 € pro Stunde (2026).",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["regel","lohn"]
    },
    {
      "Begriff": "Minijob",
      "Erklärung": "Bis 603 € im Monat, pauschale Abgaben.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["begriff","geringfügig"]
    },
    {
      "Begriff": "Lohnnebenkosten",
      "Erklärung": "AG-Anteile Sozialversicherung + Umlagen.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["kennzahl","sozialversicherung"]
    },
    {
      "Begriff": "Brutto / Netto",
      "Erklärung": "Vereinbarter Lohn vs. Auszahlung.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["begriff","lohn"]
    },
    {
      "Begriff": "Probezeit",
      "Erklärung": "Max. 6 Monate, 2 Wochen Kündigungsfrist.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["regel","kündigung"]
    },
    {
      "Begriff": "Arbeitsschutz",
      "Erklärung": "Gefährdungen beurteilen, Personal schützen.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Scheinselbstständigkeit",
      "Erklärung": "Freelancer arbeitet wie ein Angestellter.",
      "Bereich": "Personal",
      "Link": "more/personal.html",
      "class": ["regel","freelancer"]
    },
    {
      "Begriff": "Marketing-Mix (4P)",
      "Erklärung": "Product, Price, Place, Promotion.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/marketing.html",
      "class": ["begriff","4p"]
    },
    {
      "Begriff": "Customer Journey",
      "Erklärung": "Weg des Kunden vom Kontakt bis danach.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/marketing.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Conversion Rate",
      "Erklärung": "Käufer / Besucher × 100 %.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/vertrieb-kennzahlen.html",
      "class": ["formel","konversion"]
    },
    {
      "Begriff": "Kundenakquisekosten (CAC)",
      "Erklärung": "Was ein neuer Kunde kostet.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/vertrieb-kennzahlen.html",
      "class": ["formel","cac"]
    },
    {
      "Begriff": "Customer Lifetime Value",
      "Erklärung": "Was ein Kunde insgesamt einbringt.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/vertrieb-kennzahlen.html",
      "class": ["formel","clv","ltv"]
    },
    {
      "Begriff": "Wiederkehrende Umsätze",
      "Erklärung": "Abo- und Wartungsumsatz pro Monat.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/vertrieb-kennzahlen.html",
      "class": ["strategie","abo","mrr"]
    },
    {
      "Begriff": "Preisstrategie",
      "Erklärung": "Kosten-, konkurrenz- oder wertorientiert.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/marketing.html",
      "class": ["strategie","preis"]
    },
    {
      "Begriff": "Impressumspflicht",
      "Erklärung": "Anbieterangaben nach § 5 DDG.",
      "Bereich": "Marketing & Vertrieb",
      "Link": "more/datenschutz-impressum.html",
      "class": ["regel","webseite"]
    },
    {
      "Begriff": "Vertrag",
      "Erklärung": "Angebot + Annahme = Vertrag.",
      "Bereich": "Recht & Verträge",
      "Link": "more/vertraege-agb.html",
      "class": ["regel","bgb"]
    },
    {
      "Begriff": "AGB",
      "Erklärung": "Vorformulierte Vertragsbedingungen.",
      "Bereich": "Recht & Verträge",
      "Link": "more/vertraege-agb.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Gewährleistung",
      "Erklärung": "2 Jahre gesetzliche Mängelhaftung.",
      "Bereich": "Recht & Verträge",
      "Link": "more/vertraege-agb.html",
      "class": ["regel","mängel"]
    },
    {
      "Begriff": "Widerrufsrecht",
      "Erklärung": "14 Tage für Verbraucher online.",
      "Bereich": "Recht & Verträge",
      "Link": "more/vertraege-agb.html",
      "class": ["regel","fernabsatz"]
    },
    {
      "Begriff": "Dienst- vs. Werkvertrag",
      "Erklärung": "Tätigkeit oder Ergebnis geschuldet.",
      "Bereich": "Recht & Verträge",
      "Link": "more/vertraege-agb.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "DSGVO",
      "Erklärung": "Regeln für personenbezogene Daten.",
      "Bereich": "Recht & Verträge",
      "Link": "more/datenschutz-impressum.html",
      "class": ["regel","datenschutz"]
    },
    {
      "Begriff": "Verjährung",
      "Erklärung": "3 Jahre, ab Ende des Entstehungsjahres.",
      "Bereich": "Recht & Verträge",
      "Link": "more/mahnwesen.html",
      "class": ["regel","frist"]
    },
    {
      "Begriff": "Insolvenz",
      "Erklärung": "Zahlungsunfähig oder überschuldet.",
      "Bereich": "Recht & Verträge",
      "Link": "more/liquiditaet.html",
      "class": ["regel","insolvenzantrag"]
    },
    {
      "Begriff": "Betriebshaftpflicht",
      "Erklärung": "Personen- und Sachschäden bei Dritten.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/versicherungen.html",
      "class": ["begriff","versicherung"]
    },
    {
      "Begriff": "Berufshaftpflicht",
      "Erklärung": "Vermögensschäden durch fachliche Fehler.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/versicherungen.html",
      "class": ["begriff","versicherung"]
    },
    {
      "Begriff": "Krankenversicherung (Selbstständige)",
      "Erklärung": "Pflicht: gesetzlich oder privat.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/versicherungen.html",
      "class": ["regel","versicherung"]
    },
    {
      "Begriff": "Altersvorsorge (Selbstständige)",
      "Erklärung": "Selbst vorsorgen, z. B. ETF oder Rürup.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/versicherungen.html",
      "class": ["strategie","rente"]
    },
    {
      "Begriff": "Risikomanagement",
      "Erklärung": "Risiken erkennen, bewerten, behandeln.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/risikomanagement.html",
      "class": ["strategie","risiko"]
    },
    {
      "Begriff": "Abhängigkeit von Großkunden",
      "Erklärung": "Über 30 % Umsatz = Klumpenrisiko.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/risikomanagement.html",
      "class": ["regel","klumpenrisiko"]
    },
    {
      "Begriff": "Liquiditätsreserve",
      "Erklärung": "Polster für 3–6 Monate Fixkosten.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/liquiditaet.html",
      "class": ["regel","reserve"]
    },
    {
      "Begriff": "Datensicherung",
      "Erklärung": "Backups nach der 3-2-1-Regel.",
      "Bereich": "Risiko & Absicherung",
      "Link": "more/risikomanagement.html",
      "class": ["regel","backup"]
    }
  ]}
};

console.log("[entries] wirtschaft/entries.js geladen:", window.SpickerData["wirtschaft"].oTableEntries.List.length, "Einträge");
