<template>
  <div class="strat-item" :class="{ '-inactive': !strat.active, '-collapsed': collapsed }">
    <div class="strat-item__inner">
      <div class="strat-item__header" @click="!editMode && toggleCollapse()">
        <div class="strat-item__title-wrapper">
          <h3 class="strat-item__title">
            {{ strat.name }}
            <span v-if="!strat.active" class="strat-item__inactive-label">(inactive)</span>
          </h3>
        </div>
        <div class="strat-item__types-wrapper">
          <TypeBadge
            v-for="type in sortedTypes"
            :key="type"
            class="strat-item__type"
            :type="type"
            :content="typeTooltip(type)"
            @click.native.stop="filterType(type)"
            v-tippy
          />
        </div>
        <SideBadge
          class="strat-item__side"
          :side="strat.side"
          :content="sideTooltip"
          @click.native.stop="filterSide"
          v-tippy
        />
      </div>
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
        @focus="editorFocussed"
        @blur="editorBlurred"
        :readOnly="readOnly"
      />
      <div class="strat-item__btn-wrapper">
        <div
          class="strat-item__btn --insert"
          v-if="!readOnly"
          @click="insertPlayerRows"
          content="Insert line for each player"
          v-tippy
        >
          <fa-icon icon="th-list" />
        </div>
        <div class="strat-item__labels">
          <button class="strat-item__label --add" @click="labelDialogOpen = true">labels<fa-icon icon="plus" /></button>
          <div class="strat-item__label" v-for="label in strat.labels" :key="label" @click="() => removeLabel(label)">
            {{ label }}<fa-icon icon="times" />
          </div>
        </div>
        <template>
          <div class="strat-item__action-buttons" v-if="editMode">
            <div class="strat-item__btn --save" @click="updateContent" content="Save strat changes" v-tippy>
              <fa-icon icon="save" /><span class="strat-item__btn-label">Save</span>
            </div>
            <div class="strat-item__btn --discard" @click="discardContent" content="Discard strat changes" v-tippy>
              <fa-icon icon="ban" /><span class="strat-item__btn-label">Discard</span>
            </div>
          </div>
          <span v-else class="strat-item__button-list">
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
              class="strat-item__btn --map"
              :class="{ '-active': hasDrawData }"
              @click="showMap"
              content="Open map"
              v-tippy
            >
              <fa-icon icon="map" />
            </div>
            <span class="strat-item__edit-buttons" v-if="!readOnly">
              <div
                class="strat-item__btn --toggle-active"
                @click="toggleActive"
                :content="strat.active ? 'Set inactive' : 'Set active'"
                v-tippy
              >
                <fa-icon icon="check-circle" v-if="strat.active" />
                <fa-icon icon="minus-circle" v-else />
              </div>
              <div class="strat-item__btn --edit" @click="editStrat" content="Edit strat" v-tippy>
                <fa-icon icon="edit" />
              </div>
              <div class="strat-item__btn --delete" @click="deleteStrat" content="Delete strat" v-tippy>
                <fa-icon icon="trash-alt" />
              </div>
            </span>
          </span>
        </template>
      </div>
    </div>
    <fa-icon v-if="isManualSort && !readOnly" class="strat-item__drag-icon" icon="ellipsis-v" v-handle />
    <LabelsDialog
      v-if="labelDialogOpen"
      :currentLabels="strat.labels"
      :allLabels="allLabels"
      @close="labelDialogOpen = false"
      @add="addLabel"
      @remove="removeLabel"
    />
  </div>
</template>

<script lang="ts" src="./StratItem.ts"></script>
<style lang="scss" src="./StratItem.scss"></style>
