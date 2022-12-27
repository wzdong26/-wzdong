# 📖 `@wzdong/idb` Documentation

<p align="right">
    <a href="https://github.com/wzdong26/-wzdong/tree/main/idb/md/doc_zh.md">中文</a>
    - | -
    <i>EN</i> 
</p>

## 🔨 Installation

-   NPM

```
npm i @wzdong/idb -S
```

-   CDN

```html
<script src="https://cdn.jsdelivr.net/npm/@wzdong/idb@1.1.7"></script>

<script>
    // The global variable 'idb' introduced by the cdn contains the functions you need.
    const { initStore, setupDB } = idb;
    ... ...
</script>
```

## 1. Get started briefly

```typescript
import { initStore } from '@wzdong/idb';

const yourKey = 'uid_1';

const { setData, getData, removeData } = initStore(yourKey);

const yourData = { dataName: 'someData' };

// `setData` is to save your data.
setData(yourData).then(() => console.log('save success!'));

// `getData` is to get your data, you can receive your data in `.then()`.
getData().then((data) => console.log(data));

// `removeData` is to remove your data.
removeData(yourData).then(() => console.log('remove success!'));
```

## 2. Customize the repository

In the `1. Get started briefly` default data is stored in a store named `$IDB_STORE` named by initialization, if you need to store in different stores according to different business scenarios, you can customize the store through the second parameter of `initStore` (this method is more convenient, but every time you customize the store will trigger a database update to create a store, we recommend creating all the stores when the database is initialized, detailed explanation mentioned later), the example is as follows:

```typescript
import { initStore } from '@wzdong/idb';

// Your data is stored in a store called 'MY_STORE', which if not already in the database will trigger the database update to create it. Your data is stored in this store in a record with a keyPath value of `yourKey`.
const store = initStore(yourKey, { storeName: 'MY_STORE' });
```

After defining the second parameter to the function `initStore` above, it will specify that your data is stored in a store named MY_STORE (whose primary key value is `yourKey` ), and if it does not exist in the database, it will trigger a database update to create the store.

-   The configuration type for the second parameter is described below, and its type is `DbStoreInfo`. where `storeName` define the store name, `keyPath` define the primary key field name of the store (default is), and `indexList` define the list of index fields of the store.

```typescript
export type DbStoreInfo<Name extends string = string, KeyPath extends string = string> = {
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

## 3.Unified management and configuration of your stores

In `2. Customize the repository` , you can create a new repository anytime and anywhere by defining the second parameter of the function `initStore`, but when you have too many repositories, this is not a good thing for your repository maintenance. We recommend that your project initialize by creating a configuration file that manages stores like this:

```typescript
export const storesInfo: DbStoreInfo[] = [
    { storeName: 'MY_STORE_1' },
    { storeName: 'MY_STORE_2' },
    ... ...
]
```

And to complete all the store creation work when setting up the database, you can write the following in the file `main.js/main.ts` of your project:

```typescript
import { setupDB } from '@wzdong/idb';
import storesInfo from './config/storesInfo';

setupDB({ store: storesInfo });
```

This will create a database and complete all store creation work when your project is created, and later when other business modules need to operate stores, you can also specify which store to open for operation through the property `storeName` in the second parameter of the function `initStore` .
