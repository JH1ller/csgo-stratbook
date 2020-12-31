<template>
  <BackdropDialog>
    <form class="utility-form" @submit.prevent="handleSubmit" novalidate>
      <FormFieldSet>
        <TextInput v-model="formFields.name.value" :field="formFields.name" fieldName="name" />
        <TextInput v-model="formFields.description.value" :field="formFields.description" fieldName="description" />
        <TextInput v-model="formFields.videoLink.value" :field="formFields.videoLink" fieldName="videoLink" />
      </FormFieldSet>
      <FormFieldSet>
        <div class="utility-form__horizontal-wrapper">
          <div class="utility-form__vertical-wrapper">
            <label class="utility-form__label">Side</label>
            <SidePicker v-model="side" />
          </div>
          <div class="utility-form__vertical-wrapper">
            <label class="utility-form__label">Throw settings</label>
            <div class="utility-form__config-wrapper">
              <MouseButtonPicker v-model="mouseButton" />
              <PosePicker
                :crouch="crouch"
                :movement="movement"
                @toggle-crouch="toggleCrouch"
                @toggle-movement="toggleMovement"
              />
            </div>
          </div>
        </div>
      </FormFieldSet>
      <FormFieldSet>
        <label class="utility-form__label" for="type">Type</label>
        <UtilityPicker v-model="type" />
      </FormFieldSet>
      <FormFieldSet>
        <label class="utility-form__label">Screenshots</label>
        <ImageUploader v-model="files" :limit="3" />
      </FormFieldSet>

      <div class="utility-form__btn-wrapper">
        <button type="button" @click="cancelClicked" class="utility-form__btn --cancel">
          Cancel
          <fa-icon icon="ban" />
        </button>
        <button type="submit" class="utility-form__btn --submit">
          Save
          <fa-icon icon="check" />
        </button>
      </div>
    </form>
  </BackdropDialog>
</template>

<script lang="ts" src="./UtilityForm.ts"></script>
<style lang="scss" src="./UtilityForm.scss"></style>