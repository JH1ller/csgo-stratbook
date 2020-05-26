<template>
  <div class="view-wrapper">
    <div class="register-view">
      <register-form
        :formMessage="formMessage"
        :formMessageStyle="formMessageStyle"
        @register-clicked="registerRequest"
        @update-form-message="updateFormMessage"
      />
    </div>
  </div>
</template>

<script lang="ts" src="./RegisterView.ts"></script>
<style lang="scss" src="./RegisterView.scss"></style>
