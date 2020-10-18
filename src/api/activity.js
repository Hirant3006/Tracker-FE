import axios from "@/plugins/axios";

export default {
	get_check_new_log() {
		return axios({
			url: "/logging/check",
			method: "GET",
		});
	},
	get_log() {
		return axios({
			url: "/logging",
            method: "get",
		});
	},
};
