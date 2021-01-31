declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module '@feedback-fish/vue';
declare module 'vue-tippy';

declare module '*.json' {
  const value: { [key: string]: any };
  export default value;
}
