import store from '@/store'
import moduleStore  from './store'
import { storeKeyNameSpace } from '@/constants/stores'

const STORE_KEY = storeKeyNameSpace.AUTH

/* register module store */
if (!(STORE_KEY in store._modules.root._children)) {
	store.registerModule(STORE_KEY, moduleStore);
}