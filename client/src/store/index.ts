import Vue from 'vue';
import Vuex from 'vuex';
import { Map, Strat, Step, Player } from '@/services/models';
import APIService from '@/services/APIService';
import AuthService from '@/services/AuthService';

const authService = AuthService.getInstance();

export interface AppState {
  ui: {
    showLoader: boolean;
    loaderText: string;
  };
  maps: Map[];
  currentMap: string | null;
  currentStrats: Strat[];
  token: string | null;
  profile: Player | null;
}

const getInitialState = (): AppState => {
  return {
    ui: {
      showLoader: false,
      loaderText: '',
    },
    maps: [],
    currentMap: null,
    currentStrats: [],
    token: null,
    profile: null,
  };
};

Vue.use(Vuex);

export default new Vuex.Store({
  state: getInitialState(),
  mutations: {
    resetState(state) {
      Object.assign(state, getInitialState());
    },
    setLoader(state, payload) {
      state.ui.showLoader = payload;
    },
    setLoaderText(state, payload) {
      state.ui.loaderText = payload;
    },
    updateMaps(state, payload) {
      state.maps = payload;
    },
    setCurrentMap(state, payload) {
      state.currentMap = payload;
    },
    setCurrentStrats(state, payload) {
      state.currentStrats = payload;
    },
    setToken(state, payload) {
      state.token = payload;
    },
    setStepsOfStrat(state, { strat, steps }: { strat: Strat; steps: Step[] }) {
      const stateObj = state.currentStrats.find(
        targetStrat => targetStrat._id === strat._id
      ) as Strat;
      Vue.set(stateObj, 'steps', steps);
    },
    setProfile(state, profile) {
      state.profile = profile;
    },
  },
  actions: {
    resetState({ commit }) {
      commit('resetState');
    },
    setLoader({ commit }, payload) {
      commit('setLoader', payload);
      return true;
    },
    setLoaderText({ commit }, payload) {
      commit('setLoaderText', payload);
      return true;
    },
    async updateMaps({ commit }) {
      try {
        const maps = await APIService.getAllMaps();
        commit('updateMaps', maps);
      } catch (error) {
        console.error(error);
      }
    },
    updateCurrentMap({ commit, dispatch }, payload) {
      commit('setCurrentMap', payload);
      dispatch('updateCurrentStrats');
    },
    async updateCurrentStrats({ commit, dispatch }) {
      if (!this.state.currentMap) return;
      try {
        const strats = await APIService.getStratsOfMap(this.state.currentMap);
        commit('setCurrentStrats', strats);
        await dispatch('updateStepsOfCurrentStrats');
      } catch (error) {
        console.error(error);
      }
    },
    async updateStepsOfCurrentStrats({ commit }) {
      this.state.currentStrats.forEach(async strat => {
        try {
          const steps = await APIService.getStepsOfStrat(strat._id);
          commit('setStepsOfStrat', { strat, steps });
        } catch (error) {
          console.error(error);
        }
      });
    },
    async deleteStrat({ dispatch }, payload) {
      try {
        const res = await APIService.deleteStrat(payload);
        dispatch('updateCurrentStrats');
      } catch (error) {
        console.error(error);
      }
    },
    async createStrat({ dispatch }, payload) {
      try {
        if (this.state.currentMap) {
          const res = await APIService.createStrat(
            payload,
            this.state.currentMap as string
          );
          dispatch('updateCurrentStrats');
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updateStrat({ dispatch }, { stratId, changeObj }) {
      try {
        const res = await APIService.updateStrat(stratId, changeObj);
        dispatch('updateCurrentStrats');
      } catch (error) {
        console.error(error);
      }
    },
    async updateStep({ dispatch }, { stepId, changeObj }) {
      try {
        const res = await APIService.updateStep(stepId, changeObj);
        dispatch('updateStepsOfCurrentStrats');
      } catch (error) {
        console.error(error);
      }
    },
    async addStep({ dispatch, state }, { stratId, payload }) {
      try {
        const res = await APIService.addStep(
          stratId,
          state?.profile?._id as string,
          payload
        );
        dispatch('updateStepsOfCurrentStrats');
      } catch (error) {
        console.error(error);
      }
    },
    async updateProfile({ commit }) {
      try {
        const profile = await authService.updatePlayerInfo();
        console.log(profile);
        commit('setProfile', profile);
        return profile;
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },
    async loginUser({ commit, dispatch }, { email, password }) {
      try {
        const res = await authService.login(email, password);
        if (res.error) {
          return { error: res.error };
        } else if (res.token) {
          commit('setToken', res.token);
          //dispatch('updateProfile');

          return { success: 'Logged in successfully.' };
        }
      } catch (error) {
        console.error(error);
      }
    },
    async registerUser({ commit }, formData) {
      try {
        const res = await authService.register(formData);
        console.log(res);
        if (res.error) {
          return { error: res.error };
        } else if (res.user) {
          return {
            success:
              'Registered successfully. A confirmation email has been sent.',
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
    async createTeam({ commit, dispatch }, formData) {
      try {
        const res = await APIService.createTeam(formData);
        if (res.error) {
          return { error: res.error };
        } else if (res.team) {
          console.log(res.team);
          await dispatch('updatePlayer', res.team._id);
          return {
            success:
              'Team successfully created. You can now visit the strats page and start creating strats!',
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
    async joinTeam({ commit, dispatch }, code: string) {
      try {
        const res = await APIService.joinTeam(code);
        if (res.error) {
          return { error: res.error };
        } else {
          return {
            success: 'Successfully joined team.',
          };
        }
      } catch (error) {
        console.error(error);
      }
    },
    async updatePlayer({ commit, dispatch }, teamId: string) {
      try {
        const res = await APIService.updatePlayer({ team: teamId });
      } catch (error) {
        console.error(error);
        throw new Error(error);
      }
    },
  },
  getters: {},
  modules: {},
});
