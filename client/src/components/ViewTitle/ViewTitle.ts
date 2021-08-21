import { Component, Vue, Watch } from 'vue-property-decorator';
import Loader from '@/components/Loader/Loader';
import { appModule, teamModule } from '@/store/namespaces';
import { Team } from '@/api/models/Team';

@Component({
  components: {
    Loader,
  },
})
export default class ViewTitle extends Vue {
  @teamModule.State private teamInfo!: Team;
  @appModule.State private loading!: boolean;
  private showLoaderCopy: boolean = false;

  private get title() {
    return this.$route.name === 'Strats' && this.teamInfo.name // TODO: create routename enum
      ? this.$route.name + ' - ' + this.teamInfo.name
      : this.$route.name;
  }

  @Watch('loading')
  private showLoaderChanged(to: boolean) {
    if (to) {
      setTimeout(() => {
        this.showLoaderCopy = this.loading;
      }, 500);
    } else {
      this.showLoaderCopy = false;
    }
  }
}
