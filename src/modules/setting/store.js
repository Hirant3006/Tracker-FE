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
	async [_types.actions.CHANGE_INFO]({ commit }, payload) {
		try {
			const res = await api.change_info_user(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.CHANGE_PASSWORD]({ commit }, payload) {
		try {
			const res = await api.change_password(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_NOTIFICATION_SETTING]({ commit }, payload) {
		try {
			const res = await api.get_notification_setting();
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.UPDATE_NOTIFICATION_SETTING]({ commit }, payload) {
		try {
			const res = await api.update_notification_setting(payload);
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
