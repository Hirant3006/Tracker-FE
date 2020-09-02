import { _types } from './constant'
import api from '@/api'

const state = {
    books: [],
    selected: null,
};

const getters = {
    [_types.getters.GET_BOOK_BY_ID]: (state) => (id) => {
        return state.books.filter(item => item.id === id)
    },
    [_types.getters.GET_SELECTED_BOOK](state) {
    	return state.selected
    },
};

const actions = {
    async [_types.actions.GET_BOOKS]({ commit }) {
        try {
            const res = await api.get_list_book();
            const { header, data } = res.data
            if (header.isSuccessful) {
                console.log(data)
                commit(_types.mutations.SET_BOOKS, data)
            }
            return res
        } catch (error) {
            throw error;
        }
    },
};

const mutations = {
    [_types.mutations.SET_SELECTED_BOOK](state, payload = '') {
        state.selected = payload
    },
    [_types.mutations.SET_BOOKS](state, payload = '') {
        state.books = payload
    },
};
export default {
    state,
    actions,
    mutations,
    getters,
    namespaced: true,
};