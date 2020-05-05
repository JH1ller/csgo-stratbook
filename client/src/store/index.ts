import Vue from 'vue';
import Vuex from 'vuex';

const getInitialState = () => {
	return {
		ui: {
			showLoader: false,
			loaderText: ''
		},
		maps: []
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
		updateMaps({ commit }, payload) {
			commit('updateMaps', payload);
			return true;
		},
	},
	getters: {},
	modules: {}
});
