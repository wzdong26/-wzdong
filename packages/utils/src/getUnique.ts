/**
 * @title getUnique
 * @author wzdong
 * @description 根据唯一 key 获取工厂函数创建的对象, 工厂函数包装器
 * @export function {@link getUnique}
 * @export function {@link getSingle}
 */

interface GetUniqueReturn<K, P extends any[], R> {
    (this: unknown, key: K, ...p: P): R;
    (this: unknown, key: K): R | undefined;
}
interface GetUnique {
    <K, P extends any[], R>(
        fn: (...p: P) => R,
        set: ((key: K, rst: R) => void) | undefined | null,
        controller: true
    ): GetUniqueReturn<K, P, R>;
    <K, P extends any[], R>(fn: (...p: P) => R, set?: ((key: K, rst: R) => void) | null, controller?: false): (
        this: unknown,
        key: K,
        ...p: P
    ) => R;
}
/**
 * getUnique
 * @param fn 创建对象的工厂函数
 * @param set 设置函数，为创建的对象添加唯一标识属性，默认不设置
 * @param controller 返回值控制 or 参数控制, 默认为 false 采用返回值控制，设为 true 则采用参数控制
 * ---
 * @return function (key: K, ...p: P) => R
 * @param key 唯一标识值, 建议用 symbol
 * @param p 工厂函数 fn 的原始入参
 * @return R 工厂函数 fn 返回的对象
 */
export const getUnique: GetUnique = <K, P extends any[], R>(
    fn: (...p: P) => R,
    set?: ((key: K, rst: R) => void) | null,
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

interface GetUniqueAsyncReturn<K, P extends any[], R> {
    (this: unknown, key: K, ...p: P): Promise<R>;
    (this: unknown, key: K): Promise<R | undefined>;
}
interface GetUniqueAsync {
    <K, P extends any[], R>(
        fn: (...p: P) => Promise<R>,
        set: ((key: K, rst: R) => void) | undefined | null,
        controller: true
    ): GetUniqueAsyncReturn<K, P, R>;
    <K, P extends any[], R>(fn: (...p: P) => Promise<R>, set?: ((key: K, rst: R) => void) | null, controller?: false): (
        this: unknown,
        key: K,
        ...p: P
    ) => Promise<R>;
}
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
export const getUniqueAsync: GetUniqueAsync = <K, P extends any[], R>(
    fn: (...p: P) => Promise<R>,
    set?: ((key: K, rst: R) => void) | null,
    controller?: boolean
) => {
    const results = new Map<K, R>();
    const promises = new Map<K, Promise<R> | null>();
    return async function <T = any>(this: T, key: K, ...p: P) {
        const rst = results.get(key);
        let pending = promises.get(key);

        if (controller && !p.length && !pending) return rst;
        if (!controller && rst != null) return rst;

        if (!pending) {
            pending = fn.apply(this, p);
            promises.set(key, pending);
        }
        const r = await pending;
        promises.set(key, null);
        set?.(key, r);
        results.set(key, r);
        return r;
    };
};

interface NewUnique {
    <K, P extends any[], R>(
        fn: new (...p: P) => R,
        set: ((key: K, rst: R) => void) | undefined | null,
        controller: true
    ): GetUniqueReturn<K, P, R>;
    <K, P extends any[], R>(fn: new (...p: P) => R, set?: ((key: K, rst: R) => void) | null, controller?: false): (
        this: unknown,
        key: K,
        ...p: P
    ) => R;
}
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
export const newUnique: NewUnique = (newFn, set, controller) =>
    getUnique((...p) => new newFn(...p), set, controller as any);

interface GetSingleReturn<P extends any[], R> {
    (this: unknown, ...p: P): R;
    (this: unknown): R | undefined;
}
interface GetSingle {
    <P extends any[], R>(fn: (...p: P) => R, controller: true): GetSingleReturn<P, R>;
    <P extends any[], R>(fn: (...p: P) => R, controller?: false): (this: unknown, ...p: P) => R;
}
/**
 * getSingle: 将需要 key 传入的 {@link getUnique} 生成的方法变为不需要 key的方法
 * @param fn 创建对象的工厂函数
 * @param controller 返回值控制 or 参数控制, 默认返回值控制
 * ---
 * @returns function (...p: P) => R
 * @param p 工厂函数 fn 的原始入参
 * @return R 工厂函数 fn 返回的对象
 */
export const getSingle: GetSingle = <P extends any[], R>(fn: (...p: P) => R, controller?: boolean) => {
    const key = Symbol();
    const uniFn = controller ? getUnique(fn, undefined, controller) : getUnique(fn, undefined);
    return function (this: unknown, ...p: P) {
        return uniFn.call(this, key, ...p);
    };
};

interface GetSingleAsyncReturn<P extends any[], R> {
    (this: unknown, ...p: P): Promise<R>;
    (this: unknown): Promise<R | undefined>;
}
interface GetSingleAsync {
    <P extends any[], R>(fn: (...p: P) => Promise<R>, controller: true): GetSingleAsyncReturn<P, R>;
    <P extends any[], R>(fn: (...p: P) => Promise<R>, controller?: false): (this: unknown, ...p: P) => Promise<R>;
}
/**
 * getSingleAsync: 将需要 key 传入的 {@link getUniqueAsync} 生成的方法变为不需要 key的方法
 * @param fn 创建对象的 Promise 函数
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @returns function (...p: P) => Promise<R | NonNullable<R>>
 * @param p Promise 函数 fn 的原始入参
 * @return R Promise 函数 fn 返回的对象
 */
export const getSingleAsync: GetSingleAsync = <P extends any[], R>(
    fn: (...p: P) => Promise<R>,
    controller?: boolean
) => {
    const key = Symbol();
    const uniFn = controller ? getUniqueAsync(fn, undefined, controller) : getUniqueAsync(fn, undefined);
    return async function (this: unknown, ...p: P) {
        return await uniFn.call(this, key, ...p);
    };
};

interface NewSingle {
    <P extends any[], R>(fn: new (...p: P) => R, controller: true): GetSingleReturn<P, R>;
    <P extends any[], R>(fn: new (...p: P) => R, controller?: false): (this: unknown, ...p: P) => R;
}
/**
 * newSingle: 将需要 key 传入的 {@link getUnique} 生成的方法变为不需要 key的方法
 * @param newFn 创建对象的构造函数
 * @param controller 返回值控制 or 参数控制, 默认 false 采用返回值控制, true 则采用参数控制
 * ---
 * @returns function (...p: P) => R
 * @param p 构造函数 newFn 的原始入参
 * @return R 构造函数 newFn 返回的对象
 */
export const newSingle: NewSingle = (newFn, controller) => getSingle((...p) => new newFn(...p), controller as any);
