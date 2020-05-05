<template>
<div class="component">
    <div class="main-menu">
    <ul class="main-menu__list">
      <li class="main-menu__list-item logo">
        <router-link to="/" class="main-menu__list-item-link">
          <img src="@/assets/icons/eo_logo.svg" class="main-menu__list-item-icon -logo" />
          <span class="main-menu__list-item-label">EO Tools</span>
        </router-link>
      </li>

      <li v-for="(item, index) in menuItems" class="main-menu__list-item" :key="item.label">
        <router-link :to="item.link" class="main-menu__list-item-link">
          <font-awesome-icon :icon="item.icon" class="main-menu__list-item-icon"/>
          <span class="main-menu__list-item-label" :style="{ transitionDelay: '0.' + index + 's' }">{{ item.label }}</span>
        </router-link>
      </li>
      
    </ul>
      
    </div>
</div>
</template>

<script lang="ts" src="./main-menu.ts"></script>
<style lang="scss" src="./main-menu.scss"></style>
