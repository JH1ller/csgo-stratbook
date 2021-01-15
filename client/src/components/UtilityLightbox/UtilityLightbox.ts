import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import MouseButtonDisplay from '@/components/MouseButtonDisplay/MouseButtonDisplay.vue';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';
import isMobile from 'is-mobile';

interface LightboxMedia {
  type: 'image' | 'video';
  src: string;
}

@Component({
  components: {
    MouseButtonDisplay,
    UtilityTypeDisplay,
  },
})
export default class UtilityLightbox extends Vue {
  @Prop() private utility!: Utility;
  private showCrosshair: boolean = false;
  private currentMediaIndex: number = 0;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;
  private Sides: typeof Sides = Sides;

  private get currentMedia(): LightboxMedia {
    return this.mediaList[this.currentMediaIndex];
  }

  private get mediaList(): LightboxMedia[] {
    const media: LightboxMedia[] = this.utility.images.map(utility => ({ type: 'image', src: utility }));
    if (this.utility.videoLink) media.push({ type: 'video', src: this.utility.videoLink });

    return media;
  }

  private getYoutubeURL(videoURL: string): string {
    return `http://www.youtube.com/embed/${this.extractVideoId(videoURL)}?&controls=2&origin=${window.location.origin}`;
  }

  private extractVideoId(videoURL: string): string | undefined {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = videoURL.match(regExp);
    if (match && match[7].length === 11) return match[7];
  }

  private getVideoThumbnail(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  private resolveImage(fileURL: string) {
    return resolveStaticImageUrl(fileURL);
  }

  private mounted() {
    if (isMobile()) {
      this.$el.requestFullscreen();
      if ('lock' in screen.orientation) {
        screen.orientation.lock('landscape');
      }
    }
  }

  private unmounted() {
    if (isMobile()) {
      document.exitFullscreen();
      if ('unlock' in screen.orientation) {
        screen.orientation.unlock();
      }
    }
  }

  @Emit()
  private close() {
    return;
  }

  private goToIndex(index: number) {
    this.currentMediaIndex = index;
  }

  private goNext() {
    this.currentMediaIndex === this.mediaList.length - 1 ? (this.currentMediaIndex = 0) : this.currentMediaIndex++;
  }

  private goPrev() {
    this.currentMediaIndex === 0 ? (this.currentMediaIndex = this.mediaList.length - 1) : this.currentMediaIndex--;
  }
}
