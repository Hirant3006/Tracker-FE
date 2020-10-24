// import noAuth from './middlewares/notAuth'
import routerName from "@/constants/routers";
import auth from "@/middlewares/auth";
import isMod from '@/middlewares/isMod.js'

export default [
	{
		path: "/employee",
		component: () =>
		import(/* webpackChunkName: "install-app" */ "./views/layout.vue"),
		children: [
			{
				path: "",
				name: routerName.EMPLOYEE,
				meta: {
					middleware: [auth,isMod],
				},
				component: () =>
					import(
						/* webpackChunkName: "install-app" */ "./views/index.vue"
					),
			},
			{
				path: "/employee/create",
				name: routerName.CREATE_EMPLOYEE,
				meta: {
					middleware: [auth,isMod],
				},
				component: () =>
					import(/* webpackChunkName: "auth" */ "./views/create.vue"),
			},
			{
				path: "/employee/detail/:id",
				name: routerName.DETAIL_EMPLOYEE,
				meta: {
					middleware: [auth,isMod],
				},
				component: () =>
					import(/* webpackChunkName: "auth" */ "./views/detail.vue"),
			},
			
		],
	},
];
