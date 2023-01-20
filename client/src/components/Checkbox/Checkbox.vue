<template>
  <div class="checkbox">
    <input
      :id="name"
      :name="name"
      class="checkbox__input"
      type="checkbox"
      :checked="value"
      @input="() => input(!value)"
    />
    <label role="checkbox" :for="name" class="checkbox__box" :class="{ '-checked': value }"
      ><fa-icon icon="check"
    /></label>
    <span class="checkbox__label" @click="() => input(!value)">{{ label }}</span>
  </div>
</template>

<script lang="ts" src="./Checkbox.ts"></script>
<style lang="scss" src="./Checkbox.scss"></style>
