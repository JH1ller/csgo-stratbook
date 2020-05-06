<template>
  <div class="view-wrapper">
    <map-picker @map-clicked="updateCurrentMap" />
    <strat-list />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MapPicker from "@/components/@core/map-picker/map-picker.vue";
import StratList from "@/components/@core/strat-list/strat-list.vue";

@Component({
  name: "StratsView",
  components: {
    MapPicker,
    StratList
  }
})
export default class Home extends Vue {
  private updateCurrentMap(mapId: string) {
    this.$store.dispatch("updateCurrentMap", mapId);
  }
}
</script>

<style lang="scss">
</style>
