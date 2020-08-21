// import noAuth from './middlewares/notAuth'
import routerName from '@/constants/routers'

export default [
	{
		path: '/',
		name: routerName.DASHBOARD,
		meta: {
			layout : 'default'
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