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
  // 发送请求之前在请求头中携带token, 如果有的话
  config.headers.Authorization = store.token
  console.log('发起了请求, 请求地址: ', config.url, '; 请求信息: ', config)

  return config
}, error => {
  // 处理请求错误
  return error
})

// 响应拦截器
request.interceptors.response.use(response => {
  // 关闭加载动画
  // axios会把响应结果包装一层data, 直接返回之

  // 后端考虑到了的业务逻辑错误会走这个方法, 📌📌返回的就是约定好的DataResponse对象
  return response.data as DataResponse
}, error => {
  // 处理响应错误
  console.warn('请求出错! 请求url: ', error.config.url, '; 详细信息: ', error)

  // 请求错误的话会返回一个AxiosError对象, 根据其中的response.status状态码判断即可
  // 省得一堆报错和try catch了

  // 后端没考虑到的错误就会走这个方法, 比如415, 📌📌本来返回的是一个AxiosError对象
  // 在这里将其转换为DataResponse对象, 以便在页面上显示错误信息
  // 人家甚至准备好isAxiosError属性来判断是否是AxiosError对象了, 真体贴(
  if (error.isAxiosError) {
    return {
      code: error.response.data.status,
      msg: error.response.data.error || '未知错误',
      data: null
    } as DataResponse
  }

  // 不知道有没有什么其他的未知错误..
  return error
})

export default request

export interface DataResponse<T = any> {
  code: number,
  msg: string | null,
  data: T
}
