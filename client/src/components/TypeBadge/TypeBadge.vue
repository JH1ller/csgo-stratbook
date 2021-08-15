<template>
  <div
    class="type-badge"
    :class="{
      '--buyround': type === Types.BUYROUND,
      '--force': type === Types.FORCE,
      '--pistol': type === Types.PISTOL,
    }"
  >
    <img
      class="type-badge__icon"
      :class="{
        '--buyround': type === Types.BUYROUND,
        '--force': type === Types.FORCE,
        '--pistol': type === Types.PISTOL,
      }"
      :src="
        require(`@/assets/icons/${type === Types.BUYROUND ? 'rifle' : type === Types.FORCE ? 'mp5' : 'pistol'}.png`)
      "
    />
  </div>
</template>

<script lang="ts" src="./TypeBadge.ts"></script>
<style lang="scss" src="./TypeBadge.scss"></style>
