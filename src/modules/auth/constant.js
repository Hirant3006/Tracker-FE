import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
        GET_TOKEN: 'getToken',
        GET_USER_PROFILE: 'getUserProfile',
        GET_USER_ROLE: 'getUserRole',
    },
    actions: {
        LOGIN: 'login',
        LOGOUT: 'logout',
        GET_USER_PROFILE: 'getUserProfile',
        REMOVE_TOKEN: 'removeToken',
    },
    mutations: {
        LOGOUT: 'logout',
        SET_TOKEN: 'setToken',
        REMOVE_TOKEN: 'removeToken',
        SET_STORE: 'setStore',
        SET_USER_PROFILE: 'setUserProfile',
        SET_REFRESH_TOKEN: 'setRefreshToken',
        IS_ADMIN: 'isAdmin'
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.AUTH}/`, _types)