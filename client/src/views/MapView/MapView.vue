<template>
  <div class="map-view">
    <SketchTool
      :map="'DUST_2'"
      :userName="userName"
      :stratName="stratName"
      :roomId="roomId"
      @show-connection-dialog="showConnectionDialog = true"
      @update-room-id="changeRoomId"
    />
    <ConnectionDialog v-if="showConnectionDialog" :userName="userName" :stratName="stratName" @submit="handleSubmit" />
  </div>
</template>

<script lang="ts" src="./MapView.ts"></script>
<style lang="scss" src="./MapView.scss"></style>
