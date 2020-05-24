import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

export interface ILoginForm {
  displayFormError: (message: string) => void;
}

@Component({
  components: {},
})
export default class LoginForm extends Vue implements ILoginForm {
  private email: string = '';
  private password: string = '';
  private formError: string | null = null;

  displayFormError(message: string) {
    this.formError = message;
    this.$forceUpdate();
  }

  @Emit()
  private loginClicked(e: Event) {
    e.preventDefault();
    this.formError = null;
    return { email: this.email, password: this.password };
  }

  @Emit()
  private registerClicked() {
    return;
  }
}
