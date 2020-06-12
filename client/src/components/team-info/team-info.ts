import { Component, Prop, Vue, Emit, Ref } from 'vue-property-decorator';
import { State } from 'vuex-class';
import { Team } from '@/services/models';

@Component({})
export default class TeamInfo extends Vue {
  @State('teamInfo') teamInfo!: Team;
}
