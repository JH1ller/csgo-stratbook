<template>
  <div class="cookie-banner">
    <p class="cookie-banner__base-text">
      We use necessary cookies to make our site work. With your approval we might also set up optional analytics cookies
      to help us improve the site.
    </p>
    <div class="cookie-banner__options">
      <input type="checkbox" disabled id="requiredCookie" class="cookie-banner__checkbox" checked />
      <label for="requiredCookie" class="cookie-banner__checkbox-label">Required cookies</label>
      <input id="analyticsCookie" v-model="analyticsChecked" type="checkbox" class="cookie-banner__checkbox" />
      <label for="analyticsCookie" class="cookie-banner__checkbox-label">Analytics cookies</label>
    </div>
    <div class="cookie-banner__btn-wrapper">
      <button class="cookie-banner__btn --save" @click="saveClicked">Save</button>
      <button class="cookie-banner__btn --accept" @click="acceptClicked">Accept all</button>
    </div>
  </div>
</template>

<script lang="ts" src="./CookieBanner.ts"></script>
<style lang="scss" src="./CookieBanner.scss"></style>
