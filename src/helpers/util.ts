const toString = Object.prototype.toString;

export function isDate(val: any): val is Date {
  return toString.call(val) === '[object Date]'
}

// export function isObject(val: any): val is Object {
//   return val !== null && typeof val === 'object'
// }

// 判断是否是普通对象 Blob, BufferSource, FormData, 这些都是对象，这里要进一步判断
// 返回一个类型谓词
export function isPlainObject(val: any): val is Object {
  // FormData是 [object FormData]
  return toString.call(val) === '[object Object]'
}

// 交叉类型
export function extend<T, U>(to: T, from: U): T & U {
  for (const key in from) {
    // 大括号开头要用;
    ;(to as T & U)[key] = from[key] as any
  }
  return to as T & U
}
