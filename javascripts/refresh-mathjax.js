// Re-typeset math every time Material replaces the page content
document$.subscribe(() => {
  if (window.MathJax && window.MathJax.typesetPromise) {
    MathJax.typesetPromise();
  }
});
