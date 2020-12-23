<template>
  <BackdropDialog>
    <form class="strat-form" @submit.prevent="handleSubmit" novalidate>
      <FormFieldSet>
        <TextInput v-model="formFields.name.value" :field="formFields.name" fieldName="name" />
      </FormFieldSet>
      <FormFieldSet>
        <label class="strat-form__label" for="type">Type</label>
        <TypePicker v-model="type" />
      </FormFieldSet>
      <FormFieldSet>
        <label class="strat-form__label">Side</label>
        <SidePicker v-model="side" />
      </FormFieldSet>
      <FormFieldSet>
        <TextInput v-model="formFields.note.value" :field="formFields.note" fieldName="note" />
        <TextInput v-model="formFields.videoLink.value" :field="formFields.videoLink" fieldName="videoLink" />
      </FormFieldSet>
      <div class="strat-form__btn-wrapper">
        <button type="button" @click="cancelClicked"><fa-icon icon="ban" class="strat-form__btn-cancel" /></button>
        <button type="submit"><fa-icon icon="check" class="strat-form__btn-submit" /></button>
      </div>
    </form>
  </BackdropDialog>
</template>

<script lang="ts" src="./StratForm.ts"></script>
<style lang="scss" src="./StratForm.scss"></style>