<template>
  <div class="view-wrapper">
    <map-picker @map-clicked="updateCurrentMap" />
    <strat-list @delete-clicked="deleteStrat" @toggle-active="toggleStratActive" />
    <transition name="fade">
      <floating-add @on-click="showCreationOverlay" v-if="currentMap" />
    </transition>
    <transition name="fade">
      <creation-overlay
        v-if="creationOverlayOpen"
        :isEdit="creationOverlayEditMode"
        @submit-clicked="creationOverlaySubmitted"
        @cancel-clicked="hideCreationOverlay"
      />
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mapState } from 'vuex';
import MapPicker from '@/components/@core/map-picker/map-picker.vue';
import StratList from '@/components/@core/strat-list/strat-list.vue';
import FloatingAdd from '@/components/@core/floating-add/floating-add.vue';
import CreationOverlay from '@/components/@core/creation-overlay/creation-overlay.vue';

@Component({
  name: 'StratsView',
  components: {
    MapPicker,
    StratList,
    FloatingAdd,
    CreationOverlay,
  },
  computed: mapState(['currentMap']),
})
export default class Home extends Vue {
  private creationOverlayOpen: boolean = false;
  private creationOverlayEditMode: boolean = false;
  private currentMap!: boolean;

  private updateCurrentMap(mapId: string) {
    this.$store.dispatch('updateCurrentMap', mapId);
  }

  private deleteStrat(stratId: string) {
    this.$store.dispatch('deleteStrat', stratId);
  }

  private creationOverlaySubmitted(data: any) {
    if (!data.isEdit) {
      this.$store.dispatch('createStrat', data.strat);
    }
    this.hideCreationOverlay();
  }

  private showCreationOverlay(editMode: boolean) {
    this.creationOverlayOpen = true;
    this.creationOverlayEditMode = editMode;
  }

  private hideCreationOverlay() {
    this.creationOverlayOpen = false;
  }

  private toggleStratActive({ stratId, active }) {
    this.$store.dispatch('updateStrat', { stratId, changeObj: { active } });
  }
}
</script>

<style lang="scss">
.strat-list {
  margin-top: 24px;
}
</style>
