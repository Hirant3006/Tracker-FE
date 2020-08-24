import Vue from 'vue'
import Vuex from 'vuex'
import cookie from 'js-cookie'

Vue.use(Vuex)

const state = {
	isLoading : false,
	isRouterLoading: false,
	isError : false,
}

const getters = {
    getLoading(state){
        return state.isLoading
	},
	getError(state){
		return state.isError
	},
	getRouterLoading(state){
		return state.isRouterLoading
	},
	getLanguage(state){
		return state.language
	},
};

const actions = {
};

const mutations = {
  setLoading(state , payload ){
        state.isLoading = payload
	},
	setError(state, payload){
		state.isError = payload
	},
	setRouterLoading(state , payload ){
        state.isRouterLoading = payload
	},
	setLanguage(state , payload){
		state.language = payload
	}
};
export default new Vuex.Store({
    state,
    actions,
    getters,
    mutations,
});