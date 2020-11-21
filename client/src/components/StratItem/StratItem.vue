<template>
  <div class="strat-item">
    <div
      class="strat-item__container"
      :class="{'-inactive': !strat.active}"
      @dblclick="toggleActive"
    >
      <img
        v-if="isCtSide"
        src="@/assets/icons/ct_badge.png"
        class="strat-item__side-badge"
        draggable="false"
      />
      <img v-else src="@/assets/icons/t_badge.png" class="strat-item__side-badge" draggable="false" />
      <div class="strat-item__btn-wrapper">
        <transition name="fade">
          <div v-if="editMode" class="strat-item__btn --save" @click="updateContent" data-tooltip="Save strat changes">
            <font-awesome-icon icon="save" />Save
          </div>
        </transition>
        <transition name="fade">
          <div v-if="editMode" class="strat-item__btn --discard" @click="discardContent" data-tooltip="Discard strat changes">
            <font-awesome-icon icon="ban" />Discard
          </div>
        </transition>
        <div
          class="strat-item__btn --youtube"
          v-if="strat.videoLink"
          @click="openVideo"
          data-tooltip="Open video in browser"
        >
          <font-awesome-icon icon="film" />
        </div>
        <div
          class="strat-item__btn --share"
          :class="{ '-shared': strat.shared }"
          @click="strat.shared ? unshareStrat() : shareStrat()"
          data-tooltip="Create share link"
        >
          <font-awesome-icon icon="share-alt" />
        </div>
        <div class="strat-item__btn --edit" @click="editStrat" data-tooltip="Edit strat">
          <font-awesome-icon icon="edit" />
        </div>
        <div class="strat-item__btn --delete" @click="deleteStrat" data-tooltip="Delete strat">
          <font-awesome-icon icon="trash-alt" />
        </div>
      </div>
      <div class="strat-item__strat-info">
        <span class="strat-item__strat-title">{{strat.name}}</span>
        <span
          class="strat-item__strat-type"
          :class="[strat.type === 'BUYROUND' ? '-buyround' : strat.type === 'PISTOL' ? '-pistol' : '-force']"
        >{{strat.type}}</span>
        <div class="strat-item__note" v-if="strat.note">
          <p class="strat-item__note-text">Note:</p>
          <p class="strat-item__note-text">{{strat.note}}</p>
        </div>
        <StratEditor :key="editorKey" class="strat-item__editor" ref="editor" :htmlContent="strat.content" @update="editorUpdated" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./StratItem.ts"></script>
<style lang="scss" src="./StratItem.scss"></style>