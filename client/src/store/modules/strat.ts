import Vue from 'vue';
import { Module } from 'vuex';
import { RootState } from '..';
import { Strat, Step } from '@/services/models';
import APIService from '@/services/APIService';

const SET_STRATS = 'SET_STRATS';

const ADD_STRAT = 'ADD_STRAT';
const UPDATE_STRAT = 'UPDATE_STRAT';
const DELETE_STRAT = 'DELETE_STRAT';

const ADD_STEP = 'ADD_STEP';
const UPDATE_STEP = 'UPDATE_STEP';
const DELETE_STEP = 'DELETE_STEP';

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
    async fetchStrats({ commit, rootState, dispatch }) {
      const res = await APIService.getStratsOfMap(rootState.map.currentMap);
      if (res.success) {
        commit(SET_STRATS, res.success);
        dispatch('saveStratsToStorage');
      }
    },
    async fetchStepsOfStrat({ commit }, stratID: string) {
      const res = await APIService.getStepsOfStrat(stratID);
      if (res.success) commit(SET_STEPS_OF_STRAT, { stratID, steps: res.success });
    },
    async deleteStrat({ dispatch }, stratID: string) {
      const res = await APIService.deleteStrat(stratID);
      if (res.success) dispatch('app/showToast', { id: 'strat/deleteStrat', text: 'Deleted strat.' }, { root: true });
    },
    async createStrat({ dispatch, rootState }, payload: Partial<Strat>) {
      const newStrat = { ...payload, map: rootState.map.currentMap };
      const res = await APIService.createStrat(newStrat);
      if (res.success) dispatch('app/showToast', { id: 'strat/createStrat', text: 'Added strat.' }, { root: true });
    },
    async updateStrat({ dispatch }, payload: Partial<Strat>) {
      const res = await APIService.updateStrat(payload);
      if (res.success)
        dispatch('app/showToast', { id: 'strat/updateStrat', text: 'Successfully updated the strat.' }, { root: true });
    },
    async updateStep({ dispatch }, payload: Partial<Step>) {
      const res = await APIService.updateStep(payload);
      if (res.success) dispatch('app/showToast', { id: 'strat/updateStep', text: 'Updated step.' }, { root: true });
    },
    async createStep({ dispatch }, step: Partial<Step>) {
      const res = await APIService.createStep(step);
      if (res.success) dispatch('app/showToast', { id: 'strat/createStep', text: 'Added step.' }, { root: true });
    },
    async deleteStep({ dispatch }, payload: { stepID: string; stratID: string }) {
      const res = await APIService.deleteStep(payload.stepID);
      if (res.success) dispatch('app/showToast', { id: 'strat/deleteStep', text: 'Deleted step.' }, { root: true });
    },
    addStratLocally({ commit, rootState, dispatch }, payload: { strat: Strat }) {
      if (rootState.map.currentMap === payload.strat.map) {
        commit(ADD_STRAT, payload.strat);
        dispatch('saveStratsToStorage');
      }
    },
    updateStratLocally({ commit, rootState, dispatch }, payload: { strat: Strat }) {
      if (rootState.map.currentMap === payload.strat.map) {
        commit(UPDATE_STRAT, payload);
        dispatch('saveStratsToStorage');
      }
    },
    deleteStratLocally({ commit, dispatch }, payload: { stratID: string }) {
      commit(DELETE_STRAT, payload.stratID);
      dispatch('saveStratsToStorage');
    },
    addStepLocally({ commit, dispatch }, payload: { step: Step }) {
      commit(ADD_STEP, payload.step);
      dispatch('saveStratsToStorage');
    },
    updateStepLocally({ commit, dispatch }, payload: { step: Step }) {
      commit(UPDATE_STEP, payload);
      dispatch('saveStratsToStorage');
    },
    deleteStepLocally({ commit, dispatch }, payload: { stepID: string }) {
      commit(DELETE_STEP, payload.stepID);
      dispatch('saveStratsToStorage');
    },
    loadStratsFromStorage({ commit }) {
      const strats = localStorage.getItem('strats');
      if (strats) commit(SET_STRATS, JSON.parse(strats));
    },
    saveStratsToStorage({ state }) {
      localStorage.setItem('strats', JSON.stringify(state.strats));
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_STRATS](state, strats: Strat[]) {
      state.strats = strats;
    },
    [ADD_STRAT](state, strat: Strat) {
      state.strats.push(strat);
    },
    [UPDATE_STRAT](state, payload: { strat: Strat }) {
      const strat = state.strats.find(strat => strat._id === payload.strat._id);
      if (strat) Object.assign(strat, payload.strat);
    },
    [DELETE_STRAT](state, stratID: string) {
      state.strats = state.strats.filter(strat => strat._id !== stratID);
    },
    [ADD_STEP](state, step: Step) {
      const strat = state.strats.find(strat => strat._id === step.strat);
      if (strat) strat.steps.push(step);
    },
    [UPDATE_STEP](state, payload: { step: Step }) {
      const step = state.strats
        .find(strat => strat._id === payload.step.strat)
        ?.steps.find(step => step._id === payload.step._id);

      if (step) Object.assign(step, payload.step);
    },
    [DELETE_STEP](state, stepID: string) {
      const strat = state.strats.find(strat => !!strat.steps.find(step => step._id === stepID));
      if (strat) strat.steps = strat.steps.filter(step => step._id !== stepID);
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
