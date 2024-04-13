import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';
import { parseYoutubeUrl, getThumbnailURL } from '@/utils/youtubeUtils';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import LabelsDialog from '@/components/LabelsDialog/LabelsDialog.vue';
import { utilityModule } from '@/store/namespaces';
import { toFormData } from 'axios';

@Component({
  components: {
    UtilityTypeDisplay,
    SmartImage,
    LabelsDialog,
  },
})
export default class UtilityItem extends Vue {
  @utilityModule.Getter readonly allLabels!: string[];
  @utilityModule.Action readonly updateUtility!: (payload: FormData) => Promise<void>;
  @Prop() utility!: Utility;
  @Prop() readOnly!: boolean;

  labelDialogOpen = false;

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

  addLabel(value: string) {
    this.updateUtility(toFormData({ _id: this.utility._id, labels: [...this.utility.labels, value] }) as FormData);
  }

  removeLabel(label: string) {
    const labels = this.utility.labels.filter((str) => str !== label);
    console.log(labels);
    console.log(toFormData({ _id: this.utility._id, labels }));
    this.updateUtility(toFormData({ _id: this.utility._id, labels }) as FormData);
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
