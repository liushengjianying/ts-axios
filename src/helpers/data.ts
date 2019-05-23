import { isPlainObject } from './util'

export function transformRequest(data: any): any {
    // Blob, BufferSource, FormData, URLSearchParams, ReadableStream、USVString 总共有这6种data类型
    // USVSrting 是我们比较常用的
    if (isPlainObject(data)) {
        return JSON.stringify(data)
    }
    return data
}