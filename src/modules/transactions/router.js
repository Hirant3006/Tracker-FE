// import noAuth from './middlewares/notAuth'
import routerName from "@/constants/routers";
import auth from "@/middlewares/auth";

export default [
	{
		path: "/",
		component: () =>
		import(/* webpackChunkName: "install-app" */ "./views/layout.vue"),
		children: [
			{
				path: "",
				name: routerName.TRANSACTIONS,
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
				name: routerName.CREATE_TRANSACTION,
				meta: {
					middleware: [auth],
				},
				component: () =>
					import(/* webpackChunkName: "auth" */ "./views/create.vue"),
			},
		],
	},
];
