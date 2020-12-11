import { Component, Vue } from 'vue-property-decorator';
import TeamCreateForm from '@/components/TeamCreateForm/TeamCreateForm.vue';
import JoinTeamForm from '@/components/JoinTeamForm/JoinTeamForm.vue';
import { Response } from '@/store';
import { teamModule } from '@/store/namespaces';
import { Routes } from '@/router/router.models';

@Component({
  components: {
    TeamCreateForm,
    JoinTeamForm,
  },
})
export default class JoinTeamView extends Vue {
  @teamModule.Action createTeam!: (formData: FormData) => Promise<Response>;
  @teamModule.Action joinTeam!: (code: string) => Promise<Response>;
  private createFormError: string = '';
  private joinFormError: string = '';

  private async createTeamRequest(formData: FormData) {
    const res = await this.createTeam(formData);
    if (res.error) {
      this.updateCreateFormError(res.error);
    } else if (res.success) {
      this.$router.push(Routes.Team);
    }
  }

  private async joinTeamRequest(code: string) {
    const res = await this.joinTeam(code);
    if (res.error) {
      this.updateJoinFormError(res.error);
    } else if (res.success) {
      this.$router.push(Routes.Team);
    }
  }

  private updateCreateFormError(text: string): void {
    this.createFormError = text;
  }

  private updateJoinFormError(text: string): void {
    this.joinFormError = text;
  }
}
