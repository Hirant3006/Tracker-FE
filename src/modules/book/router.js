// import noAuth from './middlewares/notAuth'
import routerName from '@/constants/routers'
import auth from '@/middlewares/auth'
import isMod from '@/middlewares/isMod'

export default [
	{
		path: "/book",
		component: () =>
			import(/* webpackChunkName: "install-app" */ "./views/layout.vue"),
		children: [
			{
				path: "",
				name: routerName.BOOK,
				meta: {
					middleware: [auth,isMod],
				},
				component: () =>
					import(
						/* webpackChunkName: "install-app" */ "./views/index.vue"
					),
			},
			{
				path: "/create",
				name: routerName.CREATE_BOOK,
				meta: {
					middleware: [auth,isMod],
				},
				component: () =>
					import(
						/* webpackChunkName: "install-app" */ "./views/create.vue"
					),
			},
		]
	},
]