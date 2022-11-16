import { DbStoreInfo } from 'src/init/config';
import { Ref } from 'vue';
export default function useStore<T extends {}>(rowData: T | Ref<T>, key: any, storeInfo?: DbStoreInfo): {
    get: () => Promise<T | null | undefined>;
    remove: () => Promise<void>;
    save: () => Promise<void>;
};
