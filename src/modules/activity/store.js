import { _types } from "./constant";
import api from "@/api";
const state = {
	isNewLog: false
};

const getters = {};

const actions = {
	async [_types.actions.GET_CHECK_NEW_LOG]({ commit,state }, payload) {
		try {
			const res = await api.get_check_new_log();
			let { header, data } = res.data;
			if (header.isSuccessful) {
				state.isNewLog = data
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_LOG]({ commit }, payload) {
		try {
			const res = await api.get_log();
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
