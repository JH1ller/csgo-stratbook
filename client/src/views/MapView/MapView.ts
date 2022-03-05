import { Component, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';
import ConnectionDialog from './components/ConnectionDialog.vue';

@Component({
  components: {
    SketchTool,
    ConnectionDialog,
  },
})
export default class MapView extends Vue {
  name = '';
  showConnectionDialog = false;
}
