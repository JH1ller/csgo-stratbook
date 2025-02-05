import { Component, Inject, Vue } from 'vue-property-decorator';
import { Routes } from '@/router/router.models';
import { appModule, authModule, stratModule } from '@/store/namespaces';
import { Player } from '@/api/models/Player';
import ProfileForm from './components/ProfileForm/ProfileForm.vue';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Toast } from '@/components/ToastWrapper/ToastWrapper.models';
import { Dialog } from '@/components/DialogWrapper/DialogWrapper.models';
import { Response } from '@/store';
import api from '@/api/base';
import { openLink } from '@/utils/openLink';
import StorageService from '@/services/storage.service';

@Component({
  components: {
    ProfileForm,
  },
})
export default class ProfileView extends Vue {
  @Inject() storageService!: StorageService;
  @appModule.Action showToast!: (toast: Toast) => void;
  @appModule.Action showDialog!: (dialog: Partial<Dialog>) => Promise<boolean>;
  @authModule.State profile!: Player;
  @authModule.Action logout!: () => Promise<void>;
  @authModule.Action updateProfile!: (data: FormData) => Promise<void>;
  @authModule.Action deleteAccount!: () => Promise<void>;
  @stratModule.Action getStratExport!: () => Promise<Response>;

  steamEnabled = true;
  exportEnabled = false;

  async logoutRequest() {
    await this.logout();
    this.$router.push(Routes.Login);
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
    // this.steamEnabled = this.storageService.get('steam-enabled') === true;
    this.exportEnabled = this.storageService.get('export-enabled') === true;
    const isConfirmed = !!this.$route.query.confirmed;
    if (isConfirmed) {
      this.showToast({ id: 'ProfileView/emailConfirmed', text: 'Your new email has been confirmed.' });
    }
  }

  async connectSteam() {
    const { success } = await api.auth.fetchSteamUrl();
    if (success) {
      if (window.desktopMode) {
        openLink(success);
      } else {
        window.location.href = success;
      }
    }
  }

  get steamProfileUrl() {
    return `https://steamcommunity.com/profiles/${this.profile.steamId}`;
  }
}
