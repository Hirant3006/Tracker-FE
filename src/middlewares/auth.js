import routerName from '@/constants/routers'
import { types as typesAuth } from '@/modules/auth/constant'
import { types as typesBook } from '@/modules/book/constant'

export default async function ({ next, from, to, router, store, app }) {
    /* check token from store */
    let token = store.getters[typesAuth.getters.GET_TOKEN]
    let profile = store.getters[typesAuth.getters.GET_USER_PROFILE]
    let books = store.state.book.books
    if (token) {
        !profile && await store.dispatch(typesAuth.actions.GET_USER_PROFILE)
        !books && await store.dispatch(typesBook.actions.GET_BOOKS)

        next()
    } else  next({ name: routerName.LOGIN })
}