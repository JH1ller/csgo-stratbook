import { Component, Prop, Vue, Emit } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faBan, faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faBan, faCheck);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({})
export default class ConfirmDialog extends Vue {
  @Prop() text!: string;
  @Prop() resolve!: () => void;
  @Prop() reject!: () => void;

  private confirmClicked() {
    this.resolve();
    this.close();
  }

  private cancelClicked() {
    this.reject();
    this.close();
  }

  @Emit()
  private close() {}
}
