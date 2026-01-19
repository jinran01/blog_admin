import axios from 'axios';
import router from "../router";
import { lo } from 'element-plus/es/locales.mjs';
export function request(config) {
    const instance = axios.create(
        {
            baseURL: "/api/v1/",
            timeout: 5000
        }
    );
    //判断是否需要token
    const needToken = (config)=>{
        return !config.noToken
    }
    //请求拦截
    instance.interceptors.request.use(config => {
        // 获取token
        const token = localStorage.getItem('Token')
        //需要token
        if(needToken(config)){
            if(token === '' || token === null){
                router.push({path:'/login'})
                return Promise.reject('未登录')
            }
            config.headers.Authorization = `Bearer ${token}`
        }
        // 直接放行
        return config;
    }, err => {
        console.log(err)
    })
    //响应拦截
    instance.interceptors.response.use(res => {
        return res.data;
    }, error => {
        // return ElMessage.error(error)
        return error
    })
    return instance(config)
}
