
// 既然用TS了就加点类型限制😂
/**
 * @description 用于将中文转换为URI编码, 方便在浏览器中进行中文URL跳转
 * @param uri 需要转换的包含中文的URI字符串
 */
export const ch = (uri: string): string => encodeURI(uri)

// 对象深拷贝
export const deepClone = (obj: any): any => {
  // 如果参数不是对象或者是null，直接返回
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }
  // 创建一个新的对象，用来存储拷贝的结果
  let result = Array.isArray(obj) ? [] : {};
  // 遍历原对象的属性
  for (let key in obj) {
    // 如果属性是自有的，不是继承的
    if (obj.hasOwnProperty(key)) {
      // 递归调用深拷贝函数，拷贝属性的值
      result[key] = deepClone(obj[key]);
    }
  }
  // 返回拷贝后的对象
  return result;
}

// 获取当前时间
export const formatTime = (date: Date): string => `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`

// 节流函数, 可带参
export const throttle = (fn, period) => {
  let timer
  return (...args) => {
    if (timer) return
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, period)
  }
}
