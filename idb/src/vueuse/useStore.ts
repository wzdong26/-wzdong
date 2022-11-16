import { DbStoreInfo } from 'src/init/config';
import { onUnmounted, Ref, unref } from 'vue';

import initStore from '../init/initStore';

export default function useStore<T extends {}>(
    rowData: T | Ref<T>,
    key: any,
    storeInfo?: DbStoreInfo
) {
    const store = initStore<T>(key, storeInfo);

    const get = async () => await store.getData();

    const remove = async () =>
        await store.removeData().then(() => {
            console.log('remove success!');
        });

    const save = async () =>
        await store.setData(unref(rowData)).then(() => {
            console.log('save success!');
        });

    window.addEventListener('beforeunload', save);
    onUnmounted(() => {
        save();
        window.removeEventListener('beforeunload', save);
    });

    return { get, remove, save };
}
