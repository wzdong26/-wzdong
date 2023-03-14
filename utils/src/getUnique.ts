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
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @return function (key: K, ...p: P) => R
 * @param key 唯一标识值, 建议用 symbol
 * @param p 工厂函数 fn 的原始入参
 * @return R 工厂函数 fn 返回的对象
 */
export const getUnique = <K, P extends any[], R>(
    fn: (...p: P) => R,
    set?: (key: K, rst: R) => void,
    controller?: boolean
) => {
    const results = new Map<K, R>();
    return function (this: unknown, key: K, ...p: P) {
        const rst = results.get(key);
        if (controller && !p.length) return rst;
        if (!controller && rst != null) return rst;

        const r = fn.apply(this, p);
        set?.(key, r);
        results.set(key, r);
        return r;
    };
};

/**
 * getUniqueAsync
 * @param fn 创建对象的 Promise 函数
 * @param set 设置函数，为创建的对象添加唯一标识属性，默认不设置
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @returns function (key: K, ...p: P) => Promise<R | NonNullable<R>>
 * @param key 唯一标识值, 建议用 symbol
 * @param p Promise 函数 fn 的原始入参
 * @return R Promise 函数 fn 返回的对象
 */
export const getUniqueAsync = <K, P extends any[], R>(
    fn: (...p: P) => Promise<R>,
    set?: (key: K, rst: R) => void,
    controller?: boolean
) => {
    const results = new Map<K, R>();
    const pendings = new Map<K, Promise<R> | null>();
    return async function <T = any>(this: T, key: K, ...p: P) {
        const rst = results.get(key);
        if (controller && !p.length) return rst;
        if (!controller && rst != null) return rst;

        let pending = pendings.get(key);
        if (!pending) {
            pending = fn.apply(this, p);
            pendings.set(key, pending);
        }
        const r = await pending;
        pendings.set(key, null);
        set?.(key, r);
        results.set(key, r);
        return r;
    };
};

/**
 * newUnique
 * @param newFn 创建对象的构造函数
 * @param set 设置函数，为创建的对象添加唯一标识属性，默认不设置
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @returns function (key: K, ...p: P) => R
 * @param key 唯一标识值, 建议用 symbol
 * @param p 构造函数 newFn 的原始入参
 * @return R 构造函数 newFn 返回的对象
 */
export const newUnique = <K, P extends any[], R>(
    newFn: new (...p: P) => R,
    set?: (key: K, rst: R) => void,
    controller?: boolean
) => getUnique<K, P, R>((...p) => new newFn(...p), set, controller);

/**
 * getSingle: 将需要 key 传入的 {@link getUnique} 生成的方法变为不需要 key的方法
 * @param fn 创建对象的工厂函数
 * @param controller 返回值控制 or 参数控制, 默认返回值控制
 * ---
 * @returns function (...p: P) => R
 * @param p 工厂函数 fn 的原始入参
 * @return R 工厂函数 fn 返回的对象
 */
export const getSingle = <P extends any[], R>(fn: (...p: P) => R, controller?: boolean) => {
    const key = Symbol();
    const uniFn = getUnique(fn, undefined, controller);
    return function <T = any>(this: T, ...p: P) {
        return uniFn.apply(this, [key, ...p]);
    };
};

/**
 * getSingleAsync: 将需要 key 传入的 {@link getUniqueAsync} 生成的方法变为不需要 key的方法
 * @param fn 创建对象的 Promise 函数
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @returns function (...p: P) => Promise<R | NonNullable<R>>
 * @param p Promise 函数 fn 的原始入参
 * @return R Promise 函数 fn 返回的对象
 */
export const getSingleAsync = <P extends any[], R>(fn: (...p: P) => Promise<R>, controller?: boolean) => {
    const key = Symbol();
    const uniFn = getUniqueAsync(fn, undefined, controller);
    return async function <T = any>(this: T, ...p: P) {
        return await uniFn.apply(this, [key, ...p]);
    };
};

/**
 * newSingle: 将需要 key 传入的 {@link getUnique} 生成的方法变为不需要 key的方法
 * @param newFn 创建对象的构造函数
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @returns function (...p: P) => R
 * @param p 构造函数 newFn 的原始入参
 * @return R 构造函数 newFn 返回的对象
 */
export const newSingle = <P extends any[], R>(newFn: new (...p: P) => R, controller?: boolean) =>
    getSingle<P, R>((...p) => new newFn(...p), controller);
