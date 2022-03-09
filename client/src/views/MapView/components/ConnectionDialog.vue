<template>
  <BackdropDialog>
    <TextInput class="connection-dialog__text-field" :field="formFields.userName" v-model="formFields.userName.value" />
    <TextInput
      class="connection-dialog__text-field"
      :field="formFields.stratName"
      v-model="formFields.stratName.value"
    />
    <button class="connection-dialog__submit" @click="handleSubmitAttempt">Submit</button>
  </BackdropDialog>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import { validateForm, Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';
import { nanoid } from 'nanoid';

@Component({
  components: {
    BackdropDialog,
    TextInput,
  },
})
export default class ConnectionDialog extends Vue {
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
  &__submit {
    @include button-default;
    @include spacing('margin-top', sm);
  }

  &__text-field {
    @include spacing('margin-top', xs);
  }
}
</style>
