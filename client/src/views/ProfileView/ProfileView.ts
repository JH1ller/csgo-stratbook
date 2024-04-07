import { Component, Vue } from 'vue-property-decorator';
import { Routes } from '@/router/router.models';
import { appModule, authModule, stratModule } from '@/store/namespaces';
import { Player } from '@/api/models/Player';
import ProfileForm from './components/ProfileForm/ProfileForm.vue';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { downloadFile } from '@/utils/downloadFile';
import { Strat } from '@/api/models/Strat';

@Component({
  components: {
    ProfileForm,
  },
})
export default class ProfileView extends Vue {
  @appModule.Action showToast!: (toast: Toast) => void;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @authModule.State profile!: Player;
  @authModule.Action logout!: () => Promise<void>;
  @authModule.Action updateProfile!: (data: FormData) => Promise<void>;
  @authModule.Action deleteAccount!: () => Promise<void>;
  @stratModule.State strats!: Strat[];
  //@stratModule.Action getStratExport!: () => Promise<Response>;

  async logoutRequest() {
    await this.logout();
    this.$router.push(Routes.Login);
  }

  getStratExport() {
    const strats = this.strats.map((strat) => {
      const { _id, drawData, createdBy, modifiedBy, team, __v, ...rest } = strat;
      return rest;
    });
    console.log(this.strats, strats);
    downloadFile(new Blob([JSON.stringify(strats, null, 2)], { type: 'application/json' }), 'strats.json');
  }

  async deleteRequest() {
    const dialogResult = await this.showDialog({
      key: 'profile-view/confirm-delete',
      text: 'Would you like to delete your account? WARNING: This action is permanent, there is no way to retrieve a deleted account!',
      resolveBtn: "Yes, I'm aware of what I'm doing, please delete my account",
    });
    if (dialogResult) {
      this.deleteAccount();
      this.$router.push(Routes.Login);
    }
  }

  get avatar() {
    return resolveStaticImageUrl(this.profile.avatar);
  }

  mounted() {
    const isConfirmed = !!this.$route.query.confirmed;
    if (isConfirmed) {
      this.showToast({ id: 'ProfileView/emailConfirmed', text: 'Your new email has been confirmed.' });
    }
  }
}
