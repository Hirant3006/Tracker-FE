import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
    },
    actions: {
        GET_USERS: 'getUsers',
        GET_USER: 'getUser',
        INSERT_USER: 'insertUser',
        EDIT_USER: 'editUser',
        DELETE_USER: 'deleteUser',
    },
    mutations: {
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.EMPLOYEE}/`, _types)