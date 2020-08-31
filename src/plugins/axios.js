import cookie from "js-cookie";
import router from "@/router";
import { default as instance } from "axios";
import routerName from "@/constants/routers";
import api from "@/api";
const token_name = process.env.VUE_APP_TOKEN_NAME
	? process.env.VUE_APP_TOKEN_NAME
	: "app_token";

let AxiosConfig = {
	baseURL: process.env.VUE_APP_ROOT_API,
	timeout: 60 * 1000,
	validateStatus: function(status) {
		return status >= 200 && status <= 500;
	},
};


let axios = instance.create(AxiosConfig);
axios.CancelToken = instance.CancelToken;
axios.isCancel = instance.isCancel;
axios.interceptors.request.use(function(config) {
	// config.headers['AppID'] = 'origin_app'
	let token = cookie.get(token_name);
	if (token) {
		config.headers["TOKEN"] = `${token}`;
	}
	config.headers["Content-Type"] = "application/json";
	// let lang = cookie.get('origin_app_language')
	// config.headers['Language'] = lang ? lang : 'en'
	return config;
});

axios.interceptors.response.use(
	async function(res) {
		let { header, data, config } = res.data;

		handleHttpError(header.resultCode, data);

		// Check đã refresh token hay chưa?
		if (
			res.config.url !== "/authentication/refresh-token" &&
			header.resultCode == 1043
		) {
			cookie.remove(`${token_name}`);
			const refresh_token_data = await api.refresh_token();
			const { header, data } = refresh_token_data.data;
			if (header.isSuccessful) {
				cookie.set(`${token_name}`, data.token, {
					expires: 7,
				});
			}
			config.headers["TOKEN"] = `${token}`;
			config.headers["Content-Type"] = "application/json";
			res = await axios.request(config);
		}

		// console.log()

		// TokenStorage.getNewToken()
		// 	.then((token) => {
		// 		// New request with new token
		// 		const config = error.config;
		// 		config.headers["TOKEN"] = `${token}`;

		// 		return new Promise((resolve, reject) => {
		// 			axios
		// 				.request(config)
		// 				.then((response) => {
		// 					resolve(response);
		// 				})
		// 				.catch((error) => {
		// 					reject(error);
		// 				});
		// 		});
		// 	})

		return res;
	},
	function(error) {
		console.log(error);
		// if (error.response.status !== 401) {
		// 	return new Promise((resolve, reject) => {
		// 		reject(error);
		// 	});
		// }

		// // Logout user if token refresh didn't work or user is disabled
		// if (
		// 	error.config.url == "/api/token/refresh" ||
		// 	error.response.message == "Account is disabled."
		// ) {
		// 	TokenStorage.clear();
		// 	router.push({ name: "root" });

		// 	return new Promise((resolve, reject) => {
		// 		reject(error);
		// 	});
		// }

		// // Try request again with new token
		// return TokenStorage.getNewToken()
		// 	.then((token) => {
		// 		// New request with new token
		// 		const config = error.config;
		// 		config.headers["TOKEN"] = `${token}`;

		// 		return new Promise((resolve, reject) => {
		// 			axios
		// 				.request(config)
		// 				.then((response) => {
		// 					resolve(response);
		// 				})
		// 				.catch((error) => {
		// 					reject(error);
		// 				});
		// 		});
		// 	})
		// 	.catch((error) => {
		// 		Promise.reject(error);
		// 	});
	}
);

function handleHttpError(status, data) {
	if (status) {
		switch (status) {
			case 500:
				console.log("error Internal Server Error 500");
				if (data.sentryId) {
					router.push({ name: routerName.ERROR_500 });
				} else {
					router.push({ name: routerName.LOGIN });
				}
				break;
			case 404:
				console.log("error Not Found 404");
				// router.push({ name: routerName.ERROR_404 })
				break;
			case 400:
				console.log("error Bad Request 400");
				break;
			case 401:
				console.log("error Unauthorized 401");
				router.push({ name: routerName.INSTALL_APP });
				break;
			case 403:
				console.log("error Forbidden 403");
				break;
		}
	}
}

export default axios;
