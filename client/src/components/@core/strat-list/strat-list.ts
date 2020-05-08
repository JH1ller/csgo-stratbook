import { Component, Prop, Vue, Emit, Watch } from "vue-property-decorator";
import { mapState } from "vuex";
const { remote } = require("electron");
import { Map, Strat, Step, Player } from "@/services/models";
import StratItem from "@/components/@core/strat-item/strat-item.vue";

@Component({
  components: {
    StratItem,
  },
  computed: mapState(["currentStrats"]),
})
export default class StratList extends Vue {
  private currentStrats!: Strat[];

  @Emit()
  private deleteClicked(stratId: string) {
    return stratId;
  }
}
