export const extractTextFromHTML = (html: string) => {
  var span = document.createElement('span');
  span.innerHTML = html;
  return span.textContent || span.innerText;
};
