declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue-context';
declare module 'vue-mention';
declare module 'vue-tribute';
declare module 'sanitize-html';
declare module '@feedback-fish/vue';
declare module 'vue-tippy';
declare module 'vue-image-markup';
declare module 'vue-swatches';
declare module 'vuex/dist/logger';
declare module '@analytics/google-analytics';
declare module '@analytics/google-tag-manager';

declare module '*.json' {
  const value: { [key: string]: any };
  export default value;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.module.scss' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

declare module '*.scss' {
  const styles: { [className: string]: string };
  export default styles;
}
