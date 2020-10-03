import { _types } from "./constant";
import api from "@/api";

const state = {};

const getters = {};

const actions = {
	async [_types.actions.GET_USERS]({ commit }, payload) {
		console.log('hello')
		try {
			const res = await api.get_list_user(payload);
			let { header, data } = res.data;
			if (header.isSuccessful) {
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_USER]({ commit }, payload) {
		try {
			const res = await api.get_user(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.DELETE_USER]({ commit }, payload) {
		console.log('delete')
		try {
			const res = await api.delete_user(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.INSERT_USER]({ commit }, payload) {
		console.log('insert')
		try {
			const res = await api.insert_user(payload);
			const { header, data } = res.data;
			if (header.isSuccessful) {
				// commit(_types.mutations.INSERT_BOOK, data);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.EDIT_USER]({ commit }, payload) {
		console.log(payload)
		try {
			const res = await api.edit_user(payload);
			const { header, data } = res.data;
			if (header.isSuccessful) {
				// commit(_types.mutations.INSERT_BOOK, data);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
};

const mutations = {};

export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
};
