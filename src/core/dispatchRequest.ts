import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import { buildURL } from "../helpers/url";
// import { transformRequest, transformResponse } from '../helpers/data';
import { flattenHeaders } from '../helpers/header';
import xhr from './xhr'
import { transform } from './transform';

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  processConfig(config);
  throwIfCancelationRequested(config);
  return xhr(config).then((res) => {
    return transformResponseData(res)
  })
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  // config.headers = transformHeaders(config);
  // 最后处理data! data处理过后就变成 json字符串了，headers中判断会失败
  // config.data = transformRequestData(config);
  config.data = transform(config.data, config.headers, config.transformRequest)
  config.headers = flattenHeaders(config.headers, config.method!);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url!, params);
}

// function transformRequestData(config: AxiosRequestConfig): any {
//   const { data } = config;
//   return transformRequest(data)
// }

// function transformHeaders(config: AxiosRequestConfig): any {
//   const { headers = {}, data } = config;
//   return processHeaders(headers, data);
// }

function transformResponseData(res: AxiosResponse): AxiosResponse {
  res.data = transform(res.data, res.headers, res.config.transformResponse)
  return res
}

function throwIfCancelationRequested(config: AxiosRequestConfig): void {
    if (config.cancelToken) {
      config.cancelToken.throwIfRequested()
    }
}