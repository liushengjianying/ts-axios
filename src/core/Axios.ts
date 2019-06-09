import {
    AxiosRequestConfig,
    AxiosPromise,
    Method,
    AxiosResponse,
    ResolvedFn,
    RejectedFn
} from '../types/index';
import dispatchRequest, { transformURL } from './dispatchRequest';
import InterceptorManager from './interceptorManager';
import mergeConfig from './mergeConfig'

interface Interceptors {
    request: InterceptorManager<AxiosRequestConfig>
    response: InterceptorManager<AxiosResponse>
}

interface PromiseChain<T> {
    resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
    rejected?: RejectedFn
}

export default class Axios {
    defaults: AxiosRequestConfig

    interceptors: Interceptors

    constructor(initConfig: AxiosRequestConfig) {
        this.defaults = initConfig;
        this.interceptors = {
            request: new InterceptorManager<AxiosRequestConfig>(),
            response: new InterceptorManager<AxiosResponse>()
        }
    }
    // 函数重载！
    request(url: any, config?: any): AxiosPromise {
        if (typeof url === 'string') {
            if (!config) {
                config = {};
            }
            config.url = url;
        } else {
            config = url;
        }

        config = mergeConfig(this.defaults, config);
        config.method = config.method.toLowerCase();

        // 链的初始值, 链式调用初始就是发送请求
        const chain: PromiseChain<any>[] = [{
            resolved: dispatchRequest,
            rejected: undefined
        }];
        // 请求拦截器 后定义的先执行
        this.interceptors.request.forEach((interceptor) => {
            chain.unshift(interceptor)
        });
        // 响应拦截器 后添加的后执行
        this.interceptors.response.forEach((interceptor) => {
            chain.push(interceptor)
        });

        let promise = Promise.resolve(config);

        while (chain.length) {
            // ! 断言chain不为空
            const { resolved, rejected } = chain.shift()!;
            promise = promise.then(resolved, rejected);
        }

        return promise
    }

    get(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('get', url, config)
    }

    delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('delete', url, config)
    }

    head(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('head', url, config)
    }

    options(url: string, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithoutData('options', url, config)
    }

    post(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithData('post', url, data, config)
    }

    put(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithData('put', url, data, config)
    }

    patch(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise {
        return this.requestMethodWithData('patch', url, data, config)
    }

    getUri(config?: AxiosRequestConfig): string {
        config = mergeConfig(this.defaults, config);
        return transformURL(config)
    }

    private requestMethodWithoutData(method: Method, url: string,
        config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url
        }))
    }

    private requestMethodWithData(method: Method, url: string, data?: any,
        config?: AxiosRequestConfig): AxiosPromise {
        return this.request(Object.assign(config || {}, {
            method,
            url,
            data
        }))
    }
}