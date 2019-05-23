import { AxiosRequestConfig } from './types'
import { buildURL } from "./helpers/url";
import { transformRequest } from './helpers/data'
import { processHeaders } from './helpers/header';
import xhr from './xhr'

function axios(config: AxiosRequestConfig): void {
  processConfig(config);
  xhr(config);
}

function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config);
  config.headers = transformHeaders(config);
  // 最后处理data! data处理过后就变成 json字符串了，headers中判断会失败
  config.data = transformRequestData(config);
}

function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config;
  return buildURL(url, params);
}

function transformRequestData(config: AxiosRequestConfig): any {
  const { data } = config;
  return transformRequest(data)
}

function transformHeaders(config: AxiosRequestConfig): any {
  const { headers = {}, data } = config;
  return processHeaders(headers, data);
}

export default axios
