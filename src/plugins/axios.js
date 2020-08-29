import cookie from 'js-cookie'
import router from '@/router'
import { default as instance } from 'axios'
import routerName from '@/constants/routers'
const token_name = process.env.VUE_APP_TOKEN_NAME ? process.env.VUE_APP_TOKEN_NAME : 'app_token'

let AxiosConfig = {
	baseURL: process.env.VUE_APP_ROOT_API,
	timeout: 60 * 1000,
	validateStatus: function (status) {
		return status >= 200 && status <= 500 ;
	},
};
console.log(AxiosConfig.baseURL)
let axios = instance.create(AxiosConfig);
axios.CancelToken = instance.CancelToken;
axios.isCancel = instance.isCancel;
axios.interceptors.request.use(function (config) {
	// config.headers['AppID'] = 'origin_app'
	let token = cookie.get(token_name)
	if( token ){
		config.headers['Authorization'] = `Bearer ${token}`
	} 
	config.headers['Content-Type'] = 'application/json'
	// let lang = cookie.get('origin_app_language') 
	// config.headers['Language'] = lang ? lang : 'en'
    return config;
});

axios.interceptors.response.use(function (res) {
	let { status, data } = res 

	handleHttpError(status, data)
	
    return res;
}, function (error ) {
    return Promise.reject(error);
});

function handleHttpError(status, data){
	if(status){
		switch(status){
			case 500:
				console.log("error Internal Server Error 500")
				if(data.sentryId){
					router.push({name: routerName.ERROR_500})
				}else{
					router.push({ name: routerName.LOGIN })
				}
				break;
			case 404: 
				console.log("error Not Found 404")
				// router.push({ name: routerName.ERROR_404 })
				break;
			case 400: 
				console.log("error Bad Request 400")
				break;
			case 401: 
				console.log("error Unauthorized 401")
				router.push({ name: routerName.INSTALL_APP })
				break;
			case 403: 
				console.log("error Forbidden 403")
				break;
		}
	}
}

export default axios;