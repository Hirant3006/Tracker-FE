import prefixNamespace from '@/utils/prefix-namespace'
import { storeKeyNameSpace } from '@/constants/stores'

export const _types = {
    getters: {
    },
    actions: {
        GET_STATISTIC: 'getStatistic',
        CHANGE_INFO: 'changeInfo',
        CHANGE_PASSWORD: 'changePassword',
        GET_NOTIFICATION_SETTING: 'getNotificationSetting',
        UPDATE_NOTIFICATION_SETTING: 'updateNotificationSetting'
    },
    mutations: {
    }
}

export const types = prefixNamespace(`${storeKeyNameSpace.DASHBOARD}/`, _types)