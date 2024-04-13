<template>
  <BackdropDialog>
    <div class="labels-dialog">
      <div class="labels-dialog__label-list">
        <div class="labels-dialog__label" v-for="label in labels" :key="label">
          <span class="labels-dialog__label-name">{{ label }}</span>
        </div>
      </div>
      <input
        v-model="newLabelName"
        class="labels-dialog__add-label-input"
        placeholder="Add new label"
        @keyup.enter="add"
      />
    </div>
  </BackdropDialog>
</template>

<script lang="ts" src="./LabelsDialog.ts"></script>
<style lang="scss" src="./LabelsDialog.scss"></style>
