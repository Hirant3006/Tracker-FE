import routerName from "@/constants/routers";
import routerNameMod from "@/constants/routersMod";
export default async function({ next, from, to, router, store, app }) {
  /* check token from store */ 
  console.log('hello')
  if (
    store.state.auth.profile.role !== "ADMIN" &&
    !routerNameMod.includes(to.name)
  ) {
    console.log("hello2");
    next({ name: routerName.TRANSACTION });
    return;
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
  } else next();
}
