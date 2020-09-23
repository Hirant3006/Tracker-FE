import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
        GET_BOOK_BY_ID: 'getBookById',
        GET_SELECTED_BOOK: 'getSelectedBook',
        GET_BOOKS: 'getBooks',
    },
    actions: {
        GET_BOOKS: 'getBooks',
        GET_BOOK_BY_ID: 'getBookById',
        INSERT_BOOK: 'insertBook',
        SET_SELECTED_BOOK: 'setSelectedBook',
    },
    mutations: {
        SET_SELECTED_BOOK: 'setSelectedBook',
        SET_BOOKS: 'setBooks'
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.BOOK}/`, _types)