# @wzdong/idb

## [👉 查看 README 中文版](https://github.com/wzdong26/-wzdong/tree/main/idb/README_zh.md)

---

## 📙 First:

> If you are not satisfied with the size of localStorage or the data format it supports, you can try indexedDB. If you find indexedDB cumbersome to use, you can try `@wzdong/idb`. indexedDB lets you manipulate IndexedDB as easily as localStorage! 😜😜

1. This is an npm package based on the indexedDB encapsulation implementation
2. The method of use is very simple, you only need to read, store, and remove data through `Promise.then()`

### 🔨 Installation

```
npm i @wzdong/idb -S
```

### 📙 Github address

https://github.com/wzdong26/-wzdong/tree/main/idb

## 🌰 Example

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

You can then use indexedDB however you want in your project this way. Isn't this writing very similar to localStorage, yes, it's that simple. It's just that it becomes an implementation of asynchronous promises.

### 🌰 JS Application Example (Form Storage)

https://code.juejin.cn/pen/7166548718001324071

## 📖 Documentation

https://github.com/wzdong26/-wzdong/tree/main/idb/md/document.md

## 🧐 Q&A：

- Why use indexedDB instead of simpler localStorage?

1. IndexedDB natively supports reading and writing object, Date, undefined, null, NaN, Infinity, and self-referencing objects. This is not supported by localStorage, and although `JSON.stringify()` conversions can be implemented with the help of , it is still difficult to support Date, undefined, null, NaN, Infinity, and self-referencing object types.
2. The storage space of indexedDB is large enough, generally not less than 250M, and the size is generally 50% of the size of the hard disk. The maximum storage capacity of localStorage is generally not higher than 5M.
3. IndexDB is natively implemented asynchronously, so you don't have to worry about using it to prevent the normal operation of your application by making errors in reading and writing data.

- Why wrap indexedDB?

  The process of using native indexedDB is complex, including database requests, establishment transactions, and transaction operations. The implementation of simplified encapsulation in formal project code is more efficient and more conducive to project maintenance.

## 💡 Design Ideas

![Flow chart(zh)](https://github.com/wzdong26/-wzdong/tree/main/idb/md/@wzdong_db.png)

## 🙆‍♂️ Contributor

- Author: **wzdong**
- Email: wzdong.26@qq.com
- Github: https://github.com/wzdong26
- Juejin: https://juejin.cn/user/1764078817409022

## 👨‍🔧 Issues

If you have any questions about this project, please welcome issue feedback:

https://github.com/wzdong26/-wzdong/issues
