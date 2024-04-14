import { Component, Mixins, Prop } from 'vue-property-decorator';
import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import MouseButtonPicker from '@/components/MouseButtonPicker/MouseButtonPicker.vue';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';
import PosePicker from '@/components/PosePicker/PosePicker.vue';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import isMobile from 'is-mobile';
import { parseYoutubeUrl, getEmbedURL, getThumbnailURL } from '@/utils/youtubeUtils';
import CloseOnEscape from '@/mixins/CloseOnEscape';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import { appModule } from '@/store/namespaces';
import TrackingService from '@/services/tracking.service';
import { writeToClipboard } from '@/utils/writeToClipboard';
import { panic } from '@/utils/panic';

interface LightboxMedia {
  type: 'image' | 'video';
  src: string;
}

@Component({
  components: {
    MouseButtonPicker,
    UtilityTypeDisplay,
    SmartImage,
    BackdropDialog,
    PosePicker,
  },
})
export default class UtilityLightbox extends Mixins(CloseOnEscape) {
  @appModule.Action private showToast!: (toast: Toast) => void;
  @Prop() private utility!: Utility;
  private showCrosshair = false;
  private currentMediaIndex = 0;
  private imageRatioStretched = false;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;
  private Sides: typeof Sides = Sides;

  private trackingService = TrackingService.getInstance();

  private get currentMedia(): LightboxMedia | undefined {
    return this.mediaList[this.currentMediaIndex];
  }

  private get mediaList(): LightboxMedia[] {
    const media: LightboxMedia[] = this.utility.images.map((utility) => ({ type: 'image', src: utility }));
    if (this.utility.videoLink) media.push({ type: 'video', src: this.utility.videoLink });

    return media;
  }

  private resolveImage(fileURL: string) {
    return resolveStaticImageUrl(fileURL);
  }

  private getEmbedURL(url: string): string {
    const { id, timestamp } = parseYoutubeUrl(url)!;
    return getEmbedURL(id, timestamp);
  }

  private getThumbnailURL(url: string): string {
    const { id } = parseYoutubeUrl(url) ?? panic('Could not parse youtube url');
    return getThumbnailURL(id);
  }

  private mounted() {
    if (isMobile() && 'requestFullscreen' in this.$el) {
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

  private goToIndex(index: number) {
    this.currentMediaIndex = index;
  }

  private goNext() {
    this.currentMediaIndex === this.mediaList.length - 1 ? (this.currentMediaIndex = 0) : this.currentMediaIndex++;
  }

  private goPrev() {
    this.currentMediaIndex === 0 ? (this.currentMediaIndex = this.mediaList.length - 1) : this.currentMediaIndex--;
  }

  private copySetpos() {
    writeToClipboard(this.utility.setpos!);
    this.showToast({ id: 'utilityLightbox/copySetpos', text: 'Setpos Command copied!' });
    this.trackingService.track('Action: Copy Setpos', { from: 'lightbox' });
  }
}
