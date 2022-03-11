<template>
  <div class="map-view">
    <SketchTool
      :map="'DUST_2'"
      :userName="userName"
      :stratName="stratName"
      :roomId="roomId"
      @show-connection-dialog="showConnectionDialog = true"
      @update-room-id="changeRoomId"
      @update-strat-name="changeStratName"
    />
    <ConnectionDialog v-if="showConnectionDialog" :userName="userName" :stratName="stratName" @submit="handleSubmit" />
    <h2 class="map-view__strat-name">{{ stratName }}</h2>
  </div>
</template>

<script lang="ts" src="./MapView.ts"></script>
<style lang="scss" src="./MapView.scss"></style>
