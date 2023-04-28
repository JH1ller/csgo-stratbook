import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';
import { parseYoutubeUrl, getThumbnailURL } from '@/utils/youtubeUtils';
import SmartImage from '@/components/SmartImage/SmartImage.vue';

@Component({
  components: {
    UtilityTypeDisplay,
    SmartImage,
  },
})
export default class UtilityItem extends Vue {
  @Prop() private utility!: Utility;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;
  private Sides: typeof Sides = Sides;

  private get utilityImage(): string | undefined {
    if (this.utility.images.length) {
      return resolveStaticImageUrl(this.utility.images[0]);
    }

    if (this.utility.videoLink) {
      return getThumbnailURL(parseYoutubeUrl(this.utility.videoLink)!.id);
    }
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
