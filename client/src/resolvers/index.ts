import { Route } from 'vue-router';
import store from '@/store/index';
import APIService from '@/services/APIService';

export const stratsResolver = async (to: Route, from: Route, next: any) => {
  try {
    await profileResolver(to, from, next);
    await store.dispatch('updateMaps');
    next();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const profileResolver = async (to: Route, from: Route, next: any) => {
  try {
    await store.dispatch('updateProfile');
    console.log('profile resolver success');
    next();
  } catch (error) {
    if (to.name !== 'Login') next({ name: 'Login' });
    console.log(error);
    throw new Error(error);
  }
};
