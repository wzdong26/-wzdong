/**
 * @title storage
 * @description e.g., const { setItem, getItem, removeItem, IStorage } = initStorage(localStorage);
 * @author wzdong
 */

import { jsonStringify, jsonParse } from '@wzdong/utils';

const initStorage = (storage: Storage) => {
    const setItem = (key: string, value: any) => {
        try {
            const text = jsonStringify(value);
            storage.setItem(key, text);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    const getItem = (key: string) => {
        let value: any;
        try {
            const item = storage.getItem(key);
            value = item === null ? item : jsonParse(item);
        } catch (e) {
            console.error(e);
            value = null;
        }
        return value;
    };

    const removeItem = (key: string) => {
        try {
            storage.removeItem(key);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    };

    class IStorage<V = any, K extends string = string> {
        key: K;
        constructor(key: K) {
            this.key = key;
        }
        set(value: V): boolean {
            return setItem(this.key, value);
        }
        get(): V | null {
            return getItem(this.key);
        }
        clear(): boolean {
            return removeItem(this.key);
        }
    }

    return {
        setItem,
        getItem,
        removeItem,
        IStorage,
    };
};

export default initStorage;
