import axios from "@/plugins/axios";

export default {
	get_list_book() {
		return axios({
			url: "/book",
			method: "get",
		});
	},
	get_book_by_id({ id }) {
		return axios({
			url: "/book/" + id,
			method: "get",
		});
	},
	insert_book(data) {
		return axios({
			url: "/book",
			method: "post",
			data
		});
	},
	delete_book({ id }) {
		return axios({
			url: "/book/" + id,
			method: "DELETE",
		});
	},
	edit_book(data) {
		return axios({
			url: "/book/",
			method: "PUT",
			data
		});
	},
	recover_book({ id }) {
		return axios({
			url: "/book/"+id+'/recover',
			method: "PUT",
		});
	},
};
