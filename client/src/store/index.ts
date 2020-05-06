import Vue from 'vue';
import Vuex from 'vuex';
import { Map, Strat, Step, Player } from '@/services/models';
import APIService from '@/services/APIService';

export interface AppState {
	ui: {
		showLoader: boolean,
		loaderText: string
	},
	maps: Map[],
	currentMap: string | null,
	currentStrats: Strat[]
}

const getInitialState = (): AppState => {
	return {
		ui: {
			showLoader: false,
			loaderText: ''
		},
		maps: [],
		currentMap: null,
		currentStrats: []
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
		setStepsOfStrat(state, { strat, steps }) {
			strat.steps = steps;
		}
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
				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		},
		updateCurrentMap({ commit, dispatch }, payload) {
			commit('setCurrentMap', payload);
			dispatch('updateCurrentStrats');
		},
		async updateCurrentStrats({ commit, dispatch }, payload) {
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
			this.state.currentStrats.forEach(async (strat) => {
				try {
					const steps = await APIService.getStepsOfStrat(strat._id);
					console.log(steps);
					commit('setStepsOfStrat', { strat, steps });
				} catch (error) {
					console.error(error);
				}
			});
		},
	},
	getters: {},
	modules: {}
});
