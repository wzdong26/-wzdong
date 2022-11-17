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
import { DbStoreInfo } from './config';
interface OpenDBOptions {
    name: string;
    version?: number;
    onUpdate?: (db: InitDB) => void;
    timeout: number;
}
export declare type InitDB = {
    update: (onUpdate: (db: InitDB) => void) => Promise<InitDB>;
    getStore: (storeName: string, mode: IDBTransactionMode) => IDBObjectStore;
    createStore: (storeInfo: DbStoreInfo) => Promise<InitDB>;
    deleteStore: (storeName: string) => Promise<InitDB>;
} & IDBDatabase;
declare const setupDB: (opt?: (OpenDBOptions & {
    stores: DbStoreInfo[];
}) | undefined) => Promise<InitDB>;
export default setupDB;
export declare const deleteDB: (name?: string) => void;
export declare const add: (store: IDBObjectStore, data: any) => Promise<unknown>;
export declare const put: (store: IDBObjectStore, data: any) => Promise<unknown>;
export declare const get: (store: IDBObjectStore, keyPathValue?: IDBValidKey | IDBKeyRange | undefined) => Promise<any>;
export declare const getByIndex: (store: IDBObjectStore, indexName: string, indexValue: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection | undefined) => Promise<unknown>;
export declare const remove: (store: IDBObjectStore, keyPathValue: IDBValidKey | IDBKeyRange) => Promise<unknown>;
export declare const removeByIndex: (store: IDBObjectStore, indexName: string, indexValue: IDBValidKey | IDBKeyRange, direction?: IDBCursorDirection | undefined) => Promise<unknown>;
