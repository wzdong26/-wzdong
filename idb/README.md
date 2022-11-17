# @wzdong/idb

## 📙 写在前面：
>如果你不满足于 localStorage 的存储容量或是其支持的数据格式，可以试试 indexedDB ，如果你觉得 indexedDB 使用起来操作繁琐，那你不妨来试试 `@wzdong/idb`，试过了就知道它有多么好用，让你像操作 localStorage 那么简单的操作 indexedDB！😜😜

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

https://code.juejin.cn/pen/7166548718001324071

## 📖 使用文档

### 1. 简单入门

```typescript
import { initStore } from "@wzdong/idb";

const yourKey = "uid_1";

const { setData, getData, removeData } = initStore(yourKey);

const yourData = { dataName: "someData" };

// `setData` is to save your data.
setData(yourData).then(() => console.log("save success!"));

// `getData` is to get your data, you can receive your data in `.then()`.
getData().then((data) => console.log(data));

// `removeData` is to remove your data.
removeData(yourData).then(() => console.log("remove success!"));
```
### 2. 自定义仓库
在 `1. 简单入门` 中数据默认是存储在一个初始化就定义好的名为 `$IDB_STORE` 的仓库里，如果你需要根据业务场景的不同分别存储在不同的仓库中，可以通过 `initStore` 的第二个参数来自定义仓库（这种方法比较方便，但在每次自定义仓库的时候会触发一次数据库更新创建仓库，我们更建议在数据库初始化时就创建好所有的仓库，详细讲解后面提到），示例如下：
```typescript
import { initStore } from "@wzdong/idb";

// Your data is stored in a store called 'MY_STORE', which if not already in the database will trigger the database update to create it. Your data is stored in this store in a record with a keyPath value of `yourKey`.
const store = initStore(yourKey, {storeName: 'MY_STORE'});
```
以上对 `initStore` 函数定义第二个参数后将指定你的数据存储在名为 MY_STORE 的仓库中（其主键值为 `yourKey` ），若其不存在于数据库中将触发数据库更新创建该仓库。

- 关于第二个参数的配置类型说明如下，其类型为 `DbStoreInfo` 。其中 `storeName` 定义仓库名， `keyPath` 定义仓库的主键字段名（默认为 `$_ID` ）， `indexList` 定义仓库的索引字段列表。
```typescript
export type DbStoreInfo<
    Name extends string = string,
    KeyPath extends string = string
> = {
    storeName: Name;
    keyPathOptions?: {
        keyPath?: KeyPath;
        autoIncrement?: boolean;
    };
    indexList?: {
        name: string;
        options?: IDBIndexParameters;
    }[];
};
```
### 3. 统一管理配置你的仓库
在 `2. 自定义仓库` 中你可以随时随地通过 `initStore` 函数定义第二个参数的方式来创建新的仓库，但是当你的仓库过多，这对于你的仓库维护并不是一件好事。我们建议你的项目在初始化时就创建一个统一管理 stores 的配置文件类似这样：
```typescript
export const storesInfo: DbStoreInfo[] = [
    { storeName: 'MY_STORE_1' },
    { storeName: 'MY_STORE_2' },
    ... ...
]
```
并在 setup 数据库时完成所有 store 的创建工作，你可以在你的项目的 `main.js/main.ts` 文件中写入下面这个：
```typescript
import setupDB from "@wzdong/idb";
import storesInfo from './config/storesInfo'

setupDB({store: storesInfo})
```
这将在你的项目创建时创建数据库并完成所有 store 的创建工作，而后续你在其它业务模块需要操作仓库时同样通过 `initStore` 方法的第二个参数中的 `storeName` 属性就可以指定打开哪一个仓库进行操作。

## 🧐 Q&A：

- 为什么要用 indexedDB 而不用更简单的 localStorage ?

1. indexedDB 原生支持 object、Date、undefined、null、NaN、Infinity、以及自引用 object 的读写。这是 localStorage 所不支持的，虽然可以借助 `JSON.stringify()` 实现转换，但仍然难以支持 Date、undefined、null、NaN、Infinity、以及自引用 object 这些类型。
2. indexedDB 的存储空间足够大，一般来说不少于 250M，大小一般是硬盘大小的 50%。而 localStorage 最大存储量一般不高于 5M。
3. indexDB 原生基于异步方式实现，不必担心使用其在读写数据的过程中发生错误而阻塞应用程序的正常运行。

- 为什么要对 indexedDB 封装 ?

  原生 indexedDB 使用过程较为复杂，包含数据库请求、建立事务、事务操作等。在正式项目代码中使用简化封装后的实现更加高效，同时也更有利于项目维护。

## 🙆‍♂️ Contributor

- wzdong
- Email: wzdong.26@qq.com
- github: https://github.com/wzdong26
- 掘金主页: https://juejin.cn/user/1764078817409022

## 👨‍🔧反馈
关于此项目有任何问题欢迎 issue 反馈：

https://github.com/wzdong26/-wzdong/issues