import { appModule } from '@/store/namespaces';
import { Component, Vue, Watch } from 'vue-property-decorator';

@Component({})
export default class LoadingBar extends Vue {
  @appModule.State loading!: boolean;

  visible = false;
  width = 0;
  wait = false;
  transition = false;

  get style() {
    return {
      width: this.width + '%',
      opacity: +this.visible,
      transition: this.transition ? 'width 0.5s ease-in-out, opacity 0.3s ease' : 'opacity 0.3s ease',
    };
  }

  @Watch('loading')
  loadingChanged(to: boolean) {
    if (to) {
      if (this.wait) return;
      this.wait = true;
      this.transition = true;
      this.width = 60;
      this.visible = true;
    } else {
      this.wait = true;
      this.transition = true;
      this.width = 100;
      setTimeout(() => {
        this.visible = false;
        setTimeout(() => {
          this.transition = false;
          this.width = 0;
          this.wait = false;
        }, 300);
      }, 500);
    }
  }
}
