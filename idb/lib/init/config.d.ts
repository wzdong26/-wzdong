export declare const DB_NAME = "MY_APP_INDEXED_DB";
export declare const DEFAULT_STORE_NAME = "$IDB_STORE";
export declare const DEFAULT_KEYPATH = "$_ID";
export declare type DbStoreInfo<Name extends string = string, KeyPath extends string = string> = {
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
export declare const DB_STORES: DbStoreInfo[];
