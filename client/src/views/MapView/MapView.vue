<template>
  <div class="map-view">
    <SketchTool
      :map="'DUST_2'"
      :userName="userName"
      :stratName="stratName"
      @show-connection-dialog="showConnectionDialog = true"
    />
    <ConnectionDialog v-if="showConnectionDialog" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" src="./MapView.ts"></script>
<style lang="scss" src="./MapView.scss"></style>
