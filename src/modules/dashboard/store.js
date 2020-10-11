import { _types } from "./constant";
import api from "@/api";
const state = {};

const getters = {};

const actions = {
	async [_types.actions.GET_STATISTIC]({ commit }, payload) {
		try {
			const res = await api.get_statistic(payload);
			let { header, data } = res.data;
			if (header.isSuccessful) {
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_STATISTIC_SUMMARY]({ commit }, payload) {
		try {
			const res = await api.get_statistic_summary(payload);
			let { header, data } = res.data;
			if (header.isSuccessful) {
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
