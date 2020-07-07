import Vue from 'vue';
import Vuex from 'vuex';
import {
  Map,
  Strat,
  Step,
  Player,
  Team,
  Status,
  Sides,
  StratTypes,
} from '@/services/models';
import APIService from '@/services/APIService';
import AuthService from '@/services/AuthService';

const authService = AuthService.getInstance();

export interface AppState {
  ui: {
    showLoader: boolean;
    loaderText: string;
    toast: {
      show: boolean;
      message: string;
    };
  };
  status: Status;
  maps: Map[];
  currentMap: string;
  currentStrats: Strat[];
  token: string;
  profile: Player | {};
  teamInfo: Team | {};
  teamMembers: Player[];
  filters: {
    name: string;
    player: string;
    side: Sides | null;
    type: StratTypes | null;
  };
}

const getInitialState = (): AppState => {
  return {
    ui: {
      showLoader: false,
      loaderText: '',
      toast: {
        show: false,
        message: '',
      },
    },
    status: Status.NO_AUTH,
    maps: [],
    currentMap: '',
    currentStrats: [],
    token: '',
    profile: {},
    teamInfo: {},
    teamMembers: [],
    filters: {
      name: '',
      player: '',
      side: null,
      type: null,
    },
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
    showToast(state, message: string) {
      state.ui.toast.message = message;
      state.ui.toast.show = true;
    },
    hideToast(state) {
      state.ui.toast.show = false;
    },
    setMaps(state, payload) {
      state.maps = payload;
    },
    setCurrentMap(state, payload) {
      state.currentMap = payload;
    },
    setCurrentStrats(state, payload) {
      state.currentStrats = payload;
    },
    setToken(state, token: string) {
      state.token = token;
    },
    setStepsOfStrat(state, { strat, steps }: { strat: Strat; steps: Step[] }) {
      const stateObj = state.currentStrats.find(
        targetStrat => targetStrat._id === strat._id
      ) as Strat;
      Vue.set(stateObj, 'steps', steps);
    },
    setProfile(state, profile: Player) {
      state.profile = profile;
    },
    setTeamInfo(state, teamInfo: Team) {
      state.teamInfo = teamInfo;
    },
    setTeamMembers(state, members: Player[]) {
      state.teamMembers = members;
    },
    setStatus(state, status: Status) {
      state.status = status;
    },
    setPlayerFilter(state, value: string) {
      state.filters.player = value;
    },
    setTypeFilter(state, value: StratTypes | null) {
      state.filters.type = value;
    },
    setSideFilter(state, value: Sides | null) {
      state.filters.side = value;
    },
    setNameFilter(state, value: string) {
      state.filters.name = value;
    },
  },
  actions: {
    resetState({ commit }) {
      commit('resetState');
    },
    showToast({ commit }, message: string) {
      commit('showToast', message);
    },
    hideToast({ commit }) {
      commit('hideToast');
    },
    async updateMaps({ commit, dispatch }) {
      try {
        const maps = await APIService.getAllMaps();
        commit('setMaps', maps);
        await dispatch('updateCurrentMap', maps[0]._id);
      } catch (error) {
        await dispatch('showToast', error);
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
        dispatch('showToast', error);
      }
    },
    async updateStepsOfCurrentStrats({ commit, dispatch }) {
      this.state.currentStrats.forEach(async strat => {
        try {
          const steps = await APIService.getStepsOfStrat(strat._id);
          commit('setStepsOfStrat', { strat, steps });
        } catch (error) {
          dispatch('showToast', error);
        }
      });
    },
    async deleteStrat({ dispatch }, payload) {
      try {
        const res = await APIService.deleteStrat(payload);
        await dispatch('updateCurrentStrats');
        await dispatch('showToast', 'Deleted strat');
      } catch (error) {
        dispatch('showToast', error);
      }
    },
    async createStrat({ dispatch }, payload) {
      try {
        if (this.state.currentMap) {
          const res = await APIService.createStrat(
            payload,
            this.state.currentMap as string
          );
          await dispatch('updateCurrentStrats');
        }
      } catch (error) {
        dispatch('showToast', error);
      }
    },
    async updateStrat({ dispatch }, { stratId, changeObj }) {
      try {
        const res = await APIService.updateStrat(stratId, changeObj);
        await dispatch('updateCurrentStrats');
        await dispatch('showToast', 'Successfully updated the strat.');
      } catch (error) {
        await dispatch('showToast', error);
      }
    },
    async updateStep({ dispatch }, payload) {
      try {
        const res = await APIService.updateStep(payload);
        await dispatch('updateStepsOfCurrentStrats');
        await dispatch('showToast', 'Updated step');
      } catch (error) {
        await dispatch('showToast', error);
      }
    },
    async addStep({ dispatch }, payload) {
      try {
        const res = await APIService.addStep(payload);
        await dispatch('updateStepsOfCurrentStrats');
        await dispatch('showToast', 'Added step');
      } catch (error) {
        await dispatch('showToast', error);
      }
    },
    async deleteStep({ dispatch }, stepId: string) {
      try {
        const res = await APIService.deleteStep(stepId);
        await dispatch('updateStepsOfCurrentStrats');
        await dispatch('showToast', 'Deleted step');
      } catch (error) {
        await dispatch('showToast', error);
      }
    },
    async updateProfile({ commit }) {
      try {
        const profile = await authService.updatePlayerInfo();
        if (profile) {
          commit('setProfile', profile);
          commit(
            'setStatus',
            profile.team ? Status.LOGGED_IN_WITH_TEAM : Status.LOGGED_IN_NO_TEAM
          );
          return profile;
        } else {
          throw new Error('Could not update Profile');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateTeamInfo({ commit, state, dispatch }) {
      try {
        if (state.profile) {
          const teamInfo = await APIService.getTeamOfPlayer(
            (state.profile as Player)._id
          );
          commit('setStatus', Status.LOGGED_IN_WITH_TEAM);
          commit('setTeamInfo', teamInfo);
          await dispatch('updateTeamMembers');
          return teamInfo;
        } else {
          throw new Error(
            'Cannot retrieve team because user is not logged in.'
          );
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async updateTeamMembers({ commit, state }) {
      try {
        if (state.teamInfo) {
          const members = await APIService.getMembersOfTeam(
            (state.teamInfo as Team)._id
          );
          commit('setTeamMembers', members);
          return members;
        } else {
          throw new Error('Cannot retrieve members because team is not set.');
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    async loginUser({ commit, dispatch }, { email, password }) {
      try {
        const res = await authService.login(email, password);
        if (res.token) {
          commit('setToken', res.token);
          await dispatch('updateProfile');
          return { success: 'Logged in successfully.' };
        }
      } catch (error) {
        return { error: error };
      }
    },
    async logoutUser({ commit, dispatch }) {
      commit('resetState');
      authService.clear();
      commit('setStatus', Status.NO_AUTH);
      await dispatch('showToast', 'Logged out successfully');
      return true;
    },
    async registerUser({ commit }, formData) {
      try {
        const res = await authService.register(formData);
        if (res.user) {
          return {
            success:
              'Registered successfully. A confirmation email has been sent.',
          };
        }
      } catch (error) {
        return { error: error };
      }
    },
    async createTeam({ commit, dispatch }, formData) {
      try {
        const res = await APIService.createTeam(formData);
        if (res.team) {
          await dispatch('updatePlayer', res.team._id);
          return {
            success:
              'Team successfully created. You can now visit the strats page and start creating strats!',
          };
        }
      } catch (error) {
        return { error: error };
      }
    },
    async joinTeam({ commit, dispatch }, code: string) {
      try {
        const res = await APIService.joinTeam(code);
        await dispatch('showToast', 'Successfully joined team.');
        return {
          success: 'Successfully joined team.',
        };
      } catch (error) {
        return { error: error };
      }
    },
    async leaveTeam({ commit, dispatch }) {
      try {
        const res = await APIService.leaveTeam();

        await dispatch('updateProfile');
        await dispatch('showToast', 'Successfully left team.');
        return {
          success: 'Successfully left team.',
        };
      } catch (error) {
        return { error: error };
      }
    },
    async updatePlayer({ commit, dispatch }, teamId: string) {
      try {
        const res = await APIService.updatePlayer({ team: teamId });
      } catch (error) {
        throw new Error(error);
      }
    },
    updatePlayerFilter({ commit }, value: string) {
      commit('setPlayerFilter', value);
    },
    updateTypeFilter({ commit }, value: StratTypes | null) {
      commit('setTypeFilter', value);
    },
    updateSideFilter({ commit }, value: Sides | null) {
      commit('setSideFilter', value);
    },
    updateNameFilter({ commit }, value: string) {
      commit('setNameFilter', value);
    },
  },
  getters: {},
  modules: {},
});
