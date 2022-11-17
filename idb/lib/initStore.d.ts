import { DbStoreInfo } from './config';
import type { InitDB } from './setupDB';
export default function initStore<T extends {} = {}>(key: any, storeInfo?: DbStoreInfo): {
    getData: () => Promise<T | null | undefined>;
    setData: (data: T) => Promise<unknown>;
    removeData: () => Promise<unknown>;
    del: () => Promise<false | InitDB>;
};
