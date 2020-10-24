import { Component, Vue, Ref } from 'vue-property-decorator';
import TeamCreateForm from '@/components/team-create-form/team-create-form.vue';
import JoinTeamForm from '@/components/join-team-form/join-team-form.vue';
import { TeamCreateFormData } from '@/components/team-create-form/team-create-form';
import { Response } from '@/services/models';
import { FormComponent } from '@/interfaces';
import { teamModule } from '@/store/namespaces';
import { Routes } from '@/router/router.models';

@Component({
  components: {
    TeamCreateForm,
    JoinTeamForm,
  },
})
export default class JoinTeamView extends Vue {
  @teamModule.Action createTeam!: (formData: TeamCreateFormData) => Promise<Response>;
  @teamModule.Action joinTeam!: (code: string) => Promise<Response>;
  @Ref('create-form') createForm!: FormComponent;
  @Ref('join-form') joinForm!: FormComponent;

  private async createTeamRequest(formData: TeamCreateFormData) {
    const res = await this.createTeam(formData);
    if (res.error) {
      this.createForm.updateFormMessage(res.error); // TODO: refactor and redo with inputs and maybe error array
    } else if (res.success) {
      this.$router.push(Routes.Team);
    }
  } 

  private async joinTeamRequest(code: string) {
    const res = await this.joinTeam(code);
    if (res.error) {
      this.joinForm.updateFormMessage(res.error);
    } else if (res.success) {
      this.$router.push(Routes.Team);
    }
  }
}
