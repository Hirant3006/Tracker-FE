import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
        GET_TOKEN: 'getToken',
    },
    actions: {
        LOGIN: 'login',
        LOGOUT: 'logout',
    },
    mutations: {
        LOGOUT: 'logout',
        SET_TOKEN: 'setToken',
        REMOVE_TOKEN: 'removeToken',
        SET_STORE: 'setStore',
        SET_USER_TYPE: 'setUserType',
        IS_ADMIN: 'isAdmin'
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.AUTH}/`, _types)