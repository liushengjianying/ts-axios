import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/header'
import { createError } from '../helpers/error';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const { data = null, url, method = 'get', headers, responseType, timeout } = config

    const request = new XMLHttpRequest()

    if (responseType) {
      request.responseType = responseType;
    }
    // 设置超时时间
    if (timeout) {
      request.timeout = timeout;
    }

    request.open(method.toUpperCase(), url!, true)

    request.onreadystatechange = function handleLoad() {
      if (request.readyState !== 4) {
        return
      }
      // The status attribute must return the result of running these steps:
      // status的值一定会返回运行这些步骤的结果。
      // 1、If the state is UNSENT or OPENED, return 0.（如果状态是UNSENT或者OPENED，返回0）就是readyState为0或1
      // 2、If the error flag is set, return 0.（如果错误标签被设置，返回0）
      // 3、Return the HTTP status code.（返回HTTP状态码）
      if (request.status === 0) {
        return
      }

      const responseHeaders = parseHeaders(request.getAllResponseHeaders());
      const responseData = responseType && responseType !== 'text' ? request.response :
        request.responseText;
      const response: AxiosResponse = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config,
        request
      }
      handleResponse(response)
    }

    request.onerror = function handleError() {
      // 这里拿不到response，所以不传
      reject(createError('Netword Error', config, null, request))
    }

    request.ontimeout = function handleTimeout() {
      // 错误代码ECONNABORTED, 网络终止的意思
      reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
    }

    Object.keys(headers).forEach((name) => {
      if (data === null && name.toLowerCase() === 'content-type') {
        delete headers[name]
      } else {
        request.setRequestHeader(name, headers[name])
      }
    })

    request.send(data)

    function handleResponse(response: AxiosResponse): void {
      if (response.status >= 200 && response.status < 300) {
        resolve(response)
      } else {
        reject(createError(`Request failed with status code ${response.status}`,
          config, null, request, response))
      }
    }
  })
}