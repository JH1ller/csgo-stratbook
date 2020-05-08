<template>
  <div class="strat-item">
    <div class="strat-item__container" :class="{'-inactive': !isActive()}">
      <img
        v-if="isCtSide()"
        src="@/assets/icons/ct_badge.png"
        class="strat-item__side-badge"
        draggable="false"
      />
      <img v-else src="@/assets/icons/t_badge.png" class="strat-item__side-badge" draggable="false" />
      <div class="strat-item__btn-wrapper" :class="{'-deleting': inDeletionQuestion}">
        <font-awesome-icon icon="edit" class="strat-item__btn-edit" />
        <div class="strat-item__deletion" v-if="inDeletionQuestion">
          <span class="strat-item__deletion-question">Are you sure?</span>
          <font-awesome-icon icon="ban" class="strat-item__btn-cancel" @click="cancelDeletion" />
        </div>
        <font-awesome-icon icon="trash-alt" class="strat-item__btn-delete" @click="deleteClicked" />
      </div>
      <div class="strat-item__field-wrapper">
        <div class="strat-item__field">
          <p class="strat-item__field-title">{{strat.name}}</p>
        </div>
        <div class="strat-item__field">
          <p class="strat-item__field-label">Type</p>
          <p class="strat-item__field-value">{{strat.type}}</p>
        </div>
        <div class="strat-item__field" v-if="strat.note">
          <p class="strat-item__field-label">Note</p>
          <p class="strat-item__field-value">{{strat.note}}</p>
        </div>
        <div class="strat-item__field" v-if="strat.videoLink">
          <p class="strat-item__field-label">Videolink</p>
          <p class="strat-item__field-value">{{strat.videoLink}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./strat-item.ts"></script>
<style lang="scss" src="./strat-item.scss"></style>