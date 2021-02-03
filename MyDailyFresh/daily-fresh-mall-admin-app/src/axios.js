import axios from 'axios';
const instance = axios.create({
    baseURL: 'https://mallapi.duyiedu.com'
});
instance.interceptors.request.use((config) => {
    // console.log(config);
    return config;
}, (error) => {
    return Promise.reject(error);
});

instance.interceptors.response.use((response) => {
    // console.log(response);
    if (response.data.status === 'fail') {
        return Promise.reject(response.data.msg);
    } else {
        return response.data.data;
    }
}, (error) => Promise.reject(error));

export default instance;
