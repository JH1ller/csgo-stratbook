import Vue from 'vue';
import { Module } from 'vuex';
import { RootState } from '..';
import { Strat, Step } from '@/services/models';
import APIService from '@/services/APIService';

const SET_STRATS = 'SET_STRATS';
const SET_STEPS_OF_STRAT = 'SET_STEPS_OF_STRAT';

export interface StratState {
  strats: Strat[];
}

const stratInitialState = (): StratState => ({
  strats: [],
});

export const stratModule: Module<StratState, RootState> = {
  namespaced: true,
  state: stratInitialState(),
  getters: {},
  actions: {
    async fetchStrats({ commit, dispatch, rootState }) {
      if (!rootState.map.currentMap) return;
      try {
        dispatch('app/showLoader', null, { root: true });
        const strats = await APIService.getStratsOfMap(
          rootState.map.currentMap
        );
        commit(SET_STRATS, strats);
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        dispatch('app/showToast', error, { root: true });
      }
    },
    async updateStepsOfStrat({ commit, dispatch }, stratID: string) {
      try {
        const steps = await APIService.getStepsOfStrat(stratID);
        commit(SET_STEPS_OF_STRAT, { stratID, steps });
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
      }
    },
    async deleteStrat({ dispatch }, payload) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.deleteStrat(payload);
        await dispatch('fetchStrats');
        dispatch('app/showToast', 'Deleted strat', { root: true });
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
        dispatch('app/hideLoader', null, { root: true });
      }
    },
    async createStrat({ dispatch, rootState }, payload) {
      try {
        if (rootState.map.currentMap) {
          dispatch('app/showLoader', null, { root: true });
          const res = await APIService.createStrat(
            payload,
            rootState.map.currentMap
          );
          dispatch('app/showToast', 'Added strat', { root: true });
          await dispatch('fetchStrats');
          dispatch('app/hideLoader', null, { root: true });
        }
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
        dispatch('app/hideLoader', null, { root: true });
      }
    },
    async updateStrat({ dispatch }, { stratId, changeObj }) {
      // TODO: refactor to simply accept strat obj
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.updateStrat(stratId, changeObj);
        await dispatch('fetchStrats');
        dispatch('app/showToast', 'Successfully updated the strat.', {
          root: true,
        });
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
        dispatch('app/hideLoader', null, { root: true });
      }
    },
    async updateStep({ dispatch }, payload) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.updateStep(payload);
        await dispatch('updateStepsOfStrat', payload.strat);
        dispatch('app/showToast', 'Updated step', { root: true });
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
        dispatch('app/hideLoader', null, { root: true });
      }
    },
    async addStep({ dispatch }, payload) {
      try {
        dispatch('app/showLoader', null, { root: true });
        await APIService.addStep(payload);
        await dispatch('updateStepsOfStrat', payload.strat);
        dispatch('app/showToast', 'Added step', { root: true });
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
        dispatch('app/hideLoader', null, { root: true });
      }
    },
    async deleteStep({ dispatch }, payload) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.deleteStep(payload.stepId);
        await dispatch('updateStepsOfStrat', payload.strat);
        dispatch('app/showToast', 'Deleted step', { root: true });
        dispatch('app/hideLoader', null, { root: true });
      } catch (error) {
        dispatch('app/showToast', error, { root: true });
        dispatch('app/hideLoader', null, { root: true });
      }
    },
  },
  mutations: {
    [SET_STRATS](state, strats: Strat[]) {
      state.strats = strats;
    },
    [SET_STEPS_OF_STRAT](
      state,
      { stratID, steps }: { stratID: string; steps: Step[] }
    ) {
      const stateObj = state.strats.find(targetStrat => {
        return targetStrat._id === stratID;
      }) as Strat;
      Vue.set(stateObj, 'steps', steps);
    },
  },
};
