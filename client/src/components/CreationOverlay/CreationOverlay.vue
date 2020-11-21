<template>
  <div class="creation-overlay">
    <div class="creation-overlay__wrapper">
      <div class="creation-overlay__form">
        <fieldset class="creation-overlay__fieldset">
          <label
            class="creation-overlay__label"
            :class="{'-invalid': isInvalid}"
            for="name"
          >Name</label>
          <input
            class="creation-overlay__input"
            type="text"
            name="name"
            v-model="name"
            required
            :class="{'-invalid': isInvalid}"
          />
        </fieldset>
        <fieldset class="creation-overlay__fieldset">
          <label class="creation-overlay__label" for="type">Type</label>
          <div class="creation-overlay__radio-wrapper">
            <input
              class="creation-overlay__radio"
              type="radio"
              name="type"
              value="PISTOL"
              id="PISTOL"
              v-model="type"
            />
            <label
              class="creation-overlay__radio-label"
              for="PISTOL"
              :class="{'-selected': type === 'PISTOL'}"
            >pistol</label>
            <input
              class="creation-overlay__radio"
              type="radio"
              name="type"
              value="FORCE"
              id="FORCE"
              v-model="type"
            />
            <label
              class="creation-overlay__radio-label"
              for="FORCE"
              :class="{'-selected': type === 'FORCE'}"
            >force</label>
            <input
              class="creation-overlay__radio"
              type="radio"
              name="type"
              value="BUYROUND"
              id="BUYROUND"
              v-model="type"
            />
            <label
              class="creation-overlay__radio-label"
              for="BUYROUND"
              :class="{'-selected': type === 'BUYROUND'}"
            >buyround</label>
          </div>
        </fieldset>
        <fieldset class="creation-overlay__fieldset">
          <label class="creation-overlay__label">Side</label>
          <div class="creation-overlay__side-wrapper">
            <img
              src="@/assets/icons/t_badge.png"
              class="creation-overlay__side-badge"
              draggable="false"
              :class="{'-selected': isTSide()}"
              @click="selectT"
            />
            <img
              src="@/assets/icons/ct_badge.png"
              class="creation-overlay__side-badge"
              draggable="false"
              :class="{'-selected': !isTSide()}"
              @click="selectCT"
            />
          </div>
        </fieldset>
        <fieldset class="creation-overlay__fieldset">
          <label class="creation-overlay__label">Note</label>
          <input
            class="creation-overlay__input"
            type="text"
            name="note"
            id="note"
            v-model="note"
          />
          <label class="creation-overlay__label">Video Link</label>
          <input
            class="creation-overlay__input"
            type="text"
            name="videoLink"
            id="videoLink"
            v-model="videoLink"
          />
        </fieldset>
        <div class="creation-overlay__btn-wrapper">
          <font-awesome-icon
            icon="ban"
            class="creation-overlay__btn-cancel"
            @click="cancelClicked"
          />
          <font-awesome-icon
            icon="check"
            class="creation-overlay__btn-submit"
            @click="submitClicked"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" src="./CreationOverlay.ts"></script>
<style lang="scss" src="./CreationOverlay.scss"></style>