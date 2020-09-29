import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
    },
    actions: {
        GET_TRANSACTIONS: 'getTransactions',
        GET_TRANSACTIONS_BY_BOOK: 'getTransactionsByBook',
        INSERT_TRANSACTION: 'insertTransaction',
        GET_TRANSACTION: 'getTransaction',
        EDIT_TRANSACTION: 'editTransaction',
        GET_LOG_TRANSACTION: 'getLogTransaction',
        DELETE_TRANSACTIONS: 'deleteTransaction',
    },
    mutations: {
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.EMPLOYEE}/`, _types)