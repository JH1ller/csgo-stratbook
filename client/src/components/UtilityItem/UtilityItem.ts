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
export default class UtilityItem extends Vue {
  @Prop() private utility!: Utility;

  private UtilityMovement: typeof UtilityMovement = UtilityMovement;
  private Sides: typeof Sides = Sides;

  private get utilityImage(): string {
    return resolveStaticImageUrl(this.utility.images[0]);
  }

  @Emit()
  private openInLightbox() {
    return this.utility;
  }
}
