import Vue from 'vue';
import VueTippy, { TippyComponent } from 'vue-tippy';

Vue.use(VueTippy, {
  directive: 'tippy',
  animateFill: true,
  distance: 5,
  duration: [300, 100],
  delay: [300, 0],
  animation: 'scale',
});
Vue.component('tippy', TippyComponent);
