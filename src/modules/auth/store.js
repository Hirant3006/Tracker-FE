import cookie from 'js-cookie'
import { router } from '@/main.js'
import api from '@/api'
import { _types } from './constant'
import routerName from '@/constants/routers'

const token_name = process.env.VUE_APP_TOKEN_NAME ? process.env.VUE_APP_TOKEN_NAME : 'messent_token'
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
	async [_types.actions.GET_STORE]({ commit }) {
		try {
			let res = await api.getStore();
			let { status, data } = res.data
			if (status) {
				commit(_types.mutations.SET_STORE, data)
			}
			return res
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.LOGIN]({ }, payload) {
		try {
			return await api.login(payload);
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.SHOPIFY_LOGIN]({ }, payload) {
		try {
			return await api.handleUrlShopifyLogin(payload)
		} catch (e) {
			throw e;
		}
	},
	async [_types.actions.LOGOUT]({ commit }) {
		commit(_types.mutations.REMOVE_TOKEN)
		router.push({ name: routerName.INSTALL_APP })
	},
	async [_types.actions.INIT_INTERCOM]({ commit, state }) {
		let res = await api.getIntercom()
		let { status, data } = res.data
		if (status) {
			data = { ...data, alignment: 'right' }
			window.Intercom('update', data)
		}
	},
	[_types.actions.DESTROY_INTERCOM]({ commit }) {
		window.Intercom('shutdown')
	},
	[_types.actions.TOGGLE_SHOW_INTERCOM]({ }) {
		var intercom_on_messager = document.querySelector('.intercom-messenger-frame');
		if (intercom_on_messager == null) {
			window.Intercom('show');
		} else {
			window.Intercom('hide');
		}
	},
	[_types.actions.SHOW_INTERCOM]({ }, payload) {
		if (payload == true) {
			window.Intercom('show');
		} else {
			window.Intercom('hide');
		}
	},
	async getNotification({ commit }, payload) {
		try {
			let res = await api.getNotification(payload);
			let { status, data } = res.data
			if (status) {
			}
			return res
		} catch (error) {
			throw error;
		}
	},
	async markNotification({ }, payload) {
		try {
			let res = await api.markNotification(payload);
			let { status, data } = res.data
			if (status) {
			}
			return res
		} catch (error) {
			throw error;
		}
	},
	async updateStore({ }, payload) {
		try {
			let res = await api.updateStore(payload);
			let { status, data } = res.data
			if (status) {
			}
			return res
		} catch (error) {
			throw error;
		}
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