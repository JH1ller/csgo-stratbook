<template>
  <div class="utility-list">
    <UtilityItem
      class="utility-list__item"
      v-for="(utility, index) in utilities"
      :utility="utility"
      :key="utility._id"
      :style="{ 'animation-delay': 0.025 * index + 's' }"
      :readOnly="readOnly"
      @open-in-lightbox="openInLightbox"
      @open-menu="openMenu($event, utility)"
    />
    <vue-context ref="menu" v-slot="{ data }">
      <li>
        <a @click.prevent="editUtility(data.utility)"><fa-icon icon="edit" />Edit</a>
      </li>
      <li data-context-setpos>
        <a @click.prevent="copySetpos(data.utility)"><fa-icon icon="map-marker-alt" />Copy Setpos</a>
      </li>
      <li>
        <a @click.prevent="deleteUtility(data.utility)"><fa-icon icon="trash-alt" />Delete</a>
      </li>
    </vue-context>
  </div>
</template>

<script lang="ts" src="./UtilityList.ts"></script>
<style lang="scss" src="./UtilityList.scss"></style>
