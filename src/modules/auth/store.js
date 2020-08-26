import cookie from 'js-cookie'
import { router } from '@/main.js'
import api from '@/api'
import { _types } from './constant'
import routerName from '@/constants/routers'

const token_name = process.env.VUE_APP_TOKEN_NAME ? process.env.VUE_APP_TOKEN_NAME : 'app_token'
const state = {
	token: cookie.get(token_name),
	store: null,
	userType: '',
	admin: false
};

const getters = {
	[_types.getters.GET_STORE](state) {
		return state.store
	},
	[_types.getters.GET_TOKEN](state) {
		return state.token
	},
	[_types.getters.GET_USER_TYPE](state) {
		return state.userType
	},
	[_types.getters.IS_ADMIN](state) {
		return state.admin
	},
};

const actions = {
	async [_types.actions.LOGIN]({commit}, payload) {
		try {
			return await api.login(payload);

		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.LOGOUT]({ commit }) {
		commit(_types.mutations.REMOVE_TOKEN)
		router.push({ name: routerName.INSTALL_APP })
	},
};

const mutations = {
	[_types.mutations.LOGOUT](state) {
		state.token = ''
		cookie.remove(`${token_name}`)
		state.store = null
	},
	[_types.mutations.SET_TOKEN](state, payload = '') {
		state.token = payload
		cookie.set(`${token_name}`, payload, {
			expires: 7
		})
	},
	[_types.mutations.REMOVE_TOKEN](state) {
		state.token = ''
		cookie.remove(`${token_name}`)
	},
	[_types.mutations.SET_STORE](state, payload = null) {
		state.store = payload
	},
	[_types.mutations.SET_USER_TYPE](state, payload = '') {
		state.userType = payload
	},
	[_types.mutations.IS_ADMIN](state, payload = false) {
		state.admin = payload
	},
};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
};