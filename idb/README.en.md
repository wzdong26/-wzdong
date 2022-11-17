# @wzdong/idb

## 📙 First:
>If you are not satisfied with the size of localStorage or the data format it supports, you can try indexedDB. If you find indexedDB cumbersome to use, you can try `@wzdong/idb`. indexedDB lets you manipulate IndexedDB as easily as localStorage! 😜😜

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

### 1. Get started briefly

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
### 2. Customize the repository
In the `1. Get started briefly` default data is stored in a store named `$IDB_STORE` named by initialization, if you need to store in different stores according to different business scenarios, you can customize the store through the second parameter of `initStore` (this method is more convenient, but every time you customize the store will trigger a database update to create a store, we recommend creating all the stores when the database is initialized, detailed explanation mentioned later), the example is as follows:
```typescript
import { initStore } from "@wzdong/idb";

// Your data is stored in a store called 'MY_STORE', which if not already in the database will trigger the database update to create it. Your data is stored in this store in a record with a keyPath value of `yourKey`.
const store = initStore(yourKey, {storeName: 'MY_STORE'});
```
After defining the second parameter to the function `initStore` above, it will specify that your data is stored in a store named MY_STORE (whose primary key value is  `yourKey` ), and if it does not exist in the database, it will trigger a database update to create the store.

- The configuration type for the second parameter is described below, and its type is `DbStoreInfo`. where `storeName` define the store name, `keyPath` define the primary key field name of the store (default is), and `indexList` define the list of index fields of the store.
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
### 3.Unified management and configuration of your stores
In  `2. Customize the repository` , you can create a new repository anytime and anywhere by defining the second parameter of the function `initStore`, but when you have too many repositories, this is not a good thing for your repository maintenance. We recommend that your project initialize by creating a configuration file that manages stores like this:
```typescript
export const storesInfo: DbStoreInfo[] = [
    { storeName: 'MY_STORE_1' },
    { storeName: 'MY_STORE_2' },
    ... ...
]
```
And to complete all the store creation work when setting up the database, you can write the following in the file `main.js/main.ts` of your project:
```typescript
import setupDB from "@wzdong/idb";
import storesInfo from './config/storesInfo'

setupDB({store: storesInfo})
```
This will create a database and complete all store creation work when your project is created, and later when other business modules need to operate stores, you can also specify which store to open for operation through the property `storeName` in the second parameter of the function  `initStore` .

## 🧐 Q&A：

- Why use indexedDB instead of simpler localStorage?

1. IndexedDB natively supports reading and writing object, Date, undefined, null, NaN, Infinity, and self-referencing objects. This is not supported by localStorage, and although `JSON.stringify()` conversions can be implemented with the help of , it is still difficult to support Date, undefined, null, NaN, Infinity, and self-referencing object types.
2. The storage space of indexedDB is large enough, generally not less than 250M, and the size is generally 50% of the size of the hard disk. The maximum storage capacity of localStorage is generally not higher than 5M.
3. IndexDB is natively implemented asynchronously, so you don't have to worry about using it to prevent the normal operation of your application by making errors in reading and writing data.

- Why wrap indexedDB?

  The process of using native indexedDB is complex, including database requests, establishment transactions, and transaction operations. The implementation of simplified encapsulation in formal project code is more efficient and more conducive to project maintenance.

## 🙆‍♂️ Contributor

- wzdong
- Email: wzdong.26@qq.com
- github: https://github.com/wzdong26
- Juejin: https://juejin.cn/user/1764078817409022

## 👨‍🔧反馈
If you have any questions about this project, please welcome issue feedback:

https://github.com/wzdong26/-wzdong/issues