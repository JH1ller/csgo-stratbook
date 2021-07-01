<template>
  <BackdropDialog>
    <form class="utility-form" @submit.prevent="handleSubmit" novalidate>
      <FormFieldSet>
        <TextInput v-model="formFields.name.value" :field="formFields.name" fieldName="name" />
        <TextInput v-model="formFields.description.value" :field="formFields.description" fieldName="description" />
        <div class="utility-form__input-wrapper">
          <TextInput v-model="formFields.videoLink.value" :field="formFields.videoLink" fieldName="videoLink" />
          <TextInput v-model="formFields.setpos.value" :field="formFields.setpos" fieldName="setpos" />
        </div>
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
              <MouseButtonPicker class="utility-form__mouse-button-picker" v-model="mouseButton" />
              <PosePicker
                class="utility-form__pose-picker"
                :crouch="crouch"
                :jump="jump"
                :movement="movement"
                @toggle-crouch="toggleCrouch"
                @toggle-jump="toggleJump"
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
        <button type="button" @click="close" class="utility-form__btn --cancel">
          <fa-icon icon="ban" />
          Cancel
        </button>
        <button type="submit" class="utility-form__btn --submit">
          <fa-icon icon="check" />
          Save
        </button>
      </div>
    </form>
  </BackdropDialog>
</template>

<script lang="ts" src="./UtilityForm.ts"></script>
<style lang="scss" src="./UtilityForm.scss"></style>