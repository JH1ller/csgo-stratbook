import { Component, Vue, Watch } from 'vue-property-decorator';
import Loader from '@/components/loader/loader.vue';
import { namespace } from 'vuex-class';
import { Team } from '@/services/models';

const teamModule = namespace('team');
const appModule = namespace('app');

@Component({
  components: {
    Loader,
  },
})
export default class ViewTitle extends Vue {
  @teamModule.State private teamInfo!: Team;
  @appModule.State(state => state.ui.showLoader) private showLoader!: boolean;
  private showLoaderCopy: boolean = false;

  private get title() {
    return this.$route.name === 'Strats' && this.teamInfo.name // TODO: create routename enum
      ? this.$route.name + ' - ' + this.teamInfo.name
      : this.$route.name;
  }

  @Watch('showLoader')
  private showLoaderChanged(to: boolean) {
    if (to) {
      setTimeout(() => {
        this.showLoaderCopy = this.showLoader;
      }, 500);
    } else {
      this.showLoaderCopy = false;
    }
  }
}
