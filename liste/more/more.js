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
});
