import Vue from 'vue';
import { Module } from 'vuex';
import { RootState } from '..';
import { Strat, Step } from '@/services/models';
import APIService from '@/services/APIService';

const SET_STRATS = 'SET_STRATS';
const SET_STEPS_OF_STRAT = 'SET_STEPS_OF_STRAT';
const RESET_STATE = 'RESET_STATE';

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
    async fetchStrats({ commit, rootState, state }) {
      const res = await APIService.getStratsOfMap(rootState.map.currentMap);
      if (res.success) {
        commit(SET_STRATS, res.success);
        localStorage.setItem('strats', JSON.stringify(state.strats));
      }
    },
    async fetchStepsOfStrat({ commit, state }, stratID: string) {
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
      }
    },
    async updateStrat({ dispatch }, payload: Partial<Strat>) {
      const res = await APIService.updateStrat(payload);
      if (res.success) {
        dispatch('app/showToast', 'Successfully updated the strat.', { root: true });
      }
    },
    async updateStep({ dispatch }, payload: Partial<Step>) {
      const res = await APIService.updateStep(payload);
      if (res.success) {
        dispatch('app/showToast', 'Updated step', { root: true });
      }
    },
    async createStep({ dispatch }, step: Partial<Step>) {
      const res = await APIService.createStep(step);
      if (res.success) {
        dispatch('app/showToast', 'Added step', { root: true });
      }
    },
    async deleteStep({ dispatch }, payload: { stepID: string; stratID: string }) {
      const res = await APIService.deleteStep(payload.stepID);
      if (res.success) {
        dispatch('fetchStepsOfStrat', payload.stratID);
        dispatch('app/showToast', 'Deleted step', { root: true });
      }
    },
    loadStratsFromStorage({ commit }) {
      const strats = localStorage.getItem('strats');
      if (strats) commit(SET_STRATS, JSON.parse(strats));
    },
    resetState({ commit }) {
      commit(RESET_STATE);
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
    [RESET_STATE](state) {
      Object.assign(state, stratInitialState());
    },
  },
};
