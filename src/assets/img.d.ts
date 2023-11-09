
// 为防止导入图片资源时ts报错，需要在图片目录下创建一个img.d.ts文件，内容如下：
declare module '*.svg'
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.gif'
declare module '*.bmp'
declare module '*.tiff'
