import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
        GET_BOOK_BY_ID: 'getBookById',
        GET_SELECTED_BOOK: 'getSelectedBook',
    },
    actions: {
        GET_BOOKS: 'getBooks',
    },
    mutations: {
        SET_SELECTED_BOOK: 'setSelectedBook',
        SET_BOOKS: 'setBooks'
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.BOOK}/`, _types)