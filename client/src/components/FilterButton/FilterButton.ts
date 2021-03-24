import { Component, Vue, Emit, Prop } from 'vue-property-decorator';
import FloatingButton from '@/components/FloatingButton/FloatingButton.vue';
@Component({
  components: {
    FloatingButton,
  },
})
export default class FilterButton extends Vue {
  @Prop() private activeFilterCount!: number;
  @Emit()
  private click() {
    return;
  }
}
