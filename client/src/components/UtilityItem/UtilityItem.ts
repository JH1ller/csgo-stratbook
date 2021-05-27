import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import MouseButtonDisplay from '@/components/MouseButtonDisplay/MouseButtonDisplay.vue';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';
import { extractVideoId, getThumbnailURL } from '@/utils/youtubeUtils';
import SmartImage from '@/components/SmartImage/SmartImage.vue';

@Component({
  components: {
    MouseButtonDisplay,
    UtilityTypeDisplay,
    SmartImage,
  },
})
export default class UtilityItem extends Vue {
  @Prop() private utility!: Utility;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;
  private Sides: typeof Sides = Sides;

  private getThumbnailURL: typeof getThumbnailURL = getThumbnailURL;
  private extractVideoId: typeof extractVideoId = extractVideoId;

  private get utilityImage(): string {
    return this.utility.images.length
      ? resolveStaticImageUrl(this.utility.images[0])
      : getThumbnailURL(extractVideoId(this.utility.videoLink!)!) ?? '';
  }

  @Emit()
  private openInLightbox() {
    return this.utility;
  }

  @Emit()
  private openMenu(e: Event) {
    return e;
  }
}
