import axios, { AxiosInstance } from 'axios'
import useUserStore from '@/stores/user'

// 创建axios实例, 将来基于创建出的实例进行配置和请求
// 这样做不会污染原始axios实例
const request: AxiosInstance = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 15000
})

const store = useUserStore()

// 请求拦截器
request.interceptors.request.use(config => {
  // 发送请求之前在请求头中携带token
  config.headers.Authorization = 'Bearer ' + store.token
  console.log('发起了请求, 请求地址: ', config.url, '; 请求信息: ', config)
  // todo: 加载动画

  return config
}, error => {
  // 处理请求错误
  // 关闭加载动画
  return error
})

// 响应拦截器
request.interceptors.response.use(response => {
  // 关闭加载动画
  // axios会把响应结果包装一层data, 直接返回之
  return response.data
}, error => {
  // 处理响应错误
  console.error('请求出错! 请求url: ', error.config.url, '; 详细信息: ', error)
  // 关闭加载动画

  // 请求错误的话会返回一个AxiosError对象, 根据其中的response.status状态码判断即可
  // 省得一堆报错和try catch了
  return error
})

export default request

export interface DataResponse<T> {
  code: number,
  msg: string | null,
  data: T | null
}
