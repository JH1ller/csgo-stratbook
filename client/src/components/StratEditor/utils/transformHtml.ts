import { Transformation } from 'replace-keywords';

export const transformMap: Transformation[] = [
  {
    query: '->',
    value: () => `<span contenteditable="false" class="strat-editor__arrow">&#10140;</span>`,
  },
  {
    query: /\b((?:0|1):[0-4]\d)\b/g,
    value: (word) => `<span contenteditable="false" class="strat-editor__tag --timestamp"><img 
    class="strat-editor__tag-img" src="icons/clock.svg" />${word}</span>`,
  },
  {
    query: /^(https?:\/\/)(?:www\.)?([a-zA-Z0-9-]+\.[a-zA-Z]{2,})(\/.*)?$/,
    value: (word, _, matches) => {
      console.log(matches);
      console.log(require(`!!raw-loader!@/assets/icons/external-link.svg`));
      return `<a contenteditable="false" class="strat-editor__link" href="${word}" target="_blank">${matches?.[2]}${
        require(`!!raw-loader!@/assets/icons/external-link.svg`).default
      }</a>`;
    },
  },
];
