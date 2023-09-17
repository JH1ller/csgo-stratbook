<template>
  <div class="map-view">
    <SketchTool
      ref="sketchTool"
      :map="map"
      :userName="userName"
      :stratName="stratName"
      :roomId="roomId"
      :isMapView="true"
      :stratId="stratId"
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
      <span class="map-view__map-label">{{ mapLabel }}</span>
    </div>
    <Transition name="fade">
      <div v-if="!roomId" class="map-view__join-room-wrapper">
        <input class="map-view__input" v-model="inputRoomId" placeholder="Join via link or room ID" />
        <button class="map-view__join-btn" @click="joinWithLinkOrRoomId" v-tippy content="Join Room">
          <fa-icon icon="sign-in-alt" />
        </button>
      </div>
    </Transition>
    <vue-context ref="mapPicker">
      <li v-for="[id, label] in mapTable" :key="id" class="map-view__context-link">
        <a @click="() => changeMap(id)">
          {{ label }}
        </a>
      </li>
    </vue-context>
  </div>
</template>

<script lang="ts" src="./MapView.ts"></script>
<style lang="scss" src="./MapView.scss"></style>
