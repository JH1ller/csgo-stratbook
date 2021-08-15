<template>
  <div class="text-input">
    <input
      class="text-input__input"
      :class="{ '-has-content': field.value, '-error': field.errors.length }"
      :type="type"
      :name="name"
      :value="field.value"
      @input="input"
      @focus="focus"
      :autocomplete="field.autocompleteTag || 'nope'"
    />
    <span class="text-input__label">{{ formattedLabel }}</span>
    <transition name="fade">
      <span class="text-input__error" v-if="field.errors.length">{{ field.errors[0] }}</span>
    </transition>
  </div>
</template>

<script lang="ts" src="./TextInput.ts"></script>
<style lang="scss" src="./TextInput.scss"></style>
