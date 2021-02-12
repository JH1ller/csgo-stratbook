export const extractTextFromHTML = (html: string) => {
  const span = document.createElement('span');
  span.innerHTML = html;
  const text = span.textContent ?? span.innerText;
  return text;
};
