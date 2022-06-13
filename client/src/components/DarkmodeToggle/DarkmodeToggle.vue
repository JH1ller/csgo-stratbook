<template>
  <label class="darkmode-toggle" for="toggle">
    <div class="darkmode-toggle__inner" :class="{ '-dark': isDark, '-light': !isDark }">
      <span class="darkmode-toggle__hidden">
        {{ isDark ? 'Enable' : 'Disable' }}
      </span>
      <input id="toggle" name="toggle" type="checkbox" :checked="isDark" @click="toggle" />
    </div>
  </label>
</template>

<script lang="ts" src="./DarkmodeToggle.ts"></script>
<style lang="scss" src="./DarkmodeToggle.scss"></style>
