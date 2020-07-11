import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import Loader from '@/components/loader/loader.vue';
import { Route } from 'vue-router';
import { State } from 'vuex-class';
import { Team } from '@/services/models';

@Component({
  components: {
    Loader,
  },
})
export default class ViewTitle extends Vue {
  @State private teamInfo!: Team;
  @State(state => state.ui.showLoader) private showLoader!: boolean;

  private get title() {
    return this.$route.name === 'Strats' && this.teamInfo.name
      ? this.$route.name + ' - ' + this.teamInfo.name
      : this.$route.name;
  }
}
