import { NavigationGuard } from 'vue-router';
import store from '@/store/index';

export const stratsResolver: NavigationGuard = async (to, from, next) => {
  try {
    // TODO: find different system for this as it's very error-prone
    let redirected = await profileResolver(to, from, next);
    redirected = await teamResolver(to, from, next);
    if (!redirected) {
      await store.dispatch('map/fetchMaps');
      next();
    }
  } catch (error) {
    console.log(error.message);
  }
};

export const profileResolver: NavigationGuard = async (to, _from, next) => {
  try {
    const profile = await store.dispatch('auth/fetchProfile');
    next();
  } catch (error) {
    if (to.name !== 'Login') next({ name: 'Login' });
    console.log(error.message);
    return true;
  }
};

export const teamResolver: NavigationGuard = async (to, _from, next) => {
  try {
    const profile = await store.dispatch('auth/fetchProfile');
    if (profile.team) {
      const team = await store.dispatch('team/fetchTeamInfo');
      next();
    } else {
      if (to.name !== 'Team') {
        if (!(to.query.toast === 'false'))
          await store.dispatch(
            'app/showToast',
            'You need to join a team first'
          );
        next({ name: 'Team' });
      } else {
        next();
      }
      return true;
    }
  } catch (error) {
    if (to.name !== 'Login') {
      await store.dispatch('app/showToast', 'You need to login first');
      next({ name: 'Login' });
    }
    console.log(error.message);
    return true;
  }
};
