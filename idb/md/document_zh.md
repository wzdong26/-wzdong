# 📖 @wzdong/idb 使用文档

## 🔨 安装

```
npm i @wzdong/idb -S
```

## 1. 简单入门

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

## 2. 自定义仓库

在 `1. 简单入门` 中数据默认是存储在一个初始化就定义好的名为 `$IDB_STORE` 的仓库里，如果你需要根据业务场景的不同分别存储在不同的仓库中，可以通过 `initStore` 的第二个参数来自定义仓库（这种方法比较方便，但在每次自定义仓库的时候会触发一次数据库更新创建仓库，我们更建议在数据库初始化时就创建好所有的仓库，详细讲解后面提到），示例如下：

```typescript
import { initStore } from "@wzdong/idb";

// Your data is stored in a store called 'MY_STORE', which if not already in the database will trigger the database update to create it. Your data is stored in this store in a record with a keyPath value of `yourKey`.
const store = initStore(yourKey, { storeName: "MY_STORE" });
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

## 3. 统一管理配置你的仓库

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
import storesInfo from "./config/storesInfo";

setupDB({ store: storesInfo });
```

这将在你的项目创建时创建数据库并完成所有 store 的创建工作，而后续你在其它业务模块需要操作仓库时同样通过 `initStore` 方法的第二个参数中的 `storeName` 属性就可以指定打开哪一个仓库进行操作。
