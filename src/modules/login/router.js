// import noAuth from './middlewares/notAuth'
import routerName from '@/constants/routers'

export default [
	{
		path: '/login',
		name: routerName.LOGIN,
		meta: {
			layout : 'login'
		},
		component: () => import( /* webpackChunkName: "install-app" */ './views/index.vue'),
		// children : [
		// 	{
		// 		path: '',
		// 		name: 'InstallApp',
		// 		meta: {
		// 			layout : 'install-app',
		// 			middleware : [ noAuth ]
		// 		},
		// 		component: () => import( /* webpackChunkName: "auth" */ './views/index.vue')
		// 	},
		// ]
	},
]