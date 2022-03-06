<template>
  <BackdropDialog>
    <TextInput class="connection-dialog__text-field" :field="userNameField" v-model="userNameValue" />
    <TextInput class="connection-dialog__text-field" :field="stratNameField" v-model="stratNameValue" />
    <button class="connection-dialog__submit" @click="submit">Submit</button>
  </BackdropDialog>
</template>

<script lang="ts">
import { Vue, Component, Emit, Prop } from 'vue-property-decorator';
import BackdropDialog from '@/components/BackdropDialog/BackdropDialog.vue';
import TextInput from '@/components/TextInput/TextInput.vue';
import { Validators } from '@/utils/validation';
import FormField from '@/utils/FormField';

@Component({
  components: {
    BackdropDialog,
    TextInput,
  },
})
export default class ConnectionDialog extends Vue {
  @Prop() userName!: string;
  @Prop() stratName!: string;

  userNameValue = '';
  stratNameValue = '';
  userNameField = new FormField('Username', true, [Validators.maxLength(30), Validators.notEmpty()]);
  stratNameField = new FormField('Strat name', false, [Validators.maxLength(30)]);

  @Emit()
  submit() {
    return { userName: this.userNameValue, stratName: this.stratNameValue };
  }

  mounted() {
    this.userNameValue = this.userName ?? `User${Math.random() * 100}`;
    this.stratNameValue = this.stratName;
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
