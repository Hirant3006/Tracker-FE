import axios from "@/plugins/axios";

export default {
	get_list_transaction({limit=10,offset=null}) {
		return axios({
			url: "/transaction/",
			method: "get",
			params: {
				limit,
				offset
			}
		});
	},
	get_list_transaction_by_book({id,limit=10,offset=null}) {
		return axios({
			url: "/transaction/book/" + id,
			method: "get",
			params :{
				limit,
				offset
			}
		});
	},
};
