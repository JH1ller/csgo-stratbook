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
  @Prop() utility!: Utility;
  @Prop() readOnly!: boolean;

  UtilityMovement: typeof UtilityMovement = UtilityMovement;
  Sides: typeof Sides = Sides;

  get utilityImage(): string | undefined {
    if (this.utility.images.length) {
      return resolveStaticImageUrl(this.utility.images[0]);
    }

    if (this.utility.videoLink) {
      return getThumbnailURL(parseYoutubeUrl(this.utility.videoLink)!.id);
    }
  }

  @Emit()
  openInLightbox() {
    return this.utility;
  }

  @Emit()
  openMenu(e: Event) {
    return e;
  }
}
