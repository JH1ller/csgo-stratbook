<template>
  <div class="strat-editor">
    <div
      contenteditable
      ref="textarea"
      class="strat-editor__editor"
      placeholder="Click here to write down a strat.
      Use '@' to mention team mates.
      Use '#' to link utilities.
      Use '/' to link weapons and equipment"
      v-html="sanitizedHtml"
      @input="update"
      @focus="focus"
      @blur="blur"
      @tribute-replaced="htmlInserted"
      spellcheck="false"
    ></div>
  </div>
</template>

<script lang="ts" src="./StratEditor.ts"></script>
<style lang="scss" src="./StratEditor.scss"></style>
