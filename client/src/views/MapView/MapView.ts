import { Component, Vue } from 'vue-property-decorator';
import SketchTool from '@/components/SketchTool/SketchTool.vue';

@Component({
  components: {
    SketchTool,
  },
})
export default class MapView extends Vue {}
