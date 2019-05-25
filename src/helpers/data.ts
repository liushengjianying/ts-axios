import { isPlainObject } from './util'

export function transformRequest(data: any): any {
    // Blob, BufferSource, FormData, URLSearchParams, ReadableStream、USVString 总共有这6种data类型
    // USVSrting 是我们比较常用的
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}

export function transformResponse(data: any): any {
    if (typeof data === 'string') {
        // 虽然是string类型，但不一定是一个json字符串，防止转换失败
        try {
            data = JSON.parse(data)
        } catch (e) {
            // do nothing
        }
    }
    return data
}