/* =====================================================================
   links.js – Smart-Link-Daten für den Wirtschaft-Spicker
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
  { words: ["Bilanz", "Aktiva", "Passiva", "Eigenkapital", "Fremdkapital", "Anlagevermögen", "Umlaufvermögen", "Eigenkapitalquote"], links: { all: "bilanz.html" } },
  { words: ["GuV", "Gewinn- und Verlustrechnung", "Jahresüberschuss", "Aufwendungen", "Erträge", "Umsatzrendite"], links: { all: "guv.html" } },
  { words: ["Break-even", "Break-even-Point", "Gewinnschwelle", "Fixkosten", "variable Kosten", "Variable Kosten", "Deckungsbeitrag"], links: { all: "break-even.html" } },
  { words: ["BWL", "Betriebswirtschaftslehre", "Ökonomisches Prinzip", "Maximalprinzip", "Minimalprinzip", "Produktionsfaktoren", "Wertschöpfungskette", "Skaleneffekt", "Skaleneffekte", "Stückkosten"], links: { all: "bwl-grundlagen.html" } },
  { words: ["Geschäftsmodell", "Geschäftsmodells", "Business Model Canvas", "SWOT", "SWOT-Analyse", "Zielgruppe", "Zielgruppen", "USP", "Alleinstellungsmerkmal"], links: { all: "geschaeftsmodell.html" } },
  { words: ["Rechtsform", "Rechtsformen", "Einzelunternehmen", "Einzelunternehmer", "GbR", "GmbH", "UG", "UG (haftungsbeschränkt)", "Stammkapital", "Haftung", "Freiberufler", "Kapitalgesellschaft", "Kapitalgesellschaften"], links: { all: "rechtsformen.html" } },
  { words: ["Gewerbeanmeldung", "Gewerbeamt", "Handelsregister", "Businessplan", "Fragebogen zur steuerlichen Erfassung", "Gründung"], links: { all: "gruendung.html" } },
  { words: ["Buchführung", "Buchhaltung", "EÜR", "Einnahmen-Überschuss-Rechnung", "doppelte Buchführung", "Kontenrahmen", "SKR 03", "SKR 04", "Beleg", "Belege", "Buchführungspflicht"], links: { all: "buchfuehrung.html" } },
  { words: ["Buchungssatz", "Buchungssätze", "Soll an Haben", "T-Konto", "T-Konten"], links: { all: "buchungssatz.html" } },
  { words: ["Rechnung schreiben", "Pflichtangaben", "E-Rechnung", "XRechnung", "ZUGFeRD", "Kleinbetragsrechnung", "Rechnungsnummer"], links: { all: "rechnung.html" } },
  { words: ["GoBD", "Aufbewahrungsfrist", "Aufbewahrungsfristen", "Verfahrensdokumentation"], links: { all: "aufbewahrung-gobd.html" } },
  { words: ["Abschreibung", "Abschreibungen", "AfA", "GWG", "geringwertiges Wirtschaftsgut", "Nutzungsdauer", "Restbuchwert"], links: { all: "abschreibung.html" } },
  { words: ["Jahresabschluss", "Inventur", "Inventar", "Rückstellung", "Rückstellungen", "Offenlegung"], links: { all: "jahresabschluss.html" } },
  { words: ["Kennzahl", "Kennzahlen", "Eigenkapitalrendite", "Gesamtkapitalrendite", "ROI", "Verschuldungsgrad", "Liquiditätsgrad", "Liquiditätsgrade", "EBIT", "EBITDA", "Rohertrag", "Lagerumschlag", "Debitorenlaufzeit", "DSO"], links: { all: "kennzahlen.html" } },
  { words: ["Umsatzsteuer", "Mehrwertsteuer", "Vorsteuer", "Zahllast", "Umsatzsteuer-Voranmeldung", "UStVA", "Kleinunternehmer", "Kleinunternehmerregelung", "Reverse-Charge", "USt-IdNr."], links: { all: "umsatzsteuer.html" } },
  { words: ["Einkommensteuer", "Gewerbesteuer", "Körperschaftsteuer", "Hebesatz", "Betriebsausgaben", "Betriebsausgabe", "Steuerrücklage", "Steuerrücklagen", "Grundfreibetrag", "Vorauszahlungen"], links: { all: "ertragsteuern.html" } },
  { words: ["Kalkulation", "Stundensatz", "Stundensätze", "Gemeinkosten", "Zuschlagskalkulation", "Selbstkosten", "Kostenstelle", "Kostenstellen", "Opportunitätskosten"], links: { all: "kalkulation.html" } },
  { words: ["Liquidität", "Liquiditätsplan", "Liquiditätsreserve", "Cashflow", "Zahlungsunfähigkeit", "Insolvenz", "Überschuldung"], links: { all: "liquiditaet.html" } },
  { words: ["Finanzierung", "Eigenfinanzierung", "Fremdfinanzierung", "Kontokorrentkredit", "Leasing", "Factoring", "Fördermittel", "KfW", "Skonto", "Darlehen"], links: { all: "finanzierung.html" } },
  { words: ["Mahnwesen", "Mahnung", "Mahnungen", "Mahnbescheid", "Zahlungserinnerung", "Verzug", "Verzugszinsen", "Verjährung", "Verjährungsfrist"], links: { all: "mahnwesen.html" } },
  { words: ["Controlling", "Soll-Ist-Vergleich", "BWA", "KPI", "KPIs", "SMART", "SMART-Ziele", "Budget"], links: { all: "controlling.html" } },
  { words: ["Investitionsrechnung", "Amortisation", "Amortisationsdauer", "Kapitalwert", "NPV", "Barwert", "abgezinst"], links: { all: "investitionsrechnung.html" } },
  { words: ["Arbeitsvertrag", "Mindestlohn", "Minijob", "Minijobs", "Lohnnebenkosten", "Probezeit", "Arbeitsschutz", "Scheinselbstständigkeit", "Brutto / Netto", "Sozialversicherung"], links: { all: "personal.html" } },
  { words: ["Marketing", "Marketing-Mix", "4P", "Customer Journey", "Preisstrategie", "Touchpoint"], links: { all: "marketing.html" } },
  { words: ["Conversion Rate", "Conversion", "CAC", "Kundenakquisekosten", "Customer Lifetime Value", "CLV", "MRR", "wiederkehrende Umsätze", "Verkaufstrichter"], links: { all: "vertrieb-kennzahlen.html" } },
  { words: ["Vertrag", "Verträge", "AGB", "Gewährleistung", "Widerrufsrecht", "Widerruf", "Werkvertrag", "Dienstvertrag", "Abnahme"], links: { all: "vertraege-agb.html" } },
  { words: ["DSGVO", "Datenschutz", "Datenschutzerklärung", "Impressum", "Impressumspflicht", "personenbezogene Daten", "DDG"], links: { all: "datenschutz-impressum.html" } },
  { words: ["Versicherung", "Versicherungen", "Betriebshaftpflicht", "Berufshaftpflicht", "Krankenversicherung", "Altersvorsorge", "Berufsunfähigkeit"], links: { all: "versicherungen.html" } },
  { words: ["Risikomanagement", "Risikomatrix", "Klumpenrisiko", "Großkunden", "Datensicherung", "Backup", "Backups", "3-2-1-Regel"], links: { all: "risikomanagement.html" } }
];

console.log("[smart-link] wirtschaft/links.js geladen:", smartLinkRules.length, "Wort-Regeln");
