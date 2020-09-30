import { _types } from "./constant";
import api from "@/api";
import cookie from "js-cookie";
const selected_book = "selected_book";

const state = {
	books: null,
	selected: null,
	delete_book: null,
};

const getters = {
	[_types.getters.GET_BOOK_BY_ID]: (state) => (id) => {
		return state.books.filter((item) => item.id === id);
	},
	[_types.getters.GET_SELECTED_BOOK](state) {
		return state.selected !== "all" && typeof state.selected == "string"
			? JSON.parse(state.selected)
			: state.selected;
	},
	[_types.getters.GET_BOOKS](state) {
		return state.books;
	},
};

const actions = {
	async [_types.actions.GET_BOOKS]({ commit }) {
		try {
			const res = await api.get_list_book();
			let { header, data } = res.data;
			if (header.isSuccessful) {
				commit(
					_types.mutations.SET_BOOKS,
					data.filter((item) => !item.isDelete)
				);
				commit(
					_types.mutations.SET_DELETE_BOOKS,
					data.filter((item) => item.isDelete)
				);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.GET_BOOK_BY_ID]({ commit }, payload) {
		try {
			const res = await api.get_book_by_id(payload);
			let { header, data } = res.data;
			if (header.isSuccessful) {
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.DELETE_BOOK]({ commit }, payload) {
		try {
			const res = await api.delete_book(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.RECOVER_BOOK]({ commit }, payload) {
		try {
			const res = await api.recover_book(payload);
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.INSERT_BOOK]({ commit }, payload) {
		console.log('insert')
		try {
			const res = await api.insert_book(payload);
			const { header, data } = res.data;
			if (header.isSuccessful) {
				// commit(_types.mutations.INSERT_BOOK, data);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	[_types.actions.SET_SELECTED_BOOK]({ commit, state }, payload) {
		cookie.set(`${selected_book}`, payload, {
			expires: 1,
		});
		state.selected = payload;
	},
	async [_types.actions.EDIT_BOOK]({ commit, state }, payload) {
		try {
			const res = await api.edit_book(payload);
			const { header, data } = res.data;
			if (header.isSuccessful) {
				if (state.selected.id === data.id) {
					commit(_types.mutations.SET_SELECTED_BOOK, data);
				}
				// commit(_types.mutations.INSERT_BOOK, data);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
};

const mutations = {
	[_types.mutations.SET_SELECTED_BOOK](state, payload = "") {
		cookie.set(`${selected_book}`, payload, {
			expires: 1,
		});
		state.selected = payload;
	},
	[_types.mutations.SET_BOOKS](state, payload = "") {
		state.books = payload;
	},
	[_types.mutations.SET_DELETE_BOOKS](state, payload = "") {
		state.delete_book = payload;
	},
};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
};
