import { types } from './../../auth/constant'
import routerName from '@/constants/routers'

export default function ({ next, router , store }) {
	if (store.getters[types.getters.GET_TOKEN]) {
		next({ name : routerName.CAMPAIGNS})
		return false
	}
	return true
}
