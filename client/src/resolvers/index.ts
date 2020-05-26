import { Route } from 'vue-router';
import store from '@/store/index';
import APIService from '@/services/APIService';

export const mapsResolver = async (to: Route, from: Route, next: any) => {
  try {
    await store.dispatch('updateMaps');
    next();
  } catch (error) {
    console.log(error);
  }
};

export const profileResolver = async (to: Route, from: Route, next: any) => {
  try {
    await store.dispatch('updateProfile');
  } catch (error) {
    console.log(error);
  }
  next();
};
