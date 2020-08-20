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
    async fetchStrats({ commit, rootState }) {
      const res = await APIService.getStratsOfMap(rootState.map.currentMap);
      if (res.success) commit(SET_STRATS, res.success);
    },
    async fetchStepsOfStrat({ commit }, stratID: string) {
      const res = await APIService.getStepsOfStrat(stratID);
      if (res.success) commit(SET_STEPS_OF_STRAT, { stratID, steps: res.success });
    },
    async deleteStrat({ dispatch }, stratID: string) {
      const res = await APIService.deleteStrat(stratID);
      if (res.success) {
        dispatch('app/showToast', 'Deleted strat', { root: true });
        dispatch('fetchStrats');
      }
    },
    async createStrat({ dispatch, rootState }, payload: Partial<Strat>) {
      const newStrat = { ...payload, map: rootState.map.currentMap };
      const res = await APIService.createStrat(newStrat);
      if (res.success) {
        dispatch('app/showToast', 'Added strat', { root: true });
        dispatch('fetchStrats');
      }
    },
    async updateStrat({ dispatch }, payload: Partial<Strat>) {
      const res = await APIService.updateStrat(payload);
      if (res.success) {
        dispatch('fetchStrats');
        dispatch('app/showToast', 'Successfully updated the strat.', { root: true });
      }
    },
    async updateStep({ dispatch }, payload: Partial<Step>) {
      const res = await APIService.updateStep(payload);
      if (res.success) {
        dispatch('updateStepsOfStrat', payload.strat);
        dispatch('app/showToast', 'Updated step', { root: true });
      }
    },
    async createStep({ dispatch }, step: Partial<Step>) {
      const res = await APIService.createStep(step);
      if (res.success) {
        dispatch('updateStepsOfStrat', step.strat);
        dispatch('app/showToast', 'Added step', { root: true });
      }
    },
    async deleteStep({ dispatch }, payload: { stepID: string; stratID: string }) {
      const res = await APIService.deleteStep(payload.stepID);
      if (res.success) {
        dispatch('updateStepsOfStrat', payload.stratID);
        dispatch('app/showToast', 'Deleted step', { root: true });
      }
    },
  },
  mutations: {
    [SET_STRATS](state, strats: Strat[]) {
      state.strats = strats;
    },
    [SET_STEPS_OF_STRAT](state, { stratID, steps }: { stratID: string; steps: Step[] }) {
      const stateObj = state.strats.find(targetStrat => {
        return targetStrat._id === stratID;
      }) as Strat;
      Vue.set(stateObj, 'steps', steps);
    },
  },
};
