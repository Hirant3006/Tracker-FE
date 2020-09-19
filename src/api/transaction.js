import axios from "@/plugins/axios";

export default {
	get_list_transaction({offset=null}) {
		return axios({
			url: "/transaction/",
			method: "get",
			params: {
				size:10,
				offset
			}
		});
	},
	get_list_transaction_by_book({id,offset=null}) {
		return axios({
			url: "/transaction/book/" + id,
			method: "get",
			params :{
				size:10,
				offset
			}
		});
	},
	get_transaction({id}) {
		return axios({
			url: "/transaction/"+id ,
			method: "GET",
		})
	},
	get_log_transaction({id}) {
		return axios({
			url: "/logging/transaction/"+id ,
			method: "GET",
		})
	},
	insert_transaction(data) {
		return axios({
			url: "/transaction" ,
			method: "post",
			data
		});
	},
	delete_transaction({id}) {
		return axios({
			url: "/transaction/"+id ,
			method: "DELETE",
		})
	},
	edit_transaction(data) {
		return axios({
			url: "/transaction" ,
			method: "PUT",
			data
		});
	}
};
