import axios from "@/plugins/axios";

export default {
	get_list_transaction({ id }) {
		return axios({
			url: "/transaction/" + id,
			method: "get",
		});
	},
};
