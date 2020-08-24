import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
        GET_STORE: 'getStore',
        GET_TOKEN: 'getToken',
        GET_USER_TYPE: 'getUserType',
        IS_ADMIN: 'isAdmin'
    },
    actions: {
        GET_STORE: 'getStore',
        LOGIN: 'login',
        SHOPIFY_LOGIN: 'shopifyLogin',
        LOGOUT: 'logout',
        INIT_INTERCOM: 'initIntercom',
        DESTROY_INTERCOM: 'destroyIntercom',
        TOGGLE_SHOW_INTERCOM: 'toggleShowIntercom',
        SHOW_INTERCOM: 'showIntercom',
        UPDATE_STORE: 'updateStore',
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