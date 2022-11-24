# @wzdong/idb

<center style="font-size: 20px">
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
            <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
        </svg> Github
    </a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/md/document_zh.md">📖 使用文档</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/issues">👨‍🔧 报告问题</a>
</center>
<p align="right">
    <i>中文</i> 
    - | -
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/README.md">EN</a>
</p>

## 📙 写在前面：

> 如果你不满足于 localStorage 的存储容量或是其支持的数据格式，可以试试 indexedDB ，如果你觉得 indexedDB 使用起来操作繁琐，那不妨来试试 **`@wzdong/idb`**，它让你操作 indexedDB 就像操作 localStorage 那么简单！😜😜

1. **这是一个基于 indexedDB 封装实现的 npm package，大小仅 30kB 左右。**
2. **使用方法很简单，只需要通过 `Promise.then()` 的方式就可以读取、存储、移除数据。**


### 🔨 安装

-   NPM 依赖安装

```
npm i @wzdong/idb -S
```

-   CDN 脚本引入

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/idb@x.x.x/lib/index.min.js"></script>
```

## 🌰 示例

```typescript
import { initStore } from '@wzdong/idb';

const yourKey = 'uid_1';

// 用 `yourKey` 来标识你的 store, 你的数据将存在主键值为 `yourKey` 的这条记录中
const store = initStore(yourKey);
// 支持使用 TypeScript , 像下面这样定义你要存储的数据类型:
// `const store = initStore<{dataName: string}>(yourKey)`

const yourData = { dataName: 'someData' };

// 存入数据
store.setData(yourData).then(() => console.log('save success!'));

// 取出数据, 在 `.then()` 中接收到数据
store.getData().then((data) => console.log(data));

// 移除数据
store.removeData(yourData).then(() => console.log('remove success!'));
```

之后你就可以通过这种方式在你的项目中随心所欲地运用 indexedDB 了。这个写法是不是很像 localStorage ，对，就是这么简单。仅仅是变成了异步 Promise 的实现方式。

### 🌰 Js 应用示例(表单存储)

[码上掘金代码沙盒：https://code.juejin.cn/pen/7166548718001324071](https://code.juejin.cn/pen/7166548718001324071)

## 🧐 Q&A：

-   为什么要用 indexedDB 而不用更简单的 localStorage ?

1. indexedDB 原生支持 object、Date、undefined、NaN、Infinity、以及自引用 object 的读写。这是 localStorage 所不支持的，虽然可以借助 `JSON.stringify()` 实现转换，但仍然难以完全支持上述的这些类型。
2. indexedDB 的存储空间足够大，一般来说不少于 250M，大小一般是硬盘大小的 50%。而 localStorage 最大存储量一般不高于 5M。
3. indexDB 原生基于异步方式实现，不必担心使用其在读写数据的过程中发生错误而阻塞应用程序的正常运行。

-   为什么要对 indexedDB 封装 ?

    原生 indexedDB 使用过程较为复杂，包含数据库请求、建立事务、事务操作等。在正式项目代码中使用简化封装后的实现更加高效，同时也更有利于项目维护。

## 💡 源码设计思路

![](https://github.com/wzdong26/-wzdong/blob/main/idb/md/@wzdong_idb.png?raw=true)
[<center>设计流程图（仅包含部分 setup 实现）</center>](https://raw.githubusercontent.com/wzdong26/-wzdong/main/idb/md/%40wzdong_idb.png)

## 🙆‍♂️ 贡献者

-   **wzdong**
-   Email: wzdong.26@qq.com
-   Github: https://github.com/wzdong26
-   掘金主页: https://juejin.cn/user/1764078817409022
