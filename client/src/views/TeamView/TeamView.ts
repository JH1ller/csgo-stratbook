import { Component, Vue, Ref } from 'vue-property-decorator';
import { State } from 'vuex-class';
import TeamCreateForm from '@/components/team-create-form/team-create-form.vue';
import JoinTeamForm from '@/components/join-team-form/join-team-form.vue';
import TeamInfo from '@/components/team-info/team-info.vue';
import { TeamCreateFormData } from '@/components/team-create-form/team-create-form';
import { Player } from '@/services/models';
import { FormComponent } from '@/interfaces';

@Component({
  name: 'TeamView',
  components: {
    TeamCreateForm,
    JoinTeamForm,
    TeamInfo,
  },
})
export default class TeamView extends Vue {
  @State('profile') profile!: Player;
  @Ref('create-form') createForm!: FormComponent;
  @Ref('join-form') joinForm!: FormComponent;

  get hasTeam(): boolean {
    return this.profile.team ? true : false;
  }

  private async createTeamRequest(formData: TeamCreateFormData) {
    const res = await this.$store.dispatch('createTeam', formData);
    if (res.error) {
      this.createForm.updateFormMessage(res.error, 'error');
    } else if (res.success) {
      this.createForm.updateFormMessage(res.success, 'success');
    }
  }

  private async joinTeamRequest(code: string) {
    const res = await this.$store.dispatch('joinTeam', code);
    if (res.error) {
      this.joinForm.updateFormMessage(res.error, 'error');
    } else if (res.success) {
      this.joinForm.updateFormMessage(res.success, 'success');
    }
  }
}
