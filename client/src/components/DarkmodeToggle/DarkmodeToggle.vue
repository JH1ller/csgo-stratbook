<template>
  <label class="darkmode-toggle" for="toggle" v-tippy :content="isDark ? 'Turn on the light' : 'Turn off the light'">
    <div class="darkmode-toggle__inner" :class="{ '-dark': isDark, '-light': !isDark }">
      <div class="darkmode-toggle__icon-wrapper">
        <fa-icon icon="sun" />
        <fa-icon icon="moon" />
      </div>
      <input id="toggle" name="toggle" type="checkbox" :checked="isDark" @click="toggle" />
    </div>
  </label>
</template>

<script lang="ts" src="./DarkmodeToggle.ts"></script>
<style lang="scss" src="./DarkmodeToggle.scss"></style>
