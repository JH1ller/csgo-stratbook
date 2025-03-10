import { Component, Inject, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/LoginForm/LoginForm.vue';
import { Response } from '@/store';
import { appModule, authModule } from '@/store/namespaces';
import { Routes } from '@/router/router.models';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import StorageService from '@/services/storage.service';
import TrackingService from '@/services/tracking.service';

@Component({
  components: {
    LoginForm,
  },
})
export default class LoginView extends Vue {
  @Inject() storageService!: StorageService;
  @Inject() trackingService!: TrackingService;
  @authModule.Action login!: (credentials: { email: string; password: string }) => Promise<Response>;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  formError: string = '';

  async loginRequest(payload: { email: string; password: string }) {
    const res = await this.login({
      email: payload.email,
      password: payload.password,
    });
    if (res.error) {
      this.updateFormError(res.error);
    } else if (res.success) {
      this.updateFormError('');
      this.$router.push(Routes.JoinTeam).catch((error) => console.warn(error.message));
    }
  }

  updateFormError(text: string): void {
    this.formError = text;
  }

  async loginWithSteam() {
    if (!this.storageService.get('steam-disclaimer')) {
      const dialogResult = await this.showDialog({
        key: 'login-view/steam-login',
        text: `Hey there! If your Steam account is not linked to a Stratbook account yet, click okay and you will be redirected to the Steam login.<br><br><bold>Note:</bold> If you previously created an account without Steam, please log in with your email and password and then link your Steam account on your profile page. Once your accounts are linked, you can log in with Steam.`,
        resolveBtn: 'OK',
        rejectBtn: 'Cancel',
        htmlMode: true,
      });
      this.storageService.set('steam-disclaimer', 'true');
      if (!dialogResult) return;
    }

    const steamPath = '/api/auth/steam';

    this.trackingService.track('steam-login', { source: 'login-view' });

    window.location.href = steamPath;
  }
}
