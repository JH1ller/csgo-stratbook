<template>
  <BackdropDialog>
    <div class="labels-dialog">
      <div class="labels-dialog__list-container">
        <p class="labels-dialog__title">Current labels<span class="labels-dialog__hint">(click to remove)</span></p>
        <div class="labels-dialog__label-list">
          <div class="labels-dialog__label" v-for="label in currentLabels" :key="label" @click="() => remove(label)">
            {{ label }}<fa-icon icon="times" />
          </div>
        </div>
      </div>
      <div class="labels-dialog__list-container">
        <p class="labels-dialog__title">Other labels<span class="labels-dialog__hint">(click to add)</span></p>
        <div class="labels-dialog__label-list">
          <div class="labels-dialog__label" v-for="label in otherLabels" :key="label" @click="() => add(label)">
            {{ label }}<fa-icon icon="plus" />
          </div>
        </div>
        <div class="labels-dialog__input-wrapper">
          <input
            type="text"
            v-model="newLabelName"
            class="labels-dialog__add-label-input"
            placeholder="new label..."
            @keydown.enter="addNew"
            maxlength="20"
          /><button class="labels-dialog__add-btn" @click="addNew"><fa-icon icon="plus" /></button>
        </div>
      </div>
      <button class="labels-dialog__close" @click="close">Close</button>
    </div>
  </BackdropDialog>
</template>

<script lang="ts" src="./LabelsDialog.ts"></script>
<style lang="scss" src="./LabelsDialog.scss"></style>
