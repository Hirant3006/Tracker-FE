import cookie from 'js-cookie'
import { router } from '@/main.js'
import api from '@/api'
import { _types } from './constant'
import { types as typesBook } from '@/modules/book/constant'
import routerName from '@/constants/routers'
const token_name = process.env.VUE_APP_TOKEN_NAME ? process.env.VUE_APP_TOKEN_NAME : 'app_token'
const refresh_token = 'refresh_token'
const state = {
	token: cookie.get(token_name),
	profile: null,
	refresh_token: null,
};
const role = {
	admin: 'ADMIN',
	mod: 'MODERATOR'
}

const getters = {
	[_types.getters.GET_TOKEN](state) {
		return state.token
	},
	[_types.getters.GET_USER_PROFILE](state) {
		return state.profile
	},
	[_types.getters.IS_ADMIN](state) {
		return state.admin
	},
	[_types.getters.GET_USER_ROLE](state) {
		return state.profile && state.profile.role
	},

};

const actions = {
	async [_types.actions.LOGIN]({ dispatch, commit, getters, rootState }, payload) {
		try {
			const res = await api.login(payload);
			const { header, data } = res.data
			if (header.isSuccessful) {
				commit(_types.mutations.SET_TOKEN, data.token)
				commit(_types.mutations.SET_REFRESH_TOKEN, data.refreshToken)
				// await dispatch(_types.actions.GET_USER_PROFILE)
				// await dispatch('book/getBooks', null, { root: true })
				// const profileRole = getters[_types.getters.GET_USER_ROLE]
				// const books = rootState.book.books
				// if (books.length === 0 || profileRole === role.mod) {
				// 	router.push({ name: routerName.ONBOARDING })
				// 	return res
				// }
				router.go()
			}
			return res
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.LOGOUT]({ commit }) {
		commit(_types.mutations.REMOVE_TOKEN)
		router.go({ name: routerName.LOGIN })
	},
	async [_types.actions.GET_USER_PROFILE]({ commit }) {
		try {
			const res = await api.get_user_profile();
			const { header, data } = res.data
			if (header.isSuccessful) {
				commit(_types.mutations.SET_USER_PROFILE, data)
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
		cookie.remove(`selected_book`)
		state.store = null
	},
	[_types.mutations.SET_TOKEN](state, payload = '') {
		state.token = payload
		cookie.set(`${token_name}`, payload, {
			expires: 1
		})
	},
	[_types.mutations.SET_REFRESH_TOKEN](state, payload = '') {
		state.refresh_token = payload
		cookie.set(`${refresh_token}`, payload, {
			expires: 1
		})
	},
	[_types.mutations.REMOVE_TOKEN](state) {
		state.token = ''
		cookie.remove(`${token_name}`)
		cookie.remove(`${refresh_token}`)
		cookie.remove(`selected_book`)
	
	},
	[_types.mutations.SET_USER_PROFILE](state, payload = '') {
		state.profile = payload
	},
};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
};