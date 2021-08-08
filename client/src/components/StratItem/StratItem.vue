<template>
  <div class="strat-item" :class="{ '-inactive': !strat.active }">
    <SideBadge class="strat-item__side" :side="strat.side" />
    <div class="strat-item__strat-info">
      <span class="strat-item__title">
        {{ strat.name }}
        <span v-if="!strat.active" class="strat-item__inactive-label">(inactive)</span>
      </span>
      <TypeBadge class="strat-item__type" :type="strat.type" />
      <p class="strat-item__note" v-if="strat.note">
        <fa-icon icon="info-circle" />
        {{ strat.note }}
      </p>
      <StratEditor
        :key="editorKey"
        class="strat-item__editor"
        :class="{ '-blinking': !completedTutorial && isTutorial }"
        ref="editor"
        :htmlContent="strat.content"
        :stratSide="strat.side"
        @update="editorUpdated"
      />
    </div>
    <div class="strat-item__btn-wrapper">
      <transition name="fade">
        <div class="strat-item__action-buttons" v-if="editMode">
          <div class="strat-item__btn --save" @click="updateContent" content="Save strat changes" v-tippy>
            <fa-icon icon="save" /><span class="strat-item__btn-label">Save</span>
          </div>
          <div class="strat-item__btn --discard" @click="discardContent" content="Discard strat changes" v-tippy>
            <fa-icon icon="ban" /><span class="strat-item__btn-label">Discard</span>
          </div>
        </div>
      </transition>
      <div
        class="strat-item__btn --youtube"
        v-if="strat.videoLink"
        @click="openVideo"
        content="Open video in browser"
        v-tippy
      >
        <fa-icon icon="film" />
      </div>
      <div
        class="strat-item__btn --toggle-active"
        @click="toggleActive"
        :content="strat.active ? 'Set inactive' : 'Set active'"
        v-tippy
      >
        <fa-icon icon="check-circle" v-if="strat.active" />
        <fa-icon icon="minus-circle" v-else />
      </div>
      <div class="strat-item__btn --map" @click="showMap" content="Open map" v-tippy>
        <fa-icon icon="map" />
      </div>
      <div
        class="strat-item__btn --share"
        :class="{ '-shared': strat.shared }"
        @click="strat.shared ? unshareStrat() : shareStrat()"
        :content="strat.shared ? 'Stop sharing' : 'Create share link'"
        v-tippy
      >
        <fa-icon icon="share-alt" />
      </div>
      <div class="strat-item__btn --edit" @click="editStrat" content="Edit strat" v-tippy>
        <fa-icon icon="edit" />
      </div>
      <div class="strat-item__btn --delete" @click="deleteStrat" content="Delete strat" v-tippy>
        <fa-icon icon="trash-alt" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./StratItem.ts"></script>
<style lang="scss" src="./StratItem.scss"></style>