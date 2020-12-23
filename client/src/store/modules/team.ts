import { Module } from 'vuex';
import { RootState } from '..';
import APIService from '@/api/APIService';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Team } from '@/api/models/Team';
import { Player } from '@/api/models/Player';
import { Status } from './auth';

const SET_TEAM_INFO = 'SET_TEAM_INFO';
const SET_TEAM_MEMBERS = 'SET_TEAM_MEMBERS';
const ADD_TEAM_MEMBER = 'ADD_TEAM_MEMBER';
const UPDATE_TEAM_MEMBER = 'UPDATE_TEAM_MEMBER';
const DELETE_TEAM_MEMBER = 'DELETE_TEAM_MEMBER';
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
      return resolveStaticImageUrl((state.teamInfo as Team).avatar);
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
        dispatch('saveTeamInfoToStorage');
        dispatch('auth/updateStatus', Status.LOGGED_IN_WITH_TEAM, { root: true });
        dispatch('fetchTeamMembers');
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async fetchTeamMembers({ commit, dispatch }) {
      const res = await APIService.getMembersOfTeam();
      if (res.success) {
        commit(SET_TEAM_MEMBERS, res.success);
        dispatch('saveTeamMembersToStorage');
      }
    },
    async createTeam({ dispatch }, formData: FormData) {
      const res = await APIService.createTeam(formData);
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        dispatch(
          'app/showToast',
          {
            id: 'team/createTeam',
            text: 'Team successfully created. You can now visit the strats page and start creating strats!',
          },
          { root: true }
        );
        return { success: true }; // TODO: probably obsolete. remove
      } else {
        return { error: res.error };
      }
    },
    async updateTeam({ dispatch }, formData: FormData) {
      const res = await APIService.updateTeam(formData);
      if (res.success) {
        dispatch(
          'app/showToast',
          {
            id: 'team/updateTeam',
            text: 'Team details updated.',
          },
          { root: true }
        );
        return { success: true };
      } else {
        return { error: res.error };
      }
    },
    async joinTeam({ dispatch }, code: string) {
      const res = await APIService.joinTeam(code);
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        dispatch(
          'app/showToast',
          {
            id: 'team/createTeam',
            text: 'Successfully joined team.',
          },
          { root: true }
        );
        return { success: 'Successfully joined team.' };
      } else {
        return { error: res.error };
      }
    },
    async leaveTeam({ dispatch }) {
      const res = await APIService.leaveTeam();
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        //dispatch('resetState');
        dispatch('strat/resetState', null, { root: true });
        dispatch('app/showToast', { id: 'team/leaveTeam', text: 'You have left the team' }, { root: true });
        //localStorage.clear(); // TODO: clear everything except auth data
        // TODO: create team/resetState and call it here
        return { success: 'Successfully left team.' };
      } else {
        return { error: res.error };
      }
    },
    async transferManager({ dispatch, commit }, memberID: string) {
      const res = await APIService.transferManager(memberID);
      if (res.success) {
        commit(SET_TEAM_INFO, res.success);
        dispatch(
          'app/showToast',
          { id: 'team/transferManager', text: 'Leadership successfully transfered' },
          { root: true }
        );
        return { success: 'Successfully transfered.' };
      } else {
        return { error: res.error };
      }
    },
    async kickMember({ dispatch }, memberID: string) {
      const res = await APIService.kickMember(memberID);
      if (res.success) {
        dispatch('fetchTeamMembers');
        dispatch('app/showToast', { id: 'team/kickMember', text: 'Player successfully kicked' }, { root: true });
        return { success: 'Successfully kicked.' };
      } else {
        return { error: res.error };
      }
    },
    updateMemberLocally({ commit }, payload: { player: Player }) {
      commit(UPDATE_TEAM_MEMBER, payload.player);
    },
    deleteMemberLocally({ commit }, payload: { playerID: string }) {
      commit(UPDATE_TEAM_MEMBER, payload.playerID);
    },
    updateTeamLocally({ commit }, payload: { team: Team }) {
      commit(SET_TEAM_INFO, payload.team);
    },
    deleteTeamLocally({ commit, dispatch }) {
      commit(SET_TEAM_INFO, {});
      dispatch('auth/fetchProfile', null, { root: true });
    },
    loadTeamInfoFromStorage({ commit }) {
      const teamInfo = localStorage.getItem('teamInfo');
      if (teamInfo) commit(SET_TEAM_INFO, JSON.parse(teamInfo));
    },
    loadTeamMembersFromStorage({ commit }) {
      const teamMembers = localStorage.getItem('teamMembers');
      if (teamMembers) commit(SET_TEAM_MEMBERS, JSON.parse(teamMembers));
    },
    saveTeamInfoToStorage({ state }) {
      localStorage.setItem('teamInfo', JSON.stringify(state.teamInfo));
    },
    saveTeamMembersToStorage({ state }) {
      localStorage.setItem('teamMembers', JSON.stringify(state.teamMembers));
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
    [UPDATE_TEAM_MEMBER](state, player: Player) {
      const member = state.teamMembers.find(member => member._id === player._id);
      if (member) Object.assign(member, player);
    },
    [DELETE_TEAM_MEMBER](state, playerID: string) {
      state.teamMembers = state.teamMembers.filter(member => member._id !== playerID);
    },
    [RESET_STATE](state) {
      Object.assign(state, teamInitialState());
    },
  },
};
