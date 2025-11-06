(function () {
  const renderOpts = {
    delimiters: [
      {left: "$$", right: "$$", display: true},
      {left: "\\[", right: "\\]", display: true},
      {left: "$",  right: "$",  display: false},
      {left: "\\(", right: "\\)", display: false},
    ],
    throwOnError: false
  };

  function renderAll() {
    try { renderMathInElement(document.body, renderOpts); } catch (e) {}
  }

  // Initial render + on Material hot swaps
  document.addEventListener('DOMContentLoaded', renderAll);
  document$.subscribe(renderAll);
})();
