import store from '@/store'
import router from '@/router'
import moduleStore  from './store'
import moduleRouter from './router'
// import './i18n'
import { storeKeyNameSpace } from '@/constants/stores'

const STORE_KEY = storeKeyNameSpace.SETTING

/* register module store */
if (!(STORE_KEY in store._modules.root._children)) {
	store.registerModule(STORE_KEY, moduleStore);
}
/* register module router */
router.addRoutes(moduleRouter)