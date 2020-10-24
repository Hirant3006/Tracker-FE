import routerName from "@/constants/routers";
import routerModList from "@/constants/routerMod";
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
		
		if (selected_book) {
			await store.dispatch(typesBook.actions.SET_SELECTED_BOOK,selected_book)
		}
		if (!routerModList.includes(to.name) && store.state.auth.profile.role!=='ADMIN') {
			return next({
				path: '/Transaction',
			  });
		} 
		if ((store.state.book.books==null || store.state.book.selected === null || store.state.book.books.length===0) && to.name !== routerName.ONBOARDING) {
			return next({ name: routerName.ONBOARDING });
		} 
		else if (to.name == routerName.ONBOARDING && store.state.book.selected) {
		    return next({name: routerName.DASHBOARD})
		}
		else if ((!store.state.book.selected || store.state.book.books ==null) && to.name!==routerName.ONBOARDING) {

		    return next({name: routerName.ONBOARDING})
		}
		else {
            return next({ name: routerName.TRANSACTION });
        }
	} else next({ name: routerName.LOGIN });
}
