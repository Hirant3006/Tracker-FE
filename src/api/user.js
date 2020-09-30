import axios from "@/plugins/axios";

export default {
	get_list_user({ offset = null, title, includeAdmin, name, bookId }) {
		return axios({
			url: "/user",
			method: "get",
			params: {
				size: 10,
				offset,
				title,
				includeAdmin,
				name,
				bookId,
			},
		});
	},
	// get_transaction({ id }) {
	// 	return axios({
	// 		url: "/transaction/" + id,
	// 		method: "GET",
	// 	});
	// },
	// get_log_transaction({ id }) {
	// 	return axios({
	// 		url: "/logging/transaction/" + id,
	// 		method: "GET",
	// 	});
	// },
	insert_user(data) {
		return axios({
			url: "/user",
			method: "post",
			data,
		});
	},
	delete_user({ id }) {
		console.log('delete api')
		return axios({
			url: "/user/" + id,
			method: "DELETE",
		});
	},
	// edit_transaction(data) {
	// 	return axios({
	// 		url: "/transaction",
	// 		method: "PUT",
	// 		data,
	// 	});
	// },
};
