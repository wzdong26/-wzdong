/**
 * @title setupDB
 * @author wzdong
 * @description 创建 IndexedDB 数据库，包含 IndexedDB 数据库的基本功能封装
 * -- 连接db
 * @export default {@link setupDB}
 * @export deleteDB {@link deleteDB}
 * -- db store 功能封装
 * @export add {@link add}
 * @export put {@link put}
 * @export get {@link get}
 * @export getByIndex {@link getByIndex}
 * @export remove {@link remove}
 * @export removeByIndex {@link removeByIndex}
 */

import { DB_NAME, DB_STORES, DEFAULT_KEYPATH, DbStoreInfo } from './config';

// 浏览器兼容IndexedDB
const compatIndexedDB = (): IDBFactory | never => {
    if (!window.indexedDB) {
        throw new Error(
            "Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available."
        );
    }
    return window.indexedDB;
};

// ------------------------- db ---------------------------
interface OpenDBOptions {
    name: string;
    version?: number; // Use a long long for this value (don't use a float)
    onUpdate?: (db: InitDB) => void;
    timeout: number;
}

export type InitDB = {
    update: (onUpdate: (db: InitDB) => void) => Promise<InitDB>;
    getStore: (storeName: string, mode: IDBTransactionMode) => IDBObjectStore;
    createStore: (storeInfo: DbStoreInfo) => Promise<InitDB>;
    deleteStore: (storeName: string) => Promise<InitDB>;
} & IDBDatabase;

// 创建一个自定义db: `InitDB`, 在原`IDBDatabase`基础上添加了若干成员方法
const addDBFcn = (db: IDBDatabase) => {
    const idb = db as InitDB;
    idb.update = (onUpdate) => updateDB(db, onUpdate);
    idb.getStore = (storeName, mode) => getStore(db, storeName, mode);
    // 不建议使用, 会触发版本更新
    idb.createStore = (storeInfo) =>
        idb.update((e) => createStore(e, storeInfo));
    idb.deleteStore = (storeName) =>
        idb.update((e) => deleteStore(e, storeName));
    return idb;
};

// 发送IndexedDB打开请求，并获取到 db 对象
const openDB = ((
    openDBOptions: OpenDBOptions
): ((options?: Partial<OpenDBOptions>) => Promise<InitDB>) => {
    // 初始化 打开数据库请求
    let reqOpenDB: IDBOpenDBRequest | null, _db: InitDB | null;
    return (options) =>
        new Promise((resolve, reject) => {
            const opt = { ...openDBOptions, ...(options || {}) };
            const { name, version, onUpdate, timeout } = opt;
            //  兼容浏览器
            const indexedDB = compatIndexedDB();
            // 打开数据库，若没有则会创建
            if (!reqOpenDB) {
                reqOpenDB = indexedDB.open(name, version);
            }
            const reset = () => {
                reqOpenDB?.removeEventListener('success', onsuccess);
                reqOpenDB?.removeEventListener('error', onerror);
                reqOpenDB?.removeEventListener('upgradeneeded', onupgradeneeded);
                reqOpenDB = null;
                openDBOptions = opt;
            };
            const onsuccess = (evt: Event) => {
                const db = (evt.currentTarget as IDBOpenDBRequest).result;
                _db = addDBFcn(db);
                reset();
                resolve(_db); // 数据库对象
            }
            reqOpenDB.addEventListener('success', onsuccess);
            const onerror = (evt: Event) => {
                reset();
                reject((evt.target as IDBOpenDBRequest).error);
            };
            reqOpenDB.addEventListener('error', onerror);
            const onupgradeneeded = (evt: Event) => {
                const db = (evt.currentTarget as IDBOpenDBRequest).result;
                const _db = addDBFcn(db);
                reset();
                onUpdate?.(_db);
                setTimeout(() => {
                    resolve(_db);
                }, 500);
            };
            reqOpenDB.addEventListener('upgradeneeded', onupgradeneeded);
            setTimeout(() => {
                reset();
                reject('Request IndexedDB Timeout!');
            }, timeout);
        });
})({
    name: DB_NAME,
    timeout: 3000,
});

// 更新数据库，触发 onupgradeneeded
const updateDB = (
    db: IDBDatabase,
    onUpdate?: (db: InitDB) => void
): Promise<InitDB> =>
    new Promise((resolve, reject) => {
        let version: number;
        if (db.objectStoreNames.length === 0) {
            const dbName = db.name;
            db.close();
            deleteDB(dbName);
        } else {
            version = db.version + 1;
            db.close();
        }
        setTimeout(() => {
            openDB({ version, onUpdate }).then(resolve).catch(reject);
        });
    });

