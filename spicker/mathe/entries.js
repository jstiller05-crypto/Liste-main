/* =====================================================================
   entries.js – DATEN des Mathe-Spickers (keine Logik!)
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

window.SpickerData["mathe"] = {

  config: {
    searchPlaceholder: "Begriffe, Formeln oder Bereiche suchen …",
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
          { label: "Arithmetik", value: "arithmetik" },
          { label: "Algebra", value: "algebra" },
          { label: "Funktionen", value: "funktionen" },
          { label: "Geometrie", value: "geometrie" },
          { label: "Trigonometrie", value: "trigonometrie" },
          { label: "Analysis", value: "analysis" },
          { label: "Vektoren & Matrizen", value: "vektoren & matrizen" },
          { label: "Stochastik", value: "stochastik" },
          { label: "Logik & Mengen", value: "logik & mengen" }
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
          { label: "Regel", value: "regel" },
          { label: "Verfahren", value: "verfahren" },
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
      "Begriff": "Zahlenmengen",
      "Erklärung": "ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ – Zahlenarten im Überblick",
      "Bereich": "Arithmetik",
      "Link": "more/zahlen.html",
      "class": ["begriff","n z q r"]
    },
    {
      "Begriff": "Punkt vor Strich",
      "Erklärung": "Klammer, Potenz, Punkt, Strich",
      "Bereich": "Arithmetik",
      "Link": "more/zahlen.html",
      "class": ["regel","reihenfolge","klapopustri"]
    },
    {
      "Begriff": "Bruchrechnen",
      "Erklärung": "Rechnen mit Zähler und Nenner",
      "Bereich": "Arithmetik",
      "Link": "more/brueche.html",
      "class": ["regel","brüche","kehrwert"]
    },
    {
      "Begriff": "Kürzen / Erweitern",
      "Erklärung": "Zähler und Nenner gleich ändern",
      "Bereich": "Arithmetik",
      "Link": "more/brueche.html",
      "class": ["regel","brüche"]
    },
    {
      "Begriff": "Prozent",
      "Erklärung": "1 % = 1/100; W = G · p / 100",
      "Bereich": "Arithmetik",
      "Link": "more/prozent.html",
      "class": ["formel","prozentrechnung"]
    },
    {
      "Begriff": "Prozentuale Änderung",
      "Erklärung": "(neu − alt) / alt · 100 %",
      "Bereich": "Arithmetik",
      "Link": "more/prozent.html",
      "class": ["formel","wachstum"]
    },
    {
      "Begriff": "Dreisatz",
      "Erklärung": "Über die Einheit auf das Gesuchte schließen",
      "Bereich": "Arithmetik",
      "Link": "more/prozent.html",
      "class": ["verfahren","proportional"]
    },
    {
      "Begriff": "Teilbarkeitsregeln",
      "Erklärung": "Teilbarkeit an Ziffern/Quersumme sehen",
      "Bereich": "Arithmetik",
      "Link": "more/teiler-primzahlen.html",
      "class": ["regel","quersumme"]
    },
    {
      "Begriff": "Primzahl",
      "Erklärung": "Nur durch 1 und sich selbst teilbar",
      "Bereich": "Arithmetik",
      "Link": "more/teiler-primzahlen.html",
      "class": ["begriff","primfaktor"]
    },
    {
      "Begriff": "ggT / kgV",
      "Erklärung": "Größter Teiler / kleinstes Vielfaches",
      "Bereich": "Arithmetik",
      "Link": "more/teiler-primzahlen.html",
      "class": ["verfahren","teiler"]
    },
    {
      "Begriff": "Runden",
      "Erklärung": "0–4 abrunden, 5–9 aufrunden",
      "Bereich": "Arithmetik",
      "Link": "more/zahlen.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Wissenschaftliche Schreibweise",
      "Erklärung": "Zahl als a · 10ⁿ mit 1 ≤ a < 10",
      "Bereich": "Arithmetik",
      "Link": "more/potenzen-wurzeln-log.html",
      "class": ["regel","zehnerpotenz"]
    },
    {
      "Begriff": "Term",
      "Erklärung": "Rechenausdruck, z. B. 3x + 2",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["begriff","variable"]
    },
    {
      "Begriff": "Binomische Formeln",
      "Erklärung": "(a + b)² = a² + 2ab + b² und Co.",
      "Bereich": "Algebra",
      "Link": "more/binomische-formeln.html",
      "class": ["formel","ausmultiplizieren"]
    },
    {
      "Begriff": "Ausklammern",
      "Erklärung": "Gemeinsamen Faktor vor die Klammer",
      "Bereich": "Algebra",
      "Link": "more/binomische-formeln.html",
      "class": ["verfahren","faktorisieren"]
    },
    {
      "Begriff": "Potenzgesetze",
      "Erklärung": "aⁿ · aᵐ = aⁿ⁺ᵐ und weitere Regeln",
      "Bereich": "Algebra",
      "Link": "more/potenzen-wurzeln-log.html",
      "class": ["formel","exponent"]
    },
    {
      "Begriff": "Wurzeln",
      "Erklärung": "ⁿ√a = a^(1/n), Radikand ≥ 0",
      "Bereich": "Algebra",
      "Link": "more/potenzen-wurzeln-log.html",
      "class": ["formel","radikand"]
    },
    {
      "Begriff": "Logarithmus",
      "Erklärung": "log_b(x) = y heißt bʸ = x",
      "Bereich": "Algebra",
      "Link": "more/potenzen-wurzeln-log.html",
      "class": ["formel","log","ln"]
    },
    {
      "Begriff": "Lineare Gleichung",
      "Erklärung": "Nach x umformen wie eine Waage",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["verfahren","äquivalenzumformung"]
    },
    {
      "Begriff": "Äquivalenzumformung",
      "Erklärung": "Beide Seiten gleich verändern",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Quadratische Gleichung (pq-Formel)",
      "Erklärung": "x = −p/2 ± √((p/2)² − q)",
      "Bereich": "Algebra",
      "Link": "more/quadratische-gleichungen.html",
      "class": ["formel","pq"]
    },
    {
      "Begriff": "Mitternachtsformel",
      "Erklärung": "x = (−b ± √(b² − 4ac)) / 2a",
      "Bereich": "Algebra",
      "Link": "more/quadratische-gleichungen.html",
      "class": ["formel","abc-formel"]
    },
    {
      "Begriff": "Diskriminante",
      "Erklärung": "D = b² − 4ac: Anzahl der Lösungen",
      "Bereich": "Algebra",
      "Link": "more/quadratische-gleichungen.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Lineares Gleichungssystem",
      "Erklärung": "Mehrere Gleichungen, mehrere Unbekannte",
      "Bereich": "Algebra",
      "Link": "more/gleichungssysteme.html",
      "class": ["verfahren","lgs"]
    },
    {
      "Begriff": "Gauß-Verfahren",
      "Erklärung": "LGS in Stufenform bringen und lösen",
      "Bereich": "Algebra",
      "Link": "more/gleichungssysteme.html",
      "class": ["verfahren","lgs","gauss"]
    },
    {
      "Begriff": "Ungleichungen",
      "Erklärung": "Mal/durch Negatives: Zeichen umdrehen",
      "Bereich": "Algebra",
      "Link": "more/ungleichungen-betrag.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Betrag",
      "Erklärung": "|x| = Abstand zur 0",
      "Bereich": "Algebra",
      "Link": "more/ungleichungen-betrag.html",
      "class": ["begriff","absolut"]
    },
    {
      "Begriff": "Funktion",
      "Erklärung": "Jedem x wird genau ein y zugeordnet",
      "Bereich": "Funktionen",
      "Link": "more/funktion.html",
      "class": ["begriff","zuordnung"]
    },
    {
      "Begriff": "Definitions- / Wertebereich",
      "Erklärung": "Erlaubte x-Werte / angenommene y-Werte",
      "Bereich": "Funktionen",
      "Link": "more/funktion.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Lineare Funktion",
      "Erklärung": "f(x) = mx + b – Graph ist eine Gerade",
      "Bereich": "Funktionen",
      "Link": "more/lineare-funktion.html",
      "class": ["formel","gerade"]
    },
    {
      "Begriff": "Steigung",
      "Erklärung": "m = Δy / Δx",
      "Bereich": "Funktionen",
      "Link": "more/lineare-funktion.html",
      "class": ["formel","steigungsdreieck"]
    },
    {
      "Begriff": "Quadratische Funktion",
      "Erklärung": "f(x) = ax² + bx + c – eine Parabel",
      "Bereich": "Funktionen",
      "Link": "more/quadratische-funktion.html",
      "class": ["formel","parabel"]
    },
    {
      "Begriff": "Scheitelpunktform",
      "Erklärung": "f(x) = a(x − d)² + e, Scheitel S(d | e)",
      "Bereich": "Funktionen",
      "Link": "more/quadratische-funktion.html",
      "class": ["formel","parabel"]
    },
    {
      "Begriff": "Nullstellen",
      "Erklärung": "x-Werte mit f(x) = 0",
      "Bereich": "Funktionen",
      "Link": "more/funktion.html",
      "class": ["verfahren"]
    },
    {
      "Begriff": "Exponentialfunktion",
      "Erklärung": "f(x) = a · bˣ – Wachstum und Zerfall",
      "Bereich": "Funktionen",
      "Link": "more/exponentialfunktion.html",
      "class": ["formel","wachstum","e-funktion"]
    },
    {
      "Begriff": "Eulersche Zahl e",
      "Erklärung": "e ≈ 2,718; (eˣ)' = eˣ",
      "Bereich": "Funktionen",
      "Link": "more/exponentialfunktion.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Potenz- / Polynomfunktion",
      "Erklärung": "Summe von axⁿ; Grad = höchster Exponent",
      "Bereich": "Funktionen",
      "Link": "more/polynomfunktion.html",
      "class": ["begriff","ganzrational"]
    },
    {
      "Begriff": "Symmetrie",
      "Erklärung": "f(−x) = f(x) oder f(−x) = −f(x)",
      "Bereich": "Funktionen",
      "Link": "more/polynomfunktion.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Verschieben / Strecken",
      "Erklärung": "f(x − c) + d verschiebt, a · f(x) streckt",
      "Bereich": "Funktionen",
      "Link": "more/polynomfunktion.html",
      "class": ["regel","transformation"]
    },
    {
      "Begriff": "Satz des Pythagoras",
      "Erklärung": "a² + b² = c² im rechtwinkligen Dreieck",
      "Bereich": "Geometrie",
      "Link": "more/pythagoras.html",
      "class": ["formel","dreieck","hypotenuse"]
    },
    {
      "Begriff": "Winkelsumme",
      "Erklärung": "Dreieck 180°, n-Eck (n − 2) · 180°",
      "Bereich": "Geometrie",
      "Link": "more/flaechen.html",
      "class": ["regel","winkel"]
    },
    {
      "Begriff": "Dreieck: Fläche",
      "Erklärung": "A = ½ · g · h",
      "Bereich": "Geometrie",
      "Link": "more/flaechen.html",
      "class": ["formel","fläche"]
    },
    {
      "Begriff": "Rechteck / Quadrat",
      "Erklärung": "A = a · b, U = 2(a + b)",
      "Bereich": "Geometrie",
      "Link": "more/flaechen.html",
      "class": ["formel","fläche","umfang"]
    },
    {
      "Begriff": "Parallelogramm / Trapez",
      "Erklärung": "A = g · h bzw. A = ½(a + c) · h",
      "Bereich": "Geometrie",
      "Link": "more/flaechen.html",
      "class": ["formel","fläche"]
    },
    {
      "Begriff": "Kreis",
      "Erklärung": "A = πr², U = 2πr",
      "Bereich": "Geometrie",
      "Link": "more/kreis.html",
      "class": ["formel","pi","fläche","umfang"]
    },
    {
      "Begriff": "Kreisbogen / Sektor",
      "Erklärung": "Anteil α/360° vom ganzen Kreis",
      "Bereich": "Geometrie",
      "Link": "more/kreis.html",
      "class": ["formel","kreis"]
    },
    {
      "Begriff": "Quader / Würfel",
      "Erklärung": "V = a · b · c bzw. V = a³",
      "Bereich": "Geometrie",
      "Link": "more/koerper.html",
      "class": ["formel","volumen","oberfläche"]
    },
    {
      "Begriff": "Zylinder",
      "Erklärung": "V = πr² · h",
      "Bereich": "Geometrie",
      "Link": "more/koerper.html",
      "class": ["formel","volumen"]
    },
    {
      "Begriff": "Kegel / Pyramide",
      "Erklärung": "V = ⅓ · G · h",
      "Bereich": "Geometrie",
      "Link": "more/koerper.html",
      "class": ["formel","volumen"]
    },
    {
      "Begriff": "Kugel",
      "Erklärung": "V = 4/3 πr³, O = 4πr²",
      "Bereich": "Geometrie",
      "Link": "more/koerper.html",
      "class": ["formel","volumen","oberfläche"]
    },
    {
      "Begriff": "Kongruenz / Ähnlichkeit",
      "Erklärung": "Deckungsgleich bzw. gleiche Form",
      "Bereich": "Geometrie",
      "Link": "more/aehnlichkeit.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Strahlensätze",
      "Erklärung": "Parallelen → gleiche Streckenverhältnisse",
      "Bereich": "Geometrie",
      "Link": "more/aehnlichkeit.html",
      "class": ["regel","verhältnis"]
    },
    {
      "Begriff": "Satz des Thales",
      "Erklärung": "Winkel im Halbkreis ist 90°",
      "Bereich": "Geometrie",
      "Link": "more/kreis.html",
      "class": ["regel","kreis"]
    },
    {
      "Begriff": "Koordinatensystem",
      "Erklärung": "P(x | y); Abstand per Pythagoras",
      "Bereich": "Geometrie",
      "Link": "more/pythagoras.html",
      "class": ["formel","abstand"]
    },
    {
      "Begriff": "Sinus, Kosinus, Tangens",
      "Erklärung": "Seitenverhältnisse im rechtw. Dreieck",
      "Bereich": "Trigonometrie",
      "Link": "more/trigonometrie.html",
      "class": ["formel","gaga hühnerhof"]
    },
    {
      "Begriff": "Sinussatz",
      "Erklärung": "a / sin α = b / sin β = c / sin γ",
      "Bereich": "Trigonometrie",
      "Link": "more/trigonometrie.html",
      "class": ["formel","dreieck"]
    },
    {
      "Begriff": "Kosinussatz",
      "Erklärung": "c² = a² + b² − 2ab · cos γ",
      "Bereich": "Trigonometrie",
      "Link": "more/trigonometrie.html",
      "class": ["formel","dreieck"]
    },
    {
      "Begriff": "Bogenmaß",
      "Erklärung": "Winkel in π: 180° = π",
      "Bereich": "Trigonometrie",
      "Link": "more/einheitskreis.html",
      "class": ["formel","radiant"]
    },
    {
      "Begriff": "Einheitskreis",
      "Erklärung": "Punkt (cos α | sin α) auf Radius 1",
      "Bereich": "Trigonometrie",
      "Link": "more/einheitskreis.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Sinusfunktion",
      "Erklärung": "a · sin(b(x − c)) + d",
      "Bereich": "Trigonometrie",
      "Link": "more/einheitskreis.html",
      "class": ["formel","schwingung","periode"]
    },
    {
      "Begriff": "Grenzwert",
      "Erklärung": "Wert, dem man beliebig nahe kommt",
      "Bereich": "Analysis",
      "Link": "more/grenzwert-folgen.html",
      "class": ["begriff","limes"]
    },
    {
      "Begriff": "Ableitung",
      "Erklärung": "Steigung der Tangente an der Stelle x",
      "Bereich": "Analysis",
      "Link": "more/ableitung.html",
      "class": ["begriff","differenzieren"]
    },
    {
      "Begriff": "Differenzenquotient",
      "Erklärung": "(f(x + h) − f(x)) / h = mittlere Steigung",
      "Bereich": "Analysis",
      "Link": "more/ableitung.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Potenzregel",
      "Erklärung": "(xⁿ)' = n · xⁿ⁻¹",
      "Bereich": "Analysis",
      "Link": "more/ableitungsregeln.html",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Summen- und Faktorregel",
      "Erklärung": "(f + g)' = f' + g'; (c · f)' = c · f'",
      "Bereich": "Analysis",
      "Link": "more/ableitungsregeln.html",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Produktregel",
      "Erklärung": "(u · v)' = u'v + uv'",
      "Bereich": "Analysis",
      "Link": "more/ableitungsregeln.html",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Quotientenregel",
      "Erklärung": "(u / v)' = (u'v − uv') / v²",
      "Bereich": "Analysis",
      "Link": "more/ableitungsregeln.html",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Kettenregel",
      "Erklärung": "Äußere mal innere Ableitung",
      "Bereich": "Analysis",
      "Link": "more/ableitungsregeln.html",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Wichtige Ableitungen",
      "Erklärung": "eˣ, ln x, sin x, cos x ableiten",
      "Bereich": "Analysis",
      "Link": "more/ableitungsregeln.html",
      "class": ["formel","ableitung"]
    },
    {
      "Begriff": "Extrempunkte",
      "Erklärung": "f'(x) = 0 und f''(x) ≠ 0",
      "Bereich": "Analysis",
      "Link": "more/kurvendiskussion.html",
      "class": ["verfahren","hochpunkt","tiefpunkt"]
    },
    {
      "Begriff": "Wendepunkte",
      "Erklärung": "f''(x) = 0 und f'''(x) ≠ 0",
      "Bereich": "Analysis",
      "Link": "more/kurvendiskussion.html",
      "class": ["verfahren","krümmung"]
    },
    {
      "Begriff": "Monotonie",
      "Erklärung": "f' > 0 steigend, f' < 0 fallend",
      "Bereich": "Analysis",
      "Link": "more/kurvendiskussion.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Kurvendiskussion",
      "Erklärung": "Funktion Schritt für Schritt untersuchen",
      "Bereich": "Analysis",
      "Link": "more/kurvendiskussion.html",
      "class": ["verfahren","funktionsuntersuchung"]
    },
    {
      "Begriff": "Tangentengleichung",
      "Erklärung": "t(x) = f'(x₀)(x − x₀) + f(x₀)",
      "Bereich": "Analysis",
      "Link": "more/ableitung.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Stammfunktion",
      "Erklärung": "F mit F' = f („rückwärts ableiten“)",
      "Bereich": "Analysis",
      "Link": "more/integral.html",
      "class": ["formel","integrieren"]
    },
    {
      "Begriff": "Bestimmtes Integral",
      "Erklärung": "∫ₐᵇ f(x) dx = F(b) − F(a)",
      "Bereich": "Analysis",
      "Link": "more/integral.html",
      "class": ["formel","fläche","hauptsatz"]
    },
    {
      "Begriff": "Fläche zwischen Graphen",
      "Erklärung": "∫ |f − g| dx zwischen Schnittstellen",
      "Bereich": "Analysis",
      "Link": "more/integral.html",
      "class": ["verfahren","integral"]
    },
    {
      "Begriff": "Folgen und Reihen",
      "Erklärung": "Arithmetische und geometrische Folgen",
      "Bereich": "Analysis",
      "Link": "more/grenzwert-folgen.html",
      "class": ["formel","folge"]
    },
    {
      "Begriff": "Vektor",
      "Erklärung": "Pfeil mit Richtung und Länge",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/vektoren.html",
      "class": ["begriff","betrag"]
    },
    {
      "Begriff": "Vektoraddition",
      "Erklärung": "Komponentenweise: Pfeile aneinanderhängen",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/vektoren.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Skalarprodukt",
      "Erklärung": "a₁b₁ + a₂b₂ + a₃b₃; 0 heißt senkrecht",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/vektoren.html",
      "class": ["formel","orthogonal"]
    },
    {
      "Begriff": "Kreuzprodukt",
      "Erklärung": "Vektor senkrecht zu a und b",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/vektoren.html",
      "class": ["formel","vektorprodukt"]
    },
    {
      "Begriff": "Geradengleichung (Vektor)",
      "Erklärung": "x = Stützvektor + t · Richtungsvektor",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/vektoren.html",
      "class": ["formel","gerade"]
    },
    {
      "Begriff": "Ebenengleichung",
      "Erklärung": "Parameter- oder Koordinatenform",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/vektoren.html",
      "class": ["formel","ebene"]
    },
    {
      "Begriff": "Matrix",
      "Erklärung": "Zahlentabelle; Produkt: Zeile mal Spalte",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/gleichungssysteme.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Determinante (2×2)",
      "Erklärung": "ad − bc; ≠ 0 heißt umkehrbar",
      "Bereich": "Vektoren & Matrizen",
      "Link": "more/gleichungssysteme.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Wahrscheinlichkeit (Laplace)",
      "Erklärung": "günstige / mögliche Ergebnisse",
      "Bereich": "Stochastik",
      "Link": "more/wahrscheinlichkeit.html",
      "class": ["formel","laplace"]
    },
    {
      "Begriff": "Gegenereignis",
      "Erklärung": "P(nicht E) = 1 − P(E)",
      "Bereich": "Stochastik",
      "Link": "more/wahrscheinlichkeit.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Baumdiagramm",
      "Erklärung": "Pfade multiplizieren, Ergebnisse addieren",
      "Bereich": "Stochastik",
      "Link": "more/wahrscheinlichkeit.html",
      "class": ["verfahren","pfadregel"]
    },
    {
      "Begriff": "Bedingte Wahrscheinlichkeit",
      "Erklärung": "P(A|B) = P(A ∩ B) / P(B)",
      "Bereich": "Stochastik",
      "Link": "more/wahrscheinlichkeit.html",
      "class": ["formel","bayes"]
    },
    {
      "Begriff": "Fakultät",
      "Erklärung": "n! = 1 · 2 · … · n",
      "Bereich": "Stochastik",
      "Link": "more/kombinatorik.html",
      "class": ["formel","kombinatorik"]
    },
    {
      "Begriff": "Binomialkoeffizient",
      "Erklärung": "k aus n ohne Reihenfolge wählen",
      "Bereich": "Stochastik",
      "Link": "more/kombinatorik.html",
      "class": ["formel","kombinatorik","lotto"]
    },
    {
      "Begriff": "Binomialverteilung",
      "Erklärung": "k Treffer bei n Versuchen",
      "Bereich": "Stochastik",
      "Link": "more/verteilungen.html",
      "class": ["formel","bernoulli"]
    },
    {
      "Begriff": "Erwartungswert",
      "Erklärung": "Σ xᵢ · P(X = xᵢ) – langfristiges Mittel",
      "Bereich": "Stochastik",
      "Link": "more/verteilungen.html",
      "class": ["formel"]
    },
    {
      "Begriff": "Mittelwert, Median, Modus",
      "Erklärung": "Drei Arten, die Mitte zu beschreiben",
      "Bereich": "Stochastik",
      "Link": "more/statistik.html",
      "class": ["begriff","statistik","durchschnitt"]
    },
    {
      "Begriff": "Varianz / Standardabweichung",
      "Erklärung": "Wie stark Werte um den Mittelwert streuen",
      "Bereich": "Stochastik",
      "Link": "more/statistik.html",
      "class": ["formel","statistik","streuung"]
    },
    {
      "Begriff": "Normalverteilung",
      "Erklärung": "Glockenkurve; ±1σ ≈ 68 %",
      "Bereich": "Stochastik",
      "Link": "more/verteilungen.html",
      "class": ["regel","gauß"]
    },
    {
      "Begriff": "Menge",
      "Erklärung": "Zusammenfassung von Elementen: {1, 2, 3}",
      "Bereich": "Logik & Mengen",
      "Link": "more/mengen-logik.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Schnitt- / Vereinigungsmenge",
      "Erklärung": "A ∩ B in beiden, A ∪ B in mindestens einer",
      "Bereich": "Logik & Mengen",
      "Link": "more/mengen-logik.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Aussagenlogik",
      "Erklärung": "und ∧, oder ∨, nicht ¬, wenn-dann ⇒",
      "Bereich": "Logik & Mengen",
      "Link": "more/mengen-logik.html",
      "class": ["regel","logik"]
    },
    {
      "Begriff": "Beweisverfahren",
      "Erklärung": "Direkt, Widerspruch, Induktion",
      "Bereich": "Logik & Mengen",
      "Link": "more/mengen-logik.html",
      "class": ["verfahren","induktion"]
    },
    {
      "Begriff": "Intervalle",
      "Erklärung": "[a; b] mit Rand, ]a; b[ ohne Rand",
      "Bereich": "Logik & Mengen",
      "Link": "more/ungleichungen-betrag.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Variable",
      "Erklärung": "Platzhalter für eine Zahl, z. B. x",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["begriff","buchstabe","unbekannte","platzhalter"]
    }
  ]}
};

console.log("[entries] mathe/entries.js geladen:", window.SpickerData["mathe"].oTableEntries.List.length, "Einträge");
