// import noAuth from './middlewares/notAuth'
import routerName from '@/constants/routers'
import auth from '@/middlewares/auth'

export default [
	{
		path: '/setting',
		name: routerName.SETTING,
		meta: {
			layout: 'default',
			middleware: [auth]
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