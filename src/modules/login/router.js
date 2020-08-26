import noAuth from './middlewares/notAuth'
import routerName from '@/constants/routers'

export default [
	{
		path: '/login',
		name: routerName.LOGIN,
		meta: {
			layout: 'login',
			middleware: [noAuth]
		},
		component: () => import( /* webpackChunkName: "install-app" */ './views/index.vue'),
	},
]