<template>
  <div class="text-input">
    <input
      class="text-input__input"
      :class="{ '-has-content': fieldData.value, '-error': fieldData.hasError }"
      type="text"
      :name="fieldName"
      :value="fieldData.value"
      @input="input"
      @focus="focus"
      :autocomplete="fieldData.autocompleteTag || 'off'"
    />
    <span class="text-input__label">{{ formattedLabel }}</span>
  </div>
</template>

<script lang="ts" src="./TextInput.ts"></script>
<style lang="scss" src="./TextInput.scss"></style>