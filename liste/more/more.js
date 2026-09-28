document.addEventListener("DOMContentLoaded", function initializeMorePages() {
  const codeBlocks = document.querySelectorAll("pre, .code-block");

  codeBlocks.forEach(function addCopyButtonToBlock(block) {
    const codeBlockContent = block.tagName === "PRE" ? block : (block.querySelector("code") || block);

    if (!codeBlockContent || !block.parentNode) {
      return;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "copy-button";
    button.textContent = "Copy";
    block.parentNode.insertBefore(button, block);

    button.addEventListener("click", async function copyCodeBlockContent() {
      const textToCopy = codeBlockContent.textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        button.textContent = "Copied!";
        setTimeout(function restoreCopyButtonLabel() {
          button.textContent = "Copy";
        }, 1200);
      } catch (error) {
        button.textContent = "Fehler";
        console.error("Copy failed", error);
      }
    });
  });

  const smartLinkRules = [
    { test: function matchesTableTerm(value) { return /^(Tabelle|Tabellen)$/i.test(value); }, href: "table.html" },
    { test: function matchesListTerm(value) { return /^(Liste|Listen)$/i.test(value); }, href: "liste.html" },
    { test: function matchesFormTerm(value) { return /^(Formular|Formulare)$/i.test(value); }, href: "form.html" },
    { test: function matchesContainerTerm(value) { return /^(Container|Containern)$/i.test(value); }, href: "container.html" },
    { test: function matchesFunctionTerm(value) { return /^(Funktion|Funktionen)$/i.test(value); }, href: "function.html" },
    { test: function matchesVariableTerm(value) { return /^(Variable|Variablen)$/i.test(value); }, href: "variable.html" },
    { test: function matchesForLoopTerm(value) { return /^for-Schleife$/i.test(value); }, href: "for-loop.html" },
    { test: function matchesLoopTerm(value) { return /^(Schleife|Schleifen|while-Schleife)$/i.test(value); }, href: "while-loop.html" },
    { test: function matchesImageTerm(value) { return /^(Bild|Bilder)$/i.test(value); }, href: "img.html" },
    { test: function matchesLinkTerm(value) { return /^(Link|Links|Hyperlink|Hyperlinks)$/i.test(value); }, href: "a.html" },
    { test: function matchesAttributeTerm(value) { return /^(Attribut|Attribute|ID-Attribut)$/i.test(value); }, href: "id.html" },
    { test: function matchesConditionalTerm(value) { return /^if-else$/i.test(value); }, href: "if-else.html" }
  ];

  const smartLinkPattern = /\b(?:Tabelle(?:n)?|Listen?|Formular(?:e)?|Container(?:n)?|Funktion(?:en)?|Variable(?:n)?|for-Schleife|Schleife(?:n)?|while-Schleife|Bild(?:er)?|Link(?:s)?|Hyperlink(?:s)?|Attribut(?:e)?|ID-Attribut|if-else)\b/gi;

  function findMatchingSmartLinkRule(value) {
    return smartLinkRules.find(function isMatchingSmartLinkRule(rule) {
      return rule.test(value);
    }) || null;
  }

  function replaceTextNodeTermsWithLinks(textNode) {
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
      const rule = findMatchingSmartLinkRule(match[0]);

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

  textContainers.forEach(function addSmartLinksToContainer(container) {
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: function shouldVisitTextNode(node) {
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

    textNodes.forEach(replaceTextNodeTermsWithLinks);
  });
});
