import { _types } from "./constant";
import api from "@/api";

const state = {
	transactions: 'hgell'
};

const getters = {

};

const actions = {
	async [_types.actions.GET_TRANSACTIONS]({ commit },payload) {
		try {
			const res = await api.get_list_transaction(payload);
			let { header, data } = res.data;
			if (header.isSuccessful) {
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_TRANSACTIONS_BY_BOOK]({ commit },payload) {
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
};

const mutations = {
};

export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
};
