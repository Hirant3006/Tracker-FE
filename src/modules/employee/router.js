// import noAuth from './middlewares/notAuth'
import routerName from "@/constants/routers";
import auth from "@/middlewares/auth";

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
					middleware: [auth],
				},
				component: () =>
					import(
						/* webpackChunkName: "install-app" */ "./views/index.vue"
					),
			},
			{
				path: "create",
				name: routerName.CREATE_EMPLOYEE,
				meta: {
					middleware: [auth],
				},
				component: () =>
					import(/* webpackChunkName: "auth" */ "./views/create.vue"),
			},
			{
				path: "/detail/:id",
				name: routerName.DETAIL_EMPLOYEE,
				meta: {
					middleware: [auth],
				},
				component: () =>
					import(/* webpackChunkName: "auth" */ "./views/detail.vue"),
			},
			
		],
	},
];
