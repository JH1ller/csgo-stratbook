<template>
  <div class="view-wrapper">
    <div class="register-view">
      <register-form @register-clicked="registerRequest" ref="register-form" />
    </div>
  </div>
</template>

<script lang="ts" src="./RegisterView.ts"></script>
<style lang="scss" src="./RegisterView.scss"></style>
