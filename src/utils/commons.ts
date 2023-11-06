
// 既然用TS了就加点类型限制
/**
 * @description 用于将中文转换为URI编码, 方便在浏览器中进行中文URL跳转
 * @param uri 需要转换的包含中文的URI字符串
 */
export const ch = (uri: string): string => encodeURI(uri)
