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
