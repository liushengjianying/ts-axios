import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { parseHeaders } from '../helpers/header';
import { createError } from '../helpers/error';
import { isURLSameOrigin } from '../helpers/url';
import cookie from '../helpers/cookie';
import { isFormData } from '../helpers/util';

export default function xhr(config: AxiosRequestConfig): AxiosPromise {
  return new Promise((resolve, reject) => {
    const {
      data = null,
      url,
      method,
      headers = {},
      responseType,
      timeout,
      cancelToken,
      withCredentials,
      xsrfCookieName,
      xsrfHeaderName,
      onDownloadProgress,
      onUploadProgress,
      auth,
      validateStatus
    } = config

    const request = new XMLHttpRequest()

    request.open(method!.toUpperCase(), url!, true)

    configureRequest();

    addEvents();

    processHeaders();

    processCancel();

    request.send(data)

    // 配置相关
    function configureRequest() {
      if (responseType) {
        request.responseType = responseType;
      }
      // 设置超时时间
      if (timeout) {
        request.timeout = timeout;
      }

      if (withCredentials) {
        // 跨域同源策略，不同域名不会携带请求的cookie，设置为true后就可以跨域也携带token了
        request.withCredentials = withCredentials
      }
    }

    // 事件函数
    function addEvents(): void {
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
        reject(createError('Network Error', config, null, request))
      }

      request.ontimeout = function handleTimeout() {
        // 错误代码ECONNABORTED, 网络终止的意思
        reject(createError(`Timeout of ${timeout} ms exceeded`, config, 'ECONNABORTED', request))
      }

      if (onDownloadProgress) {
        request.onprogress = onDownloadProgress;
      }

      if (onUploadProgress) {
        // 上传时候headers中数据格式应该是 formData，要删除原来的Content-Type
        request.upload.onprogress = onUploadProgress
      }
    }

    // 处理headers
    function processHeaders(): void {
      if (isFormData(data)) {
        // 浏览器会根据请求数据是formData自己添加新的content-type
        delete headers['Content-Type']
      }

      if ((withCredentials || isURLSameOrigin(url!)) && xsrfCookieName) {
        const xsrfValue = cookie.read(xsrfCookieName);
        if (xsrfValue && xsrfHeaderName) {
          headers[xsrfHeaderName] = xsrfValue
        }
      }

      if (auth) {
        // btoa BASE64转码
        headers['Authorization'] = 'Basic ' + btoa(auth.username + ':' + auth.password);
      }

      Object.keys(headers).forEach((name) => {
        if (data === null && name.toLowerCase() === 'content-type') {
          delete headers[name]
        } else {
          request.setRequestHeader(name, headers[name])
        }
      })
    }

    function processCancel(): void {
      if (cancelToken) {
        cancelToken.promise.then(reason => {
          request.abort()
          reject(reason)
        })
      }
    }

    function handleResponse(response: AxiosResponse): void {
      if (!validateStatus || validateStatus(response.status)) {
        resolve(response)
      } else {
        reject(
          createError(
            `Request failed with status code ${response.status}`,
            config,
            null,
            request,
            response
          )
        )
      }
    }
  })
}