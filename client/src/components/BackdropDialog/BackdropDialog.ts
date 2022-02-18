import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class BackdropDialog extends Vue {
  @Prop({ default: false }) fullscreen!: boolean;
}
