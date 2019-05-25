export type Method = 'get' | 'GET' | 'post' | 'POST' | 'delete' | 'DELETE'
| 'head' | 'HEAD' | 'options' | 'OPTIONS' | 'put' | 'PUT' | 'patch' | 'PATCH'

export interface AxiosRequestConfig {
  url: string
  method?: Method
  data?: any
  params?: any
  headers?: any
  responseType? : XMLHttpRequestResponseType
}

export interface AxiosResponse {
  data: any
  status: number
  statusText: string
  headers: any
  config: AxiosRequestConfig
  // 请求的 XMLHttpRequest 对象实例 request
  request: any
}

export interface AxiosPromise extends Promise<AxiosResponse> {
}

