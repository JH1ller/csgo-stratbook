<template>
  <div class="creation-overlay">
    <div class="creation-overlay__wrapper">
      <div class="creation-overlay__form-container">
        <fieldset class="creation-overlay__form-fieldset">
          <label class="creation-overlay__form-label" for="name">Name</label>
          <input
            class="creation-overlay__form-input"
            type="text"
            name="name"
            v-model="name"
            required
          />
        </fieldset>
        <fieldset class="creation-overlay__form-fieldset">
          <label class="creation-overlay__form-label" for="type">Type</label>
          <div class="creation-overlay__form-radio-wrapper">
            <input
              class="creation-overlay__form-radio"
              type="radio"
              name="type"
              value="PISTOL"
              id="PISTOL"
              v-model="type"
            />
            <label class="creation-overlay__form-radio-label" for="PISTOL">Pistol</label>
            <input
              class="creation-overlay__form-radio"
              type="radio"
              name="type"
              value="FORCE"
              id="FORCE"
              v-model="type"
            />
            <label class="creation-overlay__form-radio-label" for="FORCE">Force</label>
            <input
              class="creation-overlay__form-radio"
              type="radio"
              name="type"
              value="BUYROUND"
              id="BUYROUND"
              v-model="type"
            />
            <label class="creation-overlay__form-radio-label" for="BUYROUND">Buyround</label>
          </div>
        </fieldset>
        <fieldset class="creation-overlay__form-fieldset">
          <label class="creation-overlay__form-label">Side</label>
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
        <fieldset class="creation-overlay__form-fieldset">
          <label class="creation-overlay__form-label">Note</label>
          <input
            class="creation-overlay__form-input"
            type="text"
            name="note"
            id="note"
            v-model="note"
          />
          <label class="creation-overlay__form-label">Video Link</label>
          <input
            class="creation-overlay__form-input"
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

<script lang="ts" src="./creation-overlay.ts"></script>
<style lang="scss" src="./creation-overlay.scss"></style>