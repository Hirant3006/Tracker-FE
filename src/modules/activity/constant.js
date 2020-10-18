import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
    },
    actions: {
        GET_CHECK_NEW_LOG: 'getCheckNewLog',
        GET_LOG: 'getLog',
    },
    mutations: {
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.ACTIVITY}/`, _types)