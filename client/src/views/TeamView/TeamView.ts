import { Component, Vue, Ref } from 'vue-property-decorator';
import { mapState } from 'vuex';
import TeamCreateForm from '@/components/team-create-form/team-create-form.vue';
import { TeamCreateFormData } from '@/components/team-create-form/team-create-form';
import { Player } from '@/services/models';

@Component({
  name: 'TeamView',
  components: {
    TeamCreateForm,
  },
  computed: mapState(['profile']),
})
export default class TeamView extends Vue {
  private profile!: Player;
  private formMessage: string | null = null;
  private formMessageStyle: string | null = null;

  private async createTeamRequest(formData: TeamCreateFormData) {
    const res = await this.$store.dispatch('createTeam', formData);
    if (res.error) {
      this.formMessage = res.error;
      this.formMessageStyle = 'error';
    } else if (res.success) {
      this.formMessage = res.success;
      this.formMessageStyle = 'success';
    }
  }

  private updateFormMessage(payload: any) {
    this.formMessage = payload.message;
    this.formMessageStyle = payload.style;
  }
}
