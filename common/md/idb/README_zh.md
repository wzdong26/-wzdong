# @wzdong/idb

<p align="center" style="font-size: large">
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb">🐱 Github</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/md/document_zh.md">📖 文档</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/issues">👨‍🔧 Issues</a>
     |
    <a href="https://github.com/wzdong26/-wzdong/md/version.md">🕙 版本</a>
</p>
<p align="right">
    <i>中文</i> 
    - | -
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/README.md">EN</a>
</p>

## 📙 写在前面：

> 如果你不满足于 localStorage 的存储容量或是其支持的数据格式，可以试试 indexedDB ，如果你觉得 indexedDB 使用起来操作繁琐，那不妨来试试 **`@wzdong/idb`**，它让你操作 indexedDB 就像操作 localStorage 那么简单！😜😜

1. **这是一个基于 indexedDB 封装实现的 npm package，大小仅 10 kB 左右。**
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

### Js 应用示例 -- 表单存储

[码上掘金代码沙盒：https://code.juejin.cn/pen/7166548718001324071](https://code.juejin.cn/pen/7166548718001324071)

## 🧐 Q&A：

-   为什么要用 indexedDB 而不用更简单的 localStorage ?

1. indexedDB 原生支持 object、Date、undefined、NaN、Infinity、以及自引用 object 的读写。这是 localStorage 所不支持的，虽然可以借助 `JSON.stringify()` 实现转换，但仍然难以完全支持上述的这些类型。
2. indexedDB 的存储空间足够大，一般来说不少于 250M，大小一般是硬盘大小的 50%。而 localStorage 最大存储量一般不高于 5M。
3. indexDB 原生基于异步方式实现，不必担心使用其在读写数据的过程中发生错误而阻塞应用程序的正常运行。

-   为什么要对 indexedDB 封装 ?

&emsp;&emsp;原生 indexedDB 使用过程较为复杂，包含数据库请求、建立事务、事务操作等。在正式项目代码中使用简化封装后的实现更加高效，同时也更有利于项目维护。

## 💡 源码设计思路

![](https://github.com/wzdong26/-wzdong/blob/main/idb/md/@wzdong_idb.png?raw=true)
[<center>设计流程图（仅包含部分 setup 实现）</center>](https://raw.githubusercontent.com/wzdong26/-wzdong/main/idb/md/%40wzdong_idb.png)

## 🙆‍♂️ 贡献者

-   **wzdong**
-   Email: wzdong.26@qq.com
-   Github: https://github.com/wzdong26
-   掘金主页: https://juejin.cn/user/1764078817409022
