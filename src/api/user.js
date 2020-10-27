import axios from "@/plugins/axios";

export default {
	get_list_user({ offset = null, title, includeAdmin, name, bookID }) {
		return axios({
			url: "/user",
			method: "get",
			params: {
				size: 10,
				offset,
				title,
				includeAdmin,
				name,
				bookId: bookID,
			},
		});
	},
	get_user({ id }) {
		return axios({
			url: "/user/" + id,
			method: "GET",
		});
	},
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
		console.log("delete api");
		return axios({
			url: "/user/" + id,
			method: "DELETE",
		});
	},
	edit_user(data) {
		return axios({
			url: "/user",
			method: "PUT",
			data,
		});
	},
	active_user({ id }) {
		return axios({
			url: "/user/" + id + "/activate",
			method: "PATCH",
		});
	},
	deactive_user({ id }) {
		return axios({
			url: "/user/" + id + "/deactivate",
			method: "PATCH",
		});
	},
	change_info_user(data) {
		return axios({
			url: "/profile",
			method: "PUT",
			data,
		});
	},
	change_password(data) {
		return axios({
			url: "/profile/password",
			method: "PATCH",
			data,
		});
	},
};
