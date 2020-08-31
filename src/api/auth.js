import axios from "@/plugins/axios";
import cookie from "js-cookie";

export default {
	login(data) {
		return axios({
			url: "/authentication",
			method: "post",
			data,
		});
	},
	refresh_token() {
		let refresh_token = cookie.get('refresh_token');
		return axios({
			url: "/authentication/refresh-token",
			method: "get",
			headers: {
				'REFRESH_TOKEN': refresh_token,
			},
		});
	},
	get_user_profile() {
		return axios({
			url: "/profile",
			method: "get",
		})
	}
};
