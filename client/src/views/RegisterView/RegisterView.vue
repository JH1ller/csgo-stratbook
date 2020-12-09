<template>
  <div class="register-view">
    <register-form @submit="registerRequest" @update-form-error="updateFormError" :formError="formError" />
  </div>
</template>

<script lang="ts" src="./RegisterView.ts"></script>
<style lang="scss" src="./RegisterView.scss"></style>
