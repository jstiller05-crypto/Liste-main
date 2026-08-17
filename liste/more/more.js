document.addEventListener("DOMContentLoaded", () => {
  const preElements = document.querySelectorAll("pre");

  preElements.forEach(pre => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    pre.parentNode.insertBefore(button, pre);

    button.addEventListener("click", async () => {
      const textToCopy = pre.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        button.textContent = "Copied!";
        setTimeout(() => {
          button.textContent = "Copy";
        }, 1200);
      } catch (error) {
        button.textContent = "Fehler";
        console.error("Copy failed", error);
      }
    });
  });

  const smartLinkRules = [
    { test: value => /^(Tabelle|Tabellen)$/i.test(value), href: "table.html" },
    { test: value => /^(Liste|Listen)$/i.test(value), href: "liste.html" },
    { test: value => /^(Formular|Formulare)$/i.test(value), href: "form.html" },
    { test: value => /^(Container|Containern)$/i.test(value), href: "container.html" },
    { test: value => /^(Funktion|Funktionen)$/i.test(value), href: "function.html" },
    { test: value => /^(Variable|Variablen)$/i.test(value), href: "variable.html" },
    { test: value => /^for-Schleife$/i.test(value), href: "for-loop.html" },
    { test: value => /^(Schleife|Schleifen|while-Schleife)$/i.test(value), href: "while-loop.html" },
    { test: value => /^(Bild|Bilder)$/i.test(value), href: "img.html" },
    { test: value => /^(Link|Links|Hyperlink|Hyperlinks)$/i.test(value), href: "a.html" },
    { test: value => /^(Attribut|Attribute|ID-Attribut)$/i.test(value), href: "id.html" },
    { test: value => /^if-else$/i.test(value), href: "if-else.html" }
  ];

  const smartLinkPattern = /\b(?:Tabelle(?:n)?|Listen?|Formular(?:e)?|Container(?:n)?|Funktion(?:en)?|Variable(?:n)?|for-Schleife|Schleife(?:n)?|while-Schleife|Bild(?:er)?|Link(?:s)?|Hyperlink(?:s)?|Attribut(?:e)?|ID-Attribut|if-else)\b/gi;

  function findSmartLinkRule(value) {
    return smartLinkRules.find(rule => rule.test(value)) || null;
  }

  function replaceSmartLinksInTextNode(textNode) {
    const text = textNode.textContent;
    smartLinkPattern.lastIndex = 0;

    if (!smartLinkPattern.test(text)) {
      return;
    }

    smartLinkPattern.lastIndex = 0;
    let lastIndex = 0;
    const fragment = document.createDocumentFragment();
    let match;

    while ((match = smartLinkPattern.exec(text)) !== null) {
      const rule = findSmartLinkRule(match[0]);

      if (!rule) {
        continue;
      }

      if (match.index > lastIndex) {
        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
      }

      const link = document.createElement("a");
      link.href = rule.href;
      link.className = "smart-link";
      link.textContent = match[0];
      fragment.appendChild(link);
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex === 0) {
      return;
    }

    if (lastIndex < text.length) {
      fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    textNode.replaceWith(fragment);
  }

  const textContainers = document.querySelectorAll("main p, main li, main h2");

  textContainers.forEach(container => {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function (node) {
        const parent = node.parentElement;

        if (!parent || parent.closest("a, code, pre, script, style")) {
          return NodeFilter.FILTER_REJECT;
        }

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const textNodes = [];
    let currentNode;

    while ((currentNode = walker.nextNode())) {
      textNodes.push(currentNode);
    }

    textNodes.forEach(replaceSmartLinksInTextNode);
  });
});
