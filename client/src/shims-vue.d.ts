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
