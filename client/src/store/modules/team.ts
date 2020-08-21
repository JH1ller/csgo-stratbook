import { Module } from 'vuex';
import { RootState } from '..';
import { Player, Team, Status } from '@/services/models';
import APIService from '@/services/APIService';
import { TeamCreateFormData } from '@/components/team-create-form/team-create-form';

const SET_TEAM_INFO = 'SET_TEAM_INFO';
const SET_TEAM_MEMBERS = 'SET_TEAM_MEMBERS';
const RESET_STATE = 'RESET_STATE';

export interface TeamState {
  teamInfo: Team | {};
  teamMembers: Player[];
}

const teamInitialState = (): TeamState => ({
  teamInfo: {},
  teamMembers: [],
});

export const teamModule: Module<TeamState, RootState> = {
  namespaced: true,
  state: teamInitialState(),
  getters: {
    teamAvatarUrl(state): string {
      if ((state.teamInfo as Team).avatar) {
        return process.env.NODE_ENV === 'development'
          ? `http://localhost:3000/public/upload/${(state.teamInfo as Team).avatar}`
          : `https://csgo-stratbook.s3.amazonaws.com/${(state.teamInfo as Team).avatar}`;
      } else {
        return require('@/assets/images/default.jpg');
      }
    },
    connectionString(state) {
      return `connect ${(state.teamInfo as Team).server?.ip}; ${
        (state.teamInfo as Team).server?.password ? `password ${(state.teamInfo as Team).server?.password}` : ''
      }`;
    },
  },
  actions: {
    async fetchTeamInfo({ commit, dispatch }) {
      const res = await APIService.getTeam();
      if (res.success) {
        commit(SET_TEAM_INFO, res.success);
        dispatch('auth/updateStatus', Status.LOGGED_IN_WITH_TEAM, { root: true });
        dispatch('fetchTeamMembers');
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async fetchTeamMembers({ commit }) {
      const res = await APIService.getMembersOfTeam();
      if (res.success) {
        commit(SET_TEAM_MEMBERS, res.success);
      }
    },
    async createTeam({ commit, dispatch }, formData: TeamCreateFormData) {
      const res = await APIService.createTeam(formData);
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        return { success: 'Team successfully created. You can now visit the strats page and start creating strats!' };
      } else {
        return { error: res.error };
      }
    },
    async joinTeam({ dispatch }, code: string) {
      const res = await APIService.joinTeam(code);
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        return { success: 'Successfully joined team.' };
      } else {
        return { error: res.error };
      }
    },
    async leaveTeam({ dispatch }) {
      const res = await APIService.leaveTeam();
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        dispatch('resetState');
        dispatch('strat/resetState', null, { root: true });
        dispatch('app/showToast', 'You have left the team.', { root: true });
        return { success: 'Successfully left team.' };
      } else {
        return { error: res.error };
      }
    },
    resetState({ commit }) {
      commit(RESET_STATE);
    },
  },
  mutations: {
    [SET_TEAM_INFO](state, teamInfo: Team) {
      state.teamInfo = teamInfo;
    },
    [SET_TEAM_MEMBERS](state, members: Player[]) {
      state.teamMembers = members;
    },
    [RESET_STATE](state) {
      Object.assign(state, teamInitialState());
    },
  },
};