// 装配数据库
const setupDB = (() => {
    let _db: InitDB | null;
    const addDBListener = (db: InitDB) => {
        // `addDBListener` must be called when the database is opened.
        db.onerror = (ev) => console.error(ev.target);
        db.onabort = (ev) => {
            _db = null;
        };
        db.onclose = (ev) => {
            _db = null;
        };
    };
    return async (
        opt?: OpenDBOptions & {
            stores: DbStoreInfo[];
        }
    ) => {
        if (_db) {
            if (opt) {
                console.warn(
                    'Open indexedDB Options is invalid because the db is already opened!'
                );
            }
            return _db;
        }
        return await openDB({
            onUpdate: (db) =>
                createAllStore(db, [...DB_STORES, ...(opt?.stores || [])]),
            ...(opt || {}),
        }).then((db) => {
            addDBListener(db);
            window.onbeforeunload = () => db.close();
            return db;
        });
    };
})();
export default setupDB;

// 删除数据库
export const deleteDB = (name: string = DB_NAME) => {
    //  兼容浏览器
    const indexedDB = compatIndexedDB();
    indexedDB.deleteDatabase(name);
};

// ----------------------------- store

// 创建store(ObjectStore)
const createStore = (
    db: IDBDatabase,
    {
        storeName,
        keyPathOptions: { keyPath = DEFAULT_KEYPATH, autoIncrement } = {},
        indexList,
    }: DbStoreInfo
) => {
    // `createStore` must be called when the database is `onupgradeneeded`.
    if (db.objectStoreNames.contains(storeName)) return false;
    const store = db.createObjectStore(storeName, { keyPath, autoIncrement });
    indexList?.forEach(({ name, options }) => {
        store.createIndex(name, name, options);
    });
    return store;
};

// 创建配置项{@link storesInfo}中的所有Store
const createAllStore = (db: IDBDatabase, storesInfo: DbStoreInfo[]) => {
    // `createAllStore` must be called when the database is `onupgradeneeded`.
    storesInfo.forEach((storeInfo) => createStore(db, storeInfo));
};

// 删除store(ObjectStore)
const deleteStore = (db: IDBDatabase, storeName: string) => {
    if (!db.objectStoreNames.contains(storeName)) return false;
    // `deleteObjectStore` must be called when the database is `onupgradeneeded`.
    db.deleteObjectStore(storeName);
    console.info(`[indexedDB] Store ${storeName} is deleted!`);
    return true;
};

// 建立事务获取store(ObjectStore)
const getStore = (
    db: IDBDatabase,
    storeName: string,
    mode: IDBTransactionMode
) => {
    let tx: IDBTransaction;
    try {
        tx = db.transaction(storeName, mode);
    } catch (err) {
        throw new Error(
            `[IndexDB] Store named '${storeName}' cannot be found in the database`
        );
    }
    return tx.objectStore(storeName);
};

// -------------------- store 基本操作

// 增
export const add = (store: IDBObjectStore, data: any) =>
    new Promise((resolve, reject) => {
        const req = store.add(data);
        req.onsuccess = resolve;
        req.onerror = reject;
    });

// 改
export const put = (store: IDBObjectStore, data: any) =>
    new Promise((resolve, reject) => {
        const req = store.put(data);
        req.onsuccess = resolve;
        req.onerror = reject;
    });

// 查
// 根据 主键 keyPath 查询
export const get = (
    store: IDBObjectStore,
    keyPathValue?: IDBValidKey | IDBKeyRange
): Promise<any> =>
    new Promise((resolve, reject) => {
        const req = keyPathValue ? store.get(keyPathValue) : store.getAll();
        req.onsuccess = (evt) => {
            resolve((evt.target as IDBRequest).result);
        };
        req.onerror = reject;
    });
// 根据 索引 Index 查询（游标）
export const getByIndex = (
    store: IDBObjectStore,
    indexName: string,
    indexValue: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection
) =>
    new Promise((resolve, reject) => {
        const req = store.index(indexName).openCursor(indexValue, direction);
        const list: any[] = [];
        req.onsuccess = (evt) => {
            const cursor: IDBCursorWithValue = (evt.target as IDBRequest)
                .result;
            if (cursor) {
                list.push(cursor.value);
                cursor.continue();
            } else {
                resolve(list);
            }
        };
        req.onerror = reject;
    });

// 删
// 根据 主键 keyPath 删除
export const remove = (
    store: IDBObjectStore,
    keyPathValue: IDBValidKey | IDBKeyRange
) =>
    new Promise((resolve, reject) => {
        const req = store.delete(keyPathValue);
        req.onsuccess = (evt) => {
            resolve((evt.target as IDBRequest).result);
        };
        req.onerror = reject;
    });
// 根据 索引 Index 删除（游标）
export const removeByIndex = (
    store: IDBObjectStore,
    indexName: string,
    indexValue: IDBValidKey | IDBKeyRange,
    direction?: IDBCursorDirection
) =>
    new Promise((resolve, reject) => {
        const req = store.index(indexName).openCursor(indexValue, direction);
        req.onsuccess = (evt) => {
            const cursor: IDBCursorWithValue = (evt.target as IDBRequest)
                .result;
            if (cursor) {
                const reqDelete = cursor.delete();
                reqDelete.onerror = () => {
                    console.error(
                        `[IndexDB] Failed to delete the record ${cursor}`
                    );
                };
                reqDelete.onsuccess = () => { };
                cursor.continue();
            } else {
                resolve({ delete: 'done' });
            }
        };
        req.onerror = reject;
    });
