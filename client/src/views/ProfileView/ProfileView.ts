import { Component, Vue } from 'vue-property-decorator';
import { Routes } from '@/router/router.models';
import { appModule, authModule } from '@/store/namespaces';
import { Player } from '@/api/models/Player';
import ProfileForm from './components/ProfileForm/ProfileForm.vue';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
@Component({
  components: {
    ProfileForm,
  },
})
export default class ProfileView extends Vue {
  @appModule.Action private showToast!: (toast: Toast) => void;
  @authModule.State profile!: Player;
  @authModule.Action private logout!: () => Promise<void>;
  @authModule.Action private updateProfile!: (data: FormData) => Promise<void>;

  private async logoutRequest() {
    await this.logout();
    this.$router.push(Routes.Login);
  }

  private get avatar() {
    return resolveStaticImageUrl(this.profile.avatar);
  }

  private mounted() {
    const isConfirmed = !!this.$route.query.confirmed;
    if (isConfirmed) {
      this.showToast({ id: 'ProfileView/emailConfirmed', text: 'Your new email has been confirmed.' });
    }
  }
}
