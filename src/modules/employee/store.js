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
	async [_types.actions.GET_TRANSACTION]({ commit }, payload) {
		try {
			const res = await api.get_transaction(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_LOG_TRANSACTION]({ commit }, payload) {
		try {
			const res = await api.get_log_transaction(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.DELETE_TRANSACTIONS]({ commit }, payload) {
		try {
			const res = await api.delete_transaction(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_TRANSACTIONS_BY_BOOK]({ commit }, payload) {
		try {
			const res = await api.get_list_transaction_by_book(payload);
			let { header, data } = res.data;
			if (header.isSuccessful) {
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.INSERT_TRANSACTION]({ commit }, payload) {
		try {
			const res = await api.insert_transaction(payload);
			const { header, data } = res.data;
			if (header.isSuccessful) {
				// commit(_types.mutations.INSERT_BOOK, data);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.EDIT_TRANSACTION]({ commit }, payload) {
		try {
			const res = await api.edit_transaction(payload);
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
