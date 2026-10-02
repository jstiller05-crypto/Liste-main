/* =====================================================================
   entries.js – DATEN des Mathe-Spickers (Vorlage mit Beispiel-Einträgen)
   ---------------------------------------------------------------------
   Gleicher Aufbau wie coding/entries.js – Erklärung der Felder siehe dort.
   Andere Spalten: Begriff / Erklärung / Bereich / Link.
   Die Feldnamen in den Einträgen müssen zu "field" in columns passen.
   ===================================================================== */
window.SpickerData = window.SpickerData || {};

window.SpickerData["mathe"] = {

  config: {
    searchPlaceholder: "Begriffe, Erklärungen oder Bereiche suchen …",

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
        field: "Bereich",             // verglichen wird klein geschrieben
        buttons: [
          { label: "Alle",       value: "" },
          { label: "Arithmetik", value: "arithmetik" },
          { label: "Algebra",    value: "algebra" },
          { label: "Geometrie",  value: "geometrie" }
        ]
      },
      {
        id: "category",
        title: "Kategorie",
        field: "class",
        buttons: [
          { label: "Alle",     value: "" },
          { label: "Formeln",  value: "formeln" },
          { label: "Begriffe", value: "begriffe" }
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
      "Begriff": "Satz des Pythagoras",
      "Erklärung": "a² + b² = c² im rechtwinkligen Dreieck",
      "Bereich": "Geometrie",
      "Link": "more/pythagoras.html",
      "class": ["formeln", "dreieck"]
    },
    {
      "Begriff": "Binomische Formeln",
      "Erklärung": "(a + b)² = a² + 2ab + b² und Verwandte",
      "Bereich": "Algebra",
      "Link": "",
      "class": ["formeln"]
    },
    {
      "Begriff": "Prozent",
      "Erklärung": "Anteil von hundert: 1 % = 1/100",
      "Bereich": "Arithmetik",
      "Link": "",
      "class": ["begriffe"]
    }
  ]}
};

console.log("[entries] mathe/entries.js geladen:", window.SpickerData["mathe"].oTableEntries.List.length, "Einträge");
