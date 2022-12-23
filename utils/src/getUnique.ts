/**
 * @title getUnique
 * @author wzdong
 * @description 根据唯一 key 获取对象, 工厂函数包装器
 * @export function {@link getUnique}
 * @export function {@link getSingle}
 */

/**
 * setUni: 为 fn 工厂创建的对象添加字段, 以唯一标识该对象
 * @param fn 创建对象的工厂函数
 * @param set 设置函数，为创建的对象添加唯一标识属性，默认不设置
 * ---
 * @returns (key: K, ...p: P) => R
 * @param key 唯一标识值, 建议用 symbol
 * @param p 工厂函数 fn 的原始入参
 * @return rst 工厂函数 fn 返回的对象
 */
const setUni = <K extends symbol | string | number, P extends any[], R = any>(
    fn: (...p: P) => R,
    set?: (key: K, rst: R) => void
) => {
    return (key: K, ...p: P) => {
        const rst = fn(...p);
        set?.(key, rst);
        return rst;
    };
};

interface GetUniqueReturnFn<K extends symbol | string | number, P extends any[], R = any> {
    (key: K): R | undefined;
    (key: K, ...p: P): R;
}
/**
 * getUni: 根据唯一标识获取对应的对象，若在映射表中没有找到则创建
 * @param setFn 创建对象的工厂函数, 以 {@link setUni} return (key: K, ...p: P) => R 为标准
 * @param m Map 存储对象的 Map 映射表, key 为唯一标识, val 为对象本身
 * ---
 * @returns function {@link GetUniqueReturnFn}
 * @param key 唯一标识值, 建议用 symbol
 * @param p 工厂函数 fn 的原始入参
 * @return rst 工厂函数 fn 返回的对象
 */
const getUni = <K extends symbol | string | number, P extends any[], R = any>(setFn: (key: K, ...p: P) => R) => {
    const results = new Map<K, R>();
    return ((key: K, ...p: P) => {
        let rst = results.get(key);
        if (!p?.length) return rst;
        return (
            rst ??
            (() => {
                const r = setFn(key, ...p);
                results.set(key, r);
                return r;
            })()
        );
    }) as GetUniqueReturnFn<K, P, R>;
};

/**
 * getUnique: 基于 {@link setUni} and {@link getUni} 合并实现
 * @param fn 创建对象的工厂函数
 * @param set 设置函数，为创建的对象添加唯一标识属性，默认不设置
 * ---
 * @returns function {@link GetUniqueReturnFn}
 * @param key 唯一标识值, 建议用 symbol
 * @param p 工厂函数 fn 的原始入参
 * @return rst 工厂函数 fn 返回的对象
 */
export const getUnique = <K extends symbol | string | number, P extends any[], R = any>(
    fn: (...p: P) => R,
    set?: (key: K, rst: R) => void
) => getUni(setUni(fn, set));

interface GetSingleReturn<P extends any[], R> {
    (): R | undefined;
    (...p: P): R;
}
/**
 * getSingle: 将需要 key 传入的 {@link getUnique} 生成的方法变为不需要 key的方法
 * @param fn 创建对象的工厂函数
 * ---
 * @returns function {@link GetSingleReturn}
 */
export const getSingle = <P extends any[], R = any>(fn: (...p: P) => R) => {
    const key = Symbol();
    const uniFn = getUnique(fn);
    return ((...p: P) => uniFn(key, ...p)) as GetSingleReturn<P, R>;
};
