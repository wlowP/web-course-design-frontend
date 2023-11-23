# web课设前端

### 启动项目

- 本项目采用pnpm作为包管理器. 在安装了nodejs后可以通过CMD运行 `pnpm -v` 命令, 若出现版本号, 则表明已经安装pnpm. 否则运行下面命令安装pnpm:

``` shell
npm install -g pnpm
```

- 初次运行项目之前, 执行以下命令安装项目所需依赖:

```shell
pnpm install
```

- 执行以下命令运行项目:

```shell
pnpm run dev
# 运行成功后浏览器访问http://localhost:5173/即可
```

### 项目说明

- 本项目采用 `ant-design-vue` 组件库, [官网地址](https://antdv.com/components/overview-cn)
  - 已经配置了自动导入组件. 调用组件时无需显式地 `import { ... } from 'ant-design-vue'` 了
- 后续有额外内容的话会补充...

### TODO
- 引入ECharts. [官网地址](https://echarts.apache.org/zh/index.html)
  - 但是应该引入**Vue-Echarts**以适配vue项目


### 注意事项
- idea/webstorm自带的git工具无法访问Github时, 尝试windows cmd执行以下命令
```shell
ipconfig /flushdns
```
- 或者项目文件夹内git bash执行以下命令
```shell
git config --global http.sslVerify "false"
git config --global --unset http.proxy
git config --global --unset https.proxy
```
