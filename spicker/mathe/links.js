/* =====================================================================
   links.js – Smart-Link-Daten für den Mathe-Spicker
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
  { words: ["Variable", "Variablen", "Term", "Terme", "Gleichung", "Gleichungen", "Unbekannte", "Parameter"], links: { all: "variablen-terme.html" } },
  { words: ["Funktion", "Funktionen", "Wertetabelle", "Graph", "Graphen", "Definitionsbereich", "Wertebereich", "Nullstelle"], links: { all: "funktion.html" } },
  { words: ["lineare Funktion", "lineare Funktionen", "Steigung", "y-Achsenabschnitt", "Steigungsdreieck"], links: { all: "lineare-funktion.html" } },
  { words: ["Pythagoras", "Hypotenuse", "Kathete", "Katheten", "rechtwinkligen Dreieck", "rechtwinkliges Dreieck"], links: { all: "pythagoras.html" } },
  { words: ["Zahlenmenge", "Zahlenmengen", "natürliche Zahlen", "ganze Zahlen", "rationale Zahlen", "reelle Zahlen", "Punkt vor Strich", "Runden"], links: { all: "zahlen.html" } },
  { words: ["Primzahl", "Primzahlen", "Primfaktor", "Primfaktoren", "Primfaktorzerlegung", "ggT", "kgV", "Teilbarkeit", "Teilbarkeitsregeln", "Quersumme"], links: { all: "teiler-primzahlen.html" } },
  { words: ["Bruch", "Brüche", "Bruchrechnen", "Zähler", "Nenner", "Kehrwert", "Hauptnenner", "Kürzen", "Erweitern"], links: { all: "brueche.html" } },
  { words: ["Prozent", "Prozentsatz", "Prozentwert", "Grundwert", "Prozentrechnung", "Dreisatz", "proportional", "antiproportional"], links: { all: "prozent.html" } },
  { words: ["binomische Formel", "binomische Formeln", "binomischen Formeln", "Ausklammern", "ausmultiplizieren", "Faktorisieren"], links: { all: "binomische-formeln.html" } },
  { words: ["Potenz", "Potenzen", "Potenzgesetze", "Exponent", "Exponenten", "Wurzel", "Wurzeln", "Quadratwurzel", "Radikand", "Logarithmus", "Logarithmen", "wissenschaftliche Schreibweise", "Zehnerpotenz"], links: { all: "potenzen-wurzeln-log.html" } },
  { words: ["quadratische Gleichung", "quadratische Gleichungen", "pq-Formel", "Mitternachtsformel", "abc-Formel", "Diskriminante", "quadratische Ergänzung"], links: { all: "quadratische-gleichungen.html" } },
  { words: ["Gleichungssystem", "Gleichungssysteme", "LGS", "Gauß-Verfahren", "Matrix", "Matrizen", "Determinante", "Einsetzungsverfahren", "Gleichsetzungsverfahren", "Additionsverfahren"], links: { all: "gleichungssysteme.html" } },
  { words: ["Ungleichung", "Ungleichungen", "Betrag", "Intervall", "Intervalle", "Betragsstriche"], links: { all: "ungleichungen-betrag.html" } },
  { words: ["Parabel", "Parabeln", "quadratische Funktion", "quadratische Funktionen", "Scheitelpunkt", "Scheitelpunktform", "Normalparabel"], links: { all: "quadratische-funktion.html" } },
  { words: ["Exponentialfunktion", "Exponentialfunktionen", "exponentiell", "exponentielles Wachstum", "Eulersche Zahl", "Halbwertszeit", "Verdopplungszeit", "Wachstumsfaktor"], links: { all: "exponentialfunktion.html" } },
  { words: ["Polynom", "Polynome", "Polynomfunktion", "ganzrationale Funktion", "Achsensymmetrie", "achsensymmetrisch", "Punktsymmetrie", "punktsymmetrisch", "Leitkoeffizient"], links: { all: "polynomfunktion.html" } },
  { words: ["Flächeninhalt", "Umfang", "Winkelsumme", "Rechteck", "Parallelogramm", "Trapez", "Grundseite"], links: { all: "flaechen.html" } },
  { words: ["Kreis", "Kreise", "Radius", "Durchmesser", "Kreiszahl", "Kreisbogen", "Kreissektor", "Thales", "Satz des Thales"], links: { all: "kreis.html" } },
  { words: ["Volumen", "Oberfläche", "Quader", "Würfel", "Zylinder", "Kegel", "Pyramide", "Kugel", "Mantelfläche", "Grundfläche"], links: { all: "koerper.html" } },
  { words: ["kongruent", "Kongruenz", "ähnlich", "Ähnlichkeit", "Strahlensatz", "Strahlensätze", "Streckfaktor"], links: { all: "aehnlichkeit.html" } },
  { words: ["Sinus", "Kosinus", "Tangens", "Trigonometrie", "Ankathete", "Gegenkathete", "Sinussatz", "Kosinussatz"], links: { all: "trigonometrie.html" } },
  { words: ["Einheitskreis", "Bogenmaß", "Sinusfunktion", "Sinuskurve", "Amplitude", "Periode", "Radiant"], links: { all: "einheitskreis.html" } },
  { words: ["Grenzwert", "Grenzwerte", "Limes", "Folge", "Folgen", "Reihe", "Reihen", "arithmetische Folge", "geometrische Folge"], links: { all: "grenzwert-folgen.html" } },
  { words: ["Ableitung", "Ableitungen", "ableiten", "Differenzenquotient", "Differentialquotient", "Tangente", "Tangenten", "Sekante", "Tangentengleichung", "Änderungsrate"], links: { all: "ableitung.html" } },
  { words: ["Ableitungsregeln", "Potenzregel", "Faktorregel", "Summenregel", "Produktregel", "Quotientenregel", "Kettenregel"], links: { all: "ableitungsregeln.html" } },
  { words: ["Kurvendiskussion", "Extrempunkt", "Extrempunkte", "Hochpunkt", "Tiefpunkt", "Wendepunkt", "Wendepunkte", "Monotonie", "Krümmung", "Funktionsuntersuchung"], links: { all: "kurvendiskussion.html" } },
  { words: ["Integral", "Integrale", "integrieren", "Stammfunktion", "Stammfunktionen", "Hauptsatz", "Integralrechnung"], links: { all: "integral.html" } },
  { words: ["Vektor", "Vektoren", "Skalarprodukt", "Kreuzprodukt", "Vektorprodukt", "Stützvektor", "Richtungsvektor", "Normalenvektor", "Ebenengleichung", "orthogonal"], links: { all: "vektoren.html" } },
  { words: ["Wahrscheinlichkeit", "Wahrscheinlichkeiten", "Laplace", "Gegenereignis", "Baumdiagramm", "Pfadregel", "bedingte Wahrscheinlichkeit", "Zufallsexperiment", "Ereignis"], links: { all: "wahrscheinlichkeit.html" } },
  { words: ["Kombinatorik", "Fakultät", "Binomialkoeffizient", "Permutation", "Pascalsches Dreieck"], links: { all: "kombinatorik.html" } },
  { words: ["Erwartungswert", "Binomialverteilung", "Normalverteilung", "Glockenkurve", "Zufallsgröße", "Bernoulli-Kette"], links: { all: "verteilungen.html" } },
  { words: ["Mittelwert", "Median", "Modus", "Durchschnitt", "Varianz", "Standardabweichung", "Streuung", "Spannweite", "Statistik"], links: { all: "statistik.html" } },
  { words: ["Schnittmenge", "Vereinigungsmenge", "Differenzmenge", "Teilmenge", "leere Menge", "Venn-Diagramm", "Aussagenlogik", "Implikation", "Beweis", "Induktion", "vollständige Induktion"], links: { all: "mengen-logik.html" } }
];

console.log("[smart-link] mathe/links.js geladen:", smartLinkRules.length, "Wort-Regeln");
