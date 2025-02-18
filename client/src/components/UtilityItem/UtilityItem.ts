import { Sides } from '@/api/models/Sides';
import { Utility } from '@/api/models/Utility';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Component, Emit, Prop, Vue } from 'vue-property-decorator';
import UtilityTypeDisplay from '@/components/UtilityTypeDisplay/UtilityTypeDisplay.vue';
import { parseYoutubeUrl, getThumbnailURL } from '@/utils/youtubeUtils';
import SmartImage from '@/components/SmartImage/SmartImage.vue';
import LabelsDialog from '@/components/LabelsDialog/LabelsDialog.vue';
import { appModule, filterModule, utilityModule } from '@/store/namespaces';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { Toast } from '../ToastWrapper/ToastWrapper.models';

@Component({
  components: {
    UtilityTypeDisplay,
    SmartImage,
    LabelsDialog,
  },
})
export default class UtilityItem extends Vue {
  @utilityModule.Getter readonly allLabels!: string[];
  @utilityModule.Action readonly updateUtility!: (payload: FormData | Partial<Utility>) => Promise<void>;
  @filterModule.Action updateUtilityTypeFilter!: (types: UtilityTypes) => Promise<void>;
  @filterModule.Action updateUtilitySideFilter!: (side: Sides | null) => Promise<void>;
  @appModule.Action showToast!: (toast: Toast) => void;

  @Prop() utility!: Utility;
  @Prop() readOnly!: boolean;

  labelDialogOpen = false;

  UtilityMovement: typeof UtilityMovement = UtilityMovement;
  Sides: typeof Sides = Sides;

  get utilityImage(): string | undefined {
    if (this.utility.images.length) {
      return resolveStaticImageUrl(this.utility.images[0]);
    }

    if (this.utility.videoLink && !this.utility.videoLink.includes('csnades.gg')) {
      return getThumbnailURL(parseYoutubeUrl(this.utility.videoLink)!.id);
    }
  }

  addLabel(value: string) {
    if (this.readOnly) return;
    this.updateUtility({ _id: this.utility._id, labels: [...this.utility.labels, value] });
  }

  removeLabel(label: string) {
    if (this.readOnly) return;
    const labels = this.utility.labels.filter((str) => str !== label);
    this.updateUtility({ _id: this.utility._id, labels });
  }

  filterType() {
    this.updateUtilityTypeFilter(this.utility.type);
    this.showToast({ id: 'UtilityItem/appliedTypeFilter', text: `Applied Filter: ${this.utility.type}` });
  }

  filterSide() {
    this.updateUtilitySideFilter(this.utility.side);
    this.showToast({ id: 'UtilityItem/appliedSideFilter', text: `Applied Filter: ${this.utility.side}` });
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
