import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
    },
    actions: {
        GET_TRANSACTIONS: 'getTransactions',
        GET_TRANSACTIONS_BY_BOOK: 'getTransactionsByBook',
        INSERT_TRANSACTION: 'insertTransaction'
    },
    mutations: {
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.TRANSACTIONS}/`, _types)