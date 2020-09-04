import { _types } from "./constant";
import api from "@/api";

const state = {
	books: null,
	selected: null,
};

const getters = {
	[_types.getters.GET_BOOK_BY_ID]: (state) => (id) => {
		return state.books.filter((item) => item.id === id);
	},
	[_types.getters.GET_SELECTED_BOOK](state) {
		return state.selected;
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
				console.log(data);
				data = data.filter(item => !item.isDelete)
				console.log('book ',data)
				if (data.length!==0) commit(_types.mutations.SET_BOOKS, data);
			}
			return res;
		} catch (error) {
			throw error;
		}
	},
	async [_types.actions.INSERT_BOOK]({ commit }, payload) {
		try {
			const res = await api.insert_book(payload);
			const { header, data } = res.data;
			if (header.isSuccessful) {
				console.log(data);
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
		state.selected = payload;
	},
	[_types.mutations.SET_BOOKS](state, payload = "") {
		state.books = payload;
	},
};
export default {
	state,
	actions,
	mutations,
	getters,
	namespaced: true,
};
