import { Transformation } from 'replace-keywords';

export const transformMap: Transformation[] = [
  {
    query: '->',
    value: () => `<span contenteditable="false" class="strat-editor__arrow">&#10140;</span>`,
  },
  {
    query: /(?<!\/>[\s]*)\b((?:0|1):[0-4]\d)\b/g,
    value: word => `<span contenteditable="false" class="strat-editor__tag --timestamp"><img 
    class="strat-editor__tag-img" src="icons/clock.svg" />${word}</span>`,
  },
];
