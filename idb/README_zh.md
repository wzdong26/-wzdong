# @wzdong/idb

## [👉README-EN](https://github.com/wzdong26/-wzdong/tree/main/idb/README.md)

---

## 📙 写在前面：

> 如果你不满足于 localStorage 的存储容量或是其支持的数据格式，可以试试 indexedDB ，如果你觉得 indexedDB 使用起来操作繁琐，那你不妨来试试 `@wzdong/idb`，试过了就知道它有多么好用，让你像操作 localStorage 那么简单的操作 indexedDB！😜😜

1. 这是一个基于 indexedDB 封装实现的 npm package
2. 使用方法很简单，只需要通过 `Promise.then()` 的方式就可以读取、存储、移除数据

### 🔨 安装

```
npm i @wzdong/idb -S
```

### 📙 Github 地址

https://github.com/wzdong26/-wzdong/tree/main/idb

## 🌰 示例

```typescript
import { initStore } from "@wzdong/idb";

const yourKey = "uid_1";

// Use `yourKey` to identify the store, and your data will be stored in a store with `yourKey`.
const store = initStore(yourKey);
// It supports the TypeScript notation, which defines your data type by generics, like the following:
// `const store = initStore<{dataName: string}>(yourKey)`

const yourData = { dataName: "someData" };

// `setData` is to save your data.
store.setData(yourData).then(() => console.log("save success!"));

// `getData` is to get your data, you can receive your data in `.then()`.
store.getData().then((data) => console.log(data));

// `removeData` is to remove your data.
store.removeData(yourData).then(() => console.log("remove success!"));
```

之后你就可以通过这种方式在你的项目中随心所欲地运用 indexedDB 了。这个写法是不是很像 localStorage ，对，就是这么简单。仅仅是变成了异步 Promise 的实现方式。

### 🌰 Js 应用示例(表单存储)

[码上掘金代码沙盒：https://code.juejin.cn/pen/7166548718001324071](https://code.juejin.cn/pen/7166548718001324071)

## 📖 使用文档

https://github.com/wzdong26/-wzdong/tree/main/idb/md/document_zh.md

## 🧐 Q&A：

- 为什么要用 indexedDB 而不用更简单的 localStorage ?

1. indexedDB 原生支持 object、Date、undefined、null、NaN、Infinity、以及自引用 object 的读写。这是 localStorage 所不支持的，虽然可以借助 `JSON.stringify()` 实现转换，但仍然难以支持 Date、undefined、null、NaN、Infinity、以及自引用 object 这些类型。
2. indexedDB 的存储空间足够大，一般来说不少于 250M，大小一般是硬盘大小的 50%。而 localStorage 最大存储量一般不高于 5M。
3. indexDB 原生基于异步方式实现，不必担心使用其在读写数据的过程中发生错误而阻塞应用程序的正常运行。

- 为什么要对 indexedDB 封装 ?

  原生 indexedDB 使用过程较为复杂，包含数据库请求、建立事务、事务操作等。在正式项目代码中使用简化封装后的实现更加高效，同时也更有利于项目维护。

## 💡 源码设计思路

![设计流程图（仅包含部分 setup 实现）](https://github.com/wzdong26/-wzdong/tree/main/idb/md/@wzdong_db.png)

## 🙆‍♂️ 贡献者

- **wzdong**
- Email: wzdong.26@qq.com
- Github: https://github.com/wzdong26
- 掘金主页: https://juejin.cn/user/1764078817409022

## 👨‍🔧 反馈

关于此项目有任何问题欢迎 issue 反馈：

https://github.com/wzdong26/-wzdong/issues
