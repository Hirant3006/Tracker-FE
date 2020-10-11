import axios from "@/plugins/axios";

export default {
	get_statistic(data) {
		return axios({
			url: "/statistic/income-expense",
			method: "get",
			params: data,
		});
	},
	get_statistic_summary(data) {
		return axios({
			url: "/statistic/income-expense/summary",
			method: "get",
			params: data,
		});
	},
};
