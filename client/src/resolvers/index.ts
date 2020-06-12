import { Route } from 'vue-router';
import store from '@/store/index';
import APIService from '@/services/APIService';

export const stratsResolver = async (to: Route, from: Route, next: any) => {
  try {
    const aborted = await profileResolver(to, from, next);
    console.log(aborted);
    if (!aborted) {
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
    console.log(profile.team);
    if (!profile.team && to.name !== 'Team') {
      next({ name: 'Team' });
      return true; // * return as "aborted"
    } else {
      next();
    }
  } catch (error) {
    if (to.name !== 'Login') next({ name: 'Login' });
    console.log(error);
    throw new Error(error);
  }
};
