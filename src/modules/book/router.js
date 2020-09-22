// import noAuth from './middlewares/notAuth'
import routerName from '@/constants/routers'
import auth from '@/middlewares/auth'

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
					middleware: [auth],
				},
				component: () =>
					import(
						/* webpackChunkName: "install-app" */ "./views/index.vue"
					),
			},
		]
	},
]