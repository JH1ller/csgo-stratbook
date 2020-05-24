import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faEdit, faTrashAlt);
Vue.component('font-awesome-icon', FontAwesomeIcon);

export interface IRegisterForm {
  displayFormError: (message: string) => void;
}

@Component({
  components: {},
})
export default class RegisterForm extends Vue implements IRegisterForm {
  private formData: any = {
    name: '',
    email: '',
    password: '',
  };
  private formError: string | null = null;

  displayFormError(message: string) {
    this.formError = message;
    this.$forceUpdate();
  }

  @Emit()
  private registerClicked(e: Event) {
    e.preventDefault();
    this.formError = null;
    return this.formData;
  }

  @Emit()
  private loginClicked() {
    return;
  }
}
