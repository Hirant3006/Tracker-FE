import routerName from "@/constants/routers";
import { types as typesAuth } from "@/modules/auth/constant";
import { types as typesBook } from "@/modules/book/constant";
import cookie from "js-cookie";
const selected_book = "selected_book";
const token_name = process.env.VUE_APP_TOKEN_NAME
	? process.env.VUE_APP_TOKEN_NAME
	: "app_token";

export default async function({ next, from, to, router, store, app }) {
	/* check token from store */
	let token = cookie.get(token_name);
    let selected_book = cookie.get("selected_book");
    selected_book && await store.dispatch(typesBook.actions.SET_SELECTED_BOOK,selected_book)
	if (token) {
		!store.state.book.books &&
			(await store.dispatch(typesBook.actions.GET_BOOKS));
		!store.state.auth.profile &&
            (await store.dispatch(typesAuth.actions.GET_USER_PROFILE));
		if ((store.state.book.books==null || store.state.book.selected === null || store.state.book.books.length===0) && to.name !== routerName.ONBOARDING) {
			next({ name: routerName.ONBOARDING });
		} else {
            next({ name: routerName.TRANSACTION });
        }
		// if (selected_book) {
		//     await store.dispatch(typesBook.actions.SET_SELECTED_BOOK,selected_book)
		// }
		// if (to.name == routerName.ONBOARDING && store.state.book.selected) {
		//     next({name: routerName.DASHBOARD})
		// }
		// else if ((!store.state.book.selected || store.state.book.books ==null) && to.name!==routerName.ONBOARDING) {

		//     next({name: routerName.ONBOARDING})
		// }
		// else next()
	} else next({ name: routerName.LOGIN });
}
