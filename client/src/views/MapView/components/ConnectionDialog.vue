<template>
  <BackdropDialog>
    <TextInput :field="nameField" v-model="name" />
    <button class="connection-dialog__submit" @click="submit">Connect</button>
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
  @Prop() inputName!: string;

  name = '';
  nameField = new FormField('Name', true, [Validators.maxLength(30), Validators.notEmpty()]);

  @Emit()
  submit() {
    return this.name;
  }

  mounted() {
    this.name = this.inputName ?? `User${Math.random() * 100}`;
  }
}
</script>

<style lang="scss">
.connection-dialog {
  &__submit {
  }
}
</style>
