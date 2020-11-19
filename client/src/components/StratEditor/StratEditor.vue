<template>
  <div class="strat-editor">
    <vue-tribute :options="mentionOptions">
        <div
          contenteditable="true" 
          ref="textarea" 
          class="strat-editor__editor" 
          placeholder="Click here to write down a strat. Use '@' to mention team mates."
          v-html="sanitizedHtml"
          @input="update"
          @focus="focus"
          @blur="blur"
          @tribute-replaced="htmlInserted"
          spellcheck="false"
        >
        </div>
      </vue-tribute>
  </div>
</template>

<script lang="ts" src="./StratEditor.ts"></script>
<style lang="scss" src="./StratEditor.scss"></style>
