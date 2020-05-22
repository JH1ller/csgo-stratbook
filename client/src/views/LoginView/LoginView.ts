import { Component, Vue } from 'vue-property-decorator';
import LoginForm from '@/components/login-form/login-form.vue';

@Component({
  name: 'LoginView',
  components: {
    LoginForm,
  },
})
export default class LoginView extends Vue {}
