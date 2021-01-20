import { Utility } from '@/api/models/Utility';
import { Component, Emit, Prop, Ref, Vue } from 'vue-property-decorator';
import UtilityItem from '@/components/UtilityItem/UtilityItem.vue';
import { UtilityFilters } from '@/store/modules/filter';
import VueContext from 'vue-context';
@Component({
  components: {
    UtilityItem,
    VueContext,
  },
})
export default class UtilityList extends Vue {
  @Prop() private utilities!: Utility[];
  @Prop() private filters!: UtilityFilters;
  @Ref() private menu!: any;

  private get filteredUtilities() {
    return this.utilities
      .filter(utility => {
        return this.filters.side ? utility.side === this.filters.side : true;
      })
      .filter(utility => {
        return this.filters.type ? utility.type === this.filters.type : true;
      })
      .filter(utility => {
        return this.filters.name ? utility.name.toLowerCase().includes(this.filters.name.toLowerCase()) : true;
      });
  }

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
