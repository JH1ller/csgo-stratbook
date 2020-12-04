import { Sides } from '@/api/models/Sides';
import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import SidePicker from '@/components/SidePicker/SidePicker.vue';
import UtilityPicker from '@/components/UtilityPicker/UtilityPicker.vue';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import ImageUploader from '@/components/ImageUploader/ImageUploader.vue';
import PosePicker from '@/components/PosePicker/PosePicker.vue';
import FormFieldSet from '@/components/FormFieldSet/FormFieldSet.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import MouseButtonPicker from '@/components/MouseButtonPicker/MouseButtonPicker.vue';
import { FormFieldData, validate, Validators } from '@/utils/validation';
import { Utility } from '@/api/models/Utility';
import { UtilityTypes } from '@/api/models/UtilityTypes';
import { MouseButtons } from '@/api/models/MouseButtons';
import { UtilityMovement } from '@/api/models/UtilityMovement';

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
export default class UtilityForm extends Vue {
  @Prop() utility!: Utility;
  @Prop() isEdit!: boolean;

  private formFields: Record<string, FormFieldData> = {
    name: {
      label: 'Name',
      required: true,
      value: '',
      hasError: false,
      autocompleteTag: '',
      validators: [Validators.notEmpty(), Validators.maxLength(50)],
    },
    description: {
      label: 'Description',
      required: false,
      value: '',
      hasError: false,
      autocompleteTag: '',
      validators: [Validators.maxLength(200)],
    },
    videoLink: {
      label: 'Video Link',
      required: false,
      value: '',
      hasError: false,
      autocompleteTag: '',
      validators: [Validators.maxLength(100), Validators.isURL()],
    },
  };

  private type: UtilityTypes = UtilityTypes.SMOKE;
  private side: Sides = Sides.T;
  private mouseButton: MouseButtons = MouseButtons.LEFT;
  private crouch = false;
  private movement = UtilityMovement.STILL;
  private files: File[] = [];

  private mounted() {
    if (this.utility && this.isEdit) {
      this.mapToFields();
    }
  }

  private submitClicked() {
    if (this.isValid()) {
      this.submitUtility();
    }
  }

  @Emit()
  private submitUtility(): FormData {
    const requestFormData = new FormData();

    this.files.forEach(file => requestFormData.append('images', file, file.name));

    for (const [key, data] of Object.entries(this.formFields)) {
      requestFormData.append(key, data.value);
    }

    requestFormData.append('type', this.type);
    requestFormData.append('side', this.side);
    requestFormData.append('mouseButton', this.mouseButton);
    requestFormData.append('crouch', JSON.stringify(this.crouch));
    requestFormData.append('movement', this.movement);

    return requestFormData;
  }

  @Emit()
  private cancelClicked() {
    return;
  }

  private isValid(): boolean {
    let valid = true;

    const fields = Object.entries(this.formFields);

    fields.forEach(([fieldName, fieldData]) => {
      if (!validate(fieldData)) {
        valid = false;
        this.formFields[fieldName].hasError = true;
      }
    });

    return valid;
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
