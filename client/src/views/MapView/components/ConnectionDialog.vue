<template>
  <BackdropDialog>
    <TextInput class="connection-dialog__text-field" :field="formFields.userName" v-model="formFields.userName.value" />
    <TextInput
      class="connection-dialog__text-field"
      :field="formFields.stratName"
      v-model="formFields.stratName.value"
    />
    <div class="connection-dialog__actions">
      <button class="connection-dialog__btn-submit" @click="handleSubmitAttempt">Submit</button>
      <button class="connection-dialog__btn-cancel" @click="close">Cancel</button>
    </div>
  </BackdropDialog>
</template>

<script lang="ts">
import { Component, Emit, Prop, Mixins } from 'vue-property-decorator';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import { validateForm, Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';
import { nanoid } from 'nanoid';
import CloseOnEscape from '@/mixins/CloseOnEscape';

@Component({
  components: {
    BackdropDialog,
    TextInput,
  },
})
export default class ConnectionDialog extends Mixins(CloseOnEscape) {
  @Prop() userName!: string;
  @Prop() stratName!: string;

  formFields = {
    userName: new FormField('Username', true, [Validators.maxLength(30), Validators.notEmpty()]),
    stratName: new FormField('Strat name', false, [Validators.maxLength(30)]),
  };

  handleSubmitAttempt() {
    if (validateForm(this.formFields)) {
      this.submit();
    }
  }

  @Emit()
  submit() {
    return { userName: this.formFields.userName.value, stratName: this.formFields.stratName.value };
  }

  mounted() {
    this.formFields.userName.value = this.userName ?? `User_${nanoid(5)}`;
    this.formFields.stratName.value = this.stratName;
  }
}
</script>

<style lang="scss">
.connection-dialog {
  &__actions {
    @include spacing('margin-top', xs);
  }

  &__btn-submit {
    @include button-default($color--green, white);
  }

  &__btn-cancel {
    @include button-default;
    @include spacing('margin-left', '3xs');
  }

  &__text-field {
    @include spacing('margin-top', xs);
  }
}
</style>
