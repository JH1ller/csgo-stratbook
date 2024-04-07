import { Utility } from '@/api/models/Utility';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import UtilityItem from '@/components/UtilityItem/UtilityItem.vue';
import VueContext from 'vue-context';
import { appModule } from '@/store/namespaces';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import TrackingService from '@/services/tracking.service';
import { writeToClipboard } from '@/utils/writeToClipboard';

@Component({
  components: {
    UtilityItem,
    VueContext,
  },
})
export default class UtilityList extends Vue {
  @appModule.Action showToast!: (toast: Toast) => void;
  @Prop() utilities!: Utility[];
  @Prop() readOnly!: boolean;
  @Ref() menu!: any;

  trackingService = TrackingService.getInstance();

  @Emit()
  openInLightbox(utility: Utility) {
    return utility;
  }

  @Emit()
  editUtility(utility: Utility) {
    return utility;
  }

  @Emit()
  shareUtility(utility: Utility) {
    return utility;
  }

  @Emit()
  deleteUtility(utility: Utility) {
    return utility;
  }

  copySetpos(utility: Utility) {
    writeToClipboard(utility.setpos!);
    this.showToast({ id: 'utilityList/copySetpos', text: 'Setpos Command copied!' });
    this.trackingService.track('Action: Copy Setpos', { from: 'context-menu' });
  }

  openMenu(e: Event, utility: Utility) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.menu.open(e, { utility });

    // v-if, v-show, classbinding etc. doesn't work on vue-context elements, therefore
    // I have to solve it this way for now. :/
    const contextElement = document.querySelector('[data-context-setpos]');
    if (utility.setpos) {
      contextElement?.classList.remove('hidden');
    } else {
      contextElement?.classList.add('hidden');
    }
  }
}
