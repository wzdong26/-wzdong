/**
 * @title getUnique
 * @author wzdong
 * @description 根据唯一 key 获取工厂函数创建的对象, 工厂函数包装器
 * @export function {@link getUnique}
 * @export function {@link getSingle}
 */

/**
 * getUnique
 * @param fn 创建对象的工厂函数
 * @param set 设置函数，为创建的对象添加唯一标识属性，默认不设置
 * ---
 * @returns function (key: K, ...p: P) => R
 * @param key 唯一标识值, 建议用 symbol
 * @param p 工厂函数 fn 的原始入参
 * @return R 工厂函数 fn 返回的对象
 */
export const getUnique = <K extends any, P extends any[], R extends Exclude<any, undefined | null | void>>(
    fn: (...p: P) => R,
    set?: (key: K, rst: R) => void
) => {
    const results = new Map<K, R>();
    return function (this: any, key: K, ...p: P) {
        let rst = results.get(key);
        return (
            rst ??
            (() => {
                const r = fn.apply(this, p);
                set?.(key, r);
                results.set(key, r);
                return r;
            })()
        );
    };
};

/**
 * getSingle: 将需要 key 传入的 {@link getUnique} 生成的方法变为不需要 key的方法
 * @param fn 创建对象的工厂函数
 * ---
 * @returns function {@link GetSingleReturn}
 */
export const getSingle = <P extends any[], R extends Exclude<any, undefined | null | void>>(fn: (...p: P) => R) => {
    const key = Symbol();
    const uniFn = getUnique(fn);
    return function (this: any, ...p: P) {
        return uniFn.apply(this, [key, ...p]);
    };
};
