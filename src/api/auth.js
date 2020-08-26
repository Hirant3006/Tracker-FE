import axios from '@/plugins/axios'

export default {
    login(data) {
        console.log('data api',data)
        return axios({
            url: '/authentication',
            method: 'post',
            data
        });
    },
}