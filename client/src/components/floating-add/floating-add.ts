import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

config.autoAddCss = false;
library.add(faPlus);
Vue.component('font-awesome-icon', FontAwesomeIcon);

@Component({
  components: {},
})
export default class FloatingAdd extends Vue {
  @Emit()
  private onClick() {
    return false; // isEditMode = false
  }
}
