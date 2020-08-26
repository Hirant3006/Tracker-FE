import routerName from '@/constants/routers'
import { types as typesAuth } from '@/modules/auth/constant'

export default async function ({ next, from, to, router, store, app }) {
    /* check token from store */
    let token = store.getters[typesAuth.getters.GET_TOKEN]

    console.log('Token', token)
    if (token) {

    } else next({ name: routerName.LOGIN })
}