import { Route } from 'vue-router';
import store from '@/store/index';
import APIService from '@/services/APIService';

export const stratsResolver = async (to: Route, from: Route, next: any) => {
  try {
    let redirected = await profileResolver(to, from, next);
    redirected = await teamResolver(to, from, next);
    if (!redirected) {
      await store.dispatch('updateMaps');
      next();
    }
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const profileResolver = async (to: Route, from: Route, next: any) => {
  try {
    const profile = await store.dispatch('updateProfile');
    if (!profile.team && to.name !== 'Team') {
      next({ name: 'Team' });
      return true; // * return as "redirected"
    } else {
      next();
    }
  } catch (error) {
    if (to.name !== 'Login') next({ name: 'Login' });
    console.log(error);
    throw new Error(error);
  }
};

export const teamResolver = async (to: Route, from: Route, next: any) => {
  try {
    const profile = await store.dispatch('updateProfile');
    if (profile.team) {
      const team = await store.dispatch('updateTeamInfo');
      next();
    } else {
      if (to.name !== 'Team') {
        next({ name: 'Team' });
      } else {
        next();
      }
      return true;
    }
  } catch (error) {
    if (to.name !== 'Login') {
      await store.dispatch('showToast', 'You need to login first.');
      next({ name: 'Login' });
    }
    console.log(error);
    throw new Error(error);
  }
};
