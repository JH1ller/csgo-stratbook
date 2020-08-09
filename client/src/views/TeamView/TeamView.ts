import { Component, Vue, Ref } from 'vue-property-decorator';
import { namespace } from 'vuex-class';
import TeamCreateForm from '@/components/team-create-form/team-create-form.vue';
import JoinTeamForm from '@/components/join-team-form/join-team-form.vue';
import TeamInfo from '@/components/team-info/team-info.vue';
import { TeamCreateFormData } from '@/components/team-create-form/team-create-form';
import { Player, Response } from '@/services/models';
import { FormComponent } from '@/interfaces';

const teamModule = namespace('team');
const authModule = namespace('auth');
const stratModule = namespace('strat');

@Component({
  components: {
    TeamCreateForm,
    JoinTeamForm,
    TeamInfo,
  },
})
export default class TeamView extends Vue {
  @authModule.State profile!: Player;
  @authModule.Action fetchProfile!: () => Promise<Player>;
  @teamModule.Action createTeam!: (
    formData: TeamCreateFormData
  ) => Promise<Response>;
  @teamModule.Action fetchTeamInfo!: () => Promise<void>;
  @Ref('create-form') createForm!: FormComponent;
  @Ref('join-form') joinForm!: FormComponent;

  private async createTeamRequest(formData: TeamCreateFormData) {
    const res = await this.createTeam(formData);
    if (res.error) {
      this.createForm.updateFormMessage(res.error, 'error');
    } else if (res.success) {
      this.createForm.updateFormMessage(res.success, 'success');
      setTimeout(async () => {
        this.createForm.updateFormMessage(null, null);
        await this.fetchTeamInfo();
        this.fetchProfile();
      }, 3000);
    }
  }

  private async joinTeamRequest(code: string) {
    const res = await this.$store.dispatch('joinTeam', code);
    if (res.error) {
      this.joinForm.updateFormMessage(res.error, 'error');
    } else if (res.success) {
      this.joinForm.updateFormMessage(res.success, 'success');
      setTimeout(async () => {
        this.joinForm.updateFormMessage(null, null);
        await this.fetchTeamInfo();
        this.fetchProfile();
      }, 3000);
    }
  }

  private async leaveTeamRequest() {
    const res = await this.$store.dispatch('leaveTeam');
  }
}
