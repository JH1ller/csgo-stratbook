<template>
  <div class="view-wrapper">
    <map-picker />
  </div>
</template>

<script>
import { Component, Vue } from "vue-property-decorator";
import MapPicker from "@/components/@core/map-picker/map-picker.vue";

@Component({
  name: "Home",
  components: {
    MapPicker
  }
})
export default class Home extends Vue {}
</script>

<style lang="scss">
</style>
