import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
@Component({
    components: {
    },
    computed: mapState({
      show: (state: any) => state.ui.showLoader,
      text: (state: any) => state.ui.loaderText,
  })
})
export default class Loader extends Vue {
  private show!: boolean;
  private text!: string;
}

