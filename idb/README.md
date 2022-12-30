# @wzdong/idb

<p align="center" style="font-size: large">
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb">🐱 Github</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/md/doc.md">📖 Docs</a>
     | 
    <a href="https://github.com/wzdong26/-wzdong/issues">👨‍🔧 Issues</a>
     |
    <a href="https://github.com/wzdong26/-wzdong/md/version.md">🕙 Version</a>
</p>
<p align="right">
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/README_zh.md">中文</a>
    - | -
    <i>EN</i> 
</p>

## 📙 First:

> If you are not satisfied with the size of localStorage or the data format it supports, try indexedDB. If you find indexedDB cumbersome to use, lets try **`@wzdong/idb`**. It lets you use indexedDB just as easily as localStorage! 😜😜

1. **This is an npm package based on `indexedDB` and the size is only about 10 kB.**
2. **The method of use is very simple, you only need to read, store, and remove data through `Promise.then()` .**

### 🔨 Installation

-   NPM

```
npm i @wzdong/idb -S
```

-   CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/idb@x.x.x"></script>
```

## 🌰 Example

```typescript
import { initStore } from '@wzdong/idb';

const yourKey = 'uid_1';

// Use `yourKey` to identify the store, and your data will be stored in a store with `yourKey`.
const store = initStore(yourKey);
// It supports the TypeScript notation, which defines your data type by generics, like the following:
// `const store = initStore<{dataName: string}>(yourKey)`

const yourData = { dataName: 'someData' };

// `setData` is to save your data.
store.setData(yourData).then(() => console.log('save success!'));

// `getData` is to get your data, you can receive your data in `.then()`.
store.getData().then((data) => console.log(data));

// `removeData` is to remove your data.
store.removeData(yourData).then(() => console.log('remove success!'));
```

You can then use indexedDB however you want in your project this way. Isn't this writing very similar to localStorage, yes, it's that simple. It's just that it becomes an implementation of asynchronous promises.

### JS Application Example: Form Storage

https://code.juejin.cn/pen/7166548718001324071

## 🧐 Q&A：

> Why use indexedDB instead of simpler localStorage?

1. IndexedDB natively supports reading and writing objects, Date, undefined, NaN, Infinity, and self-referencing objects. This is not supported by localStorage, and although it is possible to convert with the help of `JSON.stringify()`, it is still difficult to fully support these types mentioned above.
2. The storage space of indexedDB is large enough, generally not less than 250M, and the size is generally 50% of the size of the hard disk. The maximum storage capacity of localStorage is generally not higher than 5M.
3. IndexDB is natively implemented asynchronously, so you don't have to worry about using it to prevent the normal operation of your application by making errors in reading and writing data.

> Why wrap indexedDB?

&emsp;&emsp;The process of using native indexedDB is complex, including database requests, establishment transactions, and transaction operations. The implementation of simplified encapsulation in formal project code is more efficient and more conducive to project maintenance.

## 🙆‍♂️ Contributor

-   Author: **wzdong**
-   Email: wzdong.26@qq.com
-   Github: https://github.com/wzdong26
-   Juejin: https://juejin.cn/user/1764078817409022
