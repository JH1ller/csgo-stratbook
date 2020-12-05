import { Utility } from '@/api/models/Utility';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import UtilityItem from '@/components/UtilityItem/UtilityItem.vue';
import { UtilityFilters } from '@/store/modules/filter';

@Component({
  components: {
    UtilityItem,
  },
})
export default class UtilityList extends Vue {
  @Prop() private utilities!: Utility[];
  @Prop() private filters!: UtilityFilters;

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
}
