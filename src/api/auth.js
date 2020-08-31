import axios from "@/plugins/axios";

export default {
	login(data) {
		return axios({
			url: "/authentication",
			method: "post",
			data,
		});
	},
	refresh_token() {
		return axios({
			url: "/authentication/refresh-token",
			method: "get",
		});
	},
	get_user_profile() {
		return axios({
			url: "/profile",
			method: "get",
		})
	}
};
