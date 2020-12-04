import { Utility } from '@/api/models/Utility';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import UtilityItem from '@/components/UtilityItem/UtilityItem.vue';

@Component({
  components: {
    UtilityItem,
  },
})
export default class UtilityList extends Vue {
  @Prop() private utilities!: Utility[];

  @Emit()
  private openInLightbox(utility: Utility) {
    return utility;
  }
}
