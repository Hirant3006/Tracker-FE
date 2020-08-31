import routerName from '@/constants/routers'
import { types as typesAuth } from '@/modules/auth/constant'

export default async function ({ next, from, to, router, store, app }) {
    /* check token from store */
    let token = store.getters[typesAuth.getters.GET_TOKEN]
    let profile = store.getters[typesAuth.getters.GET_USER_PROFILE]
    if (token) {
        !profile && store.dispatch(typesAuth.actions.GET_USER_PROFILE)
        next()
    } else  next({ name: routerName.LOGIN })
}