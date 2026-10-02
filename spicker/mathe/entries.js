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
      "Erklärung": "So funktioniert dieser Spicker: Aufbau, Filter und Lerntipps",
      "Bereich": "Spicker",
      "Link": "more/anleitung.html",
      "class": ["hilfe","anleitung","bedienung","lerntipps"]
    },
    {
      "Begriff": "Zahlenmengen",
      "Erklärung": "ℕ natürliche ⊂ ℤ ganze ⊂ ℚ rationale (Brüche) ⊂ ℝ reelle Zahlen (mit √2, π) ⊂ ℂ komplexe.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["begriff","n z q r"]
    },
    {
      "Begriff": "Punkt vor Strich",
      "Erklärung": "Klammern → Potenzen → Punkt (· :) → Strich (+ −). Gleiche Stufe: von links nach rechts.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["regel","reihenfolge","klapopustri"]
    },
    {
      "Begriff": "Bruchrechnen",
      "Erklärung": "Addieren: gleichnamig machen. Multiplizieren: Zähler·Zähler / Nenner·Nenner. Dividieren: mit Kehrwert malnehmen.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["regel","brüche","kehrwert"]
    },
    {
      "Begriff": "Kürzen / Erweitern",
      "Erklärung": "Zähler und Nenner durch dieselbe Zahl teilen bzw. mit derselben Zahl malnehmen – Wert bleibt gleich.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["regel","brüche"]
    },
    {
      "Begriff": "Prozent",
      "Erklärung": "1 % = 1/100. Prozentwert = Grundwert · Prozentsatz / 100.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["formel","prozentrechnung"]
    },
    {
      "Begriff": "Prozentuale Änderung",
      "Erklärung": "(neu − alt) / alt · 100 %. +50 % und danach −50 % ergeben NICHT den Startwert.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["formel","wachstum"]
    },
    {
      "Begriff": "Dreisatz",
      "Erklärung": "Von der Mehrheit auf die Einheit, dann auf die gesuchte Mehrheit schließen (proportional oder antiproportional).",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["verfahren","proportional"]
    },
    {
      "Begriff": "Teilbarkeitsregeln",
      "Erklärung": "Durch 2: letzte Ziffer gerade. 3/9: Quersumme teilbar. 5: endet auf 0/5. 4: letzte zwei Ziffern teilbar.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["regel","quersumme"]
    },
    {
      "Begriff": "Primzahl",
      "Erklärung": "Natürliche Zahl > 1, die nur durch 1 und sich selbst teilbar ist: 2, 3, 5, 7, 11, 13 …",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["begriff","primfaktor"]
    },
    {
      "Begriff": "ggT / kgV",
      "Erklärung": "Größter gemeinsamer Teiler bzw. kleinstes gemeinsames Vielfaches – über Primfaktorzerlegung finden.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["verfahren","teiler"]
    },
    {
      "Begriff": "Runden",
      "Erklärung": "Ziffer danach 0–4: abrunden, 5–9: aufrunden. Erst am Ende runden, nicht bei Zwischenergebnissen.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Wissenschaftliche Schreibweise",
      "Erklärung": "Zahl als a · 10^n mit 1 ≤ a < 10, z. B. 0,00042 = 4,2 · 10⁻⁴.",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["regel","zehnerpotenz"]
    },
    {
      "Begriff": "Term",
      "Erklärung": "Rechenausdruck mit Zahlen und Variablen, z. B. 3x + 2.",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["begriff","variable"]
    },
    {
      "Begriff": "Binomische Formeln",
      "Erklärung": "(a+b)² = a² + 2ab + b²; (a−b)² = a² − 2ab + b²; (a+b)(a−b) = a² − b².",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formel","ausmultiplizieren"]
    },
    {
      "Begriff": "Ausklammern",
      "Erklärung": "Gemeinsamen Faktor vor die Klammer ziehen: 6x + 9 = 3(2x + 3).",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["verfahren","faktorisieren"]
    },
    {
      "Begriff": "Potenzgesetze",
      "Erklärung": "aⁿ·aᵐ = aⁿ⁺ᵐ; aⁿ/aᵐ = aⁿ⁻ᵐ; (aⁿ)ᵐ = aⁿᵐ; a⁰ = 1; a⁻ⁿ = 1/aⁿ.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formel","exponent"]
    },
    {
      "Begriff": "Wurzeln",
      "Erklärung": "ⁿ√a = a^(1/n). √(a·b) = √a·√b. Unter der Quadratwurzel (reell) nur Zahlen ≥ 0.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formel","radikand"]
    },
    {
      "Begriff": "Logarithmus",
      "Erklärung": "log_b(x) = y ⇔ bʸ = x. Regeln: log(a·b) = log a + log b; log(aⁿ) = n·log a.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formel","log","ln"]
    },
    {
      "Begriff": "Lineare Gleichung",
      "Erklärung": "Gleichung mit x ohne Potenzen – auf beiden Seiten gleich umformen.",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["verfahren","äquivalenzumformung"]
    },
    {
      "Begriff": "Äquivalenzumformung",
      "Erklärung": "Umformung, die die Lösungsmenge nicht ändert (beide Seiten + − · : mit derselben Zahl ≠ 0).",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["regel"]
    },
    {
      "Begriff": "Quadratische Gleichung (pq-Formel)",
      "Erklärung": "x² + px + q = 0 → x = −p/2 ± √((p/2)² − q).",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formel","pq"]
    },
    {
      "Begriff": "Mitternachtsformel",
      "Erklärung": "ax² + bx + c = 0 → x = (−b ± √(b² − 4ac)) / 2a.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formel","abc-formel"]
    },
    {
      "Begriff": "Diskriminante",
      "Erklärung": "D = b² − 4ac: D > 0 zwei Lösungen, D = 0 eine, D < 0 keine reelle Lösung.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Lineares Gleichungssystem",
      "Erklärung": "Mehrere Gleichungen mit mehreren Unbekannten. Lösen per Einsetzen, Gleichsetzen oder Addition.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["verfahren","lgs"]
    },
    {
      "Begriff": "Gauß-Verfahren",
      "Erklärung": "LGS in Stufenform bringen (Zeilen addieren/vervielfachen), dann von unten rückwärts einsetzen.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["verfahren","lgs","gauss"]
    },
    {
      "Begriff": "Ungleichungen",
      "Erklärung": "Wie Gleichungen lösen – aber beim Malnehmen/Teilen mit einer negativen Zahl das Zeichen umdrehen.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Betrag",
      "Erklärung": "|x| = Abstand zur 0: |−3| = 3. |x| < a heißt −a < x < a.",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["begriff","absolut"]
    },
    {
      "Begriff": "Funktion",
      "Erklärung": "Jedem x wird genau ein y zugeordnet.",
      "Bereich": "Funktionen",
      "Link": "more/funktion.html",
      "class": ["begriff","zuordnung"]
    },
    {
      "Begriff": "Definitions- / Wertebereich",
      "Erklärung": "D = erlaubte x-Werte (z. B. nicht durch 0 teilen), W = tatsächlich angenommene y-Werte.",
      "Bereich": "Funktionen",
      "Link": "more/funktion.html",
      "class": ["begriff"]
    },
    {
      "Begriff": "Lineare Funktion",
      "Erklärung": "f(x) = mx + b – Graph ist eine Gerade.",
      "Bereich": "Funktionen",
      "Link": "more/lineare-funktion.html",
      "class": ["formel","gerade"]
    },
    {
      "Begriff": "Steigung",
      "Erklärung": "Wie stark eine Gerade steigt: m = Δy / Δx.",
      "Bereich": "Funktionen",
      "Link": "more/lineare-funktion.html",
      "class": ["formel","steigungsdreieck"]
    },
    {
      "Begriff": "Quadratische Funktion",
      "Erklärung": "f(x) = ax² + bx + c. Graph ist eine Parabel; a > 0 nach oben, a < 0 nach unten geöffnet.",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["formel","parabel"]
    },
    {
      "Begriff": "Scheitelpunktform",
      "Erklärung": "f(x) = a(x − d)² + e mit Scheitelpunkt S(d | e).",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["formel","parabel"]
    },
    {
      "Begriff": "Nullstellen",
      "Erklärung": "x-Werte mit f(x) = 0 – Schnittpunkte mit der x-Achse.",
      "Bereich": "Funktionen",
      "Link": "more/funktion.html",
      "class": ["verfahren"]
    },
    {
      "Begriff": "Exponentialfunktion",
      "Erklärung": "f(x) = a · bˣ. Wachstum (b > 1) oder Zerfall (0 < b < 1). Mit e: f(x) = a · e^(kx).",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["formel","wachstum","e-funktion"]
    },
    {
      "Begriff": "Eulersche Zahl e",
      "Erklärung": "e ≈ 2,71828. Die Funktion eˣ ist ihre eigene Ableitung.",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Potenz- / Polynomfunktion",
      "Erklärung": "Summe von Termen axⁿ. Der höchste Exponent ist der Grad und bestimmt das Verhalten für große x.",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["begriff","ganzrational"]
    },
    {
      "Begriff": "Symmetrie",
      "Erklärung": "Achsensymmetrisch zur y-Achse: f(−x) = f(x). Punktsymmetrisch zum Ursprung: f(−x) = −f(x).",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Verschieben / Strecken",
      "Erklärung": "f(x) + c nach oben, f(x − c) nach rechts, a · f(x) streckt in y-Richtung.",
      "Bereich": "Funktionen",
      "Link": "",
      "class": ["regel","transformation"]
    },
    {
      "Begriff": "Satz des Pythagoras",
      "Erklärung": "a² + b² = c² im rechtwinkligen Dreieck.",
      "Bereich": "Geometrie",
      "Link": "more/pythagoras.html",
      "class": ["formel","dreieck","hypotenuse"]
    },
    {
      "Begriff": "Winkelsumme",
      "Erklärung": "Dreieck: 180°. Viereck: 360°. n-Eck: (n − 2) · 180°.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["regel","winkel"]
    },
    {
      "Begriff": "Dreieck: Fläche",
      "Erklärung": "A = ½ · g · h (Grundseite mal zugehörige Höhe, halbiert).",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","fläche"]
    },
    {
      "Begriff": "Rechteck / Quadrat",
      "Erklärung": "Rechteck: A = a·b, U = 2(a + b). Quadrat: A = a², U = 4a.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","fläche","umfang"]
    },
    {
      "Begriff": "Parallelogramm / Trapez",
      "Erklärung": "Parallelogramm: A = g·h. Trapez: A = ½ (a + c) · h.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","fläche"]
    },
    {
      "Begriff": "Kreis",
      "Erklärung": "A = π r², U = 2 π r. π ≈ 3,14159.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","pi","fläche","umfang"]
    },
    {
      "Begriff": "Kreisbogen / Sektor",
      "Erklärung": "Bogen b = 2πr · α/360°. Sektorfläche A = πr² · α/360°.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","kreis"]
    },
    {
      "Begriff": "Quader / Würfel",
      "Erklärung": "Quader: V = a·b·c, O = 2(ab + ac + bc). Würfel: V = a³, O = 6a².",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","volumen","oberfläche"]
    },
    {
      "Begriff": "Zylinder",
      "Erklärung": "V = π r² h, Mantel M = 2 π r h, O = 2πr² + 2πrh.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","volumen"]
    },
    {
      "Begriff": "Kegel / Pyramide",
      "Erklärung": "V = ⅓ · Grundfläche · Höhe.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","volumen"]
    },
    {
      "Begriff": "Kugel",
      "Erklärung": "V = 4/3 π r³, O = 4 π r².",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","volumen","oberfläche"]
    },
    {
      "Begriff": "Kongruenz / Ähnlichkeit",
      "Erklärung": "Kongruent: deckungsgleich. Ähnlich: gleiche Winkel, Seiten im selben Verhältnis.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Strahlensätze",
      "Erklärung": "Zwei Geraden durch einen Punkt, von Parallelen geschnitten: entsprechende Abschnitte stehen im gleichen Verhältnis.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["regel","verhältnis"]
    },
    {
      "Begriff": "Satz des Thales",
      "Erklärung": "Liegt C auf dem Kreis über der Strecke AB (Durchmesser), ist der Winkel bei C ein rechter Winkel.",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["regel","kreis"]
    },
    {
      "Begriff": "Koordinatensystem",
      "Erklärung": "Punkt P(x | y). Abstand zweier Punkte: d = √((x₂ − x₁)² + (y₂ − y₁)²).",
      "Bereich": "Geometrie",
      "Link": "",
      "class": ["formel","abstand"]
    },
    {
      "Begriff": "Sinus, Kosinus, Tangens",
      "Erklärung": "Im rechtwinkligen Dreieck: sin = Gegenkathete/Hypotenuse, cos = Ankathete/Hypotenuse, tan = Gegenkathete/Ankathete.",
      "Bereich": "Trigonometrie",
      "Link": "",
      "class": ["formel","gaga hühnerhof"]
    },
    {
      "Begriff": "Sinussatz",
      "Erklärung": "a / sin α = b / sin β = c / sin γ – gilt in jedem Dreieck.",
      "Bereich": "Trigonometrie",
      "Link": "",
      "class": ["formel","dreieck"]
    },
    {
      "Begriff": "Kosinussatz",
      "Erklärung": "c² = a² + b² − 2ab · cos γ. Für γ = 90° wird daraus der Pythagoras.",
      "Bereich": "Trigonometrie",
      "Link": "",
      "class": ["formel","dreieck"]
    },
    {
      "Begriff": "Bogenmaß",
      "Erklärung": "Winkel als Bogenlänge am Einheitskreis: 180° = π, 90° = π/2. x = α · π / 180°.",
      "Bereich": "Trigonometrie",
      "Link": "",
      "class": ["formel","radiant"]
    },
    {
      "Begriff": "Einheitskreis",
      "Erklärung": "Kreis mit Radius 1: Punkt auf dem Kreis = (cos α | sin α). Daraus sin² α + cos² α = 1.",
      "Bereich": "Trigonometrie",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Sinusfunktion",
      "Erklärung": "f(x) = a · sin(b(x − c)) + d: a = Amplitude, Periode = 2π/b, c = Verschiebung, d = Mittellinie.",
      "Bereich": "Trigonometrie",
      "Link": "",
      "class": ["formel","schwingung","periode"]
    },
    {
      "Begriff": "Grenzwert",
      "Erklärung": "Wert, dem sich eine Funktion/Folge beliebig nähert, z. B. lim(x→∞) 1/x = 0.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["begriff","limes"]
    },
    {
      "Begriff": "Ableitung",
      "Erklärung": "f'(x) = Steigung der Tangente an der Stelle x = momentane Änderungsrate.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["begriff","differenzieren"]
    },
    {
      "Begriff": "Differenzenquotient",
      "Erklärung": "(f(x+h) − f(x)) / h = mittlere Steigung. Für h → 0 wird daraus die Ableitung.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Potenzregel",
      "Erklärung": "(xⁿ)' = n · xⁿ⁻¹, z. B. (x³)' = 3x².",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Summen- und Faktorregel",
      "Erklärung": "(f + g)' = f' + g'; (c · f)' = c · f'.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Produktregel",
      "Erklärung": "(u · v)' = u'v + uv'.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Quotientenregel",
      "Erklärung": "(u / v)' = (u'v − uv') / v².",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Kettenregel",
      "Erklärung": "(f(g(x)))' = f'(g(x)) · g'(x) – 'äußere mal innere Ableitung'.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","ableitungsregel"]
    },
    {
      "Begriff": "Wichtige Ableitungen",
      "Erklärung": "(eˣ)' = eˣ; (ln x)' = 1/x; (sin x)' = cos x; (cos x)' = −sin x.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","ableitung"]
    },
    {
      "Begriff": "Extrempunkte",
      "Erklärung": "Notwendig: f'(x) = 0. Hinreichend: f''(x) < 0 Hochpunkt, f''(x) > 0 Tiefpunkt.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["verfahren","hochpunkt","tiefpunkt"]
    },
    {
      "Begriff": "Wendepunkte",
      "Erklärung": "f''(x) = 0 und f'''(x) ≠ 0 – dort wechselt die Krümmung.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["verfahren","krümmung"]
    },
    {
      "Begriff": "Monotonie",
      "Erklärung": "f'(x) > 0: steigend, f'(x) < 0: fallend.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Kurvendiskussion",
      "Erklärung": "Definitionsbereich, Symmetrie, Nullstellen, Extrem- und Wendepunkte, Verhalten im Unendlichen, Skizze.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["verfahren","funktionsuntersuchung"]
    },
    {
      "Begriff": "Tangentengleichung",
      "Erklärung": "t(x) = f'(x₀) · (x − x₀) + f(x₀).",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Stammfunktion",
      "Erklärung": "F mit F' = f. Zu f(x) = xⁿ gehört F(x) = xⁿ⁺¹/(n+1) + C (für n ≠ −1).",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","integrieren"]
    },
    {
      "Begriff": "Bestimmtes Integral",
      "Erklärung": "∫ₐᵇ f(x) dx = F(b) − F(a) (Hauptsatz). Ergibt die orientierte Fläche unter dem Graphen.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","fläche","hauptsatz"]
    },
    {
      "Begriff": "Fläche zwischen Graphen",
      "Erklärung": "∫ₐᵇ |f(x) − g(x)| dx – Schnittpunkte als Grenzen, Teilflächen einzeln berechnen.",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["verfahren","integral"]
    },
    {
      "Begriff": "Folgen und Reihen",
      "Erklärung": "Arithmetisch: aₙ = a₁ + (n−1)d. Geometrisch: aₙ = a₁ · qⁿ⁻¹; Summe (q≠1): a₁(1 − qⁿ)/(1 − q).",
      "Bereich": "Analysis",
      "Link": "",
      "class": ["formel","folge"]
    },
    {
      "Begriff": "Vektor",
      "Erklärung": "Größe mit Richtung und Länge, z. B. v = (2, 3). Länge |v| = √(2² + 3²).",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["begriff","betrag"]
    },
    {
      "Begriff": "Vektoraddition",
      "Erklärung": "Komponentenweise: (a₁, a₂) + (b₁, b₂) = (a₁ + b₁, a₂ + b₂) – 'Pfeile aneinanderhängen'.",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Skalarprodukt",
      "Erklärung": "a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a| · |b| · cos φ. Gleich 0 ⇒ Vektoren stehen senkrecht.",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["formel","orthogonal"]
    },
    {
      "Begriff": "Kreuzprodukt",
      "Erklärung": "a × b ergibt einen Vektor senkrecht zu a und b; Länge = Fläche des Parallelogramms.",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["formel","vektorprodukt"]
    },
    {
      "Begriff": "Geradengleichung (Vektor)",
      "Erklärung": "g: x = Stützvektor + t · Richtungsvektor.",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["formel","gerade"]
    },
    {
      "Begriff": "Ebenengleichung",
      "Erklärung": "Parameterform: x = p + r·u + s·v. Koordinatenform: ax₁ + bx₂ + cx₃ = d (Normalenvektor (a, b, c)).",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["formel","ebene"]
    },
    {
      "Begriff": "Matrix",
      "Erklärung": "Rechteckige Zahlentabelle. Multiplikation: Zeile mal Spalte; A·B ≠ B·A im Allgemeinen.",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Determinante (2×2)",
      "Erklärung": "det [[a, b], [c, d]] = ad − bc. Ungleich 0 ⇒ Matrix ist invertierbar.",
      "Bereich": "Vektoren & Matrizen",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Wahrscheinlichkeit (Laplace)",
      "Erklärung": "P(E) = günstige Ergebnisse / mögliche Ergebnisse – wenn alle gleich wahrscheinlich sind.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel","laplace"]
    },
    {
      "Begriff": "Gegenereignis",
      "Erklärung": "P(nicht E) = 1 − P(E). Oft einfacher: 'mindestens einmal' über 'keinmal' berechnen.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Baumdiagramm",
      "Erklärung": "Pfadregel: entlang eines Pfades multiplizieren. Summenregel: Pfade zum selben Ergebnis addieren.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["verfahren","pfadregel"]
    },
    {
      "Begriff": "Bedingte Wahrscheinlichkeit",
      "Erklärung": "P(A|B) = P(A ∩ B) / P(B) – Wahrscheinlichkeit von A, wenn B schon eingetreten ist.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel","bayes"]
    },
    {
      "Begriff": "Fakultät",
      "Erklärung": "n! = 1 · 2 · … · n; 0! = 1. Anzahl der Reihenfolgen von n Dingen.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel","kombinatorik"]
    },
    {
      "Begriff": "Binomialkoeffizient",
      "Erklärung": "(n über k) = n! / (k!(n−k)!) – Anzahl der Möglichkeiten, k aus n ohne Reihenfolge zu wählen.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel","kombinatorik","lotto"]
    },
    {
      "Begriff": "Binomialverteilung",
      "Erklärung": "P(X = k) = (n über k) · pᵏ · (1−p)ⁿ⁻ᵏ; Erwartungswert n·p.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel","bernoulli"]
    },
    {
      "Begriff": "Erwartungswert",
      "Erklärung": "E(X) = Σ xᵢ · P(X = xᵢ) – der langfristige Durchschnitt.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel"]
    },
    {
      "Begriff": "Mittelwert, Median, Modus",
      "Erklärung": "Mittelwert = Summe/Anzahl. Median = mittlerer Wert der sortierten Liste. Modus = häufigster Wert.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["begriff","statistik","durchschnitt"]
    },
    {
      "Begriff": "Varianz / Standardabweichung",
      "Erklärung": "Varianz = mittlere quadrierte Abweichung vom Mittelwert; Standardabweichung = √Varianz.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["formel","statistik","streuung"]
    },
    {
      "Begriff": "Normalverteilung",
      "Erklärung": "Glockenkurve. Ca. 68 % der Werte liegen innerhalb ±1σ, 95 % innerhalb ±2σ um den Mittelwert.",
      "Bereich": "Stochastik",
      "Link": "",
      "class": ["regel","gauß"]
    },
    {
      "Begriff": "Menge",
      "Erklärung": "Zusammenfassung von Elementen: A = {1, 2, 3}. x ∈ A heißt 'x ist Element von A'.",
      "Bereich": "Logik & Mengen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Schnitt- / Vereinigungsmenge",
      "Erklärung": "A ∩ B: in beiden. A ∪ B: in mindestens einer. A \\ B: in A, aber nicht in B.",
      "Bereich": "Logik & Mengen",
      "Link": "",
      "class": ["regel"]
    },
    {
      "Begriff": "Aussagenlogik",
      "Erklärung": "∧ und, ∨ oder, ¬ nicht, ⇒ wenn-dann, ⇔ genau dann wenn.",
      "Bereich": "Logik & Mengen",
      "Link": "",
      "class": ["regel","logik"]
    },
    {
      "Begriff": "Beweisverfahren",
      "Erklärung": "Direkter Beweis, Widerspruchsbeweis, vollständige Induktion (Anfang + Schritt n → n+1).",
      "Bereich": "Logik & Mengen",
      "Link": "",
      "class": ["verfahren","induktion"]
    },
    {
      "Begriff": "Intervalle",
      "Erklärung": "[a; b] mit Rändern, ]a; b[ bzw. (a; b) ohne Ränder.",
      "Bereich": "Logik & Mengen",
      "Link": "",
      "class": ["begriff"]
    },
    {
      "Begriff": "Variable",
      "Erklärung": "Platzhalter für eine Zahl, z. B. x.",
      "Bereich": "Algebra",
      "Link": "more/variablen-terme.html",
      "class": ["begriff","buchstabe","unbekannte","platzhalter"]
    }
  ]}
};

console.log("[entries] mathe/entries.js geladen:", window.SpickerData["mathe"].oTableEntries.List.length, "Einträge");
