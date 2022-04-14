<template>
  <div class="map-view">
    <SketchTool
      ref="sketchTool"
      :map="map"
      :userName="userName"
      :stratName="stratName"
      :roomId="roomId"
      :showConfigBtn="true"
      @show-connection-dialog="showConnectionDialog = true"
      @update-room-id="handleRoomIdChange"
      @update-strat-name="handleStratNameChange"
      @update-user-name="handleUserNameChange"
      @update-map="handleMapChange"
    />
    <ConnectionDialog
      v-if="showConnectionDialog"
      :userName="userName"
      :stratName="stratName"
      @submit="handleSubmit"
      @close="showConnectionDialog = false"
    />
    <div class="map-view__map-btn" @click.prevent="openContextMenu">
      <SmartImage :src="mapImage" class="map-view__map-img" />
      <span class="map-view__map-label">{{ mapTable[map] }}</span>
    </div>
    <vue-context ref="mapPicker">
      <li
        v-for="[id, label] in Object.entries(mapTable)"
        :key="id"
        class="map-view__context-link"
        :disabled="!['DUST_2', 'MIRAGE', 'OVERPASS', 'NUKE', 'VERTIGO', 'INFERNO'].includes(id)"
      >
        <a @click="() => changeMap(id)">
          {{ label }}
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script lang="ts" src="./MapView.ts"></script>
<style lang="scss" src="./MapView.scss"></style>
