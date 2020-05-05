import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator';
import { mapState } from 'vuex';
const { remote } = require('electron');

@Component({
  components: {
  },
  computed: mapState(['maps'])
})
export default class MapPicker extends Vue {

  maps!: any[];

}

