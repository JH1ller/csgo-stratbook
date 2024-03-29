import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator';
import Loader from '@/components/Loader/Loader.vue';

@Component({
  components: {
    Loader,
  },
})
export default class SmartImage extends Vue {
  @Prop() private src!: string;
  @Prop() private alt!: string;
  private loaded = false;
  private crashed = false;
  private loading = false;

  @Emit()
  private load() {
    this.loading = false;
    this.loaded = true;
    return;
  }

  @Emit()
  private error() {
    this.loading = false;
    this.crashed = true;
    return;
  }

  private mounted() {
    // delay the loading spinner so it doesn't flicker when image loads instantly
    this.delayLoading();
    // timeout loading of unavailable images after 5 seconds
    setTimeout(() => {
      if (!this.loaded) {
        this.loading = false;
        this.crashed = true;
      }
    }, 5000);
  }

  private delayLoading() {
    setTimeout(() => {
      if (!this.loaded) {
        this.loading = true;
      }
    }, 50);
  }

  private get state(): string | undefined {
    if (this.loading) {
      return '-loading';
    } else if (this.crashed) {
      return '-error';
    } else if (this.loaded) {
      return '-loaded';
    }
  }

  @Watch('src')
  private srcChanged() {
    this.loaded = false;
    this.loading = false;
    this.crashed = false;

    this.delayLoading();
  }
}
