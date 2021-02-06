import { Sides } from '@/api/models/Sides';
import { Component, Prop, Emit, Mixins } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import UtilityPicker from '@/components/UtilityPicker/UtilityPicker.vue';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import PosePicker from '@/components/PosePicker/PosePicker.vue';
import FormFieldSet from '@/components/FormFieldSet/FormFieldSet.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import MouseButtonPicker from '@/components/MouseButtonPicker/MouseButtonPicker.vue';
import { validateForm, Validators } from '@/utils/validation';
import { Utility } from '@/api/models/Utility';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { MouseButtons } from '@/api/models/MouseButtons';
import { UtilityMovement } from '@/api/models/UtilityMovement';
import FormField from '@/utils/FormField';
import { appModule } from '@/store/namespaces';
import { Toast } from '../ToastWrapper/ToastWrapper.models';
import CloseOnEscape from '@/mixins/CloseOnEscape';

@Component({
  components: {
    SidePicker,
    BackdropDialog,
    TextInput,
    UtilityPicker,
    FormFieldSet,
    ImageUploader,
    MouseButtonPicker,
    PosePicker,
  },
})
export default class UtilityForm extends Mixins(CloseOnEscape) {
  @appModule.Action private showToast!: (toast: Toast) => void;
  @Prop() utility!: Utility;
  @Prop() isEdit!: boolean;

  private formFields: Record<string, FormField> = {
    name: new FormField('Name', true, [Validators.notEmpty(), Validators.maxLength(50)]),
    description: new FormField('Description', false, [Validators.maxLength(200)]),
    videoLink: new FormField('Video Link', false, [Validators.isYoutubeLink()]),
  };

  private type: UtilityTypes = UtilityTypes.SMOKE;
  private side: Sides = Sides.T;
  private mouseButton: MouseButtons = MouseButtons.LEFT;
  private crouch = false;
  private movement = UtilityMovement.STILL;
  private files: (File | string)[] = [];

  private mounted() {
    if (this.utility && this.isEdit) {
      this.mapToFields();
    }
  }

  private handleSubmit() {
    if (validateForm(this.formFields)) {
      if (this.files.length || this.formFields.videoLink.value) {
        this.submitUtility();
      } else {
        this.showToast({
          id: 'utilityForm/noMedia',
          text: 'You need to add at least 1 image or a video link.',
        });
      }
    }
  }

  @Emit()
  private submitUtility(): FormData {
    const requestFormData = new FormData();

    const filesToDelete: string[] = [];

    this.utility?.images.forEach(image => {
      if (!this.files.find(file => file === image)) {
        filesToDelete.push(image);
      }
    });

    if (filesToDelete.length) {
      requestFormData.append('delete', JSON.stringify(filesToDelete));
    }

    this.files.forEach(file => {
      if (typeof file !== 'string') {
        requestFormData.append('images', file, file.name);
      }
    });

    for (const [key, data] of Object.entries(this.formFields)) {
      requestFormData.append(key, data.value);
    }

    if (this.isEdit) requestFormData.append('_id', this.utility._id);

    requestFormData.append('type', this.type);
    requestFormData.append('side', this.side);
    requestFormData.append('mouseButton', this.mouseButton);
    requestFormData.append('crouch', JSON.stringify(this.crouch));
    requestFormData.append('movement', this.movement);

    return requestFormData;
  }

  private mapToFields() {
    this.formFields.name.value = this.utility.name;
    this.formFields.description.value = this.utility.description ?? '';
    this.formFields.videoLink.value = this.utility.videoLink ?? '';
    this.type = this.utility.type;
    this.side = this.utility.side;
    this.mouseButton = this.utility.mouseButton;
    this.crouch = this.utility.crouch;
    this.movement = this.utility.movement;
    this.files.push(...this.utility.images);
  }

  private toggleCrouch() {
    this.crouch = !this.crouch;
  }

  private toggleMovement() {
    switch (this.movement) {
      case UtilityMovement.STILL:
        this.movement = UtilityMovement.WALK;
        break;
      case UtilityMovement.WALK:
        this.movement = UtilityMovement.RUN;
        break;
      case UtilityMovement.RUN:
        this.movement = UtilityMovement.STILL;
        break;
    }
  }
}
