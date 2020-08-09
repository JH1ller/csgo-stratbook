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
          ? `http://localhost:3000/public/upload/${
              (state.teamInfo as Team).avatar
            }`
          : `https://csgo-stratbook.s3.amazonaws.com/${
              (state.teamInfo as Team).avatar
            }`;
      } else {
        return require('@/assets/images/default.jpg');
      }
    },
    connectionString(state) {
      return `connect ${(state.teamInfo as Team).server?.ip}; ${
        (state.teamInfo as Team).server?.password
          ? `password ${(state.teamInfo as Team).server?.password}`
          : ''
      }`;
    },
  },
  actions: {
    async fetchTeamInfo({ commit, rootState, dispatch }) {
      try {
        if (rootState.auth.profile) {
          dispatch('app/showLoader', null, { root: true });
          const teamInfo = await APIService.getTeamOfPlayer(
            (rootState.auth.profile as Player)._id
          );
          dispatch('auth/updateStatus', Status.LOGGED_IN_WITH_TEAM, {
            root: true,
          });
          commit(SET_TEAM_INFO, teamInfo);
          await dispatch('fetchTeamMembers');
          dispatch('app/hideLoader', null, { root: true });
          return teamInfo;
        } else {
          throw new Error(
            'Cannot retrieve team because user is not logged in.'
          );
        }
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        throw new Error(error);
      }
    },
    async fetchTeamMembers({ commit, state, dispatch }) {
      try {
        if (state.teamInfo) {
          dispatch('app/showLoader', null, { root: true });
          const members = await APIService.getMembersOfTeam(
            (state.teamInfo as Team)._id
          );
          commit(SET_TEAM_MEMBERS, members);
          dispatch('app/hideLoader', null, { root: true });
          return members;
        } else {
          throw new Error('Cannot retrieve members because team is not set.');
        }
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        throw new Error(error);
      }
    },
    async createTeam({ commit, dispatch }, formData: TeamCreateFormData) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.createTeam(formData);
        dispatch('app/hideLoader', null, { root: true });
        if (res.team) {
          await dispatch('auth/updatePlayer', res.team._id, { root: true }); // TODO: auto join team auf team create on server side
          return {
            success:
              'Team successfully created. You can now visit the strats page and start creating strats!',
          };
        }
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        return { error: error };
      }
    },
    async joinTeam({ dispatch }, code: string) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.joinTeam(code);
        dispatch('app/showToast', 'Successfully joined team.', { root: true });
        dispatch('app/hideLoader', null, { root: true });
        return {
          success: 'Successfully joined team.',
        };
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        return { error: error };
      }
    },
    async leaveTeam({ dispatch }) {
      try {
        dispatch('app/showLoader', null, { root: true });
        const res = await APIService.leaveTeam();
        await dispatch('fetchProfile');
        dispatch('app/showToast', 'Successfully left team.', { root: true });
        dispatch('app/hideLoader', null, { root: true });
        return {
          success: 'Successfully left team.',
        };
      } catch (error) {
        dispatch('app/hideLoader', null, { root: true });
        return { error: error };
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
