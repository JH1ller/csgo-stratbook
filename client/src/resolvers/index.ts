import { Route } from 'vue-router';
import store from '@/store/index';
import APIService from '@/services/APIService'

export const mapsResolver = async (to: Route, from: Route, next: any) => {
    try {
        const maps = await APIService.getAllMaps();
        const res = await store.dispatch('updateMaps', maps);
        if (res) next();
    } catch (error) {
        console.log(error);
    }
};