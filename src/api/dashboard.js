import axios from "@/plugins/axios";

export default {
	get_statistic(data) {
		return axios({
			url: "/statistic/income-expense",
			method: "get",
			params: data,
		});
	},
};
