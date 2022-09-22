import type {App} from 'vue'
import {message} from 'ant-design-vue'
import type {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios'
import axios from 'axios'
import router from '@/router'

console.log(process.env.BASE_API);

/**
 * 创建axios实例
 */
const service = axios.create({
    // 服务接口请求
    baseURL: process.env.BASE_API as string,
    // 超时设置
    timeout: 10 * 1000,
})

/**
 * @desc: 异常拦截处理器
 * @param { Object } error 错误信息
 */
const errorHandler = (error: AxiosError): AxiosError | Promise<AxiosError> => {
    message.error(error.message)
    return Promise.reject(error)
}


// 在每个请求上添加 token
service.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')

    if (token && config.url != 'auth/login') {
        if (!config.headers) config.headers = {}
        config.headers['Authorization'] = 'Bearer ' + token
    }

    return config
}, errorHandler)

/**
 * @desc: 服务端响应后拦截
 * @param { Object } response 返回的数据
 */
service.interceptors.response.use(res => {
    if (res.data && res.data.code !== 0) {
        if (res.data.code === 401) {
            // 登录失效
            router.push({path: '/login', query: {redirect: router.currentRoute.value.fullPath}}).then(r => {
                localStorage.removeItem('token')
            })
        } else {
            message.error(res.data.msg).then(() => {
                console.log(res.data.msg)
            })
        }
        return Promise.reject(res)
    }
    return res;
}, errorHandler)

export default service
