<template>
  <div class="strat-item">
    <div class="strat-item__container" :class="{'-inactive': !isActive}" @dblclick="toggleActive">
      <img
        v-if="isCtSide"
        src="@/assets/icons/ct_badge.png"
        class="strat-item__side-badge"
        draggable="false"
      />
      <img v-else src="@/assets/icons/t_badge.png" class="strat-item__side-badge" draggable="false" />
      <div class="strat-item__btn-wrapper" :class="{'-deleting': inDeletionQuestion}">
        <div
          class="strat-item__btn-youtube"
          v-if="strat.videoLink"
          @click="openVideo"
          data-tooltip="Open video in browser"
        >
          <font-awesome-icon icon="film" />
        </div>
        <div class="strat-item__btn-edit" @click="editStrat" data-tooltip="Edit strat">
          <font-awesome-icon icon="edit" />
        </div>

        <div class="strat-item__deletion" v-if="inDeletionQuestion">
          <span class="strat-item__deletion-question">Are you sure?</span>
          <div class="strat-item__btn-cancel" @click="cancelDeletion" data-tooltip="Cancel">
            <font-awesome-icon icon="ban" />
          </div>
        </div>
        <div class="strat-item__btn-delete" @click="deleteClicked" data-tooltip="Delete strat">
          <font-awesome-icon icon="trash-alt" />
        </div>
      </div>
      <div class="strat-item__field-wrapper">
        <div class="strat-item__field">
          <span class="strat-item__field-title">{{strat.name}}</span>
          <span
            class="strat-item__field-type"
            :class="[strat.type === 'BUYROUND' ? '-buyround' : strat.type === 'PISTOL' ? '-pistol' : '-force']"
          >{{strat.type}}</span>
        </div>
        <div class="strat-item__field" v-if="strat.note">
          <p class="strat-item__field-label">Note</p>
          <p class="strat-item__field-value">{{strat.note}}</p>
        </div>
        <div class="strat-item__field" v-if="strat.steps">
          <transition-group name="fade" mode="in-out">
            <step-item
              v-for="step in filteredSteps"
              :step="step"
              :key="step._id"
              @edit-enabled="handleStepEditEnabled"
              @update-step="updateStep"
              @delete-step="deleteStep"
              ref="step-elements"
            />
          </transition-group>
        </div>
        <step-item
          ref="add-step"
          :addMode="true"
          @add-step="addStep"
          @edit-enabled="handleStepEditEnabled"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./strat-item.ts"></script>
<style lang="scss" src="./strat-item.scss"></style>