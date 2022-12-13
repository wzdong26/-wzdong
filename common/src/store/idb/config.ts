// 配置db名
export const DB_NAME = 'MY_APP_INDEXED_DB';

// 配置 IndexedDB Store 初始化信息
export const DEFAULT_STORE_NAME = '$IDB_STORE';
export const DEFAULT_KEYPATH = '$_ID';

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

export const DB_STORES: DbStoreInfo[] = [
    {
        storeName: DEFAULT_STORE_NAME,
    },
];
