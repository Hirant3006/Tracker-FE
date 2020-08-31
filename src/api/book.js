import axios from "@/plugins/axios";

export default {
	get_list_book() {
		return axios({
			url: "/book" ,
			method: "get",
		});
	},
};
