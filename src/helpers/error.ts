import { AxiosRequestConfig, AxiosResponse } from '../types/index';

export class AxiosError extends Error {
    isAxiosError: boolean
    config: AxiosRequestConfig
    code?: string | null
    requset?: any
    response?: AxiosResponse

    constructor(
        message: string,
        config: AxiosRequestConfig,
        code?: string | null,
        request?: any,
        response?: AxiosResponse
    ) {
        super(message)

        this.config = config
        this.code = code
        this.requset = request
        this.response = response
        this.isAxiosError = true

        // ts的坑，实例化对象后，无法继承其原型上的方法，所以要指定其原型对象
        Object.setPrototypeOf(this, AxiosError.prototype)
    }
}

export function createError(
    message: string,
    config: AxiosRequestConfig,
    code?: string | null,
    request?: any,
    response?: AxiosResponse
) {
    const error = new AxiosError(message, config, code, request, response)
    return error
}
