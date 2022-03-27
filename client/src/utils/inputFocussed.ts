export const isInputFocussed = () => {
  const el = document.activeElement;
  if (!el) return false;
  return el.hasAttribute('contenteditable') || (el.tagName === 'INPUT' && el.getAttribute('type') === 'text');
};
