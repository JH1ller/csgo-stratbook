import { Utility } from '@/api/models/Utility';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import UtilityItem from '@/components/UtilityItem/UtilityItem.vue';
import VueContext from 'vue-context';
@Component({
  components: {
    UtilityItem,
    VueContext,
  },
})
export default class UtilityList extends Vue {
  @Prop() private utilities!: Utility[];
  @Ref() private menu!: any;

  @Emit()
  private openInLightbox(utility: Utility) {
    return utility;
  }

  @Emit()
  private editUtility(utility: Utility) {
    return utility;
  }

  @Emit()
  private shareUtility(utility: Utility) {
    return utility;
  }

  @Emit()
  private deleteUtility(utility: Utility) {
    return utility;
  }

  private openMenu(e: Event, utility: Utility) {
    e.preventDefault();
    e.stopImmediatePropagation();
    this.menu.open(e, { utility });
  }
}
