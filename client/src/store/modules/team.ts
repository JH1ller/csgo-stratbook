import { Module } from 'vuex';
import { RootState } from '..';
import { resolveStaticImageUrl } from '@/utils/resolveUrls';
import { Team } from '@/api/models/Team';
import { Player } from '@/api/models/Player';
import { Status } from './auth';
import api from '@/api/base';
import TrackingService from '@/services/tracking.service';

const SET_TEAM_INFO = 'SET_TEAM_INFO';
const SET_TEAM_MEMBERS = 'SET_TEAM_MEMBERS';
const UPDATE_TEAM_MEMBER = 'UPDATE_TEAM_MEMBER';
const DELETE_TEAM_MEMBER = 'DELETE_TEAM_MEMBER';
const RESET_STATE = 'RESET_STATE';

export interface TeamState {
  teamInfo: Team | Record<string, any>;
  teamMembers: Player[];
}

const teamInitialState = (): TeamState => ({
  teamInfo: {},
  teamMembers: [],
});

const trackingService = TrackingService.getInstance();

export const teamModule: Module<TeamState, RootState> = {
  namespaced: true,
  state: teamInitialState(),
  getters: {
    teamAvatarUrl(state): string {
      return resolveStaticImageUrl((state.teamInfo as Team).avatar);
    },
    serverString(state): string {
      return `connect ${(state.teamInfo as Team).server?.ip}; ${
        (state.teamInfo as Team).server?.password ? `password ${(state.teamInfo as Team).server?.password}` : ''
      }`;
    },
    isManager(state, _getters, rootState): boolean {
      return (state.teamInfo as Team).manager === (rootState.auth.profile as Player)._id;
    },
  },
  actions: {
    async fetchTeamInfo({ commit, dispatch, state, rootState }) {
      const res = await api.team.getTeam();
      if (res.success) {
        commit(SET_TEAM_INFO, res.success);
        trackingService.identify(rootState.auth.profile._id, rootState.auth.profile.name, {
          team: state.teamInfo.name,
        });
        await dispatch('auth/updateStatus', Status.LOGGED_IN_WITH_TEAM, { root: true });
        await dispatch('fetchTeamMembers');
        return { success: res.success };
      } else {
        return { error: res.error };
      }
    },
    async fetchTeamMembers({ commit }) {
      const res = await api.team.getMembersOfTeam();
      if (res.success) {
        commit(SET_TEAM_MEMBERS, res.success);
      }
    },
    async createTeam({ dispatch }, formData: FormData) {
      const res = await api.team.createTeam(formData);
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
        trackingService.track('team:created', { name: formData.get('name') as string });
        return { success: true }; // TODO: probably obsolete. remove
      } else {
        return { error: res.error };
      }
    },
    async updateTeam({ dispatch }, formData: FormData) {
      const res = await api.team.updateTeam(formData);
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
    async joinTeam({ dispatch, rootState }, code: string) {
      const res = await api.team.joinTeam(code);
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
        trackingService.track('team:joined', { name: (rootState.team?.teamInfo as Team)?.name ?? '' });
        return { success: 'Successfully joined team.' };
      } else {
        return { error: res.error };
      }
    },
    async leaveTeam({ dispatch }) {
      const res = await api.team.leaveTeam();
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        dispatch('resetState');
        dispatch('app/showToast', { id: 'team/leaveTeam', text: 'You have left the team' }, { root: true });
        return { success: true };
      } else {
        return { error: res.error };
      }
    },
    async deleteTeam({ dispatch }) {
      const res = await api.team.deleteTeam();
      if (res.success) {
        dispatch('auth/setProfile', res.success, { root: true });
        dispatch('resetState');
        dispatch('app/showToast', { id: 'team/deleteTeam', text: 'Team has been deleted' }, { root: true });
        return { success: true };
      } else {
        return { error: res.error };
      }
    },
    async transferManager({ dispatch, commit }, memberID: string) {
      const res = await api.team.transferManager(memberID);
      if (res.success) {
        commit(SET_TEAM_INFO, res.success);
        dispatch(
          'app/showToast',
          { id: 'team/transferManager', text: 'Leadership successfully transfered' },
          { root: true }
        );
        return { success: true };
      } else {
        return { error: res.error };
      }
    },
    async kickMember({ dispatch }, memberID: string) {
      const res = await api.team.kickMember(memberID);
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
