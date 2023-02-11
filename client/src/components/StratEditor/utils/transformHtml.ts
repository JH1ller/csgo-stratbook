import { Transformation } from 'replace-keywords';

export const transformMap: Transformation[] = [
  {
    query: '->',
    value: () => `<span contenteditable="false" class="strat-editor__arrow">&#10140;</span>`,
  },
  {
    query: /\b((?:0|1):[0-4]\d)\b/g,
    value: (word) =>
      `<span contenteditable="false" class="strat-editor__tag --timestamp"><span contenteditable="false" class="strat-editor__tag-img" data-clock></span>${word}</span>`,
  },
  {
    query: /^(https?:\/\/)(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/.*)?$/,
    value: (word, _, matches) => {
      return `<a contenteditable="false" class="strat-editor__tag" href="${word}" target="_blank"><span contenteditable="false" class="strat-editor__tag-img" data-link></span>${matches?.[2]}</a>`;
    },
  },
];
