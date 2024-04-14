import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({})
export default class SvgIcon extends Vue {
  @Prop() name!: string;
}
