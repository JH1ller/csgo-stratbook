import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import MouseButtonDisplay from '@/components/MouseButtonDisplay/MouseButtonDisplay.vue';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';

@Component({
  components: {
    MouseButtonDisplay,
    UtilityTypeDisplay,
  },
})
export default class UtilityLightbox extends Vue {
  @Prop() private utility!: Utility;
  private showCrosshair: boolean = false;
  private currentImageIndex: number = 0;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;
  private Sides: typeof Sides = Sides;

  private get currentImage(): string {
    return resolveStaticImageUrl(this.utility.images[this.currentImageIndex]);
  }

  private resolveImage(fileURL: string) {
    return resolveStaticImageUrl(fileURL);
  }

  @Emit()
  private close() {
    return;
  }

  private goToIndex(index: number) {
    this.currentImageIndex = index;
  }

  private goNext() {
    this.currentImageIndex === this.utility.images.length - 1 ? (this.currentImageIndex = 0) : this.currentImageIndex++;
  }

  private goPrev() {
    this.currentImageIndex === 0 ? (this.currentImageIndex = this.utility.images.length - 1) : this.currentImageIndex--;
  }
}
