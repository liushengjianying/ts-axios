import { isDate, isPlainObject, isURLSearchParams } from './util'

interface URLOrigin {
  protocol: string
  host: string
}

function encode(val: string): string {
  return encodeURIComponent(val)
    //  gi是不区分大小写
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any,
  paramsSerializer?: (params: any) => string) {
  if (!params) {
    return url
  }
  let serializedParams;

  if (paramsSerializer) {
    serializedParams = paramsSerializer(params)
  } else if(isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    const parts: string[] = [];

    Object.keys(params).forEach((key) => {
      let val = params[key];
      if (val === null || typeof val === undefined) {
        return
      }
      let values = [];
      if (Array.isArray(val)) {
        values = val;
        key += '[]';
      } else {
        values = [val];
      }
      values.forEach((val) => {
        if (isDate(val)) {
          val = val.toISOString();
        } else if (isPlainObject(val)) {
          val = JSON.stringify(val)
        }
        parts.push(`${encode(key)}=${encode(val)}`)
      })
    });

    serializedParams = parts.join('&');
  }
  if (serializedParams) {
    const markIndex = url.indexOf('#');
    if (markIndex !== -1) {
      url = url.slice(0, markIndex);
    }
    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }
  return url
}

// 判断是否是决定地址,baseURL需求
export function isAbsoluteURL(url: string): boolean {
  return /(^[a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
}

export function combineURL(baseURL: string, relativeURL?: string): string {
  // 删除baseurl和传入的url，后面和前面的url，这样写的不规范这里也能做处理了
  return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + 
  relativeURL.replace(/^\/+/, '') : baseURL
}

// 判断是否同源
export function isURLSameOrigin(requestURL: string): boolean {
  const parsedOrigin = resolveURL(requestURL);
  return (parsedOrigin.protocol === currentOrigin.protocol &&
    parsedOrigin.host === currentOrigin.host)
}

const urlParsingNode = document.createElement('a');
const currentOrigin = resolveURL(window.location.href);

function resolveURL(url: string): URLOrigin {
  urlParsingNode.setAttribute('href', url);
  // 协议和域名
  const { protocol, host } = urlParsingNode;
  return {
    protocol,
    host
  }
}