<template>
  <BackdropDialog>
    <form class="strat-form" @submit.prevent="handleSubmit" novalidate>
      <FormFieldSet>
        <TextInput v-model="formFields.name.value" :field="formFields.name" fieldName="name" />
      </FormFieldSet>
      <FormFieldSet>
        <label class="strat-form__label" for="type">Type</label>
        <TypePicker v-model="types" />
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
        <button type="button" @click="close" class="strat-form__btn --cancel">
          <fa-icon icon="ban" />
          Cancel
        </button>
        <button type="submit" class="strat-form__btn --submit">
          <fa-icon icon="check" />
          Save
        </button>
      </div>
    </form>
  </BackdropDialog>
</template>

<script lang="ts" src="./StratForm.ts"></script>
<style lang="scss" src="./StratForm.scss"></style>