import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class LoginForm extends Vue {}
