import axios from "@/plugins/axios";

export default {
	get_notification_setting() {
		return axios({
			url: "/notification",
			method: "GET",
		});
	},
	update_notification_setting(data) {
		return axios({
			url: "/notification",
            method: "PUT",
            data
		});
	},
};
