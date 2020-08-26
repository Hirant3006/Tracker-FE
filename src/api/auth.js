import axios from '@/plugins/axios'

export default {
    login(data) {
        return axios({
            url: '/authentication',
            method: 'post',
            data
        });
    },
}