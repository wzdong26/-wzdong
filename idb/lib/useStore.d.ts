import { Ref } from 'vue';
export default function useStore<T extends {
    formId: number;
}>(key: any, rowData: T | Ref<T>): {
    get: () => Promise<T>;
    remove: () => Promise<void>;
    save: () => Promise<void>;
};
