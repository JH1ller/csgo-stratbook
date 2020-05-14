<template>
  <div class="strat-item">
    <div class="strat-item__container" :class="{'-inactive': !isActive()}" @dblclick="toggleActive">
      <img
        v-if="isCtSide()"
        src="@/assets/icons/ct_badge.png"
        class="strat-item__side-badge"
        draggable="false"
      />
      <img v-else src="@/assets/icons/t_badge.png" class="strat-item__side-badge" draggable="false" />
      <div class="strat-item__btn-wrapper" :class="{'-deleting': inDeletionQuestion}">
        <font-awesome-icon
          icon="film"
          class="strat-item__btn-youtube"
          v-if="strat.videoLink"
          @click="openVideo"
        />
        <font-awesome-icon icon="edit" class="strat-item__btn-edit" />
        <div class="strat-item__deletion" v-if="inDeletionQuestion">
          <span class="strat-item__deletion-question">Are you sure?</span>
          <font-awesome-icon icon="ban" class="strat-item__btn-cancel" @click="cancelDeletion" />
        </div>
        <font-awesome-icon icon="trash-alt" class="strat-item__btn-delete" @click="deleteClicked" />
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
          <step-item
            v-for="(step, index) in strat.steps"
            :step="step"
            :key="'step' + index"
            @edit-enabled="handleStepEditEnabled"
            @update-step="updateStep"
            ref="step-elements"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./strat-item.ts"></script>
<style lang="scss" src="./strat-item.scss"></style>