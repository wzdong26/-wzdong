/**
 * @title initStore
 * @author wzdong
 * @description 创建 IndexedDB store 数据仓库，包含 store 的基本操作，读、写、移除数据以及删除 store
 * @export default {@link initStore}
 */

import { DbStoreInfo, DEFAULT_KEYPATH, DEFAULT_STORE_NAME } from './config';
import setupDB, { get, put, remove } from './setupDB';
import type { InitDB } from './setupDB';

export default function initStore<T extends {} = {}>(key: any, storeInfo?: DbStoreInfo) {
    const { storeName = DEFAULT_STORE_NAME, keyPathOptions = {} } = storeInfo || {};
    const { keyPath = DEFAULT_KEYPATH } = keyPathOptions;

    // 获取 store, 检查 db 是否有该 store ，若没有，则创建 store ，需更新数据库
    const getStore = (() => {
        let _db: InitDB | null, isCreating: boolean;
        return async (mode: IDBTransactionMode = 'readonly') => {
            if (_db) return _db.getStore(storeName, mode);
            return await setupDB().then(async (db) => {
                if (db.objectStoreNames.contains(storeName) || !storeInfo || isCreating) {
                    return db.getStore(storeName, mode);
                } else {
                    isCreating = true;
                    return await db.createStore(storeInfo).then((e) => {
                        isCreating = false;
                        return e.getStore(storeName, mode);
                    });
                }
            });
        };
    })();

    // 删除 store
    async function del() {
        if (!storeInfo) return false;
        return await setupDB().then(async (db) => {
            return await db.deleteStore(storeName);
        });
    }

    async function getData() {
        return await getStore().then(async (st) => {
            const all = await get(st, key);
            if (all) {
                delete all[keyPath];
            }
            return all as T | null | undefined;
        });
    }
    async function setData(data: T) {
        return await getStore('readwrite').then(async (st) => {
            return await put(st, {
                ...data,
                ...{ [keyPath]: key },
            });
        });
    }
    async function removeData() {
        return await getStore('readwrite').then(async (st) => {
            return await remove(st, key);
        });
    }

    return { getData, setData, removeData, del };
}
